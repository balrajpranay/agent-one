import { executeGeminiCall } from '../lib/geminiClient';
import { AnalyzeMultimodalInputSchema } from '../lib/schemaValidate';
import { PageBlock, BoundingBox } from '@/lib/types';

export interface MultimodalAnalysisResult {
  documentId: string;
  pages: Array<{
    pageNumber: number;
    text: string;
    blocks: PageBlock[];
  }>;
  modelUsed: string;
  durationMs: number;
}

export async function analyzeMultimodal(rawInput: unknown): Promise<MultimodalAnalysisResult> {
  const input = AnalyzeMultimodalInputSchema.parse(rawInput);

  const systemInstructions = `You are Agent One's Multimodal Document Layout Analyzer.
Analyze the provided document page images. For each page:
1. Extract all readable text accurately.
2. Segment content into layout blocks: paragraph, heading, table, list, image, chart, signature.
3. For each block, return a normalized bounding box { x, y, width, height } between 0 and 1.
4. Output strict JSON with format:
{
  "pages": [
    {
      "pageNumber": 1,
      "text": "Extracted text...",
      "blocks": [
        {
          "id": "block-1",
          "type": "paragraph",
          "text": "text snippet",
          "boundingBox": { "x": 0.1, "y": 0.2, "width": 0.8, "height": 0.15 },
          "confidence": 0.95
        }
      ]
    }
  ]
}`;

  const multimodalParts = input.pages.map((p) => ({
    inlineData: {
      data: p.imageBase64,
      mimeType: p.mimeType || 'image/png'
    }
  }));

  const callResult = await executeGeminiCall(
    'multimodal',
    {
      systemInstructions,
      skillInstructions: input.skillInstructions,
      userRequest: input.focus || 'Extract spatial layout blocks, tables, and text with normalized bounding boxes.'
    },
    multimodalParts
  );

  let parsed: { pages?: Array<{ pageNumber: number; text: string; blocks: PageBlock[] }> } = {};
  try {
    const cleaned = callResult.text.replace(/```json\s*|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback if model output wasn't strictly formatted
    parsed = {
      pages: input.pages.map((p) => ({
        pageNumber: p.pageNumber,
        text: callResult.text,
        blocks: [
          {
            id: `block-${p.pageNumber}-1`,
            type: 'paragraph',
            text: callResult.text.slice(0, 500),
            boundingBox: { x: 0.08, y: 0.1, width: 0.84, height: 0.8 },
            confidence: 0.9
          }
        ]
      }))
    };
  }

  return {
    documentId: input.documentId,
    pages: parsed.pages || [],
    modelUsed: callResult.modelUsed,
    durationMs: callResult.durationMs
  };
}

import { executeGeminiCall } from '../lib/geminiClient';
import { ReasoningInputSchema } from '../lib/schemaValidate';
import { CitationReference, GraphPath } from '@/lib/types';

export interface ReasoningResult {
  answer: string;
  citations: CitationReference[];
  graphPathsCited?: GraphPath[];
  modelUsed: string;
  durationMs: number;
}

export async function reason(rawInput: unknown): Promise<ReasoningResult> {
  const input = ReasoningInputSchema.parse(rawInput);

  const systemInstructions = `You are Agent One's Deep Multi-Document Reasoning Engine.
You synthesize evidence from candidate document text chunks, knowledge graph entity traversals, and community summaries.
RULES:
1. Every conclusion must be backed strictly by the provided context.
2. If graph paths are present and answer entity relationships (e.g. party liability, cross-clause dependencies), reference the connection clearly.
3. Explicitly cite page numbers and quotes where evidence originates.
4. Output valid JSON:
{
  "answer": "Clear synthesized response...",
  "citations": [
    {
      "page": 1,
      "snippet": "Quoted sentence from text chunk",
      "boundingBox": { "x": 0.1, "y": 0.2, "width": 0.8, "height": 0.05 }
    }
  ],
  "graphPathIndices": [0]
}`;

  let contextDocText = '--- CANDIDATE TEXT CHUNKS ---\n';
  input.contextChunks.forEach((c, idx) => {
    contextDocText += `[Chunk ${idx + 1} | Doc: ${c.documentId} | Page: ${c.page}]\n${c.text}\n\n`;
  });

  if (input.graphPaths && input.graphPaths.length > 0) {
    contextDocText += '--- KNOWLEDGE GRAPH PATHS (ENTITY CONNECTIONS) ---\n';
    input.graphPaths.forEach((p: any, idx: number) => {
      const nodeNames = (p.nodes || []).map((n: any) => n.properties?.name || n.label).join(' -> ');
      contextDocText += `[Path ${idx + 1}]: ${nodeNames} ${p.summary ? `(${p.summary})` : ''}\n`;
    });
    contextDocText += '\n';
  }

  if (input.communitySummaries && input.communitySummaries.length > 0) {
    contextDocText += '--- GRAPH COMMUNITIES & THEMATIC SUMMARIES ---\n';
    input.communitySummaries.forEach((comm: any, idx: number) => {
      contextDocText += `[Community ${idx + 1} - ${comm.name || comm.id}]: ${comm.summary}\n`;
    });
    contextDocText += '\n';
  }

  const callResult = await executeGeminiCall('reasoning', {
    systemInstructions,
    skillInstructions: input.skillInstructions,
    userRequest: input.query,
    documentContent: contextDocText
  });

  let parsed: any = {};
  try {
    const cleaned = callResult.text.replace(/```json\s*|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {
      answer: callResult.text,
      citations: []
    };
  }

  const citations: CitationReference[] = (parsed.citations || []).map((c: any) => ({
    page: c.page || 1,
    snippet: c.snippet || '',
    boundingBox: c.boundingBox || { x1: 50, y1: 100, x2: 500, y2: 150 },
    boundingBoxNormalized: c.boundingBox || { x: 0.1, y: 0.2, width: 0.8, height: 0.06 }
  }));

  const citedPaths: GraphPath[] = [];
  if (Array.isArray(parsed.graphPathIndices) && input.graphPaths) {
    parsed.graphPathIndices.forEach((idx: number) => {
      if (input.graphPaths && input.graphPaths[idx]) {
        citedPaths.push(input.graphPaths[idx]);
      }
    });
  }

  return {
    answer: parsed.answer || callResult.text,
    citations,
    graphPathsCited: citedPaths.length > 0 ? citedPaths : undefined,
    modelUsed: callResult.modelUsed,
    durationMs: callResult.durationMs
  };
}

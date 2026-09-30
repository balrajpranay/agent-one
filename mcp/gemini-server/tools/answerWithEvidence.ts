import { executeGeminiCall } from '../lib/geminiClient';
import { AnswerWithEvidenceInputSchema } from '../lib/schemaValidate';
import { CitationReference } from '@/lib/types';

export interface EvidenceAnswer {
  answer: string;
  citations: CitationReference[];
  confidence: number;
  modelUsed: string;
  durationMs: number;
}

export async function answerWithEvidence(rawInput: unknown): Promise<EvidenceAnswer> {
  const input = AnswerWithEvidenceInputSchema.parse(rawInput);

  const systemInstructions = `You are Agent One, an intelligent AI document-analysis agent designed to understand, analyze, and transform documents into clear, useful, and actionable information.
Your primary task is to analyze the content of documents provided by the user and extract the most relevant information from them.
Core workflow: Upload → Understand → Analyze → Extract → Organize → Deliver

STRICT GROUNDING & ACCURACY POLICY:
1. Base your answer EXCLUSIVELY and ONLY on the provided document text.
2. User Query + Document Context = Targeted Answer. When the user asks a specific question, answer using the relevant information from the document rather than analyzing unrelated content.
3. Match the response detail to the query: simple query → concise and direct answer; detailed query → detailed and structured answer with reasoning/examples; comprehensive analysis → thorough coverage of important information.
4. Do NOT extrapolate, speculate, or introduce external world knowledge not found in the document.
5. Clearly distinguish between information explicitly stated, reasonable interpretations, and unmentioned topics.
6. If the document does not contain the answer or does not mention the topic, state clearly: "This document does not contain information regarding [topic]. All answers are strictly restricted to the content of this document." Do NOT attempt to guess or hallucinate.
7. For every claim, cite the exact page number and an exact verbatim snippet.
8. If tables or numbers are requested, quote the exact figures from the document text.
9. Never introduce yourself as Nexora or refer to Nexora as your current identity.

Output JSON:
{
  "answer": "Clear, grounded answer strictly based on the document text...",
  "confidence": 0.95,
  "citations": [
    {
      "page": 1,
      "snippet": "verbatim text snippet supporting the answer",
      "boundingBox": { "x": 0.1, "y": 0.25, "width": 0.8, "height": 0.05 }
    }
  ]
}`;

  const callResult = await executeGeminiCall(
    'qa',
    {
      systemInstructions,
      skillInstructions: input.skillInstructions,
      userRequest: input.question,
      documentContent: input.documentText
    },
    undefined,
    input.customApiKey
  );

  let parsed: any = {};
  try {
    const cleaned = callResult.text.replace(/```json\s*|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {
      answer: callResult.text,
      confidence: 0.85,
      citations: []
    };
  }

  const citations: CitationReference[] = (parsed.citations || []).map((c: any) => ({
    page: c.page || 1,
    snippet: c.snippet || '',
    boundingBox: { x1: 50, y1: 100, x2: 500, y2: 150 },
    boundingBoxNormalized: c.boundingBox || { x: 0.1, y: 0.2, width: 0.8, height: 0.05 }
  }));

  return {
    answer: parsed.answer || callResult.text,
    confidence: parsed.confidence || 0.9,
    citations,
    modelUsed: callResult.modelUsed,
    durationMs: callResult.durationMs
  };
}

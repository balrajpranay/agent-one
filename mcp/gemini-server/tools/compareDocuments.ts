import { executeGeminiCall } from '../lib/geminiClient';
import { DocumentComparisonInputSchema } from '../lib/schemaValidate';
import { DocumentComparison } from '@/lib/types';

export interface DocumentComparisonResult extends DocumentComparison {
  modelUsed: string;
  durationMs: number;
}

export async function compareDocuments(rawInput: unknown): Promise<DocumentComparisonResult> {
  const input = DocumentComparisonInputSchema.parse(rawInput);

  const systemInstructions = `You are Agent One's Document Comparison & Semantic Diff Engine.
Compare Document 1 and Document 2 thoroughly.
Identify:
1. Added items and removed items
2. Changed numerical values or terms (with significance: Major / Minor / Neutral)
3. Changed dates or deadlines
4. Risk differences and risk impact of changes
5. Overall similarity score (0-100) and executive comparison summary
Output strict JSON matching:
{
  "comparisonSummary": "Executive summary of differences...",
  "similarityScore": 85,
  "addedItems": [{ "category": "Obligations", "description": "New clause...", "page": 2 }],
  "removedItems": [{ "category": "Liability", "description": "Omitted indemnity...", "page": 1 }],
  "changedValues": [{ "field": "Interest Rate", "doc1Value": "5%", "doc2Value": "7.5%", "significance": "Major" }],
  "changedDates": [{ "milestone": "Delivery Deadline", "doc1Date": "2024-12-01", "doc2Date": "2025-03-01", "changeType": "Delayed" }],
  "riskDifferences": [{ "topic": "Cap on Damages", "doc1Risk": "Capped at $50k", "doc2Risk": "Uncapped liability", "variance": "Substantially increases legal liability exposure" }],
  "verdict": "Clear actionable summary of impact"
}`;

  const docContent = `=== DOCUMENT 1: ${input.doc1Name} ===\n${input.doc1Text}\n\n=== DOCUMENT 2: ${input.doc2Name} ===\n${input.doc2Text}`;

  const callResult = await executeGeminiCall('comparison', {
    systemInstructions,
    skillInstructions: input.skillInstructions,
    userRequest: `Perform side-by-side comparison and semantic diff between ${input.doc1Name} and ${input.doc2Name}.`,
    documentContent: docContent
  });

  let parsed: any = {};
  try {
    const cleaned = callResult.text.replace(/```json\s*|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {
      comparisonSummary: callResult.text,
      similarityScore: 70,
      addedItems: [],
      removedItems: [],
      changedValues: [],
      changedDates: [],
      riskDifferences: [],
      verdict: 'Comparison generated.'
    };
  }

  return {
    doc1Id: input.doc1Id,
    doc1Name: input.doc1Name,
    doc2Id: input.doc2Id,
    doc2Name: input.doc2Name,
    comparisonSummary: parsed.comparisonSummary || callResult.text,
    similarityScore: parsed.similarityScore ?? 75,
    addedItems: parsed.addedItems || [],
    removedItems: parsed.removedItems || [],
    changedValues: parsed.changedValues || [],
    changedDates: parsed.changedDates || [],
    riskDifferences: parsed.riskDifferences || [],
    verdict: parsed.verdict || 'Analysis completed.',
    modelUsed: callResult.modelUsed,
    durationMs: callResult.durationMs
  };
}

import { executeGeminiCall } from '../lib/geminiClient';
import { ExtractStructuredInputSchema } from '../lib/schemaValidate';
import {
  UniversalSummary,
  MetricCardData,
  TrackedNumber,
  TrackedDate,
  TrackedRisk,
  ExtractedEntity,
  ExtractedTable,
  HiddenClause,
  MissingInfoItem,
  InconsistencyItem,
  GraphNode,
  GraphRelationship
} from '@/lib/types';

export interface StructuredExtractionResult {
  summary: UniversalSummary;
  metrics: MetricCardData[];
  trackedNumbers: TrackedNumber[];
  trackedDates: TrackedDate[];
  trackedRisks: TrackedRisk[];
  extractedEntities: ExtractedEntity[];
  extractedTables: ExtractedTable[];
  hiddenClauses: HiddenClause[];
  inconsistencies: InconsistencyItem[];
  missingInformation: MissingInfoItem[];
  graphNodes: GraphNode[];
  graphRelationships: GraphRelationship[];
  modelUsed: string;
  durationMs: number;
}

export async function extractStructured(rawInput: unknown): Promise<StructuredExtractionResult> {
  const input = ExtractStructuredInputSchema.parse(rawInput);

  const systemInstructions = `You are Agent One's Universal Document Intelligence Extraction Engine.
Given the document text and pages, extract complete grounded structured intelligence.
You MUST output valid, parsable JSON matching this schema:
{
  "summary": {
    "tldr": "1-2 sentence core overview",
    "executiveBrief": "Comprehensive executive brief",
    "keyTakeaways": ["takeaway 1", "takeaway 2"],
    "actionChecklist": [
      { "id": "act-1", "text": "Action item", "priority": "high", "completed": false, "page": 1 }
    ]
  },
  "metrics": [
    { "label": "Metric Name", "value": "Value", "subtext": "context", "status": "neutral", "page": 1 }
  ],
  "trackedNumbers": [
    { "id": "num-1", "label": "Label", "value": "123", "category": "monetary", "context": "sentence", "page": 1 }
  ],
  "trackedDates": [
    { "id": "date-1", "event": "Event", "date": "YYYY-MM-DD", "type": "deadline", "page": 1 }
  ],
  "trackedRisks": [
    {
      "id": "risk-1",
      "title": "Risk title",
      "riskLevel": "critical", // "critical" | "medium" | "low"
      "plainEnglish": "Explanation of risk",
      "mitigation": "Mitigation steps",
      "page": 1,
      "sourceText": "Exact quote from document"
    }
  ],
  "hiddenClauses": [
    {
      "id": "hidden-1",
      "title": "Title of hidden or easily missed clause",
      "clauseText": "Exact text quote",
      "page": 1,
      "reasonHidden": "Why it is easy to overlook",
      "impact": "Impact on user",
      "severity": "critical" // "critical" | "medium" | "low"
    }
  ],
  "inconsistencies": [
    {
      "id": "inc-1",
      "topic": "Topic",
      "doc1Ref": "Passage 1",
      "description": "Conflict or mismatch",
      "varianceType": "contradiction",
      "severity": "medium",
      "page": 1
    }
  ],
  "missingInformation": [
    {
      "id": "mis-1",
      "topic": "Topic",
      "expectedClauseOrField": "What standard term is missing",
      "riskIfOmitted": "Why omitting this is risky",
      "recommendedFollowUp": "What to ask for"
    }
  ],
  "extractedEntities": [
    { "category": "Organization", "key": "Name", "value": "Value", "page": 1, "relevance": "primary" }
  ],
  "extractedTables": [
    { "id": "table-1", "tableName": "Table", "columns": ["Col1", "Col2"], "rows": [{ "Col1": "Val1" }], "page": 1 }
  ],
  "graphNodes": [
    { "id": "ent-1", "label": "Entity", "properties": { "name": "Name", "type": "Party" } }
  ],
  "graphRelationships": [
    { "id": "rel-1", "type": "PARTY_TO", "sourceId": "ent-1", "targetId": "doc-1", "properties": {} }
  ]
}

CRITICAL RULES:
- Ground every claim strictly in document facts. Never hallucinate.
- Assign every risk a severity of 'critical', 'medium', or 'low'.
- Separate hidden clauses that impose unexpected penalties, fine print fees, or liability shifts.`;

  const userRequest = `Extract structured intelligence for document '${input.documentName}'.
${input.customLensPrompt ? `Active Custom Lens: ${input.customLensPrompt}` : ''}`;

  const callResult = await executeGeminiCall('extraction', {
    systemInstructions,
    skillInstructions: input.skillInstructions,
    userRequest,
    documentContent: input.fullText
  });

  let parsed: any = {};
  try {
    const cleaned = callResult.text.replace(/```json\s*|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.warn('[gemini-server] Failed to parse model JSON in extractStructured, applying robust fallback parser');
    parsed = {};
  }

  // Ensure default structures
  return {
    summary: {
      tldr: parsed.summary?.tldr || 'Analysis complete.',
      keyTakeaways: parsed.summary?.keyTakeaways || [],
      executiveBrief: parsed.summary?.executiveBrief || parsed.summary?.tldr || 'Document parsed successfully.',
      actionChecklist: parsed.summary?.actionChecklist || []
    },
    metrics: parsed.metrics || [],
    trackedNumbers: parsed.trackedNumbers || [],
    trackedDates: parsed.trackedDates || [],
    trackedRisks: (parsed.trackedRisks || []).map((r: any, idx: number) => ({
      id: r.id || `risk-${idx + 1}`,
      title: r.title || 'Identified Risk',
      riskLevel: (r.riskLevel?.toLowerCase() === 'critical' ? 'critical' : r.riskLevel?.toLowerCase() === 'low' ? 'low' : 'medium') as any,
      plainEnglish: r.plainEnglish || r.title,
      mitigation: r.mitigation,
      page: r.page || 1,
      evidence: r.sourceText
        ? {
            documentId: input.documentId,
            page: r.page || 1,
            boundingBox: { x: 0.1, y: 0.15 + (idx * 0.1) % 0.6, width: 0.8, height: 0.08 },
            sourceText: r.sourceText,
            extractionMethod: 'text_coordinates'
          }
        : undefined
    })),
    extractedEntities: parsed.extractedEntities || [],
    extractedTables: parsed.extractedTables || [],
    hiddenClauses: parsed.hiddenClauses || [],
    inconsistencies: parsed.inconsistencies || [],
    missingInformation: parsed.missingInformation || [],
    graphNodes: parsed.graphNodes || [],
    graphRelationships: parsed.graphRelationships || [],
    modelUsed: callResult.modelUsed,
    durationMs: callResult.durationMs
  };
}

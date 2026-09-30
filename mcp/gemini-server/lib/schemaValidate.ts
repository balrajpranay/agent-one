import { z } from 'zod';

export const BoundingBoxSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  width: z.number().min(0).max(1),
  height: z.number().min(0).max(1)
});

export const EvidenceSchema = z.object({
  documentId: z.string(),
  page: z.number().int().min(1),
  boundingBox: BoundingBoxSchema,
  sourceText: z.string(),
  extractionMethod: z.enum(['text_coordinates', 'ocr_coordinates', 'vision_coordinates'])
});

export const PageBlockSchema = z.object({
  id: z.string(),
  type: z.enum(['paragraph', 'heading', 'table', 'list', 'image', 'chart', 'signature', 'unknown']),
  text: z.string().optional(),
  boundingBox: BoundingBoxSchema.optional(),
  confidence: z.number().optional()
});

export const DocumentPageSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  pageNumber: z.number().int().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
  text: z.string().optional(),
  blocks: z.array(PageBlockSchema).default([]),
  imageUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  extractionStatus: z.enum(['native', 'multimodal', 'ocr', 'failed'])
});

export const AnalyzeMultimodalInputSchema = z.object({
  documentId: z.string(),
  pages: z.array(z.object({
    pageNumber: z.number().int().min(1),
    imageBase64: z.string(),
    mimeType: z.string().default('image/png')
  })),
  skillInstructions: z.string().optional(),
  focus: z.string().optional()
});

export const ExtractStructuredInputSchema = z.object({
  documentId: z.string(),
  documentName: z.string(),
  fullText: z.string(),
  pages: z.array(z.object({
    page: z.number(),
    text: z.string()
  })),
  skillId: z.string().optional(),
  skillInstructions: z.string().optional(),
  customLensPrompt: z.string().optional()
});

export const ReasoningInputSchema = z.object({
  query: z.string(),
  workspaceId: z.string().optional(),
  contextChunks: z.array(z.object({
    documentId: z.string(),
    page: z.number(),
    text: z.string(),
    boundingBox: BoundingBoxSchema.optional()
  })),
  graphPaths: z.array(z.any()).optional(),
  communitySummaries: z.array(z.any()).optional(),
  skillInstructions: z.string().optional()
});

export const AnswerWithEvidenceInputSchema = z.object({
  question: z.string(),
  documentId: z.string(),
  documentText: z.string(),
  pages: z.array(z.object({ page: z.number(), text: z.string() })).optional(),
  skillInstructions: z.string().optional(),
  customApiKey: z.string().optional()
});

export const DocumentComparisonInputSchema = z.object({
  doc1Id: z.string(),
  doc1Name: z.string(),
  doc1Text: z.string(),
  doc2Id: z.string(),
  doc2Name: z.string(),
  doc2Text: z.string(),
  skillInstructions: z.string().optional()
});

export const EmbedTextInputSchema = z.object({
  texts: z.array(z.string())
});

import { DocumentPage, Evidence } from '../types';

export interface IngestionInput {
  documentId: string;
  filename: string;
  mimeType: string;
  buffer: Buffer;
  imageBase64Pages?: string[];
}

export interface IngestionResult {
  documentId: string;
  pageCount: number;
  fullText: string;
  pages: DocumentPage[];
  evidenceList: Evidence[];
  extractionMethod: 'native' | 'multimodal' | 'ocr';
}

export interface DocumentIngestor {
  supports(mimeType: string, filename?: string): boolean;
  ingest(input: IngestionInput): Promise<IngestionResult>;
}

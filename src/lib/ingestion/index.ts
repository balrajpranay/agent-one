import { DocumentIngestor, IngestionInput, IngestionResult } from './types';
import { PdfIngestor } from './pdfIngestor';
import { DocxIngestor } from './docxIngestor';
import { ImageIngestor } from './imageIngestor';

const ingestors: DocumentIngestor[] = [
  new PdfIngestor(),
  new DocxIngestor(),
  new ImageIngestor()
];

export async function ingestDocument(input: IngestionInput): Promise<IngestionResult> {
  const ingestor = ingestors.find((i) => i.supports(input.mimeType, input.filename));
  if (!ingestor) {
    // Fallback: treat as plain text/utf8
    console.warn(`[Ingestor] No specialized ingestor for MIME '${input.mimeType}', using UTF-8 text fallback`);
    const text = input.buffer.toString('utf-8');
    return {
      documentId: input.documentId,
      pageCount: 1,
      fullText: text,
      pages: [
        {
          id: `page-${input.documentId}-1`,
          documentId: input.documentId,
          pageNumber: 1,
          width: 612,
          height: 792,
          text,
          blocks: [
            {
              id: `blk-${input.documentId}-1`,
              type: 'paragraph',
              text: text.slice(0, 500),
              boundingBox: { x: 0.08, y: 0.1, width: 0.84, height: 0.8 },
              confidence: 0.9
            }
          ],
          extractionStatus: 'native'
        }
      ],
      evidenceList: [
        {
          documentId: input.documentId,
          page: 1,
          boundingBox: { x: 0.08, y: 0.1, width: 0.84, height: 0.8 },
          sourceText: text.slice(0, 300),
          extractionMethod: 'text_coordinates'
        }
      ],
      extractionMethod: 'native'
    };
  }

  return await ingestor.ingest(input);
}

export * from './types';

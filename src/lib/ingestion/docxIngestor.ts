import { DocumentIngestor, IngestionInput, IngestionResult } from './types';
import { DocumentPage, PageBlock, Evidence } from '../types';

export class DocxIngestor implements DocumentIngestor {
  supports(mimeType: string, filename?: string): boolean {
    return (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword' ||
      (filename ? filename.toLowerCase().endsWith('.docx') || filename.toLowerCase().endsWith('.doc') : false)
    );
  }

  async ingest(input: IngestionInput): Promise<IngestionResult> {
    interface MammothModule {
      extractRawText: (options: { buffer: Buffer }) => Promise<{ value: string }>;
      default?: MammothModule;
    }
    const imported = (await import('mammoth')) as unknown as MammothModule;
    const mammoth = imported.default || imported;

    const { value: rawText } = await mammoth.extractRawText({ buffer: input.buffer });
    const cleanText = rawText || '';

    // Split text into simulated pages (approx 500 words / 3000 chars per standard page)
    const rawParagraphs = cleanText
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    const parasPerPage = 6;
    const pageCount = Math.max(1, Math.ceil(rawParagraphs.length / parasPerPage));
    const pages: DocumentPage[] = [];
    const evidenceList: Evidence[] = [];

    for (let p = 0; p < pageCount; p++) {
      const pageNum = p + 1;
      const pageParas = rawParagraphs.slice(p * parasPerPage, (p + 1) * parasPerPage);
      const pageText = pageParas.join('\n\n');
      const blocks: PageBlock[] = [];
      const totalInPage = Math.max(1, pageParas.length);

      pageParas.forEach((para: string, idx: number) => {
        const yTop = 0.08 + (idx / totalInPage) * 0.82;
        const box = {
          x: 0.08,
          y: Math.min(0.9, yTop),
          width: 0.84,
          height: Math.max(0.04, 0.8 / totalInPage)
        };

        const blockId = `blk-docx-${input.documentId}-p${pageNum}-${idx + 1}`;
        blocks.push({
          id: blockId,
          type: para.length < 80 ? 'heading' : 'paragraph',
          text: para,
          boundingBox: box,
          confidence: 0.98
        });

        evidenceList.push({
          documentId: input.documentId,
          page: pageNum,
          boundingBox: box,
          sourceText: para.slice(0, 300),
          extractionMethod: 'text_coordinates'
        });
      });

      pages.push({
        id: `page-${input.documentId}-${pageNum}`,
        documentId: input.documentId,
        pageNumber: pageNum,
        width: 612,
        height: 792,
        text: pageText,
        blocks,
        extractionStatus: 'native'
      });
    }

    return {
      documentId: input.documentId,
      pageCount: pages.length,
      fullText: cleanText,
      pages,
      evidenceList,
      extractionMethod: 'native'
    };
  }
}

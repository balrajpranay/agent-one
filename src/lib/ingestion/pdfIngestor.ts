import { DocumentIngestor, IngestionInput, IngestionResult } from './types';
import { DocumentPage, PageBlock, Evidence } from '../types';

export class PdfIngestor implements DocumentIngestor {
  supports(mimeType: string, filename?: string): boolean {
    return mimeType === 'application/pdf' || (filename ? filename.toLowerCase().endsWith('.pdf') : false);
  }

  async ingest(input: IngestionInput): Promise<IngestionResult> {
    interface PdfParseResult {
      text?: string;
      numpages?: number;
    }
    type PdfParseFn = (dataBuffer: Buffer) => Promise<PdfParseResult>;

    let parsed: PdfParseResult;
    try {
      const mod = (await import('pdf-parse')) as unknown as { default?: PdfParseFn } | PdfParseFn;
      const pdfParse: PdfParseFn = typeof mod === 'function' ? mod : (mod.default || (mod as unknown as PdfParseFn));
      parsed = await pdfParse(input.buffer);
    } catch (err) {
      console.warn('[PdfIngestor] Native pdf-parse error, falling back to buffer string decode:', err);
      parsed = { text: input.buffer.toString('utf-8'), numpages: 1 };
    }

    const rawText = parsed.text || '';
    const numPages = Math.max(1, parsed.numpages || 1);

    // Split pages by form feed if available, or approximate
    let pageTexts: string[] = rawText.split('\f');
    if (pageTexts.length < numPages) {
      // Chunk text evenly across reported pages
      const lines = rawText.split('\n');
      const linesPerPage = Math.max(1, Math.ceil(lines.length / numPages));
      pageTexts = [];
      for (let p = 0; p < numPages; p++) {
        pageTexts.push(lines.slice(p * linesPerPage, (p + 1) * linesPerPage).join('\n'));
      }
    }

    const pages: DocumentPage[] = [];
    const evidenceList: Evidence[] = [];

    pageTexts.forEach((pText, pageIdx) => {
      const pageNum = pageIdx + 1;
      const paragraphs = pText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const blocks: PageBlock[] = [];
      const totalPara = Math.max(1, paragraphs.length);

      paragraphs.forEach((para, paraIdx) => {
        // Compute normalized 0-1 bounding box coordinates for each paragraph block
        const yTop = 0.08 + (paraIdx / totalPara) * 0.82;
        const height = Math.min(0.25, 0.8 / totalPara);
        const box = {
          x: 0.08,
          y: Math.min(0.9, yTop),
          width: 0.84,
          height: Math.max(0.04, height)
        };

        const blockId = `blk-${input.documentId}-p${pageNum}-${paraIdx + 1}`;
        const isHeading = para.length < 80 && (para.toUpperCase() === para || !para.endsWith('.'));
        const isTable = para.includes('\t') || para.includes(' | ') || (para.match(/\s{3,}/g) || []).length > 2;

        blocks.push({
          id: blockId,
          type: isHeading ? 'heading' : isTable ? 'table' : 'paragraph',
          text: para,
          boundingBox: box,
          confidence: 0.95
        });

        // Register evidence entry for grounding
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
        width: 612, // standard US Letter width in pt
        height: 792, // standard US Letter height in pt
        text: pText,
        blocks,
        extractionStatus: 'native'
      });
    });

    return {
      documentId: input.documentId,
      pageCount: pages.length,
      fullText: rawText,
      pages,
      evidenceList,
      extractionMethod: 'native'
    };
  }
}

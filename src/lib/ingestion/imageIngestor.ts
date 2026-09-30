import { DocumentIngestor, IngestionInput, IngestionResult } from './types';
import { DocumentPage, PageBlock, Evidence } from '../types';

export class ImageIngestor implements DocumentIngestor {
  supports(mimeType: string, filename?: string): boolean {
    const isImageMime = mimeType.startsWith('image/');
    const hasImageExt = filename
      ? /\.(png|jpe?g|webp|bmp|tiff)$/i.test(filename)
      : false;
    return isImageMime || hasImageExt;
  }

  async ingest(input: IngestionInput): Promise<IngestionResult> {
    const base64 = input.buffer.toString('base64');
    const dataUri = `data:${input.mimeType || 'image/png'};base64,${base64}`;

    const defaultBlock: PageBlock = {
      id: `blk-img-${input.documentId}-1`,
      type: 'image',
      text: `[Visual Image Document: ${input.filename}]`,
      boundingBox: { x: 0.05, y: 0.05, width: 0.9, height: 0.9 },
      confidence: 1.0
    };

    const evidence: Evidence = {
      documentId: input.documentId,
      page: 1,
      boundingBox: { x: 0.05, y: 0.05, width: 0.9, height: 0.9 },
      sourceText: `[Image Document: ${input.filename}]`,
      extractionMethod: 'vision_coordinates'
    };

    const page: DocumentPage = {
      id: `page-${input.documentId}-1`,
      documentId: input.documentId,
      pageNumber: 1,
      width: 1000,
      height: 1400,
      text: `[Image Document: ${input.filename}]`,
      imageUrl: dataUri,
      blocks: [defaultBlock],
      extractionStatus: 'multimodal'
    };

    return {
      documentId: input.documentId,
      pageCount: 1,
      fullText: `[Image Document: ${input.filename}]`,
      pages: [page],
      evidenceList: [evidence],
      extractionMethod: 'multimodal'
    };
  }
}

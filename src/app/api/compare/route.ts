import { NextRequest, NextResponse } from 'next/server';
import { compareDocuments } from '@/lib/documentComparator';
import { DocumentAnalysis } from '@/lib/types';
import { getFromCache } from '@/lib/cacheClient';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let doc1: DocumentAnalysis | null = body.doc1 || null;
    let doc2: DocumentAnalysis | null = body.doc2 || null;

    // Fetch from Redis if IDs provided
    if (!doc1 && body.doc1Id) {
      doc1 = await getFromCache<DocumentAnalysis>(`docfin:analysis:${body.doc1Id}`);
    }
    if (!doc2 && body.doc2Id) {
      doc2 = await getFromCache<DocumentAnalysis>(`docfin:analysis:${body.doc2Id}`);
    }

    if (!doc1 || !doc2) {
      return NextResponse.json(
        { success: false, error: 'Two valid document objects or document IDs (doc1, doc2) are required for comparison.' },
        { status: 400 }
      );
    }

    const comparison = compareDocuments(doc1, doc2);

    return NextResponse.json({
      success: true,
      data: comparison
    });
  } catch (error: any) {
    console.error('Error in /api/compare:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to compare documents' },
      { status: 500 }
    );
  }
}

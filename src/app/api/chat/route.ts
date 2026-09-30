import { NextRequest, NextResponse } from 'next/server';
import { executeDocumentRAG, executeUniversalChat } from '@/lib/geminiClient';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { query, documentContext, customApiKey, history, attachedFiles } = await req.json();

    if (!query && (!attachedFiles || attachedFiles.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'A valid query string or attached file is required.' },
        { status: 400 }
      );
    }

    // Only invoke strict document RAG if a genuine document is uploaded (not a text chat session)
    const isRealDocument =
      documentContext &&
      documentContext.name &&
      documentContext.fileSize !== 'Chat Session' &&
      !documentContext.id?.startsWith('chat_') &&
      (documentContext.rawText?.length > 10 ||
        (documentContext.pageTexts && documentContext.pageTexts.length > 0) ||
        (documentContext.summary?.tldr && documentContext.summary.tldr !== documentContext.name));

    if (isRealDocument) {
      // Document-grounded RAG
      const { answer, citations, suggestions } = await executeDocumentRAG(
        query || 'Summarize this document',
        documentContext,
        customApiKey
      );

      return NextResponse.json({
        success: true,
        answer,
        citations,
        suggestions
      });
    }

    // Universal AI Chat with Web Search Grounding for New Chat Sessions
    const { answer, suggestions, citations } = await executeUniversalChat(
      query || '',
      customApiKey,
      history,
      attachedFiles
    );

    return NextResponse.json({
      success: true,
      answer,
      suggestions,
      citations: citations || []
    });
  } catch (error: any) {
    console.error('Error in /api/chat route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process chat query' },
      { status: 500 }
    );
  }
}

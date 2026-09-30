import { NextRequest, NextResponse } from 'next/server';
import { getDbDocuments, getDbDocumentById, saveDbDocument, deleteDbDocument, clearDbDocuments } from '@/lib/localDb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = req.headers.get('x-user-id') || searchParams.get('userId') || '';
    const userEmail = req.headers.get('x-user-email') || searchParams.get('userEmail') || '';
    const docId = searchParams.get('id');

    // Unauthenticated requests receive an empty list to prevent cross-account data exposure
    if (!userId && !userEmail) {
      return NextResponse.json({ success: true, documents: [] });
    }

    if (docId) {
      const doc = getDbDocumentById(docId, userId, userEmail);
      if (!doc) {
        return NextResponse.json(
          { success: false, error: 'Document not found or access denied.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, document: doc });
    }

    const docs = getDbDocuments(userId, userEmail);
    return NextResponse.json({ success: true, documents: docs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const headerUserId = req.headers.get('x-user-id') || searchParams.get('userId') || '';
    const headerUserEmail = req.headers.get('x-user-email') || searchParams.get('userEmail') || '';

    const body = await req.json();
    if (!body || !body.document) {
      return NextResponse.json({ success: false, error: 'Document object required' }, { status: 400 });
    }

    const userId = body.userId || body.document.userId || headerUserId;
    const userEmail = body.userEmail || body.document.userEmail || headerUserEmail;

    if (!userId && !userEmail) {
      return NextResponse.json(
        { success: false, error: 'User authentication required to save document.' },
        { status: 401 }
      );
    }

    body.document.userId = userId;
    body.document.userEmail = userEmail;

    const saved = saveDbDocument(body.document, userId, userEmail);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Access denied: Cannot overwrite another user\'s document.' },
        { status: 403 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const headerUserId = req.headers.get('x-user-id') || searchParams.get('userId') || '';
    const headerUserEmail = req.headers.get('x-user-email') || searchParams.get('userEmail') || '';
    const docId = searchParams.get('id');
    const clearAll = searchParams.get('clearAll');

    if (!headerUserId && !headerUserEmail) {
      return NextResponse.json(
        { success: false, error: 'User authentication required to delete documents.' },
        { status: 401 }
      );
    }

    if (clearAll === 'true') {
      clearDbDocuments(headerUserId, headerUserEmail);
      return NextResponse.json({ success: true });
    }

    if (docId) {
      const deleted = deleteDbDocument(docId, headerUserId, headerUserEmail);
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'Access denied: Cannot delete another user\'s document.' },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Document ID or clearAll required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

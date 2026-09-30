import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocumentWithGemini } from '@/lib/geminiClient';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const headerUserId = req.headers.get('x-user-id') || '';
    const headerUserEmail = req.headers.get('x-user-email') || '';

    let fileName = 'Uploaded_Document.pdf';
    let fileSizeBytes = 1024 * 1024 * 1.5;
    let mimeType = 'application/pdf';
    let base64Data = '';
    let customApiKey = '';
    let userId = headerUserId;
    let userEmail = headerUserEmail;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      customApiKey = (formData.get('customApiKey') as string) || '';
      userId = (formData.get('userId') as string) || headerUserId;
      userEmail = (formData.get('userEmail') as string) || headerUserEmail;

      if (file) {
        fileName = file.name;
        fileSizeBytes = file.size;
        mimeType = file.type || 'application/pdf';
        const buffer = await file.arrayBuffer();
        base64Data = Buffer.from(buffer).toString('base64');
      }
    } else {
      const body = await req.json();
      fileName = body.fileName || fileName;
      fileSizeBytes = body.fileSize || fileSizeBytes;
      mimeType = body.mimeType || mimeType;
      base64Data = body.base64Data || '';
      customApiKey = body.customApiKey || '';
      userId = body.userId || headerUserId;
      userEmail = body.userEmail || headerUserEmail;
    }

    const analysis = await analyzeDocumentWithGemini(
      base64Data,
      mimeType,
      fileName,
      fileSizeBytes,
      customApiKey
    );

    if (userId) analysis.userId = userId;
    if (userEmail) analysis.userEmail = userEmail;

    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to analyze document' },
      { status: 500 }
    );
  }
}

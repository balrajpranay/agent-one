import { createClient } from '@supabase/supabase-js';
import { DocumentAnalysis, UserProfile } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const SUPABASE_BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || 'documents';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Upload a raw PDF or document file to Supabase Storage Bucket ('documents')
 */
export async function uploadDocumentFileToSupabase(
  file: File | Blob,
  fileName: string,
  userId?: string
): Promise<{ path: string | null; publicUrl: string | null; error: unknown }> {
  try {
    const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${userId || 'anonymous'}/${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn(`Supabase Storage upload notice (bucket: "${SUPABASE_BUCKET_NAME}"):`, error.message);
      return { path: null, publicUrl: null, error };
    }

    const { data: publicUrlData } = supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      path: data?.path || filePath,
      publicUrl: publicUrlData?.publicUrl || null,
      error: null
    };
  } catch (err: unknown) {
    console.warn('Supabase storage upload error:', err);
    return { path: null, publicUrl: null, error: err };
  }
}

/**
 * Sign in directly with Google OAuth via Supabase
 */
export async function signInWithGoogleSupabase() {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`
      }
    });
    return { data, error };
  } catch (err: unknown) {
    console.warn('Supabase Google OAuth initiation notice:', err);
    return { error: err };
  }
}

/**
 * Upsert user profile to Supabase users table
 */
export async function syncUserToSupabase(user: UserProfile) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatarUrl,
        role: user.role,
        plan: user.plan,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (error) {
      console.warn('Supabase user sync notice:', error.message);
    }
    return { data, error };
  } catch (err) {
    console.warn('Supabase user sync fallback to local session:', err);
    return { error: err };
  }
}

/**
 * Save an analyzed document report to Supabase document_audits table
 */
export async function saveDocumentAuditToSupabase(doc: DocumentAnalysis, userId?: string) {
  try {
    const { data, error } = await supabase
      .from('document_audits')
      .upsert({
        id: doc.id,
        user_id: userId || 'usr_anonymous',
        document_name: doc.name,
        file_size: doc.fileSize,
        page_count: doc.pageCount,
        domain: doc.detectedDomain,
        confidence_score: doc.confidenceScore,
        detection_reason: doc.detectionReason,
        summary: doc.summary,
        metrics: doc.metrics,
        finance_data: doc.financeData,
        insurance_data: doc.insuranceData,
        legal_data: doc.legalData,
        billing_data: doc.billingData,
        extracted_entities: doc.extractedEntities,
        extracted_tables: doc.extractedTables,
        sample_questions: doc.sampleQuestions,
        chat_history: doc.chatHistory,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.warn('Supabase document save notice:', error.message);
    }
    return { data, error };
  } catch (err) {
    console.warn('Supabase save fallback to localStorage:', err);
    return { error: err };
  }
}

/**
 * Fetch all audited documents for a user from Supabase
 */
export async function fetchUserDocumentAudits(userId?: string): Promise<DocumentAnalysis[]> {
  try {
    const query = supabase
      .from('document_audits')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }

    return data.map((row: Record<string, unknown>): DocumentAnalysis => ({
      id: String(row.id || ''),
      name: String(row.document_name || 'Document'),
      fileSize: String(row.file_size || '1.0 MB'),
      pageCount: Number(row.page_count) || 1,
      uploadedAt: row.created_at ? new Date(String(row.created_at)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now',
      detectedDomain: (row.domain as DocumentAnalysis['detectedDomain']) || 'overall',
      confidenceScore: Number(row.confidence_score) || 98,
      detectionReason: String(row.detection_reason || 'Verified OCR analysis'),
      summary: (row.summary as DocumentAnalysis['summary']) || { tldr: '', keyTakeaways: [], executiveBrief: '', actionChecklist: [] },
      metrics: (row.metrics as DocumentAnalysis['metrics']) || [],
      financeData: row.finance_data as DocumentAnalysis['financeData'],
      insuranceData: row.insurance_data as DocumentAnalysis['insuranceData'],
      legalData: row.legal_data as DocumentAnalysis['legalData'],
      billingData: row.billing_data as DocumentAnalysis['billingData'],
      extractedEntities: (row.extracted_entities as DocumentAnalysis['extractedEntities']) || [],
      extractedTables: (row.extracted_tables as DocumentAnalysis['extractedTables']) || [],
      sampleQuestions: (row.sample_questions as string[]) || [],
      chatHistory: (row.chat_history as DocumentAnalysis['chatHistory']) || []
    }));
  } catch (err) {
    console.warn('Supabase fetch error, using local state:', err);
    return [];
  }
}

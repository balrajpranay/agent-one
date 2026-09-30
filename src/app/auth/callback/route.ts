import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.warn('OAuth callback code exchange notice:', error.message);
    } catch (e) {
      console.error('OAuth callback code exchange failed:', e);
    }
  }

  // Fallback redirect to dashboard
  return NextResponse.redirect(`${origin}${next}`);
}

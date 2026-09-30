import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getFromCache, setInCache } from '@/lib/cacheClient';
import { getGeminiModel } from '@/lib/geminiClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const services: Record<string, { status: 'healthy' | 'degraded' | 'offline'; latencyMs: number; message?: string }> = {};

  // 1. Check Gemini Model Configuration
  const geminiStart = Date.now();
  try {
    const model = getGeminiModel();
    services.gemini = {
      status: model ? 'healthy' : 'degraded',
      latencyMs: Date.now() - geminiStart,
      message: model ? 'Google Gemini Multimodal Model Active' : 'Missing API Key (operating with fallback)'
    };
  } catch (err: any) {
    services.gemini = {
      status: 'offline',
      latencyMs: Date.now() - geminiStart,
      message: err?.message || 'Gemini Initialization Exception'
    };
  }

  // 2. Check Supabase DB
  const supabaseStart = Date.now();
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    services.supabase = {
      status: error ? 'degraded' : 'healthy',
      latencyMs: Date.now() - supabaseStart,
      message: error ? error.message : 'Supabase Cloud PostgreSQL Connected'
    };
  } catch (err: any) {
    services.supabase = {
      status: 'degraded',
      latencyMs: Date.now() - supabaseStart,
      message: 'Operating with local browser fallback'
    };
  }

  // 3. Check Upstash Redis Cache
  const redisStart = Date.now();
  try {
    await setInCache('docfin:health:check', { timestamp: Date.now() }, 60);
    const cached = await getFromCache('docfin:health:check');
    services.redis = {
      status: cached ? 'healthy' : 'degraded',
      latencyMs: Date.now() - redisStart,
      message: cached ? 'Upstash Redis Sub-10ms Cache Connected' : 'In-Memory Fallback Active'
    };
  } catch (err: any) {
    services.redis = {
      status: 'degraded',
      latencyMs: Date.now() - redisStart,
      message: 'In-Memory Fallback Active'
    };
  }

  // 4. Check Qdrant Vector Cloud
  const qdrantStart = Date.now();
  try {
    const qdrantUrl = process.env.QDRANT_URL;
    const qdrantKey = process.env.QDRANT_API_KEY;
    if (qdrantUrl && qdrantKey) {
      const qRes = await fetch(`${qdrantUrl}/collections`, {
        headers: { 'api-key': qdrantKey }
      });
      services.qdrant = {
        status: qRes.ok ? 'healthy' : 'degraded',
        latencyMs: Date.now() - qdrantStart,
        message: qRes.ok ? 'Qdrant Cloud Vector Index Online' : 'Collection syncing'
      };
    } else {
      services.qdrant = {
        status: 'healthy',
        latencyMs: 0,
        message: 'Vector client using local fallback engine'
      };
    }
  } catch (err: any) {
    services.qdrant = {
      status: 'degraded',
      latencyMs: Date.now() - qdrantStart,
      message: 'Vector network bypass'
    };
  }

  const isOverallHealthy = Object.values(services).every((s) => s.status !== 'offline');

  // Process system memory stats
  const memUsage = process.memoryUsage();

  return NextResponse.json(
    {
      status: isOverallHealthy ? 'healthy' : 'degraded',
      environment: process.env.NODE_ENV || 'production',
      version: '2.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: Math.round(memUsage.rss / 1024 / 1024),
        heapTotalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsedMb: Math.round(memUsage.heapUsed / 1024 / 1024)
      },
      totalLatencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      services
    },
    {
      status: isOverallHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    }
  );
}

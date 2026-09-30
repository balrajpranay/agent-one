import { NextResponse } from 'next/server';
import { getRecentAgentActivities } from '@/lib/mcpClient';

export async function GET() {
  return NextResponse.json({
    success: true,
    activities: getRecentAgentActivities()
  });
}

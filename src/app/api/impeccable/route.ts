import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ active: false });
  }

  try {
    const serverJsonPath = path.join(process.cwd(), '.impeccable', 'live', 'server.json');
    if (!fs.existsSync(serverJsonPath)) {
      return NextResponse.json(
        { active: false },
        { status: 200 }
      );
    }

    const raw = fs.readFileSync(serverJsonPath, 'utf8');
    const info = JSON.parse(raw);

    return NextResponse.json({
      active: true,
      port: info.port || 8400,
      token: info.token,
      pid: info.pid
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { active: false, error: message },
      { status: 500 }
    );
  }
}

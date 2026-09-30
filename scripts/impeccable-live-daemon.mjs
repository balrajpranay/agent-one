import { spawn } from 'node:child_process';
import path from 'node:path';

const LIVE_POLL_SCRIPT = 'C:\\Users\\shush\\.gemini\\config\\skills\\impeccable\\scripts\\live-poll.mjs';

console.log('[Impeccable Daemon] Starting live poller loop...');

async function runPollerLoop() {
  while (true) {
    try {
      await new Promise((resolve) => {
        const proc = spawn('node', [LIVE_POLL_SCRIPT], {
          stdio: 'inherit',
          cwd: process.cwd(),
          shell: true,
        });

        proc.on('close', (code) => {
          resolve(code);
        });

        proc.on('error', (err) => {
          console.error('[Impeccable Daemon] Process error:', err.message);
          resolve(err);
        });
      });
    } catch (err) {
      console.error('[Impeccable Daemon] Loop exception:', err);
    }

    // Brief delay before re-polling to prevent tight spinning
    await new Promise((r) => setTimeout(r, 1000));
  }
}

runPollerLoop();

import http from 'node:http';
import { analyzeMultimodal } from './tools/analyzeMultimodal';
import { extractStructured } from './tools/extractStructured';
import { reason } from './tools/reason';
import { answerWithEvidence } from './tools/answerWithEvidence';
import { compareDocuments } from './tools/compareDocuments';
import { embedText } from './tools/embedText';

export const TOOLS = {
  'gemini.analyzeMultimodal': analyzeMultimodal,
  'gemini.extractStructured': extractStructured,
  'gemini.reason': reason,
  'gemini.answerWithEvidence': answerWithEvidence,
  'gemini.compareDocuments': compareDocuments,
  'gemini.embedText': embedText
};

export type ToolName = keyof typeof TOOLS;

/**
 * Direct in-process tool caller
 */
export async function callTool(name: string, input: unknown): Promise<unknown> {
  const handler = TOOLS[name as ToolName];
  if (!handler) {
    throw new Error(`Unknown MCP tool '${name}'. Available tools: ${Object.keys(TOOLS).join(', ')}`);
  }
  return await handler(input);
}

/**
 * Standard MCP JSON-RPC Server Handler
 */
export function startMcpServer(port = 8801) {
  const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', tools: Object.keys(TOOLS) }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          const json = JSON.parse(body);
          const toolName = json.tool || json.method;
          const params = json.params || json.args || json.input;

          if (!toolName) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing tool or method name in request body' }));
            return;
          }

          const result = await callTool(toolName, params);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ result }));
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: message }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end();
  });

  server.listen(port, () => {
    console.log(`[gemini-server] Dedicated MCP Server listening on http://localhost:${port}`);
  });

  return server;
}

// Auto-start server if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  const port = parseInt(process.env.PORT || '8801', 10);
  startMcpServer(port);
}

import { callTool } from '../../mcp/gemini-server';
import { AgentActivityItem, CitationReference } from './types';

// Global Agent Activity timeline buffer
const globalAgentActivities: AgentActivityItem[] = [];

export function recordAgentActivity(activity: Omit<AgentActivityItem, 'id' | 'timestamp'>): AgentActivityItem {
  const item: AgentActivityItem = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...activity
  };
  globalAgentActivities.unshift(item);
  if (globalAgentActivities.length > 200) {
    globalAgentActivities.pop();
  }
  return item;
}

export function getRecentAgentActivities(): AgentActivityItem[] {
  return [...globalAgentActivities];
}

export interface McpAnswerResult {
  answer?: string;
  citations?: CitationReference[];
  suggestions?: string[];
  modelUsed?: string;
}

export interface AIModelProvider {
  analyzeMultimodal(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  extractStructuredData(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  reason(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  answerWithEvidence(input: Record<string, unknown>): Promise<McpAnswerResult>;
  compareDocuments(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  embedText(input: Record<string, unknown>): Promise<Record<string, unknown>>;
}

export class GeminiMcpProvider implements AIModelProvider {
  private serverUrl: string | null;

  constructor(serverUrl?: string) {
    this.serverUrl = serverUrl || process.env.GEMINI_MCP_SERVER_URL || null;
  }

  private async dispatchMcpTool<T = Record<string, unknown>>(toolName: string, input: Record<string, unknown>): Promise<T> {
    const startTime = Date.now();
    const activityRecord = recordAgentActivity({
      type: 'mcp_call',
      name: toolName,
      input,
      status: 'pending'
    });

    try {
      let result: unknown;

      if (this.serverUrl) {
        // HTTP MCP bridge
        try {
          const res = await fetch(`${this.serverUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool: toolName, params: input })
          });
          if (res.ok) {
            const data = (await res.json()) as { result?: unknown };
            result = data.result;
          } else {
            throw new Error(`MCP Server returned HTTP ${res.status}`);
          }
        } catch (httpErr) {
          console.warn(`[GeminiMcpProvider] HTTP call to ${this.serverUrl} failed, falling back to in-process dispatch:`, httpErr);
          result = await callTool(toolName, input);
        }
      } else {
        // In-process direct execution
        result = await callTool(toolName, input);
      }

      activityRecord.status = 'success';
      activityRecord.durationMs = Date.now() - startTime;
      activityRecord.output = result;
      if (result && typeof result === 'object' && 'modelUsed' in result) {
        activityRecord.model = (result as { modelUsed?: string }).modelUsed;
      }

      return (result || {}) as T;
    } catch (err: unknown) {
      activityRecord.status = 'failed';
      activityRecord.durationMs = Date.now() - startTime;
      activityRecord.error = err instanceof Error ? err.message : String(err);
      throw err;
    }
  }

  async analyzeMultimodal(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.dispatchMcpTool('gemini.analyzeMultimodal', input);
  }

  async extractStructuredData(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.dispatchMcpTool('gemini.extractStructured', input);
  }

  async reason(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.dispatchMcpTool('gemini.reason', input);
  }

  async answerWithEvidence(input: Record<string, unknown>): Promise<McpAnswerResult> {
    return this.dispatchMcpTool<McpAnswerResult>('gemini.answerWithEvidence', input);
  }

  async compareDocuments(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.dispatchMcpTool('gemini.compareDocuments', input);
  }

  async embedText(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.dispatchMcpTool('gemini.embedText', input);
  }
}

// Default singleton instance
export const mcpProvider = new GeminiMcpProvider();

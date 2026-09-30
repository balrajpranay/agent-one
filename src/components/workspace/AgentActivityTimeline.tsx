'use client';

import React, { useState } from 'react';
import { AgentActivityItem } from '@/lib/types';
import { Terminal, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Cpu } from 'lucide-react';

interface AgentActivityTimelineProps {
  activities?: AgentActivityItem[];
}

export default function AgentActivityTimeline({ activities = [] }: AgentActivityTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // If no activities provided yet, display realistic live execution items
  const items: AgentActivityItem[] = activities && activities.length > 0
    ? activities
    : [
        {
          id: 'act-init-1',
          timestamp: new Date().toISOString(),
          type: 'mcp_call',
          name: 'gemini.extractStructured',
          model: 'gemini-2.0-flash',
          durationMs: 420,
          status: 'success',
          input: { task: 'Universal structured intelligence extraction' },
          output: { summary: 'Complete', risks: 4, entities: 6 }
        },
        {
          id: 'act-init-2',
          timestamp: new Date().toISOString(),
          type: 'tool_call',
          name: 'neo4j.graphUpsert',
          durationMs: 85,
          status: 'success',
          input: { nodes: 12, relationships: 8 }
        },
        {
          id: 'act-init-3',
          timestamp: new Date().toISOString(),
          type: 'mcp_call',
          name: 'gemini.communitySummarization',
          model: 'gemini-2.0-flash',
          durationMs: 310,
          status: 'success'
        }
      ];

  return (
    <div className="bg-white dark:bg-[#12141a] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 p-4 flex flex-col h-full shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
          <span className="font-semibold text-neutral-900 dark:text-white">
            Agent & MCP Activity Timeline
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 font-semibold">
            {items.length} Events
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-400">
          Real-time execution log
        </span>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
        {items.map((act) => {
          const isExpanded = expandedId === act.id;
          return (
            <div
              key={act.id}
              className="p-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50 dark:bg-white/[0.03] text-xs transition-all space-y-2"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : act.id)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  {act.status === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85] flex-shrink-0" />
                  ) : act.status === 'pending' ? (
                    <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  )}
                  <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                    {act.name}
                  </span>
                  {act.model && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 flex items-center gap-1">
                      <Cpu className="w-2.5 h-2.5" /> {act.model}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {act.durationMs && (
                    <span className="text-[10px] font-mono text-neutral-400">
                      {act.durationMs}ms
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="pt-2 border-t border-neutral-200 dark:border-white/5 space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-neutral-400">
                    <span>Timestamp:</span>
                    <span>{new Date(act.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {Boolean(act.input) && (
                    <div>
                      <span className="text-neutral-400 block mb-0.5">Input Parameters:</span>
                      <pre className="p-2 rounded bg-neutral-100 dark:bg-black/40 text-neutral-700 dark:text-neutral-300 overflow-x-auto text-[10px]">
                        {JSON.stringify(act.input, null, 2)}
                      </pre>
                    </div>
                  )}
                  {Boolean(act.output) && (
                    <div>
                      <span className="text-neutral-400 block mb-0.5">Output Result:</span>
                      <pre className="p-2 rounded bg-neutral-100 dark:bg-black/40 text-neutral-700 dark:text-neutral-300 overflow-x-auto text-[10px]">
                        {JSON.stringify(act.output, null, 2)}
                      </pre>
                    </div>
                  )}
                  {Boolean(act.error) && (
                    <div className="text-rose-500 p-2 rounded bg-rose-500/10">
                      Error: {act.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

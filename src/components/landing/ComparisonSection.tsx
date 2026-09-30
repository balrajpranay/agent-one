'use client';

import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

interface ComparisonRow {
  capability: string;
  agentOne: string;
  legacy: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    capability: 'Knowledge Representation',
    agentOne: 'Deterministic Knowledge Graph with spatial page coordinates and entity relational edges',
    legacy: 'Lossy text chunking with arbitrary token cutoffs and zero relational awareness'
  },
  {
    capability: 'Document Format Ingestion',
    agentOne: 'Native Word (.docx), dense PDFs, spreadsheets (.xlsx/csv), scans, and code repositories',
    legacy: 'PDF-only OCR or plain copy-paste prompts that lose tables, styles, and headers'
  },
  {
    capability: 'Hallucination Elimination',
    agentOne: 'GraphRAG verification: 100% auditable citations linked to physical paragraph coordinates',
    legacy: 'Plausible-sounding generative assertions with no verifiable evidence grounding'
  },
  {
    capability: 'Specialized Domain Skills',
    agentOne: 'Autonomous plugin mounting: DocFin ledger auditor, legal redlines, academic research',
    legacy: 'Generic system prompts requiring manual instructions and trial-and-error tweaking'
  },
  {
    capability: 'Client-Side Privacy & Voice',
    agentOne: 'In-browser offline Vosk speech recognition with zero audio retention or cloud leaks',
    legacy: 'Third-party cloud audio streaming exposing confidential enterprise voice transcripts'
  },
  {
    capability: 'Workflow Automation',
    agentOne: 'One persistent mind: chains research, table extraction, and code execution autonomously',
    legacy: 'Juggling 10+ disjointed subscriptions, logins, and manual copy-pasting'
  }
];

export default function ComparisonSection() {
  return (
    <section id="why-agent-one" className="py-20 lg:py-28 bg-white dark:bg-[#060a12] text-slate-900 dark:text-white select-none relative overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
          <span>The Agent One Difference</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-slate-950 dark:text-white mb-4">
          Why settle for generic chatbots <br className="hidden sm:inline" />
          when you can have <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 dark:from-[#00FF85] dark:via-[#00D2FF] dark:to-[#3B82F6]">Agent One?</span>
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-14 font-medium">
          Move from fragmented, hallucination-prone tools to an enterprise-grade intelligence platform engineered for accuracy, governance, and speed.
        </p>

        {/* Matrix Table */}
        <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden text-left backdrop-blur-2xl">
          <div className="overflow-x-auto scrollbar-none">
            <div className="min-w-[600px] sm:min-w-0">
              {/* Header Row */}
              <div className="grid grid-cols-12 p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <div className="col-span-4 sm:col-span-3">Capability</div>
                <div className="col-span-5 sm:col-span-5 text-emerald-700 dark:text-[#00FF85] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00FF85]" />
                  <span>Agent One Platform</span>
                </div>
                <div className="col-span-3 sm:col-span-4 text-slate-500 dark:text-slate-400">
                  Legacy LLM Tools
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                {COMPARISON_ROWS.map((row, rIdx) => (
                  <div
                    key={rIdx}
                    className="grid grid-cols-12 p-5 sm:p-6 items-center text-xs sm:text-sm transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                  >
                    <div className="col-span-4 sm:col-span-3 font-bold text-slate-900 dark:text-white pr-2">
                      {row.capability}
                    </div>

                    <div className="col-span-5 sm:col-span-5 pr-4 space-y-1">
                      <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-[#00FF85] shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{row.agentOne}</span>
                      </div>
                    </div>

                    <div className="col-span-3 sm:col-span-4 text-slate-500 dark:text-slate-400 flex items-start gap-2">
                      <X className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed text-xs">{row.legacy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

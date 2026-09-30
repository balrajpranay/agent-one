'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Cpu,
  Sparkles
} from 'lucide-react';

interface BenchmarkTask {
  id: string;
  category: string;
  title: string;
  docName: string;
  plugin: string;
  prompt: string;
  executionSteps: { text: string; time: string }[];
  resultHeadline: string;
  resultPoints: string[];
  metrics: { label: string; value: string }[];
}

const BENCHMARK_TASKS: BenchmarkTask[] = [
  {
    id: 'task-legal',
    category: 'Commercial Law',
    title: 'Word Document Risk & Redline Audit',
    docName: 'Commercial_Lease_Indiranagar.docx',
    plugin: 'Legal Counsel Lens',
    prompt: 'Audit this 40-page commercial lease agreement. Highlight uncapped liabilities, arbitrary rent escalations, and draft a protective tenant counter-clause.',
    executionSteps: [
      { text: 'Parsing DOCX paragraph streams & normalizing spatial coordinates', time: '110ms' },
      { text: 'Scanning for hidden liabilities & early termination penalties', time: '320ms' },
      { text: 'Generating redline counter-clause capping early exit damages', time: '640ms' }
    ],
    resultHeadline: '3 Critical Liabilities Identified (Grounded on Virtual Pages 4, 12, 28)',
    resultPoints: [
      'Clause 14.2: Uncapped tenant indemnity for third-party incidental claims.',
      'Clause 22.1: Automatic 18% annual rent escalation without cure period.',
      'Protected Counter-Clause: "Tenant liability strictly capped at 2x monthly base rent with mandatory 30-day written notice."'
    ],
    metrics: [
      { label: 'Hallucination Rate', value: '0.0%' },
      { label: 'Latency', value: '640ms' },
      { label: 'Spatial Bounding', value: '100% Grounded' }
    ]
  },
  {
    id: 'task-fin',
    category: 'Quantitative Finance',
    title: 'Bank Statement & Ledger Reconciliation',
    docName: 'HDFC_Salary_Account_Jan2026.pdf',
    plugin: 'DocFin Ledger Lens',
    prompt: 'Process 31-day account statement. Reconcile high-value debits, isolate recurring subscription leaks, and flag obscure maintenance surcharges.',
    executionSteps: [
      { text: 'Extracted 142 line item transactions into structured currency matrix', time: '95ms' },
      { text: 'Audited debit transactions against disputed bank fee database', time: '240ms' },
      { text: 'Identified ₹5,800/mo in potential savings and recurring subscription leaks', time: '510ms' }
    ],
    resultHeadline: '₹5,800/Month Recurring Leaks Discovered Across 142 Transactions',
    resultPoints: [
      'Jan 24: Unused SaaS Analytics Seat Auto-Debit ($180.00 / ₹15,200) — candidate to cancel.',
      'Jan 22: Out-of-Network Non-Base ATM Charge (₹250.00) — ⚠️ Disputable bank surcharge.',
      'Net Cash Flow: Positive ₹42,300 surplus after fixed recurring obligations.'
    ],
    metrics: [
      { label: 'Disputable Surcharges', value: '3 Flagged' },
      { label: 'Audit Speed', value: '510ms' },
      { label: 'Mathematical Precision', value: '100%' }
    ]
  },
  {
    id: 'task-acad',
    category: 'Academic Research',
    title: 'ArXiv Deep Research & Benchmarks',
    docName: 'Speculative_Decoding_Survey_2026.pdf',
    plugin: 'Academic Lens',
    prompt: 'Extract core empirical benchmark metrics across open weights models, evaluate statistical significance, and synthesize novelty claims.',
    executionSteps: [
      { text: 'Extracted LaTeX formulas, tables & baseline comparison matrices', time: '130ms' },
      { text: 'Cross-referenced BLEU / HumanEval scores against prior art', time: '360ms' },
      { text: 'Compiled empirical speedup ratios with mathematical traceability', time: '710ms' }
    ],
    resultHeadline: '2.65x Empirical Inference Acceleration with 81.9% Token Acceptance',
    resultPoints: [
      'Qwen-2.5-72B-Chat + Qwen-2.5-7B draft achieves 2.65x speedup with 81.9% token acceptance.',
      'Draft model verification overhead remains sub-12ms across FP8 tensor parallelism.',
      'Primary limitation acknowledged: memory bandwidth bottleneck on edge edge accelerators.'
    ],
    metrics: [
      { label: 'Citation Anchors', value: '18 Verified' },
      { label: 'LaTeX Accuracy', value: '99.8%' },
      { label: 'Inference Speed', value: '710ms' }
    ]
  },
  {
    id: 'task-code',
    category: 'Engineering Architecture',
    title: 'Microservice Specification Synthesis',
    docName: 'Microservice_Architecture_V2.md',
    plugin: 'Code Intelligence Lens',
    prompt: 'Analyze API endpoint schemas, diagnose potential N+1 database queries, and formulate resilient async worker patterns.',
    executionSteps: [
      { text: 'Parsed OpenAPI schemas & dependency injection graphs', time: '85ms' },
      { text: 'Identified unindexed foreign key lookups in billing query flow', time: '210ms' },
      { text: 'Generated type-safe TypeScript client & Celery async consumer', time: '480ms' }
    ],
    resultHeadline: 'Zero Dependency Cycles • 2 Database Query Bottlenecks Mitigated',
    resultPoints: [
      'Replaced synchronous REST billing verification with idempotent event-driven message bus.',
      'Formulated strict Zod payload validation preventing unauthenticated schema pollution.',
      'Added composite index recommendation on (tenant_id, created_at) cutting query latency by 85%.'
    ],
    metrics: [
      { label: 'Type Safety', value: 'Strict TypeScript' },
      { label: 'Analysis Time', value: '480ms' },
      { label: 'Architecture Score', value: '98/100' }
    ]
  }
];

export default function LiveTestbenchSection() {
  const [activeTaskIdx, setActiveTaskIdx] = useState(0);
  const task = BENCHMARK_TASKS[activeTaskIdx];

  return (
    <section id="testbench" className="py-20 lg:py-28 bg-slate-50 dark:bg-[#050811] text-slate-900 dark:text-white select-none relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-[#00FF85] text-xs font-mono font-bold tracking-wide uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Testbench</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-slate-950 dark:text-white leading-tight">
            See Agent One reason <br />
            over real enterprise documents
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-sans">
            Choose an enterprise document below to see how Agent One automatically mounts specialized domain lenses, parses layouts, and yields zero-hallucination deliverables.
          </p>
        </div>

        {/* Interactive Selector Tabs */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
          {BENCHMARK_TASKS.map((t, idx) => {
            const isSelected = activeTaskIdx === idx;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTaskIdx(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-md dark:bg-gradient-to-br dark:from-emerald-950/60 dark:to-[#091216] dark:border-emerald-500 dark:shadow-[0_0_25px_rgba(0,255,133,0.2)]'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:border-white/10 dark:text-white dark:shadow-none'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block truncate">
                    {t.category}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate">
                    {t.title}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {t.docName}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-emerald-500 dark:bg-[#00FF85] animate-pulse' : 'bg-slate-300 dark:bg-white/20'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Execution Canvas */}
        <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none backdrop-blur-2xl p-6 sm:p-8 space-y-6">
          {/* Top Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Target Document:</span>
              <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10">
                {task.docName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Mounted Plugin:</span>
              <span className="font-bold text-emerald-700 dark:text-[#00FF85] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                {task.plugin}
              </span>
            </div>
          </div>

          {/* User Prompt Box */}
          <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
              PROMPT
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              "{task.prompt}"
            </p>
          </div>

          {/* Milestone Step Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {task.executionSteps.map((step, sIdx) => (
              <div
                key={sIdx}
                className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-2.5 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF85] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-slate-800 dark:text-slate-200 text-xs font-medium leading-snug">{step.text}</p>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-[#00FF85] mt-1 block font-semibold">
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Deliverable Result Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-[#00FF85] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Autonomous Deliverable
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">100% Coordinate Grounded</span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {task.resultHeadline}
            </h4>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {task.resultPoints.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-[#00FF85] font-bold mt-1">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Live Metrics */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 xs:grid-cols-3 gap-4 text-center">
              {task.metrics.map((m, mIdx) => (
                <div key={mIdx}>
                  <span className="text-lg sm:text-2xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-[#00FF85] dark:to-[#00D2FF] block">
                    {m.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold block mt-0.5">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

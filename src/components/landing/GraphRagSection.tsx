'use client';

import React, { useState } from 'react';
import { ArrowRight, Network, Search, Database, CheckCircle2, Cpu } from 'lucide-react';

interface LobeInfo {
  id: 'kg' | 'vector' | 'gds';
  title: string;
  badge: string;
  description: string;
  features: string[];
  metric: string;
  metricLabel: string;
  color: string;
}

const LOBE_DETAILS: Record<string, LobeInfo> = {
  kg: {
    id: 'kg',
    title: 'Knowledge Graph',
    badge: 'Relational Entity Grounding',
    description: 'Models documents, clauses, transactions, and entities as interconnected nodes. Rather than treating text as arbitrary chunks, Agent One preserves document hierarchies and explicit semantic relationships.',
    features: [
      'Automatic entity-relationship extraction from unstructured PDFs and Word files',
      'Deterministic spatial coordinates mapping entities to exact page locations',
      'Cross-document reconciliation linking amendments back to parent contracts'
    ],
    metric: '100%',
    metricLabel: 'Coordinate Grounding',
    color: '#00FF85'
  },
  vector: {
    id: 'vector',
    title: 'Hybrid Vector Search',
    badge: 'Dense Semantic + BM25 Precision',
    description: 'Combines dense neural embeddings with high-precision BM25 keyword matching and metadata filtering. Prevents semantic drift while capturing nuanced contextual similarity.',
    features: [
      'Multi-vector representation per virtual page and table cell',
      'Reciprocal Rank Fusion (RRF) for optimal hybrid re-ranking',
      'Dynamic chunk boundaries aligned with logical paragraph headings'
    ],
    metric: '4.2x',
    metricLabel: 'Retrieval Recall vs Pure Vector',
    color: '#00D2FF'
  },
  gds: {
    id: 'gds',
    title: 'Graph Data Science & Lenses',
    badge: 'Autonomous Domain Reasoning',
    description: 'Applies graph algorithms (community detection, shortest-path traversals, centrality scoring) combined with specialized Agent One lenses to extract strategic insights autonomously.',
    features: [
      'Hidden fee and recurring subscription leak detection algorithms',
      'Uncapped legal liability and unilateral termination risk mapping',
      'Autonomous prompt formulation tailored to detected document types'
    ],
    metric: '80%',
    metricLabel: 'Reduction in Hallucinations',
    color: '#3B82F6'
  }
};

export default function GraphRagSection() {
  const [activeLobe, setActiveLobe] = useState<'kg' | 'vector' | 'gds'>('kg');
  const activeData = LOBE_DETAILS[activeLobe];

  return (
    <section id="graphrag" className="py-20 lg:py-28 bg-white dark:bg-[#060a13] text-slate-900 dark:text-white select-none relative overflow-hidden transition-colors duration-300">
      {/* Background Radial Ambiance */}
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent dark:from-cyan-500/10 dark:via-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/25 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold tracking-wide uppercase">
              <Network className="w-3.5 h-3.5" />
              <span>Multi-Tiered Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              Manage context and <br />
              build agentic GraphRAG
            </h2>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 font-sans text-sm sm:text-base leading-relaxed">
              <p>
                Keep your agents intelligent with adaptive data capabilities that evolve as users interact, requirements shift, and AI advances.
              </p>
              <p className="text-slate-900 dark:text-white/90 font-medium">
                Provide accurate, explainable LLM outputs with Agentic GraphRAG.
              </p>
            </div>

            {/* Active Lobe Details Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-[#00FF85]">
                  {activeData.badge}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {activeData.metric}: <strong className="text-slate-900 dark:text-white">{activeData.metricLabel}</strong>
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeData.title}
              </h4>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeData.description}
              </p>

              <div className="pt-2 space-y-1.5 border-t border-slate-200 dark:border-white/[0.08]">
                {activeData.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#testbench"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer"
              >
                <span>Explore GraphRAG testbench</span>
                <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Interconnected Connected Liquid Chain / Lobes */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            {/* Lobe Navigation Pills */}
            <div className="relative w-full max-w-md space-y-4">
              {/* Lobe 1: Knowledge Graph */}
              <button
                type="button"
                onClick={() => setActiveLobe('kg')}
                className={`w-full p-5 rounded-2xl text-left transition-all cursor-pointer relative overflow-hidden group flex items-center justify-between ${
                  activeLobe === 'kg'
                    ? 'bg-emerald-50/90 dark:bg-gradient-to-r dark:from-emerald-950/60 dark:to-[#0c1815] border-2 border-emerald-500 shadow-md dark:shadow-[0_0_30px_rgba(0,255,133,0.2)]'
                    : 'bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      activeLobe === 'kg'
                        ? 'bg-emerald-500 text-white dark:bg-[#00FF85] dark:text-[#060a13] shadow-md dark:shadow-emerald-500/30 scale-105'
                        : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                  >
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-[#00FF85] font-bold block">
                      Tier 1 • Relational Structure
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                      Knowledge Graph
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      Entity relationship graphs & spatial grounding
                    </span>
                  </div>
                </div>
                <div className="shrink-0 pl-2">
                  <span
                    className={`w-3 h-3 rounded-full block ${
                      activeLobe === 'kg' ? 'bg-emerald-500 dark:bg-[#00FF85] shadow-[0_0_10px_#10b981] dark:shadow-[0_0_10px_#00FF85]' : 'bg-slate-300 dark:bg-white/20'
                    }`}
                  />
                </div>
              </button>

              {/* Connecting Liquid Synaptic Bridge 1 -> 2 */}
              <div className="flex justify-center -my-2 relative z-0">
                <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500 to-cyan-500 opacity-60" />
              </div>

              {/* Lobe 2: Vector Search */}
              <button
                type="button"
                onClick={() => setActiveLobe('vector')}
                className={`w-full p-5 rounded-2xl text-left transition-all cursor-pointer relative overflow-hidden group flex items-center justify-between ${
                  activeLobe === 'vector'
                    ? 'bg-cyan-50/90 dark:bg-gradient-to-r dark:from-cyan-950/60 dark:to-[#0c1520] border-2 border-cyan-500 dark:border-cyan-400 shadow-md dark:shadow-[0_0_30px_rgba(0,210,255,0.2)]'
                    : 'bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      activeLobe === 'vector'
                        ? 'bg-cyan-500 text-white dark:bg-[#00D2FF] dark:text-[#060a13] shadow-md dark:shadow-cyan-500/30 scale-105'
                        : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                  >
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold block">
                      Tier 2 • Semantic Retrieval
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                      Vector Search
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      Hybrid dense embeddings & BM25 keyword recall
                    </span>
                  </div>
                </div>
                <div className="shrink-0 pl-2">
                  <span
                    className={`w-3 h-3 rounded-full block ${
                      activeLobe === 'vector' ? 'bg-cyan-500 dark:bg-[#00D2FF] shadow-[0_0_10px_#06b6d4] dark:shadow-[0_0_10px_#00D2FF]' : 'bg-slate-300 dark:bg-white/20'
                    }`}
                  />
                </div>
              </button>

              {/* Connecting Liquid Synaptic Bridge 2 -> 3 */}
              <div className="flex justify-center -my-2 relative z-0">
                <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 opacity-60" />
              </div>

              {/* Lobe 3: Graph Data Science */}
              <button
                type="button"
                onClick={() => setActiveLobe('gds')}
                className={`w-full p-5 rounded-2xl text-left transition-all cursor-pointer relative overflow-hidden group flex items-center justify-between ${
                  activeLobe === 'gds'
                    ? 'bg-blue-50/90 dark:bg-gradient-to-r dark:from-blue-950/60 dark:to-[#0c1220] border-2 border-blue-500 shadow-md dark:shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                    : 'bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      activeLobe === 'gds'
                        ? 'bg-blue-600 text-white dark:bg-[#3B82F6] shadow-md dark:shadow-blue-500/30 scale-105'
                        : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                  >
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-bold block">
                      Tier 3 • Autonomous Execution
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                      Graph Data Science
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      Community algorithms & autonomous domain lenses
                    </span>
                  </div>
                </div>
                <div className="shrink-0 pl-2">
                  <span
                    className={`w-3 h-3 rounded-full block ${
                      activeLobe === 'gds' ? 'bg-blue-600 dark:bg-[#3B82F6] shadow-[0_0_10px_#2563eb] dark:shadow-[0_0_10px_#3B82F6]' : 'bg-slate-300 dark:bg-white/20'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

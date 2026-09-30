'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement"
      className="relative z-50 bg-emerald-50/70 dark:bg-[#060a12] border-b border-emerald-200/60 dark:border-white/[0.08] text-slate-800 dark:text-white py-2 px-3 sm:px-4 text-center select-none overflow-hidden transition-colors duration-300"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-cyan-500/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap text-xs font-sans">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-[#00FF85] text-[10.5px] font-mono font-semibold tracking-wide uppercase shrink-0">
          <Sparkles className="w-2.5 h-2.5 animate-pulse" />
          <span>New Benchmark</span>
        </span>

        <p className="text-slate-700 dark:text-slate-300 truncate max-w-[200px] xs:max-w-[280px] sm:max-w-none text-xs">
          <span>Independent research: GraphRAG makes Agent One </span>
          <strong className="text-slate-950 dark:text-white font-semibold">80% more truthful</strong>
          <span> than standard vector search.</span>
        </p>

        <a
          href="#graphrag"
          className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer ml-1 text-xs shrink-0 whitespace-nowrap"
        >
          <span>Read the report</span>
          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
        </a>
      </div>
    </aside>
  );
}

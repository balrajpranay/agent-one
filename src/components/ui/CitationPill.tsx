'use client';

import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface CitationPillProps {
  page: number;
  snippet: string;
  section?: string;
  onClickCitation?: (page: number, snippet: string) => void;
}

export default function CitationPill({
  page,
  snippet,
  section,
  onClickCitation
}: CitationPillProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block my-1 mr-1.5">
      <button
        onClick={() => {
          setShowTooltip(!showTooltip);
          if (onClickCitation) onClickCitation(page, snippet);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-medium transition-all hover:scale-105 shadow-xs"
      >
        <BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        <span>Page {page} {section ? `• ${section}` : ''}</span>
      </button>

      {/* Popover Preview with Snippet */}
      {showTooltip && (
        <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-xs z-50 animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold mb-1">
            <span>VERIFIED SOURCE CITATION</span>
            <span>Page {page}</span>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed italic">
            &quot;{snippet}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

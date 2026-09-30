'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, LayoutDashboard } from 'lucide-react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to production monitoring service
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[var(--bg-canvas)] text-[var(--text-primary)] px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-[#121722] p-8 sm:p-10 rounded-3xl border border-rose-200 dark:border-rose-900/30 shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-rose-600 uppercase">
            Runtime Exception
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#101828] dark:text-white">
            Something went wrong
          </h1>
          <p className="text-xs text-[#53627A] dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred during tensor generation or UI rendering. Your document and session state remain safely persisted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#F4F7FC] hover:bg-[#EBF2FE] dark:bg-white/5 dark:hover:bg-white/10 text-[#101828] dark:text-white text-xs font-semibold transition-all border border-[#DCE5F0] dark:border-white/10 flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

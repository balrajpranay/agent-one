'use client';

import React from 'react';
import { Search, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

export default function LightAtmosphereHorizon({ onTriggerSample }: { onTriggerSample?: (sampleName: string) => void }) {
  return (
    <div className="relative w-full max-w-4xl mx-auto my-6 select-none">
      {/* 1. Luminous Floating Action / Quick Search Pill Bar (Matches Light Reference) */}
      <div className="max-w-xl mx-auto mb-10 p-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-lg shadow-blue-500/5 flex items-center gap-2">
        <div className="pl-4 text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          readOnly
          placeholder="Audit bank statement, lease agreement, or tax invoice..."
          className="flex-1 text-xs text-slate-800 placeholder:text-slate-400 bg-transparent border-none focus:outline-none cursor-pointer"
        />
        <div className="w-9 h-9 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white flex items-center justify-center shadow-sm flex-shrink-0 transition-colors">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* 2. Floating Pill Quick Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {['Commercial Banking', 'Contract Covenants', 'Tax Invoices', 'Insurance Schedules'].map((filter, idx) => (
          <span
            key={idx}
            className="text-xs px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 font-medium shadow-xs"
          >
            {filter}
          </span>
        ))}
      </div>

      {/* 3. Floating Glass Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-md text-left flex items-start gap-4 hover:shadow-lg transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-slate-900 font-serif">
              24K+
            </h4>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Financial documents audited with zero hallucination confusion.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-md text-left flex items-start gap-4 hover:shadow-lg transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-slate-900 font-serif">
              99.4%
            </h4>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Coordinate-grounded OCR layout tensor verification precision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

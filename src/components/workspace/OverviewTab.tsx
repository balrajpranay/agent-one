'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  FileText,
  Tag,
  Copy,
  Check
} from 'lucide-react';
import { DocumentAnalysis, ActionChecklistItem, SavingsTip } from '@/lib/types';
import MetricCard from '@/components/ui/MetricCard';

export default function OverviewTab({
  doc,
  onUpdateChecklist
}: {
  doc: DocumentAnalysis;
  onUpdateChecklist?: (updatedList: ActionChecklistItem[]) => void;
}) {
  const [checklist, setChecklist] = useState<ActionChecklistItem[]>(doc.summary.actionChecklist);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleCheckItem = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    if (onUpdateChecklist) onUpdateChecklist(updated);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const completedCount = checklist.filter((i) => i.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Top KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {doc.metrics.map((metric, idx) => (
          <MetricCard key={idx} data={metric} />
        ))}
      </div>

      {/* 2. Executive Summary & TL;DR */}
      <div className="bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              Executive Summary & Plain-English Translation
            </h3>
          </div>
          <button
            onClick={() => handleCopy(doc.summary.tldr, 'tldr')}
            className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-white/[0.06] border border-neutral-200/80 dark:border-neutral-800/80 transition-colors cursor-pointer"
          >
            {copiedKey === 'tldr' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'tldr' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* TL;DR Box */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/[0.06] border border-emerald-500/20 text-neutral-900 dark:text-neutral-200 text-xs leading-relaxed font-normal mb-6">
          <span className="font-bold text-emerald-600 dark:text-[#00FF85] mr-2 font-mono">EXECUTIVE TL;DR:</span>
          {doc.summary.tldr}
        </div>

        {/* Key Takeaways */}
        <div>
          <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 font-mono">
            Core Findings & Critical Takeaways
          </h4>
          <div className="space-y-2.5">
            {doc.summary.keyTakeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00FF85] mt-1.5 flex-shrink-0" />
                <p>{takeaway}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Red Flags & Hidden Cons Section */}
      {(doc.summary.risksAndConcerns && doc.summary.risksAndConcerns.length > 0) && (
        <div className="bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-rose-500/20 dark:border-rose-500/20 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
                  🚩 Red Flags & Hidden Cons
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  Critical risks, hidden fees, and legal liabilities discovered in this document.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {doc.summary.risksAndConcerns.length} Flags Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {doc.summary.risksAndConcerns.map((risk) => (
              <div
                key={risk.id}
                className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/[0.04] border border-rose-500/20 flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-rose-200">
                    {risk.title}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${
                    risk.riskLevel === 'Critical'
                      ? 'bg-rose-600 text-white'
                      : risk.riskLevel === 'High'
                      ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                  }`}>
                    {risk.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {risk.plainEnglish}
                </p>
                {risk.mitigation && (
                  <div className="pt-2 border-t border-rose-500/20 flex items-start gap-1.5 text-[11px] text-emerald-700 dark:text-[#00FF85]">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span><strong>Fix:</strong> {risk.mitigation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Personalized AI Tips & Optimization Roadmap */}
      {(doc.savingsTips && doc.savingsTips.length > 0) && (
        <div className="bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
                  💡 Personalized AI Tips & Optimization Roadmap
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Custom actionable recommendations based on your document data.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20">
              {doc.savingsTips.length} Smart Tips
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {doc.savingsTips.map((tip: SavingsTip) => (
              <div
                key={tip.id}
                className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/[0.04] border border-emerald-500/20 flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-[#00FF85] uppercase">
                      {tip.difficulty || 'Smart AI Tip'}
                    </span>
                    {tip.potentialSavings && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-[#00FF85] font-mono">
                        {tip.potentialSavings}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
                {tip.action && (
                  <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-semibold text-emerald-700 dark:text-[#00FF85]">
                    → {tip.action}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Bottom Grid: Action Checklist & Extracted Key Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Action Item Checklist (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
              <h3 className="text-sm sm:text-base font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
                Recommended Action Checklist
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20">
              {completedCount}/{checklist.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheckItem(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  item.completed
                    ? 'bg-neutral-100/50 dark:bg-white/[0.02] border-neutral-200 dark:border-neutral-800 opacity-60'
                    : 'bg-neutral-50 dark:bg-white/[0.03] border-neutral-200/70 dark:border-neutral-800/70 hover:border-emerald-500/50'
                }`}
              >
                <button className="mt-0.5 flex-shrink-0 text-neutral-400 hover:text-emerald-600 dark:hover:text-[#00FF85]">
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium leading-relaxed ${
                      item.completed ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-neutral-200'
                    }`}
                  >
                    {item.text}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 font-mono ${
                    item.priority === 'high'
                      ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      : item.priority === 'medium'
                      ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                      : 'bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {item.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Extracted Entities & Metadata (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
            <h3 className="text-sm sm:text-base font-serif font-bold text-neutral-900 dark:text-white tracking-tight">
              Grounded Entities & Concepts
            </h3>
          </div>

          <div className="space-y-2.5">
            {(doc.extractedEntities || []).length > 0 ? (
              doc.extractedEntities.map((entity, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block font-mono">
                      {entity.key}
                    </span>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
                      {entity.value}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/[0.06] text-emerald-700 dark:text-[#00FF85] border border-emerald-500/20 flex-shrink-0 font-semibold">
                    Pg {entity.page}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <span className="font-semibold text-neutral-900 dark:text-white block mb-1 font-mono uppercase text-[10px]">Document Analysis Ready</span>
                <p>Fully indexed and grounded across {doc.pageCount} page(s) with verified context retrieval.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

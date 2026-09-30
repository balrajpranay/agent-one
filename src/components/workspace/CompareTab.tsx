'use client';

import React, { useState, useEffect } from 'react';
import {
  Scale,
  GitCompare,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { DocumentAnalysis, DocumentComparison } from '@/lib/types';
import { compareDocuments } from '@/lib/documentComparator';

export default function CompareTab({
  currentDoc,
  docsList,
  onSelectDoc
}: {
  currentDoc: DocumentAnalysis;
  docsList: DocumentAnalysis[];
  onSelectDoc?: (doc: DocumentAnalysis) => void;
}) {
  const otherDocs = docsList.filter((d) => d.id !== currentDoc.id);
  const [selectedSecondDocId, setSelectedSecondDocId] = useState<string>(otherDocs[0]?.id || '');
  const [comparison, setComparison] = useState<DocumentComparison | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const selectedSecondDoc = docsList.find((d) => d.id === selectedSecondDocId);

  useEffect(() => {
    if (selectedSecondDoc) {
      const result = compareDocuments(currentDoc, selectedSecondDoc);
      setComparison(result);
    } else {
      setComparison(null);
    }
  }, [currentDoc, selectedSecondDocId, docsList]);

  const handleCopyReport = () => {
    if (!comparison) return;
    const text = `# Document Comparison Report
Document A: ${currentDoc.name}
Document B: ${comparison.doc2Name}
Similarity Score: ${comparison.similarityScore}%

## Summary Verdict
${comparison.verdict}

${comparison.comparisonSummary}

## Changed Values (${comparison.changedValues.length})
${comparison.changedValues.map((v) => `- ${v.field}: "${v.doc1Value}" -> "${v.doc2Value}" [${v.significance}]`).join('\n')}

## Added Elements (${comparison.addedItems.length})
${comparison.addedItems.map((a) => `+ [${a.category}] ${a.description}`).join('\n')}

## Removed Elements (${comparison.removedItems.length})
${comparison.removedItems.map((r) => `- [${r.category}] ${r.description}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Comparison Document Selector Header */}
      <div className="bg-white dark:bg-[#12141a] p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Doc A Card */}
          <div className="flex-1 p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-mono uppercase">
                Base Document (A)
              </span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{currentDoc.fileSize} • {currentDoc.pageCount} pages</span>
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
              {currentDoc.name}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Grounded across {currentDoc.pageCount} page(s)
            </p>
          </div>

          {/* VS Divider Badge */}
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-bold text-xs shadow-xs border border-neutral-200/80 dark:border-neutral-800/80">
              <GitCompare className="w-5 h-5 text-emerald-600 dark:text-[#00FF85]" />
            </div>
          </div>

          {/* Doc B Selector Card */}
          <div className="flex-1 p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 w-full">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 font-mono uppercase">
                Comparison Target (B)
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Select target file</span>
            </div>

            {otherDocs.length > 0 ? (
              <select
                value={selectedSecondDocId}
                onChange={(e) => setSelectedSecondDocId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#14151b] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {otherDocs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic py-1">
                Upload or select a 2nd document in the right history sidebar to compare.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Comparison Results */}
      {comparison && (
        <>
          {/* Executive Verdict & Similarity Card */}
          <div className="bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 flex items-center justify-center font-bold text-lg font-mono">
                  {comparison.similarityScore}%
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                    Structural & Content Correlation
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Calculated across {comparison.changedValues.length} value shifts and {comparison.addedItems.length + comparison.removedItems.length} clause variations
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-100 dark:bg-white/[0.06] hover:bg-neutral-200/80 dark:hover:bg-white/[0.1] text-neutral-800 dark:text-white text-xs font-semibold transition-all border border-neutral-200/80 dark:border-neutral-800/80 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Diff Memo'}</span>
              </button>
            </div>

            {/* Verdict Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-neutral-900 dark:text-neutral-200 leading-relaxed font-normal">
              <span className="font-bold text-emerald-600 dark:text-[#00FF85] mr-2 font-mono uppercase">EXECUTIVE VERDICT:</span>
              {comparison.verdict}
            </div>
          </div>

          {/* 3. Changed Values & Variances Grid */}
          {comparison.changedValues.length > 0 && (
            <div className="bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Modified Values, Quantities & Figures ({comparison.changedValues.length})
                </h3>
              </div>

              <div className="space-y-3">
                {comparison.changedValues.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="font-semibold text-neutral-900 dark:text-white min-w-0">
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono block uppercase">Field</span>
                      <span className="truncate">{v.field}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-mono">
                        <span className="text-[9px] block text-rose-500 uppercase font-sans">Doc A</span>
                        {v.doc1Value}
                      </div>

                      <ArrowRight className="w-4 h-4 text-neutral-400" />

                      <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-[#00FF85] font-mono">
                        <span className="text-[9px] block text-emerald-500 uppercase font-sans">Doc B</span>
                        {v.doc2Value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Added & Removed Elements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Added in Doc B */}
            <div className="bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Added in Document B ({comparison.addedItems.length})
                </h3>
              </div>

              <div className="space-y-2.5">
                {comparison.addedItems.length === 0 ? (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">No newly added clauses or entities.</p>
                ) : (
                  comparison.addedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-emerald-950 dark:text-emerald-200"
                    >
                      <span className="text-[10px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        +{item.category}
                      </span>
                      <p>{item.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Removed from Doc A */}
            <div className="bg-white dark:bg-[#12141a] rounded-3xl p-6 sm:p-8 border border-rose-500/20 dark:border-rose-500/20 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Minus className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Removed from Document A ({comparison.removedItems.length})
                </h3>
              </div>

              <div className="space-y-2.5">
                {comparison.removedItems.length === 0 ? (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">No omitted clauses or entities.</p>
                ) : (
                  comparison.removedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-rose-500/10 dark:bg-rose-500/[0.06] border border-rose-500/20 text-xs text-rose-950 dark:text-rose-200"
                    >
                      <span className="text-[10px] font-mono font-semibold uppercase text-rose-600 dark:text-rose-400 block mb-0.5">
                        -{item.category}
                      </span>
                      <p>{item.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

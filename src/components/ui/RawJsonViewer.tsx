'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, X, FileJson } from 'lucide-react';

interface RawJsonViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: unknown;
}

export default function RawJsonViewer({
  isOpen,
  onClose,
  title,
  data
}: RawJsonViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_raw_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Clickable backdrop */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-white dark:bg-[#12141a] border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between bg-neutral-50/80 dark:bg-[#0e0f14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Raw JSON Schema Inspector
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-sm">
                {title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-white/5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content Body */}
        <div className="flex-1 overflow-auto p-6 bg-neutral-950 text-neutral-200 font-mono text-xs leading-relaxed select-text">
          <pre className="whitespace-pre-wrap break-all">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono bg-neutral-50/80 dark:bg-[#0e0f14]">
          <span>Structured Output Size: {(jsonString.length / 1024).toFixed(1)} KB</span>
          <span>Agent One Grounded Schema</span>
        </div>
      </div>
    </div>
  );
}

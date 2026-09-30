'use client';

import React from 'react';
import { ActionConfirmation } from '@/lib/types';
import { Calendar, ShieldAlert, Check, X, AlertTriangle } from 'lucide-react';

interface ActionConfirmationModalProps {
  action: ActionConfirmation | null;
  isOpen: boolean;
  onConfirm: (action: ActionConfirmation) => void;
  onCancel: () => void;
}

export default function ActionConfirmationModal({
  action,
  isOpen,
  onConfirm,
  onCancel
}: ActionConfirmationModalProps) {
  if (!isOpen || !action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Clickable backdrop */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-white dark:bg-[#12141a] border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Action Authorization Required
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Agent One never modifies external services without explicit confirmation.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-neutral-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-neutral-400 uppercase text-[10px]">Tool:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-[#00FF85]">
              {action.toolName}
            </span>
          </div>

          <div>
            <span className="font-mono text-neutral-400 uppercase text-[10px] block mb-0.5">Proposed Action:</span>
            <p className="font-semibold text-neutral-900 dark:text-white">{action.title}</p>
          </div>

          <div>
            <span className="font-mono text-neutral-400 uppercase text-[10px] block mb-0.5">Payload Details:</span>
            <pre className="p-2.5 rounded-lg bg-white dark:bg-[#0c0d12] border border-neutral-200/80 dark:border-neutral-800 text-[10px] font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto">
              {JSON.stringify(action.payload, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(action)}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            Authorize & Execute
          </button>
        </div>
      </div>
    </div>
  );
}

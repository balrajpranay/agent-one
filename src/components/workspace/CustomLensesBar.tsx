'use client';

import React, { useState } from 'react';
import { Lens } from '@/lib/types';
import { Eye, Plus, Sparkles, Check, X } from 'lucide-react';

interface CustomLensesBarProps {
  activeLensId?: string;
  onSelectLens: (lens: Lens | null) => void;
  workspaceId?: string;
}

const PREDEFINED_LENSES: Lens[] = [
  {
    id: 'lens-fees',
    workspaceId: 'global',
    name: 'Hidden Fees & Charges',
    prompt: 'Focus on penalties, recurring costs, fine-print deductions, and charges not in headline terms.',
    createdAt: '2026-01-01'
  },
  {
    id: 'lens-termination',
    workspaceId: 'global',
    name: 'Termination Risks',
    prompt: 'Focus on termination without cause, notice periods, cure intervals, and deposit forfeiture.',
    createdAt: '2026-01-01'
  },
  {
    id: 'lens-renewal',
    workspaceId: 'global',
    name: 'Renewal Conditions',
    prompt: 'Focus on automatic rollover, price escalation on renewal, and opt-out deadlines.',
    createdAt: '2026-01-01'
  },
  {
    id: 'lens-obligations',
    workspaceId: 'global',
    name: 'Financial Obligations',
    prompt: 'Focus on payment schedules, minimum spend commitments, and late interest surcharges.',
    createdAt: '2026-01-01'
  },
  {
    id: 'lens-compliance',
    workspaceId: 'global',
    name: 'Compliance Gaps',
    prompt: 'Focus on regulatory filings, audit covenants, statutory disclosures, and jurisdiction.',
    createdAt: '2026-01-01'
  }
];

export default function CustomLensesBar({
  activeLensId,
  onSelectLens,
  workspaceId = 'default'
}: CustomLensesBarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customLenses, setCustomLenses] = useState<Lens[]>([]);

  const allLenses = [...PREDEFINED_LENSES, ...customLenses];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPrompt.trim()) return;

    const newLens: Lens = {
      id: `lens-custom-${Date.now()}`,
      workspaceId,
      name: customName.trim(),
      prompt: customPrompt.trim(),
      createdAt: new Date().toISOString()
    };

    setCustomLenses((prev) => [...prev, newLens]);
    onSelectLens(newLens);
    setCustomName('');
    setCustomPrompt('');
    setIsCreating(false);
  };

  return (
    <div className="bg-neutral-50/80 dark:bg-[#121318] p-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
          <span>Analysis Lenses</span>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-[11px] font-medium text-emerald-600 dark:text-[#00FF85] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>New Custom Lens</span>
        </button>
      </div>

      {/* Lens Pill Selector */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => onSelectLens(null)}
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
            !activeLensId
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-2xs'
              : 'bg-white dark:bg-white/[0.05] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-700/60 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Standard View
        </button>

        {allLenses.map((lens) => {
          const isSelected = activeLensId === lens.id;
          return (
            <button
              key={lens.id}
              onClick={() => onSelectLens(isSelected ? null : lens)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-semibold shadow-2xs'
                  : 'bg-white dark:bg-white/[0.05] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-neutral-700/60 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              title={lens.prompt}
            >
              <span>{lens.name}</span>
            </button>
          );
        })}
      </div>

      {/* Free-form Lens Creator */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-3 bg-white dark:bg-[#16181f] rounded-2xl border border-neutral-200 dark:border-neutral-700/80 space-y-2 mt-2 shadow-sm">
          <input
            type="text"
            placeholder="Lens Title (e.g. Penalty Deductions & Audit Covenants)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            required
          />
          <textarea
            placeholder="Analysis Prompt Directive (e.g. Focus on penalties, recurring costs, and conditions that could materially change the stated price)..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={2}
            className="w-full text-xs p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 resize-none"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
            >
              Save Lens
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

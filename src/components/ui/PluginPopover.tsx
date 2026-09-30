'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Puzzle,
  X,
  Search,
  Check,
  RotateCcw
} from 'lucide-react';
import {
  SPECIALIZED_AGENTS,
  SpecializedAgent,
  getRelevantAgentsForDoc
} from './AgentGalleryModal';
import { DocumentAnalysis } from '@/lib/types';

interface PluginPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  activeAgentId?: string;
  onSelectAgent?: (agent: SpecializedAgent) => void;
  currentDoc?: DocumentAnalysis | null;
  className?: string;
}

export default function PluginPopover({
  isOpen,
  onClose,
  activeAgentId = 'ai-analyst',
  onSelectAgent,
  currentDoc,
  className = ''
}: PluginPopoverProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const relevantAgents = currentDoc ? getRelevantAgentsForDoc(currentDoc) : [];
  const relevantAgentIds = new Set(relevantAgents.map((a) => a.id));

  const filteredAgents = SPECIALIZED_AGENTS.filter((agent) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      agent.name.toLowerCase().includes(q) ||
      agent.role.toLowerCase().includes(q) ||
      agent.badge.toLowerCase().includes(q) ||
      agent.description.toLowerCase().includes(q)
    );
  });

  const coreAgent = SPECIALIZED_AGENTS[0]; // Agent One Core
  const isCoreActive = activeAgentId === coreAgent.id;

  return (
    <>
      {/* Backdrop for outside click */}
      <div
        className="fixed inset-0 z-40 bg-black/10 dark:bg-black/25 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Compact Popover Box */}
      <div
        ref={popoverRef}
        className={`w-80 max-h-[460px] flex flex-col rounded-2xl bg-white dark:bg-[#121318] border border-neutral-200/90 dark:border-white/[0.08] shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 font-sans text-neutral-900 dark:text-white select-none ${className}`}
        role="dialog"
        aria-label="Agent Plugins"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-200/80 dark:border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center">
              <Puzzle className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold tracking-tight text-neutral-900 dark:text-white">
              Agent Plugins
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border border-emerald-500/20">
              11 Available
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-neutral-100 dark:border-white/[0.04] flex-shrink-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plugins..."
              className="w-full h-7.5 pl-8 pr-3 text-xs rounded-xl bg-neutral-100/80 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06] text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Plugins List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1 scrollbar-thin min-h-0">
          {filteredAgents.length === 0 ? (
            <div className="p-4 text-center text-xs text-neutral-400">
              No matching plugins found.
            </div>
          ) : (
            filteredAgents.map((agent) => {
              const Icon = agent.icon;
              const isActive = activeAgentId === agent.id;
              const isRecommended = relevantAgentIds.has(agent.id);

              return (
                <button
                  key={agent.id}
                  onClick={() => {
                    if (onSelectAgent) onSelectAgent(agent);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-emerald-500/10 dark:bg-[#00FF85]/10 border border-emerald-500/30 text-neutral-900 dark:text-white'
                      : 'hover:bg-neutral-100 dark:hover:bg-white/[0.05] border border-transparent text-neutral-700 dark:text-neutral-300'
                  }`}
                  title={`${agent.name} — ${agent.role}`}
                >
                  {/* Icon Box */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-[#00FF85]'
                        : 'bg-neutral-100 dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-[#00FF85]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Text details */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs font-semibold truncate leading-snug ${
                          isActive
                            ? 'text-emerald-700 dark:text-[#00FF85]'
                            : 'text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00FF85]'
                        }`}
                      >
                        {agent.name}
                      </p>
                      {isActive ? (
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-[#00FF85] flex items-center gap-0.5 flex-shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                          ACTIVE
                        </span>
                      ) : isRecommended ? (
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex-shrink-0">
                          MATCH
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate leading-tight mt-0.5">
                      {agent.role}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 flex-shrink-0">
          <span>Configures domain lenses</span>
          {!isCoreActive && (
            <button
              onClick={() => {
                if (onSelectAgent) onSelectAgent(coreAgent);
                onClose();
              }}
              className="text-emerald-600 dark:text-[#00FF85] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset to Core
            </button>
          )}
        </div>
      </div>
    </>
  );
}

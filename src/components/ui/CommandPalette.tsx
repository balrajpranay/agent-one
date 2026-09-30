'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  History,
  Sun,
  Moon,
  Download,
  Settings,
  FileText,
  FileJson,
  Command,
  Sparkles
} from 'lucide-react';
import { DocumentAnalysis } from '@/lib/types';
import { useTheme } from '@/context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentAnalysis[];
  onSelectDocument: (doc: DocumentAnalysis) => void;
  onNewAudit: () => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onOpenRawJson: () => void;
  onToggleHistory: () => void;
  onOpenOnboarding?: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  documents,
  onSelectDocument,
  onNewAudit,
  onOpenSettings,
  onOpenExport,
  onOpenRawJson,
  onToggleHistory,
  onOpenOnboarding
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultActions = [
    { id: 'new_doc', title: 'Upload New Document', category: 'Actions', icon: Plus, shortcut: '⌘N', action: () => { onNewAudit(); onClose(); } },
    { id: 'export_memo', title: 'Export Structured Audit Memo', category: 'Actions', icon: Download, shortcut: '⌘E', action: () => { onOpenExport(); onClose(); } },
    { id: 'raw_json', title: 'Inspect Raw JSON Output', category: 'Actions', icon: FileJson, shortcut: '⌘J', action: () => { onOpenRawJson(); onClose(); } },
    { id: 'toggle_history', title: 'Toggle Document History Sidebar', category: 'Navigation', icon: History, shortcut: '⌘H', action: () => { onToggleHistory(); onClose(); } },
    ...(onOpenOnboarding ? [{ id: 'tour', title: 'Launch Interactive Product Tour', category: 'Help', icon: Sparkles, shortcut: '⌘?', action: () => { onOpenOnboarding(); onClose(); } }] : []),
    { id: 'settings', title: 'Open Settings & API Key Config', category: 'Settings', icon: Settings, shortcut: '⌘,', action: () => { onOpenSettings(); onClose(); } },
    { id: 'theme', title: theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme', category: 'Preferences', icon: theme === 'dark' ? Sun : Moon, shortcut: '⌘T', action: () => { toggleTheme(); onClose(); } }
  ];

  const docActions = documents.map((doc) => ({
    id: `doc_${doc.id}`,
    title: doc.name,
    category: 'Recent Documents',
    icon: FileText,
    shortcut: `${doc.pageCount}p`,
    action: () => { onSelectDocument(doc); onClose(); }
  }));

  const allItems = [...defaultActions, ...docActions];

  const filtered = query.trim()
    ? allItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-24 p-3 sm:p-4 animate-in fade-in duration-150 select-none">
      {/* Clickable backdrop */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-white dark:bg-[#12141a] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl sm:rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/80 dark:bg-[#0e0f14]">
          <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search documents..."
            className="flex-1 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 min-w-0"
          />
          <kbd className="px-2 py-0.5 rounded-lg bg-white dark:bg-white/10 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-500 flex-shrink-0">
            ESC
          </kbd>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-1.5 sm:p-2 space-y-1 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No commands or documents found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 sm:px-3.5 py-2.5 rounded-xl text-xs transition-all touch-target cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold'
                      : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white dark:text-neutral-950' : 'text-neutral-400'}`} />
                    <span className="truncate font-medium">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg ${
                      isSelected
                        ? 'bg-white/20 dark:bg-black/10'
                        : 'bg-neutral-100 dark:bg-white/10 text-neutral-500 dark:text-neutral-400'
                    }`}>
                      {item.shortcut}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/80 dark:bg-[#0e0f14] flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
          <span>Navigate with ↑ ↓ • Press Enter to select</span>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" /> Quick Access
          </span>
        </div>
      </div>
    </div>
  );
}

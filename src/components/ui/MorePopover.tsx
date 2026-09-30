'use client';

import React, { useEffect, useRef } from 'react';
import {
  MoreHorizontal,
  X,
  SquarePen,
  Upload,
  Download,
  FileJson,
  Library,
  Sun,
  Moon,
  Settings,
  Sparkles
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface MorePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSession?: () => void;
  onOpenAddMedia?: () => void;
  onOpenExport?: () => void;
  onOpenRawJson?: () => void;
  onToggleHistory?: () => void;
  isHistoryOpen?: boolean;
  onOpenSettings?: () => void;
  onOpenOnboarding?: () => void;
  className?: string;
}

export default function MorePopover({
  isOpen,
  onClose,
  onNewSession,
  onOpenAddMedia,
  onOpenExport,
  onOpenRawJson,
  onToggleHistory,
  isHistoryOpen = false,
  onOpenSettings,
  onOpenOnboarding,
  className = ''
}: MorePopoverProps) {
  const { theme, toggleTheme } = useTheme();
  const popoverRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

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
        className={`w-64 flex flex-col rounded-2xl bg-white dark:bg-[#121318] border border-neutral-200/90 dark:border-white/[0.08] shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 font-sans text-neutral-900 dark:text-white select-none ${className}`}
        role="dialog"
        aria-label="More Options"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-200/80 dark:border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 flex items-center justify-center">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold tracking-tight text-neutral-900 dark:text-white">
              More Options
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

        {/* Action Items List */}
        <div className="p-1.5 space-y-0.5 overflow-y-auto max-h-[380px] scrollbar-thin">
          {/* 1. New Chat Session */}
          {onNewSession && (
            <button
              onClick={() => {
                onClose();
                onNewSession();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left group"
            >
              <SquarePen className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              <div className="flex-1 truncate">
                <p className="font-medium text-xs leading-none">New Chat Session</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Start fresh conversation</p>
              </div>
            </button>
          )}

          {/* 2. Upload Document */}
          {onOpenAddMedia && (
            <button
              onClick={() => {
                onClose();
                onOpenAddMedia();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left group"
            >
              <Upload className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              <div className="flex-1 truncate">
                <p className="font-medium text-xs leading-none">Upload Document</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">PDF, DOCX, or text files</p>
              </div>
            </button>
          )}

          {/* 3. Export Memo */}
          {onOpenExport && (
            <button
              onClick={() => {
                onClose();
                onOpenExport();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left group"
            >
              <Download className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              <div className="flex-1 truncate">
                <p className="font-medium text-xs leading-none">Export Structured Memo</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Download analysis report</p>
              </div>
            </button>
          )}

          {/* 4. Inspect Raw JSON */}
          {onOpenRawJson && (
            <button
              onClick={() => {
                onClose();
                onOpenRawJson();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left group"
            >
              <FileJson className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              <div className="flex-1 truncate">
                <p className="font-medium text-xs leading-none">Inspect Raw JSON</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">View raw document data</p>
              </div>
            </button>
          )}

          <div className="border-t border-neutral-200/60 dark:border-white/[0.06] my-1" />

          {/* 5. Document Library */}
          {onToggleHistory && (
            <button
              onClick={() => {
                onClose();
                onToggleHistory();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left group"
            >
              <Library className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-xs leading-none">Document Library</p>
                  {isHistoryOpen && (
                    <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border border-emerald-500/20">
                      OPEN
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">Toggle documents panel</p>
              </div>
            </button>
          )}

          {/* 6. Settings & Config */}
          {onOpenSettings && (
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left group"
            >
              <Settings className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              <div className="flex-1 truncate">
                <p className="font-medium text-xs leading-none">Settings & Keys</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Configure API & preferences</p>
              </div>
            </button>
          )}

          {/* 7. Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left group"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            )}
            <div className="flex-1 truncate">
              <p className="font-medium text-xs leading-none">
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                {theme === 'dark' ? 'Currently Dark' : 'Currently Light'}
              </p>
            </div>
          </button>

          {/* 8. Interactive Tour */}
          {onOpenOnboarding && (
            <button
              onClick={() => {
                onClose();
                onOpenOnboarding();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left group"
            >
              <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div className="flex-1 truncate">
                <p className="font-medium text-xs leading-none">Interactive Tour</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Product walkthrough</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import AgentOneSymbol from '@/components/brand/AgentOneSymbol';
import {
  MoreHorizontal,
  Home,
  Columns,
  Download,
  Sun,
  Moon,
  Menu,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  X,
  Sidebar,
  Puzzle,
  ChevronDown,
  Bot,
  Brain,
  Network,
  Scale,
  Activity,
  Users,
  LayoutTemplate,
  FileJson,
  Plus
} from 'lucide-react';
import { DocumentDomain, DocumentAnalysis } from '@/lib/types';

interface HeaderProps {
  activeDomain: DocumentDomain;
  currentDoc: DocumentAnalysis | null;
  isSplitView: boolean;
  onToggleSplitView: () => void;
  onOpenExportModal: () => void;
  onResetDoc?: () => void;
  isHistoryOpen?: boolean;
  onToggleHistory?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenSettings?: () => void;
  onOpenOnboarding?: () => void;
  onOpenAgentGallery?: () => void;
  onOpenTemplates?: () => void;
  onOpenRawJson?: () => void;
  onToggleLeftSidebar?: () => void;
  isLeftSidebarOpen?: boolean;
  activeWorkspaceTab?: 'chat' | 'intelligence' | 'graph' | 'compare' | 'activity' | 'projects';
  onSelectWorkspaceTab?: (tab: 'chat' | 'intelligence' | 'graph' | 'compare' | 'activity') => void;
  agentActivityCount?: number;
}

export default function Header({
  activeDomain,
  currentDoc,
  isSplitView,
  onToggleSplitView,
  onOpenExportModal,
  onResetDoc,
  isHistoryOpen = false,
  onToggleHistory,
  onOpenCommandPalette,
  onOpenSettings,
  onOpenOnboarding,
  onOpenAgentGallery,
  onOpenTemplates,
  onOpenRawJson,
  onToggleLeftSidebar,
  isLeftSidebarOpen,
  activeWorkspaceTab = 'chat',
  onSelectWorkspaceTab,
  agentActivityCount = 0
}: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showPluginsMenu, setShowPluginsMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const currentTitle = currentDoc ? currentDoc.name : 'Hello Support Assistant';

  return (
    <header className="h-14 bg-white/95 dark:bg-[#0d0f15]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-white/[0.07] px-3 sm:px-5 flex items-center justify-between gap-3 z-20 select-none transition-colors duration-200 w-full max-w-[100vw]">
      {/* Left: Mobile Sidebar Trigger + Agent One Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
        {onToggleLeftSidebar && (
          <button
            onClick={onToggleLeftSidebar}
            className="md:hidden p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Clean Breadcrumb: Home / Title */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0 text-xs sm:text-sm">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium group"
            title="Agent One Home"
          >
            <AgentOneSymbol size={18} className="group-hover:scale-105 transition-transform" />
            <span className="hidden xs:inline">Home</span>
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700 font-sans text-xs select-none">
            /
          </span>
          <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-[90px] xs:max-w-[160px] sm:max-w-xs md:max-w-md">
            {currentTitle}
          </span>
        </nav>
      </div>

      {/* Right: Workspace Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Workspace Plugins Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowPluginsMenu(!showPluginsMenu);
              setShowMoreMenu(false);
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              showPluginsMenu || (activeWorkspaceTab && activeWorkspaceTab !== 'chat')
                ? 'border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-[#00FF85] font-semibold'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14151b] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
            title="Workspace Plugins"
            aria-label="Workspace Plugins"
          >
            <Puzzle className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
            <span>Plugins</span>
            {agentActivityCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold bg-emerald-500/20 text-emerald-700 dark:text-[#00FF85]">
                {agentActivityCount}
              </span>
            )}
            <ChevronDown
              className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
                showPluginsMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showPluginsMenu && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/10"
                onClick={() => setShowPluginsMenu(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-10 w-72 p-2 rounded-2xl bg-white dark:bg-[#14151a] border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 font-sans">
                <div className="px-2.5 py-1 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  Active Plugins & Intelligence
                </div>

                {/* 1. AI Analyst */}
                <button
                  onClick={() => {
                    setShowPluginsMenu(false);
                    if (onSelectWorkspaceTab) onSelectWorkspaceTab('chat');
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    activeWorkspaceTab === 'chat'
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-xs leading-none">AI Analyst</p>
                      <p className="text-[10px] text-neutral-400 mt-1 truncate">Multimodal chat & reasoning engine</p>
                    </div>
                  </div>
                  {activeWorkspaceTab === 'chat' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  )}
                </button>

                {/* 2. Deep Intelligence */}
                <button
                  onClick={() => {
                    setShowPluginsMenu(false);
                    if (onSelectWorkspaceTab) onSelectWorkspaceTab('intelligence');
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    activeWorkspaceTab === 'intelligence'
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-xs leading-none">Deep Intelligence</p>
                      <p className="text-[10px] text-neutral-400 mt-1 truncate">Executive audit & key metrics</p>
                    </div>
                  </div>
                  {activeWorkspaceTab === 'intelligence' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  )}
                </button>

                {/* 3. GraphRAG Explorer */}
                <button
                  onClick={() => {
                    setShowPluginsMenu(false);
                    if (onSelectWorkspaceTab) onSelectWorkspaceTab('graph');
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    activeWorkspaceTab === 'graph'
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Network className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-xs leading-none">GraphRAG Explorer</p>
                      <p className="text-[10px] text-neutral-400 mt-1 truncate">Knowledge graph & entity relationships</p>
                    </div>
                  </div>
                  {activeWorkspaceTab === 'graph' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                  )}
                </button>

                {/* 4. Cross-Doc Diff */}
                <button
                  onClick={() => {
                    setShowPluginsMenu(false);
                    if (onSelectWorkspaceTab) onSelectWorkspaceTab('compare');
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    activeWorkspaceTab === 'compare'
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-xs leading-none">Cross-Doc Diff</p>
                      <p className="text-[10px] text-neutral-400 mt-1 truncate">Comparative document matrix</p>
                    </div>
                  </div>
                  {activeWorkspaceTab === 'compare' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  )}
                </button>

                {/* 5. Agent Activity */}
                <button
                  onClick={() => {
                    setShowPluginsMenu(false);
                    if (onSelectWorkspaceTab) onSelectWorkspaceTab('activity');
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    activeWorkspaceTab === 'activity'
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-xs leading-none">Agent Activity</p>
                        {agentActivityCount > 0 && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded-full font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                            {agentActivityCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1 truncate">Autonomous agent execution trace</p>
                    </div>
                  </div>
                  {activeWorkspaceTab === 'activity' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                  )}
                </button>

                {/* 6. Agent Gallery */}
                <button
                  onClick={() => {
                    setShowPluginsMenu(false);
                    if (onOpenAgentGallery) onOpenAgentGallery();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-xs leading-none">Agent Gallery</p>
                      <p className="text-[10px] text-neutral-400 mt-1 truncate">Specialized personas for Finance, Legal, Research</p>
                    </div>
                  </div>
                </button>

                {/* 7. Templates & Lenses */}
                <button
                  onClick={() => {
                    setShowPluginsMenu(false);
                    if (onOpenTemplates) onOpenTemplates();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                      <LayoutTemplate className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-xs leading-none">Templates & Lenses</p>
                      <p className="text-[10px] text-neutral-400 mt-1 truncate">Pre-engineered audit routines & prompt lenses</p>
                    </div>
                  </div>
                </button>

                {/* Divider */}
                <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                {/* 8. View Document */}
                <button
                  onClick={() => {
                    setShowPluginsMenu(false);
                    onToggleSplitView();
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    isSplitView
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Columns className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-xs leading-none">
                        {isSplitView ? 'Hide Document' : 'View Document'}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1 truncate">
                        {isSplitView ? 'Close split-view document canvas' : 'Open PDF side-by-side split view'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isSplitView
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-neutral-400'
                  }`}>
                    {isSplitView ? 'Active' : 'Toggle'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Overflow More Options */}
        <div className="relative hidden">
          <button
            onClick={() => {
              setShowMoreMenu(!showMoreMenu);
              setShowPluginsMenu(false);
            }}
            className="p-1.5 sm:p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="More Options"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMoreMenu && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/10"
                onClick={() => setShowMoreMenu(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-10 w-52 p-1.5 rounded-2xl bg-white dark:bg-[#14151a] border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-1 z-50 animate-in fade-in zoom-in-95">
                {onResetDoc && (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onResetDoc();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-neutral-400" />
                    <span>New Chat Session</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    onOpenExportModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Export Structured Memo</span>
                </button>
                {onOpenRawJson && (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenRawJson();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <FileJson className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Inspect Raw JSON</span>
                  </button>
                )}
                {onToggleHistory && (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onToggleHistory();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <Sidebar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{isHistoryOpen ? 'Hide Files Drawer' : 'Show Files Drawer'}</span>
                  </button>
                )}
                {onOpenOnboarding && (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenOnboarding();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Product Tour</span>
                  </button>
                )}
                {onOpenSettings && (
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Settings & API</span>
                  </button>
                )}
                <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left cursor-pointer pt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Document Split View (when document is actively loaded) */}
        {currentDoc && onToggleSplitView && (
          <button
            onClick={onToggleSplitView}
            className={`w-8 h-8 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer ${
              isSplitView ? 'bg-neutral-900 text-white dark:bg-white/10 dark:text-white dark:border dark:border-white/10 font-medium' : ''
            }`}
            title={isSplitView ? 'Close Split View' : 'Toggle Document Split View'}
            aria-label="Toggle Document Split View"
          >
            <Sidebar className="w-4 h-4 rotate-180" />
          </button>
        )}

        {/* Right Collapsible Sidebar Toggle (Files & Recents) */}
        {onToggleHistory && (
          <button
            onClick={onToggleHistory}
            className={`w-8 h-8 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer ${
              isHistoryOpen ? 'bg-neutral-900 text-white dark:bg-white/10 dark:text-white dark:border dark:border-white/10 font-medium' : ''
            }`}
            title={isHistoryOpen ? 'Hide Files Drawer' : 'Show Files Drawer'}
            aria-label="Toggle Files and Recents Drawer"
          >
            <Columns className="w-4 h-4" />
          </button>
        )}

        {/* Workspace/Home Button */}
        <Link
          href="/"
          className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14151b] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          title="Back to Home"
        >
          <Home className="w-3.5 h-3.5 text-neutral-500" />
          <span className="hidden xs:inline">Home</span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-8 h-8 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-600" />}
        </button>
      </div>
    </header>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/brand/Logo';
import {
  SquarePen,
  Library,
  Puzzle,
  Folder,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  ChevronsUpDown,
  LogOut,
  Briefcase,
  Scale,
  CreditCard,
  ShieldCheck,
  Landmark,
  BookOpen,
  FileText,
  ShieldAlert,
  GripVertical,
  UploadCloud,
  Plus,
  Trash2
} from 'lucide-react';
import { DocumentAnalysis, DocumentDomain, MediaType } from '@/lib/types';
import { DEMO_DOCUMENTS, DemoDocument } from '@/lib/demoDocuments';
import PluginPopover from '@/components/ui/PluginPopover';
import MorePopover from '@/components/ui/MorePopover';
import { SpecializedAgent } from '@/components/ui/AgentGalleryModal';

interface LeftSidebarProps {
  currentDoc?: DocumentAnalysis | null;
  docsList?: DocumentAnalysis[];
  onSelectDoc?: (doc: DocumentAnalysis) => void;
  onSelectDemoDoc?: (doc: DocumentAnalysis) => void;
  onNewSession?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNewAudit?: () => void;
  activeDomain?: DocumentDomain;
  onSelectDomain?: (domain: DocumentDomain) => void;
  onOpenAddMedia?: (category?: MediaType | 'all') => void;
  onOpenSearch?: () => void;
  isHistoryOpen?: boolean;
  onToggleHistory?: () => void;
  activeNav?: string;
  onSelectNav?: (navId: string) => void;
  activeAgentId?: string;
  onSelectAgent?: (agent: SpecializedAgent) => void;
  onOpenSettings?: () => void;
  onOpenExport?: () => void;
  onOpenRawJson?: () => void;
  onOpenOnboarding?: () => void;
  onUploadFile?: (file: File) => void;
  onRemoveDoc?: (docId: string) => void;
}

export default function LeftSidebar({
  currentDoc,
  docsList = [],
  onSelectDoc,
  onSelectDemoDoc,
  onNewSession,
  isCollapsed,
  onToggleCollapse,
  onNewAudit,
  activeDomain,
  onSelectDomain,
  onOpenAddMedia,
  onOpenSearch,
  isHistoryOpen = false,
  onToggleHistory,
  activeNav = 'new-chat',
  onSelectNav,
  activeAgentId,
  onSelectAgent,
  onOpenSettings,
  onOpenExport,
  onOpenRawJson,
  onOpenOnboarding,
  onUploadFile,
  onRemoveDoc
}: LeftSidebarProps) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCollapsedFlyout, setShowCollapsedFlyout] = useState(false);
  const [draggedDocId, setDraggedDocId] = useState<string | null>(null);
  const [showPluginPopover, setShowPluginPopover] = useState(false);
  const [showMorePopover, setShowMorePopover] = useState(false);
  const [isFileDragOver, setIsFileDragOver] = useState(false);

  // User uploaded documents excluding any dummy chat records
  const userDocuments = docsList.filter((d) => !d.id.startsWith('chat_'));
  // Total available library documents: user docs + demo docs
  const allLibraryDocs = [
    ...userDocuments,
    ...DEMO_DOCUMENTS.filter((demo) => !userDocuments.some((u) => u.id === demo.id))
  ];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return Briefcase;
      case 'Scale':
        return Scale;
      case 'CreditCard':
        return CreditCard;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Landmark':
        return Landmark;
      case 'BookOpen':
        return BookOpen;
      case 'ShieldAlert':
        return ShieldAlert;
      default:
        return FileText;
    }
  };

  const handleDragStart = (e: React.DragEvent, doc: DemoDocument) => {
    setDraggedDocId(doc.id);
    e.dataTransfer.setData('application/x-agentone-demo-doc', doc.id);
    e.dataTransfer.setData('text/plain', doc.name);
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: doc.id, name: doc.name, category: doc.demoCategory, format: doc.fileFormat })
    );
    e.dataTransfer.effectAllowed = 'copyMove';

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('agentone:demo-doc-drag-start', {
          detail: { docId: doc.id, name: doc.name, category: doc.demoCategory }
        })
      );
    }
  };

  const handleDragEnd = () => {
    setDraggedDocId(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('agentone:demo-doc-drag-end'));
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleCreateNew = () => {
    if (onNewSession) onNewSession();
    else if (onNewAudit) onNewAudit();
    if (onSelectNav) onSelectNav('new-chat');
  };

  const isLibraryActive = activeNav === 'library' || isHistoryOpen || Boolean(currentDoc);

  // Exact 5 items matching the user's requested navigation specification
  const menuItems = [
    {
      id: 'new-chat',
      label: 'New chat',
      icon: SquarePen,
      badge: null,
      hasChevron: false,
      onClick: () => {
        setShowPluginPopover(false);
        setShowMorePopover(false);
        handleCreateNew();
      }
    },
    {
      id: 'library',
      label: 'Library',
      icon: Library,
      badge: isLibraryActive ? 'OPEN' : null,
      isActive: isLibraryActive,
      hasChevron: false,
      onClick: () => {
        setShowPluginPopover(false);
        setShowMorePopover(false);
        if (onToggleHistory) onToggleHistory();
        if (onSelectNav) onSelectNav('library');
      }
    },
    {
      id: 'plugins',
      label: 'Plugin',
      icon: Puzzle,
      badge: activeAgentId && activeAgentId !== 'ai-analyst' ? 'ACTIVE' : null,
      hasChevron: true,
      onClick: () => {
        setShowPluginPopover((prev) => !prev);
        setShowMorePopover(false);
      }
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Folder,
      badge: null,
      isActive: activeNav === 'projects',
      hasChevron: false,
      onClick: () => {
        setShowPluginPopover(false);
        setShowMorePopover(false);
        if (onSelectNav) onSelectNav('projects');
      }
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      badge: null,
      hasChevron: false,
      onClick: () => {
        setShowMorePopover((prev) => !prev);
        setShowPluginPopover(false);
      }
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {!isCollapsed && (
        <div
          onClick={onToggleCollapse}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-neutral-50/90 dark:bg-[#0d0f15] text-neutral-800 dark:text-neutral-200 border-r border-neutral-200/80 dark:border-white/[0.07] transition-all duration-300 ease-in-out select-none z-50 h-full font-sans flex flex-col ${
          isCollapsed
            ? 'hidden md:flex md:w-16 relative'
            : 'fixed inset-y-0 left-0 w-[270px] max-w-[85vw] md:relative md:w-64 lg:w-[260px]'
        }`}
      >
        {/* 1. Header (Logo + Collapse Button) */}
        <div
          className={`flex items-center h-14 border-b border-neutral-200/80 dark:border-neutral-800/80 flex-shrink-0 ${
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          {isCollapsed ? (
            <button
              onClick={onToggleCollapse}
              className="w-9 h-9 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer group"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <PanelLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <>
              <Link href="/" className="flex items-center overflow-hidden group min-w-0 pr-2">
                <Logo size="sm" showTagline={true} taglineClassName="text-[8px] truncate max-w-[155px]" />
              </Link>

              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* 2. Navigation Menu: Exactly [New chat, Library, Plugin, Projects, More] */}
        <div className="px-2.5 py-3 space-y-1.5 flex-shrink-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isPluginOpen = item.id === 'plugins' && showPluginPopover;
            const isMoreOpen = item.id === 'more' && showMorePopover;
            const isSelected = item.id === 'library'
              ? item.isActive
              : item.id === 'projects'
              ? (activeNav === 'projects' || item.isActive)
              : (isPluginOpen || isMoreOpen || activeNav === item.id);

            return (
              <div key={item.id} className="relative">
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[13.5px] font-medium transition-all duration-150 cursor-pointer select-none text-left ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white/[0.09] dark:text-white dark:border dark:border-white/[0.09] shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-white/[0.05]'
                  } ${isCollapsed ? 'justify-center px-1 py-2.5 rounded-xl' : ''}`}
                  title={item.label}
                  aria-expanded={item.id === 'plugins' ? showPluginPopover : item.id === 'more' ? showMorePopover : undefined}
                >
                  <Icon
                    className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'text-white dark:text-[#00FF85] stroke-[2]'
                        : 'text-neutral-500 dark:text-neutral-400 stroke-[1.8]'
                    }`}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="truncate flex-1 tracking-tight">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border border-emerald-500/20 ml-auto uppercase">
                          {item.badge}
                        </span>
                      )}
                      {item.hasChevron && (
                        <ChevronRight
                          className={`w-4 h-4 text-neutral-400 dark:text-neutral-500 ml-auto flex-shrink-0 transition-transform duration-150 ${
                            isPluginOpen ? 'rotate-90 text-emerald-500' : ''
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Plugin Popover directly next to Plugin button */}
                {item.id === 'plugins' && (
                  <PluginPopover
                    isOpen={showPluginPopover}
                    onClose={() => setShowPluginPopover(false)}
                    activeAgentId={activeAgentId}
                    onSelectAgent={onSelectAgent}
                    currentDoc={currentDoc}
                    className="absolute left-full top-0 ml-2.5 max-md:left-2 max-md:top-full max-md:mt-1 max-md:ml-0 max-md:w-[calc(100vw-32px)] max-md:max-w-[320px]"
                  />
                )}

                {/* More Popover directly next to More button */}
                {item.id === 'more' && (
                  <MorePopover
                    isOpen={showMorePopover}
                    onClose={() => setShowMorePopover(false)}
                    onNewSession={onNewSession}
                    onOpenAddMedia={onOpenAddMedia}
                    onOpenExport={onOpenExport}
                    onOpenRawJson={onOpenRawJson}
                    onToggleHistory={onToggleHistory}
                    isHistoryOpen={isHistoryOpen}
                    onOpenSettings={onOpenSettings}
                    onOpenOnboarding={onOpenOnboarding}
                    className="absolute left-full top-0 ml-2.5 max-md:left-2 max-md:top-full max-md:mt-1 max-md:ml-0 max-md:w-[calc(100vw-32px)] max-md:max-w-[280px]"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 2b. All Documents / Library Section (Visually Open, No Box/Card Container, Supports Drag & Drop) */}
        {!isCollapsed && (
          <div
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes('Files')) {
                e.preventDefault();
                e.stopPropagation();
                setIsFileDragOver(true);
              }
            }}
            onDragEnter={(e) => {
              if (e.dataTransfer.types.includes('Files')) {
                e.preventDefault();
                e.stopPropagation();
                setIsFileDragOver(true);
              }
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsFileDragOver(false);
              }
            }}
            onDrop={(e) => {
              if (e.dataTransfer.types.includes('Files')) {
                e.preventDefault();
                e.stopPropagation();
                setIsFileDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onUploadFile) {
                  Array.from(e.dataTransfer.files).forEach((file) => onUploadFile(file));
                }
              }
            }}
            className={`px-3 mb-2 flex-1 min-h-0 flex flex-col relative transition-all duration-150 ${
              isFileDragOver
                ? 'rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-500/[0.06] p-2'
                : ''
            }`}
          >
            {/* Hidden file input for file selection button */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0 && onUploadFile) {
                  Array.from(e.target.files).forEach((file) => onUploadFile(file));
                  e.target.value = '';
                }
              }}
              accept=".pdf,.docx,.txt,.csv,.json,.xlsx"
            />

            {/* Drag & drop upload prompt overlay */}
            {isFileDragOver && (
              <div className="absolute inset-0 z-30 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5 p-4 text-center border-2 border-dashed border-emerald-500 pointer-events-none">
                <UploadCloud className="w-7 h-7 text-emerald-600 dark:text-[#00FF85] animate-bounce" />
                <p className="text-xs font-bold text-emerald-700 dark:text-[#00FF85]">
                  Drop files to upload to All Documents
                </p>
                <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
                  PDF, DOCX, TXT, CSV supported
                </p>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between gap-1.5 mb-1 px-0.5 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 font-mono">
                  All Documents
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border border-emerald-500/20">
                  {allLibraryDocs.length} Available
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1 rounded-md text-neutral-400 hover:text-emerald-600 dark:hover:text-[#00FF85] hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Upload files to All Documents"
                aria-label="Upload file"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 px-0.5 mb-2 leading-tight flex-shrink-0">
              Drag to chat drop area or drop files here to upload
            </p>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 scrollbar-thin min-h-0">
              {allLibraryDocs.map((doc: any) => {
                const DocIcon = getCategoryIcon(doc.iconName || 'FileText');
                const isDocActive = currentDoc?.id?.startsWith(doc.id);
                const fileFormat = doc.fileFormat || (doc.name.endsWith('.docx') ? 'DOCX' : 'PDF');
                const isDocx = fileFormat === 'DOCX';
                const isDragging = draggedDocId === doc.id;
                const isUserUploaded = !doc.isDemo && !DEMO_DOCUMENTS.some((d) => d.id === doc.id);

                return (
                  <div
                    key={doc.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, doc)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      if (onSelectDemoDoc && doc.isDemo) onSelectDemoDoc(doc);
                      else if (onSelectDoc) onSelectDoc(doc);
                    }}
                    className={`px-2.5 py-2 rounded-xl transition-all text-left cursor-grab active:cursor-grabbing group select-none flex items-center justify-between gap-2.5 ${
                      isDragging
                        ? 'opacity-40 border-dashed border-emerald-500 scale-98'
                        : isDocActive
                        ? 'bg-emerald-500/10 dark:bg-[#00FF85]/10 text-emerald-900 dark:text-white border border-emerald-500/30'
                        : 'hover:bg-neutral-200/50 dark:hover:bg-white/[0.06] border border-transparent'
                    }`}
                    title={doc.name}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                          isDocActive
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/30'
                            : isDocx
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-neutral-200/50 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 border border-neutral-300/40 dark:border-white/[0.08]'
                        }`}
                      >
                        <DocIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-[#00FF85] transition-colors truncate block min-w-0 flex-1 select-none leading-normal">
                        {doc.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isUserUploaded && onRemoveDoc && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveDoc(doc.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-rose-500/10 hover:text-rose-500 transition-all text-neutral-400 cursor-pointer"
                          title="Delete file"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <GripVertical className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2c. Collapsed Mode Flyout for All Documents */}
        {isCollapsed && showCollapsedFlyout && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setShowCollapsedFlyout(false)}
            />
            <div className="absolute left-16 top-12 w-80 max-h-[85vh] flex flex-col p-3 rounded-2xl bg-white dark:bg-[#14151a] border border-neutral-200 dark:border-neutral-800 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-900 dark:text-white">
                    All Documents
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border border-emerald-500/20">
                    {allLibraryDocs.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowCollapsedFlyout(false)}
                  className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2">
                Drag to chat input or click to attach instantly
              </p>
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                {allLibraryDocs.map((doc: any) => {
                  const DocIcon = getCategoryIcon(doc.iconName || 'FileText');
                  const isDocActive = currentDoc?.id?.startsWith(doc.id);
                  const isDocx = doc.name.endsWith('.docx') || doc.fileFormat === 'DOCX';
                  return (
                    <div
                      key={doc.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, doc)}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        setShowCollapsedFlyout(false);
                        if (onSelectDemoDoc && doc.isDemo) onSelectDemoDoc(doc);
                        else if (onSelectDoc) onSelectDoc(doc);
                      }}
                      className={`px-2.5 py-2 rounded-xl transition-all text-left cursor-grab active:cursor-grabbing group select-none flex items-center justify-between gap-2.5 ${
                        isDocActive
                          ? 'bg-emerald-500/10 dark:bg-[#00FF85]/10 text-emerald-900 dark:text-white border border-emerald-500/30'
                          : 'hover:bg-neutral-200/50 dark:hover:bg-white/[0.06] border border-transparent'
                      }`}
                      title={doc.name}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                            isDocActive
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/30'
                              : isDocx
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-neutral-200/50 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 border border-neutral-300/40 dark:border-white/[0.08]'
                          }`}
                        >
                          <DocIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-[#00FF85] transition-colors truncate block min-w-0 flex-1 select-none leading-normal">
                          {doc.name}
                        </span>
                      </div>
                      <GripVertical className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* 3. Empty Flex Spacer (when sidebar is collapsed) */}
        {isCollapsed && <div className="flex-1" />}

        {/* 4. Bottom User Profile Section */}
        <div className="p-2.5 border-t border-neutral-200/80 dark:border-neutral-800/80 flex-shrink-0 relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-full flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-neutral-200/60 dark:hover:bg-neutral-800/70 transition-colors cursor-pointer text-left ${
              isCollapsed ? 'justify-center p-1' : ''
            }`}
            title="User Profile & Settings"
          >
            {/* Minimalist Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 dark:from-neutral-700 dark:to-neutral-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs border border-neutral-300 dark:border-neutral-600">
              {user?.name ? user.name[0].toUpperCase() : 'P'}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {user?.name || 'Pranay kumar'}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {user?.email || 'pranay.b9106@gmail.com'}
                </p>
              </div>
            )}

            {!isCollapsed && <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />}
          </button>

          {/* User Dropdown Popup */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/10"
                onClick={() => setShowUserMenu(false)}
                aria-hidden="true"
              />
              <div
                className={`p-1.5 rounded-2xl bg-white dark:bg-[#14151a] border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-1 z-50 animate-in fade-in zoom-in-95 ${
                  isCollapsed
                    ? 'absolute bottom-2 left-14 w-52'
                    : 'absolute bottom-14 left-2 right-2'
                }`}
              >
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {user?.name || 'Pranay kumar'}
                  </p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                    {user?.email || 'pranay.b9106@gmail.com'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

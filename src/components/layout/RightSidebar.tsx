'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Download,
  PanelRightClose,
  Plus,
  Trash2,
  ChevronDown,
  GripVertical,
  MessageSquare,
  Clock,
  UploadCloud,
  FileCheck
} from 'lucide-react';
import { DocumentAnalysis, SavedConversation } from '@/lib/types';

export interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  // Conversations (Chat History Memory)
  conversations?: SavedConversation[];
  activeConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onNewChat?: () => void;
  // Documents & Files
  currentDoc?: DocumentAnalysis | null;
  docs?: DocumentAnalysis[];
  onSelectDoc?: (doc: DocumentAnalysis) => void;
  onClearHistory?: () => void;
  onRemoveDoc?: (docId: string) => void;
  onNewAudit?: () => void;
  onUploadFile?: (file: File) => void;
  onReorderDocs?: (newDocs: DocumentAnalysis[]) => void;
  onOpenAddMedia?: () => void;
  finalOutputs?: Array<{ id: string; title: string; createdAt: string; type: string }>;
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Just now';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

export default function RightSidebar({
  isOpen,
  onToggle,
  conversations = [],
  activeConversationId = null,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  currentDoc,
  docs = [],
  onSelectDoc,
  onClearHistory,
  onRemoveDoc,
  onNewAudit,
  onUploadFile,
  onReorderDocs,
  onOpenAddMedia,
  finalOutputs = []
}: RightSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecentsOpen, setIsRecentsOpen] = useState(true);
  const [isFinalOutputsOpen, setIsFinalOutputsOpen] = useState(true);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocumentAnalysis | null>(null);
  const [convToDelete, setConvToDelete] = useState<SavedConversation | null>(null);
  const [draggedDocIndex, setDraggedDocIndex] = useState<number | null>(null);
  const [dragOverDocIndex, setDragOverDocIndex] = useState<number | null>(null);
  const [isDraggingFileOver, setIsDraggingFileOver] = useState(false);
  const [isButtonDragOver, setIsButtonDragOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (docToDelete) setDocToDelete(null);
        if (convToDelete) setConvToDelete(null);
      }
    };
    if (docToDelete || convToDelete) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [docToDelete, convToDelete]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleExportDoc = () => {
    if (!currentDoc) return;
    const blob = new Blob([JSON.stringify(currentDoc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDoc.name}_audit_memo.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Document reordering handlers
  const handleDocDragStart = (e: React.DragEvent, index: number, doc: DocumentAnalysis) => {
    setDraggedDocIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', doc.name);
    e.dataTransfer.setData('application/json', JSON.stringify({ id: doc.id, name: doc.name, domain: doc.detectedDomain }));
    e.dataTransfer.setData('nexora/document-id', doc.id);
  };

  const handleDocDragOver = (e: React.DragEvent, index: number) => {
    if (draggedDocIndex !== null) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverDocIndex !== index) {
        setDragOverDocIndex(index);
      }
    }
  };

  const handleDocDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedDocIndex !== null && draggedDocIndex !== targetIndex) {
      const updated = [...docs];
      const [moved] = updated.splice(draggedDocIndex, 1);
      updated.splice(targetIndex, 0, moved);
      if (onReorderDocs) {
        onReorderDocs(updated);
      }
    }
    setDraggedDocIndex(null);
    setDragOverDocIndex(null);
  };

  const handleDocDragEnd = () => {
    setDraggedDocIndex(null);
    setDragOverDocIndex(null);
  };

  // External files drag and drop upload
  const handleFilesDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (!isDraggingFileOver) {
        setIsDraggingFileOver(true);
      }
    }
  };

  const handleFilesDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingFileOver(false);
    }
  };

  const handleFilesDrop = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFileOver(false);
      setIsButtonDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onUploadFile) {
        Array.from(e.dataTransfer.files).forEach((file) => {
          onUploadFile(file);
        });
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md,.xlsx,.xls,.csv,.pptx,.png,.jpg,.jpeg,.mp4"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && onUploadFile) {
            onUploadFile(e.target.files[0]);
          }
        }}
      />

      {/* Mobile Backdrop when open */}
      <div
        onClick={onToggle}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
      />

      <aside
        onDragOver={handleFilesDragOver}
        onDragLeave={handleFilesDragLeave}
        onDrop={handleFilesDrop}
        className={`bg-neutral-50/90 dark:bg-[#0d0f15] text-neutral-800 dark:text-neutral-200 border-l border-neutral-200/80 dark:border-white/[0.07] backdrop-blur-md transition-all duration-300 ease-in-out select-none z-40 md:z-30 h-full font-sans flex flex-col w-[280px] lg:w-[300px] flex-shrink-0 fixed md:relative top-0 right-0 bottom-0 md:top-auto md:right-auto md:bottom-auto shadow-2xl md:shadow-none ${
          isOpen ? 'flex' : 'hidden'
        } ${isDraggingFileOver ? 'ring-2 ring-emerald-500 ring-inset' : ''}`}
      >
        {/* Full-panel Drag and Drop Upload Indicator */}
        {isDraggingFileOver && (
          <div className="absolute inset-0 z-50 bg-white/95 dark:bg-[#0d0f15]/95 border-2 border-dashed border-emerald-500 rounded-none flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              Drop documents to upload
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-[220px]">
              Supports PDF, Word, JPEG, PNG, and Markdown (.md)
            </p>
          </div>
        )}

        {/* 1. Header: Recents Icon + Title & Action Icons */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-neutral-200/80 dark:border-white/[0.07] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <h2 className="font-semibold text-sm text-neutral-900 dark:text-white">
              Recents
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {onNewChat && (
              <button
                type="button"
                onClick={onNewChat}
                className="w-8 h-8 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
                title="New Chat"
                aria-label="Start new chat"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {currentDoc && (
              <button
                onClick={handleExportDoc}
                className="w-8 h-8 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Download Current Artifact / Memo"
                aria-label="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
              title="Close Recents Drawer"
              aria-label="Close sidebar"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Body: Recents (Chat History) + Final Outputs + Uploads */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Section: Recents (Conversations History) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between py-0.5 select-none">
              <button
                type="button"
                onClick={() => setIsRecentsOpen(!isRecentsOpen)}
                className="flex items-center gap-1.5 text-left cursor-pointer group"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform duration-200 ${
                    isRecentsOpen ? '' : '-rotate-90'
                  }`}
                />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white">
                  Conversations
                </span>
                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 ml-0.5">
                  ({conversations.length})
                </span>
              </button>

              {onNewChat && (
                <button
                  type="button"
                  onClick={onNewChat}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Start New Chat"
                >
                  <Plus className="w-3 h-3" />
                  <span>New</span>
                </button>
              )}
            </div>

            {isRecentsOpen && (
              <div className="animate-in fade-in duration-150">
                {conversations.length === 0 ? (
                  <div className="p-3 text-center rounded-xl bg-neutral-100/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.04]">
                    <MessageSquare className="w-4 h-4 mx-auto mb-1 text-neutral-400 dark:text-neutral-500" />
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      No conversations yet
                    </p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                      Your chat sessions will be preserved here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conv) => {
                      const isActive = activeConversationId === conv.id;
                      return (
                        <div
                          key={conv.id}
                          onClick={() => onSelectConversation && onSelectConversation(conv.id)}
                          className={`group relative flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                            isActive
                              ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#14151b] text-neutral-900 dark:text-white font-medium shadow-xs ring-1 ring-neutral-400/20 dark:ring-white/10'
                              : 'border-transparent hover:bg-neutral-200/60 dark:hover:bg-white/[0.04] text-neutral-700 dark:text-neutral-300'
                          }`}
                          title={conv.title}
                        >
                          <div className="flex items-center gap-2 truncate pr-1 min-w-0 flex-1">
                            <MessageSquare
                              className={`w-3.5 h-3.5 flex-shrink-0 ${
                                isActive ? 'text-emerald-600 dark:text-[#00FF85]' : 'text-neutral-400'
                              }`}
                            />
                            <div className="truncate flex-1 min-w-0">
                              <p className="truncate text-xs font-medium leading-tight">
                                {conv.title || 'Conversation'}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                                <span>{formatRelativeTime(conv.updatedAt || conv.createdAt)}</span>
                                {conv.documentName && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate max-w-[90px]">{conv.documentName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {onDeleteConversation && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConvToDelete(conv);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-neutral-400 hover:text-rose-600 transition-opacity rounded cursor-pointer flex-shrink-0"
                              title="Delete conversation"
                              aria-label={`Delete ${conv.title}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: Final Outputs */}
          <div>
            <button
              type="button"
              onClick={() => setIsFinalOutputsOpen(!isFinalOutputsOpen)}
              className="w-full flex items-center justify-between mb-2 py-0.5 text-left cursor-pointer group select-none"
            >
              <div className="flex items-center gap-1.5">
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform duration-200 ${
                    isFinalOutputsOpen ? '' : '-rotate-90'
                  }`}
                />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white">
                  Final Outputs
                </span>
              </div>
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                {finalOutputs.length}
              </span>
            </button>

            {isFinalOutputsOpen && (
              <div className="animate-in fade-in duration-150">
                {finalOutputs.length === 0 ? (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed pl-5">
                    Final artifacts created by the agent will appear here.
                  </p>
                ) : (
                  <div className="space-y-1.5 mt-2 pl-1">
                    {finalOutputs.map((output) => (
                      <div
                        key={output.id}
                        className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/60 dark:bg-neutral-800/40 text-xs flex items-center justify-between"
                      >
                        <div className="truncate pr-2">
                          <p className="font-medium text-neutral-900 dark:text-white truncate">
                            {output.title}
                          </p>
                          <p className="text-[10px] text-neutral-400">{output.createdAt}</p>
                        </div>
                        <button
                          onClick={handleExportDoc}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-neutral-600 dark:text-neutral-300"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: Uploaded Files (Optional viewer for documents in current workspace) */}
          {docs.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setIsFilesOpen(!isFilesOpen)}
                className="w-full flex items-center justify-between mb-2 py-0.5 text-left cursor-pointer group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform duration-200 ${
                      isFilesOpen ? '' : '-rotate-90'
                    }`}
                  />
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white">
                    Workspace Files
                  </span>
                </div>
                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                  {docs.length}
                </span>
              </button>

              {isFilesOpen && (
                <div className="animate-in fade-in duration-150 space-y-1 pl-1">
                  {docs.map((doc, index) => {
                    const isActive = currentDoc?.id === doc.id;
                    const isBeingDragged = draggedDocIndex === index;
                    const isHoveredTarget = dragOverDocIndex === index;

                    return (
                      <div
                        key={doc.id}
                        draggable
                        onDragStart={(e) => handleDocDragStart(e, index, doc)}
                        onDragOver={(e) => handleDocDragOver(e, index)}
                        onDrop={(e) => handleDocDrop(e, index)}
                        onDragEnd={handleDocDragEnd}
                        onClick={() => onSelectDoc && onSelectDoc(doc)}
                        className={`group relative flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                          isBeingDragged
                            ? 'opacity-30 border-dashed border-emerald-500 scale-[0.98]'
                            : isHoveredTarget
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
                            : isActive
                            ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#14151b] text-neutral-900 dark:text-white font-semibold shadow-xs'
                            : 'border-transparent hover:bg-neutral-200/60 dark:hover:bg-white/[0.04] text-neutral-700 dark:text-neutral-300'
                        }`}
                        title={`Click to open, drag to reorder or drop into chat: ${doc.name}`}
                      >
                        <div className="flex items-center gap-1.5 truncate pr-1 min-w-0">
                          <div
                            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-grab active:cursor-grabbing p-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            title="Drag to reorder"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>
                          <FileText className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                          <span className="truncate">{doc.name}</span>
                        </div>

                        {onRemoveDoc && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDocToDelete(doc);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-neutral-400 hover:text-rose-600 transition-opacity rounded cursor-pointer flex-shrink-0"
                            title="Delete file"
                            aria-label={`Delete ${doc.name}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Quick Upload / Dropzone Action */}
          <button
            onClick={handleUploadClick}
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes('Files')) {
                e.preventDefault();
                setIsButtonDragOver(true);
              }
            }}
            onDragLeave={() => setIsButtonDragOver(false)}
            onDrop={(e) => {
              if (e.dataTransfer.types.includes('Files')) {
                e.preventDefault();
                e.stopPropagation();
                setIsButtonDragOver(false);
                setIsDraggingFileOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0] && onUploadFile) {
                  onUploadFile(e.dataTransfer.files[0]);
                }
              }
            }}
            className={`w-full py-2 px-3 rounded-xl border border-dashed text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isButtonDragOver
                ? 'border-emerald-500 text-emerald-700 dark:text-[#00FF85] bg-emerald-50/70 dark:bg-emerald-950/40 scale-[1.02]'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
            }`}
            title="Click to browse or drop files here"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isButtonDragOver ? 'Drop file to upload' : 'Upload file'}</span>
          </button>
        </div>
      </aside>

      {/* Delete Conversation Confirmation Modal */}
      {convToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setConvToDelete(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-[#14151a] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Delete Conversation?
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-neutral-800 dark:text-neutral-200 break-all">"{convToDelete.title}"</span>? This will permanently remove this chat history.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConvToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteConversation) {
                    onDeleteConversation(convToDelete.id);
                  }
                  setConvToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Document Confirmation Modal */}
      {docToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setDocToDelete(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-doc-title"
        >
          <div
            className="bg-white dark:bg-[#14151a] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 id="delete-doc-title" className="text-sm font-bold text-neutral-900 dark:text-white">
                  Delete Document?
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-neutral-800 dark:text-neutral-200 break-all">"{docToDelete.name}"</span>? This will permanently remove the document and its audit data.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onRemoveDoc) {
                    onRemoveDoc(docToDelete.id);
                  }
                  setDocToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

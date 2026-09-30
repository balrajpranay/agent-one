'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Video,
  FileSpreadsheet,
  Presentation,
  FileCode,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MediaType, AttachedMediaFile } from '@/lib/types';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachFiles: (files: AttachedMediaFile[]) => void;
  initialCategory?: MediaType | 'all';
}

const CATEGORY_TABS: { id: MediaType | 'all'; label: string; icon: React.ElementType; accept: string; description: string }[] = [
  {
    id: 'all',
    label: 'All Media',
    icon: Sparkles,
    accept: '*/*',
    description: 'Upload any supported file: PDFs, images, videos, audio, spreadsheets, or code'
  },
  {
    id: 'pdf',
    label: 'Documents & PDFs',
    icon: FileText,
    accept: '.pdf,.doc,.docx,.txt,.md,.rtf,.odt',
    description: 'Contracts, statements, policies, agreements, reports & filings'
  },
  {
    id: 'image',
    label: 'Photos & Scans',
    icon: ImageIcon,
    accept: '.png,.jpg,.jpeg,.webp,.svg,.gif',
    description: 'Scanned receipts, photo audits, invoice snapshots, whiteboard photos'
  },
  {
    id: 'spreadsheet',
    label: 'Sheets & Tables',
    icon: FileSpreadsheet,
    accept: '.xlsx,.xls,.csv,.tsv',
    description: 'Financial models, balance sheets, invoice rosters, payroll ledgers'
  },
  {
    id: 'video',
    label: 'Video & Audio',
    icon: Video,
    accept: '.mp4,.mov,.webm,.avi,.mkv,.mp3,.wav,.m4a',
    description: 'Video recordings, earnings calls, visual walkthroughs'
  },
  {
    id: 'presentation',
    label: 'Decks & Slides',
    icon: Presentation,
    accept: '.pptx,.ppt,.key',
    description: 'Investor pitch decks, corporate slide decks, strategy briefings'
  },
  {
    id: 'code',
    label: 'Data & Code',
    icon: FileCode,
    accept: '.json,.yaml,.xml,.py,.ts,.js,.html,.css,.log',
    description: 'JSON schemas, logs, YAML configurations & code'
  }
];

export default function AddMediaModal({
  isOpen,
  onClose,
  onAttachFiles,
  initialCategory = 'all'
}: AddMediaModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<MediaType | 'all'>(initialCategory);
  const [stagedFiles, setStagedFiles] = useState<AttachedMediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const detectMediaType = (file: File): MediaType => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (type.startsWith('image/') || /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(name)) return 'image';
    if (type.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv)$/i.test(name)) return 'video';
    if (type.includes('pdf') || /\.pdf$/i.test(name)) return 'pdf';
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv') || /\.(xlsx|xls|csv|tsv)$/i.test(name)) return 'spreadsheet';
    if (type.includes('presentation') || type.includes('powerpoint') || /\.(pptx|ppt|key)$/i.test(name)) return 'presentation';
    if (/\.(json|yaml|yml|xml|py|ts|js|jsx|tsx|html|css|log)$/i.test(name)) return 'code';
    if (/\.(docx|doc|txt|md|rtf)$/i.test(name)) return 'document';
    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const processIncomingFiles = (files: FileList | File[]) => {
    const newItems: AttachedMediaFile[] = Array.from(files).map((file) => {
      const mediaType = detectMediaType(file);
      let previewUrl: string | undefined;
      if (mediaType === 'image') {
        previewUrl = URL.createObjectURL(file);
      }

      return {
        id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        mimeType: file.type || 'application/octet-stream',
        mediaType,
        previewUrl,
        fileObject: file,
        status: 'ready',
        progress: 100
      };
    });

    setStagedFiles((prev) => [...prev, ...newItems]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(e.target.files);
    }
  };

  const handleRemoveStaged = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConfirmAttach = () => {
    if (stagedFiles.length === 0) return;
    onAttachFiles(stagedFiles);
    setStagedFiles([]);
    onClose();
  };

  const currentTabInfo = CATEGORY_TABS.find((t) => t.id === selectedCategory) || CATEGORY_TABS[0];
  const totalStagedSize = stagedFiles.reduce((acc, f) => acc + f.size, 0);

  const getMediaIcon = (mediaType: MediaType) => {
    switch (mediaType) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="w-4 h-4 text-cyan-400" />;
      case 'presentation':
        return <Presentation className="w-4 h-4 text-amber-400" />;
      case 'code':
        return <FileCode className="w-4 h-4 text-blue-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-2xl animate-in fade-in select-none">
      {/* Clickable backdrop */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Liquid Glass Modal Window */}
      <div
        className="relative z-10 w-full max-w-2xl liquid-glass-modal rounded-3xl sm:rounded-[32px] text-white overflow-hidden animate-in zoom-in-95 duration-250 flex flex-col max-h-[92dvh] group shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Chromatic Fluid Lighting (Behind Glass Layer) */}
        <div className="absolute top-0 left-1/4 w-72 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-72 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 px-4 sm:px-7 border-b border-white/[0.12] flex items-center justify-between bg-white/[0.02] flex-shrink-0 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-500/20 border border-white/20 flex items-center justify-center text-blue-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-lg font-bold text-white tracking-tight truncate">
                  Add Media Files
                </h3>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-xs hidden xs:inline-block">
                  Multimodal AI
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300/80 mt-0.5 font-sans truncate">
                Attach documents, spreadsheets, scans, or videos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-md hover:scale-105 touch-target flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liquid Glass Category Filter Pills */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none bg-white/[0.01] flex-shrink-0">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer flex-shrink-0 touch-target ${
                  isSelected
                    ? 'bg-blue-600/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] border border-blue-400/50 scale-[1.02]'
                    : 'bg-white/5 text-slate-300/80 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
          {/* Liquid Glass Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`liquid-glass-dropzone rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all relative overflow-hidden group ${
              isDragging
                ? 'border-blue-400 bg-blue-500/15 ring-4 ring-blue-500/30 scale-[1.01]'
                : 'hover:border-white/35 hover:bg-white/[0.05]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={currentTabInfo.accept}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-white/20 flex items-center justify-center text-blue-300 mb-4 shadow-[0_8px_20px_rgba(37,99,235,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] group-hover:scale-108 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
              Click to browse or drop {currentTabInfo.label.toLowerCase()} here
            </h4>
            <p className="text-xs text-slate-300/80 max-w-md mx-auto leading-relaxed">
              {currentTabInfo.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {['PDFs & Contracts', 'PNG / JPG Images', 'Excel & CSV Ledgers', 'MP4 Videos', 'JSON & Code'].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Staged Files Liquid Glass Cards */}
          {stagedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 px-1 font-mono">
                <span className="font-semibold text-white">
                  Staged Media ({stagedFiles.length})
                </span>
                <span>Total: {formatFileSize(totalStagedSize)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {stagedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-2xl liquid-glass-card flex items-center gap-3 relative group transition-all"
                  >
                    {/* Thumbnail or Icon Box */}
                    {file.previewUrl ? (
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/40 border border-white/15 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.previewUrl}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 shadow-inner">
                        {getMediaIcon(file.mediaType)}
                      </div>
                    )}

                    {/* File Meta */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-slate-400">
                        <span>{file.sizeFormatted}</span>
                        <span>•</span>
                        <span className="uppercase text-blue-400 font-semibold">{file.mediaType}</span>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveStaged(file.id);
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 px-7 border-t border-white/[0.12] bg-white/[0.02] backdrop-blur-2xl flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-300 font-mono">
            {stagedFiles.length > 0 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {stagedFiles.length} file{stagedFiles.length > 1 ? 's' : ''} ready to attach
              </span>
            ) : (
              <span>Select or drop files to attach</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {stagedFiles.length > 0 && (
              <button
                type="button"
                onClick={() => setStagedFiles([])}
                className="px-4 py-2.5 rounded-full text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              disabled={stagedFiles.length === 0}
              onClick={handleConfirmAttach}
              className="liquid-glass-button disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-full text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Attach to AI Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

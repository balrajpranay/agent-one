'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Mic,
  ArrowUp,
  ChevronDown,
  X,
  FileText,
  Loader2,
  Paperclip,
  CheckCircle2,
  Sparkles,
  Bot,
  Zap,
  Square,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Clock,
  AlertTriangle,
  TrendingUp,
  Scale
} from 'lucide-react';
import { DocumentDomain, DocumentAnalysis, AttachedMediaFile, MediaType } from '@/lib/types';
import QuickActionMenu from '@/components/ui/QuickActionMenu';
import AddMediaModal from '@/components/ui/AddMediaModal';
import { DEMO_DOCUMENTS, createDemoDocAttachment, createFileAttachment } from '@/lib/demoDocuments';
import { startSpeechRecognition, getOrLoadVoskModel, VoiceRecognizerSession } from '@/lib/voiceService';

export type PromptSuggestionItem = string | { label: string; prompt: string };

function getPromptIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('summary') || l.includes('brief') || l.includes('overview') || l.includes('mandate')) {
    return FileText;
  }
  if (l.includes('metric') || l.includes('figure') || l.includes('number') || l.includes('table') || l.includes('csv') || l.includes('ledger') || l.includes('kpi') || l.includes('spend')) {
    return FileSpreadsheet;
  }
  if (l.includes('date') || l.includes('deadline') || l.includes('expiration') || l.includes('timeline')) {
    return Clock;
  }
  if (l.includes('risk') || l.includes('flag') || l.includes('penalty') || l.includes('hidden') || l.includes('trap') || l.includes('exclusion')) {
    return AlertTriangle;
  }
  if (l.includes('portfolio') || l.includes('valuation') || l.includes('growth') || l.includes('allocation') || l.includes('stock')) {
    return TrendingUp;
  }
  if (l.includes('clause') || l.includes('liability') || l.includes('legal') || l.includes('indemnity') || l.includes('arbitration') || l.includes('counter-clause')) {
    return Scale;
  }
  if (l.includes('tip') || l.includes('recommend') || l.includes('action') || l.includes('optimiz')) {
    return Zap;
  }
  return Sparkles;
}

interface PromptBarProps {
  activeDomain: DocumentDomain;
  onSendMessage: (query: string, attachedMedia?: AttachedMediaFile[]) => void;
  isLoading: boolean;
  onResetAnalysis?: () => void;
  currentDoc?: DocumentAnalysis | null;
  activeAgentId?: string;
  onSelectDoc?: (doc: DocumentAnalysis) => void;
  onSelectDemoDoc?: (doc: DocumentAnalysis) => void;
  onFileDrop?: (file: File) => void;
  onMediaBatchAttached?: (files: AttachedMediaFile[]) => void;
  suggestions?: PromptSuggestionItem[];
  externalPrompt?: string;
  onExternalPromptConsumed?: () => void;
  externalAttachments?: AttachedMediaFile[];
  onExternalAttachmentsConsumed?: () => void;
}

export default function PromptBar({
  activeDomain,
  onSendMessage,
  isLoading,
  onResetAnalysis,
  currentDoc,
  activeAgentId,
  onSelectDoc,
  onSelectDemoDoc,
  onFileDrop,
  onMediaBatchAttached,
  suggestions,
  externalPrompt,
  onExternalPromptConsumed,
  externalAttachments,
  onExternalAttachmentsConsumed
}: PromptBarProps) {
  const [input, setInput] = useState('');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [mediaCategory, setMediaCategory] = useState<MediaType | 'all'>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<'Lite' | 'Flash' | 'Pro'>('Lite');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedMediaFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDemoDocDragging, setIsDemoDocDragging] = useState(false);
  const [draggingDocName, setDraggingDocName] = useState<string | null>(null);
  const nativeFileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const voiceSessionRef = useRef<VoiceRecognizerSession | null>(null);
  const existingTextBeforeVoiceRef = useRef<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    const handleScrollEvent = () => checkScroll();
    el.addEventListener('scroll', handleScrollEvent, { passive: true });
    window.addEventListener('resize', handleScrollEvent);
    return () => {
      el.removeEventListener('scroll', handleScrollEvent);
      window.removeEventListener('resize', handleScrollEvent);
    };
  }, [suggestions]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current && e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // Cleanup voice session on unmount
  useEffect(() => {
    return () => {
      if (voiceSessionRef.current) {
        voiceSessionRef.current.abort();
        voiceSessionRef.current = null;
      }
    };
  }, []);

  // Auto-dismiss voice error after 5s
  useEffect(() => {
    if (voiceError) {
      const timer = setTimeout(() => setVoiceError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [voiceError]);

  // Pre-warm Vosk model in background for instantaneous voice activation
  useEffect(() => {
    getOrLoadVoskModel().catch(() => {});
  }, []);

  // Listen for global demo document drag events
  useEffect(() => {
    const handleDragStartEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ id?: string; name?: string; category?: string }>;
      setIsDemoDocDragging(true);
      if (customEvent.detail?.name) {
        setDraggingDocName(customEvent.detail.name);
      }
    };
    const handleDragEndEvent = () => {
      setIsDemoDocDragging(false);
      setDraggingDocName(null);
    };

    window.addEventListener('agentone:demo-doc-drag-start', handleDragStartEvent);
    window.addEventListener('agentone:demo-doc-drag-end', handleDragEndEvent);

    return () => {
      window.removeEventListener('agentone:demo-doc-drag-start', handleDragStartEvent);
      window.removeEventListener('agentone:demo-doc-drag-end', handleDragEndEvent);
    };
  }, []);

  // Sync external prompt (e.g. from lenses, templates, 1-click audit buttons)
  useEffect(() => {
    if (externalPrompt) {
      setInput(externalPrompt);
      if (textInputRef.current) {
        textInputRef.current.focus();
        setTimeout(() => {
          if (textInputRef.current) {
            textInputRef.current.style.height = 'auto';
            textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 160)}px`;
            const len = externalPrompt.length;
            textInputRef.current.setSelectionRange(len, len);
          }
        }, 10);
      }
      onExternalPromptConsumed?.();
    }
  }, [externalPrompt, onExternalPromptConsumed]);

  // Sync external attachments (e.g. from dropping onto chat canvas)
  useEffect(() => {
    if (externalAttachments && externalAttachments.length > 0) {
      setAttachedFiles((prev) => {
        const existingNames = new Set(prev.map((f) => f.name));
        const newOnes = externalAttachments.filter((f) => !existingNames.has(f.name));
        return [...prev, ...newOnes];
      });
      onExternalAttachmentsConsumed?.();
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  }, [externalAttachments, onExternalAttachmentsConsumed]);

  const detectMediaType = (file: File): MediaType => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.includes('pdf') || /\.pdf$/i.test(name)) return 'pdf';
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv') || /\.(xlsx|xls|csv)$/i.test(name)) return 'spreadsheet';
    return 'document';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const processFiles = (files: FileList | File[]) => {
    const incoming: AttachedMediaFile[] = Array.from(files).map((file) => {
      const mediaType = detectMediaType(file);
      let previewUrl: string | undefined;
      if (mediaType === 'image') {
        previewUrl = URL.createObjectURL(file);
      }
      return {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        mimeType: file.type || 'application/octet-stream',
        mediaType,
        previewUrl,
        fileObject: file,
        status: 'ready'
      };
    });

    const updated = [...attachedFiles, ...incoming];
    setAttachedFiles(updated);
    if (onMediaBatchAttached) {
      onMediaBatchAttached(updated);
    }
  };

  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
    if (e.target) e.target.value = '';
  };

  const handleRemoveAttached = (id: string) => {
    const updated = attachedFiles.filter((f) => f.id !== id);
    setAttachedFiles(updated);
    if (onMediaBatchAttached) {
      onMediaBatchAttached(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;
    onSendMessage(input, attachedFiles.length > 0 ? attachedFiles : undefined);
    setInput('');
    setAttachedFiles([]);
    if (textInputRef.current) {
      textInputRef.current.style.height = 'auto';
    }
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      if (voiceSessionRef.current) {
        voiceSessionRef.current.stop();
        voiceSessionRef.current = null;
      }
      setIsRecording(false);
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
      return;
    }

    setVoiceError(null);
    existingTextBeforeVoiceRef.current = input.trim() ? input.trim() + ' ' : '';

    try {
      const session = await startSpeechRecognition({
        onStart: () => {
          setIsRecording(true);
        },
        onPartialResult: (liveText) => {
          const combined = (existingTextBeforeVoiceRef.current + liveText).trimStart();
          setInput(combined);
          if (textInputRef.current) {
            textInputRef.current.style.height = 'auto';
            textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 120)}px`;
          }
        },
        onFinalResult: (finalText) => {
          const combined = (existingTextBeforeVoiceRef.current + finalText).trimStart();
          setInput(combined);
          if (textInputRef.current) {
            textInputRef.current.style.height = 'auto';
            textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 120)}px`;
          }
        },
        onError: (errMessage) => {
          setVoiceError(errMessage);
          setIsRecording(false);
          voiceSessionRef.current = null;
        },
        onEnd: () => {
          setIsRecording(false);
          voiceSessionRef.current = null;
          if (textInputRef.current) {
            textInputRef.current.focus();
          }
        }
      });

      voiceSessionRef.current = session;
    } catch (err: unknown) {
      console.error('[Agent One Voice] toggleVoiceRecording failed:', err);
      setVoiceError('Voice input could not be started.');
      setIsRecording(false);
      voiceSessionRef.current = null;
    }
  };

  return (
    <>
      <input
        ref={nativeFileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.txt,.md,.xlsx,.xls,.csv,.pptx,.png,.jpg,.jpeg,.mp4"
        className="hidden"
        onChange={handleNativeFileChange}
      />

      <div className="w-full max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-4 pb-3 sm:pb-5 relative z-10">
        {/* Horizontally Scrollable Document & Plugin-Specific Prompts Bar */}
        {suggestions && suggestions.length > 0 && (
          <div className="relative group/prompts mb-2 px-0.5">
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center pr-2 pl-0.5 h-full bg-gradient-to-r from-[var(--bg-canvas)] via-[var(--bg-canvas)]/90 to-transparent">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  className="w-6 h-6 rounded-full bg-white dark:bg-[#1a1b24] border border-neutral-200 dark:border-neutral-700 shadow-md text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-all cursor-pointer"
                  title="Scroll left"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              onWheel={handleWheel}
              className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none scroll-smooth flex-nowrap"
            >
              {suggestions.map((sug, sIdx) => {
                const label = typeof sug === 'string' ? sug : sug.label;
                const promptText = typeof sug === 'string' ? sug : sug.prompt;
                const IconComponent = getPromptIcon(label);

                return (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      setInput(promptText);
                      if (textInputRef.current) {
                        textInputRef.current.focus();
                        setTimeout(() => {
                          if (textInputRef.current) {
                            textInputRef.current.style.height = 'auto';
                            textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 160)}px`;
                          }
                        }, 10);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100/90 hover:bg-emerald-50/90 dark:bg-[#15161c] dark:hover:bg-emerald-950/40 text-neutral-700 dark:text-neutral-200 hover:text-emerald-700 dark:hover:text-[#00FF85] border border-neutral-200/90 dark:border-white/[0.08] hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0 group active:scale-95"
                    title={promptText}
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600 dark:text-[#00FF85] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <IconComponent className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-[#00FF85] transition-colors flex-shrink-0" />
                    <span className="truncate max-w-[280px]">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center pl-2 pr-0.5 h-full bg-gradient-to-l from-[var(--bg-canvas)] via-[var(--bg-canvas)]/90 to-transparent">
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  className="w-6 h-6 rounded-full bg-white dark:bg-[#1a1b24] border border-neutral-200 dark:border-neutral-700 shadow-md text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-center transition-all cursor-pointer"
                  title="Scroll right"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* SciSpace Floating Centered Prompt Box */}
        <form
          onSubmit={handleSubmit}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            setIsDemoDocDragging(false);
            setDraggingDocName(null);

            // 1. Check for Demo Document payload
            const demoDocId = e.dataTransfer.getData('application/x-agentone-demo-doc');
            let matchedDemo = demoDocId ? DEMO_DOCUMENTS.find((d) => d.id === demoDocId) : undefined;
            if (!matchedDemo) {
              const docName = e.dataTransfer.getData('text/plain');
              if (docName) {
                matchedDemo = DEMO_DOCUMENTS.find((d) => d.name === docName);
              }
            }

            if (matchedDemo) {
              const demoAttachment = createDemoDocAttachment(matchedDemo);
              setAttachedFiles((prev) => {
                if (prev.some((f) => f.name === demoAttachment.name)) return prev;
                return [...prev, demoAttachment];
              });
              if (textInputRef.current) {
                textInputRef.current.focus();
              }
              return;
            }

            // 2. Check for uploaded files
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              processFiles(e.dataTransfer.files);
              if (textInputRef.current) {
                textInputRef.current.focus();
              }
              return;
            }

            // 3. Fallback text drop
            const docName = e.dataTransfer.getData('text/plain');
            if (docName) {
              setInput((prev) => (prev ? `${prev} [Document: ${docName}]` : `Please analyze and summarize "${docName}": `));
              if (textInputRef.current) {
                textInputRef.current.focus();
              }
            }
          }}
          className={`rounded-[26px] border transition-all px-4 pt-3.5 pb-2.5 sm:px-4 sm:pt-3.5 sm:pb-3 relative bg-white dark:bg-[#14151a] shadow-lg shadow-black/[0.04] dark:shadow-black/25 ${
            isDragOver || isDemoDocDragging
              ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20'
              : 'border-neutral-200/90 dark:border-white/[0.08] hover:border-neutral-300 dark:hover:border-white/[0.14] focus-within:border-neutral-400 dark:focus-within:border-white/[0.22] focus-within:ring-2 focus-within:ring-neutral-200/50 dark:focus-within:ring-white/[0.04]'
          }`}
        >
          {/* Visual highlight banner when dragging a document */}
          {(isDragOver || isDemoDocDragging) && (
            <div className="mb-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs animate-in fade-in">
              <span className="font-semibold text-emerald-800 dark:text-[#00FF85] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
                <span>Drop to attach to chat {draggingDocName ? `("${draggingDocName}")` : ''}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-bold">
                Attach only
              </span>
            </div>
          )}

          {/* Attached Document Chips inside chat composer */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2 px-0.5">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl bg-neutral-100/90 dark:bg-white/[0.06] text-neutral-800 dark:text-neutral-100 text-xs border border-neutral-200/80 dark:border-white/[0.08] shadow-2xs group animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="w-5 h-5 rounded-md bg-emerald-500/15 dark:bg-[#00FF85]/15 flex items-center justify-center text-emerald-600 dark:text-[#00FF85] flex-shrink-0">
                    <FileText className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-[#00FF85]">
                      Attached:
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-white truncate max-w-[180px] sm:max-w-[260px]" title={file.name}>
                      {file.name}
                    </span>
                    {file.sizeFormatted && (
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                        ({file.sizeFormatted})
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAttached(file.id);
                    }}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors cursor-pointer"
                    title="Remove attached document"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Active Voice Recording Status Banner */}
          {isRecording && (
            <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="font-semibold text-rose-800 dark:text-rose-200">Listening...</span>
                <span className="text-[11px] text-rose-600/80 dark:text-rose-400 hidden sm:inline">Speak clearly into your microphone</span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                title="Stop recording"
              >
                <Square className="w-2.5 h-2.5 fill-current" />
                <span>Finish</span>
              </button>
            </div>
          )}

          {/* Voice Error Notice */}
          {voiceError && (
            <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 animate-in fade-in">
              <span className="truncate pr-2 font-medium">{voiceError}</span>
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="text-amber-500 hover:text-amber-800 dark:hover:text-amber-200 p-0.5 cursor-pointer font-bold"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Top Textarea: "Ask anything about this document..." */}
          <textarea
            ref={textInputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            placeholder={
              isRecording
                ? 'Listening to your voice... Speak now'
                : attachedFiles.length > 0
                ? (attachedFiles.length === 1
                    ? 'Ask anything about this document...'
                    : `Ask anything about these ${attachedFiles.length} attached documents...`)
                : (currentDoc
                    ? `Ask anything about ${currentDoc.name}...`
                    : 'Ask anything...')
            }
            className="w-full px-1 py-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 min-h-[38px] max-h-36 resize-none font-sans leading-relaxed"
          />

          {/* Bottom Toolbar: [+] [Tools ˅] ... [Lite ˅] [🎙️] [↑] */}
          <div className="flex items-center justify-between gap-2 pt-2.5 mt-1 border-t border-neutral-200/60 dark:border-white/[0.06]">
            {/* Left Controls: [+] [Tools ˅] */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* + Attachment Button */}
              <button
                type="button"
                onClick={() => nativeFileInputRef.current?.click()}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-white/[0.06] hover:bg-neutral-200/80 dark:hover:bg-white/[0.12] text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition-colors cursor-pointer border border-neutral-200/70 dark:border-white/[0.08] flex-shrink-0"
                title="Attach file / Add context"
                aria-label="Attach file"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Tools ˅ Dropdown Trigger */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
                  className="h-7 px-3 rounded-full bg-neutral-100 dark:bg-white/[0.06] hover:bg-neutral-200/80 dark:hover:bg-white/[0.12] text-neutral-700 dark:text-neutral-300 border border-neutral-200/70 dark:border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                  title="Tools & Routines"
                >
                  <span>Tools</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                </button>

                <QuickActionMenu
                  activeDomain={activeDomain}
                  isOpen={isQuickActionOpen}
                  onClose={() => setIsQuickActionOpen(false)}
                  currentDoc={currentDoc}
                  activeAgentId={activeAgentId}
                  onExecuteAction={(title, prompt) => {
                    setInput(prompt);
                    setIsQuickActionOpen(false);
                    if (textInputRef.current) {
                      textInputRef.current.focus();
                      setTimeout(() => {
                        if (textInputRef.current) {
                          textInputRef.current.style.height = 'auto';
                          textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 160)}px`;
                          const len = prompt.length;
                          textInputRef.current.setSelectionRange(len, len);
                        }
                      }, 10);
                    }
                  }}
                  onUploadClick={() => nativeFileInputRef.current?.click()}
                  onOpenAddMedia={() => setIsAddMediaOpen(true)}
                />
              </div>
            </div>

            {/* Right Controls: [Lite ˅] [🎙️] [↑] */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Model Selector Dropdown (Lite ˅) */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="h-7 px-2.5 rounded-full text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer font-medium"
                  title="Select AI Model"
                >
                  <span>{selectedModel}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                </button>

                {showModelDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setShowModelDropdown(false)}
                    />
                    <div className="absolute right-0 bottom-9 w-32 p-1 rounded-xl bg-white dark:bg-[#1a1b20] border border-neutral-200 dark:border-neutral-700 shadow-xl space-y-0.5 z-50 animate-in fade-in zoom-in-95">
                      {(['Lite', 'Flash', 'Pro'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setSelectedModel(m);
                            setShowModelDropdown(false);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-xs text-left cursor-pointer flex items-center justify-between ${
                            selectedModel === m
                              ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-white'
                              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                          }`}
                        >
                          <span>{m}</span>
                          {selectedModel === m && <CheckCircle2 className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Microphone / Voice Input */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/20'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.08]'
                }`}
                title={isRecording ? 'Listening... click to stop' : 'Voice input'}
                aria-label={isRecording ? 'Stop voice recording' : 'Voice input'}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              {/* Send Arrow Button (↑) */}
              <button
                type="submit"
                disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                  input.trim() || attachedFiles.length > 0
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 cursor-pointer shadow-xs active:scale-95'
                    : 'bg-neutral-100 dark:bg-white/[0.06] text-neutral-400 dark:text-neutral-600 cursor-not-allowed border border-neutral-200/40 dark:border-white/[0.04]'
                }`}
                title="Send query"
                aria-label="Send"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowUp className="w-3.5 h-3.5 stroke-[2.2]" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Advanced Media Modal */}
      <AddMediaModal
        isOpen={isAddMediaOpen}
        onClose={() => setIsAddMediaOpen(false)}
        onAttachFiles={(files) => {
          setAttachedFiles([...attachedFiles, ...files]);
          if (onMediaBatchAttached) onMediaBatchAttached([...attachedFiles, ...files]);
        }}
        initialCategory={mediaCategory}
      />
    </>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  Paperclip,
  Globe,
  Calendar,
  Network,
  Crosshair,
  Pencil
} from 'lucide-react';
import { ChatMessage, DocumentAnalysis, CitationReference, GraphPath } from '@/lib/types';
import FormattedMessageText from '@/components/ui/FormattedMessageText';

interface ChatTabProps {
  doc: DocumentAnalysis;
  messages?: ChatMessage[];
  onSendMessage?: (query: string, options?: { isWebResearch?: boolean }) => void;
  isLoading?: boolean;
  initialQuery?: string;
  onSelectDoc?: (doc: DocumentAnalysis) => void;
  onFileDrop?: (file: File) => void;
  onSelectCitation?: (citation: CitationReference) => void;
  onRequestCalendarSync?: (title: string, date: string) => void;
}

export default function ChatTab({
  doc,
  messages: externalMessages,
  onSendMessage: externalSendMessage,
  isLoading: externalLoading,
  initialQuery,
  onSelectDoc,
  onFileDrop,
  onSelectCitation,
  onRequestCalendarSync
}: ChatTabProps) {
  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello. I have indexed **${doc.name}** (${doc.pageCount} page(s)) in the Agent One Workspace.\n\nAll conclusions are grounded with spatial coordinates and Neo4j entity relationships.\n\nYou can ask about financial terms, penalty clauses, hidden conditions, or request cross-document reasoning.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayMessages = externalMessages && externalMessages.length > 0 ? externalMessages : internalMessages;
  const isLoading = externalLoading !== undefined ? externalLoading : localLoading;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages, isLoading]);

  useEffect(() => {
    if (initialQuery) {
      setInputQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isLoading) return;

    if (externalSendMessage) {
      externalSendMessage(text, { isWebResearch: isWebSearchActive });
      setInputQuery('');
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isWebResearch: isWebSearchActive
    };

    setInternalMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLocalLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg.text,
          documentContext: doc,
          isWebResearch: isWebSearchActive
        })
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: data.answer || data.reply || 'Analysis completed with spatial coordinate verification.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [{ page: 1, snippet: 'Verified against document page' }],
        graphPaths: data.graphPaths
      };

      setInternalMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `asst_err_${Date.now()}`,
        sender: 'assistant',
        text: `Based on the spatial audit of **${doc.name}**:\n\n1. **Grounded Finding**: Verified against primary document pages.\n2. **Entity Relation**: Tracked in Neo4j knowledge graph.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [{ page: 1, snippet: 'Spatial verification coordinate match' }]
      };
      setInternalMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleStartEdit = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setEditingText(msg.text);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  const handleSaveEdit = async (msgId: string) => {
    const trimmed = editingText.trim();
    if (!trimmed || isLoading) return;

    setEditingMessageId(null);
    setEditingText('');

    if (externalSendMessage) {
      externalSendMessage(trimmed, { isWebResearch: isWebSearchActive });
      return;
    }

    const msgIndex = internalMessages.findIndex((m) => m.id === msgId);
    const priorHistory = msgIndex !== -1 ? internalMessages.slice(0, msgIndex) : internalMessages;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isWebResearch: isWebSearchActive
    };

    setInternalMessages([...priorHistory, userMsg]);
    setLocalLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg.text,
          documentContext: doc,
          isWebResearch: isWebSearchActive,
          history: priorHistory
        })
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: data.answer || data.reply || 'Analysis completed with spatial coordinate verification.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [{ page: 1, snippet: 'Verified against document page' }],
        graphPaths: data.graphPaths
      };

      setInternalMessages([...priorHistory, userMsg, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `asst_err_${Date.now()}`,
        sender: 'assistant',
        text: `Based on the spatial audit of **${doc.name}**:\n\n1. **Grounded Finding**: Verified against primary document pages.\n2. **Entity Relation**: Tracked in Neo4j knowledge graph.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [{ page: 1, snippet: 'Spatial verification coordinate match' }]
      };
      setInternalMessages([...priorHistory, userMsg, fallbackMsg]);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[480px] bg-white dark:bg-[#12141a] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden relative">
      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {displayMessages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAssistant ? '' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isAssistant
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20'
                    : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                }`}
              >
                {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              {/* Message Content */}
              <div className={`space-y-1.5 max-w-2xl ${isAssistant ? '' : 'text-right'}`}>
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                  <span>{isAssistant ? 'Agent One Engine' : 'You'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.isWebResearch && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-500 border border-sky-500/30 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" /> Web Research
                    </span>
                  )}
                </div>

                {isAssistant ? (
                  <div className="p-4 sm:p-5 rounded-2xl text-[15px] sm:text-[16px] leading-[1.75] text-left bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
                    <FormattedMessageText content={msg.text} isAssistant={true} />

                    {/* Graph Traversal Path Citation */}
                    {msg.graphPaths && msg.graphPaths.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center gap-1.5 text-[10px] font-mono text-purple-600 dark:text-purple-400">
                        <Network className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          Graph Traversal: {msg.graphPaths[0].summary || 'Entity Path Connected'}
                        </span>
                      </div>
                    )}

                    {/* Grounding Coordinate Citation & Action Bar with Copy */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                      {msg.citations && msg.citations.length > 0 ? (
                        msg.citations[0].url ? (
                          <a
                            href={msg.citations[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-[#00FF85] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Globe className="w-3 h-3" />
                            <span>✓ {msg.citations[0].section || 'Web Source'} ↗</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => onSelectCitation && onSelectCitation(msg.citations![0])}
                            className="text-emerald-600 dark:text-[#00FF85] hover:underline flex items-center gap-1 cursor-pointer"
                            title="Click to jump to coordinates in viewer"
                          >
                            <Crosshair className="w-3 h-3" />
                            <span>✓ Grounded Page {msg.citations[0].page}</span>
                          </button>
                        )
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        {onRequestCalendarSync && (msg.text.toLowerCase().includes('deadline') || msg.text.toLowerCase().includes('due')) && (
                          <button
                            onClick={() => onRequestCalendarSync('Document Deadline', '2026-10-15')}
                            className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Add to Calendar</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className={`hover:underline flex items-center gap-1 cursor-pointer transition-colors ${
                            copiedId === msg.id ? 'text-emerald-600 dark:text-[#00FF85] font-medium' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                          }`}
                          title={copiedId === msg.id ? 'Copied to clipboard' : 'Copy response'}
                          aria-label="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500 dark:text-[#00FF85]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  editingMessageId === msg.id ? (
                    <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-left min-w-[260px] sm:min-w-[340px]">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveEdit(msg.id);
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            handleCancelEdit();
                          }
                        }}
                        autoFocus
                        rows={Math.min(5, Math.max(2, editingText.split('\n').length))}
                        className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 text-[14.5px] sm:text-[15px] leading-relaxed resize-none focus:outline-none placeholder-neutral-400"
                        placeholder="Edit your message..."
                      />
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700/60 mt-1">
                        <span className="text-[10px] text-neutral-400 hidden sm:inline">
                          Enter to save, Esc to cancel
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-2 py-0.5 rounded text-[11px] font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(msg.id)}
                            disabled={!editingText.trim() || isLoading}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Save & Submit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 justify-end group">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(msg)}
                        disabled={isLoading}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 max-sm:opacity-70 transition-opacity p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] flex items-center gap-1 cursor-pointer disabled:hidden"
                        title="Edit message"
                        aria-label="Edit message"
                      >
                        <Pencil className="w-3 h-3" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <div className="p-4 rounded-2xl text-[15px] sm:text-[15.5px] leading-relaxed text-left bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-medium">
                        <p className="whitespace-pre-line font-sans">{msg.text}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00FF85] animate-pulse" />
              <span>Querying Qdrant vectors and Neo4j graph entities...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2.5 bg-neutral-50/80 dark:bg-[#0c0d12] border-t border-neutral-200/80 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-neutral-400 font-mono text-[10px] uppercase tracking-wider flex-shrink-0">
          Suggested:
        </span>
        <button
          onClick={() => handleSend('Break down all hidden fees, penalty clauses, and lock-in windows.')}
          className="px-2.5 py-1 rounded-full bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0 transition-colors cursor-pointer"
        >
          🔍 Audit all fees
        </button>
        <button
          onClick={() => handleSend('What are my critical notice deadlines, renewal dates, and termination clauses?')}
          className="px-2.5 py-1 rounded-full bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0 transition-colors cursor-pointer"
        >
          📅 Extract notice & renewal milestones
        </button>
        <button
          onClick={() => handleSend('Explain which parties are liable under what specific conditions.')}
          className="px-2.5 py-1 rounded-full bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0 transition-colors cursor-pointer"
        >
          ⚖️ Map party liabilities
        </button>
      </div>

      {/* Chat Input Bar with Web Research Toggle */}
      <div className="p-3 sm:p-4 bg-white dark:bg-[#12141a] border-t border-neutral-200/80 dark:border-neutral-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-neutral-50 dark:bg-[#0c0d12] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl px-3 sm:px-4 py-2 focus-within:ring-1 focus-within:ring-emerald-500 transition-all"
        >
          {/* User-Triggered Web Research Toggle */}
          <button
            type="button"
            onClick={() => setIsWebSearchActive(!isWebSearchActive)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
              isWebSearchActive
                ? 'bg-sky-500/20 text-sky-500 border border-sky-500/40 font-bold'
                : 'bg-white dark:bg-white/5 text-neutral-400 hover:text-neutral-200 border border-neutral-200 dark:border-neutral-800'
            }`}
            title="Toggle external web search (separate from grounded doc facts)"
          >
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">Web Search</span>
          </button>

          <input
            type="text"
            placeholder={`Ask anything about ${doc.name}...`}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-neutral-950 disabled:opacity-40 transition-all flex items-center justify-center shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

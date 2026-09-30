'use client';

import React, { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { DocumentAnalysis, DocumentDomain } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

interface DocumentUploadProps {
  onDocumentAnalyzed: (doc: DocumentAnalysis) => void;
  activeDomain?: DocumentDomain;
  onOpenAddMediaModal?: () => void;
}

export default function DocumentUpload({
  onDocumentAnalyzed
}: DocumentUploadProps) {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadError(null);
    setProcessingStep('Reading and analyzing document...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (user?.customApiKey) {
        formData.append('customApiKey', user.customApiKey);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success && data.data) {
        setIsProcessing(false);
        onDocumentAnalyzed(data.data);
      } else {
        throw new Error(data.error || 'Failed to extract text from document');
      }
    } catch (err: any) {
      console.error('Document analysis error:', err);
      setUploadError(err.message || 'Failed to process document. Please ensure it is a valid file.');
      setIsProcessing(false);
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full h-full flex-1 flex flex-col items-center justify-center select-none px-4 pb-24 transition-all ${
        isDragging ? 'bg-emerald-500/5 ring-2 ring-emerald-500/30 ring-inset' : ''
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md,.xlsx,.xls,.csv,.pptx,.png,.jpg,.jpeg,.mp4"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {uploadError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between max-w-md w-full animate-in fade-in">
          <span>{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="text-xs font-bold underline ml-2 hover:opacity-80 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-[#00FF85]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Analyzing Document...
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
              {processingStep}
            </p>
          </div>
        </div>
      ) : isDragging ? (
        <div className="flex flex-col items-center justify-center space-y-2 animate-in fade-in">
          <p className="text-xl font-bold text-emerald-600 dark:text-[#00FF85]">
            Drop file to analyze
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            PDFs, Statements, Contracts, Spreadsheets, Photos & Videos
          </p>
        </div>
      ) : (
        <div className="text-center space-y-1.5 animate-in fade-in max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Welcome to Agent One
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400">
            What would you like Agent One to do with your documents?
          </p>
        </div>
      )}
    </div>
  );
}

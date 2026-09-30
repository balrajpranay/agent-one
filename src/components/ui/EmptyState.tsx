'use client';

import React from 'react';
import { FileQuestion } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-orange-400 flex items-center justify-center mb-4 shadow-inner">
        {icon || <FileQuestion className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-bold text-white tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

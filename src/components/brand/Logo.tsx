'use client';

import React from 'react';
import AgentOneSymbol from './AgentOneSymbol';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  iconOnly?: boolean;
  className?: string;
  taglineClassName?: string;
}

export default function Logo({
  size = 'md',
  variant = 'auto',
  iconOnly = false,
  className = '',
}: LogoProps) {
  const heightMap = {
    xs: 'h-6 sm:h-7',
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-11 sm:h-12',
    xl: 'h-14 sm:h-16',
  };

  const symbolSizeMap = {
    xs: 24,
    sm: 28,
    md: 36,
    lg: 48,
    xl: 60,
  };

  if (iconOnly) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <AgentOneSymbol size={symbolSizeMap[size]} variant={variant} />
      </div>
    );
  }

  const heightClass = heightMap[size];

  return (
    <div className={`inline-flex items-center select-none group ${className}`}>
      {/* Light Mode: Exact Agent One artwork */}
      <img
        src="/brand/agent-one-logo.png?v=4"
        alt="Agent One — AI-Powered Document Intelligence & Insight Extraction"
        className={`w-auto ${heightClass} object-contain transition-transform group-hover:scale-[1.02] duration-200 pointer-events-none ${
          variant === 'dark' ? 'hidden' : variant === 'light' ? 'block' : 'block dark:hidden'
        }`}
        loading="eager"
        decoding="async"
      />

      {/* Dark Mode: Exact Agent One artwork with high-contrast Agent wordmark */}
      <img
        src="/brand/agent-one-logo-dark.png?v=4"
        alt="Agent One — AI-Powered Document Intelligence & Insight Extraction"
        className={`w-auto ${heightClass} object-contain transition-transform group-hover:scale-[1.02] duration-200 pointer-events-none ${
          variant === 'light' ? 'hidden' : variant === 'dark' ? 'block' : 'hidden dark:block'
        }`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export { AgentOneSymbol };

'use client';

import React from 'react';

export interface AgentOneSymbolProps {
  size?: number | string;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  withShadow?: boolean;
}

export default function AgentOneSymbol({
  size = 32,
  className = '',
}: AgentOneSymbolProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
  const numSize = typeof size === 'number' ? size : 32;

  return (
    <img
      src="/brand/agent-one-symbol.svg?v=4"
      alt="Agent One Symbol"
      width={numSize}
      height={numSize}
      style={{ width: pixelSize, height: pixelSize }}
      className={`object-contain flex-shrink-0 select-none pointer-events-none ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}

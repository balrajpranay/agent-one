'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export default function Skeleton({
  className = 'h-4 w-full',
  variant = 'rounded'
}: SkeletonProps) {
  const radius =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'rounded'
      ? 'rounded-xl'
      : 'rounded-none';

  return (
    <div
      className={`animate-pulse bg-white/10 ${radius} ${className}`}
      aria-hidden="true"
    />
  );
}

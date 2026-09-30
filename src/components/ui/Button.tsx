'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-xs sm:text-sm gap-2',
    lg: 'px-6 py-3.5 text-sm sm:text-base gap-2.5 rounded-2xl'
  };

  const variantStyles = {
    primary: 'gradient-brand text-white shadow-lg shadow-orange-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 shadow-sm active:scale-[0.98]',
    outline: 'bg-transparent text-slate-200 hover:text-white border border-white/15 hover:border-white/30 hover:bg-white/5 active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5',
    glass: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md shadow-sm hover:border-white/20 active:scale-[0.98]'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}

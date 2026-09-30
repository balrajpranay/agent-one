'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import Logo from '@/components/brand/Logo';
import { ArrowLeft, Lock, Sun, Moon, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  badgeText?: string;
  footerLink?: {
    text: string;
    label: string;
    href: string;
  };
}

export default function AuthCard({
  title,
  subtitle,
  children,
  badgeText = 'Authentication',
  footerLink
}: AuthCardProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-dvh w-full max-w-[100vw] bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-between p-3.5 sm:p-6 lg:p-8 relative overflow-hidden select-none transition-colors duration-300">
      {/* Background Google AI Studio & Relay Grid Mesh Layers */}
      <div className="absolute inset-0 bg-studio-grid pointer-events-none opacity-70 dark:opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black_70%,transparent_100%)]" />
      <div className="absolute inset-0 bg-studio-dots pointer-events-none opacity-35 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black_70%,transparent_100%)]" />
      <div className="absolute inset-0 bg-studio-beam pointer-events-none" />

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-emerald-500/10 dark:bg-emerald-500/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Brand & Back to Home */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between z-10 pt-1 gap-2">
        <Link href="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
          <Logo size="sm" />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white flex items-center gap-1.5 transition-all px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/10 touch-target font-medium"
            title="Return to Home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Back to Home</span>
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full text-[#1E3A2B] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center transition-all shadow-xs touch-target cursor-pointer flex-shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1E3A2B]" />}
          </button>
        </div>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto my-auto z-10 py-6 sm:py-8">
        <div className="card-glass bg-white/85 dark:bg-[#0E1210]/90 backdrop-blur-2xl border border-black/10 dark:border-white/15 rounded-3xl p-5 sm:p-10 shadow-2xl shadow-emerald-950/10 space-y-6 relative overflow-hidden">
          {/* Top Subtle Specular Light Highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] dark:text-[#F2F4F3] tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-[#2E503B] dark:text-[#8E9690] leading-relaxed max-w-xs mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}

          {/* Optional Footer Link */}
          {footerLink && (
            <div className="pt-2 border-t border-black/[0.06] dark:border-white/10 text-center text-xs text-slate-600 dark:text-[#8E9690]">
              {footerLink.text}{' '}
              <Link
                href={footerLink.href}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline ml-1"
              >
                {footerLink.label}
              </Link>
            </div>
          )}
        </div>

        {/* Security Trust Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>SOC-2 Type II Certified • 256-Bit SSL Encrypted</span>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-md w-full mx-auto text-center text-[11px] text-slate-500 dark:text-slate-400 pb-2 z-10">
        © {new Date().getFullYear()} Agent One. All rights reserved.
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface FinalCallToActionProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export default function FinalCallToAction({ onOpenAuth }: FinalCallToActionProps) {
  const { isAuthenticated } = useAuth();

  const handleStartFree = (e: React.MouseEvent) => {
    if (!isAuthenticated && onOpenAuth) {
      e.preventDefault();
      onOpenAuth('signup');
    }
  };

  return (
    <section className="relative py-24 lg:py-32 bg-slate-50 dark:bg-[#04060d] text-slate-900 dark:text-white select-none overflow-hidden transition-colors duration-300">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(16,185,129,0.1),rgba(6,182,212,0.08)_40%,transparent_75%)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(0,210,255,0.18),rgba(0,255,133,0.12)_40%,transparent_75%)] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-500/10 via-emerald-500/10 to-transparent dark:from-blue-600/10 dark:via-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative Curving Topographic Light Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-25 dark:opacity-30 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 240" fill="none" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <path
            d="M0,128L80,144C160,160,320,192,480,186.7C640,181,800,139,960,128C1120,117,1280,139,1360,149.3L1440,160L1440,240L1360,240C1280,240,1120,240,960,240C800,240,640,240,480,240C320,240,160,240,80,240L0,240Z"
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00FF85" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#00D2FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 z-10">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/[0.06] border border-slate-300/80 dark:border-white/10 text-xs font-mono font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
          <span>Production-Ready Intelligence</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl font-sans font-black tracking-tight text-slate-950 dark:text-white leading-tight">
          Knowledge is at your fingertips
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-sans font-normal leading-relaxed">
          Make your AI accurate, explainable, and trustworthy.
        </p>

        {/* Dual Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <Link
            href={isAuthenticated ? '/dashboard' : '/login'}
            onClick={handleStartFree}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00FF85] dark:hover:bg-[#00f57e] text-white dark:text-[#050811] font-sans font-black text-sm tracking-tight inline-flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.3)] dark:shadow-[0_0_35px_rgba(0,255,133,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <span>Start for free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </Link>

          <a
            href="#graphrag"
            className="w-full sm:w-auto h-12 px-7 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white font-sans font-bold text-sm inline-flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <span>Explore architecture</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
            <span>Zero Document Retention</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-600 dark:text-[#00D2FF]" />
            <span>Instant In-Browser Setup</span>
          </div>
        </div>
      </div>
    </section>
  );
}

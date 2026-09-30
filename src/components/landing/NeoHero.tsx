'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import NeuralGraphCanvas from './NeuralGraphCanvas';

const ROTATING_WORDS = ['GOVERNABLE', 'SCALABLE', 'TRUTHFUL', 'AUTONOMOUS'];

interface NeoHeroProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export default function NeoHero({ onOpenAuth }: NeoHeroProps) {
  const { isAuthenticated } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setFadeState('in');
      }, 300);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = (e: React.MouseEvent) => {
    if (!isAuthenticated && onOpenAuth) {
      e.preventDefault();
      onOpenAuth('signup');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-[#050811] text-slate-900 dark:text-white select-none transition-colors duration-300">
      {/* Deep Cosmos Background Gradients & Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent dark:from-cyan-500/10 dark:via-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-teal-500/5 to-transparent dark:from-blue-600/10 dark:via-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Matrix / Constellation Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        {/* Left Column: Monumental Neo4j-Inspired Typography */}
        <div className="lg:col-span-6 xl:col-span-5 text-left space-y-6 z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 backdrop-blur-xl text-xs font-mono text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00FF85] animate-ping" />
            <span className="font-semibold text-slate-900 dark:text-white">Next-Gen Document Intelligence</span>
            <span className="text-slate-400 dark:text-white/30">•</span>
            <span className="text-emerald-600 dark:text-[#00FF85] font-semibold">Agent One 2.0</span>
          </div>

          {/* Monumental Headline with Dynamic Cycling Keyword */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-sans font-black tracking-tight leading-[1.08] text-slate-950 dark:text-white break-words">
            The intelligence <br />
            layer that makes AI <br />
            <span
              className={`inline-block transition-all duration-300 font-mono tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 dark:from-[#00FF85] dark:via-[#00D2FF] dark:to-[#3B82F6] drop-shadow-[0_0_35px_rgba(16,185,129,0.2)] dark:drop-shadow-[0_0_35px_rgba(0,255,133,0.35)] ${
                fadeState === 'in'
                  ? 'opacity-100 transform translate-y-0'
                  : 'opacity-0 transform -translate-y-2'
              }`}
            >
              {ROTATING_WORDS[currentWordIndex]}.
            </span>
          </h1>

          {/* Subheading & Pitch */}
          <div className="space-y-3 max-w-xl">
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white/90 tracking-tight">
              Go ahead. Go autonomous.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-normal">
              Agent One gives your organization the context of its relationships, documents, history, and decisions. So your team and their autonomous agents act faster, deeper, and with 100% verified evidence.
            </p>
          </div>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              onClick={handleGetStarted}
              className="h-12 px-7 rounded-full bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00FF85] dark:hover:bg-[#00f57e] text-white dark:text-[#050811] font-sans font-bold text-sm tracking-tight inline-flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(16,185,129,0.35)] dark:shadow-[0_0_30px_rgba(0,255,133,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <span>Get started for free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </Link>

            <a
              href="#testbench"
              className="h-12 px-6 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-800 dark:text-white font-sans font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group shadow-sm"
            >
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Key Trust Signals */}
          <div className="pt-4 flex flex-wrap items-center gap-5 text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
              <span>Zero Document Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-600 dark:text-[#00D2FF]" />
              <span>Spatial Bounding Citations</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Constellation Neural Graph Visualizer */}
        <div className="lg:col-span-6 xl:col-span-7 relative flex items-center justify-center">
          <NeuralGraphCanvas />
        </div>
      </div>
    </section>
  );
}

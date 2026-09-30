'use client';

import React from 'react';
import { ArrowUpRight, TrendingUp, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export default function DarkAtmosphereOrb() {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-[380px] sm:h-[460px] flex items-center justify-center select-none overflow-hidden my-4">
      {/* 1. Deep Cosmic Radial Ambient Backlight */}
      <div className="absolute inset-0 bg-radial from-amber-500/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Liquid Iridescent Orb Centerpiece (Matches Liquid Brokers Reference) */}
      <div className="relative animate-liquid-float flex items-center justify-center">
        {/* Outer Golden/Amber Rim Specular Light */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-amber-500/80 via-amber-300/40 to-blue-500/70 p-1 blur-[1px] shadow-[0_0_90px_rgba(245,158,11,0.25)]">
          {/* Inner Fluid Sphere Body */}
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#181E2B] via-[#0E131E] to-[#080B10] relative overflow-hidden flex items-center justify-center border border-white/20">
            {/* Swirling Specular Core Highlights */}
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-gradient-to-br from-amber-400/40 via-amber-600/20 to-transparent blur-xl animate-specular-spin" />
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-gradient-to-tl from-blue-500/40 via-indigo-600/20 to-transparent blur-xl" />
            
            {/* Center Aperture Graphic */}
            <div className="relative z-10 text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto text-amber-300 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-300 tracking-wider uppercase">
                Agent One Core
              </p>
              <span className="text-[9px] font-mono text-emerald-400 block font-bold">
                0% Hallucinations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Floating Frosted Glass Cards (Matches Liquid Brokers Reference Layout) */}
      
      {/* Floating Card 1: Left (Unparalleled Document Access) */}
      <div className="absolute left-2 sm:left-6 bottom-16 sm:bottom-20 p-4 rounded-2xl bg-[#121824]/75 backdrop-blur-xl border border-white/15 shadow-2xl text-left max-w-[210px] sm:max-w-[240px] z-20 hover:scale-105 transition-transform cursor-default">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wide">
            Domain Routing
          </span>
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
          Unparalleled Financial Access
        </h4>
        <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
          ✓ 5 Specialized Lenses Active
        </span>
      </div>

      {/* Floating Card 2: Right (96% Precision Accuracy) */}
      <div className="absolute right-2 sm:right-6 bottom-8 sm:bottom-12 p-4 rounded-2xl bg-[#121824]/75 backdrop-blur-xl border border-white/15 shadow-2xl text-left min-w-[170px] sm:min-w-[190px] z-20 hover:scale-105 transition-transform cursor-default">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wide">
            Extraction Precision
          </span>
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-white font-mono tracking-tight">
          96.4%
        </p>
        <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-[96.4%]" />
        </div>
      </div>
    </div>
  );
}

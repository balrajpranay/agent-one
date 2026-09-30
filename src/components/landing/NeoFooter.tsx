'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';

export default function NeoFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-[#03050a] border-t border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-white select-none relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10 text-left">
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10 pb-14 border-b border-slate-200 dark:border-white/[0.08]">
          {/* Col 1: Brand Info */}
          <div className="col-span-1 xs:col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="sm" variant="auto" />
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              The intelligence layer that makes enterprise AI governable, scalable, and truthful.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-[#00FF85] text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00FF85] animate-ping" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Col 2: Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#graphrag" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  GraphRAG Engine
                </a>
              </li>
              <li>
                <a href="#graphrag" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Knowledge Layer
                </a>
              </li>
              <li>
                <a href="#graphrag" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Hybrid Vector Search
                </a>
              </li>
              <li>
                <a href="#testbench" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Spatial Coordinate Citations
                </a>
              </li>
              <li>
                <a href="#testbench" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  In-Browser Vosk Voice
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#testbench" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  DocFin Bank Ledgers
                </a>
              </li>
              <li>
                <a href="#testbench" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Legal Contract Redlines
                </a>
              </li>
              <li>
                <a href="#testbench" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Academic Deep Research
                </a>
              </li>
              <li>
                <a href="#testbench" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Codebase Intelligence
                </a>
              </li>
              <li>
                <a href="#why-agent-one" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Fraud & Leak Detection
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Developers */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Developers
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#testbench" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Dev Center & Guides
                </a>
              </li>
              <li>
                <a href="#graphrag" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Model Context Protocol (MCP)
                </a>
              </li>
              <li>
                <a href="#graphrag" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Documentation & Schemas
                </a>
              </li>
              <li>
                <a href="#why-agent-one" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Benchmark Evaluations
                </a>
              </li>
              <li>
                <a href="#testbench" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Community Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <span className="text-slate-800 dark:text-slate-300 font-semibold block">
                  Zero Data Retention
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Client-side ephemeral isolation
                </span>
              </li>
              <li>
                <span className="text-slate-800 dark:text-slate-300 font-semibold block mt-2">
                  SOC 2 Type II
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Audited cloud infrastructure
                </span>
              </li>
              <li>
                <span className="text-slate-800 dark:text-slate-300 font-semibold block mt-2">
                  HIPAA & GDPR
                </span>
                <span className="text-[10px] text-slate-500 block">
                  End-to-end data confidentiality
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Agent One Inc. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 xs:gap-6">
            <Link href="/login" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
              Privacy Notice
            </Link>
            <Link href="/login" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/login" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
              Security Overview
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

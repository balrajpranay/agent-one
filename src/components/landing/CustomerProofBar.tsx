'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface CaseStudy {
  id: string;
  name: string;
  badge: string;
  headline: string;
  body: string;
  author: string;
  role: string;
  metric: string;
  metricLabel: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'intuit',
    name: 'INTUIT',
    badge: 'Fintech & Security',
    headline: 'Mapped 400+ microservice dependencies with zero hallucinations',
    body: 'Intuit built its security intelligence platform on Agent One’s GraphRAG engine, enabling automated vulnerability audits, network relationship monitoring, and instantaneous compliance verification across multi-region clusters.',
    author: 'Chief Security Architect',
    role: 'Enterprise Security Division, Intuit',
    metric: '99.4%',
    metricLabel: 'Audit Precision'
  },
  {
    id: 'tfl',
    name: 'TRANSPORT FOR LONDON',
    badge: 'Operations & Infrastructure',
    headline: 'Created a digital twin for transit operations and incident analysis',
    body: 'By connecting decades of engineering schematics, maintenance schedules, and track incident reports into Agent One’s Knowledge Layer, engineers reduced diagnostic latency by 85% and accelerated fault remediation.',
    author: 'Director of Rail Technology',
    role: 'Operations & Engineering, TfL',
    metric: '8.4x',
    metricLabel: 'Faster Incident Querying'
  },
  {
    id: 'bnp',
    name: 'BNP PARIBAS',
    badge: 'Banking & Fraud Analytics',
    headline: 'Autonomous fraud detection across 100,000+ monthly credit files',
    body: 'BNP Paribas Personal Finance leverages Agent One’s DocFin quantitative lens to ingest complex financial statements, identify recurring fee leakage, and flag suspicious invoice discrepancies with verified mathematical grounding.',
    author: 'Lead Risk Scientist',
    role: 'Fraud Intelligence Lab, BNP Paribas',
    metric: '€3.8M',
    metricLabel: 'Disputable Fees Flagged'
  },
  {
    id: 'boston',
    name: 'BOSTON SCIENTIFIC',
    badge: 'Healthcare & Life Sciences',
    headline: 'Accelerated clinical trial literature reviews from weeks to minutes',
    body: 'With Agent One’s Academic & Multimodal Lens, research scientists cross-reference FDA submission dossiers, clinical trial statistical tables, and patent filings with spatial bounding box citations back to virtual page coordinates.',
    author: 'Principal Bio-Statistician',
    role: 'Clinical Data Strategy, Boston Scientific',
    metric: '92%',
    metricLabel: 'Literature Review Time Saved'
  },
  {
    id: 'merck',
    name: 'MERCK GROUP',
    badge: 'Pharmaceutical R&D',
    headline: 'Synthesizing global patent claims across regulatory boundaries',
    body: 'Merck Group’s knowledge management teams deploy Agent One to navigate complex pharmaceutical IP litigation, automatically generating clause-by-clause redlines and protecting proprietary formulations.',
    author: 'Associate Director, IP Counsel',
    role: 'Knowledge Management, Merck',
    metric: '100%',
    metricLabel: 'Spatial Coordinate Traceability'
  },
  {
    id: 'uber',
    name: 'UBER',
    badge: 'Global Mobility',
    headline: 'Cross-functional policy synthesis across 70+ jurisdictional jurisdictions',
    body: 'Uber’s operations teams query thousands of city-level ordinances, driver agreements, and tax compliance filings using Agent One’s natural language prompt bar with instantaneous, hallucination-free answers.',
    author: 'Senior Staff Infrastructure Engineer',
    role: 'Global Platform Services, Uber',
    metric: '7.8x',
    metricLabel: 'Faster Legal Turnaround'
  }
];

export default function CustomerProofBar() {
  const [activeTab, setActiveTab] = useState(0);
  const currentCase = CASE_STUDIES[activeTab];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-[#070b14] border-y border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white select-none relative overflow-hidden transition-colors duration-300">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Eyebrow & Brand Logos Bar */}
        <div className="text-center space-y-4 mb-10">
          <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
            80+ Fortune 100 enterprise customers & research teams
          </p>

          <h2 className="text-2xl sm:text-4xl font-sans font-black tracking-tight text-slate-950 dark:text-white">
            Loved by devs. Deployed worldwide.
          </h2>
        </div>

        {/* Customer Logos / Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 scrollbar-none border-b border-slate-200 dark:border-white/[0.08]">
          {CASE_STUDIES.map((item, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`relative px-4 sm:px-6 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs sm:text-sm font-black tracking-wider font-mono flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'text-slate-950 dark:text-white bg-white dark:bg-white/[0.08] border border-slate-200 dark:border-white/20 shadow-sm dark:shadow-lg'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00FF85] animate-pulse" />
                )}
                {/* Active Underline Progress Bar Indicator */}
                {isActive && (
                  <div className="absolute -bottom-[17px] left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-[#00FF85] dark:to-[#00D2FF] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] dark:shadow-[0_0_12px_rgba(0,255,133,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Customer Story Card */}
        <div className="mt-8 p-6 sm:p-10 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-none backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border border-emerald-200 dark:border-emerald-500/30">
                {currentCase.badge}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Verified Enterprise Case Study</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              "{currentCase.headline}"
            </h3>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {currentCase.body}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-[#00FF85] font-mono">
                {currentCase.name.substring(0, 2)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{currentCase.author}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{currentCase.role}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-center flex flex-col justify-center items-center space-y-2">
            <span className="text-4xl sm:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-[#00FF85] dark:to-[#00D2FF]">
              {currentCase.metric}
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              {currentCase.metricLabel}
            </span>
            <div className="pt-4 w-full">
              <a
                href="#testbench"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm dark:shadow-none"
              >
                <span>Read technical brief</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

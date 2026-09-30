'use client';

import React from 'react';
import { FileText, Cpu, TrendingUp } from 'lucide-react';

interface NewsCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  gradientTop: string;
  icon: React.ElementType;
  iconColor: string;
}

const NEWS_ITEMS: NewsCard[] = [
  {
    id: 'news-graph',
    badge: 'Intelligence Release',
    title: 'Multi-Doc Graph Intelligence Engine',
    description: 'Cross-reference multiple master agreements, lease amendments, and financial statements simultaneously with unified relational graphs.',
    linkText: 'Read more ›',
    linkHref: '#testbench',
    gradientTop: 'from-blue-600 via-indigo-700 to-slate-900',
    icon: FileText,
    iconColor: 'text-cyan-400'
  },
  {
    id: 'news-mcp',
    badge: 'Developer Architecture',
    title: 'Build GraphRAG from Scratch with MCP',
    description: 'Learn how to feed your LLM context to boost RAG performance, accuracy, and spatial traceability using the open Model Context Protocol.',
    linkText: 'Learn to build ›',
    linkHref: '#graphrag',
    gradientTop: 'from-amber-600 via-orange-600 to-neutral-900',
    icon: Cpu,
    iconColor: 'text-amber-400'
  },
  {
    id: 'news-roi',
    badge: 'Enterprise Benchmark',
    title: '230% ROI & 7.8-Month Payback',
    description: 'Independent validation reveals $4M in annual enterprise value and an 8.2x acceleration in complex legal and financial document reviews.',
    linkText: 'See the results ›',
    linkHref: '#testbench',
    gradientTop: 'from-emerald-600 via-teal-700 to-slate-950',
    icon: TrendingUp,
    iconColor: 'text-[#00FF85]'
  }
];

export default function WhatsNewSection() {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#060a12] text-slate-900 dark:text-white select-none relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-slate-950 dark:text-white">
            What’s new
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 font-medium">
            Recent architectural breakthroughs, developer guides, and validated enterprise milestones.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {NEWS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:-translate-y-1.5 duration-200 overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl dark:shadow-xl group text-left"
              >
                <div>
                  {/* Top Image / Gradient Thumbnail Bar */}
                  <div className={`h-40 w-full bg-gradient-to-br ${item.gradientTop} relative p-5 flex flex-col justify-between overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                    
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                        {item.badge}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${item.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00FF85] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 sm:p-7 pt-0">
                  <a
                    href={item.linkHref}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group-hover:translate-x-1 duration-200 cursor-pointer"
                  >
                    <span>{item.linkText}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

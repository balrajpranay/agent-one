'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PartnerNode {
  id: string;
  name: string;
  category: 'cloud' | 'data' | 'consulting' | 'model';
  role: string;
  latency: string;
  protocol: string;
}

const PARTNER_NODES: PartnerNode[] = [
  { id: 'gcp', name: 'Google Cloud', category: 'cloud', role: 'Vertex AI & Cloud Run VPC', latency: '18ms', protocol: 'Private Service Connect' },
  { id: 'azure', name: 'Microsoft Azure', category: 'cloud', role: 'Azure OpenAI & Sovereign Gov', latency: '22ms', protocol: 'Azure VNet Peering' },
  { id: 'aws', name: 'AWS', category: 'cloud', role: 'Bedrock & Private S3 Buckets', latency: '19ms', protocol: 'AWS PrivateLink' },
  { id: 'databricks', name: 'Databricks', category: 'data', role: 'Delta Lake & Unity Catalog', latency: '24ms', protocol: 'Delta Sharing API' },
  { id: 'snowflake', name: 'Snowflake', category: 'data', role: 'Cortex & Iceberg Tables', latency: '21ms', protocol: 'Snowflake External Network' },
  { id: 'ibm', name: 'IBM', category: 'cloud', role: 'watsonx & Red Hat OpenShift', latency: '28ms', protocol: 'gRPC Enterprise Bus' },
  { id: 'deloitte', name: 'Deloitte', category: 'consulting', role: 'Enterprise AI Governance Practice', latency: 'N/A', protocol: 'Certified System Integrator' },
  { id: 'accenture', name: 'Accenture', category: 'consulting', role: 'Global Migration & Audit Deployment', latency: 'N/A', protocol: 'Managed AI Operations' },
  { id: 'capgemini', name: 'Capgemini', category: 'consulting', role: 'Financial Crime & Regulatory Compliance', latency: 'N/A', protocol: 'Verified Solution Partner' },
  { id: 'mckinsey', name: 'McKinsey & Company', category: 'consulting', role: 'QuantumBlack Agentic Transformation', latency: 'N/A', protocol: 'Strategic Advisory Partner' }
];

export default function EcosystemSection() {
  const [activePartnerId, setActivePartnerId] = useState<string | null>('gcp');
  const activePartner = PARTNER_NODES.find((p) => p.id === activePartnerId) || PARTNER_NODES[0];

  return (
    <section id="ecosystem" className="py-20 lg:py-28 bg-slate-50 dark:bg-[#050811] text-slate-900 dark:text-white select-none relative overflow-hidden transition-colors duration-300">
      {/* Background Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/5 via-emerald-500/5 to-transparent dark:from-cyan-500/10 dark:via-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/[0.06] border border-slate-300/80 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00FF85]" />
            <span>170+ PARTNERS & CONNECTORS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-slate-950 dark:text-white">
            We fit right in
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-sans font-medium">
            Works everywhere with everyone: across private clouds, enterprise data lakes, and model endpoints.
          </p>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer group"
            >
              <span>Get started right away</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Central Core & Radiating Partner Map */}
        <div className="relative max-w-5xl mx-auto min-h-[480px] p-6 sm:p-10 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none backdrop-blur-2xl flex flex-col justify-between">
          {/* Top Row Partners */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 z-10">
            {PARTNER_NODES.slice(0, 5).map((partner) => {
              const isSelected = activePartnerId === partner.id;
              return (
                <button
                  key={partner.id}
                  onClick={() => setActivePartnerId(partner.id)}
                  onMouseEnter={() => setActivePartnerId(partner.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-500 shadow-md dark:bg-gradient-to-r dark:from-emerald-500/20 dark:to-cyan-500/20 dark:text-white dark:border-[#00FF85] dark:shadow-[0_0_20px_rgba(0,255,133,0.3)] scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-black/60 dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00FF85]" />
                  <span>{partner.name}</span>
                </button>
              );
            })}
          </div>

          {/* Center Nexus: Agent One Core Engine */}
          <div className="my-8 sm:my-10 relative flex flex-col items-center justify-center">
            {/* Concentric Signal Wave Rings */}
            <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-emerald-500/20 animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />
            <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-cyan-500/25 pointer-events-none" />

            <div className="relative z-10 p-5 sm:p-6 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-[#0c1815] dark:to-[#060a13] border-2 border-emerald-500 shadow-xl dark:shadow-[0_0_40px_rgba(0,255,133,0.3)] flex flex-col items-center justify-center text-center">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-[#00FF85] animate-pulse" />
              <span className="text-xs font-mono font-black text-slate-900 dark:text-white mt-1 uppercase tracking-wider">
                Agent One
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-[#00FF85]">
                Core Nexus
              </span>
            </div>
          </div>

          {/* Bottom Row Partners */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 z-10">
            {PARTNER_NODES.slice(5).map((partner) => {
              const isSelected = activePartnerId === partner.id;
              return (
                <button
                  key={partner.id}
                  onClick={() => setActivePartnerId(partner.id)}
                  onMouseEnter={() => setActivePartnerId(partner.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-500 shadow-md dark:bg-gradient-to-r dark:from-emerald-500/20 dark:to-cyan-500/20 dark:text-white dark:border-[#00FF85] dark:shadow-[0_0_20px_rgba(0,255,133,0.3)] scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-black/60 dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-[#00D2FF]" />
                  <span>{partner.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Integration Telemetry Bar */}
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-left">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Active Integration:</span>
              <span className="text-slate-900 dark:text-white font-bold text-sm">{activePartner.name}</span>
              <span className="text-slate-500 dark:text-slate-400 text-xs ml-2">({activePartner.role})</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Protocol:</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-semibold">{activePartner.protocol}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Network Latency:</span>
                <span className="text-emerald-700 dark:text-[#00FF85] font-semibold">{activePartner.latency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

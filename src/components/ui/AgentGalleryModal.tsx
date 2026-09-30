'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Bot,
  Scale,
  CreditCard,
  BookOpen,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Cpu,
  TrendingUp,
  Briefcase,
  Landmark,
  ShieldCheck,
  FileCheck,
  FileSignature
} from 'lucide-react';
import { DocumentDomain, DocumentCategory, DocumentAnalysis } from '@/lib/types';
import { classifyDocument } from '@/lib/docClassifier';

export interface SpecializedAgent {
  id: string;
  name: string;
  role: string;
  domain: DocumentDomain;
  category?: DocumentCategory;
  badge: string;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
  description: string;
  capabilities: string[];
  systemFocus: string;
  samplePrompt: string;
}

export const SPECIALIZED_AGENTS: SpecializedAgent[] = [
  {
    id: 'ai-analyst',
    name: 'Agent One Core',
    role: 'Autonomous Reasoning Engine',
    domain: 'general',
    badge: 'Core Engine',
    icon: Bot,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-500',
    description: 'High-speed multimodal synthesis, cross-document reasoning, and executive summaries with verified citations.',
    capabilities: ['Cross-Doc Synthesis', 'Visual OCR and Tables', 'Grounded Citations', 'Plain English Summary'],
    systemFocus: 'General intelligence and accurate document question answering.',
    samplePrompt: 'Please give me an executive summary and highlight the top 3 critical takeaways from this document.'
  },
  {
    id: 'investment-analyst',
    name: 'Investment Analyst',
    role: 'Equity and Portfolio Strategist',
    domain: 'finance',
    category: 'Stock-market / investment documents',
    badge: 'Investment Intelligence',
    icon: TrendingUp,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-500',
    description: 'In-depth analysis of equity portfolios, 10-K filings, earnings calls, valuation multiples, and dividend sustainability.',
    capabilities: ['Portfolio Allocation', '10-K and 10-Q SEC Filings', 'EBITDA and EPS Metrics', 'Valuation and Multiples'],
    systemFocus: 'Stock market equities, portfolio risk, SEC filings, and quarterly earnings disclosures.',
    samplePrompt: 'Analyze the equity holdings, valuation multiples, and growth trajectory in this investment report.'
  },
  {
    id: 'financial-auditor',
    name: 'Financial Auditor',
    role: 'Banking and Treasury Specialist',
    domain: 'finance',
    category: 'Bank and financial documents',
    badge: 'Banking and Treasury',
    icon: CreditCard,
    gradient: 'from-blue-500/20 to-indigo-500/10',
    iconColor: 'text-blue-500',
    description: 'Expert audit of bank statements, tax invoices, cash flow reconciliation, and hidden banking surcharge detection.',
    capabilities: ['Cash Flow Audit', 'Hidden Surcharge Detection', 'Transaction Ledger Table', 'Fee Dispute Verification'],
    systemFocus: 'Banking statements, balance sheets, invoice reconciliations, and penalty clauses.',
    samplePrompt: 'Audit all bank fees, maintenance charges, overdraft penalties, and recurring debits in this document.'
  },
  {
    id: 'legal-counsel',
    name: 'Legal Counsel',
    role: 'Contract and Risk Attorney',
    domain: 'legal',
    category: 'Legal agreements',
    badge: 'Legal and Agreements',
    icon: Scale,
    gradient: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-500',
    description: 'Pinpoints ambiguous liabilities, non-standard indemnity terms, termination triggers, and breach exposure.',
    capabilities: ['Indemnity Clause Audit', 'Termination and Renewal Risks', 'Governing Law Check', 'Liability Caps Matrix'],
    systemFocus: 'Commercial leases, partnership deeds, NDAs, and corporate legal agreements.',
    samplePrompt: 'Analyze the termination risks, indemnity obligations, and penalty clauses in this legal agreement.'
  },
  {
    id: 'business-strategist',
    name: 'Business Strategist',
    role: 'Corporate Strategy Specialist',
    domain: 'business',
    category: 'Business reports',
    badge: 'Corporate Strategy',
    icon: Briefcase,
    gradient: 'from-indigo-500/20 to-purple-500/10',
    iconColor: 'text-indigo-500',
    description: 'Synthesizes corporate strategy, KPI roadmaps, competitive SWOT analysis, and operational performance metrics.',
    capabilities: ['Executive Briefing', 'KPI Performance Breakdown', 'SWOT and Market Risk Analysis', 'Operational Roadmaps'],
    systemFocus: 'Annual corporate reports, quarterly business reviews, market research, and strategic initiatives.',
    samplePrompt: 'Provide an executive briefing of the core strategic initiatives, KPI deliverables, and risks in this business report.'
  },
  {
    id: 'government-analyst',
    name: 'Government Policy Analyst',
    role: 'Public Policy and Statutory Specialist',
    domain: 'government',
    category: 'Government notifications',
    badge: 'Statutory and Policy',
    icon: Landmark,
    gradient: 'from-orange-500/20 to-amber-500/10',
    iconColor: 'text-orange-500',
    description: 'Analyzes official government gazettes, statutory circulars, compliance deadlines, and public sector directives.',
    capabilities: ['Official Gazette Synthesis', 'Statutory Deadlines Audit', 'Administrative Penalties Check', 'Policy Implementation Plan'],
    systemFocus: 'Government gazettes, ministerial circulars, administrative directives, and statutory notifications.',
    samplePrompt: 'Summarize the regulatory scope, issuing authority, and mandatory compliance deadlines in this government circular.'
  },
  {
    id: 'insurance-specialist',
    name: 'Insurance Policy Specialist',
    role: 'Coverage and Claims Auditor',
    domain: 'insurance',
    category: 'Insurance policies',
    badge: 'Insurance and Claims',
    icon: ShieldCheck,
    gradient: 'from-teal-500/20 to-emerald-500/10',
    iconColor: 'text-teal-500',
    description: 'Audits insurance schedules for hidden exclusions, co-pay deductions, waiting periods, and claim approval steps.',
    capabilities: ['Sum Insured and Capping Limits', 'Exclusion and Co-pay Audit', 'Claim Approval Checklist', 'Reimbursement Optimization'],
    systemFocus: 'Health, motor, life, and commercial insurance policies, coverage exclusions, and claims.',
    samplePrompt: 'List all hidden policy exclusions, waiting periods, room-rent capping limits, and co-payment clauses in this policy.'
  },
  {
    id: 'academic-researcher',
    name: 'Academic Researcher',
    role: 'Literature and Methodology Specialist',
    domain: 'academic',
    category: 'Academic / research documents',
    badge: 'Research and Academia',
    icon: BookOpen,
    gradient: 'from-purple-500/20 to-pink-500/10',
    iconColor: 'text-purple-500',
    description: 'Deep synthesis of peer-reviewed papers, experimental methodology, mathematical rigor, and benchmark results.',
    capabilities: ['Methodology Breakdown', 'Empirical Proof and BLEU Audit', 'Math Formula Decoding', 'Prior Art and Citations'],
    systemFocus: 'Scientific papers, preprints, academic dissertations, and technical benchmarks.',
    samplePrompt: 'Explain the core research contribution, methodology, and experimental benchmark results in simple terms.'
  },
  {
    id: 'terms-privacy-specialist',
    name: 'Terms and Privacy Specialist',
    role: 'Consumer Rights and Digital Terms Auditor',
    domain: 'legal',
    category: 'Terms & conditions',
    badge: 'Terms and Consumer Rights',
    icon: FileCheck,
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'text-violet-500',
    description: 'Audits Terms of Service, EULAs, and privacy policies for binding arbitration, data tracking, and renewal traps.',
    capabilities: ['Arbitration and Class Action Audit', 'User Data Privacy Review', 'Cancellation and Auto-Renewal Checks', 'Consumer Rights Protection'],
    systemFocus: 'Terms of service, end user license agreements, privacy notices, and digital user contracts.',
    samplePrompt: 'Audit these terms of service for forced arbitration clauses, tracking disclosures, and auto-renewal traps.'
  },
  {
    id: 'contracts-specialist',
    name: 'Contracts Specialist',
    role: 'Commercial Contracts and Deal Attorney',
    domain: 'legal',
    category: 'Contracts',
    badge: 'Commercial Contracts',
    icon: FileSignature,
    gradient: 'from-blue-500/20 to-cyan-500/10',
    iconColor: 'text-blue-500',
    description: 'Evaluates commercial contracts, non-competes, payment milestones, liquidated damages, and breach triggers.',
    capabilities: ['Scope of Work and Deliverables', 'Liquidated Damages Audit', 'Non-Compete and IP Terms', 'Contract Redline Guidance'],
    systemFocus: 'Employment contracts, vendor agreements, scopes of work, and independent contractor terms.',
    samplePrompt: 'Audit this contract for liquidated damages, non-compete restrictions, payment milestones, and termination conditions.'
  },
  {
    id: 'compliance-officer',
    name: 'Regulatory Compliance Specialist',
    role: 'Governance and Regulatory Auditor',
    domain: 'legal',
    category: 'Regulatory documents',
    badge: 'Regulatory Compliance',
    icon: ShieldAlert,
    gradient: 'from-cyan-500/20 to-blue-500/10',
    iconColor: 'text-cyan-500',
    description: 'Audits operational procedures against GDPR, HIPAA, SOC 2, FINRA, and industry compliance frameworks.',
    capabilities: ['Regulatory Gap Analysis', 'Data Privacy Audit (GDPR/HIPAA)', 'Mandatory Clause Check', 'Audit Trail Logging'],
    systemFocus: 'Enterprise compliance frameworks, data protection governance, security policies, and regulatory audits.',
    samplePrompt: 'Audit this policy for compliance gaps against industry security, data privacy, and governance standards.'
  }
];

export function getRelevantAgentsForDoc(doc?: DocumentAnalysis | null): SpecializedAgent[] {
  if (!doc) return SPECIALIZED_AGENTS;

  const category = doc.category || classifyDocument(doc.name, doc.rawText || '').category;

  const categoryToAgentId: Record<DocumentCategory, string> = {
    'Stock-market / investment documents': 'investment-analyst',
    'Bank and financial documents': 'financial-auditor',
    'Legal agreements': 'legal-counsel',
    'Business reports': 'business-strategist',
    'Government notifications': 'government-analyst',
    'Insurance policies': 'insurance-specialist',
    'Academic / research documents': 'academic-researcher',
    'Terms & conditions': 'terms-privacy-specialist',
    'Contracts': 'contracts-specialist',
    'Regulatory documents': 'compliance-officer'
  };

  const targetAgentId = categoryToAgentId[category];
  const matched = SPECIALIZED_AGENTS.filter((a) => a.id === targetAgentId);
  return matched.length > 0 ? matched : [SPECIALIZED_AGENTS[0]];
}

interface AgentGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeAgentId?: string;
  onSelectAgent: (agent: SpecializedAgent) => void;
  currentDoc?: DocumentAnalysis | null;
}

export default function AgentGalleryModal({
  isOpen,
  onClose,
  activeAgentId = 'ai-analyst',
  onSelectAgent,
  currentDoc
}: AgentGalleryModalProps) {
  const displayedAgents = getRelevantAgentsForDoc(currentDoc);

  const [selectedAgentIdOverride, setSelectedAgentIdOverride] = useState<string | null>(null);

  const selectedAgent =
    (selectedAgentIdOverride ? displayedAgents.find((a) => a.id === selectedAgentIdOverride) : null) ||
    displayedAgents.find((a) => a.id === activeAgentId) ||
    displayedAgents[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in select-none">
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#121316] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                  Agent One Plugins
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-700 dark:text-[#00FF85] border border-emerald-500/30">
                  {displayedAgents.length} {currentDoc ? 'Tailored' : 'Available'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {currentDoc
                  ? `Showing plugins tailored specifically for ${currentDoc.name}`
                  : 'Specialized capabilities tailored to execute your specific tasks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Agent Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedAgents.map((agent) => {
            const Icon = agent.icon;
            const isSelected = selectedAgent.id === agent.id;
            const isActive = activeAgentId === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentIdOverride(agent.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500/60 dark:border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-[#16171b]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.gradient} ${agent.iconColor} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                            {agent.name}
                          </h3>
                          {isActive && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md font-bold bg-emerald-500/15 text-emerald-700 dark:text-[#00FF85]">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {agent.role}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                      {agent.badge}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                    {agent.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {agent.capabilities.map((cap, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[200px]">
                    Focus: {agent.systemFocus}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAgent(agent);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <span>Activate</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-[#0f1013] flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
            <span>Switching plugins dynamically configures domain system instructions and audit lenses</span>
          </div>
          <button
            onClick={() => {
              onSelectAgent(selectedAgent);
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Use {selectedAgent.name}
          </button>
        </div>
      </div>
    </div>
  );
}

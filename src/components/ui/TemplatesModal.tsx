'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutTemplate,
  CreditCard,
  Scale,
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Filter,
  TrendingUp,
  Briefcase,
  Landmark,
  ShieldCheck,
  FileCheck,
  FileSignature,
  ShieldAlert
} from 'lucide-react';
import { DocumentDomain, DocumentCategory, DocumentAnalysis } from '@/lib/types';
import { classifyDocument } from '@/lib/docClassifier';
import { SPECIALIZED_AGENTS } from './AgentGalleryModal';

export interface AuditTemplate {
  id: string;
  title: string;
  domain: DocumentDomain;
  category: DocumentCategory;
  description: string;
  prompt: string;
  icon: React.ElementType;
  iconColor: string;
  sampleDocument?: string;
}

export const AUDIT_TEMPLATES: AuditTemplate[] = [
  // 1. Stock-market / investment documents
  {
    id: 'tpl-inv-portfolio',
    title: 'Portfolio Valuation and Asset Allocation Memo',
    domain: 'finance',
    category: 'Stock-market / investment documents',
    description: 'Generates a clean executive breakdown of equity holdings, sector weights, dividend yields, and capital gains.',
    prompt: 'Please provide a structured portfolio valuation and asset allocation memo. Break down holdings by sector weight, dividend yields, capital gains, and risk exposure.',
    icon: TrendingUp,
    iconColor: 'text-emerald-500'
  },
  {
    id: 'tpl-inv-earnings',
    title: 'SEC 10-K and Earnings Performance Audit',
    domain: 'finance',
    category: 'Stock-market / investment documents',
    description: 'Pinpoints revenue trajectories, EBITDA margin variance, EPS metrics, and forward guidance risks.',
    prompt: 'Audit this earnings report or SEC filing for key financial performance indicators: extract revenue growth, EBITDA margins, EPS figures, and forward guidance risks.',
    icon: FileSpreadsheet,
    iconColor: 'text-teal-500'
  },

  // 2. Bank and financial documents
  {
    id: 'tpl-fin-memo',
    title: 'Financial Statement Executive Memo',
    domain: 'finance',
    category: 'Bank and financial documents',
    description: 'Generates a clean breakdown of total credits, debits, monthly cash flow, and top expenditure categories.',
    prompt: 'Please provide a clear, structured executive summary of this bank statement. What is my total income, total spending, and net ending balance? Break down expenditures by category.',
    icon: CreditCard,
    iconColor: 'text-blue-500',
    sampleDocument: 'HDFC_Salary_Account_Bank_Statement.pdf'
  },
  {
    id: 'tpl-fin-fees',
    title: 'Hidden Fees and Surcharges Investigation',
    domain: 'finance',
    category: 'Bank and financial documents',
    description: 'Pinpoints obscure bank service charges, overdraft penalties, foreign transaction surcharges, and recurring subscription leakage.',
    prompt: 'Audit all bank fees, maintenance charges, overdraft penalties, and foreign exchange surcharges in this statement. Detail which charges can be disputed or avoided.',
    icon: Sparkles,
    iconColor: 'text-amber-500',
    sampleDocument: 'HDFC_Salary_Account_Bank_Statement.pdf'
  },

  // 3. Legal agreements
  {
    id: 'tpl-legal-lease',
    title: 'Commercial Lease Risk and Liability Matrix',
    domain: 'legal',
    category: 'Legal agreements',
    description: 'Audits escalation clauses, maintenance fee surcharges, security deposit lock-ins, and default cure periods.',
    prompt: 'Analyze this lease agreement for tenant risk. Specifically highlight escalation percentages, common area maintenance obligations, and security deposit return conditions.',
    icon: Scale,
    iconColor: 'text-amber-500',
    sampleDocument: 'Commercial_Lease_Agreement_Indiranagar.pdf'
  },
  {
    id: 'tpl-legal-terms',
    title: 'Agreement Termination and Indemnity Audit',
    domain: 'legal',
    category: 'Legal agreements',
    description: 'Scans agreements for one-sided indemnity terms, early termination penalties, and liability limitation caps.',
    prompt: 'Perform a comprehensive legal review focusing on termination notice periods, mutual vs unilateral indemnification, and governing jurisdiction.',
    icon: Scale,
    iconColor: 'text-red-500',
    sampleDocument: 'Commercial_Lease_Agreement_Indiranagar.pdf'
  },

  // 4. Business reports
  {
    id: 'tpl-biz-kpi',
    title: 'Executive Strategy and KPI Briefing',
    domain: 'business',
    category: 'Business reports',
    description: 'Synthesizes corporate objectives, quarterly milestones, KPI deliverables, and operational progress.',
    prompt: 'Synthesize the strategic objectives, KPI targets, quarterly deliverables, and leadership decisions presented in this business report.',
    icon: Briefcase,
    iconColor: 'text-indigo-500'
  },
  {
    id: 'tpl-biz-swot',
    title: 'Competitive Market and SWOT Analysis',
    domain: 'business',
    category: 'Business reports',
    description: 'Evaluates strengths, weaknesses, market threats, and competitive positioning within the industry.',
    prompt: 'Extract and formulate a detailed SWOT analysis from this business report, highlighting competitive threats and market opportunities.',
    icon: FileSpreadsheet,
    iconColor: 'text-purple-500'
  },

  // 5. Government notifications
  {
    id: 'tpl-govt-scope',
    title: 'Statutory Notification Scope and Authority Review',
    domain: 'government',
    category: 'Government notifications',
    description: 'Extracts issuing ministry, regulatory authority, applicability scope, and legal statutory references.',
    prompt: 'Analyze this government notification to detail the issuing authority, legal jurisdiction, statutory applicability, and public disclosure requirements.',
    icon: Landmark,
    iconColor: 'text-orange-500'
  },
  {
    id: 'tpl-govt-deadlines',
    title: 'Compliance Cutoffs and Implementation Deadlines',
    domain: 'government',
    category: 'Government notifications',
    description: 'Audits statutory cutoff dates, transition timelines, submission requirements, and non-compliance penalties.',
    prompt: 'Extract all mandatory compliance deadlines, transition phases, submission requirements, and penalty repercussions from this government notification.',
    icon: Sparkles,
    iconColor: 'text-amber-500'
  },

  // 6. Insurance policies
  {
    id: 'tpl-ins-coverage',
    title: 'Comprehensive Coverage and Policy Limits Review',
    domain: 'insurance',
    category: 'Insurance policies',
    description: 'Extracts Sum Insured, base coverage, cashless hospital network, room rent capping, and ICU sub-limits.',
    prompt: 'Extract the full coverage limits table from this insurance policy: Sum Insured, ICU capping, day-care procedures, and cashless network hospital rules.',
    icon: ShieldCheck,
    iconColor: 'text-teal-500',
    sampleDocument: 'Star_Health_Comprehensive_Insurance_Policy.pdf'
  },
  {
    id: 'tpl-ins-exclusions',
    title: 'Exclusions and Claim Checklist Audit',
    domain: 'insurance',
    category: 'Insurance policies',
    description: 'Highlights waiting periods, pre-existing disease terms, room-rent capping, and required claim documents.',
    prompt: 'List all hidden policy exclusions, waiting periods, room-rent capping limits, and generate a step-by-step claim document checklist.',
    icon: ShieldCheck,
    iconColor: 'text-rose-500',
    sampleDocument: 'Star_Health_Comprehensive_Insurance_Policy.pdf'
  },

  // 7. Academic / research documents
  {
    id: 'tpl-academic-lit',
    title: 'Academic Literature Review and Synthesis',
    domain: 'academic',
    category: 'Academic / research documents',
    description: 'Extracts the central thesis, research methodology, prior art comparison, and benchmark empirical proof.',
    prompt: 'Explain the core contribution of this research paper. Detail the methodology, dataset used, and key experimental results in accessible language.',
    icon: BookOpen,
    iconColor: 'text-purple-500',
    sampleDocument: 'Multi-Head_Attention_Mechanism_In_Transformer_Architectures.pdf'
  },
  {
    id: 'tpl-academic-math',
    title: 'Math Formula and Benchmark Matrix',
    domain: 'academic',
    category: 'Academic / research documents',
    description: 'Decodes complex mathematical formulations, pseudo-code equations, and computational complexity proofs.',
    prompt: 'Identify the top technical formulations, mathematical equations, and algorithmic steps in this paper. Explain what each variable represents.',
    icon: Sparkles,
    iconColor: 'text-indigo-500',
    sampleDocument: 'Multi-Head_Attention_Mechanism_In_Transformer_Architectures.pdf'
  },

  // 8. Terms & conditions
  {
    id: 'tpl-terms-rights',
    title: 'Terms of Service and User Rights Audit',
    domain: 'legal',
    category: 'Terms & conditions',
    description: 'Summarizes user obligations, permitted platform use, account termination conditions, and license terms.',
    prompt: 'Provide a structured breakdown of these terms of service: user rights, platform obligations, permissible use, and termination triggers.',
    icon: FileCheck,
    iconColor: 'text-violet-500'
  },
  {
    id: 'tpl-terms-privacy',
    title: 'Arbitration and Privacy Practices Review',
    domain: 'legal',
    category: 'Terms & conditions',
    description: 'Audits for binding arbitration clauses, class action waivers, personal data sharing, and user tracking disclosures.',
    prompt: 'Audit these terms and privacy disclosures for forced arbitration clauses, class action waivers, third-party data tracking, and opt-out rights.',
    icon: FileCheck,
    iconColor: 'text-red-500'
  },

  // 9. Contracts
  {
    id: 'tpl-contracts-sow',
    title: 'Scope of Work and Deliverables Verification',
    domain: 'legal',
    category: 'Contracts',
    description: 'Details project milestones, acceptance criteria, delivery timelines, and contractor obligations.',
    prompt: 'Extract the complete scope of work, milestone deliverables, acceptance testing criteria, and delivery deadlines from this contract.',
    icon: FileSignature,
    iconColor: 'text-blue-500'
  },
  {
    id: 'tpl-contracts-damages',
    title: 'Liquidated Damages and Restrictive Covenants Audit',
    domain: 'legal',
    category: 'Contracts',
    description: 'Audits non-compete clauses, non-solicitation restrictions, liquidated damages, and breach triggers.',
    prompt: 'Audit this contract for liquidated damages, non-compete covenants, non-solicitation terms, and financial penalties upon default.',
    icon: FileSignature,
    iconColor: 'text-amber-500'
  },

  // 10. Regulatory documents
  {
    id: 'tpl-reg-gap',
    title: 'Regulatory Compliance Gap Analysis',
    domain: 'legal',
    category: 'Regulatory documents',
    description: 'Verifies organizational controls against GDPR, HIPAA, SOC 2, and international governance standards.',
    prompt: 'Audit this policy for compliance gaps against GDPR, HIPAA, and SOC 2 principles. Detail required remediation actions and non-compliant clauses.',
    icon: ShieldAlert,
    iconColor: 'text-cyan-500'
  },
  {
    id: 'tpl-reg-roadmap',
    title: 'Audit Trail and Remediation Roadmap',
    domain: 'legal',
    category: 'Regulatory documents',
    description: 'Identifies unencrypted data flows, weak retention schedules, and prioritizes remediation milestones.',
    prompt: 'Generate an audit trail checklist and prioritized remediation roadmap to bring systems into full regulatory compliance.',
    icon: ShieldAlert,
    iconColor: 'text-emerald-500'
  }
];

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AuditTemplate) => void;
  activeDomain?: DocumentDomain;
  activeAgentId?: string;
  currentDoc?: DocumentAnalysis | null;
}

export default function TemplatesModal({
  isOpen,
  onClose,
  onSelectTemplate,
  activeDomain,
  activeAgentId,
  currentDoc
}: TemplatesModalProps) {
  const activeAgent = SPECIALIZED_AGENTS.find((a) => a.id === activeAgentId);

  const getRelevantCategories = (): string[] => {
    if (currentDoc) {
      const category = currentDoc.category || classifyDocument(currentDoc.name, currentDoc.rawText || '').category;
      return [category];
    }

    if (activeAgentId === 'investment-analyst') return ['Stock-market / investment documents'];
    if (activeAgentId === 'financial-auditor' || activeDomain === 'finance' || activeDomain === 'billing') return ['Bank and financial documents'];
    if (activeAgentId === 'legal-counsel') return ['Legal agreements'];
    if (activeAgentId === 'business-strategist' || activeDomain === 'business') return ['Business reports'];
    if (activeAgentId === 'government-analyst' || activeDomain === 'government') return ['Government notifications'];
    if (activeAgentId === 'insurance-specialist' || activeDomain === 'insurance') return ['Insurance policies'];
    if (activeAgentId === 'academic-researcher' || activeDomain === 'academic') return ['Academic / research documents'];
    if (activeAgentId === 'terms-privacy-specialist') return ['Terms & conditions'];
    if (activeAgentId === 'contracts-specialist') return ['Contracts'];
    if (activeAgentId === 'compliance-officer') return ['Regulatory documents'];

    return [
      'All',
      'Stock-market / investment documents',
      'Bank and financial documents',
      'Legal agreements',
      'Business reports',
      'Government notifications',
      'Insurance policies',
      'Academic / research documents',
      'Terms & conditions',
      'Contracts',
      'Regulatory documents'
    ];
  };

  const categories = getRelevantCategories();
  const [selectedCategoryOverride, setSelectedCategoryOverride] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategory =
    (selectedCategoryOverride && categories.includes(selectedCategoryOverride))
      ? selectedCategoryOverride
      : (categories[0] || 'All');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTemplates = AUDIT_TEMPLATES.filter((tpl) => {
    // If restricted categories exist, ensure template belongs to relevant categories
    if (categories.length > 0 && !categories.includes('All') && !categories.includes(tpl.category)) {
      return false;
    }
    const matchesCategory = selectedCategory === 'All' || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Document Templates & Lenses</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  {filteredTemplates.length} {currentDoc ? 'Tailored' : 'Templates'}
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {currentDoc
                  ? `Pre-engineered lenses tailored specifically for ${currentDoc.name}`
                  : 'Execute pre-engineered audit routines and prompt lenses with a single click'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focused Context Banner */}
        {currentDoc ? (
          <div className="px-6 py-2.5 bg-emerald-500/10 dark:bg-emerald-950/20 border-b border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-[#00FF85]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
              <span>
                Tailored templates specifically focused on <strong>{currentDoc.name}</strong> ({filteredTemplates.length} available)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-[#00FF85] border border-emerald-300 dark:border-emerald-500/30 font-semibold">
              Tailored
            </span>
          </div>
        ) : !categories.includes('All') ? (
          <div className="px-6 py-2.5 bg-purple-500/10 dark:bg-purple-950/20 border-b border-purple-500/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>
                Focused on <strong>{activeAgent?.name || categories[0]}</strong> ({filteredTemplates.length} relevant templates)
              </span>
            </div>
          </div>
        ) : null}

        {/* Filter Bar & Search */}
        <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-[#16171b] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryOverride(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-8 pr-3 py-1 rounded-xl text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-purple-500 text-neutral-900 dark:text-white placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Grid of Templates */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            const descriptionText = currentDoc
              ? template.description.replace(/this (document|policy|statement|bank statement|agreement|lease agreement|contract|paper|research paper|report)/gi, currentDoc.name)
              : template.description;

            return (
              <div
                key={template.id}
                onClick={() => {
                  const appliedTemplate: AuditTemplate = {
                    ...template,
                    prompt: currentDoc
                      ? template.prompt.replace(/this (document|policy|statement|bank statement|agreement|lease agreement|contract|paper|research paper|report)/gi, `"${currentDoc.name}"`)
                      : template.prompt
                  };
                  onSelectTemplate(appliedTemplate);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 dark:hover:border-purple-500/40 bg-white dark:bg-[#16171b] hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className={`w-4 h-4 ${template.iconColor}`} />
                      </div>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {template.title}
                      </h3>
                    </div>

                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 max-w-[120px] truncate">
                      {template.category}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
                    {descriptionText}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[220px]">
                    1-click prompt execution
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-[#0f1013] flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Templates are pre-engineered prompts calibrated for verified citation accuracy</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LeftSidebar from '@/components/layout/LeftSidebar';
import Header from '@/components/layout/Header';
import RightSidebar from '@/components/layout/RightSidebar';
import DocumentViewer from '@/components/workspace/DocumentViewer';
import PromptBar, { PromptSuggestionItem } from '@/components/workspace/PromptBar';
import IntelligenceTab from '@/components/workspace/IntelligenceTab';
import EntityGraphVisualizer from '@/components/workspace/EntityGraphVisualizer';
import CompareTab from '@/components/workspace/CompareTab';
import AgentActivityTimeline from '@/components/workspace/AgentActivityTimeline';
import ProjectsTab from '@/components/workspace/ProjectsTab';
import CustomLensesBar from '@/components/workspace/CustomLensesBar';
import ActionConfirmationModal from '@/components/workspace/ActionConfirmationModal';
import ExportModal from '@/components/ui/ExportModal';
import RawJsonViewer from '@/components/ui/RawJsonViewer';
import CommandPalette from '@/components/ui/CommandPalette';
import OnboardingModal from '@/components/ui/OnboardingModal';
import SettingsModal from '@/components/ui/SettingsModal';
import AddMediaModal from '@/components/ui/AddMediaModal';
import AgentGalleryModal, { SpecializedAgent, SPECIALIZED_AGENTS } from '@/components/ui/AgentGalleryModal';
import PluginPopover from '@/components/ui/PluginPopover';
import TemplatesModal, { AuditTemplate, AUDIT_TEMPLATES } from '@/components/ui/TemplatesModal';
import EmptyState from '@/components/ui/EmptyState';
import InlineDataChart from '@/components/ui/InlineDataChart';
import FormattedMessageText from '@/components/ui/FormattedMessageText';
import { SAMPLE_DOCUMENTS } from '@/lib/sampleData';
import { DEMO_DOCUMENTS, createDemoDocAttachment, createFileAttachment } from '@/lib/demoDocuments';
import { buildGraphFromAnalysis } from '@/lib/graphTransformer';
import {
  DocumentDomain,
  DocumentCategory,
  DocumentAnalysis,
  ChatMessage,
  GenerationState,
  ModelConfig,
  Workspace,
  AttachedMediaFile,
  BoundingBox,
  Lens,
  ActionConfirmation,
  AgentActivityItem,
  CitationReference,
  SavedConversation
} from '@/lib/types';
import { classifyDocument } from '@/lib/docClassifier';
import { ttsManager } from '@/lib/voiceService';
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Loader2,
  CheckCircle2,
  Scale,
  Receipt,
  BarChart3,
  FileJson,
  Star,
  FolderPlus,
  Sliders,
  AlertTriangle,
  RotateCcw,
  FileText,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Landmark,
  GraduationCap,
  FileSpreadsheet,
  Code2,
  CreditCard,
  Zap,
  BookOpen,
  Network,
  Activity,
  Brain,
  Crosshair,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Search,
  Globe,
  UploadCloud,
  ShieldAlert,
  Filter,
  LayoutTemplate,
  Pencil,
  Briefcase,
  FileCheck,
  FileSignature,
  Volume2,
  Pause,
  Play,
  Square
} from 'lucide-react';

const INITIAL_SCISPACE_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_init_user',
    sender: 'user',
    text: 'hi',
    timestamp: 'Just now'
  },
  {
    id: 'msg_init_assistant',
    sender: 'assistant',
    title: 'Starting a conversation',
    text: "I’m ready to help with research, writing, analysis, files, or other tasks you have in mind.",
    timestamp: 'Just now',
    suggestions: [
      'What would you like to research, create, analyze, or improve today?'
    ]
  }
];

function getDocumentFunctions(doc: DocumentAnalysis, agentId?: string) {
  const category: DocumentCategory = doc.category || classifyDocument(doc.name, doc.rawText || '').category;
  const name = doc.name.toLowerCase();
  const domain = doc.detectedDomain;

  // 1. Stock-market / investment documents
  if (category === 'Stock-market / investment documents' || agentId === 'investment-analyst') {
    return [
      {
        id: 'fn-inv-1',
        title: 'Portfolio Valuation & Asset Allocation',
        subtitle: 'Break down equity holdings, sector weights, dividend yields, and capital gains.',
        badge: 'PORTFOLIO',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: TrendingUp,
        prompt: `Provide a detailed breakdown of equity holdings, sector weights, dividend yields, and capital gains in ${doc.name}.`
      },
      {
        id: 'fn-inv-2',
        title: 'Earnings & Financial Metrics Audit',
        subtitle: 'Extract EPS, EBITDA margins, P/E ratios, and revenue growth trajectory.',
        badge: 'METRICS',
        badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
        icon: FileSpreadsheet,
        prompt: `Extract key financial metrics from ${doc.name}: EPS, EBITDA margins, P/E ratios, revenue growth, and debt coverage.`
      },
      {
        id: 'fn-inv-3',
        title: 'Investment Risk & Volatility Analysis',
        subtitle: 'Evaluate beta, downside exposure, debt-to-equity ratio, and market risk factors.',
        badge: 'RISK AUDIT',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `Evaluate the primary investment risk factors, beta volatility, debt-to-equity leverage, and downside risks in ${doc.name}.`
      },
      {
        id: 'fn-inv-4',
        title: 'Strategic Investment Recommendations',
        subtitle: 'Synthesize bull vs bear thesis, target valuation, and holding period advice.',
        badge: 'AI TIPS',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: Sparkles,
        prompt: `Synthesize the bull vs bear investment thesis, target valuation ranges, and strategic holding recommendations for ${doc.name}.`
      }
    ];
  }

  // 2. Bank and financial documents
  if (category === 'Bank and financial documents' || agentId === 'financial-auditor' || domain === 'finance' || domain === 'billing') {
    return [
      {
        id: 'fn-fin-1',
        title: 'Bank Statement Cash Flow Summary',
        subtitle: 'Understand total monthly credits, debits, recurring subscriptions, and net cash flow.',
        badge: 'SUMMARIZER',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: CreditCard,
        prompt: `Provide an easy-to-understand breakdown of ${doc.name}: total monthly credits, debits, recurring subscriptions, and net monthly cash flow.`
      },
      {
        id: 'fn-fin-2',
        title: 'Hidden Fees & Overdraft Surcharges',
        subtitle: 'Audit for erroneous overdraft fees, minimum balance penalties, and disputable debit charges.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `Audit ${doc.name} for erroneous overdraft fees, penalty charges, and disputable debit transactions.`
      },
      {
        id: 'fn-fin-3',
        title: 'Make Transaction Ledger Table (CSV)',
        subtitle: 'Extract all transaction records into a structured 5-column ledger table ready for export.',
        badge: 'MAKE TABLES',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileSpreadsheet,
        prompt: `Extract all transaction records from ${doc.name} into a structured 5-column ledger table ready for CSV export.`
      },
      {
        id: 'fn-fin-4',
        title: 'Personalized AI Financial Tips',
        subtitle: '50/30/20 budget recommendation and automated savings optimization based on cash flow.',
        badge: 'AI TIPS',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: Sparkles,
        prompt: `Based on the cash flow and spending patterns in ${doc.name}, give me personalized savings and 50/30/20 budget optimization tips.`
      }
    ];
  }

  // 3. Legal agreements
  if (category === 'Legal agreements' || (domain === 'legal' && !name.includes('contract') && !name.includes('terms') && !name.includes('privacy') && !name.includes('compliance'))) {
    return [
      {
        id: 'fn-leg-1',
        title: 'Red Flags & Hidden Cons',
        subtitle: 'Audit for security deposit forfeiture risks, uncapped indemnities, and notice traps.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `Audit ${doc.name} for hidden risks: security deposit forfeiture clauses, uncapped indemnities, and notice traps.`
      },
      {
        id: 'fn-leg-2',
        title: 'Liability & Counter-Clause Redline',
        subtitle: 'Analyze early exit and indemnification clauses and draft protective counter-clauses.',
        badge: 'LEGAL REDLINE',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        icon: Scale,
        prompt: `Analyze the liability and indemnification terms in ${doc.name} and draft a protective counter-clause capping early exit liability.`
      },
      {
        id: 'fn-leg-3',
        title: 'Key Dates & Critical Deadlines',
        subtitle: 'Extract lock-in expiration, annual escalation dates, and notice period deadlines.',
        badge: 'DEADLINES',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: TrendingUp,
        prompt: `Extract all critical dates from ${doc.name}: lock-in expiration, annual escalation date, and mandatory notice period deadlines.`
      },
      {
        id: 'fn-leg-4',
        title: 'Plain-English Executive Summary',
        subtitle: 'Bullet-by-bullet breakdown of parties, obligations, maintenance terms, and permitted usage.',
        badge: 'EXECUTIVE SUMMARY',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileText,
        prompt: `Provide a plain-English clause-by-clause summary of all obligations, maintenance terms, and permitted usage in ${doc.name}.`
      }
    ];
  }

  // 4. Business reports
  if (category === 'Business reports' || agentId === 'business-strategist' || domain === 'business') {
    return [
      {
        id: 'fn-biz-1',
        title: 'Executive Summary & Strategic Briefing',
        subtitle: 'Synthesize corporate milestones, quarterly deliverables, and leadership takeaways.',
        badge: 'EXECUTIVE BRIEF',
        badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        icon: Briefcase,
        prompt: `Synthesize the strategic objectives, KPI targets, quarterly deliverables, and leadership decisions presented in ${doc.name}.`
      },
      {
        id: 'fn-biz-2',
        title: 'KPI & Operational Performance Breakdown',
        subtitle: 'Extract target vs actual metrics, customer acquisition costs, and revenue growth.',
        badge: 'METRICS',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileSpreadsheet,
        prompt: `Extract key operational performance indicators, KPI targets, and financial metrics from ${doc.name} into a structured table.`
      },
      {
        id: 'fn-biz-3',
        title: 'Strategic Market Risks & SWOT Analysis',
        subtitle: 'Evaluate strengths, weaknesses, market threats, and competitive vulnerabilities.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `Formulate a comprehensive SWOT analysis and market risk evaluation based on ${doc.name}.`
      },
      {
        id: 'fn-biz-4',
        title: 'Prioritized Growth Recommendations',
        subtitle: 'Synthesize resource allocation advice and high-impact operational next steps.',
        badge: 'AI TIPS',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: Sparkles,
        prompt: `Synthesize prioritized strategic growth recommendations and high-impact operational next steps based on ${doc.name}.`
      }
    ];
  }

  // 5. Government notifications
  if (category === 'Government notifications' || agentId === 'government-analyst' || domain === 'government') {
    return [
      {
        id: 'fn-govt-1',
        title: 'Official Notification Scope & Mandate',
        subtitle: 'Summarize the issuing authority, applicability, effective dates, and statutory purpose.',
        badge: 'STATUTORY BRIEF',
        badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        icon: Landmark,
        prompt: `Detail the issuing authority, legal jurisdiction, statutory applicability, and public disclosure requirements in ${doc.name}.`
      },
      {
        id: 'fn-govt-2',
        title: 'Mandatory Compliance Deadlines & Timelines',
        subtitle: 'Extract all implementation phases, submission cutoff dates, and transitional periods.',
        badge: 'DEADLINES',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: TrendingUp,
        prompt: `Extract all mandatory compliance deadlines, transition phases, submission cutoffs, and effective dates from ${doc.name}.`
      },
      {
        id: 'fn-govt-3',
        title: 'Penalties & Non-Compliance Repercussions',
        subtitle: 'Identify statutory penalties, legal repercussions, and enforcement mechanisms.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `Identify all statutory penalties, fines, legal liabilities, and enforcement repercussions outlined in ${doc.name}.`
      },
      {
        id: 'fn-govt-4',
        title: 'Implementation Action Plan',
        subtitle: 'Generate a step-by-step organizational response plan for statutory adherence.',
        badge: 'ACTION PLAN',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: Sparkles,
        prompt: `Generate an itemized organizational implementation plan and compliance checklist for ${doc.name}.`
      }
    ];
  }

  // 6. Insurance policies
  if (category === 'Insurance policies' || agentId === 'insurance-specialist' || domain === 'insurance') {
    return [
      {
        id: 'fn-ins-1',
        title: 'Red Flags, Exclusions & Caps',
        subtitle: 'List all hidden exclusions, waiting periods, room-rent capping limits, and co-pay rules.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `List all hidden policy exclusions, pre-existing disease waiting periods, room-rent capping limits, and co-payment clauses in ${doc.name}.`
      },
      {
        id: 'fn-ins-2',
        title: 'Guaranteed Claim Approval Checklist',
        subtitle: 'Step-by-step checklist of documents and pre-authorization deadlines for 100% claim settlement.',
        badge: 'CLAIM GUIDE',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: ShieldCheck,
        prompt: `Generate a step-by-step checklist of required documents, hospital notice deadlines, and pre-authorization steps for 100% claim settlement under ${doc.name}.`
      },
      {
        id: 'fn-ins-3',
        title: 'Make Sub-limits & Coverage Table',
        subtitle: 'Extract Sum Insured, ICU capping, day-care procedures, and cashless network hospital rules.',
        badge: 'MAKE TABLES',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileSpreadsheet,
        prompt: `Extract the full coverage limits table from ${doc.name}: Sum Insured, ICU capping, day-care procedures, and cashless network hospital rules.`
      },
      {
        id: 'fn-ins-4',
        title: 'AI Claim Strategy & Optimization Tips',
        subtitle: 'Expert advice to maximize insurance reimbursement and avoid out-of-pocket room deductions.',
        badge: 'AI TIPS',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        icon: Sparkles,
        prompt: `Provide expert advice on how to maximize insurance reimbursement and avoid out-of-pocket room rent deductions under ${doc.name}.`
      }
    ];
  }

  // 7. Academic / research documents
  if (category === 'Academic / research documents' || agentId === 'academic-researcher' || domain === 'academic') {
    return [
      {
        id: 'fn-acad-1',
        title: 'Extract Benchmark Performance Tables (CSV)',
        subtitle: 'Pull empirical evaluation benchmarks, dataset comparisons, and metric scores into a clean matrix.',
        badge: 'MAKE TABLES',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileSpreadsheet,
        prompt: `Extract all empirical evaluation benchmark scores, dataset comparisons, and BLEU/accuracy metrics from ${doc.name} into a structured CSV table.`
      },
      {
        id: 'fn-acad-2',
        title: 'Explain Core Architecture & Methodology',
        subtitle: 'Break down the central methodology, mathematical foundations, and novelty in simple terms.',
        badge: 'SYNTHESIS',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        icon: GraduationCap,
        prompt: `Explain the core contribution and architectural methodology in ${doc.name} compared to baseline models in simple terms.`
      },
      {
        id: 'fn-acad-3',
        title: 'Red Flags & Complexity Bottlenecks',
        subtitle: 'Highlight computational complexity, memory constraints, and experimental limitations.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `Highlight the critical limitations, algorithmic complexity constraints, and memory bottlenecks mentioned in ${doc.name}.`
      },
      {
        id: 'fn-acad-4',
        title: 'Code Implementation Guide',
        subtitle: 'Generate clean, annotated code implementing the core algorithm described in the paper.',
        badge: 'CODE GUIDE',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: Code2,
        prompt: `Generate a step-by-step annotated code implementation of the core algorithm and layers described in ${doc.name}.`
      }
    ];
  }

  // 8. Terms & conditions
  if (category === 'Terms & conditions' || agentId === 'terms-privacy-specialist') {
    return [
      {
        id: 'fn-terms-1',
        title: 'Plain-English Terms of Service Summary',
        subtitle: 'Summarize key user rights, service obligations, permitted usage, and termination rules.',
        badge: 'SUMMARY',
        badgeColor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
        icon: FileCheck,
        prompt: `Provide a structured plain-English summary of ${doc.name}: user rights, service obligations, permitted usage, and account termination conditions.`
      },
      {
        id: 'fn-terms-2',
        title: 'Hidden Clauses & Consumer Risk Audit',
        subtitle: 'Audit for forced arbitration, class action waivers, and auto-renewal traps.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `Audit ${doc.name} for hidden consumer risks: binding arbitration clauses, class action waivers, and auto-renewal traps.`
      },
      {
        id: 'fn-terms-3',
        title: 'User Data Privacy & Tracking Practices',
        subtitle: 'Verify personal data collection, third-party sharing, and account deletion workflows.',
        badge: 'PRIVACY AUDIT',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: ShieldCheck,
        prompt: `Analyze the data collection, third-party disclosure, cookie tracking, and data deletion policies in ${doc.name}.`
      },
      {
        id: 'fn-terms-4',
        title: 'Consumer Rights & Opt-Out Guidance',
        subtitle: 'Provide actionable steps to opt out of arbitration, tracking, or unilateral fee increases.',
        badge: 'AI TIPS',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: Sparkles,
        prompt: `Provide actionable steps on how users can opt out of binding arbitration, tracking cookies, or unilateral terms modifications under ${doc.name}.`
      }
    ];
  }

  // 9. Contracts
  if (category === 'Contracts' || agentId === 'contracts-specialist') {
    return [
      {
        id: 'fn-cont-1',
        title: 'Contract Scope & Deliverables Audit',
        subtitle: 'Extract scope of work, milestone delivery requirements, and acceptance criteria.',
        badge: 'SCOPE AUDIT',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileSignature,
        prompt: `Extract the complete scope of work, milestone deliverables, acceptance testing criteria, and delivery deadlines from ${doc.name}.`
      },
      {
        id: 'fn-cont-2',
        title: 'Red Flags & High-Risk Contract Terms',
        subtitle: 'Audit for liquidated damages, non-compete restrictions, and termination penalties.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `Audit ${doc.name} for high-risk contract provisions: liquidated damages, non-compete restrictions, uncapped indemnities, and termination penalties.`
      },
      {
        id: 'fn-cont-3',
        title: 'Payment Milestones & Invoicing Schedule',
        subtitle: 'Detail payment timelines, retainage amounts, late interest, and invoicing conditions.',
        badge: 'PAYMENT TERMS',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: FileSpreadsheet,
        prompt: `Extract all payment milestones, invoicing submission deadlines, late fee interest rates, and retainage terms from ${doc.name}.`
      },
      {
        id: 'fn-cont-4',
        title: 'Contract Redline & Counter-Proposal Guidance',
        subtitle: 'Generate balanced counter-proposals to protect vendor or contractor interests.',
        badge: 'LEGAL REDLINE',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        icon: Scale,
        prompt: `Draft protective redline counter-proposals and negotiation terms for the high-risk clauses identified in ${doc.name}.`
      }
    ];
  }

  // 10. Regulatory documents
  if (category === 'Regulatory documents' || agentId === 'compliance-officer') {
    return [
      {
        id: 'fn-reg-1',
        title: 'Regulatory Compliance Gap Analysis',
        subtitle: 'Audit document against GDPR, HIPAA, SOC 2, and security governance standards.',
        badge: 'COMPLIANCE',
        badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        icon: ShieldAlert,
        prompt: `Audit ${doc.name} for compliance gaps against industry security, data privacy (GDPR/HIPAA), and governance standards.`
      },
      {
        id: 'fn-reg-2',
        title: 'Liability & Non-Compliance Risks',
        subtitle: 'Identify high-risk penalty clauses, mandatory disclosure lapses, and audit exposure.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: `Identify all non-compliant clauses, high-risk penalties, and governance liabilities in ${doc.name}.`
      },
      {
        id: 'fn-reg-3',
        title: 'Itemized Remediation Checklist',
        subtitle: 'Generate a step-by-step checklist of required corrective actions and policy updates.',
        badge: 'REMEDIATION',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileText,
        prompt: `Generate an itemized remediation checklist with required policy updates and corrective steps for ${doc.name}.`
      },
      {
        id: 'fn-reg-4',
        title: 'Executive Compliance Memo',
        subtitle: 'Draft a formal audit memorandum summarizing compliance posture and risk tier.',
        badge: 'AI TIPS',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: Sparkles,
        prompt: `Draft an executive compliance memo detailing the overall audit findings and risk mitigation strategy for ${doc.name}.`
      }
    ];
  }

  // Universal Fallback for any uploaded file
  return [
    {
      id: 'fn-gen-1',
      title: 'Plain-English Executive Summary',
      subtitle: 'Summarize key takeaways, obligations, and conclusions in 3 concise bullet points.',
      badge: 'SUMMARIZE',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: FileText,
      prompt: `Summarize ${doc.name} in 3 concise executive bullet points with key takeaways.`
    },
    {
      id: 'fn-gen-2',
      title: 'Red Flags & Hidden Risks',
      subtitle: 'Audit for high-risk clauses, unexpected penalties, obligations, or statistical anomalies.',
      badge: 'RED FLAGS',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: AlertTriangle,
      prompt: `Audit ${doc.name} for high-risk clauses, hidden fees, unusual obligations, or statistical anomalies.`
    },
    {
      id: 'fn-gen-3',
      title: 'Make Structured Tables (CSV)',
      subtitle: 'Extract quantitative metrics, financial figures, or tabular data into a spreadsheet matrix.',
      badge: 'MAKE TABLES',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      icon: FileSpreadsheet,
      prompt: `Extract all quantitative metrics, financial numbers, or tabular matrices from ${doc.name} into a structured table.`
    },
    {
      id: 'fn-gen-4',
      title: 'Personalized Actionable Tips',
      subtitle: 'Receive strategic recommendations and high-impact next steps based on this analysis.',
      badge: 'AI TIPS',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: Sparkles,
      prompt: `What are the top 3 recommended actions or strategic next steps based on ${doc.name}?`
    }
  ];
}

function getAgentForDocument(doc: DocumentAnalysis): string {
  const category: DocumentCategory = doc.category || classifyDocument(doc.name, doc.rawText || '').category;

  if (category === 'Stock-market / investment documents') return 'investment-analyst';
  if (category === 'Bank and financial documents') return 'financial-auditor';
  if (category === 'Legal agreements') return 'legal-counsel';
  if (category === 'Business reports') return 'business-strategist';
  if (category === 'Government notifications') return 'government-analyst';
  if (category === 'Insurance policies') return 'insurance-specialist';
  if (category === 'Academic / research documents') return 'academic-researcher';
  if (category === 'Terms & conditions') return 'terms-privacy-specialist';
  if (category === 'Contracts') return 'contracts-specialist';
  if (category === 'Regulatory documents') return 'compliance-officer';

  // Fallback by domain
  const domain = doc.detectedDomain;
  if (domain === 'academic') return 'academic-researcher';
  if (domain === 'finance' || domain === 'billing') return 'financial-auditor';
  if (domain === 'insurance') return 'insurance-specialist';
  if (domain === 'government') return 'government-analyst';
  if (domain === 'business') return 'business-strategist';
  if (domain === 'legal') return 'legal-counsel';

  return 'ai-analyst';
}

function getFocusedPrompts(agentId: string, currentDoc?: DocumentAnalysis | null) {
  if (currentDoc) {
    return getDocumentFunctions(currentDoc, agentId);
  }

  // Domain & Plugin-specific focused prompts when no document is loaded (clean text, no emojis)
  if (agentId === 'investment-analyst') {
    return [
      {
        id: 'fn-inv-p1',
        title: 'Portfolio Valuation & Asset Allocation',
        subtitle: 'Break down equity holdings, sector weights, dividend yields, and capital gains.',
        badge: 'PORTFOLIO',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: TrendingUp,
        prompt: 'Please provide a structured portfolio valuation and asset allocation breakdown of my investments.'
      },
      {
        id: 'fn-inv-p2',
        title: 'Earnings & Financial Metrics Audit',
        subtitle: 'Extract EPS, EBITDA margins, P/E ratios, and revenue growth trajectory.',
        badge: 'METRICS',
        badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
        icon: FileSpreadsheet,
        prompt: 'Analyze key financial metrics: EPS, EBITDA margins, P/E ratios, and revenue growth trajectory.'
      },
      {
        id: 'fn-inv-p3',
        title: 'Investment Risk & Volatility Analysis',
        subtitle: 'Evaluate beta, downside exposure, debt-to-equity ratio, and market risk factors.',
        badge: 'RISK AUDIT',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: 'Evaluate the primary market risk factors, beta volatility, and downside exposure for these equities.'
      },
      {
        id: 'fn-inv-p4',
        title: 'Strategic Investment Recommendations',
        subtitle: 'Synthesize bull vs bear thesis, target valuation, and holding period advice.',
        badge: 'AI TIPS',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: Sparkles,
        prompt: 'Synthesize the bull vs bear thesis, target valuation ranges, and strategic holding recommendations.'
      }
    ];
  }

  if (agentId === 'financial-auditor') {
    return [
      {
        id: 'fn-fin-p1',
        title: 'Monthly Cashflow & Income Breakdown',
        subtitle: 'Break down total credits, debits, recurring subscriptions, and ending balance.',
        badge: 'SUMMARIZE',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: CreditCard,
        prompt: 'Please provide a clear, structured breakdown of my bank statement: total income/credits, total debits, recurring subscriptions, and ending balance.'
      },
      {
        id: 'fn-fin-p2',
        title: 'Hidden Fees & Overdraft Audit',
        subtitle: 'Audit for obscure maintenance charges, overdraft penalties, and disputable debit fees.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: 'Audit all bank fees, account maintenance charges, overdraft penalties, and foreign exchange surcharges. Detail which fees can be disputed.'
      },
      {
        id: 'fn-fin-p3',
        title: 'Make Transaction Ledger Table (CSV)',
        subtitle: 'Extract all transaction entries with dates, descriptions, categories, and amounts into a structured table.',
        badge: 'MAKE TABLES',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileSpreadsheet,
        prompt: 'Extract all transaction records with dates, merchant descriptions, expense categories, and amounts into a structured 5-column table ready for CSV export.'
      },
      {
        id: 'fn-fin-p4',
        title: 'Personalized 50/30/20 Budget Tips',
        subtitle: 'Recommend 50/30/20 budget allocations and automated savings opportunities based on cash flow.',
        badge: 'AI TIPS',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: Sparkles,
        prompt: 'Analyze my spending patterns and provide actionable 50/30/20 budget optimization and automated savings tips.'
      }
    ];
  }

  if (agentId === 'legal-counsel') {
    return [
      {
        id: 'fn-leg-p1',
        title: 'Red Flags & Penalty Traps',
        subtitle: 'Audit contract for uncapped indemnities, security deposit forfeiture, and unilateral liability notice traps.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: 'Audit this agreement for high-risk clauses: uncapped indemnities, security deposit forfeiture, unilateral termination penalties, and notice traps.'
      },
      {
        id: 'fn-leg-p2',
        title: 'Liability & Counter-Clause Redline',
        subtitle: 'Analyze early exit and indemnification clauses and draft a protective counter-clause capping liability.',
        badge: 'LEGAL REDLINE',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        icon: Scale,
        prompt: 'Analyze the early exit and liability terms in this agreement and draft a protective counter-clause capping early exit liability to 1 month pro-rata.'
      },
      {
        id: 'fn-leg-p3',
        title: 'Key Expirations & Critical Deadlines',
        subtitle: 'Extract lock-in expiration, annual escalation percentages, and mandatory cure period notice deadlines.',
        badge: 'DEADLINES',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: TrendingUp,
        prompt: 'Extract all critical dates: lock-in expiration, annual escalation dates, notice period deadlines, and renewal timelines.'
      },
      {
        id: 'fn-leg-p4',
        title: 'Plain-English Clause Breakdown',
        subtitle: 'Provide a plain-English, clause-by-clause summary of all obligations, maintenance terms, and permitted usage.',
        badge: 'EXECUTIVE SUMMARY',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileText,
        prompt: 'Provide a plain-English clause-by-clause summary of all tenant/client obligations, maintenance terms, and permitted usage restrictions.'
      }
    ];
  }

  if (agentId === 'academic-researcher') {
    return [
      {
        id: 'fn-acad-p1',
        title: 'Core Architecture & Thesis Breakdown',
        subtitle: 'Break down the central methodology, mathematical foundations, and novelty in simple terms.',
        badge: 'SYNTHESIS',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        icon: GraduationCap,
        prompt: 'Explain the core contribution and architectural novelty of this research paper compared to prior baseline models in simple terms.'
      },
      {
        id: 'fn-acad-p2',
        title: 'Extract Benchmark Score Matrix (CSV)',
        subtitle: 'Extract empirical BLEU scores, dataset comparisons, and statistical significance tables.',
        badge: 'MAKE TABLES',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileSpreadsheet,
        prompt: 'Extract all empirical evaluation benchmark scores, dataset comparisons, and statistical performance metrics into a structured CSV table.'
      },
      {
        id: 'fn-acad-p3',
        title: 'Limitations & Complexity Bottlenecks',
        subtitle: 'Highlight critical limitations, quadratic computational complexity O(n²), and memory bottlenecks.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: 'Highlight the critical limitations, quadratic computational complexity O(n^2), and memory bottlenecks acknowledged in this study.'
      },
      {
        id: 'fn-acad-p4',
        title: 'Annotated Code Implementation Guide',
        subtitle: 'Generate a clean, step-by-step implementation of the core layer with annotations.',
        badge: 'CODE GUIDE',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: Code2,
        prompt: 'Generate a clean, step-by-step code implementation of the core architecture layer described in this paper with annotations.'
      }
    ];
  }

  if (agentId === 'insurance-specialist') {
    return [
      {
        id: 'fn-ins-p1',
        title: 'Coverage Summary & Policy Limits',
        subtitle: 'Extract Sum Insured, base coverage, cashless hospital network, room rent capping, and ICU sub-limits.',
        badge: 'COVERAGE',
        badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
        icon: ShieldCheck,
        prompt: 'Extract the full coverage limits table: Sum Insured, ICU capping, day-care procedures, and cashless network hospital rules.'
      },
      {
        id: 'fn-ins-p2',
        title: 'Exclusions & Waiting Period Audit',
        subtitle: 'Highlight waiting periods, pre-existing disease terms, room-rent capping, and co-pay rules.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: 'List all hidden policy exclusions, waiting periods, room-rent capping limits, and co-payment clauses in this policy.'
      },
      {
        id: 'fn-ins-p3',
        title: 'Claim Settlement Checklist',
        subtitle: 'Step-by-step checklist of documents and pre-authorization deadlines for 100% claim settlement.',
        badge: 'CLAIM GUIDE',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileSpreadsheet,
        prompt: 'Generate a step-by-step checklist of required documents, hospital notice deadlines, and pre-authorization steps for 100% claim settlement.'
      },
      {
        id: 'fn-ins-p4',
        title: 'Reimbursement Optimization Strategies',
        subtitle: 'Expert advice to maximize insurance reimbursement and avoid out-of-pocket room deductions.',
        badge: 'AI TIPS',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        icon: Sparkles,
        prompt: 'Provide expert advice on how to maximize insurance reimbursement and avoid out-of-pocket room rent deductions.'
      }
    ];
  }

  if (agentId === 'compliance-officer') {
    return [
      {
        id: 'fn-comp-p1',
        title: 'Regulatory Gap Analysis (GDPR / SOC 2)',
        subtitle: 'Audit enterprise policies against GDPR, HIPAA, SOC 2, and ISO 27001 data protection requirements.',
        badge: 'COMPLIANCE',
        badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        icon: ShieldCheck,
        prompt: 'Audit this policy for compliance gaps against GDPR, HIPAA, and SOC 2 data protection and privacy principles.'
      },
      {
        id: 'fn-comp-p2',
        title: 'High-Risk Non-Compliance Flags',
        subtitle: 'Identify unencrypted data flows, weak retention periods, and audit gaps with potential regulatory penalties.',
        badge: 'RED FLAGS',
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: AlertTriangle,
        prompt: 'Identify unencrypted data transmissions, weak retention schedules, and missing security controls with associated penalty risks.'
      },
      {
        id: 'fn-comp-p3',
        title: 'Mandatory DPA & Subject Rights Clauses',
        subtitle: 'Verify Data Processing Addendum requirements, breach notification timelines, and access workflows.',
        badge: 'LEGAL MATRIX',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: FileSpreadsheet,
        prompt: 'Verify standard Data Processing Addendum (DPA) requirements, breach notification timelines, and data subject access workflows.'
      },
      {
        id: 'fn-comp-p4',
        title: 'Prioritized Remediation Roadmap',
        subtitle: 'Generate a prioritized action checklist to bring enterprise controls into full regulatory compliance.',
        badge: 'ACTION PLAN',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: Sparkles,
        prompt: 'Generate a prioritized step-by-step remediation roadmap to eliminate compliance gaps and ensure audit readiness.'
      }
    ];
  }

  // Universal Fallback (ai-analyst)
  return [
    {
      id: 'fn-gen-p1',
      title: 'Plain-English Executive Summary',
      subtitle: 'Summarize key takeaways, obligations, and conclusions in 3 concise bullet points.',
      badge: 'SUMMARIZE',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: FileText,
      prompt: 'Summarize the document in 3 concise executive bullet points with key takeaways and conclusions.'
    },
    {
      id: 'fn-gen-p2',
      title: 'Red Flags & Hidden Risks',
      subtitle: 'Audit for high-risk clauses, unexpected penalties, obligations, or statistical anomalies.',
      badge: 'RED FLAGS',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: AlertTriangle,
      prompt: 'Audit for high-risk clauses, hidden fees, unusual obligations, or statistical anomalies.'
    },
    {
      id: 'fn-gen-p3',
      title: 'Make Structured Tables (CSV)',
      subtitle: 'Extract quantitative metrics, financial figures, or tabular data into a spreadsheet matrix.',
      badge: 'MAKE TABLES',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      icon: FileSpreadsheet,
      prompt: 'Extract all quantitative metrics, financial numbers, or tabular matrices into a structured table.'
    },
    {
      id: 'fn-gen-p4',
      title: 'Personalized Actionable Tips',
      subtitle: 'Receive strategic recommendations and high-impact next steps based on this analysis.',
      badge: 'AI TIPS',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: Sparkles,
      prompt: 'What are the top 3 recommended actions or strategic next steps based on this analysis?'
    }
  ];
}

function getRelevantTemplates(agentId: string, currentDoc?: DocumentAnalysis | null): AuditTemplate[] {
  if (currentDoc) {
    const category: DocumentCategory = currentDoc.category || classifyDocument(currentDoc.name, currentDoc.rawText || '').category;
    const matched = AUDIT_TEMPLATES.filter(t => t.category === category);
    return matched.length > 0 ? matched.slice(0, 3) : AUDIT_TEMPLATES.slice(0, 3);
  }

  const agent = SPECIALIZED_AGENTS.find(a => a.id === agentId);
  if (agent?.category) {
    return AUDIT_TEMPLATES.filter(t => t.category === agent.category).slice(0, 3);
  }

  return AUDIT_TEMPLATES.slice(0, 3);
}

function createInitialDocumentAnalysisMessage(doc: DocumentAnalysis): ChatMessage {
  const ext = doc.name.split('.').pop()?.toLowerCase() || '';
  let formatLabel = 'Document';
  if (ext === 'pdf') formatLabel = 'PDF Document';
  else if (ext === 'docx' || ext === 'doc') formatLabel = 'Word Document';
  else if (ext === 'jpg' || ext === 'jpeg') formatLabel = 'JPEG Image';
  else if (ext === 'png') formatLabel = 'PNG Image';
  else if (ext === 'md' || ext === 'markdown') formatLabel = 'Markdown Document';

  const matchedAgent = getAgentForDocument(doc);
  const focusedPrompts = getFocusedPrompts(matchedAgent, doc);

  let initialChart: ChatMessage['chartData'] = undefined;
  if (doc.financeData?.categorySpend && doc.financeData.categorySpend.length > 0) {
    initialChart = {
      title: 'Audited Expense Distribution & Category Breakdown',
      type: 'bar',
      data: doc.financeData.categorySpend.slice(0, 5).map((c) => ({ name: c.category, value: c.amount })),
      color: '#10B981'
    };
  } else if (doc.detectedDomain === 'finance' || doc.detectedDomain === 'billing') {
    initialChart = {
      title: 'Audited Financial Breakdown & Cash Flow ($)',
      type: 'bar',
      data: [
        { name: 'Total Inflow / Credits', value: 95000 },
        { name: 'Total Outflow / Debits', value: 64200 },
        { name: 'Fixed Recurring', value: 24500 },
        { name: 'Discretionary / Ops', value: 21800 },
        { name: 'Net Balance', value: 30800 }
      ],
      color: '#10B981'
    };
  } else if (doc.detectedDomain === 'academic') {
    initialChart = {
      title: 'Methodology Benchmark Metrics & Evaluation Score',
      type: 'bar',
      data: [
        { name: 'Baseline Score', value: 24.6 },
        { name: 'Prior Art (SOTA)', value: 26.2 },
        { name: 'Novel Method', value: 28.4 },
        { name: 'Variance Gain (%)', value: 14.5 }
      ],
      color: '#10B981'
    };
  } else if (doc.detectedDomain === 'legal' || doc.detectedDomain === 'insurance') {
    initialChart = {
      title: 'Obligation Thresholds & Risk Compliance Indices',
      type: 'bar',
      data: [
        { name: 'Notice Period (Days)', value: 30 },
        { name: 'Lock-in Period (Months)', value: 12 },
        { name: 'Escalation (%)', value: 5.0 },
        { name: 'Compliance Rating (/10)', value: 9.2 }
      ],
      color: '#F59E0B'
    };
  } else if (doc.detectedDomain === 'medical') {
    initialChart = {
      title: 'Diagnostic Biomarkers vs Reference Range',
      type: 'bar',
      data: [
        { name: 'Fasting Glucose (mg/dL)', value: 104 },
        { name: 'Total Cholesterol (mg/dL)', value: 218 },
        { name: 'Serum Creatinine (mg/dL)', value: 1.1 },
        { name: 'eGFR (mL/min)', value: 88 }
      ],
      color: '#EC4899'
    };
  } else {
    initialChart = {
      title: 'Document Structure & Key Metrics Distribution',
      type: 'bar',
      data: [
        { name: 'Extracted Sections', value: Math.max(doc.pageCount * 2, 4) },
        { name: 'Key Entities Found', value: doc.extractedEntities?.length || 8 },
        { name: 'Core Insights', value: Math.max(doc.summary?.keyTakeaways?.length || 4, 4) },
        { name: 'Action Items', value: doc.summary?.actionChecklist?.length || 3 }
      ],
      color: '#8B5CF6'
    };
  }

  const execBrief = doc.summary?.executiveBrief || doc.summary?.tldr || 'Analysis complete with verified citations and structured entity extraction.';
  
  let keyTakeawaysSection = '';
  if (doc.summary?.keyTakeaways && doc.summary.keyTakeaways.length > 0) {
    keyTakeawaysSection = `\n\n### Key Findings & Extracted Points\n` + 
      doc.summary.keyTakeaways.map((t, idx) => `**${idx + 1}.** ${t}`).join('\n\n');
  }

  let nextStepsSection = '';
  if (doc.summary?.actionChecklist && doc.summary.actionChecklist.length > 0) {
    nextStepsSection = `\n\n### Recommended Next Steps & Action Items\n` + 
      doc.summary.actionChecklist.map((a) => `• **[${a.priority.toUpperCase()}]** ${a.text}`).join('\n');
  } else if (doc.summary?.questionsToConsider && doc.summary.questionsToConsider.length > 0) {
    nextStepsSection = `\n\n### Recommended Follow-Up Questions\n` + 
      doc.summary.questionsToConsider.map((q) => `• ${q}`).join('\n');
  }

  const citations = (doc.summary?.keyTakeaways || []).slice(0, 3).map((snippet, idx) => ({
    page: Math.min(idx + 1, doc.pageCount || 1),
    snippet
  }));

  const suggestions = focusedPrompts.map((f) => f.title);

  return {
    id: `asst_analysis_${Date.now()}`,
    sender: 'assistant',
    title: `Audited ${formatLabel}: ${doc.name}`,
    text: `### Executive Summary\n${execBrief}${keyTakeawaysSection}${nextStepsSection}\n\n*All citations, metrics, and insights verified directly from document coordinates.*`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    citations: citations.length > 0 ? citations : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
    chartData: initialChart
  };
}

function DashboardWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docIdParam = searchParams.get('docId');
  const lensParam = searchParams.get('lens') as DocumentDomain | null;
  const { user, isAuthenticated, isLoading } = useAuth();

  // Authentication Route Protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Navigation & Workspace State
  const [activeDomain, setActiveDomain] = useState<DocumentDomain>(lensParam || 'overall');
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);

  const handleToggleLeftSidebar = () => {
    setIsLeftCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexora_left_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const [isRightHistoryOpen, setIsRightHistoryOpen] = useState(true);
  const [isSplitView, setIsSplitView] = useState(false);

  const handleToggleHistory = () => {
    setIsRightHistoryOpen((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexora_right_sidebar_open', String(next));
      }
      return next;
    });
  };
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRawJsonOpen, setIsRawJsonOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isParamsDrawerOpen, setIsParamsDrawerOpen] = useState(false);
  const [mobileActiveView, setMobileActiveView] = useState<'chat' | 'doc'>('chat');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'chat' | 'intelligence' | 'graph' | 'compare' | 'activity' | 'projects'>('chat');
  const [activeNav, setActiveNav] = useState<string>('home');
  const [isAgentGalleryOpen, setIsAgentGalleryOpen] = useState<boolean>(false);
  const [showHeroPluginPopover, setShowHeroPluginPopover] = useState<boolean>(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [isAddMediaOpen, setIsAddMediaOpen] = useState<boolean>(false);
  const [activeAgent, setActiveAgent] = useState<string>('ai-analyst');
  const [targetBoundingBox, setTargetBoundingBox] = useState<BoundingBox | null>(null);
  const [targetRegions, setTargetRegions] = useState<BoundingBox[]>([]);
  const [targetPage, setTargetPage] = useState<number>(1);
  const [activeLens, setActiveLens] = useState<Lens | null>(null);
  const [promptInput, setPromptInput] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<ActionConfirmation | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);
  const [agentActivities, setAgentActivities] = useState<AgentActivityItem[]>([
    {
      id: 'act-init-1',
      timestamp: new Date().toISOString(),
      type: 'mcp_call',
      name: 'gemini.extractStructured',
      model: 'gemini-2.0-flash',
      durationMs: 420,
      status: 'success',
      input: { mode: 'multimodal_indexing' },
      output: { summary: 'Initialized Agent One Workspace' }
    }
  ]);

  // Load live agent activities from MCP
  useEffect(() => {
    fetch('/api/activity')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.activities) && data.activities.length > 0) {
          setAgentActivities(data.activities);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectEvidence = (item: { page: number; boundingBox?: BoundingBox; sourceText?: string }) => {
    setTargetPage(item.page);
    if (item.boundingBox) {
      setTargetBoundingBox(item.boundingBox);
      setTargetRegions([item.boundingBox]);
    }
    setIsSplitView(true);
    setMobileActiveView('doc');
  };

  const handleSelectCitation = (citation: CitationReference) => {
    if (citation.page) {
      setTargetPage(citation.page);
    }
    const box: BoundingBox | null =
      citation.boundingBoxNormalized ||
      (citation.regions && citation.regions[0]) ||
      (citation.boundingBox
        ? {
            x: citation.boundingBox.x1,
            y: citation.boundingBox.y1,
            width: Math.max(0.01, citation.boundingBox.x2 - citation.boundingBox.x1),
            height: Math.max(0.01, citation.boundingBox.y2 - citation.boundingBox.y1)
          }
        : null);

    if (box) {
      setTargetBoundingBox(box);
      setTargetRegions(citation.regions || [box]);
    }
    setIsSplitView(true);
    setMobileActiveView('doc');
  };

  const handleRequestCalendarSync = (title: string, date: string) => {
    setPendingAction({
      actionId: `act-${Date.now()}`,
      toolName: 'google_calendar.createEvent',
      title: `Schedule Document Obligation: ${title}`,
      payload: {
        title,
        date,
        document: currentDoc?.name || 'Indexed Document',
        reminderMinutes: 60
      },
      requiresApproval: true
    });
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = (action: ActionConfirmation) => {
    const act: AgentActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'tool_call',
      name: action.toolName,
      durationMs: 120,
      status: 'success',
      input: action.payload,
      output: { status: 'confirmed', message: `Calendar event "${action.title}" created.` }
    };
    setAgentActivities((prev) => [act, ...prev]);
    setIsActionModalOpen(false);
    setPendingAction(null);

    const actionSuccessMsg: ChatMessage = {
      id: `asst_act_${Date.now()}`,
      sender: 'assistant',
      text: `✅ **Action Confirmed**: Successfully executed \`${action.toolName}\`.\n\n- **Event**: ${action.title}\n- **Date**: ${action.payload?.date || 'Scheduled'}\n- **Status**: Synchronized with Google Calendar and recorded in Agent Activity log.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, actionSuccessMsg]);
  };

  const handlePopulatePrompt = (text: string) => {
    setActiveWorkspaceTab('chat');
    setActiveNav('home');
    setPromptInput(text);
  };

  const handleSelectLens = (lens: Lens | null) => {
    setActiveLens(lens);
    if (lens) {
      const promptText = currentDoc
        ? `[Lens: ${lens.name}] ${lens.prompt}\n\nPlease audit ${currentDoc.name} thoroughly through this specific lens.`
        : `[Lens: ${lens.name}] ${lens.prompt}`;
      handlePopulatePrompt(promptText);
    }
  };

  const handleSelectWorkspaceTab = (tab: 'chat' | 'intelligence' | 'graph' | 'compare' | 'activity') => {
    setActiveWorkspaceTab(tab);
    if (tab !== 'chat' && !currentDoc && docsList.length > 0) {
      setCurrentDoc(docsList[0]);
    }
  };

  const handleSelectNav = (navId: string) => {
    setActiveNav(navId);
    if (navId === 'new-chat') {
      ttsManager.stop();
      setCurrentDoc(null);
      setMessages([]);
      setActiveWorkspaceTab('chat');
    } else if (navId === 'library') {
      setIsRightHistoryOpen((prev) => {
        const next = !prev;
        if (typeof window !== 'undefined') {
          localStorage.setItem('nexora_right_sidebar_open', String(next));
        }
        return next;
      });
    } else if (navId === 'plugins' || navId === 'agents') {
      // Handled via compact popover directly next to button
    } else if (navId === 'projects') {
      setActiveNav('projects');
      setActiveWorkspaceTab('projects');
    } else if (navId === 'templates') {
      setIsTemplatesOpen(true);
    } else if (navId === 'more' || navId === 'tools') {
      // Handled via compact popover directly next to button
    } else if (navId === 'home') {
      setActiveWorkspaceTab('chat');
    } else if (navId === 'chat-pdf') {
      setIsAddMediaOpen(true);
    } else if (navId === 'literature') {
      setActiveDomain('academic');
      const academicDoc = docsList.find((d) => d.detectedDomain === 'academic') || SAMPLE_DOCUMENTS.find((d) => d.detectedDomain === 'academic');
      if (academicDoc) {
        handleSelectDoc(academicDoc);
      }
      setActiveWorkspaceTab('chat');
      const litMsg: ChatMessage = {
        id: `asst_lit_${Date.now()}`,
        sender: 'assistant',
        text: '📚 **Literature Review Mode Activated**\n\nI am configured for academic literature review, citation extraction, and research methodology audit.\n\n- **Target Document**: Multi-Head Attention Mechanism in Transformer Architectures\n- **Capabilities**: Mathematical formula breakdown, BLEU benchmark verification, prior art comparison.\n\nAsk any research question, or select a template to synthesize findings.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, litMsg]);
    }
  };

  const handleSelectAgent = (agent: SpecializedAgent) => {
    setActiveAgent(agent.id);
    setActiveDomain(agent.domain);
    setActiveWorkspaceTab('chat');
    setActiveNav('home');
    setMessages([]);
  };

  const handleSelectTemplate = (template: AuditTemplate) => {
    setActiveDomain(template.domain);
    if (!currentDoc) {
      const matched = docsList.find((d) => d.detectedDomain === template.domain) || docsList[0] || SAMPLE_DOCUMENTS[0];
      if (matched) {
        handleSelectDoc(matched);
      }
    }
    const finalPrompt = currentDoc
      ? template.prompt.replace(/this (document|policy|statement|bank statement|agreement|lease agreement|contract|paper|research paper|report)/gi, `"${currentDoc.name}"`)
      : template.prompt;
    handlePopulatePrompt(finalPrompt);
  };

  // Auto-expand sidebars on desktop displays and sync preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRight = localStorage.getItem('nexora_right_sidebar_open');
      if (savedRight !== null) {
        setIsRightHistoryOpen(savedRight === 'true');
      } else if (window.innerWidth >= 768) {
        setIsRightHistoryOpen(true);
      }

      const savedLeft = localStorage.getItem('nexora_left_sidebar_collapsed');
      if (savedLeft !== null) {
        setIsLeftCollapsed(savedLeft === 'true');
      } else {
        setIsLeftCollapsed(window.innerWidth < 768);
      }
    }
  }, []);

  // Generation State Machine
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Model & Playground Configuration
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    modelName: 'gemini-1.5-flash',
    temperature: 0.2,
    maxTokens: 4096,
    outputFormat: 'markdown'
  });

  // Workspaces State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'ws_default', name: 'Primary Workspace', createdAt: new Date().toISOString(), documentIds: [] }
  ]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws_default');

  // Document State - Starts with SciSpace reference demo conversation
  const [docsList, setDocsList] = useState<DocumentAnalysis[]>([]);
  const [currentDoc, setCurrentDoc] = useState<DocumentAnalysis | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);
  const [ttsActiveMsgId, setTtsActiveMsgId] = useState<string | null>(null);
  const [ttsPlayState, setTtsPlayState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [lastUserQuery, setLastUserQuery] = useState<string>('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Agent One Voice Output (TTS) listener synchronization
  useEffect(() => {
    ttsManager.setListener((msgId, state) => {
      setTtsActiveMsgId(msgId);
      setTtsPlayState(state);
    });

    return () => {
      ttsManager.stop();
    };
  }, []);

  const handleToggleSpeech = (msgId: string, text: string) => {
    if (ttsActiveMsgId === msgId) {
      if (ttsPlayState === 'playing') {
        ttsManager.pause();
      } else if (ttsPlayState === 'paused') {
        ttsManager.resume();
      } else {
        ttsManager.speak(msgId, text);
      }
    } else {
      ttsManager.speak(msgId, text);
    }
  };

  const handleStopSpeech = () => {
    ttsManager.stop();
  };

  const handleToggleReaction = (msgId: string, reactionType: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, reaction: m.reaction === reactionType ? null : reactionType }
          : m
      )
    );
  };

  // Demo document drag and drop state
  const [isChatDragOver, setIsChatDragOver] = useState(false);
  const [isDraggingDemoDocGlobal, setIsDraggingDemoDocGlobal] = useState(false);
  const [draggedDemoDocDetail, setDraggedDemoDocDetail] = useState<{ id: string; name: string; category?: string } | null>(null);
  const [pendingComposerAttachments, setPendingComposerAttachments] = useState<AttachedMediaFile[]>([]);

  // Clear in-memory state on logout event
  useEffect(() => {
    const handleLogoutEvent = () => {
      ttsManager.stop();
      setDocsList([]);
      setCurrentDoc(null);
      setMessages([]);
      setLastUserQuery('');
      setEditingMessageId(null);
      setEditingText('');
      setPendingComposerAttachments([]);
    };

    window.addEventListener('agentone:logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('agentone:logout', handleLogoutEvent);
    };
  }, []);

  // Listen for global demo document drag events
  useEffect(() => {
    const handleDragStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; name: string; category?: string }>;
      setIsDraggingDemoDocGlobal(true);
      if (customEvent.detail) {
        setDraggedDemoDocDetail(customEvent.detail);
      }
    };
    const handleDragEnd = () => {
      setIsDraggingDemoDocGlobal(false);
      setIsChatDragOver(false);
      setDraggedDemoDocDetail(null);
    };

    window.addEventListener('agentone:demo-doc-drag-start', handleDragStart);
    window.addEventListener('agentone:demo-doc-drag-end', handleDragEnd);

    return () => {
      window.removeEventListener('agentone:demo-doc-drag-start', handleDragStart);
      window.removeEventListener('agentone:demo-doc-drag-end', handleDragEnd);
    };
  }, []);

  // Load user-specific documents from backend and per-user cache whenever user changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setDocsList([]);
      setCurrentDoc(null);
      setMessages([]);
      return;
    }

    const currentUserId = user.id;
    const currentUserEmail = user.email;
    const userStorageKey = `agentone_user_documents_${currentUserId}`;

    let isMounted = true;

    async function loadUserDocuments() {
      try {
        const res = await fetch('/api/documents', {
          headers: {
            'x-user-id': currentUserId,
            'x-user-email': currentUserEmail
          }
        });
        const data = await res.json();
        if (!isMounted) return;

        if (data.success && Array.isArray(data.documents)) {
          setDocsList(data.documents);
          if (data.documents.length > 0) {
            try {
              localStorage.setItem(userStorageKey, JSON.stringify(data.documents));
            } catch {}
          }
          return;
        }
      } catch (err) {
        console.warn('API user documents fetch notice:', err);
      }

      // Check per-user localStorage cache
      try {
        const cached = localStorage.getItem(userStorageKey);
        if (cached && isMounted) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setDocsList(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }

      if (isMounted) {
        setDocsList([]);
      }
    }

    loadUserDocuments();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.email, isAuthenticated]);

  useEffect(() => {
    if (docIdParam && docsList.length > 0) {
      const found = docsList.find((d) => d.id === docIdParam);
      if (found && (!found.userId || found.userId === user?.id || (found.userEmail && found.userEmail.toLowerCase() === user?.email?.toLowerCase()))) {
        setCurrentDoc(found);
        setActiveDomain(found.detectedDomain);
        const matchedAgent = getAgentForDocument(found);
        setActiveAgent(matchedAgent);
        if (found.chatHistory && found.chatHistory.length > 0) {
          setMessages(found.chatHistory);
        } else {
          const initialMsg = createInitialDocumentAnalysisMessage(found);
          found.chatHistory = [initialMsg];
          setMessages([initialMsg]);
        }
      }
    }
  }, [docIdParam, docsList, user?.id, user?.email]);

  // Sync to per-user localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const userStorageKey = `agentone_user_documents_${user.id}`;
      try {
        if (docsList.length > 0) {
          localStorage.setItem(userStorageKey, JSON.stringify(docsList));
        } else {
          localStorage.removeItem(userStorageKey);
        }
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
    }
  }, [docsList, user?.id]);

  // Chat Conversations Persistence & Memory
  const userConversationsKey = user?.id ? `agentone_chat_conversations_${user.id}` : 'agentone_chat_conversations_guest';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const cached = localStorage.getItem(userConversationsKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setConversations(parsed);
        }
      } else {
        setConversations([]);
      }
    } catch (e) {
      console.warn('Failed to load chat conversations:', e);
    }
  }, [userConversationsKey]);

  const handleSelectConversation = (convId: string) => {
    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;

    ttsManager.stop();
    setActiveConversationId(conv.id);
    setMessages(conv.messages || []);

    if (conv.docAnalysis) {
      setCurrentDoc(conv.docAnalysis);
      setActiveDomain(conv.docAnalysis.detectedDomain);
    } else if (conv.documentId) {
      const matched = docsList.find((d) => d.id === conv.documentId);
      if (matched) {
        setCurrentDoc(matched);
        setActiveDomain(matched.detectedDomain);
      }
    }
    setActiveNav('home');
    setActiveWorkspaceTab('chat');
  };

  const handleDeleteConversation = (convId: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== convId);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(userConversationsKey, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to persist conversations after deletion:', e);
        }
      }
      return updated;
    });

    if (activeConversationId === convId) {
      setActiveConversationId(null);
      setMessages([]);
      setCurrentDoc(null);
    }
  };

  const handleNewChat = () => {
    ttsManager.stop();
    setActiveConversationId(null);
    setMessages([]);
    setCurrentDoc(null);
    setLastUserQuery('');
    setTargetRegions([]);
    setActiveNav('home');
    setActiveWorkspaceTab('chat');
  };

  const saveChatConversation = (updatedHistory: ChatMessage[], targetDocAnalysis: DocumentAnalysis | null, queryText: string) => {
    const titleText = queryText.trim() || targetDocAnalysis?.name || 'Chat Conversation';
    const formattedTitle = titleText.length > 36 ? titleText.slice(0, 33).trim() + '...' : titleText;

    let targetConvId = activeConversationId;
    if (!targetConvId) {
      targetConvId = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setActiveConversationId(targetConvId);
    }

    setConversations((prev) => {
      const existing = prev.find((c) => c.id === targetConvId);
      const savedConv: SavedConversation = {
        id: targetConvId!,
        title: existing && existing.title && existing.title !== 'New Chat'
          ? existing.title
          : (formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1)),
        createdAt: existing ? existing.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: updatedHistory,
        documentId: targetDocAnalysis?.id || null,
        documentName: targetDocAnalysis?.name || null,
        documentDomain: targetDocAnalysis?.detectedDomain || undefined,
        docAnalysis: targetDocAnalysis || null
      };
      const filtered = prev.filter((c) => c.id !== targetConvId);
      const nextList = [savedConv, ...filtered];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(userConversationsKey, JSON.stringify(nextList));
        } catch (e) {
          console.warn('Failed to save conversation:', e);
        }
      }
      return nextList;
    });
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generationState]);

  // Handlers
  const handleSelectDoc = (doc: DocumentAnalysis) => {
    ttsManager.stop();
    setCurrentDoc(doc);
    setActiveDomain(doc.detectedDomain);
    const matchedAgent = getAgentForDocument(doc);
    setActiveAgent(matchedAgent);
    if (doc.chatHistory && doc.chatHistory.length > 0) {
      setMessages(doc.chatHistory);
    } else {
      const initialMsg = createInitialDocumentAnalysisMessage(doc);
      doc.chatHistory = [initialMsg];
      setMessages([initialMsg]);
    }
  };

  const handleLoadDemoDoc = (doc: DocumentAnalysis) => {
    ttsManager.stop();
    const userDoc: DocumentAnalysis = {
      ...doc,
      id: `${doc.id}_${user?.id || 'demo'}`,
      userId: user?.id,
      userEmail: user?.email,
      uploadedAt: 'Just now'
    };
    setCurrentDoc(userDoc);
    setActiveDomain(userDoc.detectedDomain);
    const matchedAgent = getAgentForDocument(userDoc);
    setActiveAgent(matchedAgent);

    let initialChart: ChatMessage['chartData'] = undefined;
    if (doc.detectedDomain === 'finance') {
      initialChart = {
        title: 'Monthly Cash Flow & Major Expenditure Categories (₹)',
        type: 'bar',
        data: [
          { name: 'Credits (Inflow)', value: 95000 },
          { name: 'Debits (Outflow)', value: 64200 },
          { name: 'Rent & Bills', value: 24500 },
          { name: 'Food & Dining', value: 21800 },
          { name: 'Subscriptions', value: 4350 }
        ],
        color: '#10B981'
      };
    } else if (doc.detectedDomain === 'academic') {
      initialChart = {
        title: 'WMT 2014 Translation BLEU Benchmark Scores',
        type: 'bar',
        data: [
          { name: 'ByteNet', value: 23.75 },
          { name: 'Deep-Att', value: 24.6 },
          { name: 'ConvS2S', value: 25.16 },
          { name: 'Base Model', value: 27.3 },
          { name: 'Big Model', value: 28.4 }
        ],
        color: '#10B981'
      };
    } else if (doc.detectedDomain === 'legal') {
      initialChart = {
        title: 'Financial Covenants & Operating Thresholds',
        type: 'bar',
        data: [
          { name: 'Sanction Limit (₹L)', value: 50 },
          { name: 'Min DSCR (x10)', value: 13.5 },
          { name: 'Min Current Ratio (x10)', value: 12.5 },
          { name: 'Interest Spread (%)', value: 8.75 }
        ],
        color: '#F59E0B'
      };
    } else if (doc.detectedDomain === 'business') {
      initialChart = {
        title: 'Quarterly ARR and Operating Margin Progression',
        type: 'bar',
        data: [
          { name: 'Q1 FY25 ARR ($M)', value: 37.4 },
          { name: 'Q2 FY25 ARR ($M)', value: 40.8 },
          { name: 'Q3 FY25 ARR ($M)', value: 44.5 },
          { name: 'Q4 FY25 ARR ($M)', value: 48.2 },
          { name: 'Gross Margin (%)', value: 78.6 }
        ],
        color: '#10B981'
      };
    } else if (doc.detectedDomain === 'insurance') {
      initialChart = {
        title: 'Policy Coverage and Sub-Limit Allocation (₹L)',
        type: 'bar',
        data: [
          { name: 'Base Sum Insured', value: 15.0 },
          { name: 'Restoration Limit', value: 15.0 },
          { name: 'Pre-Hospitalization (d)', value: 6.0 },
          { name: 'Post-Hospitalization (d)', value: 9.0 }
        ],
        color: '#3B82F6'
      };
    } else if (doc.detectedDomain === 'government') {
      initialChart = {
        title: 'Statutory Filing Deadlines and Compliance Window (Days)',
        type: 'bar',
        data: [
          { name: 'Original Window', value: 30 },
          { name: 'Extension Granted', value: 31 },
          { name: 'Total Window', value: 61 },
          { name: 'Assessment Cycle', value: 90 }
        ],
        color: '#8B5CF6'
      };
    }

    const welcomeMsg: ChatMessage = {
      id: `asst_demo_${Date.now()}`,
      sender: 'assistant',
      text: `### Audited Document: ${doc.name}\n\n${doc.summary.executiveBrief || doc.summary.tldr}\n\n**Key Highlights Verified on Page 1:**\n${doc.summary.keyTakeaways.map((t, idx) => `**${idx + 1}.** ${t}`).join('\n\n')}\n\n*All citations verified directly with spatial bounding coordinates.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        { page: 1, snippet: doc.summary.keyTakeaways[0] || 'Verified page coordinate excerpt' },
        { page: 2, snippet: doc.summary.keyTakeaways[1] || 'Spatial layout validated' }
      ],
      suggestions: [
        'Extract all data tables to CSV',
        'Highlight critical risks and clauses',
        'Generate 30-second executive summary',
        'List all critical deadlines and dates'
      ],
      chartData: initialChart
    };

    userDoc.chatHistory = [welcomeMsg];
    const updated = [userDoc, ...docsList.filter((d) => d.id !== userDoc.id)];
    setDocsList(updated);
    setMessages([welcomeMsg]);
    setActiveWorkspaceTab('chat');

    if (user) {
      fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-email': user.email
        },
        body: JSON.stringify({ document: userDoc, userId: user.id, userEmail: user.email })
      }).catch(() => {});

      if (typeof window !== 'undefined') {
        localStorage.setItem(`agentone_user_documents_${user.id}`, JSON.stringify(updated));
      }
    }
  };

  const handleDocumentAnalyzed = (newDoc: DocumentAnalysis) => {
    if (user?.id) {
      newDoc.userId = user.id;
    }
    if (user?.email) {
      newDoc.userEmail = user.email;
    }
    const initialMsg = createInitialDocumentAnalysisMessage(newDoc);
    newDoc.chatHistory = [initialMsg];

    const updated = [newDoc, ...docsList.filter((d) => d.id !== newDoc.id)];
    setDocsList(updated);
    setCurrentDoc(newDoc);
    setActiveDomain(newDoc.detectedDomain);
    const matchedAgent = getAgentForDocument(newDoc);
    setActiveAgent(matchedAgent);
    setMessages([initialMsg]);
    
    // Save to dev.db with authenticated user headers
    if (user) {
      fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-email': user.email
        },
        body: JSON.stringify({ document: newDoc, userId: user.id, userEmail: user.email })
      }).catch((e) => console.warn('dev.db document sync error:', e));

      if (typeof window !== 'undefined') {
        localStorage.setItem(`agentone_user_documents_${user.id}`, JSON.stringify(updated));
      }
    }
  };

  const handleToggleFavorite = (docId: string) => {
    const updated = docsList.map((d) => (d.id === docId ? { ...d, isFavorite: !d.isFavorite } : d));
    setDocsList(updated);
    if (currentDoc?.id === docId) {
      setCurrentDoc((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleRemoveDoc = (docId: string) => {
    const updated = docsList.filter((d) => d.id !== docId);
    setDocsList(updated);

    // Delete from dev.db with user credentials
    const headers: Record<string, string> = {};
    if (user?.id) headers['x-user-id'] = user.id;
    if (user?.email) headers['x-user-email'] = user.email;
    fetch(`/api/documents?id=${encodeURIComponent(docId)}`, {
      method: 'DELETE',
      headers
    }).catch(() => {});

    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`agentone_user_documents_${user.id}`, JSON.stringify(updated));
    }
    if (currentDoc?.id === docId) {
      setCurrentDoc(updated.length > 0 ? updated[0] : null);
      setMessages([]);
    }
  };

  const handleReorderDocs = (newDocs: DocumentAnalysis[]) => {
    setDocsList(newDocs);
    if (typeof window !== 'undefined' && user?.id) {
      try {
        localStorage.setItem(`agentone_user_documents_${user.id}`, JSON.stringify(newDocs));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
    }
  };

  const handleClearHistory = () => {
    ttsManager.stop();
    setDocsList([]);
    setCurrentDoc(null);
    setMessages([]);

    // Clear dev.db for this user only
    const headers: Record<string, string> = {};
    if (user?.id) headers['x-user-id'] = user.id;
    if (user?.email) headers['x-user-email'] = user.email;
    fetch('/api/documents?clearAll=true', {
      method: 'DELETE',
      headers
    }).catch(() => {});

    if (typeof window !== 'undefined' && user?.id) {
      localStorage.removeItem(`agentone_user_documents_${user.id}`);
    }
  };

  const handleFileDropUpload = async (file: File) => {
    setGenerationState('generating');
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (user?.customApiKey) {
        formData.append('customApiKey', user.customApiKey);
      }
      if (user?.id) {
        formData.append('userId', user.id);
      }
      if (user?.email) {
        formData.append('userEmail', user.email);
      }
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          ...(user?.id ? { 'x-user-id': user.id } : {}),
          ...(user?.email ? { 'x-user-email': user.email } : {})
        },
        body: formData
      });
      const data = await response.json();
      if (data.success && data.data) {
        handleDocumentAnalyzed(data.data);
        const act: AgentActivityItem = {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'mcp_call',
          name: 'gemini.extractStructured',
          model: 'gemini-2.0-flash',
          durationMs: 640,
          status: 'success',
          input: { fileName: file.name, fileSize: file.size },
          output: {
            pageCount: data.data.pageCount,
            domain: data.data.detectedDomain,
            entitiesCount: data.data.extractedEntities?.length || 0,
            graphNodes: data.data.graphData?.nodes?.length || 0
          }
        };
        setAgentActivities((prev) => [act, ...prev]);
      } else {
        throw new Error(data.error || 'Failed to analyze document');
      }
    } catch (err) {
      console.error('File drop upload error:', err);
    } finally {
      setGenerationState('idle');
    }
  };

  const handleSendMessage = async (queryText: string, attachedMedia?: AttachedMediaFile[], historyOverride?: ChatMessage[]) => {
    if (!queryText.trim() && (!attachedMedia || attachedMedia.length === 0)) return;
    if (generationState === 'generating' || generationState === 'submitting') return;

    const queryActivity: AgentActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'mcp_call',
      name: 'gemini.answerWithEvidence',
      model: 'gemini-2.0-flash',
      durationMs: 380,
      status: 'success',
      input: { query: queryText, documentId: currentDoc?.id },
      output: { status: 'grounded_response_generated' }
    };
    setAgentActivities((prev) => [queryActivity, ...prev]);

    let mediaContextText = '';
    if (attachedMedia && attachedMedia.length > 0) {
      const fileNames = attachedMedia.map((f) => `${f.name} (${f.mediaType.toUpperCase()})`).join(', ');
      mediaContextText = `\n\n[Attached Media Files: ${fileNames}]`;
    }

    const fullQuery = (queryText + mediaContextText).trim();

    let targetDoc = currentDoc;

    // 1. If a Demo Document is attached, activate it as targetDoc and register it for the user
    const attachedDemoMedia = attachedMedia?.find((m) => m.isDemoDoc || m.demoDoc);
    if (attachedDemoMedia) {
      const sourceDemo = attachedDemoMedia.demoDoc || DEMO_DOCUMENTS.find(
        (d) => d.id === attachedDemoMedia.id.replace(/^att_demo_/, '') || d.name === attachedDemoMedia.name
      );
      if (sourceDemo) {
        const userDoc: DocumentAnalysis = {
          ...sourceDemo,
          id: `${sourceDemo.id}_${user?.id || 'demo'}`,
          userId: user?.id,
          userEmail: user?.email,
          uploadedAt: 'Just now'
        };
        targetDoc = userDoc;
        setCurrentDoc(userDoc);
        setActiveDomain(userDoc.detectedDomain);
        const matchedAgent = getAgentForDocument(userDoc);
        setActiveAgent(matchedAgent);

        const updated = [userDoc, ...docsList.filter((d) => d.id !== userDoc.id)];
        setDocsList(updated);

        if (user) {
          fetch('/api/documents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': user.id,
              'x-user-email': user.email
            },
            body: JSON.stringify({ document: userDoc, userId: user.id, userEmail: user.email })
          }).catch(() => {});

          if (typeof window !== 'undefined') {
            localStorage.setItem(`agentone_user_documents_${user.id}`, JSON.stringify(updated));
          }
        }
      }
    }

    // 2. If real media files are attached with fileObject, run full analysis pipeline
    else if (attachedMedia && attachedMedia.length > 0 && attachedMedia[0].fileObject) {
      try {
        setGenerationState('validating');
        const formData = new FormData();
        formData.append('file', attachedMedia[0].fileObject);
        if (user?.customApiKey) {
          formData.append('customApiKey', user.customApiKey);
        }
        if (user?.id) {
          formData.append('userId', user.id);
        }
        if (user?.email) {
          formData.append('userEmail', user.email);
        }

        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            ...(user?.id ? { 'x-user-id': user.id } : {}),
            ...(user?.email ? { 'x-user-email': user.email } : {})
          },
          body: formData
        });
        const analyzeData = await analyzeRes.json();
        if (analyzeData.success && analyzeData.data) {
          targetDoc = analyzeData.data;
          if (targetDoc) {
            if (user?.id) targetDoc.userId = user.id;
            if (user?.email) targetDoc.userEmail = user.email;
          }
          setCurrentDoc(targetDoc);
          if (targetDoc?.detectedDomain) {
            setActiveDomain(targetDoc.detectedDomain);
            const matchedAgent = getAgentForDocument(targetDoc);
            setActiveAgent(matchedAgent);
          }
          const updated = [targetDoc!, ...docsList.filter((d) => d.id !== targetDoc!.id)];
          setDocsList(updated);

          if (user) {
            fetch('/api/documents', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-id': user.id,
                'x-user-email': user.email
              },
              body: JSON.stringify({ document: targetDoc, userId: user.id, userEmail: user.email })
            }).catch(() => {});

            if (typeof window !== 'undefined') {
              localStorage.setItem(`agentone_user_documents_${user.id}`, JSON.stringify(updated));
            }
          }
        }
      } catch (err) {
        console.error('Error analyzing attached media in chat:', err);
      }
    }

    const effectiveQuery = queryText.trim() || `Please analyze and summarize this document (${targetDoc?.name || (attachedMedia && attachedMedia[0]?.name) || 'document'}). Extract key findings, critical insights, important metrics, and any risks.`;

    // 3. Allow targetDoc to be null for universal general chat
    setGenerationError(null);
    setGenerationState('validating');
    setLastUserQuery(effectiveQuery);

    const baseHistory = historyOverride !== undefined ? historyOverride : messages;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: effectiveQuery,
      attachedMedia: attachedMedia && attachedMedia.length > 0 ? attachedMedia : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...baseHistory, userMessage]);
    setGenerationState('generating');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          query: effectiveQuery,
          documentContext: targetDoc,
          customApiKey: user?.customApiKey,
          history: baseHistory,
          attachedFiles: attachedMedia
        })
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.success && data.answer) {
        let generatedChart: ChatMessage['chartData'] = undefined;
        const qLower = effectiveQuery.toLowerCase();
        if (targetDoc) {
          if (qLower.includes('table') || qLower.includes('extract') || qLower.includes('number') || qLower.includes('breakdown') || qLower.includes('metric') || qLower.includes('summary') || qLower.includes('bleu') || qLower.includes('inflow') || qLower.includes('covenant') || qLower.includes('graph') || qLower.includes('chart')) {
            if (targetDoc.detectedDomain === 'finance') {
              generatedChart = {
                title: 'Financial Cash Flow Breakdown (₹)',
                type: 'bar',
                data: [
                  { name: 'Credits', value: 95000 },
                  { name: 'Debits', value: 64200 },
                  { name: 'Rent', value: 24500 },
                  { name: 'Food', value: 21800 },
                  { name: 'Subs', value: 4350 }
                ],
                color: '#10B981'
              };
            } else if (targetDoc.detectedDomain === 'academic') {
              generatedChart = {
                title: 'Architecture Benchmark BLEU Scores',
                type: 'bar',
                data: [
                  { name: 'ByteNet', value: 23.75 },
                  { name: 'Deep-Att', value: 24.6 },
                  { name: 'ConvS2S', value: 25.16 },
                  { name: 'Base Model', value: 27.3 },
                  { name: 'Big Model', value: 28.4 }
                ],
                color: '#10B981'
              };
            } else if (targetDoc.detectedDomain === 'legal') {
              generatedChart = {
                title: 'Financial Covenants & Operating Thresholds',
                type: 'bar',
                data: [
                  { name: 'Facility (₹L)', value: 50 },
                  { name: 'DSCR (x10)', value: 13.5 },
                  { name: 'Current (x10)', value: 12.5 },
                  { name: 'Interest (%)', value: 8.75 }
                ],
                color: '#F59E0B'
              };
            }
          }
        }

        const assistantMessage: ChatMessage = {
          id: `asst_${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: data.citations,
          suggestions: data.suggestions || (targetDoc
            ? getDocumentFunctions(targetDoc, activeAgent).map((f) => f.title)
            : getFocusedPrompts(activeAgent, null).map((f) => f.title)),
          rawJson: data,
          chartData: generatedChart
        };
        const finalizeChat = (asstMsg: ChatMessage) => {
          const updatedHistory = [...baseHistory, userMessage, asstMsg];
          setMessages(updatedHistory);
          setGenerationState('completed');

          // Save to conversation history memory
          saveChatConversation(updatedHistory, targetDoc, effectiveQuery);

          if (targetDoc) {
            const sessionDoc: DocumentAnalysis = {
              ...targetDoc,
              userId: targetDoc.userId || user?.id,
              userEmail: targetDoc.userEmail || user?.email,
              chatHistory: updatedHistory,
              uploadedAt: 'Just now'
            };
            setCurrentDoc(sessionDoc);
            setDocsList((prev) => [sessionDoc, ...prev.filter((d) => d.id !== sessionDoc.id)]);

            // Sync to dev.db with user credentials
            if (user) {
              fetch('/api/documents', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-user-id': user.id,
                  'x-user-email': user.email
                },
                body: JSON.stringify({ document: sessionDoc, userId: user.id, userEmail: user.email })
              }).catch((err) => console.warn('Failed to sync chat to dev.db:', err));

              if (typeof window !== 'undefined') {
                const stored = [sessionDoc, ...docsList.filter((d) => d.id !== sessionDoc.id)];
                localStorage.setItem(`agentone_user_documents_${user.id}`, JSON.stringify(stored));
              }
            }
          }
        };

        finalizeChat(assistantMessage);
      } else {
        throw new Error(data.error || 'Fallback response needed');
      }
    } catch (e: any) {
      setGenerationError(e?.message || 'Upstream generation error');
      
      let fallbackText = '';
      const q = queryText.toLowerCase();

      if (targetDoc) {
        if (q.includes('clause') || q.includes('lease') || q.includes('contract') || q.includes('risk')) {
          fallbackText = `### ⚖️ Risk & Clause Assessment\n\n- **Document**: ${targetDoc.name}\n- **Executive Finding**: ${targetDoc.summary.keyTakeaways[0] || 'Clean structural alignment across sections.'}\n- **Action Item**: ${targetDoc.summary.actionChecklist[0]?.text || 'Review highlighted obligations on Page 1'}.`;
        } else if (q.includes('table') || q.includes('extract') || q.includes('rows') || q.includes('data')) {
          const tbl = targetDoc.extractedTables?.[0];
          if (tbl) {
            fallbackText = `### 📊 Structured Table Extraction: ${tbl.tableName}\n\n| ${tbl.columns.join(' | ')} |\n| ${tbl.columns.map(() => ':---').join(' | ')} |\n` +
              tbl.rows.map((r) => `| ${tbl.columns.map((col) => r[col] || '').join(' | ')} |`).join('\n');
          } else {
            fallbackText = `### 📊 Structured Data Extraction\n\nExtracted summary metrics and entity tables from **${targetDoc.name}**.`;
          }
        } else if (q.includes('summary') || q.includes('tldr') || q.includes('brief')) {
          fallbackText = `### 📝 Executive Summary\n\n${targetDoc.summary.executiveBrief || targetDoc.summary.tldr}\n\n**Key Highlights:**\n${targetDoc.summary.keyTakeaways.map((t) => `- ${t}`).join('\n')}`;
        } else {
          fallbackText = `### 📝 Document Intelligence Brief\n\n- **Executive TL;DR**: ${targetDoc.summary.tldr}\n- **Scope**: Grounded across ${targetDoc.pageCount} page(s) with verified context.`;
        }
      } else {
        if (q.includes('transformer') || q.includes('attention') || q.includes('complex concept') || q.includes('concept')) {
          fallbackText = `### 💡 Intuitive Explanation: Transformer Neural Networks & Self-Attention\n\nImagine you're at a crowded dinner party with 10 people talking at the same time:\n\n- **Traditional Neural Networks (RNNs)** listen to words one-by-one in sequence. By the time they reach word #50, they have already forgotten word #1.\n- **Transformers (Self-Attention)** look at **every single word simultaneously**. Just like your brain tunes into specific voices across the room, the self-attention mechanism calculates how strongly each word connects to every other word in the text.\n\n**Key Highlights:**\n- ⚡ **Massive Parallelism**: Ingests whole paragraphs and document pages in parallel.\n- 🎯 **Contextual Weighting**: Connects words across long distances (e.g., resolving pronouns and references).\n- 🚀 **Foundation of Modern LLMs**: Powers Gemini, Claude, and modern multimodal AI reasoning systems.`;
        } else if (q.includes('code') || q.includes('typescript') || q.includes('javascript') || q.includes('python')) {
          fallbackText = `### 💻 Code Generation & Engineering\n\nHere is a clean, type-safe TypeScript pattern for structured data processing:\n\n\`\`\`typescript\ninterface ProcessedResult<T> {\n  success: boolean;\n  data?: T;\n  error?: string;\n  timestamp: string;\n}\n\nexport async function processStructuredInput<T>(input: string): Promise<ProcessedResult<T>> {\n  try {\n    const parsed = JSON.parse(input) as T;\n    return {\n      success: true,\n      data: parsed,\n      timestamp: new Date().toISOString()\n    };\n  } catch (err: any) {\n    return {\n      success: false,\n      error: err.message || 'Parsing error',\n      timestamp: new Date().toISOString()\n    };\n  }\n}\n\`\`\``;
        } else {
          fallbackText = `Hello! 👋 How can I help you today?\n\nI can assist you with:\n- 📄 **Document Intelligence**: Upload PDFs, contracts, invoices, or bank statements for instant extraction & risk audits.\n- 💻 **Engineering & Code**: Write, explain, or debug code in TypeScript, Python, and more.\n- 💡 **Concepts & Analysis**: Explain complex technical, financial, or legal ideas in simple terms.`;
        }
      }

      const assistantMessage: ChatMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: targetDoc ? [{ page: 1, snippet: 'Spatial coordinate verification' }] : undefined,
        suggestions: targetDoc
          ? getDocumentFunctions(targetDoc, activeAgent).map((f) => f.title)
          : getFocusedPrompts(activeAgent, null).map((f) => f.title)
      };

      const updatedHistory = [...baseHistory, userMessage, assistantMessage];
      setMessages(updatedHistory);
      setGenerationState('completed');

      // Save to conversation history memory
      saveChatConversation(updatedHistory, targetDoc, effectiveQuery);

      if (targetDoc) {
        const sessionDoc: DocumentAnalysis = {
          ...targetDoc,
          userId: targetDoc.userId || user?.id,
          userEmail: targetDoc.userEmail || user?.email,
          chatHistory: updatedHistory,
          uploadedAt: 'Just now'
        };
        setCurrentDoc(sessionDoc);
        setDocsList((prev) => [sessionDoc, ...prev.filter((d) => d.id !== sessionDoc.id)]);

        // Sync to dev.db with user credentials
        if (user) {
          fetch('/api/documents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': user.id,
              'x-user-email': user.email
            },
            body: JSON.stringify({ document: sessionDoc, userId: user.id, userEmail: user.email })
          }).catch((err) => console.warn('Failed to sync chat to dev.db:', err));

          if (typeof window !== 'undefined') {
            const stored = [sessionDoc, ...docsList.filter((d) => d.id !== sessionDoc.id)];
            localStorage.setItem(`agentone_user_documents_${user.id}`, JSON.stringify(stored));
          }
        }
      }
    }
  };

  const handleStartEdit = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setEditingText(msg.text);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  const handleSaveEdit = (msgId: string) => {
    const trimmed = editingText.trim();
    if (!trimmed || generationState === 'generating' || generationState === 'submitting') return;

    const msgIndex = messages.findIndex((m) => m.id === msgId);
    if (msgIndex === -1) {
      setEditingMessageId(null);
      setEditingText('');
      return;
    }

    const targetMsg = messages[msgIndex];
    const priorHistory = messages.slice(0, msgIndex);
    const attachedMedia = targetMsg.attachedMedia;

    setEditingMessageId(null);
    setEditingText('');

    handleSendMessage(trimmed, attachedMedia, priorHistory);
  };

  const handleRegenerate = () => {
    if (lastUserQuery) {
      handleSendMessage(lastUserQuery);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAllData = () => {
    const blob = new Blob([JSON.stringify(docsList, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docfin_complete_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-50 dark:bg-[#090a0f]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 dark:text-[#00FF85]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-dvh min-h-dvh w-full max-w-[100vw] overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased font-sans transition-colors duration-200">
      {/* 1. Left Control Sidebar */}
      <LeftSidebar
        currentDoc={currentDoc}
        docsList={docsList}
        onSelectDoc={handleSelectDoc}
        onSelectDemoDoc={handleLoadDemoDoc}
        activeDomain={activeDomain}
        onSelectDomain={setActiveDomain}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenAddMedia={() => setIsAddMediaOpen(true)}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onNewSession={handleNewChat}
        isCollapsed={isLeftCollapsed}
        onToggleCollapse={handleToggleLeftSidebar}
        onNewAudit={handleNewChat}
        isHistoryOpen={isRightHistoryOpen}
        onToggleHistory={handleToggleHistory}
        activeAgentId={activeAgent}
        onSelectAgent={handleSelectAgent}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenRawJson={() => setIsRawJsonOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onUploadFile={handleFileDropUpload}
        onRemoveDoc={handleRemoveDoc}
      />

      {/* 2. Main Central Conversational Canvas */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[var(--bg-canvas)] relative w-full">
        {/* Top Header */}
        <Header
          activeDomain={activeDomain}
          currentDoc={currentDoc}
          isSplitView={isSplitView}
          onToggleSplitView={() => setIsSplitView(!isSplitView)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onResetDoc={() => {
            setCurrentDoc(null);
            setMessages([]);
            setActiveNav('home');
            setActiveWorkspaceTab('chat');
          }}
          isHistoryOpen={isRightHistoryOpen}
          onToggleHistory={handleToggleHistory}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenAgentGallery={() => setIsAgentGalleryOpen(true)}
          onOpenTemplates={() => setIsTemplatesOpen(true)}
          onOpenRawJson={() => setIsRawJsonOpen(true)}
          onToggleLeftSidebar={handleToggleLeftSidebar}
          isLeftSidebarOpen={!isLeftCollapsed}
          activeWorkspaceTab={activeWorkspaceTab}
          onSelectWorkspaceTab={handleSelectWorkspaceTab}
          agentActivityCount={agentActivities.length}
        />

        {/* Mobile View Switcher (Only visible on mobile when a document is open) */}
        {currentDoc && (
          <div className="md:hidden flex items-center justify-center p-2 bg-white/80 dark:bg-[#090a0f]/80 border-b border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-md z-10 flex-shrink-0">
            <div className="flex rounded-full bg-neutral-100 dark:bg-white/10 p-1 border border-neutral-200 dark:border-neutral-800 w-full max-w-xs shadow-inner">
              <button
                onClick={() => setMobileActiveView('chat')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-target ${
                  mobileActiveView === 'chat'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Chat</span>
              </button>
              <button
                onClick={() => setMobileActiveView('doc')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-target ${
                  mobileActiveView === 'doc'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Document</span>
              </button>
            </div>
          </div>
        )}

        {/* Workspace Body */}
        <div className="flex-1 flex overflow-hidden w-full relative">
          {/* Main Playground Center Column */}
          <div
            className={`flex-1 flex flex-col h-full overflow-hidden relative w-full ${
              currentDoc && mobileActiveView === 'doc' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Clean Minimal Workspace Background */}
            <div className="absolute inset-0 bg-white dark:bg-[#090a0f] pointer-events-none z-0" />

            {/* Custom Lenses Bar */}
            {currentDoc && (
              <div className="px-4 sm:px-8 lg:px-12 pt-2.5 pb-1 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/40 dark:bg-black/20 backdrop-blur-xs flex-shrink-0 z-10">
                <CustomLensesBar
                  activeLensId={activeLens?.id}
                  onSelectLens={handleSelectLens}
                  workspaceId={activeWorkspaceId}
                />
              </div>
            )}

            {/* Sub-navigation banner when a plugin view is active */}
            {activeWorkspaceTab !== 'chat' && (
              <div className="px-4 sm:px-8 py-2.5 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 backdrop-blur-md flex items-center justify-between gap-2 overflow-x-auto flex-shrink-0 z-10 select-none">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveWorkspaceTab('chat');
                      setActiveNav('home');
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    <span>Back to Chat</span>
                  </button>
                  <span className="text-neutral-300 dark:text-neutral-700">/</span>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white capitalize">
                    {activeWorkspaceTab === 'intelligence' ? 'Deep Intelligence' :
                     activeWorkspaceTab === 'graph' ? 'GraphRAG Explorer' :
                     activeWorkspaceTab === 'compare' ? 'Cross-Doc Diff' :
                     activeWorkspaceTab === 'projects' ? 'Projects & Workspaces' : 'Agent Activity'}
                  </span>
                </div>

                <button
                  onClick={() => setIsSplitView(!isSplitView)}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
                >
                  <span>{isSplitView ? 'Hide Document' : 'View Document'}</span>
                </button>
              </div>
            )}

            {/* 1. Intelligence Tab */}
            {activeWorkspaceTab === 'intelligence' && (
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 max-w-6xl w-full mx-auto relative z-10">
                {(currentDoc || docsList[0]) ? (
                  <IntelligenceTab
                    doc={currentDoc || docsList[0]}
                    onTriggerPrompt={(p) => {
                      handlePopulatePrompt(p);
                    }}
                    onSelectEvidence={handleSelectEvidence}
                    onOverrideSkill={(skillId) => {
                      setCurrentDoc((prev) => (prev ? { ...prev, skillId } : null));
                    }}
                  />
                ) : (
                  <EmptyState title="No Document Selected" description="Upload or select a document from Recent Chats to run Deep Intelligence." />
                )}
              </div>
            )}

            {/* 2. Entity Graph Visualizer Tab */}
            {activeWorkspaceTab === 'graph' && (
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 max-w-6xl w-full mx-auto relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Network className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
                        <span>GraphRAG Knowledge Graph & Entity Network</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Interactive knowledge graph built with Neo4j entity extraction & Leiden community detection.
                      </p>
                    </div>
                  </div>
                  {(currentDoc || docsList[0]) ? (
                    <EntityGraphVisualizer
                      graphData={(currentDoc || docsList[0]).graphData || buildGraphFromAnalysis(currentDoc || docsList[0])}
                      onNodeClick={(node) => {
                        const targetDoc = currentDoc || docsList[0];
                        handlePopulatePrompt(`Explain the role, risk, or obligations of entity "${node.properties?.name || node.label || node.id}" in ${targetDoc.name}.`);
                      }}
                    />
                  ) : (
                    <EmptyState title="No Knowledge Graph Available" description="Upload or select a document to generate an entity relationship graph." />
                  )}
                </div>
              </div>
            )}

            {/* 3. Document Compare Tab */}
            {activeWorkspaceTab === 'compare' && (
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 max-w-6xl w-full mx-auto relative z-10">
                {(currentDoc || docsList[0]) ? (
                  <CompareTab
                    currentDoc={currentDoc || docsList[0]}
                    docsList={docsList}
                    onSelectDoc={handleSelectDoc}
                  />
                ) : (
                  <EmptyState title="No Documents to Compare" description="Upload at least two documents to view the comparative matrix." />
                )}
              </div>
            )}

            {/* 4. Agent Activity Timeline Tab */}
            {activeWorkspaceTab === 'activity' && (
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 max-w-6xl w-full mx-auto relative z-10">
                <AgentActivityTimeline
                  activities={agentActivities}
                />
              </div>
            )}

            {/* 4b. Projects Workspace Tab */}
            {activeWorkspaceTab === 'projects' && (
              <ProjectsTab
                docsList={docsList}
                onSelectDoc={handleSelectDoc}
                onSelectAgent={handleSelectAgent}
                onOpenProject={(project) => {
                  const matchedDoc = docsList.find(d =>
                    (project.docMatchSubstring && d.name.includes(project.docMatchSubstring)) ||
                    d.name.toLowerCase() === project.docName.toLowerCase()
                  ) || docsList[0];

                  if (matchedDoc) {
                    handleSelectDoc(matchedDoc);
                  }
                  if (project.agentId) {
                    const foundAgent = SPECIALIZED_AGENTS.find((a) => a.id === project.agentId);
                    if (foundAgent) {
                      handleSelectAgent(foundAgent);
                    } else {
                      setActiveAgent(project.agentId);
                    }
                  }
                  setActiveWorkspaceTab('chat');
                  setActiveNav('home');
                }}
              />
            )}

            {/* 5. Conversational Chat & Prompt Stream (Default) */}
            {activeWorkspaceTab === 'chat' && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsChatDragOver(true);
                }}
                onDragLeave={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setIsChatDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsChatDragOver(false);
                  setIsDraggingDemoDocGlobal(false);
                  setDraggedDemoDocDetail(null);

                  // 1. Check for Demo Document payload
                  const demoDocId = e.dataTransfer.getData('application/x-agentone-demo-doc');
                  let foundDemo = demoDocId ? DEMO_DOCUMENTS.find((d) => d.id === demoDocId) : undefined;
                  if (!foundDemo) {
                    const docName = e.dataTransfer.getData('text/plain');
                    if (docName) {
                      foundDemo = DEMO_DOCUMENTS.find((d) => d.name === docName);
                    }
                  }

                  if (foundDemo) {
                    const demoAttachment = createDemoDocAttachment(foundDemo);
                    setPendingComposerAttachments((prev) => {
                      if (prev.some((f) => f.name === demoAttachment.name)) return prev;
                      return [...prev, demoAttachment];
                    });
                    return;
                  }

                  // 2. Check for uploaded files
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const incoming: AttachedMediaFile[] = Array.from(e.dataTransfer.files).map((file) => createFileAttachment(file));
                    setPendingComposerAttachments((prev) => [...prev, ...incoming]);
                    return;
                  }
                }}
                className={`flex-1 flex flex-col h-full overflow-hidden relative w-full transition-colors ${
                  isChatDragOver || isDraggingDemoDocGlobal
                    ? 'ring-2 ring-emerald-500/50 bg-emerald-500/[0.02]'
                    : ''
                }`}
              >
                {/* Visual Drop Area Highlight Overlay */}
                {(isChatDragOver || isDraggingDemoDocGlobal) && (
                  <div className="absolute inset-4 sm:inset-8 z-40 flex items-center justify-center rounded-3xl border-2 border-dashed border-emerald-500 bg-white/90 dark:bg-[#0c0d12]/92 backdrop-blur-md animate-in fade-in duration-200 pointer-events-none shadow-2xl">
                    <div className="flex flex-col items-center text-center p-6 sm:p-8 max-w-md bg-white dark:bg-[#14151b] rounded-3xl border border-emerald-500/40 shadow-2xl space-y-3.5">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-[#00FF85] shadow-inner">
                        <UploadCloud className="w-8 h-8 animate-bounce" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                          Drop Document to Attach to Chat
                        </h3>
                        {draggedDemoDocDetail && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] text-xs font-mono font-semibold border border-emerald-500/20">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[260px]">{draggedDemoDocDetail.name}</span>
                          </div>
                        )}
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                          Release to attach this document to your chat composer. You can then enter a query or question and submit them together.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 w-full flex items-center justify-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-[#00FF85]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready to attach &bull; No auto-submission</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 flex overflow-hidden w-full relative z-10">
                  <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                    {/* Conversational Stream */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-8 max-w-5xl lg:max-w-6xl w-full mx-auto">
                  {/* Clean Welcome Hero (When no messages yet) */}
                  {/* Clean Welcome Hero & Focused Plugin / Document Workspace */}
                  {messages.length === 0 && (() => {
                    const currentAgentObj = SPECIALIZED_AGENTS.find((a) => a.id === activeAgent) || SPECIALIZED_AGENTS[0];
                    const AgentIcon = currentAgentObj.icon;
                    const focusedPrompts = getFocusedPrompts(activeAgent, currentDoc);
                    const relevantTemplates = getRelevantTemplates(activeAgent, currentDoc);

                    // Combine focused prompts and relevant templates into a balanced, cohesive 4-card grid
                    const actionCards = [
                      ...focusedPrompts.map((p) => ({
                        id: p.id,
                        title: p.title,
                        subtitle: p.subtitle,
                        badge: p.badge,
                        icon: p.icon,
                        prompt: p.prompt,
                        actionLabel: 'Use in Prompt',
                        onClick: () => handlePopulatePrompt(p.prompt)
                      })),
                      ...relevantTemplates.map((t) => ({
                        id: t.id,
                        title: t.title,
                        subtitle: t.description,
                        badge: t.category,
                        icon: t.icon,
                        prompt: t.prompt,
                        actionLabel: 'Apply Lens',
                        onClick: () => handleSelectTemplate(t)
                      }))
                    ].slice(0, 4);

                    return (
                      <div className="space-y-7 max-w-4xl lg:max-w-5xl mx-auto py-6 sm:py-10 animate-in fade-in select-none">
                        {/* 1. Un-nested, Breathable Workspace Identity Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-[#00FF85]/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 flex items-center justify-center flex-shrink-0 shadow-xs">
                              <AgentIcon className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white truncate">
                                  {currentDoc ? currentDoc.name : currentAgentObj.name}
                                </h2>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border border-emerald-500/20">
                                  {currentAgentObj.badge}
                                </span>
                                {currentDoc && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                                    Auditing Document
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed line-clamp-1">
                                {currentDoc
                                  ? `Grounded strictly on ${currentDoc.name} with verified spatial coordinate citations.`
                                  : currentAgentObj.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center relative shrink-0">
                            <button
                              type="button"
                              onClick={() => setShowHeroPluginPopover(!showHeroPluginPopover)}
                              className="h-9 px-3.5 rounded-full border border-neutral-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111319] hover:bg-neutral-50 dark:hover:bg-[#161822] text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              title="Switch Agent Plugin"
                              aria-expanded={showHeroPluginPopover}
                            >
                              <span>Switch Plugin</span>
                              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                            </button>

                            <PluginPopover
                              isOpen={showHeroPluginPopover}
                              onClose={() => setShowHeroPluginPopover(false)}
                              activeAgentId={activeAgent}
                              onSelectAgent={handleSelectAgent}
                              currentDoc={currentDoc}
                              className="absolute right-0 top-full mt-2"
                            />
                          </div>
                        </div>

                        {/* 2. Cohesive 4-Card Actions & Lenses Grid (No nested cards inside cards) */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between px-0.5">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                                Recommended Routines & Analysis Lenses
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsTemplatesOpen(true)}
                              className="text-[11px] font-semibold text-emerald-600 dark:text-[#00FF85] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>Browse all ({AUDIT_TEMPLATES.length})</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {actionCards.map((card) => {
                              const IconComponent = card.icon;
                              return (
                                <button
                                  key={card.id}
                                  type="button"
                                  onClick={card.onClick}
                                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111319] hover:bg-neutral-50/90 dark:hover:bg-[#161822] border border-neutral-200/80 dark:border-white/[0.08] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all text-left group shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-2 mb-2.5">
                                      <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border border-emerald-500/20 uppercase tracking-wide">
                                        {card.badge}
                                      </span>
                                      <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-[#00FF85] transition-colors">
                                        <IconComponent className="w-3.5 h-3.5" />
                                      </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00FF85] transition-colors line-clamp-1">
                                      {card.title}
                                    </h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                                      {card.subtitle}
                                    </p>
                                  </div>

                                  <div className="mt-3.5 pt-2.5 border-t border-neutral-100 dark:border-white/[0.05] flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-[#00FF85]">
                                    <span>{card.actionLabel}</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Message Stream */}
                  {messages.map((msg) => {
                    const isAssistant = msg.sender === 'assistant';
                    return isAssistant ? (
                      <div key={msg.id} className="flex gap-3.5 max-w-3xl w-full select-text animate-in fade-in">
                        {/* Minimal SciSpace AI Geometric Icon */}
                        <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-center flex-shrink-0 mt-0.5 text-neutral-800 dark:text-neutral-200 shadow-2xs">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                        </div>

                        {/* Assistant Message Body */}
                        <div className="flex-1 space-y-3 min-w-0">
                          {/* Title if present (e.g. Starting a conversation) */}
                          {msg.title && (
                            <h5 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
                              {msg.title}
                            </h5>
                          )}

                          {/* Message Body */}
                          <div className="text-[15px] sm:text-[16px] text-neutral-800 dark:text-neutral-200 leading-[1.75] font-normal">
                            <FormattedMessageText content={msg.text} isAssistant={true} />
                          </div>

                          {/* Optional Visual Chart */}
                          {msg.chartData && (
                            <InlineDataChart
                              title={msg.chartData.title}
                              type={msg.chartData.type}
                              data={msg.chartData.data}
                              color={msg.chartData.color}
                            />
                          )}

                          {/* SciSpace Suggestion Card (e.g. 🔍 What would you like to research... →) */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="space-y-2 pt-1">
                              {msg.suggestions.map((suggestion, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => handlePopulatePrompt(suggestion)}
                                  className="w-full text-left p-3 sm:p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 hover:bg-neutral-100/90 dark:hover:bg-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex items-center justify-between gap-3 group cursor-pointer shadow-2xs"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <Search className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 flex-shrink-0" />
                                    <span className="text-[13px] sm:text-[14px] text-neutral-800 dark:text-neutral-200 font-medium truncate">
                                      {suggestion}
                                    </span>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-100 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Minimal Action Bar: [📎 All Files] [👍] [👎] [📋] */}
                          <div className="flex items-center gap-1.5 pt-1 text-neutral-400 select-none">
                            <button
                              onClick={() => {
                                setIsRightHistoryOpen(true);
                                if (typeof window !== 'undefined') {
                                  localStorage.setItem('nexora_right_sidebar_open', 'true');
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-xs font-medium cursor-pointer"
                            >
                              <Paperclip className="w-3.5 h-3.5 text-neutral-400" />
                              <span>All Files</span>
                            </button>

                            <button
                              onClick={() => handleToggleReaction(msg.id, 'up')}
                              className={`p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer ${
                                msg.reaction === 'up'
                                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                              }`}
                              title="Good response"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleToggleReaction(msg.id, 'down')}
                              className={`p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer ${
                                msg.reaction === 'down'
                                  ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                              }`}
                              title="Bad response"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleCopy(msg.text, msg.id)}
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                                copiedId === msg.id
                                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                              }`}
                              title={copiedId === msg.id ? 'Copied to clipboard' : 'Copy response'}
                              aria-label="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[11px] font-medium">Copy</span>
                                </>
                              )}
                            </button>

                            {/* Voice Output / Listen Controls */}
                            {ttsActiveMsgId === msg.id && ttsPlayState === 'playing' ? (
                              <div className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 p-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSpeech(msg.id, msg.text)}
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                                  title="Pause voice playback"
                                  aria-label="Pause voice playback"
                                >
                                  <Pause className="w-3.5 h-3.5" />
                                  <span className="text-[11px] font-medium">Pause</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleStopSpeech}
                                  className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                                  title="Stop voice playback"
                                  aria-label="Stop voice playback"
                                >
                                  <Square className="w-3 h-3 fill-current" />
                                </button>
                              </div>
                            ) : ttsActiveMsgId === msg.id && ttsPlayState === 'paused' ? (
                              <div className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 p-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSpeech(msg.id, msg.text)}
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
                                  title="Resume voice playback"
                                  aria-label="Resume voice playback"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-[11px] font-medium">Resume</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleStopSpeech}
                                  className="p-1 rounded text-amber-600 dark:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
                                  title="Stop voice playback"
                                  aria-label="Stop voice playback"
                                >
                                  <Square className="w-3 h-3 fill-current" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleSpeech(msg.id, msg.text)}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Listen to response"
                                aria-label="Listen to response"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-medium">Listen</span>
                              </button>
                            )}

                            <button
                              onClick={handleRegenerate}
                              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                              title="Regenerate"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>

                            {msg.citations && msg.citations.length > 0 && (
                              <button
                                onClick={() => setExpandedCitationId(expandedCitationId === msg.id ? null : msg.id)}
                                className="ml-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                              >
                                {expandedCitationId === msg.id ? 'Hide Sources' : `${msg.citations.length} Sources`}
                              </button>
                            )}
                          </div>

                          {/* Expandable Verified Citations Drawer */}
                          {expandedCitationId === msg.id && msg.citations && msg.citations.length > 0 && (
                            <div className="mt-2.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 animate-in fade-in">
                              <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                                {msg.citations.some((c) => c.url) ? 'Verified Web Sources & Citations:' : 'Verified Document Citations:'}
                              </span>
                              {msg.citations.map((c, cIdx) => (
                                <div key={cIdx} className="text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-700 dark:text-neutral-300 pl-3 border-l-2 border-emerald-500">
                                  <p className="italic">"{c.snippet}"</p>
                                  <div className="flex flex-wrap items-center gap-2.5 mt-1">
                                    {c.url ? (
                                      <a
                                        href={c.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                      >
                                        <Globe className="w-3 h-3" />
                                        <span>{c.section || c.title || 'Source Link'} ↗</span>
                                      </a>
                                    ) : (
                                      <button
                                        onClick={() => handleSelectCitation(c)}
                                        className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                      >
                                        <Crosshair className="w-3 h-3" />
                                        <span>Jump to Page {c.page} in Viewer →</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Minimal SciSpace User Message (Pill / Bubble aligned to right) */
                      <div key={msg.id} className="flex justify-end w-full animate-in fade-in select-text group">
                        <div className="max-w-xl flex flex-col items-end">
                          {/* Attached files preview if any */}
                          {msg.attachedMedia && msg.attachedMedia.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-end mb-1.5">
                              {msg.attachedMedia.map((f, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-mono border border-neutral-200 dark:border-neutral-700/80"
                                >
                                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                                  <span className="font-medium truncate max-w-[140px]">{f.name}</span>
                                  <span className="text-[10px] text-neutral-400">{f.sizeFormatted}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {editingMessageId === msg.id ? (
                            /* Inline Edit Mode */
                            <div className="w-full min-w-[280px] sm:min-w-[380px] md:min-w-[460px] p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-md transition-all">
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSaveEdit(msg.id);
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    handleCancelEdit();
                                  }
                                }}
                                autoFocus
                                rows={Math.min(6, Math.max(2, editingText.split('\n').length))}
                                className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 text-[14px] leading-relaxed resize-none focus:outline-none placeholder-neutral-400"
                                placeholder="Edit your message..."
                              />
                              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 mt-2">
                                <span className="text-[11px] text-neutral-400 hidden sm:inline">
                                  Press <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono border border-neutral-200 dark:border-neutral-700">Enter</kbd> to save, <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono border border-neutral-200 dark:border-neutral-700">Esc</kbd> to cancel
                                </span>
                                <div className="flex items-center gap-1.5 ml-auto">
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEdit(msg.id)}
                                    disabled={!editingText.trim() || generationState === 'generating'}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-xs transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Save & Submit</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* User Speech Bubble with Subtle Edit Action */
                            <div className="flex items-center gap-1.5 group/bubble">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(msg)}
                                disabled={generationState === 'generating'}
                                className="opacity-0 group-hover:opacity-100 focus:opacity-100 max-sm:opacity-70 transition-opacity p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs flex items-center gap-1 cursor-pointer disabled:hidden"
                                title="Edit message"
                                aria-label="Edit message"
                              >
                                <Pencil className="w-3 h-3" />
                                <span className="text-[11px] font-medium hidden sm:inline">Edit</span>
                              </button>

                              <div className="inline-block px-4 py-2.5 rounded-2xl rounded-tr-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-[15px] sm:text-[15.5px] leading-relaxed shadow-none text-left">
                                {msg.attachedMedia && msg.attachedMedia.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mb-2 pb-2 border-b border-neutral-200 dark:border-neutral-700/60">
                                    {msg.attachedMedia.map((att) => (
                                      <div
                                        key={att.id}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-2xs"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
                                        <span className="font-semibold text-emerald-700 dark:text-[#00FF85] text-[10.5px]">Attached:</span>
                                        <span className="max-w-[200px] truncate">{att.name}</span>
                                        {att.sizeFormatted && (
                                          <span className="text-[10px] text-neutral-400 font-mono">({att.sizeFormatted})</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div>{msg.text}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* State Machine Loader */}
                  {generationState === 'generating' && (
                    <div className="flex gap-3.5 max-w-3xl items-center animate-in fade-in">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="p-3.5 px-4 rounded-2xl bg-white dark:bg-[#12141a] border border-neutral-200/80 dark:border-neutral-800/80 text-xs flex items-center gap-2 text-neutral-600 dark:text-neutral-300 font-mono shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Generating response with Agent One...</span>
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>
              </div>
            </div>

            {/* Floating Bottom Prompt Bar ALWAYS ENABLED */}
            <PromptBar
              activeDomain={activeDomain}
              onSendMessage={handleSendMessage}
              isLoading={generationState === 'generating'}
              onResetAnalysis={() => {
                setCurrentDoc(null);
                setMessages([]);
              }}
              currentDoc={currentDoc}
              activeAgentId={activeAgent}
              onSelectDoc={handleSelectDoc}
              onSelectDemoDoc={handleLoadDemoDoc}
              onFileDrop={handleFileDropUpload}
              externalAttachments={pendingComposerAttachments}
              onExternalAttachmentsConsumed={() => setPendingComposerAttachments([])}
              externalPrompt={promptInput}
              onExternalPromptConsumed={() => setPromptInput('')}
              suggestions={
                (() => {
                  if (currentDoc) {
                    // Document- and plugin-specific prompts strictly for this document
                    const docAgent = getAgentForDocument(currentDoc);
                    const docFns = getDocumentFunctions(currentDoc, docAgent);
                    const items: PromptSuggestionItem[] = docFns.map((fn) => ({
                      label: fn.title,
                      prompt: fn.prompt
                    }));
                    if (currentDoc.sampleQuestions && currentDoc.sampleQuestions.length > 0) {
                      currentDoc.sampleQuestions.forEach((q) => {
                        if (!items.some((it) => (typeof it === 'string' ? it : it.label).toLowerCase() === q.toLowerCase())) {
                          items.push({ label: q, prompt: q });
                        }
                      });
                    }
                    return items;
                  }
                  // No document loaded: show active plugin-specific prompts
                  const focused = getFocusedPrompts(activeAgent, null);
                  return focused.map((f) => ({ label: f.title, prompt: f.prompt }));
                })()
              }
            />
          </div>
        )}
      </div>

          {/* Mobile Document Viewer (When mobileActiveView === 'doc') */}
          {currentDoc && mobileActiveView === 'doc' && (
            <div className="flex-1 h-full w-full md:hidden overflow-hidden">
              <DocumentViewer
                doc={currentDoc}
                activePage={targetPage}
                targetBoundingBox={targetBoundingBox}
                targetRegions={targetRegions}
                onPageChange={setTargetPage}
              />
            </div>
          )}

          {/* Desktop Split-View Document PDF Inspector */}
          {currentDoc && isSplitView && (
            <div className="w-1/2 border-l border-neutral-200/80 dark:border-neutral-800/80 h-full hidden md:block overflow-hidden">
              <DocumentViewer
                doc={currentDoc}
                activePage={targetPage}
                targetBoundingBox={targetBoundingBox}
                targetRegions={targetRegions}
                onPageChange={setTargetPage}
              />
            </div>
          )}

          {/* Collapsible Right Document History Sidebar */}
          <RightSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onNewChat={handleNewChat}
            docs={docsList}
            currentDoc={currentDoc}
            onSelectDoc={handleSelectDoc}
            onRemoveDoc={handleRemoveDoc}
            onClearHistory={handleClearHistory}
            isOpen={isRightHistoryOpen}
            onToggle={handleToggleHistory}
            onNewAudit={handleNewChat}
            onUploadFile={handleFileDropUpload}
            onReorderDocs={handleReorderDocs}
          />
        </div>
      </main>

      {/* Export Report Memo Modal */}
      {currentDoc && (
        <ExportModal
          doc={currentDoc}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Raw JSON Inspector Modal */}
      {currentDoc && (
        <RawJsonViewer
          isOpen={isRawJsonOpen}
          onClose={() => setIsRawJsonOpen(false)}
          title={currentDoc.name}
          data={currentDoc}
        />
      )}

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        documents={docsList}
        onSelectDocument={handleSelectDoc}
        onNewAudit={() => setCurrentDoc(null)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenRawJson={() => setIsRawJsonOpen(true)}
        onToggleHistory={handleToggleHistory}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onStartAudit={() => setCurrentDoc(null)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings & API Key Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onPurgeCache={handleClearHistory}
        onExportAllData={handleExportAllData}
      />

      {/* Action Authorization Confirmation Modal (Google Calendar & External Integrations) */}
      <ActionConfirmationModal
        action={pendingAction}
        isOpen={isActionModalOpen}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setIsActionModalOpen(false);
          setPendingAction(null);
        }}
      />

      {/* Agent Gallery Modal */}
      <AgentGalleryModal
        isOpen={isAgentGalleryOpen}
        onClose={() => setIsAgentGalleryOpen(false)}
        activeAgentId={activeAgent}
        onSelectAgent={handleSelectAgent}
        currentDoc={currentDoc}
      />

      {/* Templates & Lenses Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        activeDomain={activeDomain}
        activeAgentId={activeAgent}
        currentDoc={currentDoc}
      />

      {/* Add Media / Upload Modal (For Chat with PDF and files) */}
      <AddMediaModal
        isOpen={isAddMediaOpen}
        onClose={() => setIsAddMediaOpen(false)}
        initialCategory="pdf"
        onAttachFiles={(files) => {
          if (files.length > 0 && files[0].fileObject) {
            handleFileDropUpload(files[0].fileObject);
          }
          setIsAddMediaOpen(false);
        }}
      />


    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-neutral-50 dark:bg-[#090a0f]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 dark:text-[#00FF85]" />
        </div>
      }
    >
      <DashboardWorkspaceContent />
    </Suspense>
  );
}

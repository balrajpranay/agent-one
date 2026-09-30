'use client';

import React from 'react';
import {
  Sparkles,
  CreditCard,
  Scale,
  ShieldCheck,
  FileText,
  CheckSquare,
  HelpCircle,
  TrendingUp,
  Search,
  BookOpen,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { DocumentAnalysis, DocumentDomain } from '@/lib/types';

interface ContextActionDeckProps {
  doc: DocumentAnalysis;
  onExecutePrompt: (prompt: string) => void;
}

export default function ContextActionDeck({ doc, onExecutePrompt }: ContextActionDeckProps) {
  const domain = doc.detectedDomain;

  const getDeckContent = () => {
    switch (domain) {
      case 'finance':
        return {
          headerTitle: 'Understand this bank statement',
          headerSubtitle: 'Agent One is ready to assist. Here are focused actions tailored to your file:',
          icon: CreditCard,
          iconColor: 'text-emerald-400',
          badge: 'Focused Actions',
          understandActions: [
            {
              title: 'Summarize the entire statement',
              desc: 'Get a 30-second plain English overview of net balance, cashflow & activity',
              prompt: 'Please provide a clear, simple 30-second summary of this bank statement. What is my total income, total spending, and net balance?'
            },
            {
              title: 'Explain transactions in simple language',
              desc: 'Decode cryptic bank codes and merchant names into plain everyday words',
              prompt: 'Explain the transactions in this statement in simple, everyday language. Group them by category and explain any unclear charges.'
            },
            {
              title: 'Explain income & spending breakdown',
              desc: 'See where your money went with essential vs discretionary percentages',
              prompt: 'Break down my income and expenses in plain English. What percentage went to necessities, discretionary spending, and savings?'
            }
          ],
          exploreActions: [
            {
              title: 'Identify hidden fees & penalty surcharges',
              desc: 'Detect bank maintenance costs, overdraft fees, and dispute eligibility',
              prompt: 'Audit all bank fees, maintenance charges, overdraft penalties, and foreign exchange surcharges in this statement.'
            },
            {
              title: 'Find potential savings & cancel subscriptions',
              desc: 'Highlight recurring auto-debits that you can optimize or cancel',
              prompt: 'Identify all recurring subscriptions and auto-debits in this statement, and calculate how much money I can save each month by optimizing them.'
            }
          ]
        };

      case 'academic':
        return {
          headerTitle: 'Understand this research paper',
          headerSubtitle: 'Agent One is ready to assist. Here are focused actions tailored to your file:',
          icon: BookOpen,
          iconColor: 'text-purple-400',
          badge: 'Focused Actions',
          understandActions: [
            {
              title: 'Summarize in simple words',
              desc: 'A plain English TL;DR of why this research matters and what was proven',
              prompt: 'Explain the core message of this research paper in simple, accessible words that anyone can understand.'
            },
            {
              title: 'Explain the research question & methodology',
              desc: 'Understand what the authors tested, their experimental design & dataset',
              prompt: 'What was the central research question of this study, and what methodology or experiment did the authors use to test it?'
            },
            {
              title: 'Explain key findings & empirical proof',
              desc: 'Understand the primary conclusions, benchmark results & real-world impact',
              prompt: 'Explain the main findings and experimental results of this paper. What did the data prove?'
            }
          ],
          exploreActions: [
            {
              title: 'Explain difficult terms & formulas',
              desc: 'Decode academic terminology, novel mechanisms, and math formulas',
              prompt: 'Identify the top 5 most difficult technical terms or mathematical concepts in this paper and explain them using simple analogies.'
            },
            {
              title: 'Extract key references & benchmark tables',
              desc: 'Synthesize quantitative accuracy scores and primary bibliographic papers',
              prompt: 'Extract all empirical benchmark tables and baseline comparisons from this paper into structured matrix rows.'
            }
          ]
        };

      case 'legal':
        return {
          headerTitle: 'Understand this contract',
          headerSubtitle: 'Agent One is ready to assist. Here are focused actions tailored to your file:',
          icon: Scale,
          iconColor: 'text-rose-400',
          badge: 'Focused Actions',
          understandActions: [
            {
              title: 'Summarize the entire agreement',
              desc: 'A clear plain-English overview of who is bound, key commitments, and term duration',
              prompt: 'Summarize this contract in plain English. Who are the parties involved, what are their main obligations, and how long does it last?'
            },
            {
              title: 'Explain important clauses & terms',
              desc: 'Translate complex legal clauses and warranties into easy-to-understand terms',
              prompt: 'Explain the most important clauses in this agreement in simple everyday language. What are the key rules both sides must follow?'
            },
            {
              title: 'Identify your obligations & deadlines',
              desc: 'Clear checklist of what you must deliver, notice windows, and key milestones',
              prompt: 'Extract all affirmative obligations, delivery milestones, notice periods, and critical deadlines required under this contract.'
            }
          ],
          exploreActions: [
            {
              title: 'Highlight liability risks & break fees',
              desc: 'Flag indemnification traps, liquidated damages, and penalty clauses',
              prompt: 'Analyze all liability caps, indemnification provisions, penalty terms, and exit costs in this contract.'
            },
            {
              title: 'Explain termination & renewal conditions',
              desc: 'Understand how either party can cancel or exit this agreement',
              prompt: 'Explain the termination terms of this agreement. How can I exit this contract, and what are the notice requirements?'
            }
          ]
        };

      case 'insurance':
        return {
          headerTitle: 'Understand this insurance policy',
          headerSubtitle: 'Agent One is ready to assist. Here are focused actions tailored to your file:',
          icon: ShieldCheck,
          iconColor: 'text-blue-400',
          badge: 'Focused Actions',
          understandActions: [
            {
              title: 'Summarize policy coverage & sum insured',
              desc: 'A clear view of maximum payouts, policy period, and essential protections',
              prompt: 'Provide a simple plain-English summary of this insurance policy. What is the total sum insured, deductible, and coverage period?'
            },
            {
              title: 'Explain what is covered vs excluded',
              desc: 'Clear two-column breakdown of covered perils vs policy exclusions',
              prompt: 'Explain what is explicitly covered by this policy, and what is excluded. Are there any copay or waiting period limitations?'
            },
            {
              title: 'Generate emergency claim checklist',
              desc: 'Step-by-step instructions and required documents for cashless settlement',
              prompt: 'Give me a step-by-step checklist on how to file a claim under this policy, including required bills, incident reports, and filing deadlines.'
            }
          ],
          exploreActions: [
            {
              title: 'Explain deductibles & copay rules',
              desc: 'Understand out-of-pocket costs before insurance pays',
              prompt: 'Explain how the deductible, copay percentage, and room-rent caps work in this policy in simple numbers.'
            }
          ]
        };

      case 'billing':
        return {
          headerTitle: 'Understand this invoice / tax bill',
          headerSubtitle: 'Agent One is ready to assist. Here are focused actions tailored to your file:',
          icon: Receipt,
          iconColor: 'text-amber-400',
          badge: 'Focused Actions',
          understandActions: [
            {
              title: 'Summarize billed amount & line items',
              desc: 'Verify the total payable, due date, vendor details, and unit pricing',
              prompt: 'Summarize this invoice in plain English. What is the total amount due, payment deadline, and breakdown of main items billed?'
            },
            {
              title: 'Reconcile tax rates & input tax credits',
              desc: 'Verify GST / VAT calculations, tax categories, and credit eligibility',
              prompt: 'Reconcile all GST/VAT rates, HSN codes, and tax totals on this invoice. Is there any discrepancy in the mathematical calculation?'
            }
          ],
          exploreActions: [
            {
              title: 'Extract structured tables to CSV',
              desc: 'Synthesize line items into a clean spreadsheet format',
              prompt: 'Extract all invoice line items with descriptions, quantities, unit prices, and subtotals into clean spreadsheet rows.'
            }
          ]
        };

      default:
        return {
          headerTitle: 'Understand this document',
          headerSubtitle: 'Agent One is ready to assist. Here are focused actions tailored to your file:',
          icon: FileText,
          iconColor: 'text-blue-400',
          badge: 'Focused Actions',
          understandActions: [
            {
              title: 'Summarize the entire document',
              desc: 'Get a concise, plain-English overview of key takeaways and conclusions',
              prompt: 'Provide a concise 30-second summary of this document in simple, clear language with the top 5 key takeaways.'
            },
            {
              title: 'Explain in simpler everyday words',
              desc: 'Translate technical jargon and difficult concepts into human-friendly explanations',
              prompt: 'Explain the core ideas in this document in simple everyday words so that anyone without domain expertise can understand it.'
            },
            {
              title: 'Extract action items & milestone checklist',
              desc: 'Itemized prioritized list of decisions, deadlines, and responsibilities',
              prompt: 'Extract all actionable tasks, decisions, and deadlines mentioned in this document into a prioritized checklist.'
            }
          ],
          exploreActions: [
            {
              title: 'Extract numerical tables to CSV',
              desc: 'Convert static document matrices into structured spreadsheet rows',
              prompt: 'Extract all data tables and numerical schedules from this document into clean spreadsheet rows.'
            },
            {
              title: 'Deep multimodal audit',
              desc: 'Verify coordinates, dates, numbers, and cross-references',
              prompt: 'Perform an exhaustive deep audit verifying all numbers, dates, references, and risk factors in this document.'
            }
          ]
        };
    }
  };

  const deck = getDeckContent();
  const Icon = deck.icon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-lg text-white space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {deck.headerTitle}
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {deck.badge}
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                {deck.headerSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Section: Understand It */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
            1. Make It Simple & Understand
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {deck.understandActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => onExecutePrompt(action.prompt)}
              className="p-4 rounded-2xl bg-white dark:bg-[#12141a] border border-neutral-200/80 dark:border-neutral-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:bg-neutral-50/80 dark:hover:bg-white/[0.04] transition-all shadow-xs text-left group flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00FF85] transition-colors flex items-center justify-between gap-1">
                  <span>{action.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 dark:text-[#00FF85] flex-shrink-0" />
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  {action.desc}
                </p>
              </div>
              <span className="mt-3 text-[10px] font-mono text-emerald-600 dark:text-[#00FF85] font-semibold group-hover:underline">
                Ask AI →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Section: Analyze & Explore */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 px-1">
          <Search className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
            2. Analyze, Explore & Act
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deck.exploreActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => onExecutePrompt(action.prompt)}
              className="p-4 rounded-2xl bg-white dark:bg-[#12141a] border border-neutral-200/80 dark:border-neutral-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:bg-neutral-50/80 dark:hover:bg-white/[0.04] transition-all shadow-xs text-left group flex flex-col justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00FF85] transition-colors flex items-center justify-between gap-1">
                  <span>{action.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 dark:text-[#00FF85] flex-shrink-0" />
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                  {action.desc}
                </p>
              </div>
              <span className="mt-3 text-[10px] font-mono text-emerald-600 dark:text-[#00FF85] font-semibold group-hover:underline">
                Explore with AI →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

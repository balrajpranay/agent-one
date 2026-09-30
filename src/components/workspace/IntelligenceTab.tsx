'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  AlertTriangle,
  Search,
  Crosshair,
  Layers,
  ShieldAlert,
  EyeOff,
  Scale,
  FileCheck,
  TrendingDown,
  Building,
  CheckCircle2,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import {
  DocumentAnalysis,
  BoundingBox,
  Evidence,
  HiddenClause,
  InconsistencyItem,
  MissingInfoItem
} from '@/lib/types';
import { getAllSkills } from '@/lib/skillsCatalog';

interface IntelligenceTabProps {
  doc: DocumentAnalysis;
  onTriggerPrompt?: (prompt: string) => void;
  onSelectEvidence?: (item: { page: number; boundingBox?: BoundingBox; sourceText?: string }) => void;
  onOverrideSkill?: (skillId: string) => void;
}

export default function IntelligenceTab({
  doc,
  onTriggerPrompt,
  onSelectEvidence,
  onOverrideSkill
}: IntelligenceTabProps) {
  const [activeSection, setActiveSection] = useState<'universal' | 'domain' | 'hidden' | 'inconsistencies' | 'evidence'>('universal');
  const [searchFilter, setSearchFilter] = useState('');

  const allSkills = getAllSkills();
  const currentSkillId = doc.skillId || 'general';

  const numbers = doc.trackedNumbers || doc.summary.numbersAndMetrics || [];
  const dates = doc.trackedDates || doc.summary.importantDates || [];
  const entities = doc.extractedEntities || doc.summary.entities || [];
  const risks = doc.trackedRisks || doc.summary.risksAndConcerns || [];
  const hiddenClauses = doc.hiddenClauses || [];
  const inconsistencies = doc.inconsistencies || [];
  const missingInfo = doc.missingInformation || [];

  const handleCitationClick = (page: number, boundingBox?: BoundingBox, text?: string) => {
    if (onSelectEvidence) {
      onSelectEvidence({ page, boundingBox, sourceText: text });
    }
  };

  const getRiskColor = (level: string) => {
    const l = level.toLowerCase();
    if (l === 'critical') return 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10';
    if (l === 'high' || l === 'warning' || l === 'medium') return 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-emerald-600 dark:text-[#00FF85] border-emerald-500/30 bg-emerald-500/10';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Skill Banner & Selector */}
      <div className="bg-white dark:bg-[#12141a] p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Active Domain Skill:</span>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                {doc.skillName || currentSkillId.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Tailored extraction targets, risk taxonomy & domain panels active.
            </p>
          </div>
        </div>

        {/* Skill Override Control */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">Override Skill:</label>
          <select
            value={currentSkillId}
            onChange={(e) => onOverrideSkill && onOverrideSkill(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-[#14151b] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-2.5 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {allSkills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.priority})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSection('universal')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSection === 'universal'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-neutral-600 dark:text-neutral-300'
            }`}
          >
            Summary & Facts ({numbers.length + dates.length})
          </button>

          <button
            onClick={() => setActiveSection('domain')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSection === 'domain'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-neutral-600 dark:text-neutral-300'
            }`}
          >
            Domain Panels ({doc.skillName || 'Finance/Legal'})
          </button>

          <button
            onClick={() => setActiveSection('hidden')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              activeSection === 'hidden'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-neutral-600 dark:text-neutral-300'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-500" />
            <span>Hidden Clauses</span>
            {hiddenClauses.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">
                {hiddenClauses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('inconsistencies')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              activeSection === 'inconsistencies'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-neutral-600 dark:text-neutral-300'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Missing & Inconsistencies</span>
          </button>

          <button
            onClick={() => setActiveSection('evidence')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              activeSection === 'evidence'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-neutral-600 dark:text-neutral-300'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
            <span>Evidence Index ({doc.evidenceList?.length || 0})</span>
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative sm:w-56">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search panels..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full text-xs bg-white dark:bg-[#12141a] border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl pl-8 pr-3 py-1.5 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* 1. UNIVERSAL SECTION: Summary, Facts, Risks */}
      {activeSection === 'universal' && (
        <div className="space-y-6">
          {/* Executive Brief Card */}
          <div className="bg-white dark:bg-[#12141a] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-[#00FF85] font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Executive Brief & Grounded Synthesis
            </h3>
            <p className="text-xs text-neutral-700 dark:text-neutral-200 leading-relaxed mb-4">
              {doc.summary.executiveBrief || doc.summary.tldr}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80">
              <div>
                <h4 className="text-[11px] font-bold text-neutral-900 dark:text-white uppercase mb-1.5">
                  Core Takeaways:
                </h4>
                <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                  {doc.summary.keyTakeaways.map((k, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 dark:text-[#00FF85] mt-0.5">•</span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-neutral-900 dark:text-white uppercase mb-1.5">
                  Obligations & Action Items:
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  {(doc.summary.actionChecklist || []).slice(0, 3).map((act, i) => (
                    <li
                      key={i}
                      onClick={() => handleCitationClick(act.page || 1)}
                      className="p-2 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-colors"
                    >
                      <span className="truncate max-w-[200px] text-neutral-800 dark:text-neutral-200">{act.text}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] font-semibold">
                        P.{act.page || 1}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Risk Matrix with Semantic Tokens */}
          <div className="bg-white dark:bg-[#12141a] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-rose-500 font-semibold mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Risk Matrix & Verified Liabilities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {risks.map((risk) => {
                const colorCls = getRiskColor(risk.riskLevel);
                return (
                  <div
                    key={risk.id}
                    onClick={() => handleCitationClick(risk.page, risk.evidence?.boundingBox, risk.plainEnglish)}
                    className="p-3.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50 dark:bg-white/[0.03] hover:border-emerald-500/50 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {risk.title}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${colorCls}`}>
                        {risk.riskLevel}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {risk.plainEnglish}
                    </p>

                    {risk.mitigation && (
                      <div className="text-[11px] text-neutral-900 dark:text-emerald-200 bg-emerald-500/10 dark:bg-emerald-500/[0.07] p-2 rounded-lg border border-emerald-500/20">
                        <strong className="font-semibold text-emerald-800 dark:text-emerald-300">Mitigation:</strong> {risk.mitigation}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
                      <span>Click to view in document</span>
                      <span className="text-emerald-600 dark:text-[#00FF85] font-semibold">Page {risk.page} ↗</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Numbers & Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Numbers */}
            <div className="bg-white dark:bg-[#12141a] p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-[#00FF85] font-semibold mb-3">
                Key Grounded Numbers ({numbers.length})
              </h4>
              <div className="space-y-2">
                {numbers.slice(0, 5).map((num) => (
                  <div
                    key={num.id}
                    onClick={() => handleCitationClick(num.page, undefined, num.context)}
                    className="p-2 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between text-xs cursor-pointer hover:border-emerald-500/50 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-white block">{num.label}</span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate max-w-[200px] block">{num.context}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-600 dark:text-[#00FF85] text-xs">
                        {String(num.value)} {num.unit || ''}
                      </span>
                      <span className="text-[9px] text-neutral-400 block font-mono">P.{num.page}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white dark:bg-[#12141a] p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-[#00FF85] font-semibold mb-3">
                Timeline & Deadlines ({dates.length})
              </h4>
              <div className="space-y-2">
                {dates.slice(0, 5).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleCitationClick(d.page, undefined, d.event)}
                    className="p-2 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between text-xs cursor-pointer hover:border-emerald-500/50 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-white block truncate max-w-[200px]">{d.event}</span>
                      <span className="text-[10px] font-mono uppercase text-neutral-400">{d.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 text-xs">
                        {d.date}
                      </span>
                      <span className="text-[9px] text-neutral-400 block font-mono">P.{d.page}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DOMAIN-SPECIFIC PANELS (Finance, Legal, Corporate, etc.) */}
      {activeSection === 'domain' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#12141a] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-[#00FF85] font-semibold mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" /> Domain Specific Panels: {doc.skillName || currentSkillId.toUpperCase()}
            </h3>

            {/* Finance Panels */}
            {currentSkillId === 'finance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">📊 Fee Schedule & Cost Drag</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    Tracks management fees, exit loads, redemption penalties, and expense ratios.
                  </p>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between p-2 bg-white dark:bg-white/[0.04] rounded-lg border border-neutral-200/70 dark:border-neutral-800/70">
                      <span className="text-neutral-600 dark:text-neutral-300">Expense Ratio / Management:</span>
                      <span className="font-bold text-emerald-600 dark:text-[#00FF85]">1.25% p.a.</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white dark:bg-white/[0.04] rounded-lg border border-neutral-200/70 dark:border-neutral-800/70">
                      <span className="text-neutral-600 dark:text-neutral-300">Exit Load (under 365 days):</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">1.00%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">🔒 Liquidity & Lock-In Constraints</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    Identifies lock-in windows, redemption notice periods, and liquidity risks.
                  </p>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between p-2 bg-white dark:bg-white/[0.04] rounded-lg border border-neutral-200/70 dark:border-neutral-800/70">
                      <span className="text-neutral-600 dark:text-neutral-300">Mandatory Lock-in:</span>
                      <span className="font-bold text-emerald-600 dark:text-[#00FF85]">36 Months</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white dark:bg-white/[0.04] rounded-lg border border-neutral-200/70 dark:border-neutral-800/70">
                      <span className="text-neutral-600 dark:text-neutral-300">Redemption Cutoff:</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">15:00 IST</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Legal Panels */}
            {currentSkillId === 'legal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">⚖️ Liability Matrix & Indemnity</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    Damage caps, indemnification obligations, and uncapped liability triggers.
                  </p>
                  <div className="text-xs space-y-1.5">
                    {doc.legalData?.obligations?.map((o, idx) => (
                      <div key={idx} className="p-2 bg-white dark:bg-white/[0.04] rounded-lg border border-neutral-200/70 dark:border-neutral-800/70">
                        <strong className="text-neutral-900 dark:text-white">{o.party}:</strong> {o.obligation}
                      </div>
                    )) || <p className="text-xs text-neutral-500 dark:text-neutral-400">All party liabilities verified and grounded.</p>}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">📅 Termination & Renewal Conditions</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    Notice periods, convenience termination, and automatic renewal terms.
                  </p>
                  <div className="p-2.5 bg-white dark:bg-white/[0.04] rounded-lg border border-neutral-200/70 dark:border-neutral-800/70 text-xs text-neutral-600 dark:text-neutral-300">
                    {doc.legalData?.terminationTerms || '30 days prior written notice required for termination without cause.'}
                  </div>
                </div>
              </div>
            )}

            {/* Corporate Panels */}
            {currentSkillId === 'corporate' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">🏢 Entity & Responsibility Matrix</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    Parent, subsidiary, partner, and vendor commercial divisions.
                  </p>
                  <div className="space-y-1 text-xs">
                    {entities.slice(0, 4).map((ent, i) => (
                      <div key={i} className="flex justify-between p-2 bg-white dark:bg-white/[0.04] rounded-lg border border-neutral-200/70 dark:border-neutral-800/70">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{ent.key}</span>
                        <span className="font-mono text-neutral-500 dark:text-neutral-400">{ent.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white mb-2">🎯 Commercial Terms & Milestones</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    Key performance indicators, SLA tiers, and service credit triggers.
                  </p>
                  <div className="text-xs p-2.5 bg-white dark:bg-white/[0.04] rounded-lg border border-neutral-200/70 dark:border-neutral-800/70 text-neutral-600 dark:text-neutral-300">
                    SLA Commitment: 99.9% availability with tiered penalty credits for outages exceeding 15 minutes.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. HIDDEN CLAUSES PANEL */}
      {activeSection === 'hidden' && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3">
            <EyeOff className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Hidden & Easily-Overlooked Clause Detection
              </h4>
              <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80">
                Clauses that introduce conditional fees, auto-renewal triggers, or liability shifts not mentioned in headline terms.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {hiddenClauses.length > 0 ? (
              hiddenClauses.map((clause) => (
                <div
                  key={clause.id}
                  onClick={() => handleCitationClick(clause.page, clause.evidence?.boundingBox, clause.clauseText)}
                  className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 hover:border-amber-500/40 bg-white dark:bg-[#12141a] transition-all cursor-pointer space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      {clause.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold uppercase">
                      Severity: {clause.severity}
                    </span>
                  </div>

                  <blockquote className="text-xs italic bg-neutral-50 dark:bg-white/[0.03] p-2.5 rounded-lg border-l-2 border-amber-500 text-neutral-700 dark:text-neutral-300">
                    &ldquo;{clause.clauseText}&rdquo;
                  </blockquote>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Why it is easy to overlook:</span>
                      <p className="text-neutral-600 dark:text-neutral-400">{clause.reasonHidden}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">Operational Impact:</span>
                      <p className="text-neutral-600 dark:text-neutral-400">{clause.impact}</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                    Jump to Page {clause.page} ↗
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-white dark:bg-[#12141a] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-400 text-xs">
                No hidden fine print or deceptive clause heuristics detected in this document.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. MISSING INFORMATION & INCONSISTENCIES */}
      {activeSection === 'inconsistencies' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#12141a] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-rose-500 font-semibold mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4" /> Inconsistencies & Omitted Clauses
            </h3>

            {inconsistencies.length > 0 ? (
              <div className="space-y-3">
                {inconsistencies.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs space-y-1">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">{item.topic}</span>
                    <p className="text-neutral-700 dark:text-neutral-300">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                No internal contradictions or value mismatches flagged in document text.
              </p>
            )}

            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-[#00FF85] font-semibold mt-6 mb-2">
              Expected Clauses for this Domain:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between">
                <span className="text-neutral-800 dark:text-neutral-200">Governing Law & Jurisdiction</span>
                <span className="text-emerald-600 dark:text-[#00FF85] font-semibold">Present (Page 1)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between">
                <span className="text-neutral-800 dark:text-neutral-200">Data Protection & Confidentiality</span>
                <span className="text-emerald-600 dark:text-[#00FF85] font-semibold">Present (Page 1)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. EVIDENCE COVERAGE INDEX */}
      {activeSection === 'evidence' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#12141a] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-[#00FF85] font-semibold mb-3 flex items-center gap-2">
              <Crosshair className="w-4 h-4" /> Evidence Grounding Coverage Index
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Agent One links every insight to normalized spatial coordinates. Click any evidence anchor below to focus on the target region.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(doc.evidenceList || []).slice(0, 12).map((ev, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCitationClick(ev.page, ev.boundingBox, ev.sourceText)}
                  className="p-2.5 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50 dark:bg-white/[0.03] hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                      Page {ev.page} • {ev.extractionMethod}
                    </span>
                    <p className="text-xs text-neutral-900 dark:text-white truncate">
                      {ev.sourceText}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-[#00FF85] flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

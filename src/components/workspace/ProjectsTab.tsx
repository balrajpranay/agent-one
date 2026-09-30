'use client';

import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Search,
  ArrowRight,
  FileText,
  Sparkles,
  Scale,
  CreditCard,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Layers,
  MoreVertical,
  X
} from 'lucide-react';
import { DocumentAnalysis } from '@/lib/types';
import { SPECIALIZED_AGENTS, SpecializedAgent } from '@/components/ui/AgentGalleryModal';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  domain: string;
  agentId: string;
  docName: string;
  docMatchSubstring?: string;
  metrics: string;
  status: 'In Progress' | 'Completed' | 'Review Required';
  updatedAt: string;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Commercial Lease Risk & Indemnity Audit',
    description: 'Comprehensive review of tenant liability caps, annual escalation percentages, and unilateral exit clauses.',
    domain: 'Legal',
    agentId: 'legal-counsel',
    docName: 'Commercial_Lease_Indiranagar.docx',
    docMatchSubstring: 'Commercial_Lease',
    metrics: '3 Critical Liabilities Flagged',
    status: 'Review Required',
    updatedAt: '2 hours ago'
  },
  {
    id: 'proj-2',
    title: 'Q4 Enterprise Cash Flow & Subscription Audit',
    description: 'Quantitative synthesis of operational burn, disputed transaction items, and duplicate recurring software subscriptions.',
    domain: 'Finance',
    agentId: 'financial-auditor',
    docName: 'HDFC_Salary_Account_Bank_Statement_Jan2026.pdf',
    docMatchSubstring: 'HDFC_Salary',
    metrics: '12 Recurring Fee Leaks Detected',
    status: 'In Progress',
    updatedAt: 'Yesterday'
  },
  {
    id: 'proj-3',
    title: 'Transformer BLEU Benchmark Synthesis',
    description: 'Literature analysis of scaled dot-product attention heads, multi-head projection bounds, and translation perplexity.',
    domain: 'Academic',
    agentId: 'academic-researcher',
    docName: 'Multi-Head_Attention_Mechanisms.pdf',
    docMatchSubstring: 'Multi-Head',
    metrics: '98% Spatial Citation Grounding',
    status: 'Completed',
    updatedAt: '3 days ago'
  },
  {
    id: 'proj-4',
    title: 'Enterprise Cloud SLA & SOC2 Framework',
    description: 'Cross-auditing acceptable use policies against GDPR data controller covenants and SOC2 Type II trust principles.',
    domain: 'Compliance',
    agentId: 'compliance-officer',
    docName: 'Enterprise_Cloud_Platform_Terms.docx',
    docMatchSubstring: 'Enterprise_Cloud',
    metrics: 'Full Statutory Compliance Met',
    status: 'Completed',
    updatedAt: 'Last week'
  }
];

interface ProjectsTabProps {
  onOpenProject: (project: ProjectItem) => void;
  docsList: DocumentAnalysis[];
  onSelectDoc?: (doc: DocumentAnalysis) => void;
  onSelectAgent?: (agent: SpecializedAgent) => void;
}

export default function ProjectsTab({
  onOpenProject,
  docsList,
  onSelectDoc,
  onSelectAgent
}: ProjectsTabProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('agentone_projects_list');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_PROJECTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDomain, setNewDomain] = useState('Legal');
  const [newAgentId, setNewAgentId] = useState('legal-counsel');
  const [newDocName, setNewDocName] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.docName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'all' || p.domain.toLowerCase() === domainFilter.toLowerCase();
    return matchesSearch && matchesDomain;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom project workspace for multi-document agent intelligence.',
      domain: newDomain,
      agentId: newAgentId,
      docName: newDocName.trim() || (docsList[0]?.name || 'Workspace Document'),
      metrics: 'Project Created',
      status: 'In Progress',
      updatedAt: 'Just now'
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('agentone_projects_list', JSON.stringify(updated));
      } catch (err) {
        // ignore
      }
    }

    setNewTitle('');
    setNewDesc('');
    setIsCreateModalOpen(false);
  };

  const getAgentName = (agentId: string) => {
    const agent = SPECIALIZED_AGENTS.find((a) => a.id === agentId);
    return agent?.name || 'Agent One Core';
  };

  const getAgentColor = (agentId: string) => {
    switch (agentId) {
      case 'legal-counsel':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'financial-auditor':
      case 'investment-analyst':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'academic-researcher':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'compliance-officer':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8 max-w-7xl w-full mx-auto relative z-10 space-y-8 select-none">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white/[0.08] text-white dark:text-[#00FF85] border border-neutral-800 dark:border-white/[0.1] flex items-center justify-center shadow-xs">
              <Folder className="w-4 h-4 stroke-[2]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Projects & Workspaces
            </h1>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border border-emerald-500/20">
              {projects.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Organize multi-document audits, assign specialized agent lenses, and preserve grounded project context.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-semibold text-xs transition-all shadow-xs cursor-pointer hover:scale-102 active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, documents, or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-[#111319] border border-neutral-200/80 dark:border-white/[0.08] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'Legal', 'Finance', 'Academic', 'Compliance'].map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setDomainFilter(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                domainFilter.toLowerCase() === dom.toLowerCase()
                  ? 'bg-neutral-900 text-white dark:bg-white/[0.1] dark:text-white dark:border dark:border-white/[0.1]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-white/[0.04]'
              }`}
            >
              {dom === 'all' ? 'All Domains' : dom}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#111319] border border-neutral-200/80 dark:border-white/[0.07] hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all flex flex-col justify-between gap-4 group shadow-2xs hover:shadow-md"
          >
            <div className="space-y-3">
              {/* Top Row: Domain & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/[0.08]">
                  {project.domain}
                </span>

                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                    project.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-[#00FF85] border-emerald-500/20'
                      : project.status === 'Review Required'
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00FF85] transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Document Link */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/[0.04]">
                <FileText className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
                <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate font-mono">
                  {project.docName}
                </span>
              </div>

              {/* Agent Lens Badge */}
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${getAgentColor(project.agentId)}`}>
                  <Sparkles className="w-3 h-3" />
                  <span>{getAgentName(project.agentId)}</span>
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono truncate">
                  &bull; {project.metrics}
                </span>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-neutral-100 dark:border-white/[0.05] flex items-center justify-between gap-3">
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{project.updatedAt}</span>
              </span>

              <button
                type="button"
                onClick={() => onOpenProject(project)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
              >
                <span>Open in Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-neutral-300 dark:border-white/[0.1] space-y-3">
          <Folder className="w-10 h-10 text-neutral-400 dark:text-neutral-600 mx-auto" />
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
            No projects found
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search query or create a new project.
          </p>
        </div>
      )}

      {/* 4. Create New Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#14151b] border border-neutral-200 dark:border-white/[0.1] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-emerald-600 dark:text-[#00FF85]" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Create New Project
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Indiranagar Commercial Lease Review"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Description / Audit Goal
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Briefly state the goal, scope, or expected outcomes..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Domain
                  </label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Legal">Legal</option>
                    <option value="Finance">Finance</option>
                    <option value="Academic">Academic</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Assigned Agent Lens
                  </label>
                  <select
                    value={newAgentId}
                    onChange={(e) => setNewAgentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {SPECIALIZED_AGENTS.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Primary Document
                </label>
                <select
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-mono"
                >
                  <option value="">Select an available document...</option>
                  {docsList.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-white/[0.08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 shadow-xs cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { SkillDefinition } from './types';

export const SKILLS_CATALOG: SkillDefinition[] = [
  {
    id: 'finance',
    name: 'Finance & Investment Documents',
    priority: 'core',
    domainTriggers: [
      'prospectus',
      'mutual fund',
      'investment',
      'brokerage',
      'term sheet',
      'bond',
      'NAV',
      'expense ratio',
      'redemption',
      'lock-in',
      'loan agreement',
      'bank statement',
      'credit facility',
      'securities',
      'portfolio',
      'KYC',
      'demat',
      'exit load'
    ],
    panels: ['Fee Schedule', 'Risk Matrix', 'Investment Terms', 'Important Dates', 'Hidden Financial Clauses'],
    graphNodeTypes: ['Instrument', 'Issuer', 'FeeItem', 'RedemptionRule', 'LockInPeriod', 'PaymentSchedule'],
    graphEdgeTypes: ['ISSUES', 'CHARGES', 'GOVERNED_BY', 'MATURES_ON', 'REDEEMABLE_UNDER'],
    instructions: 'Extract instrument details, fees, lock-in terms, and calculate all hidden financial charges with exact coordinate grounding.'
  },
  {
    id: 'legal',
    name: 'Legal Agreements & Contracts',
    priority: 'core',
    domainTriggers: [
      'agreement',
      'contract',
      'lease',
      'NDA',
      'MOU',
      'terms and conditions',
      'indemnity',
      'liability',
      'termination',
      'arbitration',
      'jurisdiction',
      'governing law',
      'party',
      'whereas',
      'hereinafter'
    ],
    panels: ['Parties & Liability Matrix', 'Obligation Map', 'Termination Conditions', 'Renewal', 'Key Clauses'],
    graphNodeTypes: ['Party', 'Obligation', 'LiabilityClause', 'TerminationClause', 'NoticePeriod'],
    graphEdgeTypes: ['PARTY_TO, OBLIGATED_TO, LIABLE_FOR, TERMINATES_UNDER, NOTICE_REQUIRED_BY'],
    instructions: 'Identify contracting parties, obligation timelines, liability caps, dispute resolution clauses, and termination triggers.'
  },
  {
    id: 'corporate',
    name: 'Corporate & Business Documents',
    priority: 'core',
    domainTriggers: [
      'MOU',
      'joint venture',
      'subsidiary',
      'board resolution',
      'annual report',
      'business agreement',
      'vendor agreement',
      'SLA',
      'milestone',
      'deliverable',
      'statement of work',
      'shareholder'
    ],
    panels: ['Entity Map', 'Responsibility Matrix', 'Commercial Terms', 'Milestones', 'Operational Risks'],
    graphNodeTypes: ['Organization', 'Subsidiary', 'Milestone', 'CommercialTerm', 'Deliverable'],
    graphEdgeTypes: ['SUBSIDIARY_OF', 'RESPONSIBLE_FOR', 'DELIVERS_BY', 'COMMITS_TO', 'DEPENDS_ON'],
    instructions: 'Map corporate structures, milestone deliveries, vendor commitments, operational governance, and financial covenants.'
  },
  {
    id: 'insurance',
    name: 'Insurance Policies',
    priority: 'architecture-ready',
    domainTriggers: [
      'policy',
      'premium',
      'sum insured',
      'exclusion',
      'rider',
      'deductible',
      'claim',
      'insurer',
      'policyholder',
      'waiting period',
      'coverage'
    ],
    panels: ['Coverage Summary', 'Exclusions', 'Premium Schedule', 'Claim Conditions'],
    graphNodeTypes: ['Policy', 'Coverage', 'Exclusion', 'Rider', 'ClaimCondition'],
    graphEdgeTypes: ['COVERS', 'EXCLUDES', 'RIDER_TO', 'PAYABLE_UNDER'],
    instructions: 'Extract policy limits, exclusions, co-pay ratios, deductibles, waiting period restrictions, and claim filing conditions.'
  },
  {
    id: 'academic',
    name: 'Academic & Research Documents',
    priority: 'architecture-ready',
    domainTriggers: [
      'abstract',
      'methodology',
      'hypothesis',
      'literature review',
      'dataset',
      'p-value',
      'citation',
      'peer-reviewed',
      'findings',
      'limitations'
    ],
    panels: ['Methodology Summary', 'Key Findings', 'Limitations', 'Citation Map'],
    graphNodeTypes: ['Author', 'Finding', 'Method', 'Dataset', 'Citation'],
    graphEdgeTypes: ['AUTHORED_BY', 'USES_METHOD', 'CITES', 'SUPPORTS_FINDING'],
    instructions: 'Synthesize research hypotheses, empirical methodology, statistical benchmarks, paper citations, and experimental limitations.'
  },
  {
    id: 'general',
    name: 'General Document (Fallback)',
    priority: 'architecture-ready',
    domainTriggers: [],
    panels: ['Summary', 'Key Facts', 'Risks'],
    graphNodeTypes: ['Entity', 'Fact', 'Risk'],
    graphEdgeTypes: ['MENTIONS', 'RELATES_TO'],
    instructions: 'Produce universal summary, key factual metrics, dates, and grounded risk assessment with coordinate bounding boxes.'
  }
];

export function getAllSkills(): SkillDefinition[] {
  return [...SKILLS_CATALOG];
}

export function loadSkill(id: string): SkillDefinition {
  const found = SKILLS_CATALOG.find((s) => s.id.toLowerCase() === id.toLowerCase());
  return found || SKILLS_CATALOG[SKILLS_CATALOG.length - 1];
}

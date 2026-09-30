import { DocumentAnalysis, AttachedMediaFile, MediaType } from './types';

export interface DemoDocument extends DocumentAnalysis {
  demoCategory: string;
  demoDescription: string;
  fileFormat: 'PDF' | 'DOCX';
  iconName: 'Briefcase' | 'Scale' | 'CreditCard' | 'ShieldCheck' | 'Landmark' | 'BookOpen' | 'FileText' | 'ShieldAlert';
}

export const DEMO_DOCUMENTS: DemoDocument[] = [
  // 1. Business Report — quarterly business performance report
  {
    id: 'demo-business-report',
    name: 'Q4_FY2025_Enterprise_Business_Performance_Report.docx',
    fileSize: '1.8 MB',
    pageCount: 8,
    uploadedAt: 'Sample Library',
    demoCategory: 'Business Report',
    fileFormat: 'DOCX',
    iconName: 'Briefcase',
    demoDescription: 'Quarterly SaaS performance report covering ARR growth, net retention, CAC payback, and operating margins.',
    category: 'Business reports',
    detectedDomain: 'business',
    secondaryDomains: ['finance', 'overall'],
    confidenceScore: 99.4,
    detectionReason: 'Identified recurring revenue breakdown, ARR growth cohorts, non-GAAP operating margins, and board-level strategic milestones.',
    summary: {
      tldr: 'Q4 FY2025 performance review showing 38% YoY ARR growth ($48.2M ARR), 118% net revenue retention, and positive non-GAAP operating margin of 14.2%.',
      keyTakeaways: [
        'Annual Recurring Revenue (ARR) reached $48.2M, reflecting a 38% year-over-year expansion driven by mid-market and enterprise tier upgrades.',
        'Net Revenue Retention (NRR) held steady at 118%, with logo churn decreasing from 4.2% to 2.8%.',
        'Gross margin improved 240 bps to 78.6% through cloud compute reserved instance optimization and multi-tenant scaling.',
        'Customer Acquisition Cost (CAC) payback period decreased from 14.5 months to 11.2 months.',
        'Operating cash flow turned positive at $3.8M for the quarter, compared to -$1.2M in Q4 FY2024.'
      ],
      executiveBrief: 'Enterprise SaaS performance demonstrates accelerating capital efficiency and operating leverage. Core expansion targets in North America and EMEA exceeded quota attainment by 14%, positioning the company for sustained cash generation in FY2026.',
      actionChecklist: [
        { id: 'act-biz-1', text: 'Approve FY2026 enterprise sales expansion budget ($3.2M)', priority: 'high', completed: false, category: 'Expansion', page: 2 },
        { id: 'act-biz-2', text: 'Finalize multi-region cloud contract renegotiation with AWS before March 31', priority: 'high', completed: false, category: 'Infrastructure', page: 5 },
        { id: 'act-biz-3', text: 'Standardize customer onboarding playbook to trim time-to-first-value to under 14 days', priority: 'medium', completed: true, category: 'Customer Success', page: 7 }
      ],
      importantDates: [
        { id: 'dt-biz-1', event: 'FY2026 Budget Approval Board Meeting', date: '15-Feb-2026', type: 'deadline', status: 'upcoming', page: 1 },
        { id: 'dt-biz-2', event: 'Enterprise Sales Kickoff (San Francisco)', date: '02-Mar-2026', type: 'milestone', status: 'upcoming', page: 4 },
        { id: 'dt-biz-3', event: 'Q1 FY2026 Investor Earnings Call', date: '28-Apr-2026', type: 'filing', status: 'upcoming', page: 8 }
      ],
      numbersAndMetrics: [
        { id: 'num-biz-1', label: 'Ending ARR', value: '$48.2M', category: 'monetary', context: '38% YoY growth', page: 1 },
        { id: 'num-biz-2', label: 'Net Revenue Retention', value: '118%', category: 'percentage', context: 'Enterprise client base', page: 2 },
        { id: 'num-biz-3', label: 'Non-GAAP Operating Margin', value: '14.2%', category: 'percentage', context: '+320 bps YoY', page: 3 },
        { id: 'num-biz-4', label: 'CAC Payback Period', value: '11.2 months', category: 'measurement', context: 'Blended outbound and inbound', page: 4 }
      ],
      risksAndConcerns: [
        { id: 'rsk-biz-1', title: 'Top-3 Customer Revenue Concentration', riskLevel: 'Warning', plainEnglish: 'Top 3 enterprise accounts represent 22.4% of total ARR, posing revenue volatility if renewal terms stall.', mitigation: 'Accelerate mid-market sales velocity to dilute concentration below 15% by Q3.', page: 6 },
        { id: 'rsk-biz-2', title: 'European Cloud Data Sovereignty Compliance', riskLevel: 'Caution', plainEnglish: 'EMEA customer expansions require dedicated Frankfurt data isolation by July 2026.', mitigation: 'Deploy Frankfurt secondary cluster in Q2 cloud roadmap.', page: 7 }
      ],
      questionsToConsider: [
        'What was the primary driver for gross margin expansion in Q4?',
        'How did ARR growth compare across North America vs EMEA?',
        'What are the key dependencies for achieving the $65M FY2026 ARR milestone?'
      ]
    },
    metrics: [
      { label: 'Annual Recurring Revenue', value: '$48.2M', change: '+38% YoY', status: 'positive', subtext: 'Target: $46.0M', iconName: 'TrendingUp', page: 1 },
      { label: 'Net Revenue Retention', value: '118%', change: '+3% vs Q3', status: 'positive', subtext: 'Enterprise cohorts', iconName: 'Users', page: 2 },
      { label: 'Gross Margin', value: '78.6%', change: '+240 bps', status: 'positive', subtext: 'Cloud cost savings', iconName: 'BarChart2', page: 3 },
      { label: 'CAC Payback', value: '11.2 mo', change: '-3.3 mo', status: 'positive', subtext: 'Efficient go-to-market', iconName: 'Clock', page: 4 }
    ],
    businessData: {
      executiveSummary: 'Strong execution across enterprise sales and cloud cost management delivered record Q4 revenue and positive cash flow.',
      strategicObjectives: [
        'Scale enterprise annual contract value (ACV) above $120k',
        'Expand self-serve developer tier to accelerate inbound pipeline',
        'Achieve Rule of 40 milestone by Q3 FY2026'
      ],
      stakeholders: [
        { name: 'Elena Rostova', role: 'Chief Executive Officer', interest: 'Strategic growth and capital allocation' },
        { name: 'Marcus Vance', role: 'Chief Financial Officer', interest: 'Gross margin discipline and cash runway' },
        { name: 'David Chen', role: 'Chief Revenue Officer', interest: 'Enterprise quota attainment and net retention' }
      ],
      deliverables: [
        { item: 'Frankfurt data center regional deployment', owner: 'Infrastructure VP', deadline: '30-Jun-2026' },
        { item: 'Tier-1 partner ecosystem launch', owner: 'Business Development VP', deadline: '15-May-2026' }
      ],
      marketInsights: [
        'Mid-market buyers favor consolidated analytics over multi-vendor stacks',
        'Enterprise procurement cycles lengthened by 8 days due to security reviews'
      ],
      financialProjections: [
        { metric: 'FY2026 ARR Target', target: '$65.0M', timeframe: 'Q4 FY2026' },
        { metric: 'Operating Margin Target', target: '18.0%', timeframe: 'Q4 FY2026' }
      ],
      keyDecisions: [
        'Approved $3.2M incremental investment into enterprise sales headcount',
        'Authorized multi-year cloud reserved capacity commitment'
      ],
      risksAndThreats: [
        'Competitive pricing pressure in lower mid-market tier',
        'Prolonged enterprise legal and security procurement reviews'
      ]
    },
    extractedEntities: [
      { category: 'Organization', key: 'Company Name', value: 'Nexora Cloud Systems Inc.', page: 1 },
      { category: 'Date', key: 'Reporting Period', value: 'Q4 FY2025 (Ended Dec 31, 2025)', page: 1 },
      { category: 'Amount', key: 'Total ARR', value: '$48,200,000 USD', page: 1 },
      { category: 'Amount', key: 'Quarterly Operating Cash Flow', value: '+$3,820,000 USD', page: 3 },
      { category: 'Person', key: 'CEO', value: 'Elena Rostova', page: 1 },
      { category: 'Person', key: 'CFO', value: 'Marcus Vance', page: 1 }
    ],
    extractedTables: [
      {
        id: 'tbl-biz-metrics',
        tableName: 'Key Financial Metrics - Q4 FY2025 vs Q4 FY2024',
        columns: ['Metric', 'Q4 FY2024', 'Q4 FY2025', 'YoY Growth / Change'],
        rows: [
          { 'Metric': 'Annual Recurring Revenue (ARR)', 'Q4 FY2024': '$34.9M', 'Q4 FY2025': '$48.2M', 'YoY Growth / Change': '+38.1%' },
          { 'Metric': 'Net Revenue Retention (NRR)', 'Q4 FY2024': '112%', 'Q4 FY2025': '118%', 'YoY Growth / Change': '+600 bps' },
          { 'Metric': 'Gross Margin (Non-GAAP)', 'Q4 FY2024': '76.2%', 'Q4 FY2025': '78.6%', 'YoY Growth / Change': '+240 bps' },
          { 'Metric': 'Operating Cash Flow', 'Q4 FY2024': '-$1.2M', 'Q4 FY2025': '+$3.8M', 'YoY Growth / Change': '+$5.0M' }
        ],
        page: 2
      }
    ],
    sampleQuestions: [
      'What were the total ending ARR and year-over-year growth rate?',
      'How did gross margin improve between Q4 FY2024 and Q4 FY2025?',
      'What are the primary strategic objectives and expansion risks for FY2026?',
      'What is the customer acquisition cost (CAC) payback period?'
    ],
    chatHistory: [],
    rawText: `NEXORA CLOUD SYSTEMS INC. - EXECUTIVE BUSINESS PERFORMANCE REPORT
Reporting Period: Fourth Quarter FY2025 (Three Months Ended December 31, 2025)
Financial Summary:
- Ending ARR: $48.2M (+38% YoY vs $34.9M in Q4 FY2024)
- Net Revenue Retention: 118% (Enterprise customer cohort)
- Non-GAAP Gross Margin: 78.6% (+240 bps improvement)
- CAC Payback Period: 11.2 months (down from 14.5 months)
- Free Cash Flow: $3.8M positive vs ($1.2M) burn in prior year period.
Strategic Growth & Governance:
- Enterprise ACV expanded 22% to $128k average contract value.
- Board approval granted for FY2026 North America and EMEA sales expansion.
- Cloud reserved instance strategy reduced AWS infrastructure cost per compute unit by 18%.`,
    pageTexts: [
      {
        page: 1,
        text: `NEXORA CLOUD SYSTEMS INC. - EXECUTIVE BUSINESS PERFORMANCE REPORT\nReporting Period: Fourth Quarter FY2025\nEnding ARR: $48.2M (+38% YoY)\nNet Revenue Retention: 118%\nGross Margin: 78.6%`
      },
      {
        page: 2,
        text: `SECTION 2: REVENUE DYNAMICS & UNIT ECONOMICS\nCustomer Acquisition Cost (CAC) payback dropped to 11.2 months.\nEnterprise client count reached 342 accounts with 2.8% annual logo churn.\nOperating cash flow turned positive at $3.8M.`
      }
    ]
  },

  // 2. Legal Agreement — sample commercial lease or service agreement
  {
    id: 'demo-legal-agreement',
    name: 'Commercial_Lease_and_Service_Agreement_2026.pdf',
    fileSize: '2.4 MB',
    pageCount: 14,
    uploadedAt: 'Sample Library',
    demoCategory: 'Legal Agreement',
    fileFormat: 'PDF',
    iconName: 'Scale',
    demoDescription: 'Commercial lease and facility service agreement detailing lock-in tenure, rent escalation, indemnity, and termination clauses.',
    category: 'Legal agreements',
    detectedDomain: 'legal',
    secondaryDomains: ['business', 'finance'],
    confidenceScore: 99.8,
    detectionReason: 'Identified commercial tenancy terms, security deposit provisions, lock-in period penalty covenants, and indemnification ceilings.',
    summary: {
      tldr: '36-month commercial lease agreement for 8,500 sq ft office premises at ₹4,67,500/month with a mandatory 18-month lock-in period and an aggressive 10% annual rent escalation.',
      keyTakeaways: [
        'Monthly base lease consideration is ₹4,67,500 (₹55 per sq ft on 8,500 super built-up area), payable on or before the 5th of each calendar month.',
        'Mandatory 18-month lock-in period during which tenant early exit forfeits entire ₹28,05,000 security deposit plus unexpired lock-in rent.',
        'Annual rent escalation is fixed at 10% compounded annually at the completion of each 12-month period.',
        'Tenant is solely responsible for internal fit-out maintenance, electrical load enhancement costs, and property insurance.',
        'Lessor indemnification clause lacks reciprocal liability protection for tenant business interruption caused by facility outages.'
      ],
      executiveBrief: 'Standard commercial property lease structured favorably toward lessor. Primary negotiation priorities include reducing annual rent escalation from 10% to 6-7%, incorporating mutual indemnification, and capping lock-in exit penalties.',
      actionChecklist: [
        { id: 'act-leg-1', text: 'Negotiate reduction of annual rent escalation from 10% to 6.5%', priority: 'high', completed: false, category: 'Commercials', page: 3 },
        { id: 'act-leg-2', text: 'Insert clause guaranteeing full refund of ₹28.05L deposit within 15 days of key handover', priority: 'high', completed: false, category: 'Deposit', page: 4 },
        { id: 'act-leg-3', text: 'Add reciprocal indemnification cap protecting tenant from facility electrical fires', priority: 'medium', completed: false, category: 'Liability', page: 8 }
      ],
      importantDates: [
        { id: 'dt-leg-1', event: 'Agreement Execution Date', date: '10-Feb-2026', type: 'effective', status: 'upcoming', page: 1 },
        { id: 'dt-leg-2', event: 'Rent Commencement Date', date: '01-Mar-2026', type: 'milestone', status: 'upcoming', page: 2 },
        { id: 'dt-leg-3', event: 'Lock-In Expiration Date', date: '31-Aug-2027', type: 'deadline', status: 'upcoming', page: 3 }
      ],
      numbersAndMetrics: [
        { id: 'num-leg-1', label: 'Monthly Base Rent', value: '₹4,67,500', category: 'monetary', context: '8,500 sq ft @ ₹55/sq ft', page: 2 },
        { id: 'num-leg-2', label: 'Interest-Free Security Deposit', value: '₹28,05,000', category: 'monetary', context: '6 months advance rent', page: 4 },
        { id: 'num-leg-3', label: 'Annual Escalation Rate', value: '10.0%', category: 'percentage', context: 'Compounded every 12 months', page: 3 },
        { id: 'num-leg-4', label: 'Lock-in Period Duration', value: '18 Months', category: 'count', context: 'Strict non-termination window', page: 3 }
      ],
      risksAndConcerns: [
        { id: 'rsk-leg-1', title: 'One-Sided Lock-In Liquidated Damages', riskLevel: 'Critical', plainEnglish: 'Clause 9.2 obligates tenant to pay full remaining rent for the 18-month lock-in if terminated early, regardless of premises re-letting.', mitigation: 'Cap early departure penalty at 3 months rent or actual lessor vacancy loss.', page: 5 },
        { id: 'rsk-leg-2', title: 'Aggressive 10% Annual Compounded Escalation', riskLevel: 'Warning', plainEnglish: 'Rent increases from ₹4.67L to ₹5.14L in Year 2 and ₹5.65L in Year 3, exceeding current market inflation benchmarks of 5-7%.', mitigation: 'Counter-propose 6% annual escalation or 15% escalation every 3 years.', page: 3 }
      ],
      questionsToConsider: [
        'Can the tenant sublease or assign the agreement to a subsidiary entity?',
        'What are the lessor remedies if monthly rent payment is delayed past the 5th?',
        'Who bears the cost of structural repairs versus day-to-day maintenance?'
      ]
    },
    metrics: [
      { label: 'Monthly Base Rent', value: '₹4,67,500', change: '₹55 / sq ft', status: 'neutral', subtext: '8,500 sq ft', iconName: 'CreditCard', page: 2 },
      { label: 'Security Deposit', value: '₹28.05L', change: '6 Months Rent', status: 'warning', subtext: 'Interest-free refundable', iconName: 'Shield', page: 4 },
      { label: 'Lock-In Duration', value: '18 Mo', change: 'Strict Clause', status: 'negative', subtext: 'Full penalty on exit', iconName: 'Lock', page: 3 },
      { label: 'Escalation Rate', value: '10% p.a.', change: '+10% / year', status: 'warning', subtext: 'Compounded', iconName: 'TrendingUp', page: 3 }
    ],
    legalData: {
      contractType: 'Commercial Property Lease & Facility Agreement',
      parties: ['Indiranagar Tech Parks LLP (Lessor)', 'Nexora Solutions Pvt Ltd (Lessee)'],
      effectiveDate: '10-Feb-2026',
      duration: '36 Months (With 36-Month Renewal Option)',
      riskScore: 'High',
      riskyClauses: [
        { id: 'cl-1', clause: 'Clause 9.2: Liquidated Damages on Early Termination', page: 5, riskLevel: 'Critical', plainEnglish: 'Tenant forfeits security deposit and pays remaining lock-in rent if terminating within 18 months.', mitigation: 'Limit liquidated damages to forfeiture of deposit only without recurring rent liability.' },
        { id: 'cl-2', clause: 'Clause 14.1: Unilateral Power Supply Interruption', page: 9, riskLevel: 'Warning', plainEnglish: 'Lessor may disconnect HVAC or backup generator without liability if any disputed fee is unpaid for 7 days.', mitigation: 'Require 30 days written notice with dispute escalation prior to service interruption.' }
      ],
      obligations: [
        { id: 'ob-1', party: 'Lessee', obligation: 'Pay monthly rent on or before 5th of each month', deadline: 'Monthly (5th)', page: 2 },
        { id: 'ob-2', party: 'Lessee', obligation: 'Maintain comprehensive public liability insurance coverage', deadline: 'Within 30 days of possession', page: 7 },
        { id: 'ob-3', party: 'Lessor', obligation: 'Provide 100% DG generator electrical backup to premises', deadline: 'Continuous', page: 6 }
      ],
      terminationTerms: '3 months advance written notice after completion of 18-month lock-in period.'
    },
    extractedEntities: [
      { category: 'Organization', key: 'Lessor', value: 'Indiranagar Tech Parks LLP', page: 1 },
      { category: 'Organization', key: 'Lessee', value: 'Nexora Solutions Pvt Ltd', page: 1 },
      { category: 'Location', key: 'Premises Address', value: '4th Floor, Tower B, 100 Feet Road, Indiranagar, Bengaluru', page: 1 },
      { category: 'Amount', key: 'Monthly Consideration', value: '₹4,67,500 INR', page: 2 },
      { category: 'Amount', key: 'Security Deposit', value: '₹28,05,000 INR', page: 4 },
      { category: 'Date', key: 'Possession Date', value: '01-Mar-2026', page: 2 }
    ],
    extractedTables: [
      {
        id: 'tbl-lease-rent',
        tableName: 'Commercial Lease Rent Escalation Schedule',
        columns: ['Period', 'Monthly Rent (₹)', 'Annual Outflow (₹)', 'Escalation (%)'],
        rows: [
          { 'Period': 'Months 1 to 12 (Year 1)', 'Monthly Rent (₹)': '₹4,67,500', 'Annual Outflow (₹)': '₹56,10,000', 'Escalation (%)': 'Base' },
          { 'Period': 'Months 13 to 24 (Year 2)', 'Monthly Rent (₹)': '₹5,14,250', 'Annual Outflow (₹)': '₹61,71,000', 'Escalation (%)': '+10.0%' },
          { 'Period': 'Months 25 to 36 (Year 3)', 'Monthly Rent (₹)': '₹5,65,675', 'Annual Outflow (₹)': '₹67,88,100', 'Escalation (%)': '+10.0%' }
        ],
        page: 3
      }
    ],
    sampleQuestions: [
      'What are the penalties if the tenant terminates within the 18-month lock-in period?',
      'How much is the total rent escalation over the 3-year tenancy?',
      'What are the lessor responsibilities regarding power backup and building maintenance?',
      'What is the notice period required for non-renewal after the lock-in?'
    ],
    chatHistory: [],
    rawText: `COMMERCIAL LEASE DEED AND FACILITY SERVICES AGREEMENT
BETWEEN: Indiranagar Tech Parks LLP (Lessor) AND Nexora Solutions Pvt Ltd (Lessee)
Premises: 4th Floor, Tower B, Indiranagar Cyber Park, Bengaluru (8,500 sq.ft. Super Built-up Area).
Term: Thirty-Six (36) Months commencing March 1, 2026.
Financial Terms:
1. Base Rent: ₹4,67,500/- per month (@ ₹55/sq.ft.) payable on or before 5th of each month.
2. Escalation: 10% increase every 12 months.
3. Security Deposit: ₹28,05,000/- (equivalent to 6 months rent), interest-free and refundable within 30 days of vacant possession handover.
4. Lock-In Period: 18 months. Early exit requires full payment of rent for balance lock-in term plus forfeiture of deposit.`,
    pageTexts: [
      {
        page: 1,
        text: `COMMERCIAL LEASE DEED - INDIRANAGAR TECH PARKS LLP & NEXORA SOLUTIONS PVT LTD\nPremises: 8,500 sq ft office space.\nBase Monthly Rent: ₹4,67,500 INR\nSecurity Deposit: ₹28,05,000 INR`
      },
      {
        page: 2,
        text: `CLAUSE 9: LOCK-IN PERIOD AND TERMINATION LIQUIDATED DAMAGES\nLessee cannot terminate before 18 months without paying entire balance rent.\nAnnual rent escalation is 10% per annum compounded.`
      }
    ]
  },

  // 3. Financial Document — bank statement or investment report
  {
    id: 'demo-financial-document',
    name: 'HDFC_Salary_Account_Bank_Statement_Jan2026.pdf',
    fileSize: '1.4 MB',
    pageCount: 4,
    uploadedAt: 'Sample Library',
    demoCategory: 'Financial Document',
    fileFormat: 'PDF',
    iconName: 'CreditCard',
    demoDescription: 'Commercial and payroll bank statement with cash flow ledger, recurring subscription audit, and overdraft charge detection.',
    category: 'Bank and financial documents',
    detectedDomain: 'finance',
    secondaryDomains: ['business', 'billing'],
    confidenceScore: 99.6,
    detectionReason: 'Detected monthly commercial and personal transaction ledger, salary credits, recurring debits, and opening/closing balances.',
    summary: {
      tldr: 'Monthly bank statement for Jan 2026 showing healthy net savings (+₹30,800), but identifies ₹4,350 in unoptimized recurring subscriptions, high food delivery outflow (34%), and an avoidable ₹650 overdraft fee.',
      keyTakeaways: [
        'Total credits of ₹95,000 received with total debit outflows of ₹64,200 (Net Savings Rate: 32.4%).',
        'Top expenditure category was Food & Dining (₹21,800), followed by Utilities & Rent (₹24,500).',
        'Identified 4 active recurring entertainment & software subscriptions totaling ₹4,350/month.',
        'Flagged an avoidable ₹650 overdraft penalty charge billed on Jan 14th.',
        'Average daily balance maintained was ₹42,500, easily exceeding the ₹10,000 minimum requirement.'
      ],
      executiveBrief: 'This personal banking document demonstrates steady cash flow from salaried income. The account holder maintains positive liquidity, but can readily increase their monthly savings by ~₹5,000 to ₹7,500 by trimming unused digital subscriptions and disputing the non-consensual overdraft surcharge.',
      actionChecklist: [
        { id: 'act-1', text: 'Cancel unused Gym & OTT streaming auto-debits (Est. monthly savings: ₹2,100)', priority: 'high', completed: false, category: 'Savings', page: 3 },
        { id: 'act-2', text: 'Submit waiver request for ₹650 Overdraft fee via NetBanking customer desk', priority: 'high', completed: false, category: 'Dispute', page: 2 },
        { id: 'act-3', text: 'Transfer surplus ₹25,000 from savings account to High-Yield Sweep FD (7.15% p.a.)', priority: 'medium', completed: false, category: 'Investment', page: 1 },
        { id: 'act-4', text: 'Set food delivery budget cap of ₹12,000/month to prevent 34% discretionary leakage', priority: 'medium', completed: true, category: 'Budgeting', page: 2 }
      ],
      importantDates: [
        { id: 'dt-fin-1', event: 'Monthly Salary Credit Date', date: '01-Jan-2026', type: 'period', status: 'past', page: 1 },
        { id: 'dt-fin-2', event: 'Rent & Maintenance Auto-Debit', date: '02-Jan-2026', type: 'deadline', status: 'past', page: 1 },
        { id: 'dt-fin-3', event: 'Credit Card Bill Due Date', date: '18-Feb-2026', type: 'deadline', status: 'upcoming', page: 4 }
      ],
      numbersAndMetrics: [
        { id: 'num-fin-1', label: 'Total Inflow (Credits)', value: '₹95,000', category: 'monetary', context: 'Salary + Dividend credits', page: 1 },
        { id: 'num-fin-2', label: 'Total Outflow (Debits)', value: '₹64,200', category: 'monetary', context: '52 total debit transactions', page: 1 },
        { id: 'num-fin-3', label: 'Net Monthly Savings', value: '₹30,800', category: 'monetary', context: '32.4% net savings rate', page: 1 },
        { id: 'num-fin-4', label: 'Unoptimized Recurring Subs', value: '₹4,350 / mo', category: 'monetary', context: 'Digital subscriptions', page: 3 }
      ],
      risksAndConcerns: [
        { id: 'rsk-fin-1', title: 'Non-Consensual Overdraft Surcharge', riskLevel: 'Critical', plainEnglish: '₹650 penalty billed on Jan 14th despite immediate balance rectification within 6 hours.', mitigation: 'Submit dispute request via NetBanking citing RBI fair-practice circular.', page: 2 },
        { id: 'rsk-fin-2', title: 'Zombie Recurring Subscriptions Draining Capital', riskLevel: 'Warning', plainEnglish: '₹4,350/mo (₹52,200/yr) auto-debited across 5 digital streaming and gym memberships with zero recorded check-in.', mitigation: 'Cancel Cult.fit and Adobe to instantly save ₹3,200/mo.', page: 3 }
      ],
      questionsToConsider: [
        'How can I get the ₹650 overdraft fee refunded?',
        'Which subscriptions am I paying for that I am not using?',
        'What is my recommended 50/30/20 budget breakdown based on this income?'
      ]
    },
    metrics: [
      { label: 'Total Inflow (Credits)', value: '₹95,000', change: '+12% vs Dec', status: 'positive', subtext: 'Primary salary + dividend', iconName: 'TrendingUp', page: 1 },
      { label: 'Total Outflow (Debits)', value: '₹64,200', change: '-4% vs Dec', status: 'neutral', subtext: '52 total transactions', iconName: 'CreditCard', page: 1 },
      { label: 'Net Monthly Savings', value: '₹30,800', change: '32.4% rate', status: 'positive', subtext: 'Healthy cushion', iconName: 'PiggyBank', page: 1 },
      { label: 'Identified Savings Potential', value: '₹5,800/mo', change: 'Quick Wins', status: 'warning', subtext: 'From subscriptions & fees', iconName: 'Zap', page: 3 }
    ],
    financeData: {
      totalIncome: 95000,
      totalExpense: 64200,
      netSavings: 30800,
      savingsRate: '32.4%',
      burnRate: '₹2,070 / day',
      categorySpend: [
        { category: 'Rent & Utilities', amount: 24500, percentage: 38.2, color: '#3B82F6' },
        { category: 'Food & Dining (Swiggy/Zomato)', amount: 21800, percentage: 34.0, color: '#F97316' },
        { category: 'Shopping & E-Commerce', amount: 9800, percentage: 15.3, color: '#8B5CF6' },
        { category: 'Digital Subscriptions', amount: 4350, percentage: 6.8, color: '#EC4899' },
        { category: 'Bank Fees & Taxes', amount: 3750, percentage: 5.7, color: '#EF4444' }
      ],
      recurringSubs: [
        { id: 'sub-1', name: 'Netflix Premium 4K', amount: 649, frequency: 'Monthly', status: 'active', lastBilled: '12 Jan 2026', canCancel: true },
        { id: 'sub-2', name: 'Cult.fit Fitness Pass', amount: 1800, frequency: 'Monthly', status: 'infrequent', lastBilled: '05 Jan 2026', canCancel: true },
        { id: 'sub-3', name: 'Adobe Creative Cloud', amount: 1400, frequency: 'Monthly', status: 'flagged', lastBilled: '18 Jan 2026', canCancel: true },
        { id: 'sub-4', name: 'Spotify Individual', amount: 119, frequency: 'Monthly', status: 'active', lastBilled: '21 Jan 2026', canCancel: true },
        { id: 'sub-5', name: 'Amazon Prime Yearly', amount: 382, frequency: 'Monthly eqv', status: 'active', lastBilled: '01 Jan 2026', canCancel: false }
      ],
      savingsTips: [
        { id: 'tip-1', title: 'Audit & Trim 2 Idle Subscriptions', potentialSavings: '₹3,200 / month', description: 'Cancel Cult.fit (₹1,800) and Adobe (₹1,400) which had 0 recorded activity.', action: 'One-click cancel guide & letter template', difficulty: 'easy', impact: 'High' },
        { id: 'tip-2', title: 'Dispute Non-Consensual Overdraft Charge', potentialSavings: '₹650 instant refund', description: 'HDFC debited ₹650 for an intraday balance dip on Jan 14th that was self-corrected within 6 hours.', action: 'Generate Dispute Email Draft', difficulty: 'easy', impact: 'Quick Win' }
      ],
      feesAndPenalties: [
        { id: 'fee-1', feeType: 'Intraday Overdraft Penalty', amount: 650, date: '14 Jan 2026', flaggedReason: 'Intraday dip rectified within 6 hours', disputeEligible: true },
        { id: 'fee-2', feeType: 'SMS Alert Charges (Quarterly)', amount: 59, date: '01 Jan 2026', flaggedReason: 'Mandatory standard charge', disputeEligible: false },
        { id: 'fee-3', feeType: 'ATM Non-Home Branch Surcharge', amount: 47.2, date: '19 Jan 2026', flaggedReason: 'Exceeded 5 free monthly withdrawals', disputeEligible: false }
      ]
    },
    extractedEntities: [
      { category: 'Person', key: 'Account Holder', value: 'Roshan Kumar Verma', page: 1 },
      { category: 'ID/Reference', key: 'Account Number', value: '50100492819281 (HDFC Bank)', page: 1 },
      { category: 'Date', key: 'Statement Period', value: '01-Jan-2026 to 31-Jan-2026', page: 1 },
      { category: 'Amount', key: 'Opening Balance', value: '₹34,500.00', page: 1 },
      { category: 'Amount', key: 'Closing Balance', value: '₹65,300.00', page: 4 },
      { category: 'Organization', key: 'Branch & IFSC', value: 'Koramangala, Bengaluru - HDFC0001024', page: 1 }
    ],
    extractedTables: [
      {
        id: 'tbl-txns',
        tableName: 'Major Transaction Ledger (Top 6 Entries)',
        columns: ['Date', 'Description', 'Type', 'Amount (₹)', 'Balance (₹)'],
        rows: [
          { 'Date': '01-Jan-2026', 'Description': 'SALARY CREDIT - TECHCORP PVT LTD', 'Type': 'Credit', 'Amount (₹)': '90,000', 'Balance (₹)': '124,500' },
          { 'Date': '02-Jan-2026', 'Description': 'RENT TRANSFER - UPI/VINAYAK_OWNER', 'Type': 'Debit', 'Amount (₹)': '22,000', 'Balance (₹)': '102,500' },
          { 'Date': '05-Jan-2026', 'Description': 'CULTFIT AUTOPAY ACH DEBIT', 'Type': 'Debit', 'Amount (₹)': '1,800', 'Balance (₹)': '100,700' },
          { 'Date': '14-Jan-2026', 'Description': 'OVERDRAFT SURCHARGE PENALTY', 'Type': 'Debit', 'Amount (₹)': '650', 'Balance (₹)': '88,400' },
          { 'Date': '18-Jan-2026', 'Description': 'ADOBE SYSTEMS CREATIVE SUB', 'Type': 'Debit', 'Amount (₹)': '1,400', 'Balance (₹)': '82,300' },
          { 'Date': '31-Jan-2026', 'Description': 'MUTUAL FUND SIP - AXIS BLUECHIP', 'Type': 'Debit', 'Amount (₹)': '10,000', 'Balance (₹)': '65,300' }
        ],
        page: 1
      }
    ],
    sampleQuestions: [
      'What are all the avoidable fees and penalties in this statement?',
      'How much did I spend on food delivery and dining out?',
      'List all recurring subscriptions and how much I can save by cancelling idle ones.',
      'What was my total savings rate this month?'
    ],
    chatHistory: [],
    rawText: `HDFC BANK LIMITED - KORAMANGALA BRANCH, BENGALURU
Account Statement for Period: 01-Jan-2026 to 31-Jan-2026
Account Name: Roshan Kumar Verma | Account No: 50100492819281 | IFSC: HDFC0001024
Opening Balance: ₹34,500.00 | Total Credits: ₹95,000.00 | Total Debits: ₹64,200.00 | Closing Balance: ₹65,300.00`,
    pageTexts: [
      {
        page: 1,
        text: `HDFC BANK LIMITED - SAVINGS ACCOUNT STATEMENT\nAccount Holder: Roshan Kumar Verma\nStatement Period: 01-Jan-2026 to 31-Jan-2026\nOpening Balance: ₹34,500 | Total Credits: ₹95,000 | Total Debits: ₹64,200`
      },
      {
        page: 2,
        text: `TRANSACTION LEDGER & PENALTY CHARGES\n14-Jan-2026: Intraday overdraft surcharge ₹650 billed.\nRecurring debits: Cult.fit ₹1,800, Adobe ₹1,400, Netflix ₹649.`
      }
    ]
  },

  // 4. Insurance Policy — sample insurance policy
  {
    id: 'demo-insurance-policy',
    name: 'Comprehensive_Health_Insurance_Policy_Terms.pdf',
    fileSize: '3.1 MB',
    pageCount: 18,
    uploadedAt: 'Sample Library',
    demoCategory: 'Insurance Policy',
    fileFormat: 'PDF',
    iconName: 'ShieldCheck',
    demoDescription: 'Group health policy terms with hospitalization coverage, room rent limits, pre-existing disease waiting, and claim steps.',
    category: 'Insurance policies',
    detectedDomain: 'insurance',
    secondaryDomains: ['medical', 'billing'],
    confidenceScore: 99.5,
    detectionReason: 'Identified sum insured, room rent capping, pre-existing condition waiting periods, excluded procedures, and network hospital claim workflows.',
    summary: {
      tldr: '₹15,00,000 Family Health Insurance Policy with cashless hospitalization across 14,000 network hospitals, 1% room rent cap, and a 24-month pre-existing disease waiting clause.',
      keyTakeaways: [
        'Total Base Sum Insured is ₹15,00,000 with an automatic 100% cumulative bonus restoration after the first claim.',
        'Room Rent is capped at 1% of Sum Insured (₹15,000/day) for normal rooms and 2% for ICU admissions; exceeding this triggers proportionate deduction across entire bill.',
        'Pre-existing diseases (PED) are subject to a mandatory 24-month continuous coverage waiting period before claim eligibility.',
        'Day-care surgeries (over 540 procedures including cataract, dialysis, and chemotherapy) are fully covered without requiring 24-hour hospitalization.',
        'Cosmetic treatments, experimental treatments, and non-medical consumables (PPE kits, gloves) are strictly excluded.'
      ],
      executiveBrief: 'Comprehensive family floater policy offering strong inpatient coverage. Crucial advisory for policyholders is staying within the 1% room rent sub-limit to prevent proportionate deductions on doctor consultations and surgical procedures.',
      actionChecklist: [
        { id: 'act-ins-1', text: 'Opt strictly for Single Standard AC room (under ₹15,000/day) to prevent proportionate deductions', priority: 'high', completed: false, category: 'Room Rent', page: 4 },
        { id: 'act-ins-2', text: 'Notify TPA desk within 24 hours of emergency hospitalization for cashless approval', priority: 'high', completed: false, category: 'Cashless', page: 7 },
        { id: 'act-ins-3', text: 'Download e-Health Card and save nearest network hospital emergency contact', priority: 'medium', completed: true, category: 'Readiness', page: 1 }
      ],
      importantDates: [
        { id: 'dt-ins-1', event: 'Policy Inception Date', date: '15-Mar-2025', type: 'effective', status: 'past', page: 1 },
        { id: 'dt-ins-2', event: 'Next Annual Renewal Due', date: '14-Mar-2026', type: 'deadline', status: 'upcoming', page: 1 },
        { id: 'dt-ins-3', event: 'PED 24-Month Waiting Period Maturity', date: '15-Mar-2027', type: 'milestone', status: 'upcoming', page: 5 }
      ],
      numbersAndMetrics: [
        { id: 'num-ins-1', label: 'Base Sum Insured', value: '₹15,00,000', category: 'monetary', context: 'Family floater limit', page: 1 },
        { id: 'num-ins-2', label: 'Room Rent Sub-Limit', value: '1% (₹15,000/day)', category: 'percentage', context: 'Single Standard AC Room', page: 4 },
        { id: 'num-ins-3', label: 'PED Waiting Period', value: '24 Months', category: 'count', context: 'Continuous policy tenure', page: 5 },
        { id: 'num-ins-4', label: 'Pre/Post Hospitalization Days', value: '60 / 90 Days', category: 'count', context: 'Outpatient diagnostic coverage', page: 6 }
      ],
      risksAndConcerns: [
        { id: 'rsk-ins-1', title: 'Proportionate Deduction Risk on Room Rent', riskLevel: 'Critical', plainEnglish: 'Selecting a deluxe room at ₹18,000/day penalizes you by proportionately reducing doctor fees, surgery charges, and nursing costs by 16.7%.', mitigation: 'Strictly insist on a standard private AC room within the ₹15,000/day threshold.', page: 4 },
        { id: 'rsk-ins-2', title: 'Non-Medical Consumables Out-of-Pocket Expense', riskLevel: 'Caution', plainEnglish: 'IRDAI non-payable list excludes ~10% of typical hospital invoice items (syringes, gloves, administrative charges).', mitigation: 'Add Non-Medical Expenses waiver rider during annual policy renewal.', page: 9 }
      ],
      questionsToConsider: [
        'What happens if my hospitalization bill exceeds the ₹15 Lakh sum insured?',
        'Are pre-existing conditions like diabetes or hypertension covered immediately?',
        'How many days before and after hospitalization are medical bills covered?'
      ]
    },
    metrics: [
      { label: 'Sum Insured', value: '₹15,00,000', change: '100% Restore', status: 'positive', subtext: 'Floater coverage', iconName: 'Shield', page: 1 },
      { label: 'Room Rent Cap', value: '₹15,000/day', change: '1% Limit', status: 'warning', subtext: 'Single AC standard', iconName: 'Home', page: 4 },
      { label: 'PED Waiting Period', value: '24 Mo', change: 'Remaining: 12 Mo', status: 'neutral', subtext: 'Pre-existing illnesses', iconName: 'Clock', page: 5 },
      { label: 'Network Hospitals', value: '14,000+', change: 'Cashless TPA', status: 'positive', subtext: 'Pan-India network', iconName: 'PlusCircle', page: 7 }
    ],
    insuranceData: {
      policyType: 'Comprehensive Family Floater Health Insurance',
      sumInsured: '₹15,00,000',
      deductible: '₹0 (Zero Deductible)',
      copay: '0% (No copay for network hospitals)',
      waitingPeriod: '24 Months for Pre-Existing Diseases (PED); 30 days initial waiting period',
      coveredItems: [
        { id: 'cov-1', item: 'Inpatient Hospitalization', limit: 'Up to ₹15,00,000', status: 'Covered', clauseRef: 'Clause 2.1' },
        { id: 'cov-2', item: 'Day Care Surgeries (540+ procedures)', limit: 'Full Sum Insured', status: 'Covered', clauseRef: 'Clause 2.4' },
        { id: 'cov-3', item: 'Pre-Hospitalization Expenses', limit: '60 Days preceding admission', status: 'Covered', clauseRef: 'Clause 2.7' },
        { id: 'cov-4', item: 'Post-Hospitalization Expenses', limit: '90 Days following discharge', status: 'Covered', clauseRef: 'Clause 2.8' },
        { id: 'cov-5', item: 'Road Ambulance Services', limit: '₹3,500 per hospitalization', status: 'Covered', clauseRef: 'Clause 2.9' }
      ],
      excludedItems: [
        { id: 'exc-1', item: 'Cosmetic or Aesthetic Surgeries', reason: 'Non-therapeutic procedures excluded under IRDAI guidelines', clauseRef: 'Clause 4.1' },
        { id: 'exc-2', item: 'Experimental & Unproven Treatments', reason: 'Stem cell therapies or clinical trials not approved', clauseRef: 'Clause 4.5' },
        { id: 'exc-3', item: 'Non-Medical Consumables', reason: 'Gloves, PPE suits, administrative sanitization charges', clauseRef: 'Clause 4.9' }
      ],
      claimChecklist: [
        { step: 1, title: 'Network Hospital Intimation', description: 'Present e-Card at hospital insurance desk 48 hours before planned admission or within 24 hours of emergency.', docsNeeded: ['Policy Schedule', 'Govt Photo ID', 'Physician Referral'] },
        { step: 2, title: 'Pre-Authorization Request', description: 'Hospital TPA transmits treatment estimate for initial cashless sanction.', docsNeeded: ['Form Part A & B', 'Clinical Notes', 'Diagnostic Reports'] },
        { step: 3, title: 'Final Discharge Settlement', description: 'TPA settles verified hospital bill directly with hospital.', docsNeeded: ['Discharge Summary', 'Itemized Pharmacy Bills'] }
      ]
    },
    extractedEntities: [
      { category: 'Organization', key: 'Insurer', value: 'Star Health and Allied Insurance Co. Ltd.', page: 1 },
      { category: 'Person', key: 'Primary Insured', value: 'Roshan Kumar Verma', page: 1 },
      { category: 'ID/Reference', key: 'Policy Number', value: 'P/019283/01/2026/009182', page: 1 },
      { category: 'Amount', key: 'Annual Premium Paid', value: '₹24,850 INR (Incl. 18% GST)', page: 1 },
      { category: 'Amount', key: 'Base Sum Insured', value: '₹15,00,000 INR', page: 1 }
    ],
    extractedTables: [
      {
        id: 'tbl-ins-coverage',
        tableName: 'Inpatient Room Category & Proportionate Deduction Limits',
        columns: ['Room Category', 'Eligible Daily Cap', 'Deduction Status', 'Recommended Action'],
        rows: [
          { 'Room Category': 'Single Standard AC', 'Eligible Daily Cap': '₹15,000 (1%)', 'Deduction Status': '100% Reimbursed', 'Recommended Action': 'Always Select' },
          { 'Room Category': 'Deluxe / Suite AC', 'Eligible Daily Cap': '₹22,000', 'Deduction Status': 'Proportionate Cut (~32%)', 'Recommended Action': 'Avoid' },
          { 'Room Category': 'Intensive Care Unit (ICU)', 'Eligible Daily Cap': '₹30,000 (2%)', 'Deduction Status': '100% Reimbursed', 'Recommended Action': 'Covered' }
        ],
        page: 4
      }
    ],
    sampleQuestions: [
      'What is the room rent limit and how does proportionate deduction work?',
      'How long is the pre-existing disease waiting period?',
      'What documents are required to initiate a cashless hospitalization claim?',
      'Are outpatient consultations and prescription medicines covered?'
    ],
    chatHistory: [],
    rawText: `STAR HEALTH AND ALLIED INSURANCE COMPANY LIMITED
Policy Schedule: Star Comprehensive Insurance Policy (Family Floater)
Policyholder: Roshan Kumar Verma | Policy No: P/019283/01/2026/009182
Period of Insurance: 15-Mar-2025 to 14-Mar-2026
Sum Insured: ₹15,00,000/- (Rupees Fifteen Lakhs Only)
Key Policy Provisions:
- Room Rent: Capped at 1% of Sum Insured per day for Standard AC Room.
- Pre-Existing Diseases: 24-month waiting period from continuous coverage.
- Cashless Network: 14,000+ approved hospitals nationwide.`,
    pageTexts: [
      {
        page: 1,
        text: `STAR HEALTH INSURANCE - COMPREHENSIVE FAMILY FLOATER POLICY\nSum Insured: ₹15,00,000 INR\nPolicy Period: 15-Mar-2025 to 14-Mar-2026\nAnnual Premium: ₹24,850 INR`
      },
      {
        page: 2,
        text: `SECTION 4: WAITING PERIODS AND ROOM RENT SUB-LIMITS\nStandard AC Room capped at 1% (₹15,000/day).\nPre-existing disease waiting period is 24 months.`
      }
    ]
  },

  // 5. Government Notification — official-style notification
  {
    id: 'demo-government-notification',
    name: 'Ministry_of_Finance_Statutory_Gazette_Notification.pdf',
    fileSize: '1.2 MB',
    pageCount: 5,
    uploadedAt: 'Sample Library',
    demoCategory: 'Government Notification',
    fileFormat: 'PDF',
    iconName: 'Landmark',
    demoDescription: 'Official statutory gazette notification mandating updated corporate tax filing timelines, compliance audits, and penalty provisions.',
    category: 'Government notifications',
    detectedDomain: 'government',
    secondaryDomains: ['legal', 'finance'],
    confidenceScore: 99.7,
    detectionReason: 'Identified statutory authority gazette issuance, filing deadlines, non-compliance penal provisions, and applicability criteria for corporate entities.',
    summary: {
      tldr: 'Statutory notification from the Ministry of Finance mandating electronic filing of annual transfer pricing audit reports (Form 3CEB) and revised quarterly withholding tax returns by October 31, 2026.',
      keyTakeaways: [
        'Issued by the Department of Revenue, Ministry of Finance, under statutory powers conferred by Section 295 of the Income Tax Act.',
        'Extends the statutory deadline for corporate transfer pricing filings (Form 3CEB) from Sept 30 to Oct 31, 2026, without late fees.',
        'Requires all corporate entities with international transactions exceeding ₹1 crore to submit digital audit trails authenticated by certified Chartered Accountants.',
        'Mandates strict penalties of ₹1,00,000 for delayed filing under Section 271BA, plus 1% per month interest on unremitted tax withholdings.',
        'Institutes mandatory digital signature verification (DSC Class III) for all statutory filings submitted via the unified e-filing portal.'
      ],
      executiveBrief: 'Crucial regulatory compliance gazette offering a 31-day filing extension for corporate audit reports. Financial controllers and tax directors must schedule independent audit sign-offs before October 20 to avoid portal congestion and statutory default penalties.',
      actionChecklist: [
        { id: 'act-gov-1', text: 'Engage external audit firm to finalize transfer pricing study before Oct 15', priority: 'high', completed: false, category: 'Audit', page: 2 },
        { id: 'act-gov-2', text: 'Renew corporate DSC Class III tokens for authorized signatories on the portal', priority: 'high', completed: true, category: 'Authentication', page: 3 },
        { id: 'act-gov-3', text: 'Reconcile Q2 withholding tax deductions with bank Challan 281 receipts', priority: 'medium', completed: false, category: 'Reconciliation', page: 4 }
      ],
      importantDates: [
        { id: 'dt-gov-1', event: 'Notification Gazette Date of Issue', date: '15-Aug-2026', type: 'effective', status: 'past', page: 1 },
        { id: 'dt-gov-2', event: 'Extended Transfer Pricing Filing Deadline', date: '31-Oct-2026', type: 'deadline', status: 'upcoming', page: 2 },
        { id: 'dt-gov-3', event: 'Corporate Income Tax Return Filing Deadline', date: '30-Nov-2026', type: 'filing', status: 'upcoming', page: 3 }
      ],
      numbersAndMetrics: [
        { id: 'num-gov-1', label: 'Statutory Penalty for Late Form 3CEB', value: '₹1,00,000', category: 'monetary', context: 'Section 271BA penalty', page: 2 },
        { id: 'num-gov-2', label: 'International Transaction Threshold', value: '₹1,00,00,000', category: 'monetary', context: 'Audit trigger limit', page: 2 },
        { id: 'num-gov-3', label: 'Default Interest Rate on Unremitted TDS', value: '1.0% / month', category: 'percentage', context: 'Section 201(1A)', page: 4 }
      ],
      risksAndConcerns: [
        { id: 'rsk-gov-1', title: 'Automatic Disallowance of Expenses Under Section 40(a)(ia)', riskLevel: 'Critical', plainEnglish: 'Failure to deposit withholding taxes by the specified timeline leads to a 30% disallowance of domestic vendor expenditure.', mitigation: 'Deposit all outstanding September and October TDS obligations on or before the 7th of the following month.', page: 4 }
      ],
      questionsToConsider: [
        'Does the deadline extension apply to domestic transfer pricing transactions?',
        'What are the documentation retention requirements for international transfer pricing studies?',
        'How does non-compliance affect corporate tax assessment timelines?'
      ]
    },
    metrics: [
      { label: 'Extended Deadline', value: '31-Oct-2026', change: '+31 Days', status: 'positive', subtext: 'Form 3CEB Audit', iconName: 'Calendar', page: 2 },
      { label: 'Statutory Penalty', value: '₹1,00,000', change: 'Mandatory', status: 'negative', subtext: 'Sec 271BA default', iconName: 'AlertCircle', page: 2 },
      { label: 'Threshold Limit', value: '₹1 Crore', change: 'Cross-border', status: 'neutral', subtext: 'Mandatory audit', iconName: 'DollarSign', page: 2 },
      { label: 'DSC Requirement', value: 'Class III', change: 'Mandatory', status: 'warning', subtext: 'Digital Signature', iconName: 'Key', page: 3 }
    ],
    governmentData: {
      issuingAuthority: 'Ministry of Finance, Department of Revenue, Central Board of Direct Taxes',
      documentType: 'Statutory Gazette Notification (Extraordinary)',
      scopeAndApplicability: 'All corporate entities with specified cross-border or domestic related-party transactions',
      effectiveDate: '15-Aug-2026',
      complianceDeadlines: [
        '31-Oct-2026: Filing of Accountant Report under Section 92E (Form 3CEB)',
        '30-Nov-2026: Filing of Corporate Income Tax Return (ITR-6)'
      ],
      regulationsOrRules: [
        { section: 'Section 92E', title: 'Accountant Report Filing', requirement: 'Mandatory submission of Form 3CEB signed by certified CA' },
        { section: 'Section 271BA', title: 'Penalty for Default', requirement: 'Statutory penalty of ₹1,00,000 for delayed compliance' }
      ],
      penaltiesForNonCompliance: '₹1,00,000 penalty under Section 271BA plus 1% monthly interest on unremitted tax withholdings.',
      submissionRequirements: [
        'Digital Signature Certificate (Class III) authentication',
        'Verified independent auditor certification',
        'E-filing portal upload'
      ]
    },
    extractedEntities: [
      { category: 'Organization', key: 'Issuing Ministry', value: 'Ministry of Finance, Government of India', page: 1 },
      { category: 'ID/Reference', key: 'Notification Reference', value: 'Notification No. 74/2026/F. No. 370142/28/2026-TPL', page: 1 },
      { category: 'Date', key: 'Gazette Publication Date', value: '15-Aug-2026', page: 1 },
      { category: 'Amount', key: 'Late Filing Fine', value: '₹1,00,000 INR', page: 2 }
    ],
    extractedTables: [
      {
        id: 'tbl-gov-deadlines',
        tableName: 'Statutory Corporate Compliance Filings Calendar',
        columns: ['Compliance Item', 'Original Due Date', 'Extended Due Date', 'Statutory Section'],
        rows: [
          { 'Compliance Item': 'Transfer Pricing Audit (Form 3CEB)', 'Original Due Date': '30-Sep-2026', 'Extended Due Date': '31-Oct-2026', 'Statutory Section': 'Section 92E' },
          { 'Compliance Item': 'Corporate Tax Return (ITR-6)', 'Original Due Date': '31-Oct-2026', 'Extended Due Date': '30-Nov-2026', 'Statutory Section': 'Section 139(1)' },
          { 'Compliance Item': 'Q2 TDS Statement (Form 26Q)', 'Original Due Date': '31-Oct-2026', 'Extended Due Date': '31-Oct-2026', 'Statutory Section': 'Section 200(3)' }
        ],
        page: 2
      }
    ],
    sampleQuestions: [
      'What is the extended filing deadline for Form 3CEB transfer pricing reports?',
      'What are the penalties imposed for non-compliance under Section 271BA?',
      'Which corporate entities fall under the scope of this statutory notification?',
      'What digital authentication standard is required for submission?'
    ],
    chatHistory: [],
    rawText: `THE GAZETTE OF INDIA: EXTRAORDINARY [PART II - SEC. 3(ii)]
MINISTRY OF FINANCE (Department of Revenue)
Central Board of Direct Taxes, New Delhi
NOTIFICATION No. 74/2026, Dated 15th August, 2026
S.O. 3412(E).- In exercise of the powers conferred by Section 295 of the Income-tax Act, 1961:
1. The Central Board of Direct Taxes hereby extends the due date for furnishing of Report of Audit under Section 92E of the Act for Assessment Year 2026-27 from 30th September 2026 to 31st October 2026.
2. Failure to furnish the report within the specified period attracts penalty under Section 271BA of ₹1,00,000.`,
    pageTexts: [
      {
        page: 1,
        text: `THE GAZETTE OF INDIA: EXTRAORDINARY\nMINISTRY OF FINANCE - DEPARTMENT OF REVENUE\nNOTIFICATION No. 74/2026\nExtension of statutory filing timelines for Assessment Year 2026-27.`
      },
      {
        page: 2,
        text: `SECTION 2: EXTENDED TIMELINES AND PENALTY SCHEDULE\nForm 3CEB extended to October 31, 2026.\nStatutory penalty under Section 271BA: ₹1,00,000.`
      }
    ]
  },

  // 6. Academic / Research Paper — sample research document
  {
    id: 'demo-academic-paper',
    name: 'Multi-Head_Attention_Mechanisms_Research_Paper.pdf',
    fileSize: '2.8 MB',
    pageCount: 12,
    uploadedAt: 'Sample Library',
    demoCategory: 'Academic / Research Paper',
    fileFormat: 'PDF',
    iconName: 'BookOpen',
    demoDescription: 'Peer-reviewed deep learning paper on transformer self-attention architectures, BLEU evaluation benchmarks, and training bounds.',
    category: 'Academic / research documents',
    detectedDomain: 'academic',
    secondaryDomains: ['technical', 'overall'],
    confidenceScore: 99.9,
    detectionReason: 'Identified academic research methodology, mathematical formulation of scaled dot-product attention, translation benchmarks, and ablation experiments.',
    summary: {
      tldr: 'Seminal deep learning paper proposing the Transformer architecture, replacing recurrent and convolutional neural networks entirely with Multi-Head Self-Attention mechanisms.',
      keyTakeaways: [
        'Proposes the Transformer network architecture, relying exclusively on self-attention mechanisms to draw global dependencies between input and output tokens.',
        'Scaled Dot-Product Attention introduces a scaling factor of 1/√d_k to prevent gradient vanishing in large dimensionality softmax operations.',
        'Multi-Head Attention projects queries, keys, and values into h=8 parallel subspaces, allowing the model to jointly attend to information from different representation spaces.',
        'Achieved state-of-the-art BLEU score of 28.4 on WMT 2014 English-to-German translation, establishing a 2.0 BLEU improvement over existing ensembles.',
        'Drastically reduced training time to 3.5 days on 8 NVIDIA P100 GPUs, achieving superior compute efficiency compared to recurrent networks.'
      ],
      executiveBrief: 'Fundamental machine learning milestone paper establishing the Transformer architecture foundational to modern LLMs. Highlights include scaled attention equations, positional encoding rationale, and empirical cross-lingual machine translation dominance.',
      actionChecklist: [
        { id: 'act-aca-1', text: 'Implement Multi-Head Attention layer with 8 projection heads and d_model=512', priority: 'high', completed: true, category: 'Architecture', page: 4 },
        { id: 'act-aca-2', text: 'Validate sinusoidal positional encoding against learned embeddings', priority: 'medium', completed: false, category: 'Ablation', page: 6 },
        { id: 'act-aca-3', text: 'Benchmark cross-entropy loss convergence across 100k training steps', priority: 'medium', completed: true, category: 'Training', page: 9 }
      ],
      importantDates: [
        { id: 'dt-aca-1', event: 'Paper Submission Date', date: '12-Jun-2017', type: 'effective', status: 'past', page: 1 },
        { id: 'dt-aca-2', event: 'NeurIPS Conference Acceptance', date: '04-Dec-2017', type: 'milestone', status: 'past', page: 1 }
      ],
      numbersAndMetrics: [
        { id: 'num-aca-1', label: 'WMT 2014 En-De BLEU Score', value: '28.4', category: 'score', context: 'Big Model ensemble', page: 8 },
        { id: 'num-aca-2', label: 'Model Dimension (d_model)', value: '512', category: 'measurement', context: 'Base model architecture', page: 3 },
        { id: 'num-aca-3', label: 'Parallel Attention Heads (h)', value: '8 Heads', category: 'count', context: 'Subspace projections', page: 4 },
        { id: 'num-aca-4', label: 'Training Compute Time', value: '3.5 Days', category: 'measurement', context: '8 x P100 GPUs', page: 8 }
      ],
      risksAndConcerns: [
        { id: 'rsk-aca-1', title: 'Quadratic Computational Complexity O(N^2)', riskLevel: 'Warning', plainEnglish: 'Self-attention scales quadratically with sequence length N, creating memory bottlenecks for ultra-long context windows.', mitigation: 'Utilize sparse attention, flash-attention tiling, or linear attention approximations.', page: 10 }
      ],
      questionsToConsider: [
        'Why is the scaling factor of 1/√d_k necessary in dot-product attention?',
        'How does sinusoidal positional encoding allow the model to generalize to sequence lengths unseen during training?',
        'What are the key architectural differences between base and big transformer configurations?'
      ]
    },
    metrics: [
      { label: 'WMT 2014 En-De', value: '28.4 BLEU', change: '+2.0 BLEU', status: 'positive', subtext: 'State-of-the-Art', iconName: 'Award', page: 8 },
      { label: 'Attention Heads', value: 'h = 8', change: 'd_k = 64', status: 'neutral', subtext: 'Multi-head projections', iconName: 'Layers', page: 4 },
      { label: 'Embedding Dimension', value: 'd_model = 512', change: 'FeedForward: 2048', status: 'neutral', subtext: 'Base configuration', iconName: 'Cpu', page: 3 },
      { label: 'Training Time', value: '3.5 Days', change: '-70% Compute', status: 'positive', subtext: '8x P100 GPUs', iconName: 'Zap', page: 8 }
    ],
    academicData: {
      researchQuestion: 'Can neural sequence transduction models rely entirely on self-attention without recurrent or convolutional layers?',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
      institution: 'Google Brain / Google Research',
      methodology: 'Feed-forward sequence transduction architecture using stacked self-attention and point-wise fully connected layers in both encoder and decoder.',
      datasetOrSample: 'WMT 2014 English-German (4.5M sentence pairs) and WMT 2014 English-French (36M sentence pairs).',
      keyFindings: [
        'Attention-only models outperform recurrent networks on machine translation tasks while being significantly more parallelizable.',
        'Multi-Head Attention enables simultaneous attend-to-context across different syntactic and semantic positions.',
        'Positional encodings provide crucial relative order information without recurrent step serialization.'
      ],
      limitations: [
        'Memory consumption scales quadratically with sequence length due to the full attention matrix calculation.',
        'Requires large batch sizes (25k tokens per batch) and specialized learning rate schedules with warmup steps.'
      ],
      conclusions: 'The Transformer is the first sequence transduction model relying entirely on self-attention, establishing a new state of the art in machine translation.',
      keyReferences: [
        'Bahdanau et al. (2014) - Neural Machine Translation by Jointly Learning to Align and Translate',
        'Hochreiter & Schmidhuber (1997) - Long Short-Term Memory'
      ]
    },
    extractedEntities: [
      { category: 'Organization', key: 'Research Group', value: 'Google Brain & Google Research', page: 1 },
      { category: 'Concept', key: 'Core Mechanism', value: 'Multi-Head Self-Attention', page: 3 },
      { category: 'Component', key: 'Equation', value: 'Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V', page: 4 },
      { category: 'Amount', key: 'Encoder/Decoder Layers', value: 'N = 6 identical layers', page: 3 }
    ],
    extractedTables: [
      {
        id: 'tbl-aca-bleu',
        tableName: 'Translation Quality (BLEU) and Training Cost Comparison',
        columns: ['Model Architecture', 'BLEU (En-De)', 'BLEU (En-Fr)', 'Training FLOPs'],
        rows: [
          { 'Model Architecture': 'ByteNet (Kalchbrenner et al.)', 'BLEU (En-De)': '23.75', 'BLEU (En-Fr)': '-', 'Training FLOPs': '1.0e19' },
          { 'Model Architecture': 'Deep-Att + PosUnk (Gehring et al.)', 'BLEU (En-De)': '24.60', 'BLEU (En-Fr)': '39.92', 'Training FLOPs': '2.3e19' },
          { 'Model Architecture': 'Transformer (Base Model)', 'BLEU (En-De)': '27.30', 'BLEU (En-Fr)': '38.10', 'Training FLOPs': '3.3e18' },
          { 'Model Architecture': 'Transformer (Big Model)', 'BLEU (En-De)': '28.40', 'BLEU (En-Fr)': '41.80', 'Training FLOPs': '2.3e19' }
        ],
        page: 8
      }
    ],
    sampleQuestions: [
      'What is the formula for Scaled Dot-Product Attention and why is it divided by sqrt(d_k)?',
      'How does Multi-Head Attention differ from single-head attention?',
      'What BLEU score did the big Transformer achieve on WMT 2014 English-to-German?',
      'Why does the Transformer train faster than recurrent neural network models?'
    ],
    chatHistory: [],
    rawText: `ATTENTION IS ALL YOU NEED
Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin
Google Brain, Google Research, University of Toronto
Abstract: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.
On two machine translation tasks, the Transformer generalizes well and achieves 28.4 BLEU on English-to-German and 41.8 BLEU on English-to-French.`,
    pageTexts: [
      {
        page: 1,
        text: `ATTENTION IS ALL YOU NEED\nAshish Vaswani et al. - Google Brain\nAbstract: We propose the Transformer, relying entirely on an attention mechanism.`
      },
      {
        page: 2,
        text: `SECTION 3: ARCHITECTURAL DESIGN\nScaled Dot-Product Attention: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V.\nMulti-Head Attention projects queries, keys, and values h=8 times.`
      }
    ]
  },

  // 7. Terms & Conditions — sample website/service terms
  {
    id: 'demo-terms-conditions',
    name: 'Enterprise_Cloud_Platform_Terms_and_Conditions.docx',
    fileSize: '1.6 MB',
    pageCount: 9,
    uploadedAt: 'Sample Library',
    demoCategory: 'Terms & Conditions',
    fileFormat: 'DOCX',
    iconName: 'FileText',
    demoDescription: 'Enterprise SaaS terms and conditions specifying acceptable use, service level agreements (SLAs), arbitration, and limitation of liability.',
    category: 'Terms & conditions',
    detectedDomain: 'legal',
    secondaryDomains: ['technical', 'business'],
    confidenceScore: 99.6,
    detectionReason: 'Identified software-as-a-service terms, user obligations, acceptable use policy, limitation of liability caps, and mandatory arbitration clauses.',
    summary: {
      tldr: 'Enterprise Cloud Terms & Conditions governing multi-tenant SaaS software access, establishing a 99.9% uptime SLA, customer data ownership, and a 12-month trailing fee liability cap.',
      keyTakeaways: [
        'Customer retains exclusive intellectual property rights and ownership over all uploaded Customer Data and AI query inputs.',
        'Provider commits to 99.9% monthly service availability, with tiered service credits of 10% to 25% for verified unplanned downtime.',
        'Acceptable Use Policy strictly prohibits reverse-engineering, benchmarking publication without consent, and high-risk life support deployments.',
        'Aggregate liability for direct damages is capped at the total subscription fees paid by customer in the preceding 12-month period.',
        'Mandatory binding individual arbitration in Dover, Delaware, with explicit waiver of class-action litigation rights.'
      ],
      executiveBrief: 'Standard enterprise B2B cloud terms with balanced IP protection. Procurement reviewers should verify that the 12-month liability cap contains carve-outs for provider gross negligence, confidentiality breaches, and data privacy indemnification.',
      actionChecklist: [
        { id: 'act-tc-1', text: 'Confirm enterprise SLA includes 25% credit for downtime exceeding 4 hours in a calendar month', priority: 'high', completed: true, category: 'SLA', page: 3 },
        { id: 'act-tc-2', text: 'Carve out mutual confidentiality and data breach from the 12-month liability limitation', priority: 'high', completed: false, category: 'Liability', page: 6 },
        { id: 'act-tc-3', text: 'Ensure customer data deletion within 30 days of subscription termination', priority: 'medium', completed: false, category: 'Data Retention', page: 7 }
      ],
      importantDates: [
        { id: 'dt-tc-1', event: 'Terms Last Updated Date', date: '01-Jan-2026', type: 'effective', status: 'past', page: 1 },
        { id: 'dt-tc-2', event: 'Post-Termination Data Deletion Window', date: '30 Days Post-Expiry', type: 'deadline', status: 'normal', page: 7 }
      ],
      numbersAndMetrics: [
        { id: 'num-tc-1', label: 'Uptime Service Level Target', value: '99.9%', category: 'percentage', context: 'Excluding scheduled maintenance', page: 3 },
        { id: 'num-tc-2', label: 'Liability Limitation Cap', value: '12 Months Fees', category: 'monetary', context: 'Trailing subscription spend', page: 6 },
        { id: 'num-tc-3', label: 'Data Retrieval Period on Exit', value: '30 Days', category: 'count', context: 'Machine-readable export', page: 7 }
      ],
      risksAndConcerns: [
        { id: 'rsk-tc-1', title: 'Sole Remedy Limitation for Outages', riskLevel: 'Warning', plainEnglish: 'Section 4.3 states service credits are the sole and exclusive financial remedy for cloud outages, disallowing damages for lost customer business.', mitigation: 'Negotiate enterprise mission-critical addendum if software powers customer-facing production transactions.', page: 4 },
        { id: 'rsk-tc-2', title: 'Broad Pre-Dispute Arbitration and Class Action Waiver', riskLevel: 'Caution', plainEnglish: 'Disputes must be submitted to private AAA arbitration in Delaware, waiving court and jury trial rights.', mitigation: 'Standard enterprise practice; ensure reciprocal governing law alignment.', page: 8 }
      ],
      questionsToConsider: [
        'Who owns the intellectual property of AI outputs generated using customer uploaded documents?',
        'What service credits are awarded if monthly uptime drops below 99.0%?',
        'How much advance notice is required before provider can modify pricing or service terms?'
      ]
    },
    metrics: [
      { label: 'Uptime Commitment', value: '99.9%', change: 'Tiered Credits', status: 'positive', subtext: 'Monthly SLA', iconName: 'CheckCircle', page: 3 },
      { label: 'Liability Ceiling', value: '12 Months', change: 'Fee Cap', status: 'warning', subtext: 'Trailing spend', iconName: 'Shield', page: 6 },
      { label: 'Data Retention', value: '30 Days', change: 'Zero Scraping', status: 'positive', subtext: 'Customer owned', iconName: 'Database', page: 7 },
      { label: 'Dispute Venue', value: 'Delaware', change: 'Arbitration', status: 'neutral', subtext: 'AAA Rules', iconName: 'Gavel', page: 8 }
    ],
    legalData: {
      contractType: 'Master Software as a Service Terms & Conditions',
      parties: ['Nexora Cloud Systems Inc. (Provider)', 'Enterprise Subscriber (Customer)'],
      effectiveDate: '01-Jan-2026',
      duration: 'Annual auto-renewing subscription',
      riskScore: 'Medium',
      riskyClauses: [
        { id: 'cl-tc-1', clause: 'Section 8.2: Aggregate Direct Liability Limitation', page: 6, riskLevel: 'Warning', plainEnglish: 'Provider liability capped at trailing 12 months subscription fees.', mitigation: 'Insert mutual carve-out for indemnification obligations and willful misconduct.' }
      ],
      obligations: [
        { id: 'ob-tc-1', party: 'Provider', obligation: 'Maintain 99.9% uptime and safeguard customer data with AES-256 encryption', deadline: 'Continuous', page: 3 },
        { id: 'ob-tc-2', party: 'Customer', obligation: 'Comply with Acceptable Use Policy and prevent credential sharing', deadline: 'Continuous', page: 2 }
      ],
      terminationTerms: '30 days written notice prior to annual renewal.'
    },
    extractedEntities: [
      { category: 'Organization', key: 'Service Provider', value: 'Nexora Cloud Systems Inc.', page: 1 },
      { category: 'Concept', key: 'Governing Law', value: 'State of Delaware, United States', page: 8 },
      { category: 'Amount', key: 'Maximum SLA Credit', value: '25% of Monthly Subscription', page: 3 },
      { category: 'Requirement', key: 'Security Standard', value: 'SOC 2 Type II and ISO 27001', page: 5 }
    ],
    extractedTables: [
      {
        id: 'tbl-tc-sla',
        tableName: 'Monthly Uptime Percentage and Service Credit Schedule',
        columns: ['Monthly Availability', 'Service Credit Percentage', 'Customer Notice Window'],
        rows: [
          { 'Monthly Availability': '99.5% to < 99.9%', 'Service Credit Percentage': '10% of monthly fee', 'Customer Notice Window': '15 days post month-end' },
          { 'Monthly Availability': '99.0% to < 99.5%', 'Service Credit Percentage': '15% of monthly fee', 'Customer Notice Window': '15 days post month-end' },
          { 'Monthly Availability': '< 99.0%', 'Service Credit Percentage': '25% of monthly fee', 'Customer Notice Window': '15 days post month-end' }
        ],
        page: 3
      }
    ],
    sampleQuestions: [
      'What are the service credit remedies for cloud platform downtime?',
      'How does the agreement protect customer data ownership and privacy?',
      'What is the aggregate liability cap specified in Section 8?',
      'What restrictions are defined in the Acceptable Use Policy?'
    ],
    chatHistory: [],
    rawText: `NEXORA ENTERPRISE CLOUD PLATFORM TERMS AND CONDITIONS
Effective Date: January 1, 2026
1. Grant of License and Service Access: Provider grants Customer a non-exclusive, non-transferable right to access and use the Platform.
2. Customer Data Ownership: Customer retains all right, title, and interest in and to Customer Data. Provider shall not use Customer Data to train foundation models without explicit authorization.
3. Service Level Agreement: 99.9% monthly availability commitment with tiered service credits.
4. Limitation of Liability: Direct damages capped at total fees paid in the twelve (12) months preceding the incident.`,
    pageTexts: [
      {
        page: 1,
        text: `NEXORA ENTERPRISE CLOUD TERMS AND CONDITIONS\nCustomer Data Ownership: 100% customer owned.\nUptime SLA: 99.9% availability.`
      },
      {
        page: 2,
        text: `SECTION 8: LIMITATION OF LIABILITY & ARBITRATION\nLiability capped at 12 months subscription fees.\nDisputes subject to AAA binding arbitration in Delaware.`
      }
    ]
  },

  // 8. Regulatory Document — sample compliance/regulatory document
  {
    id: 'demo-regulatory-document',
    name: 'Enterprise_GDPR_and_SOC2_Regulatory_Compliance_Framework.docx',
    fileSize: '2.0 MB',
    pageCount: 11,
    uploadedAt: 'Sample Library',
    demoCategory: 'Regulatory Document',
    fileFormat: 'DOCX',
    iconName: 'ShieldAlert',
    demoDescription: 'Regulatory compliance framework detailing GDPR data controller obligations, SOC2 Type II trust principles, and incident disclosure protocols.',
    category: 'Regulatory documents',
    detectedDomain: 'government',
    secondaryDomains: ['legal', 'technical'],
    confidenceScore: 99.8,
    detectionReason: 'Identified European Union GDPR data processor covenants, SOC2 Type II trust security criteria, 72-hour breach disclosure mandates, and audit trails.',
    summary: {
      tldr: 'Comprehensive enterprise compliance architecture aligning cloud operations with GDPR Article 28 data processor obligations, SOC2 Type II security principles, and ISO 27001 data residency controls.',
      keyTakeaways: [
        'Mandates strict 72-hour regulatory notification timeline following confirmed detection of personal data security breaches under GDPR Article 33.',
        'Establishes cross-border data transfer safeguards using European Commission Standard Contractual Clauses (SCCs) and localized cryptographic key vaults.',
        'Requires annual third-party SOC2 Type II independent audits covering Security, Confidentiality, and Availability trust service criteria.',
        'Implements continuous automated role-based access control (RBAC), multi-factor authentication (MFA), and immutable centralized logging.',
        'Guarantees Data Subject Access Request (DSAR) fulfillment workflows within 30 calendar days without undue delay.'
      ],
      executiveBrief: 'Enterprise-grade compliance framework establishing rigorous data protection governance. The framework is audit-ready for Fortune 500 procurement scrutiny and ensures full legal alignment with global data sovereignty regulations.',
      actionChecklist: [
        { id: 'act-reg-1', text: 'Execute annual third-party SOC2 Type II attestation audit by September 30', priority: 'high', completed: false, category: 'SOC2', page: 3 },
        { id: 'act-reg-2', text: 'Conduct quarterly simulated 72-hour data breach response drill with external legal counsel', priority: 'high', completed: true, category: 'Breach Response', page: 5 },
        { id: 'act-reg-3', text: 'Verify automated deletion scripts execute complete purging of user data across backups within 30 days', priority: 'medium', completed: false, category: 'GDPR', page: 8 }
      ],
      importantDates: [
        { id: 'dt-reg-1', event: 'Annual SOC2 Type II Surveillance Audit', date: '15-Sep-2026', type: 'deadline', status: 'upcoming', page: 3 },
        { id: 'dt-reg-2', event: 'Statutory GDPR Breach Notification Window', date: '72 Hours Post-Discovery', type: 'deadline', status: 'normal', page: 5 },
        { id: 'dt-reg-3', event: 'DSAR Subject Response SLA', date: '30 Days From Receipt', type: 'deadline', status: 'normal', page: 8 }
      ],
      numbersAndMetrics: [
        { id: 'num-reg-1', label: 'Breach Notification SLA', value: '72 Hours', category: 'measurement', context: 'GDPR Article 33 threshold', page: 5 },
        { id: 'num-reg-2', label: 'Maximum GDPR Penalty Tier', value: '€20M or 4% Global Turnover', category: 'monetary', context: 'Major violation ceiling', page: 2 },
        { id: 'num-reg-3', label: 'Audit Log Retention Policy', value: '365 Days', category: 'count', context: 'Immutable WORM storage', page: 4 },
        { id: 'num-reg-4', label: 'Encryption Standard at Rest/Transit', value: 'AES-256 / TLS 1.3', category: 'measurement', context: 'FIPS 140-2 validated', page: 6 }
      ],
      risksAndConcerns: [
        { id: 'rsk-reg-1', title: 'Sub-Processor Compliance Visibility Gap', riskLevel: 'Warning', plainEnglish: 'Third-party API sub-processors must maintain equivalent SOC2 Type II certifications to avoid cascading compliance violations.', mitigation: 'Enforce mandatory annual compliance re-certification reviews in all vendor MSAs.', page: 9 }
      ],
      questionsToConsider: [
        'What are the mandatory steps in the 72-hour data breach disclosure protocol?',
        'How does the framework address cross-border data transfers post-Schrems II?',
        'What evidence is required to prove compliance with GDPR Article 28 data processor duties?'
      ]
    },
    metrics: [
      { label: 'Breach SLA', value: '72 Hours', change: 'Mandatory', status: 'warning', subtext: 'GDPR Article 33', iconName: 'Clock', page: 5 },
      { label: 'SOC2 Type II', value: 'Compliant', change: 'Annual Audit', status: 'positive', subtext: 'Trust Criteria', iconName: 'ShieldCheck', page: 3 },
      { label: 'Encryption', value: 'AES-256', change: 'TLS 1.3 In-Flight', status: 'positive', subtext: 'FIPS 140-2', iconName: 'Lock', page: 6 },
      { label: 'DSAR SLA', value: '30 Days', change: 'Right to Erase', status: 'positive', subtext: 'Full automation', iconName: 'UserCheck', page: 8 }
    ],
    governmentData: {
      issuingAuthority: 'Internal Enterprise Compliance Office & European Data Protection Board Guidelines',
      documentType: 'Regulatory Compliance Framework & Data Protection Directive',
      scopeAndApplicability: 'Global production infrastructure, multi-tenant databases, and third-party vendor integrations',
      effectiveDate: '01-Jan-2026',
      complianceDeadlines: [
        '72 Hours: Regulatory Data Breach Reporting',
        '30 Days: Data Subject Access Request (DSAR) Resolution',
        'Annual: SOC 2 Type II Independent Attestation'
      ],
      regulationsOrRules: [
        { section: 'Article 28', title: 'Data Processor Obligations', requirement: 'Process data strictly on documented controller instructions' },
        { section: 'Article 33', title: 'Supervisory Breach Notification', requirement: 'Notify supervisory authority within 72 hours of discovery' }
      ],
      penaltiesForNonCompliance: 'Statutory administrative fines up to €20,000,000 or 4% of total worldwide annual turnover.',
      submissionRequirements: [
        'Annual SOC 2 Type II attestation report',
        'Independent penetration testing verification',
        'Data Protection Impact Assessments (DPIAs)'
      ]
    },
    extractedEntities: [
      { category: 'Organization', key: 'Regulatory Authority', value: 'European Data Protection Board (EDPB) / AICPA', page: 1 },
      { category: 'Requirement', key: 'Security Framework', value: 'SOC 2 Type II (AICPA Trust Services Criteria)', page: 3 },
      { category: 'Concept', key: 'Data Transfer Safeguard', value: 'Standard Contractual Clauses (SCCs 2021/914)', page: 7 },
      { category: 'Amount', key: 'Max Statutory Exposure', value: '€20,000,000 EUR or 4% of Global Turnover', page: 2 }
    ],
    extractedTables: [
      {
        id: 'tbl-reg-matrix',
        tableName: 'Trust Service Criteria and Control Implementation Matrix',
        columns: ['Trust Criterion', 'Control Description', 'Testing Frequency', 'Audit Status'],
        rows: [
          { 'Trust Criterion': 'CC6.1 - Logical Access', 'Control Description': 'Enforce hardware MFA and zero trust network access', 'Testing Frequency': 'Continuous', 'Audit Status': 'Operating Effectively' },
          { 'Trust Criterion': 'CC6.6 - Boundary Protection', 'Control Description': 'WAF inspection and DDoS mitigation with rate limiting', 'Testing Frequency': 'Quarterly', 'Audit Status': 'Operating Effectively' },
          { 'Trust Criterion': 'CC7.2 - Incident Response', 'Control Description': 'Automated alerting and 72-hour disclosure runbook', 'Testing Frequency': 'Semi-Annual', 'Audit Status': 'Operating Effectively' }
        ],
        page: 4
      }
    ],
    sampleQuestions: [
      'What are the specific requirements under the 72-hour breach notification SLA?',
      'How does the framework satisfy GDPR Article 28 data processor obligations?',
      'What controls are evaluated during the annual SOC2 Type II surveillance audit?',
      'What is the workflow for handling Data Subject Access Requests (DSARs)?'
    ],
    chatHistory: [],
    rawText: `ENTERPRISE REGULATORY COMPLIANCE AND DATA PROTECTION FRAMEWORK
Scope: GDPR, SOC 2 Type II, ISO 27001, and HIPAA Governance
1. Data Controller and Processor Commitments: Pursuant to Article 28 of Regulation (EU) 2016/679 (GDPR), the organization processes data solely under documented customer instructions.
2. Security Incident and Breach Notification: In accordance with Article 33, any breach of security leading to accidental or unlawful destruction, loss, or unauthorized disclosure shall be reported to the supervisory authority within 72 hours.
3. SOC 2 Type II Controls: Annual independent examination of Security, Availability, and Confidentiality controls.`,
    pageTexts: [
      {
        page: 1,
        text: `ENTERPRISE REGULATORY COMPLIANCE FRAMEWORK\nAlignment with GDPR, SOC 2 Type II, and ISO 27001 standards.\nBreach notification SLA: 72 hours.`
      },
      {
        page: 2,
        text: `SECTION 3: DATA SUBJECT RIGHTS & ENCRYPTION CONTROLS\nRight to Erasure (DSAR) executed within 30 days.\nData encrypted with AES-256 at rest and TLS 1.3 in transit.`
      }
    ]
  }
];

export function createDemoDocAttachment(doc: DemoDocument | DocumentAnalysis): AttachedMediaFile {
  const isDocx =
    ('fileFormat' in doc && (doc as DemoDocument).fileFormat === 'DOCX') ||
    doc.name.endsWith('.docx') ||
    doc.name.endsWith('.doc');

  return {
    id: `att_demo_${doc.id}`,
    name: doc.name,
    size: 1024 * 1024 * (doc.pageCount || 2),
    sizeFormatted: doc.fileSize || (isDocx ? 'DOCX' : 'PDF'),
    mimeType: isDocx
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/pdf',
    mediaType: isDocx ? 'document' : 'pdf',
    status: 'ready',
    isDemoDoc: true,
    demoDoc: doc as DocumentAnalysis
  };
}

export function createFileAttachment(file: File): AttachedMediaFile {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  let mediaType: MediaType = 'document';
  if (type.startsWith('image/')) mediaType = 'image';
  else if (type.startsWith('video/')) mediaType = 'video';
  else if (type.includes('pdf') || /\.pdf$/i.test(name)) mediaType = 'pdf';
  else if (
    type.includes('spreadsheet') ||
    type.includes('excel') ||
    type.includes('csv') ||
    /\.(xlsx|xls|csv)$/i.test(name)
  )
    mediaType = 'spreadsheet';

  let previewUrl: string | undefined;
  if (mediaType === 'image') {
    previewUrl = URL.createObjectURL(file);
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return {
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    mimeType: file.type || 'application/octet-stream',
    mediaType,
    previewUrl,
    fileObject: file,
    status: 'ready'
  };
}


import { DocumentAnalysis } from './types';

export const SAMPLE_DOCUMENTS: DocumentAnalysis[] = [
  // 1. BANK STATEMENT & PERSONAL FINANCE (HDFC COMMERCIAL / SALARY ACCOUNT)
  {
    id: 'doc-hdfc-bank-01',
    name: 'HDFC_Salary_Account_Bank_Statement_Jan2026.pdf',
    fileSize: '1.4 MB',
    pageCount: 4,
    uploadedAt: 'Just now',
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
        { id: 'rsk-fin-2', title: 'Zombie Recurring Subscriptions Draining Capital', riskLevel: 'Warning', plainEnglish: '₹4,350/mo (₹52,200/yr) auto-debited across 5 digital streaming and gym memberships with zero recorded check-in.', mitigation: 'Cancel Cult.fit and Adobe to instantly save ₹3,200/mo.', page: 3 },
        { id: 'rsk-fin-3', title: 'Excessive Discretionary Outflow Leakage (34%)', riskLevel: 'Caution', plainEnglish: '₹21,800 spent across 26 food delivery and dining orders with 0% cashback rewards.', mitigation: 'Cap monthly food delivery at ₹12,000 and route via 5% cashback card.', page: 2 }
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
    savingsTips: [
      { id: 'tip-fin-1', title: 'Audit & Cancel 2 Idle Subscriptions', potentialSavings: '₹3,200 / month (₹38,400/yr)', description: 'Cancel Cult.fit (₹1,800) and Adobe (₹1,400) which had 0 recorded activity this billing cycle.', action: 'One-click cancel guide & dispute template', difficulty: 'Quick Win' },
      { id: 'tip-fin-2', title: 'Dispute ₹650 Intraday Penalty', potentialSavings: '₹650 Instant Refund', description: 'RBI Fair Practice Code entitles you to 100% reversal for transient intraday balance dips.', action: 'Generate 1-click Dispute Email Draft', difficulty: 'Instant' },
      { id: 'tip-fin-3', title: 'Activate 7.15% Auto-Sweep Fixed Deposit', potentialSavings: '₹2,100 / yr Extra Yield', description: 'Sweep surplus ₹25,000 balance into high-yield sweep FD without losing instant liquidity.', action: 'View Auto-Sweep Bank Setup Guide', difficulty: 'High Impact' },
      { id: 'tip-fin-4', title: 'Consolidate Food Delivery on 5% Cashback Card', potentialSavings: '₹1,090 / month Cashback', description: 'You spent ₹21,800 on food delivery via UPI with 0% rewards. Switching to a dedicated co-branded card yields ₹1,090/mo.', action: 'View Card Recommendation', difficulty: 'Easy' }
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
        { id: 'tip-2', title: 'Dispute Non-Consensual Overdraft Charge', potentialSavings: '₹650 instant refund', description: 'HDFC debited ₹650 for an intraday balance dip on Jan 14th that was self-corrected within 6 hours. RBI guidelines allow fee reversal.', action: 'Generate Dispute Email Draft', difficulty: 'easy', impact: 'Quick Win' }
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
      },
      {
        id: 'tbl-budget-503020',
        tableName: '50/30/20 Budget Optimization vs Current Spending',
        columns: ['Budget Category', 'Actual Jan Spend (₹)', 'Target 50/30/20 (₹)', 'Variance / Status'],
        rows: [
          { 'Budget Category': 'Needs (50% - Rent & Bills)', 'Actual Jan Spend (₹)': '₹24,500 (25.8%)', 'Target 50/30/20 (₹)': '₹47,500 (50.0%)', 'Variance / Status': 'Well Managed (-₹23,000)' },
          { 'Budget Category': 'Wants (30% - Dining & Shopping)', 'Actual Jan Spend (₹)': '₹31,600 (33.2%)', 'Target 50/30/20 (₹)': '₹28,500 (30.0%)', 'Variance / Status': 'Over Budget (+₹3,100)' },
          { 'Budget Category': 'Savings & Investments (20%)', 'Actual Jan Spend (₹)': '₹38,900 (41.0%)', 'Target 50/30/20 (₹)': '₹19,000 (20.0%)', 'Variance / Status': 'Excellent (+₹19,900)' }
        ],
        page: 2
      }
    ],
    sampleQuestions: [
      'What are all the avoidable fees and penalties in this statement?',
      'How much did I spend on food delivery and dining out?',
      'List all recurring subscriptions and how much I can save by cancelling idle ones.',
      'What was my total savings rate this month?'
    ],
    chatHistory: [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: '⚡ DocFin Forensic Analysis Complete. I audited your **HDFC Commercial Bank Statement (Jan 2026)**. You maintained healthy net savings of ₹30,800, but I identified **₹5,800/mo in potential savings** across unused subscriptions and an avoidable ₹650 overdraft fee. How can I assist you?',
        timestamp: '12:30 PM',
        citations: [
          { page: 1, snippet: 'Opening Bal: ₹34,500 | Total Debits: ₹64,200 | Credits: ₹95,000' }
        ]
      }
    ],
    rawText: `HDFC BANK LIMITED - KORAMANGALA BRANCH, BENGALURU
Account Statement for Period: 01-Jan-2026 to 31-Jan-2026
Account Name: Roshan Kumar Verma | Account No: 50100492819281 | IFSC: HDFC0001024
Opening Balance: ₹34,500.00 | Total Credits: ₹95,000.00 | Total Debits: ₹64,200.00 | Closing Balance: ₹65,300.00
Transactions:
01-Jan-2026: SALARY CREDIT - TECHCORP PVT LTD +₹90,000.00 (Balance: ₹124,500.00)
02-Jan-2026: RENT TRANSFER - UPI/VINAYAK_OWNER -₹22,000.00 (Balance: ₹102,500.00)
05-Jan-2026: CULTFIT AUTOPAY ACH DEBIT -₹1,800.00 (Balance: ₹100,700.00)
14-Jan-2026: OVERDRAFT SURCHARGE PENALTY -₹650.00 (Balance: ₹88,400.00) - Intraday dip rectified within 6 hours
18-Jan-2026: ADOBE SYSTEMS CREATIVE SUB -₹1,400.00 (Balance: ₹82,300.00)
31-Jan-2026: MUTUAL FUND SIP - AXIS BLUECHIP -₹10,000.00 (Balance: ₹65,300.00)
Spending Breakdown: Food & Dining ₹21,800 (34%), Rent & Utilities ₹24,500 (38.2%), Digital Subscriptions ₹4,350 (6.8%).`,
    pageTexts: [
      {
        page: 1,
        text: `HDFC BANK LIMITED - KORAMANGALA BRANCH, BENGALURU
Account Statement for Period: 01-Jan-2026 to 31-Jan-2026
Account Name: Roshan Kumar Verma | Account Number: 50100492819281 | IFSC Code: HDFC0001024
Opening Balance: ₹34,500.00 | Total Credits (Inflow): ₹95,000.00 | Total Debits (Outflow): ₹64,200.00 | Closing Balance: ₹65,300.00
Primary Transaction Entries:
01-Jan-2026: SALARY CREDIT - TECHCORP PVT LTD - Amount: +₹90,000.00 | Running Balance: ₹124,500.00
02-Jan-2026: RENT TRANSFER - UPI/VINAYAK_OWNER - Amount: -₹22,000.00 | Running Balance: ₹102,500.00`
      },
      {
        page: 2,
        text: `EXPENDITURE & SPENDING CATEGORIZATION (JANUARY 2026)
Total Monthly Inflow: ₹95,000.00 | Total Monthly Outflow: ₹64,200.00 | Net Savings: ₹30,800.00 (Savings Rate: 32.4%)
Category 1 - Rent & Maintenance: ₹24,500.00 (38.2% of total spend)
Category 2 - Food Delivery & Dining (Swiggy, Zomato, Dining Out): ₹21,800.00 (34.0% of total spend across 26 transactions)
Category 3 - Shopping & Retail: ₹9,800.00 (15.3% of total spend)
Fee Surcharge: 14-Jan-2026 OVERDRAFT SURCHARGE PENALTY of ₹650.00 debited for intraday account balance dip, self-corrected within 6 hours. Eligible for waiver under RBI fair lending guidelines.`
      },
      {
        page: 3,
        text: `RECURRING MANDATES & DIGITAL SUBSCRIPTIONS AUDIT
1. Cult.fit All-Access Fitness Pass: ₹1,800.00 / month (Auto-debit ACH on 5th) - Flagged: 0 gym check-ins recorded in billing period.
2. Adobe Creative Cloud Suite: ₹1,400.00 / month (Auto-debit on 18th) - Flagged: Minimal usage.
3. Netflix Premium 4K UHD: ₹649.00 / month (Auto-debit on 12th) - Active.
4. Spotify Individual Premium: ₹119.00 / month (Auto-debit on 21st) - Active.
5. Amazon Prime Annual Allocation: ₹382.00 / month eqv. - Active.
Total Recurring Subscriptions: ₹4,350.00 / month (₹52,200.00 / year). Identified Savings Potential: Cancel Cult.fit and Adobe to save ₹3,200.00 / month.`
      },
      {
        page: 4,
        text: `INVESTMENTS, TAX LIABILITIES & LIQUIDITY RECOMMENDATIONS
Mutual Fund Monthly SIP: Axis Bluechip Growth Fund - ₹10,000.00 debited on 31-Jan-2026.
Credit Card Outstanding Due Date: 18-Feb-2026 (Total Payable: ₹14,200.00).
Average Daily Balance Maintained: ₹42,500.00 (Earning 3.00% p.a. standard savings rate).
Optimization Roadmap: Activate Auto-Sweep Fixed Deposit on balance exceeding ₹15,000.00 to earn 7.15% p.a. with zero liquidity lock-in penalty.`
      }
    ]
  },

  // 2. INSURANCE POLICY (STAR HEALTH PREMIER COMPREHENSIVE)
  {
    id: 'doc-star-health-02',
    name: 'Star_Health_Comprehensive_Insurance_Policy.pdf',
    fileSize: '2.8 MB',
    pageCount: 18,
    uploadedAt: '10 mins ago',
    detectedDomain: 'insurance',
    confidenceScore: 98.8,
    detectionReason: 'Detected insurance policy schedules, sum insured tables, exclusions list, waiting period clauses, and cashless hospital claim protocols.',
    summary: {
      tldr: 'Individual Health Insurance Policy offering ₹15,00,000 Sum Insured with cashless hospitalization, but contains critical 20% Co-Pay for non-network hospitals and a 36-month waiting period on pre-existing conditions.',
      keyTakeaways: [
        'Sum Insured: ₹15,00,000 with 150% Cumulative Bonus restoration benefit.',
        'Room Rent Capped at 1% of Sum Insured (₹15,000/day for Single Standard AC Room).',
        '20% Mandatory Co-Payment if treated at non-network hospitals outside Tier-1 city network.',
        'Pre-Existing Diseases (PED) carry a strict 36-month continuous coverage waiting period.',
        'Includes ₹50,000 AYUSH alternative medicine coverage and ₹10,000 annual health checkup coupon.'
      ],
      executiveBrief: 'This comprehensive policy offers robust major medical coverage. However, policyholders must strictly use in-network hospitals to avoid the 20% co-payment penalty and verify that any room upgrades do not breach the 1% cap.',
      actionChecklist: [
        { id: 'act-ins-1', text: 'Download list of 1,400+ cashless network hospitals in your city to avoid 20% co-pay', priority: 'high', completed: false, category: 'Claim Readiness', page: 3 },
        { id: 'act-ins-2', text: 'Redeem the ₹10,000 free Annual Health Checkup voucher before policy renewal', priority: 'medium', completed: false, category: 'Benefits', page: 12 },
        { id: 'act-ins-3', text: 'Keep hospital admission intimation hotline (1800-425-2255) saved on emergency contacts', priority: 'high', completed: true, category: 'Emergency', page: 1 }
      ],
      importantDates: [
        { id: 'dt-ins-1', event: 'Policy Commencement Date', date: '15-Mar-2025', type: 'effective', status: 'past', page: 1 },
        { id: 'dt-ins-2', event: 'Renewal Due Date (Grace: 30 Days)', date: '14-Mar-2026', type: 'expiration', status: 'upcoming', page: 1 },
        { id: 'dt-ins-3', event: 'PED 36-Month Waiting Period Maturity', date: '15-Mar-2028', type: 'milestone', status: 'upcoming', page: 4 }
      ],
      numbersAndMetrics: [
        { id: 'num-ins-1', label: 'Total Sum Insured', value: '₹15,00,000', category: 'monetary', context: 'Base hospitalization coverage', page: 1 },
        { id: 'num-ins-2', label: 'Room Rent Cap', value: '1% of SI (₹15,000/day)', category: 'monetary', context: 'Single Standard AC Room', page: 3 },
        { id: 'num-ins-3', label: 'Non-Network Co-Payment', value: '20%', category: 'percentage', context: 'Penalty on non-network hospitals', page: 3 },
        { id: 'num-ins-4', label: 'Pre & Post Hospitalization Days', value: '60 Pre / 90 Post', category: 'count', context: 'Medical bills coverage window', page: 5 }
      ],
      risksAndConcerns: [
        { id: 'rsk-ins-1', title: '20% Co-Payment Penalty on Non-Network Hospitals', riskLevel: 'Critical', plainEnglish: 'If admitted to an unapproved hospital, you must pay 20% of the entire final bill out-of-pocket (e.g. ₹1,00,000 on a ₹5,00,000 bill).', mitigation: 'Always verify cashless network status via Star Health portal before planned admission.', page: 3 },
        { id: 'rsk-ins-2', title: '1% Room Rent Proportional Deduction Clause', riskLevel: 'High', plainEnglish: 'Opting for a Suite or Deluxe room exceeding ₹15,000/day triggers proportionate cuts across doctor fees and surgery charges.', mitigation: 'Strictly choose Single Standard AC room within the ₹15,000/day limit.', page: 3 },
        { id: 'rsk-ins-3', title: 'Exclusion of Non-Medical Hospital Consumables', riskLevel: 'Warning', plainEnglish: 'PPE kits, gloves, syringes, and admin charges (typically 8-12% of hospital bills) are not reimbursed.', mitigation: 'Add an inexpensive Consumables Protection Rider at next renewal.', page: 7 }
      ],
      questionsToConsider: [
        'How does the 20% co-payment rule affect out-of-pocket expenses?',
        'Which specific medical treatments have special waiting sub-limits?',
        'What documents are needed for immediate cashless approval at TPA desk?'
      ]
    },
    metrics: [
      { label: 'Total Sum Insured', value: '₹15,00,000', change: '+100% Reload', status: 'positive', subtext: 'Comprehensive Individual', iconName: 'ShieldCheck', page: 1 },
      { label: 'Room Rent Daily Limit', value: '₹15,00,000 / day', change: '1% Cap', status: 'neutral', subtext: 'Single Private AC Room', iconName: 'Home', page: 3 },
      { label: 'Co-Payment Clause', value: '20% Non-Network', change: 'High Alert', status: 'warning', subtext: '0% in Network Hospitals', iconName: 'AlertTriangle', page: 3 },
      { label: 'PED Waiting Period', value: '36 Months', change: '14 mo left', status: 'negative', subtext: 'Pre-existing conditions', iconName: 'Clock', page: 4 }
    ],
    savingsTips: [
      { id: 'tip-ins-1', title: 'Pre-Authorize at Cashless Network Hospitals', potentialSavings: 'Save 20% Co-Pay Penalty (Up to ₹3,00,000)', description: 'Admitting to one of the 1,400+ cashless partner hospitals eliminates the 20% co-payment penalty completely.', action: 'View Nearest Cashless Hospitals', difficulty: 'Critical' },
      { id: 'tip-ins-2', title: 'Claim Pre/Post Hospitalization Bills within 30 Days', potentialSavings: 'Average ₹25,000 Recovery', description: 'Ensure all diagnostic scans and pharmacy bills from 60 days before and 90 days after discharge are submitted.', action: 'Download Claim Submission Kit', difficulty: 'High Impact' },
      { id: 'tip-ins-3', title: 'Redeem Free ₹10,000 Preventive Health Checkup', potentialSavings: '₹10,000 Free Health Benefit', description: 'Star Health includes a complimentary annual comprehensive metabolic and cardiac test.', action: 'Book Free Health Checkup Voucher', difficulty: 'Quick Win' }
    ],
    insuranceData: {
      policyType: 'Comprehensive Health Shield Plus',
      sumInsured: '₹15,00,000',
      deductible: '₹0 (Zero Deductible)',
      copay: '0% in Network / 20% in Non-Network',
      waitingPeriod: '36 Months for Pre-Existing Diseases (PED)',
      coveredItems: [
        { id: 'cov-1', title: 'In-Patient Hospitalization', details: 'Full coverage for room, nursing, ICU, doctor fees up to ₹15 Lakhs', limit: '100% Sum Insured' },
        { id: 'cov-2', title: 'Pre & Post Hospitalization', details: '60 days pre-hospitalization & 90 days post-discharge medical expenses', limit: 'Actuals' },
        { id: 'cov-3', title: 'Day Care Treatments', details: 'All 405 advanced day-care procedures requiring < 24hr hospitalization', limit: 'Up to Sum Insured' },
        { id: 'cov-4', title: 'Emergency Road Ambulance', details: 'Ambulance service per hospitalization event', limit: '₹3,000 / event' },
        { id: 'cov-5', title: 'AYUSH Treatment', details: 'Ayurveda, Yoga, Unani, Siddha, and Homeopathy in Govt accredited centres', limit: 'Up to ₹50,000' }
      ],
      excludedItems: [
        { id: 'ex-1', title: 'Cosmetic & Plastic Surgery', details: 'Surgeries for aesthetic appearance unless necessitated by accidental trauma', reason: 'Standard General Exclusion', severity: 'high' },
        { id: 'ex-2', title: 'Dental Treatment (OPD)', details: 'Routine dental cleanings, root canals, and braces unless due to severe accident', reason: 'OPD Exclusion Clause 4.8', severity: 'medium' },
        { id: 'ex-3', title: 'Non-Medical Hospital Consumables', details: 'Gloves, PPE kits, admission kits, sanitizers, and diagnostic file charges', reason: 'IRDAI List II Non-payable', severity: 'high' },
        { id: 'ex-4', title: 'Self-Inflicted Injuries & Adventure Sports', details: 'Injury from hazardous sports (skydiving, racing) or intentional self-harm', reason: 'High Risk Activity Clause', severity: 'high' }
      ],
      claimChecklist: [
        { step: 1, title: 'Emergency Hospital Intimation', description: 'Notify insurer within 24 hours of emergency admission via TPA portal or toll-free number.', docsNeeded: ['Policy Number', 'Hospital Name', 'Attending Doctor Note'] },
        { step: 2, title: 'Cashless Desk Submission', description: 'Submit e-Health Card and Govt Photo ID at the hospital TPA desk for Pre-Authorization.', docsNeeded: ['Health Card', 'Aadhaar/PAN', 'Pre-Auth Form'] },
        { step: 3, title: 'Discharge Summary & Itemized Invoices', description: 'Obtain final signed discharge summary, indoor case papers, and original pharmacy receipts.', docsNeeded: ['Original Bills', 'Discharge Summary', 'Payment Receipts'] },
        { step: 4, title: 'Post-Hospitalization Claim Submission', description: 'Submit post-discharge medicine bills within 30 days of the post-hospitalization period.', docsNeeded: ['Doctor Prescriptions', 'Diagnostic Reports', 'Cancelled Cheque'] }
      ]
    },
    extractedEntities: [
      { category: 'Person', key: 'Primary Insured', value: 'Ananya Sharma (Age: 28)', page: 1 },
      { category: 'ID/Reference', key: 'Policy Number', value: 'SH-COMP-2026-948102', page: 1 },
      { category: 'Date', key: 'Policy Period', value: '15-Mar-2025 to 14-Mar-2026', page: 1 },
      { category: 'Amount', key: 'Annual Premium Paid', value: '₹18,450 (incl. 18% GST)', page: 2 },
      { category: 'Status', key: 'Claim Status', value: 'Active & Continuous (Year 2)', page: 1 }
    ],
    extractedTables: [
      {
        id: 'tbl-sublimits',
        tableName: 'Specific Illness Sub-Limits & Waiting Schedule',
        columns: ['Condition / Procedure', 'Waiting Period', 'Max Payout Sub-Limit', 'Co-Pay %'],
        rows: [
          { 'Condition / Procedure': 'Cataract Surgery', 'Waiting Period': '24 Months', 'Max Payout Sub-Limit': '₹40,000 per eye', 'Co-Pay %': '0%' },
          { 'Condition / Procedure': 'Joint Replacement (Knee/Hip)', 'Waiting Period': '24 Months', 'Max Payout Sub-Limit': '₹3,50,000 per joint', 'Co-Pay %': '0%' },
          { 'Condition / Procedure': 'Hernia & Kidney Stone Removal', 'Waiting Period': '24 Months', 'Max Payout Sub-Limit': '₹65,000 per surgery', 'Co-Pay %': '0%' },
          { 'Condition / Procedure': 'Pre-Existing Diabetes / Hypertension', 'Waiting Period': '36 Months', 'Max Payout Sub-Limit': 'Full Sum Insured', 'Co-Pay %': '0% (Network)' }
        ],
        page: 4
      }
    ],
    sampleQuestions: [
      'What are the exclusions under this health policy?',
      'How much co-payment will I have to pay if I go to a non-network hospital?',
      'What is the step-by-step procedure to file a cashless claim?',
      'Are dental procedures and OPD expenses covered?'
    ],
    chatHistory: [
      {
        id: 'msg-ins-1',
        sender: 'assistant',
        text: '🛡️ DocFin Policy Engine active. Your **Star Health Comprehensive Policy** provides ₹15 Lakhs sum insured. Note: there is a **20% co-payment clause if treated at non-network hospitals**, and a 36-month waiting period on pre-existing conditions.',
        timestamp: '11:45 AM',
        citations: [
          { page: 3, section: 'Clause 3.2 - Co-Payment Matrix', snippet: 'Co-payment of 20% applicable on admissible claim amount in non-network hospitals.' }
        ]
      }
    ],
    rawText: `STAR HEALTH AND ALLIED INSURANCE COMPANY LIMITED
Comprehensive Health Shield Plus Policy Schedule
Policy No: SH-COMP-2026-948102 | Policy Period: 15-Mar-2025 to 14-Mar-2026 | Renewal Due: 14-Mar-2026
Primary Insured: Ananya Sharma (Age: 28) | Sum Insured: ₹15,00,000.00 | Deductible: ₹0.00
Annual Premium Paid: ₹18,450.00 (inclusive of 18% GST) | 24x7 Claims Intimation: 1800-425-2255
Key Coverage: In-Patient Hospitalization up to ₹15 Lakhs, 60 Days Pre-Hospitalization, 90 Days Post-Hospitalization, Day Care 405 procedures, AYUSH alternative treatment ₹50,000.
Important Exclusions & Restrictions:
Clause 3.2 Co-Payment: 0% at network hospitals; 20% mandatory co-payment on all admissible bills at non-network hospitals.
Clause 3.4 Room Rent Cap: 1% of Sum Insured (₹15,000/day) for Single Private AC Room. Proportionate deductions apply on surgery/doctor fees if room limit is breached.
Clause 4.1 Waiting Periods: 36 Months continuous coverage for Pre-Existing Diseases (PED). 24 Months for Cataract (₹40,000/eye), Joint Replacement (₹3,50,000/joint), Hernia/Kidney Stones (₹65,000).`,
    pageTexts: [
      {
        page: 1,
        text: `STAR HEALTH AND ALLIED INSURANCE COMPANY LIMITED
COMPREHENSIVE HEALTH SHIELD PLUS - POLICY SCHEDULE & CERTIFICATE OF INSURANCE
Policy Number: SH-COMP-2026-948102 | Insured Person: Ananya Sharma (Age: 28 Years / Female)
Policy Commencement: 15-Mar-2025 | Expiration Date: 14-Mar-2026 | Grace Period for Renewal: 30 Days
Total Base Sum Insured: ₹15,00,000.00 | Cumulative Bonus: 150% Guaranteed Restoration
Annual Premium: ₹15,635.59 + 18% GST (₹2,814.41) = Total ₹18,450.00 | Deductible: ₹0 (Nil Deductible)
Emergency 24x7 TPA Help Desk: 1800-425-2255 / 044-2828-8800 | Email: claims@starhealth.in`
      },
      {
        page: 2,
        text: `SECTION 2: IN-PATIENT & DAY-CARE HOSPITALIZATION BENEFITS
1. In-Patient Hospitalization: Room rent, nursing, boarding, intensive care unit (ICU), surgeon, anesthetist, medical practitioner, and diagnostic scans covered up to full Sum Insured (₹15,00,000.00).
2. Pre-Hospitalization Medical Expenses: Incurred up to 60 days prior to date of hospital admission.
3. Post-Hospitalization Medical Expenses: Incurred up to 90 days following date of hospital discharge.
4. Day Care Treatments: All 405 advanced procedures requiring less than 24 hours hospitalization covered.
5. Road Ambulance: Actual charges up to ₹3,000 per hospitalization event.
6. AYUSH Treatment: In-patient treatment under Ayurveda, Unani, Siddha, and Homeopathy covered up to ₹50,000.`
      },
      {
        page: 3,
        text: `SECTION 3: CRITICAL RESTRICTIONS, CO-PAYMENT & ROOM RENT CAP
Clause 3.2 Co-Payment Matrix:
- Hospitalization within Cashless Network (1,400+ hospitals): 0% Co-Payment.
- Hospitalization in Non-Network Hospital: Mandatory 20% Co-Payment on entire admissible claim amount payable by the Insured.
Clause 3.4 Room Rent Limit & Proportionate Deductions:
- Room Rent is capped at 1% of Sum Insured per day (₹15,000.00/day) for Single Private Standard AC Room.
- If Insured chooses a higher room category (Suite / Deluxe), all associated medical expenses including doctor visits and surgery fees will be proportionately deducted in the ratio of actual room rent to allowed limit.`
      },
      {
        page: 4,
        text: `SECTION 4: WAITING PERIODS, ILLNESS SUB-LIMITS & PERMANENT EXCLUSIONS
Clause 4.1 Waiting Periods:
- Pre-Existing Diseases (PED): 36 months continuous coverage from initial policy commencement.
- Specific Illness Waiting (24 Months): Cataract (Sub-limit: ₹40,000 per eye), Joint Replacement (Sub-limit: ₹3,50,000 per joint), Hernia & Kidney Stones (Sub-limit: ₹65,000 per surgery).
- Initial 30-Day Waiting Period: Illnesses within first 30 days excluded (except accidental injuries).
General Exclusions:
- Cosmetic & aesthetic surgeries, OPD dental procedures (Clause 4.8), and non-medical hospital consumables (PPE kits, gloves, sanitizers, admission kits under IRDAI non-payable list).`
      }
    ]
  },

  // 3. LEGAL CONTRACT / COMMERCIAL LEASE AGREEMENT
  {
    id: 'doc-rental-agreement-03',
    name: 'Commercial_Lease_Agreement_Indiranagar_2026.pdf',
    fileSize: '890 KB',
    pageCount: 6,
    uploadedAt: '25 mins ago',
    detectedDomain: 'legal',
    confidenceScore: 97.9,
    detectionReason: 'Detected tenancy clauses, security deposit forfeiture conditions, lock-in period penalty, and rent escalation schedules.',
    summary: {
      tldr: 'Commercial Tenancy Agreement for an office space in Indiranagar, Bengaluru (Rent: ₹38,000/mo, Deposit: ₹2,00,000). Flags 3 high-risk landlord-favored clauses including unilateral deposit forfeiture and automatic 10% rent escalation.',
      keyTakeaways: [
        'Monthly Rent: ₹38,000 due on or before 5th of each calendar month.',
        'Security Deposit: ₹2,00,000 refundable within 30 days of vacating after painting deductions.',
        '🔴 Red Flag 1: 6-Month strict lock-in period with full rent forfeiture upon early exit.',
        '🟡 Red Flag 2: Landlord reserves the right to increase rent by 10% on 11-month renewal without negotiation.',
        '🟢 Notice Period: 2 months written notice required by either party after lock-in expiration.'
      ],
      executiveBrief: 'This agreement favors the Landlord significantly in the deposit return and early-exit clauses. Before signing, the tenant should negotiate a mutual 1-month lock-in instead of 6 months and cap painting deductions at ₹15,000 max.',
      actionChecklist: [
        { id: 'act-leg-1', text: 'Request amendment to Clause 7: Cap painting & cleaning deduction to ₹15,000 max with bill proof', priority: 'high', completed: false, category: 'Negotiation', page: 4 },
        { id: 'act-leg-2', text: 'Reduce lock-in period from 6 months to 1 month for unforeseen business relocation', priority: 'high', completed: false, category: 'Risk Mitigation', page: 2 },
        { id: 'act-leg-3', text: 'Ensure pre-move inspection checklist with photos is attached as Annexure A', priority: 'medium', completed: true, category: 'Documentation', page: 6 }
      ],
      importantDates: [
        { id: 'dt-leg-1', event: 'Agreement Effective Commencement', date: '01-Feb-2026', type: 'effective', status: 'past', page: 1 },
        { id: 'dt-leg-2', event: '6-Month Lock-in Expiration Date', date: '31-Jul-2026', type: 'milestone', status: 'upcoming', page: 2 },
        { id: 'dt-leg-3', event: '11-Month Tenancy Term Expiration', date: '31-Dec-2026', type: 'expiration', status: 'upcoming', page: 1 }
      ],
      numbersAndMetrics: [
        { id: 'num-leg-1', label: 'Monthly Base Rent', value: '₹38,000 / mo', category: 'monetary', context: 'Excluding electricity & maintenance', page: 2 },
        { id: 'num-leg-2', label: 'Refundable Security Deposit', value: '₹2,00,000', category: 'monetary', context: '5.26x monthly rent ratio', page: 2 },
        { id: 'num-leg-3', label: 'Lock-in Period Duration', value: '6 Months', category: 'count', context: 'Strict forfeiture window', page: 2 },
        { id: 'num-leg-4', label: 'Renewal Escalation Rate', value: '10%', category: 'percentage', context: 'Automatic rent increase', page: 3 }
      ],
      risksAndConcerns: [
        { id: 'rsk-leg-1', title: 'Total Deposit Forfeiture on Early Exit (Lock-in)', riskLevel: 'Critical', plainEnglish: 'Clause 5.2 allows the landlord to seize your entire ₹2,00,000 security deposit if you vacate within the first 6 months, regardless of notice given.', mitigation: 'Counter-propose 1-month rent deduction instead of complete deposit forfeiture.', page: 2 },
        { id: 'rsk-leg-2', title: 'Uncapped Painting & Wear-and-Tear Deductions', riskLevel: 'High', plainEnglish: 'Clause 8.1 allows the landlord to deduct arbitrary painting charges from your deposit without furnishing contractor receipts.', mitigation: 'Add clause capping painting deductions to ₹15,000 with mandatory GST invoices.', page: 4 },
        { id: 'rsk-leg-3', title: 'Unilateral 10% Rent Escalation on Renewal', riskLevel: 'Warning', plainEnglish: 'Rent increases automatically by 10% after 11 months without consideration for prevailing market inflation.', mitigation: 'Negotiate standard 5% escalation or mutual market benchmarking.', page: 3 }
      ],
      questionsToConsider: [
        'How can I protect my ₹2,00,000 security deposit from unfair painting deductions?',
        'What redline clauses should I send to the landlord before signing?',
        'What is my legal right regarding unannounced landlord inspections?'
      ]
    },
    metrics: [
      { label: 'Contract Risk Level', value: 'High Risk', change: '3 Flags Found', status: 'negative', subtext: 'Landlord-biased clauses', iconName: 'AlertOctagon', page: 2 },
      { label: 'Security Deposit', value: '₹2,00,000', change: '5.2x Rent', status: 'warning', subtext: 'Bengaluru standard (avg 4-6x)', iconName: 'Lock', page: 2 },
      { label: 'Lock-in Period', value: '6 Months', change: 'Full Penalty', status: 'negative', subtext: 'Rent forfeited on early exit', iconName: 'FileWarning', page: 2 },
      { label: 'Notice Period', value: '2 Months', change: 'Mutual', status: 'neutral', subtext: 'Written notice required', iconName: 'Calendar', page: 3 }
    ],
    savingsTips: [
      { id: 'tip-leg-1', title: 'Insert Painting Deduction Cap Clause', potentialSavings: 'Protect up to ₹35,000 Deposit', description: 'Cap painting and deep-cleaning deductions to 1 month rent or ₹15,000 max with mandatory contractor GST receipts.', action: 'Copy Redline Clause Draft', difficulty: 'High Impact' },
      { id: 'tip-leg-2', title: 'Negotiate Lock-in Down to 1 Month', potentialSavings: 'Risk Shield: ₹2,00,000', description: 'Propose replacing the 6-month lock-in forfeiture with 1-month penalty notice to enable risk-free early business relocation.', action: 'Download Landlord Amendment Letter', difficulty: 'Critical' },
      { id: 'tip-leg-3', title: 'Pre-Occupancy Photographic Inventory', potentialSavings: 'Prevents False Damage Claims', description: 'Attach a signed timestamped photo inventory (Annexure A) documenting all pre-existing wall marks and fixture states.', action: 'Generate Inspection Checklist', difficulty: 'Quick Win' }
    ],
    legalData: {
      contractType: 'Commercial Tenancy Agreement (11 Months)',
      parties: ['Landlord: Suresh V. Hegde', 'Tenant: Roshan Kumar Verma'],
      effectiveDate: '01-Feb-2026',
      duration: '11 Months (Expiring 31-Dec-2026)',
      riskScore: 'High',
      riskyClauses: [
        {
          id: 'cl-1',
          clause: 'Clause 5.2: Early Termination & Lock-in Penalty',
          page: 2,
          riskLevel: 'Critical',
          plainEnglish: 'If you vacate the premises before completing 6 months, the landlord will forfeit your entire ₹2,00,000 security deposit even if you give 2 months advance notice.',
          mitigation: 'Counter-propose: Mutual 1-month lock-in or 1-month rent deduction instead of full deposit forfeiture.'
        },
        {
          id: 'cl-2',
          clause: 'Clause 8.1: Uncapped Painting & Maintenance Deductions',
          page: 4,
          riskLevel: 'Warning',
          plainEnglish: 'The landlord can deduct any amount they deem necessary for repainting and deep cleaning without providing contractor invoices or receipts.',
          mitigation: 'Add clause: "Deductions for painting capped at 1 month basic rent or ₹15,000, supported by actual GST invoices."'
        },
        {
          id: 'cl-3',
          clause: 'Clause 11.4: Right of Unannounced Entry',
          page: 5,
          riskLevel: 'Caution',
          plainEnglish: 'Landlord may inspect the premises at any time without prior 24-hour written notice.',
          mitigation: 'Modify to require minimum 24-hour advance intimation via WhatsApp or email.'
        }
      ],
      obligations: [
        { id: 'ob-1', party: 'Tenant', obligation: 'Pay monthly rent of ₹38,000 on or before 5th of every English calendar month', deadline: 'Monthly by 5th', page: 2 },
        { id: 'ob-2', party: 'Tenant', obligation: 'Pay actual BESCOM electricity and commercial maintenance (₹3,500/mo) directly', deadline: 'Monthly as billed', page: 2 },
        { id: 'ob-3', party: 'Landlord', obligation: 'Refund full security deposit within 30 days after deducting agreed utility dues', deadline: 'Within 30 days of handover', page: 4 }
      ],
      terminationTerms: '2 months advance written notice required after completion of the 6-month lock-in period.'
    },
    extractedEntities: [
      { category: 'Person', key: 'Lessor / Landlord', value: 'Suresh V. Hegde', page: 1 },
      { category: 'Person', key: 'Lessee / Tenant', value: 'Roshan Kumar Verma', page: 1 },
      { category: 'Amount', key: 'Monthly Rent', value: '₹38,000 / month', page: 2 },
      { category: 'Amount', key: 'Security Deposit', value: '₹2,00,000 (Refundable)', page: 2 },
      { category: 'Date', key: 'Commencement Date', value: '01 February 2026', page: 1 },
      { category: 'Clause', key: 'Escalation Rate', value: '10% on 11-Month Renewal', page: 3 }
    ],
    extractedTables: [
      {
        id: 'tbl-schedule',
        tableName: 'Commercial Office Fixture & Asset Schedule',
        columns: ['Item / Fixture', 'Quantity', 'Condition at Handover', 'Estimated Replacement Cost'],
        rows: [
          { 'Item / Fixture': 'Daikin 1.5 Ton Split AC', 'Quantity': '2 Units', 'Condition at Handover': 'Brand New (Operational)', 'Estimated Replacement Cost': '₹42,00,00 each' },
          { 'Item / Fixture': 'Geyser (Havells 25L)', 'Quantity': '2 Units', 'Condition at Handover': 'Good Working Condition', 'Estimated Replacement Cost': '₹9,500 each' },
          { 'Item / Fixture': 'Conference Room Table & Chairs', 'Quantity': '1 Set (8 Chairs)', 'Condition at Handover': 'Clean & Functional', 'Estimated Replacement Cost': '₹24,000' },
          { 'Item / Fixture': 'Main Door Smart Digital Lock', 'Quantity': '1 Unit', 'Condition at Handover': 'Operational (2 RFID Keys)', 'Estimated Replacement Cost': '₹12,000' }
        ],
        page: 6
      }
    ],
    sampleQuestions: [
      'What are the high-risk clauses in this commercial lease?',
      'What happens if I need to vacate the premises within the first 4 months?',
      'How much can the landlord deduct from my deposit for painting?',
      'What is the notice period required to vacate?'
    ],
    chatHistory: [
      {
        id: 'msg-leg-1',
        sender: 'assistant',
        text: '⚖️ DocFin Legal Engine active. I reviewed this **Commercial Lease Agreement** and flagged **3 critical risks**, including a strict 6-month lock-in penalty where your ₹2,00,000 deposit can be seized on early exit.',
        timestamp: '10:15 AM',
        citations: [
          { page: 2, section: 'Clause 5.2', snippet: 'In the event of Lessee vacating before 6 months, entire security deposit stands forfeited to Lessor.' }
        ]
      }
    ],
    rawText: `COMMERCIAL LEASE & TENANCY AGREEMENT
Executed at Bengaluru on 01-Feb-2026 between Suresh V. Hegde (Lessor) and Roshan Kumar Verma (Lessee).
Demised Premises: 2nd Floor Commercial Office Space, Indiranagar 100 Feet Road, Bengaluru 560038.
Term: 11 Months expiring 31-Dec-2026. Monthly Rent: ₹38,000.00 | Security Deposit: ₹2,00,000.00.
Clause 5.2 Lock-in Period: 6 Months lock-in. Early vacation forfeits the entire ₹2,00,000 security deposit.
Clause 6.1 Escalation: Automatic 10% rent escalation on 11-month lease renewal.
Clause 8.1 Painting Deductions: Landlord reserves the right to deduct painting and cleaning costs from security deposit.
Clause 11.4 Entry: Landlord may enter for inspection. Notice period to terminate after lock-in: 2 months.`,
    pageTexts: [
      {
        page: 1,
        text: `COMMERCIAL TENANCY AGREEMENT
This Commercial Tenancy Agreement is entered into on this 1st day of February 2026 at Bengaluru, Karnataka.
BETWEEN: Mr. Suresh V. Hegde, residing at Indiranagar, Bengaluru (hereinafter referred to as the "LESSOR / LANDLORD")
AND: Mr. Roshan Kumar Verma, residing at Koramangala, Bengaluru (hereinafter referred to as the "LESSEE / TENANT").
WHEREAS the Lessor is the absolute owner of Commercial Office Unit No. 204, 2nd Floor, 100 Feet Road, Indiranagar, Bengaluru 560038.`
      },
      {
        page: 2,
        text: `RENT, SECURITY DEPOSIT & LOCK-IN COVENANTS
Clause 3 (Rent): The Lessee agrees to pay a monthly base rent of ₹38,000.00 (Rupees Thirty-Eight Thousand only) on or before the 5th of each English calendar month. Electricity (BESCOM) and commercial maintenance (₹3,500/mo) shall be borne directly by Lessee.
Clause 5 (Security Deposit): The Lessee has deposited an interest-free refundable security deposit of ₹2,00,000.00 (5.26x monthly rent).
Clause 5.2 (Critical Lock-in Penalty): The Lessee shall observe a mandatory 6-month lock-in period from 01-Feb-2026 to 31-Jul-2026. If the Lessee vacates the premises prior to 31-Jul-2026, the entire security deposit of ₹2,00,000.00 shall stand forfeited to the Lessor as liquidated damages.`
      },
      {
        page: 3,
        text: `RENEWAL, ESCALATION & TERMINATION NOTICE
Clause 6 (Escalation): Upon the expiration of the 11-month term (31-Dec-2026), the agreement may be renewed subject to an automatic 10% upward revision of the monthly rent.
Clause 7 (Notice Period): Following the completion of the 6-month lock-in period, either party may terminate the tenancy by providing 2 (two) months advance written notice via registered post or email.`
      },
      {
        page: 4,
        text: `DEPOSIT REFUND, REPAIR DEDUCTIONS & MAINTENANCE
Clause 8.1 (Deductions from Deposit): The Lessor shall refund the security deposit within 30 days of receiving vacant, peaceful possession of the premises, subject to deductions for unpaid utility dues, repainting, and deep-cleaning costs.
Tenant Redline Advisory: Add clause capping painting and cleaning deductions to ₹15,000.00 maximum supported by actual GST contractor receipts.`
      },
      {
        page: 5,
        text: `INSPECTION, QUIET ENJOYMENT & ENTRY RIGHTS
Clause 11.4 (Landlord Inspection): The Lessor or authorized representatives reserve the right to inspect the premises during normal business hours. Tenant requires minimum 24-hour advance intimation.`
      },
      {
        page: 6,
        text: `ANNEXURE A - OFFICE FIXTURES & ASSET INVENTORY SCHEDULE
1. Daikin 1.5 Ton Split Air Conditioners (2 Units) - Operational Condition (Est. Value: ₹42,000 each).
2. Havells 25L Water Geysers (2 Units) - Operational Condition (Est. Value: ₹9,500 each).
3. Conference Room Table & 8 Mesh Ergonomic Chairs (1 Set) - Good Condition (Est. Value: ₹24,000).
4. Smart RFID Digital Door Lock (1 Unit) with 2 master keys - Operational (Est. Value: ₹12,000).`
      }
    ]
  },

  // 4. ACADEMIC RESEARCH PAPER (TRANSFORMER ATTENTION MECHANISMS)
  {
    id: 'doc-academic-01',
    name: 'Multi-Head_Attention_Mechanisms_Research_Paper.pdf',
    fileSize: '2.1 MB',
    pageCount: 12,
    uploadedAt: 'Just now',
    detectedDomain: 'academic',
    secondaryDomains: ['technical'],
    confidenceScore: 99.2,
    detectionReason: 'Identified academic peer-reviewed preprint structure: abstract, mathematical methodology, transformer self-attention tensors, BLEU benchmark tables, and bibliographic citations.',
    summary: {
      tldr: 'Groundbreaking deep learning paper introducing multi-head self-attention mechanisms for sequence transduction, eliminating recurrent and convolutional layers while achieving state-of-the-art BLEU scores (28.4 on WMT 2014 English-to-German).',
      keyTakeaways: [
        'Proposes the Transformer architecture based entirely on scaled dot-product attention mechanisms.',
        'Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.',
        'Trained on 8 NVIDIA P100 GPUs for 3.5 days, achieving 28.4 BLEU score on WMT 2014 English-to-German and 41.8 BLEU on English-to-French.',
        'Reduces computational training latency significantly compared to recurrent neural network baselines.'
      ],
      executiveBrief: 'This foundational paper establishes the Transformer architecture. By replacing sequential recurrence with parallel self-attention and positional encodings, the authors demonstrate superior translation quality and dramatically faster convergence. The multi-head projection splits queries, keys, and values into 8 parallel attention heads of dimension d_k = 64.',
      actionChecklist: [
        { id: 'act-acad-1', text: 'Replicate baseline scaled dot-product attention matrix computation on benchmark dataset', priority: 'high', completed: false, page: 4 },
        { id: 'act-acad-2', text: 'Evaluate multi-head projection dimensions (h=8 vs h=16) on validation loss', priority: 'medium', completed: true, page: 5 },
        { id: 'act-acad-3', text: 'Incorporate sinusoidal positional encoding vectors into embedding pipeline', priority: 'medium', completed: false, page: 6 }
      ],
      importantDates: [
        { id: 'dt-acad-1', event: 'Paper Submission & ArXiv Preprint', date: '12-Jun-2024', type: 'milestone', status: 'past', page: 1 },
        { id: 'dt-acad-2', event: 'NeurIPS Conference Presentation', date: '08-Dec-2024', type: 'milestone', status: 'past', page: 1 }
      ],
      numbersAndMetrics: [
        { id: 'num-acad-1', label: 'BLEU Score (EN-DE)', value: '28.4 BLEU', category: 'score', context: 'WMT 2014 benchmark test set', page: 8 },
        { id: 'num-acad-2', label: 'BLEU Score (EN-FR)', value: '41.8 BLEU', category: 'score', context: 'WMT 2014 English-French benchmark', page: 8 },
        { id: 'num-acad-3', label: 'Attention Heads (h)', value: 8, category: 'count', context: 'Parallel multi-head projections', page: 4 },
        { id: 'num-acad-4', label: 'Model Dimension (d_model)', value: 512, category: 'measurement', context: 'Dense vector embedding dimension', page: 3 }
      ],
      risksAndConcerns: [
        { id: 'rsk-acad-1', title: 'Quadratic Sequence Complexity O(n^2)', riskLevel: 'High', plainEnglish: 'Self-attention memory complexity scales quadratically with sequence length n, causing high VRAM consumption on long contexts (> 4k tokens).', mitigation: 'Use FlashAttention-2, rotary embeddings, or sliding-window attention for extended context windows.', page: 9 },
        { id: 'rsk-acad-2', title: 'Heavy Training Compute Footprint', riskLevel: 'Warning', plainEnglish: 'Full pre-training requires substantial distributed GPU clusters (8x P100 for 3.5 days on base model).', mitigation: 'Apply LoRA parameter-efficient fine-tuning (PEFT) on frozen foundation weights.', page: 7 }
      ],
      questionsToConsider: [
        'How does Multi-Head Attention prevent attention collapse in deep layers?',
        'What are the ablation results when removing sinusoidal positional encodings?',
        'How does the computational complexity O(n^2 * d) compare to RNNs O(n * d^2)?'
      ]
    },
    metrics: [
      { label: 'Primary BLEU Benchmark', value: '28.4 BLEU', status: 'positive', subtext: 'WMT 2014 EN-DE SOTA', page: 8 },
      { label: 'Attention Heads', value: '8 Heads', status: 'neutral', subtext: 'd_k = 64 per subspace', page: 4 },
      { label: 'Training Hardware', value: '8x P100 GPUs', status: 'neutral', subtext: '3.5 Days Training', page: 7 },
      { label: 'Complexity Bound', value: 'O(1) Path Length', status: 'positive', subtext: 'Maximum parallelization', page: 5 }
    ],
    savingsTips: [
      { id: 'tip-acad-1', title: 'Implement FlashAttention-2 Kernel', potentialSavings: '4.5x Faster Inference & -60% VRAM', description: 'Tiling self-attention matrix operations avoids full materialization in high-bandwidth memory (HBM).', action: 'View GPU Implementation Guide', difficulty: 'High Impact' },
      { id: 'tip-acad-2', title: 'Apply LoRA Fine-Tuning (Rank r=8)', potentialSavings: '98% Training VRAM Reduction', description: 'Train low-rank adapter matrices on query/key projections instead of updating all 65M foundation parameters.', action: 'Copy LoRA Configuration Template', difficulty: 'Quick Win' }
    ],
    academicData: {
      researchQuestion: 'Can sequence transduction models achieve state-of-the-art accuracy relying entirely on self-attention without recurrent or convolutional neural networks?',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
      institution: 'Google Brain & Google Research',
      methodology: 'Scaled Dot-Product Attention combined with Multi-Head Attention, residual layer normalization, and sinusoidal positional embeddings.',
      datasetOrSample: 'WMT 2014 English-German dataset (4.5M sentence pairs) and WMT 2014 English-French dataset (36M sentence pairs).',
      keyFindings: [
        'The Transformer model achieves 28.4 BLEU on English-to-German, surpassing existing ensembles.',
        'Multi-Head Attention allows simultaneous focus on both semantic roles and syntactic position.',
        'Training time is reduced by more than an order of magnitude compared to ByteNet and ConvS2S.'
      ],
      limitations: [
        'O(n^2) computational and memory footprint on sequences longer than 4,096 tokens.',
        'Requires substantial dataset scale to prevent overfitting without inductive bias.'
      ],
      conclusions: 'Self-attention is a robust, highly parallelizable replacement for RNNs in sequence modeling tasks, generalizing successfully to English constituency parsing.',
      referencesCount: 42,
      keyReferences: [
        'Bahdanau et al. (2014) - Neural Machine Translation by Jointly Learning to Align and Translate',
        'Hochreiter & Schmidhuber (1997) - Long Short-Term Memory',
        'Gehring et al. (2017) - Convolutional Sequence to Sequence Learning'
      ]
    },
    extractedEntities: [
      { category: 'Organization', key: 'Research Institution', value: 'Google Brain / Google Research', page: 1 },
      { category: 'Concept', key: 'Multi-Head Attention', value: 'Multi-head subspace query-key projection', page: 4 },
      { category: 'Concept', key: 'Scaled Dot-Product Attention', value: 'Softmax(QK^T / sqrt(d_k)) * V', page: 3 },
      { category: 'Concept', key: 'Positional Encoding', value: 'Sinusoidal PE(pos, 2i) = sin(pos/10000^(2i/d))', page: 6 }
    ],
    extractedTables: [
      {
        id: 'tbl-bleu-benchmark',
        tableName: 'WMT 2014 Machine Translation Benchmark Results',
        columns: ['Model Architecture', 'EN-DE (BLEU)', 'EN-FR (BLEU)', 'Training FLOPs (10^18)'],
        rows: [
          { 'Model Architecture': 'ByteNet (Kalchbrenner et al.)', 'EN-DE (BLEU)': '23.75', 'EN-FR (BLEU)': '39.20', 'Training FLOPs (10^18)': '1.0' },
          { 'Model Architecture': 'Deep-Att + PosUnk (Zhou et al.)', 'EN-DE (BLEU)': '24.60', 'EN-FR (BLEU)': '39.90', 'Training FLOPs (10^18)': '8.0' },
          { 'Model Architecture': 'ConvS2S (Gehring et al.)', 'EN-DE (BLEU)': '25.16', 'EN-FR (BLEU)': '40.46', 'Training FLOPs (10^18)': '9.6' },
          { 'Model Architecture': 'Transformer (Base Model)', 'EN-DE (BLEU)': '27.30', 'EN-FR (BLEU)': '38.10', 'Training FLOPs (10^18)': '3.3' },
          { 'Model Architecture': 'Transformer (Big Model)', 'EN-DE (BLEU)': '28.40', 'EN-FR (BLEU)': '41.80', 'Training FLOPs (10^18)': '23.0' }
        ],
        page: 8
      }
    ],
    sampleQuestions: [
      'What is the formula for Scaled Dot-Product Attention?',
      'Why is multi-head attention superior to a single attention function?',
      'What BLEU scores were achieved on the WMT 2014 English-to-German dataset?'
    ],
    chatHistory: [],
    rawText: `MULTI-HEAD ATTENTION MECHANISMS IN NEURAL SEQUENCE TRANSDUCTION
Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin
Google Brain & Google Research
Abstract: We propose the Transformer, a novel architecture based entirely on self-attention mechanisms without recurrence or convolution.
Attention is computed as Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V.
Multi-Head Attention projects queries, keys, and values h=8 times with dimension d_k = 64, d_model = 512.
Results: Achieves 28.4 BLEU on WMT 2014 English-to-German and 41.8 BLEU on English-to-French with 3.5 days of training on 8 NVIDIA P100 GPUs.
Limitations: O(n^2) computational complexity on long sequence lengths n.`,
    pageTexts: [
      {
        page: 1,
        text: `MULTI-HEAD ATTENTION MECHANISMS IN NEURAL SEQUENCE TRANSDUCTION
Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin
Google Brain, Google Research, University of Toronto
ABSTRACT: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The Transformer relies entirely on an attention mechanism to draw global dependencies between input and output, allowing for significantly more parallelization and establishing a new state of the art in translation quality.`
      },
      {
        page: 4,
        text: `SECTION 3.2: SCALED DOT-PRODUCT & MULTI-HEAD ATTENTION
An attention function maps a query and a set of key-value pairs to an output. The output is computed as a weighted sum of values:
Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) V
Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions:
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O where head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V)
In our work, we employ h = 8 parallel attention layers with d_k = d_v = d_model / h = 64.`
      },
      {
        page: 6,
        text: `SECTION 3.5: POSITIONAL ENCODINGS
Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject information about the relative or absolute position of tokens:
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))`
      },
      {
        page: 8,
        text: `SECTION 5: EMPIRICAL BENCHMARKS (WMT 2014 TRANSLATION)
On the WMT 2014 English-to-German translation task, the Transformer (Big) achieves 28.40 BLEU score, surpassing the best previously reported models (including ConvS2S at 25.16 BLEU and ByteNet at 23.75 BLEU).
On the WMT 2014 English-to-French translation task, the Transformer achieves 41.80 BLEU score after 3.5 days of training on 8 NVIDIA P100 GPUs.`
      }
    ]
  },

  // 5. CLOUD INFRASTRUCTURE TAX INVOICE (AWS BILLING)
  {
    id: 'doc-invoice-04',
    name: 'AWS_Cloud_Infrastructure_Tax_Invoice_Jan2026.pdf',
    fileSize: '540 KB',
    pageCount: 3,
    uploadedAt: '1 hour ago',
    detectedDomain: 'billing',
    confidenceScore: 99.1,
    detectionReason: 'Detected vendor tax invoice, GSTIN/PAN numbers, itemized compute line items, SAC codes, and reverse charge tax schedules.',
    summary: {
      tldr: 'Monthly B2B Cloud Services Tax Invoice from Amazon Web Services India Pvt Ltd for ₹84,370 (Base: ₹71,500 + 18% GST: ₹12,870). Detects unattached EBS volumes and unreserved EC2 on-demand instances inflating costs by 24%.',
      keyTakeaways: [
        'Total Invoice Amount: ₹84,370 (including ₹6,435 CGST + ₹6,435 SGST).',
        'Payment Due Date: 15-Feb-2026 via Corporate Auto-Debit.',
        'Top Cost Driver: Amazon EC2 On-Demand Compute (₹48,200, 67.4% of total).',
        'Cost Optimization: 4 Unattached EBS GP3 Volumes (₹4,200/mo waste detected).',
        'Input Tax Credit (ITC): Fully eligible for ₹12,870 GST claim under GSTIN 29AAACA1234F1Z5.'
      ],
      executiveBrief: 'This invoice indicates steady cloud usage. Implementing AWS Compute Savings Plans or 1-Year Reserved Instances on the 3 primary production nodes will lower the monthly compute bill from ₹48,200 to ~₹31,000 (35% recurring savings).',
      actionChecklist: [
        { id: 'act-inv-1', text: 'Delete 4 orphaned/unattached EBS volumes in ap-south-1 (Saves ₹4,200/mo)', priority: 'high', completed: false, category: 'Cost Reduction', page: 2 },
        { id: 'act-inv-2', text: 'Forward invoice to accounts team to claim ₹12,870 GST Input Tax Credit before GSTR-3B due date', priority: 'high', completed: true, category: 'Compliance', page: 1 },
        { id: 'act-inv-3', text: 'Purchase 1-Year Savings Plan for baseline t4g.xlarge instances', priority: 'medium', completed: false, category: 'Optimization', page: 2 }
      ],
      importantDates: [
        { id: 'dt-inv-1', event: 'Invoice Generation Date', date: '01-Feb-2026', type: 'effective', status: 'past', page: 1 },
        { id: 'dt-inv-2', event: 'Payment Due Date (Auto-Debit)', date: '15-Feb-2026', type: 'deadline', status: 'upcoming', page: 1 },
        { id: 'dt-inv-3', event: 'GSTR-3B Input Credit Filing Deadline', date: '20-Feb-2026', type: 'filing', status: 'upcoming', page: 1 }
      ],
      numbersAndMetrics: [
        { id: 'num-inv-1', label: 'Total Payable Amount', value: '₹84,370', category: 'monetary', context: 'Inclusive of 18% GST', page: 1 },
        { id: 'num-inv-2', label: '18% GST Input Credit', value: '₹12,870', category: 'monetary', context: 'Reconcilable under GSTR-2B', page: 1 },
        { id: 'num-inv-3', label: 'EC2 Compute Cost', value: '₹48,200', category: 'monetary', context: '67.4% of total expenditure', page: 2 },
        { id: 'num-inv-4', label: 'Orphaned Storage Waste', value: '₹4,200 / mo', category: 'monetary', context: '4 unattached EBS volumes', page: 2 }
      ],
      risksAndConcerns: [
        { id: 'rsk-inv-1', title: 'Orphaned EBS Disk Volumes Billing Continuously', riskLevel: 'High', plainEnglish: '4 unattached EBS gp3 storage volumes with zero I/O activity are incurring ₹4,200 every month without purpose.', mitigation: 'Terminate or snapshot and delete orphaned EBS volumes in AWS Console.', page: 2 },
        { id: 'rsk-inv-2', title: 'Unreserved On-Demand Compute Premium (38% Surcharge)', riskLevel: 'Warning', plainEnglish: 'Running steady-state production servers on pure On-Demand rates results in ₹17,200/mo overpayment.', mitigation: 'Switch to 1-Year Compute Savings Plan for 38% direct discount.', page: 2 }
      ],
      questionsToConsider: [
        'How can I eliminate the ₹4,200 monthly orphaned EBS storage cost?',
        'What steps are required to claim the ₹12,870 GST input tax credit?',
        'How much will a 1-year Savings Plan reduce our EC2 bill?'
      ]
    },
    metrics: [
      { label: 'Total Payable Amount', value: '₹84,370', change: '+8.4% MoM', status: 'neutral', subtext: 'Includes 18% GST', iconName: 'FileText', page: 1 },
      { label: '18% GST Input Credit', value: '₹12,870', change: 'Eligible ITC', status: 'positive', subtext: 'GSTR-2B reconcilable', iconName: 'CheckCircle', page: 1 },
      { label: 'Identified Cloud Waste', value: '₹4,200 / mo', change: 'Orphan Disks', status: 'negative', subtext: '4 unattached EBS volumes', iconName: 'Trash2', page: 2 },
      { label: 'Payment Due Date', value: '15-Feb-2026', change: 'In 4 Days', status: 'warning', subtext: 'Auto-debit scheduled', iconName: 'Calendar', page: 1 }
    ],
    savingsTips: [
      { id: 'tip-inv-1', title: 'Terminate 4 Orphaned EBS GP3 Volumes', potentialSavings: '₹4,200 / month (₹50,400/yr)', description: '4 detached disk volumes in ap-south-1 have had zero I/O operations for 30 days.', action: 'Execute Cleanup Script', difficulty: 'Quick Win' },
      { id: 'tip-inv-2', title: 'Claim ₹12,870 GST Input Tax Credit (ITC)', potentialSavings: '₹12,870 Tax Refund', description: 'Reconcile AWS GSTIN (29AAACA1234F1Z5) in GSTR-2B before the 20th Feb filing deadline.', action: 'Export GSTR-2B CSV Reconciler', difficulty: 'Immediate' },
      { id: 'tip-inv-3', title: 'Commit to 1-Year EC2 Compute Savings Plan', potentialSavings: '₹17,200 / month (35% Savings)', description: 'Lock in baseline t4g.xlarge instances to drop hourly compute rate from ₹64.78 to ₹42.10.', action: 'View Savings Plan Calculator', difficulty: 'High Impact' }
    ],
    billingData: {
      invoiceNumber: 'INV-AWS-2026-081924',
      vendor: 'Amazon Web Services India Private Limited',
      client: 'DocFin Technologies LLP',
      dueDate: '15-Feb-2026',
      taxBreakdown: [
        { taxType: 'CGST (9%)', rate: '9.0%', amount: 6435 },
        { taxType: 'SGST (9%)', rate: '9.0%', amount: 6435 }
      ],
      totalAmount: 84370,
      lineItems: [
        { description: 'Amazon Elastic Compute Cloud (EC2) - Linux On-Demand (ap-south-1)', qty: 744, unitPrice: 64.78, total: 48200 },
        { description: 'Amazon RDS Aurora PostgreSQL Multi-AZ (db.r6g.large)', qty: 744, unitPrice: 20.30, total: 15100 },
        { description: 'Amazon EBS General Purpose SSD (gp3) Volumes', qty: 1200, unitPrice: 6.83, total: 8200 },
        { description: 'Amazon CloudFront & Data Transfer Out', qty: 2500, unitPrice: 0.00, total: 0 },
        { description: 'AWS Premium Support - Business Tier', qty: 1, unitPrice: 0.00, total: 0 }
      ],
      discountsOrPenalties: ['Free Tier Data Transfer Credit: -$15.00 applied', 'Late payment finance fee: 1.5% per month after Feb 15']
    },
    extractedEntities: [
      { category: 'Organization', key: 'Vendor', value: 'AWS India Pvt Ltd (GSTIN: 29AAACA1234F1Z5)', page: 1 },
      { category: 'Organization', key: 'Client', value: 'DocFin Technologies LLP', page: 1 },
      { category: 'ID/Reference', key: 'Invoice #', value: 'INV-AWS-2026-081924', page: 1 },
      { category: 'Date', key: 'Billing Period', value: '01-Jan-2026 to 31-Jan-2026', page: 1 },
      { category: 'Amount', key: 'Taxable Subtotal', value: '₹71,500.00', page: 1 },
      { category: 'Amount', key: 'Total with Tax', value: '₹84,370.00', page: 1 }
    ],
    extractedTables: [
      {
        id: 'tbl-aws-items',
        tableName: 'Itemized Cloud Service Breakdown & SAC Codes',
        columns: ['Service Category', 'Usage Type / Region', 'Units Billed', 'Rate (₹)', 'Total (₹)'],
        rows: [
          { 'Service Category': 'Amazon EC2 Compute', 'Usage Type / Region': 'ap-south-1-BoxUsage:t4g.xlarge', 'Units Billed': '744 Hours', 'Rate (₹)': '64.78', 'Total (₹)': '48,200' },
          { 'Service Category': 'Amazon RDS Aurora DB', 'Usage Type / Region': 'ap-south-1-InstanceUsage:db.r6g', 'Units Billed': '744 Hours', 'Rate (₹)': '20.30', 'Total (₹)': '15,100' },
          { 'Service Category': 'Amazon EBS Storage', 'Usage Type / Region': 'ap-south-1-VolumeUsage.gp3', 'Units Billed': '1,200 GB-Mo', 'Rate (₹)': '6.83', 'Total (₹)': '8,200' }
        ],
        page: 2
      }
    ],
    sampleQuestions: [
      'What is the total GST breakdown on this invoice?',
      'Which service contributed the most to this month’s bill?',
      'Are there any unutilized or wasted cloud resources identified?',
      'What is the payment due date and consequence of late payment?'
    ],
    chatHistory: [
      {
        id: 'msg-inv-1',
        sender: 'assistant',
        text: '🧾 DocFin Invoice Parser active. **Cloud Infrastructure Invoice** totaled ₹84,370 (includes ₹12,870 GST). I also spotted **₹4,200/mo in unused EBS storage waste** that you can terminate immediately to reduce next month’s bill.',
        timestamp: '09:40 AM',
        citations: [
          { page: 2, section: 'EBS Storage Section', snippet: 'gp3 volumes: 4 unattached volumes detected with zero I/O operations in 30 days.' }
        ]
      }
    ],
    rawText: `AMAZON WEB SERVICES INDIA PRIVATE LIMITED - TAX INVOICE
Invoice No: INV-AWS-2026-081924 | Date: 01-Feb-2026 | Due: 15-Feb-2026 (Auto-Debit)
Vendor GSTIN: 29AAACA1234F1Z5 | Client: DocFin Technologies LLP
Taxable Subtotal: ₹71,500.00 | CGST (9%): ₹6,435.00 | SGST (9%): ₹6,435.00 | Total: ₹84,370.00
Services Billed:
- Amazon EC2 Linux On-Demand (ap-south-1): 744 Hours x ₹64.78 = ₹48,200.00 (67.4%)
- Amazon RDS Aurora PostgreSQL (db.r6g.large): 744 Hours x ₹20.30 = ₹15,100.00
- Amazon EBS gp3 Volumes: 1,200 GB-Mo x ₹6.83 = ₹8,200.00 (Includes 4 unattached volumes waste ₹4,200/mo)
Eligible Input Tax Credit: ₹12,870 reconcilable under GSTR-2B.`,
    pageTexts: [
      {
        page: 1,
        text: `AMAZON WEB SERVICES INDIA PRIVATE LIMITED
COMMERCIAL TAX INVOICE / B2B BILLING STATEMENT
Invoice Number: INV-AWS-2026-081924 | Invoice Date: 01-Feb-2026 | Due Date: 15-Feb-2026
Supplier GSTIN: 29AAACA1234F1Z5 | SAC Code: 998313 (Cloud Computing & Hosting)
Customer: DocFin Technologies LLP | Corporate Account ID: 9481-2094-1182
Taxable Value: ₹71,500.00 | CGST (9.0%): ₹6,435.00 | SGST (9.0%): ₹6,435.00 | Total Invoice Value: ₹84,370.00
Payment Method: Corporate Direct Debit scheduled for 15-Feb-2026.`
      },
      {
        page: 2,
        text: `ITEMIZED USAGE & COST BREAKDOWN (ASIA PACIFIC - MUMBAI REGION)
1. Amazon Elastic Compute Cloud (EC2): ap-south-1-BoxUsage:t4g.xlarge | Units: 744.000 Hrs | Rate: ₹64.78 | Total: ₹48,200.00
2. Amazon Relational Database Service (RDS Aurora): ap-south-1-InstanceUsage:db.r6g.large | Units: 744.000 Hrs | Rate: ₹20.30 | Total: ₹15,100.00
3. Amazon Elastic Block Store (EBS gp3 Volumes): ap-south-1-VolumeUsage.gp3 | Units: 1,200.000 GB-Mo | Rate: ₹6.83 | Total: ₹8,200.00
Flagged Cloud Waste: 4 detached/orphaned gp3 volumes identified with zero I/O operations in 30 days, billing ₹4,200.00/month unnecessarily.`
      },
      {
        page: 3,
        text: `TAX COMPLIANCE, GSTR-2B & SAVINGS RECOMMENDATIONS
GST Compliance Note: Input Tax Credit (ITC) of ₹12,870.00 is fully claimable in GSTR-3B before 20-Feb-2026.
Compute Savings Plan Recommendation: Purchasing a 1-Year All-Upfront Compute Savings Plan for baseline t4g instances reduces hourly EC2 rates by 35%, generating ₹17,200.00 in monthly recurring cost savings.`
      }
    ]
  },

  // 6. MEDICAL LAB REPORT (COMPREHENSIVE METABOLIC PANEL)
  {
    id: 'doc-medical-05',
    name: 'Comprehensive_Metabolic_Panel_Lab_Report.pdf',
    fileSize: '920 KB',
    pageCount: 3,
    uploadedAt: '3 hours ago',
    detectedDomain: 'medical',
    confidenceScore: 99.3,
    detectionReason: 'Detected diagnostic clinical laboratory report, blood biomarker ranges, lipid panel profiles, HbA1c measurements, and physician consult notes.',
    summary: {
      tldr: 'Diagnostic blood report showing elevated Fasting Blood Glucose (128 mg/dL — Pre-diabetes indicator) and low Vitamin D3 (14.2 ng/mL — Deficiency), but normal Kidney and Liver function panels.',
      keyTakeaways: [
        'Fasting Blood Sugar: 128 mg/dL (Flagged: Elevated vs normal range 70-99 mg/dL).',
        'HbA1c Glycated Hemoglobin: 6.2% (Pre-diabetes risk range 5.7% - 6.4%).',
        'Vitamin D3 (25-OH): 14.2 ng/mL (Flagged: Severe Deficiency vs optimal > 30 ng/mL).',
        'Total Cholesterol: 195 mg/dL (Borderline, with LDL at 122 mg/dL).',
        'Renal & Liver Function: Serum Creatinine (0.9 mg/dL) and SGPT/ALT (28 U/L) within healthy reference intervals.'
      ],
      executiveBrief: 'This metabolic test panel highlights early metabolic and micronutrient markers that can be corrected with targeted lifestyle modifications and Vitamin D3 supplementation before progressing to clinical diabetes.',
      actionChecklist: [
        { id: 'act-med-1', text: 'Initiate 60,000 IU Vitamin D3 weekly oral softgel supplementation for 8 weeks', priority: 'high', completed: false, category: 'Supplementation', page: 2 },
        { id: 'act-med-2', text: 'Reduce refined simple sugars and adopt 30-min daily moderate aerobic walking', priority: 'high', completed: false, category: 'Lifestyle', page: 1 },
        { id: 'act-med-3', text: 'Schedule repeat HbA1c and Fasting Glucose blood test in 90 days', priority: 'medium', completed: false, category: 'Follow-up', page: 1 }
      ],
      importantDates: [
        { id: 'dt-med-1', event: 'Sample Collection Date', date: '28-Jan-2026', type: 'effective', status: 'past', page: 1 },
        { id: 'dt-med-2', event: 'Recommended 90-Day Repeat Blood Panel', date: '28-Apr-2026', type: 'deadline', status: 'upcoming', page: 1 }
      ],
      numbersAndMetrics: [
        { id: 'num-med-1', label: 'Fasting Blood Glucose', value: '128 mg/dL', category: 'measurement', context: 'Normal: 70 - 99 mg/dL', page: 1 },
        { id: 'num-med-2', label: 'HbA1c Level', value: '6.2%', category: 'percentage', context: 'Pre-diabetes threshold: 5.7 - 6.4%', page: 1 },
        { id: 'num-med-3', label: 'Vitamin D3 Level', value: '14.2 ng/mL', category: 'measurement', context: 'Optimal: > 30 ng/mL', page: 2 },
        { id: 'num-med-4', label: 'Serum Creatinine', value: '0.9 mg/dL', category: 'measurement', context: 'Healthy normal: 0.7 - 1.2 mg/dL', page: 2 }
      ],
      risksAndConcerns: [
        { id: 'rsk-med-1', title: 'Elevated Fasting Glucose (128 mg/dL) & HbA1c 6.2%', riskLevel: 'Critical', plainEnglish: 'Your blood sugar is currently in the pre-diabetes zone, which elevates cardiovascular and long-term metabolic strain if unaddressed.', mitigation: 'Adopt low-glycemic Mediterranean nutrition and maintain 150 mins of weekly zone-2 exercise.', page: 1 },
        { id: 'rsk-med-2', title: 'Severe Vitamin D3 Micronutrient Deficiency (14.2 ng/mL)', riskLevel: 'High', plainEnglish: 'Severe Vitamin D deficiency impairs calcium absorption, bone density, energy levels, and immune function.', mitigation: 'Take Cholecalciferol (60k IU) once weekly with a healthy fat meal for 8 weeks.', page: 2 }
      ],
      questionsToConsider: [
        'What dietary changes are most effective to reverse pre-diabetes HbA1c levels?',
        'How long does it take to restore Vitamin D3 levels with 60,000 IU softgels?',
        'Are my liver and kidney function markers completely within safe limits?'
      ]
    },
    metrics: [
      { label: 'Fasting Glucose', value: '128 mg/dL', change: 'Elevated', status: 'negative', subtext: 'Target < 99 mg/dL', iconName: 'Activity', page: 1 },
      { label: 'HbA1c Level', value: '6.2%', change: 'Pre-Diabetic', status: 'warning', subtext: 'Normal < 5.7%', iconName: 'Percent', page: 1 },
      { label: 'Vitamin D3', value: '14.2 ng/mL', change: 'Deficient', status: 'negative', subtext: 'Optimal > 30 ng/mL', iconName: 'AlertTriangle', page: 2 },
      { label: 'Kidney Health (Creatinine)', value: '0.9 mg/dL', change: 'Optimal', status: 'positive', subtext: 'Normal 0.7 - 1.2', iconName: 'CheckCircle', page: 2 }
    ],
    savingsTips: [
      { id: 'tip-med-1', title: 'Start 60,000 IU Weekly Vitamin D3 Protocol', potentialSavings: 'Restores Optimal Immunity in 8 Weeks', description: 'Taking 60k IU Cholecalciferol once weekly with dinner raises serum Vitamin D3 from 14.2 to > 40 ng/mL.', action: 'View Supplementation Protocol', difficulty: 'High Impact' },
      { id: 'tip-med-2', title: 'Implement Low-Glycemic Index Food Swaps', potentialSavings: 'Lowers HbA1c by 0.4% - 0.7%', description: 'Replace white polished rice and refined sugars with steel-cut oats, lentils, and leafy greens.', action: 'Download 7-Day Meal Plan', difficulty: 'Quick Win' }
    ],
    medicalData: {
      patientName: 'Roshan Kumar Verma (Age: 32 / M)',
      labName: 'Apollo Diagnostics Super Speciality Laboratory',
      testDate: '28-Jan-2026',
      criticalMarkers: [
        { marker: 'Fasting Blood Glucose', value: '128 mg/dL', referenceRange: '70 - 99 mg/dL', status: 'High', interpretation: 'Impaired Fasting Glucose (Pre-diabetes risk)' },
        { marker: 'HbA1c (Glycated Hemoglobin)', value: '6.2 %', referenceRange: '4.0 - 5.6 %', status: 'High', interpretation: 'Pre-diabetic state; indicates average 3-month elevation' },
        { marker: 'Vitamin D3 (25-OH)', value: '14.2 ng/mL', referenceRange: '30.0 - 100.0 ng/mL', status: 'Low', interpretation: 'Severe micronutrient deficiency' },
        { marker: 'Total Cholesterol', value: '195 mg/dL', referenceRange: '< 200 mg/dL', status: 'Normal', interpretation: 'Borderline high desirable range' },
        { marker: 'Serum Creatinine', value: '0.90 mg/dL', referenceRange: '0.70 - 1.20 mg/dL', status: 'Normal', interpretation: 'Healthy normal renal clearance' }
      ],
      physicianAdviceSummary: 'Adopt moderate caloric restriction, low refined carb diet, 150 mins weekly cardiovascular exercise, and 8-week Vitamin D3 therapy.',
      medicationSchedule: [
        { medicine: 'Cholecalciferol 60k IU', dosage: '1 Softgel weekly', duration: '8 Weeks', timing: 'Post dinner with milk' }
      ]
    },
    extractedEntities: [
      { category: 'Person', key: 'Patient Name', value: 'Roshan Kumar Verma (Age 32 / Male)', page: 1 },
      { category: 'Organization', key: 'Diagnostic Lab', value: 'Apollo Diagnostics Laboratory', page: 1 },
      { category: 'Concept', key: 'Primary Diagnosis', value: 'Pre-Diabetes & Vitamin D3 Deficiency', page: 1 },
      { category: 'Date', key: 'Report Date', value: '28-Jan-2026', page: 1 }
    ],
    extractedTables: [
      {
        id: 'tbl-biomarkers',
        tableName: 'Complete Biomarker Laboratory Test Results',
        columns: ['Test Marker', 'Observed Value', 'Reference Interval', 'Clinical Status'],
        rows: [
          { 'Test Marker': 'Fasting Blood Sugar', 'Observed Value': '128 mg/dL', 'Reference Interval': '70 - 99 mg/dL', 'Clinical Status': 'High (Pre-diabetic)' },
          { 'Test Marker': 'HbA1c Glycated Hemoglobin', 'Observed Value': '6.2 %', 'Reference Interval': '< 5.7 %', 'Clinical Status': 'High' },
          { 'Test Marker': 'Vitamin D3 (25-OH)', 'Observed Value': '14.2 ng/mL', 'Reference Interval': '30 - 100 ng/mL', 'Clinical Status': 'Deficient' },
          { 'Test Marker': 'Serum Creatinine', 'Observed Value': '0.90 mg/dL', 'Reference Interval': '0.70 - 1.20 mg/dL', 'Clinical Status': 'Normal / Healthy' },
          { 'Test Marker': 'SGPT / ALT (Liver)', 'Observed Value': '28.0 U/L', 'Reference Interval': '< 45.0 U/L', 'Clinical Status': 'Normal / Healthy' }
        ],
        page: 1
      }
    ],
    sampleQuestions: [
      'What are the abnormal test results in my blood report?',
      'How severe is my Vitamin D3 deficiency and what is the treatment?',
      'What lifestyle changes can reverse my pre-diabetic HbA1c level?',
      'Are my liver and kidney function markers normal?'
    ],
    chatHistory: [],
    rawText: `APOLLO DIAGNOSTICS SUPER SPECIALITY CLINICAL LABORATORIES
Patient Name: Roshan Kumar Verma | Age: 32 / Male | Date: 28-Jan-2026
Test Results:
- Fasting Blood Sugar: 128 mg/dL (Ref: 70 - 99 mg/dL) [HIGH - Pre-diabetes risk]
- Glycated Hemoglobin (HbA1c): 6.2 % (Ref: < 5.7 %) [HIGH - Pre-diabetic range 5.7 - 6.4%]
- Vitamin D3 (25-OH): 14.2 ng/mL (Ref: 30 - 100 ng/mL) [DEFICIENT - Severe Hypovitaminosis D]
- Serum Creatinine: 0.90 mg/dL (Ref: 0.70 - 1.20 mg/dL) [NORMAL]
- SGPT / ALT: 28.0 U/L (Ref: < 45.0 U/L) [NORMAL]
- Total Cholesterol: 195 mg/dL (Desirable < 200 mg/dL)
Physician Advice: Prescribed Cholecalciferol 60k IU softgel once weekly for 8 weeks post dinner with milk. Reduce refined carbs, 150 mins weekly exercise, repeat HbA1c in 90 days.`,
    pageTexts: [
      {
        page: 1,
        text: `APOLLO DIAGNOSTICS SUPER SPECIALITY LABORATORIES
COMPREHENSIVE METABOLIC PANEL & DIABETIC HEALTH SCREEN
Patient: Roshan Kumar Verma | Age: 32 Years / Male | Specimen ID: AP-BL-2026-98102
Sample Collected: 28-Jan-2026 | Reporting Date: 28-Jan-2026
TEST RESULTS:
1. Fasting Blood Glucose (Plasma): 128.0 mg/dL | Biological Reference Interval: 70.0 - 99.0 mg/dL | Clinical Status: High (Impaired Fasting Glucose / Pre-Diabetes)
2. Glycated Hemoglobin (HbA1c - Whole Blood): 6.2 % | Biological Reference Interval: 4.0 - 5.6 % | Clinical Status: High (Pre-Diabetic 5.7 - 6.4%)`
      },
      {
        page: 2,
        text: `SECTION 2: VITAMIN PROFILES, RENAL CLEARANCE & LIVER ENZYMES
3. Vitamin D3 (25-Hydroxy Cholecalciferol): 14.2 ng/mL | Biological Reference Interval: 30.0 - 100.0 ng/mL | Clinical Status: Severe Deficiency
4. Renal Panel - Serum Creatinine: 0.90 mg/dL | Biological Reference Interval: 0.70 - 1.20 mg/dL | Clinical Status: Normal / Healthy Filtration
5. Hepatic Panel - SGPT / ALT: 28.0 U/L | Biological Reference Interval: < 45.0 U/L | Clinical Status: Normal / Healthy Liver Function
6. Lipid Profile: Total Cholesterol 195 mg/dL | LDL 122 mg/dL | HDL 48 mg/dL | Triglycerides 145 mg/dL.`
      },
      {
        page: 3,
        text: `SECTION 3: CLINICAL CONSULTATION & TREATMENT ROADMAP
Diagnosis: Early Impaired Glucose Tolerance (Pre-Diabetes Stage) and Severe Vitamin D3 Deficiency.
Prescribed Supplementation:
- Cholecalciferol 60,000 IU Oral Softgel: 1 capsule once weekly with milk after dinner for 8 weeks.
Dietary & Lifestyle Advice:
- Eliminate refined table sugars, sweetened beverages, and bakery goods.
- Maintain at least 150 minutes of moderate aerobic exercise (brisk walking/cycling) per week.
- Schedule repeat HbA1c and Fasting Glucose blood test in 90 days (April 2026).`
      }
    ]
  }
];

export { DEMO_DOCUMENTS, type DemoDocument } from './demoDocuments';

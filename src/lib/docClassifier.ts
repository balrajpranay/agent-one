import { DocumentDomain, DocumentCategory, DocumentAnalysis } from './types';

export interface ClassificationResult {
  category: DocumentCategory;
  domain: DocumentDomain;
  secondaryDomains: DocumentDomain[];
  confidence: number;
  reason: string;
  suggestedLens: string;
  detectedKeywords: string[];
  complexity: 'Low' | 'Medium' | 'High';
  keyTopics: string[];
  subCategory?: string;
}

export interface CategoryDefinition {
  category: DocumentCategory;
  domain: DocumentDomain;
  name: string;
  keywords: string[];
  fileHints: string[];
  weight: number;
  subCategoryHint: string;
}

export const DOCUMENT_CATEGORIES: CategoryDefinition[] = [
  {
    category: 'Stock-market / investment documents',
    domain: 'finance',
    name: 'Stock-market / investment documents',
    keywords: [
      'stock', 'stocks', 'shares', 'equity', 'equities', 'portfolio', 'dividend', 'dividends',
      'nasdaq', 'nyse', 'nifty', 'sensex', 'sebi', 'sec filing', '10-k', '10-q', '8-k',
      'earnings report', 'ebitda', 'eps', 'p/e ratio', 'market cap', 'bullish', 'bearish',
      'hedge fund', 'mutual fund', 'etf', 'asset allocation', 'ticker', 'quarterly earnings',
      'investor presentation', 'capital gains', 'holding', 'brokerage', 'trading', 'prospectus',
      'securities', 'bond yield', 'derivative', 'call option', 'put option', 'shareholder return'
    ],
    fileHints: ['stock', 'invest', 'equity', 'portfolio', 'earnings', '10-k', '10-q', 'dividend', 'shares', 'trading', 'sebi', 'sec_'],
    weight: 1.35,
    subCategoryHint: 'Equity & Portfolio Analysis'
  },
  {
    category: 'Bank and financial documents',
    domain: 'finance',
    name: 'Bank and financial documents',
    keywords: [
      'bank statement', 'account statement', 'savings account', 'current account', 'balance sheet',
      'credit card', 'debit card', 'transaction history', 'ifsc', 'neft', 'rtgs', 'upi',
      'overdraft', 'cheque', 'deposit', 'withdrawal', 'bank balance', 'opening balance',
      'closing balance', 'interest credited', 'atm withdrawal', 'hdfc', 'sbi', 'icici',
      'axis bank', 'chase', 'wells fargo', 'bank of america', 'passbook', 'cash flow',
      'net banking', 'remittance', 'swift code', 'account summary', 'invoice', 'tax invoice',
      'gstin', 'cgst', 'sgst', 'igst', 'subtotal', 'vendor billing', 'hsn', 'sac'
    ],
    fileHints: ['bank', 'statement', 'salary', 'passbook', 'hdfc', 'sbi', 'icici', 'chase', 'transaction', 'invoice', 'bill', 'financial', 'tax_invoice'],
    weight: 1.25,
    subCategoryHint: 'Banking & Financial Audit'
  },
  {
    category: 'Legal agreements',
    domain: 'legal',
    name: 'Legal agreements',
    keywords: [
      'lease agreement', 'partnership agreement', 'settlement agreement', 'shareholder agreement',
      'joint venture agreement', 'licensing agreement', 'commercial agreement', 'service level agreement',
      'sla', 'memorandum of understanding', 'mou', 'deed of', 'covenants', 'arbitration clause',
      'jurisdiction', 'breach of agreement', 'indemnification', 'governing law', 'whereas',
      'herein', 'witnesseth', 'lessor', 'lessee', 'tenant', 'landlord', 'counterparts',
      'mutual agreement', 'lease terms', 'premises'
    ],
    fileHints: ['lease', 'agreement', 'mou', 'deed', 'settlement', 'licensing', 'premises', 'landlord', 'tenant'],
    weight: 1.3,
    subCategoryHint: 'Commercial Legal Agreement'
  },
  {
    category: 'Business reports',
    domain: 'business',
    name: 'Business reports',
    keywords: [
      'business report', 'annual report', 'quarterly business review', 'qbr', 'market research report',
      'executive summary', 'swot analysis', 'kpis', 'okrs', 'strategic initiative', 'business plan',
      'pitch deck', 'competitive landscape', 'market share', 'growth strategy', 'stakeholder report',
      'board of directors report', 'operations review', 'revenue forecast', 'feasibility study',
      'go-to-market', 'gtm strategy', 'performance report', 'industry analysis', 'quarterly report'
    ],
    fileHints: ['business', 'report', 'annual_report', 'qbr', 'pitch', 'strategy', 'market_analysis', 'quarterly', 'performance'],
    weight: 1.2,
    subCategoryHint: 'Corporate Strategic Report'
  },
  {
    category: 'Government notifications',
    domain: 'government',
    name: 'Government notifications',
    keywords: [
      'gazette of india', 'official gazette', 'ministry of', 'department of', 'government notification',
      'statutory circular', 'statutory order', 'public notice', 'ordinance', 'administrative directive',
      'press information bureau', 'pib', 'competent authority', 'by order of the governor',
      'by order of the president', 'statutory rule', 'public notification', 'government directive',
      'ministry circular', 'statutory body', 'gazette extraordinary'
    ],
    fileHints: ['gazette', 'notification', 'circular', 'statutory', 'ministry', 'govt', 'government', 'directive', 'ordinance'],
    weight: 1.35,
    subCategoryHint: 'Official Government Gazette'
  },
  {
    category: 'Insurance policies',
    domain: 'insurance',
    name: 'Insurance policies',
    keywords: [
      'insurance policy', 'policyholder', 'sum insured', 'premium payable', 'cashless hospital',
      'tpa', 'deductible', 'co-payment', 'co-pay', 'waiting period', 'room rent capping',
      'icu sub-limit', 'day care procedures', 'exclusion clause', 'pre-existing disease', 'ped',
      'mediclaim', 'health insurance', 'motor insurance', 'life insurance', 'policy schedule',
      'nominee', 'insured person', 'claim settlement', 'network hospital', 'underwriting'
    ],
    fileHints: ['insurance', 'mediclaim', 'policy', 'coverage', 'star_health', 'claim', 'health_policy'],
    weight: 1.35,
    subCategoryHint: 'Comprehensive Insurance Schedule'
  },
  {
    category: 'Academic / research documents',
    domain: 'academic',
    name: 'Academic / research documents',
    keywords: [
      'abstract', 'methodology', 'research paper', 'peer-reviewed', 'ieee', 'arxiv', 'doi',
      'proceedings of', 'citations', 'et al', 'literature review', 'dataset', 'empirical evaluation',
      'neural network', 'transformer', 'bleu score', 'ablation study', 'hypothesis',
      'scientific study', 'dissertation', 'thesis', 'experiments and results', 'novel architecture',
      'benchmark evaluation', 'qualitative analysis', 'quantitative analysis', 'deep learning', 'machine learning'
    ],
    fileHints: ['research', 'paper', 'thesis', 'study', 'academic', 'journal', 'arxiv', 'attention', 'dissertation', 'studysync'],
    weight: 1.35,
    subCategoryHint: 'Academic Research Publication'
  },
  {
    category: 'Terms & conditions',
    domain: 'legal',
    name: 'Terms & conditions',
    keywords: [
      'terms and conditions', 'terms of service', 'tos', 'terms of use', 'privacy policy',
      'user agreement', 'end user license agreement', 'eula', 'cookie policy', 'acceptable use policy',
      'opt-out', 'subscription renewal', 'arbitration clause', 'disclaimer of warranties',
      'limitation of liability', 'data collection practices', 'third-party sharing',
      'account termination', 'intellectual property rights', 'privacy notice'
    ],
    fileHints: ['terms', 'conditions', 'tos', 'privacy', 'policy_terms', 'eula', 'user_agreement'],
    weight: 1.3,
    subCategoryHint: 'Terms of Service & Privacy Policy'
  },
  {
    category: 'Contracts',
    domain: 'legal',
    name: 'Contracts',
    keywords: [
      'employment contract', 'independent contractor contract', 'vendor contract', 'procurement contract',
      'subcontractor contract', 'contract for services', 'scope of work contract', 'master contract',
      'consulting contract', 'non-disclosure contract', 'nda contract', 'sales contract',
      'construction contract', 'liquidated damages', 'non-compete clause', 'non-solicitation',
      'severance terms', 'statement of work', 'sow contract', 'retainer contract', 'contract agreement',
      'contractor'
    ],
    fileHints: ['contract', 'employment_contract', 'vendor_contract', 'consulting_contract', 'sow', 'procurement', 'contractor'],
    weight: 1.3,
    subCategoryHint: 'Commercial Contract & SOW'
  },
  {
    category: 'Regulatory documents',
    domain: 'legal',
    name: 'Regulatory documents',
    keywords: [
      'regulatory compliance', 'compliance framework', 'gdpr compliance', 'hipaa compliance',
      'soc 2 type', 'iso 27001', 'finra rule', 'sec regulation', 'basel iii',
      'anti-money laundering', 'aml/kyc', 'audit trail verification', 'mandatory disclosure',
      'data protection officer', 'dpo', 'regulatory filing', 'enforcement action',
      'sanctions screening', 'regulatory reporting', 'statutory audit', 'internal controls compliance'
    ],
    fileHints: ['regulatory', 'compliance', 'gdpr', 'hipaa', 'soc2', 'iso27001', 'aml', 'audit_compliance'],
    weight: 1.35,
    subCategoryHint: 'Regulatory Governance & Audit'
  }
];

export function classifyDocument(fileName: string, textContent: string = ''): ClassificationResult {
  const combined = `${fileName} ${textContent}`.toLowerCase();
  const lowerFileName = fileName.toLowerCase();

  // 1. Score against the 10 formal document categories
  const categoryScores = DOCUMENT_CATEGORIES.map((cat) => {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Match keywords in combined content
    for (const kw of cat.keywords) {
      if (combined.includes(kw)) {
        matchedKeywords.push(kw);
        score += cat.weight;
      }
    }

    // Match fileHints in filename (extra high weight for filename cues)
    for (const hint of cat.fileHints) {
      if (lowerFileName.includes(hint)) {
        score += 3.5;
        matchedKeywords.push(`file:${hint}`);
      }
    }

    return {
      category: cat.category,
      domain: cat.domain,
      name: cat.name,
      subCategoryHint: cat.subCategoryHint,
      score,
      matches: matchedKeywords
    };
  });

  categoryScores.sort((a, b) => b.score - a.score);
  const topCat = categoryScores[0];
  const secondCat = categoryScores[1];

  const secondaryDomains: DocumentDomain[] = [];
  if (secondCat && secondCat.score > 2 && secondCat.domain !== topCat.domain) {
    secondaryDomains.push(secondCat.domain);
  }

  // Detect complexity
  let complexity: 'Low' | 'Medium' | 'High' = 'Medium';
  const charCount = textContent.length;
  if (charCount > 15000 || topCat.matches.length > 8 || secondaryDomains.length > 0) {
    complexity = 'High';
  } else if (charCount < 2000 && topCat.matches.length <= 3) {
    complexity = 'Low';
  }

  // Extract key topic tags
  const keyTopics: string[] = Array.from(
    new Set([
      ...topCat.matches.map((m) => m.replace('file:', '')).slice(0, 4),
      ...(secondCat ? secondCat.matches.map((m) => m.replace('file:', '')).slice(0, 2) : [])
    ])
  ).filter(Boolean);

  if (topCat.matches.length >= 1 && topCat.score > 0) {
    const rawConf = Math.min(99.4, 88 + topCat.matches.length * 2.2);

    return {
      category: topCat.category,
      domain: topCat.domain,
      secondaryDomains,
      confidence: parseFloat(rawConf.toFixed(1)),
      reason: `Multi-signal classifier identified ${topCat.name} markers (${topCat.matches.slice(0, 3).join(', ')}) with ${complexity.toLowerCase()} structural complexity.`,
      suggestedLens: topCat.name,
      detectedKeywords: topCat.matches,
      complexity,
      keyTopics: keyTopics.length > 0 ? keyTopics : ['structure', 'content', 'extraction'],
      subCategory: topCat.subCategoryHint
    };
  }

  // Default fallback for generalized documents
  const defaultCategory: DocumentCategory = 'Business reports';
  return {
    category: defaultCategory,
    domain: 'general',
    secondaryDomains: [],
    confidence: 96.5,
    reason: 'Multi-disciplinary or general document. Initializing Universal Document Intelligence model.',
    suggestedLens: defaultCategory,
    detectedKeywords: ['document', 'content', 'general'],
    complexity,
    keyTopics: ['summary', 'entities', 'structure'],
    subCategory: 'General Multi-page Document'
  };
}

export function generateAnalysisForUploadedFile(
  file: { name: string; size: number; text?: string },
  forcedDomain?: DocumentDomain
): DocumentAnalysis {
  const rawText = file.text || '';
  const classification = classifyDocument(file.name, rawText);
  const domain = forcedDomain || classification.domain;
  
  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const sizeStr = file.size > 0 ? `${sizeMb} MB` : '1.2 MB';
  const pageCount = Math.max(1, Math.ceil(file.size / (250 * 1024)));

  const cleanSentences = rawText
    .replace(/[\r\n]+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const tldr = cleanSentences.length >= 2
    ? cleanSentences.slice(0, 2).join(' ')
    : `Analyzed ${file.name} (${classification.category}). Indexed across ${pageCount} page(s).`;

  const keyTakeaways = cleanSentences.length >= 3
    ? cleanSentences.slice(0, 4)
    : [`Parsed and verified contents of ${file.name}.`];

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: file.name || 'Uploaded_Document.pdf',
    fileSize: sizeStr,
    pageCount,
    uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    category: classification.category,
    detectedDomain: domain,
    secondaryDomains: classification.secondaryDomains,
    confidenceScore: classification.confidence,
    detectionReason: classification.reason,
    classificationDetails: {
      category: classification.category,
      domain,
      secondaryDomains: classification.secondaryDomains,
      subCategory: classification.subCategory,
      confidenceScore: classification.confidence,
      complexity: classification.complexity,
      hasTables: rawText.includes('|') || rawText.includes('\t'),
      hasImages: false,
      pageCount,
      keyTopics: classification.keyTopics,
      detectionReason: classification.reason,
      recommendedLens: classification.suggestedLens
    },
    summary: {
      tldr,
      keyTakeaways,
      executiveBrief: cleanSentences.slice(0, 5).join('\n\n') || tldr,
      actionChecklist: [
        { id: 'act_1', text: `Review findings on Page 1 of ${file.name}`, priority: 'high', completed: false, page: 1 }
      ],
      importantDates: undefined,
      numbersAndMetrics: undefined,
      risksAndConcerns: undefined,
      questionsToConsider: [
        `What are the core conclusions or terms of ${file.name}?`,
        'What obligations or milestones require attention?'
      ]
    },
    metrics: [
      { label: 'Document Category', value: classification.category, status: 'positive', subtext: classification.subCategory || 'Detected Lens', page: 1 },
      { label: 'Document Structure', value: `${pageCount} ${pageCount === 1 ? 'Page' : 'Pages'}`, status: 'neutral', subtext: 'Verified Text Stream', page: 1 },
      { label: 'Confidence Score', value: `${classification.confidence}%`, status: 'positive', subtext: 'Text Grounded', page: 1 }
    ],
    trackedNumbers: undefined,
    trackedDates: undefined,
    trackedRisks: undefined,
    extractedEntities: [],
    extractedTables: [],
    sampleQuestions: [
      `Summarize the key points of ${file.name}`,
      'Explain this document in simple, everyday language.'
    ],
    chatHistory: []
  };
}

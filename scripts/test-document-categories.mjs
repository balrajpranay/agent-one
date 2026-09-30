import { classifyDocument, DOCUMENT_CATEGORIES } from '../src/lib/docClassifier.ts';
import { SPECIALIZED_AGENTS, getRelevantAgentsForDoc } from '../src/components/ui/AgentGalleryModal.tsx';
import { AUDIT_TEMPLATES } from '../src/components/ui/TemplatesModal.tsx';
import { generateDynamicAnalysisFromContent } from '../src/lib/geminiClient.ts';

console.log('🧪 Starting 10-Category Document Intelligence & Plugin Scoping Verification...\n');

let failedTests = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    failedTests++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

// 1. Verify all 10 document categories exist and have NO emojis in names
console.log('--- 1. Document Categories Validation ---');
const expectedCategories = [
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

assert(DOCUMENT_CATEGORIES.length === 10, `Expected 10 document categories, found ${DOCUMENT_CATEGORIES.length}`);
expectedCategories.forEach((cat) => {
  const found = DOCUMENT_CATEGORIES.find((c) => c.category === cat);
  assert(Boolean(found), `Category "${cat}" is registered in docClassifier`);
  assert(!emojiRegex.test(cat), `Category "${cat}" contains no emojis`);
});

// 2. Verify all Specialized Agents have NO emojis in name, badge, role, description
console.log('\n--- 2. Specialized Agents Zero-Emoji Validation ---');
SPECIALIZED_AGENTS.forEach((agent) => {
  assert(!emojiRegex.test(agent.name), `Agent name "${agent.name}" contains no emojis`);
  assert(!emojiRegex.test(agent.badge), `Agent badge "${agent.badge}" contains no emojis`);
  assert(!emojiRegex.test(agent.role), `Agent role "${agent.role}" contains no emojis`);
  assert(!emojiRegex.test(agent.description), `Agent description contains no emojis`);
});

// 3. Verify all Audit Templates have NO emojis and map to one of the 10 categories
console.log('\n--- 3. Audit Templates Zero-Emoji & Category Mapping ---');
AUDIT_TEMPLATES.forEach((tpl) => {
  assert(!emojiRegex.test(tpl.title), `Template title "${tpl.title}" contains no emojis`);
  assert(!emojiRegex.test(tpl.description), `Template description contains no emojis`);
  assert(!emojiRegex.test(tpl.category), `Template category "${tpl.category}" contains no emojis`);
  assert(expectedCategories.includes(tpl.category), `Template category "${tpl.category}" is one of the 10 formal categories`);
});

// 4. Test Classification across Word (.docx/.doc) and Other Formats (.pdf, .md)
console.log('\n--- 4. Intelligent Classification Across All 10 Categories ---');

const testCases = [
  {
    category: 'Stock-market / investment documents',
    expectedAgentId: 'investment-analyst',
    fileName: 'Apple_Q4_Earnings_Report_and_SEC_10-K_Filing.docx',
    text: 'Apple Inc. reported quarterly earnings with EPS of $1.64 and EBITDA margin expansion across equity shares. Portfolio dividend yield is 1.8% on NASDAQ ticker AAPL.'
  },
  {
    category: 'Bank and financial documents',
    expectedAgentId: 'financial-auditor',
    fileName: 'HDFC_Bank_Savings_Account_Statement_Jan2026.docx',
    text: 'Account statement for HDFC Bank savings account. Opening balance: INR 1,50,000. NEFT salary credit: INR 85,000. Total monthly debit: INR 32,000. Closing balance: INR 2,03,000.'
  },
  {
    category: 'Legal agreements',
    expectedAgentId: 'legal-counsel',
    fileName: 'Commercial_Lease_Agreement_Indiranagar.doc',
    text: 'This Lease Agreement is made between Lessor and Lessee. Security deposit lock-in period of 11 months, annual escalation of 5%, and mutual indemnification terms.'
  },
  {
    category: 'Business reports',
    expectedAgentId: 'business-strategist',
    fileName: 'Enterprise_Strategic_Business_Report_2026.docx',
    text: 'Annual business report and quarterly business review. Executive summary highlights key performance indicators, OKRs, customer acquisition cost reduction, and market share expansion.'
  },
  {
    category: 'Government notifications',
    expectedAgentId: 'government-analyst',
    fileName: 'Ministry_of_Finance_Statutory_Gazette_Notification.pdf',
    text: 'The Gazette of India: Extraordinary. Ministry of Finance statutory order and administrative circular. In exercise of powers conferred under Section 14, mandatory compliance deadline is April 30.'
  },
  {
    category: 'Insurance policies',
    expectedAgentId: 'insurance-specialist',
    fileName: 'Star_Health_Comprehensive_Insurance_Policy_Schedule.docx',
    text: 'Health insurance policy schedule. Policyholder sum insured: 10,00,000. Cashless network hospital coverage, 2-year pre-existing disease waiting period, and 20% co-payment rule.'
  },
  {
    category: 'Academic / research documents',
    expectedAgentId: 'academic-researcher',
    fileName: 'Attention_Mechanism_In_Transformer_Neural_Networks.docx',
    text: 'Abstract: We present an empirical evaluation of multi-head self-attention mechanisms in Transformer neural network architectures. WMT-14 English-to-German benchmark BLEU score is 28.4.'
  },
  {
    category: 'Terms & conditions',
    expectedAgentId: 'terms-privacy-specialist',
    fileName: 'Platform_Terms_of_Service_and_Privacy_Policy.docx',
    text: 'These Terms of Service and Privacy Policy govern your use of the platform. By accessing the service, user agrees to binding arbitration clause, cookie tracking disclosures, and account termination terms.'
  },
  {
    category: 'Contracts',
    expectedAgentId: 'contracts-specialist',
    fileName: 'Independent_Contractor_Services_Agreement_and_SOW.docx',
    text: 'Independent Contractor Services Contract. Scope of work deliverables, milestone payment schedule, non-compete covenant, non-solicitation, and liquidated damages for breach of agreement.'
  },
  {
    category: 'Regulatory documents',
    expectedAgentId: 'compliance-officer',
    fileName: 'Enterprise_GDPR_and_SOC2_Regulatory_Compliance_Framework.docx',
    text: 'Regulatory compliance manual. Alignment with GDPR data subject access rights, HIPAA security controls, SOC 2 Type II audit trail requirements, and data protection officer mandates.'
  }
];

testCases.forEach((tc, idx) => {
  const result = classifyDocument(tc.fileName, tc.text);
  assert(
    result.category === tc.category,
    `Test ${idx + 1}: ${tc.fileName} classified as "${result.category}" (Expected: "${tc.category}")`
  );
  assert(!emojiRegex.test(result.reason), `Test ${idx + 1}: Classification reason has no emojis`);
  assert(!emojiRegex.test(result.suggestedLens), `Test ${idx + 1}: Suggested lens has no emojis`);

  // Build DocumentAnalysis
  const doc = generateDynamicAnalysisFromContent(
    tc.fileName,
    1024 * 100,
    `test-doc-${idx}`,
    tc.text,
    [{ page: 1, text: tc.text }]
  );

  assert(doc.category === tc.category, `DocumentAnalysis category is set to "${tc.category}"`);
  assert(doc.classificationDetails?.category === tc.category, `ClassificationDetails category is set to "${tc.category}"`);

  // Strict Plugin Scoping
  const relevantAgents = getRelevantAgentsForDoc(doc);
  assert(
    relevantAgents.length === 1 && relevantAgents[0].id === tc.expectedAgentId,
    `Document surfaces ONLY matching plugin: "${relevantAgents[0]?.name}" (ID: ${relevantAgents[0]?.id})`
  );

  // Strict Template Scoping
  const matchedTemplates = AUDIT_TEMPLATES.filter((t) => t.category === doc.category);
  assert(
    matchedTemplates.length >= 2,
    `Category "${doc.category}" has ${matchedTemplates.length} pre-engineered templates`
  );
});

// 5. Verify Unrelated Plugins are NOT surfaced when document is loaded
console.log('\n--- 5. Unrelated Plugin Suppression Verification ---');
const stockDoc = generateDynamicAnalysisFromContent(
  'Investment_Stock_Portfolio.docx',
  1024 * 50,
  'test-stock',
  'Equity stock portfolio holding with dividend yield',
  [{ page: 1, text: 'Equity stock portfolio holding' }]
);
const stockPlugins = getRelevantAgentsForDoc(stockDoc);
assert(stockPlugins.length === 1, 'Stock document displays ONLY 1 focused plugin');
assert(stockPlugins[0].id === 'investment-analyst', 'Stock document displays Investment Analyst');
assert(!stockPlugins.some((p) => p.id === 'legal-counsel'), 'Unrelated plugin Legal Counsel is hidden');
assert(!stockPlugins.some((p) => p.id === 'academic-researcher'), 'Unrelated plugin Academic Researcher is hidden');

// 6. Verify All Plugins are accessible when NO document is loaded
console.log('\n--- 6. General Gallery Accessibility Verification ---');
const generalGallery = getRelevantAgentsForDoc(null);
assert(generalGallery.length >= 10, `Full gallery available when no document is loaded (${generalGallery.length} plugins)`);

console.log('\n==========================================');
if (failedTests === 0) {
  console.log('🏆 ALL 10-CATEGORY TESTS PASSED WITH 0 FAILURES!');
  process.exit(0);
} else {
  console.error(`💥 ${failedTests} TEST(S) FAILED.`);
  process.exit(1);
}

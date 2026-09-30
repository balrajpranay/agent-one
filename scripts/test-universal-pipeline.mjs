import { generateDynamicAnalysisFromContent, executeDocumentRAG } from '../src/lib/geminiClient.ts';
import { classifyDocument } from '../src/lib/docClassifier.ts';

console.log('🧪 Starting Universal Document-Aware Pipeline Verification...\n');

let failedTests = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    failedTests++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

async function runTests() {
  // ==========================================
  // TEST 1: Exact StudySync Test PDF (3 Pages: AI, ML, Deep Learning)
  // ==========================================
  console.log('\n--- TEST 1: Exact StudySync Test PDF (3 Pages: AI, ML, Deep Learning) ---');
  const page1Text = 'StudySync Test PDF\nArtificial Intelligence (AI) is the simulation of human intelligence in machines.';
  const page2Text = 'Machine Learning\nMachine Learning (ML) is a subset of AI that allows systems to learn from data.';
  const page3Text = 'Deep Learning\nDeep Learning uses neural networks with multiple hidden layers.';
  const fullText = `${page1Text}\n\n${page2Text}\n\n${page3Text}`;

  const qualDoc = generateDynamicAnalysisFromContent(
    'StudySync_Test_PDF.pdf',
    1024 * 45,
    'doc-studysync-test',
    fullText,
    [
      { page: 1, text: page1Text },
      { page: 2, text: page2Text },
      { page: 3, text: page3Text }
    ]
  );

  assert(qualDoc.pageCount === 3, 'StudySync doc should have 3 pages');

  // Test Query 1: Page 1 Artificial Intelligence
  const aiQuery = await executeDocumentRAG('What is Artificial Intelligence?', qualDoc);
  assert(aiQuery.answer.toLowerCase().includes('simulation of human intelligence in machines'), 'AI query should extract simulation definition from Page 1');
  assert(aiQuery.citations.some((c) => c.page === 1), 'AI query should cite Page 1');

  // Test Query 2: Page 2 Machine Learning
  const mlQuery = await executeDocumentRAG('What is Machine Learning?', qualDoc);
  assert(mlQuery.answer.toLowerCase().includes('subset of ai') || mlQuery.answer.toLowerCase().includes('learn from data'), 'ML query should extract ML definition from Page 2');
  assert(mlQuery.citations.some((c) => c.page === 2), 'ML query should cite Page 2');

  // Test Query 3: Page 3 Deep Learning
  const dlQuery = await executeDocumentRAG('What does Deep Learning use?', qualDoc);
  assert(dlQuery.answer.toLowerCase().includes('neural networks') || dlQuery.answer.toLowerCase().includes('hidden layers'), 'DL query should extract Deep Learning definition from Page 3');
  assert(dlQuery.citations.some((c) => c.page === 3), 'DL query should cite Page 3');

  // ==========================================
  // TEST 2: Academic / Research Paper
  // ==========================================
  console.log('\n--- TEST 2: Academic Research Paper ---');
  const researchText = `Attention Is All You Need.
Abstract: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks.
We propose the Transformer, a novel network architecture based solely on attention mechanisms, dispensing with recurrence entirely.
Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable.
On the WMT 2014 English-to-German translation task, the Transformer achieves 28.4 BLEU, improving over existing results by over 2.0 BLEU.
Methodology: Multi-Head Self-Attention layers combined with positional encoding.
Conclusion: The Transformer model establishes a new state of the art on sequence modeling tasks.`;

  const researchDoc = generateDynamicAnalysisFromContent(
    'Attention_Is_All_You_Need.pdf',
    1024 * 200,
    'test-academic-1',
    researchText,
    [{ page: 1, text: researchText }]
  );

  assert(researchDoc.detectedDomain === 'academic', `Domain should be classified as academic (was: ${researchDoc.detectedDomain})`);
  assert(researchDoc.metrics.some(m => m.label.includes('Topics') || m.label.includes('Rigor') || m.label.includes('Concepts') || m.label.includes('Domain')), 'Metric cards should show academic research domain');
  assert(researchDoc.trackedNumbers && researchDoc.trackedNumbers.length > 0, 'Academic document with 28.4 BLEU should extract real numbers');
  assert(researchDoc.trackedNumbers.some(n => n.value.includes('28.4') || n.value.includes('2.0')), 'Tracked numbers should extract 28.4 BLEU benchmark');

  const researchMethodQuery = await executeDocumentRAG('Explain methodology in simple terms', researchDoc);
  assert(researchMethodQuery.answer.includes('Attention') || researchMethodQuery.answer.includes('Transformer'), 'Methodology query should mention attention or transformer');

  // ==========================================
  // TEST 3: Legal Contract Document
  // ==========================================
  console.log('\n--- TEST 3: Legal Contract Document ---');
  const legalText = `Master Commercial Services Agreement.
This Agreement is entered into between Acme Corporation (Client) and Beta Solutions LLC (Provider).
Term and Termination: Either party may terminate this agreement with 30 days prior written notice.
Indemnification and Liability: The Provider's total aggregate liability under this agreement shall not exceed $50,000.
Governing Law: This agreement shall be governed by the laws of the State of Delaware.
Payment Terms: Client shall pay all undisputed invoices within 15 days of receipt. In the event of default, a 2% monthly late fee applies.`;

  const legalDoc = generateDynamicAnalysisFromContent(
    'Commercial_Services_Agreement.pdf',
    1024 * 150,
    'test-legal-1',
    legalText,
    [{ page: 1, text: legalText }]
  );

  assert(legalDoc.detectedDomain === 'legal', `Domain should be classified as legal (was: ${legalDoc.detectedDomain})`);
  assert(legalDoc.metrics.some(m => m.label.includes('Parties') || m.label.includes('Domain')), 'Legal metrics should reflect legal contracts');
  assert(legalDoc.trackedRisks && legalDoc.trackedRisks.length > 0, 'Legal doc should extract risk/liability clauses');
  assert(legalDoc.trackedNumbers && legalDoc.trackedNumbers.some(n => n.value.includes('$50,000') || n.value.includes('2%')), 'Legal doc should extract $50,000 liability cap');

  const legalRiskQuery = await executeDocumentRAG('Flag liability and penalty clauses', legalDoc);
  assert(legalRiskQuery.answer.includes('liability') || legalRiskQuery.answer.includes('$50,000') || legalRiskQuery.answer.includes('Risk Level'), 'Risk query should assess liability clauses');

  // ==========================================
  // TEST 4: Bank Statement / Financial Document
  // ==========================================
  console.log('\n--- TEST 4: Financial Statement ---');
  const finText = `HDFC Bank Account Statement.
Account Number: 50100234567890.
Opening Balance: ₹1,50,000.00.
Transactions:
01/10/2024 Salary Credit NEFT: ₹85,000.00 Cr.
05/10/2024 AWS Cloud Hosting Debit: ₹12,500.00 Dr.
12/10/2024 Office Lease Rent: ₹35,000.00 Dr.
Closing Balance: ₹1,87,500.00.`;

  const finDoc = generateDynamicAnalysisFromContent(
    'HDFC_Bank_Statement_Oct2024.pdf',
    1024 * 80,
    'test-fin-1',
    finText,
    [{ page: 1, text: finText }]
  );

  assert(finDoc.detectedDomain === 'finance', `Domain should be classified as finance (was: ${finDoc.detectedDomain})`);
  assert(finDoc.trackedNumbers && finDoc.trackedNumbers.length > 0, 'Finance document should extract financial amounts');
  assert(finDoc.trackedNumbers.some(n => n.value.includes('₹') || n.value.includes('85,000')), 'Finance doc should extract INR amounts');

  // ==========================================
  // TEST 5: Document with Tabular Data
  // ==========================================
  console.log('\n--- TEST 5: Document with Structured Table ---');
  const tableText = `Quarterly Performance Metrics
Quarter\tRevenue\tGrowth\tMargin
Q1 2024\t$1.2M\t15%\t22%
Q2 2024\t$1.5M\t25%\t24%
Q3 2024\t$1.8M\t20%\t26%`;

  const tableDoc = generateDynamicAnalysisFromContent(
    'Quarterly_Report.pdf',
    1024 * 60,
    'test-table-1',
    tableText,
    [{ page: 1, text: tableText }]
  );

  assert(tableDoc.extractedTables && tableDoc.extractedTables.length > 0, 'Table document should extract real table');
  assert(tableDoc.extractedTables[0].columns.includes('Revenue') || tableDoc.extractedTables[0].columns.includes('Quarter'), 'Table should have correct columns');

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('\n==========================================');
  if (failedTests === 0) {
    console.log('🏆 ALL 15 UNIVERSAL PIPELINE TESTS PASSED WITH 0 FAILURES!');
    process.exit(0);
  } else {
    console.error(`💥 ${failedTests} TEST(S) FAILED.`);
    process.exit(1);
  }
}

runTests();

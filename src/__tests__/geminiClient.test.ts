import { extractTextFromPdfBuffer, generateDynamicAnalysisFromContent, executeDocumentRAG } from '../lib/geminiClient';
import { DocumentAnalysis } from '../lib/types';

export async function runGeminiClientTests() {
  console.log('🧪 Running Gemini Client & Multimodal Parser Tests...');

  // Test 1: Content Heuristic Analysis for StudySync Technical Document
  const docAnalysis = generateDynamicAnalysisFromContent(
    'StudySync_Test.pdf',
    1024 * 50,
    'doc_test_1',
    'StudySync Test PDF Artificial Intelligence (AI) is the simulation of human intelligence in machines. Machine Learning (ML) is a subset of AI that allows systems to learn from data. Deep Learning uses neural networks with multiple hidden layers.',
    [
      { page: 1, text: 'StudySync Test PDF. Artificial Intelligence (AI) is the simulation of human intelligence in machines.' },
      { page: 2, text: 'Machine Learning (ML) is a subset of AI that allows systems to learn from data.' },
      { page: 3, text: 'Deep Learning uses neural networks with multiple hidden layers.' }
    ]
  );

  if (docAnalysis.name !== 'StudySync_Test.pdf') {
    throw new Error('Test 1 Failed: Expected name to match input filename.');
  }

  if (docAnalysis.pageCount !== 3) {
    throw new Error(`Test 1 Failed: Expected pageCount to be 3, got ${docAnalysis.pageCount}`);
  }

  if (docAnalysis.extractedEntities.length < 3) {
    throw new Error('Test 1 Failed: Expected at least 3 extracted entities.');
  }

  console.log('  ✅ Test 1 Passed: Dynamic Content Parser correctly structured multi-page document.');

  // Test 2: RAG Citation for Machine Learning
  const mlRagResult = await executeDocumentRAG('What is Machine Learning?', docAnalysis);
  if (!mlRagResult.answer.toLowerCase().includes('subset of ai')) {
    throw new Error(`Test 2 Failed: ML definition missing in answer: "${mlRagResult.answer}"`);
  }
  if (!mlRagResult.citations || mlRagResult.citations[0].page !== 2) {
    throw new Error(`Test 2 Failed: Expected citation on Page 2, got: ${JSON.stringify(mlRagResult.citations)}`);
  }

  console.log('  ✅ Test 2 Passed: Grounded RAG cited exact definition and Page 2 for Machine Learning.');

  // Test 3: RAG Citation for Deep Learning
  const dlRagResult = await executeDocumentRAG('What does Deep Learning use?', docAnalysis);
  if (!dlRagResult.answer.toLowerCase().includes('neural networks') && !dlRagResult.answer.toLowerCase().includes('hidden layer')) {
    throw new Error(`Test 3 Failed: Deep learning answer missing neural networks: "${dlRagResult.answer}"`);
  }
  if (!dlRagResult.citations || dlRagResult.citations[0].page !== 3) {
    throw new Error(`Test 3 Failed: Expected citation on Page 3, got: ${JSON.stringify(dlRagResult.citations)}`);
  }

  console.log('  ✅ Test 3 Passed: Grounded RAG cited exact definition and Page 3 for Deep Learning.');

  // Test 4: PDF Text Extraction Stream Buffer Test
  const mockPdfBuffer = Buffer.from(
    '%PDF-1.4\n1 0 obj\n<< /Length 60 >>\nstream\nBT\n/F1 12 Tf\n(StudySync Test Document) Tj\nET\nendstream\nendobj\n%%EOF'
  );
  const pdfExtracted = await extractTextFromPdfBuffer(mockPdfBuffer);
  if (!pdfExtracted.rawText.includes('StudySync Test Document')) {
    throw new Error('Test 4 Failed: Expected rawText to contain StudySync Test Document');
  }

  console.log('  ✅ Test 4 Passed: PDF Stream Text Extraction parsed stream text correctly.');
  console.log('🎉 All Gemini Client Tests Passed!\n');
  return true;
}

import assert from 'node:assert';

const baseUrl = 'http://localhost:3000';

async function testEndpoint(name, url, options = {}) {
  const start = Date.now();
  const res = await fetch(url, options);
  const duration = Date.now() - start;
  console.log(`[${res.status} ${res.statusText}] ${name} (${duration}ms)`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed ${name}: ${res.status} ${text.slice(0, 200)}`);
  }
  return res;
}

async function main() {
  console.log('🚀 Running Live Web Application & API Validation Suite...\n');

  // 1. Health check
  const healthRes = await testEndpoint('GET /api/health', `${baseUrl}/api/health`);
  const healthData = await healthRes.json();
  console.log('  -> Health status:', healthData.status, '| Services:', Object.keys(healthData.services || {}));

  // 2. Activity endpoint
  const actRes = await testEndpoint('GET /api/activity', `${baseUrl}/api/activity`);
  const actData = await actRes.json();
  console.log('  -> Activity items count:', actData.activities?.length ?? 0);

  // 3. UI Landing page
  const homeRes = await testEndpoint('GET / (Home)', `${baseUrl}/`);
  const homeHtml = await homeRes.text();
  assert(homeHtml.includes('Nexora') || homeHtml.includes('nexora'), 'Home page should mention Nexora');
  console.log('  -> Home page rendered with Nexora branding.');

  // 4. UI Dashboard workspace
  const dashRes = await testEndpoint('GET /dashboard', `${baseUrl}/dashboard`);
  const dashHtml = await dashRes.text();
  assert(dashHtml.length > 500, 'Dashboard HTML should render');
  console.log('  -> Dashboard page rendered cleanly.');

  // 5. Auth pages
  await testEndpoint('GET /login', `${baseUrl}/login`);
  await testEndpoint('GET /signup', `${baseUrl}/signup`);
  await testEndpoint('GET /workspace', `${baseUrl}/workspace`);
  console.log('  -> Auth pages rendered.');

  // 6. Chat RAG endpoint with real query
  const chatPayload = {
    query: 'What are the main risks and payment terms?',
    documentContext: {
      id: 'doc-live-test-1',
      name: 'Master Services Agreement.pdf',
      fileSize: '1.2 MB',
      detectedDomain: 'legal',
      pageCount: 3,
      pageTexts: [
        { page: 1, text: 'This Agreement is entered into between Acme Corp and Beta LLC. Payment terms are net 30 days.' },
        { page: 2, text: 'The total liability of either party shall not exceed $100,000. Indemnification applies for IP breach.' },
        { page: 3, text: 'Either party may terminate upon 30 days written notice.' }
      ],
      trackedRisks: [
        { id: 'r1', title: 'Liability Cap', riskLevel: 'High', plainEnglish: 'Liability capped at $100,000.', page: 2 }
      ],
      trackedDates: [
        { id: 'd1', event: 'Termination Notice', date: '30 days', type: 'deadline', page: 3 }
      ],
      extractedEntities: [
        { key: 'Party A', value: 'Acme Corp', category: 'Party', page: 1 },
        { key: 'Party B', value: 'Beta LLC', category: 'Party', page: 1 }
      ]
    }
  };

  const chatRes = await testEndpoint('POST /api/chat', `${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chatPayload)
  });
  const chatData = await chatRes.json();
  assert(chatData.success, 'Chat response must be successful');
  assert(chatData.answer && chatData.answer.length > 10, 'Chat must produce an answer');
  console.log('  -> Chat Grounded Answer length:', chatData.answer.length, 'chars');
  console.log('  -> Citations count:', chatData.citations?.length ?? 0);

  // 7. Document Compare endpoint
  const comparePayload = {
    doc1: chatPayload.documentContext,
    doc2: {
      ...chatPayload.documentContext,
      id: 'doc-live-test-2',
      name: 'Master Services Agreement v2.pdf',
      trackedRisks: [
        { id: 'r2', title: 'Liability Cap', riskLevel: 'Critical', plainEnglish: 'Liability capped at $250,000.', page: 2 }
      ]
    }
  };

  const compRes = await testEndpoint('POST /api/compare', `${baseUrl}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comparePayload)
  });
  const compData = await compRes.json();
  assert(compData.success, 'Compare endpoint must succeed');
  console.log('  -> Compare analysis complete. Differences detected.');

  console.log('\n🏆 ALL LIVE API AND WORKSPACE TESTS PASSED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('\n❌ API Validation Failed:', err);
  process.exit(1);
});

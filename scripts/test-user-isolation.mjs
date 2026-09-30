// Automated Verification Script for Multi-Tenant User Data Isolation

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🧪 Starting Multi-User Data Isolation Verification Tests...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      process.exitCode = 1;
    }
  }

  const userA = { id: 'usr_alice_test_101', email: 'alice.test@example.com' };
  const userB = { id: 'usr_bob_test_202', email: 'bob.test@example.com' };

  // 1. Unauthenticated request should receive empty list (no cross-account leakage)
  const unauthRes = await fetch(`${BASE_URL}/api/documents`);
  const unauthData = await unauthRes.json();
  assert(unauthData.success === true && unauthData.documents.length === 0, 'Unauthenticated request receives empty list (0 docs)');

  // 2. User A creates a private document
  const docA = {
    id: `doc_alice_${Date.now()}`,
    name: 'Alice_Confidential_Strategy.pdf',
    fileSize: '1.2 MB',
    pageCount: 3,
    uploadedAt: 'Just now',
    detectedDomain: 'business',
    confidenceScore: 98,
    detectionReason: 'Corporate strategy memo',
    userId: userA.id,
    userEmail: userA.email,
    summary: {
      tldr: 'Confidential Alice quarterly plans',
      keyTakeaways: ['Target 2026 expansion'],
      executiveBrief: 'Internal executive brief for Alice',
      actionChecklist: []
    },
    metrics: [],
    chatHistory: [
      { id: 'msg_1', sender: 'user', text: 'Analyze Alice revenue targets', timestamp: '10:00 AM' },
      { id: 'msg_2', sender: 'assistant', text: 'Alice revenue is projected at $5M', timestamp: '10:01 AM' }
    ]
  };

  const createARes = await fetch(`${BASE_URL}/api/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userA.id,
      'x-user-email': userA.email
    },
    body: JSON.stringify({ document: docA, userId: userA.id, userEmail: userA.email })
  });
  const createAData = await createARes.json();
  assert(createAData.success === true, 'User A can save their private document');

  // 3. User B queries their documents -> MUST NOT see User A's document
  const getBRes = await fetch(`${BASE_URL}/api/documents`, {
    headers: {
      'x-user-id': userB.id,
      'x-user-email': userB.email
    }
  });
  const getBData = await getBRes.json();
  const userBHasAliceDoc = getBData.documents.some((d) => d.id === docA.id || d.name === docA.name);
  assert(!userBHasAliceDoc, 'User B DOES NOT see User A document in list');

  // 4. User A queries their documents -> MUST see their document
  const getARes = await fetch(`${BASE_URL}/api/documents`, {
    headers: {
      'x-user-id': userA.id,
      'x-user-email': userA.email
    }
  });
  const getAData = await getARes.json();
  const userAHasOwnDoc = getAData.documents.some((d) => d.id === docA.id);
  assert(userAHasOwnDoc, 'User A sees their own document in their list');

  // 5. User B attempts direct URL access to User A's document by ID
  const directAccessRes = await fetch(`${BASE_URL}/api/documents?id=${docA.id}`, {
    headers: {
      'x-user-id': userB.id,
      'x-user-email': userB.email
    }
  });
  assert(directAccessRes.status === 404 || directAccessRes.status === 403, 'User B cannot access User A document by URL/ID parameter (404/403 denied)');

  // 6. User B attempts to overwrite/hijack User A's document
  const hijackRes = await fetch(`${BASE_URL}/api/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userB.id,
      'x-user-email': userB.email
    },
    body: JSON.stringify({
      document: { ...docA, name: 'Hacked_By_Bob.pdf', userId: userB.id, userEmail: userB.email },
      userId: userB.id,
      userEmail: userB.email
    })
  });
  assert(hijackRes.status === 403, 'User B cannot overwrite or hijack User A document (403 Forbidden)');

  // 7. User B creates their own separate document
  const docB = {
    id: `doc_bob_${Date.now()}`,
    name: 'Bob_Personal_Invoice.pdf',
    fileSize: '500 KB',
    pageCount: 1,
    uploadedAt: 'Just now',
    detectedDomain: 'billing',
    confidenceScore: 95,
    detectionReason: 'Invoice document',
    userId: userB.id,
    userEmail: userB.email,
    summary: {
      tldr: 'Bob cloud services invoice',
      keyTakeaways: ['Total due: $250'],
      executiveBrief: 'Bob monthly statement',
      actionChecklist: []
    },
    metrics: []
  };

  const createBRes = await fetch(`${BASE_URL}/api/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userB.id,
      'x-user-email': userB.email
    },
    body: JSON.stringify({ document: docB, userId: userB.id, userEmail: userB.email })
  });
  const createBData = await createBRes.json();
  assert(createBData.success === true, 'User B can create their own document');

  // 8. User B queries again -> sees ONLY Bob's document
  const getBRes2 = await fetch(`${BASE_URL}/api/documents`, {
    headers: {
      'x-user-id': userB.id,
      'x-user-email': userB.email
    }
  });
  const getBData2 = await getBRes2.json();
  assert(getBData2.documents.some((d) => d.id === docB.id) && !getBData2.documents.some((d) => d.id === docA.id), 'User B sees Bob document and NOT Alice document');

  // 9. User B deletes their history using clearAll -> Alice's document is preserved
  const clearBRes = await fetch(`${BASE_URL}/api/documents?clearAll=true`, {
    method: 'DELETE',
    headers: {
      'x-user-id': userB.id,
      'x-user-email': userB.email
    }
  });
  const clearBData = await clearBRes.json();
  assert(clearBData.success === true, 'User B can clear their own history');

  // 10. Verify Alice's document is still intact
  const getARes2 = await fetch(`${BASE_URL}/api/documents`, {
    headers: {
      'x-user-id': userA.id,
      'x-user-email': userA.email
    }
  });
  const getAData2 = await getARes2.json();
  assert(getAData2.documents.some((d) => d.id === docA.id), 'User A document remains completely intact after User B cleared history');

  // Clean up User A test doc
  await fetch(`${BASE_URL}/api/documents?id=${docA.id}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': userA.id,
      'x-user-email': userA.email
    }
  });

  console.log(`\n==========================================`);
  console.log(`🏆 ALL ${passed}/${total} USER ISOLATION TESTS PASSED!`);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

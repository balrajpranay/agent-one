import assert from 'node:assert';
import { DEMO_DOCUMENTS } from '../src/lib/demoDocuments.js';

console.log('🧪 Starting Demo Documents Library Verification Test Suite...\n');

const REQUIRED_CATEGORIES = [
  'Business Report',
  'Legal Agreement',
  'Financial Document',
  'Insurance Policy',
  'Government Notification',
  'Academic / Research Paper',
  'Terms & Conditions',
  'Regulatory Document'
];

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

function testCategoryCoverage() {
  console.log('--- 1. Verifying Required Category Coverage ---');
  assert.strictEqual(DEMO_DOCUMENTS.length, 8, `Expected exactly 8 demo documents, got ${DEMO_DOCUMENTS.length}`);
  console.log(`✅ PASS: Total demo documents count is 8`);

  const presentCategories = DEMO_DOCUMENTS.map((d) => d.demoCategory);
  for (const cat of REQUIRED_CATEGORIES) {
    const found = presentCategories.includes(cat);
    assert.ok(found, `Required category "${cat}" is missing from demo documents`);
    console.log(`✅ PASS: Found demo document category: "${cat}"`);
  }
}

function testDocumentMetadata() {
  console.log('\n--- 2. Verifying Document Name, File Type, and Description ---');
  for (const doc of DEMO_DOCUMENTS) {
    // 1. Name
    assert.ok(doc.name && doc.name.trim().length > 0, `Document ${doc.id} must have a valid name`);
    assert.ok(/\.(pdf|docx)$/i.test(doc.name), `Document "${doc.name}" must end with .pdf or .docx`);

    // 2. File Format
    assert.ok(['PDF', 'DOCX'].includes(doc.fileFormat), `Document "${doc.name}" has invalid fileFormat: ${doc.fileFormat}`);

    // 3. Small description
    assert.ok(
      doc.demoDescription && doc.demoDescription.trim().length >= 20,
      `Document "${doc.name}" must have a descriptive summary (got: ${doc.demoDescription})`
    );

    // 4. Icon
    assert.ok(doc.iconName && doc.iconName.length > 0, `Document "${doc.name}" must have an iconName`);

    console.log(`✅ PASS: Verified metadata for [${doc.fileFormat}] ${doc.demoCategory} -> "${doc.name}"`);
  }
}

function testZeroEmojis() {
  console.log('\n--- 3. Verifying Zero Emojis in Demo Documents ---');
  for (const doc of DEMO_DOCUMENTS) {
    assert.ok(!EMOJI_REGEX.test(doc.name), `Document name "${doc.name}" contains emojis`);
    assert.ok(!EMOJI_REGEX.test(doc.demoCategory), `Category "${doc.demoCategory}" contains emojis`);
    assert.ok(!EMOJI_REGEX.test(doc.demoDescription), `Description "${doc.demoDescription}" contains emojis`);
    assert.ok(!EMOJI_REGEX.test(doc.fileFormat), `FileFormat "${doc.fileFormat}" contains emojis`);
    console.log(`✅ PASS: Zero emojis in "${doc.name}" (${doc.demoCategory})`);
  }
}

function testInsightExtractionData() {
  console.log('\n--- 4. Verifying Document Intelligence & Extraction Data ---');
  for (const doc of DEMO_DOCUMENTS) {
    // Summary
    assert.ok(doc.summary && doc.summary.tldr, `Document "${doc.name}" must have summary.tldr`);
    assert.ok(doc.summary.keyTakeaways && doc.summary.keyTakeaways.length >= 3, `Document "${doc.name}" must have at least 3 key takeaways`);

    // Metrics
    assert.ok(doc.metrics && doc.metrics.length >= 3, `Document "${doc.name}" must have at least 3 metrics cards`);

    // Extracted Entities
    assert.ok(doc.extractedEntities && doc.extractedEntities.length >= 2, `Document "${doc.name}" must have extracted entities`);

    // Page count & size
    assert.ok(doc.pageCount && doc.pageCount > 0, `Document "${doc.name}" must have pageCount > 0`);
    assert.ok(doc.fileSize && doc.fileSize.includes('MB'), `Document "${doc.name}" must have realistic fileSize`);

    // Raw text or page texts for retrieval
    assert.ok(doc.rawText && doc.rawText.length > 50, `Document "${doc.name}" must have rawText`);
    assert.ok(doc.pageTexts && doc.pageTexts.length > 0, `Document "${doc.name}" must have pageTexts`);

    console.log(`✅ PASS: Intelligence verified: ${doc.name} (${doc.pageCount} pages, ${doc.metrics.length} metrics, ${doc.extractedEntities.length} entities)`);
  }
}

function testDragAndDropIdentifierCompatibility() {
  console.log('\n--- 5. Verifying Drag-and-Drop / Click-to-Load Identifier Lookup ---');
  for (const doc of DEMO_DOCUMENTS) {
    // Emulate HTML5 drag event payload lookup
    const payloadId = doc.id;
    const lookupById = DEMO_DOCUMENTS.find((d) => d.id === payloadId);
    assert.strictEqual(lookupById?.id, doc.id, `Failed to resolve demo document by id "${payloadId}"`);

    // Emulate fallback text/plain lookup by name
    const payloadName = doc.name;
    const lookupByName = DEMO_DOCUMENTS.find((d) => d.name === payloadName);
    assert.strictEqual(lookupByName?.id, doc.id, `Failed to resolve demo document by name "${payloadName}"`);

    console.log(`✅ PASS: Instant lookup verified for drag payload "${payloadId}"`);
  }
}

try {
  testCategoryCoverage();
  testDocumentMetadata();
  testZeroEmojis();
  testInsightExtractionData();
  testDragAndDropIdentifierCompatibility();
  console.log('\n==========================================');
  console.log('🏆 ALL 8 DEMO DOCUMENT TESTS PASSED WITH 0 FAILURES!');
  console.log('==========================================\n');
  process.exit(0);
} catch (err) {
  console.error('\n❌ Test Failure:', err.message);
  process.exit(1);
}

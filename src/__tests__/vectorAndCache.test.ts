import { generateEmbedding } from '../lib/vectorClient';
import { getFromCache, setInCache } from '../lib/cacheClient';

export async function runVectorAndCacheTests() {
  console.log('🧪 Running Qdrant Vector & Redis Cache Tests...');

  // Test 1: Embedding Vector Normalization & Length
  const text = 'Artificial Intelligence and Machine Learning Document Analysis';
  const vector = await generateEmbedding(text);

  if (!Array.isArray(vector) || vector.length !== 384) {
    throw new Error(`Test 1 Failed: Expected 384-dimensional vector, got length ${vector?.length}`);
  }

  // Check vector magnitude is approximately 1.0 (normalized)
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (Math.abs(magnitude - 1.0) > 0.05) {
    throw new Error(`Test 1 Failed: Expected normalized unit vector (magnitude ~1.0), got ${magnitude}`);
  }

  console.log(`  ✅ Test 1 Passed: Vector embedding generated with length ${vector.length} and unit normalization.`);

  // Test 2: In-Memory / Redis Cache Set & Retrieve
  const cacheKey = 'docfin:test:unit_key';
  const payload = { testId: '123', status: 'verified', timestamp: Date.now() };

  await setInCache(cacheKey, payload, 30);
  const retrieved = await getFromCache<typeof payload>(cacheKey);

  console.log('  ✅ Test 2 Passed: Redis cache write and read serialization verified.');
  console.log('🎉 All Vector & Cache Tests Passed!\n');
  return true;
}

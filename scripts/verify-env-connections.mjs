import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import neo4j from 'neo4j-driver';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load .env.local
const envPath = path.join(rootDir, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
    process.env[key] = val;
  }
}

console.log('🔍 Testing Nexora Live Environment Connections...\n');

async function testGemini() {
  console.log('--- 1. Testing Google Gemini API ---');
  const key = env.GEMINI_API_KEY;
  console.log(`Key: ${key ? key.substring(0, 8) + '...' : 'MISSING'}`);

  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    if (listRes.ok) {
      const listData = await listRes.json();
      const modelNames = (listData.models || []).map(m => m.name.replace('models/', ''));
      console.log('Available models for key:', modelNames.filter(m => m.includes('flash') || m.includes('pro')));
      
      const preferredOrder = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let candidate = preferredOrder.find(p => modelNames.includes(p)) || 'gemini-3.8-flash';
      console.log(`Testing generation with candidate model: ${candidate}...`);
      
      for (const m of [candidate, ...preferredOrder]) {
        try {
          const genAI = new GoogleGenerativeAI(key);
          const model = genAI.getGenerativeModel({ model: m });
          const result = await model.generateContent('Say "Nexora Gemini Online" in 3 words');
          console.log(`✅ Gemini (${m}) Response:`, result.response.text().trim());
          return true;
        } catch (e) {
          console.warn(`Attempt with ${m} returned:`, e.message.slice(0, 120));
        }
      }
    } else {
      const errText = await listRes.text();
      console.error('List models failed:', listRes.status, errText);
    }
  } catch (err) {
    console.error('❌ Gemini API Error:', err.message);
  }
  return false;
}

async function testNeo4j() {
  console.log('\n--- 2. Testing Neo4j Graph Database ---');
  const uri = env.NEO4J_URI;
  const password = env.NEO4J_PASSWORD;
  const user1 = env.NEO4J_USERNAME || 'neo4j';
  const usernames = [user1, 'neo4j'].filter((v, i, a) => a.indexOf(v) === i);

  for (const username of usernames) {
    console.log(`Attempting connection with user: "${username}" at ${uri}...`);
    let driver;
    try {
      driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
      const serverInfo = await driver.getServerInfo();
      console.log(`✅ Neo4j Connected successfully with user "${username}"! Server agent:`, serverInfo.agent);
      await driver.close();
      return true;
    } catch (err) {
      console.warn(`⚠️ Neo4j failed with user "${username}":`, err.message);
      if (driver) await driver.close().catch(() => {});
    }
  }
  return false;
}

async function testQdrant() {
  console.log('\n--- 3. Testing Qdrant Cloud Vector Database ---');
  const url = env.QDRANT_URL;
  const apiKey = env.QDRANT_API_KEY;
  try {
    const res = await fetch(`${url}/collections`, {
      method: 'GET',
      headers: { 'api-key': apiKey }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    console.log('✅ Qdrant Connected successfully! Collections:', data.result?.collections?.map(c => c.name) || []);
    return true;
  } catch (err) {
    console.error('❌ Qdrant Error:', err.message);
    return false;
  }
}

async function testSupabase() {
  console.log('\n--- 4. Testing Supabase Database & Auth ---');
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const client = createClient(supabaseUrl, serviceKey || anonKey);
    // Test basic query or storage bucket list
    const { data: buckets, error: bucketError } = await client.storage.listBuckets();
    if (bucketError) {
      console.warn('⚠️ Supabase Storage listBuckets error:', bucketError.message);
    } else {
      console.log('✅ Supabase Storage Connected! Buckets:', buckets?.map(b => b.name) || []);
    }
    return true;
  } catch (err) {
    console.error('❌ Supabase Error:', err.message);
    return false;
  }
}

async function main() {
  const g = await testGemini();
  const n = await testNeo4j();
  const q = await testQdrant();
  const s = await testSupabase();

  console.log('\n==========================================');
  console.log(`SUMMARY: Gemini: ${g ? '✅' : '❌'} | Neo4j: ${n ? '✅' : '❌'} | Qdrant: ${q ? '✅' : '❌'} | Supabase: ${s ? '✅' : '❌'}`);
  console.log('==========================================');
}

main().catch(console.error);

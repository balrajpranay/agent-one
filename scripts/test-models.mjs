import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
}

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const models = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest'
];

async function main() {
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('Say OK');
      console.log(`[PASS] ${m} => ${res.response.text().trim()}`);
    } catch (e) {
      console.log(`[FAIL] ${m} => ${e.message}`);
    }
  }
}

main();

import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmbedTextInputSchema } from '../lib/schemaValidate';

export interface EmbedTextResult {
  embeddings: number[][];
  modelUsed: string;
  durationMs: number;
}

export async function embedText(rawInput: unknown): Promise<EmbedTextResult> {
  const input = EmbedTextInputSchema.parse(rawInput);
  const startTime = Date.now();

  const apiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey.length < 10) {
    // Generate deterministic 384-dimensional fallback embeddings if key is missing
    const pseudoEmbeddings = input.texts.map((t) => {
      const vec = new Array(384).fill(0);
      for (let i = 0; i < t.length; i++) {
        const charCode = t.charCodeAt(i);
        vec[i % 384] = (vec[i % 384] + charCode) % 1;
      }
      return vec;
    });

    return {
      embeddings: pseudoEmbeddings,
      modelUsed: 'local-pseudo-embedding',
      durationMs: Date.now() - startTime
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    const embeddings: number[][] = [];
    for (const text of input.texts) {
      const res = await model.embedContent(text);
      embeddings.push(res.embedding.values);
    }

    return {
      embeddings,
      modelUsed: 'text-embedding-004',
      durationMs: Date.now() - startTime
    };
  } catch (err) {
    console.warn('[gemini-server] Failed generating Gemini embeddings, falling back:', err);
    const pseudoEmbeddings = input.texts.map((t) => {
      const vec = new Array(384).fill(0);
      for (let i = 0; i < t.length; i++) {
        const charCode = t.charCodeAt(i);
        vec[i % 384] = (vec[i % 384] + charCode) % 1;
      }
      return vec;
    });

    return {
      embeddings: pseudoEmbeddings,
      modelUsed: 'fallback-pseudo-embedding',
      durationMs: Date.now() - startTime
    };
  }
}

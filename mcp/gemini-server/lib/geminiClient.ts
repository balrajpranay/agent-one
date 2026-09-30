import { GoogleGenerativeAI } from '@google/generative-ai';
import { constructGuardedPrompt, PromptSections } from './promptGuard';

export type TaskType = 'multimodal' | 'extraction' | 'reasoning' | 'qa' | 'comparison' | 'embedding';

/**
 * Server-side model router:
 * Flash for fast/simple/multimodal extraction; Pro for cross-document reasoning and semantic diff
 */
export function getModelNameForTask(task: TaskType): string {
  if (task === 'reasoning' || task === 'comparison') {
    return process.env.GEMINI_PRO_MODEL || 'gemini-3.8-flash';
  }
  return process.env.GEMINI_FLASH_MODEL || 'gemini-3.8-flash';
}

function getGeminiApiKey(customApiKey?: string): string | null {
  const key =
    customApiKey?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();

  if (!key || key.length < 10 || key.includes('your_') || key.includes('default')) {
    return null;
  }
  return key;
}

/**
 * Execute Gemini model call with model routing, prompt guard, and fallback handling
 */
export async function executeGeminiCall(
  task: TaskType,
  promptSections: PromptSections,
  multimodalParts?: Array<{ inlineData: { data: string; mimeType: string } }>,
  customApiKey?: string
): Promise<{ text: string; modelUsed: string; durationMs: number }> {
  const apiKey = getGeminiApiKey(customApiKey);
  const startTime = Date.now();

  const guardedText = constructGuardedPrompt(promptSections);
  const primaryModel = getModelNameForTask(task);

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on gemini-server');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Candidate models with primary model first
  const candidateModels = Array.from(new Set([
    primaryModel,
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
  ]));

  let lastError: Error | null = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const contents: Array<string | { inlineData: { data: string; mimeType: string } }> = [];

      if (multimodalParts && multimodalParts.length > 0) {
        contents.push(...multimodalParts);
      }
      contents.push(guardedText);

      // 12-second timeout per model attempt
      const generationPromise = model.generateContent(contents);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout with model ${modelName}`)), 12000)
      );

      const result = await Promise.race([generationPromise, timeoutPromise]);
      const responseText = result.response.text();

      if (responseText && responseText.trim().length > 0) {
        return {
          text: responseText.trim(),
          modelUsed: modelName,
          durationMs: Date.now() - startTime
        };
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[gemini-server] Model attempt failed (${modelName}):`, lastError.message);
    }
  }

  throw lastError || new Error('All candidate Gemini models failed to generate content');
}

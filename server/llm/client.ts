import { GoogleGenAI } from '@google/genai';
import { LLM_CONFIG } from './config.js';
import { logger } from '../logger.js';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.warn('[Gemini] GEMINI_API_KEY environment variable is missing.');
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-preview' });
  }
  return aiInstance;
}

const responseCache = new Map<string, { result: string; timestamp: number }>();

export async function callGeminiWithRetry(params: {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  responseSchema?: any;
  responseMimeType?: string;
  useCache?: boolean;
}): Promise<string> {
  const { prompt, systemInstruction, model = LLM_CONFIG.primaryModel, responseSchema, responseMimeType, useCache = true } = params;

  // Cache lookup
  const cacheKey = `${model}:${prompt.slice(0, 100)}:${systemInstruction?.slice(0, 50)}`;
  if (useCache && responseCache.has(cacheKey)) {
    const cached = responseCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < LLM_CONFIG.cacheTtlMs) {
      logger.info({ cacheKey }, '[Gemini Cache Hit]');
      return cached.result;
    }
  }

  const ai = getGeminiClient();
  let lastError: any = null;

  for (let attempt = 0; attempt < LLM_CONFIG.maxRetries; attempt++) {
    try {
      logger.info({ model, attempt: attempt + 1 }, '[Gemini Request Attempt]');

      const configObj: any = {};
      if (systemInstruction) configObj.systemInstruction = systemInstruction;
      if (responseSchema) configObj.responseSchema = responseSchema;
      if (responseMimeType) configObj.responseMimeType = responseMimeType;

      // Wrap in 60s timeout promise
      const responsePromise = ai.models.generateContent({
        model,
        contents: prompt,
        config: configObj
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Gemini LLM request timed out after ${LLM_CONFIG.timeoutMs}ms`)), LLM_CONFIG.timeoutMs)
      );

      const response: any = await Promise.race([responsePromise, timeoutPromise]);
      const textResult = response?.text || '';

      if (!textResult) {
        throw new Error('Gemini returned an empty response text.');
      }

      if (useCache) {
        responseCache.set(cacheKey, { result: textResult, timestamp: Date.now() });
      }

      return textResult;
    } catch (err: any) {
      lastError = err;
      logger.error({ attempt: attempt + 1, error: err?.message }, '[Gemini Error]');
      if (attempt < LLM_CONFIG.maxRetries - 1) {
        const delay = LLM_CONFIG.retryDelays[attempt] || 2000;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  // Real Error Throwing — NO fake data generated silently!
  throw new Error(`[Gemini LLM Failure] All ${LLM_CONFIG.maxRetries} retries failed. Cause: ${lastError?.message}`);
}

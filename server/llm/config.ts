export const LLM_CONFIG = {
  primaryModel: 'gemini-2.0-flash',
  fallbackModel: 'gemini-2.0-flash-lite',
  timeoutMs: 60000, // 60s
  maxRetries: 3,
  retryDelays: [1000, 2000, 4000],
  cacheTtlMs: 3600000 // 1 hour
};

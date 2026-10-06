import { runNeuralReasoner } from './aiEngine.js';
import { runMistralReasoner } from './mistralEngine.js';

export type AIProvider = 'gemini' | 'mistral' | 'auto';

type AIOptions = {
  provider?: AIProvider;
  systemInstruction?: string;
  temperature?: number;
};

function getErrorStatus(error: any): number | undefined {
  return (
    error?.status ||
    error?.statusCode ||
    error?.response?.status ||
    error?.rawResponse?.status
  );
}

function getRetryAfter(error: any): string | undefined {
  return (
    error?.response?.headers?.['retry-after'] ||
    error?.headers?.['retry-after']
  );
}

async function tryProvider(
  name: Exclude<AIProvider, 'auto'>,
  prompt: string,
  context: Omit<AIOptions, 'provider'>
) {
  if (name === 'mistral') {
    return runMistralReasoner(prompt, context);
  }

  return runNeuralReasoner(prompt, context);
}

export async function runAIReasoner(
  prompt: string,
  options?: AIOptions
) {
  const provider =
    options?.provider ||
    (process.env.AI_PROVIDER as AIProvider) ||
    'auto';

  const context = {
    systemInstruction: options?.systemInstruction,
    temperature: options?.temperature,
  };

  if (provider !== 'auto') {
    return tryProvider(provider, prompt, context);
  }

  const providers: Exclude<AIProvider, 'auto'>[] = [
    'mistral',
    'gemini',
  ];

  let lastError: unknown;

  for (const currentProvider of providers) {
    try {
      console.log(`ANR-X: trying ${currentProvider} provider...`);

      const result = await tryProvider(
        currentProvider,
        prompt,
        context
      );

      console.log(`ANR-X: ${currentProvider} provider succeeded.`);

      return result;
    } catch (error) {
      lastError = error;

      const status = getErrorStatus(error);
      const retryAfter = getRetryAfter(error);

      console.warn(
        `ANR-X: ${currentProvider} provider unavailable` +
          (status ? ` (${status})` : '') +
          (retryAfter ? ` retry-after=${retryAfter}` : '')
      );
    }
  }

  const error = new Error(
    'AI service is temporarily unavailable. All configured AI providers are currently unavailable or have reached their usage limits. Please try again later.'
  );

  (error as any).status = 503;
  (error as any).cause = lastError;

  throw error;
}

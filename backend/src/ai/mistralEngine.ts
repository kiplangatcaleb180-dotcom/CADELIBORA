import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error('MISTRAL_API_KEY is not configured.');
}

const client = new Mistral({
  apiKey,
});

const MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest';

const DEFAULT_SYSTEM_INSTRUCTION = `
You are ANR-X, the AI assistant for CADELIBORA.

CADELIBORA is a technology, research, innovation, education, and knowledge platform.

Your responsibilities:
- Help users understand software engineering, technology, research, AI, education, and related technical subjects.
- Give accurate, useful, clearly structured answers.
- Only claim CADELIBORA-specific information that has actually been provided in the conversation or context.
- Do not invent research papers, projects, technologies, statistics, or platform capabilities.
- Explain technical concepts at an appropriate level.
- For code, provide secure and maintainable examples.
- If information is uncertain or unavailable, say so clearly.
`;

export async function runMistralReasoner(
  prompt: string,
  context?: {
    systemInstruction?: string;
    temperature?: number;
  }
) {
  const systemInstruction =
    context?.systemInstruction?.trim() || DEFAULT_SYSTEM_INSTRUCTION;

  const temperature =
    typeof context?.temperature === 'number'
      ? Math.min(Math.max(context.temperature, 0), 1.5)
      : 0.2;

  const response = await client.chat.complete({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: systemInstruction,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature,
    maxTokens: 2048,
  });

  const content = response.choices?.[0]?.message?.content;

  const text =
    typeof content === 'string'
      ? content.trim()
      : Array.isArray(content)
        ? content
            .map((part: any) =>
              typeof part === 'string'
                ? part
                : typeof part?.text === 'string'
                  ? part.text
                  : ''
            )
            .join('')
            .trim()
        : '';

  if (!text) {
    throw new Error('Mistral returned an empty response.');
  }

  return text;
}

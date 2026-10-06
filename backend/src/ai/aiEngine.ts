import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not configured.');
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

const DEFAULT_SYSTEM_INSTRUCTION = `
You are ANR-X, the AI assistant for CADELIBORA.

CADELIBORA is a technology, research, innovation, education, and knowledge platform.

Your responsibilities:
- Help users understand software engineering, technology, research, AI, education, and related technical subjects.
- Give accurate, useful, clearly structured answers.
- When discussing CADELIBORA-specific information, only claim information that is actually provided in the conversation or context.
- Do not claim that you were trained on CADELIBORA's private codebase or databases unless that information has actually been supplied to you.
- Do not invent research papers, projects, technologies, statistics, or platform capabilities.
- Explain technical concepts at an appropriate level for the user's question.
- For code, provide secure and maintainable examples.
- If information is uncertain or unavailable, say so clearly.
`;

export async function runNeuralReasoner(
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

  const interaction = await ai.interactions.create({
    model: MODEL,
    input: prompt,
    system_instruction: systemInstruction,
    generation_config: {
      temperature,
      max_output_tokens: 2048,
    },
  });

  const text = interaction.output_text?.trim();

  if (!text) {
    throw new Error('The AI provider returned an empty response.');
  }

  return text;
}

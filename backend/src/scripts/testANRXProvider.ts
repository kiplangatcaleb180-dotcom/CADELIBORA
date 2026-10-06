import 'dotenv/config';
import { runAIReasoner } from '../ai/aiProvider.js';

console.log('AI_PROVIDER:', process.env.AI_PROVIDER);
console.log('GEMINI_API_KEY configured:', Boolean(process.env.GEMINI_API_KEY));
console.log('MISTRAL_API_KEY configured:', Boolean(process.env.MISTRAL_API_KEY));

const response = await runAIReasoner(
  'Answer briefly: What is CADELIBORA?',
  {
    systemInstruction:
      'You are ANR-X, the CADELIBORA AI reasoner. Answer clearly and briefly.',
    temperature: 0.2,
  }
);

console.log('\n===== ANR-X RESPONSE =====\n');
console.log(response);
console.log('\n==========================\n');

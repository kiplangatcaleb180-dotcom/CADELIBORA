import { Router } from 'express';
import {
  processAIChat,
  getUserConversations,
  getConversationById,
  deleteConversation,
} from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const aiChatRateLimiter = rateLimiter(30, 60 * 1000);

router.get('/health', (_req, res) => {
  const mistralConfigured = Boolean(process.env.MISTRAL_API_KEY);
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);

  const provider =
    (process.env.AI_PROVIDER as 'auto' | 'mistral' | 'gemini' | undefined) ||
    'auto';

  const availableProviders =
    provider === 'mistral'
      ? mistralConfigured ? ['mistral'] : []
      : provider === 'gemini'
        ? geminiConfigured ? ['gemini'] : []
        : [
            ...(mistralConfigured ? ['mistral'] : []),
            ...(geminiConfigured ? ['gemini'] : []),
          ];

  const status = availableProviders.length > 0 ? 'ONLINE' : 'DEGRADED';

  return res.status(status === 'ONLINE' ? 200 : 503).json({
    status,
    provider,
    providers: {
      mistral: mistralConfigured ? 'CONFIGURED' : 'UNAVAILABLE',
      gemini: geminiConfigured ? 'CONFIGURED' : 'UNAVAILABLE',
    },
    availableProviders,
  });
});

router.get('/conversations', authenticate, getUserConversations);
router.get('/conversations/:id', authenticate, getConversationById);
router.delete('/conversations/:id', authenticate, deleteConversation);

router.post(
  '/chat',
  authenticate,
  aiChatRateLimiter,
  processAIChat
);

export default router;

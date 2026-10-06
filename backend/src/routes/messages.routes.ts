import { Router } from 'express';
import { getConversations, getConversationMessages, sendMessage, startConversation } from '../controllers/messages.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/conversations', authenticate, getConversations);
router.post('/conversations', authenticate, startConversation);
router.get('/conversations/:id/messages', authenticate, getConversationMessages);
router.post('/conversations/:id/messages', authenticate, sendMessage);

export default router;

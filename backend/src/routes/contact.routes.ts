import { Router } from 'express';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { submitContactInquiry } from '../controllers/contact.controller.js';

const router = Router();
router.post('/', rateLimiter(5, 60 * 1000), submitContactInquiry);

export default router;

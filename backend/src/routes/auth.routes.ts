import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  getMe,
  updateProfile,
  changePassword,
  getMyAnalytics,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Authentication rate limits
const authRateLimiter = rateLimiter(10, 15 * 60 * 1000);

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/verify-email', authRateLimiter, verifyEmail);

router.get('/me', authenticate, getMe);
router.get('/analytics/me', authenticate, getMyAnalytics);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

export default router;

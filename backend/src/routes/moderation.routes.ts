import { Router } from 'express';
import { actOnModerationReport, createModerationReport, getModerationDashboard } from '../controllers/moderation.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();
router.post('/reports', authenticate, createModerationReport);
router.use(authenticate, authorizeRoles('MODERATOR', 'ADMIN', 'SUPER_ADMIN'));
router.get('/dashboard', getModerationDashboard);
router.patch('/reports/:reportId', actOnModerationReport);
export default router;

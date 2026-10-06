import { Router } from 'express';
import { getUserNotifications, markAsRead, markAllAsRead } from '../controllers/notifications.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getUserNotifications);
router.put('/read-all', authenticate, markAllAsRead);
router.put('/:notificationId/read', authenticate, markAsRead);

export default router;

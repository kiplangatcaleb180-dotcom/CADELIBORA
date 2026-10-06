import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getUserNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return res.json({ success: true, notifications });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function markAsRead(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { notificationId } = req.params;

    const notification = await prisma.notification.update({
      where: { id: notificationId, userId: req.user.userId },
      data: { isRead: true },
    });

    return res.json({ success: true, notification });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function markAllAsRead(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    await prisma.notification.updateMany({
      where: { userId: req.user.userId, isRead: false },
      data: { isRead: true },
    });

    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

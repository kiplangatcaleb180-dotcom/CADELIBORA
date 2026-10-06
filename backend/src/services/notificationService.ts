import prisma from '../config/db.js';

export async function sendNotification(userId: string, title: string, message: string, type = 'system', link?: string) {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  });
}

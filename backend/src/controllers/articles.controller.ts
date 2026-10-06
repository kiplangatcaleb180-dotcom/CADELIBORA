import { Request, Response } from 'express';
import prisma from '../config/db.js';

export async function getArticles(req: Request, res: Response) {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      include: { author: { select: { fullName: true, avatarUrl: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, articles });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

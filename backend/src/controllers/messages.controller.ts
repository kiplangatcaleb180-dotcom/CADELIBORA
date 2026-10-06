import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getConversations(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const participations = await prisma.conversationParticipant.findMany({
      where: { userId: req.user.userId },
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: { select: { id: true, fullName: true, avatarUrl: true, role: true } } },
            },
            messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
    });

    const conversations = participations.map((p) => p.conversation);
    return res.json({ success: true, conversations });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getConversationMessages(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const membership = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: id, userId: req.user.userId } },
    });

    if (!membership) return res.status(403).json({ success: false, message: 'Forbidden' });

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: { sender: { select: { id: true, fullName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ success: true, messages });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function sendMessage(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const membership = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: id, userId: req.user.userId } },
    });

    if (!membership) return res.status(403).json({ success: false, message: 'Forbidden' });

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: req.user.userId,
        content,
      },
      include: { sender: { select: { id: true, fullName: true, avatarUrl: true } } },
    });

    return res.status(201).json({ success: true, message });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function startConversation(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { recipientId } = req.body;

    if (!recipientId || recipientId === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Valid recipient ID required' });
    }

    const myParticipations = await prisma.conversationParticipant.findMany({
      where: { userId: req.user.userId },
      select: { conversationId: true },
    });

    const myConvIds = myParticipations.map((p) => p.conversationId);

    const existing = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId: { in: myConvIds },
        userId: recipientId,
      },
    });

    if (existing) {
      return res.json({ success: true, conversationId: existing.conversationId });
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId: req.user.userId }, { userId: recipientId }],
        },
      },
    });

    return res.status(201).json({ success: true, conversationId: conversation.id });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

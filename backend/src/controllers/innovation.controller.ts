import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getInnovationConcepts(req: Request, res: Response) {
  try {
    const concepts = await prisma.innovationConcept.findMany({
      include: { author: { select: { fullName: true, avatarUrl: true, role: true } } },
      orderBy: { votesCount: 'desc' },
    });
    return res.json({ success: true, concepts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getConceptById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const concept = await prisma.innovationConcept.findUnique({
      where: { id },
      include: { author: { select: { fullName: true, avatarUrl: true, role: true } } },
    });

    if (!concept) {
      return res.status(404).json({ success: false, message: 'Innovation concept not found' });
    }

    return res.json({ success: true, concept });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createInnovationConcept(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { title, category, summary, fullDetails } = req.body;

    const concept = await prisma.innovationConcept.create({
      data: {
        title,
        category,
        summary,
        fullDetails,
        authorId: req.user.userId,
      },
      include: { author: { select: { fullName: true, avatarUrl: true } } },
    });

    return res.status(201).json({ success: true, concept });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function voteConcept(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { conceptId } = req.params;
    const userId = req.user.userId;

    const concept = await prisma.innovationConcept.findUnique({
      where: { id: conceptId },
    });

    if (!concept) {
      return res.status(404).json({
        success: false,
        message: 'Innovation concept not found',
      });
    }

    const existingVote = await prisma.innovationVote.findUnique({
      where: {
        conceptId_userId: {
          conceptId,
          userId,
        },
      },
    });

    if (existingVote) {
      return res.status(409).json({
        success: false,
        message: 'You have already voted for this concept',
        concept,
      });
    }

    const [, updatedConcept] = await prisma.$transaction([
      prisma.innovationVote.create({
        data: {
          conceptId,
          userId,
        },
      }),
      prisma.innovationConcept.update({
        where: { id: conceptId },
        data: { votesCount: { increment: 1 } },
      }),
    ]);

    return res.json({
      success: true,
      message: 'Vote recorded successfully',
      concept: updatedConcept,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

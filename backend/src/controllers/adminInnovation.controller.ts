import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// ============================================================
// INNOVATION CONCEPTS
// ============================================================

export async function getAdminInnovationConcepts(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const concepts = await prisma.innovationConcept.findMany({
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    return res.json({
      success: true,
      concepts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createAdminInnovationConcept(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const {
      title,
      category,
      conceptStage,
      summary,
      fullDetails,
      authorId,
    } = req.body;

    if (!title || !category || !summary || !fullDetails) {
      return res.status(400).json({
        success: false,
        message:
          'Title, category, summary and full details are required.',
      });
    }

    const finalAuthorId = authorId || req.user?.userId;

    if (!finalAuthorId) {
      return res.status(400).json({
        success: false,
        message: 'An author is required.',
      });
    }

    const author = await prisma.user.findUnique({
      where: { id: finalAuthorId },
      select: { id: true },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Selected author not found.',
      });
    }

    const concept = await prisma.innovationConcept.create({
      data: {
        title: String(title).trim(),
        category: String(category).trim(),
        conceptStage: conceptStage?.trim() || 'Idea',
        summary: String(summary).trim(),
        fullDetails: String(fullDetails).trim(),
        authorId: finalAuthorId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'CREATE_INNOVATION',
          entity: 'InnovationConcept',
          detailsJson: JSON.stringify({
            conceptId: concept.id,
            title: concept.title,
          }),
        },
      });
    }

    return res.status(201).json({
      success: true,
      concept,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateAdminInnovationConcept(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { conceptId } = req.params;

    const existing = await prisma.innovationConcept.findUnique({
      where: { id: conceptId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Innovation concept not found.',
      });
    }

    const {
      title,
      category,
      conceptStage,
      summary,
      fullDetails,
      authorId,
    } = req.body;

    if (authorId !== undefined) {
      const author = await prisma.user.findUnique({
        where: { id: authorId },
        select: { id: true },
      });

      if (!author) {
        return res.status(404).json({
          success: false,
          message: 'Selected author not found.',
        });
      }
    }

    const concept = await prisma.innovationConcept.update({
      where: { id: conceptId },
      data: {
        ...(title !== undefined && {
          title: String(title).trim(),
        }),
        ...(category !== undefined && {
          category: String(category).trim(),
        }),
        ...(conceptStage !== undefined && {
          conceptStage: String(conceptStage).trim(),
        }),
        ...(summary !== undefined && {
          summary: String(summary).trim(),
        }),
        ...(fullDetails !== undefined && {
          fullDetails: String(fullDetails).trim(),
        }),
        ...(authorId !== undefined && {
          authorId,
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'UPDATE_INNOVATION',
          entity: 'InnovationConcept',
          detailsJson: JSON.stringify({
            conceptId,
            title: concept.title,
          }),
        },
      });
    }

    return res.json({
      success: true,
      concept,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteAdminInnovationConcept(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { conceptId } = req.params;

    const concept = await prisma.innovationConcept.findUnique({
      where: { id: conceptId },
      select: {
        id: true,
        title: true,
      },
    });

    if (!concept) {
      return res.status(404).json({
        success: false,
        message: 'Innovation concept not found.',
      });
    }

    await prisma.innovationConcept.delete({
      where: { id: conceptId },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'DELETE_INNOVATION',
          entity: 'InnovationConcept',
          detailsJson: JSON.stringify({
            conceptId,
            title: concept.title,
          }),
        },
      });
    }

    return res.json({
      success: true,
      message: 'Innovation concept deleted successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

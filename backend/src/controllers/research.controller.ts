import { Request, Response } from 'express';
import prisma from '../config/db.js';

export async function getAllResearchProjects(req: Request, res: Response) {
  try {
    const { area, search } = req.query;
    const where: any = {};

    if (area) where.area = String(area);

    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    const projects = await prisma.researchProject.findMany({
      where,
      include: {
        leadResearcher: {
          select: {
            fullName: true,
            avatarUrl: true,
            title: true,
          },
        },
        publications: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      projects,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getResearchProjectBySlug(
  req: Request,
  res: Response
) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Research project slug is required.',
      });
    }

    const project = await prisma.researchProject.findUnique({
      where: { slug: String(slug) },
      include: {
        leadResearcher: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            title: true,
          },
        },
        publications: {
          orderBy: { year: 'desc' },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Research project not found.',
      });
    }

    return res.json({
      success: true,
      project,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getPublications(req: Request, res: Response) {
  try {
    const publications = await prisma.publication.findMany({
      include: { researchProject: true },
      orderBy: { year: 'desc' },
    });

    return res.json({
      success: true,
      publications,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getMyResearchProjects(
  req: import('express').Request,
  res: Response
) {
  try {
    const authReq = req as import('../middleware/auth.js').AuthenticatedRequest;

    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const projects = await prisma.researchProject.findMany({
      where: {
        leadResearcherId: authReq.user.userId,
      },
      include: {
        leadResearcher: {
          select: {
            fullName: true,
            avatarUrl: true,
            title: true,
          },
        },
        publications: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      projects,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getLibraryResources(req: Request, res: Response) {
  try {
    const { category, type, search } = req.query;
    const where: any = {};
    if (category) where.category = String(category);
    if (type) where.resourceType = String(type);
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
        { author: { contains: String(search) } },
      ];
    }

    const resources = await prisma.libraryResource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, resources });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getLibraryResourceById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const resource = await prisma.libraryResource.findUnique({ where: { id } });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    return res.json({ success: true, resource });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function saveResource(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    const saved = await prisma.savedResource.upsert({
      where: { userId_resourceId: { userId: req.user.userId, resourceId: id } },
      update: {},
      create: { userId: req.user.userId, resourceId: id },
    });

    return res.status(201).json({ success: true, saved });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function unsaveResource(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    await prisma.savedResource.deleteMany({
      where: { userId: req.user.userId, resourceId: id },
    });

    return res.json({ success: true, message: 'Resource removed from saved list' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSavedResources(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const saved = await prisma.savedResource.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });

    const resourceIds = saved.map((s) => s.resourceId);
    const resources = await prisma.libraryResource.findMany({
      where: { id: { in: resourceIds } },
    });

    return res.json({ success: true, resources });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getKnowledgeCenter(req: Request, res: Response) {
  try {
    const articles = await prisma.article.findMany({ where: { isPublished: true }, take: 5, orderBy: { createdAt: 'desc' } });
    const resources = await prisma.libraryResource.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
    const publications = await prisma.publication.findMany({ take: 5 });
    const research = await prisma.researchProject.findMany({ take: 5, orderBy: { createdAt: 'desc' } });

    return res.json({
      success: true,
      knowledge: {
        articles,
        resources,
        publications,
        research,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

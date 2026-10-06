import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

function jsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value.split('\n').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function requiredText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function getAdminServices(req: AuthenticatedRequest, res: Response) {
  try {
    const [services, caseStudies] = await Promise.all([
      prisma.service.findMany({ orderBy: { name: 'asc' } }),
      prisma.caseStudy.findMany({ orderBy: { title: 'asc' } }),
    ]);

    return res.json({ success: true, services, caseStudies });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createAdminService(req: AuthenticatedRequest, res: Response) {
  try {
    const name = requiredText(req.body.name);
    const slug = requiredText(req.body.slug);
    const icon = requiredText(req.body.icon) || 'Cpu';
    const shortDesc = requiredText(req.body.shortDesc);
    const fullDesc = requiredText(req.body.fullDesc);
    const currency = requiredText(req.body.currency) || 'USD';
    const price = Number(req.body.price ?? 0);

    if (!name || !slug || !shortDesc || !fullDesc) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug, short description and full description are required.',
      });
    }
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ success: false, message: 'Price must be a non-negative number.' });
    }

    const service = await prisma.service.create({
      data: {
        name, slug, icon, shortDesc, fullDesc, currency, price,
        featuresJson: jsonArray(req.body.featuresJson),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_SERVICE',
        entity: 'Service',
        detailsJson: { serviceId: service.id, name: service.name },
      },
    });

    return res.status(201).json({ success: true, service });
  } catch (error: any) {
    const status = error?.code === 'P2002' ? 409 : 500;
    return res.status(status).json({
      success: false,
      message: status === 409 ? 'A service with that slug already exists.' : error.message,
    });
  }
}

export async function updateAdminService(req: AuthenticatedRequest, res: Response) {
  try {
    const { serviceId } = req.params;
    const existing = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!existing) return res.status(404).json({ success: false, message: 'Service not found.' });

    const data: Record<string, unknown> = {};
    for (const key of ['name', 'slug', 'icon', 'shortDesc', 'fullDesc', 'currency'] as const) {
      if (req.body[key] !== undefined) {
        const value = requiredText(req.body[key]);
        if (!value) return res.status(400).json({ success: false, message: `${key} cannot be empty.` });
        data[key] = value;
      }
    }
    if (req.body.price !== undefined) {
      const price = Number(req.body.price);
      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({ success: false, message: 'Price must be a non-negative number.' });
      }
      data.price = price;
    }
    if (req.body.featuresJson !== undefined) data.featuresJson = jsonArray(req.body.featuresJson);

    const service = await prisma.service.update({ where: { id: serviceId }, data });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'UPDATE_SERVICE',
        entity: 'Service',
        detailsJson: { serviceId, name: service.name },
      },
    });

    return res.json({ success: true, service });
  } catch (error: any) {
    const status = error?.code === 'P2002' ? 409 : 500;
    return res.status(status).json({
      success: false,
      message: status === 409 ? 'A service with that slug already exists.' : error.message,
    });
  }
}

export async function deleteAdminService(req: AuthenticatedRequest, res: Response) {
  try {
    const { serviceId } = req.params;
    const existing = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!existing) return res.status(404).json({ success: false, message: 'Service not found.' });

    const linkedOrders = await prisma.order.count({ where: { serviceId } });
    if (linkedOrders > 0) {
      return res.status(409).json({
        success: false,
        message: 'This service has orders linked to it. Keep it available to preserve order history.',
      });
    }

    await prisma.service.delete({ where: { id: serviceId } });
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'DELETE_SERVICE',
        entity: 'Service',
        detailsJson: { serviceId, name: existing.name },
      },
    });

    return res.json({ success: true, message: 'Service deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createAdminCaseStudy(req: AuthenticatedRequest, res: Response) {
  try {
    const title = requiredText(req.body.title);
    const clientName = requiredText(req.body.clientName);
    const industry = requiredText(req.body.industry);
    const challenge = requiredText(req.body.challenge);
    const solution = requiredText(req.body.solution);
    const coverImage = requiredText(req.body.coverImage);

    if (!title || !clientName || !industry || !challenge || !solution || !coverImage) {
      return res.status(400).json({
        success: false,
        message: 'Title, client, industry, challenge, solution and cover image are required.',
      });
    }

    const caseStudy = await prisma.caseStudy.create({
      data: {
        title, clientName, industry, challenge, solution, coverImage,
        resultsJson: jsonArray(req.body.resultsJson),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'CREATE_CASE_STUDY',
        entity: 'CaseStudy',
        detailsJson: { caseStudyId: caseStudy.id, title: caseStudy.title },
      },
    });

    return res.status(201).json({ success: true, caseStudy });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateAdminCaseStudy(req: AuthenticatedRequest, res: Response) {
  try {
    const { caseStudyId } = req.params;
    const existing = await prisma.caseStudy.findUnique({ where: { id: caseStudyId } });
    if (!existing) return res.status(404).json({ success: false, message: 'Case study not found.' });

    const data: Record<string, unknown> = {};
    for (const key of ['title', 'clientName', 'industry', 'challenge', 'solution', 'coverImage'] as const) {
      if (req.body[key] !== undefined) {
        const value = requiredText(req.body[key]);
        if (!value) return res.status(400).json({ success: false, message: `${key} cannot be empty.` });
        data[key] = value;
      }
    }
    if (req.body.resultsJson !== undefined) data.resultsJson = jsonArray(req.body.resultsJson);

    const caseStudy = await prisma.caseStudy.update({ where: { id: caseStudyId }, data });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'UPDATE_CASE_STUDY',
        entity: 'CaseStudy',
        detailsJson: { caseStudyId, title: caseStudy.title },
      },
    });

    return res.json({ success: true, caseStudy });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteAdminCaseStudy(req: AuthenticatedRequest, res: Response) {
  try {
    const { caseStudyId } = req.params;
    const existing = await prisma.caseStudy.findUnique({ where: { id: caseStudyId } });
    if (!existing) return res.status(404).json({ success: false, message: 'Case study not found.' });

    await prisma.caseStudy.delete({ where: { id: caseStudyId } });
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'DELETE_CASE_STUDY',
        entity: 'CaseStudy',
        detailsJson: { caseStudyId, title: existing.title },
      },
    });

    return res.json({ success: true, message: 'Case study deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

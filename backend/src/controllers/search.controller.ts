import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function globalSearch(req: AuthenticatedRequest, res: Response) {
  try {
    const q = req.query.q ? String(req.query.q).trim() : '';
    const type = req.query.type ? String(req.query.type) : 'all';
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '15'), 10)));

    if (!q) {
      return res.json({ success: true, query: '', total: 0, results: [] });
    }

    const searchCondition = {
      contains: q,
      mode: 'insensitive' as const,
    };

    let results: Array<{ id: string; type: string; title: string; description?: string; url: string; metadata?: any }> = [];

    // 1. Courses
    if (type === 'all' || type === 'course') {
      const courses = await prisma.course.findMany({
        where: {
          isPublished: true,
          OR: [{ title: searchCondition }, { description: searchCondition }],
        },
        take: limit,
      });
      courses.forEach((c) => {
        results.push({
          id: c.id,
          type: 'course',
          title: c.title,
          description: c.description,
          url: `/academy/courses/${c.slug}`,
          metadata: { category: c.category, level: c.level },
        });
      });
    }

    // 2. Research Projects
    if (type === 'all' || type === 'research') {
      const research = await prisma.researchProject.findMany({
        where: {
          OR: [{ title: searchCondition }, { description: searchCondition }, { area: searchCondition }],
        },
        take: limit,
      });
      research.forEach((r) => {
        results.push({
          id: r.id,
          type: 'research',
          title: r.title,
          description: r.description,
          url: `/research`,
          metadata: { area: r.area, status: r.status },
        });
      });
    }

    // 3. Publications
    if (type === 'all' || type === 'publication') {
      const pubs = await prisma.publication.findMany({
        where: {
          OR: [{ title: searchCondition }, { abstract: searchCondition }, { authors: searchCondition }],
        },
        take: limit,
      });
      pubs.forEach((p) => {
        results.push({
          id: p.id,
          type: 'publication',
          title: p.title,
          description: p.abstract,
          url: `/publications`,
          metadata: { journal: p.journal, year: p.year },
        });
      });
    }

    // 4. Articles
    if (type === 'all' || type === 'article') {
      const articles = await prisma.article.findMany({
        where: {
          isPublished: true,
          OR: [{ title: searchCondition }, { summary: searchCondition }],
        },
        take: limit,
      });
      articles.forEach((a) => {
        results.push({
          id: a.id,
          type: 'article',
          title: a.title,
          description: a.summary,
          url: `/news`,
          metadata: { category: a.category },
        });
      });
    }

    // 5. Projects
    if (type === 'all' || type === 'project') {
      const projects = await prisma.project.findMany({
        where: {
          OR: [{ title: searchCondition }, { description: searchCondition }, { category: searchCondition }],
        },
        take: limit,
      });
      projects.forEach((p) => {
        results.push({
          id: p.id,
          type: 'project',
          title: p.title,
          description: p.description,
          url: `/projects/${p.id}`,
          metadata: { category: p.category, status: p.status },
        });
      });
    }

    // 6. Innovation
    if (type === 'all' || type === 'innovation') {
      const concepts = await prisma.innovationConcept.findMany({
        where: {
          OR: [{ title: searchCondition }, { summary: searchCondition }, { category: searchCondition }],
        },
        take: limit,
      });
      concepts.forEach((c) => {
        results.push({
          id: c.id,
          type: 'innovation',
          title: c.title,
          description: c.summary,
          url: `/innovation/${c.id}`,
          metadata: { category: c.category, stage: c.conceptStage },
        });
      });
    }

    // 7. Library Resources
    if (type === 'all' || type === 'library') {
      const library = await prisma.libraryResource.findMany({
        where: {
          OR: [{ title: searchCondition }, { description: searchCondition }, { author: searchCondition }],
        },
        take: limit,
      });
      library.forEach((l) => {
        results.push({
          id: l.id,
          type: 'library',
          title: l.title,
          description: l.description,
          url: `/library/${l.id}`,
          metadata: { resourceType: l.resourceType, author: l.author },
        });
      });
    }

    // 8. Community Posts
    if (type === 'all' || type === 'community') {
      const posts = await prisma.communityPost.findMany({
        where: {
          OR: [{ title: searchCondition }, { content: searchCondition }],
        },
        take: limit,
      });
      posts.forEach((cp) => {
        results.push({
          id: cp.id,
          type: 'community',
          title: cp.title,
          description: cp.content,
          url: `/community/posts/${cp.id}`,
          metadata: { category: cp.category },
        });
      });
    }

    // 9. People / Users (Public fields only)
    if (type === 'all' || type === 'person') {
      const users = await prisma.user.findMany({
        where: {
          OR: [{ fullName: searchCondition }, { title: searchCondition }],
        },
        select: { id: true, fullName: true, title: true, role: true, avatarUrl: true },
        take: limit,
      });
      users.forEach((u) => {
        results.push({
          id: u.id,
          type: 'person',
          title: u.fullName,
          description: u.title || `Role: ${u.role}`,
          url: `/personal`,
          metadata: { role: u.role, avatarUrl: u.avatarUrl },
        });
      });
    }

    const total = results.length;
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    return res.json({
      success: true,
      query: q,
      total,
      page,
      limit,
      results: paginatedResults,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

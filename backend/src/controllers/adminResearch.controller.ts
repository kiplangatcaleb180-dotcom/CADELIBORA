import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================
// RESEARCH PROJECTS
// ============================================================

export async function getAdminResearchProjects(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const projects = await prisma.researchProject.findMany({
      include: {
        leadResearcher: {
          select: {
            id: true,
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

export async function createResearchProject(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const {
      title,
      slug,
      area,
      description,
      status,
      leadResearcherId,
      startYear,
      endYear,
      tagsJson,
    } = req.body;

    if (!title || !area || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, research area and description are required.',
      });
    }

    const researcherId = leadResearcherId || req.user?.userId;

    if (!researcherId) {
      return res.status(400).json({
        success: false,
        message: 'A lead researcher is required.',
      });
    }

    const finalSlug = slug?.trim() || makeSlug(title);

    const existing = await prisma.researchProject.findUnique({
      where: { slug: finalSlug },
      select: { id: true },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A research project with this slug already exists.',
      });
    }

    const project = await prisma.researchProject.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        area: area.trim(),
        description: description.trim(),
        status: status?.trim() || 'Ongoing',
        leadResearcherId: researcherId,
        startYear: Number(startYear) || new Date().getFullYear(),
        endYear:
          endYear !== undefined &&
          endYear !== null &&
          String(endYear).trim() !== ''
            ? Number(endYear)
            : null,
        tagsJson: tagsJson ?? [],
      },
      include: {
        leadResearcher: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            title: true,
          },
        },
        publications: true,
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'CREATE_RESEARCH',
          entity: 'ResearchProject',
          detailsJson: JSON.stringify({
            projectId: project.id,
            title: project.title,
          }),
        },
      });
    }

    return res.status(201).json({
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

export async function updateResearchProject(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { projectId } = req.params;

    const existing = await prisma.researchProject.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Research project not found.',
      });
    }

    const {
      title,
      slug,
      area,
      description,
      status,
      leadResearcherId,
      startYear,
      endYear,
      tagsJson,
    } = req.body;

    let finalSlug = slug?.trim() || makeSlug(title || existing.title);

    if (finalSlug !== existing.slug) {
      const duplicate = await prisma.researchProject.findFirst({
        where: {
          slug: finalSlug,
          NOT: { id: projectId },
        },
        select: { id: true },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'A research project with this slug already exists.',
        });
      }
    }

    const project = await prisma.researchProject.update({
      where: { id: projectId },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        slug: finalSlug,
        ...(area !== undefined && { area: String(area).trim() }),
        ...(description !== undefined && {
          description: String(description).trim(),
        }),
        ...(status !== undefined && { status: String(status).trim() }),
        ...(leadResearcherId !== undefined && { leadResearcherId }),
        ...(startYear !== undefined && {
          startYear: Number(startYear),
        }),
        ...(endYear !== undefined && {
          endYear:
            endYear === null || String(endYear).trim() === ''
              ? null
              : Number(endYear),
        }),
        ...(tagsJson !== undefined && { tagsJson }),
      },
      include: {
        leadResearcher: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            title: true,
          },
        },
        publications: true,
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'UPDATE_RESEARCH',
          entity: 'ResearchProject',
          detailsJson: JSON.stringify({
            projectId,
            title: project.title,
          }),
        },
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

export async function deleteResearchProject(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { projectId } = req.params;

    const project = await prisma.researchProject.findUnique({
      where: { id: projectId },
      select: { id: true, title: true },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Research project not found.',
      });
    }

    await prisma.researchProject.delete({
      where: { id: projectId },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'DELETE_RESEARCH',
          entity: 'ResearchProject',
          detailsJson: JSON.stringify({
            projectId,
            title: project.title,
          }),
        },
      });
    }

    return res.json({
      success: true,
      message: 'Research project deleted successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ============================================================
// PUBLICATIONS
// ============================================================

export async function getAdminPublications(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const publications = await prisma.publication.findMany({
      include: {
        researchProject: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
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

export async function createPublication(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const {
      title,
      abstract,
      authors,
      journal,
      year,
      doi,
      pdfUrl,
      researchProjectId,
    } = req.body;

    if (!title || !abstract || !authors || !journal || !year) {
      return res.status(400).json({
        success: false,
        message:
          'Title, abstract, authors, journal and publication year are required.',
      });
    }

    if (researchProjectId) {
      const project = await prisma.researchProject.findUnique({
        where: { id: researchProjectId },
        select: { id: true },
      });

      if (!project) {
        return res.status(400).json({
          success: false,
          message: 'The selected research project does not exist.',
        });
      }
    }

    const publication = await prisma.publication.create({
      data: {
        title: title.trim(),
        abstract: abstract.trim(),
        authors: authors.trim(),
        journal: journal.trim(),
        year: Number(year),
        doi: doi?.trim() || null,
        pdfUrl: pdfUrl?.trim() || null,
        researchProjectId: researchProjectId || null,
      },
      include: {
        researchProject: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'CREATE_PUBLICATION',
          entity: 'Publication',
          detailsJson: JSON.stringify({
            publicationId: publication.id,
            title: publication.title,
          }),
        },
      });
    }

    return res.status(201).json({
      success: true,
      publication,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updatePublication(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { publicationId } = req.params;

    const existing = await prisma.publication.findUnique({
      where: { id: publicationId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found.',
      });
    }

    const {
      title,
      abstract,
      authors,
      journal,
      year,
      doi,
      pdfUrl,
      researchProjectId,
    } = req.body;

    if (researchProjectId) {
      const project = await prisma.researchProject.findUnique({
        where: { id: researchProjectId },
        select: { id: true },
      });

      if (!project) {
        return res.status(400).json({
          success: false,
          message: 'The selected research project does not exist.',
        });
      }
    }

    const publication = await prisma.publication.update({
      where: { id: publicationId },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(abstract !== undefined && {
          abstract: String(abstract).trim(),
        }),
        ...(authors !== undefined && {
          authors: String(authors).trim(),
        }),
        ...(journal !== undefined && {
          journal: String(journal).trim(),
        }),
        ...(year !== undefined && {
          year: Number(year),
        }),
        ...(doi !== undefined && {
          doi: doi === null || String(doi).trim() === '' ? null : String(doi).trim(),
        }),
        ...(pdfUrl !== undefined && {
          pdfUrl:
            pdfUrl === null || String(pdfUrl).trim() === ''
              ? null
              : String(pdfUrl).trim(),
        }),
        ...(researchProjectId !== undefined && {
          researchProjectId: researchProjectId || null,
        }),
      },
      include: {
        researchProject: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'UPDATE_PUBLICATION',
          entity: 'Publication',
          detailsJson: JSON.stringify({
            publicationId,
            title: publication.title,
          }),
        },
      });
    }

    return res.json({
      success: true,
      publication,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deletePublication(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { publicationId } = req.params;

    const publication = await prisma.publication.findUnique({
      where: { id: publicationId },
      select: { id: true, title: true },
    });

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found.',
      });
    }

    await prisma.publication.delete({
      where: { id: publicationId },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'DELETE_PUBLICATION',
          entity: 'Publication',
          detailsJson: JSON.stringify({
            publicationId,
            title: publication.title,
          }),
        },
      });
    }

    return res.json({
      success: true,
      message: 'Publication deleted successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

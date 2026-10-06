import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';

export const getTechnologyOverview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [technologies, domains, stack, sections] =
      await Promise.all([
        prisma.technology.findMany({
          where: { isPublished: true },
          orderBy: [
            { sortOrder: 'asc' },
            { name: 'asc' },
          ],
        }),

        prisma.technologyDomain.findMany({
          where: { isPublished: true },
          orderBy: [
            { sortOrder: 'asc' },
            { name: 'asc' },
          ],
        }),

        prisma.technologyStack.findMany({
          where: { isPublished: true },
          orderBy: [
            { sortOrder: 'asc' },
            { name: 'asc' },
          ],
        }),

        prisma.technologySection.findMany({
          where: { isPublished: true },
          include: {
            technologies: {
              include: {
                technology: true,
              },
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
          orderBy: [
            { sortOrder: 'asc' },
            { title: 'asc' },
          ],
        }),
      ]);

    res.json({
      success: true,
      technologies,
      domains,
      stack,
      sections,
    });
  } catch (error) {
    next(error);
  }
};

export const getTechnologies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const technologies =
      await prisma.technology.findMany({
        where: { isPublished: true },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
      });

    res.json({
      success: true,
      technologies,
    });
  } catch (error) {
    next(error);
  }
};

export const getTechnologyBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const technology = await prisma.technology.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        domains: {
          where: {
            domain: {
              isPublished: true,
            },
          },
          include: {
            domain: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        sections: {
          where: {
            section: {
              isPublished: true,
            },
          },
          include: {
            section: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!technology) {
      return res.status(404).json({
        success: false,
        message: 'Technology not found.',
      });
    }

    const domainIds = technology.domains.map(
      (item) => item.domainId
    );

    const relatedTechnologies =
      await prisma.technology.findMany({
        where: {
          isPublished: true,
          id: {
            not: technology.id,
          },
          OR: [
            {
              category: technology.category,
            },
            ...(domainIds.length > 0
              ? [
                  {
                    domains: {
                      some: {
                        domainId: {
                          in: domainIds,
                        },
                      },
                    },
                  },
                ]
              : []),
          ],
        },
        orderBy: [
          { featured: 'desc' },
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
        take: 6,
      });

    res.json({
      success: true,
      technology,
      relatedTechnologies,
    });
  } catch (error) {
    next(error);
  }
};

export const getTechnologyDomains = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const domains =
      await prisma.technologyDomain.findMany({
        where: { isPublished: true },
        include: {
          technologies: {
            where: {
              technology: {
                isPublished: true,
              },
            },
            include: {
              technology: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
      });

    res.json({
      success: true,
      domains,
    });
  } catch (error) {
    next(error);
  }
};

export const getTechnologyStack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stack =
      await prisma.technologyStack.findMany({
        where: { isPublished: true },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
      });

    res.json({
      success: true,
      stack,
    });
  } catch (error) {
    next(error);
  }
};

export const getTechnologySections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sections = await prisma.technologySection.findMany({
    where: { isPublished: true },
    include: {
      technologies: {
        where: {
          technology: {
            isPublished: true,
          },
        },
        include: {
          technology: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
    orderBy: [
      { sortOrder: 'asc' },
      { title: 'asc' },
    ],
  });

    res.json({
      success: true,
      sections,
    });
  } catch (error) {
    next(error);
  }
};

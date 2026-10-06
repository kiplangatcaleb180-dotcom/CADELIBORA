import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';

export const getOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization = await prisma.organization.findFirst({
      where: {
        isPublished: true,
      },
      include: {
        history: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        milestones: {
          where: {
            isPublished: true,
          },
          orderBy: [
            {
              year: 'asc',
            },
            {
              sortOrder: 'asc',
            },
          ],
        },
        leaders: {
          where: {
            isPublished: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        departments: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        units: {
          orderBy: [
            {
              level: 'asc',
            },
            {
              sortOrder: 'asc',
            },
          ],
        },
        partners: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        sections: {
          where: {
            isPublished: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization information has not been configured yet.',
      });
    }

    return res.json({
      success: true,
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const history = await prisma.organizationHistory.findMany({
      orderBy: [
        {
          year: 'asc',
        },
        {
          sortOrder: 'asc',
        },
      ],
    });

    return res.json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationLeaders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const leaders = await prisma.organizationLeader.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return res.json({
      success: true,
      leaders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departments = await prisma.organizationDepartment.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return res.json({
      success: true,
      departments,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationMilestones = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const milestones = await prisma.organizationMilestone.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        {
          year: 'asc',
        },
        {
          sortOrder: 'asc',
        },
      ],
    });

    return res.json({
      success: true,
      milestones,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationStructure = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const units = await prisma.organizationUnit.findMany({
      orderBy: [
        {
          level: 'asc',
        },
        {
          sortOrder: 'asc',
        },
      ],
    });

    return res.json({
      success: true,
      units,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationPartners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const partners = await prisma.organizationPartner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return res.json({
      success: true,
      partners,
    });
  } catch (error) {
    next(error);
  }
};

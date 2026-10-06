import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db.js';

export const getAdminOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organization = await prisma.organization.findFirst({
      include: {
        history: {
          orderBy: [{ year: 'asc' }, { sortOrder: 'asc' }],
        },
        milestones: {
          orderBy: [{ year: 'asc' }, { sortOrder: 'asc' }],
        },
        leaders: {
          orderBy: { sortOrder: 'asc' },
        },
        departments: {
          orderBy: { sortOrder: 'asc' },
        },
        units: {
          orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
        },
        partners: {
          orderBy: { sortOrder: 'asc' },
        },
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return res.json({
      success: true,
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingOrganization = await prisma.organization.findFirst();

    if (existingOrganization) {
      return res.status(409).json({
        success: false,
        message: 'An organization profile already exists.',
      });
    }

    const {
      name,
      tagline,
      description,
      vision,
      mission,
      valuesJson,
      logoUrl,
      websiteUrl,
      email,
      phone,
      address,
      isPublished,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Organization name and description are required.',
      });
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        tagline: tagline || null,
        description,
        vision: vision || null,
        mission: mission || null,
        valuesJson: Array.isArray(valuesJson) ? valuesJson : [],
        logoUrl: logoUrl || null,
        websiteUrl: websiteUrl || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        isPublished:
          typeof isPublished === 'boolean' ? isPublished : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Organization profile created successfully.',
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const existingOrganization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!existingOrganization) {
      return res.status(404).json({
        success: false,
        message: 'Organization profile not found.',
      });
    }

    const {
      name,
      tagline,
      description,
      vision,
      mission,
      valuesJson,
      logoUrl,
      websiteUrl,
      email,
      phone,
      address,
      isPublished,
    } = req.body;

    const organization = await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(tagline !== undefined && { tagline }),
        ...(description !== undefined && { description }),
        ...(vision !== undefined && { vision }),
        ...(mission !== undefined && { mission }),
        ...(valuesJson !== undefined && {
          valuesJson: Array.isArray(valuesJson) ? valuesJson : [],
        }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return res.json({
      success: true,
      message: 'Organization profile updated successfully.',
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const existingOrganization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!existingOrganization) {
      return res.status(404).json({
        success: false,
        message: 'Organization profile not found.',
      });
    }

    await prisma.organization.delete({
      where: {
        id: organizationId,
      },
    });

    return res.json({
      success: true,
      message: 'Organization profile deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const publishOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const organization = await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        isPublished: true,
      },
    });

    return res.json({
      success: true,
      message: 'Organization profile published successfully.',
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const unpublishOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const organization = await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        isPublished: false,
      },
    });

    return res.json({
      success: true,
      message: 'Organization profile unpublished successfully.',
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrganizationHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const history = await prisma.organizationHistory.findMany({
      where: {
        organizationId,
      },
      orderBy: [{ year: 'asc' }, { sortOrder: 'asc' }],
    });

    return res.json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganizationHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;
    const { year, title, description, sortOrder } = req.body;

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization profile not found.',
      });
    }

    if (
      year === undefined ||
      !title ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: 'Year, title, and description are required.',
      });
    }

    const parsedYear = Number(year);

    if (!Number.isInteger(parsedYear)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid integer.',
      });
    }

    const history = await prisma.organizationHistory.create({
      data: {
        organizationId,
        year: parsedYear,
        title,
        description,
        sortOrder:
          sortOrder !== undefined ? Number(sortOrder) : 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Organization history entry created successfully.',
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, historyId } = req.params;
    const { year, title, description, sortOrder } = req.body;

    const existingHistory = await prisma.organizationHistory.findFirst({
      where: {
        id: historyId,
        organizationId,
      },
    });

    if (!existingHistory) {
      return res.status(404).json({
        success: false,
        message: 'Organization history entry not found.',
      });
    }

    if (year !== undefined && !Number.isInteger(Number(year))) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid integer.',
      });
    }

    const history = await prisma.organizationHistory.update({
      where: {
        id: historyId,
      },
      data: {
        ...(year !== undefined && { year: Number(year) }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && {
          sortOrder: Number(sortOrder),
        }),
      },
    });

    return res.json({
      success: true,
      message: 'Organization history entry updated successfully.',
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, historyId } = req.params;

    const existingHistory = await prisma.organizationHistory.findFirst({
      where: {
        id: historyId,
        organizationId,
      },
    });

    if (!existingHistory) {
      return res.status(404).json({
        success: false,
        message: 'Organization history entry not found.',
      });
    }

    await prisma.organizationHistory.delete({
      where: {
        id: historyId,
      },
    });

    return res.json({
      success: true,
      message: 'Organization history entry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrganizationMilestones = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const milestones = await prisma.organizationMilestone.findMany({
      where: {
        organizationId,
      },
      orderBy: [{ year: 'asc' }, { sortOrder: 'asc' }],
    });

    return res.json({
      success: true,
      milestones,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganizationMilestone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;
    const {
      year,
      title,
      description,
      icon,
      sortOrder,
      isPublished,
    } = req.body;

    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization profile not found.',
      });
    }

    if (year === undefined || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Year, title, and description are required.',
      });
    }

    const parsedYear = Number(year);

    if (!Number.isInteger(parsedYear)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid integer.',
      });
    }

    const milestone = await prisma.organizationMilestone.create({
      data: {
        organizationId,
        year: parsedYear,
        title,
        description,
        icon: icon || null,
        sortOrder:
          sortOrder !== undefined ? Number(sortOrder) : 0,
        isPublished:
          isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Organization milestone created successfully.',
      milestone,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationMilestone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, milestoneId } = req.params;
    const {
      year,
      title,
      description,
      icon,
      sortOrder,
      isPublished,
    } = req.body;

    const existingMilestone =
      await prisma.organizationMilestone.findFirst({
        where: {
          id: milestoneId,
          organizationId,
        },
      });

    if (!existingMilestone) {
      return res.status(404).json({
        success: false,
        message: 'Organization milestone not found.',
      });
    }

    if (
      year !== undefined &&
      !Number.isInteger(Number(year))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid integer.',
      });
    }

    const milestone =
      await prisma.organizationMilestone.update({
        where: {
          id: milestoneId,
        },
        data: {
          ...(year !== undefined && {
            year: Number(year),
          }),
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(icon !== undefined && {
            icon: icon || null,
          }),
          ...(sortOrder !== undefined && {
            sortOrder: Number(sortOrder),
          }),
          ...(isPublished !== undefined && {
            isPublished: Boolean(isPublished),
          }),
        },
      });

    return res.json({
      success: true,
      message: 'Organization milestone updated successfully.',
      milestone,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationMilestone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, milestoneId } = req.params;

    const existingMilestone =
      await prisma.organizationMilestone.findFirst({
        where: {
          id: milestoneId,
          organizationId,
        },
      });

    if (!existingMilestone) {
      return res.status(404).json({
        success: false,
        message: 'Organization milestone not found.',
      });
    }

    await prisma.organizationMilestone.delete({
      where: {
        id: milestoneId,
      },
    });

    return res.json({
      success: true,
      message: 'Organization milestone deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrganizationLeaders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const leaders = await prisma.organizationLeader.findMany({
      where: { organizationId },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json({
      success: true,
      leaders,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganizationLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const {
      name,
      position,
      department,
      bio,
      photoUrl,
      email,
      websiteUrl,
      linkedinUrl,
      expertiseJson,
      sortOrder,
      isPublished,
    } = req.body;

    if (!name?.trim() || !position?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name and position are required.',
      });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      });
    }

    const leader = await prisma.organizationLeader.create({
      data: {
        organizationId,
        name: name.trim(),
        position: position.trim(),
        department: department?.trim() || null,
        bio: bio?.trim() || null,
        photoUrl: photoUrl?.trim() || null,
        email: email?.trim() || null,
        websiteUrl: websiteUrl?.trim() || null,
        linkedinUrl: linkedinUrl?.trim() || null,
        expertiseJson: Array.isArray(expertiseJson)
          ? expertiseJson
          : [],
        sortOrder: Number.isInteger(Number(sortOrder))
          ? Number(sortOrder)
          : 0,
        isPublished:
          typeof isPublished === 'boolean'
            ? isPublished
            : true,
      },
    });

    res.status(201).json({
      success: true,
      leader,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, leaderId } = req.params;

    const existingLeader =
      await prisma.organizationLeader.findFirst({
        where: {
          id: leaderId,
          organizationId,
        },
      });

    if (!existingLeader) {
      return res.status(404).json({
        success: false,
        message: 'Organization leader not found.',
      });
    }

    const {
      name,
      position,
      department,
      bio,
      photoUrl,
      email,
      websiteUrl,
      linkedinUrl,
      expertiseJson,
      sortOrder,
      isPublished,
    } = req.body;

    const leader =
      await prisma.organizationLeader.update({
        where: { id: leaderId },
        data: {
          ...(name !== undefined && {
            name: name.trim(),
          }),
          ...(position !== undefined && {
            position: position.trim(),
          }),
          ...(department !== undefined && {
            department: department?.trim() || null,
          }),
          ...(bio !== undefined && {
            bio: bio?.trim() || null,
          }),
          ...(photoUrl !== undefined && {
            photoUrl: photoUrl?.trim() || null,
          }),
          ...(email !== undefined && {
            email: email?.trim() || null,
          }),
          ...(websiteUrl !== undefined && {
            websiteUrl: websiteUrl?.trim() || null,
          }),
          ...(linkedinUrl !== undefined && {
            linkedinUrl: linkedinUrl?.trim() || null,
          }),
          ...(expertiseJson !== undefined && {
            expertiseJson: Array.isArray(expertiseJson)
              ? expertiseJson
              : [],
          }),
          ...(sortOrder !== undefined && {
            sortOrder: Number(sortOrder) || 0,
          }),
          ...(isPublished !== undefined && {
            isPublished: Boolean(isPublished),
          }),
        },
      });

    res.json({
      success: true,
      leader,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, leaderId } = req.params;

    const existingLeader =
      await prisma.organizationLeader.findFirst({
        where: {
          id: leaderId,
          organizationId,
        },
      });

    if (!existingLeader) {
      return res.status(404).json({
        success: false,
        message: 'Organization leader not found.',
      });
    }

    await prisma.organizationLeader.delete({
      where: { id: leaderId },
    });

    res.json({
      success: true,
      message: 'Organization leader deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrganizationDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const departments = await prisma.organizationDepartment.findMany({
      where: { organizationId },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json({
      success: true,
      departments,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganizationDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const {
      name,
      slug,
      description,
      purpose,
      icon,
      coverImage,
      responsibilitiesJson,
      sortOrder,
      isActive,
    } = req.body;

    if (
      !name?.trim() ||
      !slug?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug, and description are required.',
      });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      });
    }

    const existingDepartment =
      await prisma.organizationDepartment.findFirst({
        where: {
          organizationId,
          slug: slug.trim(),
        },
      });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: 'A department with this slug already exists.',
      });
    }

    const department =
      await prisma.organizationDepartment.create({
        data: {
          organizationId,
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          purpose: purpose?.trim() || null,
          icon: icon?.trim() || null,
          coverImage: coverImage?.trim() || null,
          responsibilitiesJson:
            Array.isArray(responsibilitiesJson)
              ? responsibilitiesJson
              : [],
          sortOrder:
            Number.isInteger(Number(sortOrder))
              ? Number(sortOrder)
              : 0,
          isActive:
            typeof isActive === 'boolean'
              ? isActive
              : true,
        },
      });

    res.status(201).json({
      success: true,
      department,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, departmentId } = req.params;

    const existingDepartment =
      await prisma.organizationDepartment.findFirst({
        where: {
          id: departmentId,
          organizationId,
        },
      });

    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: 'Organization department not found.',
      });
    }

    const {
      name,
      slug,
      description,
      purpose,
      icon,
      coverImage,
      responsibilitiesJson,
      sortOrder,
      isActive,
    } = req.body;

    if (slug !== undefined) {
      const duplicate =
        await prisma.organizationDepartment.findFirst({
          where: {
            organizationId,
            slug: slug.trim(),
            id: {
              not: departmentId,
            },
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'A department with this slug already exists.',
        });
      }
    }

    const department =
      await prisma.organizationDepartment.update({
        where: { id: departmentId },
        data: {
          ...(name !== undefined && {
            name: name.trim(),
          }),
          ...(slug !== undefined && {
            slug: slug.trim(),
          }),
          ...(description !== undefined && {
            description: description.trim(),
          }),
          ...(purpose !== undefined && {
            purpose: purpose?.trim() || null,
          }),
          ...(icon !== undefined && {
            icon: icon?.trim() || null,
          }),
          ...(coverImage !== undefined && {
            coverImage: coverImage?.trim() || null,
          }),
          ...(responsibilitiesJson !== undefined && {
            responsibilitiesJson:
              Array.isArray(responsibilitiesJson)
                ? responsibilitiesJson
                : [],
          }),
          ...(sortOrder !== undefined && {
            sortOrder: Number(sortOrder) || 0,
          }),
          ...(isActive !== undefined && {
            isActive: Boolean(isActive),
          }),
        },
      });

    res.json({
      success: true,
      department,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, departmentId } = req.params;

    const existingDepartment =
      await prisma.organizationDepartment.findFirst({
        where: {
          id: departmentId,
          organizationId,
        },
      });

    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: 'Organization department not found.',
      });
    }

    await prisma.organizationDepartment.delete({
      where: { id: departmentId },
    });

    res.json({
      success: true,
      message: 'Organization department deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrganizationUnits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const units = await prisma.organizationUnit.findMany({
      where: { organizationId },
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json({
      success: true,
      units,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganizationUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const {
      parentId,
      name,
      title,
      description,
      leaderName,
      level,
      sortOrder,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Unit name is required.',
      });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      });
    }

    let resolvedLevel = 0;

    if (parentId) {
      const parent = await prisma.organizationUnit.findFirst({
        where: {
          id: parentId,
          organizationId,
        },
      });

      if (!parent) {
        return res.status(400).json({
          success: false,
          message: 'Parent unit not found.',
        });
      }

      resolvedLevel = parent.level + 1;
    }

    const unit = await prisma.organizationUnit.create({
      data: {
        organizationId,
        parentId: parentId || null,
        name: name.trim(),
        title: title?.trim() || null,
        description: description?.trim() || null,
        leaderName: leaderName?.trim() || null,
        level:
          parentId
            ? resolvedLevel
            : Number.isInteger(Number(level))
              ? Number(level)
              : 0,
        sortOrder:
          Number.isInteger(Number(sortOrder))
            ? Number(sortOrder)
            : 0,
      },
    });

    res.status(201).json({
      success: true,
      unit,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, unitId } = req.params;

    const existingUnit =
      await prisma.organizationUnit.findFirst({
        where: {
          id: unitId,
          organizationId,
        },
      });

    if (!existingUnit) {
      return res.status(404).json({
        success: false,
        message: 'Organization unit not found.',
      });
    }

    const {
      parentId,
      name,
      title,
      description,
      leaderName,
      level,
      sortOrder,
    } = req.body;

    if (parentId !== undefined) {
      if (parentId === unitId) {
        return res.status(400).json({
          success: false,
          message: 'A unit cannot be its own parent.',
        });
      }

      if (parentId) {
        const parent =
          await prisma.organizationUnit.findFirst({
            where: {
              id: parentId,
              organizationId,
            },
          });

        if (!parent) {
          return res.status(400).json({
            success: false,
            message: 'Parent unit not found.',
          });
        }
      }
    }

    let resolvedLevel =
      level !== undefined
        ? Number(level) || 0
        : existingUnit.level;

    if (parentId) {
      const parent =
        await prisma.organizationUnit.findFirst({
          where: {
            id: parentId,
            organizationId,
          },
        });

      if (parent) {
        resolvedLevel = parent.level + 1;
      }
    } else if (parentId === null) {
      resolvedLevel = 0;
    }

    const unit = await prisma.organizationUnit.update({
      where: { id: unitId },
      data: {
        ...(parentId !== undefined && {
          parentId: parentId || null,
        }),
        ...(name !== undefined && {
          name: name.trim(),
        }),
        ...(title !== undefined && {
          title: title?.trim() || null,
        }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(leaderName !== undefined && {
          leaderName: leaderName?.trim() || null,
        }),
        level: resolvedLevel,
        ...(sortOrder !== undefined && {
          sortOrder: Number(sortOrder) || 0,
        }),
      },
    });

    res.json({
      success: true,
      unit,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationUnit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, unitId } = req.params;

    const existingUnit =
      await prisma.organizationUnit.findFirst({
        where: {
          id: unitId,
          organizationId,
        },
      });

    if (!existingUnit) {
      return res.status(404).json({
        success: false,
        message: 'Organization unit not found.',
      });
    }

    await prisma.organizationUnit.delete({
      where: { id: unitId },
    });

    res.json({
      success: true,
      message: 'Organization unit deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrganizationPartners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const partners = await prisma.organizationPartner.findMany({
      where: { organizationId },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json({
      success: true,
      partners,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganizationPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;

    const {
      name,
      type,
      description,
      logoUrl,
      websiteUrl,
      startDate,
      endDate,
      isActive,
      sortOrder,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Partner name is required.',
      });
    }

    if (!type?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Partner type is required.',
      });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found.',
      });
    }

    const partner = await prisma.organizationPartner.create({
      data: {
        organizationId,
        name: name.trim(),
        type: type.trim(),
        description: description?.trim() || null,
        logoUrl: logoUrl?.trim() || null,
        websiteUrl: websiteUrl?.trim() || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive:
          typeof isActive === 'boolean'
            ? isActive
            : true,
        sortOrder:
          Number.isInteger(Number(sortOrder))
            ? Number(sortOrder)
            : 0,
      },
    });

    res.status(201).json({
      success: true,
      partner,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, partnerId } = req.params;

    const existingPartner =
      await prisma.organizationPartner.findFirst({
        where: {
          id: partnerId,
          organizationId,
        },
      });

    if (!existingPartner) {
      return res.status(404).json({
        success: false,
        message: 'Organization partner not found.',
      });
    }

    const {
      name,
      type,
      description,
      logoUrl,
      websiteUrl,
      startDate,
      endDate,
      isActive,
      sortOrder,
    } = req.body;

    if (name !== undefined && !name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Partner name cannot be empty.',
      });
    }

    if (type !== undefined && !type?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Partner type cannot be empty.',
      });
    }

    const partner = await prisma.organizationPartner.update({
      where: {
        id: partnerId,
      },
      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),
        ...(type !== undefined && {
          type: type.trim(),
        }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(logoUrl !== undefined && {
          logoUrl: logoUrl?.trim() || null,
        }),
        ...(websiteUrl !== undefined && {
          websiteUrl: websiteUrl?.trim() || null,
        }),
        ...(startDate !== undefined && {
          startDate: startDate
            ? new Date(startDate)
            : null,
        }),
        ...(endDate !== undefined && {
          endDate: endDate
            ? new Date(endDate)
            : null,
        }),
        ...(isActive !== undefined && {
          isActive: Boolean(isActive),
        }),
        ...(sortOrder !== undefined && {
          sortOrder: Number(sortOrder) || 0,
        }),
      },
    });

    res.json({
      success: true,
      partner,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, partnerId } = req.params;

    const existingPartner =
      await prisma.organizationPartner.findFirst({
        where: {
          id: partnerId,
          organizationId,
        },
      });

    if (!existingPartner) {
      return res.status(404).json({
        success: false,
        message: 'Organization partner not found.',
      });
    }

    await prisma.organizationPartner.delete({
      where: {
        id: partnerId,
      },
    });

    res.json({
      success: true,
      message: 'Organization partner deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
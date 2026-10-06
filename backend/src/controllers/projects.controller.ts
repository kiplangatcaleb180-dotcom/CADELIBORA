import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';


const projectInclude = {
  technologies: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      technology: true,
    },
  },
  research: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      researchProject: true,
    },
  },
  innovations: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      innovation: true,
    },
  },
  products: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      product: true,
    },
  },
};

const productInclude = {
  technologies: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      technology: true,
    },
  },
  research: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      researchProject: true,
    },
  },
  innovations: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      innovation: true,
    },
  },
  projects: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      project: true,
    },
  },
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function arrayValue(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function stringIdArray(value: unknown): string[] {
  return arrayValue(value)
    .map((item) => String(item).trim())
    .filter(Boolean);
}

async function replaceProjectRelations(
  tx: any,
  projectId: string,
  {
    technologyIds = [],
    researchProjectIds = [],
    innovationIds = [],
    productIds = [],
  }: {
    technologyIds?: string[];
    researchProjectIds?: string[];
    innovationIds?: string[];
    productIds?: string[];
  }
) {
  await tx.projectTechnology.deleteMany({ where: { projectId } });
  await tx.projectResearch.deleteMany({ where: { projectId } });
  await tx.projectInnovation.deleteMany({ where: { projectId } });
  await tx.projectProduct.deleteMany({ where: { projectId } });

  if (technologyIds.length) {
    await tx.projectTechnology.createMany({
      data: technologyIds.map((technologyId, index) => ({
        projectId,
        technologyId,
        sortOrder: index,
      })),
      skipDuplicates: true,
    });
  }

  if (researchProjectIds.length) {
    await tx.projectResearch.createMany({
      data: researchProjectIds.map((researchProjectId, index) => ({
        projectId,
        researchProjectId,
        sortOrder: index,
      })),
      skipDuplicates: true,
    });
  }

  if (innovationIds.length) {
    await tx.projectInnovation.createMany({
      data: innovationIds.map((innovationId, index) => ({
        projectId,
        innovationId,
        sortOrder: index,
      })),
      skipDuplicates: true,
    });
  }

  if (productIds.length) {
    await tx.projectProduct.createMany({
      data: productIds.map((productId, index) => ({
        projectId,
        productId,
        sortOrder: index,
      })),
      skipDuplicates: true,
    });
  }
}

async function replaceProductRelations(
  tx: any,
  productId: string,
  {
    technologyIds = [],
    researchProjectIds = [],
    innovationIds = [],
    projectIds = [],
  }: {
    technologyIds?: string[];
    researchProjectIds?: string[];
    innovationIds?: string[];
    projectIds?: string[];
  }
) {
  await tx.productTechnology.deleteMany({ where: { productId } });
  await tx.productResearch.deleteMany({ where: { productId } });
  await tx.productInnovation.deleteMany({ where: { productId } });
  await tx.projectProduct.deleteMany({ where: { productId } });

  if (technologyIds.length) {
    await tx.productTechnology.createMany({
      data: technologyIds.map((technologyId, index) => ({
        productId,
        technologyId,
        sortOrder: index,
      })),
      skipDuplicates: true,
    });
  }

  if (researchProjectIds.length) {
    await tx.productResearch.createMany({
      data: researchProjectIds.map((researchProjectId, index) => ({
        productId,
        researchProjectId,
        sortOrder: index,
      })),
      skipDuplicates: true,
    });
  }

  if (innovationIds.length) {
    await tx.productInnovation.createMany({
      data: innovationIds.map((innovationId, index) => ({
        productId,
        innovationId,
        sortOrder: index,
      })),
      skipDuplicates: true,
    });
  }

  if (projectIds.length) {
    await tx.projectProduct.createMany({
      data: projectIds.map((projectId, index) => ({
        productId,
        projectId,
        sortOrder: index,
      })),
      skipDuplicates: true,
    });
  }
}


export async function getProjectsAndProducts(req: Request, res: Response) {
  try {
    const { category, status, search } = req.query;
    const where: any = {};
    if (category) where.category = String(category);
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: projectInclude,
    });

    const products = await prisma.product.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: productInclude,
    });

    return res.json({
      success: true,
      projects,
      products,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: projectInclude,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.json({ success: true, project });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createProject(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const {
      title,
      summary,
      description,
      category,
      status,
      techStack,
      features,
      gallery,
      coverImage,
      repoUrl,
      liveUrl,
      featured,
      isPublished,
      sortOrder,
      technologyIds,
      researchProjectIds,
      innovationIds,
      productIds,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description and category are required',
      });
    }

    const slug = makeSlug(String(title));

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          title: String(title).trim(),
          slug,
          summary: summary !== undefined ? summary : null,
          description: String(description),
          category: String(category),
          status: status || 'Active',
          techStackJson: arrayValue(techStack),
          featuresJson: arrayValue(features),
          galleryJson: arrayValue(gallery),
          coverImage: coverImage || null,
          repoUrl: repoUrl || null,
          liveUrl: liveUrl || null,
          featured: Boolean(featured),
          isPublished:
            isPublished !== undefined ? Boolean(isPublished) : true,
          sortOrder:
            sortOrder !== undefined ? Number(sortOrder) || 0 : 0,
        },
      });

      await replaceProjectRelations(tx, created.id, {
        technologyIds: stringIdArray(technologyIds),
        researchProjectIds: stringIdArray(researchProjectIds),
        innovationIds: stringIdArray(innovationIds),
        productIds: stringIdArray(productIds),
      });

      return created;
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: 'CREATE_PROJECT',
        entity: 'Project',
        detailsJson: JSON.stringify({
          projectId: project.id,
          title: project.title,
        }),
      },
    });

    const result = await prisma.project.findUnique({
      where: { id: project.id },
      include: projectInclude,
    });

    return res.status(201).json({
      success: true,
      project: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateProject(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { id } = req.params;

    const {
      title,
      summary,
      description,
      category,
      status,
      techStack,
      features,
      gallery,
      coverImage,
      repoUrl,
      liveUrl,
      featured,
      isPublished,
      sortOrder,
      technologyIds,
      researchProjectIds,
      innovationIds,
      productIds,
    } = req.body;

    const project = await prisma.$transaction(async (tx) => {
      const existing = await tx.project.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error('PROJECT_NOT_FOUND');
      }

      const updated = await tx.project.update({
        where: { id },
        data: {
          title:
            title !== undefined
              ? String(title).trim()
              : undefined,

          slug:
            title !== undefined
              ? makeSlug(String(title))
              : undefined,

          summary:
            summary !== undefined
              ? summary
              : undefined,

          description:
            description !== undefined
              ? String(description)
              : undefined,

          category:
            category !== undefined
              ? String(category)
              : undefined,

          status:
            status !== undefined
              ? String(status)
              : undefined,

          techStackJson:
            techStack !== undefined
              ? arrayValue(techStack)
              : undefined,

          featuresJson:
            features !== undefined
              ? arrayValue(features)
              : undefined,

          galleryJson:
            gallery !== undefined
              ? arrayValue(gallery)
              : undefined,

          coverImage:
            coverImage !== undefined
              ? coverImage
              : undefined,

          repoUrl:
            repoUrl !== undefined
              ? repoUrl
              : undefined,

          liveUrl:
            liveUrl !== undefined
              ? liveUrl
              : undefined,

          featured:
            featured !== undefined
              ? Boolean(featured)
              : undefined,

          isPublished:
            isPublished !== undefined
              ? Boolean(isPublished)
              : undefined,

          sortOrder:
            sortOrder !== undefined
              ? Number(sortOrder) || 0
              : undefined,
        },
      });

      const relationsWereProvided =
        technologyIds !== undefined ||
        researchProjectIds !== undefined ||
        innovationIds !== undefined ||
        productIds !== undefined;

      if (relationsWereProvided) {
        await replaceProjectRelations(tx, id, {
          technologyIds:
            technologyIds !== undefined
              ? stringIdArray(technologyIds)
              : [],
          researchProjectIds:
            researchProjectIds !== undefined
              ? stringIdArray(researchProjectIds)
              : [],
          innovationIds:
            innovationIds !== undefined
              ? stringIdArray(innovationIds)
              : [],
          productIds:
            productIds !== undefined
              ? stringIdArray(productIds)
              : [],
        });
      }

      return updated;
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: 'UPDATE_PROJECT',
        entity: 'Project',
        detailsJson: JSON.stringify({
          projectId: project.id,
          title: project.title,
        }),
      },
    });

    const result = await prisma.project.findUnique({
      where: { id: project.id },
      include: projectInclude,
    });

    return res.json({
      success: true,
      project: result,
    });
  } catch (error: any) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteProject(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;

    await prisma.project.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: 'DELETE_PROJECT',
        entity: 'Project',
        detailsJson: JSON.stringify({
          projectId: id,
        }),
      },
    });

    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: productInclude,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createProduct(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const {
      title,
      tagline,
      description,
      category,
      version,
      status,
      demoUrl,
      docsUrl,
      coverImage,
      gallery,
      features,
      currency,
      price,
      featured,
      isPublished,
      sortOrder,
      technologyIds,
      researchProjectIds,
      innovationIds,
      projectIds,
    } = req.body;

    if (!title || !tagline || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, tagline, description and category are required',
      });
    }

    const slug = makeSlug(String(title));

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          title: String(title).trim(),
          slug,
          tagline: String(tagline),
          description: String(description),
          category: String(category),
          version: version || '1.0.0',
          status: status || 'GA',
          demoUrl: demoUrl || null,
          docsUrl: docsUrl || null,
          coverImage: coverImage || null,
          galleryJson: arrayValue(gallery),
          featuresJson: arrayValue(features),
          currency: currency || 'USD',
          price:
            price !== undefined
              ? Number(price) || 0
              : 0,
          featured: Boolean(featured),
          isPublished:
            isPublished !== undefined
              ? Boolean(isPublished)
              : true,
          sortOrder:
            sortOrder !== undefined
              ? Number(sortOrder) || 0
              : 0,
        },
      });

      await replaceProductRelations(tx, created.id, {
        technologyIds: stringIdArray(technologyIds),
        researchProjectIds: stringIdArray(researchProjectIds),
        innovationIds: stringIdArray(innovationIds),
        projectIds: stringIdArray(projectIds),
      });

      return created;
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: 'CREATE_PRODUCT',
        entity: 'Product',
        detailsJson: JSON.stringify({
          productId: product.id,
          title: product.title,
        }),
      },
    });

    const result = await prisma.product.findUnique({
      where: { id: product.id },
      include: productInclude,
    });

    return res.status(201).json({
      success: true,
      product: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateProduct(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { id } = req.params;

    const {
      title,
      tagline,
      description,
      category,
      version,
      status,
      demoUrl,
      docsUrl,
      coverImage,
      gallery,
      features,
      currency,
      price,
      featured,
      isPublished,
      sortOrder,
      technologyIds,
      researchProjectIds,
      innovationIds,
      projectIds,
    } = req.body;

    const product = await prisma.$transaction(async (tx) => {
      const existing = await tx.product.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error('PRODUCT_NOT_FOUND');
      }

      const updated = await tx.product.update({
        where: { id },
        data: {
          title:
            title !== undefined
              ? String(title).trim()
              : undefined,

          slug:
            title !== undefined
              ? makeSlug(String(title))
              : undefined,

          tagline:
            tagline !== undefined
              ? String(tagline)
              : undefined,

          description:
            description !== undefined
              ? String(description)
              : undefined,

          category:
            category !== undefined
              ? String(category)
              : undefined,

          version:
            version !== undefined
              ? String(version)
              : undefined,

          status:
            status !== undefined
              ? String(status)
              : undefined,

          demoUrl:
            demoUrl !== undefined
              ? demoUrl
              : undefined,

          docsUrl:
            docsUrl !== undefined
              ? docsUrl
              : undefined,

          coverImage:
            coverImage !== undefined
              ? coverImage
              : undefined,

          galleryJson:
            gallery !== undefined
              ? arrayValue(gallery)
              : undefined,

          featuresJson:
            features !== undefined
              ? arrayValue(features)
              : undefined,

          currency:
            currency !== undefined
              ? String(currency)
              : undefined,

          price:
            price !== undefined
              ? Number(price) || 0
              : undefined,

          featured:
            featured !== undefined
              ? Boolean(featured)
              : undefined,

          isPublished:
            isPublished !== undefined
              ? Boolean(isPublished)
              : undefined,

          sortOrder:
            sortOrder !== undefined
              ? Number(sortOrder) || 0
              : undefined,
        },
      });

      const relationsWereProvided =
        technologyIds !== undefined ||
        researchProjectIds !== undefined ||
        innovationIds !== undefined ||
        projectIds !== undefined;

      if (relationsWereProvided) {
        await replaceProductRelations(tx, id, {
          technologyIds:
            technologyIds !== undefined
              ? stringIdArray(technologyIds)
              : [],
          researchProjectIds:
            researchProjectIds !== undefined
              ? stringIdArray(researchProjectIds)
              : [],
          innovationIds:
            innovationIds !== undefined
              ? stringIdArray(innovationIds)
              : [],
          projectIds:
            projectIds !== undefined
              ? stringIdArray(projectIds)
              : [],
        });
      }

      return updated;
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: 'UPDATE_PRODUCT',
        entity: 'Product',
        detailsJson: JSON.stringify({
          productId: product.id,
          title: product.title,
        }),
      },
    });

    const result = await prisma.product.findUnique({
      where: { id: product.id },
      include: productInclude,
    });

    return res.json({
      success: true,
      product: result,
    });
  } catch (error: any) {
    if (error.message === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteProduct(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: 'DELETE_PRODUCT',
        entity: 'Product',
        detailsJson: JSON.stringify({
          productId: id,
        }),
      },
    });

    return res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

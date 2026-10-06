import { Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getAdminDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    const [totalUsers, totalCourses, activeUsers, usersByRole, completedCourses, totalAssessments, totalCertificates] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.user.count({ where: { accountStatus: 'ACTIVE' } }),
      prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      prisma.enrollment.count({ where: { completed: true } }),
      prisma.assignment.count(),
      prisma.certificate.count(),
    ]);
    const totalEnrollments = await prisma.enrollment.count();
    const totalResearchProjects = await prisma.researchProject.count();
    const totalCommunityPosts = await prisma.communityPost.count();
    const totalProducts = await prisma.product.count();
    const totalProjects = await prisma.project.count();
    const totalArticles = await prisma.article.count();
    const totalLibraryResources = await prisma.libraryResource.count();

    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true, email: true, role: true } } },
    });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        activeUsers,
        usersByRole: Object.fromEntries(usersByRole.map((entry) => [entry.role, entry._count._all])),
        completedCourses,
        totalAssessments,
        totalCertificates,
        totalEnrollments,
        totalResearchProjects,
        totalCommunityPosts,
        totalProducts,
        totalProjects,
        totalArticles,
        totalLibraryResources,
      },
      auditLogs: recentAuditLogs,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// User & Role Management
export async function getAllUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, fullName: true, role: true, username: true,
        avatarUrl: true, title: true, isVerified: true, accountStatus: true,
        createdAt: true, updatedAt: true, profile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createAdminUser(req: AuthenticatedRequest, res: Response) {
  try {
    const fullName = typeof req.body.fullName === 'string' ? req.body.fullName.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const role = typeof req.body.role === 'string' ? req.body.role : '';
    const roles = ['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR', 'RESEARCHER', 'DEVELOPER', 'MODERATOR', 'STUDENT', 'PARTNER', 'USER'];

    if (!fullName || !email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || !roles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Enter a name, valid email, password of at least 8 characters, and a supported role.' });
    }
    if (['ADMIN', 'SUPER_ADMIN'].includes(role) && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Only a SUPER_ADMIN can create ADMIN or SUPER_ADMIN accounts.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { fullName, email, passwordHash, role, isVerified: true, accountStatus: 'ACTIVE' },
      select: { id: true, fullName: true, email: true, role: true, accountStatus: true, createdAt: true },
    });
    await prisma.auditLog.create({
      data: { userId: req.user?.userId, action: 'CREATE_USER', entity: 'User', detailsJson: { targetUserId: user.id, email, role } },
    });
    return res.status(201).json({ success: true, user });
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateAdminUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req.params;
    const fullName = typeof req.body.fullName === 'string' ? req.body.fullName.trim() : undefined;
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : undefined;
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : undefined;
    if (!fullName && !email && title === undefined) {
      return res.status(400).json({ success: false, message: 'Provide a name, email, or title to update.' });
    }
    if ((fullName !== undefined && !fullName) || (email !== undefined && !/^\S+@\S+\.\S+$/.test(email))) {
      return res.status(400).json({ success: false, message: 'Enter a valid name and email.' });
    }
    const existing = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, role: true } });
    if (!existing) return res.status(404).json({ success: false, message: 'User not found.' });
    if (['ADMIN', 'SUPER_ADMIN'].includes(existing.role) && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Only a SUPER_ADMIN can edit ADMIN or SUPER_ADMIN accounts.' });
    }
    const user = await prisma.user.update({
      where: { id: userId }, data: { ...(fullName !== undefined ? { fullName } : {}), ...(email !== undefined ? { email } : {}), ...(title !== undefined ? { title: title || null } : {}) },
      select: { id: true, fullName: true, email: true, role: true, title: true, accountStatus: true, createdAt: true },
    });
    await prisma.auditLog.create({ data: { userId: req.user?.userId, action: 'UPDATE_USER', entity: 'User', detailsJson: { targetUserId: userId, previousEmail: existing.email, email: user.email, fullName: user.fullName, title: user.title } } });
    return res.json({ success: true, user });
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req.params;
    const actorId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: 'Authenticated administrator required',
      });
    }

    if (userId === actorId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (['ADMIN', 'SUPER_ADMIN'].includes(targetUser.role) && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Only a SUPER_ADMIN can delete ADMIN or SUPER_ADMIN accounts.' });
    }

    if (targetUser.role === 'SUPER_ADMIN') {
      const activeSuperAdminCount = await prisma.user.count({
        where: {
          role: 'SUPER_ADMIN',
          accountStatus: 'ACTIVE',
          id: { not: userId },
        },
      });

      if (activeSuperAdminCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last active SUPER_ADMIN account',
        });
      }
    }

    const replacementAdmin = await prisma.user.findFirst({
      where: {
        role: {
          in: ['SUPER_ADMIN', 'ADMIN'],
        },
        accountStatus: 'ACTIVE',
        id: { not: userId },
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!replacementAdmin) {
      return res.status(400).json({
        success: false,
        message: 'No active administrator is available to preserve authored content',
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.article.updateMany({
        where: { authorId: userId },
        data: { authorId: replacementAdmin.id },
      });

      await tx.auditLog.updateMany({
        where: { userId },
        data: { userId: null },
      });

      await tx.auditLog.create({
        data: {
          userId: actorId,
          action: 'DELETE_USER',
          entity: 'User',
          detailsJson: JSON.stringify({
            deletedUserId: userId,
            deletedUserName: targetUser.fullName,
            deletedUserEmail: targetUser.email,
            deletedUserRole: targetUser.role,
            replacementAdminId: replacementAdmin.id,
          }),
        },
      });

      await tx.user.delete({
        where: { id: userId },
      });
    });

    return res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete user failed:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Course Management
export async function createCourse(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, category, description, coverImage, level, duration } = req.body;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        category,
        description,
        coverImage: coverImage || '',
        level: level || 'Beginner',
        duration: duration || '10 hours',
        instructorId: req.user?.userId || '',
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'CREATE_COURSE',
          entity: 'Course',
          detailsJson: JSON.stringify({ courseId: course.id, title }),
        },
      });
    }

    return res.status(201).json({ success: true, course });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteCourse(req: AuthenticatedRequest, res: Response) {
  try {
    const { courseId } = req.params;
    await prisma.course.delete({ where: { id: courseId } });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'DELETE_COURSE',
          entity: 'Course',
          detailsJson: JSON.stringify({ courseId }),
        },
      });
    }

    return res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Research Management
export async function createResearchProject(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, area, description, status, startYear } = req.body;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const project = await prisma.researchProject.create({
      data: {
        title,
        slug,
        area,
        description,
        status: status || 'Ongoing',
        leadResearcherId: req.user?.userId || '',
        startYear: startYear || new Date().getFullYear(),
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'CREATE_RESEARCH',
          entity: 'ResearchProject',
          detailsJson: JSON.stringify({ projectId: project.id, title }),
        },
      });
    }

    return res.status(201).json({ success: true, project });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteResearchProject(req: AuthenticatedRequest, res: Response) {
  try {
    const { projectId } = req.params;
    await prisma.researchProject.delete({ where: { id: projectId } });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'DELETE_RESEARCH',
          entity: 'ResearchProject',
          detailsJson: JSON.stringify({ projectId }),
        },
      });
    }

    return res.json({ success: true, message: 'Research project deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Product Management
export async function createProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, tagline, description, category, version, status, demoUrl, docsUrl } = req.body;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        tagline,
        description,
        category,
        version: version || '1.0.0',
        status: status || 'GA',
        demoUrl,
        docsUrl,
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          userId: req.user.userId,
          action: 'CREATE_PRODUCT',
          entity: 'Product',
          detailsJson: JSON.stringify({ productId: product.id, title }),
        },
      });
    }

    return res.status(201).json({ success: true, product });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const { productId } = req.params;
    await prisma.product.delete({ where: { id: productId } });

    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Article / News Management
export async function getAdminArticles(req: AuthenticatedRequest, res: Response) {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, articles });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createArticle(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, summary, content, category, coverImage } = req.body;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary,
        content,
        category: category || 'Announcements',
        coverImage: typeof coverImage === 'string' ? coverImage.trim() : '',
        authorId: req.user?.userId || '',
      },
    });

    return res.status(201).json({ success: true, article });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


export async function updateArticle(req: AuthenticatedRequest, res: Response) {
  try {
    const { articleId } = req.params;
    const { title, summary, content, category, coverImage, isPublished } = req.body;

    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    const nextTitle =
      typeof title === 'string' && title.trim()
        ? title.trim()
        : existing.title;

    const slug = nextTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: nextTitle,
        slug,
        summary:
          typeof summary === 'string' ? summary : existing.summary,
        content:
          typeof content === 'string' ? content : existing.content,
        category:
          typeof category === 'string' && category.trim()
            ? category.trim()
            : existing.category,
        coverImage:
          typeof coverImage === 'string'
            ? coverImage.trim()
            : existing.coverImage,
        ...(typeof isPublished === 'boolean' ? { isPublished } : {}),
      },
    });

    return res.json({
      success: true,
      article,
      message: 'Article updated successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function toggleArticlePublished(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { articleId } = req.params;

    const existing = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        isPublished: !existing.isPublished,
      },
    });

    return res.json({
      success: true,
      article,
      message: article.isPublished
        ? 'Article published successfully'
        : 'Article unpublished successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteArticle(req: AuthenticatedRequest, res: Response) {
  try {
    const { articleId } = req.params;
    await prisma.article.delete({ where: { id: articleId } });

    return res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Library Resource Management
export async function createLibraryResource(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, resourceType, author, category, description } = req.body;

    const resource = await prisma.libraryResource.create({
      data: {
        title,
        resourceType: resourceType || 'Whitepaper',
        author,
        category,
        description,
      },
    });

    return res.status(201).json({ success: true, resource });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteLibraryResource(req: AuthenticatedRequest, res: Response) {
  try {
    const { resourceId } = req.params;
    await prisma.libraryResource.delete({ where: { id: resourceId } });

    return res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Moderation
export async function deleteCommunityPost(req: AuthenticatedRequest, res: Response) {
  try {
    const { postId } = req.params;
    await prisma.communityPost.delete({ where: { id: postId } });

    return res.json({ success: true, message: 'Community post removed by moderator' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateUserRole(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      'SUPER_ADMIN',
      'ADMIN',
      'INSTRUCTOR',
      'RESEARCHER',
      'DEVELOPER',
      'MODERATOR',
      'STUDENT',
      'PARTNER',
      'USER',
    ];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`,
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Prevent administrators from changing their own role.
    if (req.user.userId === userId) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your own role.',
      });
    }

    // Only SUPER_ADMIN can assign elevated administrator roles.
    if (['ADMIN', 'SUPER_ADMIN'].includes(role) && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only SUPER_ADMIN can assign ADMIN or SUPER_ADMIN roles.',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Only SUPER_ADMIN can modify an existing SUPER_ADMIN.
    if (
      ['ADMIN', 'SUPER_ADMIN'].includes(existingUser.role) &&
      req.user.role !== 'SUPER_ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only SUPER_ADMIN can modify ADMIN or SUPER_ADMIN accounts.',
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: 'UPDATE_ROLE',
        entity: 'User',
        detailsJson: JSON.stringify({
          targetUserId: userId,
          targetEmail: existingUser.email,
          previousRole: existingUser.role,
          newRole: role,
        }),
      },
    });

    return res.json({
      success: true,
      message: `User role updated to ${role}.`,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateUserAccountStatus(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { userId } = req.params;
    const { accountStatus } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const allowedStatuses = ['ACTIVE', 'SUSPENDED'];

    if (!accountStatus || !allowedStatuses.includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid account status. Allowed statuses: ${allowedStatuses.join(', ')}`,
      });
    }

    // Prevent administrators from suspending their own account.
    if (req.user.userId === userId) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your own account status.',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        accountStatus: true,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Only SUPER_ADMIN can modify a SUPER_ADMIN account.
    if (
      ['ADMIN', 'SUPER_ADMIN'].includes(existingUser.role) &&
      req.user.role !== 'SUPER_ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only SUPER_ADMIN can modify ADMIN or SUPER_ADMIN accounts.',
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { accountStatus },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        accountStatus: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.userId,
        action: accountStatus === 'SUSPENDED'
          ? 'SUSPEND_USER'
          : 'ACTIVATE_USER',
        entity: 'User',
        detailsJson: JSON.stringify({
          targetUserId: userId,
          targetEmail: existingUser.email,
          previousStatus: existingUser.accountStatus,
          newStatus: accountStatus,
        }),
      },
    });

    return res.json({
      success: true,
      message: accountStatus === 'SUSPENDED'
        ? 'User account suspended successfully.'
        : 'User account activated successfully.',
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

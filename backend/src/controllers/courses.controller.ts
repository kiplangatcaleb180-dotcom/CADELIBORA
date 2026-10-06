import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getAllCourses(req: Request, res: Response) {
  try {
    const { category, level, search } = req.query;

    const where: any = { isPublished: true };
    if (category) where.category = String(category);
    if (level) where.level = String(level);
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: { select: { fullName: true, avatarUrl: true, title: true } },
        lessons: { select: { id: true, title: true, order: true, durationMinutes: true, isFree: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, courses });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getCourseBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const course = await prisma.course.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        instructor: { select: { fullName: true, avatarUrl: true, title: true, profile: true } },
        lessons: { orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    return res.json({ success: true, course });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function enrollInCourse(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { courseId } = req.params;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or unavailable',
      });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: req.user.userId, courseId } },
      update: { lastAccessedAt: new Date() },
      create: {
        userId: req.user.userId,
        courseId,
        progress: 0,
      },
      include: { course: true },
    });

    // Send Notification
    await prisma.notification.create({
      data: {
        userId: req.user.userId,
        title: 'Course Enrollment Successful',
        message: `You have enrolled in ${enrollment.course.title}. Start learning now!`,
        type: 'academy',
        link: `/academy/courses/${enrollment.course.slug}`,
      },
    });

    return res.status(201).json({ success: true, enrollment });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateProgress(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { courseId } = req.params;
    const rawProgress = req.body?.progress;
    const progress = Number(rawProgress);

    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a number between 0 and 100',
      });
    }

    const normalizedProgress = Math.round(progress);
    const isCompleted = normalizedProgress >= 100;

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.userId,
          courseId,
        },
      },
    });

    if (!existingEnrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course',
      });
    }

    const enrollment = await prisma.enrollment.update({
      where: { userId_courseId: { userId: req.user.userId, courseId } },
      data: {
        progress: normalizedProgress,
        completed: isCompleted,
        lastAccessedAt: new Date(),
      },
      include: { course: true },
    });

    // Auto-generate Certificate if 100% completed
    if (isCompleted) {
      const existingCert = await prisma.certificate.findFirst({
        where: { userId: req.user.userId, courseId },
      });

      if (!existingCert) {
        const certNum = `CAD-${new Date().getFullYear()}-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
        await prisma.certificate.create({
          data: {
            userId: req.user.userId,
            courseId,
            certificateNumber: certNum,
          },
        });

        await prisma.notification.create({
          data: {
            userId: req.user.userId,
            title: '🎓 Course Completed & Certificate Issued!',
            message: `Congratulations! You earned your certificate for completing ${enrollment.course.title}.`,
            type: 'academy',
            link: '/dashboard',
          },
        });
      }
    }

    return res.json({ success: true, enrollment });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

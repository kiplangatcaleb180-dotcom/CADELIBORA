import { Request, Response } from 'express';
import prisma from '../config/db.js';

export async function getAdminCourses(req: Request, res: Response) {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            certificates: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error('Admin Academy courses error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load Academy courses.',
    });
  }
}

export async function createAdminCourse(req: Request, res: Response) {
  try {
    const {
      title,
      slug,
      category,
      description,
      coverImage,
      level,
      duration,
      instructorId,
      isPublished,
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and description are required.',
      });
    }

    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const existingCourse = await prisma.course.findUnique({
      where: { slug: finalSlug },
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: 'A course with this slug already exists.',
      });
    }

    const finalInstructorId = instructorId || (req as any).user?.userId;

    if (!finalInstructorId) {
      return res.status(400).json({
        success: false,
        message: 'An instructor is required.',
      });
    }

    const instructor = await prisma.user.findUnique({
      where: { id: finalInstructorId },
      select: { id: true },
    });

    if (!instructor) {
      return res.status(400).json({
        success: false,
        message: 'Selected instructor was not found.',
      });
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        category: category.trim(),
        description: description.trim(),
        coverImage: coverImage?.trim() || '',
        level: level || 'Beginner',
        duration: duration || '10 hours',
        instructorId: finalInstructorId,
        isPublished: isPublished ?? true,
      },
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Academy course created successfully.',
      course,
    });
  } catch (error) {
    console.error('Create Academy course error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create Academy course.',
    });
  }
}

export async function updateAdminCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const {
      title,
      slug,
      category,
      description,
      coverImage,
      level,
      duration,
      instructorId,
      isPublished,
    } = req.body;

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const finalSlug =
      slug !== undefined
        ? slug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : existingCourse.slug;

    if (finalSlug !== existingCourse.slug) {
      const slugOwner = await prisma.course.findUnique({
        where: { slug: finalSlug },
        select: { id: true },
      });

      if (slugOwner && slugOwner.id !== courseId) {
        return res.status(409).json({
          success: false,
          message: 'A course with this slug already exists.',
        });
      }
    }

    if (instructorId !== undefined) {
      const instructor = await prisma.user.findUnique({
        where: { id: instructorId },
        select: { id: true },
      });

      if (!instructor) {
        return res.status(400).json({
          success: false,
          message: 'Selected instructor was not found.',
        });
      }
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(slug !== undefined && { slug: finalSlug }),
        ...(category !== undefined && { category: category.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(coverImage !== undefined && { coverImage: coverImage.trim() }),
        ...(level !== undefined && { level }),
        ...(duration !== undefined && { duration }),
        ...(instructorId !== undefined && { instructorId }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: 'Academy course updated successfully.',
      course,
    });
  } catch (error) {
    console.error('Update Academy course error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update Academy course.',
    });
  }
}

export async function deleteAdminCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.params;

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    return res.json({
      success: true,
      message: `Course "${existingCourse.title}" deleted successfully.`,
    });
  } catch (error) {
    console.error('Delete Academy course error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete Academy course.',
    });
  }
}

export async function getAdminLessons(req: Request, res: Response) {
  try {
    const { courseId } = req.query;

    const lessons = await prisma.lesson.findMany({
      where: courseId ? { courseId: String(courseId) } : undefined,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { courseId: 'asc' },
        { order: 'asc' },
      ],
    });

    return res.json({
      success: true,
      lessons,
    });
  } catch (error) {
    console.error('Admin Academy lessons error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load Academy lessons.',
    });
  }
}

export async function createAdminLesson(req: Request, res: Response) {
  try {
    const {
      courseId,
      title,
      order,
      content,
      videoUrl,
      durationMinutes,
      isFree,
    } = req.body;

    if (!courseId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Course, title, and content are required.',
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const lessonOrder = order === undefined ? 1 : Number(order);
    const lessonDuration =
      durationMinutes === undefined ? 15 : Number(durationMinutes);

    if (
      !Number.isInteger(lessonOrder) ||
      lessonOrder < 1 ||
      !Number.isInteger(lessonDuration) ||
      lessonDuration < 1
    ) {
      return res.status(400).json({
        success: false,
        message: 'Lesson order and duration must be positive integers.',
      });
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title: title.trim(),
        order: lessonOrder,
        content: content.trim(),
        videoUrl: videoUrl?.trim() || null,
        durationMinutes: lessonDuration,
        isFree: isFree ?? false,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Academy lesson created successfully.',
      lesson,
    });
  } catch (error) {
    console.error('Create Academy lesson error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create Academy lesson.',
    });
  }
}

export async function updateAdminLesson(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;
    const {
      courseId,
      title,
      order,
      content,
      videoUrl,
      durationMinutes,
      isFree,
    } = req.body;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.',
      });
    }

    if (courseId !== undefined) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true },
      });

      if (!course) {
        return res.status(400).json({
          success: false,
          message: 'Selected course was not found.',
        });
      }
    }

    const lessonOrder =
      order !== undefined ? Number(order) : existingLesson.order;
    const lessonDuration =
      durationMinutes !== undefined
        ? Number(durationMinutes)
        : existingLesson.durationMinutes;

    if (
      !Number.isInteger(lessonOrder) ||
      lessonOrder < 1 ||
      !Number.isInteger(lessonDuration) ||
      lessonDuration < 1
    ) {
      return res.status(400).json({
        success: false,
        message: 'Lesson order and duration must be positive integers.',
      });
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(courseId !== undefined && { courseId }),
        ...(title !== undefined && { title: title.trim() }),
        ...(order !== undefined && { order: lessonOrder }),
        ...(content !== undefined && { content: content.trim() }),
        ...(videoUrl !== undefined && {
          videoUrl: videoUrl?.trim() || null,
        }),
        ...(durationMinutes !== undefined && {
          durationMinutes: lessonDuration,
        }),
        ...(isFree !== undefined && { isFree }),
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: 'Academy lesson updated successfully.',
      lesson,
    });
  } catch (error) {
    console.error('Update Academy lesson error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update Academy lesson.',
    });
  }
}

export async function deleteAdminLesson(req: Request, res: Response) {
  try {
    const { lessonId } = req.params;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });

    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.',
      });
    }

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return res.json({
      success: true,
      message: 'Academy lesson deleted successfully.',
    });
  } catch (error) {
    console.error('Delete Academy lesson error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete Academy lesson.',
    });
  }
}

export async function getAdminEnrollments(req: Request, res: Response) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    return res.json({
      success: true,
      enrollments,
    });
  } catch (error) {
    console.error('Get Academy enrollments error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load Academy enrollments.',
    });
  }
}

export async function updateAdminEnrollment(req: Request, res: Response) {
  try {
    const { enrollmentId } = req.params;
    const { progress, completed } = req.body;

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!existingEnrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found.',
      });
    }

    const updateData: {
      progress?: number;
      completed?: boolean;
      lastAccessedAt?: Date;
    } = {};

    if (progress !== undefined) {
      const numericProgress = Number(progress);

      if (
        !Number.isFinite(numericProgress) ||
        numericProgress < 0 ||
        numericProgress > 100
      ) {
        return res.status(400).json({
          success: false,
          message: 'Progress must be a number between 0 and 100.',
        });
      }

      updateData.progress = Math.round(numericProgress);
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }

    updateData.lastAccessedAt = new Date();

    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: 'Academy enrollment updated successfully.',
      enrollment,
    });
  } catch (error) {
    console.error('Update Academy enrollment error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update Academy enrollment.',
    });
  }
}

export async function getAdminCertificates(req: Request, res: Response) {
  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    return res.json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error('Get Academy certificates error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load Academy certificates.',
    });
  }
}

export async function updateAdminCertificate(req: Request, res: Response) {
  try {
    const { certificateId } = req.params;
    const { certificateNumber, pdfUrl } = req.body;

    const existingCertificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!existingCertificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found.',
      });
    }

    if (
      certificateNumber !== undefined &&
      certificateNumber.trim() !== certificateNumber
    ) {
      return res.status(400).json({
        success: false,
        message: 'Certificate number cannot contain leading or trailing spaces.',
      });
    }

    if (certificateNumber !== undefined) {
      const duplicate = await prisma.certificate.findFirst({
        where: {
          certificateNumber,
          NOT: {
            id: certificateId,
          },
        },
        select: {
          id: true,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Certificate number is already in use.',
        });
      }
    }

    const certificate = await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        ...(certificateNumber !== undefined && {
          certificateNumber,
        }),
        ...(pdfUrl !== undefined && {
          pdfUrl: pdfUrl?.trim() || null,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: 'Academy certificate updated successfully.',
      certificate,
    });
  } catch (error) {
    console.error('Update Academy certificate error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update Academy certificate.',
    });
  }
}

export async function getAdminAcademyStats(req: Request, res: Response) {
  try {
    const [
      totalCourses,
      publishedCourses,
      totalLessons,
      totalEnrollments,
      completedEnrollments,
      totalCertificates,
    ] = await Promise.all([
      prisma.course.count(),

      prisma.course.count({
        where: {
          isPublished: true,
        },
      }),

      prisma.lesson.count(),

      prisma.enrollment.count(),

      prisma.enrollment.count({
        where: {
          completed: true,
        },
      }),

      prisma.certificate.count(),
    ]);

    return res.json({
      success: true,
      stats: {
        totalCourses,
        publishedCourses,
        totalLessons,
        totalEnrollments,
        completedEnrollments,
        totalCertificates,
      },
    });
  } catch (error) {
    console.error('Get Academy stats error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load Academy statistics.',
    });
  }
}

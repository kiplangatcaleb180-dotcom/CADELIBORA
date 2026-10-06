import prisma from '../config/db.js';

type DashboardRole =
  | 'STUDENT'
  | 'INSTRUCTOR'
  | 'RESEARCHER'
  | 'DEVELOPER'
  | 'MODERATOR'
  | 'PARTNER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'USER';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function monthBuckets(count = 6) {
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (count - 1 - index),
      1,
    );

    return {
      label: date.toLocaleString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  });
}

function countByMonth<T extends { createdAt: Date }>(
  records: T[],
  buckets: ReturnType<typeof monthBuckets>,
) {
  return buckets.map((bucket) => ({
    label: bucket.label,
    value: records.filter((record) => {
      const date = new Date(record.createdAt);

      return (
        date.getFullYear() === bucket.year &&
        date.getMonth() === bucket.month
      );
    }).length,
  }));
}

function average(values: number[]) {
  if (!values.length) return 0;

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

async function studentAnalytics(userId: string) {
  const [enrollments, certificates, savedResources, posts, comments] =
    await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { lastAccessedAt: 'desc' },
      }),
      prisma.certificate.findMany({
        where: { userId },
        select: { id: true, issuedAt: true },
      }),
      prisma.savedResource.findMany({
        where: { userId },
        select: { id: true, createdAt: true },
      }),
      prisma.communityPost.findMany({
        where: { authorId: userId },
        select: { id: true, createdAt: true },
      }),
      prisma.comment.findMany({
        where: { authorId: userId },
        select: { id: true, createdAt: true },
      }),
    ]);

  const buckets = monthBuckets();

  const progress = enrollments.map((enrollment) => ({
    name: enrollment.course.title,
    progress: Math.max(0, Math.min(100, enrollment.progress)),
  }));

  const completed = enrollments.filter((item) => item.completed).length;
  const inProgress = enrollments.filter(
    (item) => !item.completed && item.progress > 0,
  ).length;
  const notStarted = enrollments.filter(
    (item) => !item.completed && item.progress === 0,
  ).length;

  return {
    kpis: {
      primary: [
        { label: 'Enrolled Courses', value: enrollments.length },
        { label: 'Completed Courses', value: completed },
        { label: 'Certificates', value: certificates.length },
        { label: 'Saved Resources', value: savedResources.length },
      ],
      secondary: [
        { label: 'Community Posts', value: posts.length },
        { label: 'Comments', value: comments.length },
        {
          label: 'Average Course Progress',
          value: `${average(enrollments.map((item) => item.progress))}%`,
        },
      ],
    },

    charts: {
      courseProgress: progress,

      learningStatus: [
        { name: 'Completed', value: completed },
        { name: 'In Progress', value: inProgress },
        { name: 'Not Started', value: notStarted },
      ],

      learningActivity: buckets.map((bucket) => {
        const enrollmentActivity = enrollments.filter((item) => {
          const date = new Date(item.lastAccessedAt);

          return (
            date.getFullYear() === bucket.year &&
            date.getMonth() === bucket.month
          );
        }).length;

        return {
          label: bucket.label,
          value: enrollmentActivity,
        };
      }),

      achievementTrend: countByMonth(
        certificates.map((item) => ({
          createdAt: item.issuedAt,
        })),
        buckets,
      ),

      resourceActivity: countByMonth(savedResources, buckets),

      communityActivity: buckets.map((bucket) => {
        const postCount = posts.filter((item) => {
          const date = new Date(item.createdAt);

          return (
            date.getFullYear() === bucket.year &&
            date.getMonth() === bucket.month
          );
        }).length;

        const commentCount = comments.filter((item) => {
          const date = new Date(item.createdAt);

          return (
            date.getFullYear() === bucket.year &&
            date.getMonth() === bucket.month
          );
        }).length;

        return {
          label: bucket.label,
          posts: postCount,
          comments: commentCount,
        };
      }),
    },
  };
}

async function instructorAnalytics(userId: string) {
  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      enrollments: {
        select: {
          progress: true,
          completed: true,
        },
      },
      lessons: {
        select: { id: true },
      },
    },
  });

  const allEnrollments = courses.flatMap((course) => course.enrollments);

  return {
    kpis: {
      primary: [
        { label: 'My Courses', value: courses.length },
        { label: 'Students', value: allEnrollments.length },
        {
          label: 'Completed Learners',
          value: allEnrollments.filter((item) => item.completed).length,
        },
        {
          label: 'Average Progress',
          value: `${average(allEnrollments.map((item) => item.progress))}%`,
        },
      ],
      secondary: [
        {
          label: 'Lessons',
          value: courses.reduce((sum, course) => sum + course.lessons.length, 0),
        },
        {
          label: 'Published Courses',
          value: courses.filter((course) => course.isPublished).length,
        },
      ],
    },

    charts: {
      courseEnrollment: courses.map((course) => ({
        name: course.title,
        value: course.enrollments.length,
      })),

      studentProgress: courses.map((course) => ({
        name: course.title,
        value: average(course.enrollments.map((item) => item.progress)),
      })),

      courseCompletion: courses.map((course) => {
        const total = course.enrollments.length;

        return {
          name: course.title,
          value: total
            ? Math.round(
                (course.enrollments.filter((item) => item.completed).length /
                  total) *
                  100,
              )
            : 0,
        };
      }),

      courseStatus: [
        {
          name: 'Published',
          value: courses.filter((course) => course.isPublished).length,
        },
        {
          name: 'Draft',
          value: courses.filter((course) => !course.isPublished).length,
        },
      ],
    },
  };
}

async function researcherAnalytics(userId: string) {
  const [projects, publications, savedResources] = await Promise.all([
    prisma.researchProject.findMany({
      where: { leadResearcherId: userId },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.publication.findMany({
      where: {
        researchProject: {
          leadResearcherId: userId,
        },
      },
      select: {
        id: true,
        title: true,
        year: true,
      },
    }),
    prisma.savedResource.count({
      where: { userId },
    }),
  ]);

  const statusMap = new Map<string, number>();

  for (const project of projects) {
    statusMap.set(
      project.status,
      (statusMap.get(project.status) ?? 0) + 1,
    );
  }

  const publicationYears = new Map<number, number>();

  for (const publication of publications) {
    publicationYears.set(
      publication.year,
      (publicationYears.get(publication.year) ?? 0) + 1,
    );
  }

  return {
    kpis: {
      primary: [
        { label: 'Research Projects', value: projects.length },
        { label: 'Publications', value: publications.length },
        { label: 'Saved Resources', value: savedResources },
        {
          label: 'Active Projects',
          value: projects.filter((project) =>
            ['ONGOING', 'Ongoing', 'ACTIVE', 'Active'].includes(project.status),
          ).length,
        },
      ],
    },

    charts: {
      projectStatus: Array.from(statusMap.entries()).map(
        ([name, value]) => ({
          name,
          value,
        }),
      ),

      publicationTrend: Array.from(publicationYears.entries())
        .sort(([a], [b]) => a - b)
        .map(([year, value]) => ({
          label: String(year),
          value,
        })),

      researchActivity: countByMonth(
        projects.map((project) => ({
          createdAt: project.createdAt,
        })),
        monthBuckets(),
      ),
    },
  };
}

async function developerAnalytics() {
  const [projects, technologies, resources] = await Promise.all([
    prisma.project.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        createdAt: true,
      },
    }),
    prisma.technology.count(),
    prisma.savedResource.count(),
  ]);

  const statusMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  for (const project of projects) {
    statusMap.set(
      project.status,
      (statusMap.get(project.status) ?? 0) + 1,
    );

    categoryMap.set(
      project.category,
      (categoryMap.get(project.category) ?? 0) + 1,
    );
  }

  return {
    kpis: {
      primary: [
        { label: 'Platform Projects', value: projects.length },
        { label: 'Technologies', value: technologies },
        { label: 'Resources', value: resources },
        {
          label: 'Active Projects',
          value: projects.filter((project) =>
            ['ACTIVE', 'Active', 'ONGOING', 'Ongoing'].includes(project.status),
          ).length,
        },
      ],
    },

    charts: {
      projectStatus: Array.from(statusMap.entries()).map(
        ([name, value]) => ({
          name,
          value,
        }),
      ),

      projectCategories: Array.from(categoryMap.entries()).map(
        ([name, value]) => ({
          name,
          value,
        }),
      ),

      developmentActivity: countByMonth(projects, monthBuckets()),
    },
  };
}

async function moderatorAnalytics(userId: string) {
  const [posts, comments, audits] = await Promise.all([
    prisma.communityPost.findMany({
      select: { id: true, createdAt: true },
    }),
    prisma.comment.findMany({
      select: { id: true, createdAt: true },
    }),
    prisma.auditLog.findMany({
      where: { userId },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    kpis: {
      primary: [
        { label: 'Community Posts', value: posts.length },
        { label: 'Comments', value: comments.length },
        { label: 'My Actions', value: audits.length },
        {
          label: 'Recent Actions',
          value: audits.filter(
            (item) =>
              Date.now() - new Date(item.createdAt).getTime() <
              30 * 24 * 60 * 60 * 1000,
          ).length,
        },
      ],
    },

    charts: {
      communityActivity: monthBuckets().map((bucket) => ({
        label: bucket.label,
        posts: posts.filter((item) => {
          const date = new Date(item.createdAt);

          return (
            date.getFullYear() === bucket.year &&
            date.getMonth() === bucket.month
          );
        }).length,
        comments: comments.filter((item) => {
          const date = new Date(item.createdAt);

          return (
            date.getFullYear() === bucket.year &&
            date.getMonth() === bucket.month
          );
        }).length,
      })),

      moderationActivity: countByMonth(audits, monthBuckets()),
    },
  };
}

async function partnerAnalytics(userId: string) {
  const [orders, messages, projects] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.message.findMany({
      where: { senderId: userId },
      select: {
        id: true,
        createdAt: true,
      },
    }),
    prisma.project.count(),
  ]);

  const orderStatus = new Map<string, number>();

  for (const order of orders) {
    orderStatus.set(
      order.status,
      (orderStatus.get(order.status) ?? 0) + 1,
    );
  }

  return {
    kpis: {
      primary: [
        { label: 'Orders', value: orders.length },
        {
          label: 'Order Value',
          value: orders.reduce((sum, order) => sum + order.amount, 0),
        },
        { label: 'Messages', value: messages.length },
        { label: 'Platform Projects', value: projects },
      ],
    },

    charts: {
      orderStatus: Array.from(orderStatus.entries()).map(
        ([name, value]) => ({
          name,
          value,
        }),
      ),

      collaborationActivity: countByMonth(messages, monthBuckets()),

      orderTrend: countByMonth(orders, monthBuckets()),
    },
  };
}

async function personalUserAnalytics(userId: string) {
  const [enrollments, resources, posts, comments, orders, conversations] =
    await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        select: { id: true, enrolledAt: true, progress: true },
      }),
      prisma.savedResource.findMany({
        where: { userId },
        select: { id: true, createdAt: true },
      }),
      prisma.communityPost.findMany({
        where: { authorId: userId },
        select: { id: true, createdAt: true },
      }),
      prisma.comment.findMany({
        where: { authorId: userId },
        select: { id: true, createdAt: true },
      }),
      prisma.order.findMany({
        where: { userId },
        select: { id: true, createdAt: true, amount: true },
      }),
      prisma.conversationParticipant.count({
        where: { userId },
      }),
    ]);

  return {
    kpis: {
      primary: [
        { label: 'Courses', value: enrollments.length },
        { label: 'Saved Resources', value: resources.length },
        { label: 'Community Posts', value: posts.length },
        { label: 'Orders', value: orders.length },
      ],
      secondary: [
        { label: 'Conversations', value: conversations },
        {
          label: 'Average Learning Progress',
          value: `${average(enrollments.map((item) => item.progress))}%`,
        },
      ],
    },

    charts: {
      personalActivity: [
        {
          label: 'Courses',
          value: enrollments.length,
        },
        {
          label: 'Resources',
          value: resources.length,
        },
        {
          label: 'Posts',
          value: posts.length,
        },
        {
          label: 'Comments',
          value: comments.length,
        },
        {
          label: 'Orders',
          value: orders.length,
        },
      ],

      activityTrend: monthBuckets().map((bucket) => ({
        label: bucket.label,
        courses: enrollments.filter((item) => {
          const date = new Date(item.enrolledAt);

          return (
            date.getFullYear() === bucket.year &&
            date.getMonth() === bucket.month
          );
        }).length,
        resources: resources.filter((item) => {
          const date = new Date(item.createdAt);

          return (
            date.getFullYear() === bucket.year &&
            date.getMonth() === bucket.month
          );
        }).length,
        posts: posts.filter((item) => {
          const date = new Date(item.createdAt);

          return (
            date.getFullYear() === bucket.year &&
            date.getMonth() === bucket.month
          );
        }).length,
      })),
    },
  };
}

async function administratorAnalytics() {
  const [
    users,
    courses,
    enrollments,
    researchProjects,
    projects,
    products,
    articles,
    resources,
    posts,
    audits,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.researchProject.count(),
    prisma.project.count(),
    prisma.product.count(),
    prisma.article.count(),
    prisma.libraryResource.count(),
    prisma.communityPost.count(),
    prisma.auditLog.findMany({
      select: { id: true, createdAt: true, action: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const actionMap = new Map<string, number>();

  for (const audit of audits) {
    actionMap.set(
      audit.action,
      (actionMap.get(audit.action) ?? 0) + 1,
    );
  }

  return {
    kpis: {
      primary: [
        { label: 'Users', value: users },
        { label: 'Courses', value: courses },
        { label: 'Enrollments', value: enrollments },
        { label: 'Projects', value: projects },
      ],
      secondary: [
        { label: 'Research Projects', value: researchProjects },
        { label: 'Products', value: products },
        { label: 'Articles', value: articles },
        { label: 'Resources', value: resources },
      ],
    },

    charts: {
      platformComposition: [
        { name: 'Users', value: users },
        { name: 'Courses', value: courses },
        { name: 'Projects', value: projects },
        { name: 'Research', value: researchProjects },
        { name: 'Articles', value: articles },
        { name: 'Resources', value: resources },
      ],

      communityActivity: [
        { name: 'Posts', value: posts },
        {
          name: 'Comments',
          value: await prisma.comment.count(),
        },
      ],

      auditActivity: countByMonth(audits, monthBuckets()),

      auditActions: Array.from(actionMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({
          name,
          value,
        })),
    },
  };
}

export async function getDashboardOverviewAnalytics(
  userId: string,
  role: string,
) {
  const normalizedRole = role.toUpperCase() as DashboardRole;

  let analytics;

  switch (normalizedRole) {
    case 'STUDENT':
      analytics = await studentAnalytics(userId);
      break;

    case 'INSTRUCTOR':
      analytics = await instructorAnalytics(userId);
      break;

    case 'RESEARCHER':
      analytics = await researcherAnalytics(userId);
      break;

    case 'DEVELOPER':
      analytics = await developerAnalytics();
      break;

    case 'MODERATOR':
      analytics = await moderatorAnalytics(userId);
      break;

    case 'PARTNER':
      analytics = await partnerAnalytics(userId);
      break;

    case 'ADMIN':
    case 'SUPER_ADMIN':
      analytics = await administratorAnalytics();
      break;

    case 'USER':
    default:
      analytics = await personalUserAnalytics(userId);
      break;
  }

  return {
    success: true,
    role: normalizedRole,
    generatedAt: new Date().toISOString(),
    ...analytics,
  };
}

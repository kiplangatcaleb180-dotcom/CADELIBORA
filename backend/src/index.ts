import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import prisma from './config/db.js';
import organizationRoutes from './routes/organization.routes.js';
import technologyRoutes from './routes/technology.routes.js';
import adminOrganizationRoutes from './routes/adminOrganization.routes.js';
import adminTechnologyRoutes from './routes/adminTechnology.routes.js';
import adminResearchRoutes from './routes/adminResearch.routes.js';
import adminInnovationRoutes from './routes/adminInnovation.routes.js';
import adminAcademyRoutes from './routes/adminAcademy.routes.js';
import adminServicesRoutes from './routes/adminServices.routes.js';

import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/courses.routes.js';
import researchRoutes from './routes/research.routes.js';
import projectRoutes from './routes/projects.routes.js';
import innovationRoutes from './routes/innovation.routes.js';
import libraryRoutes from './routes/library.routes.js';
import communityRoutes from './routes/community.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';
import serviceRoutes from './routes/services.routes.js';
import articleRoutes from './routes/articles.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import storageRoutes from './routes/storage.routes.js';
import messageRoutes from './routes/messages.routes.js';
import searchRoutes from './routes/search.routes.js';
import dashboardAnalyticsRoutes from './routes/dashboardAnalytics.routes.js';
import contactRoutes from './routes/contact.routes.js';
import moderationRoutes from './routes/moderation.routes.js';
import brandingRoutes from './routes/branding.routes.js';

export const app = express();

// Middleware
const allowedOrigins = [
  ENV.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.100.158:5173',
  'http://192.168.100.158:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        ENV.NODE_ENV !== 'production' ||
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.startsWith('http://192.168.')
      ) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Health Check
app.get('/health', async (_req, res) => {
  let database = 'DEGRADED';

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = 'ONLINE';
  } catch (error) {
    console.error('Health check database probe failed:', error);
  }

  const status = database === 'ONLINE' ? 'ONLINE' : 'DEGRADED';

  res.status(status === 'ONLINE' ? 200 : 503).json({
    status,
    services: {
      api: 'ONLINE',
      database,
    },
    organization: 'CADELIBORA Core Platform API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Public Platform Stats
app.get('/api/stats/public', async (_req, res) => {
  try {
    const [totalUsers, totalCourses, totalResearchProjects, totalLibraryResources, totalCommunityPosts] = await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.researchProject.count(),
      prisma.libraryResource.count(),
      prisma.communityPost.count(),
    ]);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        totalResearchProjects,
        totalLibraryResources,
        totalCommunityPosts,
      },
    });
  } catch (err: any) {
    console.error('Failed to load public platform stats:', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to load platform statistics',
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/innovation', innovationRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dashboard/analytics', dashboardAnalyticsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/branding', brandingRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/technology', technologyRoutes);
app.use('/api/admin/organization', adminOrganizationRoutes);
app.use('/api/admin/technology', adminTechnologyRoutes);
app.use('/api/admin/research', adminResearchRoutes);
app.use('/api/admin/innovation', adminInnovationRoutes);
app.use('/api/admin/academy', adminAcademyRoutes);
app.use('/api/admin/services', adminServicesRoutes);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const PORT = parseInt(ENV.PORT, 10);
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CADELIBORA Backend Server listening on http://localhost:${PORT}`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log('✅ Database connections closed. Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;

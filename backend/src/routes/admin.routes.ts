import { Router } from 'express';
import {
  getAdminDashboardStats,
  getAllUsers,
  createAdminUser,
  updateAdminUser,
  updateUserRole,
  updateUserAccountStatus,
  deleteUser,
  createCourse,
  deleteCourse,
  createProduct,
  deleteProduct,
  getAdminArticles,
  createArticle,
  updateArticle,
  toggleArticlePublished,
  deleteArticle,
  createLibraryResource,
  deleteLibraryResource,
  deleteCommunityPost,
} from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles, requirePermission } from '../middleware/auth.js';

const router = Router();

// Middleware guard: Must be SUPER_ADMIN or ADMIN
router.use(authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'));

// Stats & Users
router.get('/stats', getAdminDashboardStats);
router.get('/users', getAllUsers);
router.post('/users', requirePermission('users.create'), createAdminUser);
router.patch('/users/:userId', requirePermission('users.update'), updateAdminUser);
router.put('/users/:userId/role', requirePermission('roles.assign'), updateUserRole);
router.put(
  '/users/:userId/status',
  requirePermission('users.suspend'),
  updateUserAccountStatus
);
router.delete('/users/:userId', requirePermission('users.delete'), deleteUser);

// Courses
router.post('/courses', requirePermission('courses.create'), createCourse);
router.delete('/courses/:courseId', requirePermission('courses.delete'), deleteCourse);

// Products
router.post('/products', requirePermission('products.manage'), createProduct);
router.delete('/products/:productId', requirePermission('products.manage'), deleteProduct);

// Articles & News
router.get('/articles', requirePermission('articles.view'), getAdminArticles);
router.post('/articles', requirePermission('articles.create'), createArticle);
router.put('/articles/:articleId', requirePermission('articles.update'), updateArticle);
router.patch('/articles/:articleId/publish', requirePermission('articles.publish'), toggleArticlePublished);
router.delete('/articles/:articleId', requirePermission('articles.delete'), deleteArticle);

// Library
router.post('/library', requirePermission('library.create'), createLibraryResource);
router.delete('/library/:resourceId', requirePermission('library.delete'), deleteLibraryResource);

// Moderation
router.delete('/community/posts/:postId', requirePermission('community.remove'), deleteCommunityPost);

export default router;

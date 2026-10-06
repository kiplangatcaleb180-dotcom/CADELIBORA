import { Router } from 'express';
import {
  getProjectsAndProducts,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/projects.controller.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

// Public catalog
router.get('/', getProjectsAndProducts);

// Product routes
router.get('/products/:id', getProductById);

router.post(
  '/products',
  authenticate,
  requirePermission('products.manage'),
  createProduct
);

router.put(
  '/products/:id',
  authenticate,
  requirePermission('products.manage'),
  updateProduct
);

router.delete(
  '/products/:id',
  authenticate,
  requirePermission('products.manage'),
  deleteProduct
);

// Project routes
router.get('/:id', getProjectById);

router.post(
  '/',
  authenticate,
  requirePermission('projects.create'),
  createProject
);

router.put(
  '/:id',
  authenticate,
  requirePermission('projects.update'),
  updateProject
);

router.delete(
  '/:id',
  authenticate,
  requirePermission('projects.delete'),
  deleteProject
);

export default router;

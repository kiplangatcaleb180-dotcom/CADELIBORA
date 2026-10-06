import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getDashboardOverviewAnalyticsController,
} from '../controllers/dashboardAnalytics.controller.js';

const router = Router();

router.get(
  '/overview',
  authenticate,
  getDashboardOverviewAnalyticsController,
);

export default router;

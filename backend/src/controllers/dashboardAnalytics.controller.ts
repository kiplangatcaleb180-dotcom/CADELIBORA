import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getDashboardOverviewAnalytics } from '../services/dashboardAnalyticsService.js';

export async function getDashboardOverviewAnalyticsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const analytics = await getDashboardOverviewAnalytics(
      req.user.userId,
      req.user.role,
    );

    return res.json(analytics);
  } catch (error: any) {
    console.error('Dashboard overview analytics failed:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to load dashboard analytics',
    });
  }
}

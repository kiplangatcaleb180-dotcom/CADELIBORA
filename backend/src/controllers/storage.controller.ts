import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function uploadAsset(_req: AuthenticatedRequest, res: Response) {
  return res.status(501).json({
    success: false,
    message: 'Asset storage is not configured on this server.',
  });
}

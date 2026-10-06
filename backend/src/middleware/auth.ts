import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../auth/jwt.js';
import { userHasPermission } from '../auth/permissions.js';
import prisma from '../config/db.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        accountStatus: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    if (user.accountStatus !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently suspended.',
      });
    }

    req.user = { ...decoded, role: user.role };

    // Keep an operational trail of authenticated write activity without storing request bodies.
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && !req.path.startsWith('/admin/stats')) {
      res.on('finish', () => {
        prisma.auditLog.create({
          data: {
            userId: user.id,
            action: `HTTP_${req.method}`,
            entity: req.baseUrl + req.path,
            ipAddress: req.ip || '127.0.0.1',
            detailsJson: { statusCode: res.statusCode },
          },
        }).catch((error) => console.error('Failed to record platform activity:', error));
      });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function authorizeRoles(
  ...allowedRoles: string[]
) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (
      !allowedRoles.includes(req.user.role) &&
      req.user.role !== 'SUPER_ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to perform this action.`,
      });
    }

    next();
  };
}

export function requirePermission(permission: string) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!userHasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Insufficient permissions for operation: '${permission}'.`,
      });
    }

    next();
  };
}

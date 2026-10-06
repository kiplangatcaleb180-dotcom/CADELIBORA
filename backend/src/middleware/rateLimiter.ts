import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function rateLimiter(maxRequests = 60, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    store[ip].count++;
    if (store[ip].count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.',
      });
    }

    next();
  };
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import User from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

import { getJwtSecret } from '../utils/auth';

export const authMiddleware = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded: any = jwt.verify(token, getJwtSecret());
    
    // Query DB to ensure user exists and is active (not blocked)
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new AppError('User account not found', 401);
    }

    if (user.isBlocked) {
      throw new AppError('Account is suspended. Please contact administrator.', 403);
    }

    req.userId = user._id.toString();
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Invalid or expired token', 401));
  }
};

export const adminMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('Access denied: Admin privileges required', 403);
  }
  next();
};

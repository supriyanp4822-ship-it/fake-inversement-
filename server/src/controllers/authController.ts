import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';
import { validate, registerSchema, loginSchema } from '../validators/schemas';
import { AppError } from '../middleware/errorHandler';

export const register = async (req: AuthRequest, res: Response) => {
  const validated = validate(registerSchema, req.body);
  const result = await authService.registerUser(validated.email, validated.password, validated.fullName);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
};

export const login = async (req: AuthRequest, res: Response) => {
  const validated = validate(loginSchema, req.body);
  const result = await authService.loginUser(validated.email, validated.password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
};

export const logout = (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

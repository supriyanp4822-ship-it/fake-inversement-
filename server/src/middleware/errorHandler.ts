import { Request, Response, NextFunction } from 'express';

export interface ErrorWithStatus extends Error {
  status?: number;
  details?: any;
}

export class AppError extends Error {
  constructor(public message: string, public status: number = 500, public details?: any) {
    super(message);
  }
}

export const errorHandler = (
  error: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  console.error(`[${status}] ${message}`, error);

  const response: Record<string, any> = {
    success: false,
    message: status === 500 && process.env.NODE_ENV === 'production' 
      ? 'An unexpected server error occurred.' 
      : message,
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.stack = error.stack;
  }

  res.status(status).json(response);
};

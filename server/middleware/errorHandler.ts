import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger.js';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(err: CustomError, req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';
  const message = (statusCode === 500 && isProd) ? 'Erro interno no servidor' : err.message;

  logger.error({
    path: req.path,
    method: req.method,
    statusCode,
    error: err.message,
    stack: err.stack
  }, '[API Error]');

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  });
}

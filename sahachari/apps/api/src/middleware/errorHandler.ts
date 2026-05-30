import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'सर्भर त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।',
  });
}
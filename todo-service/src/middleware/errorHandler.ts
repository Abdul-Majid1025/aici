import { Request, Response, NextFunction } from 'express';
import ApiError from '../errors/apiError';

export default function errorHandler(
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: { message: err.message, code: err.status } });
  } else {
    console.error(err);
    res.status(500).json({ error: { message: 'Internal Server Error', code: 500 } });
  }
}

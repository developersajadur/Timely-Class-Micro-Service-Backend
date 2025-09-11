import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import status from 'http-status';

export const appLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 15, // max 15 requests per window per IP
  handler: (req: Request, res: Response) => {
    res.status(status.REQUESTED_RANGE_NOT_SATISFIABLE).json({
      success: false,
      statusCode: status.REQUESTED_RANGE_NOT_SATISFIABLE,
      message:
        'Too many requests from this IP. Please try again after 30 seconds.',
    });
  },
});

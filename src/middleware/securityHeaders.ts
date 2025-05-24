import { Request, Response } from 'express';

export default function consfigureSecurityHeaders(
  req: Request,
  res: Response,
  next: () => void,
) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
}

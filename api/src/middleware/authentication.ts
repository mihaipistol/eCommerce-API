import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function validateJwt(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.jwt || req.header('Authorization');
    if (!token) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    // req.user = decoded;
    next();
  } catch (error) {}
}

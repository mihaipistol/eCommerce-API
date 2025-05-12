import { NextFunction, Request, Response } from 'express';
import { ROLE_USER } from '../lib/constants';
import { verifyToken } from '../lib/jwt';
import { User } from '../types/index';

export function validateToken(...allowedRoles: string[]) {
  return async function validateToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (allowedRoles.length === 0) {
      allowedRoles.push(ROLE_USER);
    }
    try {
      const token = req.cookies?.jwt || req.header('Authorization');
      if (!token) {
        res.status(401).json({ message: 'Authentication failed' });
        return;
      }
      const decoded = (await verifyToken(token)) as User;
      if (decoded && allowedRoles.length > 0) {
        const userRole = decoded.role;
        if (!allowedRoles.includes(userRole)) {
          res.status(403).json({ message: 'Access denied' });
          return;
        }
      }
      if (!decoded) {
        res.status(401).json({ message: 'Authentication failed' });
        return;
      }
      next();
    } catch (error) {
      console.error('Error validating token:', error);
      res.status(401).json({ message: 'Authentication failed' });
    }
  };
}

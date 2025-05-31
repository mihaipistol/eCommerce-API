import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/jwt';
import { JwtUser, UserRole } from '../types/index';

function verifyRole(given: UserRole, expected: UserRole) {
  switch (given) {
    case UserRole.USER:
      if (expected === UserRole.USER) {
        return true;
      }
    case UserRole.SELLER:
      if (expected === UserRole.SELLER || expected === UserRole.USER) {
        return true;
      }
    case UserRole.ADMIN:
      if (
        expected === UserRole.ADMIN ||
        expected === UserRole.SELLER ||
        expected === UserRole.USER
      ) {
        return true;
      }
    default:
      return false;
  }
}

export function validateToken(...allowedRoles: string[]) {
  return async function validateToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (allowedRoles.length === 0) {
      allowedRoles.push(UserRole.USER);
    }
    try {
      const token = req.cookies?.jwt || req.header('Authorization');
      if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }
      const user = (await verifyToken(token)) as JwtUser;
      if (!user) {
        res.status(401).json({ message: 'Invalid token' });
        return;
      }
      if (user && allowedRoles.length > 0) {
        const isAllowed = allowedRoles
          .map((role) => {
            return verifyRole(user.role, role as UserRole);
          })
          .find((response) => response === true);
        if (!isAllowed) {
          res.status(403).json({ message: 'Access denied' });
          return;
        }
      }
      if (!user) {
        res.status(401).json({ message: 'Authentication failed' });
        return;
      }
      req.user = user as JwtUser;
      next();
    } catch (error) {
      console.error('Error validating token:', error);
      res.status(401).json({ message: 'Authentication failed' });
    }
  };
}

export async function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.header('Authorization');
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    const { id } = (await verifyToken(token)) as { id: number };
    if (!id) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    req.refresh = id;
    next();
  } catch (error) {
    console.error('Error validating refresh token:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}

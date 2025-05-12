import { desc, eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db/index';
import { passwordsTable } from '../../db/schema/passwords';
import { usersTable } from '../../db/schema/users';
import { makeHash } from '../../lib/crypto';
import { createToken, JWT_COOKIE_OPTIONS, verifyToken } from '../../lib/jwt';
import { User } from '../../types/index';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, req.body.email));
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const [password] = await db
      .select()
      .from(passwordsTable)
      .where(eq(passwordsTable.id, user.id))
      .orderBy(desc(passwordsTable.createdAt));
    if (!password) {
      res.status(404).json({ massage: 'Password not found' });
      return;
    }
    const hash = makeHash(req.body.password, password.salt);
    if (password.hash !== hash) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    const token = createToken({
      id: user.id,
      role: user.role,
    } as User);
    res.cookie('jwt', token, JWT_COOKIE_OPTIONS);
    res.status(200).json({
      jwt: token,
    });
  } catch (error) {
    console.error('Error at login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie('jwt', JWT_COOKIE_OPTIONS);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error at logout:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    const payload = await verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    const newToken = createToken(payload);
    res.cookie('jwt', newToken, JWT_COOKIE_OPTIONS);
    res.status(200).json({
      jwt: newToken,
    });
  } catch (error) {
    console.error('Error at refreshToken:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
}

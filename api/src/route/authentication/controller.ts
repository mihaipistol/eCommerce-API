import { desc, eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db/index';
import { passwordsTable } from '../../db/schema/passwords';
import { usersTable } from '../../db/schema/users';
import { makeHash } from '../../lib/crypto';
import jwt from 'jsonwebtoken';

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
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: JWT_EXPIRATION,
      sameSite: 'strict',
    });
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
  } catch (error) {
    console.error('Error at logout:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
  } catch (error) {
    console.error('Error at refreshToken:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
}

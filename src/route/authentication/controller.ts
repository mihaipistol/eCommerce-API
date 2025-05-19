import { desc, eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../../db';
import { passwordsTable } from '../../db/schema/passwords';
import { refreshTokensTable } from '../../db/schema/refreshTokens';
import { usersTable } from '../../db/schema/users';
import { makeHash } from '../../lib/crypto';
import {
  createToken,
  JWT_COOKIE_OPTIONS,
  JWT_REFRESH_EXPIRATION,
  verifyToken,
} from '../../lib/jwt';
import { JwtSub, JwtUser } from '../../types';

type UserWithPasswords = typeof usersTable.$inferSelect & {
  passwords: (typeof passwordsTable.$inferSelect)[];
};

type UserWithRefreshTokens = typeof usersTable.$inferSelect & {
  refreshTokens: (typeof refreshTokensTable.$inferSelect)[];
};

async function registerRefreshToken(userId: number, token: string) {
  const payload = await verifyToken(token);
  const expiresAt = new Date(payload.exp * 1000);
  return await db
    .insert(refreshTokensTable)
    .values({ userId, token, expiresAt });
}

async function selectUsersWithPasswords(
  req: Request,
): Promise<UserWithPasswords | null> {
  const result = await db.query.users.findFirst({
    with: {
      passwords: true,
    },
    where: eq(usersTable.email, req.body.email),
    orderBy: desc(passwordsTable.createdAt),
  });
  return result as UserWithPasswords;
}

async function deleteUserRefreshTokens(id: number) {
  return await db
    .delete(refreshTokensTable)
    .where(eq(refreshTokensTable.userId, id));
}

async function selectUsersWithRefreshTokens(
  userId: number,
): Promise<UserWithRefreshTokens | null> {
  const result = await db.query.users.findFirst({
    with: {
      refreshTokens: true,
    },
    where: eq(usersTable.id, userId),
  });
  return result as UserWithRefreshTokens;
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const user = await selectUsersWithPasswords(req);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (!user.passwords.length) {
      res.status(404).json({ massage: 'Password not found' });
      return;
    }
    const hash = makeHash(req.body.password, user.passwords[0].salt);
    if (user.passwords[0].hash !== hash) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    const accessToken = createToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      } as JwtUser,
      JwtSub.API,
    );
    const refreshToken = createToken({ id: user.id }, JwtSub.REFRESH);
    await registerRefreshToken(user.id, refreshToken);
    res.cookie('jwt', accessToken, JWT_COOKIE_OPTIONS);
    res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error('Error at login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    deleteUserRefreshTokens(req.user.id);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error at logout:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    if (!req.refresh) {
      throw new Error('Refresh token is missing');
    }
    const token = req.header('Authorization');
    const user = await selectUsersWithRefreshTokens(req.refresh);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (
      !user.refreshTokens.length ||
      !user.refreshTokens.find((entry) => entry.token === token)
    ) {
      res.status(404).json({ message: 'Refresh token not found' });
      return;
    }
    const accessToken = createToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      } as JwtUser,
      JwtSub.API,
    );
    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    console.error('Error at refreshToken:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
}

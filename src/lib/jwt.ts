import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';

if (
  !process.env.JWT_SECRET ||
  !process.env.JWT_EXPIRATION ||
  !process.env.JWT_COOKIE_EXPIRATION
) {
  throw new Error('JWT Values must be set in the environment variables');
}

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRATION = parseInt(
  process.env.JWT_EXPIRATION as string,
  10,
);
export const JWT_COOKIE_EXPIRATION = parseInt(
  process.env.JWT_COOKIE_EXPIRATION as string,
  10,
);

export const JWT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: JWT_COOKIE_EXPIRATION,
  sameSite: 'strict',
} as CookieOptions;

export function createToken(payload: Object): string {
  return jwt.sign({ payload }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

export function verifyToken(token: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error: any, { payload }: any) => {
      if (error) {
        reject(error);
      }
      resolve(payload);
    });
  });
}

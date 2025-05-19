import 'dotenv/config';
import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { JwtSub } from '../types';

if (
  !process.env.JWT_SECRET ||
  !process.env.JWT_REFRESH_SECRET ||
  !process.env.JWT_EXPIRATION ||
  !process.env.JWT_REFRESH_EXPIRATION ||
  !process.env.JWT_COOKIE_EXPIRATION
) {
  throw new Error('JWT Values must be set in the environment variables');
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION, 10);
export const JWT_REFRESH_EXPIRATION = parseInt(
  process.env.JWT_REFRESH_EXPIRATION,
  10,
);
export const JWT_COOKIE_EXPIRATION = parseInt(
  process.env.JWT_COOKIE_EXPIRATION,
  10,
);

export const JWT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: JWT_COOKIE_EXPIRATION,
  sameSite: 'strict',
} as CookieOptions;

export function createToken(payload: Object, subect: JwtSub): string {
  return jwt.sign(
    { ...payload, sub: subect },
    JwtSub.API ? JWT_SECRET : JWT_REFRESH_SECRET,
    {
      expiresIn: JwtSub.API ? JWT_EXPIRATION : JWT_REFRESH_EXPIRATION,
    },
  );
}

export function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error: any, payload: any) => {
      if (error) {
        reject(error);
      }
      resolve(payload);
    });
  });
}

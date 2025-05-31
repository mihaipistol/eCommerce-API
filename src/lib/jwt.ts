import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { JwtSub } from '../types';
import getEnvironment from './environment';

export async function createToken(payload: Object, subect: JwtSub) {
  const env = await getEnvironment();
  return jwt.sign(
    { ...payload, sub: subect },
    JwtSub.API ? env.JWT_SECRET : env.JWT_REFRESH_SECRET,
    {
      expiresIn: JwtSub.API ? env.JWT_EXPIRATION : env.JWT_REFRESH_EXPIRATION,
    },
  );
}

export async function verifyToken(token: string) {
  const env = await getEnvironment();
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.JWT_SECRET, (error: any, payload: any) => {
      if (error) {
        reject(error);
      }
      resolve(payload);
    });
  });
}

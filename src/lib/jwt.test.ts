import { describe, expect, it, vitest } from 'vitest';
import { JwtSub } from '../types';
import { createToken, verifyToken } from './jwt';

vitest.mock('./environment', () => ({
  __esModule: true,
  default: vitest.fn(() =>
    Promise.resolve({
      JWT_SECRET: 'testsecret',
      JWT_REFRESH_SECRET: 'testrefreshsecret',
      JWT_EXPIRATION: 3600,
      JWT_REFRESH_EXPIRATION: 86400,
    }),
  ),
}));

describe('JWT functions', () => {
  it('should create an API token', async () => {
    const payload = { userId: '123' };
    const token = await createToken(payload, JwtSub.API);
    expect(token).toBeDefined();
  });

  it('should create a refresh token', async () => {
    const payload = { userId: '123' };
    const token = await createToken(payload, JwtSub.REFRESH);
    expect(token).toBeDefined();
  });

  it('should verify a valid token', async () => {
    const payload = { userId: '123' };
    const token = await createToken(payload, JwtSub.API);
    const verifiedPayload = await verifyToken(token);
    expect(verifiedPayload).toMatchObject({ ...payload, sub: JwtSub.API });
  });

  it('should reject an invalid token', async () => {
    const invalidToken = 'invalidtoken';
    await expect(verifyToken(invalidToken)).rejects.toThrow();
  });
});

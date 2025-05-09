import { createHash, randomBytes } from 'crypto';

export function makeSalt(length: number): string {
  return randomBytes(length).toString('hex').slice(0, length);
}

export function makeHash(password: string, salt: string): string {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

export function isMatch(string: string, salt: string, hash: string): boolean {
  return (
    createHash('sha256')
      .update(string + salt)
      .digest('hex') === hash
  );
}

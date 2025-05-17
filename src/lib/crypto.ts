import { createHash, randomBytes } from 'crypto';

const SHA256 = 'sha256';
const HEX = 'hex';

export function makeSalt(length: number): string {
  return randomBytes(length).toString(HEX).slice(0, length);
}

export function makeHash(password: string, salt: string): string {
  return createHash(SHA256)
    .update(password + salt)
    .digest(HEX);
}

export function isMatch(string: string, salt: string, hash: string): boolean {
  return (
    createHash(SHA256)
      .update(string + salt)
      .digest(HEX) === hash
  );
}

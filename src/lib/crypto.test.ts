import { makeSalt, makeHash, isMatch } from './crypto';

describe('Crypto', () => {});
it('should generate a salt of the specified length', () => {
  const saltLength = 16;
  const salt = makeSalt(saltLength);
  expect(salt).toHaveLength(saltLength);
});

it('should generate a hash for a given password and salt', () => {
  const password = 'testpassword';
  const salt = makeSalt(16);
  const hash = makeHash(password, salt);
  expect(hash).toBeDefined();
  expect(hash).not.toBe(password);
});

it('should return true for a matching string, salt, and hash', () => {
  const password = 'testpassword';
  const salt = makeSalt(16);
  const hash = makeHash(password, salt);
  expect(isMatch(password, salt, hash)).toBe(true);
});

it('should return false for a non-matching string', () => {
  const password = 'testpassword';
  const salt = makeSalt(16);
  const hash = makeHash(password, salt);
  const wrongPassword = 'wrongpassword';
  expect(isMatch(wrongPassword, salt, hash)).toBe(false);
});

it('should return false for a non-matching salt', () => {
  const password = 'testpassword';
  const salt = makeSalt(16);
  const hash = makeHash(password, salt);
  const wrongSalt = makeSalt(16);
  expect(isMatch(password, wrongSalt, hash)).toBe(false);
});

// filepath: d:\Banc\eCommerce\API\src\middleware\authorization.test.ts
import { Request, Response, NextFunction } from 'express';
import { validateToken, validateRefreshToken } from './authorization';
import { UserRole, JwtUser } from '../types';

// Mocking ../lib/jwt
const mockVerifyToken = jest.fn();
jest.mock('../lib/jwt', () => ({
  __esModule: true, // This is important for ES modules
  verifyToken: (...args: any[]) => mockVerifyToken(...args),
}));

// Helper to create a mock Request object
const mockRequest = (customProps: Partial<Request> = {}): Request => {
  const req = {
    cookies: {},
    header: jest.fn(), // Will be configured per test or with a default implementation if needed
    body: {},
    user: undefined,
    refresh: undefined,
    headers: {}, // For easier header setting in tests
    ...customProps,
  } as unknown;
  // If customProps.headers is provided, make req.header reflect it simply
  if (customProps.headers) {
    (req as Request).header = jest.fn((name: string): string | undefined => {
      const lname = name.toLowerCase();
      // Express headers are case-insensitive
      for (const key in customProps.headers) {
        if (key.toLowerCase() === lname) {
          return (customProps.headers as any)[key] as string;
        }
      }
      return undefined;
    }) as any;
  }
  return req as Request;
};

// Helper to create a mock Response object
const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Helper for a mock NextFunction
const mockNext: NextFunction = jest.fn();

describe('Authorization Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // verifyRole is not exported, its logic is tested via validateToken

  describe('validateToken', () => {
    let req: Request;
    let res: Response;
    const next = mockNext;

    const sampleUser: JwtUser = {
      id: 1,
      email: 'test@example.com',
      role: UserRole.USER,
    };

    beforeEach(() => {
      res = mockResponse();
    });

    it('should return 401 if no token is provided (no cookie, no header)', async () => {
      req = mockRequest({ cookies: {} }); // header mock will default to returning undefined
      await validateToken()(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if verifyToken returns no user (e.g., null)', async () => {
      req = mockRequest({ cookies: { jwt: 'sometoken' } });
      mockVerifyToken.mockResolvedValue(null);
      await validateToken()(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if verifyToken throws an error', async () => {
      req = mockRequest({ cookies: { jwt: 'sometoken' } });
      mockVerifyToken.mockRejectedValue(new Error('Token verification failed'));
      await validateToken()(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authentication failed',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next and set req.user if token is valid and role is allowed (default USER)', async () => {
      req = mockRequest({ cookies: { jwt: 'sometoken' } });
      mockVerifyToken.mockResolvedValue(sampleUser); // sampleUser has UserRole.USER
      await validateToken()(req, res, next); // Default allowed role is USER
      expect(mockVerifyToken).toHaveBeenCalledWith('sometoken');
      expect(req.user).toEqual(sampleUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should use Authorization header if jwt cookie is not present', async () => {
      req = mockRequest({ headers: { Authorization: 'headertoken' } });
      mockVerifyToken.mockResolvedValue(sampleUser);
      await validateToken()(req, res, next);
      expect(mockVerifyToken).toHaveBeenCalledWith('headertoken');
      expect(req.user).toEqual(sampleUser);
      expect(next).toHaveBeenCalled();
    });

    it('should allow access if user role is explicitly in allowedRoles', async () => {
      const adminUser: JwtUser = { ...sampleUser, role: UserRole.ADMIN };
      req = mockRequest({ cookies: { jwt: 'sometoken' } });
      mockVerifyToken.mockResolvedValue(adminUser);
      await validateToken(UserRole.ADMIN)(req, res, next);
      expect(req.user).toEqual(adminUser);
      expect(next).toHaveBeenCalled();
    });

    it('should allow SELLER if allowedRoles is [USER] due to verifyRole fall-through', async () => {
      const sellerUser: JwtUser = { ...sampleUser, role: UserRole.SELLER };
      req = mockRequest({ cookies: { jwt: 'sometoken' } });
      mockVerifyToken.mockResolvedValue(sellerUser);
      await validateToken(UserRole.USER)(req, res, next);
      expect(req.user).toEqual(sellerUser);
      expect(next).toHaveBeenCalled();
    });

    it('should allow ADMIN if allowedRoles is [USER] due to verifyRole fall-through', async () => {
      const adminUser: JwtUser = { ...sampleUser, role: UserRole.ADMIN };
      req = mockRequest({ cookies: { jwt: 'sometoken' } });
      mockVerifyToken.mockResolvedValue(adminUser);
      await validateToken(UserRole.USER)(req, res, next);
      expect(req.user).toEqual(adminUser);
      expect(next).toHaveBeenCalled();
    });

    it('should allow ADMIN if allowedRoles is [SELLER] due to verifyRole fall-through', async () => {
      const adminUser: JwtUser = { ...sampleUser, role: UserRole.ADMIN };
      req = mockRequest({ cookies: { jwt: 'sometoken' } });
      mockVerifyToken.mockResolvedValue(adminUser);
      await validateToken(UserRole.SELLER)(req, res, next);
      expect(req.user).toEqual(adminUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user role is not allowed by verifyRole (e.g. non-existent role in allowedRoles)', async () => {
      const userWithUserRole: JwtUser = { ...sampleUser, role: UserRole.USER };
      req = mockRequest({ cookies: { jwt: 'sometoken' } });
      mockVerifyToken.mockResolvedValue(userWithUserRole);
      await validateToken('NonExistentRoleInEnum' as UserRole)(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should default to UserRole.USER if allowedRoles is empty', async () => {
      req = mockRequest({ cookies: { jwt: 'sometoken' } });
      mockVerifyToken.mockResolvedValue(sampleUser); // UserRole.USER
      await validateToken()(req, res, next); // No roles passed, defaults to [UserRole.USER]
      expect(req.user).toEqual(sampleUser);
      expect(next).toHaveBeenCalled();
    });
  });

  // describe('validateRefreshToken', () => {
  //   let req: Request;
  //   let res: Response;
  //   const next = mockNext;

  //   beforeEach(() => {
  //     res = mockResponse();
  //   });

  //   it('should return 401 if no token is provided in Authorization header', async () => {
  //     req = mockRequest(); // header mock will default to returning undefined
  //     await validateRefreshToken(req, res, next);
  //     expect(res.status).toHaveBeenCalledWith(401);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
  //     expect(next).not.toHaveBeenCalled();
  //   });

  //   it('should return 401 if verifyToken returns null (no payload)', async () => {
  //     req = mockRequest({ headers: { Authorization: 'refreshtoken' } });
  //     mockVerifyToken.mockResolvedValue(null);
  //     await validateRefreshToken(req, res, next);
  //     expect(res.status).toHaveBeenCalledWith(401);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  //     expect(next).not.toHaveBeenCalled();
  //   });

  //   it('should return 401 if verifyToken returns payload without id', async () => {
  //     req = mockRequest({ headers: { Authorization: 'refreshtoken' } });
  //     mockVerifyToken.mockResolvedValue({ email: 'test@example.com' }); // No id
  //     await validateRefreshToken(req, res, next);
  //     expect(res.status).toHaveBeenCalledWith(401);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  //     expect(next).not.toHaveBeenCalled();
  //   });

  //   it('should return 401 if verifyToken throws an error', async () => {
  //     req = mockRequest({ headers: { Authorization: 'refreshtoken' } });
  //     mockVerifyToken.mockRejectedValue(new Error('Verification failed'));
  //     await validateRefreshToken(req, res, next);
  //     expect(res.status).toHaveBeenCalledWith(401);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: 'Authentication failed',
  //     });
  //     expect(next).not.toHaveBeenCalled();
  //   });

  //   it('should call next and set req.refresh if token is valid and contains id', async () => {
  //     const userId = 789;
  //     req = mockRequest({ headers: { Authorization: 'refreshtoken' } });
  //     mockVerifyToken.mockResolvedValue({ id: userId });
  //     await validateRefreshToken(req, res, next);
  //     expect(mockVerifyToken).toHaveBeenCalledWith('refreshtoken');
  //     expect(req.refresh).toEqual(userId);
  //     expect(next).toHaveBeenCalled();
  //     expect(res.status).not.toHaveBeenCalled();
  //   });
  // });
});

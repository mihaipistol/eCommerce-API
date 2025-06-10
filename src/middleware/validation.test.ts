import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { z, ZodObject } from 'zod';
import { validateData } from './validation';

// Mock Express objects
const mockRequest = (body: any) =>
  ({
    body,
  }) as Request;

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = vitest.fn().mockReturnValue(res);
  res.json = vitest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = () => vitest.fn() as NextFunction;

describe('validateData Middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    res = mockResponse();
    next = mockNext();
  });

  describe('with ZodObject schema', () => {
    const testSchema = z.object({
      name: z.string().min(1, { message: 'is required' }),
      age: z.number().positive({ message: 'must be positive' }),
    });

    it('should call next() and parse body for valid data', () => {
      const validData = { name: 'John Doe', age: 30 };
      req = mockRequest(validData);
      const middleware = validateData(testSchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect(req.body).toEqual(validData); // Zod parse returns the same object if valid
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid data with ZodError', () => {
      const invalidData = { name: '', age: -5 };
      req = mockRequest(invalidData);
      const middleware = validateData(testSchema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid data',
        details: [
          { message: 'name is is required' },
          { message: 'age is must be positive' },
        ],
      });
    });
  });

  describe('with ZodArray<ZodObject> schema', () => {
    const itemSchema = z.object({
      id: z.number(),
      value: z.string(),
    });
    const testArraySchema = z.array(itemSchema);

    it('should call next() and parse body for valid array data', () => {
      const validData = [
        { id: 1, value: 'test1' },
        { id: 2, value: 'test2' },
      ];
      req = mockRequest(validData);
      const middleware = validateData(testArraySchema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect(req.body).toEqual(validData);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid data in array with ZodError', () => {
      const invalidData = [
        { id: 1, value: 'test1' },
        { id: '2', value: 123 },
      ];
      req = mockRequest(invalidData);
      const middleware = validateData(testArraySchema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid data',
        details: [
          { message: '1.id is Expected number, received string' },
          { message: '1.value is Expected string, received number' },
        ],
      });
    });

    it('should return 400 if body is not an array when ZodArray is expected', () => {
      const invalidData = { id: 1, value: 'test1' }; // Not an array
      req = mockRequest(invalidData);
      const middleware = validateData(testArraySchema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid data',
        details: [{ message: ' is Expected array, received object' }],
      });
    });
  });

  it('should return 500 for non-ZodError', () => {
    const testSchema = z.object({
      name: z.string(),
    });
    req = mockRequest({ name: 'Test' });

    // Force schema.parse to throw a non-ZodError
    const mockSchema = {
      parse: vitest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      }),
    } as unknown as ZodObject<any, any>;

    const middleware = validateData(mockSchema);
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

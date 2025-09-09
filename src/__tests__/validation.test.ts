import { Request, Response, NextFunction } from 'express';
import { ValidationMiddleware, RateLimitMiddleware } from '../middleware/validation';
import { AppError } from '../Errors/AppError';

const mockRequest = (params: any = {}, query: any = {}) => ({
  params,
  query,
  ip: '127.0.0.1',
  connection: { remoteAddress: '127.0.0.1' }
} as unknown as Request);

const mockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response);

const mockNext = jest.fn() as NextFunction;

describe('ValidationMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUserSearch', () => {
    it('should pass validation with valid name and tag', () => {
      const req = mockRequest({ name: 'TestPlayer', tag: 'BR1' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateUserSearch(req, res, mockNext);
      }).not.toThrow();
      
      expect(mockNext).toHaveBeenCalled();
      expect(req.params.name).toBe('TestPlayer');
      expect(req.params.tag).toBe('BR1');
    });

    it('should throw error when name is missing', () => {
      const req = mockRequest({ tag: 'BR1' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateUserSearch(req, res, mockNext);
      }).toThrow(AppError);
      
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error when tag is missing', () => {
      const req = mockRequest({ name: 'TestPlayer' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateUserSearch(req, res, mockNext);
      }).toThrow(AppError);
      
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw error when name is too short', () => {
      const req = mockRequest({ name: 'AB', tag: 'BR1' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateUserSearch(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when name is too long', () => {
      const req = mockRequest({ name: 'A'.repeat(17), tag: 'BR1' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateUserSearch(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when tag is too short', () => {
      const req = mockRequest({ name: 'TestPlayer', tag: 'AB' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateUserSearch(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when tag is too long', () => {
      const req = mockRequest({ name: 'TestPlayer', tag: 'ABCDEF' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateUserSearch(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when name contains invalid characters', () => {
      const req = mockRequest({ name: 'Test@Player', tag: 'BR1' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateUserSearch(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when tag contains invalid characters', () => {
      const req = mockRequest({ name: 'TestPlayer', tag: 'BR@' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateUserSearch(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should trim whitespace from name and tag', () => {
      const req = mockRequest({ name: '  TestPlayer  ', tag: '  BR1  ' });
      const res = mockResponse();
      
      ValidationMiddleware.validateUserSearch(req, res, mockNext);
      
      expect(req.params.name).toBe('TestPlayer');
      expect(req.params.tag).toBe('BR1');
    });
  });

  describe('validatePuuid', () => {
    const validPuuid = 'a'.repeat(78);
    
    it('should pass validation with valid PUUID', () => {
      const req = mockRequest({ puuid: validPuuid });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validatePuuid(req, res, mockNext);
      }).not.toThrow();
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error when PUUID is missing', () => {
      const req = mockRequest({});
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validatePuuid(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when PUUID is too short', () => {
      const req = mockRequest({ puuid: 'a'.repeat(77) });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validatePuuid(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when PUUID is too long', () => {
      const req = mockRequest({ puuid: 'a'.repeat(79) });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validatePuuid(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when PUUID contains invalid characters', () => {
      const invalidPuuid = 'a'.repeat(77) + '@';
      const req = mockRequest({ puuid: invalidPuuid });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validatePuuid(req, res, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('validateQueryParams', () => {
    it('should pass validation with valid count', () => {
      const req = mockRequest({}, { count: '10' });
      const res = mockResponse();
      
      ValidationMiddleware.validateQueryParams(req, res, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(req.query.count).toBe('10');
    });

    it('should throw error when count is too high', () => {
      const req = mockRequest({}, { count: '101' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateQueryParams(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when count is too low', () => {
      const req = mockRequest({}, { count: '0' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateQueryParams(req, res, mockNext);
      }).toThrow(AppError);
    });

    it('should throw error when start is negative', () => {
      const req = mockRequest({}, { start: '-1' });
      const res = mockResponse();
      
      expect(() => {
        ValidationMiddleware.validateQueryParams(req, res, mockNext);
      }).toThrow(AppError);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters from params', () => {
      const req = mockRequest({ name: 'Test<script>alert(1)</script>' });
      const res = mockResponse();
      
      ValidationMiddleware.sanitizeInput(req, res, mockNext);
      
      expect(req.params.name).toBe('Testscriptalert(1)/script');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should remove dangerous characters from query', () => {
      const req = mockRequest({}, { search: 'test"onclick=alert(1)' });
      const res = mockResponse();
      
      ValidationMiddleware.sanitizeInput(req, res, mockNext);
      
      expect(req.query.search).toBe('testonclick=alert(1)');
      expect(mockNext).toHaveBeenCalled();
    });
  });
});

describe('RateLimitMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RateLimitMiddleware.clearAll();
    (RateLimitMiddleware as any).requests = new Map();
  });

  it('should allow requests within limit', () => {
    const rateLimiter = RateLimitMiddleware.createRateLimit(60000, 5);
    const req = mockRequest();
    const res = mockResponse();
    
    expect(middleware(req, res, next)).toBeUndefined();
    expect(() => {
      rateLimiter(req, res, mockNext);
    }).not.toThrow();
    
    expect(mockNext).toHaveBeenCalled();
  });

  it('should block requests when limit exceeded', () => {
    const rateLimiter = RateLimitMiddleware.createRateLimit(60000, 2);
    const req = mockRequest();
    const res = mockResponse();
    
    expect(middleware(req, res, next)).toBeUndefined();
    rateLimiter(req, res, mockNext);
    rateLimiter(req, res, mockNext);
    
    expect(() => middleware(req, res, next)).toThrow();
    expect(() => {
      rateLimiter(req, res, mockNext);
    }).toThrow(AppError);
  });
});
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.setTimeout(10000);
process.env.NODE_ENV = 'test';
process.env.PORT = '3333';
process.env.CACHE_TTL = '300000';

describe('Test Setup', () => {
  it('should have test environment configured', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.PORT).toBe('3333');
    expect(process.env.CACHE_TTL).toBe('300000');
  });
});
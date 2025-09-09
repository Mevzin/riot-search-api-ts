import { CacheService, CACHE_KEYS } from '../service/cacheService';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
  });

  afterEach(() => {
    cacheService.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve data correctly', () => {
      const key = 'test-key';
      const data = { name: 'Test User', level: 30 };
      
      cacheService.set(key, data);
      const result = cacheService.get(key);
      
      expect(result).toEqual(data);
    });

    it('should return null for non-existent key', () => {
      const result = cacheService.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should respect TTL and expire data', (done) => {
      const key = 'ttl-test';
      const data = { test: 'data' };
      const ttl = 100;
      
      cacheService.set(key, data, ttl);
      
      expect(cacheService.get(key)).toEqual(data);
        
        setTimeout(() => {
        expect(cacheService.get(key)).toBeNull();
        done();
      }, ttl + 10);
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      const key = 'existing-key';
      cacheService.set(key, 'data');
      
      expect(cacheService.has(key)).toBe(true);
    });

    it('should return false for non-existing key', () => {
      expect(cacheService.has('non-existing-key')).toBe(false);
    });

    it('should return false for expired key', (done) => {
      const key = 'expired-key';
      const ttl = 50;
      
      cacheService.set(key, 'data', ttl);
      
      setTimeout(() => {
        expect(cacheService.has(key)).toBe(false);
        done();
      }, ttl + 10);
    });
  });

  describe('delete', () => {
    it('should delete existing key', () => {
      const key = 'delete-test';
      cacheService.set(key, 'data');
      
      expect(cacheService.has(key)).toBe(true);
      
      const deleted = cacheService.delete(key);
      
      expect(deleted).toBe(true);
      expect(cacheService.has(key)).toBe(false);
    });

    it('should return false when deleting non-existent key', () => {
      const deleted = cacheService.delete('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      cacheService.set('key1', 'data1');
      cacheService.set('key2', 'data2');
      cacheService.set('key3', 'data3');
      
      expect(cacheService.has('key1')).toBe(true);
      expect(cacheService.has('key2')).toBe(true);
      expect(cacheService.has('key3')).toBe(true);
      
      cacheService.clear();
      
      expect(cacheService.has('key1')).toBe(false);
      expect(cacheService.has('key2')).toBe(false);
      expect(cacheService.has('key3')).toBe(false);
    });
  });

  describe('generateKey', () => {
    it('should generate consistent keys', () => {
      const key1 = CacheService.generateKey(CACHE_KEYS.USER_PROFILE, 'player', 'tag');
      const key2 = CacheService.generateKey(CACHE_KEYS.USER_PROFILE, 'player', 'tag');
      
      expect(key1).toBe(key2);
      expect(key1).toContain('user_profile');
      expect(key1).toContain('player');
      expect(key1).toContain('tag');
    });

    it('should generate different keys for different inputs', () => {
      const key1 = CacheService.generateKey(CACHE_KEYS.USER_PROFILE, 'player1', 'tag1');
      const key2 = CacheService.generateKey(CACHE_KEYS.USER_PROFILE, 'player2', 'tag2');
      const key3 = CacheService.generateKey(CACHE_KEYS.USER_MATCHES, 'player1', 'tag1');
      
      expect(key1).not.toBe(key2);
      expect(key1).not.toBe(key3);
      expect(key2).not.toBe(key3);
    });

    it('should work with instance method too', () => {
      const key1 = cacheService.generateKey(CACHE_KEYS.USER_PROFILE, 'player', 'tag');
      const key2 = CacheService.generateKey(CACHE_KEYS.USER_PROFILE, 'player', 'tag');
      
      expect(key1).toBe(key2);
    });
  });

  describe('getStats', () => {
    it('should return correct cache statistics', () => {
      cacheService.set('key1', 'data1');
      cacheService.set('key2', 'data2');
      
      const stats = cacheService.getStats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });
  });
});
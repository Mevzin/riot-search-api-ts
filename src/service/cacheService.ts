interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 300000) {
    this.defaultTTL = defaultTTL;
    
    setInterval(() => {
      this.cleanExpiredItems();
    }, 60000);
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };
    
    this.cache.set(key, item);
    console.log(`📦 Cache SET: ${key} (TTL: ${item.ttl}ms)`);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      console.log(`❌ Cache MISS: ${key}`);
      return null;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      console.log(`⏰ Cache EXPIRED: ${key}`);
      return null;
    }

    console.log(`✅ Cache HIT: ${key}`);
    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }
    
    if (this.isExpired(item)) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`🗑️ Cache DELETE: ${key}`);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    console.log('🧹 Cache CLEARED');
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  private cleanExpiredItems(): void {
    let cleanedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cache cleanup: ${cleanedCount} items removed`);
    }
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  static generateKey(prefix: string, ...params: (string | number)[]): string {
    return `${prefix}:${params.join(':')}`;
  }

  generateKey(prefix: string, ...params: (string | number)[]): string {
    return CacheService.generateKey(prefix, ...params);
  }
}

export const cacheService = new CacheService(
    parseInt(process.env.CACHE_TTL || '300000')
);

export { CacheService };

export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_MATCHES: 'user_matches',
  USER_RANK: 'user_rank',
  SPECTATE_GAME: 'spectate_game',
  USER_MASTERY: 'user_mastery',
  USER_TEAMMATES: 'user_teammates'
} as const;

export type CacheKey = typeof CACHE_KEYS[keyof typeof CACHE_KEYS];
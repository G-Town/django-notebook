import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from "./storageService";

// Default cache duration: 5 minutes
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

class BaseCacheService {
  constructor(cacheKey, cacheDuration = DEFAULT_CACHE_DURATION) {
    this.cacheKey = cacheKey;
    this.cacheDuration = cacheDuration;
  }

  // Check if cached data is still valid
  isCacheValid(timestamp) {
    return Date.now() - timestamp < this.cacheDuration;
  }

  // Get cached data if valid
  getCached() {
    const cached = getFromLocalStorage(this.cacheKey);
    if (cached?.data && cached?.timestamp && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    return null;
  }

  // Save data to cache with timestamp
  setCache(data) {
    saveToLocalStorage(this.cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  // Invalidate cache
  invalidate() {
    removeFromLocalStorage(this.cacheKey);
  }

  // Get data with cache-first strategy
  async getData(fetchFunction, options = {}) {
    const { forceRefresh = false, fallbackToCache = true } = options;

    // Try cache first unless forcing refresh
    if (!forceRefresh) {
      const cached = this.getCached();
      if (cached !== null) {
        return cached;
      }
    }

    // Fetch fresh data
    try {
      const freshData = await fetchFunction();
      this.setCache(freshData);
      return freshData;
    } catch (error) {
      // Fallback to stale cache if allowed
      if (fallbackToCache) {
        const stale = getFromLocalStorage(this.cacheKey);
        if (stale?.data) {
          console.warn(`API failed for ${this.cacheKey}, returning stale cache`);
          return stale.data;
        }
      }
      throw error;
    }
  }

  // Optimistically update cache
  optomisticUpdate(updateFunction) {
    const cached = getFromLocalStorage(this.cacheKey);
    if (cached?.data) {
      const updatedData = updateFunction(cached.data);
      this.setCache(updatedData);
      return updatedData;
    }
    return null;
  }
}

// Factory function for creating cache services
export const createCacheService = (cacheKey, cacheDuration) => {
  return new BaseCacheService(cacheKey, cacheDuration);
};

// Specific cache service instances for common use cases
export const createListCacheService = (resourceName, cacheDuration) => {
  return createCacheService(`${resourceName}_list`, cacheDuration);
};

export const createItemCacheService = (resourceName, itemId, cacheDuration) => {
  return createCacheService(`${resourceName}_${itemId}`, cacheDuration);
};

// Multi-key cache service for notes by folder
export class MultiKeyCacheService {
  constructor(baseKey, cacheDuration = DEFAULT_CACHE_DURATION) {
    this.baseKey = baseKey;
    this.cacheDuration = cacheDuration;
  }

  getCacheKey(identifier) {
    return `${this.baseKey}_${identifier}`;
  }

  getCacheService(identifier) {
    return createCacheService(this.getCacheKey(identifier), this.cacheDuration);
  }

  // Invalidate all caches matching the base key pattern
  invalidateAll() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.baseKey)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => removeFromLocalStorage(key));
  }
}

export default BaseCacheService;
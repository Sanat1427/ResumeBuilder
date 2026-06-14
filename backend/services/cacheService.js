class CacheService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Set a value in the cache with a specified TTL (in milliseconds)
   */
  set(key, value, ttlMs = 600000) { // Default 10 minutes (600,000 ms)
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get a value from the cache if it hasn't expired
   */
  get(key) {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) return null;

    if (Date.now() > cachedItem.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.value;
  }

  /**
   * Delete an item from the cache
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}

// Export a singleton instance of CacheService
export default new CacheService();

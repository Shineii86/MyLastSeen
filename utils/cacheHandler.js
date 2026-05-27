/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — utils/cacheHandler.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   In-memory cache using node-cache. Stores GitHub API
 *   responses per username to reduce API calls and stay
 *   within rate limits.
 *
 * @exports get, set, del, flush, getStats
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const NodeCache = require('node-cache');
const { CACHE_TTL } = require('./constants');

// ══════════════════════════════════════════════════════════════
// CACHE CONFIGURATION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: In-memory cache instance ----

/** @type {NodeCache} In-memory cache instance */
const cache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: 60,
  useClones: false,
  deleteOnExpire: true
});

// ══════════════════════════════════════════════════════════════
// CACHE STATISTICS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Hit/miss tracking ----

/** @type {{hits: number, misses: number}} */
const stats = { hits: 0, misses: 0 };

// ══════════════════════════════════════════════════════════════
// CACHE OPERATIONS
// ══════════════════════════════════════════════════════════════

module.exports = {

  // ---- FEATURE: Cache GET ----

  /**
   * Retrieve a value from cache.
   *
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  get: (key) => {
    const value = cache.get(key);
    if (value !== undefined) {
      stats.hits++;
      return value;
    }
    stats.misses++;
    return null;
  },

  // ---- FEATURE: Cache SET ----

  /**
   * Store a value in cache.
   *
   * @param {string} key - Cache key
   * @param {*} data - Value to cache
   * @param {number} [ttl=CACHE_TTL] - TTL in seconds
   */
  set: (key, data, ttl = CACHE_TTL) => {
    cache.set(key, data, ttl);
  },

  // ---- FEATURE: Cache DELETE ----

  /**
   * Delete a specific cache key.
   *
   * @param {string} key - Cache key to delete
   */
  del: (key) => {
    cache.del(key);
  },

  // ---- FEATURE: Cache FLUSH ----

  /**
   * Flush all cached data.
   */
  flush: () => {
    cache.flushAll();
  },

  // ---- FEATURE: Cache statistics ----

  /**
   * Get cache hit/miss statistics.
   *
   * @returns {{hits: number, misses: number, keys: string[], ttl: number}}
   */
  getStats: () => ({
    ...stats,
    keys: cache.keys(),
    ttl: CACHE_TTL
  })
};

// ══════════════════════════════════════════════════════════════ END: cacheHandler.js

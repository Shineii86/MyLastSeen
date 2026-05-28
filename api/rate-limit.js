/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — api/rate-limit.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   Rate limit dashboard endpoint. Shows remaining GitHub
 *   API quota for both core and search rate limits.
 *
 * @endpoint GET /api/rate-limit
 *
 * @version 2.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { fetchRateLimit } = require('../utils/github');
const { CORS_HEADERS } = require('../utils/constants');

// ══════════════════════════════════════════════════════════════
// REQUEST HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/rate-limit handler ----

/**
 * Rate limit dashboard handler.
 *
 * Query parameters:
 *   - token — Optional GitHub PAT (shows authenticated limits if provided)
 */
module.exports = async (req, res) => {
  const startTime = Date.now();
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  try {
    const token = req.query.token || process.env.GITHUB_TOKEN || null;
    const data = await fetchRateLimit(token);

    res.json({
      success: true,
      data: {
        core: data.core,
        search: data.search,
        authenticated: data.authenticated
      },
      meta: { responseTime: `${Date.now() - startTime}ms`, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      error: error.error || 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// ══════════════════════════════════════════════════════════════ END: api/rate-limit.js

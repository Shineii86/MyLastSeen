/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — api/batch.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   Batch lookup endpoint. Fetches last-seen data for up to
 *   10 GitHub users in a single request using parallel fetches.
 *
 * @endpoint GET /api/batch?users=user1,user2,user3
 *
 * @version 2.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { fetchMultipleUsers } = require('../utils/github');
const { relativeTime } = require('../utils/relativeTime');
const { CORS_HEADERS, MAX_BATCH_SIZE } = require('../utils/constants');

// ══════════════════════════════════════════════════════════════
// REQUEST HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/batch handler ----

/**
 * Batch lookup handler. Accepts comma-separated usernames.
 *
 * Query parameters:
 *   - users — Comma-separated GitHub usernames (max 10)
 *   - token — Optional GitHub PAT
 */
module.exports = async (req, res) => {
  const startTime = Date.now();
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  try {
    const usersParam = req.query.users;

    if (!usersParam) {
      return res.status(400).json({
        success: false,
        error: 'Missing users',
        message: 'Provide comma-separated usernames. Example: /api/batch?users=Shineii86,torvalds',
        timestamp: new Date().toISOString()
      });
    }

    const usernames = usersParam.split(',').map(u => u.trim()).filter(Boolean);

    if (usernames.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid usernames',
        message: 'No valid usernames found in the users parameter.',
        timestamp: new Date().toISOString()
      });
    }

    if (usernames.length > MAX_BATCH_SIZE) {
      return res.status(400).json({
        success: false,
        error: 'Too many users',
        message: `Maximum ${MAX_BATCH_SIZE} users per batch request. You provided ${usernames.length}.`,
        timestamp: new Date().toISOString()
      });
    }

    const token = req.query.token || process.env.GITHUB_TOKEN || null;
    const results = await fetchMultipleUsers(usernames, token);

    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      data: results.map(r => {
        if (r.error) return r;
        return {
          ...r,
          relativeTime: relativeTime(r.lastSeen)
        };
      }),
      meta: {
        count: results.length,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// ══════════════════════════════════════════════════════════════ END: api/batch.js

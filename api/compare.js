/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — api/compare.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   User comparison endpoint. Compares two GitHub users'
 *   last-seen activity side by side.
 *
 * @endpoint GET /api/compare?user1=X&user2=Y
 *
 * @version 2.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { fetchMultipleUsers } = require('../utils/github');
const { relativeTime } = require('../utils/relativeTime');
const { CORS_HEADERS } = require('../utils/constants');

// ══════════════════════════════════════════════════════════════
// REQUEST HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/compare handler ----

/**
 * Compare handler. Compares two users side by side.
 *
 * Query parameters:
 *   - user1 — First GitHub username
 *   - user2 — Second GitHub username
 *   - token — Optional GitHub PAT
 */
module.exports = async (req, res) => {
  const startTime = Date.now();
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  try {
    const user1 = req.query.user1?.trim();
    const user2 = req.query.user2?.trim();

    if (!user1 || !user2) {
      return res.status(400).json({
        success: false,
        error: 'Missing usernames',
        message: 'Provide two usernames. Example: /api/compare?user1=Shineii86&user2=torvalds',
        timestamp: new Date().toISOString()
      });
    }

    const token = req.query.token || process.env.GITHUB_TOKEN || null;
    const results = await fetchMultipleUsers([user1, user2], token);

    const u1 = results[0];
    const u2 = results[1];

    // Build comparison
    let comparison = null;
    if (!u1.error && !u2.error) {
      const t1 = new Date(u1.lastSeen).getTime();
      const t2 = new Date(u2.lastSeen).getTime();
      const diffMs = Math.abs(t1 - t2);
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      comparison = {
        lastSeenDiff: diffDays > 0 ? `${diffDays} day(s)` : `${diffHours} hour(s)`,
        moreActive: t1 > t2 ? u1.username : u2.username
      };
    }

    const formatUser = (u) => {
      if (u.error) return u;
      return { ...u, relativeTime: relativeTime(u.lastSeen) };
    };

    res.json({
      success: true,
      data: {
        user1: formatUser(u1),
        user2: formatUser(u2),
        comparison
      },
      meta: { responseTime: `${Date.now() - startTime}ms`, timestamp: new Date().toISOString() }
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

// ══════════════════════════════════════════════════════════════ END: api/compare.js

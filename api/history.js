/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — api/history.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   Event history endpoint. Returns the last 10 public events
 *   for a GitHub user with timestamps and relative times.
 *
 * @endpoint GET /api/history/:username
 *
 * @version 2.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { fetchUserEvents } = require('../utils/github');
const { relativeTime } = require('../utils/relativeTime');
const { CORS_HEADERS, MAX_HISTORY_COUNT } = require('../utils/constants');

// ══════════════════════════════════════════════════════════════
// REQUEST HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/history/:username handler ----

/**
 * Event history handler. Returns last N events.
 *
 * Query parameters:
 *   - count — Number of events (default 10, max 10)
 *   - token — Optional GitHub PAT
 */
module.exports = async (req, res) => {
  const startTime = Date.now();
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  try {
    const username = (req.query.username || req.params?.username)?.trim();
    const token = req.query.token || process.env.GITHUB_TOKEN || null;
    const count = Math.min(parseInt(req.query.count) || MAX_HISTORY_COUNT, MAX_HISTORY_COUNT);

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Missing username',
        message: 'Provide a GitHub username. Example: /api/history/Shineii86',
        timestamp: new Date().toISOString()
      });
    }

    const result = await fetchUserEvents(username, token, count);
    const events = result.events.map(e => ({
      ...e,
      relativeTime: relativeTime(e.timestamp)
    }));

    res.json({
      success: true,
      data: {
        username,
        events,
        count: events.length
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

// ══════════════════════════════════════════════════════════════ END: api/history.js

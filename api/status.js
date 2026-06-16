/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — api/status.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   GitHub profile status setter endpoint. Uses GH_TOKEN
 *   to authenticate via GitHub GraphQL API and set the
 *   user's "What's happening" status with a custom message
 *   and emoji. Supports GET (read status) and POST (set status).
 *
 * @endpoint GET  /api/status — Get current status
 * @endpoint POST /api/status — Set new status
 *
 * @version 3.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { setUserStatus, clearUserStatus, getStatus } = require('../utils/statusSetter');
const { CORS_HEADERS } = require('../utils/constants');

// ══════════════════════════════════════════════════════════════
// REQUEST HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/status handler ----

/**
 * Get or set the authenticated user's GitHub profile status.
 *
 * GET query parameters:
 *   - token — GitHub PAT (or set GH_TOKEN env var)
 *
 * POST body (JSON):
 *   - message  — Status message (max 80 chars, required)
 *   - emoji    — Optional emoji (e.g., "🔍", "🚀")
 *   - expiresAt — Optional ISO timestamp for expiration
 *   - clear    — Set to true to clear status
 *
 * POST query parameters:
 *   - token — GitHub PAT (or set GH_TOKEN env var)
 */
module.exports = async (req, res) => {
  const startTime = Date.now();
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  try {
    const token = req.query.token || process.env.GH_TOKEN || process.env.GITHUB_TOKEN || null;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Missing token',
        message: 'Provide a GitHub PAT via ?token= query param or GH_TOKEN/GITHUB_TOKEN env var.',
        hint: 'Token needs "user" scope to set profile status.',
        timestamp: new Date().toISOString()
      });
    }

    // ─── GET: Read current status ───
    if (req.method === 'GET') {
      const status = await getStatus(token);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');

      return res.json({
        success: true,
        data: {
          message: status.message || '',
          emoji: status.emoji || null,
          expiresAt: status.expiresAt || null,
          indicatesLimitedAvailability: status.indicatesLimitedAvailability || false
        },
        meta: { responseTime: `${Date.now() - startTime}ms`, timestamp: new Date().toISOString() }
      });
    }

    // ─── POST: Set or clear status ───
    if (req.method === 'POST') {
      const body = req.body || {};

      // Clear status
      if (body.clear === true) {
        const cleared = await clearUserStatus(token);

        res.setHeader('Content-Type', 'application/json');
        return res.json({
          success: true,
          action: 'cleared',
          data: {
            message: cleared.message || '',
            emoji: cleared.emoji || null,
            expiresAt: cleared.expiresAt || null
          },
          meta: { responseTime: `${Date.now() - startTime}ms`, timestamp: new Date().toISOString() }
        });
      }

      // Validate message
      const message = body.message?.trim();
      if (!message) {
        return res.status(400).json({
          success: false,
          error: 'Missing message',
          message: 'Provide a "message" field in the POST body.',
          example: { message: 'Last seen', emoji: '🔍' },
          timestamp: new Date().toISOString()
        });
      }

      if (message.length > 80) {
        return res.status(400).json({
          success: false,
          error: 'Message too long',
          message: `Status message must be 80 characters or less. You provided ${message.length}.`,
          timestamp: new Date().toISOString()
        });
      }

      const emoji = body.emoji || undefined;
      const expiresAt = body.expiresAt || undefined;
      const timezone = body.timezone || 'UTC';

      // Build status message with relative time if requested
      let finalMessage = message;
      if (body.relativeTime === true && body.eventTimestamp) {
        const relative = getRelativeTime(body.eventTimestamp);
        finalMessage = `${message}: ${relative}`;
      }

      const status = await setUserStatus(token, finalMessage, emoji, expiresAt);

      res.setHeader('Content-Type', 'application/json');
      return res.json({
        success: true,
        action: 'set',
        data: {
          message: status.message,
          emoji: status.emoji || null,
          expiresAt: status.expiresAt || null,
          indicatesLimitedAvailability: status.indicatesLimitedAvailability || false,
          timezone
        },
        meta: { responseTime: `${Date.now() - startTime}ms`, timestamp: new Date().toISOString() }
      });
    }

    // ─── Method not allowed ───
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Use GET to read status or POST to set status.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      error: error.error || 'Internal server error',
      message: error.message || 'An unexpected error occurred.',
      timestamp: new Date().toISOString()
    });
  }
};

// ══════════════════════════════════════════════════════════════ END: api/status.js

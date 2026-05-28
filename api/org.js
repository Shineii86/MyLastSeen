/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — api/org.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   Organization last-seen endpoint. Fetches members of a
 *   GitHub organization and returns their last-seen data.
 *
 * @endpoint GET /api/org/:orgname/lastseen
 *
 * @version 2.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { fetchOrgMembers, fetchMultipleUsers } = require('../utils/github');
const { relativeTime } = require('../utils/relativeTime');
const { CORS_HEADERS } = require('../utils/constants');

// ══════════════════════════════════════════════════════════════
// REQUEST HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/org/:orgname/lastseen handler ----

/**
 * Org last-seen handler. Fetches org members and their activity.
 *
 * Query parameters:
 *   - token — Optional GitHub PAT
 *   - limit — Max members to return (default 30)
 */
module.exports = async (req, res) => {
  const startTime = Date.now();
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  try {
    const orgname = (req.query.orgname || req.params?.orgname)?.trim();
    const token = req.query.token || process.env.GITHUB_TOKEN || null;
    const limit = Math.min(parseInt(req.query.limit) || 30, 30);

    if (!orgname) {
      return res.status(400).json({
        success: false,
        error: 'Missing org name',
        message: 'Provide a GitHub organization. Example: /api/org/vercel/lastseen',
        timestamp: new Date().toISOString()
      });
    }

    const orgData = await fetchOrgMembers(orgname, token);
    const membersToFetch = orgData.members.slice(0, limit);
    const results = await fetchMultipleUsers(membersToFetch, token);

    const members = results.map(r => {
      if (r.error) return { ...r, relativeTime: null };
      return { ...r, relativeTime: relativeTime(r.lastSeen) };
    });

    res.json({
      success: true,
      data: {
        org: orgname,
        members,
        total: members.length
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

// ══════════════════════════════════════════════════════════════ END: api/org.js

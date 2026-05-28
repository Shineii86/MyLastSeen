/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — api/score.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   Activity score endpoint. Computes a 0-100 score based on
 *   recency and frequency of a user's public GitHub activity.
 *
 * @endpoint GET /api/score/:username
 *
 * @version 2.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const { fetchUserEvents } = require('../utils/github');
const { relativeTime } = require('../utils/relativeTime');
const { CORS_HEADERS } = require('../utils/constants');

// ══════════════════════════════════════════════════════════════
// SCORING LOGIC
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Activity score computation ----

/**
 * Compute recency score (0-50) based on hours since last event.
 */
function recencyScore(isoDate) {
  const hoursAgo = (Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 1) return 50;
  if (hoursAgo < 6) return 45;
  if (hoursAgo < 24) return 40;
  if (hoursAgo < 72) return 30;
  if (hoursAgo < 168) return 20;
  if (hoursAgo < 720) return 10;
  return 0;
}

/**
 * Compute frequency score (0-50) based on number of events in last 10.
 */
function frequencyScore(eventCount) {
  if (eventCount >= 10) return 50;
  if (eventCount >= 7) return 40;
  if (eventCount >= 5) return 30;
  if (eventCount >= 3) return 20;
  if (eventCount >= 1) return 10;
  return 0;
}

/**
 * Get letter grade from score.
 */
function getGrade(score) {
  if (score >= 90) return 'S';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'F';
}

// ══════════════════════════════════════════════════════════════
// REQUEST HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: GET /api/score/:username handler ----

/**
 * Activity score handler. Returns 0-100 score with breakdown.
 */
module.exports = async (req, res) => {
  const startTime = Date.now();
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  try {
    const username = (req.query.username || req.params?.username)?.trim();
    const token = req.query.token || process.env.GITHUB_TOKEN || null;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Missing username',
        message: 'Provide a GitHub username. Example: /api/score/Shineii86',
        timestamp: new Date().toISOString()
      });
    }

    const result = await fetchUserEvents(username, token, 10);
    const events = result.events;

    if (events.length === 0) {
      return res.json({
        success: true,
        data: {
          username,
          score: 0,
          grade: 'F',
          breakdown: { recency: 0, frequency: 0 },
          lastSeen: null,
          relativeTime: 'never',
          eventCount: 0
        },
        meta: { responseTime: `${Date.now() - startTime}ms`, timestamp: new Date().toISOString() }
      });
    }

    const recency = recencyScore(events[0].timestamp);
    const frequency = frequencyScore(events.length);
    const score = recency + frequency;

    res.json({
      success: true,
      data: {
        username,
        score,
        grade: getGrade(score),
        breakdown: { recency, frequency },
        lastSeen: events[0].timestamp,
        relativeTime: relativeTime(events[0].timestamp),
        eventCount: events.length
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

// ══════════════════════════════════════════════════════════════ END: api/score.js

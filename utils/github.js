/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — utils/github.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   GitHub API client. Fetches public events for a user,
 *   extracts the most recent activity, and returns structured
 *   last-seen data. Handles rate limiting, 404s, and errors.
 *
 * @exports fetchLastSeen
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const axios = require('axios');
const {
  GITHUB_API, GITHUB_EVENTS_PATH, USER_AGENT,
  REQUEST_TIMEOUT, EVENT_LABELS
} = require('./constants');

// ══════════════════════════════════════════════════════════════
// GITHUB API CLIENT
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Public events fetcher ----

/**
 * Fetch the most recent public event for a GitHub user.
 *
 * Uses the /users/{username}/events/public endpoint which
 * returns up to 30 events per page. We only need the first one.
 *
 * @param {string} username - GitHub username
 * @param {string|null} token - Optional GitHub personal access token
 * @returns {Promise<Object>} Last seen data object
 * @throws {Object} Error with status code and message
 */
async function fetchLastSeen(username, token = null) {
  const url = `${GITHUB_API}${GITHUB_EVENTS_PATH.replace('{username}',encodeURIComponent(username))}`;

  const headers = {
    'User-Agent': USER_AGENT,
    'Accept': 'application/vnd.github.v3+json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await axios.get(url, {
      headers,
      timeout: REQUEST_TIMEOUT,
      params: { per_page: 1 }
    });
  } catch (error) {
    if (error.response) {
      const { status } = error.response;

      if (status === 404) {
        throw {
          status: 404,
          error: 'User not found',
          message: `GitHub user "${username}" does not exist or has no public events.`
        };
      }

      if (status === 403) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const resetDate = resetTime ? new Date(resetTime * 1000).toISOString() : null;
        throw {
          status: 429,
          error: 'GitHub rate limit exceeded',
          message: token
            ? 'Authenticated rate limit exceeded. Try again later.'
            : 'Unauthenticated rate limit exceeded (60/hr). Provide a ?token= parameter for higher limits.',
          resetAt: resetDate
        };
      }

      if (status === 422) {
        throw {
          status: 422,
          error: 'Invalid username',
          message: `"${username}" is not a valid GitHub username.`
        };
      }

      throw {
        status,
        error: 'GitHub API error',
        message: error.response.data?.message || 'Unexpected error from GitHub API.'
      };
    }

    throw {
      status: 502,
      error: 'GitHub API unreachable',
      message: 'Could not connect to GitHub API. Please try again later.'
    };
  }

  const events = response.data;

  if (!events || events.length === 0) {
    throw {
      status: 404,
      error: 'No activity found',
      message: `GitHub user "${username}" has no recent public activity.`
    };
  }

  const event = events[0];
  const rateLimit = {
    limit: parseInt(response.headers['x-ratelimit-limit']) || 0,
    remaining: parseInt(response.headers['x-ratelimit-remaining']) || 0,
    reset: parseInt(response.headers['x-ratelimit-reset']) || 0
  };

  return {
    username,
    lastSeen: event.created_at,
    eventType: event.type,
    eventLabel: EVENT_LABELS[event.type] || event.type,
    eventRepo: event.repo?.name || null,
    rateLimit
  };
}

module.exports = { fetchLastSeen };

// ══════════════════════════════════════════════════════════════ END: github.js

/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — utils/github.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   GitHub API client. All GitHub interactions go through
 *   this module — fetching public events, multiple events,
 *   org members, rate limit status, and parallel batch lookups.
 *
 * @exports
 *   fetchLastSeen, fetchUserEvents, fetchMultipleUsers,
 *   fetchOrgMembers, fetchRateLimit
 *
 * @version 2.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const axios = require('axios');
const {
  GITHUB_API,
  GITHUB_EVENTS_PATH,
  EVENT_LABELS,
  USER_AGENT,
  REQUEST_TIMEOUT
} = require('./constants');

// ══════════════════════════════════════════════════════════════
// SHARED HELPERS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Build auth headers ----
function buildHeaders(token) {
  const headers = {
    'User-Agent': USER_AGENT,
    'Accept': 'application/vnd.github.v3+json'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ---- FEATURE: Extract rate limit from response ----
function extractRateLimit(response) {
  const h = response.headers;
  return {
    limit: parseInt(h['x-ratelimit-limit']) || 0,
    remaining: parseInt(h['x-ratelimit-remaining']) || 0,
    reset: parseInt(h['x-ratelimit-reset']) || 0
  };
}

// ---- FEATURE: Handle GitHub API errors ----
function handleGitHubError(error, username) {
  if (error.response) {
    const status = error.response.status;
    const rateLimit = extractRateLimit(error.response);

    if (status === 404) {
      throw {
        status: 404,
        error: 'User not found',
        message: `GitHub user "${username}" not found or has no public events.`
      };
    }

    if (status === 403) {
      const resetDate = new Date(rateLimit.reset * 1000);
      throw {
        status: 429,
        error: 'GitHub rate limit exceeded',
        message: rateLimit.remaining === 0
          ? `GitHub API rate limit exceeded. Resets at ${resetDate.toISOString()}`
          : 'GitHub API access forbidden. Try adding a ?token= parameter.',
        resetAt: resetDate.toISOString()
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
      message: `GitHub API returned ${status}: ${error.response.data?.message || 'Unknown error'}`
    };
  }

  throw {
    status: 502,
    error: 'GitHub API unreachable',
    message: `Could not reach GitHub API: ${error.message}`
  };
}

// ══════════════════════════════════════════════════════════════
// CORE FUNCTIONS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Fetch last seen (single event) ----

/**
 * Fetch a GitHub user's most recent public event.
 *
 * @param {string} username - GitHub username
 * @param {string|null} token - Optional GitHub PAT
 * @returns {Promise<Object>} Last seen data
 */
async function fetchLastSeen(username, token = null) {
  const url = `${GITHUB_API}${GITHUB_EVENTS_PATH.replace('{username}', encodeURIComponent(username))}`;

  try {
    const response = await axios.get(url, {
      headers: buildHeaders(token),
      timeout: REQUEST_TIMEOUT,
      params: { per_page: 1 }
    });

    const rateLimit = extractRateLimit(response);

    if (!response.data || response.data.length === 0) {
      throw {
        status: 404,
        error: 'No activity found',
        message: `No public events found for "${username}".`
      };
    }

    const event = response.data[0];

    return {
      username,
      lastSeen: event.created_at,
      eventType: event.type,
      eventLabel: EVENT_LABELS[event.type] || event.type,
      eventRepo: event.repo?.name || null,
      rateLimit
    };
  } catch (error) {
    if (error.status) throw error;
    handleGitHubError(error, username);
  }
}

// ---- FEATURE: Fetch multiple events for a user ----

/**
 * Fetch multiple recent public events for a user.
 *
 * @param {string} username - GitHub username
 * @param {string|null} token - Optional GitHub PAT
 * @param {number} count - Number of events (default 10, max 100)
 * @returns {Promise<Object>} User events data
 */
async function fetchUserEvents(username, token = null, count = 10) {
  const url = `${GITHUB_API}${GITHUB_EVENTS_PATH.replace('{username}', encodeURIComponent(username))}`;

  try {
    const response = await axios.get(url, {
      headers: buildHeaders(token),
      timeout: REQUEST_TIMEOUT,
      params: { per_page: Math.min(count, 100) }
    });

    const rateLimit = extractRateLimit(response);
    const events = (response.data || []).map(event => ({
      eventType: event.type,
      eventLabel: EVENT_LABELS[event.type] || event.type,
      eventRepo: event.repo?.name || null,
      timestamp: event.created_at,
      relativeTime: null
    }));

    return { username, events, rateLimit };
  } catch (error) {
    if (error.status) throw error;
    handleGitHubError(error, username);
  }
}

// ---- FEATURE: Fetch multiple users in parallel ----

/**
 * Fetch last-seen data for multiple users in parallel.
 *
 * @param {string[]} usernames - Array of GitHub usernames
 * @param {string|null} token - Optional GitHub PAT
 * @returns {Promise<Object[]>} Array of results (success or error per user)
 */
async function fetchMultipleUsers(usernames, token = null) {
  const promises = usernames.map(async (username) => {
    try {
      return await fetchLastSeen(username.trim(), token);
    } catch (error) {
      return {
        username: username.trim(),
        error: error.error || 'Fetch failed',
        message: error.message || 'Could not fetch user data.'
      };
    }
  });

  return Promise.all(promises);
}

// ---- FEATURE: Fetch org members ----

/**
 * Fetch members of a GitHub organization.
 *
 * @param {string} orgname - GitHub organization name
 * @param {string|null} token - Optional GitHub PAT
 * @returns {Promise<Object>} Org members list
 */
async function fetchOrgMembers(orgname, token = null) {
  const url = `${GITHUB_API}/orgs/${encodeURIComponent(orgname)}/members`;

  try {
    const response = await axios.get(url, {
      headers: buildHeaders(token),
      timeout: REQUEST_TIMEOUT,
      params: { per_page: 30 }
    });

    const rateLimit = extractRateLimit(response);
    const members = (response.data || []).map(m => m.login);

    return { org: orgname, members, rateLimit };
  } catch (error) {
    if (error.response?.status === 404) {
      throw {
        status: 404,
        error: 'Organization not found',
        message: `GitHub organization "${orgname}" not found.`
      };
    }
    if (error.status) throw error;
    handleGitHubError(error, orgname);
  }
}

// ---- FEATURE: Fetch rate limit status ----

/**
 * Fetch GitHub API rate limit status.
 *
 * @param {string|null} token - Optional GitHub PAT
 * @returns {Promise<Object>} Rate limit data
 */
async function fetchRateLimit(token = null) {
  const url = `${GITHUB_API}/rate_limit`;

  try {
    const response = await axios.get(url, {
      headers: buildHeaders(token),
      timeout: REQUEST_TIMEOUT
    });

    const data = response.data;
    return {
      core: {
        limit: data.resources.core.limit,
        remaining: data.resources.core.remaining,
        reset: new Date(data.resources.core.reset * 1000).toISOString()
      },
      search: {
        limit: data.resources.search.limit,
        remaining: data.resources.search.remaining,
        reset: new Date(data.resources.search.reset * 1000).toISOString()
      },
      authenticated: !!token
    };
  } catch (error) {
    throw {
      status: 502,
      error: 'GitHub API unreachable',
      message: `Could not reach GitHub API: ${error.message}`
    };
  }
}

// ══════════════════════════════════════════════════════════════
// MODULE EXPORTS
// ══════════════════════════════════════════════════════════════

module.exports = {
  fetchLastSeen,
  fetchUserEvents,
  fetchMultipleUsers,
  fetchOrgMembers,
  fetchRateLimit
};

// ══════════════════════════════════════════════════════════════ END: github.js

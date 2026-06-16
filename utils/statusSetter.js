/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — utils/statusSetter.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   GitHub profile status setter via GraphQL API.
 *   Uses GH_TOKEN to authenticate and set the user's
 *   "What's happening" status with a custom message and emoji.
 *
 * @exports setUserStatus, clearUserStatus, getStatus
 *
 * @version 3.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const axios = require('axios');
const { GITHUB_API, REQUEST_TIMEOUT } = require('./constants');

// ══════════════════════════════════════════════════════════════
// GRAPHQL HELPERS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Build GraphQL auth headers ----
function buildGraphQLHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

// ---- FEATURE: Execute GraphQL mutation ----
async function executeGraphQL(query, variables, token) {
  const response = await axios.post(
    'https://api.github.com/graphql',
    { query, variables },
    {
      headers: buildGraphQLHeaders(token),
      timeout: REQUEST_TIMEOUT
    }
  );

  if (response.data.errors) {
    const err = response.data.errors[0];
    throw {
      status: err.type === 'INSUFFICIENT_SCOPES' ? 403 : 400,
      error: 'GitHub GraphQL error',
      message: err.message
    };
  }

  return response.data.data;
}

// ══════════════════════════════════════════════════════════════
// CORE FUNCTIONS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Set user status ----

/**
 * Set the authenticated user's GitHub profile status.
 *
 * @param {string} token - GitHub PAT with 'user' scope
 * @param {string} message - Status message (max 80 chars)
 * @param {string} [emoji] - Optional emoji (e.g., "🔍", "🚀")
 * @param {string} [expiresAt] - Optional ISO timestamp for expiration
 * @returns {Promise<Object>} Current status after mutation
 */
async function setUserStatus(token, message, emoji = null, expiresAt = null) {
  const query = `
    mutation SetStatus($message: String!, $emoji: String, $expiresAt: DateTime) {
      changeUserStatus(input: {
        message: $message,
        emoji: $emoji,
        expiresAt: $expiresAt
      }) {
        status {
          message
          emoji
          expiresAt
          indicatesLimitedAvailability
        }
      }
    }
  `;

  const variables = { message };
  if (emoji) variables.emoji = emoji;
  if (expiresAt) variables.expiresAt = expiresAt;

  const data = await executeGraphQL(query, variables, token);
  return data.changeUserStatus.status;
}

// ---- FEATURE: Clear user status ----

/**
 * Clear the authenticated user's GitHub profile status.
 *
 * @param {string} token - GitHub PAT with 'user' scope
 * @returns {Promise<Object>} Result of clear mutation
 */
async function clearUserStatus(token) {
  const query = `
    mutation ClearStatus {
      changeUserStatus(input: {
        message: ""
      }) {
        status {
          message
          emoji
          expiresAt
        }
      }
    }
  `;

  const data = await executeGraphQL(query, {}, token);
  return data.changeUserStatus.status;
}

// ---- FEATURE: Get current status ----

/**
 * Get the authenticated user's current GitHub profile status.
 *
 * @param {string} token - GitHub PAT with 'user' scope
 * @returns {Promise<Object>} Current status
 */
async function getStatus(token) {
  const query = `
    query GetStatus {
      viewer {
        status {
          message
          emoji
          expiresAt
          indicatesLimitedAvailability
        }
      }
    }
  `;

  const data = await executeGraphQL(query, {}, token);
  return data.viewer.status;
}

// ══════════════════════════════════════════════════════════════
// MODULE EXPORTS
// ══════════════════════════════════════════════════════════════

module.exports = {
  setUserStatus,
  clearUserStatus,
  getStatus
};

// ══════════════════════════════════════════════════════════════ END: statusSetter.js

/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — utils/constants.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   Centralized application constants. Every tunable value,
 *   default, and shared string lives here — no magic numbers
 *   scattered across the codebase.
 *
 * @exports
 *   APP_NAME, APP_VERSION, APP_DESCRIPTION,
 *   CACHE_TTL, GITHUB_API, CORS_HEADERS,
 *   MAX_BATCH_SIZE, MAX_HISTORY_COUNT, ACTIVITY_SCORE_WEIGHTS
 *
 * @version 2.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// APPLICATION IDENTITY
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: App metadata ----
module.exports = {
  /** @type {string} Application display name */
  APP_NAME: 'MyLastSeen',

  /** @type {string} Semantic version — keep in sync with package.json */
  APP_VERSION: '3.0.0',

  /** @type {string} Short description for API index */
  APP_DESCRIPTION: 'GitHub Last Seen API — Track when GitHub users were last active',

  // ══════════════════════════════════════════════════════════════
  // CACHE & LIMITS
  // ══════════════════════════════════════════════════════════════

  // ---- FEATURE: Cache configuration ----
  /**
   * Default cache TTL in seconds.
   * NOTE: Overridden by CACHE_TTL env var at runtime.
   * @type {number}
   */
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 300,

  // ══════════════════════════════════════════════════════════════
  // GITHUB API
  // ══════════════════════════════════════════════════════════════

  // ---- FEATURE: GitHub API settings ----
  /** @type {string} GitHub API base URL */
  GITHUB_API: 'https://api.github.com',

  /** @type {string} GitHub events endpoint template */
  GITHUB_EVENTS_PATH: '/users/{username}/events/public',

  /** @type {string} User-Agent for GitHub API requests */
  USER_AGENT: 'MyLastSeen/1.0.0 (https://github.com/Shineii86/MyLastSeen)',

  /** @type {number} Request timeout in milliseconds */
  REQUEST_TIMEOUT: 10000,

  // ══════════════════════════════════════════════════════════════
  // EVENT TYPE LABELS
  // ══════════════════════════════════════════════════════════════

  // ---- FEATURE: Human-readable event type mapping ----
  /**
   * Maps GitHub event types to human-readable labels.
   * Used in text output and badge messages.
   * @type {Object.<string, string>}
   */
  EVENT_LABELS: {
    PushEvent: 'pushed code',
    IssuesEvent: 'opened an issue',
    IssueCommentEvent: 'commented on an issue',
    PullRequestEvent: 'opened a PR',
    PullRequestReviewEvent: 'reviewed a PR',
    PullRequestReviewCommentEvent: 'commented on a PR',
    CreateEvent: 'created a branch/tag',
    DeleteEvent: 'deleted a branch/tag',
    WatchEvent: 'starred a repo',
    ForkEvent: 'forked a repo',
    ReleaseEvent: 'published a release',
    GollumEvent: 'edited a wiki',
    PublicEvent: 'made a repo public',
    MemberEvent: 'added a member',
    CommitCommentEvent: 'commented on a commit',
    DeploymentEvent: 'triggered a deployment',
    DeploymentStatusEvent: 'deployment status update',
    StatusEvent: 'commit status update',
    CheckRunEvent: 'check run completed',
    CheckSuiteEvent: 'check suite completed',
    SponsorshipEvent: 'sponsored a developer',
    ProjectEvent: 'updated a project',
    ProjectCardEvent: 'updated a project card',
    ProjectColumnEvent: 'updated a project column',
    OrgBlockEvent: 'blocked a user',
    RepositoryEvent: 'updated a repository',
    RepositoryVulnerabilityAlertEvent: 'security alert'
  },

  // ══════════════════════════════════════════════════════════════
  // BATCH & HISTORY LIMITS
  // ══════════════════════════════════════════════════════════════

  // ---- FEATURE: Batch processing limits ----
  /** @type {number} Maximum users per batch request */
  MAX_BATCH_SIZE: 10,

  /** @type {number} Maximum events per history request */
  MAX_HISTORY_COUNT: 10,

  // ══════════════════════════════════════════════════════════════
  // ACTIVITY SCORING
  // ══════════════════════════════════════════════════════════════

  // ---- FEATURE: Activity score configuration ----
  /**
   * Weights for activity score calculation.
   * Score = recency (0-50) + frequency (0-50)
   * @type {Object}
   */
  ACTIVITY_SCORE_WEIGHTS: {
    recency: { max: 50, thresholds: [
      { hours: 1, score: 50 },
      { hours: 6, score: 40 },
      { hours: 24, score: 30 },
      { hours: 72, score: 20 },
      { hours: 168, score: 10 },
      { hours: 720, score: 5 }
    ]},
    frequency: { max: 50, thresholds: [
      { count: 10, score: 50 },
      { count: 7, score: 40 },
      { count: 5, score: 30 },
      { count: 3, score: 20 },
      { count: 1, score: 10 }
    ]}
  },

  // ══════════════════════════════════════════════════════════════
  // BATCH & LIMITS
  // ══════════════════════════════════════════════════════════════

  // ---- FEATURE: Batch and history limits ----
  /** @type {number} Max users in batch lookup */
  MAX_BATCH_SIZE: 10,

  /** @type {number} Max events in history endpoint */
  MAX_HISTORY_COUNT: 10,

  // ══════════════════════════════════════════════════════════════
  // CORS
  // ══════════════════════════════════════════════════════════════

  // ---- FEATURE: CORS headers ----
  /**
   * Shared CORS headers applied to every API response.
   * NOTE: Also duplicated in vercel.json for edge middleware.
   * @type {Object.<string, string>}
   */
  CORS_HEADERS: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
};

// ══════════════════════════════════════════════════════════════ END: constants.js

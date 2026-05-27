/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — utils/relativeTime.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   Converts ISO date strings or Date objects into
 *   human-readable relative time strings (e.g., "2 hours ago").
 *   Handles seconds, minutes, hours, days, weeks, months, years.
 *
 * @exports relativeTime
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// RELATIVE TIME FORMATTER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Time ago calculation ----

/**
 * Convert a date to a human-readable relative time string.
 *
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Relative time (e.g., "2 hours ago", "just now")
 */
function relativeTime(date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'just now';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (weeks === 1) return '1 week ago';
  if (weeks < 4) return `${weeks} weeks ago`;
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  if (years === 1) return '1 year ago';
  return `${years} years ago`;
}

module.exports = { relativeTime };

// ══════════════════════════════════════════════════════════════ END: relativeTime.js

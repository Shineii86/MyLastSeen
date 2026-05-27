/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — index.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   Vercel serverless entry point. Serves the landing page
 *   (cached in memory) for HTML requests, or returns the
 *   API index JSON for API clients. The landing page is
 *   only re-read from disk when the file's mtime changes.
 *
 * @exports Vercel serverless function handler
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const fs = require('fs');
const path = require('path');
const { APP_NAME, APP_VERSION, APP_DESCRIPTION } = require('./utils/constants');

// ══════════════════════════════════════════════════════════════
// IN-MEMORY LANDING PAGE CACHE
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Landing page memory cache ----

/** @type {string|null} Cached HTML content */
let cachedHtml = null;

/** @type {number} Last known mtimeMs of index.html */
let cachedHtmlMtime = 0;

// ══════════════════════════════════════════════════════════════
// REQUEST HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Vercel serverless handler ----

/**
 * Vercel serverless function handler.
 *
 * Behavior:
 *   - HTML request (Accept: text/html or /) → serve cached landing page
 *   - API request (Accept: application/json) → return API index JSON
 *
 * @param {Object} req - Vercel request object
 * @param {Object} res - Vercel response object
 */
module.exports = (req, res) => {
  try {
    const accept = req.headers.accept || '';

    // ─── Landing page (cached in memory) ───
    if (accept.includes('text/html') || req.url === '/' || req.url === '') {
      const filePath = path.join(__dirname, 'public', 'index.html');
      const stat = fs.statSync(filePath);

      if (!cachedHtml || stat.mtimeMs !== cachedHtmlMtime) {
        cachedHtml = fs.readFileSync(filePath, 'utf8');
        cachedHtmlMtime = stat.mtimeMs;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).send(cachedHtml);
    }

    // ─── API index (JSON) ───
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, s-maxage=300');

    res.status(200).json({
      name: APP_NAME,
      version: APP_VERSION,
      description: APP_DESCRIPTION,
      documentation: 'https://mylastseen.vercel.app',
      endpoints: {
        'GET /api/lastseen/:username': 'Get last seen info as JSON',
        'GET /api/lastseen/:username/text': 'Get last seen as plain text',
        'GET /api/lastseen/:username/badge': 'Shields.io endpoint badge',
        'GET /api/health': 'Health check'
      },
      usage: {
        badge: '![Last Seen](https://img.shields.io/endpoint?url=https://mylastseen.vercel.app/api/lastseen/USERNAME/badge)',
        json: 'curl https://mylastseen.vercel.app/api/lastseen/USERNAME',
        text: 'curl https://mylastseen.vercel.app/api/lastseen/USERNAME/text'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// ══════════════════════════════════════════════════════════════ END: index.js

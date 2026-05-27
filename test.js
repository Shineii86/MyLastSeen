/*
 * ======= • ======= • ======= • ======= • =======• =======
 * MyLastSeen — test.js
 * Repository: https://github.com/Shineii86/MyLastSeen
 *
 * @description
 *   Integration test suite. Tests all API endpoints against
 *   a running local server. Run with: node test.js
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const http = require('http');

const BASE = process.env.TEST_URL || 'http://localhost:3000';
let passed = 0, failed = 0;

/**
 * Make an HTTP GET request and return parsed response.
 *
 * @param {string} url - Full URL to fetch
 * @returns {Promise<{status: number, headers: Object, body: string}>}
 */
function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
}

/**
 * Assert a condition and log pass/fail.
 *
 * @param {string} name - Test name
 * @param {boolean} condition - Whether the test passed
 * @param {string} [detail] - Optional failure detail
 */
function assert(name, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

/**
 * Run all integration tests.
 */
async function runTests() {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║        MyLastSeen — Test Suite           ║`);
  console.log(`╚══════════════════════════════════════════╝\n`);
  console.log(`Testing against: ${BASE}\n`);

  // ─── Health endpoint ───
  console.log('[GET /api/health]');
  try {
    const res = await get(`${BASE}/api/health`);
    const data = JSON.parse(res.body);
    assert('Status 200', res.status === 200);
    assert('success is true', data.success === true);
    assert('Has version', typeof data.version === 'string');
    assert('Has uptime', typeof data.uptime === 'number');
  } catch (err) {
    assert('Health endpoint reachable', false, err.message);
  }

  // ─── Last seen JSON ───
  console.log('\n[GET /api/lastseen/Shineii86]');
  try {
    const res = await get(`${BASE}/api/lastseen/Shineii86`);
    const data = JSON.parse(res.body);
    assert('Status 200', res.status === 200);
    assert('success is true', data.success === true);
    assert('Has username', data.data?.username === 'Shineii86');
    assert('Has lastSeen ISO date', typeof data.data?.lastSeen === 'string');
    assert('Has relativeTime', typeof data.data?.relativeTime === 'string');
    assert('Has eventType', typeof data.data?.eventType === 'string');
  } catch (err) {
    assert('Last seen endpoint reachable', false, err.message);
  }

  // ─── Last seen text ───
  console.log('\n[GET /api/lastseen/Shineii86/text]');
  try {
    const res = await get(`${BASE}/api/lastseen/Shineii86/text`);
    assert('Status 200', res.status === 200);
    assert('Content-Type is text/plain', res.headers['content-type']?.includes('text/plain'));
    assert('Contains username', res.body.includes('Shineii86'));
    assert('Contains "Last seen"', res.body.includes('Last seen'));
  } catch (err) {
    assert('Text endpoint reachable', false, err.message);
  }

  // ─── Badge ───
  console.log('\n[GET /api/lastseen/Shineii86/badge]');
  try {
    const res = await get(`${BASE}/api/lastseen/Shineii86/badge`);
    const data = JSON.parse(res.body);
    assert('Status 200', res.status === 200);
    assert('schemaVersion is 1', data.schemaVersion === 1);
    assert('label is "last seen"', data.label === 'last seen');
    assert('Has message', typeof data.message === 'string');
    assert('Has color', typeof data.color === 'string');
  } catch (err) {
    assert('Badge endpoint reachable', false, err.message);
  }

  // ─── Invalid user ───
  console.log('\n[GET /api/lastseen/this-user-definitely-does-not-exist-xyz123]');
  try {
    const res = await get(`${BASE}/api/lastseen/this-user-definitely-does-not-exist-xyz123`);
    const data = JSON.parse(res.body);
    assert('Returns error', data.success === false);
    assert('Has error message', typeof data.message === 'string');
  } catch (err) {
    assert('Invalid user handled', false, err.message);
  }

  // ─── 404 ───
  console.log('\n[GET /api/nonexistent]');
  try {
    const res = await get(`${BASE}/api/nonexistent`);
    assert('Status 404', res.status === 404);
  } catch (err) {
    assert('404 handler works', false, err.message);
  }

  // ─── Summary ───
  console.log(`\n${'═'.repeat(44)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log(`${'═'.repeat(44)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();

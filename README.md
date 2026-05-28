<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&height=300&color=gradient&text=𝗠𝘆𝗟𝗮𝘀𝘁𝗦𝗲𝗲𝗻&fontAlignY=30&fontSize=90&desc=𝖦𝗂𝗍𝗁𝗎𝖻%20𝖫𝖺𝗌𝗍%20𝖲𝖾𝖾𝗇%20𝖠𝖯𝖨&descSize=30" />

</div>

<p align="center">
  <a href="https://github.com/Shineii86/MyLastSeen/stargazers"><img src="https://img.shields.io/github/stars/Shineii86/MyLastSeen?style=for-the-badge&logo=github&color=f43f8e&logoColor=white" alt="Stars"/></a>
  <a href="https://github.com/Shineii86/MyLastSeen/network/members"><img src="https://img.shields.io/github/forks/Shineii86/MyLastSeen?style=for-the-badge&logo=github&color=a855f7&logoColor=white" alt="Forks"/></a>
  <a href="https://github.com/Shineii86/MyLastSeen/issues"><img src="https://img.shields.io/github/issues/Shineii86/MyLastSeen?style=for-the-badge&logo=github&color=7c3aed&logoColor=white" alt="Issues"/></a>
  <a href="https://github.com/Shineii86/MyLastSeen/pulls"><img src="https://img.shields.io/github/issues-pr/Shineii86/MyLastSeen?style=for-the-badge&logo=github&color=ec4899&logoColor=white" alt="Pull Requests"/></a>
  <a href="https://github.com/Shineii86/MyLastSeen/commits"><img src="https://img.shields.io/github/last-commit/Shineii86/MyLastSeen?style=for-the-badge&logo=github&color=6366f1&logoColor=white" alt="Last Commit"/></a>
  <a href="https://github.com/Shineii86/MyLastSeen/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Shineii86/MyLastSeen?style=for-the-badge&logo=mit&color=22c55e&logoColor=white" alt="License"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-5.1-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/Vercel-Serverless-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square&logo=mit&logoColor=white" alt="License"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-f43f8e?style=flat-square&logoColor=white" alt="Version"/>
  <img src="https://img.shields.io/badge/Endpoints-4-6366f1?style=flat-square&logoColor=white" alt="Endpoints"/>
</p>

<p align="center">
  <b>Track when GitHub users were last active — via public events.</b><br/>
  JSON, plain text, and Shields.io badge output. Optional token for higher rate limits.<br/>
  Built for README embeds, Telegram bots, and developer dashboards.
</p>

<p align="center">
  <a href="#-table-of-contents">Table of Contents</a> &bull;
  <a href="#-features">Features</a> &bull;
  <a href="#-api-endpoints">API Docs</a> &bull;
  <a href="#-quick-start">Quick Start</a> &bull;
  <a href="#-deployment">Deployment</a> &bull;
  <a href="#-contributing">Contributing</a>
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [API Response Schema](#-api-response-schema)
- [Shields.io Badges](#-shieldsio-badges)
- [Badge Colors](#-badge-colors)
- [Deployment](#-deployment)
- [Available Scripts](#-available-scripts)
- [Changelog Highlights](#-changelog-highlights)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Star History](#-star-history)

---

## 🌸 Overview

**MyLastSeen** is a lightweight, serverless API that tracks when GitHub users were last active by analyzing their most recent public event. No database, no auth for reads — just deploy and query.

> 💡 No database, no complex setup. Just deploy to Vercel and you have a production API.

### Why MyLastSeen?

- 👤 **User Activity** — Track when any GitHub user was last active
- 📊 **Multiple Formats** — JSON, plain text, and Shields.io badge output
- 🏷️ **Event Details** — Know what they did (push, PR, issue, release, etc.)
- ⏱️ **Relative Time** — Human-readable "2 hours ago" format
- 🎨 **Color Badges** — Activity-based colors for README embeds
- 🔑 **Optional Token** — Higher rate limits (5000/hr vs 60/hr) with a GitHub token
- ⚡ **Smart Caching** — 5-minute in-memory cache to reduce API calls
- 🔒 **CORS Enabled** — Works from any frontend, no proxy needed
- 🚀 **Zero-Config Deploy** — One click to Vercel, or run standalone with Express

### How It Works

```mermaid
flowchart TD
    A["🌐 Client Request<br/>(Browser / Bot / curl)"] --> B["🛡️ Vercel Edge / Express Server<br/>CORS · Security Headers · Rate Limiting"]
    B --> C{"💾 Cache Check<br/>(node-cache, 5min TTL)"}
    C -- HIT --> D["⚡ Return Cached Response<br/>~5ms"]
    C -- MISS --> E["📡 GitHub Events API<br/>/users/:username/events/public"]
    E --> F["🔍 Extract Most Recent Event<br/>PushEvent · IssuesEvent · ReleaseEvent · etc."]
    F --> G["⏱️ Calculate Relative Time<br/>(just now → years ago)"]
    G --> H["💾 Cache & Respond<br/>JSON · Plain Text · Shields.io Badge"]

    style A fill:#1e1e2e,stroke:#a78bfa,color:#f1f5f9
    style B fill:#1e1e2e,stroke:#6366f1,color:#f1f5f9
    style C fill:#1e1e2e,stroke:#f43f8e,color:#f1f5f9
    style D fill:#1e1e2e,stroke:#22c55e,color:#f1f5f9
    style E fill:#1e1e2e,stroke:#a855f7,color:#f1f5f9
    style F fill:#1e1e2e,stroke:#eab308,color:#f1f5f9
    style G fill:#1e1e2e,stroke:#06b6d4,color:#f1f5f9
    style H fill:#1e1e2e,stroke:#22c55e,color:#f1f5f9
```

---

## ✨ Features

<table>
  <tr>
    <td>

### ⚡ Core
- **Public events** — uses GitHub's public events API, no auth required
- **Smart caching** — 5-minute TTL, reduces API calls
- **Rate limit pass-through** — exposes GitHub's remaining quota
- **Graceful degradation** — clear errors for 404, 403, 500
- **CORS enabled** — works from any frontend

    </td>
    <td>

### 📊 Output
- **JSON** — structured data with activity type, repo, relative time
- **Plain text** — one-liner for terminal, bots, scripting
- **Shields.io badge** — endpoint badge for README embeds
- **Color-coded** — activity-based badge colors (green → red)
- **Health check** — uptime, version, cache stats

    </td>
  </tr>
  <tr>
    <td>

### 🛡️ Reliability
- **Timeout protection** — 10s per request, never hangs
- **CORS enabled** — works from any frontend
- **Security headers** — X-Frame-Options, X-Content-Type-Options
- **Rate limiting** — 100 req/min per IP with headers
- **Error handling** — structured error responses

    </td>
    <td>

### 🔑 Flexibility
- **Optional token** — pass via query param or env var
- **5000 req/hr** — with token vs 60/hr without
- **Event labels** — human-readable activity descriptions
- **Event repo** — which repo the activity was on
- **Cached flag** — know if response was from cache

    </td>
  </tr>
</table>

### 🌟 Feature Highlights

| Feature | Description | Status |
|:---|:---|:---:|
| 👤 User Last Seen | Track any public GitHub user's last activity | ✅ |
| 📊 JSON Response | Structured data with event type, repo, relative time | ✅ |
| 📝 Plain Text | One-liner output for bots and scripts | ✅ |
| 🏷️ Shields.io Badge | Endpoint badge for README embeds | ✅ |
| 🎨 Color Badges | Activity-based colors (brightgreen → red) | ✅ |
| 🔑 Optional Token | Higher rate limits with GitHub PAT | ✅ |
| ⚡ In-Memory Cache | 5-minute TTL, stats tracking | ✅ |
| 🏥 Health Check | Uptime, version, cache metrics | ✅ |
| 🔒 CORS Enabled | Works from any origin | ✅ |
| 🚀 Vercel Ready | Zero-config serverless deployment | ✅ |
| 🖥️ Express Mode | Standalone server with `npm start` | ✅ |
| 🧪 Test Suite | Integration tests for all endpoints | ✅ |

---

## 🛠 Tech Stack

| Technology | Purpose |
|:---|:---|
| **Node.js 20+** | Runtime |
| **Express 5.1** | HTTP server (local dev) |
| **Axios** | GitHub API client |
| **node-cache** | In-memory caching |
| **Vercel** | Serverless deployment |
| **Shields.io** | Badge rendering |

---

## 📁 Project Structure

```
MyLastSeen/
├── api/
│   ├── lastseen.js      # GET /api/lastseen/:username  (+ /text)
│   ├── badge.js         # GET /api/lastseen/:username/badge
│   └── health.js        # GET /api/health
├── utils/
│   ├── github.js        # GitHub API client
│   ├── cacheHandler.js  # In-memory cache wrapper
│   ├── constants.js     # App constants & config
│   └── relativeTime.js  # Date → "2 hours ago" formatter
├── public/
│   └── index.html       # Landing page
├── server.js            # Express server (local dev)
├── index.js             # Vercel serverless entry
├── test.js              # Integration tests
├── vercel.json          # Vercel config
├── package.json
└── CHANGELOG.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or later
- npm or yarn

### Installation

```bash
git clone https://github.com/Shineii86/MyLastSeen.git
cd MyLastSeen
npm install
```

### Run Locally

```bash
npm run dev
```

Server starts at `http://localhost:3000`.

### Test It

```bash
# JSON response
curl http://localhost:3000/api/lastseen/Shineii86

# Plain text
curl http://localhost:3000/api/lastseen/Shineii86/text

# Badge JSON (for Shields.io)
curl http://localhost:3000/api/lastseen/Shineii86/badge

# Health check
curl http://localhost:3000/api/health
```

---

## ⚙️ Configuration

| Environment Variable | Default | Description |
|:---|:---|:---|
| `PORT` | `3000` | Server port (local dev) |
| `GITHUB_TOKEN` | — | GitHub PAT for higher rate limits |
| `CACHE_TTL` | `300` | Cache TTL in seconds |

### Rate Limits

| Mode | Limit | Setup |
|:---|:---|:---|
| Without token | 60 req/hr | None |
| With token | 5000 req/hr | Set `GITHUB_TOKEN` env or pass `?token=` |

---

## 📡 API Endpoints

### `GET /api/lastseen/:username`

Returns last-seen data as JSON.

```bash
curl https://mylastseen.vercel.app/api/lastseen/Shineii86
```

```json
{
  "success": true,
  "data": {
    "username": "Shineii86",
    "lastSeen": "2026-05-28T12:00:00Z",
    "relativeTime": "2 hours ago",
    "eventType": "PushEvent",
    "eventLabel": "pushed code",
    "eventRepo": "Shineii86/AniNewsAPI",
    "cached": false
  }
}
```

### `GET /api/lastseen/:username/text`

Returns last-seen as plain text.

```bash
curl https://mylastseen.vercel.app/api/lastseen/Shineii86/text
```

```
Shineii86 — Last seen: 2 hours ago (pushed code)
```

### `GET /api/lastseen/:username/badge`

Returns Shields.io endpoint badge JSON.

```bash
curl https://mylastseen.vercel.app/api/lastseen/Shineii86/badge
```

```json
{
  "schemaVersion": 1,
  "label": "last seen",
  "message": "2 hours ago",
  "color": "green",
  "namedLogo": "github",
  "cacheSeconds": 300
}
```

### `GET /api/health`

Returns API health status, version, and cache stats.

```bash
curl https://mylastseen.vercel.app/api/health
```

```json
{
  "success": true,
  "status": "healthy",
  "name": "MyLastSeen",
  "version": "1.0.0",
  "uptime": 3600,
  "cache": { "hits": 42, "misses": 10, "keys": ["Shineii86"], "ttl": 300 }
}
```

---

## 📋 API Response Schema

### Last Seen Response

| Field | Type | Description |
|:---|:---|:---|
| `success` | `boolean` | Always `true` on success |
| `data.username` | `string` | GitHub username |
| `data.lastSeen` | `string` | ISO 8601 timestamp of last activity |
| `data.relativeTime` | `string` | Human-readable time (e.g., "2 hours ago") |
| `data.eventType` | `string` | GitHub event type (e.g., `PushEvent`) |
| `data.eventLabel` | `string` | Human-readable label (e.g., "pushed code") |
| `data.eventRepo` | `string` | Repository the activity was on |
| `data.cached` | `boolean` | Whether response was served from cache |

### Supported Event Types

| Event Type | Label |
|:---|:---|
| `PushEvent` | pushed code |
| `CreateEvent` | created a repo/branch |
| `DeleteEvent` | deleted a branch/tag |
| `IssuesEvent` | opened/closed an issue |
| `IssueCommentEvent` | commented on an issue |
| `PullRequestEvent` | opened/closed a PR |
| `PullRequestReviewEvent` | reviewed a PR |
| `ReleaseEvent` | published a release |
| `WatchEvent` | starred a repo |
| `ForkEvent` | forked a repo |
| `GollumEvent` | edited a wiki |
| `PublicEvent` | made a repo public |

---

## 🏷️ Shields.io Badges

Add a last-seen badge to your README:

```markdown
![Last Seen](https://img.shields.io/endpoint?url=https://mylastseen.vercel.app/api/lastseen/Shineii86/badge)
```

![Last Seen](https://img.shields.io/endpoint?url=https://mylastseen.vercel.app/api/lastseen/Shineii86/badge)

### Custom Style

```markdown
<!-- Flat style -->
![Last Seen](https://img.shields.io/endpoint?style=flat&url=https://mylastseen.vercel.app/api/lastseen/Shineii86/badge)

<!-- For-the-badge style -->
![Last Seen](https://img.shields.io/endpoint?style=for-the-badge&url=https://mylastseen.vercel.app/api/lastseen/Shineii86/badge)

<!-- With logo override -->
![Last Seen](https://img.shields.io/endpoint?logo=github&url=https://mylastseen.vercel.app/api/lastseen/Shineii86/badge)
```

---

## 🎨 Badge Colors

| Activity | Timeframe | Color |
|:---|:---|:---|
| Very recent | < 1 hour | ![#00c853](https://via.placeholder.com/12/00c853/00c853) `brightgreen` |
| Active | < 6 hours | ![#44cc11](https://via.placeholder.com/12/44cc11/44cc11) `green` |
| Today | < 24 hours | ![#9acd32](https://via.placeholder.com/12/9acd32/9acd32) `yellowgreen` |
| Recent | < 3 days | ![#dfb317](https://via.placeholder.com/12/dfb317/dfb317) `yellow` |
| This week | < 7 days | ![#fe7d37](https://via.placeholder.com/12/fe7d37/fe7d37) `orange` |
| Inactive | > 7 days | ![#e05d44](https://via.placeholder.com/12/e05d44/e05d44) `red` |

---

## 🚀 Deployment

### Vercel (Recommended)

1. Fork or import [Shineii86/MyLastSeen](https://github.com/Shineii86/MyLastSeen)
2. Connect to [Vercel](https://vercel.com)
3. Deploy — zero configuration needed
4. (Optional) Set `GITHUB_TOKEN` env var for higher rate limits

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/MyLastSeen)

### Self-Hosting

```bash
git clone https://github.com/Shineii86/MyLastSeen.git
cd MyLastSeen
npm install
GITHUB_TOKEN=ghp_xxxxx npm start
```

---

## 📜 Available Scripts

| Script | Command | Description |
|:---|:---|:---|
| `npm run dev` | `node server.js` | Start local dev server |
| `npm start` | `NODE_ENV=production node server.js` | Start production server |
| `npm test` | `node test.js` | Run integration tests |
| `npm run build` | `echo 'Build complete'` | No-op build for Vercel |

---

## 📰 Changelog Highlights

| Version | Date | Highlights |
|:---|:---|:---|
| **1.0.0** | 2026-05-28 | Initial release — JSON, text, badge, health endpoints, Vercel support |

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## ❓ Troubleshooting

<details>
<summary><b>Rate limit exceeded (403)</b></summary>

Without a token, GitHub allows 60 requests/hour. Set `GITHUB_TOKEN` for 5000/hr.

```bash
curl -H "Authorization: Bearer ghp_xxxxx" https://api.github.com/users/Shineii86/events/public
```
</details>

<details>
<summary><b>User not found (404)</b></summary>

The user must have **public events** enabled. Private profiles or users with no activity will return 404.
</details>

<details>
<summary><b>No activity found</b></summary>

Some users may not have recent public events. The API returns a clear message when no activity is found.
</details>

---

## ❓ FAQ

**Q: Does this work for private profiles?**
A: No. Only users with public activity can be tracked.

**Q: How accurate is the "last seen" time?**
A: It reflects the timestamp of the user's most recent public event on GitHub.

**Q: Can I use this in a Telegram bot?**
A: Yes! Use the `/text` endpoint for plain text output perfect for bots.

**Q: Is there a rate limit?**
A: 60 req/hr without a token, 5000 req/hr with one. Cached responses don't count.

---

## 🤝 Contributing

Contributions are welcome! Please read the steps below.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all tests pass before submitting.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Shinei Nouzen**

- GitHub: [@Shineii86](https://github.com/Shineii86)
- Twitter: [@shineii86](https://x.com/shineii86)
- Telegram: [@shineii86](https://telegram.me/shineii86)

---

## ⭐ Star History

<a href="https://star-history.com/#Shineii86/MyLastSeen&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Shineii86/MyLastSeen&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Shineii86/MyLastSeen&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Shineii86/MyLastSeen&type=Date" width="100%" />
  </picture>
</a>

---

<p align="center">
  Made with 💜 by <a href="https://github.com/Shineii86">Shinei Nouzen</a>
</p>

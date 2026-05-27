# MyLastSeen

Track when GitHub users were last active. Free API with Shields.io badge support.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/lastseen/:username` | Last seen as JSON |
| `GET` | `/api/lastseen/:username/text` | Last seen as plain text |
| `GET` | `/api/lastseen/:username/badge` | Shields.io endpoint badge |
| `GET` | `/api/health` | Health check |

## Usage

### JSON

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

### Plain Text

```bash
curl https://mylastseen.vercel.app/api/lastseen/Shineii86/text
```

```
Shineii86 — Last seen: 2 hours ago (pushed code)
```

### Shields.io Badge

Add to your README:

```markdown
![Last Seen](https://img.shields.io/endpoint?url=https://mylastseen.vercel.app/api/lastseen/Shineii86/badge)
```

![Last Seen](https://img.shields.io/endpoint?url=https://mylastseen.vercel.app/api/lastseen/Shineii86/badge)

### Optional GitHub Token

For higher rate limits (5000/hr vs 60/hr), pass a GitHub token:

```bash
curl https://mylastseen.vercel.app/api/lastseen/Shineii86?token=ghp_xxxxx
```

Or set the `GITHUB_TOKEN` environment variable on your deployment.

## Badge Colors

| Activity | Color |
|----------|-------|
| < 1 hour | brightgreen |
| < 6 hours | green |
| < 24 hours | yellowgreen |
| < 3 days | yellow |
| < 7 days | orange |
| > 7 days | red |

## Self-Hosting

```bash
git clone https://github.com/Shineii86/MyLastSeen.git
cd MyLastSeen
npm install
npm run dev
```

Server runs on `http://localhost:3000`.

## License

MIT © [Shinei Nouzen](https://github.com/Shineii86)

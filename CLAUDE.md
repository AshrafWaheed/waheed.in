# CLAUDE.md — WAHEED

## Server
- Provider: Hetzner Cloud, Ubuntu 24.04 LTS
- IP: 116.203.45.2
- User: dev (sudo, passwordless)
- Root: /var/www/waheed.in
- Frontend: /var/www/waheed.in/frontend (Next.js → port 3000)
- Backend: /var/www/waheed.in/backend (Laravel → port 8000)
- Nginx: waheed.in → :3000, waheed.in/api → :8000
- PM2: waheed-frontend + waheed-backend, startup registered
- SSL: Let's Encrypt via Certbot
- MySQL: database=waheed, user=waheed_user
- Redis: running + enabled

## Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Lucide React
- Backend: Laravel 11, Sanctum auth, MySQL, Redis queues
- Fonts: Cormorant Garamond, DM Sans, Amiri, Dancing Script (via next/font)

## Brand
- Teal: #335C67 · Dark: #254851 · Deepest: #1a363d
- Gold: #9c7d1c (text) · Gold soft: #fff3b0 (bg) · Ivory: #F7F3ED · White: #FFFDF9
- Fonts: Cormorant Garamond (display/headings), DM Sans (body), Amiri (Arabic)

## Active Build
- Full site implementation in progress — see `documents/SESSION_PLAN.md` for per-session scope
- Homepage redesign (3 variants: Hybrid `/`, Wahda-cinematic `/home2`, Outcrowd-tactile `/home3`) — see `documents/SESSION_PLAN_REDESIGN.md`. Copy is verbatim from `src/content/home.ts`.
- Content Engine (topic → researched blog → multi-platform syndication, driven by `claude -p`) —
  plan in `documents/CONTENT_ENGINE.md`, build status in `documents/CONTENT_ENGINE_TRACKER.md`.
  Phase 1 (topic queue, generator, fact gate) is live at `/jundullah/content`. Phases 2–5 pending.
  The agent's tool allowlist (`config/content.php`) is a security boundary — never widen it.

## Reference
- `documents/outcrowd.io.md` — first-hand teardown of outcrowd.io (the design bar for the
  Outcrowd-tactile variant): measured type scale, colour tokens, spacing, section map, and the
  motion mechanisms it actually uses. Read this before building anything "Outcrowd-like".

## Git
- Repo: git@github.com:AshrafWaheed/waheed.in.git, branch: main
- Commit and push from /var/www/waheed.in as dev

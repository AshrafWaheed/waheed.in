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
- Green: #3D6B4F · Dark: #2A4D38 · Darkest: #1A2E22
- Yellow: #E8C547 · Cream: #F5F0E8 · Text secondary: #7A9080
- Fonts: Cormorant Garamond (display/headings), DM Sans (body), Amiri (Arabic)

## Git
- Repo: git@github.com:AshrafWaheed/waheed.in.git, branch: main
- Commit and push from /var/www/waheed.in as dev

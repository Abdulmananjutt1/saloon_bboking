# Glamour Studio — Salon Booking System

Unified Next.js application — frontend and backend in a single project.

## Structure

```
glamour-studio/
├── frontend/    # Next.js 16 (unified — API routes + WebSocket + UI)
│   ├── src/app/api/   # All API routes (replaces Express backend)
│   ├── src/server/    # Server-side code (db, auth, email, push)
│   ├── prisma/        # Database schema & migrations
│   └── server.ts      # Custom server (adds WebSocket support)
└── DEPLOYMENT.md
```

## Quick Start

```bash
cd frontend
npm install
npx prisma generate
npm run dev
```

App runs at `http://localhost:3000`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Railway/Vercel setup.

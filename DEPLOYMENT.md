# Glamour Studio — Deployment Guide

## Architecture (Unified)

This is a **unified Next.js application** — frontend and backend are merged into a single project in the `frontend/` folder. There is no separate backend server.

- **API Routes**: `frontend/src/app/api/**` (Next.js Route Handlers)
- **WebSocket**: Custom Next.js server at `frontend/server.ts`
- **Database**: PostgreSQL via Prisma (adapter-pg)
- **Email**: Resend
- **Push Notifications**: Web Push (VAPID)

---

## Local Development

```bash
cd frontend
npm install
npx prisma generate
npm run dev
```

The app runs at `http://localhost:3000`  
WebSocket runs on the same port at `ws://localhost:3000/ws`

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp frontend/.env.example frontend/.env
```

Required:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Strong random secret for production

Optional:
- `RESEND_API_KEY` — Email notifications
- `VAPID_*` — Push notifications

---

## Database

```bash
# Run migrations
npm run db:deploy

# Seed with initial data (admin user + services catalog)
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

---

## Production Build

```bash
cd frontend
npm run build
npm start
```

For WebSocket support in production, the custom server is used automatically via `server.ts`.

---

## Deployment (Railway / Vercel)

**Railway** (recommended — supports WebSocket):
1. Set root directory to `frontend`
2. Build command: `npm run build`
3. Start command: `node dist/server.js` (after building server.ts)
4. Add all environment variables from `.env.example`

**Vercel** (no WebSocket — chat won't have real-time):
1. Deploy `frontend/` folder
2. API routes work normally
3. Chat falls back to REST polling

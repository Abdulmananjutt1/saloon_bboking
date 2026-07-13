# Glamour Studio Backend API

Express.js + TypeScript REST API with Prisma/PostgreSQL.

## Local Setup

```bash
cd backend
npm install
cp .env.example .env
npm run db:deploy
npm run dev
```

Local default API:

```text
http://localhost:4000
```

Healthcheck:

```text
GET /health
```

## Railway Deploy

Use the Railway backend service root:

```text
backend
```

This folder includes `railway.json`:

- `npm run build`
- `npm run db:deploy`
- `npm start`
- `/health` healthcheck

See the full guide in `../DEPLOYMENT.md`.

## Core Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
APP_URL=
FRONTEND_URLS=
CORS_ORIGINS=
```

Optional:

```env
RESEND_API_KEY=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

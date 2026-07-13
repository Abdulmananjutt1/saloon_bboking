# Deployment Guide

This project is split into:

- `backend/` - Express + TypeScript + Prisma/PostgreSQL, deploy to Railway.
- `frontend/` - Next.js, deploy to Vercel.

## Backend on Railway

1. Create a new Railway project from the GitHub repo.
2. Add a PostgreSQL database service.
3. Create/select the backend service and set the service root directory to:

```text
backend
```

If Railway asks for a config file path from the repository root, use:

```text
/backend/railway.json
```

The backend service already includes `backend/railway.json` with:

- Build command: `npm run build`
- Pre-deploy command: `npm run db:deploy`
- Start command: `npm start`
- Healthcheck path: `/health`

Railway's pre-deploy command is used for Prisma migrations before the app starts.

### Railway Variables

Set these on the Railway backend service:

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=replace-with-a-long-random-secret
APP_URL=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
FRONTEND_URLS=https://your-frontend-domain.com
CORS_ORIGINS=https://your-frontend-domain.com
DB_POOL_MAX=5
```

Optional:

```env
PUBLIC_BACKEND_URL=https://your-backend.up.railway.app
RESEND_API_KEY=
EMAIL_FROM=Glamour Studio <onboarding@resend.dev>
ADMIN_EMAIL=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=mailto:admin@glamourstudio.com
```

Notes:

- Do not manually set `PORT` on Railway unless you have a specific reason. Railway provides it.
- After Railway generates a domain, your API base URL will be `https://your-backend.up.railway.app/api`.
- The WebSocket URL is derived automatically by the frontend as `wss://your-backend.up.railway.app/ws`.

## Frontend on Vercel

Set these on the Vercel frontend project:

```env
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
```

Use your real Railway backend domain in `NEXT_PUBLIC_API_URL`.

## First Deploy Checklist

1. Deploy the Railway backend.
2. Generate/open the Railway public domain.
3. Confirm healthcheck:

```text
https://your-backend.up.railway.app/health
```

4. Put that backend domain into Vercel as `NEXT_PUBLIC_API_URL`.
5. Put the frontend domain into Railway as `APP_URL`, `FRONTEND_URL`, `FRONTEND_URLS`, and `CORS_ORIGINS`.
6. Redeploy both services after env changes.

## Database Seeding

Migrations run automatically on Railway through `npm run db:deploy`.

Seed data is not run automatically. If you need initial services/stylists/admin data, run the seed command once from Railway shell or locally against the Railway database:

```bash
npm run db:seed
```

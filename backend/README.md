# Glamour Studio — Backend API

Express.js + TypeScript REST API running on **port 4000**.

## Setup

```bash
cd backend
npm install
npm run dev       # development (auto-restart)
npm run build     # compile TypeScript
npm start         # production
```

## API Reference

### Health
```
GET  /health
```

### Auth
```
POST /api/auth/register   { name, email, phone, password, confirmPassword }
POST /api/auth/login      { email, password }
```

### Bookings
```
GET    /api/bookings               ?status=pending|confirmed|completed|cancelled
GET    /api/bookings/:id
POST   /api/bookings               { serviceId, stylistId, date, time, name, email, phone, notes? }
PATCH  /api/bookings/:id           { status }
DELETE /api/bookings/:id
```

### Clients
```
GET    /api/clients                ?search=...&sortBy=name|totalSpent|totalVisits
GET    /api/clients/:id
POST   /api/clients                { name, email, phone, notes? }
PATCH  /api/clients/:id            { name?, phone?, notes? }
DELETE /api/clients/:id
```

## Response Format

All responses follow this shape:
```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": "...", "errors": { "field": "message" } }
```

## Data Storage

JSON files in `../data/` folder (shared with Next.js frontend):
- `bookings.json`
- `clients.json`
- `users.json`

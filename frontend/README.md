# Glamour Studio — Frontend

Next.js frontend for the Glamour Studio salon booking system.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom component library
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in this directory:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
```

### Running

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Lint
npm run lint
```

## Project Structure

```
src/
├── app/            # Next.js App Router pages
│   ├── admin/      # Admin dashboard pages
│   ├── auth/       # Authentication pages
│   ├── book/       # Booking page
│   ├── dashboard/  # Client dashboard
│   └── ...
├── components/     # Reusable UI components
│   ├── admin/      # Admin-specific components
│   ├── booking/    # Booking components
│   ├── layout/     # Layout components
│   └── ui/         # Base UI components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and API client
└── constants/      # App-wide constants
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

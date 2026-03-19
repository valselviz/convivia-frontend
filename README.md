# Frontend - Convivia Management System

Web interface for managing guests, groups, and tables for a convivia. Built with Next.js 16 and React.

## What does this project do?

Web application that allows you to:
- **Manage guests**: create, edit, search, and filter guests. Confirm or decline attendance in bulk.
- **Organize groups**: create groups of guests (family, friends, etc.) and assign members.
- **Assign tables**: (future functionality) distribute guests to tables automatically or manually.

## Requirements

- Node.js 18 or higher
- Backend must be running on `http://localhost:3000` (or configure `NEXT_PUBLIC_API_URL`)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API (optional)

If the backend runs on a different port or URL, create a `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Defaults to `http://localhost:3000`.

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Commands

- `npm run dev` - Development server (port 3001)
- `npm run build` - Build app for production
- `npm run start` - Run compiled version
- `npm run lint` - Run linter

## Structure

```
src/
├── app/
│   ├── page.tsx           # Home page
│   ├── guests/
│   │   └── page.tsx      # Guest list
│   └── groups/
│       └── page.tsx      # Group list
├── components/           # Reusable components
│   ├── GuestTable.tsx
│   ├── GroupModal.tsx
│   └── ...
└── lib/
    ├── guests/           # Guest services and types
    ├── groups/           # Group services and types
    └── couple/           # Couple data management
```

## Main Pages

- `/` - Home page with guest summary and quick access
- `/guests` - Complete guest management (search, filters, bulk actions)
- `/groups` - Guest group management

## Main Features

- **Home dashboard**: summary with totals of guests, confirmed, pending, and plus-ones
- **Smart search**: search by guest name or main guest name (if +1)
- **Advanced filters**: filter by side (bride/groom), type, status, plus-ones, and sort by name or notes
- **Bulk actions**: select multiple guests to confirm, decline, add to groups, or delete
- **Group management**: organize guests into groups with categories (family, friends, work, etc.)
- **Plus-ones (+1)**: add plus-ones directly from the main guest list
- **Couple data**: configure and edit couple names from any page

## Technologies

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Fetch API for backend communication

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Type-check without emitting
```

The app auto-redirects `/` → `/calendrier`.

## Architecture

**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · date-fns (with `fr` locale) · Lucide React · Supabase (PostgreSQL) for persistence.

**Env vars** (`.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**DB schema**: `supabase/schema.sql` — run once in Supabase Dashboard → SQL Editor.

### Data flow

All application state lives in `hooks/useStore.ts` (React state). On mount it fetches all data from Supabase; if users/cars tables are empty it seeds `DEFAULT_USERS`/`DEFAULT_CARS`. Every mutation does an **optimistic local state update** immediately, then fires a Supabase call in the background (fire-and-forget with `.catch(console.error)`). The store is exposed via React context (`hooks/StoreContext.tsx`).

```
hooks/useStore.ts       ← React state + optimistic CRUD
hooks/StoreContext.tsx  ← context provider (shows spinner while loaded=false)
lib/supabase.ts         ← supabase client (createClient)
lib/db.ts               ← all async DB functions with snake_case↔camelCase mapping
lib/types.ts            ← TypeScript interfaces
lib/constants.ts        ← CATEGORIES, DEFAULT_USERS/CARS, label maps
lib/utils.ts            ← uid(), getWeekType(), date formatters (fr)
```

### DB column mapping (`lib/db.ts`)

TypeScript camelCase → Supabase snake_case: `userIds`→`user_ids`, `startTime`→`start_time`, `canDrive`→`can_drive`, `carId`→`car_id`, `assignedUserIds`→`assigned_user_ids`, `flightType`→`flight_type`, `startDate`→`start_date`, etc. All date/time fields are stored as `text` (YYYY-MM-DD / HH:mm strings).

### Users

`User.canDrive` controls who appears in the car reservation driver picker. Arthur (minor) has `canDrive: false`.

### Data models (`lib/types.ts`)

- **User** — family member with `name`, `color` (hex), `emoji`
- **CalendarEvent** — has `category: CategoryId`, `date: YYYY-MM-DD`, optional `startTime/endTime`, `weekType: 'A'|'B'|'both'`, `notification: boolean`
- **Car** + **CarReservation** — reservation links a car + user + date + destination
- **Task** — `status: 'pending'|'in_progress'|'done'`, `assignedUserIds[]`
- **Trip** — `flightType`, `startDate/endDate`, `days`, `status: 'planned'|'confirmed'|'done'`

### A/B week system

`getWeekType(date)` in `lib/utils.ts` computes whether a date falls in week A or B by counting calendar weeks from `WEEK_A_REFERENCE` (`2024-01-01`) in `lib/constants.ts`. Change that constant to shift the A/B cycle for the family.

### Routes

| Route | Page |
|---|---|
| `/calendrier` | Month + week calendar with event modal |
| `/voitures` | Car cards + reservation management |
| `/taches` | Task list grouped by date |
| `/voyages` | Trip planning with countdown |
| `/parametres` | Manage family members and cars |

### Component structure

```
components/
  layout/   Sidebar (nav) + Header (title + user avatars)
  calendar/ MonthView, WeekView, EventCard, EventForm
  ui/       Modal, Badge (CategoryBadge), UserPills
```

### Adding a new event category

1. Add a new `CategoryId` union member in `lib/types.ts`
2. Add the corresponding entry to the `CATEGORIES` array in `lib/constants.ts` with Tailwind color classes and a hex value

### Styling conventions

Tailwind v4 is used via `@import "tailwindcss"` in `globals.css`. Arbitrary values are allowed. Color primitives for the UI are slate-based; category colors use their own Tailwind color families (red, teal, yellow, green, etc.).

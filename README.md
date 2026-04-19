# LPG Association Web Platform

A full-stack style **Next.js App Router** project for the Bangladesh petroleum dealer/distributor/station-owner association.  
This platform includes both:

- a **public-facing website**, and
- an **authenticated admin dashboard** for operations and content management.

---

## Project Snapshot

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **State/Data:** TanStack React Query
- **Forms/Validation:** React Hook Form + Zod
- **Icons/UX:** Lucide React + Framer Motion
- **Backend Integration:** Laravel API (proxied through Next.js route handlers)

Core feature domains:
- Members
- Station owners
- Stations
- Committees
- Multimedia
- Notices
- Downloads
- Contact inbox
- Settings

---

## Application Architecture

### 1) Public Layer (`src/app/(public)/...`)

Public routes and sections include:
- Home
- About
- Committee pages (advisors, central, zonal)
- Members pages (all members, fees, running/ongoing/total/non-members)
- Galleries (photo, video, print media, media coverage, journals)
- Notices (list + detail)
- Downloads
- Contact
- Membership form

The homepage composition is assembled in `src/app/page.tsx` using reusable sections (hero, sponsors, partners, about, services, committee, contact, footer, etc.).

### 2) Auth Layer (`src/app/(auth)/...`)

- Login page
- Register page
- Shared auth layout

Auth session handling is managed by `AuthProvider`:
- keeps current user state
- supports session refresh via `/api/auth/me`
- supports logout via `/api/auth/logout`

### 3) Dashboard Layer (`src/app/(dashboard)/...`)

Dashboard pages are protected by the dashboard layout.

`src/app/(dashboard)/layout.tsx` performs:
1. token presence check,
2. current user fetch from backend (`/me`) via `laravelFetch`,
3. redirect on unauthorized.

UI structure is provided by `DashboardShell`:
- desktop sidebar,
- mobile drawer sidebar,
- topbar,
- content area.

---

## Admin Dashboard Features

Dashboard navigation is centrally defined in `src/components/dashboard/nav.ts`.

### Core modules

1. **Dashboard Overview**
   - user profile preview
   - key stats: total stations, total owners, unread messages, active notices

2. **Edit Profile**
   - update authenticated user profile data

3. **Membership Fee / Payment**
   - membership fee payment related screens

4. **Manage Owners**
   - unverified owner list
   - verified owner list
   - register new owner

5. **Manage Stations**
   - unverified stations
   - verified stations

6. **Inbox**
   - list contact messages
   - remove/trash messages
   - reply flow currently uses `mailto:` fallback

7. **Manage Committee**
   - central committee management
   - zonal committee management

8. **Multimedia**
   - banners
   - photo gallery
   - video gallery
   - journals / print media gallery
   - popup ads

9. **Membership Form (dashboard view)**

10. **Notices Management**

11. **Downloads Management**

12. **Station Documents**
   - document listing and secure download

13. **Settings**
   - membership fees
   - division
   - district
   - upazila/thana
   - SMS
   - other-businesses route exists in project

---

## API / BFF Design

All Next.js route handlers live under `src/app/api/...` and act as a **BFF/proxy** layer in front of Laravel.

### Main endpoint groups
- Auth: login, register, me, logout, change-password
- Dashboard stats
- Owners and stations (CRUD + verification flows)
- Committees (central / zonal)
- Multimedia (banners, albums, album-images, videos, journals, popups)
- Content (notices, downloadable documents)
- Settings (division, district, upazila)
- Membership and payment records
- Station documents (including secure download proxy)
- Public APIs (`/api/public/...`) for unauthenticated screens

### Important behavior patterns
- Most handlers call backend through `laravelFetch` / `apiFetch`.
- Auth token is read from cookie and attached server-side when needed.
- File uploads (e.g., banner create) are handled via `FormData`.
- `station-documents/download` validates allowed origin before download and forwards auth header when token is available.

---

## Data & State Management

- **Client data fetching:** React Query hooks for queries/mutations and cache invalidation.
- **Optimistic UI pattern:** used in places like inbox delete/trash.
- **Server auth guard:** dashboard layout gate checks token + backend `/me`.
- **Client auth context:** `AuthProvider` exposes `user`, `refresh`, `logout`, `setUser`.

Key utilities:
- `src/lib/http.ts` (`api()` generic request helper)
- `src/lib/http/laravelFetch.ts` (server-side Laravel proxy helper)
- `src/lib/http/apiFetch.ts` (server-side API fetch helper)
- `src/lib/http/url.ts` (absolute URL helper)

---

## Folder Guide

- `src/app/` → App Router pages/layouts
- `src/app/api/` → Next route handlers (BFF/proxy)
- `src/components/` → reusable UI + page sections + dashboard shell
- `src/features/` → feature modules (auth, dashboard domains, etc.)
- `src/lib/` → HTTP/auth/env/shared utilities
- `src/assets/` → source design assets
- `public/` → static assets (fonts, files, images)

---

## Environment Variables

Set these values before running the app:

- `API_BASE_URL` → backend API base for server-side forwarding
- `NEXT_PUBLIC_API_BASE_URL` → public API base used by generic client helpers
- `NEXT_PUBLIC_LARAVEL_ORIGIN` → origin used for media absolute URL resolution and validation
- `NEXT_PUBLIC_DATA_MODE` → `mock` or `api`

---

## Local Development

Install dependencies and run:

```bash
npm install
npm run dev
```

Then open:
- `http://localhost:3000`

Build and run production mode:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

---

## New Developer Quick Onboarding

1. Install dependencies (`npm install`).
2. Configure environment variables.
3. Run the app (`npm run dev`).
4. Verify public routes.
5. Log in and walk through dashboard modules.
6. Review `src/app/api` handlers + `src/features` modules for feature-level behavior.

---

## One-Glance TL;DR

This repository contains a complete public + admin web platform for association operations.  
The admin panel covers owner/station verification, committee and media management, inbox messages, notices/downloads, settings, and profile/payment-related workflows, while Next.js route handlers provide a secure proxy layer to Laravel APIs.

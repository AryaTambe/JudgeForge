# DOGFOOD 2026 — Submission & Judging Portal

A responsive, multi-page hackathon portal built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. It provides separate workspaces for students/participants, judges, organizers, and admins, with a distinct Paper Ops interface rather than a copy of the public DOGFOOD campaign site.

## Run locally

Use Node.js 20.9 or newer and npm 10.9.2.

```bash
npm ci
cp .env.example .env.local
# Set NEXT_PUBLIC_API_BASE_URL to a JudgeForge API origin reachable from this browser.
npm run dev
```

Open `http://localhost:3000`. The Next.js development server binds to `0.0.0.0:3000` for Preview use.

Available checks:

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run build` creates a static site in `out/` (`output: "export"`). Serve that directory with a static web server or the deployment platform; this project intentionally has no `next start` script. Browser-side API requests are made directly to the configured backend origin.

## API and authentication boundary

- `NEXT_PUBLIC_API_BASE_URL` is the browser-reachable JudgeForge API origin. If it is blank, requests use same-origin `/api` paths; a local reverse proxy must route those paths to the backend.
- For a hosted Preview, `127.0.0.1` refers to the Preview environment, not the developer's computer. Use a backend origin accessible from the browser and configure backend CORS for the Preview origin and `Authorization` header.
- Sign-in uses the JudgeForge email/password endpoint, then resolves the user and role from `/api/auth/me`. The JWT is held in tab-scoped `sessionStorage`; the app does not create demo identities or bypass role guards. `/register` is participant-only and submits `{name,email,password}` to the assumed `POST /api/auth/register`; the supplied video did not document that endpoint, so confirm its path, payload and verification flow in the backend OpenAPI spec. Registration does not choose a role or auto-authenticate.
- Client role gates are only a navigation aid. The backend must authorize every private operation and enforce event deadlines, ownership, assignment scope, judging locks, and administrator permissions.
- Some T1/T2 endpoints and response shapes were proposed in the frontend brief/video rather than verified against a live OpenAPI specification. Confirm the current backend contract before using this UI against real event data; errors and missing sections are surfaced instead of being treated as successful empty writes.

## Synthetic data

`NEXT_PUBLIC_FIXTURE_DATA=1` opts into illustrative business records for UI development **only after a real JudgeForge login**. It does not create a user, replace authentication, or contact the backend for those fixture-backed business operations. The public gallery also uses a sanitized subset of the official [shared fixture file](https://dogfoodhack.com/spec/fixtures.json): its records describe `Sample Hack 2026`, not live DOGFOOD 2026 submissions, and are labelled accordingly. Judge identities, scores, and review comments are excluded from the public dataset.

For visual review without a backend, `/preview` and its Student, Judge, Organizer, and Admin pages are separate **public, read-only design mockups** using illustrative Sample Hack 2026 records. They create no session or identity, make no authenticated business API calls, and disable all write actions. They do not open or bypass the real protected workspace routes.

Keep `.env.local` and credentials private; only `.env.example` belongs in Git.

## Pages

- **Public:** `/` event overview, `/projects` public gallery, `/projects/view?id=…` project detail; `/preview` plus `/preview/participant`, `/preview/judge`, `/preview/organizer`, and `/preview/admin` for read-only visual mockups.
- **Account:** `/login`, `/register` (participant sign-up; assumed backend route), `/forbidden`.
- **Student / participant:** `/participant`, `/participant/team`, `/participant/team/create`, `/participant/team/join?token=…`, `/participant/projects`, `/participant/projects/new`, `/participant/projects/edit?id=…`.
- **Judge:** `/judge`, `/judge/assignments`, `/judge/review?id=…`.
- **Organizer:** `/organizer`, event directory/create/edit, projects, teams, judges, assignments, rubric, results, and judging-integrity pages under `/organizer/...`.
- **Admin:** `/admin`, `/admin/users`, `/admin/events`.

`public/manus-routes.json` is the current Webdev route manifest.

## Project map

- `src/app/` — App Router pages, metadata, root layout, and the responsive Paper Ops stylesheet.
- `src/features/auth/` — real backend login, tab session, and role gates.
- `src/features/public/` — public event overview, project gallery, and details.
- `src/features/participant/`, `judge/`, `organizer/`, `admin/` — role-specific screens and workflows.
- `src/components/layout/` and `src/components/ui/` — navigation shells and shared interface components.
- `src/lib/api/` — typed fetch client, endpoint map, response normalizers, and role/domain services.
- `src/lib/session/`, `src/hooks/`, `src/types/` — session helpers, async-resource state, and explicit domain contracts.
- `src/data/` — sanitized public fixtures and opt-in illustrative business data.

The official event/challenge information is available at [dogfoodhack.com/spec](https://dogfoodhack.com/spec/).

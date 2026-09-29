# DOGFOOD 2026 Portal — T1/T2 Frontend Plan

This plan expands the previous public-page v0 into the full T1/T2 front-end requested by the user: “login everything?? student? judge? and all rest of the thing and make different pages for everything and dont copy the dogfood ka ui change the ui of the site”. The chosen UI direction is recorded in `ideas.md`.

## Product outcomes

Build one self-hostable hackathon portal focused on **T1 and T2 only**. Keep public discovery; add separate authenticated workspaces for Participant (labelled Student in the UI), Judge, Organizer, and Admin. The role-specific routes change by current user's role. Frontend route guards improve navigation but are not security boundaries: the backend must enforce authorization and judge-to-judge isolation.

1. **Authentication:** login page and a participant-only sign-up form (`/register`); session persistence; logout; after `GET /api/auth/me`, redirect participants, judges, organizers, and admins to their respective dashboards. Registration never lets a user choose a privileged role; the backend assigns roles. A failed/missing/expired session remains logged out; show unauthorized state when a signed-in role cannot access a route. No frontend demo identity or auth bypass.
2. **Public event and gallery:** work without login; show event name, description, dates, submission deadline, tracks and prizes; searchable public project cards with title, summary, team, track, repository/demo links; loading, empty, error and no-results states. Clearly label the local gallery fixture as `Sample Hack 2026`, not live DOGFOOD submissions.
3. **Participant journey:** dashboard → create/join team → team dashboard → create project → save draft → edit → submit → team page. Show team name, members, invite link and team status. Project fields: title, description, track, repository URL and demo URL. Provide Save Draft/Edit/Submit and clear `DRAFT`, `SUBMITTED`, and `CLOSED` states. After deadline, clearly say edits/submissions are closed; backend is authoritative.
4. **Organizer workspace:** overview of events/projects/teams/judges/judging progress/results; create/edit events and configure dates; manage tracks/prizes; view teams/projects; invite and assign judges; configure rubric; view progress/results; export CSV. Rubric criterion weights validate to 100% before save.
5. **Judge workspace:** show only the current judge's assignments, pending/completed reviews and progress. Review pages include project information, repository/demo links, weighted criteria, score 1–5 and per-criterion feedback/comment, then Submit Evaluation. Never request/display peer scores in the judge UI; server-side authorization is required.
6. **Results and integrity:** rankings, review counts, average scores and completion; show raw/normalized score and rank-before/rank-after only when supplied by the API. Include total/completed/pending reviews, judge distribution, score variance and normalization status. Explain only backend-provided normalization; never invent it.
7. **Admin entry:** a separate admin dashboard and navigation for global event/user/system overview. Add only actions for which the backend has a confirmed route; unsupported mutations remain clearly unavailable rather than simulated as successful.
8. **Visual redesign:** replace the campaign-style one-page UI with the Paper Ops system in `ideas.md`: warm light workspace, dedicated pages, sidebar/account context, clear tables/forms and restrained cobalt. Do not copy the official DOGFOOD site's UI or the previous page composition.
9. **Out of scope:** T3 community voting/comments, hidden voting windows/randomized ballots/anti-abuse; T4 certificates, webhooks, pairwise judging, embeddable gallery and bulk import.
10. **Read-only design previews:** `/preview` and separate Student, Judge, Organizer, and Admin preview pages let visitors inspect representative workspace UI with clearly labelled `Sample Hack 2026` data. These public pages do not create a user/session, do not call authenticated APIs, and contain no enabled mutations. The original role routes remain protected by real backend-verified auth.

## API evidence and unresolved inputs

The user-provided backend video documented JudgeForge at `http://127.0.0.1:8000`, OpenAPI 3.1, JWT Bearer auth, `POST /api/auth/login` with `{email,password}` returning `access_token`/`token_type` (and a nullable `user`), `GET /api/auth/me` returning `id/name/email/role`, and `GET /api/events` returning event records with ISO dates, status, tracks and prizes. It did not show a registration endpoint. The registration page therefore currently assumes participant-only `POST /api/auth/register` with `{name,email,password}`; confirm that path, payload and any verification requirements against current OpenAPI before relying on it. The video also exposed route names for event management, teams, projects, judge invitations/assignments, and health. The user brief separately proposes routes for rubrics, judge scores/progress, results and CSV export; these are proposals, not verified OpenAPI contracts. Invite/join route names differ between the video and proposal.

The captured `127.0.0.1` host is local to the backend developer's machine and is not automatically reachable from the cloud Preview. Do not hardcode it. Use `NEXT_PUBLIC_API_BASE_URL` when an accessible API origin is supplied; an empty value uses same-origin `/api` paths, suitable for a locally reverse-proxied Docker Compose setup. **Cloud Preview strips incoming `Authorization` headers on same-origin requests**, so same-origin `/api` authentication must be tested in the self-hosted reverse-proxy environment; Cloud Preview live auth requires a reachable CORS-enabled backend origin called directly from the browser. CORS/reverse-proxy configuration and exact request/response schemas for team/project mutations, assignments, rubric, scores and results remain unverified.

Implement one typed REST client and centralized endpoint map from video-observed paths plus the user's proposed T1/T2 paths. Normalize snake_case wire fields at the API boundary. Login stores the short-lived bearer token in `sessionStorage`, then resolves the role from `/api/auth/me`; logout attempts the backend route and clears the local session even if the request fails. Every authenticated request uses `Authorization: Bearer …` and `cache: no-store`. Never persist tokens in a public URL or static HTML. Authenticated business-data fixture mode may be enabled explicitly for development only after a real user has completed login and `/api/auth/me` has resolved their actual role. Separately, public `/preview` design mockups use static synthetic records for visual review only; they are not users or sessions, call no authenticated APIs, and disable all mutations.

## Architecture and serving

- Continue the existing Next.js 16.3.6 App Router, React 19, TypeScript and Tailwind 4 project.
- Keep `output: "export"` and Webdev `features.server: false`; the browser UI consumes the user's separately hosted API. No managed database, Manus login provider or cloud account is introduced.
- Use static named route pages; entity detail/editor/review pages use query IDs rather than unbounded dynamic Next.js segments so pages can be exported. Public event/gallery routes remain content-bearing in initial HTML. Authenticated pages are static shells whose private data loads only after session validation.
- Public content may be indexed; authenticated workspaces are `noindex`. Keep private API responses uncached. Do not emit absolute canonical/social URLs until a real production origin is configured.
- Build portable assets into `out/`. Self-hosting serves those assets and proxies `/api/*` to the backend or configures an accessible API origin. Do not claim Cloud Preview can reach a developer's loopback API.
- Keep `public/manus-routes.json` complete and synchronized with source routes.

## Route map

- Public: `/`, `/projects`, `/projects/view`, `/preview`, `/preview/participant`, `/preview/judge`, `/preview/organizer`, `/preview/admin` (read-only synthetic design previews; no auth/session/API writes).
- Auth: `/login`, `/register`, `/forbidden`.
- Participant/Student: `/participant`, `/participant/team`, `/participant/team/create`, `/participant/team/join`, `/participant/projects`, `/participant/projects/new`, `/participant/projects/edit`.
- Judge: `/judge`, `/judge/assignments`, `/judge/review`.
- Organizer: `/organizer`, `/organizer/events`, `/organizer/events/new`, `/organizer/events/edit`, `/organizer/projects`, `/organizer/teams`, `/organizer/judges`, `/organizer/assignments`, `/organizer/rubric`, `/organizer/results`, `/organizer/integrity`.
- Admin: `/admin`, `/admin/users`, `/admin/events`.

Entity IDs and invitation tokens use query parameters on the static routes; credentials and bearer tokens never do.

## Project structure

- `src/app/...` — public, authentication, and individual role routes/layouts.
- `src/components/layout/` — role-aware sidebar, top bar, breadcrumbs and page frame.
- `src/components/ui/` — buttons, fields, status badges, tables, dialogs, and state panels.
- `src/features/auth/` — actual API session, login/logout, role redirects and UX-only route guards.
- `src/features/public/` — event overview and searchable fixture-backed gallery.
- `src/features/participant/`, `judge/`, `organizer/`, `admin/` — role-specific page UI and actions.
- `src/features/organizer/OrganizerResultsPages.tsx` — organizer rankings, progress and integrity pages.
- `src/lib/api/` — endpoint map, typed fetch client, normalizers and API errors.
- `src/data/` — public-safe fixture records and optional synthetic business data; no judge PII/reviews in public bundles.
- `src/types/` — role, event, team, project, rubric, assignment, score, result and API wire types.
- `public/manus-routes.json` — all application routes.

## Verification

Run existing `npm run lint`, `npm run typecheck`, and `npm run build`. Verify the route manifest is valid JSON and matches source routes; inspect generated HTML for public content/metadata, local assets, and absence of private workspace content. Use the existing development Preview and shell HTTP checks. The implemented API normalizers and error mapping remain subject to verification against live backend responses when a reachable API/OpenAPI contract is supplied. Do not claim live API integration, backend authorization, judge-to-judge isolation, deadline enforcement, score calculation, normalization or CSV generation unless real responses establish them. Screenshots/browser click-through are not part of this plan unless requested or a concrete defect is observed.

## Known limitations

No reachable JudgeForge API origin is provided; the video host is `127.0.0.1:8000`. Team, project, invite, assignment, rubric, score, result and CSV payload schemas are not fully confirmed; consult the backend OpenAPI JSON when available. Backend authorization, judge isolation, deadline enforcement, score calculation/normalization and CSV generation cannot be implemented or verified by the frontend alone. Do not publish this version unless the user explicitly asks.


## Source references

- Official event home and public event facts: https://dogfoodhack.com/ (accessed for the event date, online format, free entry, $2,500 pool, and prize breakdown).
- Official specification: https://dogfoodhack.com/spec/DOGFOOD and https://dogfoodhack.com/spec/.
- Anonymous shared fixtures JSON: https://dogfoodhack.com/spec/fixtures.json.
- User's requirements and frontend/API proposal: `/home/ubuntu/upload/pasted_content.txt` and `/home/ubuntu/upload/pasted_content_2.txt`.
- User-provided JudgeForge backend demo video: `/home/ubuntu/upload/WhatsAppVideo2026-09-28at23.51.46(1).mp4`; extracted API evidence is recorded in `/home/ubuntu/dogfood/video_WhatsAppVideo2026-09-28at23.51.46(1)_analysis_20260928_204144.md`.

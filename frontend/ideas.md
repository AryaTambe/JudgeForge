# Design Brief — DOGFOOD T1/T2 Portal

## Design directions considered

- **Paper Ops — 0.08.** A warm, light operations workspace with graphite typography, clear data tables, and one confident blue action color; built for long judging and organizer sessions.
- **Signal Board — 0.06.** A compact high-contrast dark control room with status LEDs and dense activity panels; energetic, but risks feeling too close to the previous dark campaign interface.
- **Field Atlas — 0.04.** A soft editorial directory with generous whitespace, illustrated track markers, and prominent project discovery; strong for browsing, less efficient for judging operations.

## Committed direction: Paper Ops

This is a substantial redesign of the one-page event-marketing preview into a practical, multi-role application. Do **not** reproduce the official DOGFOOD website's campaign layout, its oversized dark hero, its navy/pink treatment, or the previous one-page layout. Preserve the official event name and supplied local mark only as identity cues; the product interface has its own visual system.

- **Design movement:** Contemporary editorial software for event operations: calm, dependable, legible, and task-first.
- **Core principles:** Role clarity before decoration; every high-priority workflow has a dedicated page; metrics are contextual; actions have clear consequences; public discovery and private workspaces are visibly separate.
- **Color philosophy:** Warm paper canvas `#F5F4EF`, white panels `#FFFFFF`, ink `#22252B`, muted slate `#69717B`, hairline `#E4E2DB`, confident cobalt `#4557D6` for primary actions, mint `#3F8B6B` for positive/complete states, amber `#C77B24` for pending, and restrained coral `#C95F52` for errors. No hot-pink-on-midnight campaign palette.
- **Layout paradigm:** A persistent desktop sidebar with a role-labelled workspace switch area, compact top bar with breadcrumbs and account menu, and a responsive content column. Dashboards use measured KPI cards and work queues; editor/review routes use clear single-purpose forms; projects and results use searchable, sortable tables/cards. On narrow screens, the sidebar becomes compact navigation and tables scroll or stack deliberately.
- **Signature elements:** A small section index, subtle ruled dividers, role-colored but text-labelled status chips, rubric-weight bars, completion rails, and a visible “Judging Integrity” explanation panel. Keep these functional, not ornamental.
- **Interaction philosophy:** Predictable standard document scrolling; labelled inputs; keyboard-operable navigation; explicit save/draft/submit states; confirm consequential final submissions; optimistic updates only for reversible operations and always reconcile/rollback on API failure. Backend authorization is authoritative; route guards are UX only.
- **Animation:** Restrained 120–180ms focus, menu, and status transitions. Respect reduced-motion. Do not add Lenis or scroll hijacking to a data-entry/judging interface.
- **Typography system:** System-native sans for headings and readable body copy; system monospace only for IDs, dates, and technical metadata. Strong hierarchy through size and weight rather than oversized promotional display type. No remote fonts.
- **Brand essence and voice:** DOGFOOD remains direct, engineering-led, and open. The product voice is practical and transparent: describe review progress, status, and limitations accurately; do not claim normalization or live API data when unavailable.
- **Wordmark/logo:** Use the existing locally stored official DOGFOOD mark at a modest scale in the product rail and retain the current app icon. Do not add a campaign banner or copy the official site composition.
- **Signature product color:** Cobalt `#4557D6`, distinct from the campaign palette. Green, amber, and coral communicate state, never decoration.

## Asset and content guardrails

Keep the local DOGFOOD mark; no runtime dependency on the official site. Public gallery content must distinguish real DOGFOOD event details from synthetic `Sample Hack 2026` records. Never expose fixture judge identities, scores, or review comments publicly. Do not fabricate real users, credentials, completed backend actions, normalized scores, or production URLs. Synthetic business-data fixtures are clearly labelled and opt-in; they never create a demo identity or bypass real login, session validation, or role checks.

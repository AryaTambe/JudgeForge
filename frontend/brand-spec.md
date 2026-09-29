# Brand Specification — DOGFOOD T1/T2 Portal

## Identity treatment

- Keep the existing official DOGFOOD mark at `public/dogfood-mark.png` and use it at a modest size in the app shell and favicon.
- The portal is a practical product workspace, not a replica of the official DOGFOOD event website. Do not reuse its campaign layout, oversized dark hero, or dark navy/hot-pink visual language.
- Preserve factual event copy and the explicit synthetic-fixture disclosure.

## Product color tokens

| Role | Value | Use |
|---|---|---|
| Warm canvas | `#F5F4EF` | App background |
| Panel | `#FFFFFF` | Cards, forms, tables |
| Ink | `#22252B` | Main text |
| Muted slate | `#69717B` | Secondary text and metadata |
| Hairline | `#E4E2DB` | Borders and dividers |
| Cobalt | `#4557D6` | Primary action and active navigation |
| Mint | `#3F8B6B` | Successful/completed status |
| Amber | `#C77B24` | Pending/review-needed status |
| Coral | `#C95F52` | Error/destructive status |

Colors must remain contrast-compliant for body text, controls, statuses and focus indicators. Every status is communicated with text/icon as well as color.

## Type and motion

- Use system-native sans for headings/body, system-native monospace sparingly for IDs and metadata.
- Avoid remote font loading; retain self-hostable offline operation.
- Use short 120–180ms feedback transitions; respect `prefers-reduced-motion`.
- Avoid Lenis or scroll hijacking in workspaces where users complete long forms and judge reviews.

## Content safety

- DOGFOOD facts: Sep 26–29, 2026; online; free; $2,500 prize pool.
- `src/data/project-fixtures.json` is synthetic `Sample Hack 2026` content, not live DOGFOOD submissions. Label it whenever displayed publicly.
- Never expose fixture judge emails, scores or review comments in public routes.
- Never claim real authentication or role security unless backed by the API. Frontend guards are navigation UX only; the backend must enforce permissions.

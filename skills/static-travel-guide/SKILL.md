---
name: static-travel-guide
description: >-
  Builds and maintains static travel-guide websites: day itineraries, Leaflet map
  pins, reservation flags, dual-currency budgets, localStorage + JSON export, GitHub
  Pages deploy. Use when the user wants a travel guide / itinerary site, 行程库-style
  page, trip planner without a backend, or to extend an existing vanilla HTML travel
  guide (add trip, budget, stops, photos, mobile Maps behavior).
---

# Static travel guide

Reusable pattern for a **no-backend** trip planner that runs as static files on GitHub Pages.

Reference implementation (optional to clone): https://github.com/aladdin0306/travel-guides

## Goals

- One HTML entry + CSS + JS (+ optional seed data / photos)
- Trips persist in `localStorage`; share via export/import JSON
- Map shows stop pins (mobile: open Maps per pin / pin sheet — avoid forcing day driving routes)
- Surface **overview → budget → days**; mark must-book items clearly
- Dual currency: local (e.g. AUD/JPY) + approximate CNY (or user’s home currency)

## Default stack

| Piece | Choice |
|-------|--------|
| UI | Vanilla HTML/CSS/JS |
| Map | Leaflet + OSM tiles |
| Hosting | GitHub Pages |
| Persistence | `localStorage` + export/import |
| Photos | Optional static files + credit metadata |

Do **not** introduce React/Vue/Next unless the user asks.

## Project layout (convention)

```text
travel-guides/           # or any site root
├── index.html
├── styles.css
├── app.js               # render, map, storage, editors
├── data.js              # SEED_TRIPS + photo credits (optional)
├── photos/              # optional
└── README.md
```

Bump cache-bust query (`styles.css?v=N`) when shipping CSS/JS to Pages.

## Workflows

### A. Scaffold a new site

1. Create the layout above.
2. Seed one sample trip using the schema in [reference.md](reference.md).
3. Implement: trip list, trip overview, budget summary, day tabs, stop list, Leaflet map, export/import.
4. Add `README` with local `python3 -m http.server` and Pages notes.
5. Init git → push → enable GitHub Pages from `main` / root (or `/docs`).

### B. Add or edit a trip (existing site)

1. Find seed data (`data.js` / `SEED_TRIPS`) or instruct user that UI-only edits stay in their browser until export.
2. Fill trip meta, `budget`, `days[]`, `items[]` per [reference.md](reference.md).
3. Verify: map pins, 必订/建议订 flags, budget totals, mobile pin behavior.
4. Commit & push only when the user asks.

### C. Budget

- Trip-level: `currency`, party note, FX rate, `extras[]`, optional `origins[]` (e.g. fly from city A vs B).
- Stop-level: `cost.amount` + category; support `optional` costs excluded from totals.
- UI: show per-person (or stated party) total early; category breakdown default-visible or one click away.

### D. Maps & booking

- Prefer `lat`/`lng` + name/address for pins and Google/Apple Maps deep links.
- `reservation`: `none` | `recommended` | `required` + optional `bookingUrl`.
- On narrow screens, multi-stop “directions” routes are often wrong — use per-stop open / a pin picker sheet.

## UX principles

1. Clear modules: overview, budget, itinerary (and booking alerts).
2. Budget near the top, not only after scrolling the whole plan.
3. Hand-curated stops; no fake “AI scoring” unless requested.
4. Keep copy in the user’s language (often zh-CN for 行程库-style sites).

## Examples

See [examples.md](examples.md). Full field list: [reference.md](reference.md).

---
name: static-travel-guide
description: >-
  Generates a mobile-friendly static travel-guide website matching the 行程库
  reference app: photos, booking/official links, Google Maps pins, budget,
  reservations, localStorage export. Use when the user wants their own trip
  webpage like aladdin0306.github.io/travel-guides, or installs this skill to
  produce a full frontend site (not JSON-only).
---

# Static travel guide（产出 = 同款网页）

## Primary deliverable

**Always produce a working frontend site** the user can open on phone and desktop — same product shape as:

https://aladdin0306.github.io/travel-guides/

Not JSON-only (JSON may accompany the site). Not the old green Signal experiment as the product UI.

### Must include (parity checklist)

- [ ] Day-by-day itinerary UI (trip list + day detail)
- [ ] **Photos** on stops when available (`photos/` + `PHOTOS` credits)
- [ ] **Booking / official links** (`bookingUrl`, reservation flags)
- [ ] **Map pins** (Leaflet); mobile: per-stop Google Maps / pin sheet — no forced day driving route
- [ ] Budget (local currency + optional CNY), origins if relevant
- [ ] Import / export JSON; `localStorage` persistence
- [ ] Responsive layout (usable on phone)

## How to build the site

1. **Copy the bundled template** from this skill repo:
   - `template/` (canonical) or `demo/` (Australia-seeded live sample of the same app)
2. Or clone https://github.com/aladdin0306/travel-guides.git and replace seed data.
3. Replace `data.js` → `window.SEED_TRIPS` with **the user’s** trip(s).
4. Add images under `photos/{id}.jpg` and register each id in `PHOTOS` (credit + Wikimedia filename when applicable).
5. Fill every stop that needs it: `lat`/`lng`, `bookingUrl`, `reservation`, `cost`, `note`, `photo`.
6. Preview: `python3 -m http.server 8766 --bind 0.0.0.0` — open from phone on same network.
7. Deploy to **user’s** GitHub Pages when they ask (do not overwrite the reference repo unless they own it and ask).

Core files: `index.html`, `styles.css`, `app.js`, `data.js`, `photos/`.

Bump `?v=` on CSS/JS in `index.html` when shipping asset changes.

## Generate-my-trip workflow

```text
- [ ] Collect destination, dates, party, departure, currency, known bookings
- [ ] Curate days/stops (season, transit, quieter picks when possible)
- [ ] Copy template/ → new folder or repo
- [ ] Write SEED_TRIPS + PHOTOS; download/compress photos
- [ ] Verify on desktop + narrow viewport: map pins, 去预约 links, images
- [ ] Push Pages if requested
```

Interview only for missing info. Schema: [reference.md](reference.md).

## Demo vs user’s site

| Path | Role |
|------|------|
| Skill `demo/` / `template/` | Same **app** as 行程库; demo ships with Australia seed + photos |
| https://aladdin0306.github.io/travel-guides/ | Author’s live multi-trip site (reference) |
| Site you generate | **User’s** trips inside this same frontend |

## Don’t

- Don’t ship “JSON only” when the user asked for a webpage  
- Don’t use the green Signal mock as the final product UI  
- Don’t skip photos/booking/maps if the stop has data for them  
- Don’t force Australia when the user named another destination  

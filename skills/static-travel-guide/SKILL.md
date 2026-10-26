---
name: static-travel-guide
description: >-
  Helps anyone generate their own travel itinerary and optionally a static
  travel-guide website (days, map pins, booking flags, dual-currency budget,
  localStorage / JSON, GitHub Pages). Use when the user wants a custom trip
  plan, 行程/攻略/线路, itinerary JSON, or a no-backend travel site. Includes an
  Australia demo as the reference sample — not the only destination.
---

# Static travel guide

**Primary job:** help **any user** generate **their own** trip (destination, dates, stops, budget, bookings).  
The bundled Australia demo is only a **sample** of shape and quality — never force Australia unless they ask.

Reference demo (open locally or on Pages if published): `demo/` in this skill repo.  
Live reference site: https://aladdin0306.github.io/travel-guides/

## Who this is for

| User says… | You do… |
|------------|---------|
| “帮我规划一趟日本/欧洲/…” | Interview → produce trip JSON (+ optional HTML site) for **their** trip |
| “按这个 skill 生成线路” | Same; use schema in [reference.md](reference.md) |
| “看 demo / 澳洲示例” | Point to `demo/` or summarize that sample |
| “搭一个 GitHub Pages 行程站” | Scaffold site, seed with **their** first trip (demo only if they want a placeholder) |

## Generate-my-trip workflow (default)

Copy and track:

```text
- [ ] 1. Collect: destination(s), dates, party size, departure city, budget currency, pace
- [ ] 2. Draft days + stops (time, kind, name, lat/lng or address, reservation, cost, note)
- [ ] 3. Fill budget (party, FX if needed, extras, optional origins)
- [ ] 4. Output: trip object JSON and/or drop into data.js / a new site
- [ ] 5. Preview locally; map pins + 必订 items + budget totals
- [ ] 6. Push / Pages only if the user asks
```

### Interview (ask only what’s missing)

1. Where / which cities, and rough days per city  
2. Start–end dates (or month + length)  
3. Who’s going; shared room?  
4. Fly from where; open-jaw OK?  
5. Currency for local costs; home currency for FX (e.g. CNY)  
6. Must-book items they already know (flights, hotels, popular restaurants)

Then **curate** stops (local/quiet when possible; respect season and transit). Do not invent a fake scoring model.

### Output quality bar

- Clear modules: **overview → budget → days**
- Budget early; dual currency when FX is known
- `reservation`: `none` | `recommended` | `required` + links when useful
- Map: real coords; on mobile prefer **per-stop pins**, not one driving route for the whole day

Schema: [reference.md](reference.md). Prompts/samples: [examples.md](examples.md).

## Australia demo (sample only)

Path: `demo/index.html` + `demo/australia-trip.js`  
Serve from skill repo root or `demo/`:

```bash
cd demo && python3 -m http.server 8767 --bind 127.0.0.1
# open http://127.0.0.1:8767/
```

Use it to show structure. When generating for a user, **replace** with their destination.

## Optional: scaffold a full site

Vanilla HTML/CSS/JS + Leaflet + `localStorage` + export/import. Layout:

```text
site/
├── index.html
├── styles.css
├── app.js
├── data.js          # SEED_TRIPS = [ theirTrip ]
└── photos/          # optional
```

Do not add React/Vue/Next unless asked. Prefer GitHub Pages for hosting.

## Don’t

- Don’t assume every user wants the Australia sample as their trip  
- Don’t put secrets in the repo  
- Don’t require a backend for the default pattern  

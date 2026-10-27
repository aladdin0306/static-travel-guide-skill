---
name: static-travel-guide
description: >-
  After the user installs this skill and describes a trip, automatically builds
  a mobile webpage like 行程库: copy template, write data.js, serve, and open the
  site. Photos, booking links, Google Maps pins, budget. Use when they want their
  own travel guide page, not JSON-only.
---

# Static travel guide

## User experience (what they should feel)

1. Install this skill once.  
2. Say their trip + preferences in chat (destination, dates, party, budget, pace…).  
3. **You** do the rest — they do **not** manually copy folders or edit `data.js`.  
4. You return a **frontend webpage** they can open (local URL; phone on same Wi‑Fi; Pages if they ask).

Never stop at “here is JSON, paste it into data.js yourself.”

## Agent must-do pipeline (every time)

```text
- [ ] 1. Ask only for missing trip facts / preferences
- [ ] 2. Create a new site folder by copying the skill template
- [ ] 3. Write complete data.js (SEED_TRIPS + PHOTOS) into that folder
- [ ] 4. Add photos under photos/ when possible (with credits)
- [ ] 5. Start a local static server
- [ ] 6. Open / give the user the URL (and say phone can use LAN IP)
- [ ] 7. Deploy to their GitHub Pages only if they ask
```

### Step 2 — copy template (you run this)

From the skill repo root (cloned or known path), prefer:

```bash
bash scripts/new-site.sh /absolute/path/to/OUTPUT_SITE
```

Or: `cp -R template OUTPUT_SITE`  
(`demo/` is the same app with Australia sample — use `template/` for new users.)

If the skill was installed without the repo, clone first:

```bash
git clone https://github.com/aladdin0306/static-travel-guide-skill.git
bash static-travel-guide-skill/scripts/new-site.sh /path/to/OUTPUT_SITE
```

### Step 3 — write `OUTPUT_SITE/data.js` yourself

Generate full `window.SEED_TRIPS` for **their** trip. Include:

- `bookingUrl` + `reservation` for bookable stops  
- `lat` / `lng` for map + Google pins  
- `cost`, `note`, optional `photo`  
- `budget` (currency, extras, origins, FX if known)  

Schema: [reference.md](reference.md).

### Step 5–6 — serve and hand them the page

```bash
cd OUTPUT_SITE && python3 -m http.server 8766 --bind 0.0.0.0
```

Tell the user:

- Computer: `http://127.0.0.1:8766/`  
- Phone (same Wi‑Fi): `http://<LAN-IP>:8766/`  

Open the URL in the browser when you can.

## Product parity

Same frontend as https://aladdin0306.github.io/travel-guides/ :

- Day itinerary, photos, booking/official links  
- Leaflet + mobile per-stop Google Maps (not forced day driving routes)  
- Budget, import/export, mobile layout  

## Don’t

- Don’t ask the user to “复制模板改 data.js”  
- Don’t deliver JSON-only when they want a webpage  
- Don’t use Australia unless they asked for that sample / that destination  

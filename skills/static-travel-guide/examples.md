# Examples

## 「给我做一个和行程库一样的网页，行程是××」

1. Copy `template/` (or `demo/`) to a new folder / repo.  
2. Replace `SEED_TRIPS` with the user’s trip.  
3. Add `photos/` + `PHOTOS`, `bookingUrl`, `lat`/`lng`.  
4. `python3 -m http.server` — verify on phone.  
5. Push to the user’s Pages if asked.

Deliverable = the folder that opens in a browser, not JSON alone.

## 「先看 demo」

Open skill `demo/` (same UI as 行程库, Australia seed) or  
https://aladdin0306.github.io/static-travel-guide-skill/demo/

## 「只要 JSON」

Only if the user explicitly wants data-only. Prefer offering the full site anyway.

## Minimal new trip inside the template

Keep `app.js` / `styles.css` / `index.html` unchanged. Edit `data.js`:

```js
window.SEED_TRIPS = [
  {
    id: "user-trip",
    title: "用户的目的地",
    start: "2027-06-01",
    end: "2027-06-05",
    summary: "…",
    budget: { currency: "JPY", party: "两人", cnyRate: 0.05, rateDate: "2026-10-01", extras: [], origins: [] },
    days: [ /* … with bookingUrl, lat, lng, photo, reservation … */ ]
  }
];
```

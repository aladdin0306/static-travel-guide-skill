# Schema reference

## Trip

```js
{
  id: "slug",
  title: "Display title",
  start: "YYYY-MM-DD",
  end: "YYYY-MM-DD",
  summary: "Short narrative",
  budget: { /* Budget */ },
  days: [ /* Day */ ]
}
```

## Budget

| Field | Type | Notes |
|-------|------|--------|
| `currency` | string | e.g. `AUD`, `JPY`, `EUR` |
| `party` | string | Who the totals assume |
| `basis` | string | How prices were estimated |
| `cnyRate` | number | Optional home-currency rate (name can be adapted) |
| `rateDate` | string | When rate was checked |
| `extras[]` | array | Trip-level costs not tied to a stop |
| `origins[]` | array | Alternate departure packages |

**Extra / origin row:** `{ id?, label, cat?, amount?, cny?, note?, brief?, adjust? }`

**Categories (`cat`):** `flight` | `stay` | `transport` | `sight` | `food` | `other` (extend if needed; keep UI labels in sync).

## Day

```js
{
  id: "d1",
  date: "YYYY-MM-DD",
  city: "City",
  title: "One-line day title",
  items: [ /* Stop */ ]
}
```

## Stop (`items[]`)

| Field | Notes |
|-------|--------|
| `id` | Unique in trip |
| `time` | Display string |
| `kind` | `sight` \| `food` \| `transport` \| `stay` |
| `name` | Required |
| `address` | For search / Maps |
| `lat`, `lng` | Map pin |
| `reservation` | `none` \| `recommended` \| `required` |
| `reservationNote` | Why / how |
| `bookingUrl` | External link |
| `cost` | `{ amount, note, cat?, optional? }` |
| `note` | Directions / tips |
| `photo` | Optional asset id |

## Photos (optional)

```js
PHOTOS[id] = ["Credit · License", "OriginalFilenameOnCommons.jpg"]
// → { src: `photos/${id}.jpg`, credit, link }
```

Respect third-party licenses; do not claim MIT on Wikimedia assets.

## Storage (suggested)

- Key e.g. `travel-guides-v2`
- Value: `{ trips, activeId, … }`
- First visit: clone seed trips; later: prefer saved state
- Export downloads JSON; import replaces or merges (document which)

## GitHub Pages checklist

- [ ] Site works via `python3 -m http.server` (or Pages URL)
- [ ] No secrets in repo
- [ ] Asset cache-bust updated if needed
- [ ] README documents import/export (data is per-browser)

# Schema & Sharing Reference

## Trip

```js
{
  id: "slug",
  title: "Display title",
  start: "YYYY-MM-DD",
  end: "YYYY-MM-DD",
  summary: "",
  visa: { /* VisaPrep — international trips */ },
  budget: { /* Budget */ },
  days: [ /* Day */ ]
}
```

> Leave `summary` as `""` — the trip header displays only the cover photo gallery, date range, title, and city hops without long intro paragraphs.

## VisaPrep (`visa`)

Shown as a collapsible「签证准备」block under the booking banner. Omit for pure domestic China trips, or set `status: "not_needed"`.

| Field | Type | Notes |
|-------|------|--------|
| `status` | string | `required` \| `visa_free` \| `on_arrival` \| `eta` \| `already_have` \| `not_needed` |
| `passport` | string | Nationality label only, e.g. `中国大陆护照` — **never** a passport number |
| `type` | string | Visa product name, e.g. `Visitor visa (subclass 600) · Tourist stream` |
| `applyUrl` | string | Official online application / ImmiAccount HTTPS link |
| `guideUrl` | string | Official policy / visa listing HTTPS page |
| `feeNote` | string | Fee estimate + “以官网为准” |
| `timeline` | string | When to apply, e.g. `建议出发前 6–8 周递交` |
| `docs[]` | array | Checklist rows: `{ id, label, note? }` |
| `tips[]` | array | Short practical reminders (no personal data) |
| `disclaimer` | string | One-line “not visa advice / follow official site” note |

Example:

```js
visa: {
  status: "required",
  passport: "中国大陆护照",
  type: "Visitor visa (subclass 600) · Tourist stream",
  applyUrl: "https://online.immi.gov.au/lusc/login",
  guideUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
  feeNote: "约 A$250/人（以官网实时费用为准）",
  timeline: "建议出发前 6–8 周递交；旺季更早",
  docs: [
    { id: "passport", label: "护照有效期覆盖行程", note: "建议剩余有效期 6 个月以上" },
    { id: "photo", label: "签证用近照" },
    { id: "itinerary", label: "行程与酒店预订单", note: "可用本页「打印 / 导出 PDF 路书」" },
    { id: "funds", label: "资金证明", note: "近几个月银行流水等" },
    { id: "employment", label: "在职或学生证明" }
  ],
  tips: [
    "填表信息与护照、材料保持一致",
    "不要把护照号、签证申请号写进本页或云端共享"
  ],
  disclaimer: "政策、费用与审理时间以移民局官网为准；本页只作出行准备清单，不构成签证代理或获批承诺。"
}
```

Checklist tick state lives in the browser only (`visaChecks` inside local storage) and is not uploaded to the cloud.

## Budget

| Field | Type | Notes |
|-------|------|--------|
| `currency` | string | e.g. `AUD`, `JPY`, `EUR` |
| `party` | string | Who the totals assume (e.g. `两人同住一间`) |
| `basis` | string | How prices were estimated |
| `cnyRate` | number | Optional home-currency conversion rate |
| `rateDate` | string | When rate was checked |
| `extras[]` | array | Trip-level costs not tied to a single stop |
| `origins[]` | array | Alternate departure city packages |

**Extra / origin row:** `{ id?, label, cat?, amount?, cny?, note?, brief?, adjust? }`

**Categories (`cat`):** `flight` | `stay` | `transport` | `sight` | `food` | `other`.

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

> By default, the UI displays **all days** (`dayFilter = "all"`) with a sticky day-chip bar so users can either scroll through the entire trip or filter a single day (with previous/next day pager buttons at the bottom).

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
| `bookingUrl` | External `https://` link |
| `cost` | `{ amount, note, cat?, optional? }` |
| `note` | Directions / tips |
| `photo` | Optional `{ src, credit, link }` (or `photo("id")`) |

## Photos

```js
PHOTOS[id] = ["Credit · License", "OriginalFilenameOnCommons.jpg"]
// → { src: `photos/${id}.jpg`, credit, link }
```

In the online editor, click **「自动搜图」** to query Wikimedia Commons, or paste a Wikimedia / this site's `/api/img` URL. Arbitrary external image hosts are not stored in the shared cloud. Respect third-party licenses. Local preview can still show other `https://` images.

## Local Storage

- Key: `travel-guides-v2`
- Value: `{ trips, booked, tripId, origin }`
- Export downloads JSON; import restores trips and booked states.

## Cloud Shared Storage & Collaborative Editing

The Cloudflare Worker + D1 service (`worker/`) stores portable payloads:

```json
{
  "trip": { "id": "kyoto-2027", "title": "京都 5 日休闲游", "days": [] },
  "booked": {}
}
```

### Routes & Capabilities

- **Public read-only route (`/t/:id`)**:
  - Hides left trip-list rail and all edit controls.
  - Worker dynamically injects `<title>`, `og:title`, `og:description`, and `og:image` for rich link cards in WeChat, Feishu/Lark, iMessage, etc.
  - Top bar shows **「复制并修改」** (Fork), cloning the trip via `POST /api/trips` and redirecting the viewer to their own editable copy.
- **Secret edit route (`/t/:id/edit#token=...`)**:
  - Reads `#token` from URL fragment (never sent in HTTP page requests) and sends `Authorization: Bearer <token>` on API calls.
  - D1 stores only the SHA-256 hash of `token`.
  - Edits (renaming, adding/editing/deleting stops, moving stops up/down, toggling booked status, searching Commons photos) auto-save via `PUT /api/trips/:id` with optimistic concurrency (`expectedRevision`).
  - On `409 REVISION_CONFLICT`, top bar offers a one-click **「加载最新内容」** button.
  - Share modal provides **recent 10 revisions** (`GET /api/trips/:id/revisions`, `POST /api/trips/:id/restore`), **edit-key rotation** (`POST /api/trips/:id/rotate-token`), and **permanent delete** (`DELETE /api/trips/:id`, which also removes `revisions`).
  - Public `/t/*` responses send `X-Robots-Tag: noindex, nofollow`.
  - Stored JSON is field-whitelisted. `photo.src` may only be a local `photos/*.jpg`, a Wikimedia URL, or this service's `/api/img`. Payload cap is 100 KB.
  - Daily Scheduled Cron (`crons = ["17 19 * * *"]`) purges inactive sandbox trips older than 90 days (`TRIP_TTL_DAYS`, sparing `PINNED_TRIP_IDS`) and expired `creation_limits` rate-limit buckets.
- **Publishing (`scripts/publish-site.sh`)**:
  - Automatically converts local `photos/*.jpg` Commons assets into public `https://commons.wikimedia.org/wiki/Special:Redirect/file/...` URLs before uploading.

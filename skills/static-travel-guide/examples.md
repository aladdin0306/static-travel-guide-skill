# Examples

## Anyone: “帮我生成一趟自己的线路”

User is not asking for the Australia demo — generate **their** trip.

1. Ask missing constraints (place, dates, party, departure, currency).
2. Build one trip object per [reference.md](reference.md).
3. Deliver JSON (and optionally wire into `data.js` / a new Pages site).
4. Mention they can open this skill’s `demo/` to see an Australia **sample** of the same shape.

## “先看 skill 里的 demo”

Point to `demo/index.html` (澳洲开口程示例：悉尼 → 圣灵群岛 → 墨尔本).  
Serve with `python3 -m http.server` from `demo/`.

## “做一个能放 GitHub Pages 的行程站，先用我的日本行程”

1. Scaffold vanilla site.
2. Seed `SEED_TRIPS` with **their Japan trip**, not Australia.
3. Australia demo stays in the skill repo as reference only.

## Australia sample shape (abbreviated)

Full object: `demo/australia-trip.js` (`window.DEMO_TRIP`).

```js
{
  id: "australia-2027",
  title: "澳洲",
  start: "2027-04-29",
  end: "2027-05-05",
  budget: { currency: "AUD", party: "两人同住一间", cnyRate: 4.68, origins: [/* 北京/上海 */], extras: [/* ... */] },
  days: [ /* 悉尼 → 圣灵群岛 → 墨尔本 */ ]
}
```

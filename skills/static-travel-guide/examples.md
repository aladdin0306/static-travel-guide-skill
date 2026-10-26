# Examples

## User: “帮我做一个能放 GitHub Pages 的行程站”

1. Scaffold `index.html` / `styles.css` / `app.js` / `data.js`.
2. One seed trip (3–5 days) with map coords and one `required` booking.
3. Budget block near top; day list below.
4. README: local server + Pages enable steps.
5. Ask whether to `git init` / create GitHub repo / push.

## User: “给现有站点加一趟北海道”

1. Open their `data.js` (or equivalent seed).
2. Append a trip with `currency: "JPY"`, days, ANA-style transport stops if relevant.
3. Fill `budget.origins` / `extras` (visa, eSIM, meals).
4. Local preview; push only if asked.

## User: “手机上不要一天一条导航路线”

1. Detect narrow viewport.
2. For multi-stop days, open a pin list / sheet; each row opens Maps for that place.
3. Keep desktop day-route optional if already implemented.

## Minimal seed trip

```js
{
  id: "demo-weekend",
  title: "示例周末",
  start: "2027-04-01",
  end: "2027-04-02",
  summary: "两天示例，用来验证地图和预算。",
  budget: {
    currency: "JPY",
    party: "一人",
    cnyRate: 0.05,
    rateDate: "2026-01-01",
    extras: [],
    origins: []
  },
  days: [
    {
      id: "d1",
      date: "2027-04-01",
      city: "东京",
      title: "抵达",
      items: [
        {
          id: "d1-arrive",
          time: "15:00",
          kind: "transport",
          name: "成田机场",
          address: "Narita Airport",
          lat: 35.772,
          lng: 140.3929,
          reservation: "none",
          cost: { amount: 0, note: "" },
          note: "坐京成或 JR 进城。"
        }
      ]
    }
  ]
}
```

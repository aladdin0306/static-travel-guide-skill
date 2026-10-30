# Examples

## Happy path — first message is incomplete

User: 「帮我做一趟日本网页。」

Agent:

1. Ask in one batch: departure, destination, pace, must-go sights, budget, dates, party.
2. User answers: 「上海，京都，休闲游，伏见稻荷必去，每人 1 万含机票，4 月 10–14 日，两人一间房。」
3. Confirm constraints in a short summary.
4. `bash scripts/new-site.sh ~/Sites/kyoto-2027`
5. Write `data.js` with bookings + coords.
6. `bash scripts/fetch-place-photo.sh …` for major sights (retries + placeholder).
7. `bash scripts/serve.sh ~/Sites/kyoto-2027 8766`
8. Reply with `http://127.0.0.1:8766/` (+ phone tip).
9. Tick acceptance checklist.

## Multiple departure cities

User: 「上海或北京都可以。」

Agent keeps both in `budget.origins[]`. The generated budget block shows an interactive 上海 / 北京 selector; switching it changes flight estimate, total, and route note.

## Wrong — don’t do this

「站点已生成，在 `/Users/…/kyoto-2027`，请自行 `python3 -m http.server` 并改 data.js。」

## Photos

```bash
bash scripts/fetch-place-photo.sh ~/Sites/kyoto-2027 kyo-fushimi "Fushimi Inari Kyoto"
# paste PHOTOS line into data.js; photo: photo("kyo-fushimi")
```

Almost always writes a jpg (Commons or placeholder). Omit `photo` only if exit ≠ 0.

## Sync template from upstream

```bash
bash scripts/sync-template.sh
```

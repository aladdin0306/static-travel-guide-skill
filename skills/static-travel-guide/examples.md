# Examples

## Happy path — user only talks

User: 「帮我做一趟京都 4 天网页，两人，轻松点，上海出发。」

Agent:

1. Ask diet / budget if needed.  
2. `bash scripts/new-site.sh ~/Sites/kyoto-2027`  
3. Write `data.js` with bookings + coords.  
4. `bash scripts/fetch-place-photo.sh …` for major sights (retries + placeholder).  
5. `bash scripts/serve.sh ~/Sites/kyoto-2027 8766`  
6. Reply with `http://127.0.0.1:8766/` (+ phone tip).  
7. Tick acceptance checklist.

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

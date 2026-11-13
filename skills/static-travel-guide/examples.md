# Examples

## Happy path — first message is incomplete

User: 「帮我做一趟日本网页，做好后我要发给朋友一起看和改。」

Agent:

1. Ask in one batch: departure, destination, pace, must-go sights, budget, dates, party.
2. User answers: 「上海或北京，京都，休闲游，伏见稻荷必去，每人 1 万含机票，4 月 10–14 日，两人一间房。」
3. Confirm constraints in a short summary (keeping both 上海 and 北京 in `origins`).
4. `bash scripts/new-site.sh ~/Sites/kyoto-2027`
5. Write `data.js` with multi-origin budget, bookings, and coordinates.
6. `bash scripts/fetch-place-photo.sh …` for major sights (retries + placeholder fallback).
7. `bash scripts/serve.sh ~/Sites/kyoto-2027 8766` (run in background).
8. Publish:
   - If the user has `gh` logged in and wants a permanent static URL on their own domain: `bash scripts/publish-gh-pages.sh ~/Sites/kyoto-2027` (`https://<user>.github.io/travel-guides/kyoto-2027/`).
   - Because this user asked to edit with friends online: run `bash scripts/publish-site.sh ~/Sites/kyoto-2027` (uses `~/.config/static-travel-guide/api` if configured via `setup-cloud.sh`, otherwise publishes to the 90-day public demo sandbox).
   - Optionally generate `bash scripts/bundle-single.sh ~/Sites/kyoto-2027` for offline phone sharing.
9. Reply with:
   - **永久静态链接**（若已发到用户自己的 GitHub Pages）或 **公开查看链接**（公网 HTTPS，任何手机 4G/5G/任意 Wi‑Fi 可直接打开）
   - **私密编辑链接**（公网 HTTPS，仅自己和同伴保留，支持在线改行程、上下移动站点、自动搜图、恢复最近 10 版、重置密钥、彻底删除）
   - **本地预览 / 离线单文件**（`http://127.0.0.1:8766/` 与 `*-offline.html`）
10. Tick acceptance checklist.

## Multiple departure cities

User: 「上海或北京都可以。」

Agent keeps both in `budget.origins[]`. The generated budget block shows an interactive 上海 / 北京 selector; switching it changes flight estimate, total, and route note.

## Wrong — don’t do this

- Wrong: 「站点已生成，在 `/Users/…/kyoto-2027`，请自行 `python3 -m http.server` 并改 data.js。」
- Wrong: Asking the user to register Cloudflare / Supabase before they can share a link (the default service is already hosted and ready).
- Wrong: Pasting the private `#token=...` edit URL into a public GitHub issue or public README. Only share the `/t/:id` public URL publicly.

## Photos

```bash
bash scripts/fetch-place-photo.sh ~/Sites/kyoto-2027 kyo-fushimi "Fushimi Inari Kyoto"
# paste PHOTOS line into data.js; photo: photo("kyo-fushimi")
```

Almost always writes a jpg (Commons or placeholder). Omit `photo` only if exit ≠ 0.

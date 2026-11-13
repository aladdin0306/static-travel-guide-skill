---
name: static-travel-guide
description: >-
  After the user installs this skill and describes a trip, interviews missing
  constraints first, automatically builds a mobile webpage like 行程库 (budget
  ledger, photos, booking links, Google/Leaflet map pins), serves locally, and
  publishes to cloud sharing to return both a public view URL and a private
  collaborative edit URL. Use for custom travel guide webpages.
---

# Static travel guide

## User experience

1. Install once → describe trip + preferences in chat.
2. **Interview first** if key constraints are missing, then confirm in one short summary.
3. **You** build and publish the site — user never copies folders, edits `data.js`, or configures servers.
4. You **must** return openable **URLs** (putting the cloud public & edit links first as ready on any phone/network):
   - Online **Public View URL** (`https://.../t/:id` — works on any phone over cellular or any Wi‑Fi, read-only, OpenGraph preview card, supports one-click Fork「复制并修改」)
   - Online **Private Edit URL** (`https://.../t/:id/edit#token=...` — works on any device, autosave, stop reordering, online Commons photo search, 20-version history restore, edit token reset, conflict reload)
   - Local **Preview URL** (`http://127.0.0.1:PORT/`, optional same-machine/offline backup)
   Never end with only a folder path.

## Mandatory intake — ask before planning

Do not start selecting sights or writing `data.js` until these are known:

1. **出发地**：城市 / 机场；可填多个（如“上海或北京”）
2. **目的地**：国家 / 城市；不确定时可让 Agent 推荐城市组合
3. **旅行节奏**：
   - `休闲游`：每天 1–2 个核心地点，留午休 / 咖啡 / 自由时间
   - `均衡游`：每天 2–3 个核心地点，兼顾效率与体验
   - `特种兵`：每天 3–5 个地点，早出晚归，接受频繁换乘
4. **必须去的景点**：自由填写；没有就明确答“没有”
5. **预算范围**：金额、币种、按人还是总计、是否含国际机票
6. **日期 / 天数**：具体日期，或月份 + 总天数
7. **同行人数**：成人 / 儿童、房间安排

Also ask only when relevant: diet, accessibility, shopping, hiking, nightlife, hotel level, open-jaw flights.

### Interaction rule

- Prefer one structured multi-question form when the client supports it; otherwise ask the missing items in one concise chat message.
- Do not make the user answer fields already stated.
- After answers, send a short confirmation summary before planning:

```text
我会按以下条件规划：
出发：上海 / 北京
目的地：京都
节奏：休闲游
必去：伏见稻荷、清水寺
预算：每人 ¥8,000–12,000，含机票
日期/人数：4月10–14日，2位成人同住一间
```

Then proceed without another approval round unless constraints conflict.

Detailed question wording: [intake.md](intake.md).

### How departure cities map to the webpage

- One departure city → create one `budget.origins[]` entry.
- Multiple possible cities → create one entry per city and show the interactive departure selector in the budget block.
- Each origin must have its own flight estimate, route note, and any budget adjustment.
- If the user says “上海或北京都可以”, keep **both**; do not silently choose one.

## Agent pipeline (every time)

```text
- [ ] 1. Interview (checklist above) + send confirmation summary
- [ ] 2. bash scripts/new-site.sh /abs/OUTPUT_SITE
- [ ] 3. Write OUTPUT_SITE/data.js (full SEED_TRIPS)
- [ ] 4. Photos: Commons → photos/ + PHOTOS credits (or 暂无图, no broken imgs)
- [ ] 5. bash scripts/serve.sh /abs/OUTPUT_SITE [port]
- [ ] 6. Publish: bash scripts/publish-site.sh /abs/OUTPUT_SITE
- [ ] 7. Give user Public URL + Private Edit URL + Local Desktop/Phone URLs
- [ ] 8. Run acceptance checklist
```

Clone skill repo if scripts/template missing:

`git clone https://github.com/aladdin0306/static-travel-guide-skill.git`

### Photos (required practice — with fallbacks)

Prefer this helper (search → retries on 503 → alternate Commons hits → solid placeholder JPG):

```bash
bash scripts/fetch-place-photo.sh OUTPUT_SITE PHOTO_ID "Fushimi Inari Kyoto"
# optional 4th arg: exact Commons file name if you already know it
```

Exact-file entry still works and also falls back to search:

```bash
bash scripts/fetch-commons-photo.sh OUTPUT_SITE PHOTO_ID "Exact_File_On_Commons.jpg"
```

Then paste the printed `PHOTOS` line into `data.js` and set `photo: photo("PHOTO_ID")` on the stop.

Rules:

1. Run the script for **major sights** (at least 3 sights across different cities/days when possible, so the top **3-photo Hero Mosaic gallery** renders at full strength; hotels/restaurants optional).
2. Always populate `day.city`, `day.date` (`YYYY-MM-DD`), and `item.lat` / `item.lng` — the template automatically uses them to power **Google Flights / Trip.com price watch**, **Open-Meteo forecast / historical climate & outfit tips**, **Xiaohongshu (小红书) live-post search buttons**, and **one-click Visa/Offline PDF printing**.
3. On success (Commons or placeholder), **always** wire `photo:` — UI should show an image.
4. Only if the script exits non‑zero: omit `photo` and note `暂无图`. Never reference a missing file.

### Serve locally (required)

```bash
bash scripts/serve.sh /abs/OUTPUT_SITE 8766
```

### Share & collaborative editing (default on)

Publish after generating and checking the site:

```bash
bash scripts/publish-site.sh /abs/OUTPUT_SITE
```

The bundled default service is `https://static-travel-guide.huqimeng0306.workers.dev` (zero setup for end users). A maintainer can override it via `TRAVEL_GUIDE_API` or the script's second argument.

Return both online links first and clearly label them as ready for any phone/network (do not make the local `127.0.0.1` URL sound like the main mobile link):

- **公开查看（任何手机 4G/5G/任意 Wi‑Fi 可直接打开；可发群/朋友，支持右上角「复制并修改」克隆副本）**: `https://.../t/ID`
- **私密编辑（任何设备可打开；仅自己和共同编辑者保留，支持增删改、上下调序、在线搜图、历史版本恢复、重置密钥）**: `https://.../t/ID/edit#token=...`
- **本地离线备份（可选，仅本机或同 Wi‑Fi 调试用）**: `http://127.0.0.1:8766/`

Notes:

- `publish-site.sh` automatically rewrites local Wikimedia `photos/*.jpg` paths into public Commons URLs so shared pages never have broken images.
- Never paste the private `#token=...` edit URL into a public issue, repository, or public README.
- If publishing fails due to offline/network issues, still return the local preview URL and explain the network error honestly.

### Acceptance checklist (before saying done)

- [ ] 全部天数默认完整展示，顶部日期切换栏可见且点击单天可正常筛选/翻页
- [ ] 预约 / 订票链接可打开（至少一个 required 或 recommended）
- [ ] 地图有坐标点，窄屏（~390px）布局对齐不乱
- [ ] 若有多个 `origins`，切换出发地时航班与总预算联动变化
- [ ] 导出 JSON 后再导入不报错
- [ ] 共享发布后：公开链接只读且带「复制并修改」；编辑链接改动自动保存，分享弹窗可查看历史版本与重置密钥

### Disclaimer

Keep the template rail note (prices / FX / schedules are estimates). Mention once in chat when handing over the URLs.

Schema: [reference.md](reference.md). Examples: [examples.md](examples.md).

## Template sync & maintenance

`template/` builds on [aladdin0306/travel-guides](https://github.com/aladdin0306/travel-guides) and adds `share.js`, online Commons photo search, stop reordering, sticky all-days view, and Worker/D1 collaboration.

- Self-host / deploy Cloudflare Worker + D1: see [`worker/README.md`](../../worker/README.md)
- Keep Demo Pages green: https://aladdin0306.github.io/static-travel-guide-skill/demo/

## Don’t

- Don’t put intro/summary paragraphs in the trip header (`summary: ""` — keep the top cover purely visual with dates, title, and city hops; put practical reminders on the relevant stops)
- Don’t ask users to edit `data.js` or deploy servers themselves
- Don’t deliver JSON-only when they want a webpage
- Don’t force Australia
- Don’t leave broken photo refs
- Don’t stop at a folder path without openable URLs

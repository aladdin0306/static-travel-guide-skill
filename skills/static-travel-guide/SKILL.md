---
name: static-travel-guide
description: >-
  After the user installs this skill and describes a trip, automatically builds
  a mobile webpage like 行程库: copy template, write data.js with photos/booking/maps,
  serve, and return a URL (not folder-only). Use for custom travel guide pages.
---

# Static travel guide

## User experience

1. Install once → describe trip + preferences in chat.  
2. **You** build the site — user never copies folders or edits `data.js`.  
3. You **must** return openable **URLs** (desktop + phone hint). Never end with only a folder path.

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

- Prefer one structured multi-question form when the client supports it; otherwise ask the seven items in one concise chat message.
- Do not make the user answer fields already stated.
- After answers, send a short confirmation summary before planning:

```text
我会按以下条件规划：
出发：上海
目的地：京都
节奏：休闲游
必去：伏见稻荷、清水寺
预算：每人 ¥8,000–12,000，含机票
日期/人数：4月10–14日，2位成人
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
- [ ] 1. Interview (checklist above)
- [ ] 2. bash scripts/new-site.sh /abs/OUTPUT_SITE
- [ ] 3. Write OUTPUT_SITE/data.js (full SEED_TRIPS)
- [ ] 4. Photos: Commons → photos/ + PHOTOS credits (or 暂无图, no broken imgs)
- [ ] 5. bash scripts/serve.sh /abs/OUTPUT_SITE [port]
- [ ] 6. Give user Desktop URL + phone LAN tip; open browser if possible
- [ ] 7. Run acceptance checklist
- [ ] 8. GitHub Pages only if user asks
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

1. Run the script for **major sights** (temples, viewpoints, hotels optional).  
2. On success (Commons or placeholder), **always** wire `photo:` — UI should show an image.  
3. Only if the script exits non‑zero: omit `photo` and note `暂无图`. Never reference a missing file.

### Serve (required)

```bash
bash scripts/serve.sh /abs/OUTPUT_SITE 8766
```

Reply with:

- Desktop: `http://127.0.0.1:8766/`  
- Phone (same Wi‑Fi): `http://<LAN-IP>:8766/`  

**Do not** finish with only “站点在 /path/to/folder”.

### Acceptance checklist (before saying done)

- [ ] 预约 / 订票链接可打开（至少一个 required 或 recommended）  
- [ ] 地图有坐标点  
- [ ] 窄屏（~390px）布局不乱  
- [ ] 若有多个 `origins`，切换出发地预算会变  
- [ ] 导出 JSON 后再导入不报错  

### Disclaimer

Keep the template rail note (prices / FX / schedules are estimates). Also mention once in chat when handing over the URL.

Schema: [reference.md](reference.md). Examples: [examples.md](examples.md).

## Template sync (maintainers)

`template/` tracks [aladdin0306/travel-guides](https://github.com/aladdin0306/travel-guides). See `template/SYNC.txt` after sync.

```bash
# from skill repo root — sibling ../travel-guides or clone
bash scripts/sync-template.sh
# or pin a ref:
TRAVEL_GUIDES_REF=main bash scripts/sync-template.sh
```

Does not overwrite carefully curated `data.js` / demo Australia photos unless you replace them separately.

## Publish (maintainers)

- Keep Demo Pages green: https://aladdin0306.github.io/static-travel-guide-skill/demo/  
- Optional: `gh skill publish --tag v1.x.0`  
- Optional: Cursor Marketplace https://cursor.com/marketplace/publish  

## Don’t

- Don’t ask users to edit `data.js`  
- Don’t deliver JSON-only when they want a webpage  
- Don’t force Australia  
- Don’t leave broken photo refs  
- Don’t stop at a folder path without a URL  

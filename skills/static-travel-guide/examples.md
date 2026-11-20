# Examples

## Domestic trip — 福建（厦门 & 泉州）5 天 4 晚

完整的国内游参考样板已内置在 `template/data.js` 与 `demo/data.js` 的 `fujian-2027`（标题 `"厦门 · 泉州"`）中，可直接对照其字段结构与文案语气。

User: 「4 月初想去福建厦门和泉州玩 5 天，两个人，想吃地道古早味小吃、别太特种兵，上海或北京出发都可以。」

Agent:

1. **一次性补齐缺失项（纯国内游自动跳过签证问题）**：节奏（休闲游 / 均衡游）、必去景点、每人预算范围（是否含往返机票/高铁）、具体日期与住宿安排。
2. User answers: 「均衡偏松弛；鼓浪屿、泉州开元寺和蟳埔村簪花必去；每人 ¥3,000–3,500 含大交通；4 月 2–6 日，两人同住一间；最好厦门进泉州出不走回头路。」
3. **发送简短确认摘要后直接开干**：

```text
我会按以下条件规划：
出发：上海 / 北京（保留两地开口程机票与高铁参考对比）
目的地：厦门 · 泉州（厦门进、泉州晋江出，中间高铁 28 分钟跨城）
节奏：均衡偏松弛（每天早上到晚餐完整衔接，不早起赶特种兵）
必去：鼓浪屿、泉州开元寺、蟳埔民俗渔村簪花围
预算：每人 ¥3,000–3,500（CNY 单币种账本，含往返大交通）
日期/人数：4月2–6日（5天4晚），2位成人同住一间
```

4. `bash scripts/new-site.sh ~/Sites/fujian-2027`
5. **写入国内游专属配置（`data.js`）**：
   - `title: "厦门 · 泉州"`（只写简洁地名，不堆砌“5天4夜/闽南吃喝游”等副标题），`summary: ""`
   - **省略 `visa`**（国内游页面自动隐藏签证模块）
   - `budget.currency: "CNY"`（自动渲染清爽的人民币单栏对账单），`origins` 同时保留 `上海` 与 `北京` 开口程对比，页面自动展示「携程查实时票价」
   - 坐标落在大陆境内且城市为 `厦门` / `泉州`，页面抽屉自动将外部导航切换为 **高德地图 + 苹果地图**，并生成每站的 **小红书近期实况 / 点单推荐 / 入住体验** 链接
   - 国内特色预约防坑写进 `reservationNote` 与 `note`（例如：微信搜官方小程序「屿见厦门」提前抢三丘田码头 ¥35 船票避开黄牛、12306 买到离古城最近的「泉州站」而非泉州南/东站、古城 ¥2 招手即停「小白」电瓶公交、泉州提线木偶戏公众号抢票）
   - 最后一天按返程交通方式用 `alt: true` + `day.altTitle` 提供折叠备选（乘飞机从晋江机场返程顺路逛 **晋江梧林南洋传统村落**；搭高铁从泉州站返程可改逛城东北 **北宋跨海洛阳桥**，且备选项费用不会重复计入总预算）
6. `bash scripts/fetch-place-photo.sh …` 抓取鼓浪屿、中山路骑楼、南普陀寺、泉州开元寺、东西塔、清净寺、洛阳桥等实景图。
7. 发布并返回公网可打开链接（优先 GitHub Pages `publish-gh-pages.sh` + 离线单文件 `bundle-single.sh`；需要多人在线共改时再用 `publish-site.sh`）。

---

## Outbound trip — first message is incomplete (日本 · 京都)

User: 「帮我做一趟日本网页，做好后我要发给朋友一起看和改。」

Agent:

1. Ask in one batch: departure, destination, pace, must-go sights, budget, dates, party, visa status.
2. User answers: 「上海或北京，京都，休闲游，伏见稻荷必去，每人 1 万含机票，4 月 10–14 日，两人一间房，中国护照还没办日本签。」
3. Confirm constraints in a short summary (keeping both 上海 and 北京 in `origins`, and noting visa prep).
4. `bash scripts/new-site.sh ~/Sites/kyoto-2027`
5. Write `data.js` with multi-origin budget, `visa` prep block, bookings, and coordinates.
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

## Visa prep

User: 「澳洲玩一趟，中国护照，还没办签。」

Agent writes `visa.status = "required"` with subclass 600 tourist guidance, official apply/guide links, docs checklist, timeline, and a matching `budget.extras` visa fee line. The page shows a「签证准备」block; checklist ticks stay in the local browser only.

Wrong: putting passport numbers, ImmiAccount passwords, or bank-statement screenshots into `data.js`.

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

# static-travel-guide

装上 Skill → **说出行程和偏好** → Agent **自动生成「行程库」同款网页**，并直接返回 **在线公开链接 + 私密编辑链接 + 本地预览链接**（手机、电脑都能直接打开）。

不用自己复制文件夹，不用手改 `data.js`，也不用自己买服务器或配数据库。

### 快速入口

- **查看 Skill 源码** — [aladdin0306/static-travel-guide-skill](https://github.com/aladdin0306/static-travel-guide-skill)
- **体验在线共享样例（支持「复制并修改」）** — [澳洲 7 天共享页](https://static-travel-guide.huqimeng0306.workers.dev/t/A1JnvRqhFVEg)
- **体验 GitHub Pages 静态样例** — [澳洲行程 Demo](https://aladdin0306.github.io/static-travel-guide-skill/demo/)
- **打开完整参考站** — [行程库](https://aladdin0306.github.io/travel-guides/)

**声明：** 票价、汇率、班期多为估算，出行前请再核对官网。

---

## 核心亮点

1. **先问清楚再排线**：Agent 在写行程前会一次性确认出发地（支持多城市对比）、目的地、旅行节奏（`休闲游` / `均衡游` / `特种兵`）、必去景点、预算口径、日期和同行人数。
2. **产出真实可用的杂志感响应式网页**：
   - **杂志社论风 Hero 三宫格画廊**：暖米白画报底色，顶部自动从不同目的地城市提取代表实景图组成 1 大 + 2 小拼图画廊，精简横向路线胶囊条，告别重复啰嗦的表单感。
   - **总览与对账单式预算 + 蹲低价机票**：置顶展示每人总预算与 25+ 币种分类占比；多出发地一键切换联动重算，内置 **「蹲低价机票」** 横条，自动带入出发地与首尾城市/开口程日期，一键跳转 Google Flights（开启免费降价邮件提醒）与携程比价。
   - **每一站自带「小红书实况 / 点单避雷」跳转**：景点一键搜近期实况与攻略、餐厅一键搜点单推荐与避雷、酒店一键搜入住体验。
   - **实时天气 / 往年同期穿衣参考 + 签证级 PDF 打印**：自动按坐标查询未来 14 天实时天气或往年同日气温与穿衣建议；右上角支持 **「打印/PDF」** 一键导出干净的送签行程单或离线 PDF。
   - **预约提醒与地图打点**：汇总「必须预约 / 建议预约」直达官网，桌面端联动 Leaflet 路线图，手机端一键唤起 Google Maps App 逐站打点。
3. **零配置在线共享与协作编辑**：
   - **公开查看链接（`/t/:id`）**：只读展示、自动收起左侧列表栏；发到微信 / 飞书 / iMessage 自动展示行程专属标题、摘要与首图预览卡片（OpenGraph）。
   - **公开页一键「复制并修改」（Fork）**：别人打开你的公开链接后，点右上角「复制并修改」，即可克隆出独立副本并跳转到他自己的专属编辑链接，互不干扰。
   - **私密编辑链接（`/t/:id/edit#token=...`）**：持有链接即可在线改名、增删天数与站点、**上下调整站点顺序**、**在线自动搜图换图**，所有改动自动保存到云端。
   - **历史版本回滚 & 密钥重置 & 冲突保护**：保留最近 **20 个历史版本** 随时一键恢复；编辑链接泄露可一键 **重置编辑密钥**（旧链接立即作废）；多人同时编辑触发冲突时提供 **「加载最新内容」** 按钮，防止误覆盖。

---

## 用户怎么用

### 1. 安装一次

#### Cursor 插件

```text
/add-plugin https://github.com/aladdin0306/static-travel-guide-skill
```

#### 主流 Agent（`gh skill`）

下面任选一条；`--scope user` 表示安装到用户级、所有项目可用。

**Cursor**

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent cursor --scope user
```

**Claude Code**

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent claude-code --scope user
```

**OpenAI Codex**

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent codex --scope user
```

**GitHub Copilot**

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent github-copilot --scope user
```

**Gemini CLI**

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent gemini-cli --scope user
```

**OpenCode**

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent opencode --scope user
```

只想在当前项目使用时，把 `--scope user` 改成 `--scope project`。更多支持的 Agent 可运行：

```bash
gh skill install --help
```

本 Skill 遵循通用 Agent Skills 目录规范，不绑定 Cursor；只有 `/add-plugin` 这一种安装方式是 Cursor 专用。

---

### 2. 描述行程（Agent 会先做规划前问答）

你可以直接说：

> 帮我做一趟 2027 年 5 月北海道 5 天网页，手机能看还能发给朋友一起改。

若信息不完整，Agent 会先向你确认 7 项关键约束再排线路：

1. **出发地**（可填多个城市，如“上海或北京”）
2. **目的地**（国家 / 城市，不确定可让 Agent 推荐组合）
3. **旅行节奏**（`休闲游` / `均衡游` / `特种兵`）
4. **必须去的景点**（没有可填“没有”）
5. **预算范围**（按人还是总计、币种、是否含国际机票）
6. **日期 / 天数**
7. **同行人数 / 房间安排**

回答示例：

> 上海或北京出发；去京都；休闲游；伏见稻荷和清水寺必须去；每人 ¥8,000–12,000，含机票；4 月 10–14 日；两位成人同住一间。

Agent 会先用几行文字复述确认条件，随后自动完成建站、配图、启动预览与云端发布。

---

### 3. 拿到链接并分享 / 协作修改

生成完成后，Agent 会直接把链接发给你：

- **公开查看链接**（如 `https://.../t/xxx`）：可放心发给任何人或群聊查看，对方无法直接改你的原稿；若朋友想拿你的行程改一版自己的，点页面右上角 **「复制并修改」** 即可。
- **私密编辑链接**（如 `https://.../t/xxx/edit#token=...`）：相当于编辑密码，只发给一起做攻略的同伴。打开后可直接在网页上：
  - 新增/删除某一天，或点击站点右上角 **上移 / 下移 / 修改 / 删除**
  - 在修改弹窗里点 **「自动搜图」** 一键从维基共享资源配图，或按名称自动查坐标打点
  - 点右上角 **「分享」** 查看最近 **20 个历史版本** 并一键回滚，或点击 **「重置编辑密钥」** 让旧编辑链接失效
- **本地预览链接**：`http://127.0.0.1:端口/`（同一 Wi‑Fi 下手机也可通过局域网 IP 访问），同时支持右上角 JSON 导入 / 导出备份。

> **安全提醒：** 编辑密钥保存在 URL 的 `#token=` 片段中，浏览器不会将其发送给服务器访问日志，云端数据库仅存储 SHA-256 哈希。请勿将带 `#token=` 的编辑链接贴到公开仓库、公开文档或群公告。

默认共享服务已托管在 `<https://static-travel-guide.huqimeng0306.workers.dev>`，普通用户无需注册 Cloudflare 即可直接使用。

---

## 本地体验 Demo

```bash
git clone https://github.com/aladdin0306/static-travel-guide-skill.git
cd static-travel-guide-skill/demo
python3 -m http.server 8767 --bind 0.0.0.0
```

打开 `http://127.0.0.1:8767/` 即可体验（澳洲 Demo 仅为样例，实际按你的目的地生成）。

---

## Agent / 维护者指南

- Skill 执行规范：[`skills/static-travel-guide/SKILL.md`](skills/static-travel-guide/SKILL.md)
- 规划前问答细则：[`skills/static-travel-guide/intake.md`](skills/static-travel-guide/intake.md)
- 数据结构与接口说明：[`skills/static-travel-guide/reference.md`](skills/static-travel-guide/reference.md)
- 完整问答与发布示例：[`skills/static-travel-guide/examples.md`](skills/static-travel-guide/examples.md)
- 自建 Cloudflare 共享服务指南：[`worker/README.md`](worker/README.md)

### 常用脚本

| 脚本 | 作用 |
|------|------|
| `scripts/new-site.sh OUT` | 复制 `template/` 生成新行程站点目录 |
| `scripts/fetch-place-photo.sh OUT ID "景点名"` | **推荐**：Commons 搜索 + 503 重试 + 多候选 + 纯色占位图兜底，输出 `PHOTOS` 条目 |
| `scripts/fetch-commons-photo.sh OUT ID "File.jpg"` | 按精确 Commons 文件名下载（失败自动回退到关键词搜索） |
| `scripts/serve.sh OUT [port]` | 启动本地 HTTP 服务并打印电脑 + 手机局域网 URL |
| `scripts/publish-site.sh OUT [API_BASE] [trip-id]` | 将行程发布到共享服务（自动把本地 Commons 图转为公开 URL），返回公开链接与私密编辑链接 |
| `scripts/sync-template.sh [path] --force` | 从上游 `travel-guides` 同步基础壳（默认带保护提示，避免误覆盖共享能力） |

### 自建共享服务（可选，0 元/月）

仓库内置了完整的 Cloudflare Worker + D1 后端（位于 `worker/`），个人及小范围使用完全在 Cloudflare 免费额度内（0 元/月）。详见 [`worker/README.md`](worker/README.md)：

```bash
npx wrangler login
cp wrangler.toml.example wrangler.toml
npx wrangler d1 create static-travel-guide
# 将返回的 database_id 填入 wrangler.toml 后：
npx wrangler d1 execute static-travel-guide --remote --file=worker/schema.sql
npx wrangler secret put RATE_LIMIT_SALT
npx wrangler deploy
```

自建后通过环境变量指定你自己的服务地址即可：

```bash
export TRAVEL_GUIDE_API="https://你的服务名.你的子域.workers.dev"
bash scripts/publish-site.sh /path/to/site
```

### 交付验收清单（Agent 交活前必查）

1. 全部天数默认完整展示，吸顶日期切换栏可见且可筛选单天
2. 至少一个预约 / 订票链接可正常打开
3. 地图有坐标打点，手机宽度（~390px）排版对齐不乱
4. 多出发地切换时，航班说明与总预算会联动变化
5. 无破图（Commons 实景图或兜底图正常显示，彻底无图时省略 `photo`）
6. 已返回在线公开查看链接、私密编辑链接及本地预览链接

### 目录结构

```text
skills/static-travel-guide/  Agent Skill 定义与参考文档（SKILL.md / intake / reference / examples）
template/                    生成站点时复制的前端模板（含在线共享、自动搜图、版本管理）
demo/                        在线静态样例（澳洲 7 天）
scripts/                     建站 / 搜图兜底 / 本地预览 / 一键云端发布脚本
worker/                      Cloudflare Worker + D1 共享后端源码、表结构与部署说明
```

---

## License

MIT（[LICENSE](LICENSE)）。`photos/` 及 Wikimedia Commons 第三方图片按原许可署名。

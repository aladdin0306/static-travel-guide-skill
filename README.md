# static-travel-guide

一个 **Agent Skill**：用户装上之后，用自然语言描述旅行，AI 会生成 **和「行程库」同款的前端网页**（手机能打开），而不是只给一段文字或 JSON。

参考成品（作者的站）：https://aladdin0306.github.io/travel-guides/  
Skill 仓库：https://github.com/aladdin0306/static-travel-guide-skill

## 一句话：Skill 产出什么？

| 产出 | 说明 |
|------|------|
| ✅ 完整静态网页 | 与行程库同一套前端：`index.html` + `app.js` + `styles.css` + `data.js` + `photos/` |
| ✅ 手机可开 | 响应式；地图在手机上按站打点 / 打开谷歌地图，不强制整天导航折线 |
| ✅ 图片 | 景点图 + 署名（`PHOTOS`） |
| ✅ 订票 / 官网 | `bookingUrl` + 必须预约 / 建议预约 |
| ✅ 预算 | 当地货币 + 可选人民币；可切换出发城市 |
| ✅ 导入导出 | 浏览器 `localStorage` + JSON |

仓库里的 **澳洲 Demo** = 同款网页 + 澳洲种子数据，用来演示效果。  
用户说去日本 / 欧洲，就生成 **他的** 线路数据塞进同一套网页，不强制澳洲。

---

## 用户怎么用

### 1. 安装（Cursor 或其他支持 Skill 的 Agent）

**Cursor：**

```text
/add-plugin https://github.com/aladdin0306/static-travel-guide-skill
```

或：

```bash
git clone https://github.com/aladdin0306/static-travel-guide-skill.git
cp -R static-travel-guide-skill/skills/static-travel-guide ~/.cursor/skills/
```

**其他 Agent（`gh skill`）：**

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent cursor --scope user
# 把 cursor 换成 claude-code / github-copilot 等，见 gh skill install --help
```

不必只用 Cursor。

### 2. 在对话里说你的旅行

例如：

- 「用 static-travel-guide 给我做一趟北海道网页，5 天，两人，上海出发，要能订票跳转和地图打点」
- 「生成一个和行程库一样的站点，行程是西班牙两周」
- 「先看 demo，再按同样网页风格做我的泰国线」

Agent 应：

1. 问清缺的信息（日期、人数、出发地、货币等）  
2. **复制本仓库的 `template/`（或 `demo/`）** 作为站点骨架  
3. 改写 `data.js` 里的行程，补图片、预约链接、坐标  
4. 本地起静态服务，方便你用手机预览  
5. 若你要求，再推到你的 GitHub Pages  

### 3. 自己先打开 Demo（同款网页 + 澳洲样例）

**在线：**  
https://aladdin0306.github.io/static-travel-guide-skill/demo/

**本地：**

```bash
git clone https://github.com/aladdin0306/static-travel-guide-skill.git
cd static-travel-guide-skill/demo
python3 -m http.server 8767 --bind 0.0.0.0
# 电脑: http://127.0.0.1:8767/
# 手机: http://<电脑局域网IP>:8767/
```

---

## 网页能力（与正式站对齐）

生成站应具备与 https://aladdin0306.github.io/travel-guides/ 同类能力：

1. **行程总览** — 日期、城市、说明  
2. **预算** — 分类、出发地切换、人民币估算  
3. **预约** — 必须 / 建议预约列表，跳转订票或官网  
4. **按天行程** — 时间、地点、费用、备注  
5. **图片** — 站点配图与版权说明  
6. **地图** — Leaflet 打点；手机上可逐站打开谷歌地图  
7. **导入 / 导出** — 换设备不丢数据  

字段规范：[`skills/static-travel-guide/reference.md`](skills/static-travel-guide/reference.md)  
Agent 细则：[`skills/static-travel-guide/SKILL.md`](skills/static-travel-guide/SKILL.md)

---

## 仓库结构

```text
static-travel-guide-skill/
├── README.md
├── LICENSE
├── .cursor-plugin/plugin.json
├── skills/static-travel-guide/     ← Skill（给 Agent 读）
│   ├── SKILL.md
│   ├── reference.md
│   └── examples.md
├── template/                       ← 生成站时复制这一份（同款前端）
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   ├── data.js                     ← 示例：澳洲 SEED_TRIPS
│   ├── photos/                     ← 澳洲示例图
│   └── README.md
└── demo/                           ← 与 template 同款，供 Pages / 本地演示
    └── （同上）
```

旧的「绿色 Signal」实验页已替换为 **正式行程库同款前端**。

---

## 给 Agent / 二次开发的要点

- **默认交付物 = 可打开的网站目录**，不是只有 JSON。  
- 骨架优先复制本仓库 `template/`，不要从零手写另一套 UI（除非用户明确要求换视觉）。  
- 用户目的地任意；仅当用户要「看例子」时用澳洲种子。  
- 图片：放入 `photos/`，在 `PHOTOS` 登记署名；维基共享资源需保留许可信息。  
- 部署到 **用户自己的** GitHub 仓库 / Pages；不要未经允许改作者的 `travel-guides` 仓库。

---

## 常见问题

**和作者网页是同一个站吗？**  
不是同一个 URL。Skill 提供的是 **同一套前端模板**；生成结果是用户自己的站点（自己的域名或 `用户名.github.io/...`）。

**必须 Cursor 吗？**  
不必。支持 Agent Skills / `gh skill install` 的客户端都可以。

**只会聊天、不会部署怎么办？**  
先让 Agent 在本地生成文件夹并起 `http.server`，手机连同一 Wi‑Fi 打开即可；上 Pages 可再请 Agent 一步步做。

**Demo 还是绿的？**  
不是。现在 Demo / Template 已是行程库同款界面 + 澳洲数据。

---

## License

Skill 与模板代码：MIT，见 [LICENSE](LICENSE)。

`photos/` 中维基共享资源图片按各自许可使用，**不在** MIT 范围内；生成新站时请为每张图保留署名。

# static-travel-guide

一个 **Agent Skill**（不只绑 Cursor）：装好后，任何人都可以在对话里描述旅行，让 AI 按统一结构生成 **自己的** 行程线路，也可以顺手搭一个能挂在 GitHub Pages 上的静态行程站。

| | |
|---|---|
| 仓库 | https://github.com/aladdin0306/static-travel-guide-skill |
| Skill 名 | `static-travel-guide` |
| 澳洲示例 Demo | [`demo/`](demo/) · 在线：https://aladdin0306.github.io/static-travel-guide-skill/demo/ |
| 完整参考站 | [travel-guides](https://github.com/aladdin0306/travel-guides) · https://aladdin0306.github.io/travel-guides/ |

**重要：** 仓库里的澳洲行程只是 **样例**（结构、预算、预约字段怎么写）。用户说去日本 / 欧洲 / 国内，就生成 **他的** 线路，不要默认做成澳洲。

---

## 这是什么 / 不是什么

**是：**

- 给 AI Agent 用的说明书（`skills/static-travel-guide/SKILL.md`）
- 约定行程 JSON 长什么样（天、站点、预约、预算、双币种）
- 可选：搭无后端静态站（HTML/CSS/JS + 地图 + localStorage）
- 带一个可打开的澳洲 Demo，方便新人看效果

**不是：**

- 不是必须安装 Cursor 才能用（Claude Code、Copilot、Codex 等支持 Skill 的工具也可以）
- 不是只能规划澳洲
- 不是旅游预订平台（不代替订票；只组织信息和链接）

---

## 用户怎么用（最常见）

### 第一步：安装 Skill

#### 方式 A — Cursor 插件

在 Cursor 输入：

```text
/add-plugin https://github.com/aladdin0306/static-travel-guide-skill
```

#### 方式 B — 拷到本机 Cursor skills 目录

```bash
git clone https://github.com/aladdin0306/static-travel-guide-skill.git
cp -R static-travel-guide-skill/skills/static-travel-guide ~/.cursor/skills/
```

#### 方式 C — `gh skill`（多款 Agent）

不必只用 Cursor。例如：

```bash
# Cursor（用户级）
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent cursor --scope user

# Claude Code
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent claude-code --scope user

# 查看本机支持的 --agent 列表
gh skill install --help
```

项目级安装把 `--scope user` 改成 `--scope project`（技能进当前仓库）。

### 第二步：在对话里描述你的旅行

装好后，直接说，例如：

- 「帮我规划 2027 年 5 月北海道 5 天，两人，上海出发」
- 「按 static-travel-guide 生成一趟西班牙两周线路，预算用欧元，人民币对照」
- 「给我一份行程 JSON，要带必订项和每天花费」
- 「搭一个能放 GitHub Pages 的行程站，种子数据用我刚说的日本行程」

Agent 会补全缺的信息（目的地、日期、人数、出发地、货币等），再输出：

1. **行程数据**（按天的 stops、预约标记、预算）
2. （若你要求）**静态网页项目**，可本地预览、可推 Pages

### 第三步（可选）：先看 Demo 长什么样

**本地：**

```bash
git clone https://github.com/aladdin0306/static-travel-guide-skill.git
cd static-travel-guide-skill/demo
python3 -m http.server 8767 --bind 127.0.0.1
# 浏览器打开 http://127.0.0.1:8767/
```

**在线（GitHub Pages）：**

https://aladdin0306.github.io/static-travel-guide-skill/demo/

Demo 含：总览、预算（可切换出发城市）、按天行程、右侧地图打点。数据来自 `demo/australia-trip.js`。

---

## Agent 会按什么规则做事

安装后，Agent 应遵循 `skills/static-travel-guide/SKILL.md`，要点：

1. **默认任务 = 生成用户自己的线路**，不是复制澳洲 Demo  
2. 信息不够时先问：城市与天数、日期、人数、出发地、货币、已知必订项  
3. 输出结构见 `reference.md`：`trip` → `budget` → `days[]` → `items[]`  
4. UI 若做网页：**总览 → 预算靠前 → 行程**；必订单独标出  
5. 地图用坐标打点；手机上优先「每站打开地图」，避免强制整天一条导航折线  
6. 默认技术栈：原生 HTML/CSS/JS + Leaflet + `localStorage` + 导出/导入 JSON；不主动上 React/Vue，除非用户要求  

更细的字段说明：[skills/static-travel-guide/reference.md](skills/static-travel-guide/reference.md)  
对话示例：[skills/static-travel-guide/examples.md](skills/static-travel-guide/examples.md)

---

## 行程数据长什么样（摘要）

```js
{
  id: "my-trip",
  title: "显示名",
  start: "YYYY-MM-DD",
  end: "YYYY-MM-DD",
  summary: "一两段说明",
  budget: {
    currency: "JPY",           // 或 AUD / EUR …
    party: "两人同住一间",
    cnyRate: 0.05,             // 可选：兑人民币等
    extras: [ /* 签证、流量等 */ ],
    origins: [ /* 不同出发城市机票 */ ]
  },
  days: [
    {
      id: "d1",
      date: "YYYY-MM-DD",
      city: "札幌",
      title: "当天一句话",
      items: [
        {
          id: "d1-1",
          time: "09:00",
          kind: "sight",          // sight | food | transport | stay
          name: "景点名",
          lat: 43.0,
          lng: 141.3,
          reservation: "required", // none | recommended | required
          bookingUrl: "https://…",
          cost: { amount: 1000, note: "…" },
          note: "怎么走、注意什么"
        }
      ]
    }
  ]
}
```

---

## 仓库结构

```text
static-travel-guide-skill/
├── README.md                 ← 你正在看的说明
├── LICENSE                   ← MIT
├── .cursor-plugin/
│   └── plugin.json           ← Cursor 插件清单
├── demo/                     ← 澳洲示例站（可独立打开）
│   ├── index.html
│   ├── app.js
│   └── australia-trip.js
└── skills/
    └── static-travel-guide/  ← 真正的 Skill（可被各 Agent 安装）
        ├── SKILL.md          ← 主说明（Agent 必读）
        ├── reference.md      ← 字段规范
        └── examples.md       ← 用法示例
```

---

## 给维护者 / 二次发布

本仓库已发布在 `aladdin0306/static-travel-guide-skill`。若你 fork 后要自己发一版：

```bash
git clone https://github.com/aladdin0306/static-travel-guide-skill.git
cd static-travel-guide-skill
# 改 skills/ 与 demo/ 后
git add . && git commit -m "Your changes"
git push

# 可选：打 release，方便 gh skill 钉版本
gh skill publish --tag v1.0.1
```

提交到 Cursor Marketplace（可选）：https://cursor.com/marketplace/publish

启用 GitHub Pages：Settings → Pages → Deploy from branch `main` / 根目录 `/`，Demo 路径为 `/demo/`。

---

## 常见问题

**必须用 Cursor 吗？**  
不必。凡支持 Agent Skills / `gh skill install` 的客户端都可以；Cursor 只是安装方式之一。

**不会写代码能用吗？**  
能。装好 Skill 后用自然语言描述旅行即可。只有在你要求「做成网页并推送 GitHub」时，才需要仓库/推送相关操作（也可让 Agent 代做）。

**数据存在哪？**  
对话里生成的 JSON 可保存成文件。若搭了完整站，浏览器用 `localStorage`，换设备请用页面的导出/导入。

**Demo 和完整 travel-guides 站有何区别？**  
Demo 是精简展示；[travel-guides](https://github.com/aladdin0306/travel-guides) 是功能更全的参考实现（编辑器、多行程、导出等）。

---

## License

代码与 Skill 文本：MIT，见 [LICENSE](LICENSE)。

Demo 行程为示例数据；完整站点中的景点照片等第三方资源以原仓库说明为准，不在 MIT 范围内。

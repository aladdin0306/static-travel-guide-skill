# static-travel-guide

装上 Skill → **说出行程和偏好** → Agent **自动生成同款前端网页** 并把 **链接** 发给你（手机也能开）。

你不用自己复制文件夹，也不用改 `data.js`。

| | |
|---|---|
| 仓库 | https://github.com/aladdin0306/static-travel-guide-skill |
| 作者参考站 | https://aladdin0306.github.io/travel-guides/ |
| Demo（同款 UI + 澳洲样例） | https://aladdin0306.github.io/static-travel-guide-skill/demo/ |

**声明：** 票价、汇率、班期多为估算，出行前请再核对官网。

---

## 用户怎么用

### 1. 安装一次

```text
/add-plugin https://github.com/aladdin0306/static-travel-guide-skill
```

或：

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent cursor --scope user
```

也可用其他支持 Skill 的 Agent（改 `--agent`）。不必只用 Cursor。

### 2. 描述行程（可一次说清偏好）

例如：

> 2027 年 5 月北海道 5 天，两人，上海出发，节奏轻松，预算别太猛，不要太多购物店，要能订票跳转和地图打点，手机能打开。

Agent 缺信息时会问：日期、人数、出发地、节奏（轻松/赶）、预算上限、忌口/亲子/徒步等。

### 3. 拿到网页链接

Agent 应自动：拷模板 → 写入行程 → 尽量配图（维基共享资源）→ 起服务 → **给你 URL**。

- 电脑：`http://127.0.0.1:端口/`  
- 手机：同一 Wi‑Fi 下电脑的局域网 IP  

若只要文件夹路径、没有链接，那是 Agent 没按 Skill 做完——提醒它「把预览链接发我」。

---

## 网页能力

与行程库对齐：按天行程、图片、订票/官网、地图打点（手机逐站谷歌）、预算、导入导出。

澳洲 Demo 只是样例；你说去哪就生成哪。

本地看 Demo：

```bash
git clone https://github.com/aladdin0306/static-travel-guide-skill.git
cd static-travel-guide-skill/demo
python3 -m http.server 8767 --bind 0.0.0.0
```

---

## Agent / 维护者

细则：[`skills/static-travel-guide/SKILL.md`](skills/static-travel-guide/SKILL.md)  
字段：[`skills/static-travel-guide/reference.md`](skills/static-travel-guide/reference.md)

| 脚本 | 作用 |
|------|------|
| `scripts/new-site.sh OUT` | 复制 `template/` → 新站点 |
| `scripts/serve.sh OUT [port]` | 起服务并打印电脑/手机 URL（**必须把链接交给用户**） |
| `scripts/fetch-place-photo.sh OUT ID "景点名"` | **推荐**：Commons 搜索 + 503 重试 + 多候选 + 占位图兜底 |
| `scripts/fetch-commons-photo.sh OUT ID "File.jpg"` | 按精确文件名下载（失败会按文件名再搜索） |
| `scripts/sync-template.sh [path]` | 从正式 [travel-guides](https://github.com/aladdin0306/travel-guides) 同步 `index.html` / `app.js` / `styles.css` |

模板基准：上游 `travel-guides`（见 `template/SYNC.txt`）。同步示例：

```bash
TRAVEL_GUIDES_REF=main bash scripts/sync-template.sh
# 或传入本地路径
bash scripts/sync-template.sh ../travel-guides
```

发布：保持 Demo Pages 可用；可选 `gh skill publish --tag v1.x.0`；可选 [Cursor Marketplace](https://cursor.com/marketplace/publish)。

### 验收清单（Agent 交活前）

1. 预约链接能打开  
2. 地图有点  
3. 手机宽度不乱  
4. 多出发地时切换预算会变  
5. 导出 JSON 能再导入  

无图时写「暂无图」并省略 `photo`，禁止破图。

### 结构

```text
skills/static-travel-guide/  Skill
template/                    生成时复制的网页壳
demo/                        同款 + 澳洲样例
scripts/                     new-site / serve / photos / sync
```

---

## License

MIT（[LICENSE](LICENSE)）。`photos/` 第三方图按原许可署名。

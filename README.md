# static-travel-guide

装上这个 Skill 之后：**你只要说出行程和偏好**，AI 会自动生成 **和「行程库」同款的前端网页**（手机能开），并给你打开链接。

你不需要自己复制文件夹，也不需要会改 `data.js`——那些由 Agent 在后台完成。

| | |
|---|---|
| 仓库 | https://github.com/aladdin0306/static-travel-guide-skill |
| 作者参考站 | https://aladdin0306.github.io/travel-guides/ |
| 在线 Demo（同款网页 + 澳洲样例） | https://aladdin0306.github.io/static-travel-guide-skill/demo/ |

---

## 用户怎么用（推荐流程）

### 1. 安装一次

**Cursor：**

```text
/add-plugin https://github.com/aladdin0306/static-travel-guide-skill
```

或其他方式：

```bash
gh skill install aladdin0306/static-travel-guide-skill static-travel-guide --agent cursor --scope user
```

（也可用 Claude Code 等：把 `--agent` 换成对应值。不必只用 Cursor。）

### 2. 直接说你的旅行

例如：

> 帮我做一趟 2027 年 5 月北海道 5 天网页，两人，上海出发，节奏轻松，要能跳转订票、地图打点，手机能打开。

### 3. 等 Agent 自动完成并给你网页

Agent 应自动：

1. 复制网页模板  
2. 把你的行程写进数据文件  
3. 尽量配上图片、预约链接、地图坐标  
4. 启动本地网页服务  
5. **把链接发给你**（电脑 `http://127.0.0.1:端口/`；手机用同一 Wi‑Fi 下电脑的 IP）

你打开链接就是成品页。若要挂到自己的 GitHub Pages，再说一声即可。

---

## 网页里有什么

与 https://aladdin0306.github.io/travel-guides/ 同类：

- 按天行程、总览与预算  
- 景点图  
- 订票 / 官网跳转（必须预约、建议预约）  
- 地图打点；手机可逐站开谷歌地图  
- 导入 / 导出 JSON  

澳洲 Demo 只是样例；你说去哪，就生成哪。

---

## 自己先看 Demo（可选）

```bash
git clone https://github.com/aladdin0306/static-travel-guide-skill.git
cd static-travel-guide-skill/demo
python3 -m http.server 8767 --bind 0.0.0.0
# http://127.0.0.1:8767/
```

或：https://aladdin0306.github.io/static-travel-guide-skill/demo/

---

## 给 Agent 的约定（开发者）

用户侧话术：**不要**说「请复制模板改 data.js」。

Agent 侧必须执行（详见 [`skills/static-travel-guide/SKILL.md`](skills/static-travel-guide/SKILL.md)）：

```bash
bash scripts/new-site.sh /path/to/用户的站点目录
# 写入该目录的 data.js（及 photos/）
cd /path/to/用户的站点目录 && python3 -m http.server 8766 --bind 0.0.0.0
# 打开 URL 交给用户
```

字段规范：[`skills/static-travel-guide/reference.md`](skills/static-travel-guide/reference.md)

### 仓库结构

```text
skills/static-travel-guide/   Skill 说明
template/                     网页模板（生成时复制）
demo/                         同款模板 + 澳洲样例
scripts/new-site.sh           一键复制模板
```

---

## 常见问题

**我要自己改代码吗？**  
不用。说话描述行程即可。

**必须用 Cursor 吗？**  
不必，支持 Agent Skills 的客户端即可。

**和作者网页是同一个网址吗？**  
不是。你得到的是自己的一份网页（本地或你的 Pages）。

---

## License

MIT（见 [LICENSE](LICENSE)）。`photos/` 中第三方图片按原许可署名，不在 MIT 内。

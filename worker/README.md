# 共享与协作编辑服务（Cloudflare Worker + D1）

本目录提供与前端 `template/` 配套的在线共享与多人协作服务，运行在 Cloudflare Workers + D1 免费额度内（0 元/月）。

## 功能一览

- **公开只读路由（`/t/:id`）**：
  - 任何人打开可查看完整多日行程、预算明细、预约跳转与地图打点，隐藏编辑按钮并收起左侧列表栏。
  - 动态注入行程专属 `<title>` 与 OpenGraph 元信息（`og:title`、`og:description`、`og:image`），发到微信、飞书、iMessage 自动显示行程卡片。
  - 右上角支持 **「复制并修改」（Fork）**，一键克隆出独立副本并跳转到访问者自己的编辑链接。
- **私密编辑路由（`/t/:id/edit#token=...`）**：
  - 编辑密钥位于 `#token`（URL fragment 不会进入服务器访问日志），前端通过 `Authorization: Bearer <token>` 提交修改，D1 仅存储 SHA-256 哈希。
  - 在线支持改名、新增/删除天数与站点、上下调整站点顺序、在线搜 Wikimedia Commons 配图、勾选「已订好」，自动防抖保存。
  - **乐观锁防冲突**：每次保存校验 `expectedRevision`；多人并发触发 `409` 时顶部显示 **「加载最新内容」** 按钮。
  - **版本历史与密钥重置**：在编辑页打开「分享」弹窗，可查看并一键恢复最近 **20 个历史版本**，或点击 **「重置编辑密钥」** 使旧编辑链接立即作废。

## 接口清单

| 方法与路径 | 鉴权 | 说明 |
|------------|------|------|
| `GET /api/health` | 无 | 健康检查 |
| `POST /api/trips` | 无（按 IP 每日限流 20 次） | 创建共享行程，返回 `id`、`publicUrl`、`editUrl` |
| `GET /api/trips/:id` | 无 | 读取行程内容与当前 `revision` |
| `PUT /api/trips/:id` | `Bearer <token>` | 校验 `expectedRevision` 后保存新版本，并将旧版写入 `revisions` |
| `GET /api/trips/:id/revisions` | `Bearer <token>` | 获取最近 20 个历史版本号与保存时间 |
| `POST /api/trips/:id/restore` | `Bearer <token>` | 恢复指定历史版本（当前版本同时保留进历史） |
| `POST /api/trips/:id/rotate-token` | `Bearer <token>` | 重新生成编辑密钥并返回新 `editUrl`，旧密钥立即失效 |

## 自建部署步骤（可选）

仓库已内置默认线上服务（`https://static-travel-guide.huqimeng0306.workers.dev`），普通用户无需部署。若你想部署到自己的 Cloudflare 账号：

```bash
npx wrangler login
cp wrangler.toml.example wrangler.toml
npx wrangler d1 create static-travel-guide
```

将输出的 `database_id` 填入 `wrangler.toml`，然后初始化表结构并部署：

```bash
npx wrangler d1 execute static-travel-guide --remote --file=worker/schema.sql
npx wrangler secret put RATE_LIMIT_SALT
npx wrangler deploy
```

`RATE_LIMIT_SALT` 输入任意随机长字符串即可（仅用于匿名创建限流哈希）。

## 发布生成的站点

```bash
# 使用默认线上服务
bash scripts/publish-site.sh /path/to/generated-site

# 或指定自建服务地址
TRAVEL_GUIDE_API="https://你的服务.workers.dev" bash scripts/publish-site.sh /path/to/generated-site
```

发布脚本会自动将站点内引用的本地 Commons 图片转换为公开 Wikimedia 直链，确保任何设备打开均不破图。

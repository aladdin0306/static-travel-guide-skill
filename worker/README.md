# 共享编辑服务

这部分把同一套行程网页部署成：

- `/t/:id`：公开查看
- `/t/:id/edit#token=...`：持链接可编辑
- `/api/trips`：创建、读取、保存、历史版本和重置编辑密钥

编辑密钥不会进入服务器访问日志：前端从 URL fragment（`#token`）读取后放进
`Authorization` 请求头；D1 只保存 SHA-256 哈希。

## 部署

需要 Node.js 和一个 Cloudflare 账号，不需要购买服务器。

```bash
npx wrangler login
cp wrangler.toml.example wrangler.toml
npx wrangler d1 create static-travel-guide
```

把命令返回的 `database_id` 填入 `wrangler.toml`，然后：

```bash
npx wrangler d1 execute static-travel-guide --remote --file=worker/schema.sql
npx wrangler secret put RATE_LIMIT_SALT
npx wrangler deploy
```

`RATE_LIMIT_SALT` 输入任意足够长的随机字符串即可，例如密码管理器生成的
32 位随机值。部署成功后会得到 `https://...workers.dev` 地址。

## 让 Skill 自动发布

```bash
export TRAVEL_GUIDE_API="https://你的服务.workers.dev"
bash scripts/publish-site.sh /path/to/generated-site
```

脚本会返回公开链接和编辑链接。生成站里的 Commons 本地图片会自动改成公开
图片地址，因此其他设备打开也能看到。

## 数据与限制

- 每个 IP 每天最多创建 20 个行程
- 单个行程 JSON 最多 750 KB
- 每个行程保留最近 20 个历史版本
- 同时编辑使用 revision 检查，旧页面不会静默覆盖新版本
- `POST /api/trips/:id/rotate-token` 可重置编辑链接，旧链接立即失效

Cloudflare 免费额度足够个人和小范围公开使用。需要自定义域名时，再在 Worker
设置里绑定即可。

# Site template（与「行程库」同款 + 云端共享协作壳）

本目录是 Skill 生成行程网页时复制的前端模板，包含：

- 对账单式预算总览 + 多出发地切换
- 预约提醒横幅与订票直达链接
- 默认展开全部天数 + 吸顶日期切换栏 + 单天翻页器
- 桌面 Leaflet 路线图 + 手机 Google Maps 逐站打点
- 在线编辑增强：上下移动站点顺序、Wikimedia Commons 在线自动搜图
- 云端共享与协作（`share.js`）：公开只读查看、一键「复制并修改」（Fork）、私密链接自动保存、最近 20 版历史回滚、重置编辑密钥、多人冲突刷新

## Agent 生成流程

1. `bash scripts/new-site.sh /abs/path/to/site`
2. 写入 `data.js`（`window.SEED_TRIPS`）并用 `scripts/fetch-place-photo.sh` 抓取景点实景图
3. `bash scripts/serve.sh /abs/path/to/site 8766` 启动本地预览
4. `bash scripts/publish-site.sh /abs/path/to/site` 发布到云端共享服务，把公开查看链接和私密编辑链接返回给用户

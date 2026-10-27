# Site template（与正式「行程库」同款）

这套文件来自 [aladdin0306/travel-guides](https://github.com/aladdin0306/travel-guides)：同一套前端（列表、预算、预约、Leaflet 地图、手机谷歌打点、导入导出）。

当前种子数据是 **澳洲示例**（`data.js`）。用 Skill 给用户生成行程时：

1. 复制整个 `template/`（或本仓库的 `demo/`）到新目录 / 新仓库  
2. 改写 `data.js` 里的 `SEED_TRIPS` 为用户的行程  
3. 把图片放进 `photos/`，并在 `PHOTOS` 里登记署名  
4. 本地 `python3 -m http.server` 预览（手机同一 Wi‑Fi 可打开局域网 IP）  
5. 推到用户的 GitHub Pages  

能力清单见 Skill 主说明。

(function () {
  const defaultApi = "https://static-travel-guide.huqimeng0306.workers.dev";
  const route = parseRoute(location.pathname);
  const apiBase = String(window.TRAVEL_SHARE_API || (route ? location.origin : defaultApi)).replace(/\/$/, "");
  const shareButton = document.querySelector("#share-btn");
  const forkButton = document.querySelector("#fork-btn");
  const reloadConflictButton = document.querySelector("#conflict-reload-btn");
  const status = document.querySelector("#share-status");
  const dialog = document.querySelector("#share-dialog");
  const publicInput = document.querySelector("#public-link");
  const editInput = document.querySelector("#edit-link");
  const closeButton = document.querySelector("#share-close");
  const copyPublic = document.querySelector("#copy-public");
  const copyEdit = document.querySelector("#copy-edit");
  const manageBox = document.querySelector("#share-manage-box");
  const rotateTokenButton = document.querySelector("#rotate-token-btn");
  const loadRevisionsButton = document.querySelector("#load-revisions-btn");
  const revisionList = document.querySelector("#revision-list");
  const deleteTripButton = document.querySelector("#delete-cloud-trip-btn");
  const sandboxNotice = document.querySelector("#sandbox-notice");
  const staticCloudBox = document.querySelector("#static-cloud-box");
  const staticCloudButton = document.querySelector("#static-cloud-btn");
  const dialogKicker = document.querySelector("#share-dialog-kicker");
  const dialogTitle = document.querySelector("#share-dialog-title");
  const dialogExplain = document.querySelector("#share-dialog-explain");
  const shareWarning = document.querySelector("#share-warning");
  const isStaticHosted = !route && !window.TRAVEL_SHARE_API && /^https?:$/i.test(location.protocol) && !/^(localhost|127\.0\.0\.1)$/i.test(location.hostname);

  let token = "";
  let revision = 0;
  let removed = false;
  let loading = false;
  let saving = false;
  let saveAgain = false;
  let lastSnapshot = "";
  let currentLinks = null;
  let saveTimer = 0;
  let dirty = false;

  window.TRAVEL_SHARE = {
    isSharedRoute: () => Boolean(route),
    isReadOnly: () => Boolean(route && route.mode !== "edit"),
    apiBase
  };

  if (route) {
    document.body.classList.add("shared-route");
    if (sandboxNotice) sandboxNotice.hidden = false;
    if (route.mode === "edit") {
      token = readToken(route.id);
      if (token) document.body.classList.add("shared-edit");
      else document.body.classList.add("shared-readonly");
    } else {
      document.body.classList.add("shared-readonly");
    }
    loadShared();
  }

  shareButton.addEventListener("click", async () => {
    if (currentLinks) return openShareDialog(currentLinks);
    if (route) {
      const publicUrl = `${location.origin}/t/${route.id}`;
      return openShareDialog({
        publicUrl,
        editUrl: token ? `${location.origin}/t/${route.id}/edit#token=${token}` : ""
      });
    }
    if (isStaticHosted) {
      return openStaticShareDialog();
    }
    await createShare(false);
  });

  if (staticCloudButton) {
    staticCloudButton.addEventListener("click", async () => {
      await createShare(false, staticCloudButton);
    });
  }

  if (forkButton) {
    forkButton.addEventListener("click", async () => {
      await createShare(true);
    });
  }

  if (reloadConflictButton) {
    reloadConflictButton.addEventListener("click", async () => {
      reloadConflictButton.hidden = true;
      await loadShared();
    });
  }

  if (rotateTokenButton) {
    rotateTokenButton.addEventListener("click", rotateToken);
  }

  if (loadRevisionsButton) {
    loadRevisionsButton.addEventListener("click", loadRevisions);
  }

  if (deleteTripButton) {
    deleteTripButton.addEventListener("click", deleteCloudTrip);
  }

  if (revisionList) {
    revisionList.addEventListener("click", async (event) => {
      const btn = event.target.closest("[data-restore]");
      if (!btn) return;
      const targetRev = Number(btn.dataset.restore);
      if (!Number.isInteger(targetRev)) return;
      if (!window.confirm(`确定恢复到第 ${targetRev} 版吗？当前版本也会保存在历史记录中。`)) return;
      await restoreRevision(targetRev);
    });
  }

  closeButton.addEventListener("click", () => dialog.close());
  copyPublic.addEventListener("click", () => copyValue(publicInput, copyPublic));
  copyEdit.addEventListener("click", () => copyValue(editInput, copyEdit));

  window.addEventListener("travelguide:save", () => {
    if (removed || !route || route.mode !== "edit" || !token || loading) return;
    const next = snapshot();
    if (!next || next === lastSnapshot) return;
    dirty = true;
    setStatus("有未保存修改…", "working");
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveRemote, 600);
  });

  window.addEventListener("beforeunload", (event) => {
    if (!dirty && !saving) return;
    event.preventDefault();
    event.returnValue = "";
  });

  async function loadShared() {
    loading = true;
    if (reloadConflictButton) reloadConflictButton.hidden = true;
    setStatus("正在读取共享行程…", "working");
    try {
      const response = await fetch(`${apiBase}/api/trips/${route.id}`, {
        headers: { Accept: "application/json" }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "共享行程读取失败。");

      revision = data.revision;
      window.TRAVEL_GUIDE_APP.loadShared({ trip: data.trip, booked: data.booked || {} });
      lastSnapshot = snapshot();
      dirty = false;
      if (data.trip && data.trip.title) {
        document.title = `${data.trip.title} | 行程库`;
      }

      const canEdit = route.mode === "edit" && token;
      if (canEdit) {
        document.body.classList.remove("shared-readonly");
        document.body.classList.add("shared-edit");
        setStatus(`可编辑 · v${revision} 已保存`, "saved");
      } else if (route.mode === "edit") {
        document.body.classList.add("shared-readonly");
        setStatus("编辑密钥缺失 · 仅可查看", "error");
      } else {
        setStatus("公开查看", "public");
      }
    } catch (error) {
      setStatus(error.message || "共享行程读取失败。", "error");
      document.querySelector("#main").innerHTML =
        `<section class="share-error"><h2>无法打开这个行程</h2><p>${escapeHtml(error.message)}</p></section>`;
    } finally {
      loading = false;
      document.documentElement.classList.remove("shared-loading");
    }
  }

  async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
    if (typeof AbortController !== "function") return fetch(url, options);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } catch (error) {
      if (error && error.name === "AbortError") {
        throw new Error("连接共享服务超时（当前网络可能无法直连 workers.dev）。");
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function createShare(isFork, explicitBtn) {
    const base = apiBase || location.origin;
    const triggerBtn = explicitBtn || (isFork && forkButton ? forkButton : shareButton);
    triggerBtn.disabled = true;
    setStatus(isFork ? "正在复制为你的可编辑副本…" : "正在生成分享链接…", "working");
    try {
      const payload = portablePayload(window.TRAVEL_GUIDE_APP.getPayload());
      if (isFork && payload.trip && payload.trip.title && !/副本$/.test(payload.trip.title)) {
        payload.trip.title = `${payload.trip.title}（副本）`;
      }
      const response = await fetchWithTimeout(`${base}/api/trips`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "发布失败。");
      if (isFork && data.editUrl) {
        location.href = data.editUrl;
        return;
      }
      currentLinks = data;
      setStatus("分享链接已生成", "saved");
      openShareDialog(data);
    } catch (error) {
      setStatus(isStaticHosted ? "" : "当前站点未配置共享服务", isStaticHosted ? "" : "error");
      window.alert(`${error.message || "发布失败。"}\n\n${isStaticHosted ? "可直接复制当前静态链接发给朋友，或用右上角「··· → 导出 JSON 备份」传递修改。" : "如果这是本地预览，请让 Agent 使用 scripts/publish-gh-pages.sh 或 scripts/publish-site.sh 发布。"}`);
    } finally {
      triggerBtn.disabled = false;
    }
  }

  async function saveRemote() {
    const nextSnapshot = snapshot();
    if (!nextSnapshot || nextSnapshot === lastSnapshot) {
      dirty = false;
      return;
    }
    if (saving) {
      saveAgain = true;
      return;
    }

    saving = true;
    setStatus("正在保存…", "working");
    try {
      const payload = portablePayload(window.TRAVEL_GUIDE_APP.getPayload());
      const response = await fetch(`${apiBase}/api/trips/${route.id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...payload, expectedRevision: revision })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setStatus("别人刚修改过此行程", "error");
          if (reloadConflictButton) reloadConflictButton.hidden = false;
          return;
        }
        throw new Error(data.error || "保存失败。");
      }
      revision = data.revision;
      lastSnapshot = snapshot();
      dirty = snapshot() !== lastSnapshot;
      if (reloadConflictButton) reloadConflictButton.hidden = true;
      setStatus(`可编辑 · v${revision} 已保存`, "saved");
    } catch (error) {
      setStatus(error.message || "保存失败，请稍后再试", "error");
    } finally {
      saving = false;
      if (saveAgain) {
        saveAgain = false;
        saveRemote();
      }
    }
  }

  async function loadRevisions() {
    if (!route || !token || !revisionList) return;
    revisionList.innerHTML = `<p class="muted" style="margin:4px 0;font-size:12px;">正在读取历史版本…</p>`;
    try {
      const response = await fetch(`${apiBase}/api/trips/${route.id}/revisions`, {
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "读取失败");
      const list = data.revisions || [];
      if (!list.length) {
        revisionList.innerHTML = `<p class="muted" style="margin:4px 0;font-size:12px;">暂无历史旧版本（当前为 v${data.currentRevision || revision}）。修改保存后会自动生成历史快照。</p>`;
        return;
      }
      revisionList.innerHTML = list.map((item) => {
        const timeText = formatTime(item.createdAt);
        return `<div class="revision-item">
          <span><b>v${escapeHtml(item.revision)}</b><small>${escapeHtml(timeText)}</small></span>
          <button type="button" class="btn btn-sm" data-restore="${escapeHtml(item.revision)}">恢复此版</button>
        </div>`;
      }).join("");
    } catch (error) {
      revisionList.innerHTML = `<p class="muted" style="margin:4px 0;font-size:12px;">${escapeHtml(error.message || "读取历史版本失败")}</p>`;
    }
  }

  async function restoreRevision(targetRev) {
    if (!route || !token) return;
    setStatus(`正在恢复到 v${targetRev}…`, "working");
    try {
      const response = await fetch(`${apiBase}/api/trips/${route.id}/restore`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ revision: targetRev })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "恢复失败");
      dialog.close();
      await loadShared();
      setStatus(`已恢复 v${targetRev}（当前 v${data.revision}）`, "saved");
    } catch (error) {
      window.alert(error.message || "恢复历史版本失败");
    }
  }

  async function deleteCloudTrip() {
    if (removed || !route || !token || !deleteTripButton) return;
    if (!window.confirm("彻底删除后，公开链接、编辑链接和全部历史版本都会立即失效，且无法恢复。确定删除这份云端行程吗？")) return;
    deleteTripButton.disabled = true;
    try {
      const response = await fetch(`${apiBase}/api/trips/${route.id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "删除失败。");
      removed = true;
      dirty = false;
      clearTimeout(saveTimer);
      const key = `travel-guide-edit-token:${route.id}`;
      try { localStorage.removeItem(key); } catch {}
      try { sessionStorage.removeItem(key); } catch {}
      token = "";
      if (dialog.open) dialog.close();
      document.body.classList.remove("shared-edit");
      document.body.classList.add("shared-readonly");
      document.querySelector("#main").innerHTML =
        `<section class="share-error"><h2>云端行程已删除</h2><p>公开链接和历史版本都已清除。可以关闭这个页面。</p></section>`;
      setStatus("已从云端删除", "saved");
    } catch (error) {
      window.alert(error.message || "删除失败");
      deleteTripButton.disabled = false;
    }
  }

  async function rotateToken() {
    if (!route || !token) return;
    if (!window.confirm("重置后，之前的编辑链接会立即失效，只有新链接能修改。确定重置吗？")) return;
    rotateTokenButton.disabled = true;
    try {
      const response = await fetch(`${apiBase}/api/trips/${route.id}/rotate-token`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "重置失败");
      const newHash = new URL(data.editUrl).hash;
      const newToken = new URLSearchParams(newHash.slice(1)).get("token") || "";
      if (newToken) {
        token = newToken;
        saveToken(route.id, newToken);
      }
      editInput.value = data.editUrl;
      setStatus("编辑密钥已重置", "saved");
    } catch (error) {
      window.alert(error.message || "重置密钥失败");
    } finally {
      rotateTokenButton.disabled = false;
    }
  }

  function snapshot() {
    try {
      return JSON.stringify(window.TRAVEL_GUIDE_APP.getPayload());
    } catch {
      return "";
    }
  }

  function portablePayload(payload) {
    const clone = structuredClone(payload);
    const base = (apiBase || location.origin).replace(/\/$/, "");
    const convertPic = (holder) => {
      if (!holder) return;
      const pic = holder.coverPhoto || holder.photo;
      const key = holder.coverPhoto ? "coverPhoto" : "photo";
      if (!pic) return;
      const file = commonsFile(pic.link) || commonsFile(pic.src);
      if (file) {
        const enc = encodeURIComponent(file).replace(/\(/g, "%28").replace(/\)/g, "%29");
        pic.src = `${base}/api/img?file=${enc}&w=1200`;
        return;
      }
      if (/^https:\/\//i.test(pic.src || "")) return;
      delete holder[key];
    };
    convertPic(clone.trip);
    for (const day of clone.trip.days || []) {
      for (const item of day.items || []) {
        convertPic(item);
      }
    }
    return clone;
  }

  function commonsFile(link) {
    try {
      const url = new URL(link, location.origin);
      if (url.pathname.startsWith("/api/img")) {
        return url.searchParams.get("file") || "";
      }
      const redir = "/wiki/Special:Redirect/file/";
      const rIdx = url.pathname.indexOf(redir);
      if (rIdx >= 0) return decodeURIComponent(url.pathname.slice(rIdx + redir.length));
      const marker = "/wiki/File:";
      const index = url.pathname.indexOf(marker);
      const file = index >= 0 ? decodeURIComponent(url.pathname.slice(index + marker.length)) : "";
      return /^placeholder:/i.test(file) ? "" : file;
    } catch {
      return "";
    }
  }

  function saveToken(id, value) {
    const key = `travel-guide-edit-token:${id}`;
    try { localStorage.setItem(key, value); } catch {}
    try { sessionStorage.setItem(key, value); } catch {}
  }

  function readToken(id) {
    const params = new URLSearchParams(location.hash.slice(1));
    const fromHash = params.get("token") || "";
    const key = `travel-guide-edit-token:${id}`;
    if (fromHash) {
      saveToken(id, fromHash);
      try {
        history.replaceState(null, "", `${location.pathname}${location.search}`);
      } catch {}
      return fromHash;
    }
    try {
      const fromLocal = localStorage.getItem(key);
      if (fromLocal) return fromLocal;
    } catch {}
    try {
      return sessionStorage.getItem(key) || "";
    } catch {
      return "";
    }
  }

  function openStaticShareDialog() {
    if (dialogKicker) dialogKicker.textContent = "分享静态路书";
    if (dialogTitle) dialogTitle.textContent = "直接转发当前网页链接";
    if (dialogExplain) dialogExplain.textContent = "此页面托管在静态网站上，国内手机与电脑可直接打开，无需依赖海外云端沙盒。";
    publicInput.value = location.href.split("#")[0];
    editInput.value = "";
    document.querySelector("#edit-link-row").hidden = true;
    if (manageBox) manageBox.hidden = true;
    if (staticCloudBox) staticCloudBox.hidden = false;
    if (shareWarning) {
      shareWarning.textContent = "你在本页面做的修改仅保存在当前浏览器；要同步给同行人，请点右上角「··· → 导出 JSON 备份」或让 Agent 更新静态站点。";
    }
    dialog.showModal();
  }

  function openShareDialog(links) {
    if (dialogKicker) dialogKicker.textContent = "分享行程";
    if (dialogTitle) dialogTitle.textContent = "两个链接，两种权限";
    if (dialogExplain) dialogExplain.textContent = "公开链接只能查看；编辑链接相当于密码，请只发给共同规划的人。";
    publicInput.value = links.publicUrl || "";
    editInput.value = links.editUrl || "";
    document.querySelector("#edit-link-row").hidden = !links.editUrl;
    if (staticCloudBox) staticCloudBox.hidden = true;
    if (shareWarning) {
      shareWarning.textContent = "公共演示沙盒单行程限 100 KB、超过 90 天未编辑自动清理，不承诺永久保存。请勿把编辑链接公开发布，也不要写入身份证、护照、手机号或预订号。";
    }
    const canManage = Boolean(route && route.mode === "edit" && token);
    if (manageBox) {
      manageBox.hidden = !canManage;
      if (canManage) loadRevisions();
    }
    dialog.showModal();
  }

  async function copyValue(input, button) {
    if (!input.value) return;
    try {
      await navigator.clipboard.writeText(input.value);
    } catch {
      input.focus();
      input.select();
      try { document.execCommand("copy"); } catch {}
    }
    const before = button.textContent;
    button.textContent = "已复制";
    window.setTimeout(() => { button.textContent = before; }, 1200);
  }

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = `share-status ${kind || ""}`;
    status.hidden = !text;
  }

  function formatTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function parseRoute(pathname) {
    const match = pathname.match(/^\/t\/([A-Za-z0-9_-]+)(?:\/(edit))?\/?$/);
    return match ? { id: match[1], mode: match[2] || "view" } : null;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
  }
})();

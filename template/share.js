(function () {
  const route = parseRoute(location.pathname);
  const apiBase = String(window.TRAVEL_SHARE_API || (route ? location.origin : "")).replace(/\/$/, "");
  const shareButton = document.querySelector("#share-btn");
  const status = document.querySelector("#share-status");
  const dialog = document.querySelector("#share-dialog");
  const publicInput = document.querySelector("#public-link");
  const editInput = document.querySelector("#edit-link");
  const closeButton = document.querySelector("#share-close");
  const copyPublic = document.querySelector("#copy-public");
  const copyEdit = document.querySelector("#copy-edit");

  let token = "";
  let revision = 0;
  let loading = false;
  let saving = false;
  let saveAgain = false;
  let lastSnapshot = "";
  let currentLinks = null;
  let saveTimer = 0;

  window.TRAVEL_SHARE = {
    isSharedRoute: () => Boolean(route),
    isReadOnly: () => Boolean(route && route.mode !== "edit"),
    apiBase
  };

  if (route) {
    document.body.classList.add("shared-route");
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
    await createShare();
  });

  closeButton.addEventListener("click", () => dialog.close());
  copyPublic.addEventListener("click", () => copyValue(publicInput, copyPublic));
  copyEdit.addEventListener("click", () => copyValue(editInput, copyEdit));

  window.addEventListener("travelguide:save", () => {
    if (!route || route.mode !== "edit" || !token || loading) return;
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveRemote, 700);
  });

  async function loadShared() {
    loading = true;
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

      const canEdit = route.mode === "edit" && token;
      if (canEdit) {
        document.body.classList.remove("shared-readonly");
        document.body.classList.add("shared-edit");
        setStatus("可编辑 · 已保存", "saved");
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

  async function createShare() {
    const base = apiBase || location.origin;
    shareButton.disabled = true;
    setStatus("正在生成分享链接…", "working");
    try {
      const payload = portablePayload(window.TRAVEL_GUIDE_APP.getPayload());
      const response = await fetch(`${base}/api/trips`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "发布失败。");
      currentLinks = data;
      setStatus("分享链接已生成", "saved");
      openShareDialog(data);
    } catch (error) {
      setStatus("当前站点未配置共享服务", "error");
      window.alert(`${error.message || "发布失败。"}\n\n如果这是本地预览，请让 Agent 使用 scripts/publish-site.sh 发布。`);
    } finally {
      shareButton.disabled = false;
    }
  }

  async function saveRemote() {
    const nextSnapshot = snapshot();
    if (!nextSnapshot || nextSnapshot === lastSnapshot) return;
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
          setStatus("别人刚修改过 · 刷新后再编辑", "error");
          return;
        }
        throw new Error(data.error || "保存失败。");
      }
      revision = data.revision;
      lastSnapshot = snapshot();
      setStatus("可编辑 · 已保存", "saved");
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

  function snapshot() {
    try {
      return JSON.stringify(window.TRAVEL_GUIDE_APP.getPayload());
    } catch {
      return "";
    }
  }

  function portablePayload(payload) {
    const clone = structuredClone(payload);
    for (const day of clone.trip.days || []) {
      for (const item of day.items || []) {
        if (!item.photo) continue;
        if (/^https:\/\//i.test(item.photo.src || "")) continue;
        const file = commonsFile(item.photo.link);
        if (file) {
          item.photo.src = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=1400`;
        } else {
          delete item.photo;
        }
      }
    }
    return clone;
  }

  function commonsFile(link) {
    try {
      const url = new URL(link);
      const marker = "/wiki/File:";
      const index = url.pathname.indexOf(marker);
      const file = index >= 0 ? decodeURIComponent(url.pathname.slice(index + marker.length)) : "";
      return /^placeholder:/i.test(file) ? "" : file;
    } catch {
      return "";
    }
  }

  function readToken(id) {
    const params = new URLSearchParams(location.hash.slice(1));
    const fromHash = params.get("token") || "";
    const key = `travel-guide-edit-token:${id}`;
    if (fromHash) {
      sessionStorage.setItem(key, fromHash);
      return fromHash;
    }
    return sessionStorage.getItem(key) || "";
  }

  function openShareDialog(links) {
    publicInput.value = links.publicUrl || "";
    editInput.value = links.editUrl || "";
    document.querySelector("#edit-link-row").hidden = !links.editUrl;
    dialog.showModal();
  }

  async function copyValue(input, button) {
    if (!input.value) return;
    await navigator.clipboard.writeText(input.value);
    const before = button.textContent;
    button.textContent = "已复制";
    window.setTimeout(() => { button.textContent = before; }, 1200);
  }

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = `share-status ${kind || ""}`;
    status.hidden = !text;
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

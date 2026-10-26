(() => {
  const trip = window.DEMO_TRIP;
  if (!trip) {
    document.getElementById("main").textContent = "缺少 DEMO_TRIP";
    return;
  }

  const FLAG = { required: "必须预约", recommended: "建议预约", none: "" };
  const rate = Number(trip.budget.cnyRate) || 0;
  let originId = (trip.budget.origins && trip.budget.origins[0] && trip.budget.origins[0].id) || "";

  function money(n) {
    return `A$${Number(n).toLocaleString("en-AU", { maximumFractionDigits: 0 })}`;
  }

  function cny(n) {
    if (!rate) return "";
    return `≈ ¥${Math.round(n * rate).toLocaleString("zh-CN")}`;
  }

  function itemCost(item) {
    const a = item.cost && Number(item.cost.amount);
    return Number.isFinite(a) ? a : 0;
  }

  function extrasSum() {
    return (trip.budget.extras || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);
  }

  function originCost() {
    const o = (trip.budget.origins || []).find((x) => x.id === originId);
    if (!o) return 0;
    if (Number.isFinite(Number(o.amount))) return Number(o.amount);
    if (Number.isFinite(Number(o.cny)) && rate) return Number(o.cny) / rate;
    return 0;
  }

  function cats() {
    const out = { flight: 0, stay: 0, transport: 0, sight: 0, food: 0, other: 0 };
    out.flight += originCost();
    for (const e of trip.budget.extras || []) {
      const key = out[e.cat] != null ? e.cat : "other";
      out[key] += Number(e.amount) || 0;
    }
    for (const day of trip.days) {
      for (const item of day.items || []) {
        const a = itemCost(item);
        if (!a) continue;
        const key =
          item.kind === "stay" ? "stay" :
          item.kind === "transport" ? "transport" :
          item.kind === "food" ? "food" :
          item.kind === "sight" ? "sight" : "other";
        out[key] += a;
      }
    }
    return out;
  }

  function total() {
    const c = cats();
    return Object.values(c).reduce((a, b) => a + b, 0);
  }

  function cityRuns() {
    const runs = [];
    for (const day of trip.days) {
      const last = runs[runs.length - 1];
      if (last && last.city === day.city) last.n += 1;
      else runs.push({ city: day.city, n: 1 });
    }
    return runs;
  }

  function pending() {
    const rows = [];
    for (const day of trip.days) {
      for (const item of day.items || []) {
        if (item.reservation === "required" || item.reservation === "recommended") {
          rows.push({ day, item });
        }
      }
    }
    return rows;
  }

  function render() {
    const plan = cats();
    const sum = total();
    const todo = pending().filter((r) => r.item.reservation === "required");
    const labels = { flight: "机票", stay: "住宿", transport: "交通", sight: "活动", food: "餐饮", other: "其他" };

    document.getElementById("main").innerHTML = `
      <div class="signal">
        <section class="card">
          <p class="eyebrow">01 总览 · Demo</p>
          <h1>${trip.title}</h1>
          <p class="meta">${trip.start} – ${trip.end} · ${trip.budget.party || ""}</p>
          <div class="hops">${cityRuns().map((r) => `<span class="hop">${r.city} ${r.n}天</span>`).join("")}</div>
          <p class="summary">${trip.summary || ""}</p>
        </section>
        <section class="card bd">
          <p class="eyebrow">02 预算 · 每人（示意合计）</p>
          <p class="amt">${money(sum)}</p>
          <p class="cny">${cny(sum)}</p>
          <p class="meta">含所选出发地机票估算 · 汇率 ${rate || "—"}（${trip.budget.rateDate || ""}）</p>
          <div class="origins">
            ${(trip.budget.origins || []).map((o) =>
              `<button type="button" class="${o.id === originId ? "on" : ""}" data-origin="${o.id}">${o.label}</button>`
            ).join("")}
          </div>
          <ul class="bars">
            ${Object.keys(labels).filter((k) => plan[k] > 0).map((k) =>
              `<li><span>${labels[k]}</span><b>${money(plan[k])}</b></li>`
            ).join("")}
          </ul>
        </section>
      </div>
      ${todo.length ? `<div class="banner"><b>必须预约 ${todo.length} 项</b> · 这是示例数据，生成自己的线路时按同样字段填写</div>` : ""}
      ${trip.days.map((day) => `
        <article class="day">
          <h2>${day.date} · ${day.title || ""}</h2>
          <div class="city">${day.city || ""}</div>
          ${(day.items || []).map((item) => `
            <div class="stop">
              <span class="t">${item.time || ""}</span>
              <span class="n">${item.name}<small>${item.note ? String(item.note).slice(0, 80) + (item.note.length > 80 ? "…" : "") : ""}</small></span>
              ${item.reservation && item.reservation !== "none"
                ? `<span class="flag">${FLAG[item.reservation] || item.reservation}</span>`
                : `<span></span>`}
            </div>
          `).join("")}
        </article>
      `).join("")}
    `;

    document.querySelectorAll("[data-origin]").forEach((btn) => {
      btn.addEventListener("click", () => {
        originId = btn.getAttribute("data-origin");
        render();
        drawMap();
      });
    });
  }

  let map;
  let layer;
  function drawMap() {
    if (!map) {
      map = L.map("map");
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);
      layer = L.layerGroup().addTo(map);
    }
    layer.clearLayers();
    const pts = [];
    let n = 0;
    for (const day of trip.days) {
      for (const item of day.items || []) {
        if (item.lat == null || item.lng == null) continue;
        n += 1;
        const m = L.marker([item.lat, item.lng]).bindPopup(`<b>${n}. ${item.name}</b><br>${day.date} · ${day.city || ""}`);
        layer.addLayer(m);
        pts.push([item.lat, item.lng]);
      }
    }
    if (pts.length) map.fitBounds(pts, { padding: [28, 28] });
    else map.setView([-33.86, 151.21], 5);
  }

  render();
  drawMap();
})();

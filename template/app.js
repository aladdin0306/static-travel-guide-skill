const STORAGE_KEY = "travel-guides-v2";
const KIND = { sight: "景点", food: "餐厅", transport: "交通", stay: "住宿" };
const FLAG = { required: "必须预约", recommended: "建议预约", none: "不用预约" };
const KIND_ICON = { sight: "camera", food: "food", transport: "bus", stay: "bed" };
const COST_CAT = { flight: "国际机票", stay: "住宿", transport: "交通", sight: "门票和活动", food: "吃饭", other: "签证和其他" };
const CURRENCY = {
  AUD: { lead: "澳币约 ", unit: "澳元", per: 1, step: 1, format: (text) => `A$${text}` },
  JPY: { lead: "约 ", unit: "日元", per: 100, step: 10, format: (text) => `${text} 日元` }
};

// Lucide icons (ISC), https://lucide.dev
const ICONS = {
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  bus: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>'
};

function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

document.querySelectorAll("[data-icon]").forEach((node) => {
  node.outerHTML = icon(node.dataset.icon);
});

const state = load();
let map;
let markers = [];
let dayFilter = "";
let bookingsOpen = false;
let budgetOpen = false;
let editing = null;

const main = document.querySelector("#main");
const tripList = document.querySelector("#trip-list");
const editor = document.querySelector("#editor");
const form = document.querySelector("#editor-form");

function load() {
  const seed = structuredClone(window.SEED_TRIPS);
  let booked = {};
  let tripId = seed[0].id;
  let origin = "";
  let extras = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved) {
      booked = saved.booked || {};
      tripId = saved.tripId || tripId;
      origin = saved.origin || "";
      const seedIds = new Set(seed.map((item) => item.id));
      extras = upgrade((saved.trips || []).filter((item) => !seedIds.has(item.id)));
    }
  } catch (_) { /* keep the seed trip */ }
  return { trips: [...seed, ...extras], booked, tripId, origin };
}

function upgrade(trips) {
  for (const item of trips.flatMap((one) => (one.days || []).flatMap((day) => day.items || []))) {
    if (item.cost && !Number.isFinite(item.cost.amount) && Number.isFinite(item.cost.aud)) item.cost.amount = item.cost.aud;
  }
  return trips;
}

function save() {
  if (!(window.TRAVEL_SHARE && window.TRAVEL_SHARE.isSharedRoute())) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      trips: state.trips,
      booked: state.booked,
      tripId: state.tripId,
      origin: state.origin
    }));
  }
  window.dispatchEvent(new CustomEvent("travelguide:save"));
}

function trip() {
  return state.trips.find((item) => item.id === state.tripId) || state.trips[0];
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

function weekday(date) {
  if (!date) return "";
  const day = new Date(`${date}T12:00:00`).getDay();
  return "日一二三四五六"[day];
}

function safeUrl(url) {
  if (!url || !/^https:\/\//i.test(url)) return "";
  return url;
}

function isMobileMaps() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.matchMedia("(max-width: 820px)").matches);
}

function mappableItems(items) {
  return (items || []).filter((item) =>
    (Number.isFinite(item.lat) && Number.isFinite(item.lng)) || item.name || item.address);
}

function googleUrl(item) {
  if (Number.isFinite(item.lat) && Number.isFinite(item.lng)) {
    const query = item.name ? `${item.name} @${item.lat},${item.lng}` : `${item.lat},${item.lng}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  const query = `${item.name || ""} ${item.address || ""}`.trim();
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : "";
}

function googleDayUrl(items) {
  const points = (items || []).filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
  if (!points.length) return "";
  if (points.length === 1) return googleUrl(points[0]);
  if (isMobileMaps()) return "";
  return `https://www.google.com/maps/dir/${points.map((item) => `${item.lat},${item.lng}`).join("/")}`;
}

function openPinSheet(dayId) {
  const day = trip().days.find((item) => item.id === dayId);
  const sheet = document.querySelector("#pin-sheet");
  const list = document.querySelector("#pin-sheet-list");
  if (!day || !sheet || !list) return;
  const points = mappableItems(day.items).filter((item) => googleUrl(item));
  if (!points.length) return;
  if (points.length === 1) {
    window.open(googleUrl(points[0]), "_blank", "noopener");
    return;
  }
  document.querySelector("#pin-sheet-title").textContent =
    `${monthDay(day.date) || "这一天"} · 在谷歌地图打点`;
  list.innerHTML = points.map((item, index) => `
    <a class="pin-row" href="${esc(googleUrl(item))}" target="_blank" rel="noopener">
      <span class="pin-num">${index + 1}</span>
      <span class="pin-meta"><b>${esc(item.name)}</b><small>${esc(item.time || "—")}${item.address ? ` · ${esc(item.address)}` : ""}</small></span>
      <span class="pin-go">${icon("pin")}打开</span>
    </a>`).join("");
  sheet.showModal();
}

function pending(current = trip()) {
  const rows = [];
  for (const day of current.days) {
    for (const item of day.items) {
      if (item.reservation === "none") continue;
      if (state.booked[item.id]) continue;
      rows.push({ day, item });
    }
  }
  rows.sort((a, b) => (a.item.reservation === "required" ? -1 : 1) - (b.item.reservation === "required" ? -1 : 1));
  return rows;
}

function hasCost(item) {
  return !!(item && item.cost && Number.isFinite(item.cost.amount));
}

function costCat(entry) {
  const cat = (entry.cost && entry.cost.cat) || entry.cat || entry.kind;
  return COST_CAT[cat] ? cat : "other";
}

function currency(current = trip()) {
  return CURRENCY[current && current.budget && current.budget.currency] || CURRENCY.AUD;
}

function local(amount, exact) {
  const unit = currency();
  const value = Math.abs(exact ? amount : Math.round(amount / unit.step) * unit.step);
  return `${amount < 0 ? "−" : ""}${unit.format(value.toLocaleString("en-US", { maximumFractionDigits: 2 }))}`;
}

function cnyRate() {
  const current = trip();
  const value = Number(current && current.budget && current.budget.cnyRate);
  return value > 0 ? value : 0;
}

function cny(amount, known) {
  const value = Number.isFinite(known) ? known : amount * cnyRate();
  if (!Number.isFinite(known) && !cnyRate()) return "";
  const rounded = Math.abs(value) >= 1000 ? Math.round(Math.abs(value) / 10) * 10 : Math.round(Math.abs(value));
  return `${value < 0 ? "−" : ""}¥${rounded.toLocaleString("en-US")}`;
}

function money(amount, exact, known) {
  const rmb = cny(amount, known);
  return `${local(amount, exact)}${rmb ? `<span class="rmb">${rmb}</span>` : ""}`;
}

function pickOrigin(current) {
  const list = (current.budget && current.budget.origins) || [];
  return list.find((item) => item.id === state.origin) || list[0] || null;
}

function originLines(current) {
  const origin = pickOrigin(current);
  if (!origin) return [];
  const rate = Number(current.budget.cnyRate);
  const lines = [];
  if (Number.isFinite(origin.cny) && rate) {
    lines.push({ label: `${origin.label}往返机票`, cat: "flight", amount: Math.round(origin.cny / rate), cny: origin.cny, note: origin.note || "" });
  }
  return lines.concat(origin.adjust || []);
}

function dayCost(day) {
  return day.items.reduce((sum, item) => sum + (hasCost(item) && !isOptional(item) ? item.cost.amount : 0), 0);
}

function budgetOf(current) {
  const cats = {};
  const optional = [];
  let total = 0;
  const days = current.days.map((day) => {
    for (const item of day.items) {
      if (!hasCost(item)) continue;
      if (isOptional(item)) {
        if (item.cost.amount > 0) optional.push({ day, item });
        continue;
      }
      cats[costCat(item)] = (cats[costCat(item)] || 0) + item.cost.amount;
    }
    const sum = dayCost(day);
    total += sum;
    return { day, sum };
  });
  const rate = cnyRate();
  const extras = [...originLines(current), ...((current.budget && current.budget.extras) || [])].map((extra) =>
    Number.isFinite(extra.amount) || !Number.isFinite(extra.cny) || !rate ? extra : { ...extra, amount: Math.round(extra.cny / rate) });
  for (const extra of extras) {
    if (!Number.isFinite(extra.amount)) continue;
    cats[costCat(extra)] = (cats[costCat(extra)] || 0) + extra.amount;
    total += extra.amount;
  }
  return { total, cats, days, extras, optional };
}

function safePhoto(item) {
  const pic = item && item.photo;
  if (!pic || !/^(photos\/[\w-]+\.jpg|https:\/\/[^'"()\s]+)$/.test(pic.src || "")) return null;
  return pic;
}

function firstPhoto(current) {
  for (const day of current.days) {
    for (const item of day.items) {
      const pic = safePhoto(item);
      if (pic) return pic;
    }
  }
  return null;
}

function monthDay(date) {
  if (!date) return "";
  const [, m, d] = date.split("-").map(Number);
  return `${m}月${d}日`;
}

function tripRange(current) {
  if (!current.start) return "日期未定";
  const days = Math.round((new Date(`${current.end || current.start}T12:00:00`) - new Date(`${current.start}T12:00:00`)) / 86400000) + 1;
  return `${monthDay(current.start)} – ${monthDay(current.end || current.start)} · ${days} 天`;
}

function renderTrips() {
  tripList.innerHTML = state.trips.map((item) => {
    const left = pending(item).filter((row) => row.item.reservation === "required").length;
    const cover = firstPhoto(item);
    return `<button type="button" class="trip-card${item.id === trip().id ? " active" : ""}" data-trip="${esc(item.id)}">
      <span class="trip-thumb"${cover ? ` style="background-image:url('${esc(cover.src)}')"` : ""}>${cover ? "" : icon("compass")}</span>
      <span class="trip-meta">
        <b>${esc(item.title)}</b>
        <span>${esc(tripRange(item))}</span>
        ${left ? `<em>${left} 项必须预约没订</em>` : `<span class="ok">该订的都订了</span>`}
      </span>
    </button>`;
  }).join("");
}

function renderMain() {
  const current = trip();
  const chosen = activeDay(current);
  const todo = pending(current);
  const required = todo.filter((row) => row.item.reservation === "required");
  const suggested = todo.length - required.length;
  const days = dayFilter === "all" ? current.days : current.days.filter((day) => day.id === (chosen && chosen.id));
  const route = cityRun(current.days)
    .map((run) => `<span class="hop">${esc(run.city)}<small>${run.n} 天</small></span>`)
    .join(`<span class="hop-sep">${icon("plane")}</span>`);

  main.innerHTML = `
    <section class="trip-head">
      <div class="trip-head-text">
        <p class="hero-dates">${esc(tripRange(current))}</p>
        <h2>${esc(current.title)}</h2>
        <div class="hero-route">${route}</div>
      </div>
      <div class="hero-tools edit-only">
        <button type="button" class="btn btn-sm" id="rename-trip">${icon("pencil")}改名</button>
        <button type="button" class="btn btn-sm" id="add-day">${icon("plus")}加一天</button>
        ${state.trips.length > 1 ? `<button type="button" class="btn btn-sm" id="delete-trip">${icon("trash")}删除</button>` : ""}
      </div>
    </section>

    <button type="button" class="booking-banner${required.length ? " due" : " done"}" id="toggle-books" aria-expanded="${bookingsOpen}">
      <span class="banner-icon">${icon(required.length ? "calendar" : "check")}</span>
      <span class="banner-text">
        <b>${required.length ? `还有 ${required.length} 项必须提前订` : "必须订的都订好了"}</b>
        <small>${suggested ? `另外 ${suggested} 项建议订` : "没有其他要订的"}</small>
      </span>
      <span class="banner-cta">${bookingsOpen ? "收起" : "查看并预约"}<span class="chev${bookingsOpen ? " up" : ""}">${icon("chevron")}</span></span>
    </button>
    ${bookingsOpen ? `<section class="book-list">
      ${todo.length ? todo.map(({ day, item }) => `
        <div class="book-row">
          <span class="flag ${esc(item.reservation)}">${FLAG[item.reservation]}</span>
          <span class="book-name"><b>${esc(item.name)}</b><small>${esc(monthDay(day.date))} · ${esc(day.city)}</small></span>
          ${safeUrl(item.bookingUrl) ? `<a class="btn btn-sm btn-book ${esc(item.reservation)}" href="${esc(safeUrl(item.bookingUrl))}" target="_blank" rel="noopener">${icon("calendar")}去预约</a>` : ""}
        </div>`).join("") : `<p class="muted">这趟没有还要处理的预约。</p>`}
    </section>` : ""}

    ${renderBudget(current)}

    <nav class="day-tabs" aria-label="选择哪一天">
      ${current.days.map((day, index) => {
        const [, m, d] = (day.date || "--").split("-");
        return `<button type="button" class="day-tab${dayFilter !== "all" && chosen && day.id === chosen.id ? " active" : ""}" data-day="${esc(day.id)}">
          <span class="dt-top">${day.date ? `${Number(m)}月 周${weekday(day.date)}` : `第${index + 1}天`}</span>
          <span class="dt-num">${day.date ? Number(d) : index + 1}</span>
          <span class="dt-city">${esc(day.city || "未定")}</span>
        </button>`;
      }).join("")}
      <button type="button" class="day-tab all${dayFilter === "all" ? " active" : ""}" data-day="all">
        <span class="dt-top">全部</span>
        <span class="dt-num">${current.days.length}</span>
        <span class="dt-city">天</span>
      </button>
    </nav>

    ${days.map((day) => renderDay(day, current.days.indexOf(day) + 1)).join("")}
  `;
  document.querySelector("#map-title").textContent = dayFilter === "all" ? "全程" : (chosen ? `${monthDay(chosen.date)} ${chosen.city}` : "这一天");
}

function renderBudget(current) {
  const plan = budgetOf(current);
  if (!plan.total) return "";
  const info = current.budget || {};
  const rate = Number(info.cnyRate);
  const left = plan.extras.filter((extra) => !Number.isFinite(extra.amount));
  const unit = currency(current);
  const origins = info.origins || [];
  const origin = pickOrigin(current);
  const cats = Object.keys(COST_CAT).filter((cat) => plan.cats[cat] > 0);
  const top = Math.max(...plan.days.map((row) => row.sum), 1);
  return `<section class="budget">
    <div class="budget-top">
      <div class="budget-sum">
        <p class="budget-label">预算 · 每人</p>
        <p class="budget-amount">${unit.lead}${local(plan.total)}${rate ? `<span class="rmb">约 ${cny(plan.total)}</span>` : ""}</p>
        <p class="budget-meta">${esc(info.party || "两人同住一间")}${origin ? ` · ${esc(origin.label)}出发 · 含国际机票` : ""}${left.length ? ` · 不含${esc(left.map((extra) => extra.label).join("、"))}` : ""}</p>
      </div>
      <button type="button" class="btn btn-sm budget-toggle" id="toggle-budget" aria-expanded="${budgetOpen}">${budgetOpen ? "收起明细" : "看明细"}<span class="chev${budgetOpen ? " up" : ""}">${icon("chevron")}</span></button>
    </div>
    ${origins.length > 1 ? `<div class="origin-pick" role="group" aria-label="从哪里出发">
      <span class="origin-label">出发地</span>
      <div class="origin-seg">
        ${origins.map((item) => `<button type="button" class="origin-btn${origin && item.id === origin.id ? " active" : ""}" data-origin="${esc(item.id)}" aria-pressed="${origin && item.id === origin.id}">${esc(item.label)}</button>`).join("")}
      </div>
    </div>` : ""}
    ${origin && origin.brief ? `<p class="origin-brief">${esc(origin.brief)}</p>` : ""}
    <div class="budget-bar" aria-hidden="true">
      ${cats.map((cat) => `<span class="cat-${cat}" style="width:${(plan.cats[cat] / plan.total * 100).toFixed(1)}%"></span>`).join("")}
    </div>
    <div class="budget-ledger" role="table" aria-label="分类明细">
      <div class="ledger-head" role="row">
        <span role="columnheader">项目</span>
        <span role="columnheader">当地货币</span>
        <span role="columnheader">人民币</span>
      </div>
      ${cats.map((cat) => {
        const amt = plan.cats[cat];
        const rmb = cny(amt);
        const pct = plan.total ? ((amt / plan.total) * 100).toFixed(0) : "0";
        return `<div class="ledger-row cat-${cat}" role="row">
          <span class="ledger-name" role="cell"><i aria-hidden="true"></i>${COST_CAT[cat]}<em>${pct}%</em></span>
          <span class="ledger-local" role="cell">${local(amt)}</span>
          <span class="ledger-cny" role="cell">${rmb || "—"}</span>
        </div>`;
      }).join("")}
    </div>
    ${budgetOpen ? `<div class="budget-detail">
      <h3 class="section-title">按天花费</h3>
      <p class="budget-hint">住宿算在入住当天。点下面某一天，可跳到当天行程。</p>
      <ol class="budget-days">
        ${plan.days.map(({ day, sum }) => {
          const rmb = cny(sum);
          return `<li><button type="button" class="budget-day-btn" data-day="${esc(day.id)}">
          <span class="bd-date">${esc(monthDay(day.date) || "未定")}<small>${esc(day.city || "")}</small></span>
          <span class="bd-bar" aria-hidden="true"><i style="width:${(sum / top * 100).toFixed(1)}%"></i></span>
          <span class="bd-amt"><b>${local(sum)}</b>${rmb ? `<small>${rmb}</small>` : ""}</span>
          <span class="bd-go">看当天${icon("chevron")}</span>
        </button></li>`;
        }).join("")}
      </ol>
      ${plan.extras.length ? `<h3 class="section-title">不跟某一站走的开销</h3>
      <ul class="budget-rows">
        ${plan.extras.map((extra) => `<li><span><b>${esc(extra.label)}</b><small>${esc(extra.note || "")}</small></span><em class="${Number.isFinite(extra.amount) ? "" : "none"}">${Number.isFinite(extra.amount) ? money(extra.amount, true, extra.cny) : "没算"}</em></li>`).join("")}
      </ul>` : ""}
      ${plan.optional.length ? `<h3 class="section-title">可选的，没算进总数</h3>
      <ul class="budget-rows">
        ${plan.optional.map(({ day, item }) => `<li><span><b>${esc(item.name)}</b><small>${esc(monthDay(day.date))} · ${esc(item.cost.note || "")}</small></span><em>${money(item.cost.amount, true)}</em></li>`).join("")}
      </ul>` : ""}
      ${info.basis || rate ? `<p class="budget-note">${esc(info.basis || "")}${rate ? ` 所有人民币金额按 ${unit.per} ${unit.unit} ≈ ${esc(Number((rate * unit.per).toFixed(4)))} 元换算${info.rateDate ? `（${esc(info.rateDate)}）` : ""}。` : ""}</p>` : ""}
    </div>` : ""}
  </section>`;
}

function priceChip(item) {
  if (!hasCost(item)) return "";
  if (item.cost.amount > 0) return `<span class="price">${money(item.cost.amount, true)}<small>/人</small></span>`;
  return `<span class="price free">${/含/.test(item.cost.note || "") ? "已含" : "免费"}</span>`;
}

function renderDay(day, number) {
  const points = mappableItems(day.items).filter((item) => googleUrl(item));
  const mobile = isMobileMaps();
  const link = googleDayUrl(day.items);
  const mapControl = mobile && points.length > 1
    ? `<button type="button" class="btn btn-primary" data-pins="${esc(day.id)}">${icon("pin")}在谷歌地图打点</button>`
    : link
      ? `<a class="btn btn-primary" href="${esc(link)}" target="_blank" rel="noopener">${icon(mobile ? "pin" : "navigation")}${mobile ? "在谷歌地图打点" : "用谷歌地图走这一天"}</a>`
      : "";
  const spend = dayCost(day);
  return `<section class="day" id="${esc(day.id)}">
    <header class="day-head">
      <div>
        <p class="eyebrow">第 ${number} 天 · ${esc(monthDay(day.date) || "日期未定")}${day.date ? ` 周${weekday(day.date)}` : ""} · ${esc(day.city || "未定")}${spend ? ` · 每人约 ${local(spend)}${cnyRate() ? `（${cny(spend)}）` : ""}` : ""}</p>
        <h2>${esc(day.title || day.city)}</h2>
      </div>
      <div class="day-tools">
        ${mapControl}
        <button type="button" class="btn edit-only" data-add="${esc(day.id)}">${icon("plus")}加一站</button>
      </div>
    </header>
    ${day.items.length ? `
    <div class="plan">
      <h3 class="section-title">今天的安排</h3>
      <ol class="plan-list">
        ${day.items.map((item, index) => renderGlance(item, index)).join("")}
      </ol>
    </div>
    <div class="detail">
      <h3 class="section-title">每一站怎么走</h3>
      <ol class="stops">
        ${day.items.map((item, index) => renderItem(day, item, index)).join("")}
      </ol>
    </div>` : `<p class="empty">这一天还没有地点，点「加一站」。</p>`}
  </section>`;
}

function isOptional(item) {
  return /可不去|想进去|再订|二选一|下雨|早到/.test(item.time || "");
}

function renderGlance(item, index) {
  return `<li class="plan-row kind-${esc(item.kind)}${isOptional(item) ? " optional" : ""}">
    <span class="plan-num">${index + 1}</span>
    <time>${esc(item.time || "—")}</time>
    <a href="#item-${esc(item.id)}"><span>${esc(item.name)}</span></a>
    <span class="plan-end">${priceChip(item)}${item.reservation !== "none" ? `<span class="flag ${esc(item.reservation)}">${FLAG[item.reservation]}</span>` : ""}</span>
  </li>`;
}

function renderItem(day, item, index) {
  const book = safeUrl(item.bookingUrl);
  const booked = !!state.booked[item.id];
  const parts = splitNote(item.note);
  const needs = item.reservation !== "none";
  const pic = safePhoto(item);
  return `<li class="stop kind-${esc(item.kind)}${isOptional(item) ? " optional" : ""}" id="item-${esc(item.id)}">
    <div class="stop-rail"><span class="stop-num">${index + 1}</span></div>
    <article class="stop-card${pic ? " has-photo" : ""}">
      ${pic ? `<figure class="stop-photo">
        <img src="${esc(pic.src)}" alt="${esc(item.name)}" loading="lazy" />
        <a class="credit" href="${esc(safeUrl(pic.link))}" target="_blank" rel="noopener">${esc(pic.credit)}</a>
      </figure>` : ""}
      <div class="stop-main">
      <header class="stop-head">
        <div>
          <p class="stop-meta"><span class="kind-chip">${icon(KIND_ICON[item.kind] || "pin")}${KIND[item.kind] || "地点"}</span><time>${esc(item.time || "")}</time>${priceChip(item)}</p>
          <h4>${esc(item.name)}</h4>
        </div>
        <div class="stop-edit edit-only">
          <button type="button" class="icon-btn" data-edit="${esc(day.id)}:${esc(item.id)}" title="修改这一站" aria-label="修改这一站">${icon("pencil")}</button>
          <button type="button" class="icon-btn danger" data-del="${esc(day.id)}:${esc(item.id)}" title="删除这一站" aria-label="删除这一站">${icon("trash")}</button>
        </div>
      </header>
      ${item.why ? `<p class="why"><b>为什么去</b>${esc(item.why)}</p>` : ""}
      ${parts.lead ? `<p class="how">${icon("navigation")}<span>${esc(parts.lead)}</span></p>` : ""}
      ${parts.rest ? `<p class="extra">${esc(parts.rest)}</p>` : ""}
      ${hasCost(item) && item.cost.amount > 0 && item.cost.note ? `<p class="cost-line">${icon("wallet")}<span>${esc(item.cost.note)}</span></p>` : ""}
      ${needs ? `<div class="book-box ${esc(item.reservation)}${booked ? " is-booked" : ""}"><b>${booked ? "已订好" : FLAG[item.reservation]}</b><span>${esc(item.reservationNote || "")}</span></div>` : ""}
      <div class="stop-actions">
        <a class="btn btn-sm" href="${esc(googleUrl(item))}" target="_blank" rel="noopener">${icon("pin")}谷歌地图</a>
        ${book && needs ? `<a class="btn btn-sm btn-book ${esc(item.reservation)}" href="${esc(book)}" target="_blank" rel="noopener">${icon("calendar")}去预约</a>` : ""}
        ${needs ? `<label class="booked-toggle edit-only${booked ? " on" : ""}"><input type="checkbox" data-booked="${esc(item.id)}" ${booked ? "checked" : ""} />${booked ? `${icon("check")}已订好` : "标记已订"}</label>` : ""}
      </div>
      </div>
    </article>
  </li>`;
}

function splitNote(note) {
  const text = String(note || "").trim();
  const sentences = text.split(/(?<=。)/).map((part) => part.trim()).filter(Boolean);
  if (sentences.length < 2) return { lead: text, rest: "" };
  const route = sentences.find((part) => /坐|走到|走过|走进|走回|走路|沿着|步行|换乘|打车|下车|上船|电车|公交|渡轮|导航/.test(part));
  if (!route || route === sentences[0]) {
    return { lead: sentences[0], rest: sentences.slice(1).join("") };
  }
  return { lead: route, rest: sentences.filter((part) => part !== route).join("") };
}

function cityRun(days) {
  const runs = [];
  for (const day of days) {
    const city = day.city || "未定";
    if (!runs.length || runs[runs.length - 1].city !== city) runs.push({ city, n: 1 });
    else runs[runs.length - 1].n += 1;
  }
  return runs;
}

function activeDay(current) {
  if (dayFilter === "all") return null;
  return current.days.find((day) => day.id === dayFilter) || current.days[0] || null;
}

function visibleItems() {
  const current = trip();
  const chosen = activeDay(current);
  const days = dayFilter === "all" ? current.days : current.days.filter((day) => chosen && day.id === chosen.id);
  return days.flatMap((day) => day.items.map((item) => ({ day, item })));
}

function drawMap() {
  markers.forEach((layer) => layer.remove());
  markers = [];
  const current = trip();
  const chosen = activeDay(current);
  const days = dayFilter === "all" ? current.days : (chosen ? [chosen] : []);
  const bounds = [];
  for (const day of days) {
    const dayNo = current.days.indexOf(day) + 1;
    const groups = new Map();
    const line = [];
    day.items.forEach((item, index) => {
      if (!Number.isFinite(item.lat) || !Number.isFinite(item.lng)) return;
      const key = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
      if (!groups.has(key)) groups.set(key, { first: item, nums: [], items: [] });
      groups.get(key).nums.push(index + 1);
      groups.get(key).items.push(item);
      line.push([item.lat, item.lng]);
      bounds.push([item.lat, item.lng]);
    });
    if (line.length > 1) {
      markers.push(L.polyline(line, { color: "#0e7c86", weight: 3, opacity: 0.75, dashArray: "6 8" }).addTo(map));
    }
    for (const group of groups.values()) {
      const label = dayFilter === "all" ? `${dayNo}` : group.nums.join("·");
      const marker = L.marker([group.first.lat, group.first.lng], {
        icon: L.divIcon({
          className: "pin-wrap",
          html: `<span class="pin kind-${esc(group.first.kind)}${dayFilter === "all" ? " day" : ""}">${esc(label)}</span>`,
          iconSize: null
        })
      });
      marker.bindPopup(group.items.map((item) =>
        `${safePhoto(item) ? `<img class="popup-photo" src="${esc(safePhoto(item).src)}" alt="" />` : ""}<b>${esc(item.name)}</b><span>${esc(item.time || "")}</span><a href="${esc(googleUrl(item))}" target="_blank" rel="noopener">在谷歌地图打开</a>`
      ).join("<hr>"));
      marker.addTo(map);
      markers.push(marker);
    }
  }
  if (bounds.length) map.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 });
  document.querySelector("#map-legend").textContent = dayFilter === "all"
    ? "数字是第几天。点日期回到某一天，能看到每一站。"
    : "数字和左边每一站的编号对应，虚线是先后顺序。";
  setTimeout(() => map.invalidateSize(), 0);
}

function render() {
  if (!state.trips.length) return;
  if (!trip()) state.tripId = state.trips[0].id;
  const scroll = main.scrollTop;
  renderTrips();
  renderMain();
  drawMap();
  main.scrollTop = scroll;
  save();
}

function openEditor(dayId, item) {
  editing = { dayId, id: item ? item.id : null };
  form.reset();
  document.querySelector("#editor-title").textContent = item ? "修改地点" : "添加地点";
  if (item) {
    for (const key of ["time", "name", "kind", "address", "reservation", "reservationNote", "bookingUrl", "note"]) {
      form.elements[key].value = item[key] || (key === "kind" ? "sight" : key === "reservation" ? "none" : "");
    }
    form.elements.lat.value = Number.isFinite(item.lat) ? item.lat : "";
    form.elements.lng.value = Number.isFinite(item.lng) ? item.lng : "";
    form.elements.costAmount.value = hasCost(item) ? item.cost.amount : "";
    form.elements.costNote.value = (item.cost && item.cost.note) || "";
  }
  editor.showModal();
}

function readForm() {
  const data = Object.fromEntries(new FormData(form));
  const lat = parseFloat(data.lat);
  const lng = parseFloat(data.lng);
  const spend = parseFloat(data.costAmount);
  return {
    time: data.time.trim(),
    name: data.name.trim(),
    kind: data.kind,
    address: data.address.trim(),
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    reservation: data.reservation,
    reservationNote: data.reservationNote.trim(),
    bookingUrl: data.bookingUrl.trim(),
    cost: Number.isFinite(spend) ? { amount: spend, note: data.costNote.trim() } : null,
    note: data.note.trim()
  };
}

map = L.map("map", { zoomControl: true });
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.setView([-25.5, 146.5], 4);

document.querySelector("#new-trip").addEventListener("click", () => {
  const id = `trip-${Date.now()}`;
  const title = window.prompt("这趟叫什么", "新行程");
  if (!title) return;
  state.trips.unshift({
    id,
    title: title.trim(),
    start: "",
    end: "",
    summary: "",
    days: [{ id: `${id}-d1`, date: "", city: "", title: "第一天", items: [] }]
  });
  state.tripId = id;
  dayFilter = "";
  render();
});

document.querySelector("#export-btn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ trips: state.trips, booked: state.booked }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${trip().title || "行程"}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});

document.querySelector("#import-btn").addEventListener("click", () => {
  document.querySelector("#import-file").click();
});

document.querySelector("#import-file").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  event.target.value = "";
  if (!file) return;
  const data = JSON.parse(await file.text());
  const trips = Array.isArray(data) ? data : data.trips;
  if (!Array.isArray(trips) || !trips.length) return;
  state.trips = upgrade(trips);
  state.booked = data.booked || {};
  state.tripId = trips[0].id;
  dayFilter = "";
  render();
});

document.querySelector("#fit-all").addEventListener("click", () => {
  dayFilter = "all";
  render();
});

document.querySelector("#geocode-btn").addEventListener("click", async () => {
  const query = `${form.elements.name.value} ${form.elements.address.value}`.trim();
  if (!query) return;
  const button = document.querySelector("#geocode-btn");
  const label = button.querySelector(".label");
  button.disabled = true;
  label.textContent = "正在查";
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`, {
      headers: { Accept: "application/json" }
    });
    const rows = await response.json();
    if (!rows.length) {
      label.textContent = "没找到，换个地址再试";
      return;
    }
    form.elements.lat.value = Number(rows[0].lat).toFixed(5);
    form.elements.lng.value = Number(rows[0].lon).toFixed(5);
    label.textContent = "已找到坐标";
  } catch (_) {
    label.textContent = "查找失败";
  } finally {
    button.disabled = false;
    setTimeout(() => { label.textContent = "按名称查找坐标并打点"; }, 1600);
  }
});

document.querySelector("#editor-cancel").addEventListener("click", () => editor.close());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const current = trip();
  const day = current.days.find((item) => item.id === editing.dayId);
  if (!day) return;
  const data = readForm();
  if (!data.name) return;
  if (editing.id) {
    const index = day.items.findIndex((item) => item.id === editing.id);
    const before = day.items[index].cost;
    if (data.cost && before && before.cat) data.cost.cat = before.cat;
    day.items[index] = { ...day.items[index], ...data };
  } else {
    day.items.push({ id: `p-${Date.now()}`, ...data });
  }
  editor.close();
  render();
});

main.addEventListener("click", (event) => {
  const pins = event.target.closest("[data-pins]");
  if (pins) return openPinSheet(pins.dataset.pins);
  const add = event.target.closest("[data-add]");
  if (add) return openEditor(add.dataset.add, null);
  const edit = event.target.closest("[data-edit]");
  if (edit) {
    const [dayId, itemId] = edit.dataset.edit.split(":");
    const day = trip().days.find((item) => item.id === dayId);
    return openEditor(dayId, day.items.find((item) => item.id === itemId));
  }
  const del = event.target.closest("[data-del]");
  if (del) {
    const [dayId, itemId] = del.dataset.del.split(":");
    const day = trip().days.find((item) => item.id === dayId);
    const target = day.items.find((item) => item.id === itemId);
    if (!window.confirm(`删除「${target ? target.name : "这一站"}」？`)) return;
    day.items = day.items.filter((item) => item.id !== itemId);
    delete state.booked[itemId];
    return render();
  }
  const jump = event.target.closest(".plan-row a");
  if (jump) {
    event.preventDefault();
    const target = document.getElementById(jump.getAttribute("href").slice(1));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    dayFilter = dayButton.dataset.day;
    main.scrollTop = 0;
    return render();
  }
  const pick = event.target.closest("[data-origin]");
  if (pick) {
    state.origin = pick.dataset.origin;
    return render();
  }
  if (event.target.closest("#toggle-budget")) {
    budgetOpen = !budgetOpen;
    return render();
  }
  if (event.target.closest("#toggle-books")) {
    bookingsOpen = !bookingsOpen;
    return render();
  }
  if (event.target.closest("#add-day")) {
    const date = window.prompt("日期，写成 2027-05-06", "");
    if (date == null) return;
    const current = trip();
    current.days.push({
      id: `day-${Date.now()}`,
      date: date.trim(),
      city: "",
      title: "新的一天",
      items: []
    });
    return render();
  }
  if (event.target.closest("#rename-trip")) {
    const title = window.prompt("行程名称", trip().title);
    if (!title) return;
    trip().title = title.trim();
    return render();
  }
  if (event.target.closest("#delete-trip")) {
    if (!window.confirm(`删除「${trip().title}」？`)) return;
    state.trips = state.trips.filter((item) => item.id !== state.tripId);
    state.tripId = state.trips[0].id;
    dayFilter = "";
    return render();
  }
});

main.addEventListener("change", (event) => {
  const box = event.target.closest("[data-booked]");
  if (!box) return;
  if (box.checked) state.booked[box.dataset.booked] = true;
  else delete state.booked[box.dataset.booked];
  render();
});

tripList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-trip]");
  if (!button) return;
  state.tripId = button.dataset.trip;
  dayFilter = "";
  bookingsOpen = false;
  render();
});

window.TRAVEL_GUIDE_APP = {
  getPayload() {
    return {
      trip: structuredClone(trip()),
      booked: structuredClone(state.booked)
    };
  },
  loadShared(payload) {
    state.trips = upgrade([structuredClone(payload.trip)]);
    state.booked = structuredClone(payload.booked || {});
    state.tripId = payload.trip.id;
    state.origin = "";
    dayFilter = "";
    bookingsOpen = false;
    budgetOpen = false;
    render();
  }
};

render();

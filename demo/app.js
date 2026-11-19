function storageScopeKey() {
  const raw = String(location.pathname || "/")
    .replace(/\/index\.html$/i, "/")
    .replace(/\/+$/, "") || "/";
  return `travel-guides-v3:${raw}`;
}
const STORAGE_KEY = storageScopeKey();
const LEGACY_STORAGE_KEY = "travel-guides-v2";
const KIND = { sight: "景点", food: "餐厅", transport: "交通", stay: "住宿" };
const FLAG = { required: "必须预约", recommended: "建议预约", none: "不用预约" };
const KIND_ICON = { sight: "camera", food: "food", transport: "bus", stay: "bed" };
const COST_CAT = { flight: "国际机票", stay: "住宿", transport: "交通", sight: "门票和活动", food: "吃饭", other: "签证和其他" };
const CURRENCY = {
  CNY: { lead: "约 ", unit: "人民币", per: 1, step: 1, isCny: true, format: (text) => `¥${text}` },
  RMB: { lead: "约 ", unit: "人民币", per: 1, step: 1, isCny: true, format: (text) => `¥${text}` },
  USD: { lead: "美元约 ", unit: "美元", per: 1, step: 1, format: (text) => `US$${text}` },
  EUR: { lead: "欧元约 ", unit: "欧元", per: 1, step: 1, format: (text) => `€${text}` },
  GBP: { lead: "英镑约 ", unit: "英镑", per: 1, step: 1, format: (text) => `£${text}` },
  AUD: { lead: "澳币约 ", unit: "澳元", per: 1, step: 1, format: (text) => `A$${text}` },
  NZD: { lead: "纽币约 ", unit: "新西兰元", per: 1, step: 1, format: (text) => `NZ$${text}` },
  CAD: { lead: "加币约 ", unit: "加元", per: 1, step: 1, format: (text) => `C$${text}` },
  CHF: { lead: "瑞郎约 ", unit: "瑞士法郎", per: 1, step: 1, format: (text) => `CHF ${text}` },
  SGD: { lead: "新币约 ", unit: "新加坡元", per: 1, step: 1, format: (text) => `S$${text}` },
  HKD: { lead: "港币约 ", unit: "港元", per: 1, step: 1, format: (text) => `HK$${text}` },
  TWD: { lead: "台币约 ", unit: "新台币", per: 100, step: 10, format: (text) => `NT$${text}` },
  MOP: { lead: "澳门元约 ", unit: "澳门元", per: 1, step: 1, format: (text) => `MOP$${text}` },
  JPY: { lead: "约 ", unit: "日元", per: 100, step: 10, format: (text) => `${text} 日元` },
  KRW: { lead: "约 ", unit: "韩元", per: 1000, step: 100, format: (text) => `₩${text}` },
  THB: { lead: "泰铢约 ", unit: "泰铢", per: 100, step: 10, format: (text) => `฿${text}` },
  MYR: { lead: "马币约 ", unit: "林吉特", per: 1, step: 1, format: (text) => `RM${text}` },
  VND: { lead: "约 ", unit: "越南盾", per: 10000, step: 1000, format: (text) => `${text} 盾` },
  IDR: { lead: "约 ", unit: "印尼盾", per: 10000, step: 1000, format: (text) => `Rp ${text}` },
  PHP: { lead: "比索约 ", unit: "菲律宾比索", per: 100, step: 10, format: (text) => `₱${text}` },
  AED: { lead: "迪拉姆约 ", unit: "迪拉姆", per: 1, step: 1, format: (text) => `AED ${text}` },
  TRY: { lead: "里拉约 ", unit: "土耳其里拉", per: 10, step: 1, format: (text) => `₺${text}` },
  ISK: { lead: "克朗约 ", unit: "冰岛克朗", per: 100, step: 10, format: (text) => `${text} ISK` },
  NOK: { lead: "克朗约 ", unit: "挪威克朗", per: 10, step: 1, format: (text) => `NOK ${text}` },
  SEK: { lead: "克朗约 ", unit: "瑞典克朗", per: 10, step: 1, format: (text) => `SEK ${text}` },
  DKK: { lead: "克朗约 ", unit: "丹麦克朗", per: 10, step: 1, format: (text) => `DKK ${text}` }
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
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M8 16H3v5"/>',
  arrowUp: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
  arrowDown: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  more: '<circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/><circle cx="5" cy="12" r="1.5" fill="currentColor"/>',
  food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  bus: '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  passport: '<path d="M2 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="M12 5v16"/><path d="M6 10h2"/><path d="M6 14h2"/><circle cx="16" cy="12" r="2"/>'
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
let visaOpen = false;
const openAltDays = new Set();
let editing = null;
const weatherCache = new Map();

const main = document.querySelector("#main");
const tripList = document.querySelector("#trip-list");
const editor = document.querySelector("#editor");
const form = document.querySelector("#editor-form");
const dayEditor = document.querySelector("#day-editor");
const dayForm = document.querySelector("#day-editor-form");
const mapFab = document.querySelector("#mobile-map-fab");
const seedUpdateBtn = document.querySelector("#seed-update-btn");
const resetLocalBtn = document.querySelector("#reset-local-btn");
let editingDayId = null;
let returnScrollY = null;
let returnStopId = "";
let lastItineraryY = 0;

function seedHash(obj) {
  const str = JSON.stringify(obj);
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

const SEED_LIST = upgrade(structuredClone(window.SEED_TRIPS || []));
const SEED_BY_ID = new Map(SEED_LIST.map((item) => [item.id, item]));
const SEED_HASHES = new Map(SEED_LIST.map((item) => [item.id, seedHash(item)]));

function urlRequestedTripId() {
  try {
    const fromQuery = new URLSearchParams(location.search).get("trip");
    if (fromQuery) return fromQuery;
    const hash = location.hash.replace(/^#/, "");
    if (hash.startsWith("trip=")) return new URLSearchParams(hash).get("trip") || "";
  } catch (_) {}
  return "";
}

function load() {
  const seed = upgrade(structuredClone(window.SEED_TRIPS || []));
  const seedIds = new Set(seed.map((item) => item.id));
  const validStopIds = new Set(seed.flatMap((t) => (t.days || []).flatMap((d) => (d.items || []).map((it) => it.id))));
  let booked = {};
  let visaChecks = {};
  let editedTrips = {};
  let deletedSeedIds = [];
  let tripId = seed[0] ? seed[0].id : "";
  let origin = "";
  let trips = seed;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") {
      booked = saved.booked && typeof saved.booked === "object" ? saved.booked : {};
      visaChecks = saved.visaChecks && typeof saved.visaChecks === "object" ? saved.visaChecks : {};
      editedTrips = saved.editedTrips && typeof saved.editedTrips === "object" ? saved.editedTrips : {};
      deletedSeedIds = Array.isArray(saved.deletedSeedIds) ? saved.deletedSeedIds : [];
      origin = saved.origin || "";
      const deletedSet = new Set(deletedSeedIds);
      const customList = upgrade(Array.isArray(saved.customTrips) ? saved.customTrips : []);
      const customById = new Map(customList.map((item) => [item.id, item]));
      const userCreated = customList.filter((item) => !seedIds.has(item.id));
      const mergedSeed = [];
      for (const item of seed) {
        if (deletedSet.has(item.id)) continue;
        if (editedTrips[item.id] && customById.has(item.id)) {
          mergedSeed.push(customById.get(item.id));
        } else {
          delete editedTrips[item.id];
          mergedSeed.push(item);
        }
      }
      const nextTrips = [...userCreated, ...mergedSeed];
      trips = nextTrips.length ? nextTrips : seed;
      if (saved.tripId && trips.some((item) => item.id === saved.tripId)) {
        tripId = saved.tripId;
      }
    } else {
      // Migrate only checkbox ticks for matching IDs from legacy v2 storage (never stale trip bodies)
      const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
      if (legacy && typeof legacy === "object") {
        if (legacy.booked && typeof legacy.booked === "object") {
          for (const [k, v] of Object.entries(legacy.booked)) {
            if (v === true && validStopIds.has(k)) booked[k] = true;
          }
        }
        if (legacy.visaChecks && typeof legacy.visaChecks === "object") {
          for (const id of seedIds) {
            if (legacy.visaChecks[id] && typeof legacy.visaChecks[id] === "object") {
              visaChecks[id] = legacy.visaChecks[id];
            }
          }
        }
      }
    }
  } catch (_) { /* keep the seed trip */ }
  const reqTrip = urlRequestedTripId();
  if (reqTrip && trips.some((item) => item.id === reqTrip)) {
    tripId = reqTrip;
  } else if (!trips.some((item) => item.id === tripId) && trips[0]) {
    tripId = trips[0].id;
  }
  return { trips, booked, visaChecks, editedTrips, deletedSeedIds, tripId, origin };
}

function markTripEdited(id) {
  if (!id) return;
  if (!state.editedTrips || typeof state.editedTrips !== "object") state.editedTrips = {};
  if (SEED_BY_ID.has(id) && !state.editedTrips[id]) {
    state.editedTrips[id] = SEED_HASHES.get(id) || "edited";
  }
}

function upgrade(trips) {
  for (const item of trips.flatMap((one) => (one.days || []).flatMap((day) => day.items || []))) {
    if (item.cost && !Number.isFinite(item.cost.amount) && Number.isFinite(item.cost.aud)) item.cost.amount = item.cost.aud;
  }
  return trips;
}

function save() {
  if (!(window.TRAVEL_SHARE && window.TRAVEL_SHARE.isSharedRoute())) {
    const edited = state.editedTrips || {};
    const customTrips = state.trips.filter((item) => !SEED_BY_ID.has(item.id) || Boolean(edited[item.id]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      customTrips,
      editedTrips: edited,
      deletedSeedIds: state.deletedSeedIds || [],
      booked: state.booked,
      visaChecks: state.visaChecks || {},
      tripId: state.tripId,
      origin: state.origin
    }));
  }
  window.dispatchEvent(new CustomEvent("travelguide:save"));
}

const VISA_STATUS = {
  required: { label: "需要提前办签", tone: "due" },
  visa_free: { label: "免签 / 过境免签", tone: "done" },
  on_arrival: { label: "落地签", tone: "due" },
  eta: { label: "电子旅行许可 / ETA", tone: "due" },
  already_have: { label: "已有有效签证", tone: "done" },
  not_needed: { label: "无需签证", tone: "done" }
};

function visaChecksFor(tripId) {
  if (!state.visaChecks || typeof state.visaChecks !== "object") state.visaChecks = {};
  if (!state.visaChecks[tripId] || typeof state.visaChecks[tripId] !== "object") {
    state.visaChecks[tripId] = {};
  }
  return state.visaChecks[tripId];
}

function visaSummary(current) {
  const visa = current && current.visa;
  if (!visa || typeof visa !== "object") return null;
  const statusKey = String(visa.status || "required");
  if (statusKey === "not_needed") return null;
  const meta = VISA_STATUS[statusKey] || VISA_STATUS.required;
  const docs = Array.isArray(visa.docs) ? visa.docs.filter((doc) => doc && doc.label) : [];
  const checks = visaChecksFor(current.id);
  const doneCount = docs.filter((doc) => checks[doc.id || doc.label]).length;
  const allDone = docs.length > 0 && doneCount === docs.length;
  const tone = allDone && docs.length ? "done" : meta.tone;
  return {
    visa,
    meta,
    docs,
    checks,
    doneCount,
    tone,
    shortLabel: docs.length ? `签证准备 ${doneCount}/${docs.length}` : `签证 · ${meta.label}`
  };
}

function renderVisaPanel(current) {
  const info = visaSummary(current);
  if (!info) return "";
  const { visa, docs, checks } = info;
  const tips = Array.isArray(visa.tips) ? visa.tips.filter(Boolean) : [];
  const applyUrl = safeUrl(visa.applyUrl);
  const guideUrl = safeUrl(visa.guideUrl);
  return `<section class="drawer-panel visa-panel">
    <div class="drawer-head">
      <b>签证准备 · ${esc(visa.type || info.meta.label)}</b>
      <button type="button" class="drawer-close" id="close-visa">收起</button>
    </div>
    <div class="visa-meta">
      ${visa.passport ? `<p><b>持照</b><span>${esc(visa.passport)}</span></p>` : ""}
      ${visa.feeNote ? `<p><b>费用</b><span>${esc(visa.feeNote)}</span></p>` : ""}
      ${visa.timeline ? `<p><b>时间</b><span>${esc(visa.timeline)}</span></p>` : ""}
    </div>
    ${(applyUrl || guideUrl) ? `<div class="visa-actions">
      ${applyUrl ? `<a class="btn btn-sm btn-primary" href="${esc(applyUrl)}" target="_blank" rel="noopener">${icon("external")}官方申请入口</a>` : ""}
      ${guideUrl ? `<a class="btn btn-sm" href="${esc(guideUrl)}" target="_blank" rel="noopener">${icon("external")}政策说明页</a>` : ""}
    </div>` : ""}
    ${docs.length ? `<h3 class="section-title">材料清单</h3>
    <ul class="visa-docs">
      ${docs.map((doc) => {
        const id = String(doc.id || doc.label);
        const checked = Boolean(checks[id]);
        return `<li>
          <label class="visa-doc${checked ? " on" : ""}">
            <input type="checkbox" data-visa-check="${esc(id)}" ${checked ? "checked" : ""} />
            <span><b>${esc(doc.label)}</b>${doc.note ? `<small>${esc(doc.note)}</small>` : ""}</span>
          </label>
        </li>`;
      }).join("")}
    </ul>` : ""}
    ${tips.length ? `<h3 class="section-title">提醒</h3>
    <ul class="visa-tips">${tips.map((tip) => `<li>${esc(tip)}</li>`).join("")}</ul>` : ""}
    <p class="visa-note">${esc(visa.disclaimer || "政策、费用与审理时间以移民局官网为准；本页只作出行准备清单，不构成签证代理或获批承诺。")}</p>
  </section>`;
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
    window.matchMedia("(max-width: 720px)").matches ||
    (navigator.maxTouchPoints > 1 && window.matchMedia("(max-width: 820px)").matches);
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|HarmonyOS/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function xhsKeyword(day, item) {
  const rawCity = String((day && day.city) || (trip() && trip().title) || "")
    .split(/[\/·・|]/)[0]
    .trim();
  const cleanName = String(item.name || "")
    .replace(/^方案\s*[A-Z0-9]+\s*[·・:：-]?\s*/i, "")
    .replace(/^(住|飞|坐|渡轮去|渡轮回|去)\s*/, "")
    .replace(/（.*?）|\(.*?\)/g, "")
    .trim();
  const baseName = cleanName || String(item.name || "").trim();
  const suffix = item.kind === "food" ? "点单推荐" : item.kind === "stay" ? "入住体验" : "攻略";
  const prefix = rawCity && !baseName.includes(rawCity) ? `${rawCity} ` : "";
  return `${prefix}${baseName} ${suffix}`.replace(/\s+/g, " ").trim();
}

function xhsUrl(day, item) {
  const kw = xhsKeyword(day, item);
  if (isMobileDevice()) {
    const deeplink = `xhsdiscover://search/result?keyword=${encodeURIComponent(kw)}`;
    return `https://oia.xiaohongshu.com/oia?deeplink=${encodeURIComponent(deeplink)}&enableGuideModal=true`;
  }
  return `https://www.xiaohongshu.com/search_result/?keyword=${encodeURIComponent(kw)}&source=web_explore_feed`;
}

const CN_PLACE_RE = /中国|北京|上海|天津|重庆|广州|深圳|成都|杭州|南京|苏州|西安|长沙|武汉|厦门|青岛|大连|哈尔滨|长春|沈阳|三亚|海口|昆明|大理|丽江|香格里拉|西双版纳|腾冲|拉萨|林芝|日喀则|乌鲁木齐|喀什|伊犁|阿勒泰|吐鲁番|敦煌|嘉峪关|张掖|西宁|兰州|银川|贵阳|荔波|镇远|桂林|阳朔|北海|张家界|凤凰|黄山|宏村|婺源|景德镇|九寨沟|黄龙|稻城|亚丁|川西|康定|新都桥|理塘|四姑娘山|色达|甘南|呼伦贝尔|阿尔山|漠河|延吉|长白山|威海|烟台|泉州|福州|平潭|宁波|舟山|绍兴|乌镇|西塘|扬州|无锡|常州|洛阳|开封|大同|平遥|太原|郑州|济南|泰山|合肥|南昌|庐山|武夷山|潮州|汕头|珠海|佛山|东莞|南宁|崇左|新疆|西藏|云南|四川|青海|甘肃|宁夏|陕西|山西|内蒙古|黑龙江|吉林|辽宁|福建|浙江|江苏|广东|海南|湖南|湖北|江西|安徽|山东|河南|河北|广西|贵州/;
const FOREIGN_PLACE_RE = /首尔|釜山|济州|仁川|庆州|东京|京都|大阪|北海道|札幌|冲绳|福冈|名古屋|悉尼|墨尔本|圣灵群岛|布里斯班|黄金海岸|凯恩斯|曼谷|清迈|普吉|苏梅|新加坡|吉隆坡|槟城|亚庇|河内|胡志明|岘港|富国岛|巴厘岛|雅加达|马尼拉|长滩|伦敦|巴黎|罗马|米兰|威尼斯|佛罗伦萨|慕尼黑|柏林|苏黎世|日内瓦|维也纳|布拉格|阿姆斯特丹|巴塞罗那|马德里|里斯本|雅典|伊斯坦布尔|开罗|迪拜|纽约|洛杉矶|旧金山|西雅图|温哥华|多伦多|台北|台中|高雄|花莲|垦丁|香港|澳门/;

function isMainlandCoord(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < 18.0 || lat > 53.6 || lng < 73.5 || lng > 135.1) return false;
  if (lat < 39.8 && lng > 124.2) return false;
  if (lat >= 21.8 && lat <= 25.4 && lng >= 119.5 && lng <= 122.2) return false;
  if (lat >= 22.1 && lat <= 22.6 && lng >= 113.4 && lng <= 114.5) return false;
  if (lat < 21.2 && !(lat >= 18.0 && lat <= 20.3 && lng >= 108.5 && lng <= 111.3)) return false;
  if (lat < 27.6 && lng < 92.0) return false;
  if (lat > 43.5 && lng < 118.0 && !(lng < 96.5 && lat <= 49.2)) return false;
  return true;
}

function isDomesticItem(item, day, current = trip()) {
  const localText = `${(day && day.city) || ""} ${(day && day.title) || ""} ${(item && item.address) || ""} ${(item && item.name) || ""}`;
  if (FOREIGN_PLACE_RE.test(localText)) return false;
  const tripText = `${(current && current.title) || ""} ${localText}`;
  const hasCnText = CN_PLACE_RE.test(tripText);
  const isCny = String((current && current.budget && current.budget.currency) || "").trim().toUpperCase() === "CNY";
  if (item && Number.isFinite(item.lat) && Number.isFinite(item.lng)) {
    return isMainlandCoord(item.lat, item.lng) && (hasCnText || (isCny && !FOREIGN_PLACE_RE.test(tripText)));
  }
  return hasCnText && !FOREIGN_PLACE_RE.test(tripText);
}

function isDomesticDay(day, current = trip()) {
  const items = (day && day.items) || [];
  const mapped = items.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
  if (mapped.length) return mapped.some((item) => isDomesticItem(item, day, current));
  const text = `${(day && day.city) || ""} ${(day && day.title) || ""}`;
  return CN_PLACE_RE.test(text) && !FOREIGN_PLACE_RE.test(text);
}

function isDomesticTrip(current = trip()) {
  const days = (current && current.days) || [];
  if (!days.length) return false;
  return days.some((day) => isDomesticDay(day, current));
}

function flightWatchUrls(current, origin) {
  const days = (current && current.days) || [];
  if (!days.length) return null;
  const fromCity = (origin && origin.label) || "上海";
  const firstCity = days.map((d) => d.city).find(Boolean) || current.title || "";
  const lastCity = [...days].reverse().map((d) => d.city).find(Boolean) || firstCity;
  if (!firstCity || fromCity === firstCity) return null;
  const start = current.start || (days[0] && days[0].date) || "";
  const end = current.end || (days[days.length - 1] && days[days.length - 1].date) || "";
  const openJaw = lastCity && lastCity !== firstCity;
  const gfQuery = openJaw
    ? `Flights from ${fromCity} to ${firstCity}${start ? ` on ${start}` : ""} and from ${lastCity} to ${fromCity}${end ? ` on ${end}` : ""}`
    : `Round trip flights from ${fromCity} to ${firstCity}${start ? ` departing ${start}` : ""}${end ? ` returning ${end}` : ""}`;
  const googleFlights = `https://www.google.com/travel/flights?hl=zh-CN&curr=CNY&q=${encodeURIComponent(gfQuery)}`;
  const tripCom = `https://hk.trip.com/flights/?locale=zh-HK&curr=CNY`;
  const ctripDomestic = `https://flights.ctrip.com/`;
  return {
    fromCity,
    firstCity,
    lastCity,
    openJaw,
    start,
    end,
    domestic: isDomesticTrip(current),
    googleFlights,
    tripCom,
    ctripDomestic
  };
}

function shiftYear(dateStr, deltaYears) {
  const m = String(dateStr || "").match(/^(\d{4})-(\d{2}-\d{2})$/);
  if (!m) return "";
  return `${Number(m[1]) + deltaYears}-${m[2]}`;
}

function wearAdvice(minT, maxT, rainMm) {
  const avg = (minT + maxT) / 2;
  let cloth = "薄长袖或短袖叠穿";
  if (avg < 6) cloth = "羽绒服/厚大衣 + 保暖内搭";
  else if (avg < 14) cloth = "防风外套/风衣 + 卫衣毛衣";
  else if (avg < 21) cloth = "薄外套/针织衫，早晚微凉";
  else if (avg >= 27) cloth = "清凉夏装 + 防晒帽墨镜";
  const rain = rainMm >= 5 ? " · 备晴雨伞" : "";
  return `${cloth}${rain}`;
}

async function ensureDayWeather(day) {
  if (!day || !day.date || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) return;
  const pt = (day.items || []).find((it) => Number.isFinite(it.lat) && Number.isFinite(it.lng));
  if (!pt) return;
  const key = `${day.date}:${pt.lat.toFixed(2)},${pt.lng.toFixed(2)}`;
  if (weatherCache.has(key)) return;
  weatherCache.set(key, { loading: true });

  try {
    const today = new Date();
    const target = new Date(`${day.date}T12:00:00`);
    const diffDays = Math.round((target - today) / 86400000);
    let url = "";
    let mode = "forecast";
    if (diffDays >= -1 && diffDays <= 14) {
      url = `https://api.open-meteo.com/v1/forecast?latitude=${pt.lat.toFixed(3)}&longitude=${pt.lng.toFixed(3)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&start_date=${day.date}&end_date=${day.date}`;
    } else {
      mode = "climate";
      const refYear = today.getFullYear() - 1;
      const md = day.date.slice(5);
      const refDate = `${refYear}-${md}`;
      url = `https://archive-api.open-meteo.com/v1/archive?latitude=${pt.lat.toFixed(3)}&longitude=${pt.lng.toFixed(3)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&start_date=${refDate}&end_date=${refDate}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error("weather fetch failed");
    const data = await res.json();
    const d = data && data.daily;
    if (!d || !Array.isArray(d.temperature_2m_max) || d.temperature_2m_max[0] == null) {
      weatherCache.set(key, null);
      return;
    }
    const maxT = Math.round(d.temperature_2m_max[0]);
    const minT = Math.round(d.temperature_2m_min[0]);
    const rain = Number(d.precipitation_sum ? d.precipitation_sum[0] : 0) || 0;
    const badge = {
      mode,
      temp: `${minT}°–${maxT}°C`,
      tip: wearAdvice(minT, maxT, rain),
      label: mode === "forecast" ? "实时预报" : "往年同期"
    };
    weatherCache.set(key, badge);
    document.querySelectorAll(`[data-weather-key="${key}"]`).forEach((el) => {
      el.innerHTML = `<span>${esc(badge.label)} ${esc(badge.temp)} · ${esc(badge.tip)}</span>`;
      el.hidden = false;
    });
  } catch (_) {
    weatherCache.set(key, null);
  }
}

function dayWeatherSlot(day) {
  if (!day || !day.date || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) return "";
  const pt = (day.items || []).find((it) => Number.isFinite(it.lat) && Number.isFinite(it.lng));
  if (!pt) return "";
  const key = `${day.date}:${pt.lat.toFixed(2)},${pt.lng.toFixed(2)}`;
  const cached = weatherCache.get(key);
  if (cached && !cached.loading) {
    return `<p class="weather-strip" data-weather-key="${esc(key)}"><span>${esc(cached.label)} ${esc(cached.temp)} · ${esc(cached.tip)}</span></p>`;
  }
  ensureDayWeather(day);
  return `<p class="weather-strip" data-weather-key="${esc(key)}" hidden></p>`;
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

function amapUrl(item) {
  if (Number.isFinite(item.lat) && Number.isFinite(item.lng)) {
    return `https://uri.amap.com/marker?position=${item.lng},${item.lat}&name=${encodeURIComponent(item.name || "目的地")}&src=travelguide&coordinate=wgs84&callnative=1`;
  }
  const query = `${item.name || ""} ${item.address || ""}`.trim();
  return query ? `https://ditu.amap.com/search?query=${encodeURIComponent(query)}` : "";
}

function appleMapsUrl(item) {
  if (Number.isFinite(item.lat) && Number.isFinite(item.lng)) {
    return `https://maps.apple.com/?ll=${item.lat},${item.lng}&q=${encodeURIComponent(item.name || item.address || "目的地")}`;
  }
  const query = `${item.name || ""} ${item.address || ""}`.trim();
  return query ? `https://maps.apple.com/?q=${encodeURIComponent(query)}` : "";
}

function externalMapUrl(item, day, current = trip()) {
  return isDomesticItem(item, day, current) ? amapUrl(item) : googleUrl(item);
}

function googleDayUrl(items) {
  const points = (items || []).filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
  if (!points.length) return "";
  if (points.length === 1) return googleUrl(points[0]);
  if (isMobileMaps()) return "";
  return `https://www.google.com/maps/dir/${points.map((item) => `${item.lat},${item.lng}`).join("/")}`;
}

function openPinSheet(dayId) {
  const current = trip();
  const day = current.days.find((item) => item.id === dayId);
  const sheet = document.querySelector("#pin-sheet");
  const list = document.querySelector("#pin-sheet-list");
  const noteEl = document.querySelector("#pin-sheet-note");
  if (!day || !sheet || !list) return;
  const domestic = isDomesticDay(day, current);
  const points = mappableItems(day.items).filter((item) => (domestic ? amapUrl(item) : googleUrl(item)));
  if (!points.length) return;
  if (points.length === 1) {
    window.open(domestic ? amapUrl(points[0]) : googleUrl(points[0]), "_blank", "noopener");
    return;
  }
  const dirLink = domestic ? "" : googleDayDirUrl(day.items);
  document.querySelector("#pin-sheet-title").textContent = domestic
    ? `${monthDay(day.date) || "这一天"} · 在高德 / 苹果地图打点`
    : `${monthDay(day.date) || "这一天"} · 在谷歌地图打点`;
  if (noteEl) {
    noteEl.textContent = domestic
      ? "国内行程优先使用高德地图打点（已自动校准坐标），也支持直接用苹果地图导航。"
      : "点任意一站即可在谷歌地图里单独打点定位；也可以点第一项把今天所有站点连成路线。";
  }
  list.innerHTML = `${dirLink ? `<a class="pin-row pin-row-all" href="${esc(dirLink)}" target="_blank" rel="noopener">
      <span class="pin-num">${icon("navigation")}</span>
      <span class="pin-meta"><b>连成当天路线（共 ${points.length} 站）</b><small>一次性把今天所有坐标点串进谷歌地图路线</small></span>
      <span class="pin-go">看路线</span>
    </a>` : ""}` + points.map((item, index) => {
    const primaryUrl = domestic ? amapUrl(item) : googleUrl(item);
    const apple = domestic ? appleMapsUrl(item) : "";
    return `<div class="pin-row-wrap">
      <a class="pin-row" href="${esc(primaryUrl)}" target="_blank" rel="noopener">
        <span class="pin-num">${index + 1}</span>
        <span class="pin-meta"><b>${esc(item.name)}</b><small>${esc(item.time || "—")}${item.address ? ` · ${esc(item.address)}` : ""}</small></span>
        <span class="pin-go">${icon("pin")}${domestic ? "高德" : "打点"}</span>
      </a>
      ${apple ? `<a class="pin-apple" href="${esc(apple)}" target="_blank" rel="noopener" title="用苹果地图打开">苹果地图</a>` : ""}
    </div>`;
  }).join("");
  sheet.showModal();
}

function googleDayDirUrl(items) {
  const points = (items || []).filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
  if (points.length < 2) return "";
  return `https://www.google.com/maps/dir/${points.map((item) => `${item.lat},${item.lng}`).join("/")}`;
}

function isStackedLayout() {
  return window.matchMedia("(max-width: 1100px)").matches;
}

function inMapViewport() {
  const panel = document.querySelector(".map-panel");
  if (!panel || !isStackedLayout()) return false;
  const r = panel.getBoundingClientRect();
  const threshold = window.innerHeight - Math.min(200, Math.max(120, r.height * 0.5));
  return r.top <= threshold && r.bottom >= 90;
}

function updateMapFab() {
  if (!mapFab) return;
  if (!isStackedLayout() || !document.querySelector(".map-panel")) {
    mapFab.hidden = true;
    return;
  }
  mapFab.hidden = false;
  if (inMapViewport()) {
    mapFab.dataset.mode = "back";
    const label = returnStopId ? "回刚才那站" : "回日程";
    mapFab.innerHTML = `${icon("arrowUp")}<span>${label}</span>`;
    mapFab.setAttribute("aria-label", label);
  } else {
    lastItineraryY = window.scrollY;
    mapFab.dataset.mode = "to-map";
    mapFab.innerHTML = `${icon("map")}<span>看地图</span>`;
    mapFab.setAttribute("aria-label", "跳到底部查看地图");
  }
}

let scrollAnimId = 0;
function smoothScrollTo(targetY, onDone) {
  const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const dest = Math.min(Math.max(0, Math.round(targetY)), maxY);
  const start = window.scrollY;
  const diff = dest - start;
  if (Math.abs(diff) < 2) {
    window.scrollTo(0, dest);
    if (onDone) onDone();
    return;
  }
  cancelAnimationFrame(scrollAnimId);
  const duration = 260;
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    const ease = 1 - Math.pow(1 - p, 3);
    window.scrollTo(0, Math.round(start + diff * ease));
    if (p < 1) {
      scrollAnimId = requestAnimationFrame(step);
    } else {
      window.scrollTo(0, dest);
      if (onDone) onDone();
    }
  };
  scrollAnimId = requestAnimationFrame(step);
}

function scrollToMapPanel() {
  const panel = document.querySelector(".map-panel") || document.querySelector("#map");
  if (!panel) return;
  const topOffset = Math.round((document.querySelector(".top")?.getBoundingClientRect().height || 59) + 10);
  const targetY = Math.max(0, window.scrollY + panel.getBoundingClientRect().top - topOffset);
  smoothScrollTo(targetY, updateMapFab);
}

function focusOnMap(dayId, itemId) {
  if (!map || !window.L) return;
  const current = trip();
  const day = current.days.find((d) => d.id === dayId);
  const item = day && day.items.find((it) => it.id === itemId);
  if (!item || !Number.isFinite(item.lat) || !Number.isFinite(item.lng)) return;
  const entry = markers.find((m) => m._stopIds && m._stopIds.includes(itemId));
  if (isStackedLayout()) {
    returnScrollY = window.scrollY;
    returnStopId = itemId;
    scrollToMapPanel();
  }
  map.flyTo([item.lat, item.lng], Math.max(map.getZoom(), 14), { duration: 0.55 });
  if (entry) setTimeout(() => entry.openPopup(), 260);
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
  const code = String((current && current.budget && current.budget.currency) || "CNY").trim().toUpperCase();
  if (CURRENCY[code]) return CURRENCY[code];
  return { lead: "约 ", unit: code, per: 1, step: 1, format: (text) => `${code} ${text}` };
}

function isHomeCurrency(current = trip()) {
  return Boolean(currency(current).isCny);
}

function local(amount, exact) {
  const unit = currency();
  const value = Math.abs(exact ? amount : Math.round(amount / unit.step) * unit.step);
  return `${amount < 0 ? "−" : ""}${unit.format(value.toLocaleString("en-US", { maximumFractionDigits: 2 }))}`;
}

function cnyRate() {
  const current = trip();
  if (isHomeCurrency(current)) return 0;
  const value = Number(current && current.budget && current.budget.cnyRate);
  return value > 0 ? value : 0;
}

function cny(amount, known) {
  if (isHomeCurrency()) return "";
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
  const home = isHomeCurrency(current);
  const rate = Number(current.budget && current.budget.cnyRate);
  const lines = [];
  if (Number.isFinite(origin.amount)) {
    lines.push({ label: `${origin.label}往返交通`, cat: "flight", amount: origin.amount, cny: origin.cny, note: origin.note || "" });
  } else if (Number.isFinite(origin.cny) && (home || rate > 0)) {
    lines.push({ label: `${origin.label}往返机票`, cat: "flight", amount: home ? origin.cny : Math.round(origin.cny / rate), cny: origin.cny, note: origin.note || "" });
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
  const home = isHomeCurrency(current);
  const extras = [...originLines(current), ...((current.budget && current.budget.extras) || [])].map((extra) =>
    Number.isFinite(extra.amount)
      ? extra
      : (Number.isFinite(extra.cny) && (home || rate > 0)
        ? { ...extra, amount: home ? extra.cny : Math.round(extra.cny / rate) }
        : extra));
  for (const extra of extras) {
    if (!Number.isFinite(extra.amount)) continue;
    cats[costCat(extra)] = (cats[costCat(extra)] || 0) + extra.amount;
    total += extra.amount;
  }
  return { total, cats, days, extras, optional };
}

function commonsFileFromUrl(raw) {
  try {
    const u = new URL(raw, location.origin);
    if (u.pathname.startsWith("/api/img")) return u.searchParams.get("file") || "";
    const wikiIdx = u.pathname.indexOf("/wiki/File:");
    if (wikiIdx >= 0) {
      const f = decodeURIComponent(u.pathname.slice(wikiIdx + "/wiki/File:".length));
      return /^placeholder:/i.test(f) ? "" : f;
    }
    const redirIdx = u.pathname.indexOf("/wiki/Special:Redirect/file/");
    if (redirIdx >= 0) {
      return decodeURIComponent(u.pathname.slice(redirIdx + "/wiki/Special:Redirect/file/".length));
    }
  } catch (_) {}
  return "";
}

function normalizePhotoUrl(src) {
  const raw = String(src || "").trim();
  if (!raw) return "";
  const cleaned = raw.replace(/\(/g, "%28").replace(/\)/g, "%29");
  if (/^photos\/[\w.-]+\.(jpe?g|png|webp)$/i.test(cleaned)) return cleaned;
  if (/^\/api\/img\?[^\s"'<>]+$/.test(cleaned)) return cleaned;
  if (/^https:\/\/(commons|upload|thumb)\.wikimedia\.org\/[^\s"'<>]+$/i.test(cleaned)) return cleaned;
  try {
    const url = new URL(cleaned);
    if (url.protocol === "https:" && url.pathname === "/api/img" && url.searchParams.get("file")) return cleaned;
  } catch (_) {}
  const shared = Boolean(window.TRAVEL_SHARE && window.TRAVEL_SHARE.isSharedRoute());
  if (!shared && /^https:\/\/[^\s"'<>]+$/i.test(cleaned)) return cleaned;
  if (!shared && /^data:image\/(?:jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(cleaned)) return cleaned;
  return "";
}

function safePhoto(item) {
  const pic = item && item.photo;
  if (!pic) return null;
  let src = normalizePhotoUrl(pic.src);
  if (!src) return null;
  const isShared = Boolean(window.TRAVEL_SHARE && window.TRAVEL_SHARE.isSharedRoute());
  const hasCustomApi = Boolean(window.TRAVEL_SHARE_API);
  if ((isShared || hasCustomApi) && (/^https:\/\/(commons|upload|thumb)\.wikimedia\.org\//i.test(src) || (isShared && /^photos\//.test(src)))) {
    const cFile = commonsFileFromUrl(src) || commonsFileFromUrl(pic.link || "");
    if (cFile) {
      const base = (window.TRAVEL_SHARE && window.TRAVEL_SHARE.apiBase) || "https://static-travel-guide.huqimeng0306.workers.dev";
      const enc = encodeURIComponent(cFile).replace(/\(/g, "%28").replace(/\)/g, "%29");
      src = `${base.replace(/\/$/, "")}/api/img?file=${enc}&w=960`;
    }
  }
  return { ...pic, src };
}

function tripPhotos(current, max = 3) {
  const list = [];
  const seen = new Set();
  const pushPic = (pic, caption, city) => {
    if (!pic || !pic.src || seen.has(pic.src)) return;
    seen.add(pic.src);
    list.push({ ...pic, caption: caption || "", city: city || "" });
  };
  if (current && current.coverPhoto) {
    const custom = safePhoto({ photo: current.coverPhoto });
    if (custom) pushPic(custom, current.coverPhoto.caption || current.title || "", "");
  }
  const allCandidates = [];
  for (const day of (current && current.days) || []) {
    for (const item of day.items || []) {
      const pic = safePhoto(item);
      if (!pic) continue;
      const itemCity = pic.city || day.city || "";
      const name = item.name || "";
      const caption = itemCity && !name.startsWith(itemCity) ? `${itemCity} · ${name}` : name;
      allCandidates.push({
        pic,
        caption,
        city: itemCity,
        optional: isOptional(item)
      });
    }
  }
  const usedCities = new Set();
  for (const c of allCandidates.filter((x) => !x.optional)) {
    if (c.city && !usedCities.has(c.city)) {
      usedCities.add(c.city);
      pushPic(c.pic, c.caption, c.city);
      if (list.length >= max) return list;
    }
  }
  for (const c of allCandidates) {
    pushPic(c.pic, c.caption, c.city);
    if (list.length >= max) return list;
  }
  return list;
}

function firstPhoto(current) {
  return tripPhotos(current, 1)[0] || null;
}

function syncTripDates(current) {
  const dated = (current.days || []).map((d) => d.date).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d || "")).sort();
  if (dated.length) {
    current.start = dated[0];
    current.end = dated[dated.length - 1];
  }
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

function tripDisplayTitle(item) {
  const raw = String((item && item.title) || "").trim();
  if (raw && raw !== "新行程") return raw;
  const cities = [];
  for (const d of (item && item.days) || []) {
    const c = String(d.city || "").split(/[\/·・]/)[0].trim();
    if (c && !cities.includes(c)) cities.push(c);
  }
  return cities.slice(0, 2).join(" · ") || raw || "未命名目的地";
}

function renderTrips() {
  const isShared = Boolean(window.TRAVEL_SHARE && window.TRAVEL_SHARE.isSharedRoute());
  document.body.classList.toggle("single-trip", state.trips.length <= 1);
  const delMenuBtn = document.querySelector("#menu-delete-trip");
  if (delMenuBtn) delMenuBtn.hidden = state.trips.length <= 1;

  tripList.innerHTML = state.trips.map((item) => {
    const left = pending(item).filter((row) => row.item.reservation === "required").length;
    const cover = firstPhoto(item);
    const active = item.id === trip().id;
    const label = tripDisplayTitle(item);
    return `<button type="button" class="trip-card${active ? " active" : ""}" data-trip="${esc(item.id)}">
      <span class="trip-thumb"${cover ? ` style="background-image:url('${esc(cover.src)}')"` : ""}>${cover ? "" : icon("compass")}</span>
      <span class="trip-meta">
        <span class="trip-title-row">
          <b>${esc(label)}</b>
          ${left ? `<em class="trip-due">${left} 必订</em>` : ""}
        </span>
        <span class="trip-dates">${esc(tripRange(item))}</span>
      </span>
    </button>`;
  }).join("");

  const staticTitle = document.querySelector("#brand-static-title");
  const mobilePicker = document.querySelector("#mobile-trip-picker");
  const mobileCount = document.querySelector("#mobile-trip-count");
  const mobileMenu = document.querySelector("#mobile-trip-menu");
  if (mobilePicker && mobileMenu) {
    const showPicker = !isShared && state.trips.length > 1;
    mobilePicker.hidden = !showPicker;
    document.body.classList.toggle("has-trip-picker", showPicker);
    if (staticTitle) staticTitle.dataset.hasPicker = showPicker ? "1" : "0";
    if (mobileCount) mobileCount.textContent = `${state.trips.length}`;
    if (showPicker) {
      mobileMenu.innerHTML = state.trips.map((item) => {
        const active = item.id === trip().id;
        return `<button type="button" class="trip-pick-item${active ? " active" : ""}" data-trip="${esc(item.id)}">
          <span><b>${esc(tripDisplayTitle(item))}</b><small>${esc(tripRange(item))}</small></span>
          ${active ? `<span class="trip-pick-check">当前</span>` : ""}
        </button>`;
      }).join("");
    }
  }
}

function renderMain() {
  const current = trip();
  const chosen = activeDay(current);
  const todo = pending(current);
  const required = todo.filter((row) => row.item.reservation === "required");
  const suggested = todo.length - required.length;
  const days = dayFilter === "all" ? current.days : current.days.filter((day) => day.id === (chosen && chosen.id));
  const uniqueCities = [];
  for (const run of cityRun(current.days)) {
    const cleanCity = String(run.city || "").split(/[\/·・]/)[0].trim();
    if (cleanCity && uniqueCities[uniqueCities.length - 1] !== cleanCity) uniqueCities.push(cleanCity);
  }
  const routeCities = uniqueCities.join(" → ");
  const plan = budgetOf(current);
  const home = isHomeCurrency(current);
  const rate = home ? 0 : Number(current.budget && current.budget.cnyRate);
  const budgetPillText = plan.total
    ? `预算约 ${rate ? cny(plan.total) : local(plan.total)}`
    : "";
  const visaInfo = visaSummary(current);
  const bookPillText = required.length
    ? `${required.length} 项必订`
    : (suggested ? `待订 ${suggested}` : `预约已齐`);

  main.innerHTML = `
    <div class="zine-feed">
      <header class="zine-masthead">
        <h2>${esc(tripDisplayTitle(current))}</h2>
        <p class="m-sub">${esc(tripRange(current))}${routeCities ? ` · ${esc(routeCities)}` : ""}</p>
        <div class="m-meta-bar">
          ${budgetPillText ? `<button type="button" class="m-meta-chip${budgetOpen ? " open" : ""}" id="toggle-budget" aria-expanded="${budgetOpen}">
            <span>${esc(budgetPillText)}</span><span class="chev${budgetOpen ? " up" : ""}">${icon("chevron")}</span>
          </button>` : ""}
          ${visaInfo ? `<button type="button" class="m-meta-chip${visaOpen ? " open" : ""}" id="toggle-visa" aria-expanded="${visaOpen}">
            <span>${esc(visaInfo.shortLabel)}</span><span class="chev${visaOpen ? " up" : ""}">${icon("chevron")}</span>
          </button>` : ""}
          <button type="button" class="m-meta-chip${required.length ? " due" : ""}${bookingsOpen ? " open" : ""}" id="toggle-books" aria-expanded="${bookingsOpen}">
            <span>${esc(bookPillText)}</span><span class="chev${bookingsOpen ? " up" : ""}">${icon("chevron")}</span>
          </button>
        </div>
      </header>

      ${bookingsOpen ? `<section class="drawer-panel book-list">
        <div class="drawer-head">
          <b>待处理预约</b>
          <button type="button" class="drawer-close" id="close-books">收起</button>
        </div>
        ${todo.length ? todo.map(({ day, item }) => `
          <div class="book-row">
            <span class="flag ${esc(item.reservation)}">${FLAG[item.reservation]}</span>
            <span class="book-name"><b>${esc(item.name)}</b><small>${esc(monthDay(day.date))} · ${esc(day.city)}</small></span>
            ${safeUrl(item.bookingUrl) ? `<a class="btn btn-sm btn-primary ${esc(item.reservation)}" href="${esc(safeUrl(item.bookingUrl))}" target="_blank" rel="noopener">去预约 ↗</a>` : ""}
          </div>`).join("") : `<p class="muted" style="margin:6px 0 2px;font-size:13px;">这趟没有还要处理的预约。</p>`}
      </section>` : ""}

      ${visaOpen ? renderVisaPanel(current) : ""}

      ${budgetOpen ? renderBudgetPanel(current) : ""}

      <nav class="day-tabs" aria-label="选择哪一天">
        ${current.days.map((day, index) => {
          const shortCity = String(day.city || "未定").split(/[\/·・]/)[0].trim();
          const isActive = dayFilter !== "all" && chosen && day.id === chosen.id;
          return `<button type="button" class="day-tab${isActive ? " active" : ""}" data-day="${esc(day.id)}">
            <b>D${index + 1}</b><span>${esc(shortCity)}</span>
          </button>`;
        }).join("")}
        <button type="button" class="day-tab all${dayFilter === "all" ? " active" : ""}" data-day="all">
          <b>全程</b>
        </button>
      </nav>

      <div class="stage-days">
        ${days.map((day) => renderDay(day, current.days.indexOf(day) + 1, current)).join("")}
      </div>
    </div>
    <footer class="page-footnote">票价、汇率与班期仅供参考，出行前请核对官网 · 重要路书可在右上角导出 JSON 备份。</footer>
  `;
  document.querySelector("#map-title").textContent = dayFilter === "all" ? "全程路线" : (chosen ? `${monthDay(chosen.date)} · ${chosen.city}` : "当天路线");
}

function renderBudgetPanel(current) {
  const plan = budgetOf(current);
  if (!plan.total) return "";
  const info = current.budget || {};
  const home = isHomeCurrency(current);
  const rate = home ? 0 : Number(info.cnyRate);
  const left = plan.extras.filter((extra) => !Number.isFinite(extra.amount));
  const unit = currency(current);
  const origins = info.origins || [];
  const origin = pickOrigin(current);
  const hasOriginCost = Boolean(origin && (Number.isFinite(origin.amount) || Number.isFinite(origin.cny)));
  const cats = Object.keys(COST_CAT).filter((cat) => plan.cats[cat] > 0);
  const top = Math.max(...plan.days.map((row) => row.sum), 1);
  return `<section class="drawer-panel budget-panel">
    <div class="drawer-head">
      <div>
        <b>预算对账单 · 每人 ${unit.lead}${local(plan.total)}${rate ? `（约 ${cny(plan.total)}）` : ""}</b>
        <small class="drawer-sub">${esc(info.party || "两人同住一间")}${origin ? ` · ${esc(origin.label)}出发${hasOriginCost ? " · 含往返大交通" : ""}` : ""}${left.length ? ` · 不含${esc(left.map((extra) => extra.label).join("、"))}` : ""}</small>
      </div>
      <button type="button" class="drawer-close" data-toggle-budget="1">收起</button>
    </div>
    ${origins.length > 1 ? `<div class="origin-pick" role="group" aria-label="从哪里出发">
      <span class="origin-label">出发地</span>
      <div class="origin-seg">
        ${origins.map((item) => `<button type="button" class="origin-btn${origin && item.id === origin.id ? " active" : ""}" data-origin="${esc(item.id)}" aria-pressed="${origin && item.id === origin.id}">${esc(item.label)}</button>`).join("")}
      </div>
    </div>` : ""}
    ${origin && origin.brief ? `<p class="origin-brief">${esc(origin.brief)}</p>` : ""}
    ${renderFlightWatch(current, origin)}
    <div class="budget-bar" aria-hidden="true">
      ${cats.map((cat) => `<span class="cat-${cat}" style="width:${(plan.cats[cat] / plan.total * 100).toFixed(1)}%"></span>`).join("")}
    </div>
    <div class="budget-ledger${home ? " single-col" : ""}" role="table" aria-label="分类明细">
      ${cats.map((cat) => {
        const amt = plan.cats[cat];
        const rmb = cny(amt);
        const pct = plan.total ? ((amt / plan.total) * 100).toFixed(0) : "0";
        return `<div class="ledger-row cat-${cat}" role="row">
          <span class="ledger-name" role="cell"><i aria-hidden="true"></i>${COST_CAT[cat]}<em>${pct}%</em></span>
          <span class="ledger-local" role="cell">${local(amt)}</span>
          ${home ? "" : `<span class="ledger-cny" role="cell">${rmb || "—"}</span>`}
        </div>`;
      }).join("")}
    </div>
    <h3 class="section-title">按天花费</h3>
    <ol class="budget-days">
      ${plan.days.map(({ day, sum }) => {
        const rmb = cny(sum);
        return `<li><button type="button" class="budget-day-btn" data-day="${esc(day.id)}">
        <span class="bd-date">${esc(monthDay(day.date) || "未定")}<small>${esc(day.city || "")}</small></span>
        <span class="bd-bar" aria-hidden="true"><i style="width:${(sum / top * 100).toFixed(1)}%"></i></span>
        <span class="bd-amt"><b>${local(sum)}</b>${rmb ? `<small>${rmb}</small>` : ""}</span>
      </button></li>`;
      }).join("")}
    </ol>
    ${plan.extras.length ? `<h3 class="section-title">不跟某一站走的开销</h3>
    <ul class="budget-rows">
      ${plan.extras.map((extra) => `<li><span><b>${esc(extra.label)}</b><small>${esc(extra.note || "")}</small></span><em class="${Number.isFinite(extra.amount) ? "" : "none"}">${Number.isFinite(extra.amount) ? money(extra.amount, true, extra.cny) : "未计入"}</em></li>`).join("")}
    </ul>` : ""}
    ${plan.optional.length ? `<h3 class="section-title">可选项目（未计入总额）</h3>
    <ul class="budget-rows">
      ${plan.optional.map(({ day, item }) => `<li><span><b>${esc(item.name)}</b><small>${esc(monthDay(day.date))} · ${esc(item.cost.note || "")}</small></span><em>${money(item.cost.amount, true)}</em></li>`).join("")}
    </ul>` : ""}
    ${info.basis || rate ? `<p class="budget-note">${esc(info.basis || "")}${rate ? ` 汇率按 ${unit.per} ${unit.unit} ≈ ${esc(Number((rate * unit.per).toFixed(4)))} 元换算${info.rateDate ? `（${esc(info.rateDate)}）` : ""}。` : ""}</p>` : ""}
  </section>`;
}

function renderFlightWatch(current, origin) {
  if (origin && !Number.isFinite(origin.amount) && !Number.isFinite(origin.cny) && /已出|已买|已订/.test(`${origin.brief || ""} ${origin.note || ""}`)) {
    return "";
  }
  const fw = flightWatchUrls(current, origin);
  if (!fw) return "";
  const routeDesc = fw.openJaw
    ? `${fw.fromCity} → ${fw.firstCity} · ${fw.lastCity} → ${fw.fromCity}（开口程）`
    : `${fw.fromCity} ⇄ ${fw.firstCity}（往返）`;
  const targetTip = origin && Number.isFinite(origin.cny)
    ? `当前估算 ¥${origin.cny.toLocaleString("en-US")}，建议低于 ¥${Math.round(origin.cny * 0.88 / 50) * 50} 可入手`
    : (fw.domestic ? "国内航线可直接在携程查实时票价，或用 Google Flights 设降价提醒" : "打开 Google Flights 后点「跟踪价格」即可免费收降价邮件提醒");
  const actionsHtml = fw.domestic
    ? `<a class="btn btn-sm btn-primary" href="${esc(fw.ctripDomestic)}" target="_blank" rel="noopener">${icon("plane")}携程查实时票价</a>
      <a class="btn btn-sm" href="${esc(fw.googleFlights)}" target="_blank" rel="noopener">Google Flights 提醒</a>`
    : `<a class="btn btn-sm btn-primary" href="${esc(fw.googleFlights)}" target="_blank" rel="noopener">${icon("plane")}查实时票价 & 开降价提醒</a>
      <a class="btn btn-sm" href="${esc(fw.tripCom)}" target="_blank" rel="noopener">携程比价</a>`;
  return `<div class="flight-watch">
    <div class="flight-watch-info">
      <span class="fw-badge">${icon("bell")}蹲低价机票</span>
      <span class="fw-route"><b>${esc(routeDesc)}</b><small>${esc(targetTip)}</small></span>
    </div>
    <div class="flight-watch-actions">
      ${actionsHtml}
    </div>
  </div>`;
}

function priceChip(item) {
  if (!hasCost(item)) return "";
  if (item.cost.amount > 0) {
    const rmb = cny(item.cost.amount);
    return `<span class="price">${local(item.cost.amount, true)}${rmb ? ` · ${rmb}` : ""}</span>`;
  }
  return `<span class="price free">${/含/.test(item.cost.note || "") ? "已含" : "免费"}</span>`;
}

function isBackupRouteItem(item) {
  return /^(?:方案\s*[B-Z]|Plan\s*[B-Z]|Option\s*[B-Z])\b/i.test(String((item && item.name) || "").trim());
}

function isPlainTransit(item) {
  return Boolean(item && item.kind === "transport" && !safePhoto(item));
}

function renderStopBlocks(day, list) {
  const blocks = [];
  for (const item of list) {
    if (isPlainTransit(item)) {
      const prev = blocks[blocks.length - 1];
      if (prev && prev.type === "transit") {
        prev.items.push(item);
      } else {
        blocks.push({ type: "transit", items: [item] });
      }
    } else {
      blocks.push({ type: "stop", item });
    }
  }
  return blocks.map((block) => {
    if (block.type === "transit") {
      return `<li class="stop-transit-group">
        <div class="transit-rail">
          ${block.items.map((item) => renderTransitRow(day, item)).join("")}
        </div>
      </li>`;
    }
    return renderItem(day, block.item);
  }).join("");
}

function renderDay(day, number, current = trip()) {
  const domestic = isDomesticDay(day, current);
  const primaryItems = day.items.filter((item) => !isBackupRouteItem(item));
  const backupItems = day.items.filter((item) => isBackupRouteItem(item));
  const activePool = primaryItems.length ? primaryItems : day.items;
  const points = mappableItems(activePool).filter((item) => (domestic ? amapUrl(item) : googleUrl(item)));
  const mapControl = points.length > 1
    ? `<button type="button" class="day-act-chip" data-pins="${esc(day.id)}">地图打点</button>`
    : points.length === 1
      ? `<a class="day-act-chip" href="${esc(domestic ? amapUrl(points[0]) : googleUrl(points[0]))}" target="_blank" rel="noopener">地图打点</a>`
      : "";
  const prevDay = number > 1 ? current.days[number - 2] : null;
  const nextDay = number < current.days.length ? current.days[number] : null;
  const pager = dayFilter !== "all" && current.days.length > 1
    ? `<footer class="day-pager">
        <div class="day-pager-left">
          ${prevDay ? `<button type="button" class="btn btn-sm" data-day="${esc(prevDay.id)}">← 第 ${number - 1} 天</button>` : ""}
        </div>
        <div class="day-pager-right">
          ${nextDay ? `<button type="button" class="btn btn-sm btn-primary" data-day="${esc(nextDay.id)}">第 ${number + 1} 天 →</button>` : ""}
        </div>
      </footer>`
    : "";
  const dayNoStr = String(number).padStart(2, "0");
  const altOpen = openAltDays.has(day.id);

  return `<section class="day" id="${esc(day.id)}">
    <header class="day-head">
      <div class="day-head-info">
        <p class="m-ch-kicker"><span class="m-ch-no">DAY ${dayNoStr}</span>${day.date ? ` · ${esc(monthDay(day.date))} 周${weekday(day.date)}` : ""}${day.city ? ` · ${esc(day.city)}` : ""}</p>
        <h3>${esc(day.title || day.city)}</h3>
      </div>
      <div class="day-tools">
        ${mapControl}
        <details class="more-menu day-more-menu edit-only">
          <summary class="day-act-icon" title="管理这一天" aria-label="管理这一天">${icon("more")}</summary>
          <div class="more-popover">
            <button type="button" class="menu-item" data-add="${esc(day.id)}">${icon("plus")}添加一站</button>
            <button type="button" class="menu-item" data-edit-day="${esc(day.id)}">${icon("pencil")}编辑当天标题与日期</button>
            ${current.days.length > 1 ? `<button type="button" class="menu-item danger-item" data-del-day="${esc(day.id)}">${icon("trash")}删除这一天</button>` : ""}
          </div>
        </details>
      </div>
    </header>
    ${day.items.length ? `
      <ol class="stops">
        ${renderStopBlocks(day, primaryItems.length ? primaryItems : day.items)}
      </ol>
      ${primaryItems.length && backupItems.length ? `
        <details class="alt-route-fold" data-alt-day="${esc(day.id)}"${altOpen ? " open" : ""}>
          <summary class="alt-route-summary">
            <span>备选路线（共 ${backupItems.length} 站）</span>
            <span class="alt-route-hint">${altOpen ? "收起" : "展开查看"}</span>
          </summary>
          <ol class="stops alt-stops">
            ${renderStopBlocks(day, backupItems)}
          </ol>
        </details>
      ` : ""}
    ` : `<p class="empty">这一天还没有地点，点右上角「··· → 添加一站」。</p>`}
    ${pager}
  </section>`;
}

function isOptional(item) {
  return /可不去|想进去|再订|二选一|下雨|早到/.test(item.time || "");
}

function shortPriceText(item) {
  if (!hasCost(item)) return "";
  if (item.cost.amount > 0) {
    return cnyRate() ? `约 ${cny(item.cost.amount) || local(item.cost.amount, true)}` : local(item.cost.amount, true);
  }
  return /含/.test(item.cost.note || "") ? "" : "免费";
}

function cardGist(item) {
  const source = String(item.why || item.note || "").trim();
  if (!source) return "";
  const first = source.split(/[。；！？\n]/)[0].trim();
  return first.length > 46 ? `${first.slice(0, 45)}…` : first;
}

function renderPrintNotes(item, needs) {
  return `<div class="print-only-notes">
    ${item.why ? `<p>${esc(item.why)}</p>` : ""}
    ${item.note ? `<p>${esc(item.note)}</p>` : ""}
    ${hasCost(item) && item.cost.note ? `<p>${esc(item.cost.note)}</p>` : ""}
    ${needs && item.reservationNote ? `<p>${esc(FLAG[item.reservation])}：${esc(item.reservationNote)}</p>` : ""}
  </div>`;
}

function renderTransitRow(day, item) {
  const needs = item.reservation !== "none";
  const priceStr = hasCost(item) && item.cost.amount > 0 ? shortPriceText(item) : "";
  const isSelected = Boolean(activeDetail && activeDetail.itemId === item.id);
  return `<div class="s-card transit-row${isSelected ? " is-active" : ""}${isOptional(item) ? " optional" : ""}" id="item-${esc(item.id)}" data-open-stop="${esc(day.id)}:${esc(item.id)}" tabindex="0" role="button" aria-label="查看 ${esc(item.name)} 详情">
    <span class="transit-dot" aria-hidden="true"></span>
    <time class="transit-time">${esc(item.time || "—")}</time>
    <span class="transit-name">${esc(item.name)}</span>
    ${priceStr ? `<span class="transit-cost">${esc(priceStr)}</span>` : ""}
    ${renderPrintNotes(item, needs)}
  </div>`;
}

function renderItem(day, item) {
  const booked = !!state.booked[item.id];
  const needs = item.reservation !== "none";
  const pic = safePhoto(item);
  const kindText = KIND[item.kind] || "地点";
  const priceStr = shortPriceText(item);
  const gist = cardGist(item);
  const isSelected = Boolean(activeDetail && activeDetail.itemId === item.id);
  const urgentBook = needs && item.reservation === "required" && !booked;
  const leftMeta = [item.time, kindText].filter(Boolean).join(" · ");

  return `<li class="stop${pic ? " has-photo" : ""}${isOptional(item) ? " optional" : ""}" id="item-${esc(item.id)}">
    <article class="s-card zine-card${isSelected ? " is-active" : ""}" data-open-stop="${esc(day.id)}:${esc(item.id)}" tabindex="0" role="button" aria-label="查看 ${esc(item.name)} 详情">
      ${pic ? `<div class="zine-photo">
        <img src="${esc(pic.src)}" alt="${esc(item.name)}" decoding="async" />
      </div>` : ""}
      <div class="zine-body">
        <div class="zine-meta">
          <span class="zine-kicker">${esc(leftMeta)}</span>
          <span class="zine-meta-right">
            ${priceStr ? `<span>${esc(priceStr)}</span>` : ""}
            ${urgentBook ? `<em class="zine-due">必订</em>` : (booked && needs ? `<em class="zine-booked">已订</em>` : "")}
          </span>
        </div>
        <h4 class="zine-title">${esc(item.name)}</h4>
        ${gist ? `<p class="zine-gist">${esc(gist)}</p>` : ""}
        ${renderPrintNotes(item, needs)}
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
  if (!map || !window.L) return;
  markers.forEach((layer) => layer.remove());
  markers = [];
  const current = trip();
  const chosen = activeDay(current);
  const days = dayFilter === "all" ? current.days : (chosen ? [chosen] : []);
  const allBounds = [];
  const placeBounds = [];

  for (const day of days) {
    const dayNo = current.days.indexOf(day) + 1;
    const includeAlt = dayFilter === "all" || openAltDays.has(day.id);
    const groups = new Map();
    const line = [];
    day.items.forEach((item, index) => {
      if (!includeAlt && isBackupRouteItem(item)) return;
      if (!Number.isFinite(item.lat) || !Number.isFinite(item.lng)) return;
      const key = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
      if (!groups.has(key)) groups.set(key, { first: item, nums: [], items: [] });
      groups.get(key).nums.push(index + 1);
      groups.get(key).items.push(item);
      line.push([item.lat, item.lng]);
      allBounds.push([item.lat, item.lng]);
      if (item.kind !== "transport") placeBounds.push([item.lat, item.lng]);
    });
    if (line.length > 1) {
      const curTheme = document.documentElement.dataset.theme || "paper";
      const lineColor = curTheme === "dark" ? "#94a3b8" : (curTheme === "manga" ? "#181818" : "#3a3833");
      const lineWeight = curTheme === "manga" ? 2.5 : 2;
      markers.push(L.polyline(line, { color: lineColor, weight: lineWeight, opacity: curTheme === "manga" ? 0.72 : 0.5, dashArray: "5 7" }).addTo(map));
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
      marker.bindPopup(group.items.map((item) => {
        const domestic = isDomesticItem(item, day, current);
        const navHtml = domestic
          ? `<a href="${esc(amapUrl(item))}" target="_blank" rel="noopener">在高德地图打开</a> · <a href="${esc(appleMapsUrl(item))}" target="_blank" rel="noopener">苹果地图</a>`
          : `<a href="${esc(googleUrl(item))}" target="_blank" rel="noopener">在谷歌地图打开</a>`;
        return `${safePhoto(item) ? `<img class="popup-photo" src="${esc(safePhoto(item).src)}" alt="" />` : ""}<b>${esc(item.name)}</b><span>${esc(item.time || "")}</span>${navHtml}`;
      }).join("<hr>"));
      marker._stopIds = group.items.map((it) => it.id);
      marker.addTo(map);
      markers.push(marker);
    }
  }

  let fitTarget = allBounds;
  if (placeBounds.length) {
    const avgLat = placeBounds.reduce((s, p) => s + p[0], 0) / placeBounds.length;
    const avgLng = placeBounds.reduce((s, p) => s + p[1], 0) / placeBounds.length;
    const maxRadius = dayFilter === "all" ? 8 : 0.65;
    const nearby = allBounds.filter(([lat, lng]) => Math.hypot(lat - avgLat, lng - avgLng) <= maxRadius);
    fitTarget = nearby.length >= placeBounds.length ? nearby : placeBounds;
  }
  if (fitTarget.length) map.fitBounds(fitTarget, { padding: [36, 36], maxZoom: 14 });

  document.querySelector("#map-legend").textContent = dayFilter === "all"
    ? "数字代表第几天；切回某一天可查看当天站点顺序。"
    : "数字与左侧站点顺序对应，虚线为游览先后。";
  setTimeout(() => map.invalidateSize(), 0);
}

function syncStickyOffsets() {
  const topEl = document.querySelector(".top");
  const tabsEl = main.querySelector(".stage-sticky") || main.querySelector(".day-tabs");
  if (topEl) {
    document.documentElement.style.setProperty("--top-h", `${Math.round(topEl.getBoundingClientRect().height)}px`);
  }
  if (tabsEl) {
    document.documentElement.style.setProperty("--tabs-h", `${Math.round(tabsEl.getBoundingClientRect().height)}px`);
  }
}

window.addEventListener("resize", () => {
  syncStickyOffsets();
  updateMapFab();
});

let fabScrollRaf = 0;
window.addEventListener("scroll", () => {
  if (fabScrollRaf) return;
  fabScrollRaf = requestAnimationFrame(() => {
    fabScrollRaf = 0;
    updateMapFab();
  });
}, { passive: true });

if (mapFab) {
  mapFab.addEventListener("click", () => {
    if (mapFab.dataset.mode === "back") {
      const stopEl = returnStopId ? document.getElementById(`item-${returnStopId}`) : null;
      const topOffset = Math.round(
        (document.querySelector(".top")?.getBoundingClientRect().height || 59) +
        (document.querySelector(".day-tabs")?.getBoundingClientRect().height || 88) + 12
      );
      const backY = stopEl
        ? window.scrollY + stopEl.getBoundingClientRect().top - topOffset
        : (Number.isFinite(returnScrollY) ? returnScrollY : lastItineraryY);
      returnScrollY = null;
      returnStopId = "";
      smoothScrollTo(backY, updateMapFab);
      return;
    }
    returnScrollY = window.scrollY;
    returnStopId = "";
    scrollToMapPanel();
  });
}

function syncLocalSeedButtons() {
  const current = trip();
  const isShared = Boolean(window.TRAVEL_SHARE && window.TRAVEL_SHARE.isSharedRoute());
  const baseHash = current && !isShared && SEED_BY_ID.has(current.id) && state.editedTrips
    ? state.editedTrips[current.id]
    : "";
  const hasLocalEdit = Boolean(baseHash);
  const hasSeedUpdate = Boolean(hasLocalEdit && baseHash !== SEED_HASHES.get(current.id));
  if (seedUpdateBtn) seedUpdateBtn.hidden = !hasSeedUpdate;
  if (resetLocalBtn) resetLocalBtn.hidden = !hasLocalEdit;
}

function resetCurrentTripToSeed(promptText) {
  const current = trip();
  if (!current || !SEED_BY_ID.has(current.id)) return;
  if (!window.confirm(promptText)) return;
  const idx = state.trips.findIndex((item) => item.id === current.id);
  if (idx >= 0) state.trips[idx] = structuredClone(SEED_BY_ID.get(current.id));
  if (state.editedTrips) delete state.editedTrips[current.id];
  const more = document.querySelector("#more-menu");
  if (more) more.open = false;
  render();
}

if (seedUpdateBtn) {
  seedUpdateBtn.addEventListener("click", () => {
    resetCurrentTripToSeed("线上路书已更新。要用最新线上内容覆盖你在这台浏览器里的本地修改吗？（已订好和签证清单打勾会保留）");
  });
}

if (resetLocalBtn) {
  resetLocalBtn.addEventListener("click", () => {
    resetCurrentTripToSeed("恢复成线上默认路书内容，清除当前浏览器对这趟行程的本地修改？（已订好和签证清单打勾会保留）");
  });
}

function render() {
  if (!state.trips.length) return;
  if (!trip()) state.tripId = state.trips[0].id;
  const scroll = main.scrollTop;
  renderTrips();
  renderMain();
  syncLocalSeedButtons();
  syncStickyOffsets();
  drawMap();
  main.scrollTop = scroll;
  updateMapFab();
  save();
}

function openEditor(dayId, item) {
  editing = { dayId, id: item ? item.id : null };
  form.reset();
  document.querySelector("#editor-title").textContent = item ? "修改地点" : "添加地点";
  if (item) {
    for (const key of ["time", "name", "kind", "address", "why", "reservation", "reservationNote", "bookingUrl", "note"]) {
      form.elements[key].value = item[key] || (key === "kind" ? "sight" : key === "reservation" ? "none" : "");
    }
    form.elements.lat.value = Number.isFinite(item.lat) ? item.lat : "";
    form.elements.lng.value = Number.isFinite(item.lng) ? item.lng : "";
    form.elements.costAmount.value = hasCost(item) ? item.cost.amount : "";
    form.elements.costNote.value = (item.cost && item.cost.note) || "";
    const pic = safePhoto(item);
    form.elements.photoSrc.value = pic ? pic.src : "";
    form.elements.photoCredit.value = pic ? (pic.credit || "") : "";
    form.elements.photoLink.value = pic ? (pic.link || "") : "";
  }
  editor.showModal();
}

function readForm() {
  const data = Object.fromEntries(new FormData(form));
  const lat = parseFloat(data.lat);
  const lng = parseFloat(data.lng);
  const spend = parseFloat(data.costAmount);
  const photoSrc = (data.photoSrc || "").trim();
  const photoCredit = (data.photoCredit || "").trim();
  const photoLink = (data.photoLink || "").trim();
  return {
    time: data.time.trim(),
    name: data.name.trim(),
    kind: data.kind,
    address: data.address.trim(),
    why: (data.why || "").trim(),
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    reservation: data.reservation,
    reservationNote: data.reservationNote.trim(),
    bookingUrl: data.bookingUrl.trim(),
    cost: Number.isFinite(spend) ? { amount: spend, note: data.costNote.trim() } : null,
    photo: normalizePhotoUrl(photoSrc)
      ? { src: normalizePhotoUrl(photoSrc), credit: photoCredit || "Wikimedia Commons", link: photoLink || photoSrc }
      : null,
    note: data.note.trim()
  };
}

let activeTileLayer = null;

function syncMapTiles() {
  if (!map || !window.L) return;
  const dark = document.documentElement.dataset.theme === "dark";
  if (activeTileLayer) {
    map.removeLayer(activeTileLayer);
    activeTileLayer = null;
  }
  if (dark) {
    const darkBase = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16,
      attribution: 'Tiles &copy; Esri'
    });
    const darkRef = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16
    });
    activeTileLayer = L.layerGroup([darkBase, darkRef]).addTo(map);
    return;
  }
  const primaryTiles = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri'
  });
  let tileLoaded = false;
  let tileErrors = 0;
  let switchedTiles = false;
  primaryTiles.on("tileload", () => { tileLoaded = true; });
  primaryTiles.on("tileerror", () => {
    tileErrors += 1;
    if (!tileLoaded && !switchedTiles && tileErrors >= 4 && activeTileLayer === primaryTiles) {
      switchedTiles = true;
      map.removeLayer(primaryTiles);
      activeTileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
    }
  });
  activeTileLayer = primaryTiles.addTo(map);
}

if (window.L) {
  map = L.map("map", { zoomControl: true });
  syncMapTiles();
  map.setView([-25.5, 146.5], 4);
}

const VALID_THEMES = new Set(["paper", "dark", "manga"]);
function currentTheme() {
  const cur = document.documentElement.dataset.theme;
  return VALID_THEMES.has(cur) ? cur : "paper";
}

function syncThemeControl() {
  const cur = currentTheme();
  document.documentElement.dataset.theme = cur;
  document.querySelectorAll("[data-set-theme]").forEach((btn) => {
    const on = btn.dataset.setTheme === cur;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  });
}

function applyTheme(next) {
  const mode = VALID_THEMES.has(next) ? next : "paper";
  const prevDark = currentTheme() === "dark";
  document.documentElement.dataset.theme = mode;
  try {
    localStorage.setItem("travel-guides-theme", mode);
  } catch (_) {}
  syncThemeControl();
  if ((mode === "dark") !== prevDark) syncMapTiles();
  drawMap();
}

syncThemeControl();
document.querySelector("#theme-switch")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-set-theme]");
  if (!btn) return;
  applyTheme(btn.dataset.setTheme);
});

document.addEventListener("click", (event) => {
  document.querySelectorAll(".more-menu[open], .trip-picker[open]").forEach((menu) => {
    if (!event.target.closest(".more-menu, .trip-picker") || event.target.closest(".more-menu, .trip-picker") !== menu) {
      menu.open = false;
    }
  });
});

function createNewTripPrompt() {
  const more = document.querySelector("#more-menu");
  if (more) more.open = false;
  const id = `trip-${Date.now()}`;
  const title = window.prompt("目的地地名（如：北海道、京都、澳洲）", "");
  if (title == null) return;
  const place = title.trim() || "新目的地";
  state.trips.unshift({
    id,
    title: place,
    start: "",
    end: "",
    summary: "",
    days: [{ id: `${id}-d1`, date: "", city: title.trim(), title: "第一天", items: [] }]
  });
  state.tripId = id;
  dayFilter = "";
  render();
}

document.querySelector("#new-trip").addEventListener("click", createNewTripPrompt);
const menuNewTrip = document.querySelector("#menu-new-trip");
if (menuNewTrip) menuNewTrip.addEventListener("click", createNewTripPrompt);

function promptEditCover() {
  const more = document.querySelector("#more-menu");
  if (more) more.open = false;
  const current = trip();
  const curSrc = (current.coverPhoto && current.coverPhoto.src) || "";
  const next = window.prompt("自定义顶部封面图：云端只保存 Wikimedia 或本站 /api/img 链接，留空则用首个景点配图", curSrc);
  if (next == null) return;
  const trimmed = next.trim();
  if (!trimmed) {
    delete current.coverPhoto;
  } else if (normalizePhotoUrl(trimmed)) {
    current.coverPhoto = { src: normalizePhotoUrl(trimmed), credit: "", link: trimmed, caption: current.title };
  } else {
    window.alert("请输入 Wikimedia 或本站 /api/img 图片地址");
    return;
  }
  markTripEdited(current.id);
  render();
}

function promptRenameTrip() {
  const more = document.querySelector("#more-menu");
  if (more) more.open = false;
  const title = window.prompt("行程名称", trip().title);
  if (!title) return;
  trip().title = title.trim();
  markTripEdited(trip().id);
  render();
}

function promptDeleteTrip() {
  const more = document.querySelector("#more-menu");
  if (more) more.open = false;
  if (state.trips.length <= 1) return;
  const targetId = state.tripId;
  if (!window.confirm(`删除「${trip().title}」？`)) return;
  if (SEED_BY_ID.has(targetId)) {
    state.deletedSeedIds = [...new Set([...(state.deletedSeedIds || []), targetId])];
    if (state.editedTrips) delete state.editedTrips[targetId];
  }
  state.trips = state.trips.filter((item) => item.id !== targetId);
  state.tripId = state.trips[0].id;
  dayFilter = "";
  render();
}

document.querySelector("#menu-add-day")?.addEventListener("click", () => {
  const more = document.querySelector("#more-menu");
  if (more) more.open = false;
  openDayEditor(null);
});
document.querySelector("#menu-rename-trip")?.addEventListener("click", promptRenameTrip);
document.querySelector("#menu-edit-cover")?.addEventListener("click", promptEditCover);
document.querySelector("#menu-delete-trip")?.addEventListener("click", promptDeleteTrip);

const stopSheet = document.querySelector("#stop-sheet");
const pinSheet = document.querySelector("#pin-sheet");
let activeStopMenu = null;

function syncStopSheet() {
  if (!stopSheet || !activeStopMenu) return false;
  const day = trip().days.find((d) => d.id === activeStopMenu.dayId);
  const idx = day ? day.items.findIndex((it) => it.id === activeStopMenu.itemId) : -1;
  if (!day || idx < 0) return false;
  const item = day.items[idx];
  const posEl = document.querySelector("#stop-sheet-pos");
  const titleEl = document.querySelector("#stop-sheet-title");
  const upBtn = document.querySelector("#sheet-move-up");
  const downBtn = document.querySelector("#sheet-move-down");
  if (posEl) posEl.textContent = `${monthDay(day.date) || day.city || "当天"} · 第 ${idx + 1} / ${day.items.length} 站`;
  if (titleEl) titleEl.textContent = `${item.time ? `${item.time} · ` : ""}${item.name}`;
  if (upBtn) upBtn.disabled = idx <= 0;
  if (downBtn) downBtn.disabled = idx >= day.items.length - 1;
  return true;
}

function openStopSheet(dayId, itemId) {
  activeStopMenu = { dayId, itemId };
  if (!syncStopSheet() || !stopSheet) return;
  stopSheet.showModal();
}

function moveStopBy(dayId, itemId, delta) {
  const day = trip().days.find((d) => d.id === dayId);
  if (!day) return false;
  const idx = day.items.findIndex((it) => it.id === itemId);
  const targetIdx = idx + delta;
  if (idx < 0 || targetIdx < 0 || targetIdx >= day.items.length) return false;
  const [moved] = day.items.splice(idx, 1);
  day.items.splice(targetIdx, 0, moved);
  markTripEdited(trip().id);
  render();
  return true;
}

if (stopSheet) {
  document.querySelector("#sheet-move-up")?.addEventListener("click", () => {
    if (!activeStopMenu) return;
    if (moveStopBy(activeStopMenu.dayId, activeStopMenu.itemId, -1)) {
      syncStopSheet();
    }
  });
  document.querySelector("#sheet-move-down")?.addEventListener("click", () => {
    if (!activeStopMenu) return;
    if (moveStopBy(activeStopMenu.dayId, activeStopMenu.itemId, 1)) {
      syncStopSheet();
    }
  });
  document.querySelector("#sheet-edit-stop")?.addEventListener("click", () => {
    if (!activeStopMenu) return;
    const { dayId, itemId } = activeStopMenu;
    stopSheet.close();
    const day = trip().days.find((d) => d.id === dayId);
    const target = day && day.items.find((it) => it.id === itemId);
    if (target) openEditor(dayId, target);
  });
  document.querySelector("#sheet-del-stop")?.addEventListener("click", () => {
    if (!activeStopMenu) return;
    const { dayId, itemId } = activeStopMenu;
    const day = trip().days.find((d) => d.id === dayId);
    const target = day && day.items.find((it) => it.id === itemId);
    if (!day || !window.confirm(`删除「${target ? target.name : "这一站"}」？`)) return;
    stopSheet.close();
    day.items = day.items.filter((it) => it.id !== itemId);
    delete state.booked[itemId];
    markTripEdited(trip().id);
    render();
  });
}

for (const dlg of [stopSheet, pinSheet]) {
  if (!dlg) continue;
  dlg.addEventListener("click", (event) => {
    if (event.target === dlg) dlg.close();
  });
}

document.querySelector("#export-btn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ trips: state.trips, booked: state.booked }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${trip().title || "行程"}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});

const printBtn = document.querySelector("#print-btn");
if (printBtn) {
  printBtn.addEventListener("click", () => {
    const prevDay = dayFilter;
    const prevBudget = budgetOpen;
    const prevVisa = visaOpen;
    dayFilter = "all";
    budgetOpen = true;
    visaOpen = true;
    render();
    setTimeout(() => {
      window.print();
      dayFilter = prevDay;
      budgetOpen = prevBudget;
      visaOpen = prevVisa;
      render();
    }, 180);
  });
}

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
  for (const item of state.trips) {
    if (SEED_BY_ID.has(item.id)) markTripEdited(item.id);
  }
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
document.querySelector("#day-editor-cancel").addEventListener("click", () => dayEditor.close());

function openDayEditor(day) {
  editingDayId = day ? day.id : null;
  dayForm.reset();
  document.querySelector("#day-editor-title").textContent = day ? "编辑这一天" : "添加新的一天";
  if (day) {
    dayForm.elements.date.value = day.date || "";
    dayForm.elements.city.value = day.city || "";
    dayForm.elements.title.value = day.title || "";
  }
  dayEditor.showModal();
}

dayForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const current = trip();
  const date = (dayForm.elements.date.value || "").trim();
  const city = (dayForm.elements.city.value || "").trim();
  const title = (dayForm.elements.title.value || "").trim();
  if (!title) return;
  if (editingDayId) {
    const target = current.days.find((d) => d.id === editingDayId);
    if (target) {
      target.date = date;
      target.city = city;
      target.title = title;
    }
  } else {
    current.days.push({
      id: `day-${Date.now()}`,
      date,
      city,
      title,
      items: []
    });
  }
  syncTripDates(current);
  markTripEdited(current.id);
  dayEditor.close();
  render();
});

document.querySelector("#photo-search-btn").addEventListener("click", async () => {
  const day = editing && trip().days.find((item) => item.id === editing.dayId);
  const query = `${form.elements.name.value} ${(day && day.city) || ""} ${form.elements.address.value}`.trim();
  if (!query) return;
  const button = document.querySelector("#photo-search-btn");
  const label = button.querySelector(".label");
  button.disabled = true;
  label.textContent = "搜图中…";
  try {
    let picked = null;
    const isShared = Boolean(window.TRAVEL_SHARE && window.TRAVEL_SHARE.isSharedRoute());
    const hasCustomApi = Boolean(window.TRAVEL_SHARE_API);
    const proxyBase = ((window.TRAVEL_SHARE && window.TRAVEL_SHARE.apiBase) || "https://static-travel-guide.huqimeng0306.workers.dev").replace(/\/$/, "");
    if (isShared || hasCustomApi) {
      try {
        const ctrl = typeof AbortController === "function" ? new AbortController() : null;
        const timer = ctrl ? setTimeout(() => ctrl.abort(), 4000) : 0;
        const pRes = await fetch(`${proxyBase}/api/commons-search?q=${encodeURIComponent(query)}`, ctrl ? { signal: ctrl.signal } : undefined);
        if (timer) clearTimeout(timer);
        if (pRes.ok) {
          const pData = await pRes.json();
          picked = pData.picked || null;
        }
      } catch (_) {}
    }

    if (!picked) {
      const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=6&format=json&origin=*&srsearch=${encodeURIComponent(query)}`;
      const sRes = await fetch(searchUrl);
      const sData = await sRes.json();
      const hits = (sData.query && sData.query.search) || [];
      for (const hit of hits) {
        if (!/\.(jpe?g|png|webp)$/i.test(hit.title)) continue;
        const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(hit.title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&format=json&origin=*`;
        const iRes = await fetch(infoUrl);
        const iData = await iRes.json();
        const pages = (iData.query && iData.query.pages) || {};
        const page = Object.values(pages)[0];
        const info = page && page.imageinfo && page.imageinfo[0];
        if (!info) continue;
        const meta = info.extmetadata || {};
        const artist = String((meta.Artist && meta.Artist.value) || "Commons").replace(/<[^>]+>/g, "").trim();
        const lic = String((meta.LicenseShortName && meta.LicenseShortName.value) || "CC").replace(/<[^>]+>/g, "").trim();
        const file = hit.title.replace(/^File:/, "");
        const enc = encodeURIComponent(file).replace(/\(/g, "%28").replace(/\)/g, "%29");
        picked = {
          src: (isShared || hasCustomApi) ? `${proxyBase}/api/img?file=${enc}&w=1200` : (info.thumburl || info.url),
          credit: `${artist} · ${lic}`.slice(0, 60),
          link: `https://commons.wikimedia.org/wiki/File:${enc}`
        };
        break;
      }
    }

    if (!picked) {
      label.textContent = "未搜到图";
      return;
    }
    form.elements.photoSrc.value = picked.src;
    form.elements.photoCredit.value = picked.credit;
    form.elements.photoLink.value = picked.link;
    label.textContent = "已配图";
  } catch (_) {
    label.textContent = "搜图失败";
  } finally {
    button.disabled = false;
    setTimeout(() => { label.textContent = "自动搜图"; }, 1600);
  }
});

document.addEventListener("error", (event) => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement)) return;
  const fig = img.closest(".stop-photo, .cd-thumb, .s-card-thumb, .m-panel-photo, .zine-photo");
  if (fig) {
    fig.remove();
    return;
  }
  const heroFig = img.closest(".hero-cover");
  if (heroFig) {
    const mosaic = heroFig.closest(".hero-stage, .hero-mosaic");
    const head = heroFig.closest(".trip-head");
    heroFig.remove();
    if (mosaic) {
      const rem = mosaic.querySelectorAll(".hero-cover").length;
      mosaic.className = `${mosaic.classList.contains("hero-stage") ? "hero-stage" : "hero-mosaic"} count-${rem}`;
      if (!rem) {
        mosaic.remove();
        if (head) head.classList.remove("has-cover");
      }
    } else if (head) {
      head.classList.remove("has-cover");
    }
    return;
  }
  if (img.classList.contains("popup-photo")) img.remove();
}, true);

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
  markTripEdited(current.id);
  editor.close();
  render();
  if (editing.id) openStopDetail(editing.dayId, editing.id);
});

const stopDetail = document.querySelector("#stop-detail");
const detailContent = document.querySelector("#detail-content");
let activeDetail = null;
let closeDetailTimer = 0;

function syncActiveCardDom() {
  document.querySelectorAll(".s-card.is-active").forEach((el) => el.classList.remove("is-active"));
  if (!activeDetail) return;
  const activeEl = document.querySelector(`[data-open-stop="${CSS.escape(`${activeDetail.dayId}:${activeDetail.itemId}`)}"]`);
  if (activeEl) activeEl.classList.add("is-active");
}

function renderStopDetailPanel() {
  if (!stopDetail || !detailContent || !activeDetail) return false;
  const current = trip();
  const day = current.days.find((d) => d.id === activeDetail.dayId);
  const idx = day ? day.items.findIndex((it) => it.id === activeDetail.itemId) : -1;
  if (!day || idx < 0) return false;
  const item = day.items[idx];
  const pic = safePhoto(item);
  const book = safeUrl(item.bookingUrl);
  const booked = !!state.booked[item.id];
  const needs = item.reservation !== "none";
  const domestic = isDomesticItem(item, day, current);
  const mapHref = domestic ? amapUrl(item) : googleUrl(item);
  const mapLabel = domestic ? "高德打点" : "谷歌打点";
  const isFlight = item.kind === "transport" && /飞|航班|[A-Z]{2}\s*\d{2,4}/i.test(item.name || "");
  const kindText = item.kind === "transport" ? (isFlight ? "航班" : "交通") : (KIND[item.kind] || "地点");
  const fullCost = hasCost(item)
    ? (item.cost.amount > 0
      ? `${local(item.cost.amount, true)}${cnyRate() ? ` · 约 ${cny(item.cost.amount)}` : ""}`
      : (/含/.test(item.cost.note || "") ? "费用已含" : "免费"))
    : "";

  const chips = [
    item.time,
    kindText,
    fullCost,
    `${monthDay(day.date) || day.city} · 第 ${idx + 1}/${day.items.length} 站`
  ].filter(Boolean);

  detailContent.innerHTML = `
    <div class="dp-scroll">
      ${pic ? `<figure class="dp-cover">
        <img src="${esc(pic.src)}" alt="${esc(item.name)}" />
        ${pic.credit ? `<a class="dp-credit" href="${esc(safeUrl(pic.link))}" target="_blank" rel="noopener">${esc(pic.credit)}</a>` : ""}
        <button type="button" class="dp-close on-photo" data-detail-close aria-label="关闭">${icon("close")}</button>
      </figure>` : ""}
      <div class="dp-body">
        <div class="dp-head">
          <div class="dp-head-main">
            <p class="dp-meta-line">${esc(chips.join(" · "))}</p>
            <h3 class="dp-title" id="dp-title">${esc(item.name)}</h3>
          </div>
          ${pic ? "" : `<button type="button" class="dp-close" data-detail-close aria-label="关闭">${icon("close")}</button>`}
        </div>

        ${item.why ? `<p class="dp-lead">${esc(item.why)}</p>` : ""}
        ${item.note ? `<div class="dp-prose">${esc(item.note)}</div>` : ""}

        ${(hasCost(item) && item.cost.note) || needs || item.address ? `<dl class="dp-kv">
          ${hasCost(item) && item.cost.note ? `<div class="dp-kv-row">
            <dt>费用说明</dt>
            <dd>${esc(item.cost.note)}</dd>
          </div>` : ""}
          ${needs ? `<div class="dp-kv-row">
            <dt>${esc(FLAG[item.reservation])}</dt>
            <dd>
              <span>${esc(item.reservationNote || "出行前请确认预约状态")}</span>
              <label class="booked-inline-toggle edit-only${booked ? " on" : ""}">
                <input type="checkbox" data-detail-booked="${esc(item.id)}" ${booked ? "checked" : ""} />
                ${booked ? `${icon("check")}已订好` : "标为已订"}
              </label>
            </dd>
          </div>` : ""}
          ${item.address ? `<div class="dp-kv-row">
            <dt>导航地址</dt>
            <dd>${esc(item.address)}</dd>
          </div>` : ""}
        </dl>` : ""}

        <div class="dp-manage edit-only">
          <span class="dp-manage-label">调整此站</span>
          <button type="button" class="dp-m-btn" data-detail-move="-1" ${idx <= 0 ? "disabled" : ""}>${icon("arrowUp")}上移</button>
          <button type="button" class="dp-m-btn" data-detail-move="1" ${idx >= day.items.length - 1 ? "disabled" : ""}>${icon("arrowDown")}下移</button>
          <button type="button" class="dp-m-btn" data-detail-edit>${icon("pencil")}编辑</button>
          <button type="button" class="dp-m-btn danger" data-detail-del>${icon("trash")}删除</button>
        </div>
      </div>
    </div>

    <footer class="dp-footer">
      ${book && needs ? `<a class="btn btn-primary dp-act" href="${esc(book)}" target="_blank" rel="noopener">${icon("calendar")}去预约 ↗</a>` : ""}
      ${mapHref ? `<a class="btn dp-act${!(book && needs) ? " btn-primary" : ""}" href="${esc(mapHref)}" target="_blank" rel="noopener">${icon("pin")}${mapLabel} ↗</a>` : ""}
      ${item.kind !== "transport" ? `<a class="btn dp-act" href="${esc(xhsUrl(day, item))}"${isMobileDevice() ? "" : ' target="_blank" rel="noopener"'}>${icon("sparkles")}${item.kind === "food" ? "小红书点单" : item.kind === "stay" ? "小红书评价" : "小红书实况"} ↗</a>` : ""}
      ${Number.isFinite(item.lat) && Number.isFinite(item.lng) ? `<button type="button" class="btn dp-act-icon" data-detail-map="${esc(day.id)}:${esc(item.id)}" title="在页内地图定位" aria-label="在页内地图定位">${icon("map")}</button>` : ""}
    </footer>
  `;
  return true;
}

function openStopDetail(dayId, itemId) {
  activeDetail = { dayId, itemId };
  if (!renderStopDetailPanel() || !stopDetail) return;
  clearTimeout(closeDetailTimer);
  stopDetail.hidden = false;
  stopDetail.setAttribute("aria-hidden", "false");
  document.body.classList.add("panel-open");
  syncActiveCardDom();
  requestAnimationFrame(() => {
    stopDetail.classList.add("is-open");
  });
  if (!isStackedLayout() && map && window.L) {
    const day = trip().days.find((d) => d.id === dayId);
    const item = day && day.items.find((it) => it.id === itemId);
    if (item && Number.isFinite(item.lat) && Number.isFinite(item.lng)) {
      map.flyTo([item.lat, item.lng], Math.max(map.getZoom(), 13), { duration: 0.45 });
      const entry = markers.find((m) => m._stopIds && m._stopIds.includes(itemId));
      if (entry) setTimeout(() => entry.openPopup(), 220);
    }
  }
}

function closeStopDetail() {
  if (!stopDetail || stopDetail.hidden) return;
  activeDetail = null;
  syncActiveCardDom();
  stopDetail.classList.remove("is-open");
  stopDetail.setAttribute("aria-hidden", "true");
  document.body.classList.remove("panel-open");
  clearTimeout(closeDetailTimer);
  closeDetailTimer = window.setTimeout(() => {
    stopDetail.hidden = true;
  }, 240);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && stopDetail && !stopDetail.hidden) {
    closeStopDetail();
  }
});

if (stopDetail) {
  const sheetEl = stopDetail.querySelector(".panel-sheet");
  let touchStartY = 0;
  let touchDeltaY = 0;
  if (sheetEl) {
    sheetEl.addEventListener("touchstart", (e) => {
      const scroller = sheetEl.querySelector(".dp-scroll");
      if (scroller && scroller.scrollTop > 4) {
        touchStartY = 0;
        return;
      }
      touchStartY = e.touches[0].clientY;
      touchDeltaY = 0;
    }, { passive: true });
    sheetEl.addEventListener("touchmove", (e) => {
      if (!touchStartY) return;
      const dy = e.touches[0].clientY - touchStartY;
      if (dy > 0) {
        touchDeltaY = dy;
        sheetEl.style.transition = "none";
        sheetEl.style.transform = `translateY(${Math.min(dy * 0.75, 260)}px)`;
      }
    }, { passive: true });
    const endSwipe = () => {
      if (!touchStartY) return;
      sheetEl.style.transition = "";
      sheetEl.style.transform = "";
      if (touchDeltaY > 72) closeStopDetail();
      touchStartY = 0;
      touchDeltaY = 0;
    };
    sheetEl.addEventListener("touchend", endSwipe, { passive: true });
    sheetEl.addEventListener("touchcancel", endSwipe, { passive: true });
  }

  stopDetail.addEventListener("click", (event) => {
    if (event.target.closest("[data-detail-close]")) {
      closeStopDetail();
      return;
    }
    const moveBtn = event.target.closest("[data-detail-move]");
    if (moveBtn && activeDetail) {
      if (moveStopBy(activeDetail.dayId, activeDetail.itemId, Number(moveBtn.dataset.detailMove))) {
        renderStopDetailPanel();
        syncActiveCardDom();
      }
      return;
    }
    if (event.target.closest("[data-detail-edit]") && activeDetail) {
      const { dayId, itemId } = activeDetail;
      closeStopDetail();
      const day = trip().days.find((d) => d.id === dayId);
      const target = day && day.items.find((it) => it.id === itemId);
      if (target) openEditor(dayId, target);
      return;
    }
    if (event.target.closest("[data-detail-del]") && activeDetail) {
      const { dayId, itemId } = activeDetail;
      const day = trip().days.find((d) => d.id === dayId);
      const target = day && day.items.find((it) => it.id === itemId);
      if (!day || !window.confirm(`删除「${target ? target.name : "这一站"}」？`)) return;
      closeStopDetail();
      day.items = day.items.filter((it) => it.id !== itemId);
      delete state.booked[itemId];
      markTripEdited(trip().id);
      render();
      return;
    }
    const mapBtn = event.target.closest("[data-detail-map]");
    if (mapBtn) {
      const [dId, iId] = mapBtn.dataset.detailMap.split(":");
      closeStopDetail();
      focusOnMap(dId, iId);
    }
  });
  stopDetail.addEventListener("change", (event) => {
    const box = event.target.closest("[data-detail-booked]");
    if (!box) return;
    if (box.checked) state.booked[box.dataset.detailBooked] = true;
    else delete state.booked[box.dataset.detailBooked];
    render();
    renderStopDetailPanel();
    syncActiveCardDom();
  });
}

const photoLightbox = document.querySelector("#photo-lightbox");
if (photoLightbox) {
  photoLightbox.addEventListener("click", (event) => {
    if (event.target === photoLightbox) photoLightbox.close();
  });
}

main.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-open-stop]");
  if (!card) return;
  event.preventDefault();
  const [dId, iId] = card.dataset.openStop.split(":");
  openStopDetail(dId, iId);
});

main.addEventListener("click", (event) => {
  const openCard = event.target.closest("[data-open-stop]");
  if (openCard) {
    const [dId, iId] = openCard.dataset.openStop.split(":");
    return openStopDetail(dId, iId);
  }
  const zoomBtn = event.target.closest("[data-zoom-src]");
  if (zoomBtn && photoLightbox) {
    const imgEl = document.querySelector("#lightbox-img");
    const titleEl = document.querySelector("#lightbox-title");
    const creditEl = document.querySelector("#lightbox-credit");
    if (imgEl) {
      imgEl.src = zoomBtn.dataset.zoomSrc || "";
      imgEl.alt = zoomBtn.dataset.zoomTitle || "";
    }
    if (titleEl) titleEl.textContent = zoomBtn.dataset.zoomTitle || "";
    if (creditEl) {
      creditEl.textContent = zoomBtn.dataset.zoomCredit || "";
      creditEl.href = zoomBtn.dataset.zoomLink || "#";
      creditEl.hidden = !zoomBtn.dataset.zoomCredit;
    }
    photoLightbox.showModal();
    return;
  }
  const stopMenuBtn = event.target.closest("[data-stop-menu]");
  if (stopMenuBtn) {
    const [dId, iId] = stopMenuBtn.dataset.stopMenu.split(":");
    return openStopSheet(dId, iId);
  }
  const pins = event.target.closest("[data-pins]");
  if (pins) return openPinSheet(pins.dataset.pins);
  const focusPin = event.target.closest("[data-focus-pin]");
  if (focusPin) {
    const [dId, iId] = focusPin.dataset.focusPin.split(":");
    return focusOnMap(dId, iId);
  }
  const add = event.target.closest("[data-add]");
  if (add) {
    const openMenu = add.closest(".more-menu");
    if (openMenu) openMenu.open = false;
    return openEditor(add.dataset.add, null);
  }
  const editDay = event.target.closest("[data-edit-day]");
  if (editDay) {
    const openMenu = editDay.closest(".more-menu");
    if (openMenu) openMenu.open = false;
    const day = trip().days.find((item) => item.id === editDay.dataset.editDay);
    if (day) openDayEditor(day);
    return;
  }
  const delDay = event.target.closest("[data-del-day]");
  if (delDay) {
    const openMenu = delDay.closest(".more-menu");
    if (openMenu) openMenu.open = false;
    const current = trip();
    if (current.days.length <= 1) return;
    const day = current.days.find((item) => item.id === delDay.dataset.delDay);
    if (!day || !window.confirm(`确定删除「${day.title || monthDay(day.date) || "这一天"}」及其所有地点吗？`)) return;
    for (const it of day.items || []) delete state.booked[it.id];
    current.days = current.days.filter((item) => item.id !== day.id);
    if (dayFilter === day.id) dayFilter = "";
    syncTripDates(current);
    markTripEdited(current.id);
    return render();
  }
  const edit = event.target.closest("[data-edit]");
  if (edit) {
    const [dayId, itemId] = edit.dataset.edit.split(":");
    const day = trip().days.find((item) => item.id === dayId);
    return openEditor(dayId, day.items.find((item) => item.id === itemId));
  }
  const move = event.target.closest("[data-move]");
  if (move) {
    const [dayId, itemId, deltaStr] = move.dataset.move.split(":");
    const day = trip().days.find((item) => item.id === dayId);
    if (!day) return;
    const idx = day.items.findIndex((item) => item.id === itemId);
    const targetIdx = idx + Number(deltaStr);
    if (idx < 0 || targetIdx < 0 || targetIdx >= day.items.length) return;
    const [moved] = day.items.splice(idx, 1);
    day.items.splice(targetIdx, 0, moved);
    markTripEdited(trip().id);
    return render();
  }
  const del = event.target.closest("[data-del]");
  if (del) {
    const [dayId, itemId] = del.dataset.del.split(":");
    const day = trip().days.find((item) => item.id === dayId);
    const target = day.items.find((item) => item.id === itemId);
    if (!window.confirm(`删除「${target ? target.name : "这一站"}」？`)) return;
    day.items = day.items.filter((item) => item.id !== itemId);
    delete state.booked[itemId];
    markTripEdited(trip().id);
    return render();
  }
  const jump = event.target.closest(".plan-row a, .ribbon-pill");
  if (jump) {
    event.preventDefault();
    const target = document.getElementById(jump.getAttribute("href").slice(1));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    dayFilter = dayButton.dataset.day;
    returnScrollY = null;
    returnStopId = "";
    render();
    const tabsEl = main.querySelector(".day-tabs");
    if (tabsEl) tabsEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }
  const pick = event.target.closest("[data-origin]");
  if (pick) {
    state.origin = pick.dataset.origin;
    return render();
  }
  if (event.target.closest("#toggle-budget, [data-toggle-budget]")) {
    budgetOpen = !budgetOpen;
    return render();
  }
  if (event.target.closest("#toggle-books, #close-books")) {
    bookingsOpen = !bookingsOpen;
    return render();
  }
  if (event.target.closest("#toggle-visa, #close-visa")) {
    visaOpen = !visaOpen;
    return render();
  }
  if (event.target.closest("#add-day")) {
    return openDayEditor(null);
  }
  if (event.target.closest("#edit-cover")) {
    return promptEditCover();
  }
  if (event.target.closest("#rename-trip")) {
    return promptRenameTrip();
  }
  if (event.target.closest("#delete-trip")) {
    return promptDeleteTrip();
  }
});

main.addEventListener("change", (event) => {
  const box = event.target.closest("[data-booked]");
  if (box) {
    if (box.checked) state.booked[box.dataset.booked] = true;
    else delete state.booked[box.dataset.booked];
    return render();
  }
  const visaBox = event.target.closest("[data-visa-check]");
  if (visaBox) {
    const checks = visaChecksFor(trip().id);
    if (visaBox.checked) checks[visaBox.dataset.visaCheck] = true;
    else delete checks[visaBox.dataset.visaCheck];
    return render();
  }
});

main.addEventListener("toggle", (event) => {
  const fold = event.target.closest("[data-alt-day]");
  if (!fold) return;
  const dId = fold.dataset.altDay;
  if (fold.open) openAltDays.add(dId);
  else openAltDays.delete(dId);
  const hint = fold.querySelector(".alt-route-hint");
  if (hint) hint.textContent = fold.open ? "收起" : "展开查看";
  drawMap();
}, true);

function switchToTrip(nextId) {
  if (!nextId) return;
  state.tripId = nextId;
  dayFilter = "";
  bookingsOpen = false;
  visaOpen = false;
  returnScrollY = null;
  returnStopId = "";
  const picker = document.querySelector("#mobile-trip-picker");
  if (picker) picker.open = false;
  render();
}

tripList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-trip]");
  if (!button) return;
  switchToTrip(button.dataset.trip);
});

document.querySelector("#mobile-trip-menu")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-trip]");
  if (!button) return;
  switchToTrip(button.dataset.trip);
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
    visaOpen = false;
    returnScrollY = null;
    returnStopId = "";
    render();
  }
};

render();

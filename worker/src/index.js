const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-expose-headers": "etag",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

const MAX_PAYLOAD_BYTES = 100_000;
const MAX_CREATES_PER_DAY = 20;
const MAX_WRITES_PER_MINUTE = 20;
const MAX_WRITES_PER_DAY = 400;
const MAX_SEARCH_PER_MINUTE = 10;
const MAX_SEARCH_PER_DAY = 120;
const MAX_REVISIONS = 10;
const DEFAULT_TRIP_TTL_DAYS = 90;
const LIMIT_RETENTION_DAYS = 7;
const DEFAULT_PINNED_IDS = ["A1JnvRqhFVEg"];
const COMMONS_UA = "static-travel-guide-skill/1.3 (https://github.com/aladdin0306/static-travel-guide-skill)";

const ALLOWED_KINDS = new Set(["sight", "food", "transport", "stay"]);
const ALLOWED_RESERVATIONS = new Set(["none", "recommended", "required"]);
const ALLOWED_CATS = new Set(["flight", "stay", "transport", "sight", "food", "other"]);
const ALLOWED_IMAGE_HOSTS = new Set(["commons.wikimedia.org", "upload.wikimedia.org"]);

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
        return new Response(null, { status: 204, headers: JSON_HEADERS });
      }

      if (url.pathname.startsWith("/api/")) {
        return await handleApi(request, env, url, ctx);
      }

      const nestedAsset = url.pathname.match(
        /^\/t(?:\/[A-Za-z0-9_-]+)?(?:\/edit)?\/(styles\.css|data\.js|app\.js|share\.js|vendor\/[\w.-]+\.(?:css|js)|vendor\/images\/[\w.-]+\.png|photos\/[\w-]+\.jpg)$/
      );
      if (nestedAsset) {
        const assetUrl = new URL(`/${nestedAsset[1]}`, url);
        return withPageHeaders(await env.ASSETS.fetch(new Request(assetUrl, request)), false);
      }

      if (/^\/t\/[A-Za-z0-9_-]+(?:\/edit)?\/?$/.test(url.pathname)) {
        const assetUrl = new URL("/", url);
        const assetRes = await env.ASSETS.fetch(new Request(assetUrl, request));
        const routeMatch = url.pathname.match(/^\/t\/([A-Za-z0-9_-]+)(?:\/edit)?\/?$/);
        if (routeMatch && (assetRes.headers.get("content-type") || "").includes("text/html")) {
          return withPageHeaders(await injectOpenGraph(assetRes, env, routeMatch[1], url), true);
        }
        return withPageHeaders(assetRes, true);
      }

      return withPageHeaders(await env.ASSETS.fetch(request), false);
    } catch (error) {
      console.error(error);
      if (Number.isInteger(error.status)) {
        return json({ error: error.message }, error.status);
      }
      return json({ error: "服务器暂时不可用，请稍后再试。" }, 500);
    }
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(cleanupExpiredData(env));
  }
};

async function handleApi(request, env, url, ctx) {
  if (url.pathname === "/api/health" && request.method === "GET") {
    return json({ ok: true });
  }

  if (url.pathname === "/api/img" && (request.method === "GET" || request.method === "HEAD")) {
    const imgRes = await handleCommonsImage(request, url);
    return request.method === "HEAD" ? new Response(null, { status: imgRes.status, headers: imgRes.headers }) : imgRes;
  }

  if (url.pathname === "/api/commons-search" && request.method === "GET") {
    return await handleCommonsSearch(request, env, url);
  }

  if (url.pathname === "/api/trips" && request.method === "POST") {
    await enforceRateLimit(request, env, "create-day", currentDayBucket(), MAX_CREATES_PER_DAY, "今天发布次数太多，请明天再试。");
    const input = await readPayload(request);
    const payload = normalizePayload(input, url.origin);
    const id = randomId(9);
    const token = randomId(32);
    const tokenHash = await sha256(token);
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO trips (id, payload, edit_token_hash, revision, created_at, updated_at)
       VALUES (?, ?, ?, 1, ?, ?)`
    ).bind(id, JSON.stringify(payload), tokenHash, now, now).run();

    if (ctx && Math.random() < 0.05) {
      ctx.waitUntil(cleanupExpiredData(env).catch((err) => console.error("cleanup failed", err)));
    }

    return json({
      id,
      revision: 1,
      publicUrl: `${url.origin}/t/${id}`,
      editUrl: `${url.origin}/t/${id}/edit#token=${token}`
    }, 201);
  }

  const match = url.pathname.match(/^\/api\/trips\/([A-Za-z0-9_-]+)(?:\/(revisions|restore|rotate-token))?$/);
  if (!match) return json({ error: "接口不存在。" }, 404);

  const [, id, action] = match;
  const row = await env.DB.prepare(
    "SELECT id, payload, edit_token_hash, revision, created_at, updated_at FROM trips WHERE id = ?"
  ).bind(id).first();
  if (!row) return json({ error: "没有找到这个行程。" }, 404);

  if (!action && request.method === "GET") {
    return json({
      id: row.id,
      ...JSON.parse(row.payload),
      revision: row.revision,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, 200, { etag: `"${row.revision}"` });
  }

  await requireEditToken(request, row.edit_token_hash);

  if (!action && request.method === "DELETE") {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM revisions WHERE trip_id = ?").bind(id),
      env.DB.prepare("DELETE FROM trips WHERE id = ?").bind(id)
    ]);
    return json({ ok: true, id });
  }

  if (!action && request.method === "PUT") {
    await enforceWriteLimits(request, env);
    const input = await readPayload(request);
    const payload = normalizePayload(input, url.origin);
    const expectedRevision = Number(input.expectedRevision);
    if (!Number.isInteger(expectedRevision) || expectedRevision !== row.revision) {
      return json({
        error: "该行程已在别处更新，请刷新后再修改。",
        code: "REVISION_CONFLICT",
        revision: row.revision
      }, 409);
    }

    const now = new Date().toISOString();
    const statements = [
      env.DB.prepare(
        `INSERT OR IGNORE INTO revisions (trip_id, revision, payload, created_at)
         VALUES (?, ?, ?, ?)`
      ).bind(id, row.revision, row.payload, now),
      env.DB.prepare(
        `UPDATE trips SET payload = ?, revision = revision + 1, updated_at = ?
         WHERE id = ? AND revision = ?`
      ).bind(JSON.stringify(payload), now, id, row.revision)
    ];
    const results = await env.DB.batch(statements);
    const updated = results[1] && results[1].meta && results[1].meta.changes;
    if (!updated) {
      return json({ error: "该行程已在别处更新，请刷新后再修改。", code: "REVISION_CONFLICT" }, 409);
    }

    await trimRevisions(env, id);
    return json({ id, revision: row.revision + 1, updatedAt: now });
  }

  if (action === "revisions" && request.method === "GET") {
    const result = await env.DB.prepare(
      `SELECT revision, created_at FROM revisions
       WHERE trip_id = ? ORDER BY revision DESC LIMIT ?`
    ).bind(id, MAX_REVISIONS).all();
    return json({
      currentRevision: row.revision,
      revisions: result.results.map((item) => ({
        revision: item.revision,
        createdAt: item.created_at
      }))
    });
  }

  if (action === "restore" && request.method === "POST") {
    await enforceWriteLimits(request, env);
    const input = await readJson(request);
    const targetRevision = Number(input.revision);
    if (!Number.isInteger(targetRevision)) return json({ error: "版本号无效。" }, 400);

    const target = await env.DB.prepare(
      "SELECT payload FROM revisions WHERE trip_id = ? AND revision = ?"
    ).bind(id, targetRevision).first();
    if (!target) return json({ error: "没有找到这个历史版本。" }, 404);

    const now = new Date().toISOString();
    const nextRevision = row.revision + 1;
    await env.DB.batch([
      env.DB.prepare(
        `INSERT OR IGNORE INTO revisions (trip_id, revision, payload, created_at)
         VALUES (?, ?, ?, ?)`
      ).bind(id, row.revision, row.payload, now),
      env.DB.prepare(
        "UPDATE trips SET payload = ?, revision = ?, updated_at = ? WHERE id = ?"
      ).bind(target.payload, nextRevision, now, id)
    ]);
    await trimRevisions(env, id);
    return json({ id, revision: nextRevision, restoredFrom: targetRevision, updatedAt: now });
  }

  if (action === "rotate-token" && request.method === "POST") {
    const token = randomId(32);
    const tokenHash = await sha256(token);
    await env.DB.prepare("UPDATE trips SET edit_token_hash = ? WHERE id = ?")
      .bind(tokenHash, id).run();
    return json({ editUrl: `${url.origin}/t/${id}/edit#token=${token}` });
  }

  return json({ error: "请求方法不支持。" }, 405);
}

async function readPayload(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_PAYLOAD_BYTES) {
    throw httpError(413, "行程数据超过 100 KB 上限，请精简备注后重试。");
  }
  const rawText = await readJsonText(request);
  const size = new TextEncoder().encode(rawText).byteLength;
  if (size > MAX_PAYLOAD_BYTES) {
    throw httpError(413, "行程数据超过 100 KB 上限，请精简备注后重试。");
  }
  try {
    return JSON.parse(rawText);
  } catch {
    throw httpError(400, "JSON 格式不正确。");
  }
}

async function readJsonText(request) {
  const type = request.headers.get("content-type") || "";
  if (!type.toLowerCase().includes("application/json")) {
    throw httpError(415, "请使用 JSON 格式提交。");
  }
  return await request.text();
}

async function readJson(request) {
  const rawText = await readJsonText(request);
  if (rawText.length > MAX_PAYLOAD_BYTES) {
    throw httpError(413, "请求内容过大。");
  }
  try {
    return JSON.parse(rawText);
  } catch {
    throw httpError(400, "JSON 格式不正确。");
  }
}

function cleanStr(value, maxLen) {
  if (typeof value !== "string") return "";
  return value.replace(/\0/g, "").trim().slice(0, maxLen);
}

function cleanOptNum(value, min = -1_000_000_000, max = 1_000_000_000) {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  if (value < min || value > max) return undefined;
  return value;
}

function cleanHttpsUrl(value, maxLen = 600) {
  const raw = cleanStr(value, maxLen);
  if (!raw || !/^https:\/\/[^\s"'<>]+$/i.test(raw)) return "";
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:" ? raw : "";
  } catch {
    return "";
  }
}

function cleanPhoto(raw, requestOrigin) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const rawSrc = cleanStr(raw.src, 600).replace(/\(/g, "%28").replace(/\)/g, "%29");
  let src = "";
  if (/^(photos\/[\w-]+\.jpg|\/api\/img\?[^\s"'<>]+)$/.test(rawSrc)) {
    src = rawSrc;
  } else {
    const httpsSrc = cleanHttpsUrl(rawSrc, 600);
    if (httpsSrc) {
      try {
        const parsed = new URL(httpsSrc);
        if (parsed.pathname === "/api/img" && parsed.searchParams.get("file")) {
          const base = requestOrigin || parsed.origin;
          const fileParam = parsed.searchParams.get("file") || "";
          const wParam = Math.min(Math.max(Number(parsed.searchParams.get("w")) || 1200, 320), 1920);
          const enc = encodeURIComponent(fileParam).replace(/\(/g, "%28").replace(/\)/g, "%29");
          src = `${base}/api/img?file=${enc}&w=${wParam}`;
        } else if (ALLOWED_IMAGE_HOSTS.has(parsed.hostname.toLowerCase())) {
          src = httpsSrc;
        }
      } catch {}
    }
  }
  if (!src) return undefined;
  const photo = {
    src,
    credit: cleanStr(raw.credit, 160),
    link: cleanHttpsUrl(raw.link, 600)
  };
  const caption = cleanStr(raw.caption, 120);
  const city = cleanStr(raw.city, 60);
  if (caption) photo.caption = caption;
  if (city) photo.city = city;
  return photo;
}

function cleanBudgetRow(raw, allowAdjust = false) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const id = cleanStr(raw.id, 60);
  const label = cleanStr(raw.label, 140);
  if (!label && !id) return null;
  const row = {};
  if (id) row.id = id;
  row.label = label || id;
  if (ALLOWED_CATS.has(raw.cat)) row.cat = raw.cat;
  const amount = cleanOptNum(raw.amount);
  if (amount !== undefined) row.amount = amount;
  const cny = cleanOptNum(raw.cny);
  if (cny !== undefined) row.cny = cny;
  const brief = cleanStr(raw.brief, 400);
  if (brief) row.brief = brief;
  const note = cleanStr(raw.note, 500);
  if (note) row.note = note;
  if (allowAdjust && Array.isArray(raw.adjust)) {
    row.adjust = raw.adjust
      .slice(0, 20)
      .map((item) => cleanBudgetRow(item, false))
      .filter(Boolean);
  }
  return row;
}

function cleanBudget(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const budget = {
    currency: cleanStr(raw.currency, 12) || "CNY"
  };
  const party = cleanStr(raw.party, 120);
  if (party) budget.party = party;
  const basis = cleanStr(raw.basis, 400);
  if (basis) budget.basis = basis;
  const cnyRate = cleanOptNum(raw.cnyRate, 0, 1_000_000);
  if (cnyRate !== undefined) budget.cnyRate = cnyRate;
  const rateDate = cleanStr(raw.rateDate, 30);
  if (rateDate) budget.rateDate = rateDate;
  if (Array.isArray(raw.extras)) {
    budget.extras = raw.extras
      .slice(0, 40)
      .map((item) => cleanBudgetRow(item, false))
      .filter(Boolean);
  }
  if (Array.isArray(raw.origins)) {
    budget.origins = raw.origins
      .slice(0, 12)
      .map((item) => cleanBudgetRow(item, true))
      .filter(Boolean);
  }
  return budget;
}

function cleanCost(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const candidate = Number.isFinite(raw.amount) ? raw.amount : raw.aud;
  const amount = cleanOptNum(candidate);
  if (amount === undefined) return null;
  const cost = {
    amount,
    note: cleanStr(raw.note, 320)
  };
  if (ALLOWED_CATS.has(raw.cat)) cost.cat = raw.cat;
  if (raw.optional === true) cost.optional = true;
  return cost;
}

function cleanStop(raw, fallbackId, requestOrigin) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const name = cleanStr(raw.name, 160);
  if (!name) return null;
  const lat = cleanOptNum(raw.lat, -90, 90);
  const lng = cleanOptNum(raw.lng, -180, 180);
  const stop = {
    id: cleanStr(raw.id, 80) || fallbackId,
    time: cleanStr(raw.time, 60),
    kind: ALLOWED_KINDS.has(raw.kind) ? raw.kind : "sight",
    name,
    address: cleanStr(raw.address, 240),
    lat: lat !== undefined ? lat : null,
    lng: lng !== undefined ? lng : null,
    reservation: ALLOWED_RESERVATIONS.has(raw.reservation) ? raw.reservation : "none",
    reservationNote: cleanStr(raw.reservationNote, 400),
    bookingUrl: cleanHttpsUrl(raw.bookingUrl, 600),
    cost: cleanCost(raw.cost),
    note: cleanStr(raw.note, 1200)
  };
  const why = cleanStr(raw.why, 400);
  if (why) stop.why = why;
  const photo = cleanPhoto(raw.photo, requestOrigin);
  if (photo) stop.photo = photo;
  return stop;
}

function normalizePayload(input, requestOrigin) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw httpError(400, "行程数据不正确。");
  }
  const trip = input.trip;
  if (!trip || typeof trip !== "object" || Array.isArray(trip)) {
    throw httpError(400, "缺少行程内容。");
  }
  const title = cleanStr(trip.title, 120);
  if (!title) {
    throw httpError(400, "行程名称不正确。");
  }
  if (!Array.isArray(trip.days) || trip.days.length > 45) {
    throw httpError(400, "行程天数不正确（最多支持 45 天）。");
  }

  let totalStops = 0;
  const validStopIds = new Set();
  const cleanDays = trip.days.map((rawDay, dayIdx) => {
    if (!rawDay || typeof rawDay !== "object" || Array.isArray(rawDay)) {
      throw httpError(400, "行程日期格式不正确。");
    }
    const rawItems = Array.isArray(rawDay.items) ? rawDay.items : [];
    if (rawItems.length > 40) {
      throw httpError(400, "单日行程地点过多（单日最多 40 站）。");
    }
    const items = [];
    for (let i = 0; i < rawItems.length; i += 1) {
      const cleaned = cleanStop(rawItems[i], `d${dayIdx + 1}-s${i + 1}`, requestOrigin);
      if (!cleaned) continue;
      totalStops += 1;
      if (totalStops > 350) {
        throw httpError(400, "行程地点过多（最多支持 350 站）。");
      }
      validStopIds.add(cleaned.id);
      items.push(cleaned);
    }
    return {
      id: cleanStr(rawDay.id, 80) || `d${dayIdx + 1}`,
      date: cleanStr(rawDay.date, 20),
      city: cleanStr(rawDay.city, 60),
      title: cleanStr(rawDay.title, 160),
      items
    };
  });

  const cleanTrip = {
    id: cleanStr(trip.id, 80) || "trip",
    title,
    start: cleanStr(trip.start, 20),
    end: cleanStr(trip.end, 20),
    summary: cleanStr(trip.summary, 600),
    days: cleanDays
  };
  const coverPhoto = cleanPhoto(trip.coverPhoto, requestOrigin);
  if (coverPhoto) cleanTrip.coverPhoto = coverPhoto;
  const budget = cleanBudget(trip.budget);
  if (budget) cleanTrip.budget = budget;

  const cleanBooked = {};
  if (input.booked && typeof input.booked === "object" && !Array.isArray(input.booked)) {
    for (const [key, val] of Object.entries(input.booked)) {
      if (val === true && validStopIds.has(key)) {
        cleanBooked[key] = true;
      }
    }
  }

  const normalized = { trip: cleanTrip, booked: cleanBooked };
  const finalBytes = new TextEncoder().encode(JSON.stringify(normalized)).byteLength;
  if (finalBytes > MAX_PAYLOAD_BYTES) {
    throw httpError(413, "行程数据超过 100 KB 上限，请精简备注后重试。");
  }
  return normalized;
}

async function requireEditToken(request, expectedHash) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || token.length > 200 || !timingSafeEqual(await sha256(token), expectedHash)) {
    throw httpError(403, "编辑链接无效或已经失效。");
  }
}

function currentDayBucket() {
  return new Date().toISOString().slice(0, 10);
}

function currentMinuteBucket() {
  return new Date().toISOString().slice(0, 16);
}

async function enforceRateLimit(request, env, scope, bucket, limit, message) {
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const key = await sha256(`${env.RATE_LIMIT_SALT || "travel-guide"}:${scope}:${ip}`);
  const result = await env.DB.prepare(
    `INSERT INTO creation_limits (key, day, count) VALUES (?, ?, 1)
     ON CONFLICT(key, day) DO UPDATE SET count = count + 1
     WHERE count < ?
     RETURNING count`
  ).bind(key, bucket, limit).first();
  if (!result) throw httpError(429, message);
}

async function enforceWriteLimits(request, env) {
  await enforceRateLimit(request, env, "write-min", currentMinuteBucket(), MAX_WRITES_PER_MINUTE, "保存太频繁，请稍等一分钟再试。");
  await enforceRateLimit(request, env, "write-day", currentDayBucket(), MAX_WRITES_PER_DAY, "今日编辑保存次数已达上限，请明天再试。");
}

async function trimRevisions(env, id) {
  await env.DB.prepare(
    `DELETE FROM revisions
     WHERE trip_id = ? AND revision NOT IN (
       SELECT revision FROM revisions WHERE trip_id = ?
       ORDER BY revision DESC LIMIT ?
     )`
  ).bind(id, id, MAX_REVISIONS).run();
}

async function cleanupExpiredData(env) {
  const now = Date.now();
  const limitCutoffDay = new Date(now - LIMIT_RETENTION_DAYS * 86_400_000).toISOString().slice(0, 10);
  const minuteCutoff = new Date(now - 3_600_000).toISOString().slice(0, 16);
  const rawTtl = Number(env.TRIP_TTL_DAYS);
  const ttlDays = Number.isFinite(rawTtl) && rawTtl >= 7 ? Math.floor(rawTtl) : DEFAULT_TRIP_TTL_DAYS;
  const tripCutoffIso = new Date(now - ttlDays * 86_400_000).toISOString();

  const extraPinned = String(env.PINNED_TRIP_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[A-Za-z0-9_-]{4,32}$/.test(s));
  const pinned = [...new Set([...DEFAULT_PINNED_IDS, ...extraPinned])];
  const placeholders = pinned.map(() => "?").join(", ");

  await env.DB.batch([
    env.DB.prepare(
      "DELETE FROM creation_limits WHERE day < ? OR (length(day) > 10 AND day < ?)"
    ).bind(limitCutoffDay, minuteCutoff),
    env.DB.prepare(
      `DELETE FROM trips WHERE updated_at < ? AND id NOT IN (${placeholders})`
    ).bind(tripCutoffIso, ...pinned),
    env.DB.prepare("DELETE FROM revisions WHERE trip_id NOT IN (SELECT id FROM trips)")
  ]);
}

function withPageHeaders(response, noIndex = false) {
  const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  if (noIndex) {
    headers.set("x-robots-tag", "noindex, nofollow");
  }
  if ((headers.get("content-type") || "").includes("text/html")) {
    headers.set("cache-control", "no-cache");
  }
  return new Response(response.body, { status: response.status, headers });
}

async function injectOpenGraph(response, env, id, url) {
  try {
    const row = await env.DB.prepare("SELECT payload FROM trips WHERE id = ?").bind(id).first();
    if (!row) return response;
    const data = JSON.parse(row.payload);
    const trip = data.trip || {};
    const daysCount = Array.isArray(trip.days) ? trip.days.length : 0;
    const cities = [...new Set((trip.days || []).map((d) => d.city).filter(Boolean))].join(" · ");
    const pageTitle = `${trip.title || "行程"}${daysCount ? ` · ${daysCount}天` : ""} | 行程库`;
    const desc = (trip.summary || (cities ? `路线：${cities}` : "点击查看详细每日行程、预算与地图打点。")).slice(0, 140);
    let ogImg = "";
    const candidates = [
      ...(trip.coverPhoto ? [trip.coverPhoto] : []),
      ...(trip.days || []).flatMap((d) => (d.items || []).map((it) => it.photo).filter(Boolean))
    ];
    for (const pic of candidates) {
      const cFile = extractCommonsFile(pic.link || pic.src || "");
      if (cFile) {
        ogImg = `${url.origin}/api/img?file=${encodeURIComponent(cFile)}&w=1200`;
        break;
      }
    }
    const metaTags = [
      `<meta name="description" content="${escAttr(desc)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:title" content="${escAttr(pageTitle)}" />`,
      `<meta property="og:description" content="${escAttr(desc)}" />`,
      `<meta property="og:url" content="${escAttr(`${url.origin}/t/${id}`)}" />`,
      ogImg ? `<meta property="og:image" content="${escAttr(ogImg)}" />` : "",
      `<meta name="twitter:card" content="${ogImg ? "summary_large_image" : "summary"}" />`,
      `<meta name="twitter:title" content="${escAttr(pageTitle)}" />`,
      `<meta name="twitter:description" content="${escAttr(desc)}" />`
    ].filter(Boolean).join("\n  ");

    const html = await response.text();
    const updated = html.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${escAttr(pageTitle)}</title>\n  ${metaTags}`
    );
    return new Response(updated, { status: response.status, headers: response.headers });
  } catch {
    return response;
  }
}

function escAttr(str) {
  return String(str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function extractCommonsFile(raw) {
  try {
    const u = new URL(raw, "https://commons.wikimedia.org");
    if (u.pathname.startsWith("/api/img")) {
      return u.searchParams.get("file") || "";
    }
    const wikiIdx = u.pathname.indexOf("/wiki/File:");
    if (wikiIdx >= 0) {
      const f = decodeURIComponent(u.pathname.slice(wikiIdx + "/wiki/File:".length));
      return /^placeholder:/i.test(f) ? "" : f;
    }
    const redirIdx = u.pathname.indexOf("/wiki/Special:Redirect/file/");
    if (redirIdx >= 0) {
      return decodeURIComponent(u.pathname.slice(redirIdx + "/wiki/Special:Redirect/file/".length));
    }
  } catch {}
  return "";
}

async function handleCommonsImage(request, url) {
  const rawFile = (url.searchParams.get("file") || "").trim().replace(/^File:/i, "");
  if (!rawFile || rawFile.length > 260 || /[<>\\\r\n]/.test(rawFile)) {
    return json({ error: "图片参数不正确。" }, 400);
  }
  const widthNum = Math.min(Math.max(Number(url.searchParams.get("w")) || 1200, 320), 1920);
  const cacheKey = new Request(`${url.origin}/api/img?file=${encodeURIComponent(rawFile)}&w=${widthNum}`, { method: "GET" });
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const target = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(rawFile)}?width=${widthNum}`;
  const upstream = await fetch(target, {
    redirect: "follow",
    headers: {
      "user-agent": COMMONS_UA,
      accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"
    },
    cf: { cacheEverything: true, cacheTtl: 2592000 }
  });

  const ct = upstream.headers.get("content-type") || "";
  if (!upstream.ok || !ct.startsWith("image/")) {
    return json({ error: "原图暂时无法读取。" }, upstream.status === 404 ? 404 : 502);
  }

  const outHeaders = new Headers();
  outHeaders.set("content-type", ct);
  outHeaders.set("cache-control", "public, max-age=2592000, s-maxage=2592000, immutable");
  outHeaders.set("access-control-allow-origin", "*");
  outHeaders.set("x-content-type-options", "nosniff");

  const res = new Response(upstream.body, { status: 200, headers: outHeaders });
  try { await cache.put(cacheKey, res.clone()); } catch {}
  return res;
}

async function handleCommonsSearch(request, env, url) {
  const q = (url.searchParams.get("q") || "").trim();
  if (!q || q.length > 160) return json({ error: "缺少搜索词。" }, 400);

  const cacheKey = new Request(`${url.origin}/api/commons-search?q=${encodeURIComponent(q.toLowerCase())}`, { method: "GET" });
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  await enforceRateLimit(request, env, "search-min", currentMinuteBucket(), MAX_SEARCH_PER_MINUTE, "搜图太频繁，请稍等一分钟再试。");
  await enforceRateLimit(request, env, "search-day", currentDayBucket(), MAX_SEARCH_PER_DAY, "今日在线搜图次数已达上限，请明天再试。");

  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=8&format=json&srsearch=${encodeURIComponent(q)}`;
  const sRes = await fetch(searchUrl, { headers: { "user-agent": COMMONS_UA } });
  const sData = await sRes.json();
  const hits = (sData.query && sData.query.search) || [];

  let picked = null;
  for (const hit of hits) {
    if (!/\.(jpe?g|png|webp)$/i.test(hit.title)) continue;
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(hit.title)}&prop=imageinfo&iiprop=url|mime|extmetadata&format=json`;
    const iRes = await fetch(infoUrl, { headers: { "user-agent": COMMONS_UA } });
    const iData = await iRes.json();
    const pages = (iData.query && iData.query.pages) || {};
    const page = Object.values(pages)[0];
    const info = page && page.imageinfo && page.imageinfo[0];
    if (!info || !String(info.mime || "").startsWith("image/")) continue;
    const meta = info.extmetadata || {};
    const artist = String((meta.Artist && meta.Artist.value) || "Commons").replace(/<[^>]+>/g, "").trim();
    const lic = String((meta.LicenseShortName && meta.LicenseShortName.value) || "CC").replace(/<[^>]+>/g, "").trim();
    const file = hit.title.replace(/^File:/, "");
    const encFile = encodeURIComponent(file).replace(/\(/g, "%28").replace(/\)/g, "%29");
    picked = {
      src: `${url.origin}/api/img?file=${encFile}&w=1200`,
      credit: `${artist} · ${lic}`.slice(0, 60),
      link: `https://commons.wikimedia.org/wiki/File:${encFile}`
    };
    break;
  }

  const res = new Response(JSON.stringify({ picked }), {
    status: 200,
    headers: {
      ...JSON_HEADERS,
      "cache-control": "public, max-age=3600, s-maxage=3600"
    }
  });
  try { await cache.put(cacheKey, res.clone()); } catch {}
  return res;
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function randomId(bytes) {
  const value = new Uint8Array(bytes);
  crypto.getRandomValues(value);
  return btoa(String.fromCharCode(...value))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string" || left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

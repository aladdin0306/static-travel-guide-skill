const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-expose-headers": "etag",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

const MAX_PAYLOAD_BYTES = 750_000;
const MAX_CREATES_PER_DAY = 20;
const MAX_REVISIONS = 20;

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
        return new Response(null, { status: 204, headers: JSON_HEADERS });
      }

      if (url.pathname.startsWith("/api/")) {
        return await handleApi(request, env, url);
      }

      const nestedAsset = url.pathname.match(
        /^\/t(?:\/[A-Za-z0-9_-]+)?(?:\/edit)?\/(styles\.css|data\.js|app\.js|share\.js)$/
      );
      if (nestedAsset) {
        const assetUrl = new URL(`/${nestedAsset[1]}`, url);
        return withPageHeaders(await env.ASSETS.fetch(new Request(assetUrl, request)));
      }

      if (/^\/t\/[A-Za-z0-9_-]+(?:\/edit)?\/?$/.test(url.pathname)) {
        const assetUrl = new URL("/", url);
        return withPageHeaders(await env.ASSETS.fetch(new Request(assetUrl, request)));
      }

      return withPageHeaders(await env.ASSETS.fetch(request));
    } catch (error) {
      console.error(error);
      if (Number.isInteger(error.status)) {
        return json({ error: error.message }, error.status);
      }
      return json({ error: "服务器暂时不可用，请稍后再试。" }, 500);
    }
  }
};

async function handleApi(request, env, url) {
  if (url.pathname === "/api/health" && request.method === "GET") {
    return json({ ok: true });
  }

  if (url.pathname === "/api/trips" && request.method === "POST") {
    await enforceCreateLimit(request, env);
    const input = await readPayload(request);
    const payload = normalizePayload(input);
    const id = randomId(9);
    const token = randomId(32);
    const tokenHash = await sha256(token);
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO trips (id, payload, edit_token_hash, revision, created_at, updated_at)
       VALUES (?, ?, ?, 1, ?, ?)`
    ).bind(id, JSON.stringify(payload), tokenHash, now, now).run();

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

  if (!action && request.method === "PUT") {
    const input = await readPayload(request);
    const payload = normalizePayload(input);
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
  if (length > MAX_PAYLOAD_BYTES) throw httpError(413, "行程数据太大，无法发布。");
  const input = await readJson(request);
  const size = new TextEncoder().encode(JSON.stringify(input)).byteLength;
  if (size > MAX_PAYLOAD_BYTES) throw httpError(413, "行程数据太大，无法发布。");
  return input;
}

async function readJson(request) {
  const type = request.headers.get("content-type") || "";
  if (!type.toLowerCase().includes("application/json")) {
    throw httpError(415, "请使用 JSON 格式提交。");
  }
  try {
    return await request.json();
  } catch {
    throw httpError(400, "JSON 格式不正确。");
  }
}

function normalizePayload(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw httpError(400, "行程数据不正确。");
  }
  const trip = input.trip;
  if (!trip || typeof trip !== "object" || Array.isArray(trip)) {
    throw httpError(400, "缺少行程内容。");
  }
  if (typeof trip.title !== "string" || !trip.title.trim() || trip.title.length > 120) {
    throw httpError(400, "行程名称不正确。");
  }
  if (!Array.isArray(trip.days) || trip.days.length > 60) {
    throw httpError(400, "行程日期不正确。");
  }
  const stopCount = trip.days.reduce((sum, day) => sum + (Array.isArray(day.items) ? day.items.length : 0), 0);
  if (stopCount > 600) throw httpError(400, "行程地点过多。");

  return {
    trip: structuredClone(trip),
    booked: input.booked && typeof input.booked === "object" && !Array.isArray(input.booked)
      ? structuredClone(input.booked)
      : {}
  };
}

async function requireEditToken(request, expectedHash) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || token.length > 200 || !timingSafeEqual(await sha256(token), expectedHash)) {
    throw httpError(403, "编辑链接无效或已经失效。");
  }
}

async function enforceCreateLimit(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const key = await sha256(`${env.RATE_LIMIT_SALT || "travel-guide"}:${ip}`);
  const day = new Date().toISOString().slice(0, 10);
  const result = await env.DB.prepare(
    `INSERT INTO creation_limits (key, day, count) VALUES (?, ?, 1)
     ON CONFLICT(key, day) DO UPDATE SET count = count + 1
     WHERE count < ?
     RETURNING count`
  ).bind(key, day, MAX_CREATES_PER_DAY).first();
  if (!result) throw httpError(429, "今天发布次数太多，请明天再试。");
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

function withPageHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  if ((headers.get("content-type") || "").includes("text/html")) {
    headers.set("cache-control", "no-cache");
  }
  return new Response(response.body, { status: response.status, headers });
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

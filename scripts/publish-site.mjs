#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const [siteArg, baseArg, tripIdArg] = process.argv.slice(2);
if (!siteArg) {
  fail("Usage: node scripts/publish-site.mjs /path/to/site [API_BASE] [trip-id]");
}

const apiBase = String(baseArg || process.env.TRAVEL_GUIDE_API || "").replace(/\/$/, "");
if (!/^https?:\/\//.test(apiBase)) {
  fail("Missing API base. Pass it as the second argument or set TRAVEL_GUIDE_API.");
}

const site = path.resolve(siteArg);
const source = await fs.readFile(path.join(site, "data.js"), "utf8");
const context = vm.createContext({ window: {} });
vm.runInContext(source, context, { filename: path.join(site, "data.js"), timeout: 2_000 });

const trips = context.window.SEED_TRIPS;
if (!Array.isArray(trips) || !trips.length) fail("data.js did not define window.SEED_TRIPS.");

const trip = tripIdArg ? trips.find((item) => item.id === tripIdArg) : trips[0];
if (!trip) fail(`Trip not found: ${tripIdArg}`);

const payload = {
  trip: makePortable(structuredClone(trip)),
  booked: {}
};

const response = await fetch(`${apiBase}/api/trips`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    accept: "application/json"
  },
  body: JSON.stringify(payload)
});

const text = await response.text();
let result;
try {
  result = JSON.parse(text);
} catch {
  fail(`Publish service returned ${response.status}: ${text.slice(0, 200)}`);
}
if (!response.ok) fail(result.error || `Publish failed (${response.status}).`);

console.log(`Published: ${trip.title}`);
console.log(`Public: ${result.publicUrl}`);
console.log(`Edit: ${result.editUrl}`);
console.log("Keep the edit link private; possession grants edit access.");

function makePortable(value) {
  for (const day of value.days || []) {
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
  return value;
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

function fail(message) {
  console.error(message);
  process.exit(1);
}

// Quality checks on the built site. Run after a build:  npm run check
// Checks every page for: one <h1>, no skipped heading levels, unique titles and
// descriptions of sensible length, canonical URLs, valid JSON-LD, working
// internal links and #anchors, image alt text and dimensions, and a sitemap
// that lists every indexable page. Also exercises the inquiry handler.

import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../src/content.mjs";
import { handleInquiry } from "../api/_inquiry.js";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const problems = [];
const warn = [];
const fail = (page, msg) => problems.push(`${page}: ${msg}`);

const walk = async (dir) =>
  (await readdir(dir, { withFileTypes: true })).flatMap((e) => (e.isDirectory() ? [] : [join(dir, e.name)])).concat(
    ...(await Promise.all((await readdir(dir, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => walk(join(dir, e.name)))))
  );

const files = (await walk(dist)).map((f) => "/" + relative(dist, f).replace(/\\/g, "/"));
const fileSet = new Set(files);
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const urlOf = (f) => (f.endsWith("/index.html") ? f.slice(0, -10) : f);
const resolves = (path) => fileSet.has(path) || fileSet.has(path.replace(/\/?$/, "/index.html"));

const titles = new Map();
const descs = new Map();
const indexable = [];
const pages = {};

for (const f of htmlFiles) {
  const html = await readFile(join(dist, f), "utf8");
  const url = urlOf(f);
  pages[url] = html;
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (!noindex) indexable.push(url);

  const h1 = html.match(/<h1[\s>]/g) || [];
  if (h1.length !== 1) fail(url, `${h1.length} <h1> elements`);
  let last = 0;
  for (const [, lvl] of html.matchAll(/<h([1-6])[\s>]/g)) {
    if (+lvl > last + 1 && last) fail(url, `heading jumps from h${last} to h${lvl}`);
    last = +lvl;
  }

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  if (!noindex) {
    if (title.length < 25 || title.length > 65) warn.push(`${url}: title is ${title.length} characters`);
    if (desc.length < 110 || desc.length > 165) warn.push(`${url}: description is ${desc.length} characters`);
    if (titles.has(title)) fail(url, `same title as ${titles.get(title)}`);
    if (descs.has(desc)) fail(url, `same description as ${descs.get(desc)}`);
    titles.set(title, url);
    descs.set(desc, url);
    const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
    if (canon !== site.domain + url) fail(url, `canonical is ${canon}`);
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!ld) fail(url, "no JSON-LD");
    else
      try {
        const data = JSON.parse(ld[1]);
        const types = data["@graph"].map((n) => [].concat(n["@type"]).join("+"));
        if (!types.some((t) => t.includes("LocalBusiness"))) fail(url, "JSON-LD has no LocalBusiness");
        if (!["/", "/fr/"].includes(url) && !types.includes("BreadcrumbList")) fail(url, "JSON-LD has no BreadcrumbList");
      } catch (e) {
        fail(url, `JSON-LD doesn't parse: ${e.message}`);
      }
  }

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const [path, hash] = href.split("#");
    if (path && !resolves(path)) fail(url, `broken link ${href}`);
    if (hash && !path && !ids.has(hash)) fail(url, `missing anchor #${hash}`);
    if (hash && path && path !== url) {
      const target = await readFile(join(dist, path.endsWith("/") ? path + "index.html" : path), "utf8").catch(() => "");
      if (!target.includes(`id="${hash}"`)) fail(url, `missing anchor ${href}`);
    }
  }
  for (const [, src] of html.matchAll(/\ssrc="(\/[^"]+)"/g)) if (!resolves(src)) fail(url, `missing file ${src}`);
  for (const [, set] of html.matchAll(/\ssrcset="([^"]+)"/g))
    for (const part of set.split(",")) {
      const src = part.trim().split(" ")[0];
      if (!resolves(src)) fail(url, `missing file ${src}`);
    }
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(img)) fail(url, `image without alt: ${img.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(img) || !/\sheight="\d+"/.test(img)) fail(url, `image without width/height: ${img.slice(0, 80)}`);
  }
}

// Every indexable page links to itself and to its other-language version, and
// the other version links back.
for (const u of indexable) {
  const alts = [...pages[u].matchAll(/<link rel="alternate" hreflang="(en-CA|fr-CA)" href="([^"]+)"/g)].map((m) => [m[1], m[2].replace(site.domain, "")]);
  if (alts.length !== 2) fail(u, `expected 2 hreflang links, found ${alts.length}`);
  if (!alts.some(([, p]) => p === u)) fail(u, "hreflang doesn't include the page itself");
  for (const [, p] of alts) {
    if (!pages[p]) fail(u, `hreflang points to missing page ${p}`);
    else if (!pages[p].includes(`href="${site.domain}${u}"`)) fail(u, `${p} doesn't link back with hreflang`);
  }
  const lang = (pages[u].match(/<html lang="([^"]+)"/) || [])[1];
  if (u.startsWith("/fr/") !== (lang === "fr-CA")) fail(u, `html lang is ${lang}`);
}

const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
const inMap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(site.domain, ""));
for (const u of indexable) if (!inMap.includes(u)) fail("sitemap.xml", `missing ${u}`);
for (const u of inMap) if (!indexable.includes(u)) fail("sitemap.xml", `lists non-indexable ${u}`);
const robots = await readFile(join(dist, "robots.txt"), "utf8");
if (/Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt", "blocks the whole site");

// Inquiry handler
const env = { INQUIRY_DRY_RUN: "1" };
const log = console.log;
console.log = () => {};
const send = (body, extra = {}) => handleInquiry({ method: "POST", body, ip: extra.ip || "198.51.100.1", json: true, env, ...extra });
const ok = await send({ name: "Test", email: "test@example.com", message: "Hello", elapsed: 5000 });
const dup = await send({ name: "Test", email: "test@example.com", message: "Hello", elapsed: 5000 });
const bad = await send({ name: "", email: "nope", elapsed: 5000 }, { ip: "198.51.100.2" });
const bot = await send({ name: "x", email: "x@example.com", website: "spam" }, { ip: "198.51.100.3" });
const get = await handleInquiry({ method: "GET", body: {}, env });
const noJs = await handleInquiry({ method: "POST", body: { name: "A", email: "a@example.com", message: "no js" }, ip: "198.51.100.4", json: false, env });
const noJsFr = await handleInquiry({ method: "POST", body: { name: "B", email: "b2@example.com", message: "sans js", lang: "fr" }, ip: "198.51.100.6", json: false, env });
let limited;
for (let i = 0; i < 7; i++) limited = await send({ name: "R", email: `r${i}@example.com`, elapsed: 5000 }, { ip: "198.51.100.9" });
const unconfigured = await handleInquiry({ method: "POST", body: { name: "A", email: "b@example.com", elapsed: 5000 }, ip: "198.51.100.5", env: {} });
console.log = log;
const expect = (name, cond) => { if (!cond) fail("api/inquiry", name); };
expect("valid inquiry accepted", ok.status === 200 && ok.json.ok);
expect("duplicate accepted once", dup.status === 200 && dup.json.ok);
expect("invalid fields rejected with 422", bad.status === 422 && bad.json.fields.name && bad.json.fields.email);
expect("honeypot silently accepted", bot.status === 200);
expect("GET rejected", get.status === 405);
expect("no-JS post redirects to /inquiry-received/", noJs.status === 303 && noJs.headers.Location === "/inquiry-received/");
expect("rate limit after 5 in 10 minutes", limited.status === 429);
expect("French no-JS post redirects to /fr/demande-recue/", noJsFr.status === 303 && noJsFr.headers.Location === "/fr/demande-recue/");
expect("missing email settings fail safely", unconfigured.status === 500 && !unconfigured.json.ok);

for (const w of warn) console.log("warn  " + w);
for (const p of problems) console.log("FAIL  " + p);
console.log(`\nChecked ${htmlFiles.length} pages (${indexable.length} indexable), sitemap, robots.txt and the inquiry handler: ${problems.length ? problems.length + " problem(s)" : "all good"}.`);
process.exit(problems.length ? 1 : 0);

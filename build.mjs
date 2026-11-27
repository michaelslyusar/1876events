// Builds the site into dist/. No dependencies.
//   node build.mjs          build once
//   node build.mjs --serve  build, then preview at http://localhost:4173
//                           (the inquiry form works too; without RESEND_API_KEY
//                           it prints submissions to this terminal instead of emailing)

import { mkdir, rm, cp, writeFile, readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { gzipSync } from "node:zlib";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import * as content from "./src/content.mjs";
import { landingPages } from "./src/pages.mjs";
import { renderSite } from "./src/template.mjs";
import { fr } from "./src/i18n/fr.mjs";
import { handleInquiry } from "./api/_inquiry.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const dist = join(root, "dist");
const { domain } = content.site;

// Photo sizes written by scripts/optimize_images.py.
const photos = JSON.parse(await readFile(join(root, "src", "photos.json"), "utf8").catch(() => "{}"));

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, "public"), dist, { recursive: true });

const { pages, missing } = renderSite({ ...content, landingPages }, photos, { fr });
for (const [locale, keys] of Object.entries(missing))
  if (keys.length) console.warn(`${keys.length} string(s) without a ${locale} translation (shown in English):\n  ${keys.join("\n  ")}`);
if (process.argv.includes("--missing-json")) await writeFile(join(root, "missing.json"), JSON.stringify(missing, null, 2));
for (const page of pages) {
  const file = page.path.endsWith("/") ? join(dist, page.path, "index.html") : join(dist, page.path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page.html);
}

// Every indexable page goes in the sitemap automatically.
const today = new Date().toISOString().slice(0, 10);
await writeFile(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .filter((p) => p.indexable)
    .map((p) => `  <url><loc>${domain}${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`
);
await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${domain}/sitemap.xml\n`);
console.log(`Built dist/ (${pages.length} pages)`);

if (process.argv.includes("--serve")) {
  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".xml": "application/xml", ".txt": "text/plain", ".woff2": "font/woff2" };
  const exists = (p) => stat(p).then((s) => s.isFile(), () => false);
  const env = { ...process.env, INQUIRY_DRY_RUN: process.env.RESEND_API_KEY ? process.env.INQUIRY_DRY_RUN : "1" };

  createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    if (url.pathname.replace(/\/$/, "") === "/api/inquiry") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const type = req.headers["content-type"] || "";
      const body = type.includes("json") ? JSON.parse(raw || "{}") : Object.fromEntries(new URLSearchParams(raw));
      const out = await handleInquiry({ method: req.method, body, ip: req.socket.remoteAddress, json: type.includes("json"), env });
      res.writeHead(out.status, out.headers || { "Content-Type": "application/json" });
      return res.end(out.body ?? JSON.stringify(out.json));
    }
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
    let file = join(dist, path);
    if (!(await exists(file))) file = join(dist, path, "index.html");
    if (await exists(file)) {
      // Compress text like the production host does, so local audits are realistic.
      let body = await readFile(file);
      const headers = { "Content-Type": (types[extname(file)] || "application/octet-stream") + "; charset=utf-8" };
      if (/\.(html|css|js|svg|xml|txt)$/.test(file) && /gzip/.test(req.headers["accept-encoding"] || "")) {
        body = gzipSync(body);
        headers["Content-Encoding"] = "gzip";
      }
      res.writeHead(200, headers);
      return res.end(body);
    }
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }).end(await readFile(join(dist, "404.html")));
  }).listen(4173, () => console.log("Preview: http://localhost:4173"));
}

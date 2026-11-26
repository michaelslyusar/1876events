// Builds the site into dist/. No dependencies.
//   node build.mjs          build once
//   node build.mjs --serve  build, then preview at http://localhost:4173

import { mkdir, rm, cp, writeFile, readFile, readdir } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import * as content from "./src/content.mjs";
import { render } from "./src/template.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const dist = join(root, "dist");
const { domain } = content.site;

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, "public"), dist, { recursive: true });
// Photo sizes made by scripts/optimize_images.py, e.g. images/hero-table.jpg -> [640, 1024, 1100].
const variants = {};
for (const file of await readdir(join(root, "public", "images"))) {
  const m = file.match(/^(.+)-(\d+)\.webp$/);
  if (m) (variants[`images/${m[1]}.jpg`] ??= []).push(Number(m[2]));
}
Object.values(variants).forEach((w) => w.sort((a, b) => a - b));

await writeFile(join(dist, "index.html"), render({ ...content, variants }));
await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`);
await writeFile(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${domain}/</loc></url>\n</urlset>\n`
);
console.log("Built dist/");

if (process.argv.includes("--serve")) {
  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".xml": "application/xml", ".txt": "text/plain" };
  createServer(async (req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
    if (!path || path.endsWith("/") || path.endsWith("\\")) path += "index.html";
    try {
      const body = await readFile(join(dist, path));
      res.writeHead(200, { "Content-Type": (types[extname(path)] || "application/octet-stream") + "; charset=utf-8" });
      res.end(body);
    } catch {
      res.writeHead(404).end("Not found");
    }
  }).listen(4173, () => console.log("Preview: http://localhost:4173"));
}

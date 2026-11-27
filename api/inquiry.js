// Vercel serverless function: POST /api/inquiry
// Receives the inquiry form and emails it (see api/_inquiry.js for settings).

import { handleInquiry } from "./_inquiry.js";

export default async function handler(req, res) {
  const type = String(req.headers["content-type"] || "");
  const isJson = type.includes("application/json");
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = isJson ? JSON.parse(body) : Object.fromEntries(new URLSearchParams(body));
    } catch {
      body = null;
    }
  }
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "";

  const out = await handleInquiry({ method: req.method, body, ip, json: isJson, env: process.env });

  res.statusCode = out.status;
  for (const [k, v] of Object.entries(out.headers || { "Content-Type": "application/json" })) res.setHeader(k, v);
  res.setHeader("Cache-Control", "no-store");
  res.end(out.body ?? JSON.stringify(out.json));
}

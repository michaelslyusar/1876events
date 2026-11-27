// Inquiry handling shared by the Vercel function (api/inquiry.js) and the local
// preview server (build.mjs). Files starting with "_" are not deployed as routes.
//
// Environment variables (set them in Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY        required in production; https://resend.com API key
//   INQUIRY_FROM          sender, on a domain verified in Resend,
//                         e.g. "1876 Website <inquiries@1876events.ca>"
//   INQUIRY_TO            optional; defaults to site.email in src/content.mjs
//   TURNSTILE_SECRET_KEY  optional; enables the Cloudflare Turnstile check
//   CRM_WEBHOOK_URL       optional; each inquiry is also POSTed here as JSON
//   INQUIRY_DRY_RUN=1     log inquiries instead of emailing (local testing)

import { site, rooms, eventTypes } from "../src/content.mjs";

const MAX = { name: 120, email: 200, company: 160, phone: 40, guests: 6, message: 5000, page: 200 };
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };
const DUPLICATE_MS = 10 * 60 * 1000;

// Per-instance memory. Serverless instances are short-lived, so this limits
// bursts from one address rather than enforcing a hard global quota.
const hits = new Map();
const recent = new Map();

const clean = (v, max, { multiline = false } = {}) => {
  let s = String(v ?? "").replace(/\r\n?/g, "\n");
  s = multiline ? s.replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
  // Drop control characters (keeps newlines in multi-line fields).
  s = s.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "");
  return s.trim().slice(0, max);
};
const escHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const limited = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE.max;
};

const isDuplicate = (key) => {
  const now = Date.now();
  for (const [k, t] of recent) if (now - t > DUPLICATE_MS) recent.delete(k);
  if (recent.has(key)) return true;
  recent.set(key, now);
  return false;
};

const LABELS = {
  name: "Name",
  email: "Email",
  company: "Company / Organization",
  phone: "Phone",
  eventDate: "Event date",
  guests: "Approximate guests",
  space: "Preferred room",
  eventType: "Event type",
  message: "Message",
  page: "Sent from",
  language: "Language",
};

export async function handleInquiry({ method, body, ip = "", json = true, env = {}, fetchImpl = fetch }) {
  const lang = body && body.lang === "fr" ? "fr" : "en";
  const reply = (status, data) => {
    if (json) return { status, json: data };
    if (data.ok) return { status: 303, headers: { Location: lang === "fr" ? "/fr/demande-recue/" : "/inquiry-received/" }, body: "" };
    return {
      status,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Inquiry not sent</title><p>${escHtml(data.message)}</p><p><a href="/#contact">Back to the form</a></p>`,
    };
  };
  const fail = (status, message, fields) => reply(status, { ok: false, message, ...(fields && { fields }) });

  if (method !== "POST") return { status: 405, headers: { Allow: "POST", "Content-Type": "application/json" }, json: { ok: false, message: "Use POST." } };
  if (!body || typeof body !== "object") return fail(400, "We couldn't read your inquiry. Please try again.");

  // Spam checks that pretend to succeed, so bots get no signal.
  if (clean(body.website, 200)) return reply(200, { ok: true });
  if (json && Number(body.elapsed) > 0 && Number(body.elapsed) < 2500) return reply(200, { ok: true });

  if (limited(ip || "unknown")) return fail(429, `Too many inquiries in a short time. Please wait a few minutes, or email ${site.email}.`);

  const roomNames = rooms.map((r) => r.formValue);
  const data = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    company: clean(body.company, MAX.company),
    phone: clean(body.phone, MAX.phone),
    eventDate: /^\d{4}-\d{2}-\d{2}$/.test(String(body.eventDate || "")) ? String(body.eventDate) : "",
    guests: /^\d{1,6}$/.test(String(body.guests || "").trim()) ? String(body.guests).trim() : "",
    space: roomNames.includes(body.space) ? body.space : "Not sure yet",
    eventType: eventTypes.includes(body.eventType) ? body.eventType : "",
    message: clean(body.message, MAX.message, { multiline: true }),
    page: clean(body.page, MAX.page),
    language: lang === "fr" ? "French (reply in French)" : "",
  };
  if (!data.eventDate) data.eventDate = body.dateUndecided ? "Not decided yet" : "";
  const utm = Object.fromEntries(UTM.map((k) => [k, clean(body[k], 100)]).filter(([, v]) => v));

  const fields = {};
  if (!data.name) fields.name = "Enter your name.";
  if (!data.email) fields.email = "Enter your email so we can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) fields.email = "Enter an email address like name@example.com.";
  if (Object.keys(fields).length) return fail(422, "Please check the highlighted fields.", fields);

  if (env.TURNSTILE_SECRET_KEY) {
    try {
      const r = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: String(body["cf-turnstile-response"] || ""), remoteip: ip }),
      });
      if (!(await r.json()).success) return fail(400, "Please complete the spam check and try again.");
    } catch {
      return fail(502, `We couldn't verify your submission. Please try again, or email ${site.email}.`);
    }
  }

  // The same inquiry sent twice (double tap, resubmitted page) is accepted once.
  if (isDuplicate([data.email.toLowerCase(), data.eventDate, data.message].join("|"))) return reply(200, { ok: true });

  const rows = Object.entries(LABELS).filter(([k]) => data[k]).map(([k, label]) => [label, data[k]]);
  for (const [k, v] of Object.entries(utm)) rows.push([k, v]);
  const subject = `New inquiry${lang === "fr" ? " (FR)" : ""}: ${data.eventType || "Event"}, ${data.name}`.replace(/[\r\n]+/g, " ").slice(0, 150);
  const text = rows.map(([l, v]) => `${l}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font:15px/1.5 Arial,sans-serif;color:#262d32">${rows
    .map(([l, v]) => `<tr><td style="vertical-align:top;color:#6f706c;white-space:nowrap">${escHtml(l)}</td><td style="white-space:pre-wrap">${escHtml(v)}</td></tr>`)
    .join("")}</table>`;
  const lead = { ...data, ...utm, receivedAt: new Date().toISOString() };

  if (env.INQUIRY_DRY_RUN === "1") {
    console.log(`\n[inquiry: dry run, not emailed]\nSubject: ${subject}\n${text}\n`);
  } else {
    if (!env.RESEND_API_KEY || !env.INQUIRY_FROM) {
      console.error("Inquiry form: RESEND_API_KEY and INQUIRY_FROM must be set.");
      return fail(500, `Our form isn't available right now. Please email ${site.email}.`);
    }
    try {
      const r = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: env.INQUIRY_FROM, to: [env.INQUIRY_TO || site.email], reply_to: data.email, subject, text, html }),
      });
      if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
    } catch (err) {
      console.error("Inquiry form: email failed.", err);
      recent.clear(); // let the visitor retry
      return fail(502, `Your inquiry didn't send. Please try again, or email ${site.email}.`);
    }
  }

  // Optional CRM hand-off. A failure here doesn't fail the inquiry, which was already emailed.
  if (env.CRM_WEBHOOK_URL) {
    try {
      await fetchImpl(env.CRM_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(4000),
      });
    } catch (err) {
      console.error("Inquiry form: CRM webhook failed.", err);
    }
  }

  return reply(200, { ok: true });
}

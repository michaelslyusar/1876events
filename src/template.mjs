// Renders every page of the site, in every language, from src/content.mjs and
// src/pages.mjs. Layout and markup live here; words, numbers and photo names
// live in the content files. Every visible string goes through `t()` (see
// src/translator.mjs); French text lives in src/i18n/fr.mjs.
// `renderSite()` returns [{ path, html, indexable, locale }].

import { plan } from "./plan.mjs";
import { createTranslator } from "./translator.mjs";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const LOCALES = ["en", "fr"];

const ICONS = {
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  parking: '<rect x="3.5" y="3.5" width="17" height="17" rx="1"/><path d="M9.5 16.5v-9h3.2a2.6 2.6 0 0 1 0 5.2H9.5"/>',
  door: '<path d="M4 20.5h16"/><path d="M7 20.5V3.5h10v17"/><circle cx="14.3" cy="12.2" r=".8" fill="currentColor" stroke="none"/>',
  layout: '<rect x="3.5" y="4.5" width="17" height="15"/><path d="M10 4.5v15M10 12h10.5"/>',
  wifi: '<path d="M3 9.5a13 13 0 0 1 18 0"/><path d="M6.2 12.8a8.5 8.5 0 0 1 11.6 0"/><path d="M9.3 16a4 4 0 0 1 5.4 0"/><circle cx="12" cy="19" r=".9" fill="currentColor" stroke="none"/>',
  screen: '<rect x="3.5" y="4" width="17" height="11"/><path d="M12 15v5M8.5 20.5h7"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M9 15.2l2 2 4-4"/>',
};

const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

const arrow =
  '<svg class="arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

// A photo slot. Serves the WebP/JPEG sizes made by scripts/optimize_images.py
// (listed in src/photos.json) and lets the browser pick one from `sizes`.
// Until the photo exists, a labelled placeholder shows in its place.
let PHOTOS = {};
const photoUrl = (file, w) => `/images/${file}-${w}`;
const photo = (t, { file, alt, pos }, { cls = "", eager = false, sizes = "100vw" } = {}) => {
  const meta = PHOTOS[file];
  if (!meta) return `\n  <figure class="ph ${cls}" data-label="${t.attr(alt)}&#10;assets/photos/${esc(file)}.jpg" role="img" aria-label="${t.attr(alt)}"></figure>`;
  const set = (ext) => meta.widths.map((w) => `${photoUrl(file, w)}.${ext} ${w}w`).join(", ");
  const attrs = `alt="${t.attr(alt)}" width="${meta.width}" height="${meta.height}"${pos ? ` style="object-position:${esc(pos)}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"`;
  return `
  <figure class="ph ${cls}">
    <picture><source type="image/webp" srcset="${set("webp")}" sizes="${sizes}"><img src="${photoUrl(file, meta.widths.at(-1))}.jpg" srcset="${set("jpg")}" sizes="${sizes}" ${attrs}></picture>
  </figure>`;
};
const imageUrl = (domain, file) => (PHOTOS[file] ? `${domain}${photoUrl(file, PHOTOS[file].widths.at(-1))}.jpg` : null);

const roomPath = (r) => `/spaces/${r.slug}/`;
const sqft = (t, n) => t("{n} sq. ft.", { n: t.num(n) });

// Shared components -------------------------------------------------------

const breadcrumbs = (t, crumbs) =>
  `<nav class="crumbs wrap" aria-label="${t.attr("Breadcrumb")}"><ol>${crumbs
    .map((c, i) =>
      i === crumbs.length - 1 ? `<li><span aria-current="page">${t(c.name)}</span></li>` : `<li><a href="${t.path(c.path)}">${t(c.name)}</a></li>`
    )
    .join("")}</ol></nav>`;

const facts = (rows) =>
  `<dl class="facts">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("")}</dl>`;

const featureList = (t, items, cls = "") =>
  `<ul class="features ${cls}">${items
    .map((f) => `<li class="feature">${icon(f.icon)}<h3>${t(f.title)}</h3><p>${t(f.text)}</p></li>`)
    .join("")}</ul>`;

const faqList = (t, items) =>
  `<div class="faq__list">${items
    .map(
      (f) => `
        <details class="faq__item">
          <summary>${t(f.q)}</summary>
          <div class="faq__a"><p>${t(f.a)}</p></div>
        </details>`
    )
    .join("")}
      </div>`;

const faqSection = (t, items, { title = "Frequently asked questions" } = {}) => `
  <section class="section faq" id="faq" aria-labelledby="faq-title">
    <div class="wrap faq__grid">
      <div>
        <h2 class="h2" id="faq-title">${t(title)}</h2>
      </div>
      ${faqList(t, items)}
    </div>
  </section>`;

// Small room card linking to the room page.
const roomCard = (t, r) => `
        <li class="card">
          <a class="card__link" href="${t.path(roomPath(r))}">
            ${photo(t, r.image, { cls: "card__media", sizes: "(min-width: 900px) 30vw, 100vw" })}
            <span class="card__body">
              <span class="card__title">${t(r.name)} ${arrow}</span>
              <span class="card__meta">${sqft(t, r.sqft)}${r.sections ? ` &middot; ${t("divides into {n} sections", { n: r.sections.length })}` : ""}</span>
              <span class="card__text">${t(r.summary)}</span>
            </span>
          </a>
        </li>`;

// Confirmed capacities per setup. Renders nothing until `capacities` has rows.
const capacityTable = (t, r) =>
  r.capacities?.length
    ? `<table class="cap-table"><caption>${t("Capacity by setup")}</caption><thead><tr><th scope="col">${t("Setup")}</th><th scope="col">${t("Guests")}</th></tr></thead><tbody>${r.capacities
        .map((c) => `<tr><th scope="row">${t(c.setup)}</th><td>${t.num(c.guests)}</td></tr>`)
        .join("")}</tbody></table>`
    : "";

// data-space / data-event-type preselect the form. Values stay in English:
// they are what the form submits and what the server accepts.
const ctaAttrs = ({ space, eventType } = {}) =>
  `${space ? ` data-space="${esc(space)}"` : ""}${eventType ? ` data-event-type="${esc(eventType)}"` : ""}`;

// Strings main.js shows while the form is in use.
const formMessages = (t, site) => ({
  locale: t.lang,
  selectDate: t.plain("Select a date"),
  sending: t.plain("Sending…"),
  nameMissing: t.plain("Enter your name."),
  emailMissing: t.plain("Enter your email so we can reply."),
  emailInvalid: t.plain("Enter an email address like name@example.com."),
  checkFields: t.plain("Please check the highlighted fields."),
  tooMany: t.plain("Too many inquiries in a short time. Please wait a few minutes, or email {email}.", { email: site.email }),
  failed: t.plain("Your inquiry didn’t send. Check your connection and try again, or email {email}.", { email: site.email }),
});

// The inquiry form. `space` and `eventType` preselect the matching options.
const contactSection = (ctx, t, { space = "", eventType = "", title = "Tell us about your event", room = "" } = {}) => {
  const { site, rooms, eventTypes } = ctx;
  const opt = (value, label, selected) => `<option value="${esc(value)}"${selected ? " selected" : ""}>${t(label)}</option>`;
  return `
  <section class="section contact" id="contact" aria-labelledby="contact-title">
    <div class="wrap contact__grid">
      <div class="contact__text">
        <h2 class="h2" id="contact-title">${t(title, { room })}</h2>
        <p class="lead">${t("Share a few details and we’ll reply with availability and a quote for your date")}</p>
        <p class="contact__hint">${t("Not sure of the date or which room fits? Leave those open and we’ll recommend options based on your group and format.")}</p>
        <p class="contact__direct">${t("Prefer email?")}<br><a class="text-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
        ${site.phone ? `<p class="contact__direct">${t("Call us")}<br><a class="text-link" href="tel:${esc(site.phone.replace(/\s/g, ""))}">${esc(site.phone)}</a></p>` : ""}
        <p class="contact__direct">${t("Visit")}<br><a class="text-link" href="${esc(site.maps.placeUrl)}" target="_blank" rel="noopener" data-track="directions">${esc(site.address.street)}, ${esc(site.address.city)}</a></p>
      </div>

      <div class="contact__panel">
        <form class="form" id="inquiry-form" action="${esc(site.form.endpoint)}" method="post" novalidate>
          <div class="hp" aria-hidden="true"><label>${t("Leave this field empty")} <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
          <input type="hidden" name="page" value="">
          <input type="hidden" name="lang" value="${t.locale}">

          <div class="field">
            <label for="f-name">${t("Name")} <span class="req" aria-hidden="true">*</span></label>
            <input id="f-name" name="name" type="text" autocomplete="name" maxlength="120" required aria-describedby="f-name-err">
            <p class="field__err" id="f-name-err"></p>
          </div>
          <div class="field">
            <label for="f-email">${t("Email")} <span class="req" aria-hidden="true">*</span></label>
            <input id="f-email" name="email" type="email" autocomplete="email" maxlength="200" required aria-describedby="f-email-err">
            <p class="field__err" id="f-email-err"></p>
          </div>
          <div class="field">
            <label for="f-company">${t("Company / Organization")}</label>
            <input id="f-company" name="company" type="text" autocomplete="organization" maxlength="160">
          </div>
          <div class="field">
            <label for="f-phone">${t("Phone")}</label>
            <input id="f-phone" name="phone" type="tel" autocomplete="tel" maxlength="40">
          </div>
          <div class="field">
            <label for="f-date">${t("Event date")}</label>
            <input id="f-date" name="eventDate" type="date">
            <label class="check"><input type="checkbox" name="dateUndecided" value="yes"> ${t("I don’t have a date yet")}</label>
          </div>
          <div class="field">
            <label for="f-guests">${t("Approximate number of guests")}</label>
            <input id="f-guests" name="guests" type="number" min="1" max="10000" inputmode="numeric">
          </div>
          <div class="field">
            <label for="f-space">${t("Preferred room")}</label>
            <select id="f-space" name="space">
              ${opt("Not sure yet", "Not sure yet", !space)}
              ${rooms.map((r) => opt(r.formValue, r.name, r.formValue === space)).join("")}
            </select>
          </div>
          <div class="field">
            <label for="f-type">${t("Event type")}</label>
            <select id="f-type" name="eventType">
              ${opt("", "Select a type", !eventType)}
              ${eventTypes.map((x) => opt(x, x, x === eventType)).join("")}
            </select>
          </div>
          <div class="field field--full">
            <label for="f-message">${t("Message")}</label>
            <textarea id="f-message" name="message" rows="5" maxlength="5000" placeholder="${t.attr("Timing, room setup, AV needs, or anything else we should know")}"></textarea>
          </div>
          ${site.form.turnstileSiteKey ? `<div class="field field--full"><div class="cf-turnstile" data-sitekey="${esc(site.form.turnstileSiteKey)}" data-language="${t.locale}"></div></div>` : ""}

          <div class="form__foot">
            <button class="btn" type="submit">${t("Request Availability")}</button>
            <p class="form__note"><span aria-hidden="true">*</span> ${t("Required")}</p>
          </div>
          <p class="form__privacy">${t("We use the details you send only to reply to your inquiry and prepare a quote. We don’t sell your information or add you to a mailing list.")}</p>
          <p class="form__status" role="status" aria-live="polite"></p>
        </form>
        <script type="application/json" id="form-i18n">${JSON.stringify(formMessages(t, site)).replace(/</g, "\\u003c")}</script>

        <div class="form-done" id="form-success" tabindex="-1" hidden>
          <p class="form-done__title">${t("Thank you for your inquiry. We’ve received your request and will be in touch shortly.")}</p>
          <p>${t("Need to add something? Email")} <a class="text-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
        </div>
      </div>
    </div>
  </section>`;
};

// Structured data ---------------------------------------------------------

const venueNode = (ctx, t) => {
  const { site, rooms } = ctx;
  const a = site.address;
  const d = site.domain;
  const sameAs = [...Object.values(site.social), ...site.directories.map((x) => x.url)].filter(Boolean);
  const images = [...ctx.images.hero.map((i) => i.file), ...rooms.map((r) => r.image.file)].map((f) => imageUrl(d, f)).filter(Boolean);
  return {
    "@type": ["EventVenue", "LocalBusiness"],
    "@id": `${d}/#venue`,
    name: site.name,
    url: `${d}/`,
    email: site.email,
    ...(site.phone && { telephone: site.phone }),
    logo: { "@type": "ImageObject", url: `${d}/images/logo-512.png`, width: 512, height: 512 },
    image: images,
    description: t.plain(site.seo.description),
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.regionCode,
      addressCountry: a.country,
      ...(a.postalCode && { postalCode: a.postalCode }),
    },
    hasMap: site.maps.placeUrl,
    areaServed: ["Ottawa", "Nepean", "Kanata", "Bells Corners"].map((name) => ({ "@type": "Place", name })),
    amenityFeature: ctx.features
      .filter((f) => ["parking", "wifi", "door"].includes(f.icon))
      .map((f) => ({ "@type": "LocationFeatureSpecification", name: t.plain(f.title), value: true })),
    containsPlace: rooms.map((r) => ({
      "@type": "Room",
      "@id": `${d}${roomPath(r)}#room`,
      name: r.name,
      url: `${d}${t.path(roomPath(r))}`,
      floorSize: { "@type": "QuantitativeValue", value: r.sqft, unitCode: "FTK" },
    })),
    ...(sameAs.length && { sameAs }),
  };
};

const jsonLdFor = (ctx, t, page) => {
  const d = ctx.site.domain;
  const url = d + page.path;
  const graph = [
    venueNode(ctx, t),
    { "@type": "WebSite", "@id": `${d}/#website`, url: `${d}/`, name: ctx.site.name, publisher: { "@id": `${d}/#venue` }, inLanguage: ["en-CA", "fr-CA"] },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": `${d}/#website` },
      about: { "@id": page.about || `${d}/#venue` },
      inLanguage: t.lang,
      ...(page.crumbs && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
      ...(page.ogFile && imageUrl(d, page.ogFile) && { primaryImageOfPage: imageUrl(d, page.ogFile) }),
    },
  ];
  if (page.crumbs)
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: page.crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: t.plain(c.name), item: d + t.path(c.path) })),
    });
  if (page.faqs?.length)
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      inLanguage: t.lang,
      mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: t.plain(f.q), acceptedAnswer: { "@type": "Answer", text: t.plain(f.a) } })),
    });
  // "<" is escaped so the JSON can never close the script tag early.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
};

// Page shell --------------------------------------------------------------

const analyticsHead = ({ analytics: an }) => {
  if (!an.ga4Id && !an.adsId) return "";
  const ids = [an.ga4Id, an.adsId].filter(Boolean);
  return `
<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(ids[0])}"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag("consent","default",${JSON.stringify(an.consent)});
gtag("js",new Date());
${ids.map((id) => `gtag("config",${JSON.stringify(id)});`).join("\n")}
window.SITE_ADS_LEAD=${JSON.stringify(an.adsId && an.adsLeadLabel ? `${an.adsId}/${an.adsLeadLabel}` : "")};
</script>`;
};

const layout = (ctx, t, page) => {
  const { site, nav, rooms, landingPages } = ctx;
  const a = site.address;
  const d = site.domain;
  const home = t.path("/");
  const isHome = page.path === home;
  const canonical = d + page.path;
  const ogImage = page.ogFile && PHOTOS[page.ogFile] ? `/images/og/${page.ogFile}.jpg` : site.seo.ogImage;
  const social = Object.entries(site.social).filter(([, url]) => url);
  const socialNames = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn" };
  const external = [...social.map(([k, url]) => ({ name: socialNames[k] || k, url })), ...site.directories];
  const navLinks = nav
    .map((n) => {
      const href = t.path(n.href);
      return `<li><a href="${href}"${href === page.path ? ' aria-current="page"' : ""}>${t(n.label)}</a></li>`;
    })
    .join("");
  const contactHref = page.noForm ? `${home}#contact` : "#contact";
  // The same page in the other language, for hreflang and the language switch.
  const alt = page.alternates || {};
  const other = t.locale === "en" ? "fr" : "en";
  const switchHref = alt[other] || (other === "fr" ? "/fr/" : "/");

  return `<!doctype html>
<html lang="${t.lang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.indexable === false ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${canonical}">`}
${
  page.indexable === false
    ? ""
    : `${Object.entries(alt)
        .map(([l, p]) => `<link rel="alternate" hreflang="${l === "fr" ? "fr-CA" : "en-CA"}" href="${d}${p}">`)
        .join("\n")}
${alt.en ? `<link rel="alternate" hreflang="x-default" href="${d}${alt.en}">` : ""}`
}
${site.analytics.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(site.analytics.googleSiteVerification)}">` : ""}
<meta name="theme-color" content="#FAF9F6">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/images/logo.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/images/logo-512.png">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${d}${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${t.locale === "fr" ? "fr_CA" : "en_CA"}">
<meta property="og:locale:alternate" content="${t.locale === "fr" ? "en_CA" : "fr_CA"}">
<meta name="twitter:card" content="summary_large_image">

<link rel="stylesheet" href="/styles.css">
<script>document.documentElement.classList.replace("no-js","js")</script>
${analyticsHead(site)}
${site.form.turnstileSiteKey && !page.noForm ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ""}
${page.indexable === false ? "" : `<script type="application/ld+json">${jsonLdFor(ctx, t, page)}</script>`}
</head>
<body${page.room ? ` data-room="${esc(page.room)}"` : ""}>
<a class="skip" href="#main">${t("Skip to content")}</a>

<header class="site-header">
  <div class="wrap header__inner">
    <a class="brand" href="${isHome ? "#top" : home}" aria-label="${t.attr(isHome ? "{name}, back to top" : "{name}, home", { name: site.name })}"><img src="/images/logo.png" alt="" width="52" height="52"></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="${t.attr("Open menu")}" data-label-open="${t.attr("Open menu")}" data-label-close="${t.attr("Close menu")}"><span></span><span></span></button>
    <nav class="nav" id="site-nav" aria-label="${t.attr("Main")}">
      <ul class="nav__list">${navLinks}</ul>
      <a class="lang-switch" href="${switchHref}" hreflang="${other === "fr" ? "fr-CA" : "en-CA"}" lang="${other === "fr" ? "fr-CA" : "en-CA"}" aria-label="${other === "fr" ? "Version française" : "English version"}"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>${other === "fr" ? "FR" : "EN"}</a>
      <a class="btn btn--sm" href="${contactHref}" data-cta="header">${t("Request Availability")}</a>
    </nav>
  </div>
</header>

<main id="main">
${page.crumbs ? breadcrumbs(t, page.crumbs) : ""}
${page.body}
</main>

<footer class="site-footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <p class="footer__num">1876</p>
      <p>${t(site.tagline)}</p>
      <address class="footer__addr">
        ${esc(a.street)}<br>${esc(a.city)}, ${t(a.region)}, ${t(a.countryName)}<br>
        <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
        ${site.phone ? `<br><a href="tel:${esc(site.phone.replace(/\s/g, ""))}">${esc(site.phone)}</a>` : ""}
        <br><a href="${esc(site.maps.placeUrl)}" target="_blank" rel="noopener" data-track="directions">${t("View on Google Maps")}</a>
      </address>
    </div>
    <nav class="footer__col" aria-label="${t.attr("Spaces")}">
      <p class="footer__head">${t("Spaces")}</p>
      <ul>${rooms.map((r) => `<li><a href="${t.path(roomPath(r))}">${t(r.name)}</a></li>`).join("")}</ul>
    </nav>
    <nav class="footer__col" aria-label="${t.attr("Plan your event")}">
      <p class="footer__head">${t("Plan your event")}</p>
      <ul>${landingPages.map((p) => `<li><a href="${t.path(p.path)}">${t(p.nav)}</a></li>`).join("")}</ul>
    </nav>
    <nav class="footer__col" aria-label="${t.attr("Venue")}">
      <p class="footer__head">${t("Venue")}</p>
      <ul>
        <li><a href="${t.path("/#location")}">${t("Location")}</a></li>
        <li><a href="${t.path("/#faq")}">${t("FAQ")}</a></li>
        <li><a href="${contactHref}">${t("Request availability")}</a></li>
        <li><a href="${switchHref}" hreflang="${other === "fr" ? "fr-CA" : "en-CA"}" lang="${other === "fr" ? "fr-CA" : "en-CA"}">${other === "fr" ? "Français" : "English"}</a></li>
        ${external.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.name)}</a></li>`).join("")}
      </ul>
    </nav>
  </div>
  <div class="wrap footer__base">
    <p>&copy; ${new Date().getFullYear()} ${esc(site.name)}</p>
  </div>
</footer>

<a class="to-top" href="${isHome ? "#top" : "#main"}" aria-label="${t.attr("Back to top")}" tabindex="-1"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg></a>

${page.noForm ? "" : `<div class="mcta" inert>
  <a class="btn" href="#contact" data-cta="mobile-bar"${ctaAttrs(page.cta)}>${t("Request Availability")}</a>
</div>`}

<script src="/main.js" defer></script>
</body>
</html>
`;
};

// Homepage ----------------------------------------------------------------

const homeBody = (ctx, t) => {
  const { site, images, rooms, features, corporate, faqs, ticker, landingPages, totalSqft } = ctx;
  const a = site.address;
  const p = site.pricing;
  const maxWidth = Math.max(...rooms.map((r) => Math.sqrt(r.sqft * (r.shape || 1))));

  return `
  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="wrap">
      <div class="marque">
        <p class="marque__num" aria-hidden="true">1876</p>
        <div class="marque__meta">
          <p class="marque__name">${t(site.tagline)}</p>
          <p class="marque__addr">${esc(a.street)}, ${esc(a.city)}</p>
        </div>
      </div>
      <div class="hero__grid">
        <div class="hero__text">
          <h1 id="hero-title">${t("Meeting & Event Space in Ottawa West")}</h1>
          <p class="hero__tag">${t("A refined space for meetings, events & celebrations")}</p>
          <ul class="hero__points">
            <li>${t("Free on-site parking")}</li>
            <li>${t("Complimentary Wi-Fi")}</li>
            <li>${t("Three configurable rooms")}</li>
          </ul>
          <div class="actions">
            <a class="btn" href="#contact" data-cta="hero">${t("Request Availability")}</a>
            <a class="btn btn--ghost" href="#contact" data-cta="hero-tour" data-event-type="Venue tour">${t("Schedule a Venue Tour")}</a>
          </div>
        </div>
        <div class="collage">
          ${images.hero
            .map((img, i) =>
              photo(t, img, {
                cls: `collage__item${i === 0 ? " collage__main" : i === 1 ? " collage__tall" : ""}`,
                eager: i < 2,
                sizes: ["(min-width: 900px) 38vw, 66vw", "(min-width: 900px) 19vw, 33vw"][i] || "(min-width: 900px) 29vw, 50vw",
              })
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>

  <section class="section spaces" id="spaces" aria-labelledby="spaces-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="spaces-title">${t("Flexible space for meetings, training and events")}</h2>
        <p class="lead">${t("1876 Banquets & Conference Center offers flexible room rentals for corporate meetings, training sessions, workshops, conferences and private events. Located in Bells Corners, our venue is convenient for teams coming from Nepean, Kanata and across Ottawa")}</p>
      </div>

      <figure class="scale reveal">
        <div class="scale__row">
          ${rooms
            .map((r) => {
              const ratio = r.shape || 1;
              const share = Math.sqrt(r.sqft * ratio) / maxWidth;
              return `<a class="scale__room${share === 1 ? " scale__room--largest" : ""}" href="${t.path(roomPath(r))}" style="--g:${(share * 1000).toFixed(0)};--w:${(share * 100).toFixed(1)}%;--r:${ratio}">
            ${plan(r)}
            <span class="scale__label"><strong>${esc(r.shortName)}</strong> <span>${sqft(t, r.sqft)}</span></span>
          </a>`;
            })
            .join("")}
        </div>
        <figcaption>${t("{n} sq. ft. of event space, drawn to the same scale. Layouts show a typical setup, not exact floor plans. We arrange tables and seating to suit your event.", { n: t.num(totalSqft) })}</figcaption>
      </figure>

      <div class="rooms">
        ${rooms
          .map(
            (r) => `
        <article class="room reveal" id="${r.id}" aria-labelledby="${r.id}-title">
          <a class="room__photo" href="${t.path(roomPath(r))}" tabindex="-1" aria-hidden="true">${photo(t, r.image, { cls: "room__media", sizes: "(min-width: 900px) 56vw, 100vw" })}</a>
          <div class="room__body">
            <h3 class="room__name" id="${r.id}-title"><a href="${t.path(roomPath(r))}">${t(r.name)}</a></h3>
            <p class="room__area"><span><span class="room__num">${t.num(r.sqft)}</span> ${t("sq. ft.")}</span>${r.sections ? `<span class="room__cap">${t("divides into {n} sections", { n: r.sections.length })}</span>` : ""}</p>
            <p class="room__summary">${t(r.summary)}</p>
            <p class="room__label">${t(r.usesLabel)}</p>
            <ul class="room__uses">${r.uses.map((u) => `<li>${t(u)}</li>`).join("")}</ul>
            <div class="room__actions">
              <a class="btn btn--ghost" href="${t.path(roomPath(r))}">${t("View the {room}", { room: r.name })}</a>
              <a class="text-link" href="#contact" data-cta="room-${r.id}"${ctaAttrs({ space: r.formValue })}>${t("Request availability")}</a>
            </div>
          </div>
        </article>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section why" id="why" aria-labelledby="why-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="why-title">${t("Why 1876")}</h2>
        <p class="lead">${t("The practical details that make the day easier for organizers and guests")}</p>
      </div>
      ${featureList(t, features, "features--six")}
    </div>
  </section>

  <section class="section corp" id="corporate" aria-labelledby="corp-title">
    <div class="wrap corp__grid">
      <div class="corp__text">
        <h2 class="h2" id="corp-title">${t(corporate.title)}</h2>
        <p class="corp__lead">${t(corporate.lead)}</p>
        <ul class="corp__points">${corporate.points.map((x) => `<li>${t(x)}</li>`).join("")}</ul>
        <p class="corp__offer">${t(corporate.offer)}</p>
        <a class="btn btn--gold" href="#contact" data-cta="corporate"${ctaAttrs({ eventType: "Recurring booking" })}>${t("Discuss a Recurring Booking")}</a>
        <p class="corp__more"><a href="${t.path("/recurring-meeting-space-ottawa/")}">${t("Recurring bookings")}</a> &middot; <a href="${t.path("/corporate-training-space-ottawa/")}">${t("Corporate training space")}</a></p>
      </div>
      <div>
        <p class="corp__label">${t("Well suited to")}</p>
        <ul class="corp__uses">${corporate.audiences.map((u) => `<li>${t(u)}</li>`).join("")}</ul>
      </div>
    </div>
  </section>

  <section class="section pricing" id="pricing" aria-labelledby="pricing-title">
    <div class="wrap pricing__grid">
      <div>
        <h2 class="h2" id="pricing-title">${t("Pricing that fits the booking")}</h2>
        <p class="lead">${t(p.options)} ${t("Every quote is based on the room, the date and the length of your event")}</p>
      </div>
      <div class="price">
        <p class="price__label">${t("Meeting room rentals starting from")}</p>
        <p class="price__amount">${t(p.fromAmount)}<span>${t(p.unit)}</span></p>
        <p class="price__applies">${t(p.appliesTo)}</p>
        <p class="price__fine">${t(p.fine)}</p>
        <a class="btn" href="#contact" data-cta="pricing">${t("Request Pricing & Availability")}</a>
      </div>
    </div>
  </section>
${
  ticker.length
    ? `
  <a class="ticker" href="#contact" data-cta="ticker" data-event-type="Recurring booking">
    <span class="sr-only">${t(ticker[0])}. ${t("Request availability.")}</span>
    <span class="ticker__track" aria-hidden="true">${[0, 1]
      .map(() => `<span class="ticker__group">${[...ticker, ...ticker].map((x) => `<span class="ticker__item">${t(x)}</span>`).join("")}</span>`)
      .join("")}</span>
  </a>`
    : ""
}

  <section class="section guides" id="plan" aria-labelledby="guides-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="guides-title">${t("Find the right space for your booking")}</h2>
        <p class="lead">${t("Rooms, setups and practical details for the way you plan to use the venue")}</p>
      </div>
      <ul class="guides__list">${landingPages
        .map(
          (lp) => `
        <li><a class="guide" href="${t.path(lp.path)}"><span class="guide__title">${t(lp.h1)} ${arrow}</span><span class="guide__text">${t(lp.lead)}</span></a></li>`
        )
        .join("")}
      </ul>
    </div>
  </section>

  <section class="section location" id="location" aria-labelledby="location-title">
    <div class="wrap location__grid">
      <div class="location__text">
        <h2 class="h2" id="location-title">${esc(a.street)}<br>${esc(a.city)}, ${t(a.region)}</h2>
        <p class="lead">${t(a.area)}</p>
        <p class="location__note">${t("Easy to reach from Nepean, Kanata and across Ottawa, with free on-site parking and a separate event entrance.")}</p>
        <div class="actions">
          <a class="btn" href="${esc(site.maps.directionsUrl)}" target="_blank" rel="noopener" data-track="directions">${t("Get Directions")}</a>
          <a class="btn btn--ghost" href="${esc(site.maps.placeUrl)}" target="_blank" rel="noopener" data-track="directions">${t("View on Google Maps")}</a>
        </div>
      </div>
      <div class="map">
        <iframe src="${esc(site.maps.embedUrl)}&amp;hl=${t.locale}" title="${t.attr("Map showing {address}", { address: `${a.street}, ${a.city}` })}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
    </div>
  </section>
${faqSection(t, faqs)}
${contactSection(ctx, t)}`;
};

// Room page ---------------------------------------------------------------

const roomBody = (ctx, t, r) => {
  const { rooms } = ctx;
  const others = rooms.filter((x) => x !== r);
  const roomFaqs = ctx.faqs.filter((f) => /parking|Wi-Fi|layout|tour|audiovisual/i.test(f.q));
  const gallery = r.gallery || [];
  return `
  <section class="page-hero" aria-labelledby="page-title">
    <div class="wrap page-hero__grid">
      <div class="page-hero__text">
        <p class="eyebrow">${t("Spaces")}</p>
        <h1 class="page-title" id="page-title">${t(r.name)}</h1>
        <p class="lead">${t(r.summary)}</p>
        ${facts([
          [t("Size"), sqft(t, r.sqft)],
          [t("Setups"), r.layouts.map((x) => t(x)).join(", ")],
          [t("Sections"), r.sections ? t("Divides into {n} sections", { n: r.sections.length }) : ""],
          [t("Pricing"), r.pricing ? t(r.pricing) : t("Quoted for your date and timing")],
        ])}
        <div class="actions">
          <a class="btn" href="#contact" data-cta="room-hero"${ctaAttrs({ space: r.formValue })}>${t("Request Availability")}</a>
          <a class="btn btn--ghost" href="#contact" data-cta="room-tour"${ctaAttrs({ space: r.formValue, eventType: "Venue tour" })}>${t("Schedule a Venue Tour")}</a>
        </div>
      </div>
      ${photo(t, r.image, { cls: "room__media page-hero__media", eager: true, sizes: "(min-width: 900px) 55vw, 100vw" })}
    </div>
  </section>

  <section class="section section--tight" aria-labelledby="about-title">
    <div class="wrap split">
      <h2 class="h3" id="about-title">${t("About the room")}</h2>
      <div class="prose">${r.description.map((x) => `<p>${t(x)}</p>`).join("")}</div>
    </div>
    <div class="wrap split">
      <h2 class="h3">${t(r.usesLabel)}</h2>
      <ul class="ticks">${r.uses.map((u) => `<li>${t(u)}</li>`).join("")}</ul>
    </div>
    <div class="wrap split">
      <h2 class="h3">${t("Equipment & amenities")}</h2>
      <ul class="ticks">${[...r.equipment, "Free on-site parking", "Separate event entrance"].map((u) => `<li>${t(u)}</li>`).join("")}</ul>
    </div>
    ${capacityTable(t, r) ? `<div class="wrap split"><h2 class="h3">${t("Capacity")}</h2>${capacityTable(t, r)}</div>` : ""}
  </section>

  <section class="section section--dark" aria-labelledby="layout-title">
    <div class="wrap">
      <h2 class="h3" id="layout-title">${t("Typical setup")}</h2>
      <figure class="scale scale--single">
        <div class="scale__row" style="--r:${r.shape || 1}">${plan(r)}</div>
        <figcaption>${t("{n} sq. ft. Shows a typical setup, not an exact floor plan. We arrange tables and seating to suit your event.", { n: t.num(r.sqft) })}</figcaption>
      </figure>
    </div>
  </section>
${
  gallery.length
    ? `
  <section class="section" aria-labelledby="gallery-title">
    <div class="wrap">
      <h2 class="h2" id="gallery-title">${t("Photos")}</h2>
      <div class="gallery">${gallery.map((g) => photo(t, g, { cls: "gallery__item", sizes: "(min-width: 900px) 33vw, 50vw" })).join("")}</div>
    </div>
  </section>`
    : ""
}

  <section class="section spaces" aria-labelledby="others-title">
    <div class="wrap">
      <h2 class="h2" id="others-title">${t("Other spaces at 1876")}</h2>
      <ul class="cards">${others.map((x) => roomCard(t, x)).join("")}</ul>
    </div>
  </section>
${faqSection(t, roomFaqs, { title: "Questions about booking" })}
${contactSection(ctx, t, { space: r.formValue, title: "Request the {room}", room: r.name })}`;
};

// Landing page ------------------------------------------------------------

const landingBody = (ctx, t, lp) => {
  const { site, rooms, features, landingPages } = ctx;
  const recommended = lp.rooms.map((id) => rooms.find((r) => r.id === id)).filter(Boolean);
  const feats = lp.features.map((k) => features.find((f) => f.icon === k)).filter(Boolean);
  const related = lp.related.map((p) => landingPages.find((x) => x.path === p)).filter(Boolean);
  const a = site.address;
  return `
  <section class="page-hero" aria-labelledby="page-title">
    <div class="wrap page-hero__grid">
      <div class="page-hero__text">
        <h1 class="page-title" id="page-title">${t(lp.h1)}</h1>
        <p class="lead">${t(lp.lead)}</p>
        ${facts([
          [t("Address"), `${esc(a.street)}, ${esc(a.neighbourhood)}, ${esc(a.city)}`],
          [t("Parking"), t("Free on site")],
          [t("Wi-Fi"), t("Complimentary")],
          [t("From"), `${t(site.pricing.fromAmount)}${t(site.pricing.unit)} <span class="facts__sub">${t(site.pricing.appliesTo)}</span>`],
        ])}
        <div class="actions">
          <a class="btn" href="#contact" data-cta="landing-hero"${ctaAttrs(lp.cta)}>${t(lp.cta.label)}</a>
          <a class="btn btn--ghost" href="#contact" data-cta="landing-tour"${ctaAttrs({ eventType: "Venue tour" })}>${t("Schedule a Venue Tour")}</a>
        </div>
      </div>
      ${photo(t, lp.image, { cls: "room__media page-hero__media", eager: true, sizes: "(min-width: 900px) 55vw, 100vw" })}
    </div>
  </section>

  <section class="section section--tight">
    ${lp.sections
      .map(
        (s) => `
    <div class="wrap split">
      <h2 class="h3">${t(s.h2)}</h2>
      <div class="prose">
        ${s.body.map((x) => `<p>${t(x)}</p>`).join("")}
        ${s.list ? `<ul class="ticks">${s.list.map((x) => `<li>${t(x)}</li>`).join("")}</ul>` : ""}
        ${s.steps ? `<ol class="steps">${s.steps.map((x) => `<li>${t(x)}</li>`).join("")}</ol>` : ""}
      </div>
    </div>`
      )
      .join("")}
  </section>

  <section class="section spaces" aria-labelledby="rooms-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="rooms-title">${t("Recommended rooms")}</h2>
        <p class="lead">${t("Each room is set up for your format before you arrive")}</p>
      </div>
      <ul class="cards">${recommended.map((r) => roomCard(t, r)).join("")}</ul>
    </div>
  </section>

  <section class="section why" aria-labelledby="amenities-title">
    <div class="wrap">
      <h2 class="h2" id="amenities-title">${t("Included and available")}</h2>
      ${featureList(t, feats)}
    </div>
  </section>
${faqSection(t, lp.faqs)}

  <section class="section section--tight related" aria-labelledby="related-title">
    <div class="wrap">
      <h2 class="h3" id="related-title">${t("Also useful")}</h2>
      <ul class="guides__list guides__list--compact">${related
        .map((x) => `<li><a class="guide" href="${t.path(x.path)}"><span class="guide__title">${t(x.h1)} ${arrow}</span></a></li>`)
        .join("")}
        <li><a class="guide" href="${t.path("/")}"><span class="guide__title">${t("All spaces at 1876")} ${arrow}</span></a></li>
      </ul>
    </div>
  </section>
${contactSection(ctx, t, { space: lp.cta.space, eventType: lp.cta.eventType })}`;
};

// Simple pages ------------------------------------------------------------

const messageBody = (title, text, links) => `
  <section class="section notice" aria-labelledby="page-title">
    <div class="wrap notice__inner">
      <p class="notice__num" aria-hidden="true">1876</p>
      <h1 class="page-title" id="page-title">${title}</h1>
      <p class="lead">${text}</p>
      <div class="actions">${links}</div>
    </div>
  </section>`;

// Site --------------------------------------------------------------------

export function renderSite(content, photos = {}, dictionaries = {}) {
  PHOTOS = photos;
  const ctx = content;
  const pages = [];
  const translators = Object.fromEntries(LOCALES.map((l) => [l, createTranslator(l, dictionaries)]));

  // Each page is described once with English keys, then rendered per language.
  const defs = [];
  const home = { name: "Home", path: "/" };
  defs.push({
    key: "/",
    title: (t) => t.plain(ctx.site.seo.title),
    description: (t) => t.plain(ctx.site.seo.description),
    faqs: ctx.faqs,
    body: (t) => homeBody(ctx, t),
  });
  for (const r of ctx.rooms) {
    defs.push({
      key: roomPath(r),
      title: (t) => t.plain(r.seoTitle),
      description: (t) => t.plain(r.seoDescription),
      ogFile: r.image.file,
      room: r.id,
      about: `${ctx.site.domain}${roomPath(r)}#room`,
      cta: { space: r.formValue },
      crumbs: [home, { name: r.name, path: roomPath(r) }],
      body: (t) => roomBody(ctx, t, r),
    });
  }
  for (const lp of ctx.landingPages) {
    defs.push({
      key: lp.path,
      title: (t) => t.plain(lp.title),
      description: (t) => t.plain(lp.description),
      ogFile: lp.image.file,
      faqs: lp.faqs,
      cta: lp.cta,
      crumbs: [home, { name: lp.h1, path: lp.path }],
      body: (t) => landingBody(ctx, t, lp),
    });
  }
  defs.push({
    key: "/inquiry-received/",
    title: (t) => t.plain("Inquiry received | 1876"),
    description: (t) => t.plain("Thank you for your inquiry."),
    indexable: false,
    noForm: true,
    body: (t) =>
      messageBody(
        t("Thank you for your inquiry"),
        t("We’ve received your request and will be in touch shortly."),
        `<a class="btn" href="${t.path("/")}">${t("Back to the homepage")}</a>`
      ),
  });

  for (const def of defs) {
    const alternates = Object.fromEntries(LOCALES.map((l) => [l, translators[l].path(def.key)]));
    for (const l of LOCALES) {
      const t = translators[l];
      const page = { ...def, path: alternates[l], alternates, title: def.title(t), description: def.description(t) };
      page.body = def.body(t);
      pages.push({ path: page.path, locale: l, indexable: def.indexable !== false, html: layout(ctx, t, page) });
    }
  }

  // One 404 page for the whole site, in English with a link to French.
  const t = translators.en;
  pages.push({
    path: "/404.html",
    locale: "en",
    indexable: false,
    html: layout(ctx, t, {
      path: "/404.html",
      title: "Page not found | 1876",
      description: "The page you were looking for doesn't exist.",
      indexable: false,
      noForm: true,
      body: messageBody(
        "Page not found",
        "The page you were looking for has moved or doesn&rsquo;t exist. <span lang=\"fr-CA\">La page demandée n&rsquo;existe pas ou a été déplacée.</span>",
        '<a class="btn" href="/">Go to the homepage</a><a class="btn btn--ghost" href="/#spaces">See our spaces</a><a class="btn btn--ghost" href="/fr/" lang="fr-CA">Version française</a>'
      ),
    }),
  });

  return { pages, missing: Object.fromEntries(LOCALES.map((l) => [l, [...translators[l].missing]])) };
}

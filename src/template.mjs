// Renders the homepage from src/content.mjs. Layout and markup live here;
// words, numbers and image paths live in content.mjs.

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const fmt = (n) => n.toLocaleString("en-CA");

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
  `<svg class="icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// Floor-area diagram for one room, drawn in feet so every room shares a scale.
// Furniture is illustrative: a typical setup for the room, not a floor plan.
const plan = (r) => {
  const ratio = r.shape || 1;
  const W = Math.sqrt(r.sqft * ratio);
  const H = Math.sqrt(r.sqft / ratio);
  const n = (v) => +v.toFixed(2);
  const rect = (cls, x, y, w, h, rx = 0) =>
    `<rect class="${cls}" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${rx ? ` rx="${n(rx)}"` : ""}/>`;
  const chair = (x, y, s = 1.7) => rect("p-chair", x - s / 2, y - s / 2, s, s, s / 4);
  const hanger = (cx, cy) =>
    `<path class="p-hanger" d="M${n(cx - 0.95)} ${n(cy + 0.5)}L${n(cx)} ${n(cy - 0.2)}L${n(cx + 0.95)} ${n(cy + 0.5)}ZM${n(cx)} ${n(cy - 0.2)}v-0.3a0.25 0.25 0 1 1 0.25 -0.25"/>`;

  // A door drawn on a wall: an opening, the open leaf and its swing.
  // side: "top" | "bottom" | "left" | "right"; at: where the opening starts along the wall.
  // inset: how far the door's wall stands out from the room edge (e.g. a protruding section).
  const door = (side, at, w, { double = false, hinge = "start", inset = 0 } = {}) => {
    const leaf = (lw) =>
      rect("p-leaf", -0.12, 0, 0.24, lw) + `<path class="p-swing" d="M0 ${n(lw)}A${n(lw)} ${n(lw)} 0 0 0 ${n(lw)} 0"/>`;
    const mirror = (lw, inner) => `<g transform="translate(${n(lw)} 0) scale(-1 1)">${inner}</g>`;
    let d = rect("p-gap", 0, -0.45, w, 0.9) + `<path class="p-jamb" d="M0 -0.45v0.9M${n(w)} -0.45v0.9"/>`;
    if (double) d += leaf(w / 2) + `<g transform="translate(${n(w / 2)} 0)">${mirror(w / 2, leaf(w / 2))}</g>`;
    else d += hinge === "end" ? mirror(w, leaf(w)) : leaf(w);
    const t = {
      top: `translate(${n(at)} 0)`,
      bottom: `translate(${n(at)} ${n(H)}) scale(1 -1)`,
      left: `matrix(0 1 1 0 0 ${n(at)})`,
      right: `matrix(0 1 -1 0 ${n(W)} ${n(at)})`,
    }[side];
    return `<g transform="${t}${inset ? ` translate(0 ${n(inset)})` : ""}">${d}</g>`;
  };
  let g = "";

  if (r.layout === "boardroom") {
    // Long racetrack table, four chairs a side, one at the head; TV and window on the end wall.
    const tw = W * 0.62, th = H * 0.36, tx = (W - tw) / 2, ty = (H - th) / 2;
    g += rect("p-window", W - 0.5, H * 0.12, 0.5, H * 0.76);
    g += rect("p-tv", W - 1.9, H / 2 - 2.4, 0.55, 4.8);
    g += rect("p-table", tx, ty, tw, th, th / 2);
    for (let i = 0; i < 4; i++) {
      const x = tx + th / 2 + ((tw - th) * (i + 0.5)) / 4;
      g += chair(x, ty - 1.3) + chair(x, ty + th + 1.3);
    }
    g += chair(tx + tw + 1.3, H / 2) + chair(tx - 1.3, H / 2);
    // Left wall: credenza above the door (middle of the wall), wardrobe bottom-left.
    const dy = H / 2 - 1.5;
    g += rect("p-table", 0, 0.5, 1.4, dy - 1);
    g += door("left", dy, 3);
    g += rect("p-table", 0, H - 2.6, 3.2, 2.6) + hanger(1.6, H - 1.3);
  } else if (r.layout === "theatre") {
    // Front (top): windows with a door directly behind the podium; a chair and screen to
    // its left, a draped table to its right. In the front-left corner the wall steps out,
    // and the exit door sits in that protruding section, facing the room.
    const px = W / 2 - 2.3;
    g += rect("p-window", 6.5, 0, px - 8.5, 0.5) + rect("p-window", px + 2, 0, 24.5 - px - 2, 0.5);
    g += door("top", px - 1.5, 3);
    g += rect("p-table", px - 1.6, 3.8, 3.2, 2, 0.4);
    g += chair(px - 2.6, 4.8, 1.5);
    g += rect("p-tv", 5, 2.4, 4.4, 0.5);
    g += rect("p-table", px + 3.2, 3.6, 7, 2, 0.2);
    g += rect("p-block", 0, 0, 4.6, 2);
    g += door("top", 0.8, 3, { inset: 2 });
    // Theatre rows in two blocks with a centre aisle, facing the podium.
    const sp = 2.15, rows = 5, y0 = 9.4, left = 5, right = 5, aisle = 3.6;
    const x0 = (W - (left + right) * sp - aisle) / 2 + sp / 2;
    for (let row = 0; row < rows; row++) {
      const y = y0 + row * 3.2;
      for (let i = 0; i < left; i++) g += chair(x0 + i * sp, y, 1.5);
      for (let i = 0; i < right; i++) g += chair(x0 + left * sp + aisle + i * sp, y, 1.5);
    }
    // Draped tables in an L along the left wall and into the back-left corner.
    g += rect("p-table", 0.3, 14, 1.9, H - 14.3, 0.2) + rect("p-table", 2.2, H - 2.2, 7, 1.9, 0.2);
    // Back (bottom): stacked chairs, exit double doors, wardrobe in the corner (as in Champlain).
    g += chair(16.5, H - 1.9, 1.5) + chair(16.8, H - 1.6, 1.5) + chair(17.1, H - 1.3, 1.5);
    g += door("bottom", W - 12, 5, { double: true });
    g += rect("p-table", W - 5, H - 3, 5, 3) + hanger(W - 2.5, H - 1.5);
  } else if (r.layout === "ballroom") {
    // Windows along the whole top wall; exit doors on the side walls by the windows;
    // from the corridor (bottom), a single door into A and C and double doors into B.
    // Movable partitions split the room into equal sections.
    const names = r.sections || ["A"], s = names.length, sw = W / s;
    for (let k = 0; k < s; k++) g += rect("p-window", sw * k + 1, 0, sw - 2, 0.5);
    g += door("left", 1, 3) + door("right", 1, 3);
    for (let k = 1; k < s; k++) g += `<line class="p-wall" x1="${n(sw * k)}" y1="0" x2="${n(sw * k)}" y2="${n(H)}"/>`;

    // Round table for ten.
    const round = (cx, cy) => {
      let t = `<circle class="p-table" cx="${n(cx)}" cy="${n(cy)}" r="2.5"/>`;
      for (let c = 0; c < 10; c++) {
        const a = (c / 10) * Math.PI * 2;
        t += `<circle class="p-chair" cx="${n(cx + Math.cos(a) * 3.45)}" cy="${n(cy + Math.sin(a) * 3.45)}" r="0.62"/>`;
      }
      return t;
    };
    // Banquet row: three 6 ft tables with gaps between them, three chairs a side at each.
    const row = (cx, cy) => {
      let t = "";
      const gap = 1.5, x = cx - (18 + 2 * gap) / 2;
      for (let i = 0; i < 3; i++) {
        const tx = x + i * (6 + gap);
        t += rect("p-table", tx, cy - 1.25, 6, 2.5);
        for (let c = 0; c < 3; c++) t += chair(tx + 1 + c * 2, cy - 2.4, 1.4) + chair(tx + 1 + c * 2, cy + 2.4, 1.4);
      }
      return t;
    };

    names.forEach((name, k) => {
      const x0 = sw * k, mid = x0 + sw / 2;
      g += `<text class="p-label" x="${n(mid)}" y="2.9">${esc(name)}</text>`;
      if (k === Math.floor(s / 2)) {
        // Middle section: three banquet rows of 18 on rectangular tables.
        g += door("bottom", mid - 3, 6, { double: true });
        for (let i = 0; i < 3; i++) g += row(mid, 8 + i * 10.5);
        return;
      }
      g += door("bottom", mid - 1.5, 3, { hinge: k < s / 2 ? "start" : "end" });
      if (k === 0) {
        // First section: six rounds of ten, aisle down the middle to the door.
        for (const fx of [0.25, 0.75]) for (let i = 0; i < 3; i++) g += round(x0 + sw * fx, 7 + i * 11.5);
      } else {
        // Last section: a mix of rounds of ten and 8 ft rectangular tables of ten,
        // in a checkerboard on the same grid as the first section.
        const long = (cx, cy) => {
          let t = rect("p-table", cx - 4, cy - 1.25, 8, 2.5);
          for (let i = 0; i < 4; i++) t += chair(cx - 3 + i * 2, cy - 2.4, 1.4) + chair(cx - 3 + i * 2, cy + 2.4, 1.4);
          return t + chair(cx - 5.1, cy, 1.4) + chair(cx + 5.1, cy, 1.4);
        };
        [0.25, 0.75].forEach((fx, c) => {
          [7, 18.5, 30].forEach((y, i) => (g += (i + c) % 2 ? long(x0 + sw * fx, y) : round(x0 + sw * fx, y)));
        });
      }
    });
  }
  return `<svg class="scale__box" viewBox="0 0 ${n(W)} ${n(H)}" aria-hidden="true" focusable="false">${g}</svg>`;
};

// A photo slot. Shows a labelled placeholder until the image file exists.
// When scripts/optimize_images.py has made sized WebP/JPEG copies, serve those
// (the browser picks a size from `sizes`); otherwise fall back to the plain file.
let VARIANTS = {};
const photo = ({ src, alt, pos }, { cls = "", eager = false, sizes = "100vw" } = {}) => {
  const widths = VARIANTS[src];
  const base = src.replace(/\.jpg$/, "");
  const set = (ext) => widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  const attrs = `alt="${esc(alt)}"${pos ? ` style="object-position:${esc(pos)}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.hidden=true"`;
  const img = widths
    ? `<picture><source type="image/webp" srcset="${set("webp")}" sizes="${sizes}"><img src="${base}-${widths.at(-1)}.jpg" srcset="${set("jpg")}" sizes="${sizes}" ${attrs}></picture>`
    : `<img src="${esc(src)}" ${attrs}>`;
  return `
  <figure class="ph ${cls}" data-label="${esc(alt)}&#10;${esc(src)}">
    ${img}
  </figure>`;
};

export function render({ site, images, rooms, features, corporateUses, eventTypes, nav, ticker = [], variants = {} }) {
  VARIANTS = variants;
  const a = site.address;
  const year = new Date().getFullYear();
  const social = Object.entries(site.social).filter(([, url]) => url);
  const socialNames = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn" };
  // Floor-plan boxes keep each room's area; `shape` is width ÷ depth.
  const maxWidth = Math.max(...rooms.map((r) => Math.sqrt(r.sqft * (r.shape || 1))));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EventVenue"],
    name: site.name,
    url: site.domain + "/",
    logo: site.domain + "/images/logo-512.png",
    email: site.email,
    image: site.domain + site.seo.ogImage,
    description: site.seo.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.regionCode,
      addressCountry: a.country,
      ...(a.postalCode && { postalCode: a.postalCode }),
    },
    ...(site.phone && { telephone: site.phone }),
    ...(social.length && { sameAs: social.map(([, url]) => url) }),
    hasMap: site.maps.directionsUrl,
  };

  const navLinks = nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join("");

  return `<!doctype html>
<html lang="en-CA" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(site.seo.title)}</title>
<meta name="description" content="${esc(site.seo.description)}">
<link rel="canonical" href="${site.domain}/">
<meta name="theme-color" content="#FAF9F6">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/images/logo-512.png">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(site.seo.title)}">
<meta property="og:description" content="${esc(site.seo.description)}">
<meta property="og:url" content="${site.domain}/">
<meta property="og:image" content="${site.domain}${site.seo.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_CA">
<meta name="twitter:card" content="summary_large_image">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Newsreader:opsz,wght@6..72,300..500&display=swap">
<link rel="stylesheet" href="/styles.css">
<script>document.documentElement.classList.replace("no-js","js")</script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap header__inner">
    <a class="brand" href="#top" aria-label="${esc(site.name)}, back to top"><img src="/images/logo.png" alt="" width="52" height="52"></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu"><span></span><span></span></button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <ul class="nav__list">${navLinks}</ul>
      <a class="btn btn--sm" href="#contact">Request Availability</a>
    </nav>
  </div>
</header>

<main id="main">

  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="wrap">
      <div class="marque">
        <p class="marque__num" aria-hidden="true">1876</p>
        <div class="marque__meta">
          <p class="marque__name">${esc(site.tagline)}</p>
          <p class="marque__addr">${esc(a.street)}, ${esc(a.city)}</p>
        </div>
      </div>
      <div class="hero__grid">
        <div class="hero__text">
          <h1 id="hero-title">A refined space for meetings, events &amp; celebrations</h1>
          <p class="lead">Flexible event and meeting spaces in Ottawa West for corporate meetings, training sessions, conferences and private events.</p>
          <div class="actions">
            <a class="btn" href="#contact">Request Availability</a>
            <a class="btn btn--ghost" href="#spaces">Explore Our Spaces</a>
          </div>
        </div>
        <div class="collage">
          ${images.hero.map((img, i) => photo(img, {
            cls: `collage__item${i === 0 ? " collage__main" : i === 1 ? " collage__tall" : ""}`,
            eager: i < 2,
            sizes: ["(min-width: 900px) 38vw, 66vw", "(min-width: 900px) 19vw, 33vw"][i] || "(min-width: 900px) 29vw, 50vw",
          })).join("")}
        </div>
      </div>
    </div>
  </section>

  <section class="section spaces" id="spaces" aria-labelledby="spaces-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="spaces-title">Designed for the way you gather</h2>
        <p class="lead">Three rooms for 10 to 250 guests, from a private interview to a full conference, so the space fits the group rather than the other way around. Tell us about your event and we&rsquo;ll recommend the right layout.</p>
      </div>

      <figure class="scale reveal">
        <div class="scale__row">
          ${rooms
            .map((r) => {
              const ratio = r.shape || 1;
              const width = ((Math.sqrt(r.sqft * ratio) / maxWidth) * 1000).toFixed(0);
              return `<a class="scale__room" href="#${r.id}" style="--g:${width};--r:${ratio}">
            ${plan(r)}
            <span class="scale__label"><strong>${esc(r.shortName)}</strong> ${fmt(r.sqft)} sq.&nbsp;ft. &middot; up to ${r.capacity}</span>
          </a>`;
            })
            .join("")}
        </div>
        <figcaption>Floor areas drawn to the same scale. Layouts show a typical setup, not exact floor plans.</figcaption>
      </figure>

      <div class="rooms">
        ${rooms
          .map(
            (r) => `
        <article class="room reveal" id="${r.id}" aria-labelledby="${r.id}-title">
          ${photo(r.image, { cls: "room__media", sizes: "(min-width: 900px) 56vw, 100vw" })}
          <div class="room__body">
            <h3 class="room__name" id="${r.id}-title">${esc(r.name)}</h3>
            <p class="room__area"><span><span class="room__num">${fmt(r.sqft)}</span> sq.&nbsp;ft.</span><span class="room__cap">up to <span class="room__num">${r.capacity}</span> guests</span></p>
            <p class="room__summary">${esc(r.summary)}</p>
            <p class="room__label">${esc(r.usesLabel)}</p>
            <ul class="room__uses">${r.uses.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>
            ${r.note ? `<p class="room__note">${esc(r.note)}</p>` : ""}
            <a class="btn btn--ghost" href="#contact" data-space="${esc(r.formValue)}">Inquire About ${esc(r.shortName)}</a>
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
        <h2 class="h2" id="why-title">Why 1876</h2>
        <p class="lead">The practical details that make the day easier for organizers and guests.</p>
      </div>
      <ul class="features">
        ${features
          .map(
            (f) => `<li class="feature">
          ${icon(f.icon)}
          <h3>${esc(f.title)}</h3>
          <p>${esc(f.text)}</p>
        </li>`
          )
          .join("")}
      </ul>
    </div>
  </section>

  <section class="section corp" id="corporate" aria-labelledby="corp-title">
    <div class="wrap corp__grid">
      <div class="corp__text">
        <h2 class="h2" id="corp-title">Space for your team, on your schedule</h2>
        <p class="corp__lead">Book a room for a single session or set up a regular schedule. 1876 gives teams a dependable place outside the office for training, planning and recurring meetings.</p>
        <p class="corp__offer">Preferred arrangements may be available for recurring and multi-day bookings.</p>
        <a class="btn btn--gold" href="#contact" data-event-type="Recurring booking">Discuss a Recurring Booking</a>
      </div>
      <ul class="corp__uses" aria-label="Common corporate bookings">
        ${corporateUses.map((u) => `<li>${esc(u)}</li>`).join("")}
      </ul>
    </div>
  </section>

  <section class="section pricing" id="pricing" aria-labelledby="pricing-title">
    <div class="wrap pricing__grid">
      <div>
        <h2 class="h2" id="pricing-title">Pricing that fits the booking</h2>
        <p class="lead">${esc(site.pricing.options)} Every quote is based on the room, the date and the length of your event.</p>
      </div>
      <div class="price">
        <p class="price__label">${esc(site.pricing.appliesTo)}</p>
        <p class="price__amount">${esc(site.pricing.fromAmount)}<span>${esc(site.pricing.unit)}</span></p>
        <a class="btn" href="#contact">Request Pricing &amp; Availability</a>
      </div>
    </div>
  </section>

${
    ticker.length
      ? `<a class="ticker" href="#contact" data-event-type="Recurring booking">
    <span class="sr-only">${esc(ticker[0])}. Request availability.</span>
    <span class="ticker__track" aria-hidden="true">${[0, 1]
      .map(() => `<span class="ticker__group">${[...ticker, ...ticker].map((t) => `<span class="ticker__item">${esc(t)}</span>`).join("")}</span>`)
      .join("")}</span>
  </a>`
      : ""
  }

  <section class="section location" id="location" aria-labelledby="location-title">
    <div class="wrap location__grid">
      <div class="location__text">
        <h2 class="h2" id="location-title">${esc(a.street)}<br>${esc(a.city)}, ${esc(a.region)}</h2>
        <p class="lead">${esc(a.area)}</p>
        <div class="actions">
          <a class="btn" href="${esc(site.maps.directionsUrl)}" target="_blank" rel="noopener">Get Directions</a>
        </div>
      </div>
      <div class="map">
        <iframe src="${esc(site.maps.embedUrl)}" title="Map showing ${esc(a.street)}, ${esc(a.city)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
    </div>
  </section>

  <section class="section contact" id="contact" aria-labelledby="contact-title">
    <div class="wrap contact__grid">
      <div class="contact__text">
        <h2 class="h2" id="contact-title">Tell us about your event</h2>
        <p class="lead">Share a few details and we&rsquo;ll reply with availability and a quote for your date.</p>
        <p class="contact__hint">Not sure which room fits? Choose &ldquo;Not sure&rdquo; and we&rsquo;ll recommend one based on your group and format.</p>
        <p class="contact__direct">Prefer email?<br><a class="text-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
        ${site.phone ? `<p class="contact__direct">Call us<br><a class="text-link" href="tel:${esc(site.phone.replace(/\s/g, ""))}">${esc(site.phone)}</a></p>` : ""}
      </div>

      <div class="contact__panel">
        <form class="form" id="inquiry-form" action="${esc(site.formEndpoint)}" method="post" novalidate
              data-endpoint="${esc(site.formEndpoint)}" data-email="${esc(site.email)}">
          <input type="hidden" name="_subject" value="New event inquiry from 1876events.ca">
          <div class="hp" aria-hidden="true"><label>Leave this field empty <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>

          <div class="field">
            <label for="f-name">Name <span class="req" aria-hidden="true">*</span></label>
            <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-err">
            <p class="field__err" id="f-name-err"></p>
          </div>
          <div class="field">
            <label for="f-company">Company / Organization</label>
            <input id="f-company" name="company" type="text" autocomplete="organization">
          </div>
          <div class="field">
            <label for="f-email">Email <span class="req" aria-hidden="true">*</span></label>
            <input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="f-email-err">
            <p class="field__err" id="f-email-err"></p>
          </div>
          <div class="field">
            <label for="f-phone">Phone</label>
            <input id="f-phone" name="phone" type="tel" autocomplete="tel">
          </div>
          <div class="field">
            <label for="f-date">Event date</label>
            <input id="f-date" name="eventDate" type="date">
          </div>
          <div class="field">
            <label for="f-guests">Approximate number of guests</label>
            <input id="f-guests" name="guests" type="number" min="1" inputmode="numeric">
          </div>
          <div class="field">
            <label for="f-space">Preferred space</label>
            <select id="f-space" name="space">
              <option value="Not sure">Not sure</option>
              ${rooms.map((r) => `<option value="${esc(r.formValue)}">${esc(r.formValue)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="f-type">Event type</label>
            <select id="f-type" name="eventType">
              <option value="">Select a type</option>
              ${eventTypes.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join("")}
            </select>
          </div>
          <div class="field field--full">
            <label for="f-message">Message</label>
            <textarea id="f-message" name="message" rows="5" placeholder="Timing, room setup, AV needs, or anything else we should know"></textarea>
          </div>

          <div class="form__foot">
            <button class="btn" type="submit">Request Availability</button>
            <p class="form__note"><span aria-hidden="true">*</span> Required</p>
          </div>
          <p class="form__status" role="status" aria-live="polite"></p>
        </form>

        <div class="form-done" id="form-success" tabindex="-1" hidden>
          <p class="form-done__title">Thank you. We&rsquo;ve received your inquiry and will be in touch shortly.</p>
          <p>Need to add something? Email <a class="text-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
        </div>
        <div class="form-done" id="form-mail" tabindex="-1" hidden>
          <p class="form-done__title">Your email app should now open with your inquiry ready to send.</p>
          <p>If it didn&rsquo;t open, email us at <a class="text-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
        </div>
      </div>
    </div>
  </section>

</main>

<footer class="site-footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <p class="footer__num">1876</p>
      <p>${esc(site.tagline)}</p>
    </div>
    <address class="footer__col">
      ${esc(a.street)}<br>${esc(a.city)}, ${esc(a.region)}<br>
      <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
      ${site.phone ? `<br><a href="tel:${esc(site.phone.replace(/\s/g, ""))}">${esc(site.phone)}</a>` : ""}
    </address>
    <nav class="footer__col" aria-label="Footer">
      <ul>${navLinks}</ul>
    </nav>
    ${
      social.length
        ? `<ul class="footer__col">${social.map(([k, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener">${socialNames[k] || esc(k)}</a></li>`).join("")}</ul>`
        : ""
    }
  </div>
  <div class="wrap footer__base">
    <p>&copy; ${year} ${esc(site.name)}</p>
  </div>
</footer>

<a class="to-top" href="#top" aria-label="Back to top" tabindex="-1"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg></a>

<div class="mcta" inert>
  <a class="btn" href="#contact">Request Availability</a>
</div>

<script src="/main.js" defer></script>
</body>
</html>
`;
}

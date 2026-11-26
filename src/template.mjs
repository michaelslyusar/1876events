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

// A photo slot. Shows a labelled placeholder until the image file exists.
const photo = ({ src, alt }, { cls = "", eager = false } = {}) => `
  <figure class="ph ${cls}" data-label="${esc(alt)}&#10;${esc(src)}">
    <img src="${esc(src)}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.hidden=true">
  </figure>`;

export function render({ site, images, rooms, features, corporateUses, gallery, eventTypes, nav }) {
  const a = site.address;
  const year = new Date().getFullYear();
  const social = Object.entries(site.social).filter(([, url]) => url);
  const socialNames = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn" };
  const maxSide = Math.sqrt(Math.max(...rooms.map((r) => r.sqft)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EventVenue"],
    name: site.name,
    url: site.domain + "/",
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
    <a class="brand" href="#top" aria-label="${esc(site.name)}, back to top">${esc(site.shortName)}</a>
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
          <ul class="facts">
            <li>${esc(a.area)}</li>
            <li>Free on-site parking</li>
            <li>Flexible room configurations</li>
          </ul>
          <div class="actions">
            <a class="btn" href="#contact">Request Availability</a>
            <a class="btn btn--ghost" href="#spaces">Explore Our Spaces</a>
          </div>
        </div>
        ${photo(images.hero, { cls: "hero__media", eager: true, sizes: "(min-width: 900px) 58vw, 100vw" })}
      </div>
    </div>
  </section>

  <section class="section intro" id="about" aria-labelledby="about-title">
    <div class="wrap intro__grid">
      <h2 class="h2 reveal" id="about-title">Designed for the way you gather.</h2>
      <div class="intro__body reveal">
        <p>1876 Banquets &amp; Conference Center offers flexible spaces for professional meetings, training sessions, conferences and private events in Ottawa West.</p>
        <p>Three rooms cover everything from a private interview to a full conference, so the space fits the group rather than the other way around. Guests park for free on site and arrive through a separate event entrance.</p>
        <a class="text-link" href="#spaces">Explore our spaces</a>
      </div>
    </div>
  </section>

  <section class="section spaces" id="spaces" aria-labelledby="spaces-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="spaces-title">Our spaces</h2>
        <p class="lead">Three rooms for groups of different sizes. Capacity depends on how a room is set up, so tell us about your event and we&rsquo;ll recommend the right layout.</p>
      </div>

      <figure class="scale reveal">
        <div class="scale__row">
          ${rooms
            .map((r) => {
              const side = ((Math.sqrt(r.sqft) / maxSide) * 1000).toFixed(0);
              return `<a class="scale__room" href="#${r.id}" style="--g:${side}">
            <span class="scale__box${r.sections ? " scale__box--split" : ""}" aria-hidden="true"></span>
            <span class="scale__label"><strong>${esc(r.shortName)}</strong> ${fmt(r.sqft)} sq.&nbsp;ft.</span>
          </a>`;
            })
            .join("")}
        </div>
        <figcaption>Floor areas drawn to the same scale. Shapes are illustrative, not floor plans.</figcaption>
      </figure>

      <div class="rooms">
        ${rooms
          .map(
            (r) => `
        <article class="room reveal" id="${r.id}" aria-labelledby="${r.id}-title">
          ${photo(r.image, { cls: "room__media", sizes: "(min-width: 900px) 58vw, 100vw" })}
          <div class="room__body">
            <h3 class="room__name" id="${r.id}-title">${esc(r.name)}</h3>
            <p class="room__area"><span class="room__num">${fmt(r.sqft)}</span> sq.&nbsp;ft., approximately</p>
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
        <li class="feature feature--cta">
          <h3>Planning something specific?</h3>
          <p>Send us the date and group size, and we&rsquo;ll put together a quote.</p>
          <a class="btn btn--sm" href="#contact">Request a Quote</a>
        </li>
      </ul>
    </div>
  </section>

  <section class="section corp" id="corporate" aria-labelledby="corp-title">
    <div class="wrap corp__grid">
      <div class="corp__text">
        <h2 class="h2" id="corp-title">A flexible space for your team</h2>
        <p class="corp__lead">Book a room for a single session or set up a regular schedule. 1876 gives teams a dependable place outside the office for training, planning and recurring meetings.</p>
        <p class="corp__offer">Preferred arrangements may be available for recurring and multi-day bookings.</p>
        <a class="btn btn--gold" href="#contact" data-event-type="Recurring booking">Discuss a Recurring Booking</a>
      </div>
      <ul class="corp__uses" aria-label="Common corporate bookings">
        ${corporateUses.map((u) => `<li>${esc(u)}</li>`).join("")}
      </ul>
    </div>
  </section>

  <section class="section gallery" id="gallery" aria-labelledby="gallery-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="gallery-title">Gallery</h2>
        <p class="lead">The rooms, the entrance and the details, as your guests will see them.</p>
      </div>
      <div class="gallery__grid">
        ${gallery.map((g) => photo(g, { cls: `g${g.size ? " g--" + g.size : ""}`, sizes: "(min-width: 900px) 33vw, 50vw" })).join("")}
      </div>
    </div>
  </section>

  <section class="section pricing" id="pricing" aria-labelledby="pricing-title">
    <div class="wrap pricing__grid">
      <div>
        <h2 class="h2" id="pricing-title">Flexible options for events of different sizes.</h2>
        <p class="lead">${esc(site.pricing.options)} Every quote is based on the room, the date and the length of your event.</p>
      </div>
      <div class="price">
        <p class="price__label">${esc(site.pricing.appliesTo)}</p>
        <p class="price__amount">${esc(site.pricing.fromAmount)}<span>${esc(site.pricing.unit)}</span></p>
        <a class="btn" href="#contact">Request Pricing &amp; Availability</a>
      </div>
    </div>
  </section>

  <section class="section location" id="location" aria-labelledby="location-title">
    <div class="wrap location__grid">
      <div class="location__text">
        <h2 class="h2" id="location-title">${esc(a.street)}<br>${esc(a.city)}, ${esc(a.region)}</h2>
        <ul class="location__points">
          <li>${icon("pin")}<span>${esc(a.area)}, on Robertson Road</span></li>
          <li>${icon("parking")}<span>Free on-site parking</span></li>
          <li>${icon("door")}<span>Separate event entrance</span></li>
        </ul>
        <div class="actions">
          <a class="btn" href="${esc(site.maps.directionsUrl)}" target="_blank" rel="noopener">Get Directions</a>
          <a class="btn btn--ghost" href="#contact">Contact Us</a>
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

<div class="mcta" inert>
  <a class="btn" href="#contact">Request Availability</a>
</div>

<script src="/main.js" defer></script>
</body>
</html>
`;
}

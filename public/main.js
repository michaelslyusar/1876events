(() => {
  const d = document;

  /* Analytics: sends an event only when GA4 / Google Ads is configured
     (src/content.mjs > site.analytics). Never sends what visitors type. */
  const track = (name, params = {}) => {
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  };

  /* UTM parameters from the landing URL, kept for the visit so the inquiry
     records where it came from (Google Business Profile, directories, campaigns). */
  const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  let utm = {};
  try {
    const q = new URLSearchParams(location.search);
    const fresh = Object.fromEntries(UTM.filter((k) => q.get(k)).map((k) => [k, q.get(k).slice(0, 100)]));
    if (Object.keys(fresh).length) sessionStorage.setItem("utm", JSON.stringify(fresh));
    utm = JSON.parse(sessionStorage.getItem("utm") || "{}");
  } catch {}

  /* Header border once the page scrolls; back-to-top button */
  const header = d.querySelector(".site-header");
  const toTop = d.querySelector(".to-top");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    const up = window.scrollY > window.innerHeight * 0.8;
    toTop.classList.toggle("is-visible", up);
    toTop.tabIndex = up ? 0 : -1;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
  const toggle = d.querySelector(".menu-toggle");
  const nav = d.getElementById("site-nav");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  d.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* Clicks: preselect the form from a CTA, and record the click */
  const form = d.getElementById("inquiry-form");
  d.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.startsWith("mailto:")) track("email_click", { link_location: link.closest("footer") ? "footer" : "page" });
    if (link.dataset.track === "directions") track("directions_click");
    if (link.dataset.eventType === "Recurring booking") track("recurring_booking_click", { cta_location: link.dataset.cta || "" });
    if (href.endsWith("#contact")) track("request_quote_click", { cta_location: link.dataset.cta || "", room: link.dataset.space || "" });
    if (form && (link.dataset.space || link.dataset.eventType)) {
      if (link.dataset.space) form.elements.space.value = link.dataset.space;
      if (link.dataset.eventType) form.elements.eventType.value = link.dataset.eventType;
    }
  });
  if (d.body.dataset.room) track("room_view", { room: d.body.dataset.room });

  const hasIO = "IntersectionObserver" in window;

  /* Gentle reveal, once per element */
  const reveals = d.querySelectorAll(".reveal");
  if (hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Mobile sticky CTA: hidden over the first screen, the form and the footer */
  const mcta = d.querySelector(".mcta");
  if (mcta && hasIO) {
    const blocking = new Set();
    const watch = [d.querySelector(".hero, .page-hero"), d.getElementById("contact"), d.querySelector(".site-footer")];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? blocking.add(en.target) : blocking.delete(en.target)));
      const show = blocking.size === 0;
      mcta.classList.toggle("is-visible", show);
      mcta.inert = !show;
    });
    watch.forEach((el) => el && io.observe(el));
  }

  /* Inquiry form */
  if (!form) return;
  const openedAt = Date.now();
  /* Messages in the page's language (rendered by the build into #form-i18n) */
  let msg = {};
  try { msg = JSON.parse(d.getElementById("form-i18n").textContent); } catch {}
  form.elements.page.value = location.pathname;

  /* Date field: the native picker shows its placeholder in the browser's language,
     so show an English placeholder and an English date until the field is focused.
     The ISO date is kept in data-iso. */
  const date = form.elements.eventDate;
  const undecided = form.elements.dateUndecided;
  const fmtDate = (iso) => new Date(iso + "T00:00").toLocaleDateString(msg.locale || "en-CA", { year: "numeric", month: "long", day: "numeric" });
  const dateToText = () => {
    if (date.type !== "date") return;
    date.dataset.iso = date.value;
    date.type = "text";
    date.value = date.dataset.iso ? fmtDate(date.dataset.iso) : "";
  };
  const dateToPicker = () => {
    if (date.type === "date") return;
    date.type = "date";
    date.value = date.dataset.iso || "";
    try { date.showPicker(); } catch {}
  };
  date.placeholder = msg.selectDate || "Select a date";
  dateToText();
  date.addEventListener("focus", dateToPicker);
  date.addEventListener("blur", dateToText);
  undecided.addEventListener("change", () => {
    date.disabled = undecided.checked;
    if (undecided.checked) { date.dataset.iso = ""; date.value = ""; }
  });

  const status = form.querySelector(".form__status");
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = submit.textContent;
  const messages = {
    name: { valueMissing: msg.nameMissing },
    email: { valueMissing: msg.emailMissing, typeMismatch: msg.emailInvalid },
  };

  const setError = (field, msg) => {
    const err = d.getElementById(field.id + "-err");
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg;
  };
  const checkField = (field) => {
    let msg = "";
    if (!field.validity.valid) {
      const m = messages[field.name] || {};
      msg = (field.validity.valueMissing && m.valueMissing) || (field.validity.typeMismatch && m.typeMismatch) || field.validationMessage;
    }
    setError(field, msg);
    return !msg;
  };

  const required = [...form.querySelectorAll("[required]")];
  required.forEach((f) => f.addEventListener("blur", () => { if (f.getAttribute("aria-invalid")) checkField(f); }));
  required.forEach((f) => f.addEventListener("input", () => { if (f.getAttribute("aria-invalid") === "true") checkField(f); }));

  const showDone = () => {
    form.hidden = true;
    const panel = d.getElementById("form-success");
    panel.hidden = false;
    panel.focus();
  };

  let sending = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return; // no duplicate submissions while one is in flight
    status.textContent = "";
    status.classList.remove("is-error");

    const invalid = required.filter((f) => !checkField(f));
    if (invalid.length) { invalid[0].focus(); return; }

    const data = Object.fromEntries(new FormData(form));
    data.eventDate = date.type === "date" ? date.value : date.dataset.iso || "";
    data.elapsed = Date.now() - openedAt;
    Object.assign(data, utm);

    sending = true;
    submit.disabled = true;
    submit.textContent = msg.sending || "Sending…";
    form.setAttribute("aria-busy", "true");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) {
        // Field errors use this page's language; the server reports which fields.
        for (const name of Object.keys(out.fields || {})) {
          const field = form.elements[name];
          if (field) setError(field, name === "email" && field.value ? msg.emailInvalid : messages[name]?.valueMissing || out.fields[name]);
        }
        throw new Error(res.status === 422 ? msg.checkFields : res.status === 429 ? msg.tooMany : "");
      }
      track("generate_lead", { form_id: "inquiry", room: data.space || "", event_type: data.eventType || "" });
      if (window.SITE_ADS_LEAD) track("conversion", { send_to: window.SITE_ADS_LEAD });
      showDone();
    } catch (err) {
      status.textContent = err.message || msg.failed;
      status.classList.add("is-error");
      if (window.turnstile) try { window.turnstile.reset(); } catch {}
    } finally {
      sending = false;
      submit.disabled = false;
      submit.textContent = submitLabel;
      form.removeAttribute("aria-busy");
    }
  });
})();

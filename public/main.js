(() => {
  const d = document;

  /* Header border once the page scrolls */
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
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  d.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* "Inquire about…" links preselect the form */
  const form = d.getElementById("inquiry-form");
  d.addEventListener("click", (e) => {
    const link = e.target.closest("[data-space], [data-event-type]");
    if (!link || !form) return;
    if (link.dataset.space) form.elements.space.value = link.dataset.space;
    if (link.dataset.eventType) form.elements.eventType.value = link.dataset.eventType;
  });

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

  /* Mobile sticky CTA: shown after the hero, hidden over the form and footer */
  const mcta = d.querySelector(".mcta");
  if (mcta && hasIO) {
    const blocking = new Set();
    const watch = [d.querySelector(".hero"), d.getElementById("contact"), d.querySelector(".site-footer")];
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

  /* Date field: the native picker shows its placeholder in the browser's language,
     so show an English placeholder and an English date until the field is focused. */
  const date = form.elements.eventDate;
  const fmtDate = (iso) => new Date(iso + "T00:00").toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
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
  date.placeholder = "Select a date";
  dateToText();
  date.addEventListener("focus", dateToPicker);
  date.addEventListener("blur", dateToText);
  const endpoint = (form.dataset.endpoint || "").trim();
  const email = form.dataset.email;
  const status = form.querySelector(".form__status");
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = submit.textContent;

  const messages = {
    name: { valueMissing: "Enter your name." },
    email: {
      valueMissing: "Enter your email so we can reply.",
      typeMismatch: "Enter an email address like name@example.com.",
    },
  };

  const checkField = (field) => {
    const err = d.getElementById(field.id + "-err");
    let msg = "";
    if (!field.validity.valid) {
      const m = messages[field.name] || {};
      msg = (field.validity.valueMissing && m.valueMissing) || (field.validity.typeMismatch && m.typeMismatch) || field.validationMessage;
    }
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg;
    return !msg;
  };

  const required = [...form.querySelectorAll("[required]")];
  required.forEach((f) => f.addEventListener("blur", () => { if (f.getAttribute("aria-invalid")) checkField(f); }));
  required.forEach((f) => f.addEventListener("input", () => { if (f.getAttribute("aria-invalid") === "true") checkField(f); }));

  const show = (id) => {
    form.hidden = true;
    const panel = d.getElementById(id);
    panel.hidden = false;
    panel.focus();
  };

  const mailtoFallback = () => {
    const labels = {
      name: "Name", company: "Company / Organization", email: "Email", phone: "Phone",
      eventDate: "Event date", guests: "Approximate guests", space: "Preferred space",
      eventType: "Event type", message: "Message",
    };
    const data = new FormData(form);
    const lines = Object.keys(labels)
      .map((k) => [labels[k], (data.get(k) || "").toString().trim()])
      .filter(([, v]) => v)
      .map(([l, v]) => `${l}: ${v}`);
    const subject = `Event inquiry from ${data.get("name")}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    show("form-mail");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");

    const invalid = required.filter((f) => !checkField(f));
    if (invalid.length) { invalid[0].focus(); return; }
    if (form.elements._gotcha.value) return; // likely a bot

    if (!endpoint) { mailtoFallback(); return; }

    submit.disabled = true;
    submit.textContent = "Sending…";
    try {
      const res = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      show("form-success");
    } catch {
      status.textContent = `Your inquiry didn't send. Check your connection and try again, or email ${email}.`;
      status.classList.add("is-error");
    } finally {
      submit.disabled = false;
      submit.textContent = submitLabel;
    }
  });
})();

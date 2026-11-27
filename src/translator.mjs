// Translator: one `t()` per language, used for every visible string.
//
//   const t = createTranslator("fr", { fr });
//   t("Request Availability")              -> "Demander une disponibilité" (HTML-escaped, typeset)
//   t("Request the {room}", { room })      -> fills {placeholders} after translating
//   t.attr("…")                            -> escaped, no typesetting (for HTML attributes)
//   t.plain("…")                           -> translated text only (for JSON-LD, emails)
//   t.path("/spaces/champlain/")           -> "/fr/salles/champlain/"
//   t.num(1965)                            -> "1 965"
//
// Keys are the English text itself, so English needs no dictionary and a
// missing translation falls back to English. `t.missing` lists every key that
// had no translation; `npm run check` reports them.
//
// Typesetting keeps short words (a, the, of, à, de, la…) on the same line as the
// next word, so lines never end on a dangling preposition, and adds the narrow
// no-break spaces French uses before ? ! : ; and between a number and its unit.

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const NBSP = " ";
const NNBSP = " "; // narrow no-break space (French punctuation, thousands)

const SHORT = {
  en: "a|an|the|of|in|on|at|to|for|by|and|or|as|with|from|per|via|our|your|we|is|it|its|be|no|up|&amp;",
  fr: "à|a|au|aux|de|des|du|en|et|la|le|les|un|une|pour|par|sur|dans|avec|sans|ou|nos|vos|notre|votre|ce|cet|cette|ces|sa|son|ses|se|ne|y|il|on|qui|que|est|&amp;",
};

export function typeset(html, locale = "en") {
  let s = html;
  // A short word followed by a space: bind it to the next word. Runs twice so
  // chains like "in a" or "de la" are all bound.
  const re = new RegExp(`(^|[\\s(>${NBSP}])(${SHORT[locale] || SHORT.en}) (?=\\S)`, "gi");
  s = s.replace(re, `$1$2${NBSP}`).replace(re, `$1$2${NBSP}`);
  // Numbers stay with their unit or the word after them ("267 sq. ft.", "50 $", "3 sections").
  s = s.replace(/(\d) (?=[^\s\d])/g, `$1${NBSP}`).replace(/sq\. ft\./g, `sq.${NBSP}ft.`);
  if (locale === "fr") {
    s = s.replace(/ ([?!:;»])/g, `${NNBSP}$1`).replace(/(«) /g, `$1${NNBSP}`).replace(/(\d) \$/g, `$1${NNBSP}$`);
  }
  return s;
}

const fill = (s, vars) => (vars ? String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : s);

export function createTranslator(locale = "en", dictionaries = {}) {
  const dict = dictionaries[locale] || { strings: {}, paths: {} };
  const missing = new Set();
  const lookup = (key) => {
    if (locale === "en" || key == null || key === "") return key ?? "";
    const value = dict.strings[key];
    if (value === undefined) {
      missing.add(key);
      return key;
    }
    return value;
  };
  // Placeholder values that have a translation are translated too, so
  // t("Request the {room}", { room: r.name }) works in both languages.
  const vars = (v) =>
    v && Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typeof x === "string" && locale !== "en" && x in dict.strings ? dict.strings[x] : x]));

  const t = (key, v) => typeset(esc(fill(lookup(key), vars(v))), locale);
  t.attr = (key, v) => esc(fill(lookup(key), vars(v)));
  t.plain = (key, v) => fill(lookup(key), vars(v));
  t.num = (n) => n.toLocaleString(locale === "fr" ? "fr-CA" : "en-CA").replace(/\s/g, NNBSP);
  // Map an English path (optionally with #hash) to this language's path.
  t.path = (p) => {
    if (locale === "en" || /^(https?:|mailto:|tel:|#)/.test(p)) return p;
    const [path, hash] = p.split("#");
    const mapped = dict.paths[path || "/"];
    if (!mapped) missing.add(`path ${path}`);
    return (mapped || path) + (hash ? `#${hash}` : "");
  };
  t.locale = locale;
  t.lang = locale === "fr" ? "fr-CA" : "en-CA";
  t.missing = missing;
  return t;
}

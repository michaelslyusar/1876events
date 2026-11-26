// ---------------------------------------------------------------------------
// 1876 Banquets & Conference Center: all editable site content lives here.
// Change a value, run `npm run build`, and redeploy.
// ---------------------------------------------------------------------------

export const site = {
  name: "1876 Banquets & Conference Center",
  shortName: "1876",
  tagline: "Banquets & Conference Center",
  domain: "https://1876events.ca", // no trailing slash
  email: "events.1876@owomanagement.ca",
  phone: "", // e.g. "+1 613 555 0100". Leave empty to hide it everywhere.

  address: {
    street: "1876 Robertson Road",
    city: "Ottawa",
    region: "Ontario",
    regionCode: "ON",
    postalCode: "", // add when confirmed; used in structured data
    country: "CA",
    area: "Nepean, Ottawa",
  },

  maps: {
    // Opens Google Maps directions to the venue's Google Business listing.
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=1876+Banquets+%26+Conference+Center%2C+1876+Robertson+Road%2C+Ottawa%2C+ON",
    // Embedded map, pinned to the "1876 Banquets & Conference Center" business listing.
    // To use the official embed instead, open Google Maps > Share > Embed a map,
    // and paste the iframe's src here.
    embedUrl:
      "https://www.google.com/maps?q=1876+Banquets+%26+Conference+Center,+1876+Robertson+Road,+Ottawa,+ON&output=embed",
  },

  // Leave a value empty to hide that link.
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },

  // Form service endpoint (Formspree, Getform, Basin, etc.). The form POSTs
  // FormData with `Accept: application/json` and shows the success message on 2xx.
  // While this is empty, submitting opens the visitor's email app with a
  // pre-filled inquiry addressed to `email` above.
  formEndpoint: "",

  pricing: {
    fromAmount: "$50",
    unit: "/hour",
    appliesTo: "Small meeting spaces from",
    options: "Half-day, full-day and recurring booking options are available.",
  },

  seo: {
    title: "1876 Banquets & Conference Center | Event & Meeting Space Ottawa",
    description:
      "Event venue in Ottawa West with meeting rooms and conference space for corporate training, seminars and private events. Free on-site parking at 1876 Robertson Road.",
    ogImage: "/images/og-image.jpg", // 1200 × 630
  },
};

// Photos: drop files with these names into public/images/.
// Until a file exists, a labelled placeholder shows in its place.
// When you add a real photo, update its `alt` to describe what it actually shows.
export const images = {
  // Hero collage, in order: one large photo, one tall photo, then two wide ones.
  // `pos` (optional) is the CSS object-position that keeps the subject in frame.
  hero: [
    { src: "images/hero-exterior.jpg", alt: "1876 at dusk, with the covered entrance on Robertson Road", pos: "85% 50%" },
    { src: "images/hero-table.jpg", alt: "Banquet table set with a gold runner and greenery for a celebration" },
    { src: "images/hero-classroom.jpg", alt: "Meeting room set classroom-style with a projection screen" },
    { src: "images/hero-screen.jpg", alt: "Tables facing a projection screen in a meeting room" },
  ],
};

export const rooms = [
  {
    id: "champlain",
    name: "Champlain Room",
    shortName: "Champlain",
    formValue: "Champlain",
    sqft: 400,
    capacity: 10,
    // Floor-area diagram: `shape` is width ÷ depth (1 = square); `layout` is
    // "boardroom", "theatre" or "ballroom".
    shape: 2.2,
    layout: "boardroom",
    summary: "A private room for focused conversations and small groups.",
    usesLabel: "Best suited for",
    uses: ["Small meetings", "Interviews", "Private sessions", "Small team gatherings"],
    note: "",
    image: { src: "images/champlain-room.jpg", alt: "Champlain Room with a boardroom table for ten and a wall-mounted TV" },
  },
  {
    id: "fitzroy",
    layout: "theatre",
    name: "Fitzroy Room",
    shortName: "Fitzroy",
    formValue: "Fitzroy",
    sqft: 957,
    capacity: 50,
    summary: "A mid-sized room that adapts to the format, from a training day to a presentation or workshop.",
    usesLabel: "Suitable for",
    uses: ["Corporate training", "Workshops", "Seminars", "Presentations", "Medium-sized events"],
    note: "",
    image: { src: "images/fitzroy-room.jpg", alt: "Fitzroy Room set theatre-style with rows of chairs facing a lectern" },
  },
  {
    id: "carlton",
    name: "Carlton Ballroom",
    shortName: "Carlton",
    formValue: "Carlton Ballroom",
    sqft: 3000,
    capacity: 250,
    shape: 1.8,
    layout: "ballroom",
    sections: ["A", "B", "C"],
    summary:
      "Our largest space. Book one section for a meeting, or open the full ballroom for a conference, gala or celebration.",
    usesLabel: "Suitable for",
    uses: ["Conferences", "Larger meetings", "Celebrations", "Presentations", "Private events"],
    note: "Divides into Sections A, B and C: about 1,000 sq. ft. and up to 80 guests each.",
    image: { src: "images/carlton-ballroom.jpg", alt: "Carlton Ballroom set with round tables, two projection screens and a lectern" },
  },
];

export const features = [
  { icon: "parking", title: "Free on-site parking", text: "Easy arrival for guests and attendees." },
  { icon: "door", title: "Separate event entrance", text: "Dedicated exterior access for venue guests." },
  { icon: "layout", title: "Configurable layouts", text: "Each room is set up to suit your format." },
  { icon: "screen", title: "Wi-Fi & AV", text: "Wi-Fi throughout. Projectors, screens and microphones available to rent." },
];

export const corporateUses = [
  "Training sessions",
  "Team meetings",
  "Workshops",
  "Presentations",
  "Planning sessions",
  "Recurring company events",
];

export const eventTypes = [
  "Corporate meeting",
  "Training session",
  "Conference",
  "Seminar or workshop",
  "Presentation",
  "Private event",
  "Celebration",
  "Recurring booking",
  "Other",
];

// Scrolling offer strip under Pricing. Clicking it opens the form with
// "Recurring booking" preselected. Leave the list empty to hide the strip.
export const ticker = [
  "Special rates for recurring bookings",
  "Book weekly or monthly and pay less per session",
  "Preferred terms for multi-day training",
  "One dependable room, on your schedule",
  "Ask about our recurring-booking offer",
];

export const nav = [
  { href: "#spaces", label: "Spaces" },
  { href: "#location", label: "Location" },
  { href: "#contact", label: "Contact" },
];

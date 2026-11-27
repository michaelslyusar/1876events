// ---------------------------------------------------------------------------
// 1876 Banquets & Conference Center: all editable site content lives here.
// Landing-page copy lives in src/pages.mjs.
// Change a value, run `npm run build`, and redeploy.
//
// Only publish what management has confirmed. Guest capacities are left out
// on purpose until official limits are confirmed (see `capacities` below).
// ---------------------------------------------------------------------------

export const site = {
  name: "1876 Banquets & Conference Center",
  shortName: "1876",
  tagline: "Banquets & Conference Center",
  domain: "https://www.1876events.ca", // canonical domain, no trailing slash
  email: "events.1876@owomanagement.ca",
  phone: "", // e.g. "+1 613 555 0100". Leave empty to hide it everywhere.

  address: {
    street: "1876 Robertson Road",
    city: "Ottawa",
    region: "Ontario",
    regionCode: "ON",
    postalCode: "", // add when confirmed; used in structured data
    country: "CA",
    countryName: "Canada",
    neighbourhood: "Bells Corners",
    area: "Bells Corners, Ottawa West",
  },

  maps: {
    // The venue's Google Maps listing (share link).
    placeUrl: "https://maps.app.goo.gl/jydEQYhPAHUhreHn7",
    // Opens Google Maps directions to the venue.
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=1876+Banquets+%26+Conference+Center%2C+1876+Robertson+Road%2C+Ottawa%2C+ON",
    // Embedded map. To use the official embed, open Google Maps > Share >
    // Embed a map, and paste the iframe's src here.
    embedUrl:
      "https://www.google.com/maps?q=1876+Banquets+%26+Conference+Center,+1876+Robertson+Road,+Ottawa,+ON&output=embed",
  },

  // Official profiles only. Leave a value empty to hide that link.
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
  // Venue directory listings, e.g. { name: "Google Business Profile", url: "https://..." }.
  // Shown in the footer and listed in structured data as the same business.
  directories: [],

  // The inquiry form posts JSON to this path (api/inquiry.js on Vercel).
  // Email delivery is set with environment variables; see README.md.
  form: {
    endpoint: "/api/inquiry",
    // Optional Cloudflare Turnstile spam check. Set the public site key here and
    // TURNSTILE_SECRET_KEY on the server; leave empty to rely on the built-in checks.
    turnstileSiteKey: "",
  },

  // Leave IDs empty until the accounts exist. Nothing loads while they are empty.
  analytics: {
    ga4Id: "", // e.g. "G-XXXXXXXXXX"
    googleSiteVerification: "", // Search Console HTML-tag method (DNS verification needs nothing here)
    adsId: "", // Google Ads, e.g. "AW-123456789"
    adsLeadLabel: "", // conversion label for a successful inquiry
    // Consent Mode defaults. Ads storage stays off unless you change it here.
    consent: { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" },
  },

  pricing: {
    headline: "Meeting room rentals starting from $50/hour",
    fromAmount: "$50",
    unit: "/hour",
    appliesTo: "Champlain Room, two-hour minimum",
    options: "Half-day, full-day and recurring booking options are available for applicable spaces.",
    fine: "Prices are in CAD, before applicable taxes. AV equipment is available for an additional charge.",
  },

  seo: {
    title: "Meeting & Event Space in Ottawa West | 1876",
    description:
      "Flexible meeting, training and event space in Ottawa West. Free parking, Wi-Fi, configurable rooms and recurring corporate bookings at 1876 Robertson Road.",
    ogImage: "/images/og-image.jpg", // 1200 × 630, default for pages without their own
  },
};

// Hero collage on the homepage, in order: one large photo, one tall photo,
// then two wide ones. `file` is a photo name from assets/photos (no extension).
// `pos` (optional) is the CSS object-position that keeps the subject in frame.
export const images = {
  hero: [
    { file: "1876-events-entrance", alt: "1876 at dusk, with the covered entrance on Robertson Road", pos: "85% 50%" },
    { file: "banquet-table-setting", alt: "Banquet table set with a gold runner and greenery for a celebration" },
    { file: "classroom-training-setup", alt: "Meeting room set classroom-style with a projection screen" },
    { file: "meeting-room-presentation-setup", alt: "Tables facing a projection screen in a meeting room" },
  ],
};

// Rooms. Each one gets a page at /spaces/<slug>/.
//   sqft        floor area shown everywhere (keep in sync with management's numbers)
//   shape       width ÷ depth for the floor-area diagram (1 = square)
//   layout      which typical-setup diagram to draw: "boardroom", "theatre" or "ballroom"
//   capacities  confirmed limits per setup, e.g. [{ setup: "Theatre", guests: 60 }].
//               Leave empty until confirmed; the table appears once it has rows.
//   gallery     extra photos for the room page, same shape as `image`.
export const rooms = [
  {
    id: "champlain",
    slug: "champlain",
    name: "Champlain Room",
    shortName: "Champlain",
    formValue: "Champlain Room",
    sqft: 267,
    shape: 2.2,
    layout: "boardroom",
    summary: "A private room for focused meetings, interviews and small-group sessions.",
    seoTitle: "Champlain Room: Small Meeting Room in Ottawa West | 1876",
    seoDescription:
      "A private 267 sq. ft. boardroom-style meeting room at 1876 Robertson Road, Ottawa West. From $50/hour, two-hour minimum. Free parking and Wi-Fi.",
    description: [
      "The Champlain Room is our most private space: 267 sq. ft., set up boardroom-style around a single table with a wall-mounted display at one end. It suits conversations that need quiet and focus, from client meetings and interviews to small working sessions.",
      "It is also the most affordable way to book at 1876, with rentals from $50 per hour and a two-hour minimum.",
    ],
    usesLabel: "Best suited for",
    uses: ["Small meetings", "Interviews", "Client meetings", "Private sessions", "Small team gatherings"],
    layouts: ["Boardroom"],
    equipment: ["Wall-mounted display", "Complimentary Wi-Fi", "Additional AV equipment for an additional charge"],
    pricing: "From $50/hour, with a two-hour minimum. Prices are in CAD, before applicable taxes.",
    note: "",
    capacities: [],
    image: { file: "champlain-meeting-room", alt: "Champlain Room with a boardroom table and a wall-mounted display" },
    gallery: [],
  },
  {
    id: "fitzroy",
    slug: "fitzroy",
    name: "Fitzroy Room",
    shortName: "Fitzroy",
    formValue: "Fitzroy Room",
    sqft: 957,
    layout: "theatre",
    summary: "A mid-sized room that adapts to the format, from a training day to a presentation or workshop.",
    seoTitle: "Fitzroy Room: Training & Meeting Room in Ottawa West | 1876",
    seoDescription:
      "The Fitzroy Room is a 957 sq. ft. training and meeting room in Ottawa West, set up for courses, workshops, seminars and presentations. Free parking and Wi-Fi.",
    description: [
      "The Fitzroy Room is a 957 sq. ft. space that adapts to the format of the day. Set it theatre-style for a presentation, or arrange tables for a training session, seminar or workshop.",
      "It is a practical choice for corporate training and recurring sessions, with free on-site parking for attendees and complimentary Wi-Fi.",
    ],
    usesLabel: "Suitable for",
    uses: ["Corporate training", "Workshops", "Seminars", "Presentations", "Team meetings"],
    layouts: ["Theatre-style", "Classroom-style", "Workshop tables"],
    equipment: ["Lectern", "Complimentary Wi-Fi", "Projector, screen and microphones for an additional charge"],
    pricing: "",
    note: "",
    capacities: [],
    image: { file: "fitzroy-training-room", alt: "Fitzroy Room set theatre-style with rows of chairs facing a lectern" },
    gallery: [],
  },
  {
    id: "carlton",
    slug: "carlton-ballroom",
    name: "Carlton Ballroom",
    shortName: "Carlton",
    formValue: "Carlton Ballroom",
    sqft: 1965,
    shape: 1.8,
    layout: "ballroom",
    sections: ["A", "B", "C"],
    summary:
      "Our largest space. Book one section for a meeting, or open the full ballroom for a conference, seminar or celebration.",
    seoTitle: "Carlton Ballroom: Conference & Banquet Space in Ottawa | 1876",
    seoDescription:
      "The Carlton Ballroom is a 1,965 sq. ft. conference and banquet space in Ottawa West that divides into three sections. Free parking, Wi-Fi and flexible layouts.",
    description: [
      "The Carlton Ballroom is 1,965 sq. ft. and can be divided into three sections. Book a single section for a meeting or training day, or open the full room for a conference, seminar, presentation or private celebration.",
      "Round and rectangular tables let us set the room for a seated dinner, a presentation or a working session, and the Fitzroy and Champlain Rooms nearby can serve as breakout space.",
    ],
    usesLabel: "Suitable for",
    uses: ["Conferences", "Seminars", "Larger meetings", "Presentations", "Celebrations", "Private events"],
    layouts: ["Banquet rounds", "Rectangular tables", "Theatre-style", "Full room or one of three sections"],
    equipment: ["Projection screens", "Lectern", "Complimentary Wi-Fi", "Additional AV equipment for an additional charge"],
    pricing: "",
    note: "Divides into three sections.",
    capacities: [],
    image: { file: "carlton-ballroom-ottawa", alt: "Carlton Ballroom set with round tables, two projection screens and a lectern" },
    gallery: [],
  },
];

export const totalSqft = rooms.reduce((sum, r) => sum + r.sqft, 0); // 3,189

// Confirmed amenities. `icon` is one of the names in ICONS in src/template.mjs.
export const features = [
  { icon: "parking", title: "Free on-site parking", text: "Easy arrival for guests and attendees." },
  { icon: "door", title: "Separate event entrance", text: "Dedicated exterior access for venue guests." },
  { icon: "wifi", title: "Complimentary Wi-Fi", text: "Wi-Fi throughout the venue." },
  { icon: "layout", title: "Flexible room configurations", text: "Each room is set up to suit your format." },
  { icon: "screen", title: "AV equipment available", text: "Projectors, screens and microphones for an additional charge." },
  { icon: "calendar", title: "Recurring & multi-day bookings", text: "Keep the same room on a regular schedule." },
];

export const corporate = {
  title: "Your team’s space, whenever you need it",
  lead: "Book a room for a single session or set up a regular schedule. 1876 gives teams a dependable place outside the office for training, planning and recurring meetings, with free parking in Ottawa West.",
  offer: "Preferred arrangements may be available for regular clients and multi-day bookings.",
  points: [
    "Recurring weekly or monthly reservations",
    "Multi-day training and workshops",
    "Flexible scheduling, subject to availability",
    "Professional room setups for each format",
  ],
  audiences: [
    "Corporate training providers",
    "Local businesses",
    "Professional associations",
    "Recruitment companies",
    "Remote and hybrid teams",
    "Independent instructors",
    "Workshop organizers",
    "Community organizations",
  ],
};

export const eventTypes = [
  "Corporate meeting",
  "Training session",
  "Conference",
  "Seminar or workshop",
  "Presentation",
  "Private event",
  "Celebration",
  "Recurring booking",
  "Venue tour",
  "Other",
];

// Homepage FAQ. Only confirmed answers; don't add catering, alcohol or
// accessibility answers until management confirms them.
export const faqs = [
  {
    q: "Where is 1876 Banquets & Conference Center located?",
    a: "We are located at 1876 Robertson Road in Bells Corners, Ottawa West, conveniently accessible from Nepean and Kanata.",
  },
  { q: "Is parking available?", a: "Yes, free on-site parking is available for venue guests." },
  {
    q: "Can I rent a room for corporate training?",
    a: "Yes, our spaces are suitable for corporate training, workshops, presentations and professional meetings.",
  },
  { q: "Is Wi-Fi included?", a: "Yes, complimentary Wi-Fi is available." },
  {
    q: "Is audiovisual equipment available?",
    a: "AV equipment can be rented separately according to your event requirements.",
  },
  { q: "Do you offer recurring bookings?", a: "Yes, recurring and multi-day booking arrangements are available." },
  {
    q: "Can I arrange a venue tour before booking?",
    a: "Contact our team to arrange a viewing and discuss your event requirements.",
  },
  {
    q: "Can the room layout be customized?",
    a: "Our spaces support flexible configurations depending on your event requirements and room availability.",
  },
  {
    q: "How much does it cost to rent a meeting room?",
    a: "Champlain Room rentals start at $50 per hour with a two-hour minimum. Contact us for pricing and availability for other spaces.",
  },
];

// Scrolling offer strip under Pricing. Clicking it opens the form with
// "Recurring booking" preselected. Leave the list empty to hide the strip.
export const ticker = [
  "Recurring & multi-day bookings",
  "Preferred arrangements for regular clients",
  "Flexible scheduling, subject to availability",
  "Free on-site parking",
  "Discuss a recurring booking",
];

// Main navigation. Links starting with "/#" scroll to a homepage section.
export const nav = [
  { href: "/#spaces", label: "Spaces" },
  { href: "/meeting-room-rental-ottawa/", label: "Meetings" },
  { href: "/corporate-training-space-ottawa/", label: "Training" },
  { href: "/event-space-nepean/", label: "Events" },
  { href: "/#location", label: "Location" },
  { href: "/#faq", label: "FAQ" },
];

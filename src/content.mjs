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
    area: "Ottawa West",
  },

  maps: {
    // Opens Google Maps directions to the venue.
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=1876+Robertson+Road%2C+Ottawa%2C+ON",
    // Embedded map. To use the official embed from your Google Business Profile,
    // open Google Maps > Share > Embed a map, and paste the iframe's src here.
    embedUrl: "https://www.google.com/maps?q=1876+Robertson+Road,+Ottawa,+ON&output=embed",
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
  hero: { src: "images/hero.jpg", alt: "Carlton Ballroom at 1876, set for an event" },
};

export const rooms = [
  {
    id: "champlain",
    name: "Champlain Room",
    shortName: "Champlain",
    formValue: "Champlain",
    sqft: 267,
    summary: "A private room for focused conversations and small groups.",
    usesLabel: "Best suited for",
    uses: ["Small meetings", "Interviews", "Private sessions", "Small team gatherings"],
    note: "",
    image: { src: "images/champlain-room.jpg", alt: "Champlain Room set for a small meeting" },
  },
  {
    id: "fitzroy",
    name: "Fitzroy Room",
    shortName: "Fitzroy",
    formValue: "Fitzroy",
    sqft: 957,
    summary: "A mid-sized room that adapts to the format, from a training day to a presentation or workshop.",
    usesLabel: "Suitable for",
    uses: ["Corporate training", "Workshops", "Seminars", "Presentations", "Medium-sized events"],
    note: "Capacity depends on room configuration.",
    image: { src: "images/fitzroy-room.jpg", alt: "Fitzroy Room arranged for a training session" },
  },
  {
    id: "carlton",
    name: "Carlton Ballroom",
    shortName: "Carlton",
    formValue: "Carlton Ballroom",
    sqft: 1965,
    sections: 3,
    summary:
      "Our largest space. Book one section for a meeting, or open the full ballroom for a conference or celebration.",
    usesLabel: "Suitable for",
    uses: ["Conferences", "Larger meetings", "Celebrations", "Presentations", "Private events"],
    note: "Divides into three sections for flexible configurations.",
    image: { src: "images/carlton-ballroom.jpg", alt: "Carlton Ballroom with the full room open" },
  },
];

export const features = [
  { icon: "pin", title: "Ottawa West location", text: "Conveniently located at 1876 Robertson Road." },
  { icon: "parking", title: "Free on-site parking", text: "Easy arrival for guests and attendees." },
  { icon: "door", title: "Separate event entrance", text: "Dedicated exterior access for venue guests." },
  { icon: "layout", title: "Flexible room layouts", text: "Spaces can be configured according to event requirements." },
  { icon: "wifi", title: "Wi-Fi", text: "Available throughout the venue." },
  { icon: "screen", title: "AV equipment available", text: "Projectors, screens, microphones and other equipment can be rented separately." },
  { icon: "calendar", title: "Corporate & recurring bookings", text: "Flexible options for organizations that need regular meeting or training space." },
];

export const corporateUses = [
  "Training sessions",
  "Team meetings",
  "Workshops",
  "Presentations",
  "Planning sessions",
  "Recurring company events",
];

// Gallery: 6 to 12 photos work with the layout. `size` is "lg", "tall", "wide" or "".
// The default pattern fills a clean grid with exactly nine photos.
export const gallery = [
  { src: "images/gallery-01.jpg", alt: "Carlton Ballroom set for a conference", size: "lg" },
  { src: "images/gallery-02.jpg", alt: "Fitzroy Room arranged for training", size: "tall" },
  { src: "images/gallery-03.jpg", alt: "Champlain Room meeting table", size: "" },
  { src: "images/gallery-04.jpg", alt: "Separate event entrance", size: "" },
  { src: "images/gallery-05.jpg", alt: "Carlton Ballroom divided into sections", size: "wide" },
  { src: "images/gallery-06.jpg", alt: "Presentation screen and AV setup", size: "" },
  { src: "images/gallery-07.jpg", alt: "Exterior of 1876 on Robertson Road", size: "" },
  { src: "images/gallery-08.jpg", alt: "On-site parking", size: "wide" },
  { src: "images/gallery-09.jpg", alt: "Carlton Ballroom set for a celebration", size: "wide" },
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

export const nav = [
  { href: "#spaces", label: "Spaces" },
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#location", label: "Location" },
  { href: "#contact", label: "Contact" },
];

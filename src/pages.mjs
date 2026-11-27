// ---------------------------------------------------------------------------
// Landing pages. Each one answers a different need, so keep their copy distinct.
//
//   path         URL, with leading and trailing slashes
//   title        <title> (about 50-60 characters)
//   description  meta description (about 140-160 characters)
//   h1, lead     page heading and the sentence under it
//   image        a photo name from assets/photos (no extension) and its alt text
//   sections     { h2, body: [paragraphs], list?: [items], steps?: [items] }
//   rooms        room ids to recommend, best match first
//   features     amenity icons to show (from `features` in content.mjs)
//   faqs         questions specific to this page
//   related      paths of other pages to link to
//   cta          { label, eventType?, space? } preselects the inquiry form
//
// To add a page, copy an entry, give it a new path, and run `npm run build`.
// It is added to the sitemap and footer automatically.
// ---------------------------------------------------------------------------

export const landingPages = [
  {
    path: "/meeting-room-rental-ottawa/",
    nav: "Meeting room rental",
    title: "Meeting Room Rental in Ottawa West | 1876",
    description:
      "Rent a private meeting room in Ottawa West by the hour, half-day or full day. Free parking and Wi-Fi at 1876 Robertson Road, Bells Corners. From $50/hour.",
    h1: "Meeting Room Rental in Ottawa West",
    lead: "Private meeting rooms by the hour, half-day or full day, with free on-site parking and complimentary Wi-Fi at 1876 Robertson Road.",
    image: { file: "champlain-meeting-room", alt: "Champlain Room with a boardroom table and a wall-mounted display" },
    sections: [
      {
        h2: "A room that fits the meeting",
        body: [
          "Choose a room by the size and format of your group. The Champlain Room is set boardroom-style for interviews, client meetings and small working sessions. The Fitzroy Room suits larger team meetings and presentations, and a section of the Carlton Ballroom works when the whole department needs to be in one place.",
          "Every room is set up before you arrive, so the meeting can start on time.",
        ],
      },
      {
        h2: "Hourly, half-day and full-day rentals",
        body: [
          "Book only the time you need. Champlain Room rentals start at $50 per hour with a two-hour minimum. Prices are in CAD, before applicable taxes.",
        ],
        list: [
          "Hourly meeting room rental, two-hour minimum in the Champlain Room",
          "Half-day and full-day bookings for applicable spaces",
          "Recurring bookings for regular team meetings",
          "AV equipment available for an additional charge",
        ],
      },
      {
        h2: "Easy for everyone to get to",
        body: [
          "We are on Robertson Road in Bells Corners, in Ottawa West. Guests coming from Nepean, Kanata or across Ottawa can park free on site and come straight in through the separate event entrance.",
        ],
      },
    ],
    rooms: ["champlain", "fitzroy", "carlton"],
    features: ["parking", "wifi", "door", "screen"],
    faqs: [
      {
        q: "How much does it cost to rent a meeting room?",
        a: "Champlain Room rentals start at $50 per hour with a two-hour minimum. Contact us for pricing and availability for other spaces.",
      },
      {
        q: "Can I book a meeting room for half a day or a full day?",
        a: "Yes, half-day and full-day options are available for applicable spaces. Tell us your date and timing and we'll confirm availability and pricing.",
      },
      { q: "Is Wi-Fi included?", a: "Yes, complimentary Wi-Fi is available." },
      {
        q: "Can I see the room before booking?",
        a: "Contact our team to arrange a viewing and discuss your meeting requirements.",
      },
    ],
    related: ["/recurring-meeting-space-ottawa/", "/corporate-training-space-ottawa/"],
    cta: { label: "Request Availability", eventType: "Corporate meeting" },
  },

  {
    path: "/corporate-training-space-ottawa/",
    nav: "Corporate training space",
    title: "Corporate Training Space in Ottawa | 1876",
    description:
      "Training room rental in Ottawa West for corporate courses, workshops and onboarding. Configurable layouts, free parking, Wi-Fi and multi-day bookings.",
    h1: "Corporate Training Space in Ottawa",
    lead: "A dependable training room outside the office for courses, workshops and onboarding, with configurable layouts and free parking for every attendee.",
    image: { file: "classroom-training-setup", alt: "Meeting room set classroom-style with a projection screen" },
    sections: [
      {
        h2: "Set up for learning",
        body: [
          "Training works best when the room fits the format. We can set the Fitzroy Room or a section of the Carlton Ballroom classroom-style for instructor-led courses, with tables in groups for hands-on workshops, or theatre-style for a presentation.",
          "Tell us how your day runs, including breaks and any group work, and we'll suggest a setup.",
        ],
      },
      {
        h2: "Built for multi-day and repeat courses",
        body: [
          "Many training programs run over several days or repeat through the year. Book consecutive days or a recurring schedule, subject to availability, and keep the same room so attendees always know where to go.",
          "Preferred arrangements may be available for multi-day and recurring bookings.",
        ],
      },
      {
        h2: "Suitable for",
        body: [],
        list: [
          "Corporate training providers",
          "Independent instructors and certification courses",
          "Onboarding and recruitment days",
          "Professional association workshops",
          "In-house team training",
        ],
      },
    ],
    rooms: ["fitzroy", "carlton", "champlain"],
    features: ["layout", "screen", "wifi", "parking"],
    faqs: [
      {
        q: "Can I rent a room for corporate training?",
        a: "Yes, our spaces are suitable for corporate training, workshops, presentations and professional meetings.",
      },
      { q: "Do you offer multi-day bookings?", a: "Yes, recurring and multi-day booking arrangements are available." },
      {
        q: "Is audiovisual equipment available?",
        a: "AV equipment can be rented separately according to your event requirements.",
      },
      {
        q: "Can the room layout be customized?",
        a: "Our spaces support flexible configurations depending on your event requirements and room availability.",
      },
    ],
    related: ["/recurring-meeting-space-ottawa/", "/conference-venue-ottawa/"],
    cta: { label: "Request Availability", eventType: "Training session" },
  },

  {
    path: "/conference-venue-ottawa/",
    nav: "Conference venue",
    title: "Conference Venue in Ottawa West | 1876",
    description:
      "A flexible conference venue in Ottawa West. The 1,965 sq. ft. Carlton Ballroom divides into three sections, with breakout rooms, free parking and Wi-Fi.",
    h1: "Flexible Conference Venue in Ottawa West",
    lead: "Host a conference, seminar or company meeting in the 1,965 sq. ft. Carlton Ballroom, with smaller rooms nearby for breakouts.",
    image: { file: "carlton-ballroom-ottawa", alt: "Carlton Ballroom set with round tables, two projection screens and a lectern" },
    sections: [
      {
        h2: "One ballroom, three sections",
        body: [
          "The Carlton Ballroom can be used as one room or divided into three sections. Open it fully for a keynote and plenary sessions, or book a single section for a smaller seminar.",
          "Round tables work well for sessions with discussion, and rows of chairs facing the screens suit presentations.",
        ],
      },
      {
        h2: "Breakout rooms in the same building",
        body: [
          "The Fitzroy and Champlain Rooms can be booked alongside the ballroom for breakout sessions, interviews, speaker preparation or a quiet working room, subject to availability.",
        ],
      },
      {
        h2: "Conference essentials",
        body: [],
        list: [
          "Complimentary Wi-Fi for attendees",
          "Projectors, screens and microphones for an additional charge",
          "Separate event entrance and free on-site parking",
          "Layouts configured for your program",
        ],
      },
      {
        h2: "Planning your conference",
        body: [
          "Send us your date, an approximate attendance and the format of your day. We'll confirm availability, recommend a room setup and prepare a quote.",
        ],
      },
    ],
    rooms: ["carlton", "fitzroy", "champlain"],
    features: ["layout", "screen", "parking", "door"],
    faqs: [
      { q: "Can the Carlton Ballroom be divided?", a: "Yes, the Carlton Ballroom can be divided into three sections." },
      { q: "Is parking available?", a: "Yes, free on-site parking is available for venue guests." },
      {
        q: "Is audiovisual equipment available?",
        a: "AV equipment can be rented separately according to your event requirements.",
      },
      {
        q: "Can I arrange a venue tour before booking?",
        a: "Contact our team to arrange a viewing and discuss your event requirements.",
      },
    ],
    related: ["/corporate-training-space-ottawa/", "/event-space-nepean/"],
    cta: { label: "Request Availability", eventType: "Conference", space: "Carlton Ballroom" },
  },

  {
    path: "/event-space-nepean/",
    nav: "Event space in Nepean",
    title: "Event Space in Nepean & Ottawa West | 1876",
    description:
      "Private event space in Nepean and Ottawa West for celebrations, receptions and company events. Configurable rooms and free on-site parking at 1876 Robertson Road.",
    h1: "Event Space in Nepean & Ottawa West",
    lead: "Private event space in Bells Corners for celebrations, receptions and company gatherings, with free parking on site.",
    image: { file: "banquet-table-setting", alt: "Banquet table set with a gold runner and greenery for a celebration" },
    sections: [
      {
        h2: "Private events and celebrations",
        body: [
          "Mark a milestone, host a family celebration or bring the company together at the end of the year. The Carlton Ballroom can be set with round or rectangular tables for a seated gathering, and the Fitzroy Room suits smaller groups.",
          "Tell us about your plans and we'll confirm what the venue can accommodate on your date.",
        ],
      },
      {
        h2: "Company and community events",
        body: [
          "Professional associations, community organizations and businesses use event space for annual meetings, networking evenings, awards and information sessions. Book the full ballroom or a single section, depending on your group.",
        ],
      },
      {
        h2: "Convenient for guests across the west end",
        body: [
          "We are at 1876 Robertson Road in Bells Corners, easy to reach from Nepean, Kanata and across Ottawa. Guests park free on site and use the venue's separate event entrance.",
        ],
      },
    ],
    rooms: ["carlton", "fitzroy"],
    features: ["parking", "door", "layout", "wifi"],
    faqs: [
      {
        q: "Where is 1876 Banquets & Conference Center located?",
        a: "We are located at 1876 Robertson Road in Bells Corners, Ottawa West, conveniently accessible from Nepean and Kanata.",
      },
      { q: "Is parking available?", a: "Yes, free on-site parking is available for venue guests." },
      {
        q: "Can the room layout be customized?",
        a: "Our spaces support flexible configurations depending on your event requirements and room availability.",
      },
      {
        q: "Can I arrange a venue tour before booking?",
        a: "Contact our team to arrange a viewing and discuss your event requirements.",
      },
    ],
    related: ["/conference-venue-ottawa/", "/meeting-room-rental-ottawa/"],
    cta: { label: "Request Availability", eventType: "Private event" },
  },

  {
    path: "/recurring-meeting-space-ottawa/",
    nav: "Recurring meeting space",
    title: "Recurring Meeting & Training Space in Ottawa | 1876",
    description:
      "Book a regular meeting or training room in Ottawa West, weekly, monthly or for multi-day programs. Ask about preferred arrangements. Free parking and Wi-Fi.",
    h1: "Recurring Meeting & Training Space for Ottawa Teams",
    lead: "Set up a regular schedule for meetings, training or classes, and come back to the same room each time.",
    image: { file: "meeting-room-presentation-setup", alt: "Tables facing a projection screen in a meeting room" },
    sections: [
      {
        h2: "A regular room without a lease",
        body: [
          "Book a room on a schedule that suits your team, whether that is weekly, every other week or once a month, without committing to permanent office space. Scheduling is flexible, subject to availability.",
          "Preferred arrangements may be available for regular clients.",
        ],
      },
      {
        h2: "Recurring bookings suit",
        body: [],
        list: [
          "Remote and hybrid teams that meet in person",
          "Training providers running regular courses",
          "Professional associations and their monthly meetings",
          "Recruitment companies holding interview days",
          "Independent instructors and workshop organizers",
          "Community organizations",
        ],
      },
      {
        h2: "How it works",
        body: [],
        steps: [
          "Tell us your schedule, group size and the format of your sessions.",
          "We confirm availability and recommend a room and setup.",
          "We agree on terms for the series, including any preferred arrangements.",
          "Your room is ready each time you arrive.",
        ],
      },
    ],
    rooms: ["champlain", "fitzroy", "carlton"],
    features: ["calendar", "parking", "wifi", "layout"],
    faqs: [
      { q: "Do you offer recurring bookings?", a: "Yes, recurring and multi-day booking arrangements are available." },
      {
        q: "Are there special rates for regular clients?",
        a: "Preferred arrangements may be available for recurring and multi-day bookings. Contact us with your schedule and we'll prepare a quote.",
      },
      { q: "Is parking available?", a: "Yes, free on-site parking is available for venue guests." },
      {
        q: "How much does it cost to rent a meeting room?",
        a: "Champlain Room rentals start at $50 per hour with a two-hour minimum. Contact us for pricing and availability for other spaces.",
      },
    ],
    related: ["/corporate-training-space-ottawa/", "/meeting-room-rental-ottawa/"],
    cta: { label: "Discuss a Recurring Booking", eventType: "Recurring booking" },
  },
];

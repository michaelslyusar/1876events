// French (Canada) translations. Keys are the English text exactly as it appears
// in src/content.mjs, src/pages.mjs and src/template.mjs. When you change English
// text, update its key here too: `npm run build` lists any string without a
// French translation (it shows in English until translated).
//
// Write a normal space before ? ! : ; and between a number and $; the
// translator turns them into the narrow no-break spaces French typography uses.

export const fr = {
  // French URL for each English page.
  paths: {
    "/": "/fr/",
    "/spaces/champlain/": "/fr/salles/champlain/",
    "/spaces/fitzroy/": "/fr/salles/fitzroy/",
    "/spaces/carlton-ballroom/": "/fr/salles/salle-de-bal-carlton/",
    "/meeting-room-rental-ottawa/": "/fr/location-salle-de-reunion-ottawa/",
    "/corporate-training-space-ottawa/": "/fr/salle-de-formation-entreprise-ottawa/",
    "/conference-venue-ottawa/": "/fr/salle-de-conference-ottawa/",
    "/event-space-nepean/": "/fr/salle-evenementielle-nepean/",
    "/recurring-meeting-space-ottawa/": "/fr/salle-de-reunion-recurrente-ottawa/",
    "/inquiry-received/": "/fr/demande-recue/",
  },

  strings: {
    // Site, header, footer --------------------------------------------------
    "Meeting & Event Space in Ottawa West | 1876": "Salles de réunion et d’événements à Ottawa Ouest | 1876",
    "Flexible meeting, training and event space in Ottawa West. Free parking, Wi-Fi, configurable rooms and recurring corporate bookings at 1876 Robertson Road.":
      "Salles de réunion, de formation et d’événements à Ottawa Ouest. Stationnement et Wi-Fi gratuits, salles modulables, réservations récurrentes au 1876, ch. Robertson.",
    "Banquets & Conference Center": "Centre de banquets et de conférences",
    "Skip to content": "Aller au contenu",
    "{name}, back to top": "{name}, retour en haut",
    "{name}, home": "{name}, accueil",
    "Open menu": "Ouvrir le menu",
    "Close menu": "Fermer le menu",
    Main: "Principal",
    Breadcrumb: "Fil d’Ariane",
    Home: "Accueil",
    Spaces: "Salles",
    Meetings: "Réunions",
    Training: "Formation",
    Events: "Événements",
    Location: "Emplacement",
    FAQ: "FAQ",
    "Plan your event": "Planifier votre événement",
    "Meeting room rental": "Location de salle de réunion",
    "Corporate training space": "Salle de formation",
    "Conference venue": "Salle de conférence",
    "Event space in Nepean": "Salle d’événements à Nepean",
    "Recurring meeting space": "Salle de réunion récurrente",
    Venue: "Le lieu",
    "Back to top": "Retour en haut",
    "View on Google Maps": "Voir dans Google Maps",
    Ontario: "Ontario",
    Canada: "Canada",
    "Request Availability": "Demander les disponibilités",
    "Request availability": "Demander les disponibilités",
    "Request availability.": "Demander les disponibilités.",
    "Schedule a Venue Tour": "Planifier une visite",

    // Homepage --------------------------------------------------------------
    "Meeting & Event Space in Ottawa West": "Salles de réunion et d’événements à Ottawa Ouest",
    "A refined space for meetings, events & celebrations": "Un lieu raffiné pour vos réunions, événements et célébrations",
    "Free on-site parking": "Stationnement gratuit sur place",
    "Complimentary Wi-Fi": "Wi-Fi gratuit",
    "Three configurable rooms": "Trois salles modulables",
    "1876 at dusk, with the covered entrance on Robertson Road": "Le 1876 au crépuscule, avec son entrée couverte sur le chemin Robertson",
    "Banquet table set with a gold runner and greenery for a celebration": "Table de banquet dressée d’un chemin de table doré et de verdure pour une célébration",
    "Meeting room set classroom-style with a projection screen": "Salle de réunion disposée en salle de classe, avec écran de projection",
    "Tables facing a projection screen in a meeting room": "Tables face à un écran de projection dans une salle de réunion",
    "Flexible space for meetings, training and events": "Des salles modulables pour réunions, formations et événements",
    "1876 Banquets & Conference Center offers flexible room rentals for corporate meetings, training sessions, workshops, conferences and private events. Located in Bells Corners, our venue is convenient for teams coming from Nepean, Kanata and across Ottawa":
      "Le 1876 Banquets & Conference Center propose la location de salles modulables pour réunions d’affaires, formations, ateliers, conférences et événements privés. Situé à Bells Corners, il est facile d’accès pour les équipes de Nepean, de Kanata et de tout Ottawa",
    "{n} sq. ft.": "{n} pi²",
    "sq. ft.": "pi²",
    "{n} sq. ft. of event space, drawn to the same scale. Layouts show a typical setup, not exact floor plans. We arrange tables and seating to suit your event.":
      "{n} pi² d’espace événementiel, dessinés à la même échelle. Les plans montrent un aménagement type, pas un plan exact. Nous disposons les tables et les places selon votre événement.",
    "View the {room}": "Découvrir la {room}",
    "divides into {n} sections": "divisible en {n} sections",
    "Divides into {n} sections": "Divisible en {n} sections",
    "Why 1876": "Pourquoi le 1876",
    "The practical details that make the day easier for organizers and guests": "Les détails pratiques qui facilitent la journée des organisateurs et des invités",
    "Discuss a Recurring Booking": "Discuter d’une réservation récurrente",
    "Recurring bookings": "Réservations récurrentes",
    "Well suited to": "Idéal pour",
    "Pricing that fits the booking": "Des tarifs adaptés à votre réservation",
    "Every quote is based on the room, the date and the length of your event": "Chaque soumission tient compte de la salle, de la date et de la durée de votre événement",
    "Meeting room rentals starting from": "Location de salles de réunion à partir de",
    $50: "50 $",
    "/hour": "/heure",
    "Request Pricing & Availability": "Demander tarifs et disponibilités",
    "Find the right space for your booking": "Trouvez la salle qui convient à votre réservation",
    "Rooms, setups and practical details for the way you plan to use the venue": "Salles, aménagements et détails pratiques selon l’usage que vous prévoyez",
    "Easy to reach from Nepean, Kanata and across Ottawa, with free on-site parking and a separate event entrance.":
      "Facile d’accès depuis Nepean, Kanata et tout Ottawa, avec stationnement gratuit sur place et une entrée réservée aux événements.",
    "Get Directions": "Itinéraire",
    "Map showing {address}": "Carte indiquant le {address}",
    "Frequently asked questions": "Questions fréquentes",

    // Site data (content.mjs) -------------------------------------------------
    "Bells Corners, Ottawa West": "Bells Corners, Ottawa Ouest",
    "Champlain Room": "Salle Champlain",
    "Fitzroy Room": "Salle Fitzroy",
    "Carlton Ballroom": "Salle de bal Carlton",
    "Champlain Room with a boardroom table and a wall-mounted display": "Salle Champlain avec table de conférence et écran mural",
    "Fitzroy Room set theatre-style with rows of chairs facing a lectern": "Salle Fitzroy disposée en théâtre, rangées de chaises face à un lutrin",
    "Carlton Ballroom set with round tables, two projection screens and a lectern": "Salle de bal Carlton avec tables rondes, deux écrans de projection et un lutrin",
    "A private room for focused meetings, interviews and small-group sessions.": "Une salle privée pour des réunions concentrées, des entrevues et des séances en petit groupe.",
    "A mid-sized room that adapts to the format, from a training day to a presentation or workshop.":
      "Une salle de taille moyenne qui s’adapte au format, d’une journée de formation à une présentation ou un atelier.",
    "Our largest space. Book one section for a meeting, or open the full ballroom for a conference, seminar or celebration.":
      "Notre plus grande salle. Réservez une section pour une réunion, ou la salle entière pour une conférence, un séminaire ou une célébration.",
    "Best suited for": "Idéale pour",
    "Suitable for": "Convient pour",
    "Small meetings": "Petites réunions",
    Interviews: "Entrevues",
    "Client meetings": "Rencontres avec des clients",
    "Private sessions": "Séances privées",
    "Small team gatherings": "Rencontres de petites équipes",
    "Corporate training": "Formation en entreprise",
    Workshops: "Ateliers",
    Seminars: "Séminaires",
    Presentations: "Présentations",
    "Team meetings": "Réunions d’équipe",
    Conferences: "Conférences",
    "Larger meetings": "Grandes réunions",
    Celebrations: "Célébrations",
    "Private events": "Événements privés",
    Boardroom: "Salle de conférence",
    "Theatre-style": "En théâtre",
    "Classroom-style": "En salle de classe",
    "Workshop tables": "Tables d’atelier",
    "Banquet rounds": "Tables rondes de banquet",
    "Rectangular tables": "Tables rectangulaires",
    "Full room or one of three sections": "Salle entière ou une des trois sections",
    "Wall-mounted display": "Écran mural",
    "Additional AV equipment for an additional charge": "Équipement audiovisuel supplémentaire moyennant des frais",
    Lectern: "Lutrin",
    "Projector, screen and microphones for an additional charge": "Projecteur, écran et microphones moyennant des frais",
    "Projection screens": "Écrans de projection",
    "From $50/hour, with a two-hour minimum. Prices are in CAD, before applicable taxes.":
      "À partir de 50 $/heure, minimum de deux heures. Prix en dollars canadiens, taxes applicables en sus.",
    "Champlain Room: Small Meeting Room in Ottawa West | 1876": "Salle Champlain : petite salle de réunion à Ottawa Ouest | 1876",
    "A private 267 sq. ft. boardroom-style meeting room at 1876 Robertson Road, Ottawa West. From $50/hour, two-hour minimum. Free parking and Wi-Fi.":
      "Salle de réunion privée de 267 pi², style conseil d’administration, au 1876, chemin Robertson, Ottawa Ouest. À partir de 50 $/heure, minimum deux heures.",
    "Fitzroy Room: Training & Meeting Room in Ottawa West | 1876": "Salle Fitzroy : formation et réunions à Ottawa Ouest | 1876",
    "The Fitzroy Room is a 957 sq. ft. training and meeting room in Ottawa West, set up for courses, workshops, seminars and presentations. Free parking and Wi-Fi.":
      "La salle Fitzroy (957 pi²) accueille formations, ateliers, séminaires et présentations à Ottawa Ouest. Stationnement et Wi-Fi gratuits.",
    "Carlton Ballroom: Conference & Banquet Space in Ottawa | 1876": "Salle de bal Carlton : conférences et banquets à Ottawa | 1876",
    "The Carlton Ballroom is a 1,965 sq. ft. conference and banquet space in Ottawa West that divides into three sections. Free parking, Wi-Fi and flexible layouts.":
      "La salle de bal Carlton (1 965 pi²) accueille conférences et banquets à Ottawa Ouest et se divise en trois sections. Stationnement et Wi-Fi gratuits.",
    "The Champlain Room is our most private space: 267 sq. ft., set up boardroom-style around a single table with a wall-mounted display at one end. It suits conversations that need quiet and focus, from client meetings and interviews to small working sessions.":
      "La salle Champlain est notre espace le plus privé : 267 pi² aménagés autour d’une grande table de conférence, avec un écran mural à une extrémité. Elle convient aux échanges qui demandent calme et concentration, des rencontres avec des clients et des entrevues aux petites séances de travail.",
    "It is also the most affordable way to book at 1876, with rentals from $50 per hour and a two-hour minimum.":
      "C’est aussi la façon la plus économique de réserver au 1876, à partir de 50 $ l’heure avec un minimum de deux heures.",
    "The Fitzroy Room is a 957 sq. ft. space that adapts to the format of the day. Set it theatre-style for a presentation, or arrange tables for a training session, seminar or workshop.":
      "La salle Fitzroy offre 957 pi² qui s’adaptent au format de la journée : disposition en théâtre pour une présentation, ou tables pour une formation, un séminaire ou un atelier.",
    "It is a practical choice for corporate training and recurring sessions, with free on-site parking for attendees and complimentary Wi-Fi.":
      "C’est un choix pratique pour la formation en entreprise et les séances récurrentes, avec stationnement gratuit sur place pour les participants et Wi-Fi gratuit.",
    "The Carlton Ballroom is 1,965 sq. ft. and can be divided into three sections. Book a single section for a meeting or training day, or open the full room for a conference, seminar, presentation or private celebration.":
      "La salle de bal Carlton offre 1 965 pi² et peut être divisée en trois sections. Réservez une section pour une réunion ou une journée de formation, ou la salle entière pour une conférence, un séminaire, une présentation ou une célébration privée.",
    "Round and rectangular tables let us set the room for a seated dinner, a presentation or a working session, and the Fitzroy and Champlain Rooms nearby can serve as breakout space.":
      "Tables rondes et rectangulaires permettent d’aménager la salle pour un repas assis, une présentation ou une séance de travail, et les salles Fitzroy et Champlain, à proximité, peuvent servir de salles de travail en sous-groupes.",
    "Champlain Room, two-hour minimum": "Salle Champlain, minimum de deux heures",
    "Half-day, full-day and recurring booking options are available for applicable spaces.":
      "Des forfaits demi-journée, journée complète et réservation récurrente sont offerts pour les salles admissibles.",
    "Prices are in CAD, before applicable taxes. AV equipment is available for an additional charge.":
      "Prix en dollars canadiens, taxes applicables en sus. Équipement audiovisuel offert moyennant des frais.",

    // Amenities
    "Easy arrival for guests and attendees.": "Arrivée facile pour les invités et les participants.",
    "Separate event entrance": "Entrée réservée aux événements",
    "Dedicated exterior access for venue guests.": "Accès extérieur dédié aux invités.",
    "Wi-Fi throughout the venue.": "Wi-Fi dans tout le bâtiment.",
    "Flexible room configurations": "Aménagements modulables",
    "Each room is set up to suit your format.": "Chaque salle est aménagée selon votre format.",
    "AV equipment available": "Équipement audiovisuel offert",
    "Projectors, screens and microphones for an additional charge.": "Projecteurs, écrans et microphones moyennant des frais.",
    "Recurring & multi-day bookings": "Réservations récurrentes et sur plusieurs jours",
    "Keep the same room on a regular schedule.": "Gardez la même salle selon un horaire régulier.",

    // Corporate
    "Your team’s space, whenever you need it": "L’espace de votre équipe, quand vous en avez besoin",
    "Book a room for a single session or set up a regular schedule. 1876 gives teams a dependable place outside the office for training, planning and recurring meetings, with free parking in Ottawa West.":
      "Réservez une salle pour une seule séance ou selon un horaire régulier. Le 1876 offre aux équipes un lieu fiable hors du bureau pour la formation, la planification et les réunions récurrentes, avec stationnement gratuit à Ottawa Ouest.",
    "Recurring weekly or monthly reservations": "Réservations hebdomadaires ou mensuelles",
    "Multi-day training and workshops": "Formations et ateliers sur plusieurs jours",
    "Flexible scheduling, subject to availability": "Horaire flexible, selon les disponibilités",
    "Professional room setups for each format": "Aménagement professionnel pour chaque format",
    "Preferred arrangements may be available for regular clients and multi-day bookings.":
      "Des conditions préférentielles peuvent être offertes aux clients réguliers et pour les réservations sur plusieurs jours.",
    "Corporate training providers": "Fournisseurs de formation en entreprise",
    "Local businesses": "Entreprises locales",
    "Professional associations": "Associations professionnelles",
    "Recruitment companies": "Firmes de recrutement",
    "Remote and hybrid teams": "Équipes à distance et hybrides",
    "Independent instructors": "Formateurs indépendants",
    "Workshop organizers": "Organisateurs d’ateliers",
    "Community organizations": "Organismes communautaires",

    // Ticker
    "Preferred arrangements for regular clients": "Conditions préférentielles pour les clients réguliers",
    "Discuss a recurring booking": "Discutons d’une réservation récurrente",

    // Event types (form labels; the submitted values stay in English)
    "Corporate meeting": "Réunion d’affaires",
    "Training session": "Séance de formation",
    Conference: "Conférence",
    "Seminar or workshop": "Séminaire ou atelier",
    Presentation: "Présentation",
    "Private event": "Événement privé",
    Celebration: "Célébration",
    "Recurring booking": "Réservation récurrente",
    "Venue tour": "Visite des lieux",
    Other: "Autre",

    // FAQ
    "Where is 1876 Banquets & Conference Center located?": "Où se trouve le 1876 Banquets & Conference Center ?",
    "We are located at 1876 Robertson Road in Bells Corners, Ottawa West, conveniently accessible from Nepean and Kanata.":
      "Nous sommes situés au 1876, chemin Robertson, à Bells Corners, dans l’ouest d’Ottawa, facilement accessibles depuis Nepean et Kanata.",
    "Is parking available?": "Le stationnement est-il offert ?",
    "Yes, free on-site parking is available for venue guests.": "Oui, le stationnement sur place est gratuit pour nos invités.",
    "Can I rent a room for corporate training?": "Puis-je louer une salle pour une formation en entreprise ?",
    "Yes, our spaces are suitable for corporate training, workshops, presentations and professional meetings.":
      "Oui, nos salles conviennent aux formations en entreprise, aux ateliers, aux présentations et aux réunions professionnelles.",
    "Is Wi-Fi included?": "Le Wi-Fi est-il inclus ?",
    "Yes, complimentary Wi-Fi is available.": "Oui, le Wi-Fi est gratuit.",
    "Is audiovisual equipment available?": "Offrez-vous de l’équipement audiovisuel ?",
    "AV equipment can be rented separately according to your event requirements.":
      "L’équipement audiovisuel peut être loué séparément selon les besoins de votre événement.",
    "Do you offer recurring bookings?": "Offrez-vous des réservations récurrentes ?",
    "Yes, recurring and multi-day booking arrangements are available.": "Oui, des réservations récurrentes et sur plusieurs jours sont possibles.",
    "Can I arrange a venue tour before booking?": "Puis-je visiter les lieux avant de réserver ?",
    "Contact our team to arrange a viewing and discuss your event requirements.":
      "Communiquez avec notre équipe pour organiser une visite et discuter des besoins de votre événement.",
    "Can the room layout be customized?": "Peut-on personnaliser l’aménagement de la salle ?",
    "Our spaces support flexible configurations depending on your event requirements and room availability.":
      "Nos salles se prêtent à différents aménagements selon les besoins de votre événement et la disponibilité des salles.",
    "How much does it cost to rent a meeting room?": "Combien coûte la location d’une salle de réunion ?",
    "Champlain Room rentals start at $50 per hour with a two-hour minimum. Contact us for pricing and availability for other spaces.":
      "La location de la salle Champlain commence à 50 $ l’heure, avec un minimum de deux heures. Communiquez avec nous pour les tarifs et les disponibilités des autres salles.",

    // Inquiry form
    "Tell us about your event": "Parlez-nous de votre événement",
    "Share a few details and we’ll reply with availability and a quote for your date":
      "Donnez-nous quelques détails et nous vous répondrons avec les disponibilités et une soumission pour votre date",
    "Not sure of the date or which room fits? Leave those open and we’ll recommend options based on your group and format.":
      "Vous ne connaissez pas encore la date ou la salle ? Laissez ces champs ouverts et nous vous proposerons des options selon votre groupe et votre format.",
    "Prefer email?": "Vous préférez le courriel ?",
    "Call us": "Appelez-nous",
    Visit: "Adresse",
    "Leave this field empty": "Laissez ce champ vide",
    Name: "Nom",
    Email: "Courriel",
    "Company / Organization": "Entreprise / organisme",
    Phone: "Téléphone",
    "Event date": "Date de l’événement",
    "I don’t have a date yet": "Je n’ai pas encore de date",
    "Approximate number of guests": "Nombre approximatif d’invités",
    "Preferred room": "Salle souhaitée",
    "Not sure yet": "Je ne sais pas encore",
    "Event type": "Type d’événement",
    "Select a type": "Choisir un type",
    Message: "Message",
    "Timing, room setup, AV needs, or anything else we should know": "Horaire, aménagement, besoins audiovisuels ou toute autre précision utile",
    Required: "Obligatoire",
    "We use the details you send only to reply to your inquiry and prepare a quote. We don’t sell your information or add you to a mailing list.":
      "Nous utilisons vos renseignements uniquement pour répondre à votre demande et préparer une soumission. Nous ne vendons pas vos renseignements et ne vous ajoutons à aucune liste d’envoi.",
    "Select a date": "Choisir une date",
    "Sending…": "Envoi en cours…",
    "Enter your name.": "Indiquez votre nom.",
    "Enter your email so we can reply.": "Indiquez votre courriel pour que nous puissions vous répondre.",
    "Enter an email address like name@example.com.": "Indiquez une adresse courriel comme nom@exemple.com.",
    "Please check the highlighted fields.": "Veuillez vérifier les champs indiqués.",
    "Too many inquiries in a short time. Please wait a few minutes, or email {email}.":
      "Trop de demandes en peu de temps. Veuillez patienter quelques minutes ou écrire à {email}.",
    "Your inquiry didn’t send. Check your connection and try again, or email {email}.":
      "Votre demande n’a pas été envoyée. Vérifiez votre connexion et réessayez, ou écrivez à {email}.",
    "Thank you for your inquiry. We’ve received your request and will be in touch shortly.":
      "Merci pour votre demande. Nous l’avons bien reçue et communiquerons avec vous sous peu.",
    "Need to add something? Email": "Un détail à ajouter ? Écrivez à",

    // Room pages
    Size: "Superficie",
    Setups: "Aménagements",
    Sections: "Sections",
    Pricing: "Tarifs",
    "Quoted for your date and timing": "Soumission selon votre date et votre horaire",
    "About the room": "À propos de la salle",
    "Equipment & amenities": "Équipement et services",
    Capacity: "Capacité",
    "Capacity by setup": "Capacité selon l’aménagement",
    Setup: "Aménagement",
    Guests: "Invités",
    "Typical setup": "Aménagement type",
    "{n} sq. ft. Shows a typical setup, not an exact floor plan. We arrange tables and seating to suit your event.":
      "{n} pi². Aménagement type, pas un plan exact. Nous disposons les tables et les places selon votre événement.",
    Photos: "Photos",
    "Other spaces at 1876": "Les autres salles du 1876",
    "Questions about booking": "Questions sur la réservation",
    "Request the {room}": "Disponibilités de la {room}",

    // Landing pages: shared
    Address: "Adresse",
    Parking: "Stationnement",
    "Free on site": "Gratuit sur place",
    "Wi-Fi": "Wi-Fi",
    Complimentary: "Gratuit",
    From: "À partir de",
    "Recommended rooms": "Salles recommandées",
    "Each room is set up for your format before you arrive": "Chaque salle est aménagée selon votre format avant votre arrivée",
    "Included and available": "Inclus et offert",
    "Also useful": "À voir aussi",
    "All spaces at 1876": "Toutes les salles du 1876",

    // Landing: meeting room rental
    "Meeting Room Rental in Ottawa West | 1876": "Location de salle de réunion à Ottawa Ouest | 1876",
    "Rent a private meeting room in Ottawa West by the hour, half-day or full day. Free parking and Wi-Fi at 1876 Robertson Road, Bells Corners. From $50/hour.":
      "Louez une salle de réunion privée à Ottawa Ouest à l’heure, à la demi-journée ou à la journée. Stationnement et Wi-Fi gratuits. À partir de 50 $/heure.",
    "Meeting Room Rental in Ottawa West": "Location de salle de réunion à Ottawa Ouest",
    "Private meeting rooms by the hour, half-day or full day, with free on-site parking and complimentary Wi-Fi at 1876 Robertson Road.":
      "Des salles de réunion privées à l’heure, à la demi-journée ou à la journée, avec stationnement gratuit sur place et Wi-Fi gratuit au 1876, chemin Robertson.",
    "A room that fits the meeting": "Une salle à la mesure de votre réunion",
    "Choose a room by the size and format of your group. The Champlain Room is set boardroom-style for interviews, client meetings and small working sessions. The Fitzroy Room suits larger team meetings and presentations, and a section of the Carlton Ballroom works when the whole department needs to be in one place.":
      "Choisissez une salle selon la taille et le format de votre groupe. La salle Champlain, aménagée en salle de conférence, convient aux entrevues, aux rencontres avec des clients et aux petites séances de travail. La salle Fitzroy accueille les réunions d’équipe plus importantes et les présentations, et une section de la salle de bal Carlton permet de réunir tout un service.",
    "Every room is set up before you arrive, so the meeting can start on time.": "Chaque salle est prête avant votre arrivée pour que la réunion commence à l’heure.",
    "Hourly, half-day and full-day rentals": "Location à l’heure, à la demi-journée ou à la journée",
    "Book only the time you need. Champlain Room rentals start at $50 per hour with a two-hour minimum. Prices are in CAD, before applicable taxes.":
      "Ne réservez que le temps nécessaire. La location de la salle Champlain commence à 50 $ l’heure, avec un minimum de deux heures. Prix en dollars canadiens, taxes applicables en sus.",
    "Hourly meeting room rental, two-hour minimum in the Champlain Room": "Location de salle de réunion à l’heure, minimum de deux heures pour la salle Champlain",
    "Half-day and full-day bookings for applicable spaces": "Réservations à la demi-journée ou à la journée pour les salles admissibles",
    "Recurring bookings for regular team meetings": "Réservations récurrentes pour les réunions d’équipe régulières",
    "AV equipment available for an additional charge": "Équipement audiovisuel offert moyennant des frais",
    "Easy for everyone to get to": "Facile d’accès pour tous",
    "We are on Robertson Road in Bells Corners, in Ottawa West. Guests coming from Nepean, Kanata or across Ottawa can park free on site and come straight in through the separate event entrance.":
      "Nous sommes sur le chemin Robertson, à Bells Corners, dans l’ouest d’Ottawa. Les invités venant de Nepean, de Kanata ou de partout à Ottawa se garent gratuitement sur place et entrent directement par l’entrée réservée aux événements.",
    "Can I book a meeting room for half a day or a full day?": "Puis-je réserver une salle de réunion pour une demi-journée ou une journée complète ?",
    "Yes, half-day and full-day options are available for applicable spaces. Tell us your date and timing and we'll confirm availability and pricing.":
      "Oui, des options à la demi-journée et à la journée sont offertes pour les salles admissibles. Indiquez-nous votre date et votre horaire, et nous confirmerons les disponibilités et les tarifs.",
    "Can I see the room before booking?": "Puis-je voir la salle avant de réserver ?",
    "Contact our team to arrange a viewing and discuss your meeting requirements.":
      "Communiquez avec notre équipe pour organiser une visite et discuter des besoins de votre réunion.",

    // Landing: corporate training
    "Corporate Training Space in Ottawa | 1876": "Salle de formation en entreprise à Ottawa | 1876",
    "Training room rental in Ottawa West for corporate courses, workshops and onboarding. Configurable layouts, free parking, Wi-Fi and multi-day bookings.":
      "Salle de formation à louer à Ottawa Ouest pour cours, ateliers et intégration. Aménagements modulables, stationnement et Wi-Fi gratuits, forfaits de plusieurs jours.",
    "Corporate Training Space in Ottawa": "Salle de formation en entreprise à Ottawa",
    "A dependable training room outside the office for courses, workshops and onboarding, with configurable layouts and free parking for every attendee.":
      "Une salle de formation fiable hors du bureau pour vos cours, ateliers et séances d’intégration, avec aménagements modulables et stationnement gratuit pour chaque participant.",
    "Set up for learning": "Aménagée pour apprendre",
    "Training works best when the room fits the format. We can set the Fitzroy Room or a section of the Carlton Ballroom classroom-style for instructor-led courses, with tables in groups for hands-on workshops, or theatre-style for a presentation.":
      "Une formation réussit mieux quand la salle convient au format. Nous pouvons aménager la salle Fitzroy ou une section de la salle de bal Carlton en salle de classe pour les cours magistraux, en îlots pour les ateliers pratiques, ou en théâtre pour une présentation.",
    "Tell us how your day runs, including breaks and any group work, and we'll suggest a setup.":
      "Décrivez-nous le déroulement de votre journée, y compris les pauses et le travail en groupe, et nous vous proposerons un aménagement.",
    "Built for multi-day and repeat courses": "Pensée pour les formations de plusieurs jours et les cours répétés",
    "Many training programs run over several days or repeat through the year. Book consecutive days or a recurring schedule, subject to availability, and keep the same room so attendees always know where to go.":
      "Beaucoup de programmes de formation durent plusieurs jours ou reviennent au fil de l’année. Réservez des jours consécutifs ou un horaire récurrent, selon les disponibilités, et gardez la même salle pour que les participants sachent toujours où aller.",
    "Preferred arrangements may be available for multi-day and recurring bookings.":
      "Des conditions préférentielles peuvent être offertes pour les réservations sur plusieurs jours et récurrentes.",
    "Independent instructors and certification courses": "Formateurs indépendants et cours de certification",
    "Onboarding and recruitment days": "Journées d’intégration et de recrutement",
    "Professional association workshops": "Ateliers d’associations professionnelles",
    "In-house team training": "Formation interne des équipes",
    "Do you offer multi-day bookings?": "Offrez-vous des réservations sur plusieurs jours ?",

    // Landing: conference venue
    "Conference Venue in Ottawa West | 1876": "Salle de conférence à Ottawa Ouest | 1876",
    "A flexible conference venue in Ottawa West. The 1,965 sq. ft. Carlton Ballroom divides into three sections, with breakout rooms, free parking and Wi-Fi.":
      "Salle de conférence modulable à Ottawa Ouest : la salle de bal Carlton (1 965 pi²) se divise en trois sections. Salles annexes, stationnement et Wi-Fi gratuits.",
    "Flexible Conference Venue in Ottawa West": "Salle de conférence modulable à Ottawa Ouest",
    "Host a conference, seminar or company meeting in the 1,965 sq. ft. Carlton Ballroom, with smaller rooms nearby for breakouts.":
      "Organisez une conférence, un séminaire ou une réunion d’entreprise dans la salle de bal Carlton de 1 965 pi², avec de plus petites salles à proximité pour les sous-groupes.",
    "One ballroom, three sections": "Une salle de bal, trois sections",
    "The Carlton Ballroom can be used as one room or divided into three sections. Open it fully for a keynote and plenary sessions, or book a single section for a smaller seminar.":
      "La salle de bal Carlton s’utilise en une seule salle ou divisée en trois sections. Ouvrez-la entièrement pour une conférence principale et des séances plénières, ou réservez une seule section pour un séminaire plus restreint.",
    "Round tables work well for sessions with discussion, and rows of chairs facing the screens suit presentations.":
      "Les tables rondes conviennent aux séances avec discussion, et les rangées de chaises face aux écrans, aux présentations.",
    "Breakout rooms in the same building": "Des salles annexes dans le même bâtiment",
    "The Fitzroy and Champlain Rooms can be booked alongside the ballroom for breakout sessions, interviews, speaker preparation or a quiet working room, subject to availability.":
      "Les salles Fitzroy et Champlain peuvent être réservées en plus de la salle de bal pour des séances en sous-groupes, des entrevues, la préparation des conférenciers ou une salle de travail au calme, selon les disponibilités.",
    "Conference essentials": "L’essentiel pour une conférence",
    "Complimentary Wi-Fi for attendees": "Wi-Fi gratuit pour les participants",
    "Projectors, screens and microphones for an additional charge": "Projecteurs, écrans et microphones moyennant des frais",
    "Separate event entrance and free on-site parking": "Entrée réservée aux événements et stationnement gratuit sur place",
    "Layouts configured for your program": "Aménagements adaptés à votre programme",
    "Planning your conference": "Planifier votre conférence",
    "Send us your date, an approximate attendance and the format of your day. We'll confirm availability, recommend a room setup and prepare a quote.":
      "Envoyez-nous votre date, le nombre approximatif de participants et le format de votre journée. Nous confirmerons les disponibilités, recommanderons un aménagement et préparerons une soumission.",
    "Can the Carlton Ballroom be divided?": "La salle de bal Carlton peut-elle être divisée ?",
    "Yes, the Carlton Ballroom can be divided into three sections.": "Oui, la salle de bal Carlton peut être divisée en trois sections.",

    // Landing: event space Nepean
    "Event Space in Nepean & Ottawa West | 1876": "Salle d’événements à Nepean et Ottawa Ouest | 1876",
    "Private event space in Nepean and Ottawa West for celebrations, receptions and company events. Configurable rooms and free on-site parking at 1876 Robertson Road.":
      "Salle pour événements privés à Nepean et Ottawa Ouest : célébrations, réceptions et événements d’entreprise. Salles modulables et stationnement gratuit sur place.",
    "Event Space in Nepean & Ottawa West": "Salle d’événements à Nepean et Ottawa Ouest",
    "Private event space in Bells Corners for celebrations, receptions and company gatherings, with free parking on site.":
      "Une salle pour événements privés à Bells Corners : célébrations, réceptions et rencontres d’entreprise, avec stationnement gratuit sur place.",
    "Private events and celebrations": "Événements privés et célébrations",
    "Mark a milestone, host a family celebration or bring the company together at the end of the year. The Carlton Ballroom can be set with round or rectangular tables for a seated gathering, and the Fitzroy Room suits smaller groups.":
      "Soulignez une étape importante, organisez une fête de famille ou réunissez l’entreprise en fin d’année. La salle de bal Carlton peut être aménagée avec des tables rondes ou rectangulaires pour un repas assis, et la salle Fitzroy convient aux groupes plus restreints.",
    "Tell us about your plans and we'll confirm what the venue can accommodate on your date.":
      "Parlez-nous de vos projets et nous confirmerons ce que le lieu peut accueillir à votre date.",
    "Company and community events": "Événements d’entreprise et communautaires",
    "Professional associations, community organizations and businesses use event space for annual meetings, networking evenings, awards and information sessions. Book the full ballroom or a single section, depending on your group.":
      "Associations professionnelles, organismes communautaires et entreprises ont besoin d’espace pour leurs assemblées annuelles, soirées de réseautage, remises de prix et séances d’information. Réservez la salle de bal entière ou une seule section, selon votre groupe.",
    "Convenient for guests across the west end": "Pratique pour les invités de tout l’ouest de la ville",
    "We are at 1876 Robertson Road in Bells Corners, easy to reach from Nepean, Kanata and across Ottawa. Guests park free on site and use the venue's separate event entrance.":
      "Nous sommes au 1876, chemin Robertson, à Bells Corners, facile d’accès depuis Nepean, Kanata et tout Ottawa. Les invités se garent gratuitement sur place et utilisent l’entrée réservée aux événements.",

    // Landing: recurring
    "Recurring Meeting & Training Space in Ottawa | 1876": "Salle de réunion et de formation récurrente à Ottawa | 1876",
    "Book a regular meeting or training room in Ottawa West, weekly, monthly or for multi-day programs. Ask about preferred arrangements. Free parking and Wi-Fi.":
      "Réservez une salle de réunion ou de formation à Ottawa Ouest chaque semaine, chaque mois ou sur plusieurs jours. Stationnement et Wi-Fi gratuits.",
    "Recurring Meeting & Training Space for Ottawa Teams": "Salle de réunion et de formation récurrente pour les équipes d’Ottawa",
    "Set up a regular schedule for meetings, training or classes, and come back to the same room each time.":
      "Établissez un horaire régulier pour vos réunions, formations ou cours, et retrouvez la même salle à chaque fois.",
    "A regular room without a lease": "Une salle régulière, sans bail",
    "Book a room on a schedule that suits your team, whether that is weekly, every other week or once a month, without committing to permanent office space. Scheduling is flexible, subject to availability.":
      "Réservez une salle selon l’horaire de votre équipe, chaque semaine, aux deux semaines ou une fois par mois, sans vous engager dans un bureau permanent. L’horaire est flexible, selon les disponibilités.",
    "Preferred arrangements may be available for regular clients.": "Des conditions préférentielles peuvent être offertes aux clients réguliers.",
    "Recurring bookings suit": "Les réservations récurrentes conviennent aux",
    "Remote and hybrid teams that meet in person": "Équipes à distance et hybrides qui se réunissent en personne",
    "Training providers running regular courses": "Fournisseurs de formation qui donnent des cours réguliers",
    "Professional associations and their monthly meetings": "Associations professionnelles et leurs réunions mensuelles",
    "Recruitment companies holding interview days": "Firmes de recrutement qui tiennent des journées d’entrevues",
    "Independent instructors and workshop organizers": "Formateurs indépendants et organisateurs d’ateliers",
    "How it works": "Comment ça fonctionne",
    "Tell us your schedule, group size and the format of your sessions.": "Indiquez-nous votre horaire, la taille du groupe et le format de vos séances.",
    "We confirm availability and recommend a room and setup.": "Nous confirmons les disponibilités et recommandons une salle et un aménagement.",
    "We agree on terms for the series, including any preferred arrangements.": "Nous convenons des conditions pour la série, y compris les éventuelles conditions préférentielles.",
    "Your room is ready each time you arrive.": "Votre salle est prête à chacune de vos arrivées.",
    "Are there special rates for regular clients?": "Y a-t-il des tarifs particuliers pour les clients réguliers ?",
    "Preferred arrangements may be available for recurring and multi-day bookings. Contact us with your schedule and we'll prepare a quote.":
      "Des conditions préférentielles peuvent être offertes pour les réservations récurrentes et sur plusieurs jours. Envoyez-nous votre horaire et nous préparerons une soumission.",

    // Inquiry received
    "Inquiry received | 1876": "Demande reçue | 1876",
    "Thank you for your inquiry.": "Merci pour votre demande.",
    "Thank you for your inquiry": "Merci pour votre demande",
    "We’ve received your request and will be in touch shortly.": "Nous l’avons bien reçue et communiquerons avec vous sous peu.",
    "Back to the homepage": "Retour à l’accueil",
  },
};

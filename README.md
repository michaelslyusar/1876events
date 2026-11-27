# 1876events.ca

Website for 1876 Banquets & Conference Center. Static HTML/CSS/JS built by a short Node script (no dependencies), plus one serverless function on Vercel for the inquiry form.

```
npm run dev      # build and preview at http://localhost:4173 (the form works too)
npm run build    # build into dist/
npm run check    # build, then check every page (headings, links, SEO tags, JSON-LD, sitemap, form handler)
```

Requires Node 18 or newer.

## Where things live

| What | File |
| --- | --- |
| Contact details, address, map links, pricing, rooms, amenities, FAQ, navigation, analytics IDs | `src/content.mjs` |
| Landing pages (meeting rooms, training, conferences, events, recurring bookings) | `src/pages.mjs` |
| French translations and URLs / the `t()` translator | `src/i18n/fr.mjs` / `src/translator.mjs` |
| Page markup and components | `src/template.mjs` |
| Room setup diagrams | `src/plan.mjs` |
| Styles / behaviour (menu, form, tracking) | `public/styles.css` / `public/main.js` |
| Inquiry form handler | `api/inquiry.js`, `api/_inquiry.js` |
| Photo processing | `scripts/optimize_images.py` |

## Pages

The build writes one page per entry, adds every indexable page to `sitemap.xml`, and links them from the footer.

- `/` homepage
- `/spaces/champlain/`, `/spaces/fitzroy/`, `/spaces/carlton-ballroom/` (one per room in `rooms`)
- `/meeting-room-rental-ottawa/`, `/corporate-training-space-ottawa/`, `/conference-venue-ottawa/`, `/event-space-nepean/`, `/recurring-meeting-space-ottawa/` (one per entry in `pages.mjs`)
- `/inquiry-received/` (shown after a form is sent without JavaScript; not indexed)
- `/404.html`

## Languages (English and French)

Every page is built in English and French (`/fr/…`), linked with `hreflang` and a language switch in the header.

- All visible text goes through `t()` from `src/translator.mjs`. The English text is the key; French translations live in `src/i18n/fr.mjs` (`strings`), and French URLs in `paths`.
- When you change or add English text, add or update the same key in `fr.mjs`. `npm run build` lists every string still missing a French translation (it shows in English until translated).
- `t()` also keeps short words (a, the, of, à, de, la…) on the same line as the next word, so lines never end on a dangling preposition, and adds French spacing before `? ! : ;`.
- The address and business name stay in English in both languages, to match the Google Business Profile.
- Inquiries sent from French pages arrive marked "(FR)" with "Language: French (reply in French)".

## Updating room information

Edit the room in `src/content.mjs > rooms`. Size, description, setups, equipment and pricing appear on the homepage, the room page and the structured data. The setup diagram redraws from `sqft` and `shape`.

Guest capacities are left out until management confirms them. To publish them, fill in `capacities`, e.g. `[{ setup: "Theatre", guests: 60 }]`, and a capacity table appears on the room page.

## Adding photos

1. Put the original JPEG (about 1800 px wide or larger) in `assets/photos/`. Name it by what it shows, in lowercase with hyphens, e.g. `fitzroy-workshop-setup.jpg`.
2. Run `npm run photos` (needs Python with `pip install pillow`). It writes WebP and JPEG sizes into `public/images/`, a 1200 × 630 share image into `public/images/og/`, and the sizes into `src/photos.json`.
3. Use the photo in `src/content.mjs` by its name without `.jpg`, with alt text that describes what it actually shows:
   - in a room's gallery: `gallery: [{ file: "fitzroy-workshop-setup", alt: "Fitzroy Room with tables set for a workshop" }]`
   - as a room's main photo (`image`), in the homepage collage (`images.hero`), or as a landing page's photo (`image` in `pages.mjs`)
4. Run `npm run check`, then commit `assets/photos/`, `public/images/` and `src/photos.json`.

Only use real photos of the venue.

## Inquiry form

The form posts to `/api/inquiry`, which validates the inquiry and emails it through [Resend](https://resend.com). It shows the thank-you message only after the email is accepted. It also works without JavaScript.

Spam protection: a hidden honeypot field, a minimum time on the form, a per-address rate limit (5 inquiries in 10 minutes), duplicate suppression and, optionally, Cloudflare Turnstile.

### Environment variables (Vercel > Project > Settings > Environment Variables)

| Variable | Required | Value |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | API key from Resend |
| `INQUIRY_FROM` | yes | Sender on a domain verified in Resend, e.g. `1876 Website <inquiries@1876events.ca>` |
| `INQUIRY_TO` | no | Recipient; defaults to `site.email` (`events.1876@owomanagement.ca`) |
| `TURNSTILE_SECRET_KEY` | no | Turns on Cloudflare Turnstile; also set `site.form.turnstileSiteKey` |
| `CRM_WEBHOOK_URL` | no | Each inquiry is also POSTed here as JSON (for a CRM or Zapier/Make) |

Resend setup: create an account, add the domain `1876events.ca`, add the DNS records it shows, then create an API key. Inquiries come with Reply-To set to the visitor, so replying goes straight to them.

Locally, without `RESEND_API_KEY`, `npm run dev` prints inquiries to the terminal instead of emailing them.

## Analytics and Search Console

Nothing is loaded until an ID is set in `src/content.mjs > site.analytics`.

**Google Search Console:** add the domain property `1876events.ca` and verify it with the DNS TXT record (recommended; nothing to change here). Or use the URL-prefix property with the HTML tag method and paste the `content` value into `googleSiteVerification`. Then submit `https://www.1876events.ca/sitemap.xml` under Sitemaps.

**Google Analytics 4:** create a GA4 property and a web data stream for `https://www.1876events.ca`, and paste the Measurement ID (`G-…`) into `ga4Id`. In GA4, mark `generate_lead` as a key event.

Events sent (no form contents or personal details):

| Event | When |
| --- | --- |
| `generate_lead` | an inquiry is accepted by the server |
| `request_quote_click` | any "Request Availability" link (with `cta_location`) |
| `recurring_booking_click` | any "Discuss a Recurring Booking" link |
| `email_click` | a mailto link |
| `directions_click` | Get Directions / Google Maps links |
| `room_view` | a room page is opened (with `room`) |

**Google Ads (later):** set `adsId` (`AW-…`) and `adsLeadLabel`; a successful inquiry then also sends the Ads conversion.

**Consent:** `site.analytics.consent` sets Google Consent Mode defaults (ads storage off by default). If you need a consent banner for your audience, add one before turning on Ads.

**UTM links:** add `?utm_source=…&utm_medium=…&utm_campaign=…` to links you share, e.g. the Google Business Profile website link: `https://www.1876events.ca/?utm_source=google&utm_medium=organic&utm_campaign=gbp`. GA4 records them, and the inquiry email includes them.

## Deploy

Vercel builds the site from `vercel.json` (`npm run build`, output `dist/`) and deploys `api/` as a function. Pushing a branch creates a preview deployment; merging to `main` updates the live site. `vercel.json` also adds a trailing slash to page URLs, security headers and caching for fonts and images.

The canonical domain is `https://www.1876events.ca` (`site.domain`). Keep the apex domain redirecting to `www` in Vercel's domain settings.

Fonts (Hanken Grotesk, Newsreader) are self-hosted in `public/fonts/` under the SIL Open Font License.

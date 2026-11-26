# 1876events.ca

One-page website for 1876 Banquets & Conference Center. Static HTML/CSS/JS with no dependencies. A short Node script builds it into `dist/`.

## Edit content

Everything you would normally change is in **`src/content.mjs`**: email, phone, address, Google Maps links, social links, form endpoint, pricing, room details, features and SEO text.

Layout and markup are in `src/template.mjs`, styles in `public/styles.css`, and behaviour (menu, form, sticky mobile button) in `public/main.js`.

## Photos

Put master photos (JPEG, about 1800px wide) in `assets/photos/` using these file names, then run `python scripts/optimize_images.py` (needs `pip install pillow`). It writes WebP and JPEG copies at several widths into `public/images/`, and the page serves the right size for each screen. Until a photo exists, a labelled placeholder shows in its place.

| File | Where it appears |
| --- | --- |
| `hero-exterior.jpg`, `hero-table.jpg`, `hero-classroom.jpg`, `hero-screen.jpg` | Hero collage (set in `images.hero`; photos are cropped to fit) |
| `champlain-room.jpg`, `fitzroy-room.jpg`, `carlton-ballroom.jpg` | Room rows (3:2) |
| `og-image.jpg` | Link preview when the site is shared (1200 × 630) |

`og-image.jpg` and the logo PNGs live directly in `public/images/`. When you add a photo, update its `alt` text in `content.mjs` to describe what it actually shows.

## Inquiry form

Set `formEndpoint` in `src/content.mjs` to a form service URL (Formspree, Getform, Basin and similar). The form posts its fields and shows the confirmation message when the service accepts them.

While `formEndpoint` is empty, submitting opens the visitor's email app with the inquiry pre-filled to `events.1876@owomanagement.ca`.

## Run locally

```
npm run dev      # builds and serves http://localhost:4173
npm run build    # builds dist/
```

Requires Node 18 or newer.

## Deploy

- **Netlify:** connect the repo. `netlify.toml` sets the build command and `dist` output.
- **Vercel:** connect the repo. `vercel.json` sets the build command and `dist` output.
- **Cloudflare Pages:** build command `npm run build`, output directory `dist`.

Then point `1876events.ca` at the host. The canonical URL, Open Graph tags, `sitemap.xml` and `robots.txt` all use `site.domain` from `content.mjs`.

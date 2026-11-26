# 1876events.ca

One-page website for 1876 Banquets & Conference Center. Static HTML/CSS/JS with no dependencies. A short Node script builds it into `dist/`.

## Edit content

Everything you would normally change is in **`src/content.mjs`**: email, phone, address, Google Maps links, social links, form endpoint, pricing, room details, features, gallery photos and SEO text.

Layout and markup are in `src/template.mjs`, styles in `public/styles.css`, and behaviour (menu, form, sticky mobile button) in `public/main.js`.

## Photos

Put photos in `public/images/` using these file names. Until a file exists, a labelled placeholder shows in its place.

| File | Where it appears |
| --- | --- |
| `hero.jpg` | Hero (4:3) |
| `champlain-room.jpg`, `fitzroy-room.jpg`, `carlton-ballroom.jpg` | Room rows (3:2) |
| `gallery-01.jpg` … `gallery-09.jpg` | Gallery (cropped to fit) |
| `og-image.jpg` | Link preview when the site is shared (1200 × 630) |

Export photos about 2000px on the long edge and compress them (JPEG quality ~75, or WebP with matching names updated in `content.mjs`). When you add a photo, update its `alt` text in `content.mjs` to describe what it actually shows.

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

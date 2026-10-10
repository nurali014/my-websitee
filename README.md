# Proven AI — AI Automation Agency Website

A fast, responsive, single-page marketing site for an AI automation agency. Plain HTML/CSS/JS — no build step.

## Sections
Hero with live workflow mockup · tool logos · animated stats · services · case studies · process · testimonials · interactive ROI calculator · pricing + ROI guarantee · FAQ · contact form.

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Customize before launch
- **Brand name** — replace "Proven AI" in `index.html` (title, logo, footer).
- **Numbers, case studies, testimonials, pricing** — the current ones are sample content. Replace them with your real client results and quotes (with permission).
- **Contact form** — in `script.js`, set `CONTACT_EMAIL`, and optionally `FORM_ENDPOINT` (e.g. a Formspree URL) to receive submissions directly instead of opening the visitor's email app.
- **Colors** — edit the CSS variables at the top of `styles.css` (`--primary`, `--primary-2`).

## Deploy
Any static host works: GitHub Pages (Settings → Pages → deploy from this branch), Netlify, Vercel, or Cloudflare Pages.

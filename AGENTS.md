# AGENTS.md — Prose Ads Website

## Architecture

- `index.html` — the entire site. Single page, anchored sections (`#services`, `#founding`, `#why`, `#process`, `#pricing`, `#faq`, `#contact`). Edit copy here.
- `styles.css` — all styling. CSS variables at `:root` control palette/type. Mobile breakpoint 640px, tablet 1000px.
- `app.js` — mobile nav toggle, IntersectionObserver reveals, FAQ uses native `<details>`, contact form POSTs JSON to `/.netlify/functions/contact` and swaps to a thank-you state.
- `netlify/functions/contact.mts` — validates (all fields, email regex), inserts into `enquiries`, returns 201. Falls back to `{ok:true, stored:false}` if the DB isn't migrated yet so conversion never breaks.
- `db/schema.ts` + `db/index.ts` — Drizzle schema/client (`drizzle-orm/netlify-db`; connection is automatic, no connection string).
- `drizzle.config.ts` — `out` must stay `./netlify/database/migrations` for auto-apply on deploy.
- `netlify.toml` — publish root `.`, functions dir, security + cache headers.

## Conventions

- Static-first: no framework, no build. Keep total JS small; prefer CSS and native HTML (`<details>` for FAQ).
- Tone: confident, friendly, results-driven, short sentences. CTAs point to `#contact`.
- Colors: paper `#faf7f1`, ink `#101014`, accent coral `#ff4d24`, gold `#f5b301` for stats/stars.
- Fonts via Google Fonts (Fraunces + DM Sans). Never use emojis in UI; icons are inline SVG.
- Accessibility: skip link, labelled navs, `role="status/alert"` on form states, visible focus styles.

## Non-obvious decisions

- Template scaffold was unreachable (GitHub clone failed), so the project is hand-built static rather than TanStack Start. This is intentional and keeps load times minimal.
- Contact persistence uses Netlify Database (Postgres), not Netlify Forms or JSON files, per platform data-storage rules. The function's try/catch fallback exists because the DB provisions on first connection — the form must convert even on the very first deploy.
- Contact details: no email or phone is published on the site yet — the enquiry form is the contact channel until the real WhatsApp number and email are added. Social links: Instagram (@dave_leadgen) and LinkedIn (David Chibuike) are live in the footer + contact section; X and TikTok still pending their profile URLs.
- Pricing has a ₦ / $ toggle (see `app.js` `setCurrency`); amounts live in `data-ngn` / `data-usd` attributes on `.price-amount .amount`.
- The Results section was replaced by a Founding Offer section (`#founding`): 5 founding places at founding rates in exchange for a public case study. Real testimonials from the first run of the agency go here when they arrive — see the TODO comment in `index.html`.
- Logo is an inline SVG gradient monogram (coral → gold "P") in the header and footer; the favicon is still the flat coral "P".
- No `<img>` tags: visuals are CSS/SVG for speed. If photos are added later, give every one `alt` text, explicit dimensions, and `loading="lazy"`.
- Contact details were realistic placeholders (hello@proseads.agency, +1 (415) 555-0132, Austin TX). They have been removed from the site; add the real ones before production.

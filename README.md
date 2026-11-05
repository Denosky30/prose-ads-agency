# Prose Ads — Advertising Agency Website

A fast, mobile-first single-page site for **Prose Ads**, an advertising agency in Nigeria that helps ecommerce brands in Nigeria, Europe and worldwide grow with paid ads and creative campaigns. Every section drives toward one action: booking a free ads audit.

## What it is

- Single-page marketing site (`index.html`) with Hero, Trust bar, Services, Founding Offer, Why Choose Us, Process, Pricing, FAQ, and Final CTA + Contact
- Contact form posts to a Netlify Function (`netlify/functions/contact.mts`) and shows an inline thank-you message
- Enquiries persist in Netlify Database (managed Postgres) via Drizzle ORM; migration in `netlify/database/migrations/`
- No build step — static HTML/CSS/JS served directly, styled with a premium editorial look (Fraunces display + DM Sans body, coral `#ff4d24` accent)

## Tech

- Plain HTML, CSS, vanilla JS (no framework, minimal JS for nav, scroll reveals, FAQ, form submit)
- Netlify Functions (Web Request/Response format, `.mts`)
- Netlify Database + Drizzle ORM (`drizzle-orm@beta`, `drizzle-kit@beta`)

## Run locally

No install needed for the site itself — open `index.html` or serve the folder:

```bash
npx serve .
```

For functions + database emulation:

```bash
npm install
netlify dev --port 8889
```

Then open http://localhost:8889 and submit the contact form.

## Database

Schema lives in `db/schema.ts` (`enquiries` table). After any schema change:

```bash
npx drizzle-kit generate --name describe_the_change
```

Migrations in `netlify/database/migrations/` apply automatically on deploy.

## Contact details on the site

No email address or phone number is published yet — the enquiry form (saved to Netlify Database) is the contact channel until the real ones are added. Still to add: real WhatsApp number, X profile URL, and real testimonials from the first run of the agency. Instagram (@dave_leadgen) and LinkedIn (David Chibuike) are live in the footer + contact section.


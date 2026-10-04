# SavannaCode

Software and AI engineering website for a Kenyan business. Its page structure follows the supplied Codersarts reference, with original SavannaCode branding and copy.

## Business details

Edit `lib/site-config.ts` to update the site name, public email, phone, or WhatsApp link. The configured email also identifies the inbox administrator after verified ChatGPT sign-in.

- Email: fawcetteugene@gmail.com
- Phone / WhatsApp: +254 794 689 731
- Location: Kenya

## Included

- Responsive home page and accessible desktop and mobile navigation.
- Twelve service pages, eighteen technology pages, searchable directories, category filters, and technology pagination.
- Nine project guides with downloadable Markdown briefs and four original articles.
- Startup, business, and developer solution pages; company, process, research, learning, careers, and FAQ pages.
- Project inquiry and session request forms with validation, duplicate prevention, basic throttling, consent, and durable D1 storage.
- Customer account and owner inbox with request status management.
- Direct email, phone, and WhatsApp links throughout the site.
- Privacy and service terms describing the actual implementation.

## Run locally

Requires Node 22.13 or newer. The project uses npm and the included lockfile.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

The starter's original README documents local D1 migration setup. Apply the generated SQL before exercising the forms. Production migrations in `drizzle/` are included in the Sites deployment package.

```sh
npx tsc --noEmit
npm run build
```

## Operating the site

Sign in at `/account` using the business email above to review all inquiries and mark them as in review, contacted, or closed. Other signed-in customers see only requests connected to their account or verified email.

Booking submissions are pending requests. They do not reserve a live calendar slot, take payment, or automatically send email. Arrange availability and pricing with the customer. WhatsApp and email buttons open the corresponding communication app.

The site starts as a private Sites preview. Its sharing settings must be changed to public before customers can visit. The project has its own Sites source repository; it does not write to the parent workspace's read-only Git metadata.

## Content

Directory records, project guides, articles, and FAQs live in `lib/content.ts`. Routes and supporting pages are in `app/[...slug]/page.tsx`. No customer testimonials, team biographies, business registrations, or historical results are invented.

This is a new implementation of the main public journeys, not a copy of the reference company's private systems, full article archive, external products, or Wix infrastructure. The only account provider currently integrated is Sign in with ChatGPT.

## WebMCP

The search page optionally exposes `search_savannacode` when the browser supports `document.modelContext`. It updates the same search input and results shown in the interface, and does not submit forms. Normal site behavior does not depend on this browser feature.

# SavannaCode

Software and AI engineering website for a Kenyan business. Its page structure follows the supplied Codersarts reference, with original SavannaCode branding and copy.

## Business details

Edit `lib/site-config.ts` to update the site name, public email, phone, or WhatsApp link. The configured email also identifies the inbox administrator after verified ChatGPT sign-in.

- Email: fawcetteugene@gmail.com
- Phone / WhatsApp: +254 794 689 731
- Location: Kenya
- Blog: https://medium.com/@fawcetteugene

## Included

- Responsive home page and accessible desktop and mobile navigation.
- Thirteen service pages, including M-Pesa integration, eighteen technology pages, searchable directories, category filters, and shareable technology pagination links.
- Nine project guides with downloadable Markdown briefs and four original guides. Blog navigation and `/blog` lead to the owner’s Medium profile.
- Startup, business, developer, researcher, and company solution pages; company, process, research, learning, careers, community groups, pricing, and FAQ pages.
- Eleven 1:1 session types with detail pages and booking-request calendars. Session requests store a preferred date, time, and timezone.
- Project inquiry and session request forms with visible validation messages, request timeouts, duplicate prevention, basic throttling, consent, and durable D1 storage.
- Customer account and owner inbox with request status management.
- Direct email, phone, and WhatsApp links throughout the site.
- Privacy, terms, pricing policy, and refund policy pages describing the actual implementation.

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

M-Pesa integration is a service offered to clients. It is featured on the homepage, services menu and directory, footer, search, and inquiry form. The service description refers to [Safaricom Daraja](https://developer.safaricom.co.ke/); this website does not collect M-Pesa payments.

This is a new implementation of the main public journeys, not a copy of the reference company's private systems, full article archive, external products, or Wix infrastructure. The only account provider currently integrated is Sign in with ChatGPT.

Out of scope for the current public site (tracked as later phases if needed): live calendar reservation and online payment, native file uploads, expert/customer project dashboards beyond the inquiry inbox, full CMS admin, community posting/moderation, and native job application tracking.

## WebMCP

The search page optionally exposes `search_savannacode` when the browser supports `document.modelContext`. It updates the same search input and results shown in the interface, and does not submit forms. Normal site behavior does not depend on this browser feature.

## Navigation

Site links use standard browser navigation. This preserves direct links, browser history, keyboard activation, downloads, and new-tab behavior, and avoids a client-router navigation failure in the bundled Vinext beta. Technology pagination links retain their page and active search filters.

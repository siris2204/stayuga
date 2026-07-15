# Stayuga

Luxury villa & farmhouse booking platform. MERN stack (MongoDB, Express, Next.js/React, Node) — Phase 1: core platform (public site, booking inquiries, admin dashboard), running locally.

## Structure

```
client/   Next.js 15 (App Router, TypeScript, Tailwind CSS) — public site + admin dashboard
server/   Node.js + Express + MongoDB (Mongoose), TypeScript — API
```

## Prerequisites

- Node.js (installed via `brew install node`)
- MongoDB Community running locally (`brew services start mongodb/brew/mongodb-community`)

## Setup

```bash
npm install                 # installs both client and server workspaces
cp server/.env.example server/.env   # already done; edit values as needed
npm run seed                # seeds 3 sample properties, 2 experiences, FAQs, policies, and an admin user
npm run dev                 # runs server (:4000) and client (:3000) together
```

Visit:
- Public site: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin/login — `admin@stayuga.com` / `Stayuga@123` (from seed)

## What's implemented (Phase 1)

- Public pages: home, listings with filters, property detail (gallery, amenities, map, booking inquiry), about, experiences, contact, FAQ, policy pages
- Booking inquiry flow (no live payment — admin confirms manually) and contact/lead capture, both wired to MongoDB
- Admin dashboard: login (JWT), property CRUD with image upload, booking status management, lead management, lightweight CMS for homepage/about copy, FAQs, and policy pages
- WhatsApp click-to-chat links (no API key required)
- SEO: per-page metadata, `sitemap.xml`, `robots.txt`, JSON-LD on property pages

## Explicitly deferred

Live Razorpay payments, WhatsApp Business API, Resend transactional email, Cloudinary image storage, Google Analytics/Search Console, and production hosting (Nginx, PM2, Ubuntu, Cloudflare, SSL). The server is structured so each of these swaps in behind a single service file — see `server/src/services/` and `server/.env.example`.

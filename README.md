# Stayuga

Luxury villa & farmhouse booking platform built on the MERN stack — Next.js 16 frontend, Express + MongoDB backend, TypeScript throughout.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT — role-based (admin vs owner) |
| Validation | Zod v4 (client + server) |
| Animations | Framer Motion |
| Calendar | date-fns |
| Image storage | Cloudinary (falls back to local disk when `CLOUDINARY_URL` is unset) |
| E2E testing | Playwright |

## Project Structure

```
stayuga/
├── client/   Next.js app — public site + admin dashboard + owner portal
└── server/   Express API + MongoDB models
```

## Architecture

npm workspaces monorepo — `client` and `server` are independently deployed apps that talk over HTTP; nothing is shared at the code level.

```
┌────────────────────────┐        REST / JSON over HTTPS        ┌───────────────────────────┐
│  client (Next.js 16)   │  ───────────────────────────────────▶ │  server (Express)         │
│  Vercel                │  ◀─────────────────────────────────── │  Railway                  │
│                        │        Bearer JWT (admin/owner)        │                           │
│  Server components ──┐ │                                        │  routes/*.routes.ts       │
│   fetch API at render │ │                                        │   → middleware/auth.ts    │
│  Client components ──┘ │                                        │   → Mongoose models       │
│   lib/api.ts:apiFetch  │                                        │                           │
└────────────────────────┘                                        └─────────────┬─────────────┘
                                                                                  │
                                                                       ┌──────────▼──────────┐
                                                                       │  MongoDB Atlas      │
                                                                       └─────────────────────┘
                                                          server/uploads (local disk, dev)
                                                          or Cloudinary (production) ◀── multer memory storage
```

**Client (`client/src`)**
- `app/` — Next.js App Router routes: public site, `/admin`, `/owner`, each with their own layout
- `lib/api.ts` — single `apiFetch<T>()` wrapper around `fetch`: injects the `Authorization: Bearer` header, sets a 10s timeout, and normalizes error responses into `ApiRequestError`
- `context/AdminAuthContext.tsx` / `OwnerAuthContext.tsx` — hold the JWT (in memory + storage) and expose it to client components; server components fetch directly with no auth for public data
- `components/` — grouped by feature area (`admin`, `owner`, `properties`, `home`, …), not by type

**Server (`server/src`)**
- `app.ts` — mounts one router per resource under `/api/*`; no shared "God router"
- `routes/*.routes.ts` — thin HTTP layer: validates with Zod (`middleware/validate.ts`), delegates to Mongoose models directly (no separate service/repository layer)
- `middleware/auth.ts` — two independent JWT schemes. `requireAdmin` / `requireOwner` decode the token and reject if the `role` claim doesn't match — an admin token is a 403 on every `/api/owner/*` route and vice versa, by design
- `models/` — Mongoose schemas; MongoDB is the only datastore (no cache/queue layer)
- `services/storage.ts` — uploads are parsed into memory by multer, then persisted to Cloudinary if `CLOUDINARY_URL` is set, else to local disk under `server/uploads` (served back via `express.static`)
- `services/whatsapp.ts` / `notify.ts` — build `wa.me` links and (stubbed) notification hooks from the CMS-managed contact info, rather than a message-provider SDK

**Content & auth model**
- CMS content (homepage copy, FAQs, policies, testimonials, contact details) lives in MongoDB as `ContentBlock` key-value documents, edited from `/admin` and read by both the public site and the `wa.me` link builder — there is no `.env`-hardcoded copy
- Admin and owner are fully separate identities (`AdminUser` / `OwnerUser` models, separate login routes, separate JWTs) — an owner can never reach admin-only data even with a valid token, and the reverse is enforced at the middleware layer, not just in the UI

## Setup & Running Locally

**Prerequisites:** Node.js, MongoDB Community running locally.

```bash
npm install                        # installs both workspaces
cp server/.env.example server/.env # edit values as needed
npm run seed                       # seeds sample properties, experiences, FAQs, policies, admin user
npm run dev                        # server :4000 + client :3000
```

**Default credentials (from seed):**
- Admin: `http://localhost:3000/admin/login` → `admin@stayuga.com` / `Stayuga@123`
- Owner portal: `http://localhost:3000/owner/login` (create owners via admin panel)

---

## Features

### Public Website

**Home page**
- Hero section with call-to-action
- Featured properties grid (admin-curated)
- Guest testimonials/reviews (managed via admin CMS)
- Experiences showcase
- WhatsApp click-to-chat (no API key required)

**Property listings (`/properties`)**
- Left sidebar filters: property type (villa / farmhouse), city, minimum guests, check-in / check-out date range
- Date range picker (Airbnb-style inline calendar with hover preview, past-date blocking)
- URL-driven filters — shareable links
- Cards with price, location, capacity

**Property detail page (`/properties/[slug]`)**
- Full-width image gallery
- Amenities list
- Capacity details (guests, bedrooms, bathrooms)
- Google Maps embed
- Pricing (base price + weekend price)
- Add-on services selector — optional extras (e.g. chef, transport) with per-night/per-guest pricing, info popups, and a live subtotal
- Booking inquiry form (check-in, check-out, guests, contact info, selected add-on services)
- WhatsApp enquiry button
- JSON-LD structured data for SEO

**Other public pages**
- About (`/about`)
- Experiences (`/experiences`)
- Contact (`/contact`) — lead capture form wired to MongoDB
- FAQ (`/faq`)
- Policy pages (`/policies/[slug]`) — dynamically rendered from CMS

**SEO**
- Per-page `<title>` and `<meta>` descriptions
- `sitemap.xml` and `robots.txt`
- JSON-LD on property detail pages

---

### Admin Dashboard (`/admin`)

JWT-protected. Admin tokens are rejected by all owner API routes and vice versa.

**Properties**
- Full CRUD — create, edit, delete properties
- Image upload (up to 10 MB per image)
- Fields: title, slug, type, tagline, description, images, amenities, location (address, city, state, map embed URL), pricing (base, weekend, currency), capacity (guests, bedrooms, bathrooms), status (draft / published)
- ★ Featured toggle — one click to feature/unfeature a property on the homepage
- Draft / Published status badge
- Per-field validation errors with section-level "Has errors" badges and auto-scroll to first error

**Bookings**
- List all booking inquiries with guest info, dates, property, guest count, status
- Update booking status: pending → confirmed / declined / cancelled
- Confirming a booking automatically blocks those dates on the property calendar (source: `"booking"`)
- Reversing a confirmation removes the auto-block

**Leads**
- View contact form submissions from the public site

**Owner accounts**
- Create owner accounts with name + email and/or phone number + password
- Assign one or more properties to an owner
- Inline edit panel: change name, email, phone, password, property assignments
- Delete owners
- Login accepts email OR phone number as identifier

**Content CMS**
- Homepage copy blocks (editable key-value pairs)
- About page copy
- Guest reviews / testimonials (add, inline-edit, delete, display order)
- FAQs (add, inline-edit, delete)
- Policy pages (add, inline-edit, delete by slug)

---

### Owner Portal (`/owner`)

Separate JWT-secured portal for property owners. Owners can only access their own assigned properties.

**Login (`/owner/login`)**
- Accepts email address or phone number as identifier
- Separate JWT role (`role: "owner"`) — cannot access admin routes

**Dashboard (`/owner/dashboard`)**
- Welcome card with owner name
- Stats: total properties, pending bookings, confirmed bookings
- Property list with quick link to each property's calendar
- Recent bookings table (guest, property, dates, status)

**Calendar (`/owner/properties/[id]/calendar`)**
- Two-month calendar view
- Colour-coded date states:
  - **Confirmed booking** (platform) — cannot be removed via owner UI
  - **Pending booking** (platform)
  - **Manually blocked** (owner) — owner-created external blocks
  - **Free** — available to book
- Click-to-select date range → "Block selected dates" button
- Lists all manual blocks with individual remove (×) buttons
- Platform-confirmed booking blocks shown read-only

**Bookings (`/owner/bookings`)**
- Read-only list of all bookings for the owner's properties

---

## API Routes

```
POST   /api/auth/login                       Admin login
GET    /api/auth/me                          Current admin info

GET    /api/properties                       List properties (filters: type, city, minGuests, featured, status)
GET    /api/properties/:slug                 Single property by slug
GET    /api/properties/id/:id               Single property by ID (admin)
POST   /api/properties                       Create property (admin)
PUT    /api/properties/:id                   Update property (admin)
DELETE /api/properties/:id                   Delete property (admin)

GET    /api/bookings                         List bookings (admin)
POST   /api/bookings                         Submit booking inquiry (public)
PATCH  /api/bookings/:id/status             Update booking status (admin)

GET    /api/leads                            List leads (admin)
POST   /api/leads                            Submit contact form (public)

GET    /api/content                          All CMS content (blocks, FAQs, policies, testimonials)
PUT    /api/content/blocks                   Update copy blocks (admin)
POST   /api/content/faqs                     Add FAQ (admin)
PUT    /api/content/faqs/:id                Update FAQ (admin)
DELETE /api/content/faqs/:id                Delete FAQ (admin)
POST   /api/content/policies                Add policy page (admin)
PUT    /api/content/policies/:id            Update policy page (admin)
DELETE /api/content/policies/:id            Delete policy page (admin)
POST   /api/content/testimonials            Add testimonial (admin)
PUT    /api/content/testimonials/:id        Update testimonial (admin)
DELETE /api/content/testimonials/:id        Delete testimonial (admin)

GET    /api/experiences                      List experiences (public)
POST   /api/uploads                          Upload image (admin)
GET    /api/dashboard                        Admin stats summary

GET    /api/admin/owners                     List owner accounts (admin)
POST   /api/admin/owners                     Create owner account (admin)
PATCH  /api/admin/owners/:id                Update owner (admin)
DELETE /api/admin/owners/:id                Delete owner (admin)

POST   /api/owner/auth/login                Owner login
GET    /api/owner/auth/me                   Current owner info

GET    /api/owner/properties                 Owner's assigned properties
GET    /api/owner/properties/:id/calendar   Property calendar (blocked dates + bookings)
POST   /api/owner/properties/:id/blocks     Add manual date block
DELETE /api/owner/properties/:id/blocks/:blockId  Remove manual block
GET    /api/owner/bookings                   Owner's bookings (read-only)
```

---

## Environment Variables

```env
# server/.env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/stayuga
JWT_SECRET=change-me-to-a-long-random-string
CLIENT_ORIGIN=http://localhost:3000

# Single source of truth for public contact details — served via /api/content's
# "contact-info" block (Footer, About, Contact pages) and used to build WhatsApp links.
WHATSAPP_NUMBER=
CONTACT_EMAIL=
INSTAGRAM_URL=

# Optional, deferred integrations — leave blank until ready to go live
RESEND_API_KEY=
# From Cloudinary dashboard > "API Environment variable". Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
# Leave blank to keep using local-disk storage (server/uploads).
CLOUDINARY_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## Testing

```bash
npm run test --workspace client        # Playwright end-to-end tests
npm run test:ui --workspace client     # Playwright UI mode
npm run test:report --workspace client # last HTML report
```

## Deployment Checklist

Before going live:

1. **Images** — set `CLOUDINARY_URL` (local disk does not persist on cloud hosts)
2. **Database** — provision a MongoDB Atlas cluster; replace `MONGODB_URI`
3. **JWT secret** — generate a long random string; never use the default
4. **CORS** — set `CLIENT_ORIGIN` to your production domain
5. **Client env** — set `NEXT_PUBLIC_API_URL` to your server's public URL in Vercel / your host
6. **Contact info** — set `WHATSAPP_NUMBER`, `CONTACT_EMAIL`, `INSTAGRAM_URL`
7. **Domain** — point your domain's DNS to Vercel (frontend) and add an `api.` subdomain CNAME for the server

Node.js >=20 is required (`server/package.json` engines field). `server/railway.toml` configures the Railway build (nixpacks) and start command.

Recommended hosting: Vercel (Next.js frontend) + Railway (Express server) + MongoDB Atlas.

## Deferred Integrations

Not yet wired up, but `.env.example` keys and service stubs are in place:

- **Razorpay** — live payment collection
- **Resend** — transactional email (booking confirmation, inquiry notifications)
- **WhatsApp Business API** — automated messaging (current links use `wa.me` click-to-chat)
- **Google Analytics / Search Console** — traffic analytics

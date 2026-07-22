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
| Image storage | Local disk (Cloudinary-ready — swap `server/src/services/storage.ts`) |

## Project Structure

```
stayuga/
├── client/   Next.js app — public site + admin dashboard + owner portal
└── server/   Express API + MongoDB models
```

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
- Booking inquiry form (check-in, check-out, guests, contact info)
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

# Optional — leave blank until ready
CLOUDINARY_URL=
RESEND_API_KEY=
WHATSAPP_NUMBER=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## Deployment Checklist

Before going live:

1. **Images** — swap `server/src/services/storage.ts` for a Cloudinary implementation (local disk does not persist on cloud hosts)
2. **Database** — provision a MongoDB Atlas cluster; replace `MONGODB_URI`
3. **JWT secret** — generate a long random string; never use the default
4. **CORS** — set `CLIENT_ORIGIN` to your production domain
5. **Client env** — set `NEXT_PUBLIC_API_URL` to your server's public URL in Vercel / your host
6. **Domain** — point your domain's DNS to Vercel (frontend) and add an `api.` subdomain CNAME for the server

Recommended hosting: Vercel (Next.js frontend) + Railway or Render (Express server) + MongoDB Atlas.

## Deferred Integrations

Not yet wired up, but `.env.example` keys and service stubs are in place:

- **Razorpay** — live payment collection
- **Resend** — transactional email (booking confirmation, inquiry notifications)
- **WhatsApp Business API** — automated messaging (current links use `wa.me` click-to-chat)
- **Cloudinary** — cloud image storage (currently using local disk)
- **Google Analytics / Search Console** — traffic analytics

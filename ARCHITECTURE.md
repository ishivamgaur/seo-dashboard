# ARCHITECTURE — SEO Dashboard & Dynamic Homepage Management

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Next.js 16 (App Router, static + ISR)           |
| Styling    | Tailwind CSS v4                                 |
| Motion     | Framer Motion (reveals), Swiper (testimonials)  |
| Backend    | Node.js + Express.js                            |
| ORM        | Sequelize                                       |
| Database   | MySQL (TiDB Cloud compatible)                   |
| Auth       | JWT (role stamped in token)                     |
| Uploads    | Multer (memory) + Sharp presets + Cloudinary    |
| Toasts     | Sonner (themed, top-right)                      |

---

## Project Structure

```
seo-dashboard/
│
├── ARCHITECTURE.md              ← You are here
├── FEATURES.md                  ← Goals & feature planning
│
├── client/                      # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js            # Root layout + HashScrollHandler
│   │   │   ├── page.js              # Public homepage (all sections)
│   │   │   ├── globals.css          # Theme, scrollbar, grain, toasts
│   │   │   ├── icon.svg             # UC favicon
│   │   │   ├── sitemap.js           # Generated sitemap
│   │   │   ├── robots.js            # Generated robots (respects noindex)
│   │   │   ├── about|fleet|services|reviews|gallery|contact/
│   │   │   │   └── page.js          # Indexable route per section
│   │   │   ├── api/revalidate/
│   │   │   │   └── route.js         # Cache purge webhook (secret-guarded)
│   │   │   ├── login/
│   │   │   │   └── page.js          # Split-screen login
│   │   │   └── (dashboard)/admin/
│   │   │       ├── layout.jsx       # Shell + Toaster + mobile sidebar
│   │   │       ├── page.jsx         # Overview (live counts, averages)
│   │   │       ├── seo/page.jsx     # Meta + social + schema generator
│   │   │       ├── vehicles/page.jsx
│   │   │       ├── occasions/page.jsx
│   │   │       ├── testimonials/page.jsx
│   │   │       ├── gallery/page.jsx
│   │   │       └── content/page.jsx # Hero / about / contact tabs
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                  # Shared primitives
│   │   │   │   ├── SectionShell.jsx # Tone + fade + container
│   │   │   │   ├── SectionHeader.jsx
│   │   │   │   ├── Card.jsx         # Opt-in hover border
│   │   │   │   ├── Badge.jsx        # Teal mono pill
│   │   │   │   ├── Button.jsx       # Single size, Link/anchor/button
│   │   │   │   └── SafeImage.jsx    # next/image without host validation
│   │   │   ├── home/                # Public sections + chrome
│   │   │   │   ├── SiteHeader.jsx   # Sticky nav + mobile menu
│   │   │   │   ├── SiteFooter.jsx
│   │   │   │   ├── Wordmark.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── AboutSection.jsx
│   │   │   │   ├── VehiclesSection.jsx
│   │   │   │   ├── OccasionsSection.jsx
│   │   │   │   ├── TestimonialsSection.jsx  # Swiper autoplay
│   │   │   │   ├── GallerySection.jsx       # Masonry + lightbox morph
│   │   │   │   ├── ContactSection.jsx       # Real inquiry POST
│   │   │   │   ├── SectionFade.jsx  # Tonal melt dividers
│   │   │   │   ├── FramedImage.jsx  # Shared photo panel
│   │   │   │   ├── Reveal.jsx       # Scroll reveal (blur + rise)
│   │   │   │   └── HashScrollHandler.jsx    # Deep-link smooth scroll
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx      # Collapsible, role badge
│   │   │   │   └── Header.jsx       # Role pill, mobile overflow menu
│   │   │   └── common/
│   │   │       ├── ThemeSelector.jsx
│   │   │       ├── FilterSelect.jsx # Dashboard dropdown (reused in form)
│   │   │       └── DeleteButton.jsx # Admin-only, pending spinner
│   │   │
│   │   ├── lib/
│   │   │   ├── site.js              # API base, media resolver, brand
│   │   │   ├── content.js           # parseStringArray, splitParagraphs
│   │   │   └── api.js               # Axios client (auth interceptor)
│   │   │
│   │   ├── services/
│   │   │   └── home.js              # ONLY public fetch layer + metadata
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # User + role
│   │   │   └── ThemeContext.jsx     # next-themes wrapper
│   │   │
│   │   ├── .prettierrc / .prettierignore / .env.example
│   │   ├── next.config.mjs
│   │   └── package.json             # format / format:check scripts
│   │
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Sequelize + optional TLS (DB_SSL)
│   │   │   └── environment.js       # Env loader + validation
│   │   │
│   │   ├── models/                  # (Sequelize tableNames in brackets)
│   │   │   ├── User.js              # [users] + role enum
│   │   │   ├── SeoSetting.js        # [seo_settings]
│   │   │   ├── Schema.js            # [schemas]
│   │   │   ├── HeroSection.js       # [hero_sections + badge/secondary CTA]
│   │   │   ├── AboutSection.js      # [about_sections, 3 spec fields]
│   │   │   ├── Vehicle.js           # [vehicles]
│   │   │   ├── Occasion.js          # [occasions]
│   │   │   ├── Testimonial.js       # [testimonials]
│   │   │   ├── GalleryImage.js      # [gallery_images]
│   │   │   └── ContactInfo.js       # [contact_infos]
│   │   │
│   │   ├── controllers/             # + sendInquiry (contact, nodemailer)
│   │   ├── routes/                  # + contact inquiry route
│   │   │
│   │   ├── middleware/
│   │   │   ├── authenticate.js      # JWT verification
│   │   │   ├── authorize.js         # Role guard (deletes = admin-only)
│   │   │   ├── upload.js            # Sharp presets per use case
│   │   │   ├── revalidate.js        # Cache-purge on mutation
│   │   │   ├── validate.js
│   │   │   └── errorHandler.js      # Masks Sequelize errors as 400
│   │   │
│   │   ├── validators/ + utils/
│   │   │   ├── revalidate.js        # Webhook caller (fire-and-forget)
│   │   │   ├── catchAsync.js, ApiError.js, ApiResponse.js
│   │   │   ├── crudFactory.js, fileHelper.js (Cloudinary-aware)
│   │   │
│   │   ├── .prettierrc / .prettierignore / .env.example
│   │   ├── server.js
│   │   ├── seed-urbancruise.js      # Demo fleet, occasions, reviews, gallery
│   │   ├── seed-schemas.js          # 5 schema templates
│   │   ├── seed-cloudinary.js       # Sample media upload
│   │   └── package.json             # format scripts, nodemailer, sharp
│   │
├── database/
│   └── schema.sql                   # Canonical schema (singular names)
│
├── .gitignore
```

> Name mismatch to know: `schema.sql` uses singular table names
> (`hero_section`), Sequelize models use plurals (`hero_sections`).
> The app always reads the plural tables created by `sync()`.

---

## Naming Conventions

| Context              | Convention    | Example                          |
|----------------------|---------------|----------------------------------|
| JS variables         | `camelCase`   | `heroData`, `getVehicles`        |
| React components     | `PascalCase`  | `VehicleCard.jsx` — n/a, pages own forms |
| DB tables (models)   | `snake_case` plural | `gallery_images`, `about_sections` |
| DB columns           | `snake_case`  | `meta_title`, `sort_order`       |
| API routes           | `kebab-case`  | `/api/vehicles`, `/api/gallery`  |
| Public routes        | lowercase     | `/fleet`, `/reviews`, `/contact` |
| Env variables        | `UPPER_SNAKE` | `DB_HOST`, `REVALIDATE_SECRET`   |

---

## Code Standards

- **2-space indentation**, **double quotes**, **semicolons**
- **Comments** — lowercase `//`, only where the why is non-obvious
- **API response shape** — always `{ success, message, data }`
- **No repeated code** — ui primitives, shared lib/services, crudFactory
- **No placeholder content** — sections render nothing without real data
- **Prettier** — `format` / `format:check` in both packages

---

## Database Schema (10 Tables)

### users
| Column     | Type                          |
|------------|-------------------------------|
| id         | INT AUTO_INCREMENT PK         |
| name       | VARCHAR(100) NOT NULL         |
| email      | VARCHAR(150) NOT NULL UNIQUE  |
| password   | VARCHAR(255) NOT NULL (bcrypt)|
| role       | ENUM('admin','editor')        |
| created_at | TIMESTAMP DEFAULT NOW         |
| updated_at | TIMESTAMP ON UPDATE NOW       |

### seo_settings (11 task fields)
meta_title, meta_description, focus_keywords, canonical_url,
robots_index, robots_follow, og_title, og_description, og_image,
twitter_title, twitter_description, twitter_image (+ id, page_identifier, updated_at)

### schemas
schema_type ENUM('organization','faq','breadcrumb','website','local_business'),
schema_data JSON, is_active BOOLEAN (+ id, timestamps)

### hero_sections (5 task fields + 3 managed extras)
heading*, sub_heading, banner_image, cta_text, cta_url,
secondary_cta_text, secondary_cta_url, badge_text (+ id, updated_at)

### about_sections (exactly the 3 task fields)
section_title*, description, featured_image (+ id, updated_at)

### vehicles
vehicle_name*, image, seating_capacity*, description, features JSON,
sort_order, is_active (+ id, timestamps)

### occasions
title*, description, image, sort_order (+ id, timestamps)

### testimonials
customer_name*, review*, rating TINYINT 1–5, customer_image,
is_active (+ id, timestamps)

### gallery_images
image_path*, alt_tag, sort_order (+ id, created_at)

### contact_info
phone, email, address, map_embed (+ id, updated_at)

---

## API Endpoints

All prefixed with `/api`. Deletes require `admin` role; everything
else mutating requires any authenticated `admin`/`editor`.

| Method | Route                  | Access        | Purpose              |
|--------|------------------------|---------------|----------------------|
| POST   | /auth/login            | Public        | Login (role in JWT)  |
| GET    | /auth/me               | Auth          | Current user         |
| GET    | /seo                   | Public        | Get settings         |
| PUT    | /seo                   | Auth          | Update (+og/twitter uploads) |
| GET    | /schemas[?all=true]    | Public        | List (+inactive with all) |
| POST   | /schemas               | Auth          | Create               |
| PUT    | /schemas/:id           | Auth          | Update               |
| DELETE | /schemas/:id           | **Admin**     | Delete               |
| PATCH  | /schemas/:id/toggle    | Auth          | Toggle active        |
| GET    | /hero                  | Public        | Get                  |
| PUT    | /hero                  | Auth          | Update               |
| GET    | /about                 | Public        | Get                  |
| PUT    | /about                 | Auth          | Update               |
| GET    | /vehicles[/:id]        | Public        | List / single        |
| POST   | /vehicles              | Auth          | Create               |
| PUT    | /vehicles/:id          | Auth          | Update               |
| DELETE | /vehicles/:id          | **Admin**     | Delete               |
| PATCH  | /vehicles/reorder      | Auth          | Reorder              |
| GET    | /occasions             | Public        | List                 |
| POST   | /occasions             | Auth          | Create               |
| PUT    | /occasions/:id         | Auth          | Update               |
| DELETE | /occasions/:id         | **Admin**     | Delete               |
| PATCH  | /occasions/reorder     | Auth          | Reorder              |
| GET    | /testimonials          | Public        | List                 |
| POST   | /testimonials          | Auth          | Create               |
| PUT    | /testimonials/:id      | Auth          | Update               |
| DELETE | /testimonials/:id      | **Admin**     | Delete               |
| GET    | /gallery               | Public        | List                 |
| POST   | /gallery               | Auth          | Upload (≤10)         |
| PUT    | /gallery/:id           | Auth          | Update alt/file      |
| DELETE | /gallery/:id           | **Admin**     | Delete               |
| PATCH  | /gallery/reorder       | Auth          | Reorder              |
| GET    | /contact               | Public        | Get                  |
| PUT    | /contact               | Auth          | Update               |
| POST   | /contact/inquiry       | Public        | Booking email (SMTP) |

---

## Caching Strategy (production standard)

- Public fetches use `next: { revalidate: 3600, tags }` — pages are
  static, survive backend outages serving last-good HTML.
- Every section fetch carries `site` + `home` + `section:<name>` tags;
  dedicated routes carry `site` + their section tag.
- `POST /api/revalidate` (secret-guarded) purges exact tags.
- Backend `revalidateAfterMutation` maps each mutated resource to its
  tags — only changed pages uncache. Auth and inquiry routes excluded.

## Upload Presets (sharp, before Cloudinary)

| Preset   | Size            | Quality | Used for                  |
|----------|-----------------|---------|---------------------------|
| avatar   | 256×256 cover   | 80      | Testimonial photos        |
| social   | 1200×630 cover  | 82      | OG / Twitter images (no GIF) |
| standard | ≤1600px inside  | 82      | Hero, vehicles, occasions, gallery, about |

## Environment

| Variable            | Where    | Purpose                              |
|---------------------|----------|--------------------------------------|
| `DB_HOST/PORT/USER/PASS/NAME` | Server | MySQL connection              |
| `DB_SSL`            | Server   | `true` enables TLS (TiDB Cloud)      |
| `JWT_SECRET`        | Server   | Token signing (required)             |
| `CLIENT_URL`        | Server   | CORS origin + revalidate webhook host|
| `REVALIDATE_SECRET` | Both, identical | Cache-purge shared secret     |
| `CLOUDINARY_*`      | Server   | Media upload creds                   |
| `SMTP_HOST/PORT/USER/PASS` | Server | Inquiry mail transport          |
| `NEXT_PUBLIC_API_URL` | Client | Backend base URL (build-time)        |

---

## DRY Utilities

| Utility            | Location            | Purpose                              |
|--------------------|---------------------|--------------------------------------|
| `catchAsync`       | `server/src/utils/` | Wraps async handlers, no try-catch   |
| `ApiError`         | `server/src/utils/` | Throw errors with status codes       |
| `ApiResponse`      | `server/src/utils/` | Consistent `{success, message, data}`|
| `crudFactory`      | `server/src/utils/` | Generate CRUD controllers for models |
| `fileHelper`       | `server/src/utils/` | Cloudinary-aware file deletion       |
| `triggerRevalidate`| `server/src/utils/` | Fire-and-forget cache purge webhook  |
| `site.js`          | `client/src/lib/`   | API base, media resolver, brand      |
| `content.js`       | `client/src/lib/`   | Array/paragraph CMS parsers          |
| `services/home.js` | `client/src/services/` | Sole public fetch + metadata layer |
| `api.js`           | `client/src/lib/`   | Axios instance with auth interceptor |

# 🎯 FEATURES & REQUIREMENTS — SEO Dashboard

## What They Want (Exact from Task Document)

> Every checkbox below maps directly to a requirement from the task document.
> Check them off as we build.

---

## Module 1: SEO Dashboard

### 1.1 SEO Settings (Admin can manage)

- [ ] Meta Title
- [ ] Meta Description
- [ ] Focus Keywords
- [ ] Canonical URL
- [ ] Robots Tag — Index / Noindex toggle
- [ ] Robots Tag — Follow / Nofollow toggle
- [ ] Open Graph Title
- [ ] Open Graph Description
- [ ] Open Graph Image (upload)
- [ ] Twitter Card Title
- [ ] Twitter Card Description
- [ ] Twitter Card Image (upload)

### 1.2 Schema Settings (JSON-LD)

> Admin enters details through forms → system auto-generates valid JSON-LD
> and injects it into website `<head>`.

**Supported Schema Types:**

- [ ] Organization Schema
- [ ] FAQ Schema
- [ ] Breadcrumb Schema
- [ ] Website Schema
- [ ] Local Business Schema

### 1.3 Head Section Integration

> All SEO data must be dynamically added to the website `<head>`:

- [ ] Meta Title rendered in `<head>`
- [ ] Meta Description rendered in `<head>`
- [ ] Keywords rendered in `<head>`
- [ ] Canonical URL rendered in `<head>`
- [ ] Open Graph Tags rendered in `<head>`
- [ ] Twitter Card Tags rendered in `<head>`
- [ ] JSON-LD Schema Markup injected in `<head>` as `<script type="application/ld+json">`
- [ ] Ensures proper indexing and rich results eligibility
- [ ] Ensures social media sharing optimization

---

## Module 2: Dynamic Homepage Management

### 2.1 Hero Section (Admin can update)

- [ ] Main Heading
- [ ] Sub Heading
- [ ] Banner Image (upload)
- [ ] Call-to-Action Button Text
- [ ] Button URL

### 2.2 About Us Section (Admin can manage)

- [ ] Section Title
- [ ] Description
- [ ] Featured Image (upload)

### 2.3 Vehicles Section

> Admin can add, edit, delete, and reorder vehicle listings.

**Vehicle Details (per vehicle):**
- [ ] Vehicle Name
- [ ] Image (upload)
- [ ] Seating Capacity
- [ ] Description
- [ ] Features

**Example vehicles from task doc:**
- [ ] 9 Seater Tempo Traveller
- [ ] 12 Seater Tempo Traveller
- [ ] 16 Seater Tempo Traveller
- [ ] 20 Seater Tempo Traveller
- [ ] Force Urbania
- [ ] Luxury Bus

**CRUD Operations:**
- [ ] Add new vehicle
- [ ] Edit existing vehicle
- [ ] Delete vehicle
- [ ] Reorder vehicles (drag & drop)

### 2.4 Occasions Section

> Admin can manage travel occasions.

**Each occasion contains:**
- [ ] Title
- [ ] Description
- [ ] Image (upload)

**Example occasions from task doc:**
- [ ] Wedding Transportation
- [ ] Corporate Events
- [ ] Family Tours
- [ ] Airport Transfers
- [ ] Outstation Trips

### 2.5 Testimonials Section

> Admin can manage customer reviews by adding:

- [ ] Customer Name
- [ ] Review
- [ ] Rating (1–5 stars)
- [ ] Customer Image (upload)

### 2.6 Gallery Section

- [ ] Upload gallery images
- [ ] Manage (edit/delete) gallery images
- [ ] SEO-friendly Alt Tags per image

### 2.7 Contact Information (Admin can update)

- [ ] Phone Number
- [ ] Email Address
- [ ] Office Address
- [ ] Google Map Embed Code

---

## Module 3: Technical Requirements

### 3.1 Frontend
- [ ] Next.js / React.js
- [ ] Responsive Design (mobile + tablet + desktop)
- [ ] Dynamic Rendering (content from API, not hardcoded)

### 3.2 Backend
- [ ] Node.js
- [ ] Express.js

### 3.3 Database
- [ ] MySQL

### 3.4 Key Features (from task doc)
- [ ] Complete Dynamic SEO Management
- [ ] Dynamic Schema Generation (form → JSON-LD)
- [ ] Homepage Content Management (all sections from admin)
- [ ] Media Upload Management (images for all sections)
- [ ] SEO-Friendly URL Structure
- [ ] Mobile Responsive Interface
- [ ] Role-Based Admin Access (admin / editor roles)
- [ ] Automatic Head Tag Injection

---

## Module 4: Expected Outcome (from task doc)

> The administrator should be able to manage:

- [ ] All SEO configurations — from dashboard
- [ ] Schema markup — from dashboard
- [ ] Homepage sections — from dashboard
- [ ] Vehicles — from dashboard
- [ ] Occasions — from dashboard
- [ ] Testimonials — from dashboard
- [ ] Gallery — from dashboard
- [ ] Contact information — from dashboard
- [ ] Changes reflect instantly on website
- [ ] No code modifications required

---

## Summary Count

| Category               | Items |
|------------------------|-------|
| SEO Settings           | 12    |
| Schema Types           | 5     |
| Head Injection         | 9     |
| Hero Section           | 5     |
| About Us Section       | 3     |
| Vehicles Section       | 9+6   |
| Occasions Section      | 3+5   |
| Testimonials Section   | 4     |
| Gallery Section        | 3     |
| Contact Information    | 4     |
| Technical Requirements | 11    |
| Expected Outcome       | 10    |
| **TOTAL**              | **89 checkboxes** |

---

## Build Phases

| Phase | What | Status |
|-------|------|--------|
| 1 | Foundation — utilities, DB, models, middleware, server | 🔲 |
| 2 | API — all routes & controllers | 🔲 |
| 3 | Frontend Foundation — Next.js, auth, layout, UI components | 🔲 |
| 4 | Admin Dashboard — all CRUD pages | 🔲 |
| 5 | Public Homepage — all 7 sections + head injection | 🔲 |
| 6 | Polish — seed data, responsive, README, testing | 🔲 |

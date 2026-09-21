# What I Built

SEO dashboard + homepage management for Urban Cruise (tempo traveller / van rentals).
Admin edits everything from the browser, no code changes needed. Public site
is Next.js, backend is Express + MySQL.

## Admin can manage

- SEO: meta title, description, keywords, canonical url, robots index/follow,
  open graph (title, description, image), twitter card (title, description, image).
  OG and twitter images accept a pasted URL or a direct upload.
- Schemas: organization, FAQ, breadcrumb, website, local business. Filled
  through forms, saved as JSON-LD, injected into the head automatically.
- Hero: heading, sub heading, banner image, main button text + link,
  secondary button text + link, small pill badge text.
- About: section title, description, featured image. Only these three.
- Vehicles: name, image, seating capacity, description, features list.
  Add, edit, delete (admins only), drag to reorder. Seeded with the 6
 Tempo Travellers / Urbania / bus from the requirement.
- Occasions: title, description, image. Same add/edit/delete/reorder flow.
- Testimonials: customer name, review, 1-5 rating, customer photo.
- Gallery: image uploads with alt tag per image, edit alt text, reorder.
- Contact: phone, email, address, google map embed. The quotation form
  on the site mails new inquiries to the saved contact email address.

## Roles

Two logins: admin (full access including delete) and editor
(manage content, no delete buttons, API returns 403 on delete).
Demo: admin@seodashboard.com / admin123, editor@seodashboard.com / editor123.

## Public site

Homepage renders everything from the API with a 1-hour cache. When admin
saves something, the backend pings the site and only the changed
section(s) refresh — visitors never wait on the database.
There are also direct pages (/fleet, /reviews, /gallery, /about,
/services, /contact) with their own titles and canonicals, plus
sitemap.xml and robots.txt generated from the SEO settings.

## Media

Uploads are resized per use case before Cloudinary (avatars 256px,
social cards exactly 1200x630, everything else max 1600px). GIFs are
blocked for social images since crawlers need static cards.

## Notes for myself

- DB uses plural table names through Sequelize (about_sections etc),
  while schema.sql uses singular. App always reads the plural ones.
- `sync()` creates missing tables but never adds columns — schema
  changes need a manual ALTER on live DBs.
- `.env` files are local only; production secrets live on Render/Vercel.
- REVALIDATE_SECRET must match on both sides or cache purge 401s.

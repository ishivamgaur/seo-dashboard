# 🏗️ ARCHITECTURE — SEO Dashboard & Dynamic Homepage Management

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | Next.js 14 (App Router) |
| Styling    | Tailwind CSS            |
| Backend    | Node.js + Express.js    |
| ORM        | Sequelize               |
| Database   | MySQL                   |
| Auth       | JWT (jsonwebtoken)      |
| Uploads    | Multer                  |

---

## Project Structure

```
seo-dashboard/
│
├── ARCHITECTURE.md              ← You are here
├── FEATURES.md                  ← Goals & feature planning
│
├── client/                      # Next.js Frontend
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js            # Root layout (SEO head injection)
│   │   │   ├── page.js              # Public homepage
│   │   │   ├── globals.css
│   │   │   ├── login/
│   │   │   │   └── page.js
│   │   │   └── admin/
│   │   │       ├── layout.js        # Admin shell (sidebar + header)
│   │   │       ├── page.js          # Dashboard overview
│   │   │       ├── seo/
│   │   │       │   └── page.js
│   │   │       ├── schema/
│   │   │       │   └── page.js
│   │   │       ├── hero/
│   │   │       │   └── page.js
│   │   │       ├── about/
│   │   │       │   └── page.js
│   │   │       ├── vehicles/
│   │   │       │   ├── page.js
│   │   │       │   └── [id]/
│   │   │       │       └── page.js
│   │   │       ├── occasions/
│   │   │       │   └── page.js
│   │   │       ├── testimonials/
│   │   │       │   └── page.js
│   │   │       ├── gallery/
│   │   │       │   └── page.js
│   │   │       └── contact/
│   │   │           └── page.js
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable primitives
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Textarea.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── StarRating.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── Toast.jsx
│   │   │   ├── admin/               # Admin-specific
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── SeoForm.jsx
│   │   │   │   ├── SchemaForm.jsx
│   │   │   │   ├── HeroForm.jsx
│   │   │   │   ├── AboutForm.jsx
│   │   │   │   ├── VehicleCard.jsx
│   │   │   │   ├── VehicleForm.jsx
│   │   │   │   ├── OccasionForm.jsx
│   │   │   │   ├── TestimonialForm.jsx
│   │   │   │   ├── GalleryUploader.jsx
│   │   │   │   └── ContactForm.jsx
│   │   │   └── home/                # Public homepage sections
│   │   │       ├── Navbar.jsx
│   │   │       ├── HeroSection.jsx
│   │   │       ├── AboutSection.jsx
│   │   │       ├── VehiclesSection.jsx
│   │   │       ├── OccasionsSection.jsx
│   │   │       ├── TestimonialsSection.jsx
│   │   │       ├── GallerySection.jsx
│   │   │       ├── ContactSection.jsx
│   │   │       └── Footer.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useFetch.js
│   │   │   └── useForm.js
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── constants.js
│   │   │   └── validators.js
│   │   │
│   │   └── context/
│   │       └── AuthContext.js
│   │
│   ├── tailwind.config.js
│   ├── next.config.mjs
│   └── package.json
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Sequelize connection
│   │   │   └── environment.js       # Env loader + validation
│   │   │
│   │   ├── models/
│   │   │   ├── index.js             # Model registry
│   │   │   ├── User.js
│   │   │   ├── SeoSetting.js
│   │   │   ├── Schema.js
│   │   │   ├── HeroSection.js
│   │   │   ├── AboutSection.js
│   │   │   ├── Vehicle.js
│   │   │   ├── Occasion.js
│   │   │   ├── Testimonial.js
│   │   │   ├── GalleryImage.js
│   │   │   └── ContactInfo.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── seoController.js
│   │   │   ├── schemaController.js
│   │   │   ├── heroController.js
│   │   │   ├── aboutController.js
│   │   │   ├── vehicleController.js
│   │   │   ├── occasionController.js
│   │   │   ├── testimonialController.js
│   │   │   ├── galleryController.js
│   │   │   └── contactController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── index.js             # Route aggregator
│   │   │   ├── authRoutes.js
│   │   │   ├── seoRoutes.js
│   │   │   ├── schemaRoutes.js
│   │   │   ├── heroRoutes.js
│   │   │   ├── aboutRoutes.js
│   │   │   ├── vehicleRoutes.js
│   │   │   ├── occasionRoutes.js
│   │   │   ├── testimonialRoutes.js
│   │   │   ├── galleryRoutes.js
│   │   │   └── contactRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authenticate.js      # JWT verification
│   │   │   ├── authorize.js         # Role guard
│   │   │   ├── upload.js            # Multer config
│   │   │   ├── validate.js          # Validation runner
│   │   │   └── errorHandler.js      # Global error handler
│   │   │
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── seoValidator.js
│   │   │   ├── vehicleValidator.js
│   │   │   └── commonValidator.js
│   │   │
│   │   └── utils/
│   │       ├── catchAsync.js        # Async wrapper
│   │       ├── ApiError.js          # Custom error class
│   │       ├── ApiResponse.js       # Standardized response
│   │       ├── crudFactory.js       # Generic CRUD generator
│   │       └── fileHelper.js        # File path + delete utils
│   │
│   ├── uploads/                     # Media storage (gitignored)
│   │   ├── hero/
│   │   ├── vehicles/
│   │   ├── occasions/
│   │   ├── testimonials/
│   │   ├── gallery/
│   │   └── general/
│   │
│   ├── server.js                    # Entry point
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── schema.sql                   # Full DB creation script
│   └── seed.sql                     # Sample data
│
├── .gitignore
└── README.md
```

---

## Naming Conventions

| Context              | Convention    | Example                          |
|----------------------|---------------|----------------------------------|
| JS variables         | `camelCase`   | `heroData`, `getVehicles`        |
| React components     | `PascalCase`  | `VehicleCard.jsx`                |
| DB tables            | `snake_case`  | `gallery_images`, `seo_settings` |
| DB columns           | `snake_case`  | `meta_title`, `sort_order`       |
| API routes           | `kebab-case`  | `/api/vehicles`, `/api/gallery`  |
| Env variables        | `UPPER_SNAKE` | `DB_HOST`, `JWT_SECRET`          |
| Non-component files  | `camelCase`   | `authController.js`              |

---

## Code Standards

- **Max ~150 lines per file** — split if larger
- **2-space indentation**
- **Single quotes** in JS, double in JSX attributes
- **Semicolons** — yes
- **Import order** — Node builtins → packages → internal
- **Comments** — only explain *why*, not *what*
- **API response shape** — always `{ success, message, data }`
- **No repeated code** — use catchAsync, crudFactory, useFetch

---

## Database Schema (10 Tables)

### users
| Column     | Type                          |
|------------|-------------------------------|
| id         | INT AUTO_INCREMENT PK         |
| name       | VARCHAR(100) NOT NULL         |
| email      | VARCHAR(150) NOT NULL UNIQUE  |
| password   | VARCHAR(255) NOT NULL         |
| role       | ENUM('admin','editor')        |
| created_at | TIMESTAMP DEFAULT NOW         |
| updated_at | TIMESTAMP ON UPDATE NOW       |

### seo_settings
| Column              | Type                               |
|---------------------|------------------------------------|
| id                  | INT AUTO_INCREMENT PK              |
| page_identifier     | VARCHAR(50) UNIQUE DEFAULT 'homepage' |
| meta_title          | VARCHAR(255)                       |
| meta_description    | TEXT                               |
| focus_keywords      | VARCHAR(500)                       |
| canonical_url       | VARCHAR(500)                       |
| robots_index        | BOOLEAN DEFAULT TRUE               |
| robots_follow       | BOOLEAN DEFAULT TRUE               |
| og_title            | VARCHAR(255)                       |
| og_description      | TEXT                               |
| og_image            | VARCHAR(500)                       |
| twitter_title       | VARCHAR(255)                       |
| twitter_description | TEXT                                |
| twitter_image       | VARCHAR(500)                       |
| updated_at          | TIMESTAMP ON UPDATE NOW            |

### schemas
| Column      | Type                                                             |
|-------------|------------------------------------------------------------------|
| id          | INT AUTO_INCREMENT PK                                            |
| schema_type | ENUM('organization','faq','breadcrumb','website','local_business') |
| schema_data | JSON NOT NULL                                                    |
| is_active   | BOOLEAN DEFAULT TRUE                                             |
| created_at  | TIMESTAMP DEFAULT NOW                                            |
| updated_at  | TIMESTAMP ON UPDATE NOW                                          |

### hero_section
| Column       | Type                    |
|--------------|-------------------------|
| id           | INT AUTO_INCREMENT PK   |
| heading      | VARCHAR(255) NOT NULL   |
| sub_heading  | VARCHAR(500)            |
| banner_image | VARCHAR(500)            |
| cta_text     | VARCHAR(100)            |
| cta_url      | VARCHAR(500)            |
| updated_at   | TIMESTAMP ON UPDATE NOW |

### about_section
| Column         | Type                    |
|----------------|-------------------------|
| id             | INT AUTO_INCREMENT PK   |
| section_title  | VARCHAR(255) NOT NULL   |
| description    | TEXT                    |
| featured_image | VARCHAR(500)            |
| updated_at     | TIMESTAMP ON UPDATE NOW |

### vehicles
| Column           | Type                    |
|------------------|-------------------------|
| id               | INT AUTO_INCREMENT PK   |
| vehicle_name     | VARCHAR(200) NOT NULL   |
| image            | VARCHAR(500)            |
| seating_capacity | INT NOT NULL            |
| description      | TEXT                    |
| features         | JSON                    |
| sort_order       | INT DEFAULT 0           |
| is_active        | BOOLEAN DEFAULT TRUE    |
| created_at       | TIMESTAMP DEFAULT NOW   |
| updated_at       | TIMESTAMP ON UPDATE NOW |

### occasions
| Column      | Type                    |
|-------------|-------------------------|
| id          | INT AUTO_INCREMENT PK   |
| title       | VARCHAR(200) NOT NULL   |
| description | TEXT                    |
| image       | VARCHAR(500)            |
| sort_order  | INT DEFAULT 0           |
| created_at  | TIMESTAMP DEFAULT NOW   |
| updated_at  | TIMESTAMP ON UPDATE NOW |

### testimonials
| Column         | Type                             |
|----------------|----------------------------------|
| id             | INT AUTO_INCREMENT PK            |
| customer_name  | VARCHAR(150) NOT NULL            |
| review         | TEXT NOT NULL                     |
| rating         | TINYINT CHECK (1-5)              |
| customer_image | VARCHAR(500)                     |
| is_active      | BOOLEAN DEFAULT TRUE             |
| created_at     | TIMESTAMP DEFAULT NOW            |
| updated_at     | TIMESTAMP ON UPDATE NOW          |

### gallery_images
| Column     | Type                  |
|------------|-----------------------|
| id         | INT AUTO_INCREMENT PK |
| image_path | VARCHAR(500) NOT NULL |
| alt_tag    | VARCHAR(300)          |
| sort_order | INT DEFAULT 0         |
| created_at | TIMESTAMP DEFAULT NOW |

### contact_info
| Column     | Type                    |
|------------|-------------------------|
| id         | INT AUTO_INCREMENT PK   |
| phone      | VARCHAR(20)             |
| email      | VARCHAR(150)            |
| address    | TEXT                    |
| map_embed  | TEXT                    |
| updated_at | TIMESTAMP ON UPDATE NOW |

---

## API Endpoints

All prefixed with `/api`

### Auth
| Method | Route         | Auth | Purpose        |
|--------|---------------|------|----------------|
| POST   | /auth/login   | No   | Admin login    |
| GET    | /auth/me      | Yes  | Current user   |

### SEO
| Method | Route | Auth | Purpose        |
|--------|-------|------|----------------|
| GET    | /seo  | No   | Get settings   |
| PUT    | /seo  | Yes  | Update settings|

### Schemas
| Method | Route        | Auth | Purpose |
|--------|--------------|------|---------|
| GET    | /schemas     | No   | List    |
| GET    | /schemas/:id | No   | Single  |
| POST   | /schemas     | Yes  | Create  |
| PUT    | /schemas/:id | Yes  | Update  |
| DELETE | /schemas/:id | Yes  | Delete  |

### Hero
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET    | /hero | No   | Get     |
| PUT    | /hero | Yes  | Update  |

### About
| Method | Route  | Auth | Purpose |
|--------|--------|------|---------|
| GET    | /about | No   | Get     |
| PUT    | /about | Yes  | Update  |

### Vehicles
| Method | Route              | Auth | Purpose  |
|--------|--------------------|------|----------|
| GET    | /vehicles          | No   | List     |
| GET    | /vehicles/:id      | No   | Single   |
| POST   | /vehicles          | Yes  | Create   |
| PUT    | /vehicles/:id      | Yes  | Update   |
| DELETE | /vehicles/:id      | Yes  | Delete   |
| PATCH  | /vehicles/reorder  | Yes  | Reorder  |

### Occasions
| Method | Route          | Auth | Purpose |
|--------|----------------|------|---------|
| GET    | /occasions     | No   | List    |
| POST   | /occasions     | Yes  | Create  |
| PUT    | /occasions/:id | Yes  | Update  |
| DELETE | /occasions/:id | Yes  | Delete  |

### Testimonials
| Method | Route              | Auth | Purpose |
|--------|--------------------|------|---------|
| GET    | /testimonials      | No   | List    |
| POST   | /testimonials      | Yes  | Create  |
| PUT    | /testimonials/:id  | Yes  | Update  |
| DELETE | /testimonials/:id  | Yes  | Delete  |

### Gallery
| Method | Route        | Auth | Purpose      |
|--------|--------------|------|--------------|
| GET    | /gallery     | No   | List         |
| POST   | /gallery     | Yes  | Upload       |
| PUT    | /gallery/:id | Yes  | Update alt   |
| DELETE | /gallery/:id | Yes  | Delete image |

### Contact
| Method | Route    | Auth | Purpose |
|--------|----------|------|---------|
| GET    | /contact | No   | Get     |
| PUT    | /contact | Yes  | Update  |

---

## DRY Utilities

| Utility         | Location                   | Purpose                               |
|-----------------|----------------------------|---------------------------------------|
| `catchAsync`    | `server/src/utils/`        | Wraps async handlers, no try-catch    |
| `ApiError`      | `server/src/utils/`        | Throw errors with status codes        |
| `ApiResponse`   | `server/src/utils/`        | Consistent `{success, message, data}` |
| `crudFactory`   | `server/src/utils/`        | Generate CRUD controllers for models  |
| `fileHelper`    | `server/src/utils/`        | File path resolution + deletion       |
| `useFetch`      | `client/src/hooks/`        | Reusable data fetching hook           |
| `useForm`       | `client/src/hooks/`        | Reusable form state management        |
| `api.js`        | `client/src/lib/`          | Axios instance with interceptors      |

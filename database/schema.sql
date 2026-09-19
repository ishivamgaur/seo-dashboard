CREATE DATABASE IF NOT EXISTS seo_dashboard
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE seo_dashboard;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seo_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_identifier VARCHAR(50) NOT NULL DEFAULT 'homepage' UNIQUE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  focus_keywords VARCHAR(500),
  canonical_url VARCHAR(500),
  robots_index BOOLEAN DEFAULT TRUE,
  robots_follow BOOLEAN DEFAULT TRUE,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(500),
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `schemas` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schema_type ENUM('organization', 'faq', 'breadcrumb', 'website', 'local_business') NOT NULL,
  schema_data JSON NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hero_section (
  id INT AUTO_INCREMENT PRIMARY KEY,
  heading VARCHAR(255) NOT NULL,
  sub_heading VARCHAR(500),
  banner_image VARCHAR(500),
  cta_text VARCHAR(100),
  cta_url VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS about_section (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  highlights JSON,
  years_experience INT,
  cities_covered INT,
  fleet_size INT,
  trips_completed INT,
  featured_image VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_name VARCHAR(200) NOT NULL,
  image VARCHAR(500),
  seating_capacity INT NOT NULL,
  description TEXT,
  features JSON,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS occasions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  review TEXT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  customer_image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(500) NOT NULL,
  alt_tag VARCHAR(300),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(20),
  email VARCHAR(150),
  address TEXT,
  map_embed TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@seodashboard.com', '$2a$10$placeholder', 'admin');

INSERT INTO seo_settings (page_identifier, meta_title, meta_description, canonical_url, robots_index, robots_follow)
VALUES ('homepage', 'Premier Fleet & Chauffeur Services', 'Experience luxury transportation and executive chauffeur services.', 'https://example.com', TRUE, TRUE);

INSERT INTO hero_section (heading, sub_heading, banner_image, cta_text, cta_url)
VALUES ('Arrive in Elegance, Travel in Comfort', 'Bespoke luxury fleet rentals and private chauffeur services.', '/uploads/hero/hero-banner.jpg', 'Reserve Your Fleet', '#contact');

INSERT INTO about_section (section_title, description, featured_image)
VALUES ('Redefining Luxury Travel', 'Specializing in premium transportation combining elegance, punctuality, and professional service.', '/uploads/general/about-showcase.jpg');

INSERT INTO contact_info (phone, email, address, map_embed)
VALUES ('+1 (555) 019-2834', 'admin@seodashboard.com', '100 Executive Boulevard, Suite 400, New York, NY 10001', '<iframe src="https://maps.google.com" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>');

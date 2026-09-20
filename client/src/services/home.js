import { API_BASE, FALLBACK_IMAGES, BRAND } from "@/lib/site";

const REVALIDATE_SECONDS = 3600;

const fetchJson = async (endpoint, tags = ["site"]) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

export const fetchSeoSettings = () => fetchJson("/seo");

// Granular fetch for single-section routes.
export const fetchSection = (endpoint, section) =>
  fetchJson(endpoint, section ? ["site", `section:${section}`] : ["site"]);

const HOME_SECTIONS = {
  schemas: "schemas",
  hero: "hero",
  about: "about",
  vehicles: "vehicles",
  occasions: "occasions",
  testimonials: "testimonials",
  gallery: "gallery",
  contact: "contact",
};

export const siteBaseUrl = (seo) => (seo?.canonicalUrl || "https://urbancruise.in").replace(/\/$/, "");

// SEO metadata for a dedicated section route (fleet, reviews, ...).
export const buildSectionMetadata = (seo, { path, title, description }) => {
  const base = siteBaseUrl(seo);
  const pageTitle = `${title} | Urban Cruise`;
  return {
    title: pageTitle,
    description,
    alternates: { canonical: `${base}${path}` },
    robots: {
      index: seo?.robotsIndex !== false,
      follow: seo?.robotsFollow !== false,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: `${base}${path}`,
      siteName: BRAND.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
};

export const fetchHomeData = async () => {
  // Every section fetch on the homepage carries the home tag plus its
  // own section tag, so purging one section refreshes the homepage
  // without touching unrelated cached pages.
  const entries = await Promise.all(
    Object.entries(HOME_SECTIONS).map(([key, section]) =>
      fetchJson(`/${key}`, ["site", "home", `section:${section}`]).then((data) => [key, data])
    )
  );
  const byKey = Object.fromEntries(entries);
  const { schema, hero, about, vehicles, occasions, testimonials, gallery, contact } = byKey;

  return {
    schema,
    hero,
    about,
    vehicles: Array.isArray(vehicles) ? vehicles : [],
    occasions,
    testimonials,
    gallery,
    contact,
  };
};

export const buildHomeMetadata = (seo) => {
  const title = seo?.metaTitle || `${BRAND.name} - Commercial Fleet & Chauffeur Services India`;
  const description =
    seo?.metaDescription ||
    "Book luxury tempo travellers, Force Urbania vans, and Volvo coaches across 15 Indian cities.";
  const canonical = seo?.canonicalUrl || "https://urbancruise.in";
  const ogImg = seo?.ogImage || FALLBACK_IMAGES.hero;

  return {
    title,
    description,
    keywords:
      seo?.focusKeywords ||
      "tempo traveller rental, force urbania luxury van, bus hire, wedding car rental india",
    alternates: { canonical },
    robots: {
      index: seo?.robotsIndex !== false,
      follow: seo?.robotsFollow !== false,
    },
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: canonical,
      siteName: BRAND.siteName,
      images: [{ url: ogImg }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || title,
      description: seo?.twitterDescription || description,
      images: [seo?.twitterImage || ogImg],
    },
  };
};

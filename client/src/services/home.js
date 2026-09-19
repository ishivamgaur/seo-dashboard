// Public homepage data layer — the ONLY place the site calls the API.
// Server Components import from here; nothing else touches fetch directly.

import { API_BASE, FALLBACK_IMAGES, BRAND } from '@/lib/site';
import { FALLBACK_HOME } from '@/data/fallback';

const fetchJson = async (endpoint) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

export const fetchSeoSettings = () => fetchJson('/seo');

export const fetchHomeData = async () => {
  const [schema, hero, about, vehicles, occasions, testimonials, gallery, contact] =
    await Promise.all([
      fetchJson('/schemas'),
      fetchJson('/hero'),
      fetchJson('/about'),
      fetchJson('/vehicles'),
      fetchJson('/occasions'),
      fetchJson('/testimonials'),
      fetchJson('/gallery'),
      fetchJson('/contact'),
    ]);

  // Backend-down resilience: any failed endpoint falls back to static
  // backup content so the site always renders a complete page.
  const listOr = (value, fallback) => (Array.isArray(value) && value.length > 0 ? value : fallback);

  return {
    schema,
    hero: hero ?? FALLBACK_HOME.hero,
    about: about ?? FALLBACK_HOME.about,
    vehicles: listOr(vehicles, FALLBACK_HOME.vehicles),
    occasions: listOr(occasions, FALLBACK_HOME.occasions),
    testimonials: listOr(testimonials, FALLBACK_HOME.testimonials),
    gallery: listOr(gallery, FALLBACK_HOME.gallery),
    contact: contact ?? FALLBACK_HOME.contact,
  };
};

// Builds Next.js metadata from CMS SEO settings + fallbacks.
export const buildHomeMetadata = (seo) => {
  const title = seo?.metaTitle || `${BRAND.name} - Commercial Fleet & Chauffeur Services India`;
  const description =
    seo?.metaDescription ||
    'Book luxury tempo travellers, Force Urbania vans, and Volvo coaches across 15 Indian cities.';
  const canonical = seo?.canonicalUrl || 'https://urbancruise.in';
  const ogImg = seo?.ogImage || FALLBACK_IMAGES.hero;

  return {
    title,
    description,
    keywords:
      seo?.focusKeywords ||
      'tempo traveller rental, force urbania luxury van, bus hire, wedding car rental india',
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
      card: 'summary_large_image',
      title: seo?.twitterTitle || title,
      description: seo?.twitterDescription || description,
      images: [seo?.twitterImage || ogImg],
    },
  };
};

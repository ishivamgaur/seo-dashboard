// Public homepage data layer — the ONLY place the site calls the API.
// Server Components import from here; nothing else touches fetch directly.
//
// Caching strategy (production standard): responses are cached and
// revalidated in the background. Visitors get instant cached pages,
// and if the backend goes down Next.js keeps serving the last
// good render instead of fake content.

import { API_BASE, FALLBACK_IMAGES, BRAND } from '@/lib/site';

const REVALIDATE_SECONDS = 60;

const fetchJson = async (endpoint) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
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

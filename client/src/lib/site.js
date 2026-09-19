// Single source of truth for public-site configuration.
// API base is resolved once here — never hardcode service URLs in components.

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const MEDIA_BASE = API_BASE.replace(/\/api\/?$/, '');

export const BRAND = {
  name: 'Urban Cruise',
  logoWordmark: 'URBAN CRUISE',
  siteName: 'Urban Cruise',
};

// Resolves any CMS media value (absolute URL, /uploads path, bare path)
// into a loadable URL. Falls back to `fallback` when empty.
export const resolveMediaUrl = (src, fallback = '') => {
  if (!src) return fallback;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${MEDIA_BASE}${src.startsWith('/') ? '' : '/'}${src}`;
};

export const FALLBACK_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=80',
  about:
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
  vehicle: 'https://urbancruise.in/wp-content/uploads/tempo-traveller-9-seater-1x1-1.webp',
  occasion: 'https://urbancruise.in/wp-content/uploads/Luxury-Bus-rental-For-Wedding.webp',
};

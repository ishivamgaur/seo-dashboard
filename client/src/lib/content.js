// Shared CMS content helpers — parsing + formatting in one place
// so every section treats dynamic data identically.

// Accepts a real array, a JSON-encoded array string, or newline
// separated text (MariaDB returns JSON columns as strings).
export const parseStringArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      // fall through to newline split
    }
    return value
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

// Splits CMS textarea content into clean paragraphs.
export const splitParagraphs = (value) => {
  if (!value || typeof value !== 'string') return [];
  return value
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);
};

// 25000 -> "25k" for compact stat displays.
export const formatCompact = (n) => {
  if (n === null || n === undefined || n === '') return null;
  const num = Number(n);
  if (Number.isNaN(num)) return null;
  if (num >= 1000) {
    const k = num / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `${num}`;
};

const normalize = (s) =>
  (s || '')
    .trim()
    .toLowerCase()
    .replace(/[.\s]+$/g, '');

// True when two CMS strings say the same thing (used to hide
// redundant eyebrow / subtitle / highlight repeats).
export const isSameText = (a, b) => {
  return normalize(a) !== '' && normalize(a) === normalize(b);
};

export const containsText = (haystack, needle) => {
  const h = (haystack || '').trim().toLowerCase();
  const n = (needle || '').trim().toLowerCase();
  return h !== '' && n !== '' && (h.includes(n) || n.includes(h));
};

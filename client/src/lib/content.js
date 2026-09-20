export const parseStringArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}
    return value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

export const splitParagraphs = (value) => {
  if (!value || typeof value !== "string") return [];
  return value
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
};

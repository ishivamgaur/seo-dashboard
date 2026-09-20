import { fetchSeoSettings, siteBaseUrl } from "@/services/home";

export default async function robots() {
  const seo = await fetchSeoSettings();
  const base = siteBaseUrl(seo);
  const allow = seo?.robotsIndex !== false;

  return {
    rules: {
      userAgent: "*",
      allow: allow ? "/" : [],
      disallow: allow ? [] : "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

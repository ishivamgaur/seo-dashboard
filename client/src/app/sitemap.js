import { fetchSeoSettings, siteBaseUrl } from "@/services/home";

export default async function sitemap() {
  const seo = await fetchSeoSettings();
  const base = siteBaseUrl(seo);
  const now = new Date();

  const paths = ["/", "/about", "/fleet", "/services", "/reviews", "/gallery", "/contact"];

  return paths.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}

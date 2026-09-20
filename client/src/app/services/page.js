import OccasionsSection from "@/components/home/OccasionsSection";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { fetchSection, fetchSeoSettings, buildSectionMetadata } from "@/services/home";

export async function generateMetadata() {
  const seo = await fetchSeoSettings();
  return buildSectionMetadata(seo, {
    path: "/services",
    title: "Services & Occasions",
    description:
      "Wedding transportation, corporate events, family tours, airport transfers and outstation trips with chauffeur-driven vehicles.",
  });
}

export default async function ServicesPage() {
  const occasions = await fetchSection("/occasions", "occasions");

  return (
    <div className="min-h-screen bg-[#eceff3] dark:bg-[#090a0d] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
      <SiteHeader />
      <main className="flex-grow">
        <OccasionsSection data={occasions} />
      </main>
      <SiteFooter />
    </div>
  );
}

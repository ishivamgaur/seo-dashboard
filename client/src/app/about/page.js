import AboutSection from "@/components/home/AboutSection";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { fetchSection, fetchSeoSettings, buildSectionMetadata } from "@/services/home";

export async function generateMetadata() {
  const seo = await fetchSeoSettings();
  return buildSectionMetadata(seo, {
    path: "/about",
    title: "About Us",
    description:
      "Urban Cruise is India's chauffeur-driven fleet company serving weddings, corporate travel and outstation trips with verified drivers.",
  });
}

export default async function AboutPage() {
  const about = await fetchSection("/about");

  return (
    <div className="min-h-screen bg-[#eceff3] dark:bg-[#090a0d] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
      <SiteHeader />
      <main className="flex-grow">
        <AboutSection data={about} />
      </main>
      <SiteFooter />
    </div>
  );
}

import GallerySection from "@/components/home/GallerySection";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { fetchSection, fetchSeoSettings, buildSectionMetadata } from "@/services/home";

export async function generateMetadata() {
  const seo = await fetchSeoSettings();
  return buildSectionMetadata(seo, {
    path: "/gallery",
    title: "Fleet Gallery",
    description:
      "Photos of Urban Cruise tempo travellers, luxury vans and coaches in service across India.",
  });
}

export default async function GalleryPage() {
  const gallery = await fetchSection("/gallery");

  return (
    <div className="min-h-screen bg-[#eceff3] dark:bg-[#090a0d] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
      <SiteHeader />
      <main className="flex-grow">
        <GallerySection data={gallery} />
      </main>
      <SiteFooter />
    </div>
  );
}

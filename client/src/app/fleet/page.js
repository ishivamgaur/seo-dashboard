import VehiclesSection from "@/components/home/VehiclesSection";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { fetchSection, fetchSeoSettings, buildSectionMetadata } from "@/services/home";

export async function generateMetadata() {
  const seo = await fetchSeoSettings();
  return buildSectionMetadata(seo, {
    path: "/fleet",
    title: "Our Fleet",
    description:
      "Tempo travellers, Force Urbania vans and luxury coaches on rent with seating options from 9 to 45 seats and all-India permits.",
  });
}

export default async function FleetPage() {
  const vehicles = await fetchSection("/vehicles");

  return (
    <div className="min-h-screen bg-[#eceff3] dark:bg-[#090a0d] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
      <SiteHeader />
      <main className="flex-grow">
        <VehiclesSection data={vehicles} />
      </main>
      <SiteFooter />
    </div>
  );
}

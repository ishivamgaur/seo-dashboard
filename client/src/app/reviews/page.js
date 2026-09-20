import TestimonialsSection from "@/components/home/TestimonialsSection";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { fetchSection, fetchSeoSettings, buildSectionMetadata } from "@/services/home";

export async function generateMetadata() {
  const seo = await fetchSeoSettings();
  return buildSectionMetadata(seo, {
    path: "/reviews",
    title: "Client Reviews",
    description:
      "Verified reviews from wedding planners, corporate travel managers and families who travelled with Urban Cruise across India.",
  });
}

export default async function ReviewsPage() {
  const testimonials = await fetchSection("/testimonials");

  return (
    <div className="min-h-screen bg-[#eceff3] dark:bg-[#090a0d] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
      <SiteHeader />
      <main className="flex-grow">
        <TestimonialsSection data={testimonials} />
      </main>
      <SiteFooter />
    </div>
  );
}

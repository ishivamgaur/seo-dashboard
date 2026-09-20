import ContactSection from "@/components/home/ContactSection";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { fetchSection, fetchSeoSettings, buildSectionMetadata } from "@/services/home";

export async function generateMetadata() {
  const seo = await fetchSeoSettings();
  return buildSectionMetadata(seo, {
    path: "/contact",
    title: "Contact & Booking",
    description:
      "Contact Urban Cruise for fleet bookings: phone, email, office address and an instant quotation form with 15-minute response.",
  });
}

export default async function ContactPage() {
  const [contact, vehicles] = await Promise.all([
    fetchSection("/contact", "contact"),
    fetchSection("/vehicles", "vehicles"),
  ]);

  return (
    <div className="min-h-screen bg-[#eceff3] dark:bg-[#090a0d] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
      <SiteHeader />
      <main className="flex-grow">
        <ContactSection data={contact} vehicles={Array.isArray(vehicles) ? vehicles : []} />
      </main>
      <SiteFooter />
    </div>
  );
}

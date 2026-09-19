import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import VehiclesSection from '@/components/home/VehiclesSection';
import OccasionsSection from '@/components/home/OccasionsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import GallerySection from '@/components/home/GallerySection';
import ContactSection from '@/components/home/ContactSection';
import SiteHeader from '@/components/home/SiteHeader';
import SiteFooter from '@/components/home/SiteFooter';
import { fetchHomeData, fetchSeoSettings, buildHomeMetadata } from '@/services/home';

export async function generateMetadata() {
  const seo = await fetchSeoSettings();
  return buildHomeMetadata(seo);
}

export default async function Home() {
  const data = await fetchHomeData();
  const schemas = Array.isArray(data.schema) ? data.schema : [];

  return (
    <div className="min-h-screen bg-[#eceff3] dark:bg-[#090a0d] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {schemas.map((s, index) => {
        const schemaString =
          typeof s.schemaData === 'string' ? s.schemaData : JSON.stringify(s.schemaData);
        return (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: schemaString }}
          />
        );
      })}

      <SiteHeader />

      <main className="flex-grow">
        <HeroSection data={data.hero} />
        <AboutSection data={data.about} />
        <VehiclesSection data={data.vehicles} />
        <OccasionsSection data={data.occasions} />
        <TestimonialsSection data={data.testimonials} />
        <GallerySection data={data.gallery} />
        <ContactSection data={data.contact} vehicles={data.vehicles} />
      </main>

      <SiteFooter />
    </div>
  );
}

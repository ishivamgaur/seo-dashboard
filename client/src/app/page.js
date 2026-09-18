import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import VehiclesSection from '@/components/home/VehiclesSection';
import OccasionsSection from '@/components/home/OccasionsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import GallerySection from '@/components/home/GallerySection';
import ContactSection from '@/components/home/ContactSection';

const API_BASE = 'http://localhost:5000/api';

async function fetchJson(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

async function fetchData() {
  const [
    schema,
    hero,
    about,
    vehicles,
    occasions,
    testimonials,
    gallery,
    contact
  ] = await Promise.all([
    fetchJson('/schema'),
    fetchJson('/hero'),
    fetchJson('/about'),
    fetchJson('/vehicles'),
    fetchJson('/occasions'),
    fetchJson('/testimonials'),
    fetchJson('/gallery'),
    fetchJson('/contact')
  ]);

  return { schema, hero, about, vehicles, occasions, testimonials, gallery, contact };
}

export async function generateMetadata() {
  const seo = await fetchJson('/seo');
  if (!seo) {
    return {
      title: 'Company Name',
      description: 'Default Description'
    };
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonicalUrl || undefined
    },
    robots: {
      index: seo.index !== false,
      follow: seo.follow !== false
    },
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      url: seo.ogUrl || seo.canonicalUrl,
      images: seo.ogImage ? [{ url: seo.ogImage }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle || seo.title,
      description: seo.twitterDescription || seo.description,
      images: seo.twitterImage ? [seo.twitterImage] : []
    }
  };
}

export default async function Home() {
  const data = await fetchData();
  const schemas = data.schema || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema.schemaData }}
        />
      ))}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-gray-900">
                Logo
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="#about" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                About
              </Link>
              <Link href="#vehicles" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                Vehicles
              </Link>
              <Link href="#contact" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <HeroSection data={data.hero} />
        <AboutSection data={data.about} />
        <VehiclesSection data={data.vehicles} />
        <OccasionsSection data={data.occasions} />
        <TestimonialsSection data={data.testimonials} />
        <GallerySection data={data.gallery} />
        <ContactSection data={data.contact} />
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Company Name. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

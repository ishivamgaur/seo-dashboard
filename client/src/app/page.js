import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import VehiclesSection from '@/components/home/VehiclesSection';
import OccasionsSection from '@/components/home/OccasionsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import GallerySection from '@/components/home/GallerySection';
import ContactSection from '@/components/home/ContactSection';
import ThemeSelector from '@/components/common/ThemeSelector';
import { User, ShieldCheck } from 'lucide-react';

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
    fetchJson('/schemas'),
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
  
  const title = seo?.metaTitle || 'Urban Cruise - Commercial Fleet & Chauffeur Services India';
  const description = seo?.metaDescription || 'Book luxury tempo travellers, Force Urbania vans, and Volvo coaches across 15 Indian cities.';
  const canonical = seo?.canonicalUrl || 'https://urbancruise.in';
  const ogImg = seo?.ogImage || 'https://res.cloudinary.com/dfurqcxo8/image/upload/v1742469972/urban-cruise/hero/luxury_hero_studio.jpg';

  return {
    title,
    description,
    keywords: seo?.focusKeywords || 'tempo traveller rental, force urbania luxury van, bus hire, wedding car rental india',
    alternates: {
      canonical,
    },
    robots: {
      index: seo?.robotsIndex !== false,
      follow: seo?.robotsFollow !== false,
    },
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: canonical,
      siteName: 'Urban Cruise',
      images: [{ url: ogImg }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || title,
      description: seo?.twitterDescription || description,
      images: [seo?.twitterImage || ogImg],
    },
  };
}

export default async function Home() {
  const data = await fetchData();
  const schemas = Array.isArray(data.schema) ? data.schema : [];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Dynamic JSON-LD Schema Markup Injection */}
      {schemas.map((s, index) => {
        const schemaString = typeof s.schemaData === 'string'
          ? s.schemaData
          : JSON.stringify(s.schemaData);
        return (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: schemaString }}
          />
        );
      })}

      {/* Quiet Announcement Banner: Zero Emojis, Clean Information */}
      <div className="bg-zinc-100 dark:bg-[#121418] border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs py-2 px-4 text-center">
        <span>Corporate and wedding fleet bookings across 15 cities. Direct helpline: +91 98765 43210</span>
      </div>

      {/* Main Clean Nav Header */}
      <header className="sticky top-0 z-50 w-full bg-[#fafafa]/90 dark:bg-[#0c0d10]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <div className="relative w-40 sm:w-44 h-9">
                  <img
                    src="https://urbancruise.in/wp-content/uploads/gurugramlogo.webp"
                    alt="Urban Cruise"
                    className="object-contain w-full h-full dark:brightness-110"
                  />
                </div>
              </Link>
            </div>

            {/* Nav Links: Clean Sans-Serif, Strict Dash Ban */}
            <nav className="hidden md:flex items-center space-x-6 text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              <Link href="#about" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">
                About
              </Link>
              <Link href="#vehicles" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">
                Fleet
              </Link>
              <Link href="#occasions" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">
                Services
              </Link>
              <Link href="#gallery" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">
                Gallery
              </Link>
              <Link href="#testimonials" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">
                Reviews
              </Link>
              <Link href="#contact" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">
                Contact
              </Link>
            </nav>

            {/* Action Buttons: Concentric Radius, Scale on Press */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-xs font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.98]"
                title="Admin Dashboard"
              >
                <User className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>Admin</span>
              </Link>

              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-[background-color,transform] duration-150 ease-out active:scale-[0.98] shadow-xs"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection data={data.hero} />
        <AboutSection data={data.about} />
        <VehiclesSection data={data.vehicles} />
        <OccasionsSection data={data.occasions} />
        <TestimonialsSection data={data.testimonials} />
        <GallerySection data={data.gallery} />
        <ContactSection data={data.contact} />
      </main>

      {/* Quiet Structured Footer with Theme Selector */}
      <footer className="bg-zinc-100 dark:bg-[#07080a] text-zinc-600 dark:text-zinc-400 pt-16 pb-12 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-zinc-200/80 dark:border-zinc-800">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="w-40 h-10 relative bg-white dark:bg-zinc-900 p-1.5 rounded-lg border border-zinc-200/90 dark:border-zinc-800 inline-block">
                <img
                  src="https://urbancruise.in/wp-content/uploads/gurugramlogo.webp"
                  alt="Urban Cruise Logo"
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm text-pretty">
                Pan-India vehicle rentals and chauffeur services. Commercial tempo travellers, Force Urbania vans, and Volvo coaches across 15 cities.
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500 stroke-[1.75]" />
                <span>Commercial permits and passenger insurance verified</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-zinc-950 dark:text-zinc-200 text-xs font-mono uppercase tracking-wider mb-3 font-semibold">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#about" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">About Us</Link></li>
                <li><Link href="#vehicles" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">Fleet Categories</Link></li>
                <li><Link href="#occasions" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">Occasions and Events</Link></li>
                <li><Link href="#gallery" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">Vehicle Gallery</Link></li>
                <li><Link href="#testimonials" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">Client Reviews</Link></li>
                <li><Link href="#contact" className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-150">Contact</Link></li>
              </ul>
            </div>

            {/* Fleet Categories */}
            <div>
              <h4 className="text-zinc-950 dark:text-zinc-200 text-xs font-mono uppercase tracking-wider mb-3 font-semibold">
                Fleet
              </h4>
              <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                <li><span>9 Seater Tempo Traveller</span></li>
                <li><span>12 Seater Tempo Traveller</span></li>
                <li><span>16 Seater Tempo Traveller</span></li>
                <li><span>Force Urbania Luxury Van</span></li>
                <li><span>20 Seater Mini Bus</span></li>
                <li><span>Volvo Luxury Coach</span></li>
              </ul>
            </div>

            {/* Cities & Theme Switcher */}
            <div>
              <h4 className="text-zinc-950 dark:text-zinc-200 text-xs font-mono uppercase tracking-wider mb-3 font-semibold">
                Service Areas
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed text-pretty">
                Delhi NCR, Gurugram, Mumbai, Pune, Bengaluru, Hyderabad, Jaipur, Agra, Chandigarh, Dehradun.
              </p>
              
              {/* Theme Switcher in Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">Theme Mode</span>
                <ThemeSelector />
              </div>
            </div>

          </div>

          {/* Bottom Bar: Zero Em-Dashes, Clean Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-mono">
            <p>(c) {new Date().getFullYear()} Urban Cruise. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-white transition-colors duration-150">
                Admin
              </Link>
              <span>/</span>
              <span>Privacy</span>
              <span>/</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import Button from '@/components/ui/Button';
import { BRAND, FALLBACK_IMAGES, resolveMediaUrl } from '@/lib/site';

const HeroSection = ({ data }) => {
  const heading = data?.heading || 'Commercial fleet and chauffeur rentals in India';
  const subHeading =
    data?.subHeading ||
    'Tempo travellers, Force Urbania vans, and luxury coaches for corporate events, weddings, and outstation trips.';
  const bannerImage = resolveMediaUrl(data?.bannerImage, FALLBACK_IMAGES.hero);
  const ctaText = data?.ctaText || 'Reserve a vehicle';
  const ctaUrl = data?.ctaUrl || '#contact';

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950">
      {/* Full-width image — covers the entire viewport width + section height, no vh lock */}
      <div className="absolute inset-0">
        <Image
          src={bannerImage}
          alt={heading}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />
      {/* Curved scoop edge — photo pours into the page, no straight fade */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(40px,8vw,96px)] w-full text-[#eceff3] dark:text-[#090a0d]"
      >
        <path d="M0,52 C360,96 1080,96 1440,52 L1440,100 L0,100 Z" fill="currentColor" />
      </svg>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-32 sm:py-44 md:py-56">
        <Reveal className="max-w-xl">
          <span className="inline-block text-xs font-mono text-teal-300 bg-teal-950/60 border border-teal-800/60 px-2.5 py-0.5 rounded font-semibold">
            {BRAND.name} Fleet
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
            {heading}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">{subHeading}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href={ctaUrl}>
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button href="#vehicles" variant="ghostOnDark">
              View fleet
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default HeroSection;

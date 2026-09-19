'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

const HeroSection = ({ data }) => {
  const heading = data?.heading || 'Commercial fleet and chauffeur rentals in India';
  const subHeading = data?.subHeading || 'Tempo travellers, Force Urbania vans, and luxury coaches for corporate events, weddings, and outstation trips.';
  const bannerImage = data?.bannerImage || 'https://res.cloudinary.com/dfurqcxo8/image/upload/v1742469972/urban-cruise/hero/luxury_hero_studio.jpg';
  const ctaText = data?.ctaText || 'Reserve a vehicle';
  const ctaUrl = data?.ctaUrl || '#contact';

  return (
    <section className="relative w-full min-h-[75vh] md:h-[80vh] flex items-center overflow-hidden bg-[#0c0d10] text-white">
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src={bannerImage}
          alt="Urban Cruise Commercial Fleet"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-center brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d10] via-[#0c0d10]/85 to-transparent w-full md:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-black/25" />
      </div>

      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <svg
        className="absolute inset-0 z-10 w-full h-full opacity-20 pointer-events-none mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-16">
        <div className="max-w-xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-700/80 bg-zinc-900/80 backdrop-blur-md mb-6 shadow-xs">
            <span className="text-zinc-300 text-xs font-mono uppercase tracking-wider">
              Urban Cruise Fleet
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white mb-4 text-balance">
            {heading}
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-lg text-pretty">
            {subHeading}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-[background-color,transform] duration-150 ease-out active:scale-[0.98] shadow-sm"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Link>

            <Link
              href="#vehicles"
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs uppercase tracking-wider rounded-lg border border-zinc-700/70 transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98]"
            >
              <span>View Fleet</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[1.75]" />
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-zinc-800/80 text-xs text-zinc-400">
            <div>
              <span className="font-mono tabular-nums text-white font-bold text-base">15</span>
              <span className="ml-1.5">Cities Covered</span>
            </div>
            <div className="w-px h-4 bg-zinc-800" />
            <div>
              <span className="font-mono tabular-nums text-white font-bold text-base">24/7</span>
              <span className="ml-1.5">Dispatch Support</span>
            </div>
            <div className="w-px h-4 bg-zinc-800" />
            <div>
              <span className="text-zinc-300 font-medium">All-India Permits</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

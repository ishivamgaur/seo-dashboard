'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const OccasionsSection = ({ data }) => {
  const occasions = Array.isArray(data) && data.length > 0 ? data : [];

  if (!occasions.length) return null;

  return (
    <section 
      className="relative py-16 md:py-24 bg-white dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 border-t border-zinc-200/80 dark:border-zinc-800 transition-colors duration-150" 
      id="occasions"
    >
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">
            Services and Travel Occasions
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2 text-balance">
            Services & Occasions
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-normal text-pretty">
            Turnkey vehicle logistics for weddings, corporate events, family getaways, airport transfers, and outstation trips.
          </p>
        </div>

        <div className="space-y-10">
          {occasions.map((occasion, index) => (
            <div
              key={occasion.id || index}
              className="bg-zinc-50 dark:bg-[#121418] border border-zinc-200/90 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-[border-color,box-shadow] duration-150"
            >
              <div className="relative w-full aspect-[16/9] bg-zinc-100 dark:bg-zinc-900 overflow-hidden ring-1 ring-black/[0.06] dark:ring-white/[0.06]">
                <Image
                  src={occasion.image || 'https://urbancruise.in/wp-content/uploads/Luxury-Bus-rental-For-Wedding.webp'}
                  alt={occasion.title || 'Travel Occasion'}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="object-cover object-center"
                />
              </div>

              <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-200/80 dark:border-zinc-800">
                <div className="max-w-2xl">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white mb-1.5">
                    {occasion.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed text-pretty">
                    {occasion.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-teal-600 dark:hover:bg-teal-500 hover:text-white dark:hover:text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.98] shadow-xs"
                  >
                    <span>Inquire for booking</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OccasionsSection;

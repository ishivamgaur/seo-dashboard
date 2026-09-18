'use client';

import React from 'react';
import Image from 'next/image';

const GallerySection = ({ data }) => {
  const gallery = Array.isArray(data) && data.length > 0 ? data : [];

  if (!gallery.length) return null;

  return (
    <section 
      className="relative py-20 md:py-28 bg-[#fafafa] dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 border-t border-zinc-200/80 dark:border-zinc-800 transition-colors duration-150" 
      id="gallery"
    >
      {/* Subtle Architectural SVG Grid Accent */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">
            Fleet Photography
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2 text-balance">
            Fleet Gallery
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-normal text-pretty">
            Photographs of commercial tempo travellers, executive vans, and luxury coaches in service.
          </p>
        </div>

        {/* Responsive Grid: Concentric Radii, Image Outlines, Zero Hover Zoom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gallery.map((img, idx) => (
            <div
              key={img.id || idx}
              className="flex flex-col bg-white dark:bg-[#121418] rounded-2xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-[border-color,box-shadow] duration-150"
            >
              {/* Image Container: Natural 16:10 Ratio, 1px Image Outline */}
              <div className="relative w-full aspect-[16/10] bg-zinc-100 dark:bg-zinc-900 p-2 overflow-hidden flex items-center justify-center ring-1 ring-black/[0.06] dark:ring-white/[0.06]">
                <Image
                  src={img.imagePath}
                  alt={img.altTag || 'Urban Cruise Vehicle'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain object-center transition-none"
                />
              </div>

              {/* Caption Row with Concentric Alignment */}
              <div className="p-4 bg-white dark:bg-[#121418] border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-zinc-950 dark:text-zinc-100 truncate">
                  {img.altTag || 'Commercial Fleet Vehicle'}
                </p>
                <span className="text-[11px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold shrink-0">
                  VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GallerySection;

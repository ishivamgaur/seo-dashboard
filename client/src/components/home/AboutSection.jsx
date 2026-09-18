'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, UserCheck, Headphones } from 'lucide-react';

const AboutSection = ({ data }) => {
  const sectionTitle = data?.sectionTitle || 'About Urban Cruise';
  const description = data?.description || 'Urban Cruise is India’s premier luxury vehicle rental and chauffeur service, providing seamless corporate transit, destination wedding mobility, and personalized outstation travel with unmatched safety and sophistication.';
  const featuredImage = data?.featuredImage || 'https://urbancruise.in/wp-content/uploads/Luxury-Car-On-Rent-For-Wedding.webp';

  const highlights = [
    { 
      icon: ShieldCheck, 
      title: 'Commercial Fleet Compliance', 
      desc: '100% compliant with speed governors, GPS fleet tracking, and all-India tourist permits.' 
    },
    { 
      icon: UserCheck, 
      title: 'Verified Chauffeurs', 
      desc: 'Background-verified, uniformed drivers trained in VIP protocol and defensive driving.' 
    },
    { 
      icon: Headphones, 
      title: '24/7 Operations Desk', 
      desc: 'Continuous reservation support with live flight tracking and route coordination.' 
    },
  ];

  return (
    <section 
      className="relative py-20 md:py-28 bg-[#fafafa] dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 border-t border-zinc-200/80 dark:border-zinc-800 transition-colors duration-150" 
      id="about"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Featured Image with 1px Image Outline & Natural Aspect */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden shadow-xs border border-zinc-200/90 dark:border-zinc-800 ring-1 ring-black/[0.06] dark:ring-white/[0.06] bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={featuredImage}
                alt={sectionTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Overlay Metadata Card with Concentric Radii */}
              <div className="absolute bottom-5 left-5 right-5 p-4 sm:p-5 rounded-xl bg-white/95 dark:bg-[#121418]/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400 text-xs font-mono uppercase tracking-wider block">
                    Operating History
                  </span>
                  <h4 className="text-zinc-950 dark:text-white font-bold text-base sm:text-lg mt-0.5">
                    10+ Years Pan-India Service
                  </h4>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-mono font-bold text-xs">
                  VERIFIED
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Overview & Specifications */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                Company Overview
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white text-balance leading-tight">
                {sectionTitle}
              </h2>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg font-normal leading-relaxed text-pretty">
              {description}
            </p>

            {/* Specification Cards: Concentric Radii, Optical Alignment, 1.5px Icon Stroke */}
            <div className="space-y-3 pt-2">
              {highlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={idx} 
                    className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-[#121418] border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-[border-color,box-shadow] duration-150"
                  >
                    <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4 stroke-[1.75] text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-zinc-950 dark:text-white font-bold text-sm sm:text-base">
                        {item.title}
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5 font-normal leading-relaxed text-pretty">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

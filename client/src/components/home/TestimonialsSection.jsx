'use client';

import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const TestimonialsSection = ({ data }) => {
  const testimonials = Array.isArray(data) && data.length > 0 ? data : [];

  if (!testimonials.length) return null;

  return (
    <section 
      className="relative py-20 md:py-28 bg-white dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 border-t border-zinc-200/80 dark:border-zinc-800 transition-colors duration-150" 
      id="testimonials"
    >
      {/* Subtle Architectural SVG Grid Accent */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">
            Verified Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-2 text-balance">
            Client Reviews
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base font-normal text-pretty">
            Feedback from event planners, corporate travel managers, and wedding organizers across India.
          </p>
        </div>

        {/* Cards Grid: Concentric Radii, Layered Subtle Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((review, index) => (
            <div
              key={review.id || index}
              className="bg-zinc-50 dark:bg-[#121418] border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-[border-color,box-shadow] duration-150 flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating & Score */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < (review.rating || 5)
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono tabular-nums text-zinc-500">
                    {(review.rating || 5)}.0 / 5.0
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed text-sm sm:text-base mb-6 text-pretty">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>

              {/* Author Info with Optical Alignment */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/70 dark:border-zinc-800">
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white font-mono font-bold text-xs shrink-0">
                  {(review.customerName || 'C').charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-zinc-950 dark:text-white font-bold text-sm truncate">
                    {review.customerName}
                  </h4>
                  <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400 stroke-[2]" />
                    <span>Verified Booking</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;

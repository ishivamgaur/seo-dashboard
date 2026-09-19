'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const VehiclesSection = ({ data }) => {
  const vehicles = Array.isArray(data) && data.length > 0 ? data : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (vehicles.length === 0) return null;

  const currentVehicle = vehicles[selectedIndex] || vehicles[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? vehicles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === vehicles.length - 1 ? 0 : prev + 1));
  };

  const featuresList = Array.isArray(currentVehicle.features)
    ? currentVehicle.features
    : typeof currentVehicle.features === 'string'
    ? JSON.parse(currentVehicle.features || '[]')
    : [];

  return (
    <section 
      className="relative py-16 md:py-20 bg-[#fafafa] dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 border-t border-zinc-200/80 dark:border-zinc-800 transition-colors duration-150" 
      id="vehicles"
    >
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              Fleet Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white text-balance">
              Fleet Showcase
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tabular-nums text-zinc-500">
              <span className="text-zinc-950 dark:text-white font-bold">{selectedIndex + 1}</span> / {vehicles.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous vehicle"
                className="w-9 h-9 rounded-lg bg-white dark:bg-[#121418] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-[background-color,transform] duration-150 ease-out active:scale-[0.96] shadow-xs"
              >
                <ChevronLeft className="w-4 h-4 stroke-[1.75]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next vehicle"
                className="w-9 h-9 rounded-lg bg-white dark:bg-[#121418] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-[background-color,transform] duration-150 ease-out active:scale-[0.96] shadow-xs"
              >
                <ChevronRight className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[76vh] min-h-[560px] max-h-[760px] bg-white dark:bg-[#121418] rounded-2xl border border-zinc-200/90 dark:border-zinc-800 ring-1 ring-black/[0.04] dark:ring-white/[0.04] overflow-hidden flex flex-col justify-between p-6 sm:p-8 shadow-sm">
          
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200/80 dark:border-zinc-700/80">
                Verified Commercial Fleet
              </span>
              <span className="hidden sm:inline-block px-3 py-1 rounded-md bg-zinc-50 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 text-xs font-medium border border-zinc-200/60 dark:border-zinc-700/60">
                All-India Permit
              </span>
            </div>

            <div className="px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs font-bold tabular-nums border border-zinc-200/80 dark:border-zinc-700/80">
              {currentVehicle.seatingCapacity} Seats
            </div>
          </div>

          <div className="relative w-full flex-1 min-h-[300px] sm:min-h-[380px] md:min-h-[440px] my-2 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVehicle.id || selectedIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full min-h-[300px] sm:min-h-[380px] md:min-h-[440px] flex items-center justify-center select-none"
              >
                <Image
                  src={currentVehicle.image || 'https://urbancruise.in/wp-content/uploads/tempo-traveller-9-seater-1x1-1.webp'}
                  alt={currentVehicle.vehicleName}
                  fill
                  priority
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="object-contain object-center transition-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white mb-1">
                {currentVehicle.vehicleName}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-normal leading-relaxed mb-2 line-clamp-1 text-pretty">
                {currentVehicle.description}
              </p>

              {featuresList.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {featuresList.slice(0, 4).map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700/80"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0">
              <Link
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-[background-color,transform] duration-150 ease-out active:scale-[0.98] shadow-xs"
              >
                <span>Reserve Vehicle</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </Link>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mt-4">
          {vehicles.map((v, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                type="button"
                key={v.id || idx}
                onClick={() => setSelectedIndex(idx)}
                className={`p-2.5 rounded-xl border transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] text-left flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-[#121418] text-zinc-700 dark:text-zinc-300 border-zinc-200/90 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                }`}
              >
                <div className="relative w-full h-11">
                  <Image
                    src={v.image}
                    alt={v.vehicleName}
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                </div>
                <span className="text-[11px] font-medium text-center line-clamp-1 font-mono">
                  {v.vehicleName.replace('Tempo Traveller', 'TT')}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default VehiclesSection;

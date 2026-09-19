'use client';

import React from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import SectionShell from '@/components/ui/SectionShell';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { FALLBACK_IMAGES, resolveMediaUrl } from '@/lib/site';
import { parseStringArray } from '@/lib/content';

const ALT_FADE = 'from-[#eceff3] to-[#dde7df] dark:from-[#090a0d] dark:to-[#0c0f14]';

const VehiclesSection = ({ data }) => {
  const vehicles = Array.isArray(data) && data.length > 0 ? data : [];
  if (vehicles.length === 0) return null;

  return (
    <SectionShell id="vehicles" tone="alt" fade={ALT_FADE}>
      <SectionHeader
        eyebrow="Fleet"
        title="Our vehicles"
        description="Choose from tempo travellers, luxury vans and coaches. All rates include driver and permits."
      />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((v, i) => {
          const features = parseStringArray(v.features);
          return (
            <Reveal key={v.id || i} delay={(i % 3) * 0.08} className="h-full">
              <Card className="h-full overflow-hidden flex flex-col">
                <div className="p-2.5 pb-0">
                  <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#f6f8fa] dark:bg-black">
                    <Image
                      src={resolveMediaUrl(v.image, FALLBACK_IMAGES.vehicle)}
                      alt={v.vehicleName}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white truncate">
                      {v.vehicleName}
                    </h3>
                    <Badge>{v.seatingCapacity} seats</Badge>
                  </div>
                  {v.description && (
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {v.description}
                    </p>
                  )}
                  {features.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {features.slice(0, 3).map((f, j) => (
                        <li
                          key={j}
                          className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-600 dark:text-zinc-400"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                    <Button href="#contact" size="md">
                      Reserve
                    </Button>
                  </div>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

export default VehiclesSection;

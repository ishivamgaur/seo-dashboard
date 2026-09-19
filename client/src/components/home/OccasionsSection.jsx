'use client';

import React from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import SectionShell from '@/components/ui/SectionShell';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import { FALLBACK_IMAGES, resolveMediaUrl } from '@/lib/site';

const BASE_FADE = 'from-[#dde7df] to-[#eceff3] dark:from-[#0c0f14] dark:to-[#090a0d]';

const OccasionsSection = ({ data }) => {
  const occasions = Array.isArray(data) && data.length > 0 ? data : [];
  if (!occasions.length) return null;

  return (
    <SectionShell id="occasions" tone="base" fade={BASE_FADE}>
      <SectionHeader eyebrow="Services" title="Occasions we serve" />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {occasions.map((o, i) => (
          <Reveal key={o.id || i} delay={(i % 3) * 0.08} className="h-full">
            <Card className="h-full overflow-hidden">
              {o.image && (
                <div className="p-2.5 pb-0">
                  <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#f6f8fa] dark:bg-black">
                    <Image
                      src={resolveMediaUrl(o.image, FALLBACK_IMAGES.occasion)}
                      alt={o.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="p-5">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">{o.title}</h3>
                {o.description && (
                  <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {o.description}
                  </p>
                )}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
};

export default OccasionsSection;

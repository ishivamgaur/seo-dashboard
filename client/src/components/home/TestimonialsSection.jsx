'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Reveal from './Reveal';
import SectionShell from '@/components/ui/SectionShell';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { resolveMediaUrl } from '@/lib/site';

const ALT_FADE = 'from-[#eceff3] to-[#dde7df] dark:from-[#090a0d] dark:to-[#0c0f14]';

const TestimonialsSection = ({ data }) => {
  const testimonials = Array.isArray(data) && data.length > 0 ? data : [];
  if (!testimonials.length) return null;

  return (
    <SectionShell id="testimonials" tone="alt" fade={ALT_FADE}>
      <SectionHeader eyebrow="Reviews" title="What customers say" />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <Reveal key={t.id || i} delay={(i % 3) * 0.08} className="h-full">
            <Card className="h-full p-5 flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s < (t.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`}
                    />
                  ))}
                </div>
                <Badge>{t.rating || 5}.0 / 5</Badge>
              </div>
              <blockquote className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex-1">
                “{t.review}”
              </blockquote>
              <figcaption className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3">
                {t.customerImage ? (
                  <span className="relative w-8 h-8 rounded-full overflow-hidden bg-[#f1eee7] dark:bg-[#1a1e27] shrink-0">
                    <Image
                      src={resolveMediaUrl(t.customerImage)}
                      alt={t.customerName}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {(t.customerName || 'C').charAt(0)}
                  </span>
                )}
                <span className="text-sm font-semibold text-zinc-950 dark:text-white truncate">
                  {t.customerName}
                </span>
              </figcaption>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
};

export default TestimonialsSection;

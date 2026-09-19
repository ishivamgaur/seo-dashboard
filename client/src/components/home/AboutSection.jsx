'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import Reveal from './Reveal';
import SectionShell from '@/components/ui/SectionShell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FALLBACK_IMAGES, resolveMediaUrl } from '@/lib/site';
import {
  parseStringArray,
  splitParagraphs,
  formatCompact,
  isSameText,
  containsText,
} from '@/lib/content';

const CTA_TEXT = 'Explore our fleet';
const CTA_URL = '#vehicles';

const AboutSection = ({ data }) => {
  const sectionTitle = data?.sectionTitle || 'Chauffeur-driven fleet for every occasion';
  const description =
    data?.description ||
    'Urban Cruise is India’s premier luxury vehicle rental and chauffeur service, providing seamless corporate transit, destination wedding mobility, and personalized outstation travel with unmatched safety and sophistication.';
  const rawSubtitle = data?.subtitle || '';
  const subtitleFallback =
    'Pan-India tempo travellers, luxury vans and coaches for weddings, corporate travel and outstation trips.';
  // Skip the subtitle when it repeats the heading or the description
  const subtitle = (() => {
    const s = rawSubtitle.trim() || subtitleFallback;
    if (isSameText(s, sectionTitle)) return null;
    if (containsText(description, s)) return null;
    return s;
  })();
  const featuredImage = resolveMediaUrl(data?.featuredImage, FALLBACK_IMAGES.about);

  const fallbackHighlights = [
    'Verified chauffeurs with commercial licences',
    'All-India tourist permits on every vehicle',
    '24/7 live dispatch and trip support',
  ];
  const storedHighlights = parseStringArray(data?.highlights);
  const highlightSource = storedHighlights.length > 0 ? storedHighlights : fallbackHighlights;
  // Drop any bullet that just restates the heading, subtitle or description
  const bullets = highlightSource
    .filter(
      (h) =>
        !isSameText(h, sectionTitle) && !containsText(subtitle, h) && !containsText(description, h)
    )
    .slice(0, 3);

  const paragraphs = splitParagraphs(description);

  const stats = [
    { value: data?.yearsExperience ?? 10, suffix: '+', label: 'Years' },
    { value: data?.citiesCovered ?? 15, suffix: '', label: 'Cities' },
    { value: data?.fleetSize ?? 40, suffix: '+', label: 'Vehicles' },
    { value: data?.tripsCompleted ?? 25000, suffix: '+', label: 'Trips', compact: true },
  ];

  return (
    <SectionShell id="about" tone="base" topClass="pt-20 md:pt-24">
      <Card className="p-5 sm:p-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <Reveal>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight text-zinc-950 dark:text-white text-balance">
              {sectionTitle}
            </h2>

            {subtitle && (
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="mt-4 space-y-3">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {bullets.length > 0 && (
              <ul className="mt-5 space-y-2.5">
                {bullets.map((h, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed"
                  >
                    <Check
                      className="mt-0.5 w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0"
                      strokeWidth={2.5}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 grid grid-cols-4 gap-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-5">
              {stats.map((s) => {
                const display = s.compact ? formatCompact(s.value) : s.value;
                return (
                  <div key={s.label} className="min-w-0">
                    <p className="font-mono tabular-nums font-bold text-lg text-zinc-950 dark:text-white whitespace-nowrap">
                      {display}
                      {s.suffix}
                    </p>
                    <p className="mt-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <Button href={CTA_URL} className="mt-6">
              <span>{CTA_TEXT}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="group p-2.5 rounded-xl bg-[#f1eee7] dark:bg-[#1a1e27]">
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#faf7f2] dark:bg-black">
                <Image
                  src={featuredImage}
                  alt={sectionTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Card>
    </SectionShell>
  );
};

export default AboutSection;

import React from 'react';
import SectionFade from '@/components/home/SectionFade';

// Dashboard-matched section tones.
const TONES = {
  base: 'bg-[#eceff3] dark:bg-[#090a0d]',
  alt: 'bg-[#dde7df] dark:bg-[#0c0f14]',
};

// Standard homepage section: tone + melt divider + centered container.
// Keeps every section's spacing identical. Sections without a fade
// (e.g. About, which follows the hero curve) can pass extra top
// padding via `topClass` to match the same visual rhythm.
const SectionShell = ({ id, tone = 'base', fade = null, topClass = 'pt-12 md:pt-16', children }) => {
  return (
    <section id={id} className={TONES[tone] || TONES.base}>
      {fade && <SectionFade className={fade} />}
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 pb-12 md:pb-16 ${topClass}`}>
        {children}
      </div>
    </section>
  );
};

export default SectionShell;

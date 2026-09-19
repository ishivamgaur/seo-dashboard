import React from 'react';
import SectionFade from '@/components/home/SectionFade';

// Dashboard-matched section tones.
const TONES = {
  base: 'bg-[#eceff3] dark:bg-[#090a0d]',
  alt: 'bg-[#dde7df] dark:bg-[#0c0f14]',
};

// Standard homepage section: tone + melt divider + centered container.
// Keeps every section's spacing identical.
const SectionShell = ({ id, tone = 'base', fade = null, children }) => {
  return (
    <section id={id} className={TONES[tone] || TONES.base}>
      {fade && <SectionFade className={fade} />}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">{children}</div>
    </section>
  );
};

export default SectionShell;

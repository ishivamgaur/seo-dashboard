'use client';

import React from 'react';

// Slow tonal melt between two section colors — tall gradient bridge
// so the previous shade dissolves into the next with no visible edge.
// Pass the gradient stops, e.g. from-[#eceff3] to-[#dde7df].
const SectionFade = ({ className = '' }) => {
  return <div aria-hidden="true"       className={`h-12 md:h-16 bg-gradient-to-b ${className}`} />;
};

export default SectionFade;

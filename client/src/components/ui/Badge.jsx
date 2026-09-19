import React from 'react';

// Teal mono pill from the dashboard (seat counts, ratings, totals).
const SIZES = {
  xs: 'px-2 py-0.5 text-[11px]',
  sm: 'px-2.5 py-1 text-xs',
};

const Badge = ({ size = 'xs', className = '', children }) => {
  return (
    <span
      className={`font-mono tabular-nums text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/40 rounded shrink-0 ${SIZES[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

'use client';

import React from 'react';
import Link from 'next/link';

// Single button system for the whole site.
// sm = header bar, md = section CTAs, lg = hero.
const SIZES = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-11 px-6 text-sm',
};

const VARIANTS = {
  primary: 'bg-teal-600 hover:bg-teal-500 text-white',
  ghostOnDark: 'border border-white/30 text-white hover:bg-white/10',
};

const Button = ({
  href,
  type = 'button',
  size = 'md',
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${SIZES[size]} ${VARIANTS[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
};

export default Button;

'use client';

import React from 'react';
import Link from 'next/link';

// Single button system for the whole site — same padding as the
// admin panel buttons (px-4 py-2, text-xs).
const VARIANTS = {
  primary: 'bg-teal-600 hover:bg-teal-500 text-white',
  ghostOnDark: 'border border-white/30 text-white hover:bg-white/10',
};

const Button = ({
  href,
  type = 'button',
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  const cls = `inline-flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-xs font-semibold transition-colors ${VARIANTS[variant]} ${className}`;

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

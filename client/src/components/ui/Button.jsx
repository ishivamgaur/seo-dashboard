"use client";

import React from "react";
import Link from "next/link";

const VARIANTS = {
  primary: "bg-teal-600 hover:bg-teal-500 text-white",
  ghostOnDark: "border border-white/30 text-white hover:bg-white/10",
};

const Button = ({
  href,
  type = "button",
  variant = "primary",
  className = "",
  children,
  onClick,
  ...rest
}) => {
  const cls = `inline-flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-xs font-semibold transition-colors ${VARIANTS[variant]} ${className}`;

  if (href && href.startsWith("#")) {
    return (
      <a href={`/${href}`} onClick={onClick} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;

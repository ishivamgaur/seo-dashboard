"use client";

import React from "react";

const SectionFade = ({ className = "" }) => {
  return <div aria-hidden="true" className={`h-12 md:h-16 bg-gradient-to-b ${className}`} />;
};

export default SectionFade;

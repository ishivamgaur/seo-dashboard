import React from "react";
import SectionFade from "@/components/home/SectionFade";

const TONES = {
  base: "bg-[#eceff3] dark:bg-[#090a0d]",
  alt: "bg-[#dde7df] dark:bg-[#0c0f14]",
};

const SectionShell = ({
  id,
  tone = "base",
  fade = null,
  topClass = "pt-12 md:pt-16",
  children,
}) => {
  return (
    <section id={id} className={TONES[tone] || TONES.base}>
      {fade && <SectionFade className={fade} />}
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 pb-12 md:pb-16 ${topClass}`}>{children}</div>
    </section>
  );
};

export default SectionShell;

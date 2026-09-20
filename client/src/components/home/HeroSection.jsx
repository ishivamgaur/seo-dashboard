"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import Button from "@/components/ui/Button";
import { resolveMediaUrl } from "@/lib/site";

const HeroSection = ({ data }) => {
  if (!data?.heading || !data?.bannerImage) return null;

  const { heading, subHeading, ctaText, ctaUrl, secondaryCtaText, secondaryCtaUrl, badgeText } =
    data;
  const bannerImage = resolveMediaUrl(data.bannerImage);

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950">
      <div className="absolute inset-0">
        <Image
          src={bannerImage}
          alt={heading}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(40px,8vw,96px)] w-full text-[#eceff3] dark:text-[#090a0d]"
      >
        <path d="M0,52 C360,96 1080,96 1440,52 L1440,100 L0,100 Z" fill="currentColor" />
      </svg>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-32 sm:py-44 md:py-56">
        <Reveal className="max-w-xl">
          {badgeText && (
            <span className="inline-block text-xs font-mono text-teal-300 bg-teal-950/60 border border-teal-800/60 px-2.5 py-0.5 rounded font-semibold">
              {badgeText}
            </span>
          )}
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
            {heading}
          </h1>
          {subHeading && (
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">{subHeading}</p>
          )}
          {(ctaText || ctaUrl) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {ctaText && (
                <Button href={ctaUrl || "#contact"}>
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {secondaryCtaText && (
                <Button href={secondaryCtaUrl || "#vehicles"} variant="ghostOnDark">
                  {secondaryCtaText}
                </Button>
              )}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
};

export default HeroSection;

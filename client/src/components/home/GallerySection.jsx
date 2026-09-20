"use client";

import React from "react";
import Reveal from "./Reveal";
import SectionShell from "@/components/ui/SectionShell";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import { resolveMediaUrl } from "@/lib/site";

const BASE_FADE = "from-[#dde7df] to-[#eceff3] dark:from-[#0c0f14] dark:to-[#090a0d]";

const GallerySection = ({ data }) => {
  const gallery = Array.isArray(data) && data.length > 0 ? data : [];
  if (!gallery.length) return null;

  return (
    <SectionShell id="gallery" tone="base" fade={BASE_FADE}>
      <SectionHeader
        eyebrow="Gallery"
        title="Fleet photos"
        aside={
          <Badge size="sm">
            {gallery.length} {gallery.length === 1 ? "photo" : "photos"}
          </Badge>
        }
      />

      <div className="mt-8 columns-2 md:columns-3 gap-3">
        {gallery.map((img, i) => {
          const src = resolveMediaUrl(img.imagePath);
          if (!src) return null;
          return (
            <Reveal key={img.id || i} delay={(i % 3) * 0.06} className="mb-3 break-inside-avoid">
              <div className="group relative rounded-xl overflow-hidden bg-[#faf7f2] dark:bg-[#13161c] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
                <img
                  src={src}
                  alt={img.altTag || "Fleet photo"}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute left-2.5 top-2.5 font-mono tabular-nums text-[11px] font-semibold bg-black/55 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

export default GallerySection;

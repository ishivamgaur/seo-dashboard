"use client";

import React from "react";
import Reveal from "./Reveal";
import FramedImage from "./FramedImage";
import SectionShell from "@/components/ui/SectionShell";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import { resolveMediaUrl } from "@/lib/site";

const BASE_FADE = "from-[#dde7df] to-[#eceff3] dark:from-[#0c0f14] dark:to-[#090a0d]";

const OccasionsSection = ({ data }) => {
  const occasions = Array.isArray(data) && data.length > 0 ? data : [];
  if (!occasions.length) return null;

  return (
    <SectionShell id="occasions" tone="base" fade={BASE_FADE}>
      <SectionHeader eyebrow="Services" title="Occasions we serve" />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {occasions.map((o, i) => {
          if (!o.title) return null;
          const imageSrc = resolveMediaUrl(o.image);
          return (
            <Reveal key={o.id || i} delay={(i % 3) * 0.08} className="h-full">
              <Card interactive className="h-full overflow-hidden group">
                <FramedImage
                  src={imageSrc}
                  alt={o.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  flushBottom
                />
                <div className="p-5">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">{o.title}</h3>
                  {o.description && (
                    <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {o.description}
                    </p>
                  )}
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

export default OccasionsSection;

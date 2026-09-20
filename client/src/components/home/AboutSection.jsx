"use client";

import React from "react";
import Reveal from "./Reveal";
import FramedImage from "./FramedImage";
import SectionShell from "@/components/ui/SectionShell";
import Card from "@/components/ui/Card";
import { resolveMediaUrl } from "@/lib/site";
import { splitParagraphs } from "@/lib/content";

const AboutSection = ({ data }) => {
  if (!data?.sectionTitle || !data?.description || !data?.featuredImage) return null;

  const { sectionTitle, description } = data;
  const featuredImage = resolveMediaUrl(data.featuredImage);
  const paragraphs = splitParagraphs(description);

  return (
    <SectionShell id="about" tone="base" topClass="pt-20 md:pt-24">
      <Card className="p-5 sm:p-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <Reveal>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight text-zinc-950 dark:text-white text-balance">
              {sectionTitle}
            </h2>

            <div className="mt-4 space-y-3">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12} className="group">
            <FramedImage
              src={featuredImage}
              alt={sectionTitle}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </Card>
    </SectionShell>
  );
};

export default AboutSection;

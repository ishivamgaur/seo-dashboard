"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import SectionShell from "@/components/ui/SectionShell";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { resolveMediaUrl } from "@/lib/site";

const ALT_FADE = "from-[#eceff3] to-[#dde7df] dark:from-[#090a0d] dark:to-[#0c0f14]";

const TestimonialsSection = ({ data }) => {
  const testimonials = (Array.isArray(data) ? data : []).filter(
    (t) => t.customerName && t.review
  );
  if (!testimonials.length) return null;

  return (
    <SectionShell id="testimonials" tone="alt" fade={ALT_FADE}>
      <SectionHeader
        eyebrow="Reviews"
        title="What customers say"
        aside={
          <Badge size="sm">
            {testimonials.length} {testimonials.length === 1 ? "review" : "reviews"}
          </Badge>
        }
      />

      <div className="mt-8">
        <Swiper
          modules={[Autoplay]}
          loop={testimonials.length > 3}
          speed={600}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
        >
          {testimonials.map((t, i) => {
            const rating = Number(t.rating) || 0;
            return (
              <SwiperSlide key={t.id || i} className="h-auto pb-1">
                <Card className="h-full min-h-[220px] p-5 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s < rating ? "text-amber-400 fill-amber-400" : "text-zinc-300 dark:text-zinc-700"}`}
                        />
                      ))}
                    </div>
                    {rating > 0 && <Badge>{rating}.0 / 5</Badge>}
                  </div>
                  <blockquote className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex-1">
                    “{t.review}”
                  </blockquote>
                  <figcaption className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3">
                    {t.customerImage ? (
                      <span className="relative w-8 h-8 rounded-full overflow-hidden bg-[#f1eee7] dark:bg-[#1a1e27] shrink-0">
                        <Image
                          src={resolveMediaUrl(t.customerImage)}
                          alt={t.customerName}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {t.customerName.charAt(0)}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-zinc-950 dark:text-white truncate">
                      {t.customerName}
                    </span>
                  </figcaption>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </SectionShell>
  );
};

export default TestimonialsSection;

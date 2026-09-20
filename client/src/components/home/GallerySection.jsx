"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Reveal from "./Reveal";
import SectionShell from "@/components/ui/SectionShell";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import { resolveMediaUrl } from "@/lib/site";

const BASE_FADE = "from-[#dde7df] to-[#eceff3] dark:from-[#0c0f14] dark:to-[#090a0d]";

const GallerySection = ({ data }) => {
  const gallery = Array.isArray(data) && data.length > 0 ? data : [];
  const photos = gallery
    .map((img, i) => ({ ...img, key: img.id || i, src: resolveMediaUrl(img.imagePath), n: i + 1 }))
    .filter((p) => p.src);
  const [active, setActive] = useState(null);
  const touchX = React.useRef(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir) => setActive((a) => (a === null ? a : (a + dir + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  if (!gallery.length) return null;

  const current = active !== null ? photos[active] : null;

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
        {photos.map((p, i) => (
          <Reveal key={p.key} delay={(i % 3) * 0.06} className="mb-3 break-inside-avoid">
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group relative block w-full text-left rounded-xl overflow-hidden bg-[#faf7f2] dark:bg-[#13161c] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] cursor-zoom-in"
            >
              <motion.div layoutId={`fleet-photo-${p.key}`}>
                <img
                  src={p.src}
                  alt={p.altTag || "Fleet photo"}
                  loading="lazy"
                  className="w-full h-auto block"
                />
              </motion.div>
              <span className="absolute left-2.5 top-2.5 font-mono tabular-nums text-[11px] font-semibold bg-black/55 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                {String(p.n).padStart(2, "0")}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              aria-hidden="true"
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`fleet-photo-${current.key}`}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-3xl rounded-xl overflow-hidden bg-black"
              onTouchStart={(e) => {
                touchX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                if (dx < -50) step(1);
                else if (dx > 50) step(-1);
              }}
            >
              <img
                src={current.src}
                alt={current.altTag || "Fleet photo"}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pt-10 pb-4 flex items-end justify-between gap-3">
                <span className="text-sm font-medium text-white truncate">
                  {current.altTag || "Fleet photo"}
                </span>
                <span className="font-mono tabular-nums text-xs text-zinc-300 shrink-0">
                  {String(current.n).padStart(2, "0")} /{" "}
                  {String(photos.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
            <button
              type="button"
              onClick={close}
              aria-label="Close photo"
              className="absolute top-4 right-4 h-8 w-8 inline-flex items-center justify-center rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer hidden sm:inline-flex"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer hidden sm:inline-flex"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
};

export default GallerySection;

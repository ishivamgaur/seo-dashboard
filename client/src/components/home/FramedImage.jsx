"use client";

import React from "react";
import Image from "next/image";

export default function FramedImage({
  src,
  alt,
  aspect = "aspect-[16/10]",
  sizes = "100vw",
  flushBottom = false,
}) {
  if (!src) return null;
  return (
    <div
      className={`rounded-xl bg-[#f1eee7] dark:bg-[#1a1e27] ${flushBottom ? "p-2.5 pb-0" : "p-2.5"}`}
    >
      <div className={`relative w-full ${aspect} rounded-lg overflow-hidden`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
    </div>
  );
}

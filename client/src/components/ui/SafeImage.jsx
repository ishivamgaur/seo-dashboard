"use client";

import React from "react";
import Image from "next/image";

// next/image without hostname validation. Admin previews render
// arbitrary pasted urls that can never be allowlisted, so the image
// is served directly instead of going through the optimizer.
const passthroughLoader = ({ src }) => src;

export default function SafeImage({ alt = "", ...props }) {
  return <Image loader={passthroughLoader} alt={alt} {...props} />;
}

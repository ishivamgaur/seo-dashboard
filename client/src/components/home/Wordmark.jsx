import React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/site";

const [firstWord, ...restWords] = BRAND.logoWordmark.split(" ");

export default function Wordmark() {
  return (
    <Link
      href="/"
      className="text-[15px] font-black font-mono tracking-[0.14em] text-zinc-950 dark:text-white shrink-0"
    >
      {firstWord} <span className="text-teal-500 dark:text-teal-400">{restWords.join(" ")}</span>
    </Link>
  );
}

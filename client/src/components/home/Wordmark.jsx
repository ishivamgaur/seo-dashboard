"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BRAND } from "@/lib/site";

const [firstWord, ...restWords] = BRAND.logoWordmark.split(" ");

export default function Wordmark() {
  const pathname = usePathname();
  const router = useRouter();

  const goHome = (e) => {
    e.preventDefault();
    window.history.replaceState(null, "", "/");
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <Link
      href="/"
      onClick={goHome}
      className="text-[15px] font-black font-mono tracking-[0.14em] text-zinc-950 dark:text-white shrink-0"
    >
      {firstWord} <span className="text-teal-500 dark:text-teal-400">{restWords.join(" ")}</span>
    </Link>
  );
}

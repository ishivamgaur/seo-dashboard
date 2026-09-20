import React from "react";
import Link from "next/link";
import ThemeSelector from "@/components/common/ThemeSelector";
import { BRAND } from "@/lib/site";
import SectionFade from "@/components/home/SectionFade";
import Wordmark from "./Wordmark";

const FOOTER_LINKS = [
  { href: "#about", label: "About" },
  { href: "#vehicles", label: "Fleet" },
  { href: "#contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

const SiteFooter = () => {
  return (
    <footer className="bg-[#faf7f2] dark:bg-[#0d1117]">
      <SectionFade className="from-[#dde7df] to-[#faf7f2] dark:from-[#0c0f14] dark:to-[#0d1117]" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Wordmark />
          <nav className="flex flex-wrap gap-4 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-zinc-950 dark:hover:text-zinc-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <ThemeSelector />
        </div>
        <p className="mt-6 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;

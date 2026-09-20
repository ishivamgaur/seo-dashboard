"use client";

import React from "react";
import Link from "next/link";
import { User } from "lucide-react";
import Button from "@/components/ui/Button";
import Wordmark from "./Wordmark";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#vehicles", label: "Fleet" },
  { href: "/#occasions", label: "Services" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 h-14 bg-[#f4f5f3] dark:bg-[#0d1117] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
        <Wordmark />

        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-zinc-950 dark:hover:text-zinc-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden sm:inline-flex h-8 px-4 items-center justify-center gap-1.5 rounded-lg bg-[#e9ece9] dark:bg-[#1a1e27] text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            title="Admin Dashboard"
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-none">Admin</span>
          </Link>
          <Button href="/#contact">Book</Button>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

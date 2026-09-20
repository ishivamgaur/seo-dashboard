"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- hash nav intentionally bypasses the router */
import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CarFront, Compass, Images, Info, Menu, Phone, Star, User, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Wordmark from "./Wordmark";

const NAV_LINKS = [
  { href: "/#about", label: "About", icon: Info },
  { href: "/#vehicles", label: "Fleet", icon: CarFront },
  { href: "/#occasions", label: "Services", icon: Compass },
  { href: "/#gallery", label: "Gallery", icon: Images },
  { href: "/#testimonials", label: "Reviews", icon: Star },
  { href: "/#contact", label: "Contact", icon: Phone },
];

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    // flushSync applies the unlock before the browser performs the
    // anchor jump, so the scroll lock can never swallow navigation.
    flushSync(() => {
      setMenuOpen(false);
    });
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 h-14 bg-[#f4f5f3] dark:bg-[#0d1117] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
        <Wordmark />

        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-zinc-950 dark:hover:text-zinc-100">
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
          <Button href="/#contact" className="hidden sm:inline-flex">
            Book
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden h-8 w-8 inline-flex items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <div
              aria-hidden="true"
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 cursor-default"
            />
            <motion.nav
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="md:hidden absolute inset-x-2 top-[calc(100%+8px)] z-50 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-[#f4f5f3]/85 dark:bg-[#13161c]/85 backdrop-blur-xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
            >
              <div className="p-2">
                {NAV_LINKS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800/70 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-teal-600/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      {l.label}
                    </a>
                  );
                })}
              </div>
              <div className="flex gap-2 p-3 pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70 sm:hidden">
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#e9ece9] dark:bg-[#1a1e27] text-zinc-700 dark:text-zinc-300 text-xs font-medium"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Admin</span>
                </Link>
                <a
                  href="/#contact"
                  onClick={closeMenu}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-xs font-semibold transition-colors bg-teal-600 hover:bg-teal-500 text-white"
                >
                  Book
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteHeader;

import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { BRAND } from '@/lib/site';
import Button from '@/components/ui/Button';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#vehicles', label: 'Fleet' },
  { href: '#occasions', label: 'Services' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
];

const [firstWord, ...restWords] = BRAND.logoWordmark.split(' ');

// Sticky dashboard-style header: mono wordmark, section nav,
// admin pill + compact booking CTA.
const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 h-14 bg-[#faf7f2] dark:bg-[#0d1117] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
        <Link
          href="/"
          className="text-[15px] font-black font-mono tracking-[0.14em] text-zinc-950 dark:text-white shrink-0"
        >
          {firstWord}{' '}
          <span className="text-teal-500 dark:text-teal-400">{restWords.join(' ')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-400">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-zinc-950 dark:hover:text-zinc-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden sm:inline-flex h-8 px-4 items-center justify-center gap-1.5 rounded-lg bg-[#f1eee7] dark:bg-[#1a1e27] text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            title="Admin Dashboard"
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-none">Admin</span>
          </Link>
          <Button href="#contact">
            Book
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;

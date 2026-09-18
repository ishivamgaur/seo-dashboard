'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, Menu, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeSelector from '@/components/common/ThemeSelector';

export default function Header({ onMenuClick = () => {} }) {
  const pathname = usePathname();
  const auth = useAuth() || { user: { name: 'Admin User' }, logout: () => {} };
  const { user, logout } = auth;

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard Overview';
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 1) {
      const page = parts[1];
      if (page === 'seo') return 'SEO Settings & Schema Markup';
      if (page === 'vehicles') return 'Fleet Vehicles Management';
      if (page === 'occasions') return 'Services & Occasions';
      if (page === 'testimonials') return 'Client Testimonials';
      if (page === 'gallery') return 'Fleet Gallery';
      if (page === 'content') return 'Homepage Content & Sections';
      return page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
    }
    return 'Dashboard Overview';
  };

  return (
    <header className="h-14 bg-white dark:bg-[#0d1117] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
      {/* Left side: Hamburger (mobile only) & Clean Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] transition-colors cursor-pointer"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5 stroke-[1.75]" />
        </button>

        <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: Uniform h-8 buttons with matching padding, styles */}
      <div className="flex items-center gap-2">
        {/* Minimal Theme Toggle */}
        <ThemeSelector minimal={true} />

        {/* View Site Button */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-medium transition-colors cursor-pointer"
          title="View live website"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0 stroke-[1.75]" />
          <span className="hidden sm:inline leading-none">View Site</span>
        </Link>

        {/* Admin Profile Badge */}
        <div
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27] text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none"
          title={`Administrator: ${user?.name || 'Admin'} (${user?.email || 'admin@seodashboard.com'})`}
        >
          <User className="w-3.5 h-3.5 shrink-0 text-teal-600 dark:text-teal-400 stroke-[1.75]" />
          <span className="leading-none">Admin</span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27] text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0 stroke-[1.75]" />
          <span className="hidden sm:inline leading-none">Logout</span>
        </button>
      </div>
    </header>
  );
}

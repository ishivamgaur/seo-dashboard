"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Menu, ExternalLink, MoreVertical, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import ThemeSelector from "@/components/common/ThemeSelector";

export default function Header({ onMenuClick = () => {} }) {
  const pathname = usePathname();
  const auth = useAuth() || { user: { name: "Admin User" }, logout: () => {} };
  const { user, logout } = auth;
  const { theme, setTheme } = useTheme();
  const [actionsOpen, setActionsOpen] = useState(false);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (!actionsOpen) return;
    const close = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) setActionsOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setActionsOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [actionsOpen]);

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Overview";
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length > 1) {
      const page = parts[1];
      if (page === "seo") return "SEO Settings & Schema Markup";
      if (page === "vehicles") return "Fleet Vehicles Management";
      if (page === "occasions") return "Services & Occasions";
      if (page === "testimonials") return "Client Testimonials";
      if (page === "gallery") return "Fleet Gallery";
      if (page === "content") return "Homepage Content & Sections";
      return page.charAt(0).toUpperCase() + page.slice(1).replace("-", " ");
    }
    return "Dashboard Overview";
  };

  const isDark = theme === "dark";
  const roleLabel = user?.role === "editor" ? "Editor" : "Admin";

  return (
    <header className="h-16 bg-white dark:bg-[#0d1117] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
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

      <div className="hidden md:flex items-center gap-2">
        <ThemeSelector minimal={true} />

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

        <div
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#1a1e27] text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none"
          title={`${roleLabel}: ${user?.name || "Admin"} (${user?.email || "admin@seodashboard.com"})`}
        >
          <User className="w-3.5 h-3.5 shrink-0 text-teal-600 dark:text-teal-400 stroke-[1.75]" />
          <span className="leading-none">{roleLabel}</span>
        </div>

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

      <div ref={actionsRef} className="relative md:hidden">
        <button
          type="button"
          onClick={() => setActionsOpen((v) => !v)}
          aria-label="Header actions"
          aria-expanded={actionsOpen}
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] transition-colors cursor-pointer"
        >
          <MoreVertical className="w-5 h-5 stroke-[1.75]" />
        </button>

        {actionsOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white dark:bg-[#13161c] border border-zinc-200 dark:border-zinc-800 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] p-1.5 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setTheme(isDark ? "light" : "dark");
                setActionsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? "Light mode" : "Dark mode"}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setActionsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View site</span>
            </Link>

            <div className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/60 mt-1 pt-2.5">
              <User className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="truncate">Admin</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setActionsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

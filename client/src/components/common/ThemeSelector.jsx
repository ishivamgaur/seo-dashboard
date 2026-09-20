"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeSelector({ minimal = false }) {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={
          minimal
            ? "h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
            : "inline-flex items-center p-1 rounded-full bg-zinc-200/60 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800"
        }
      >
        {!minimal && <span className="px-3 py-1 text-xs font-medium text-zinc-500">Theme</span>}
      </div>
    );
  }

  if (minimal) {
    const isDark = theme === "dark";
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        {isDark ? (
          <Sun className="w-4 h-4 stroke-[1.75]" />
        ) : (
          <Moon className="w-4 h-4 stroke-[1.75]" />
        )}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Color theme selector"
      className="inline-flex items-center gap-1 p-1 rounded-full bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-800 shadow-inner"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        aria-label="Switch to Light theme"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide cursor-pointer active:scale-[0.96] ${
          theme === "light"
            ? "bg-white text-zinc-950 shadow-xs ring-1 ring-zinc-300/80 font-bold"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-teal-500 stroke-[2]" />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        aria-label="Switch to Dark theme"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide cursor-pointer active:scale-[0.96] ${
          theme === "dark"
            ? "bg-zinc-800 text-white shadow-xs ring-1 ring-zinc-700 font-bold"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-teal-400 stroke-[2]" />
        <span>Dark</span>
      </button>
    </div>
  );
}

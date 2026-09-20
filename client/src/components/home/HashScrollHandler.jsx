"use client";

import { useEffect } from "react";

// Deep-link support: opening /#vehicles (or clicking any hash link)
// glides to the section instead of jumping, on first load and on change.
// Scroll restoration stays manual so refreshes never jump mid-load.
export default function HashScrollHandler() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scroll = () => {
      const hash = window.location.hash;
      if (!hash) {
        window.scrollTo(0, 0);
        return;
      }
      try {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } catch {
        // ignore invalid selectors
      }
    };
    const timer = setTimeout(scroll, 120);
    window.addEventListener("hashchange", scroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", scroll);
    };
  }, []);

  return null;
}

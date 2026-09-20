"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function FilterSelect({ label, value, onChange, options = [], className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentOption = options.find((opt) => {
    const optVal = typeof opt === "object" ? opt.value : opt;
    return String(optVal) === String(value);
  });

  const displayLabel = currentOption
    ? typeof currentOption === "object"
      ? currentOption.label
      : currentOption
    : value;

  const isSelected = value !== "all" && value !== "";

  return (
    <div ref={containerRef} className={`relative inline-flex items-center z-30 ${className}`}>
      {label && (
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 select-none hidden sm:inline mr-2">
          {label}:
        </span>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`h-8 inline-flex items-center justify-between gap-2.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer outline-none select-none ${
          isSelected
            ? "bg-teal-50/70 dark:bg-teal-950/40 border border-teal-500/70 dark:border-teal-500/60 text-teal-700 dark:text-teal-300 font-semibold"
            : "bg-[#f6f8fa] dark:bg-[#1a1e27] border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
        }`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 stroke-[1.75] transition-transform duration-150 ${
            isOpen ? "rotate-180 text-zinc-700 dark:text-zinc-300" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 mt-1 min-w-[140px] w-max z-50 p-1 bg-white dark:bg-[#13161c] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]"
        >
          {options.map((opt) => {
            const optVal = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            const isOptionActive = String(optVal) === String(value);

            return (
              <button
                key={optVal}
                type="button"
                role="option"
                aria-selected={isOptionActive}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  isOptionActive
                    ? "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <span>{optLabel}</span>
                {isOptionActive && (
                  <Check className="w-3.5 h-3.5 stroke-[2] text-teal-600 dark:text-teal-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

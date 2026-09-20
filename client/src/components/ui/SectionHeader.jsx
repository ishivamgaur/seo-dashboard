import React from "react";

const SectionHeader = ({ eyebrow, title, description, aside }) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
            {eyebrow}
          </p>
        )}
        <h2
          className={`${eyebrow ? "mt-2" : ""} text-xl sm:text-2xl font-bold tracking-tight leading-tight text-zinc-950 dark:text-white text-balance`}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>
      {aside && <div className="shrink-0 pt-0.5">{aside}</div>}
    </div>
  );
};

export default SectionHeader;

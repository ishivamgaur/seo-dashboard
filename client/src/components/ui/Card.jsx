import React from 'react';

// Dashboard-matched surface: white / #13161c with the standard soft shadow.
// The teal edge-glow is opt-in via `interactive` — listing cards like
// vehicles and occasions invite hover; static panels do not.
const Card = ({ interactive = false, className = '', children }) => {
  return (
    <div
      className={`rounded-xl bg-[#faf7f2] dark:bg-[#13161c] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${
        interactive
          ? 'border border-transparent hover:border-teal-600/15 dark:hover:border-teal-400/15 transition-colors duration-300'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

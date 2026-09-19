import React from 'react';

// Dashboard-matched surface: white / #13161c with the standard soft shadow.
const Card = ({ className = '', children }) => {
  return (
    <div
      className={`rounded-xl bg-white dark:bg-[#13161c] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

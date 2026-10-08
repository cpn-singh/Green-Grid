import React from 'react';

/**
 * Standard container with max-width 1320px matching DESIGN_SYSTEM.md (.sf-container)
 */
export default function Container({ children, className = '', ...props }) {
  return (
    <div
      className={`max-w-[1320px] mx-auto px-6 md:px-10 w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

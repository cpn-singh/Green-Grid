import React from 'react';

/**
 * Tactical Glass Card component with corner targeting brackets (.sf-card-corner)
 */
export default function Card({
  children,
  className = '',
  hasCorners = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`sf-card p-6 md:p-8 ${className}`}
      {...props}
    >
      {hasCorners && (
        <>
          <span className="sf-card-corner tl" />
          <span className="sf-card-corner tr" />
          <span className="sf-card-corner bl" />
          <span className="sf-card-corner br" />
        </>
      )}
      {children}
    </div>
  );
}

import React from 'react';

/**
 * Reusable Button component supporting primary (.sf-btn), nav pill (.sf-nav-btn), and cluster pill (.sf-cluster-pill)
 */
export default function Button({
  children,
  variant = 'primary', // 'primary', 'nav', 'pill', 'outline'
  active = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  if (variant === 'nav') {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`sf-nav-btn ${active ? 'active' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`sf-cluster-pill ${active ? 'active' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 text-neutral-300 hover:text-white font-mono text-xs tracking-wider transition-all duration-200 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  // Default 'primary'
  return (
    <button
      type={type}
      onClick={onClick}
      className={`sf-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

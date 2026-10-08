import React from 'react';

/**
 * Micro-Badge component matching .sf-badge with optional pulsing emerald dot
 */
export default function Badge({
  children,
  hasPulse = true,
  className = '',
  ...props
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/[0.08] border border-emerald-500/25 rounded text-[11px] font-mono tracking-[2px] uppercase text-emerald-400 select-none ${className}`}
      {...props}
    >
      {hasPulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-[sfPulse_2s_infinite]" />
      )}
      <span>{children}</span>
    </div>
  );
}

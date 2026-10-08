import React from 'react';

/**
 * Standard semantic Section component with consistent padding and background variants
 */
export default function Section({
  children,
  id,
  className = '',
  variant = 'deep', // 'deep' (#020504), 'canvas' (#040806), 'base' (#000000)
  hasDivider = false,
  ...props
}) {
  const bgStyles = {
    deep: 'bg-[#020504]/55 backdrop-blur-[2px]',
    canvas: 'bg-[#040806]/40 backdrop-blur-[1px]',
    base: 'bg-transparent',
    transparent: 'bg-transparent'
  };

  const dividerStyle = hasDivider ? 'border-t border-white/[0.08]' : '';

  return (
    <section
      id={id}
      className={`relative py-20 md:py-28 overflow-hidden ${bgStyles[variant] || bgStyles.deep} ${dividerStyle} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

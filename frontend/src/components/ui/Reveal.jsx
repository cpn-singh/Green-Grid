import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll-Reveal animation wrapper using IntersectionObserver.
 * Strictly animates only opacity and transform for maximum 60fps/120fps GPU performance.
 * Respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0, // delay in ms
  threshold = 0.15,
  direction = 'up', // 'up', 'none'
  className = '',
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    // Respect user's reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const currentEl = domRef.current;
    if (!currentEl) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(currentEl);

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, [threshold]);

  const transformStyle = direction === 'up'
    ? isVisible ? 'translateY(0)' : 'translateY(24px)'
    : 'none';

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: transformStyle,
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform'
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

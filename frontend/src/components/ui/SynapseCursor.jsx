import React, { useEffect, useRef } from 'react';

/**
 * SynapseCursor
 * Lightweight hardware-accelerated cursor with smooth lag-ring and particle spark trail.
 * Avoids React re-renders on mouse movement for optimal 60+ FPS performance.
 */
export default function SynapseCursor() {
  const canvasRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const lastMousePos = useRef({ x: -100, y: -100 });
  const particles = useRef([]);
  const animFrameId = useRef(null);
  const isVisible = useRef(false);
  const isHovered = useRef(false);
  const isClicking = useRef(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      return;
    }

    const canvas = canvasRef.current;
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!canvas || !dot || !ring) return;

    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const updateVisibility = (visible) => {
      isVisible.current = visible;
      const opacity = visible ? '1' : '0';
      canvas.style.opacity = opacity;
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
    };

    const updateRingStyle = () => {
      if (isHovered.current) {
        dot.style.width = '8px';
        dot.style.height = '8px';
        dot.style.backgroundColor = '#34d399';
        ring.style.width = '48px';
        ring.style.height = '48px';
        ring.style.borderColor = 'rgba(52, 211, 153, 0.75)';
        ring.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
      } else if (isClicking.current) {
        dot.style.width = '5px';
        dot.style.height = '5px';
        dot.style.backgroundColor = '#10b981';
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.borderColor = 'rgba(16, 185, 129, 0.6)';
        ring.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
      } else {
        dot.style.width = '5px';
        dot.style.height = '5px';
        dot.style.backgroundColor = '#10b981';
        ring.style.width = '28px';
        ring.style.height = '28px';
        ring.style.borderColor = 'rgba(16, 185, 129, 0.45)';
        ring.style.backgroundColor = 'rgba(16, 185, 129, 0.03)';
      }
    };

    const handleMouseMove = (e) => {
      if (!isVisible.current) updateVisibility(true);
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 8 && particles.current.length < 16) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.0 - dx * 0.05,
          vy: (Math.random() - 0.5) * 1.0 - dy * 0.05,
          size: Math.random() * 2 + 1,
          maxLife: 18,
          life: 0,
          hue: Math.random() > 0.4 ? 158 : 172
        });
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = () => {
      isClicking.current = true;
      updateRingStyle();

      const { x, y } = mousePos.current;
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.5,
          maxLife: 24,
          life: 0,
          hue: 155
        });
      }
    };

    const handleMouseUp = () => {
      isClicking.current = false;
      updateRingStyle();
    };

    const handleMouseOver = (e) => {
      const interactive = Boolean(
        e.target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer, [data-interactive="true"]')
      );
      if (interactive !== isHovered.current) {
        isHovered.current = interactive;
        updateRingStyle();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', () => updateVisibility(false));
    document.addEventListener('mouseenter', () => updateVisibility(true));
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // 60-120 FPS render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      ringPos.current.x += (mx - ringPos.current.x) * 0.18;
      ringPos.current.y += (my - ringPos.current.y) * 0.18;

      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          particles.current.splice(i, 1);
          continue;
        }

        const alpha = (1 - progress) * 0.8;
        const currentSize = p.size * (1 - progress * 0.4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${alpha})`;
        ctx.fill();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998] transition-opacity duration-300 opacity-0"
      />
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200 opacity-0"
        style={{
          width: '5px',
          height: '5px',
          backgroundColor: '#10b981',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.7)'
        }}
      />
      <div
        ref={cursorRingRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-150 ease-out opacity-0"
        style={{
          width: '28px',
          height: '28px',
          borderColor: 'rgba(16, 185, 129, 0.45)',
          backgroundColor: 'rgba(16, 185, 129, 0.03)',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />
    </>
  );
}

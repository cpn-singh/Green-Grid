import React, { useEffect, useRef, useState } from 'react';

/**
 * SynapseCursor
 * High-performance neural/synaptic cursor effect with synaptic bouton core,
 * action-potential outer membrane, and bio-luminescent neurotransmitter spark trails.
 */
export default function SynapseCursor() {
  const canvasRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position references to avoid React re-render bottleneck on every mousemove
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const lastMousePos = useRef({ x: -100, y: -100 });
  const particles = useRef([]);
  const animFrameId = useRef(null);

  useEffect(() => {
    // Detect touch-only devices to disable custom cursor
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Calculate speed
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spawn synaptic vesicle spark particles on movement (throttled for high FPS)
      if (dist > 6 && particles.current.length < 18) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2 - dx * 0.06,
          vy: (Math.random() - 0.5) * 1.2 - dy * 0.06,
          size: Math.random() * 2 + 1,
          maxLife: 20,
          life: 0,
          hue: Math.random() > 0.4 ? 158 : 172 // Emerald mint to cyan synapse glow
        });
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      // Emit radial synaptic action potential discharge sparks
      const { x, y } = mousePos.current;
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 3.5 + 2.0;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 2,
          maxLife: 30,
          life: 0,
          hue: 155
        });
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect clickable elements for synaptic firing state
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role=\"button\"]') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('.cursor-pointer') ||
        target.closest('[data-interactive=\"true\"]')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Animation Loop (60-120 FPS requestAnimationFrame)
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Smooth lag interpolation for synaptic outer membrane ring (lerp factor 0.16)
      ringPos.current.x += (mx - ringPos.current.x) * 0.16;
      ringPos.current.y += (my - ringPos.current.y) * 0.16;

      // Update DOM cursor elements using fast GPU translate3d
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      // Update and render synaptic neurotransmitter particles & electrical filaments
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

        const alpha = (1 - progress) * 0.85;
        const currentSize = p.size * (1 - progress * 0.4);

        // Draw electrical filament connecting close particles to synaptic bouton
        const distToCenter = Math.hypot(p.x - mx, p.y - my);
        if (distToCenter < 55 && Math.random() > 0.4) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `hsla(${p.hue}, 90%, 65%, ${alpha * 0.25})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // Draw particle with hardware-accelerated synaptic glow aura (no CPU shadowBlur)
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha * 0.22})`;
        ctx.fill();

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
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Background Spark Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998] transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      />

      {/* Center Synaptic Bouton Dot */}
      <div
        ref={cursorDotRef}
        className={`pointer-events-none fixed top-0 left-0 z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: isHovered ? '8px' : '5px',
          height: isHovered ? '8px' : '5px',
          backgroundColor: isHovered ? '#34d399' : '#10b981',
          boxShadow: isHovered
            ? '0 0 14px #34d399, 0 0 24px rgba(52, 211, 153, 0.8)'
            : '0 0 8px #10b981, 0 0 16px rgba(16, 185, 129, 0.6)'
        }}
      />

      {/* Outer Action-Potential Membrane Ring */}
      <div
        ref={cursorRingRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-150 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: isClicking ? '44px' : isHovered ? '50px' : '30px',
          height: isClicking ? '44px' : isHovered ? '50px' : '30px',
          borderColor: isHovered
            ? 'rgba(52, 211, 153, 0.75)'
            : 'rgba(16, 185, 129, 0.45)',
          backgroundColor: isHovered
            ? 'rgba(16, 185, 129, 0.12)'
            : isClicking
            ? 'rgba(16, 185, 129, 0.20)'
            : 'rgba(16, 185, 129, 0.03)',
          boxShadow: isHovered
            ? '0 0 22px rgba(52, 211, 153, 0.45), inset 0 0 10px rgba(16, 185, 129, 0.25)'
            : '0 0 12px rgba(16, 185, 129, 0.25)',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      />
    </>
  );
}

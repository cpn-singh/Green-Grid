import React, { useState, useEffect, useRef } from 'react';

/**
 * OrbitalEarthBackground
 *
 * Confined strictly to the Hero / Logo page:
 * - Displays Earth orbit view or descent flyover during the initial hero interaction.
 * - Confined to the hero section (h-screen) so it never bleeds into or runs behind the sources pages.
 * - Automatically pauses video playback when scrolled away from the hero to conserve resources.
 */
export default function OrbitalEarthBackground({
  isInitiated = false,
  onDescentComplete,
  onResetOrbit,
  onReplayDescent,
  opacity = 1,
  skipToGround = false,
}) {
  const [descentFinished, setDescentFinished] = useState(() => skipToGround);
  const heroVideoRef = useRef(null);
  const earthVideoRef = useRef(null);
  const containerRef = useRef(null);

  // Initial video setup on mount
  useEffect(() => {
    if (skipToGround) {
      setDescentFinished(true);
      if (heroVideoRef.current) {
        heroVideoRef.current.currentTime = 7.0;
        heroVideoRef.current.play().catch(() => {});
      }
      if (earthVideoRef.current) {
        earthVideoRef.current.pause();
      }
    } else {
      if (heroVideoRef.current) {
        heroVideoRef.current.pause();
        heroVideoRef.current.currentTime = 0;
      }
    }
  }, [skipToGround]);

  // Handle transition when isInitiated changes
  useEffect(() => {
    if (skipToGround) return;
    if (isInitiated) {
      setDescentFinished(false);

      if (heroVideoRef.current) {
        heroVideoRef.current.currentTime = 0;
        heroVideoRef.current.play().catch(() => {});
      }

      const t = setTimeout(() => {
        if (earthVideoRef.current) {
          earthVideoRef.current.pause();
        }
      }, 700);

      return () => clearTimeout(t);
    } else {
      setDescentFinished(false);

      if (heroVideoRef.current) {
        heroVideoRef.current.pause();
        heroVideoRef.current.currentTime = 0;
      }

      if (earthVideoRef.current) {
        earthVideoRef.current.currentTime = 0;
        earthVideoRef.current.play().catch(() => {});
      }
    }
  }, [isInitiated]);

  // Pause videos when scrolled out of view (opacity reaches zero or below threshold)
  useEffect(() => {
    const isVisible = opacity > 0.05;
    if (!isVisible) {
      if (heroVideoRef.current) heroVideoRef.current.pause();
      if (earthVideoRef.current) earthVideoRef.current.pause();
    } else {
      if (isInitiated && heroVideoRef.current && heroVideoRef.current.paused) {
        heroVideoRef.current.play().catch(() => {});
      } else if (!isInitiated && earthVideoRef.current && earthVideoRef.current.paused) {
        earthVideoRef.current.play().catch(() => {});
      }
    }
  }, [opacity, isInitiated]);

  // Track playback time of hero descent video
  const handleHeroTimeUpdate = () => {
    if (!heroVideoRef.current) return;
    const curTime = heroVideoRef.current.currentTime;

    if (curTime >= 7.0 && !descentFinished) {
      setDescentFinished(true);
      if (onDescentComplete) onDescentComplete();
    }

    if (curTime >= 9.6) {
      heroVideoRef.current.currentTime = 6.0;
    }
  };

  // Subtle pointer parallax within the hero
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!containerRef.current) return;
      const mx = (e.clientX / window.innerWidth - 0.5) * 8;
      const my = (e.clientY / window.innerHeight - 0.5) * 6;
      containerRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const isHidden = opacity <= 0.01;

  return (
    <div
      className={`absolute top-0 inset-x-0 h-screen pointer-events-none z-0 overflow-hidden select-none bg-[#000204] transition-opacity duration-300 ${
        isHidden ? 'hidden' : ''
      }`}
      style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
    >
      {/* Parallax Container */}
      <div
        ref={containerRef}
        className="absolute -inset-[3%] w-[106%] h-[106%] flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
      >
        {/* Orbital Earth Video (Mode 1) */}
        <video
          ref={earthVideoRef}
          src="/earth_orbit_clean.webm"
          autoPlay
          loop
          muted
          playsInline
          style={{
            transform: 'rotate(155deg) scale(2.2) translate(-8%, -12%)',
            transformOrigin: '55% 45%',
            opacity: isInitiated ? 0 : 1,
            transition: 'opacity 600ms ease-out',
          }}
          className="absolute w-[130vw] h-[130vh] max-w-none object-cover brightness-[0.98] contrast-[1.10] saturate-[1.08] will-change-transform"
        />

        {/* Hero Descent Video (Mode 2) */}
        <video
          ref={heroVideoRef}
          src="/hero_descent.mp4"
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleHeroTimeUpdate}
          style={{
            opacity: isInitiated ? 1 : 0,
            transition: 'opacity 600ms ease-out',
          }}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.96] contrast-[1.05]"
        />
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000204] via-transparent to-[#000204]/40 pointer-events-none" />
    </div>
  );
}

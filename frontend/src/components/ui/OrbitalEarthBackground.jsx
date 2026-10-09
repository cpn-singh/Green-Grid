import React, { useState, useEffect, useRef } from 'react'

/**
 * OrbitalEarthBackground
 *
 * Mode 1: Orbital Landing Page (Default)
 * - Pristine revolving 4K/LEO Earth view (/earth_orbit_clean.webm)
 * - Smooth curvature, clean space horizon, zero corner clipping
 *
 * Mode 2: Descent & Hyperscale Campus (Triggered on Initiate System click)
 * - Plays Hero_1080p_20261008213737.mp4 (/hero_descent.mp4)
 * - Pure, photorealistic first-person camera POV descent through clouds into datacenter campus
 * - Clean video playback with zero artificial cloud overlays, zero artificial water droplets, or filter artifacts
 * - Continuous smooth flyover loop over the clean energy facility (clamped at 8.2s to prevent AI watermark text)
 */
export default function OrbitalEarthBackground({ isInitiated = false, onDescentComplete, onResetOrbit, onReplayDescent }) {
  const [descentFinished, setDescentFinished] = useState(false)
  const heroVideoRef = useRef(null)
  const earthVideoRef = useRef(null)
  const containerRef = useRef(null)

  // Ensure hero video stays paused at 0.0s during initial orbit
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.pause()
      heroVideoRef.current.currentTime = 0
    }
  }, [])

  // Handle transition when isInitiated changes
  useEffect(() => {
    if (isInitiated) {
      setDescentFinished(false)

      if (heroVideoRef.current) {
        heroVideoRef.current.currentTime = 0
        heroVideoRef.current.play().catch(() => {})
      }

      // Pause earth video after crossfade to save GPU/CPU
      const t = setTimeout(() => {
        if (earthVideoRef.current) {
          earthVideoRef.current.pause()
        }
      }, 700)

      return () => clearTimeout(t)
    } else {
      // Reset back to orbit
      setDescentFinished(false)

      if (heroVideoRef.current) {
        heroVideoRef.current.pause()
        heroVideoRef.current.currentTime = 0
      }

      if (earthVideoRef.current) {
        earthVideoRef.current.currentTime = 0
        earthVideoRef.current.play().catch(() => {})
      }
    }
  }, [isInitiated])

  // Track playback time of hero descent video
  const handleHeroTimeUpdate = () => {
    if (!heroVideoRef.current) return
    const curTime = heroVideoRef.current.currentTime

    // When camera reaches the ground facility at exactly 7.0 seconds
    if (curTime >= 7.0 && !descentFinished) {
      setDescentFinished(true)
      if (onDescentComplete) onDescentComplete()
    }

    // Continuous seamless flyover loop over the facility
    if (curTime >= 9.6) {
      heroVideoRef.current.currentTime = 6.0
    }
  }


  // Mouse Parallax for interactive depth
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!containerRef.current) return
      const mx = (e.clientX / window.innerWidth - 0.5) * 8
      const my = (e.clientY / window.innerHeight - 0.5) * 6
      containerRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#000204]">
      {/* Parallax Container */}
      <div
        ref={containerRef}
        className="absolute -inset-[3%] w-[106%] h-[106%] flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
      >
        {/* ─── 01 // ORBITAL EARTH VIDEO (CURVED HORIZON) ─── */}
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
            transition: 'opacity 600ms ease-out'
          }}
          className="absolute w-[130vw] h-[130vh] max-w-none object-cover brightness-[0.98] contrast-[1.10] saturate-[1.08] will-change-transform"
        />

        {/* ─── 02 // HERO DESCENT 1080P VIDEO (CAMERA FALL INTO DATACENTER) ─── */}
        <video
          ref={heroVideoRef}
          src="/hero_descent.mp4"
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleHeroTimeUpdate}
          style={{
            opacity: isInitiated ? 1 : 0,
            transition: 'opacity 600ms ease-out'
          }}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.96] contrast-[1.05]"
        />
      </div>

      {/* ─── 03 // SUBTLE CINEMATIC VIGNETTE ─── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000204]/75 via-transparent to-[#000204]/30 pointer-events-none" />
    </div>
  )
}

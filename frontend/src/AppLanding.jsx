import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Headphones, Maximize2, Minimize2, Eye, EyeOff, Globe, ArrowRight } from 'lucide-react'
import OrbitalEarthBackground from './components/ui/OrbitalEarthBackground'
import Logo3D from './components/ui/Logo3D'

export default function AppLanding() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showUI, setShowUI] = useState(true)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [isSystemInitiated, setIsSystemInitiated] = useState(false)
  const [descentCompleted, setDescentCompleted] = useState(false)
  const audioCtxRef = useRef(null)
  const navigate = useNavigate()

  // Optional ambient sound generator
  const toggleAudio = () => {
    if (isAudioPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
      }
      setIsAudioPlaying(false)
      return
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()
      audioCtxRef.current = ctx

      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime)
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3)
      masterGain.connect(ctx.destination)

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, ctx.currentTime)
      filter.connect(masterGain)

      const freqs = [55.0, 110.0]
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        const oscGain = ctx.createGain()
        oscGain.gain.value = 0.2 / freqs.length

        osc.connect(oscGain)
        oscGain.connect(filter)
        osc.start()
      })

      setIsAudioPlaying(true)
    } catch {
      setIsAudioPlaying(false)
    }
  }

  const handleLaunchPlatform = () => {
    if (!isSystemInitiated) {
      setIsSystemInitiated(true)
    } else {
      navigate('/map')
    }
  }

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#000204] text-[#f0f4f1] font-sans select-none">
      <OrbitalEarthBackground
        isInitiated={isSystemInitiated}
        onDescentComplete={() => setDescentCompleted(true)}
        onReplayDescent={() => setDescentCompleted(false)}
        onResetOrbit={() => {
          setIsSystemInitiated(false)
          setDescentCompleted(false)
        }}
      />

      {/* Navigation Header */}
      <header
        className={`fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 sm:px-12 pt-5 pb-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent backdrop-blur-[2px] transition-all duration-700 ease-out ${
          isSystemInitiated && descentCompleted && showUI
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        <Link to="/" className="flex items-center gap-3 group">
          <Logo3D size={34} className="w-8 h-8 shrink-0 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wider text-white group-hover:text-[#34d399] transition-colors">
              GreenGrid
            </span>
            <span className="text-[10px] text-[#10b981] flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Grid Interconnection Live
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wide text-zinc-300">
          <Link to="/map" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Grid Map</span>
          </Link>
          <Link to="/dc/profile" className="hover:text-white transition-colors">
            DC Builder
          </Link>
          <Link to="/dc/results" className="hover:text-white transition-colors">
            Clean Matches
          </Link>
          <Link to="/supplier/dashboard" className="hover:text-white transition-colors">
            Suppliers
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-zinc-950 bg-[#10b981] hover:bg-[#34d399] shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main View */}
      <main
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 transition-all duration-700 pointer-events-none ${
          showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* State 1: Pre-launch Planetary Hero */}
        <div
          className={`max-w-3xl flex flex-col items-center transition-all duration-700 ease-out ${
            isSystemInitiated
              ? 'opacity-0 -translate-y-8 scale-95 pointer-events-none absolute'
              : 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          }`}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
            Intelligence at <br />
            Planetary Scale
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-zinc-300 mt-6 leading-relaxed font-normal drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Matching hyperscale data center compute with 24/7 firm renewable energy, dynamic tariff modeling, and grid interconnections across India.
          </p>

          <div className="mt-8">
            <button
              onClick={handleLaunchPlatform}
              className="px-8 py-3 rounded-lg bg-white text-zinc-950 font-medium text-sm tracking-wide hover:bg-zinc-100 transition-all shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:shadow-[0_0_36px_rgba(255,255,255,0.4)] active:scale-95 cursor-pointer"
            >
              Enter Platform
            </button>
          </div>
        </div>

        {/* State 2: Ground Power Infrastructure Hero (Revealed after descent) */}
        {isSystemInitiated && descentCompleted && (
          <div className="max-w-3xl flex flex-col items-center justify-center pointer-events-auto z-30 px-4">
            <div className="relative mb-5 hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 -z-10 rounded-full bg-[#00d084]/20 blur-2xl scale-125 pointer-events-none" />
              <Logo3D size={200} className="w-[180px] h-[180px] sm:w-[210px] sm:h-[210px] drop-shadow-[0_0_40px_rgba(0,208,132,0.6)]" />
            </div>

            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)]">
              Green<span className="text-[#00d084]">Grid</span>
            </h2>

            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-zinc-300 font-normal leading-relaxed text-center mb-8 drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]">
              Autonomous renewable energy matching, 24/7 firm power structuring, and regulatory intelligence for hyperscale data centers across India.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/map')}
                className="px-6 py-3 rounded-lg bg-[#00d084] hover:bg-[#00e599] text-[#022c22] font-semibold text-sm sm:text-base flex items-center gap-2 shadow-[0_0_24px_rgba(0,208,132,0.3)] hover:shadow-[0_0_36px_rgba(0,208,132,0.5)] transition-all cursor-pointer active:scale-95"
              >
                <span>Explore Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/dc/profile')}
                className="px-6 py-3 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 backdrop-blur-md text-white font-medium text-sm sm:text-base transition-all cursor-pointer active:scale-95"
              >
                Plan Power Strategy
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-between px-6 sm:px-12 py-6">
        <div className="w-24 hidden md:block" />

        <button
          onClick={toggleAudio}
          className="mx-auto flex items-center gap-2 group transition-all cursor-pointer text-zinc-400 hover:text-zinc-200"
          title={isAudioPlaying ? 'Mute ambient sound' : 'Enable ambient sound'}
        >
          <Headphones
            className={`w-4 h-4 transition-colors ${
              isAudioPlaying ? 'text-[#10b981]' : 'text-zinc-400 group-hover:text-white'
            }`}
          />
          <span className="text-xs font-mono tracking-wider uppercase">
            {isAudioPlaying ? 'Audio: On' : 'Ambient Audio'}
          </span>
        </button>

        <div className="flex items-center gap-2.5 w-24 justify-end">
          <button
            onClick={() => setShowUI(!showUI)}
            title={showUI ? 'Hide Interface' : 'Show Interface'}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer"
          >
            {showUI ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#10b981]" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </footer>
    </div>
  )
}

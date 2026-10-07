import { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Zap,
  Building2,
  Globe,
  Sliders,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  Server,
  Cpu,
  Layers,
  ArrowUpRight
} from 'lucide-react'

// ─── DATA & CONSTANTS ──────────────────────────────────────────────────────────

const STATS = [
  { value: '14.8 GW', label: 'Monitored Renewable Capacity', note: 'Operational & pipeline' },
  { value: '8,760 hrs', label: 'Hourly Dispatch Sizing', note: 'Solar, wind & BESS' },
  { value: '₹2.88 – ₹3.40', label: 'LCOE Benchmark / kWh', note: 'Zero-ISTS transmission waiver' },
  { value: '99.4%', label: 'Target Power Firmness', note: 'Continuous baseload uptime' },
]

const PARTNERS = [
  'Adani Green Energy',
  'Tata Power Renewable',
  'ReNew Power',
  'Greenko Group',
  'Avaada Energy',
  'CleanMax Solar'
]

const PROVIDERS = [
  { name: 'Adani Green Energy', cat: 'Utility IPP', capacity: '19.5 GW', types: ['Solar', 'Wind', 'Hybrid'], states: 'Gujarat · Rajasthan · Maharashtra', rtc: 85 },
  { name: 'Tata Power Renewables', cat: 'Utility IPP', capacity: '11.6 GW', types: ['FDRE', 'Hybrid', 'Solar'], states: 'Maharashtra · Tamil Nadu · Rajasthan', rtc: 80 },
  { name: 'ReNew Power', cat: 'Utility IPP', capacity: '12.6 GW', types: ['Wind', 'Solar', 'BESS'], states: 'Rajasthan · Tamil Nadu · Karnataka', rtc: 82 },
  { name: 'Greenko Group', cat: 'Hydro / Storage', capacity: '7.5 GW', types: ['Pumped Hydro', 'Solar'], states: 'Andhra Pradesh · Telangana · Karnataka', rtc: 92 },
  { name: 'Avaada Energy', cat: 'Utility IPP', capacity: '7.2 GW', types: ['Solar', 'BESS', 'Hybrid'], states: 'Rajasthan · Gujarat · Maharashtra', rtc: 76 },
  { name: 'CleanMax Solar', cat: 'C&I Captive', capacity: '2.0 GW', types: ['Solar', 'Wind', 'Captive'], states: 'Maharashtra · Karnataka · Tamil Nadu', rtc: 70 },
]

const SOURCING_MODELS = [
  {
    title: 'Group Captive Structure',
    highlight: 'Lowest Landed Cost',
    desc: 'The data center equity-invests 26% in the generator SPV and consumes at least 51% of output. 100% exempt from cross-subsidy and additional DISCOM surcharges.',
    bestFor: 'Large hyperscale and colocation campuses seeking long-term tariff certainty.'
  },
  {
    title: 'Round-the-Clock (RTC / FDRE)',
    highlight: 'Zero Curtailment',
    desc: 'Contractually firm renewable delivery pairing solar, high-capacity wind, and 4 to 8-hour battery or pumped-hydro energy storage.',
    bestFor: 'Mission-critical Tier 3 and Tier 4 AI data centers requiring 24/7 continuous baseload.'
  },
  {
    title: 'Virtual PPA (vPPA / CfD)',
    highlight: 'Pure Environmental Decoupling',
    desc: 'Financial contract-for-differences without physical grid interconnection hurdles. Bundled with auditable Energy Attribute Certificates (RECs).',
    bestFor: 'Multinational cloud providers with global RE100 and Scope 2 compliance targets.'
  }
]

// ─── VIDEO PLAYLIST & SCENE ARCHITECTURE ──────────────────────────────────────

const VIDEO_SCENES = [
  { id: 1, src: '/scene_approach_1.mp4', label: 'Aerial Approach', duration: 10 },
  { id: 2, src: '/scene_approach_2.mp4', label: 'Facility Ingress', duration: 8 },
  { id: 3, src: '/hero.mp4', label: 'Clean Power Grid', duration: 10 },
]

// ─── HERO COMPONENT ────────────────────────────────────────────────────────────

function Hero({ isRevealed: controlledRevealed, setIsRevealed: setControlledRevealed } = {}) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [shutterActive, setShutterActive] = useState(false)

  const videoRef = useRef(null)
  const activeSceneRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const revealTimerRef = useRef(null)
  const hasTriggeredRef = useRef(false)
  const userToggledRef = useRef(false)

  const [internalRevealed, setInternalRevealed] = useState(false)
  const isRevealed = controlledRevealed !== undefined ? controlledRevealed : internalRevealed
  const setIsRevealed = setControlledRevealed || setInternalRevealed
  const [isMuted, setIsMuted] = useState(false)

  const triggerReveal = () => {
    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true
    setIsRevealed(true)
  }

  // Crisp, professional cinematic shutter cut (avoids double-exposure ghosting and blur artifacts)
  const advanceScene = () => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    setShutterActive(true)

    const cur = activeSceneRef.current
    const next = (cur + 1) % VIDEO_SCENES.length
    activeSceneRef.current = next
    setActiveSceneIndex(next)

    // At peak of 300ms shutter dip, swap video source cleanly and start playback
    setTimeout(() => {
      const vid = videoRef.current
      if (vid) {
        vid.src = VIDEO_SCENES[next].src
        vid.currentTime = 0
        vid.play().catch(() => {})
      }

      // Smoothly lift shutter to reveal pristine, full-resolution incoming scene
      setTimeout(() => {
        setShutterActive(false)
        isTransitioningRef.current = false
      }, 50)

      // When reaching Scene 3 (Clean Power Grid), schedule the content reveal
      if (next === 2 && !hasTriggeredRef.current) {
        setTimeout(triggerReveal, 2000)
      }
    }, 320)
  }

  // Trigger shutter cut 400ms before clip ends for a natural directorial cut
  const handleTimeUpdate = (e) => {
    const video = e.target
    if (!video || !video.duration || isTransitioningRef.current) return
    if (video.currentTime >= video.duration - 0.45) {
      advanceScene()
    }
  }

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    const vid = videoRef.current
    if (vid) {
      vid.currentTime = 0
    }

    const gestureEvents = ['pointerdown', 'click', 'keydown', 'touchend']
    let unlocked = false

    const unlockAudio = () => {
      if (unlocked || userToggledRef.current) return
      unlocked = true
      if (videoRef.current) {
        videoRef.current.muted = false
        videoRef.current.volume = 1
      }
      setIsMuted(false)
      removeGestureListeners()
    }

    const removeGestureListeners = () => {
      gestureEvents.forEach(evt => window.removeEventListener(evt, unlockAudio))
    }

    // Attempt autoplay with audio
    if (vid) {
      vid.muted = false
      vid.volume = 1
      vid.play()
        .then(() => setIsMuted(false))
        .catch(() => {
          vid.muted = true
          setIsMuted(true)
          vid.play().catch(() => {})
          gestureEvents.forEach(evt => window.addEventListener(evt, unlockAudio, { passive: true }))
        })
    }

    // Fallback timer: ensures content reveals after 20s
    clearTimeout(revealTimerRef.current)
    revealTimerRef.current = setTimeout(triggerReveal, 20000)

    return () => {
      removeGestureListeners()
      clearTimeout(revealTimerRef.current)
    }
  }, [])

  const toggleSound = (e) => {
    e.stopPropagation()
    userToggledRef.current = true
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (videoRef.current) videoRef.current.muted = newMuted
  }

  const replayIntro = (e) => {
    if (e) e.stopPropagation()
    hasTriggeredRef.current = false
    setIsRevealed(false)
    isTransitioningRef.current = false
    setShutterActive(false)
    activeSceneRef.current = 0
    setActiveSceneIndex(0)

    const vid = videoRef.current
    if (vid) {
      vid.src = VIDEO_SCENES[0].src
      vid.currentTime = 0
      vid.play().catch(() => {})
    }

    clearTimeout(revealTimerRef.current)
    revealTimerRef.current = setTimeout(triggerReveal, 20000)
  }

  const skipToContent = (e) => {
    if (e) e.stopPropagation()
    triggerReveal()
  }

  return (
    <section
      className={`relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#08090b] ${
        isRevealed ? 'hero-revealed' : ''
      }`}
    >
      {/* Pristine Full-Resolution Video Player */}
      <video
        ref={videoRef}
        src={VIDEO_SCENES[0].src}
        className="hero-video absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="auto"
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={advanceScene}
      />

      {/* Cinematic Film Shutter Cut Overlay (Smooth 300ms dip between cuts) */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none bg-[#08090b] transition-opacity duration-300 ease-in-out ${
          shutterActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Layered dark contrast overlay */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-all duration-1000 ${
          isRevealed
            ? 'opacity-100 bg-gradient-to-b from-[#08090b]/70 via-[#08090b]/85 to-[#08090b]'
            : 'opacity-20 bg-black'
        }`}
      />

      {/* Audio toggle button */}
      <div className="absolute top-20 right-6 md:right-10 z-30">
        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-xs text-white/90 backdrop-blur-md transition-all shadow-md cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              <span>Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audio On</span>
            </>
          )}
        </button>
      </div>

      {/* Cinematic Highlight Scene HUD (Visible during highlight period before reveal) */}
      <div
        className={`absolute bottom-8 inset-x-0 px-6 md:px-12 z-30 flex items-center justify-between text-xs text-white/80 transition-opacity duration-700 pointer-events-none ${
          !isRevealed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {VIDEO_SCENES.map((sc, idx) => (
              <div
                key={sc.id}
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === activeSceneIndex
                    ? 'w-8 bg-emerald-400'
                    : idx < activeSceneIndex
                    ? 'w-4 bg-white/60'
                    : 'w-4 bg-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium tracking-wide text-neutral-300">
            {VIDEO_SCENES[activeSceneIndex]?.label}
          </span>
        </div>

        <button
          onClick={skipToContent}
          className="pointer-events-auto text-[11px] text-white/60 hover:text-white px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 transition-all cursor-pointer"
        >
          Skip intro →
        </button>
      </div>

      {/* Hero Content (revealed after highlight) */}
      <div
        className={`hero-content-container relative z-30 text-center max-w-3xl px-6 flex flex-col items-center ${
          isRevealed ? 'hero-revealed' : ''
        }`}
      >
        {/* Logo Emblem (Revealed when highlight finishes) */}
        <div
          onClick={replayIntro}
          title="Click to replay video intro"
          className="hero-logo-wrapper relative mb-6 cursor-pointer group flex flex-col items-center"
        >
          <div className="hero-logo-glow absolute -inset-3 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-b from-white/20 to-white/5 border border-white/15 shadow-xl group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Green Grid"
              className="w-full h-full object-cover rounded-full select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Clean Headline */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
          Clean power infrastructure for hyperscale data centers.
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Match continuous data center demand with verified renewable energy across India. Model 24/7 power firmness, analyze open-access wheeling, and secure compliant power purchase agreements.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center w-full max-w-md">
          <a
            href="#simulator"
            className="hero-cta-primary w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-semibold text-sm transition-all shadow-md cursor-pointer"
          >
            <span>Model Capacity</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/map"
            className="hero-cta-secondary w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium text-sm transition-all backdrop-blur-md cursor-pointer"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Launch Geospatial Map</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── PARTNERS & METRICS SECTION ───────────────────────────────────────────────

function PartnersAndMetrics() {
  return (
    <div className="border-b border-white/[0.08] bg-[#090b0e]">
      {/* Metrics Bar */}
      <div className="max-w-6xl mx-auto py-12 px-6 border-b border-white/[0.06]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-white tracking-tight mb-1">{s.value}</div>
              <div className="text-xs font-medium text-neutral-300">{s.label}</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Logos/Names Row */}
      <div className="max-w-6xl mx-auto py-10 px-6 text-center">
        <p className="text-xs uppercase tracking-wider text-neutral-500 font-medium mb-6">
          Connected with India's leading renewable power producers
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-sm font-semibold text-neutral-400">
          {PARTNERS.map(p => (
            <span key={p} className="hover:text-white transition-colors">{p}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── INTERACTIVE CAPACITY SIMULATOR ────────────────────────────────────────────

function CapacitySimulator() {
  const [loadMw, setLoadMw] = useState(50)
  const [mix, setMix] = useState('hybrid')

  const stats = useMemo(() => {
    const annualGwh = Math.round((loadMw * 8760) / 1000)
    if (mix === 'solar_wind') {
      return {
        firmness: 68,
        lcoe: '₹3.10',
        solarMw: Math.round(loadMw * 1.8),
        windMw: Math.round(loadMw * 1.2),
        bessMwh: 0,
        desc: 'Unbuffered solar and wind. Significant daytime excess with reliance on grid banking.'
      }
    } else if (mix === 'hybrid') {
      return {
        firmness: 89,
        lcoe: '₹3.42',
        solarMw: Math.round(loadMw * 2.2),
        windMw: Math.round(loadMw * 1.4),
        bessMwh: Math.round(loadMw * 4),
        desc: 'Hybrid solar and wind backed by 4-hour battery storage. Covers peak evening demand.'
      }
    } else {
      return {
        firmness: 99.4,
        lcoe: '₹3.70',
        solarMw: Math.round(loadMw * 2.6),
        windMw: Math.round(loadMw * 1.8),
        bessMwh: Math.round(loadMw * 8),
        desc: 'Round-the-clock firm power with pumped hydro and multi-regional transmission corridors.'
      }
    }
  }, [loadMw, mix])

  return (
    <section id="simulator" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-20">
      <div className="mb-12">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
          Capacity Planning
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
          Model your facility's clean energy mix.
        </h2>
        <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
          Estimate capacity requirements, firmness coverage, and delivered tariffs based on your critical IT demand.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c1015] p-6 md:p-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-neutral-300">Data Center IT Load</span>
                <span className="text-sm font-bold text-emerald-400">{loadMw} MW</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={loadMw}
                onChange={e => setLoadMw(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
                <span>10 MW</span>
                <span>100 MW</span>
                <span>200 MW</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">Procurement Architecture</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'solar_wind', label: 'Solar + Wind' },
                  { id: 'hybrid', label: 'Hybrid + BESS' },
                  { id: 'rtc', label: '24/7 Firm (FDRE)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setMix(opt.id)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      mix === opt.id
                        ? 'bg-emerald-400 text-neutral-950 border-emerald-400 font-semibold'
                        : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed pt-2">
              {stats.desc}
            </p>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                <div className="text-xs text-neutral-400 mb-1">Hourly Firmness</div>
                <div className="text-2xl font-bold text-emerald-400">{stats.firmness}%</div>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-white/5">
                <div className="text-xs text-neutral-400 mb-1">Estimated LCOE</div>
                <div className="text-2xl font-bold text-white">{stats.lcoe} <span className="text-xs font-normal text-neutral-500">/ kWh</span></div>
              </div>
            </div>

            <div className="space-y-3 text-xs border-t border-white/10 pt-4">
              <div className="flex justify-between text-neutral-300">
                <span>Solar PV Capacity</span>
                <span className="font-semibold">{stats.solarMw} MW</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Wind Generation</span>
                <span className="font-semibold">{stats.windMw} MW</span>
              </div>
              {stats.bessMwh > 0 && (
                <div className="flex justify-between text-neutral-300">
                  <span>Battery Storage (4-hr BESS)</span>
                  <span className="font-semibold text-emerald-400">{stats.bessMwh} MWh</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>Request Detailed Offtake Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── GEOSPATIAL MAP SECTION ───────────────────────────────────────────────────

function GeospatialHighlight() {
  return (
    <section className="py-20 px-6 border-y border-white/[0.08] bg-[#090b0e]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-6">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
            Grid Intelligence
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Live Geospatial Grid & Substation Map.
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            Explore operational and pipeline renewable capacities across India. View 400kV and 765kV substation transmission margins, inter-state transmission (ISTS) waiver zones, and active data center clusters in Mumbai, Chennai, Bengaluru, and Noida.
          </p>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-semibold text-sm transition-all shadow-md"
          >
            <Globe className="w-4 h-4" />
            <span>Open Geospatial Map</span>
          </Link>
        </div>

        {/* Clean Map Preview Card */}
        <div className="md:col-span-6 rounded-2xl border border-white/10 bg-[#0c1015] p-6 space-y-4">
          <div className="text-xs font-medium text-neutral-400 pb-2 border-b border-white/10">
            Monitored Regional Hubs
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div>
                <div className="font-semibold text-white">Navi Mumbai / Kalwa 400kV</div>
                <div className="text-[11px] text-neutral-400">Maharashtra Data Center Cluster</div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">ISTS Eligible</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div>
                <div className="font-semibold text-white">Chennai / Sriperumbudur 400kV</div>
                <div className="text-[11px] text-neutral-400">SIPCOT Siruseri Cloud Corridor</div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Wind Balanced</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div>
                <div className="font-semibold text-white">Gujarat / Khavda 765kV</div>
                <div className="text-[11px] text-neutral-400">Utility Generation Corridor</div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">8.4 GW Online</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── VERIFIED PRODUCERS ────────────────────────────────────────────────────────

function ProvidersSection() {
  return (
    <section id="providers" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
            Generation Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Verified Clean Power Producers
          </h2>
        </div>
        <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
          Direct institutional connections with leading utility IPPs and C&I producers across India.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROVIDERS.map(p => (
          <div
            key={p.name}
            className="rounded-xl border border-white/10 bg-[#0c1015] p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-base">{p.name}</h3>
                <span className="text-[11px] text-neutral-400 border border-white/10 px-2 py-0.5 rounded">
                  {p.cat}
                </span>
              </div>
              <div className="text-xs text-neutral-400 mb-4">{p.states}</div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-emerald-400 tracking-tight">{p.capacity}</div>
                <div className="text-[11px] text-neutral-500">Tracked generation assets</div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.types.map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-neutral-400">RTC Firmness:</span>
              <span className="font-semibold text-white">{p.rtc}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── SOURCING STRUCTURES ───────────────────────────────────────────────────────

function SourcingStructures() {
  return (
    <section className="py-24 px-6 border-t border-white/[0.08] bg-[#090b0e]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
            Contracting Models
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Procurement Structures
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
            Standardized commercial instruments compliant with Ministry of Power Open Access Rules.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SOURCING_MODELS.map(m => (
            <div key={m.title} className="rounded-xl border border-white/10 bg-[#0c1015] p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 block mb-1">{m.highlight}</span>
                <h3 className="text-base font-bold text-white mb-3">{m.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed mb-6">{m.desc}</p>
              </div>
              <div className="pt-4 border-t border-white/10 text-[11px] text-neutral-500">
                Best suited for: <span className="text-neutral-300">{m.bestFor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CONTACT SECTION ───────────────────────────────────────────────────────────

function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', company: '', capacity: '25-50 MW', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-20">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
              Advisory Desk
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Initiate Consultation
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Connect with our clean energy structuring team to evaluate your facility's load profile and optimal offtake model.
            </p>
          </div>

          <div className="space-y-4 pt-4 text-xs text-neutral-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>contact@greengrid.in</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>+91 22 6840 9200</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0c1015] p-6 md:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="text-xl font-bold text-white">Thank you for reaching out.</div>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Our power structuring desk will review your details and respond within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">Organization *</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    placeholder="Company or facility"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1.5 font-medium">Target IT Load</label>
                  <select
                    value={form.capacity}
                    onChange={e => setForm({ ...form, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1015] border border-white/10 text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="10-25 MW">10 - 25 MW</option>
                    <option value="25-50 MW">25 - 50 MW</option>
                    <option value="50-100 MW">50 - 100 MW</option>
                    <option value="100+ MW">100+ MW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1.5 font-medium">Project Scope & Timeline</label>
                <textarea
                  rows="3"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Facility location, target COD, and current power requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-semibold text-xs transition-all shadow-md cursor-pointer"
              >
                Submit Consultation Request
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080a] py-12 px-6 text-xs text-neutral-400">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-base font-bold text-white">Green<span className="text-emerald-400 font-normal">Grid</span></span>
          <p className="text-xs text-neutral-500 mt-1">Clean energy infrastructure platform for Indian hyperscale data centers.</p>
        </div>
        <div className="flex gap-6 text-neutral-400">
          <a href="#simulator" className="hover:text-white transition-colors">Simulator</a>
          <a href="#providers" className="hover:text-white transition-colors">Providers</a>
          <Link to="/map" className="hover:text-white transition-colors">Geospatial Map</Link>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 text-[11px] text-neutral-600 flex justify-between">
        <div>© {new Date().getFullYear()} GreenGrid Technologies India Pvt. Ltd.</div>
        <div>CERC & CEA Regulatory Framework Compliant</div>
      </div>
    </footer>
  )
}

// ─── MAIN LANDING PAGE COMPONENT ──────────────────────────────────────────────

export default function AppLanding() {
  const [isHeroRevealed, setIsHeroRevealed] = useState(false)

  return (
    <div className="bg-[#08090b] min-h-screen text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar visible={isHeroRevealed} />
      <Hero isRevealed={isHeroRevealed} setIsRevealed={setIsHeroRevealed} />
      <PartnersAndMetrics />
      <CapacitySimulator />
      <GeospatialHighlight />
      <ProvidersSection />
      <SourcingStructures />
      <ContactSection />
      <Footer />
    </div>
  )
}

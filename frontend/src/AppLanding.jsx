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
import { Section, Container, Badge, Card, Button, Reveal, Logo3D } from './components/ui'

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

  // Cinematic shutter cut
  const advanceScene = () => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    setShutterActive(true)

    const cur = activeSceneRef.current
    const next = (cur + 1) % VIDEO_SCENES.length
    activeSceneRef.current = next
    setActiveSceneIndex(next)

    setTimeout(() => {
      const vid = videoRef.current
      if (vid) {
        vid.src = VIDEO_SCENES[next].src
        vid.currentTime = 0
        vid.play().catch(() => {})
      }

      setTimeout(() => {
        setShutterActive(false)
        isTransitioningRef.current = false
      }, 50)

      if (next === 2 && !hasTriggeredRef.current) {
        setTimeout(triggerReveal, 2000)
      }
    }, 320)
  }

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

    // Autoplay muted with unmute on first gesture
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

    // Reveal at 7 seconds as mandated by requirements
    clearTimeout(revealTimerRef.current)
    revealTimerRef.current = setTimeout(triggerReveal, 7000)

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
    revealTimerRef.current = setTimeout(triggerReveal, 7000)
  }

  const skipToContent = (e) => {
    if (e) e.stopPropagation()
    triggerReveal()
  }

  return (
    <section
      className={`relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#000000] ${
        isRevealed ? 'hero-revealed' : ''
      }`}
    >
      {/* Background Video Player */}
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

      {/* Cinematic Film Shutter Cut Overlay */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none bg-[#000000] transition-opacity duration-300 ease-in-out ${
          shutterActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Contrast Overlay with deep gradient vignette */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-all duration-1000 ${
          isRevealed
            ? 'opacity-100 bg-gradient-to-b from-[#020504]/75 via-[#020504]/85 to-[#020504]'
            : 'opacity-30 bg-black'
        }`}
      />

      {/* Audio toggle button with tactical HUD styling */}
      <div className="absolute top-20 right-6 md:right-10 z-30">
        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-black/70 hover:bg-black/90 border border-emerald-500/30 text-xs font-mono tracking-wider uppercase text-white backdrop-blur-md transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)] cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              <span>Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Audio On</span>
            </>
          )}
        </button>
      </div>

      {/* Cinematic Highlight Scene HUD */}
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
                    ? 'w-8 bg-emerald-400 shadow-[0_0_8px_#10b981]'
                    : idx < activeSceneIndex
                    ? 'w-4 bg-white/60'
                    : 'w-4 bg-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono tracking-wider text-neutral-300 uppercase">
            {VIDEO_SCENES[activeSceneIndex]?.label}
          </span>
        </div>

        <button
          onClick={skipToContent}
          className="pointer-events-auto text-[11px] font-mono tracking-wider uppercase text-white/80 hover:text-white px-3.5 py-1 rounded bg-black/60 hover:bg-black/80 border border-emerald-500/30 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.8)]"
        >
          Skip intro →
        </button>
      </div>

      {/* Hero Content: Branding & 3D Logo (Appears strictly after video highlight period finishes) */}
      <div
        className={`hero-content-container relative z-30 text-center flex flex-col items-center justify-center transition-all duration-1000 ease-out ${
          isRevealed
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-8 pointer-events-none'
        }`}
        style={{
          transitionDelay: isRevealed ? '200ms' : '0ms'
        }}
      >
        <div
          onClick={replayIntro}
          title="Click to replay video intro"
          className="hero-logo-wrapper relative cursor-pointer group flex flex-col items-center select-none"
        >
          <Logo3D
            size={220}
            className="sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px]"
          />
          <div className="mt-3 font-mono text-[11px] sm:text-xs uppercase tracking-[3px] text-emerald-400 font-semibold drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">
            GreenGrid (AGI) <span className="text-white/40">//</span> Power Infrastructure
          </div>
          <div className="mt-1.5 text-[10px] font-mono text-neutral-400 tracking-wider">
            [ 3D Interactive • Move cursor to tilt • Click to replay ]
          </div>
        </div>
      </div>

      {/* Tactical Scroll Hint */}
      <a
        href="#simulator"
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-emerald-400/60 hover:text-emerald-400 text-[10px] uppercase tracking-widest font-mono transition-opacity duration-700 ${
          isRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span>Explore Engine</span>
        <div className="w-2 h-2 border-r border-b border-emerald-400 rotate-45 animate-bounce" />
      </a>
    </section>
  )
}

// ─── PARTNERS & METRICS SECTION ───────────────────────────────────────────────

function PartnersAndMetrics() {
  return (
    <Section variant="deep" className="border-b border-white/[0.08] py-16 md:py-20">
      <Container>
        {/* Metrics Bar */}
        <div className="pb-14 border-b border-white/[0.08]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s, idx) => (
              <Reveal key={s.label} delay={idx * 80}>
                <div className="group">
                  <div className="text-3xl lg:text-4xl font-bold font-mono text-white tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">
                    {s.value}
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-[1.5px] text-[#64748b]">
                    {s.label}
                  </div>
                  <div className="text-xs text-[#94a3b8] mt-1 font-sans">
                    {s.note}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Partner Logos/Names Row */}
        <div className="pt-12 text-center">
          <p className="text-[11px] font-mono uppercase tracking-[2px] text-[#64748b] font-medium mb-8">
            Connected with India's leading renewable power producers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {PARTNERS.map((p, idx) => (
              <Reveal key={p} delay={idx * 60}>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-emerald-400 transition-all px-4 py-2 rounded bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 hover:bg-emerald-500/[0.05] shadow-sm">
                  {p}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

// ─── INTERACTIVE CAPACITY SIMULATOR ────────────────────────────────────────────

function CapacitySimulator() {
  const [loadMw, setLoadMw] = useState(50)
  const [mix, setMix] = useState('hybrid')

  const stats = useMemo(() => {
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
    <Section id="simulator" variant="canvas" className="scroll-mt-20">
      <Container>
        <Reveal>
          <div className="mb-12">
            <Badge>Capacity Planning // Sizing Engine</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase mt-4 mb-3 font-sans">
              Model your facility's <span className="text-emerald-400">clean energy mix</span>.
            </h2>
            <p className="text-neutral-400 text-sm md:text-base max-w-xl leading-relaxed">
              Estimate capacity requirements, firmness coverage, and delivered tariffs based on your critical IT demand.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <Card className="p-6 md:p-10 border-emerald-500/20">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Controls */}
              <div className="lg:col-span-6 space-y-7">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Data Center IT Load
                    </span>
                    <span className="text-base font-mono font-bold text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25">
                      {loadMw} MW
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={loadMw}
                    onChange={e => setLoadMw(Number(e.target.value))}
                    className="w-full h-2 bg-black/60 border border-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-2">
                    <span>10 MW</span>
                    <span>100 MW</span>
                    <span>200 MW</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2.5">
                    Procurement Architecture
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'solar_wind', label: 'Solar + Wind' },
                      { id: 'hybrid', label: 'Hybrid + BESS' },
                      { id: 'rtc', label: '24/7 Firm (FDRE)' }
                    ].map(opt => (
                      <Button
                        key={opt.id}
                        variant="nav"
                        active={mix === opt.id}
                        onClick={() => setMix(opt.id)}
                        className="py-2.5 text-center justify-center"
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded bg-black/40 border border-white/[0.08] text-xs text-neutral-300 leading-relaxed font-sans">
                  {stats.desc}
                </div>
              </div>

              {/* Results Display */}
              <div className="lg:col-span-6 rounded-lg border border-emerald-500/20 bg-black/40 p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded bg-[#040806] border border-emerald-500/20">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] mb-1">
                      Hourly Firmness
                    </div>
                    <div className="text-3xl font-mono font-bold text-emerald-400">
                      {stats.firmness}%
                    </div>
                  </div>
                  <div className="p-4 rounded bg-[#040806] border border-emerald-500/20">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] mb-1">
                      Estimated LCOE
                    </div>
                    <div className="text-3xl font-mono font-bold text-white">
                      {stats.lcoe} <span className="text-xs font-normal text-neutral-400">/ kWh</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs border-t border-white/[0.08] pt-5">
                  <div className="flex justify-between text-neutral-300">
                    <span className="text-neutral-400">Solar PV Capacity</span>
                    <span className="font-semibold text-white">{stats.solarMw} MW</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span className="text-neutral-400">Wind Generation</span>
                    <span className="font-semibold text-white">{stats.windMw} MW</span>
                  </div>
                  {stats.bessMwh > 0 && (
                    <div className="flex justify-between text-neutral-300">
                      <span className="text-neutral-400">Battery Storage (4-hr BESS)</span>
                      <span className="font-semibold text-emerald-400">{stats.bessMwh} MWh</span>
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-white/[0.08] flex justify-end">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Request Detailed Offtake Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </Container>
    </Section>
  )
}

// ─── GEOSPATIAL MAP SECTION ───────────────────────────────────────────────────

function GeospatialHighlight() {
  return (
    <Section variant="deep" hasDivider className="border-y border-white/[0.08]">
      <Container>
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <Reveal className="md:col-span-6">
            <Badge>Grid Intelligence // Spatial Radar</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase mt-4 mb-4 font-sans">
              Live Geospatial Grid &amp; <span className="text-emerald-400">Substation Map</span>.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8 font-sans">
              Explore operational and pipeline renewable capacities across India. View 400kV and 765kV substation transmission margins, inter-state transmission (ISTS) waiver zones, and active data center clusters in Mumbai, Chennai, Bengaluru, and Noida.
            </p>
            <Link to="/map">
              <Button variant="primary">
                <Globe className="w-4 h-4" />
                <span>Open Geospatial Map</span>
              </Button>
            </Link>
          </Reveal>

          {/* Clean Map Preview Card */}
          <Reveal delay={150} className="md:col-span-6">
            <Card className="p-6 space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-[1.5px] text-[#64748b] pb-3 border-b border-white/[0.08]">
                Monitored Regional Hubs
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-3.5 rounded bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-colors">
                  <div>
                    <div className="font-semibold text-white font-sans">Navi Mumbai / Kalwa 400kV</div>
                    <div className="text-[11px] text-neutral-400 font-sans">Maharashtra Data Center Cluster</div>
                  </div>
                  <span className="sf-cluster-pill active text-[10px]">ISTS Eligible</span>
                </div>
                <div className="flex justify-between items-center p-3.5 rounded bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-colors">
                  <div>
                    <div className="font-semibold text-white font-sans">Chennai / Sriperumbudur 400kV</div>
                    <div className="text-[11px] text-neutral-400 font-sans">SIPCOT Siruseri Cloud Corridor</div>
                  </div>
                  <span className="sf-cluster-pill active text-[10px]">Wind Balanced</span>
                </div>
                <div className="flex justify-between items-center p-3.5 rounded bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-colors">
                  <div>
                    <div className="font-semibold text-white font-sans">Gujarat / Khavda 765kV</div>
                    <div className="text-[11px] text-neutral-400 font-sans">Utility Generation Corridor</div>
                  </div>
                  <span className="sf-cluster-pill active text-[10px]">8.4 GW Online</span>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

// ─── VERIFIED PRODUCERS ────────────────────────────────────────────────────────

function ProvidersSection() {
  return (
    <Section id="providers" variant="canvas" className="scroll-mt-20">
      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <Badge>Generation Portfolio // Verified IPPs</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase mt-4 font-sans">
                Verified Clean Power <span className="text-emerald-400">Producers</span>
              </h2>
            </div>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed font-sans">
              Direct institutional connections with leading utility IPPs and C&I producers across India.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROVIDERS.map((p, idx) => (
            <Reveal key={p.name} delay={idx * 60}>
              <Card className="flex flex-col justify-between hover:border-emerald-500/40 hover:-translate-y-1 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-white text-base font-sans">{p.name}</h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 border border-white/10 px-2 py-0.5 rounded">
                      {p.cat}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mb-5 font-sans">{p.states}</div>

                  <div className="mb-5">
                    <div className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">
                      {p.capacity}
                    </div>
                    <div className="text-[11px] font-mono uppercase text-[#64748b] mt-0.5">
                      Tracked generation assets
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.types.map(t => (
                      <span key={t} className="sf-cluster-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-white/[0.08] flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400">RTC Firmness:</span>
                  <span className="font-semibold text-emerald-400">{p.rtc}%</span>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

// ─── SOURCING STRUCTURES ───────────────────────────────────────────────────────

function SourcingStructures() {
  return (
    <Section variant="deep" hasDivider className="border-t border-white/[0.08]">
      <Container>
        <Reveal>
          <div className="mb-12">
            <Badge>Contracting Models // Commercial Instruments</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase mt-4 mb-3 font-sans">
              Procurement <span className="text-emerald-400">Structures</span>
            </h2>
            <p className="text-neutral-400 text-sm max-w-xl leading-relaxed font-sans">
              Standardized commercial instruments compliant with Ministry of Power Open Access Rules.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {SOURCING_MODELS.map((m, idx) => (
            <Reveal key={m.title} delay={idx * 100}>
              <Card className="flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-mono font-semibold text-emerald-400 block mb-2 uppercase tracking-wider">
                    {m.highlight}
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase mb-3 font-sans">
                    {m.title}
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-6 font-sans">
                    {m.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.08] text-[11px] font-mono text-[#64748b]">
                  Best suited for: <span className="text-neutral-300 font-sans">{m.bestFor}</span>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
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
    <Section id="contact" variant="canvas" className="scroll-mt-20">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5 space-y-6">
            <div>
              <Badge>Advisory Desk // Siting Consultation</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase mt-4 mb-4 font-sans">
                Initiate <span className="text-emerald-400">Consultation</span>
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed font-sans">
                Connect with our clean energy structuring team to evaluate your facility's load profile and optimal offtake model.
              </p>
            </div>

            <div className="space-y-4 pt-4 text-xs font-sans text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-mono">contact@greengrid.in</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-mono">+91 22 6840 9200</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-7">
            <Card className="p-6 md:p-8">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="text-xl font-bold text-white font-sans uppercase">
                    Thank you for reaching out.
                  </div>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans">
                    Our power structuring desk will review your details and respond within 1 business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-300 mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="sf-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="name@company.com"
                        className="sf-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-300 mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                        Organization *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.company}
                        onChange={e => setForm({ ...form, company: e.target.value })}
                        placeholder="Company or facility"
                        className="sf-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                        Target IT Load
                      </label>
                      <select
                        value={form.capacity}
                        onChange={e => setForm({ ...form, capacity: e.target.value })}
                        className="sf-select text-xs"
                      >
                        <option value="10-25 MW">10 - 25 MW</option>
                        <option value="25-50 MW">25 - 50 MW</option>
                        <option value="50-100 MW">50 - 100 MW</option>
                        <option value="100+ MW">100+ MW</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      Project Scope &amp; Timeline
                    </label>
                    <textarea
                      rows="3"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Facility location, target COD, and current power requirements..."
                      className="sf-input text-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3.5 mt-2"
                  >
                    Submit Consultation Request
                  </Button>
                </form>
              )}
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#020504] py-14 px-6 text-xs text-neutral-400">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-base font-bold text-white uppercase tracking-tight font-sans">
              GreenGrid <span className="text-emerald-400 font-mono font-medium text-xs">(AGI)</span>
            </span>
            <p className="text-xs text-neutral-400 mt-1 font-sans">
              Clean energy infrastructure platform for Indian hyperscale data centers.
            </p>
          </div>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
            <a href="#simulator" className="hover:text-emerald-400 transition-colors">Simulator</a>
            <a href="#providers" className="hover:text-emerald-400 transition-colors">Providers</a>
            <Link to="/map" className="hover:text-emerald-400 transition-colors">Geospatial Map</Link>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/[0.06] text-[11px] font-mono text-[#475569] flex flex-col sm:flex-row justify-between gap-3">
          <div>© {new Date().getFullYear()} GreenGrid Technologies India Pvt. Ltd.</div>
          <div>CERC &amp; CEA Regulatory Framework Compliant</div>
        </div>
      </Container>
    </footer>
  )
}

// ─── MAIN LANDING PAGE COMPONENT ──────────────────────────────────────────────

export default function AppLanding() {
  const [isHeroRevealed, setIsHeroRevealed] = useState(false)

  return (
    <div className="bg-[#020504] min-h-screen text-white selection:bg-emerald-500/30 selection:text-emerald-200">
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

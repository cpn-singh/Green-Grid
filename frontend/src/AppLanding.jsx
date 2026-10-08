import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Globe,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react'
import { Logo3D, BackgroundScene } from './components/ui'

// ─── DATA & CONSTANTS (ENGINEERING METRICS) ──────────────────────────────────

const NATIONAL_METRICS = [
  { value: '14,800 MW', label: 'Monitored Pipeline', note: 'Shovel-ready & operational assets' },
  { value: '99.4%', label: 'Baseload Firmness', note: 'Continuous round-the-clock power' },
  { value: '₹2.88', label: 'ISTS Tariff / kWh', note: 'Inter-state transmission waiver benchmark' },
  { value: '8,760 h', label: 'Annual Dispatch', note: 'Solar, wind & pumped hydro hybrid' },
]

const PARTNER_IPPS = [
  { name: 'Adani Green Energy', capacity: '19.5 GW', states: 'Gujarat · Rajasthan', rtc: 85, mix: 'Solar / Wind / Hybrid' },
  { name: 'Tata Power Renewables', capacity: '11.6 GW', states: 'Maharashtra · Tamil Nadu', rtc: 80, mix: 'FDRE / Solar' },
  { name: 'ReNew Power', capacity: '12.6 GW', states: 'Rajasthan · Karnataka', rtc: 82, mix: 'Wind / Solar / BESS' },
  { name: 'Greenko Group', capacity: '7.5 GW', states: 'Andhra Pradesh · Telangana', rtc: 92, mix: 'Pumped Hydro / Solar' },
  { name: 'Avaada Energy', capacity: '7.2 GW', states: 'Rajasthan · Maharashtra', rtc: 76, mix: 'Solar / BESS' },
  { name: 'CleanMax Solar', capacity: '2.0 GW', states: 'Karnataka · Tamil Nadu', rtc: 70, mix: 'C&I Captive / Wind' },
]

const SUBSTATIONS = [
  { name: 'Navi Mumbai (Kalwa 400kV)', state: 'Maharashtra', bay: '3.2 GW Interconnect', tag: 'ISTS Zero-Surcharge Zone' },
  { name: 'Chennai (Sriperumbudur 400kV)', state: 'Tamil Nadu', bay: '2.8 GW Interconnect', tag: 'Wind Wheeling Corridor' },
  { name: 'Khavda Pooling (765kV)', state: 'Gujarat', bay: '30.0 GW Mega Complex', tag: 'National High-Voltage Backbone' },
  { name: 'Bengaluru (Devanahalli 400kV)', state: 'Karnataka', bay: '1.6 GW Interconnect', tag: 'Substation Bay Reserved' },
]

const PROCUREMENT_FRAMEWORKS = [
  {
    code: '01',
    title: 'Group Captive Structure',
    highlight: '26% Equity // 100% Surcharge Exempt',
    points: [
      '26% equity participation in generator SPV',
      '51% captive power consumption requirement',
      'Exempt from Cross-Subsidy Surcharge (CSS) and Additional Surcharge (AS)',
      'Delivers lowest landed rupee tariff in key data center hubs'
    ],
    offtake: 'Hyperscale campuses (>30 MW) seeking 15-year tariff stability.'
  },
  {
    code: '02',
    title: 'Round-the-Clock (RTC / FDRE)',
    highlight: 'Continuous Baseload // Zero Curtailment',
    points: [
      'Contracted combination of solar, high-CUF wind, and 4–8h storage',
      'Guaranteed 85% to 99% hourly availability throughout the year',
      'Eliminates thermal intermittency and diesel generator emissions',
      'Modeled via 8,760-hour hourly dispatch simulation'
    ],
    offtake: 'Mission-critical Tier 3 & Tier 4 AI colocation campuses.'
  },
  {
    code: '03',
    title: 'Virtual PPA (vPPA / CfD)',
    highlight: 'Pure Environmental Hedge // I-RECs',
    points: [
      'Financial contract-for-differences without physical grid hurdles',
      'Bundled with auditable Indian Energy Attribute Certificates (I-RECs)',
      'Decoupled from local state utility wheeling constraints',
      'Direct credit against Scope 2 emissions for global RE100 targets'
    ],
    offtake: 'Multinational cloud providers with international decarbonization goals.'
  }
]

const VIDEO_SCENES = [
  { id: 1, src: '/scene_approach_1.mp4', label: 'Aerial Substation Ingress' },
  { id: 2, src: '/scene_approach_2.mp4', label: 'Campus Transmission Bay' },
  { id: 3, src: '/hero.mp4', label: 'High-Voltage Clean Power Grid' },
]

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

function Hero({ isRevealed: controlledRevealed, setIsRevealed: setControlledRevealed } = {}) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)

  const sectionRef = useRef(null)
  const videoRefs = useRef([])
  const activeSceneRef = useRef(0)
  const revealTimerRef = useRef(null)
  const hasTriggeredRef = useRef(false)
  const userToggledRef = useRef(false)

  const [internalRevealed, setInternalRevealed] = useState(false)
  const isRevealed = controlledRevealed !== undefined ? controlledRevealed : internalRevealed
  const setIsRevealed = setControlledRevealed || setInternalRevealed

  const triggerReveal = () => {
    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true
    setIsRevealed(true)
  }

  // Smooth cross-fade transition without tearing down media decoders
  const advanceScene = () => {
    const cur = activeSceneRef.current
    const next = (cur + 1) % VIDEO_SCENES.length
    activeSceneRef.current = next
    setActiveSceneIndex(next)

    const nextVid = videoRefs.current[next]
    if (nextVid) {
      nextVid.currentTime = 0
      nextVid.play().catch(() => {})
    }

    // Pause previous video after crossfade finishes to release decoder bandwidth
    setTimeout(() => {
      const prevVid = videoRefs.current[cur]
      if (prevVid && cur !== next) {
        prevVid.pause()
      }
    }, 700)

    if (next === 2 && !hasTriggeredRef.current) {
      setTimeout(triggerReveal, 2000)
    }
  }

  useEffect(() => {
    // Start active scene 0 smoothly
    const vid0 = videoRefs.current[0]
    if (vid0) {
      vid0.currentTime = 0
      vid0.muted = true
      vid0.play().catch(() => {})
    }

    // Unmute on first user gesture
    const unlockAudio = () => {
      if (userToggledRef.current) return
      setIsMuted(false)
      videoRefs.current.forEach(v => {
        if (v) v.muted = false
      })
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
    window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true })
    window.addEventListener('click', unlockAudio, { passive: true, once: true })
    window.addEventListener('keydown', unlockAudio, { passive: true, once: true })

    // Auto-reveal content after 7s
    clearTimeout(revealTimerRef.current)
    revealTimerRef.current = setTimeout(triggerReveal, 7000)

    // Pause hero video when scrolled out of view to avoid GPU contention
    const observer = new IntersectionObserver(
      ([entry]) => {
        const curVid = videoRefs.current[activeSceneRef.current]
        if (!curVid) return
        if (entry.isIntersecting) {
          curVid.play().catch(() => {})
        } else {
          curVid.pause()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      clearTimeout(revealTimerRef.current)
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
      observer.disconnect()
    }
  }, [])

  const toggleSound = (e) => {
    e.stopPropagation()
    userToggledRef.current = true
    const newMuted = !isMuted
    setIsMuted(newMuted)
    videoRefs.current.forEach(v => {
      if (v) v.muted = newMuted
    })
  }

  const replayIntro = (e) => {
    if (e) e.stopPropagation()
    hasTriggeredRef.current = false
    setIsRevealed(false)
    activeSceneRef.current = 0
    setActiveSceneIndex(0)

    const vid0 = videoRefs.current[0]
    if (vid0) {
      vid0.currentTime = 0
      vid0.play().catch(() => {})
    }

    clearTimeout(revealTimerRef.current)
    revealTimerRef.current = setTimeout(triggerReveal, 7000)
  }

  return (
    <section
      ref={sectionRef}
      onClick={!isRevealed ? triggerReveal : undefined}
      className={`relative w-full min-h-screen overflow-hidden flex flex-col justify-between bg-[#080b09] ${
        !isRevealed ? 'cursor-pointer' : ''
      }`}
    >
      {/* Pre-buffered Multi-Scene Videos with Zero Decoder Reset Stutter */}
      {VIDEO_SCENES.map((scene, idx) => (
        <video
          key={scene.id}
          ref={el => (videoRefs.current[idx] = el)}
          src={scene.src}
          autoPlay={idx === 0}
          muted={isMuted}
          playsInline
          preload="auto"
          loop={idx === 2}
          onEnded={idx < 2 ? advanceScene : undefined}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out transform-gpu pointer-events-none ${
            activeSceneIndex === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        />
      ))}

      {/* Atmospheric Vignette Overlay - Translucent to let video shine through */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000 ${
          isRevealed ? 'opacity-55 bg-gradient-to-b from-[#080b09]/40 via-[#080b09]/65 to-[#080b09]/85' : 'opacity-25 bg-black/40'
        }`}
      />

      {/* Top Controls: Audio Switcher */}
      <div className="relative z-30 pt-20 sm:pt-24 px-4 sm:px-6 md:px-12 flex justify-between items-center gap-2">
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#6b7c72] truncate max-w-[200px] sm:max-w-none">
          [ RLDC GRID TELEMETRY ]
        </div>
        <button
          onClick={toggleSound}
          className="btn-busbar !py-1 !px-2.5 !text-[10px] sm:!text-[11px] !border-[#19241d] shrink-0"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#6b7c72]" />
              <span>Audio Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#22c55e]" />
              <span className="text-[#22c55e]">Audio On</span>
            </>
          )}
        </button>
      </div>

      {/* Center Hero Focal Point */}
      <div className="relative z-30 px-6 md:px-12 max-w-5xl mx-auto text-center my-auto py-12">

        {/* Revealed Content: 3D Logo + Monumental Typography */}
        <div
          className={`transition-all duration-1000 ease-out flex flex-col items-center ${
            isRevealed
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          {/* Handcrafted 3D Medallion - Mounts only after reveal to free GPU for video */}
          <div
            onClick={replayIntro}
            title="Click to replay video intro"
            className="cursor-pointer mb-6 group relative min-h-[200px] flex items-center justify-center"
          >
            {isRevealed && <Logo3D size={200} className="sm:w-[240px] sm:h-[240px]" />}
          </div>

          <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#22c55e] mb-3">
            National Energy Infrastructure Platform
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight leading-[0.98] max-w-4xl">
            Powering the next <span className="text-[#22c55e]">5 gigawatts</span> of compute.
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#6b7c72] max-w-2xl font-sans leading-relaxed">
            Direct 400kV/765kV substation interconnections, CERC Open Access underwriting, and round-the-clock clean energy contracts for Indian data centers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#sizing" className="btn-signal">
              <span>Run Dispatch Sizing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <Link to="/map" className="btn-busbar">
              <Globe className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>National Grid Radar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Technical Baseline Strip */}
      <div className="relative z-30 border-t border-[#19241d] bg-[#080b09]/80 py-3.5 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-mono text-[#6b7c72]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[#f0f4f1]">CERC § 41.2 COMPLIANT</span>
          <span>• ISTS TRANSMISSION CORRIDORS ACTIVE</span>
        </div>
        <div>MUMBAI · CHENNAI · NOIDA · BENGALURU · GUJARAT</div>
      </div>
    </section>
  )
}

// ─── 01 // NATIONAL DISPATCH LEDGER (HORIZONTAL TELEMETRY) ─────────────────────

function NationalDispatchLedger() {
  return (
    <section className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          01 // National Transmission Ledger &amp; Capacity
        </div>

        {/* 4-Column Heavy Architectural Metric Ledger */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-14 border-b border-[#19241d]">
          {NATIONAL_METRICS.map((m) => (
            <div key={m.label} className="relative">
              <span className="tech-crosshair tl">+</span>
              <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-[#f0f4f1] tracking-tight">
                {m.value}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#22c55e] mt-2">
                {m.label}
              </div>
              <div className="text-xs text-[#6b7c72] mt-1 font-sans">
                {m.note}
              </div>
            </div>
          ))}
        </div>

        {/* Monitored IPP Partner Ticker */}
        <div className="pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#6b7c72] shrink-0">
            Connected Utility IPPs // Generation SPVs:
          </span>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs font-mono text-[#f0f4f1]">
            {PARTNER_IPPS.map((p) => (
              <span
                key={p.name}
                className="px-3 py-1.5 border border-[#19241d] bg-black/40 hover:border-[#22c55e]/40 transition-colors"
              >
                {p.name} <span className="text-[#6b7c72]">({p.capacity})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 02 // DISPATCH SIZING ENGINE (ASYMMETRICAL 2-COLUMN) ─────────────────────

function DispatchSizingEngine() {
  const [loadMw, setLoadMw] = useState(50)
  const [mode, setMode] = useState('hybrid')

  const calculations = useMemo(() => {
    if (mode === 'solar_wind') {
      return {
        firmness: 68.5,
        tariff: '₹3.10',
        solar: Math.round(loadMw * 1.8),
        wind: Math.round(loadMw * 1.2),
        bess: 0,
        assessment: 'Unbuffered solar and wind. Subject to diurnal duck curve and state DISCOM banking limits.'
      }
    } else if (mode === 'hybrid') {
      return {
        firmness: 89.2,
        tariff: '₹3.42',
        solar: Math.round(loadMw * 2.2),
        wind: Math.round(loadMw * 1.4),
        bess: Math.round(loadMw * 4),
        assessment: 'Solar and wind backed by 4-hour battery storage. Covers evening peak without diesel dispatch.'
      }
    } else {
      return {
        firmness: 99.4,
        tariff: '₹3.70',
        solar: Math.round(loadMw * 2.6),
        wind: Math.round(loadMw * 1.8),
        bess: Math.round(loadMw * 8),
        assessment: 'Round-the-clock firm dispatch (FDRE) with pumped hydro storage and multi-state transmission wheeling.'
      }
    }
  }, [loadMw, mode])

  return (
    <section id="sizing" className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12 scroll-mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          02 // Hourly Dispatch Architecture &amp; Sizing
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Architectural Explanation & Interactive Slider */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
                The physics of <span className="text-[#22c55e]">baseload power</span>.
              </h2>
              <p className="mt-4 text-sm text-[#6b7c72] leading-relaxed font-sans">
                Data center compute demands continuous, uninterrupted megawatts. Solar generates during daytime; wind peaks seasonally. Sizing clean power requires over-contracted generation paired with dedicated battery or pumped-hydro storage.
              </p>
            </div>

            {/* Slider */}
            <div className="busbar-panel p-6 space-y-4">
              <span className="tech-crosshair tl">+</span>
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs uppercase text-[#6b7c72]">IT Demand Load</span>
                <span className="text-2xl font-bold text-[#22c55e]">{loadMw} MW</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={loadMw}
                onChange={(e) => setLoadMw(Number(e.target.value))}
                className="w-full h-1.5 bg-[#19241d] rounded-none appearance-none cursor-pointer accent-[#22c55e]"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#6b7c72]">
                <span>10 MW (Edge)</span>
                <span>100 MW</span>
                <span>200 MW (Hyperscale)</span>
              </div>
            </div>

            {/* Procurement Mode Buttons */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#6b7c72] mb-3">
                Contracting Architecture
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'solar_wind', label: 'Solar + Wind' },
                  { id: 'hybrid', label: 'Hybrid + BESS' },
                  { id: 'rtc', label: '24/7 Firm (FDRE)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setMode(opt.id)}
                    className={`btn-busbar !py-2.5 !px-2 !text-[11px] text-center justify-center ${
                      mode === opt.id ? 'active' : ''
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-l-2 border-[#22c55e] bg-black/40 text-xs text-[#6b7c72] leading-relaxed font-sans">
              {calculations.assessment}
            </div>
          </div>

          {/* Right Column: Single-Line Engineering Table (SLD Readout) */}
          <div className="lg:col-span-7 busbar-panel p-8">
            <span className="tech-crosshair tl">+</span>
            <span className="tech-crosshair tr">+</span>
            <span className="tech-crosshair bl">+</span>
            <span className="tech-crosshair br">+</span>

            <div className="flex justify-between items-center pb-4 border-b border-[#19241d] mb-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#f0f4f1]">
                Single-Line Dispatch Schedule (8,760h Simulation)
              </span>
              <span className="font-mono text-[11px] text-[#22c55e] uppercase">
                Status: Sized
              </span>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-[#19241d] mb-6">
              <div>
                <div className="text-[11px] font-mono uppercase text-[#6b7c72]">
                  Baseload Hourly Firmness
                </div>
                <div className="text-4xl font-mono font-bold text-[#22c55e] mt-1">
                  {calculations.firmness}%
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-[#6b7c72]">
                  Landed Tariff (ex-substation)
                </div>
                <div className="text-4xl font-mono font-bold text-[#f0f4f1] mt-1">
                  {calculations.tariff} <span className="text-sm font-normal text-[#6b7c72]">/ kWh</span>
                </div>
              </div>
            </div>

            {/* Engineering Allocation Rows */}
            <div className="space-y-1">
              <div className="ledger-row">
                <span className="ledger-label">Solar PV Generation Capacity</span>
                <span className="ledger-value">{calculations.solar} MW</span>
              </div>
              <div className="ledger-row">
                <span className="ledger-label">High-CUF Wind Generation</span>
                <span className="ledger-value">{calculations.wind} MW</span>
              </div>
              <div className="ledger-row">
                <span className="ledger-label">4-Hour BESS / Pumped Storage</span>
                <span className="ledger-value text-[#22c55e]">{calculations.bess} MWh</span>
              </div>
              <div className="ledger-row">
                <span className="ledger-label">Cross-Subsidy Surcharge (CSS) Exemption</span>
                <span className="ledger-value">100% Waived (CERC Open Access)</span>
              </div>
              <div className="ledger-row">
                <span className="ledger-label">Annual Carbon Abatement</span>
                <span className="ledger-value text-[#22c55e]">~{Math.round(loadMw * 7200)} MT CO2e / yr</span>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-[#19241d] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#6b7c72] font-mono">
                CERC Tariff Order FY2026 Reference Schedule
              </span>
              <a href="#inquiry" className="btn-signal">
                <span>Request Pre-Feasibility Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 03 // GEOSPATIAL SUBSTATION RADAR ─────────────────────────────────────────

function GeospatialSubstationRadar() {
  return (
    <section className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          03 // National Substation Headroom &amp; ISTS Corridors
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
              Substation headroom &amp; <span className="text-[#22c55e]">bay allocations</span>.
            </h2>
            <p className="text-sm text-[#6b7c72] leading-relaxed font-sans">
              High-voltage transmission lines require 24 to 36 months to permit and build. A hyperscale compute facility builds in 18. Securing 400kV substation bay allocation before campus site acquisition is the critical-path bottleneck for Indian developers.
            </p>
            <div className="pt-2">
              <Link to="/map" className="btn-signal">
                <Globe className="w-4 h-4" />
                <span>Launch Interactive GIS Map</span>
              </Link>
            </div>
          </div>

          {/* Substation Telemetry Matrix */}
          <div className="lg:col-span-7 busbar-panel p-6 md:p-8">
            <span className="tech-crosshair tl">+</span>
            <span className="tech-crosshair tr">+</span>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#6b7c72] pb-3 border-b border-[#19241d] mb-4">
              Active Interconnect Nodes (400kV &amp; 765kV)
            </div>

            <div className="space-y-3 font-mono text-xs">
              {SUBSTATIONS.map((sub) => (
                <div
                  key={sub.name}
                  className="p-4 border border-[#19241d] bg-black/40 hover:border-[#22c55e]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-[#f0f4f1]">{sub.name}</div>
                    <div className="text-[11px] text-[#6b7c72]">{sub.state} • {sub.bay}</div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] uppercase text-[#22c55e] border border-[#22c55e]/30 bg-[#22c55e]/5 self-start sm:self-auto">
                    {sub.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 04 // GENERATION PORTFOLIO REGISTRY (DENSE TECHNICAL TABLE) ──────────────

function GenerationPortfolioRegistry() {
  return (
    <section className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          04 // Verified Generation Asset Registry
        </div>

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
              Verified renewable <span className="text-[#22c55e]">IPP portfolio</span>.
            </h2>
            <p className="mt-3 text-sm text-[#6b7c72] font-sans max-w-xl">
              Contracted institutional connections with India's largest utility-scale and captive generation developers.
            </p>
          </div>
          <div className="font-mono text-xs text-[#22c55e]">
            ● 60,400 MW Combined IPP Capacity
          </div>
        </div>

        {/* Tabular Generation Matrix */}
        <div className="busbar-panel overflow-x-auto">
          <span className="tech-crosshair tl">+</span>
          <span className="tech-crosshair tr">+</span>
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#19241d] bg-black/60 text-[#6b7c72] text-[11px] uppercase tracking-wider">
                <th className="p-4">Producer Name</th>
                <th className="p-4">Monitored Capacity</th>
                <th className="p-4">Corridor States</th>
                <th className="p-4">Generation Mix</th>
                <th className="p-4 text-right">Baseload RTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#19241d]">
              {PARTNER_IPPS.map((ipp) => (
                <tr key={ipp.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-[#f0f4f1]">{ipp.name}</td>
                  <td className="p-4 text-[#22c55e] font-semibold">{ipp.capacity}</td>
                  <td className="p-4 text-[#6b7c72]">{ipp.states}</td>
                  <td className="p-4 text-[#f0f4f1]">{ipp.mix}</td>
                  <td className="p-4 text-right font-bold text-[#22c55e]">{ipp.rtc}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ─── 05 // PROCUREMENT FRAMEWORKS (3-COLUMN ARCHITECTURAL LEDGER) ─────────────

function ProcurementFrameworks() {
  return (
    <section className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          05 // Institutional Procurement Frameworks
        </div>

        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
            Commercial <span className="text-[#22c55e]">contracting structures</span>.
          </h2>
          <p className="mt-3 text-sm text-[#6b7c72] font-sans max-w-xl">
            Standardized legal and tariff frameworks under the Ministry of Power Green Energy Open Access Regulations.
          </p>
        </div>

        {/* 3-Column Architectural Ledger */}
        <div className="grid md:grid-cols-3 gap-0 border border-[#19241d]">
          {PROCUREMENT_FRAMEWORKS.map((f, idx) => (
            <div
              key={f.code}
              className={`p-8 bg-black/40 ${
                idx < 2 ? 'md:border-r border-b md:border-b-0 border-[#19241d]' : ''
              } flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-baseline mb-4 font-mono">
                  <span className="text-xs text-[#22c55e]">{f.code} //</span>
                  <span className="text-[10px] text-[#6b7c72] uppercase tracking-wider">Standard Model</span>
                </div>
                <h3 className="text-xl font-bold font-display uppercase text-[#f0f4f1] mb-2">
                  {f.title}
                </h3>
                <div className="text-xs font-mono text-[#22c55e] mb-6">
                  {f.highlight}
                </div>

                <ul className="space-y-3 mb-8">
                  {f.points.map((pt) => (
                    <li key={pt} className="text-xs text-[#6b7c72] flex items-start gap-2.5 font-sans">
                      <span className="text-[#22c55e] shrink-0 font-mono text-[11px]">◆</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#19241d] text-[11px] font-mono text-[#6b7c72]">
                Offtake Profile: <span className="text-[#f0f4f1] font-sans">{f.offtake}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 06 // INSTITUTIONAL INTAKE (OFFTAKE DESK) ────────────────────────────────

function InstitutionalOfftakeDesk() {
  const [form, setForm] = useState({ name: '', email: '', company: '', capacity: '25-50 MW', region: 'Mumbai', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="inquiry" className="relative z-10 border-b border-[#19241d] bg-[#080b09]/45 backdrop-blur-[2px] py-20 px-6 md:px-12 scroll-mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-widest text-[#6b7c72]">
          06 // Transmission &amp; Offtake Advisory Desk
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Physical Contacts & Human Team */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase text-[#f0f4f1] tracking-tight">
              Initiate power offtake &amp; <span className="text-[#22c55e]">grid siting study</span>.
            </h2>
            <p className="text-sm text-[#6b7c72] leading-relaxed font-sans">
              We evaluate 400kV substation bay reservations, state open access banking rules, and power purchase agreements across India's five regional load dispatch centers (RLDCs).
            </p>

            <div className="space-y-4 pt-4 border-t border-[#19241d] text-xs font-mono text-[#f0f4f1]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                <span>Maker Maxity, 5th Floor, Bandra Kurla Complex (BKC), Mumbai 400051</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>offtake@greengrid.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>+91 22 6840 9200</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form */}
          <div className="lg:col-span-7 busbar-panel p-8">
            <span className="tech-crosshair tl">+</span>
            <span className="tech-crosshair tr">+</span>
            <span className="tech-crosshair bl">+</span>
            <span className="tech-crosshair br">+</span>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#22c55e] mx-auto" />
                <h3 className="text-xl font-bold font-display uppercase text-[#f0f4f1]">
                  Inquiry Logged on Dispatch Ledger
                </h3>
                <p className="text-xs font-mono text-[#6b7c72] max-w-md mx-auto">
                  Our transmission structuring group will prepare a regional substation bay headroom brief within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      Principal Contact Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Vikramaditya Sharma"
                      className="tech-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      Institutional Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@organization.com"
                      className="tech-input"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      Organization / Operating Entity
                    </label>
                    <input
                      required
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Data Center / Infra Fund"
                      className="tech-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                      Planned IT Capacity (MW)
                    </label>
                    <select
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      className="tech-select"
                    >
                      <option value="10-25 MW">10–25 MW (Tier 3 Campus)</option>
                      <option value="25-50 MW">25–50 MW (Hyperscale Hub)</option>
                      <option value="50-100 MW">50–100 MW (Multi-Campus Cloud)</option>
                      <option value="100+ MW">100+ MW (Gigawatt Cluster)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#6b7c72] mb-1.5 font-mono uppercase tracking-wider text-[11px]">
                    Project Siting Scope &amp; Target COD
                  </label>
                  <textarea
                    rows="3"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Substation region of interest, expected commercial operations date (COD), and off-take structure preference..."
                    className="tech-input"
                  />
                </div>

                <button type="submit" className="btn-signal w-full !py-3.5 mt-2">
                  Initiate Grid Sizing Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[#19241d] bg-[#080b09] py-16 px-6 md:px-12 text-xs relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <span className="text-lg font-bold font-display uppercase tracking-tight text-[#f0f4f1]">
              GreenGrid
            </span>
            <p className="text-xs text-[#6b7c72] mt-1.5 font-sans max-w-sm">
              High-voltage clean power infrastructure platform for Indian hyperscale data center operators.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-wider text-[#6b7c72]">
            <a href="#sizing" className="hover:text-[#22c55e] transition-colors">Dispatch Sizing</a>
            <Link to="/map" className="hover:text-[#22c55e] transition-colors">National Radar</Link>
            <a href="#inquiry" className="hover:text-[#22c55e] transition-colors">Offtake Desk</a>
            <Link to="/auth/login" className="hover:text-[#22c55e] transition-colors">Portal Login</Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#19241d] flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono text-[#6b7c72]">
          <div>© {new Date().getFullYear()} GreenGrid Technologies India Pvt. Ltd.</div>
          <div className="flex items-center gap-2 text-[#22c55e]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="uppercase tracking-wider">NLDC Telemetry Online</span>
          </div>
          <div>CERC &amp; CEA Technical Standards Framework Compliant</div>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN APP LANDING PAGE COMPONENT ──────────────────────────────────────────

export default function AppLanding() {
  const [isHeroRevealed, setIsHeroRevealed] = useState(false)

  return (
    <div className="bg-[#080b09] min-h-screen text-[#f0f4f1] selection:bg-[#22c55e]/25 selection:text-[#f0f4f1] relative">
      {/* 1. Ambient Background Video + Real-Time 3D WebGL Planetary Grid Canvas reacting to Scroll */}
      <BackgroundScene />

      {/* 2. Top Hairline Navbar */}
      <Navbar visible={isHeroRevealed} />

      {/* 3. Hero Section with 7-Second Video Reveal & 3D Medallion */}
      <Hero isRevealed={isHeroRevealed} setIsRevealed={setIsHeroRevealed} />

      {/* 4. Handcrafted Sections (Translucent Busbar Grid floating over the 3D scene) */}
      <div className="relative z-10">
        <NationalDispatchLedger />
        <DispatchSizingEngine />
        <GeospatialSubstationRadar />
        <GenerationPortfolioRegistry />
        <ProcurementFrameworks />
        <InstitutionalOfftakeDesk />
        <Footer />
      </div>
    </div>
  )
}

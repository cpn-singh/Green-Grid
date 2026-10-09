import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Globe,
  ChevronDown,
  ArrowUpRight,
  Zap,
  Activity,
  CheckCircle2,
  Sun,
  Wind,
  Droplets,
  Battery,
  Flame,
  Layers,
  AlertCircle,
  MapPin,
  X
} from 'lucide-react'
import OrbitalEarthBackground from './components/ui/OrbitalEarthBackground'
import Logo3D from './components/ui/Logo3D'
import { ENERGY_SOURCES } from './data/energySourcesData'

// Shared styles, so buttons and cards look the same everywhere
const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors cursor-pointer'
const btnSecondary =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 text-zinc-100 text-sm transition-colors cursor-pointer'
const card = 'rounded-lg border border-white/10 bg-black/50 p-5'
const cardTitle = 'text-sm font-semibold text-white mb-3'

function SectionBackgroundImage({ imageSrc, isInView = true }) {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden select-none bg-[#000204]">
      <img
        src={imageSrc}
        alt=""
        loading="eager"
        decoding="async"
        className={`w-full h-full object-cover object-center brightness-[0.82] transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
          isInView
            ? 'opacity-85 scale-100 filter-none'
            : 'opacity-30 scale-105 blur-[8px] contrast-[160%]'
        }`}
        style={{
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#000204]/85 via-black/35 to-[#000204]/90" />
    </div>
  )
}

function Stat({ label, value, sub, accent }) {
  return (
    <div className="p-3 rounded-md bg-black/40 border border-white/10">
      <span className="block text-xs text-slate-400">{label}</span>
      <span className={`block text-base font-semibold ${accent ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </span>
      {sub && <span className="block text-xs text-slate-400 mt-0.5">{sub}</span>}
    </div>
  )
}

function MatchStat({ score }) {
  return (
    <div className="p-3 rounded-md bg-black/40 border border-white/10">
      <div className="flex justify-between items-center text-xs mb-2">
        <span className="text-slate-400">24/7 match</span>
        <span className="text-emerald-400 font-semibold">{score}%</span>
      </div>
      <div className="w-full h-1.5 bg-black/80 rounded-full overflow-hidden border border-white/10">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function DispatchBar({ sourceId }) {
  return (
    <div className="my-3">
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>12 am</span>
        <span>6 am</span>
        <span>12 pm</span>
        <span>6 pm</span>
        <span>12 am</span>
      </div>
      <div className="h-2.5 w-full bg-black/90 rounded-full overflow-hidden border border-white/10 relative">
        {sourceId === 'solar' && (
          <div className="absolute inset-y-0 left-[25%] right-[25%] bg-emerald-400 rounded-full" />
        )}
        {sourceId === 'wind' && (
          <>
            <div className="absolute inset-y-0 left-0 right-[70%] bg-emerald-400/80 rounded-full" />
            <div className="absolute inset-y-0 left-[65%] right-0 bg-emerald-400/80 rounded-full" />
          </>
        )}
        {(sourceId === 'large-hydro' ||
          sourceId === 'small-hydro' ||
          sourceId === 'biomass' ||
          sourceId === 'geothermal') && (
            <div className="absolute inset-0 bg-emerald-400/80 rounded-full" />
          )}
        {sourceId === 'pumped-hydro' && (
          <>
            <div
              className="absolute inset-y-0 left-[35%] right-[35%] bg-cyan-500/50 rounded-full"
              title="Pumping (charging)"
            />
            <div
              className="absolute inset-y-0 left-[70%] right-[5%] bg-emerald-400 rounded-full"
              title="Generating (discharging)"
            />
          </>
        )}
        {(sourceId === 'bess' || sourceId === 'green-hydrogen') && (
          <div className="absolute inset-0 bg-emerald-500/60 rounded-full" />
        )}
      </div>
    </div>
  )
}

function SpecList({ specs }) {
  return (
    <div className="space-y-2 text-sm">
      {Object.entries(specs).map(([key, val]) => (
        <div
          key={key}
          className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-white/5 pb-2 last:border-0 last:pb-0"
        >
          <span className="text-gray-400 font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
          <span className="text-slate-100 sm:text-right sm:max-w-[65%]">{val}</span>
        </div>
      ))}
    </div>
  )
}

function PlantList({ plants }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {plants.map((plant, i) => (
        <div key={i} className="p-3 rounded-md bg-black/40 border border-white/10">
          <div className="flex justify-between items-start gap-2">
            <span className="font-medium text-sm text-white">{plant.name}</span>
            <span className="text-xs text-emerald-400 whitespace-nowrap">{plant.capacity}</span>
          </div>
          <div className="text-sm text-gray-400 font-bold mt-1.5 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {plant.location}
            </span>
            <span>{plant.developer}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProsCons({ source }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className={card}>
        <h4 className={cardTitle}>Advantages</h4>
        <ul className="space-y-2 text-sm text-slate-300">
          {source.advantages.map((adv, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{adv}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={card}>
        <h4 className={cardTitle}>Grid constraints</h4>
        <ul className="space-y-2 text-sm text-slate-300">
          {source.limitations.map((lim, i) => (
            <li key={i} className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{lim}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Corridors({ corridors }) {
  return (
    <div className="flex flex-wrap gap-2">
      {corridors.map((c, i) => (
        <span key={i} className="px-2.5 py-1 rounded-md bg-black/50 border border-white/15 text-xs text-slate-200">
          {c}
        </span>
      ))}
    </div>
  )
}

function SourceDetailModal({ source, isOpen, onClose, navigate }) {
  const directPath = source.id === 'large-hydro' ? '/hydro' : `/${source.id}`

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={source.name}
        className="relative w-full max-w-2xl max-h-[88vh] bg-[#0a0f0c] border border-white/15 rounded-xl shadow-2xl flex flex-col overflow-hidden text-left z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
          <div>
            <span className="text-xs text-emerald-400 block">{source.badge}</span>
            <h3 className="text-xl font-semibold text-white">{source.name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-slate-200">
          <div className={card}>
            <h4 className={cardTitle}>How it fits a data center</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{source.roleInDatacenter}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat
              label="Capacity"
              value={source.installedCapacityIndia}
              sub={`2030 target: ${source.targetCapacity2030}`}
              accent
            />
            <Stat label="Tariff" value={source.tariffInrPerKwh} sub={source.tariffUsdPerMwh} />
            <Stat label="Capacity factor" value={source.cufRange} />
            <Stat label="Lifecycle CO2" value={source.carbonIntensityGCo2} />
          </div>

          <div className={card}>
            <h4 className={cardTitle}>Daily generation profile</h4>
            <DispatchBar sourceId={source.id} />
            <p className="text-sm text-slate-300 leading-relaxed">{source.dispatchProfile}</p>
          </div>

          <div className={card}>
            <h4 className={cardTitle}>Technical specs</h4>
            <SpecList specs={source.technicalSpecs} />
          </div>

          <div className={card}>
            <h4 className={cardTitle}>Benchmark plants in India</h4>
            <PlantList plants={source.keyPlants} />
          </div>

          <div className={card}>
            <h4 className={cardTitle}>765 kV transmission corridors</h4>
            <Corridors corridors={source.corridors} />
          </div>

          <ProsCons source={source} />

          <div className={card}>
            <h4 className={cardTitle}>Regulation (CERC and MNRE)</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-300">
              {source.regulatoryFramework.map((reg, i) => (
                <li key={i}>{reg}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose()
                navigate('/dc/profile', { state: { preferredSource: source.id } })
              }}
              className={btnPrimary}
            >
              Add to my data center
            </button>
            <Link to={directPath} className={btnSecondary}>
              Open full page
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <button onClick={onClose} className="px-3 py-2 text-sm text-slate-400 hover:text-white cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function EnergySourceSection({ source, idx, getSourceIcon, navigate }) {
  const anchorId = source.id === 'large-hydro' ? 'hydro' : source.id
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.12, rootMargin: '-30px 0px -30px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id={anchorId}
      style={{ zIndex: 10 + idx }}
      className="relative min-h-screen flex flex-col justify-center bg-[#000204] px-4 sm:px-12 py-16 sm:py-28 text-[#f0f4f1] scroll-mt-0 overflow-visible"
    >
      <SectionBackgroundImage imageSrc={source.image} isInView={isInView} />

      <div
        className={`relative z-10 max-w-[1360px] mx-auto w-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${
          isInView
            ? 'opacity-100 translate-y-0 scale-100 filter-none'
            : 'opacity-0 translate-y-12 scale-[0.98] blur-[12px] contrast-[180%]'
        }`}
      >
        {/* Header */}
        <div
          className={`mb-6 text-left transition-all duration-700 delay-100 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-sm text-emerald-400 font-mono tracking-wider">
              PAGE 0{idx + 1} OF 09 // {source.badge}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            <span className="hidden sm:inline-flex">{getSourceIcon(source.id)}</span>
            <span>{source.name}</span>
          </h2>

          <p className="max-w-3xl text-base text-slate-200 leading-relaxed mt-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {source.tagline}. {source.roleInDatacenter}
          </p>
        </div>

        {/* Mobile / tablet: short version */}
        <div className="block lg:hidden space-y-4 mb-6 text-left">
          <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-black/50 border border-white/10">
            <Stat
              label="Capacity"
              value={source.installedCapacityIndia}
              sub={`2030 target: ${source.targetCapacity2030}`}
              accent
            />
            <Stat label="Tariff" value={source.tariffInrPerKwh} sub={source.tariffUsdPerMwh} />
            <Stat label="Capacity factor" value={source.cufRange} />
            <MatchStat score={source.matchingScore247} />
          </div>

          {source.keyPlants && source.keyPlants[0] && (
            <div className="p-3 rounded-lg bg-black/50 border border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs text-slate-400">Flagship plant</span>
                <span className="text-sm font-medium text-white">
                  {source.keyPlants[0].name}, {source.keyPlants[0].location}
                </span>
              </div>
              <span className="text-xs text-emerald-400 shrink-0">{source.keyPlants[0].capacity}</span>
            </div>
          )}

          <button type="button" onClick={() => setShowDetailModal(true)} className={`${btnSecondary} w-full`}>
            See full specs
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/dc/profile', { state: { preferredSource: source.id } })}
              className={btnPrimary}
            >
              Add to my data center
            </button>
            <button onClick={() => navigate('/map')} className={btnSecondary}>
              <Globe className="w-4 h-4" />
              Grid map
            </button>
          </div>
        </div>

        {/* Desktop: full version */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-5 gap-3 p-4 rounded-lg bg-black/50 border border-white/10 mb-6 text-left">
            <Stat
              label="Operating capacity"
              value={source.installedCapacityIndia}
              sub={`2030 target: ${source.targetCapacity2030}`}
              accent
            />
            <Stat label="Tariff" value={source.tariffInrPerKwh} sub={source.tariffUsdPerMwh} />
            <Stat label="Capacity factor (CUF)" value={source.cufRange} />
            <Stat label="Lifecycle CO2" value={source.carbonIntensityGCo2} />
            <MatchStat score={source.matchingScore247} />
          </div>

          <div className="grid grid-cols-12 gap-6 items-start text-left mb-6">
            {/* Left column */}
            <div className="col-span-6 flex flex-col gap-6">
              <div className={card}>
                <h4 className={cardTitle}>Daily generation profile</h4>
                <DispatchBar sourceId={source.id} />
                <p className="text-sm text-slate-300 leading-relaxed">{source.dispatchProfile}</p>
              </div>

              <div className={card}>
                <h4 className={cardTitle}>Technical specs</h4>
                <SpecList specs={source.technicalSpecs} />
              </div>

              <div className="flex flex-row gap-3">
                <button
                  onClick={() => navigate('/dc/profile', { state: { preferredSource: source.id } })}
                  className={`${btnPrimary} flex-1`}
                >
                  Add to my data center
                </button>
                <button onClick={() => navigate('/map')} className={btnSecondary}>
                  <Globe className="w-4 h-4" />
                  Grid map
                </button>
              </div>
            </div>

            {/* Right column */}
            <div className="col-span-6 flex flex-col gap-6">
              <div className={card}>
                <h4 className={cardTitle}>Benchmark plants in India</h4>
                <PlantList plants={source.keyPlants} />
              </div>

              <div className={card}>
                <h4 className={cardTitle}>765 kV transmission corridors</h4>
                <Corridors corridors={source.corridors} />
              </div>

              <ProsCons source={source} />
            </div>
          </div>

          <div className={`${card} mb-8 text-left`}>
            <h4 className={cardTitle}>Regulation (CERC and MNRE)</h4>
            <ul className="grid grid-cols-3 gap-x-6 gap-y-2 list-disc pl-5 text-sm text-slate-300">
              {source.regulatoryFramework.map((reg, i) => (
                <li key={i}>{reg}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <SourceDetailModal
        source={source}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        navigate={navigate}
      />
    </section>
  )
}

export default function AppLanding() {
  const hasSeenIntro = typeof window !== 'undefined' && localStorage.getItem('greengrid_intro_seen') === 'true'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showUI, setShowUI] = useState(true)
  const [isSystemInitiated, setIsSystemInitiated] = useState(hasSeenIntro)
  const [descentCompleted, setDescentCompleted] = useState(hasSeenIntro)
  const [heroScrollFade, setHeroScrollFade] = useState(1)
  const [heroTranslateY, setHeroTranslateY] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0
      // Hero fades out over the first 520px of scroll
      setHeroScrollFade(Math.max(0, Math.min(1, 1 - scrollY / 520)))
      setHeroTranslateY(scrollY * 0.16)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getSourceIcon = (id) => {
    switch (id) {
      case 'solar':
        return <Sun className="w-5 h-5 text-emerald-400" />
      case 'wind':
        return <Wind className="w-5 h-5 text-emerald-300" />
      case 'large-hydro':
        return <Droplets className="w-5 h-5 text-sky-400" />
      case 'pumped-hydro':
        return <Layers className="w-5 h-5 text-cyan-400" />
      case 'bess':
        return <Battery className="w-5 h-5 text-emerald-400" />
      case 'small-hydro':
        return <Droplets className="w-5 h-5 text-teal-300" />
      case 'biomass':
        return <Flame className="w-5 h-5 text-amber-400" />
      case 'green-hydrogen':
        return <Zap className="w-5 h-5 text-emerald-400" />
      case 'geothermal':
        return <Activity className="w-5 h-5 text-emerald-200" />
      default:
        return <Zap className="w-5 h-5 text-emerald-400" />
    }
  }

  const scrollToSources = () => {
    const el = document.getElementById('solar') || document.getElementById('clean-sources')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLaunchPlatform = () => {
    try {
      localStorage.setItem('greengrid_intro_seen', 'true')
    } catch (_) {}
    if (!isSystemInitiated) {
      setIsSystemInitiated(true)
    } else {
      scrollToSources()
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => { })
      setIsFullscreen(false)
    }
  }

  const isGroundReady = isSystemInitiated && descentCompleted

  return (
    <div
      className={`relative w-full ${isGroundReady ? 'min-h-screen overflow-x-hidden overflow-y-auto' : 'h-screen overflow-hidden'
        } bg-[#000204] text-[#f0f4f1] font-sans selection:bg-emerald-500/20 selection:text-white`}
    >
      <OrbitalEarthBackground
        opacity={heroScrollFade}
        isInitiated={isSystemInitiated}
        skipIntro={hasSeenIntro}
        onDescentComplete={() => {
          try {
            localStorage.setItem('greengrid_intro_seen', 'true')
          } catch (_) {}
          setDescentCompleted(true)
        }}
        onReplayDescent={() => setDescentCompleted(false)}
        onResetOrbit={() => {
          try {
            localStorage.removeItem('greengrid_intro_seen')
          } catch (_) {}
          setIsSystemInitiated(false)
          setDescentCompleted(false)
        }}
      />

      {/* Header */}
      <header
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 pt-4 pb-5 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isGroundReady && showUI ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <Logo3D size={34} className="w-8 h-8 shrink-0" />
          <span className="text-base font-semibold text-white">GreenGrid</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-300">
          <Link to="/map" className="hover:text-white transition-colors">
            Grid map
          </Link>
          <Link to="/dc/profile" className="hover:text-white transition-colors">
            Data center builder
          </Link>
          <Link to="/dc/results" className="hover:text-white transition-colors">
            Matches
          </Link>
          <Link to="/supplier/dashboard" className="hover:text-white transition-colors">
            Suppliers
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="px-3 py-1.5 text-sm text-zinc-300 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link to="/register" className={btnPrimary}>
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        className={`relative z-20 min-h-screen flex flex-col items-center justify-center text-center px-6 transition-opacity duration-500 ${showUI ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {/* Before the descent */}
        {!isSystemInitiated && (
          <div className="max-w-3xl flex flex-col items-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
              Clean power for India's data centers
            </h1>

            <p className="max-w-xl text-base text-zinc-300 mt-6 leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Compare renewable sources, tariffs and grid connections, and find a mix that can keep a data
              center running around the clock.
            </p>

            <div className="mt-8">
              <button
                onClick={handleLaunchPlatform}
                className="px-6 py-3 rounded-md bg-white text-zinc-950 font-medium text-sm hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>
        )}

        {/* After the descent */}
        {isGroundReady && (
          <div
            className="max-w-3xl flex flex-col items-center justify-center pt-24 pb-8 z-30 px-4 will-change-transform"
            style={{
              opacity: heroScrollFade,
              transform: `translate3d(0, -${heroTranslateY}px, 0)`,
            }}
          >
            <Logo3D size={200} className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] mb-5" />

            <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-4 drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)]">
              GreenGrid
            </h2>

            <p className="max-w-2xl text-base md:text-lg text-zinc-300 leading-relaxed mb-8 drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]">
              Match your data center's load with renewable supply, compare what each source costs, and see
              where the grid can support you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <button onClick={scrollToSources} className={btnPrimary}>
                Browse energy sources
              </button>
              <button onClick={() => navigate('/map')} className={btnSecondary}>
                <Globe className="w-4 h-4" />
                Open grid map
              </button>
              <button onClick={() => navigate('/dc/profile')} className={btnSecondary}>
                Plan your power mix
              </button>
            </div>

            <button
              onClick={scrollToSources}
              className="flex flex-col items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Scroll to see the sources</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Energy source sections */}
      {isGroundReady && (
        <>
          {ENERGY_SOURCES.map((source, idx) => (
            <EnergySourceSection
              key={source.id}
              source={source}
              idx={idx}
              getSourceIcon={getSourceIcon}
              navigate={navigate}
            />
          ))}

          {/* Bottom call-to-action */}
          <section className="relative z-20 bg-transparent px-6 sm:px-12 py-24 text-[#f0f4f1]">
            <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-xl bg-black/60 border border-white/10 text-left">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">Transmission corridors across India</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  See renewable energy parks, substation capacity and data center campuses across Gujarat,
                  Rajasthan, Tamil Nadu and Maharashtra.
                </p>
                <Link to="/map" className={btnPrimary}>
                  <Globe className="w-4 h-4" />
                  Open grid map
                </Link>
              </div>

              <div className="md:border-l border-white/10 md:pl-8">
                <h3 className="text-2xl font-semibold text-white mb-2">Data center sizing wizard</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Enter your IT load, target PUE and cooling setup, and we'll model solar, wind and storage
                  mixes that keep your supply clean around the clock.
                </p>
                <Link to="/dc/profile" className={btnSecondary}>
                  Set up your facility
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Bottom-right controls */}
      <footer className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-end px-6 sm:px-12 py-5 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowUI(!showUI)}
            title={showUI ? 'Hide interface' : 'Show interface'}
            aria-label={showUI ? 'Hide interface' : 'Show interface'}
            className="p-2 rounded-md bg-black/60 hover:bg-black/80 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            {showUI ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle fullscreen"
            aria-label="Toggle fullscreen"
            className="p-2 rounded-md bg-black/60 hover:bg-black/80 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff, 
  Globe, 
  ArrowRight, 
  ChevronDown, 
  Sliders, 
  ArrowUpRight,
  ShieldCheck,
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
  Compass,
  Cpu,
  Clock,
  Building2,
  MapPin
} from 'lucide-react'
import OrbitalEarthBackground from './components/ui/OrbitalEarthBackground'
import Logo3D from './components/ui/Logo3D'
import { ENERGY_SOURCES, ENERGY_SOURCE_CATEGORIES } from './data/energySourcesData'

function SectionBackgroundVideo({ videoSrc, imageSrc }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [scrollBlendOpacity, setScrollBlendOpacity] = useState(1);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.01, rootMargin: '260px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    if (isInViewport && videoSrc) {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isInViewport, videoSrc]);

  // Subtle scroll parallax and smooth cross-dissolve when entering/leaving viewport
  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      // Subtle parallax: 3.5% slower movement creates natural optical depth
      const offset = (rect.top - windowHeight / 2) * 0.035;
      setParallaxY(offset);

      // Smooth blend: calculate progress across the viewport
      const totalSpan = windowHeight + rect.height;
      const progress = (windowHeight - rect.top) / totalSpan;

      let opacity = 1;
      if (progress < 0.2) {
        // Entering from bottom: smooth ease-in
        opacity = 0.35 + (progress / 0.2) * 0.65;
      } else if (progress > 0.8) {
        // Exiting toward top: smooth ease-out
        opacity = 1 - ((progress - 0.8) / 0.2) * 0.65;
      }
      setScrollBlendOpacity(Math.max(0.25, Math.min(1, opacity)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute -top-24 sm:-top-36 -bottom-24 sm:-bottom-36 inset-x-0 h-[calc(100%+12rem)] sm:h-[calc(100%+18rem)] z-0 pointer-events-none overflow-hidden select-none"
      style={{
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 6%, rgba(0,0,0,0.85) 15%, black 25%, black 75%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,0.2) 94%, transparent 100%)',
        maskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 6%, rgba(0,0,0,0.85) 15%, black 25%, black 75%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,0.2) 94%, transparent 100%)',
        opacity: scrollBlendOpacity,
        transition: 'opacity 200ms ease-out',
      }}
    >
      {videoSrc ? (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          loop
          muted
          playsInline
          preload="auto"
          poster={imageSrc}
          style={{ transform: `translate3d(0, ${parallaxY}px, 0) scale(1.03)` }}
          className="w-full h-full object-cover opacity-100 contrast-[1.07] brightness-[1.03] saturate-[1.10] transition-transform duration-100 ease-out will-change-transform"
        />
      ) : (
        <img
          src={imageSrc}
          alt=""
          style={{ transform: `translate3d(0, ${parallaxY}px, 0) scale(1.03)` }}
          className="w-full h-full object-cover opacity-100 contrast-[1.07] brightness-[1.03] saturate-[1.10] transition-transform duration-100 ease-out will-change-transform"
        />
      )}
      {/* High-clarity subtle contrast scrims: preserves rich 1080p highlights and details while maintaining card legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-[#000204]/65" />
    </div>
  );
}

function EnergySourceSection({ source, idx, getSourceIcon, navigate }) {
  const anchorId = source.id === 'large-hydro' ? 'hydro' : source.id;
  const directPath = source.id === 'large-hydro' ? '/hydro' : `/${source.id}`;
  const nextSource = idx < ENERGY_SOURCES.length - 1 ? ENERGY_SOURCES[idx + 1] : null;
  const nextAnchorId = nextSource ? (nextSource.id === 'large-hydro' ? 'hydro' : nextSource.id) : null;
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '80px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={anchorId}
      style={{ zIndex: 10 + idx }}
      className="relative min-h-screen flex flex-col justify-center bg-transparent px-6 sm:px-12 py-24 sm:py-32 text-[#f0f4f1] transition-all duration-700 ease-out scroll-mt-0 overflow-visible"
    >
      {/* Dedicated Seamless Feather-Blended Background Video (Smoothly cross-fades into adjacent sections) */}
      <SectionBackgroundVideo videoSrc={source.video} imageSrc={source.image} />

      <div
        className={`relative z-10 max-w-[1360px] mx-auto w-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${
          isInView
            ? 'opacity-100 translate-y-0 scale-100 filter-none'
            : 'opacity-25 translate-y-12 scale-[0.98] blur-[1px]'
        }`}
      >
        {/* Tactical Stage & Sequence Header */}
        <div className="mb-6 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-black/40 border border-emerald-500/40 backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-emerald-400 font-semibold">
                PAGE 0{idx + 1} OF 09 // {source.badge}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-emerald-300 backdrop-blur-xl">
                {source.status}
              </span>
              <Link
                to={directPath}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-xl"
              >
                <span>Dedicated {source.shortName} Page</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-tight flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            <span className="p-2 rounded bg-black/40 border border-emerald-500/30 text-emerald-400 hidden sm:inline-flex backdrop-blur-md">
              {getSourceIcon(source.id)}
            </span>
            <span>{source.name}</span>
          </h2>

          <p className="max-w-3xl text-sm sm:text-base text-slate-200 leading-relaxed font-normal mt-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {source.tagline}. {source.roleInDatacenter}
          </p>
        </div>

        {/* Core Telemetry Grid (Full-Width 5 Metrics Blended in Frosted Glass) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 sm:p-5 rounded-2xl bg-black/35 border border-emerald-500/30 font-mono backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] mb-8">
          <div className="p-3 rounded-lg bg-black/25 border border-white/5 backdrop-blur-md">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">Operating Capacity</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">{source.installedCapacityIndia}</span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Target 2030: {source.targetCapacity2030}</span>
          </div>

          <div className="p-3 rounded-lg bg-black/25 border border-white/5 backdrop-blur-md">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">Tariff Band</span>
            <span className="text-base sm:text-lg font-bold text-white">{source.tariffInrPerKwh}</span>
            <span className="block text-[9px] text-slate-400 mt-0.5">{source.tariffUsdPerMwh}</span>
          </div>

          <div className="p-3 rounded-lg bg-black/25 border border-white/5 backdrop-blur-md">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">Capacity Factor (CUF)</span>
            <span className="text-base sm:text-lg font-bold text-emerald-300">{source.cufRange}</span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Operating Band</span>
          </div>

          <div className="p-3 rounded-lg bg-black/25 border border-white/5 backdrop-blur-md">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">Lifecycle Carbon</span>
            <span className="text-base sm:text-lg font-bold text-white">{source.carbonIntensityGCo2}</span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Scope 1 & 2 Neutral</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-black/25 border border-white/5 backdrop-blur-md">
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="text-slate-400 uppercase tracking-wider">24/7 Match Rank</span>
              <span className="text-emerald-400 font-bold">{source.matchingScore247}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/80 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 transition-all duration-700 rounded-full"
                style={{ width: `${source.matchingScore247}%` }}
              />
            </div>
            <span className="block text-[9px] text-emerald-400 mt-1 font-semibold">Uptime Rank</span>
          </div>
        </div>

        {/* Thorough Two-Column Deep Technical Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left mb-6">
          {/* Left Column (6 Cols): Diurnal Generation & Engineering Specifications */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Diurnal Generation Profile */}
            <div className="p-6 rounded-2xl bg-black/35 border border-emerald-500/25 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>DIURNAL GENERATION & DISPATCH PROFILE</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">24-HOUR IST CYCLE</span>
              </div>

              {/* Visual 24H Timeline Bar */}
              <div className="space-y-1.5 my-3">
                <div className="flex justify-between text-[9px] font-mono text-slate-400 px-1">
                  <span>00:00 (NIGHT)</span>
                  <span>06:00 (DAWN)</span>
                  <span>12:00 (NOON)</span>
                  <span>18:00 (DUSK)</span>
                  <span>24:00</span>
                </div>
                <div className="h-2.5 w-full bg-black/90 rounded-full overflow-hidden border border-white/10 relative">
                  {source.id === 'solar' && (
                    <div className="absolute inset-y-0 left-[25%] right-[25%] bg-gradient-to-r from-emerald-500/30 via-emerald-400 to-emerald-500/30 animate-pulse rounded-full" />
                  )}
                  {source.id === 'wind' && (
                    <>
                      <div className="absolute inset-y-0 left-0 right-[70%] bg-emerald-400/80 rounded-full" />
                      <div className="absolute inset-y-0 left-[65%] right-0 bg-emerald-400/80 rounded-full" />
                    </>
                  )}
                  {(source.id === 'large-hydro' || source.id === 'small-hydro' || source.id === 'biomass' || source.id === 'geothermal') && (
                    <div className="absolute inset-0 bg-emerald-400/80 rounded-full" />
                  )}
                  {source.id === 'pumped-hydro' && (
                    <>
                      <div className="absolute inset-y-0 left-[35%] right-[35%] bg-cyan-500/40 rounded-full" title="Pumping charging mode" />
                      <div className="absolute inset-y-0 left-[70%] right-[5%] bg-emerald-400 rounded-full" title="Generating discharge mode" />
                    </>
                  )}
                  {(source.id === 'bess' || source.id === 'green-hydrogen') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-emerald-500/20 animate-pulse rounded-full" />
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
                {source.dispatchProfile}
              </p>
            </div>

            {/* Technical Architecture & Specs */}
            <div className="p-6 rounded-2xl bg-black/35 border border-emerald-500/25 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-emerald-500/40 transition-all">
              <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-3 font-semibold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>ENGINEERING SPECIFICATIONS // HARDWARE TOPOLOGY</span>
              </div>
              <div className="space-y-2.5 text-xs font-mono">
                {Object.entries(source.technicalSpecs).map(([key, val]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-400 capitalize tracking-wider text-[11px]">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="text-slate-200 sm:text-right font-sans sm:font-mono text-xs sm:max-w-[65%] font-medium">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/dc/profile', { state: { preferredSource: source.id } })}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
                <span>Model in DC Sizing Wizard</span>
              </button>

              <button
                onClick={() => navigate('/map')}
                className="py-3 px-4 rounded-xl bg-black/40 hover:bg-black/60 border border-emerald-500/40 text-emerald-300 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-xl"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>765kV Corridors</span>
              </button>
            </div>
          </div>

          {/* Right Column (6 Cols): Benchmark Plants, Corridors & Trade-offs */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Benchmark Indian Mega-Plants */}
            <div className="p-6 rounded-2xl bg-black/35 border border-emerald-500/25 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-emerald-500/40 transition-all">
              <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-3 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>KEY INDIAN BENCHMARK INSTALLATIONS</span>
                </span>
                <span className="text-slate-400 text-[9px]">OPERATIONAL LEDGER</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {source.keyPlants.map((plant, pIdx) => (
                  <div key={pIdx} className="p-3.5 rounded-lg bg-black/35 border border-white/10 hover:border-emerald-500/40 backdrop-blur-md transition-all">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-semibold text-xs text-white">{plant.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap font-bold">
                        {plant.capacity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-slate-500" />
                        {plant.location}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{plant.developer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transmission Corridors */}
            <div className="p-5 rounded-2xl bg-black/35 border border-emerald-500/25 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-emerald-500/40 transition-all">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block mb-2">
                765kV GREEN TRANSMISSION CORRIDORS
              </span>
              <div className="flex flex-wrap gap-2">
                {source.corridors.map((c, cIdx) => (
                  <span key={cIdx} className="px-3 py-1 rounded-md bg-black/45 border border-emerald-500/25 font-mono text-[11px] text-slate-200 backdrop-blur-md">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Strategic Trade-offs: Advantages & Limitations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-5 rounded-2xl bg-black/35 border border-emerald-500/25 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block mb-2">
                  OPERATIONAL ADVANTAGES
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {source.advantages.map((adv, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-black/35 border border-amber-500/25 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold block mb-2">
                  GRID INTEGRATION CONSTRAINTS
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {source.limitations.map((lim, lIdx) => (
                    <li key={lIdx} className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Framework Ledger */}
        <div className="p-5 rounded-2xl bg-black/35 border border-emerald-500/25 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] mb-8">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              CERC & MNRE REGULATORY POLICIES
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {source.regulatoryFramework.map((reg, rIdx) => (
              <div key={rIdx} className="p-3 rounded-lg bg-black/35 border border-white/10 font-mono text-[11px] text-slate-200 backdrop-blur-md flex items-start gap-2">
                <span className="text-emerald-400 font-bold">0{rIdx + 1}.</span>
                <span>{reg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll to Next Source Switch Transition */}
        {nextSource && (
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left font-mono text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold uppercase tracking-wider block text-[10px]">
                NEXT CLEAN ENERGY SECTOR
              </span>
              <span>Stage 0{idx + 2} // {nextSource.name} ({nextSource.badge})</span>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById(nextAnchorId)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group relative px-6 py-3 rounded-full bg-black/60 hover:bg-emerald-950/60 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white font-mono text-xs uppercase tracking-widest backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all cursor-pointer flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span>Switch Page to {nextSource.shortName}</span>
              <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function AppLanding() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showUI, setShowUI] = useState(true)
  const [isSystemInitiated, setIsSystemInitiated] = useState(false)
  const [descentCompleted, setDescentCompleted] = useState(false)
  const [selectedSourceId, setSelectedSourceId] = useState('solar')
  const [heroScrollFade, setHeroScrollFade] = useState(1)
  const [heroTranslateY, setHeroTranslateY] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let rafId = null
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0
      // Over the first 520px of scroll, hero gracefully dissolves into deep space
      const fade = Math.max(0, Math.min(1, 1 - scrollY / 520))
      const transY = scrollY * 0.16
      setHeroScrollFade(fade)
      setHeroTranslateY(transY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const currentSource = ENERGY_SOURCES.find((s) => s.id === selectedSourceId) || ENERGY_SOURCES[0]

  const getSourceIcon = (id) => {
    switch (id) {
      case 'solar':
        return <Sun className="w-4 h-4 text-emerald-400" />
      case 'wind':
        return <Wind className="w-4 h-4 text-emerald-300" />
      case 'large-hydro':
        return <Droplets className="w-4 h-4 text-sky-400" />
      case 'pumped-hydro':
        return <Layers className="w-4 h-4 text-cyan-400" />
      case 'bess':
        return <Battery className="w-4 h-4 text-emerald-400" />
      case 'small-hydro':
        return <Droplets className="w-4 h-4 text-teal-300" />
      case 'biomass':
        return <Flame className="w-4 h-4 text-amber-400" />
      case 'green-hydrogen':
        return <Zap className="w-4 h-4 text-emerald-400" />
      case 'geothermal':
        return <Activity className="w-4 h-4 text-emerald-200" />
      default:
        return <Zap className="w-4 h-4 text-emerald-400" />
    }
  }

  const handleLaunchPlatform = () => {
    if (!isSystemInitiated) {
      setIsSystemInitiated(true)
    } else {
      scrollToSources()
    }
  }

  const scrollToSources = () => {
    const el = document.getElementById('solar') || document.getElementById('clean-sources')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const isGroundReady = isSystemInitiated && descentCompleted

  return (
    <div className={`relative w-full ${isGroundReady ? 'min-h-screen overflow-x-hidden overflow-y-auto' : 'h-screen overflow-hidden'} bg-[#000204] text-[#f0f4f1] font-sans selection:bg-emerald-500/20 selection:text-white`}>
      {/* Background Orbital / Descent Video Engine (Fixed Behind All Content) */}
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
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 pt-4 pb-5 bg-gradient-to-b from-black/90 via-black/40 to-transparent backdrop-blur-[4px] transition-all duration-700 ease-out ${
          isGroundReady && showUI
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        <Link to="/" className="flex items-center gap-3 group">
          <Logo3D size={34} className="w-8 h-8 shrink-0 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-sm font-semibold tracking-wider text-white group-hover:text-[#34d399] transition-colors">
            GreenGrid
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide text-zinc-300">
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

      {/* Hero View */}
      <section
        className={`relative z-20 min-h-screen flex flex-col items-center justify-center text-center px-6 transition-all duration-700 ${
          showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* State 1: Pre-launch Planetary Hero */}
        {!isSystemInitiated && (
          <div className="max-w-3xl flex flex-col items-center transition-all duration-700 ease-out">
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
        )}

        {/* State 2: Ground Power Infrastructure Hero (Revealed after descent with scroll-driven cinematic fade) */}
        {isGroundReady && (
          <div
            className="max-w-3xl flex flex-col items-center justify-center pt-24 pb-8 z-30 px-4 transition-transform duration-75 ease-out will-change-transform"
            style={{
              opacity: heroScrollFade,
              transform: `translate3d(0, -${heroTranslateY}px, 0)`,
            }}
          >
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

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <button
                onClick={scrollToSources}
                className="px-6 py-3 rounded-lg bg-[#00d084] hover:bg-[#00e599] text-[#022c22] font-semibold text-sm sm:text-base flex items-center gap-2 shadow-[0_0_24px_rgba(0,208,132,0.3)] hover:shadow-[0_0_36px_rgba(0,208,132,0.5)] transition-all cursor-pointer active:scale-95"
              >
                <span>Explore Energy Matrix</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>

              <button
                onClick={() => navigate('/map')}
                className="px-6 py-3 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-emerald-500/40 backdrop-blur-md text-white font-medium text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Grid Siting Radar</span>
              </button>

              <button
                onClick={() => navigate('/dc/profile')}
                className="px-6 py-3 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 backdrop-blur-md text-white font-medium text-sm sm:text-base transition-all cursor-pointer active:scale-95"
              >
                Plan Power Strategy
              </button>
            </div>

            {/* Tactical Scroll Down Indicator */}
            <div
              onClick={scrollToSources}
              className="group cursor-pointer flex flex-col items-center gap-1.5 transition-all text-slate-400 hover:text-emerald-300"
            >
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[2px] text-emerald-400/90 font-medium group-hover:text-emerald-300 transition-colors">
                Scroll to Explore Clean Energy Matrix
              </span>
              <div className="w-6 h-6 rounded-full border border-emerald-500/30 flex items-center justify-center bg-black/40 group-hover:border-emerald-400 transition-all">
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              </div>
            </div>
          </div>
        )}

      </section>

      {/* Sequential Dedicated Energy Source Pages (Directly Accessible via Scroll) */}
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



          {/* Tactical Grid Siting Radar & DC Profile Interconnect Banner */}
          <section className="relative z-20 bg-transparent px-6 sm:px-12 py-24 text-[#f0f4f1] overflow-visible">

            <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-emerald-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-left relative z-20">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  GEOSPATIAL SITING RADAR // 765kV CTU INTERCONNECT
                </span>
                <h3 className="text-2xl font-bold uppercase text-white mt-1 mb-2">
                  Pan-India Transmission Corridors
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Inspect real-world renewable energy parks, substation line capacities, and active AI data center campuses across Gujarat, Rajasthan, Tamil Nadu, and Maharashtra.
                </p>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>Launch National Siting Radar →</span>
                </Link>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-white/10 md:pl-6 pt-4 md:pt-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  24/7 FIRM POWER MATCHING ENGINE
                </span>
                <h3 className="text-2xl font-bold uppercase text-white mt-1 mb-2">
                  Data Center Sizing Wizard
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Input your IT critical load, target PUE, and cooling architecture. Our matching algorithm models solar-wind-storage blends for 99.999% clean uptime.
                </p>
                <Link
                  to="/dc/profile"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black/50 hover:bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-md"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Configure Facility Specs →</span>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Bottom Interface Controls */}
      <footer className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-end px-6 sm:px-12 py-5 pointer-events-none">
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            onClick={() => setShowUI(!showUI)}
            title={showUI ? 'Hide Interface' : 'Show Interface'}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer backdrop-blur-md"
          >
            {showUI ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#10b981]" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer backdrop-blur-md"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </footer>
    </div>
  )
}

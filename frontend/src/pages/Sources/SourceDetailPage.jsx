import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Sliders, 
  Globe, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  TrendingUp, 
  MapPin,
  ChevronDown,
  ChevronRight,
  Sun,
  Wind,
  Droplets,
  Layers,
  Battery,
  Flame,
  Clock
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { getEnergySourceById, ENERGY_SOURCES } from '../../data/energySourcesData';

function DedicatedBackgroundVideo({ videoSrc, imageSrc, sourceName }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    const playVideo = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    };

    playVideo();
    video.addEventListener('loadeddata', playVideo);
    return () => {
      video.removeEventListener('loadeddata', playVideo);
    };
  }, [videoSrc]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {videoSrc ? (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          poster={imageSrc}
          className="w-full h-full object-cover opacity-100 scale-[1.02] contrast-[1.07] brightness-[1.03] saturate-[1.10] transition-opacity duration-1000 ease-out"
        />
      ) : (
        <img
          src={imageSrc}
          alt={sourceName}
          className="w-full h-full object-cover opacity-100 scale-[1.02] contrast-[1.07] brightness-[1.03] saturate-[1.10]"
        />
      )}
      {/* High-clarity subtle scrim overlay: preserves vibrant 1080p video while maintaining text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-[#000204]/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-[#000204]/65" />
    </div>
  );
}

export default function SourceDetailPage({ sourceIdOverride }) {
  const { sourceId: paramId } = useParams();
  const sourceId = sourceIdOverride || paramId || 'solar';
  const navigate = useNavigate();
  const source = getEnergySourceById(sourceId);

  // Scroll to top on source switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [source.id]);

  const currentIndex = ENERGY_SOURCES.findIndex(s => s.id === source.id);
  const nextSource = currentIndex < ENERGY_SOURCES.length - 1 ? ENERGY_SOURCES[currentIndex + 1] : ENERGY_SOURCES[0];
  const nextRoute = nextSource.id === 'large-hydro' ? '/hydro' : `/${nextSource.id}`;

  const getSourceIcon = (id) => {
    switch (id) {
      case 'solar': return <Sun className="w-4 h-4 text-emerald-400" />;
      case 'wind': return <Wind className="w-4 h-4 text-emerald-300" />;
      case 'large-hydro':
      case 'small-hydro': return <Droplets className="w-4 h-4 text-sky-400" />;
      case 'pumped-hydro': return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'bess': return <Battery className="w-4 h-4 text-emerald-400" />;
      case 'biomass': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'green-hydrogen': return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'geothermal': return <Activity className="w-4 h-4 text-emerald-200" />;
      default: return <Zap className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getSourceRoute = (id) => {
    if (id === 'large-hydro') return '/hydro';
    return `/${id}`;
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#000204] text-[#f0f4f1] font-sans selection:bg-emerald-500/20 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* Dedicated AI-Generated Ambient Video Across the ENTIRE Page Background */}
      <DedicatedBackgroundVideo
        videoSrc={source.video}
        imageSrc={source.image}
        sourceName={source.name}
      />

      {/* Foreground Content Container */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-12 pt-28 pb-20">
        
        {/* Navigation Breadcrumb & Tactical Source Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              to={`/#${source.id === 'large-hydro' ? 'hydro' : source.id}`}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Grid Landing Overview</span>
            </Link>
            <span className="text-slate-600 font-mono text-xs">//</span>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
              {getSourceIcon(source.id)}
              {source.shortName}
            </span>
          </div>

          {/* Quick Navigator Pill Bar for all Clean Energy Sources */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {ENERGY_SOURCES.map((s) => {
              const isActive = s.id === source.id;
              const route = getSourceRoute(s.id);
              return (
                <Link
                  key={s.id}
                  to={route}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all whitespace-nowrap backdrop-blur-md ${
                    isActive
                      ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)] font-semibold'
                      : 'bg-black/60 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.accentColor || '#10b981' }} />
                  <span>{s.shortName}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Hero Header Area (Full-Width, Uncramped) */}
        <div className="mb-10 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-emerald-400 font-semibold">
                {source.badge}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-[#040a08]/90 border border-white/10 text-emerald-300 backdrop-blur-md">
                {source.status}
              </span>
              <span className="px-2.5 py-1 rounded bg-black/60 border border-emerald-500/30 text-slate-300 backdrop-blur-md">
                FLEET: {source.installedCapacityIndia}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase mb-4 leading-tight flex items-center gap-3">
            <span className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hidden sm:inline-flex">
              {getSourceIcon(source.id)}
            </span>
            <span>{source.name}</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed mb-6 max-w-4xl">
            {source.tagline}. {source.roleInDatacenter}
          </p>

          {/* Interactive Actions & Section Jump */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/dc/profile', { state: { preferredSource: source.id } })}
              className="px-6 py-2.5 rounded-[4px] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Model in DC Sizing Wizard</span>
            </button>

            <button
              onClick={() => navigate('/map', { state: { filterType: source.category } })}
              className="px-6 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-emerald-500/30 hover:border-emerald-500 text-slate-200 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xl"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Locate Plants on Live Map</span>
            </button>

            <button
              onClick={() => scrollToSection('architecture-specs')}
              className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xl"
            >
              <span>Scroll to Specifications</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Top High-Level Telemetry Cards (Full-Width 5-Column Grid Blended in Frosted Glass) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-5 rounded-2xl bg-black/35 border border-emerald-500/30 font-mono backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] mb-10">
          <div className="p-3 rounded-lg bg-black/25 border border-white/5 backdrop-blur-md">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">Operating Capacity</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">{source.installedCapacityIndia}</span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Target 2030: {source.targetCapacity2030}</span>
          </div>

          <div className="p-3 rounded-lg bg-black/25 border border-white/5 backdrop-blur-md">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400">Tariff Band (LCOE)</span>
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
              <span className="text-slate-400 uppercase tracking-wider">24/7 Match Suitability</span>
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

        {/* Detailed Architecture Breakdown (Thorough 2-Column Grid) */}
        <div id="architecture-specs" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Left Column (6 Cols): Diurnal Dispatch Curve & Operational Role + Engineering Specifications */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Diurnal Dispatch Profile Card */}
            <div className="rounded-2xl bg-black/35 border border-emerald-500/25 p-6 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>DIURNAL GENERATION & DISPATCH ARCHITECTURE</span>
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

            {/* Technical Specifications Ledger */}
            <div className="rounded-2xl bg-black/35 border border-emerald-500/25 p-6 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-emerald-500/40 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold font-mono uppercase tracking-wide text-white">
                  Engineering Specifications // Hardware Topology
                </h2>
              </div>
              <div className="space-y-2.5 border-t border-white/5 pt-3">
                {Object.entries(source.technicalSpecs || {}).map(([key, val]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-baseline justify-between py-1.5 border-b border-white/5 font-mono text-xs">
                    <span className="text-slate-400 uppercase text-[10px] tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="text-slate-200 sm:text-right sm:max-w-[65%] font-medium font-sans sm:font-mono">{val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (6 Cols): Benchmark Plants, Corridors & Trade-offs */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Benchmark Mega-Assets in India */}
            <div className="rounded-2xl bg-black/35 border border-emerald-500/25 p-6 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wide text-white">
                    Key Benchmark Installations in India
                  </h2>
                </div>
                <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                  OPERATIONAL LEDGER
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {source.keyPlants.map((plant, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-black/35 border border-white/10 hover:border-emerald-500/40 backdrop-blur-md transition-all">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-semibold text-xs text-white">{plant.name}</span>
                      <span className="font-mono text-xs text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap">
                        {plant.capacity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-slate-500" />
                        {plant.location}
                      </span>
                      <span>{plant.developer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTU Green Transmission Corridors */}
            <div className="rounded-2xl bg-black/35 border border-emerald-500/25 p-5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-emerald-500/40 transition-all">
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-3 font-semibold">
                765kV Green Transmission Corridors
              </h3>
              <div className="flex flex-wrap gap-2">
                {source.corridors.map((c, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-md bg-black/45 border border-emerald-500/25 font-mono text-[11px] text-slate-200 backdrop-blur-md">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Strategic Trade-offs: Advantages & Limitations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Engineering Advantages */}
              <div className="rounded-2xl bg-black/35 border border-emerald-500/25 p-5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    Procurement Advantages
                  </h3>
                </div>
                <ul className="space-y-2">
                  {source.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Operational Limitations */}
              <div className="rounded-2xl bg-black/35 border border-amber-500/25 p-5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 text-amber-400 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    Grid Constraints
                  </h3>
                </div>
                <ul className="space-y-2">
                  {source.limitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>

        {/* Regulatory Framework Policies (Full-Width Card) */}
        <div className="rounded-2xl bg-black/35 border border-emerald-500/25 p-6 backdrop-blur-xl mb-10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              CERC & MNRE Regulatory Framework
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {source.regulatoryFramework.map((reg, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-black/35 border border-white/10 font-mono text-xs text-slate-200 backdrop-blur-md flex items-start gap-2">
                <span className="text-emerald-400 font-bold">0{idx + 1}.</span>
                <span>{reg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Energy Source Sequencer Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-black/40 to-black/60 border border-emerald-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              NEXT CLEAN GENERATION PROFILE // STAGE 0{currentIndex + 2 > 9 ? 1 : currentIndex + 2}
            </span>
            <h4 className="text-xl font-bold uppercase text-white mt-1">
              Explore {nextSource.name}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {nextSource.tagline}
            </p>
          </div>

          <Link
            to={nextRoute}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all shrink-0 cursor-pointer"
          >
            <span>Proceed to {nextSource.shortName}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

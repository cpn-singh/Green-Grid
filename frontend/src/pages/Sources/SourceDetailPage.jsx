import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  Activity,
  Globe,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  Sun,
  Wind,
  Droplets,
  Layers,
  Battery,
  Flame
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { getEnergySourceById, ENERGY_SOURCES } from '../../data/energySourcesData';

// Same button and card styles as the landing page, so the site feels consistent
const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors cursor-pointer';
const btnSecondary =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 text-zinc-100 text-sm transition-colors cursor-pointer';
const card = 'rounded-lg border border-white/10 bg-black/50 p-5';
const cardTitle = 'text-sm font-semibold text-white mb-3';

function DedicatedBackgroundImage({ imageSrc }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#000204]">
      <img
        src={imageSrc}
        alt=""
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover object-center opacity-85 brightness-[0.82]"
      />
      {/* Dark overlay so the text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000204]/85 via-black/40 to-[#000204]/90" />
    </div>
  );
}

function Stat({ label, value, sub, accent }) {
  return (
    <div className="p-3 rounded-md bg-black/40 border border-white/10">
      <span className="block text-xs text-slate-400">{label}</span>
      <span className={`block text-lg font-semibold ${accent ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </span>
      {sub && <span className="block text-xs text-slate-400 mt-0.5">{sub}</span>}
    </div>
  );
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
  );
}

const getSourceRoute = (id) => (id === 'large-hydro' ? '/hydro' : `/${id}`);

const getSourceIcon = (id) => {
  switch (id) {
    case 'solar': return <Sun className="w-5 h-5 text-emerald-400" />;
    case 'wind': return <Wind className="w-5 h-5 text-emerald-300" />;
    case 'large-hydro':
    case 'small-hydro': return <Droplets className="w-5 h-5 text-sky-400" />;
    case 'pumped-hydro': return <Layers className="w-5 h-5 text-cyan-400" />;
    case 'bess': return <Battery className="w-5 h-5 text-emerald-400" />;
    case 'biomass': return <Flame className="w-5 h-5 text-amber-400" />;
    case 'green-hydrogen': return <Zap className="w-5 h-5 text-emerald-400" />;
    case 'geothermal': return <Activity className="w-5 h-5 text-emerald-200" />;
    default: return <Zap className="w-5 h-5 text-emerald-400" />;
  }
};

export default function SourceDetailPage({ sourceIdOverride }) {
  const { sourceId: paramId } = useParams();
  const sourceId = sourceIdOverride || paramId || 'solar';
  const navigate = useNavigate();
  const source = getEnergySourceById(sourceId);

  // Jump back to the top when the user switches source
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [source?.id]);

  if (!source) {
    return (
      <div className="min-h-screen bg-[#000204] text-[#f0f4f1]">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 pt-36 text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">We couldn't find that energy source</h1>
          <p className="text-slate-300 mb-6">The link may be wrong or the page may have moved.</p>
          <Link to="/solar" className={btnPrimary}>
            Go to solar
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = ENERGY_SOURCES.findIndex((s) => s.id === source.id);
  const nextSource = ENERGY_SOURCES[(currentIndex + 1) % ENERGY_SOURCES.length];
  const nextRoute = getSourceRoute(nextSource.id);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#000204] text-[#f0f4f1] font-sans selection:bg-emerald-500/20 selection:text-white overflow-x-hidden">
      <Navbar />

      <DedicatedBackgroundImage imageSrc={source.image} />

      <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-12 pt-28 pb-20">
        {/* Back link and source switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <Link
            to={`/#${source.id === 'large-hydro' ? 'hydro' : source.id}`}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to overview
          </Link>

          <nav aria-label="Energy sources" className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {ENERGY_SOURCES.map((s) => {
              const isActive = s.id === source.id;
              return (
                <Link
                  key={s.id}
                  to={getSourceRoute(s.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black/60 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
                    }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: s.accentColor || '#10b981' }}
                  />
                  {s.shortName}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Title area */}
        <div className="mb-10 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="text-sm text-emerald-400">{source.badge}</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-slate-300">
                Installed in India: {source.installedCapacityIndia}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-4 leading-tight flex items-center gap-3">
            <span className="hidden sm:inline-flex">{getSourceIcon(source.id)}</span>
            <span>{source.name}</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6 max-w-4xl">
            {source.tagline}. {source.roleInDatacenter}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/dc/profile', { state: { preferredSource: source.id } })}
              className={btnPrimary}
            >
              Add to my data center
            </button>

            <button
              onClick={() => navigate('/map', { state: { filterType: source.category } })}
              className={btnSecondary}
            >
              <Globe className="w-4 h-4" />
              Show plants on map
            </button>

            <button
              onClick={() => scrollToSection('architecture-specs')}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Jump to specs
            </button>
          </div>
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 rounded-lg bg-black/50 border border-white/10 mb-10">
          <Stat
            label="Operating capacity"
            value={source.installedCapacityIndia}
            sub={`2030 target: ${source.targetCapacity2030}`}
            accent
          />
          <Stat label="Tariff (LCOE)" value={source.tariffInrPerKwh} sub={source.tariffUsdPerMwh} />
          <Stat label="Capacity factor (CUF)" value={source.cufRange} />
          <Stat label="Lifecycle CO2" value={source.carbonIntensityGCo2} />

          <div className="col-span-2 sm:col-span-1 p-3 rounded-md bg-black/40 border border-white/10">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-400">24/7 match score</span>
              <span className="text-emerald-400 font-semibold">{source.matchingScore247}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/80 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${source.matchingScore247}%` }}
              />
            </div>
          </div>
        </div>

        {/* Specs, plants, pros and cons */}
        <div id="architecture-specs" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* Left column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className={card}>
              <h2 className={cardTitle}>Daily generation profile</h2>
              <DispatchBar sourceId={source.id} />
              <p className="text-sm text-slate-300 leading-relaxed">{source.dispatchProfile}</p>
            </div>

            <div className={card}>
              <h2 className={cardTitle}>Technical specs</h2>
              <div className="space-y-2 text-sm">
                {Object.entries(source.technicalSpecs || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-white/5 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-gray-400 font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-slate-100 sm:text-right sm:max-w-[65%]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className={card}>
              <h2 className={cardTitle}>Benchmark plants in India</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {source.keyPlants.map((plant, idx) => (
                  <div key={idx} className="p-3 rounded-md bg-black/40 border border-white/10">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium text-sm text-white">{plant.name}</span>
                      <span className="text-xs text-emerald-400 whitespace-nowrap">{plant.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 text-sm text-gray-400 font-bold mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {plant.location}
                      </span>
                      <span>{plant.developer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={card}>
              <h2 className={cardTitle}>765 kV transmission corridors</h2>
              <div className="flex flex-wrap gap-2">
                {source.corridors.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-black/50 border border-white/15 text-xs text-slate-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={card}>
                <h2 className={cardTitle}>Why buy it</h2>
                <ul className="space-y-2 text-sm text-slate-300">
                  {source.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={card}>
                <h2 className={cardTitle}>Grid constraints</h2>
                <ul className="space-y-2 text-sm text-slate-300">
                  {source.limitations.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Regulation */}
        <div className={`${card} mb-10`}>
          <h2 className={cardTitle}>Regulation (CERC and MNRE)</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 list-disc pl-5 text-sm text-slate-300">
            {source.regulatoryFramework.map((reg, idx) => (
              <li key={idx}>{reg}</li>
            ))}
          </ul>
        </div>

        {/* Next source */}
        <div className={`${card} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <div>
            <span className="text-sm text-slate-400">Next source</span>
            <h3 className="text-xl font-semibold text-white">{nextSource.name}</h3>
            <p className="text-sm text-slate-300 mt-0.5">{nextSource.tagline}</p>
          </div>

          <Link to={nextRoute} className={`${btnPrimary} shrink-0`}>
            Go to {nextSource.shortName}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

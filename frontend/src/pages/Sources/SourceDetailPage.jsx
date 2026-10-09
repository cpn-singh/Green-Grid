import React from 'react';
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
  MapPin 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import EnergyVideoMedia from '../../components/ui/EnergyVideoMedia';
import { getEnergySourceById, ENERGY_SOURCES } from '../../data/energySourcesData';

export default function SourceDetailPage() {
  const { sourceId } = useParams();
  const navigate = useNavigate();
  const source = getEnergySourceById(sourceId);

  return (
    <div className="min-h-screen bg-[#000204] text-[#f0f4f1] font-sans selection:bg-emerald-500/20 selection:text-white">
      <Navbar />

      {/* Main Container */}
      <div className="max-w-[1360px] mx-auto px-6 sm:px-12 pt-28 pb-20">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/sources"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Sources</span>
          </Link>
          <span className="text-slate-600 font-mono text-xs">//</span>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            {source.shortName}
          </span>
        </div>

        {/* Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left: Text & Key Specs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-emerald-500/10 border border-emerald-500/25 mb-4 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-emerald-400 font-semibold">
                {source.badge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase mb-4 leading-tight">
              {source.name}
            </h1>

            <p className="text-base text-slate-300 font-normal leading-relaxed mb-6">
              {source.tagline}. {source.roleInDatacenter}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg bg-[#040a08] border border-emerald-500/20 mb-6">
              <div>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500">Tariff (LCOE)</span>
                <span className="font-mono text-base font-bold text-emerald-400">{source.tariffInrPerKwh}</span>
                <span className="block text-[10px] font-mono text-slate-500">{source.tariffUsdPerMwh}</span>
              </div>
              <div>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500">Capacity Factor (CUF)</span>
                <span className="font-mono text-base font-bold text-white">{source.cufRange}</span>
                <span className="block text-[10px] font-mono text-slate-500">Operating Band</span>
              </div>
              <div>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500">Lifecycle Carbon</span>
                <span className="font-mono text-base font-bold text-emerald-400">{source.carbonIntensityGCo2}</span>
                <span className="block text-[10px] font-mono text-slate-500">Abatement Index</span>
              </div>
              <div>
                <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500">24/7 Match Suitability</span>
                <span className="font-mono text-base font-bold text-white">{source.matchingScore247}%</span>
                <span className="block text-[10px] font-mono text-emerald-400 font-semibold">Uptime Rank</span>
              </div>
            </div>

            {/* Interactive Actions */}
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
                className="px-6 py-2.5 rounded-[4px] bg-[#040a08] border border-emerald-500/30 hover:border-emerald-500 text-slate-200 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Locate Plants on Live Map</span>
              </button>
            </div>
          </div>

          {/* Right: Real Cinematic Media Component */}
          <div className="lg:col-span-5 relative rounded-lg border border-emerald-500/30 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <EnergyVideoMedia
              imageSrc={source.image}
              videoSrc={source.video}
              videoCdn={source.videoCdn}
              alt={source.name}
              aspectRatio="aspect-[4/3]"
              overlayOpacity="0.45"
            />
            <div className="p-4 bg-[#040a08] border-t border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">Indian Operating Fleet</span>
                <span className="font-mono text-sm font-bold text-white">{source.installedCapacityIndia}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500">2030 Capacity Goal</span>
                <span className="font-mono text-sm font-bold text-emerald-400">{source.targetCapacity2030}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Architecture Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Diurnal Dispatch Curve & Operational Role */}
          <div className="lg:col-span-7 rounded-lg bg-[#040a08] border border-emerald-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-bold font-mono uppercase tracking-wide text-white">
                Dispatch Architecture // 24-Hour Diurnal Curve
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              {source.dispatchProfile}
            </p>

            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-3 font-semibold">
              Technical Specifications Ledger
            </h3>
            <div className="space-y-2 border-t border-white/5 pt-3">
              {Object.entries(source.technicalSpecs || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between items-baseline py-1.5 border-b border-white/5 font-mono text-xs">
                  <span className="text-slate-400 uppercase text-[10px] tracking-wider">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-slate-200 text-right max-w-[60%] font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Plants & Green Corridors */}
          <div className="lg:col-span-5 rounded-lg bg-[#040a08] border border-emerald-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-bold font-mono uppercase tracking-wide text-white">
                Benchmark Mega-Assets in India
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              {source.keyPlants.map((plant, idx) => (
                <div key={idx} className="p-3 rounded-[4px] bg-[#020504] border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-xs text-white">{plant.name}</span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">{plant.capacity}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-slate-500" />
                      {plant.location}
                    </span>
                    <span>{plant.developer}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-3 font-semibold">
              CTU Green Evacuation Corridors
            </h3>
            <ul className="space-y-1.5 text-xs font-mono text-slate-300">
              {source.corridors.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">›</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regulatory & Advantages / Limitations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Engineering Advantages */}
          <div className="rounded-lg bg-[#040a08] border border-emerald-500/20 p-6">
            <div className="flex items-center gap-2 text-emerald-400 mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                Data Center Procurement Advantages
              </h3>
            </div>
            <ul className="space-y-2.5">
              {source.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Limitations */}
          <div className="rounded-lg bg-[#040a08] border border-emerald-500/20 p-6">
            <div className="flex items-center gap-2 text-amber-400 mb-4">
              <AlertCircle className="w-4 h-4" />
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
                Grid & Dispatch Constraints
              </h3>
            </div>
            <ul className="space-y-2.5">
              {source.limitations.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regulatory Policies */}
        <div className="rounded-lg bg-[#040a08] border border-emerald-500/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              CERC & MNRE Regulatory Framework
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {source.regulatoryFramework.map((reg, idx) => (
              <div key={idx} className="p-3 rounded-[4px] bg-[#020504] border border-white/5 font-mono text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">0{idx + 1}.</span>
                <span>{reg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

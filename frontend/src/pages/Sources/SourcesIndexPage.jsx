import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Wind, 
  Sun, 
  Droplets, 
  Battery, 
  Flame, 
  Sparkles, 
  Activity, 
  ExternalLink, 
  ArrowUpRight, 
  ShieldCheck, 
  BarChart3, 
  Sliders, 
  Globe 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import EnergyVideoMedia from '../../components/ui/EnergyVideoMedia';
import { ENERGY_SOURCES, ENERGY_SOURCE_CATEGORIES } from '../../data/energySourcesData';

export default function SourcesIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Sources');
  const navigate = useNavigate();

  const filteredSources = selectedCategory === 'All Sources'
    ? ENERGY_SOURCES
    : ENERGY_SOURCES.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#000204] text-[#f0f4f1] font-sans selection:bg-emerald-500/20 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 sm:px-12 max-w-[1360px] mx-auto border-b border-emerald-500/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
        
        {/* Micro-badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-emerald-500/10 border border-emerald-500/25 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] tracking-[2px] uppercase text-emerald-400 font-semibold">
            NATIONAL ENERGY MATRIX // CEA & MNRE TAXONOMY
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase mb-6 leading-[1.08]">
          RENEWABLE SOURCES <span className="text-emerald-400">// 24/7 CLEAN DISPATCH</span>
        </h1>

        <p className="max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-10">
          Hyperscale AI workloads require 99.999% uninterrupted uptime. Explore India's commercial generation mix across 
          utility solar, aerodynamic wind, Himalayan hydro, closed-loop pumped storage, and sub-second battery systems 
          to engineer round-the-clock (RTC) zero-carbon power purchase agreements.
        </p>

        {/* Tactical Key Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-lg bg-[#040a08]/80 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Total Non-Fossil Operating</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1">190.5+ GW</span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5">CEA National Ledger (2025)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">2030 National Target</span>
            <span className="text-2xl font-bold font-mono text-white mt-1">500.0 GW</span>
            <span className="text-[11px] text-emerald-500/80 font-mono mt-0.5">COP26 Sovereign Goal</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Round-The-Clock (RTC) Tariffs</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1">₹4.20 - ₹5.40</span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5">Solar + Wind + PSP/BESS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">ISTS Transmission Waiver</span>
            <span className="text-2xl font-bold font-mono text-white mt-1">100% EXEMPT</span>
            <span className="text-[11px] text-emerald-500/80 font-mono mt-0.5">Inter-State Grid (Pre-2028)</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-6 sm:px-12 max-w-[1360px] mx-auto py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ENERGY_SOURCE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-[4px] font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)] font-semibold'
                      : 'bg-[#040a08] text-slate-400 border border-white/10 hover:border-emerald-500/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/map"
              className="px-4 py-2 rounded-[4px] bg-[#040a08] border border-emerald-500/30 hover:border-emerald-500 text-slate-200 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Siting Radar Map</span>
            </Link>
            <Link
              to="/dc/profile"
              className="px-4 py-2 rounded-[4px] bg-emerald-500 text-zinc-950 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>DC Sizing Builder</span>
            </Link>
          </div>
        </div>

        {/* Source Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="group relative rounded-lg bg-[#070e0a]/80 border border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300 flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)]"
            >
              {/* Tactical Corner Targeting Brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400 z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400 z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400 z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400 z-20 pointer-events-none" />

              {/* Video / High-Res Media Header */}
              <div className="relative">
                <EnergyVideoMedia
                  imageSrc={source.image}
                  videoSrc={source.video}
                  videoCdn={source.videoCdn}
                  alt={source.name}
                  aspectRatio="aspect-[16/10]"
                  overlayOpacity="0.65"
                />

                {/* Status Badge Overlay */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono tracking-wider uppercase text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{source.category}</span>
                </div>

                <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-[3px] bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  {source.installedCapacityIndia}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-1">
                    {source.badge}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    {source.shortName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {source.tagline}
                  </p>

                  {/* Operational Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-2.5 my-5 p-3 rounded-[4px] bg-[#020504] border border-white/5">
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500">Tariff Band</span>
                      <span className="font-mono text-sm font-semibold text-emerald-400">{source.tariffInrPerKwh}</span>
                      <span className="block text-[9px] font-mono text-slate-500">{source.tariffUsdPerMwh}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500">Capacity Factor (CUF)</span>
                      <span className="font-mono text-sm font-semibold text-white">{source.cufRange}</span>
                      <span className="block text-[9px] font-mono text-slate-500">{source.carbonIntensityGCo2}</span>
                    </div>
                  </div>

                  {/* 24/7 Match Suitability Meter */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                      <span className="text-slate-400 uppercase tracking-wider">24/7 Firm Matching Score</span>
                      <span className="text-emerald-400 font-bold">{source.matchingScore247}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 rounded-full"
                        style={{ width: `${source.matchingScore247}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
                  <Link
                    to={`/sources/${source.id}`}
                    className="flex-1 py-2 px-3 rounded-[4px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white font-mono text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Inspect Specs</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  </Link>

                  <button
                    onClick={() => navigate('/dc/profile', { state: { preferredSource: source.id } })}
                    title="Model with this source in DC Sizing Wizard"
                    className="p-2 rounded-[4px] bg-[#020504] border border-white/10 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 transition-all"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparative Technical Benchmark Table */}
      <section className="px-6 sm:px-12 max-w-[1360px] mx-auto py-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-emerald-500/10 border border-emerald-500/25 mb-3">
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-emerald-400 font-semibold">
              SYSTEM LEVELIZED BENCHMARKS // CEA & CERC COMPARATIVE MATRIX
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
            RENEWABLE ASSET <span className="text-emerald-400">COMPARISON MATRIX</span>
          </h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-emerald-500/20 bg-[#040a08]/90">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-emerald-500/20 bg-black/60 text-slate-400 uppercase tracking-widest text-[10px]">
                <th className="py-4 px-5 font-semibold">Generation Technology</th>
                <th className="py-4 px-4 font-semibold">National Capacity</th>
                <th className="py-4 px-4 font-semibold">Tariff (₹/kWh)</th>
                <th className="py-4 px-4 font-semibold">Capacity Factor</th>
                <th className="py-4 px-4 font-semibold">24/7 Score</th>
                <th className="py-4 px-4 font-semibold">Lifecycle CO₂</th>
                <th className="py-4 px-5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ENERGY_SOURCES.map((s) => (
                <tr key={s.id} className="hover:bg-emerald-500/5 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-white flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">{s.installedCapacityIndia}</td>
                  <td className="py-3.5 px-4 text-slate-300">{s.tariffInrPerKwh}</td>
                  <td className="py-3.5 px-4 text-slate-300">{s.cufRange}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      s.matchingScore247 >= 90
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : s.matchingScore247 >= 75
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {s.matchingScore247}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{s.carbonIntensityGCo2}</td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      to={`/sources/${s.id}`}
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] uppercase tracking-wider"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

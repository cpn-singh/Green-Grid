import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Sliders, Globe } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { ENERGY_SOURCES, ENERGY_SOURCE_CATEGORIES } from '../../data/energySourcesData';

// Same button and card styles as the landing and detail pages
const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors cursor-pointer';
const btnSecondary =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 text-zinc-100 text-sm transition-colors cursor-pointer';

function scoreClasses(score) {
  if (score >= 90) return 'bg-emerald-500/15 text-emerald-300';
  if (score >= 75) return 'bg-cyan-500/15 text-cyan-300';
  return 'bg-amber-500/15 text-amber-300';
}

export default function SourcesIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Sources');
  const navigate = useNavigate();

  const filteredSources =
    selectedCategory === 'All Sources'
      ? ENERGY_SOURCES
      : ENERGY_SOURCES.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#000204] text-[#f0f4f1] font-sans selection:bg-emerald-500/20 selection:text-white">
      <Navbar />

      {/* Intro */}
      <section className="relative pt-32 pb-14 px-6 sm:px-12 max-w-[1360px] mx-auto border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src="/energy-media/ai_energy_grid.jpg"
            alt=""
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000204]/90 via-[#000204]/80 to-[#000204]" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-5 leading-tight">
          Renewable energy sources in India
        </h1>

        <p className="max-w-3xl text-base text-slate-300 leading-relaxed mb-10">
          A data center that runs AI workloads can't afford to lose power. This page compares the main clean
          sources in India (solar, wind, hydro, pumped storage and batteries) so you can see what each one costs,
          how reliably it produces, and how they can be combined into round-the-clock clean power contracts.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-lg bg-black/50 border border-white/10">
          <div>
            <span className="block text-sm text-slate-400">Non-fossil capacity</span>
            <span className="block text-2xl font-semibold text-emerald-400 mt-1">190.5+ GW</span>
            <span className="block text-xs text-slate-500 mt-0.5">CEA, 2025</span>
          </div>
          <div>
            <span className="block text-sm text-slate-400">2030 national target</span>
            <span className="block text-2xl font-semibold text-white mt-1">500 GW</span>
            <span className="block text-xs text-slate-500 mt-0.5">Announced at COP26</span>
          </div>
          <div>
            <span className="block text-sm text-slate-400">Round-the-clock tariff</span>
            <span className="block text-2xl font-semibold text-emerald-400 mt-1">₹4.20 to ₹5.40</span>
            <span className="block text-xs text-slate-500 mt-0.5">Solar + wind + storage, per kWh</span>
          </div>
          <div>
            <span className="block text-sm text-slate-400">ISTS charge waiver</span>
            <span className="block text-2xl font-semibold text-white mt-1">100% exempt</span>
            <span className="block text-xs text-slate-500 mt-0.5">Inter-state transmission, before 2028</span>
          </div>
        </div>
      </section>

      {/* Filters and links */}
      <section className="px-6 sm:px-12 max-w-[1360px] mx-auto py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full">
            {ENERGY_SOURCE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={active}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors cursor-pointer ${active
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black/60 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/map" className={btnSecondary}>
              <Globe className="w-4 h-4" />
              Grid map
            </Link>
            <Link to="/dc/profile" className={btnPrimary}>
              Build your data center
            </Link>
          </div>
        </div>

        {/* Source cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="rounded-lg bg-[#070e0a] border border-white/10 flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                <img src={source.image} alt={source.name} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070e0a] via-black/20 to-transparent pointer-events-none" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 text-xs text-slate-200">
                  {source.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/70 text-xs text-slate-200">
                  {source.installedCapacityIndia}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs text-emerald-400">{source.badge}</span>
                <h3 className="text-xl font-semibold text-white mt-0.5">{source.shortName}</h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{source.tagline}</p>

                <div className="grid grid-cols-2 gap-3 my-5 p-3 rounded-md bg-black/50 border border-white/5">
                  <div>
                    <span className="block text-xs text-slate-500">Tariff</span>
                    <span className="block text-sm font-semibold text-emerald-400">{source.tariffInrPerKwh}</span>
                    <span className="block text-xs text-slate-500">{source.tariffUsdPerMwh}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">Capacity factor</span>
                    <span className="block text-sm font-semibold text-white">{source.cufRange}</span>
                    <span className="block text-xs text-slate-500">{source.carbonIntensityGCo2}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400">24/7 match score</span>
                    <span className="text-emerald-400 font-semibold">{source.matchingScore247}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${source.matchingScore247}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-2 mt-auto">
                  <Link to={`/sources/${source.id}`} className={`${btnSecondary} flex-1`}>
                    View details
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => navigate('/dc/profile', { state: { preferredSource: source.id } })}
                    title="Add to my data center"
                    aria-label={`Add ${source.shortName} to my data center`}
                    className="p-2 rounded-md border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-6 sm:px-12 max-w-[1360px] mx-auto py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-6">
          How the sources compare
        </h2>

        <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-5 font-medium">Source</th>
                <th className="py-3 px-4 font-medium">Capacity in India</th>
                <th className="py-3 px-4 font-medium">Tariff (₹/kWh)</th>
                <th className="py-3 px-4 font-medium">Capacity factor</th>
                <th className="py-3 px-4 font-medium">24/7 score</th>
                <th className="py-3 px-4 font-medium">Lifecycle CO₂</th>
                <th className="py-3 px-5">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ENERGY_SOURCES.map((s) => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-5 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: s.accentColor || '#10b981' }}
                      />
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-emerald-400">{s.installedCapacityIndia}</td>
                  <td className="py-3 px-4 text-slate-300">{s.tariffInrPerKwh}</td>
                  <td className="py-3 px-4 text-slate-300">{s.cufRange}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${scoreClasses(s.matchingScore247)}`}>
                      {s.matchingScore247}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{s.carbonIntensityGCo2}</td>
                  <td className="py-3 px-5 text-right">
                    <Link
                      to={`/sources/${s.id}`}
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                    >
                      Details
                      <ArrowUpRight className="w-3.5 h-3.5" />
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

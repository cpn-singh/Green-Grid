import React, { useEffect, useState } from 'react';
import { dcAPI, matchAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/ui';

export default function Results() {
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dcAPI.getProfile().catch(() => ({ data: null })),
      dcAPI.getAnalysis().catch(() => ({ data: null })),
      matchAPI.getMyMatches().catch(() => ({ data: [] })),
    ])
      .then(([pRes, aRes, mRes]) => {
        setProfile(pRes.data);
        setAnalysis(aRes.data);
        setMatches(mRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (matchId, action) => {
    try {
      const res = await matchAPI.actOnMatch(matchId, action);
      setMatches(matches.map((m) => (m.id === matchId ? res.data : m)));
    } catch (err) {
      alert('Failed to update match status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020504] text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono uppercase tracking-wider text-[#94a3b8]">
            Calculating Energy Analysis &amp; Siting Matches...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#020504] text-white flex flex-col items-center justify-center px-4 pt-20">
        <Navbar />
        <Card className="max-w-md text-center p-8">
          <h2 className="text-xl font-bold mb-3 text-white uppercase font-sans">No DC Profile Found</h2>
          <p className="text-xs text-[#94a3b8] mb-6 font-sans">Please submit your data center specifications first.</p>
          <Link to="/dc/profile">
            <Button variant="primary">Configure Profile →</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020504] text-white pt-24 pb-20 px-4 md:px-12">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="mb-2">
              <Badge>AI Siting Analysis Completed</Badge>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white uppercase font-sans">
              {profile.project_name}
            </h1>
            <p className="text-xs md:text-sm text-[#94a3b8] mt-1 font-sans">
              Target Location: <span className="text-white font-medium">{profile.preferred_city}, {profile.preferred_state}</span> • {profile.it_load_mw} MW IT Load • PUE {profile.target_pue}
            </p>
          </div>
          <Link to="/dc/profile">
            <Button variant="outline">
              Edit Specs ⚙️
            </Button>
          </Link>
        </div>

        {/* AI Analytics Metric Cards */}
        {analysis && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-emerald-500/25">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
                Annual Power Demand
              </span>
              <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">
                {analysis.estimated_annual_mwh.toLocaleString()} <span className="text-xs font-normal text-neutral-400">MWh/yr</span>
              </p>
              <span className="text-[11px] text-[#94a3b8] block mt-1">Based on 8,760 annual hours &amp; PUE</span>
            </Card>

            <Card className="p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
                Clean Capacity Needed
              </span>
              <p className="text-2xl font-mono font-bold text-white mt-2">
                {analysis.renewable_needed_mw} <span className="text-xs font-normal text-neutral-400">MW</span>
              </p>
              <span className="text-[11px] text-[#94a3b8] block mt-1">{profile.green_goal_pct}% renewable commitment</span>
            </Card>

            <Card className="p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
                Peak Facility Load
              </span>
              <p className="text-2xl font-mono font-bold text-white mt-2">
                {analysis.peak_demand_mw} <span className="text-xs font-normal text-neutral-400">MW</span>
              </p>
              <span className="text-[11px] text-[#94a3b8] block mt-1">Includes 15% peak head-room safety</span>
            </Card>

            <Card className="p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
                Cooling Power Overhead
              </span>
              <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">
                {analysis.cooling_overhead_pct}%
              </p>
              <span className="text-[11px] text-[#94a3b8] block mt-1">Optimized via {profile.cooling_type} cooling</span>
            </Card>
          </div>
        )}

        {/* AI Location Recommendation Bar */}
        {analysis?.location_scores && Object.keys(analysis.location_scores).length > 0 && (
          <Card className="p-6">
            <h3 className="text-base font-bold text-white uppercase font-sans mb-1">
              Location Hub Feasibility Rankings
            </h3>
            <p className="text-xs text-[#94a3b8] mb-5 font-sans">
              Evaluated against local substation proximity, open-access grid wheeling policies, and clean energy availability.
            </p>
            <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(analysis.location_scores).map(([city, score]) => (
                <div key={city} className="p-3 rounded border border-white/[0.08] bg-black/40 text-center">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] mb-1">{city}</div>
                  <div className={`text-xl font-mono font-bold ${score >= 90 ? 'text-emerald-400' : score >= 80 ? 'text-emerald-300' : 'text-yellow-400'}`}>
                    {score}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Ranked Supplier Matches */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase font-sans">
                Top Ranked Renewable Energy Matches
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5 font-sans">
                Scored across Capacity, Location, RTC Delivery, and Pricing
              </p>
            </div>
            <Link to="/map" className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 hover:underline">
              View on Live Map 🗺️
            </Link>
          </div>

          <div className="space-y-4">
            {matches.map((m) => {
              const sup = m.supplier_profile;
              const ai = m.ai_analysis;
              return (
                <Card key={m.id} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white font-sans">{sup.name}</h3>
                        <span className="sf-cluster-pill active text-[10px]">
                          {sup.category?.toUpperCase()}
                        </span>
                        {m.status !== 'pending' && (
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                            m.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                          }`}>
                            {m.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94a3b8] font-sans">
                        {sup.states_covered?.join(' · ')} • Portfolio: <span className="text-emerald-400 font-mono font-semibold">{sup.capacity_mw} MW</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-emerald-400 leading-tight">{m.match_score}%</div>
                        <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest">Match Score</span>
                      </div>
                      <div className="flex gap-2">
                        {m.status === 'pending' ? (
                          <>
                            <Button
                              onClick={() => handleAction(m.id, 'accept')}
                              variant="primary"
                              className="px-4 py-2 text-xs"
                            >
                              Express Interest
                            </Button>
                            <button
                              onClick={() => handleAction(m.id, 'reject')}
                              className="px-3 py-2 rounded border border-white/15 hover:border-red-500/50 hover:text-red-400 text-white/60 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleAction(m.id, 'negotiate')}
                            variant="outline"
                            className="text-xs"
                          >
                            Open PPA Terms
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Qualitative Match Reasons */}
                  {ai?.match_reasons && (
                    <div className="mt-4 pt-4 border-t border-white/[0.08] grid md:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] block mb-1">
                          Key Match Advantages:
                        </span>
                        <ul className="space-y-1 text-neutral-300 list-disc list-inside">
                          {ai.match_reasons.slice(0, 2).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] block mb-1">
                          Commercial Estimates:
                        </span>
                        <p className="text-neutral-300">
                          Est. Annual Cost: <span className="text-emerald-400 font-mono font-semibold">₹{ai.estimated_annual_cost_inr_cr || '35.5'} Cr</span> • Est. CO₂ Offset:{' '}
                          <span className="text-white font-mono font-medium">{ai.carbon_offset_tons_per_year?.toLocaleString() || '115,000'} tons/yr</span>
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

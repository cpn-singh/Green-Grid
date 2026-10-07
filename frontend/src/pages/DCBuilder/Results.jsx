import React, { useEffect, useState } from 'react';
import { dcAPI, matchAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

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
      <div className="min-h-screen bg-[#0a0f0a] text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-green-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-white/60">Fetching Gemini AI Energy Analysis & Ranked Providers...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] text-white flex flex-col items-center justify-center px-4 pt-20">
        <Navbar />
        <h2 className="text-xl font-bold mb-3">No DC Profile Found</h2>
        <p className="text-sm text-white/50 mb-6">Please submit your data center specifications first.</p>
        <Link to="/dc/profile" className="px-5 py-2.5 rounded-xl bg-green-500 text-black font-bold text-sm glow-green">
          Configure Profile →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white pt-24 pb-20 px-4 md:px-12">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" /> AI Analysis Completed
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{profile.project_name}</h1>
            <p className="text-sm text-white/50 mt-1">
              Target Location: <span className="text-white font-medium">{profile.preferred_city}, {profile.preferred_state}</span> • {profile.it_load_mw} MW IT Load • PUE {profile.target_pue}
            </p>
          </div>
          <Link to="/dc/profile" className="px-4 py-2 rounded-lg border border-white/20 text-xs font-semibold hover:border-green-400 text-white/80">
            Edit Specs ⚙️
          </Link>
        </div>

        {/* AI Analytics Metric Cards */}
        {analysis && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-green-500/20 bg-green-500/5">
              <span className="text-xs text-white/50 font-medium">Annual Power Demand</span>
              <p className="text-2xl font-black text-green-400 mt-2">
                {analysis.estimated_annual_mwh.toLocaleString()} <span className="text-sm font-normal text-white/60">MWh/yr</span>
              </p>
              <span className="text-[11px] text-white/40 block mt-1">Based on 8,760 annual hours & PUE</span>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
              <span className="text-xs text-white/50 font-medium">Clean Capacity Needed</span>
              <p className="text-2xl font-black text-white mt-2">
                {analysis.renewable_needed_mw} <span className="text-sm font-normal text-white/60">MW</span>
              </p>
              <span className="text-[11px] text-white/40 block mt-1">{profile.green_goal_pct}% renewable commitment</span>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
              <span className="text-xs text-white/50 font-medium">Peak Facility Load</span>
              <p className="text-2xl font-black text-white mt-2">
                {analysis.peak_demand_mw} <span className="text-sm font-normal text-white/60">MW</span>
              </p>
              <span className="text-[11px] text-white/40 block mt-1">Includes 15% peak head-room safety</span>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
              <span className="text-xs text-white/50 font-medium">Cooling Power Overhead</span>
              <p className="text-2xl font-black text-white mt-2">
                {analysis.cooling_overhead_pct}%
              </p>
              <span className="text-[11px] text-white/40 block mt-1">Optimized via {profile.cooling_type} cooling</span>
            </div>
          </div>
        )}

        {/* AI Location Recommendation Bar */}
        {analysis?.location_scores && Object.keys(analysis.location_scores).length > 0 && (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
            <h3 className="text-base font-bold text-white mb-2">🧠 Gemini Location Hub Feasibility Rankings</h3>
            <p className="text-xs text-white/50 mb-4">Evaluated against local substation proximity, open-access grid wheeling policies, and clean energy availability.</p>
            <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(analysis.location_scores).map(([city, score]) => (
                <div key={city} className="p-3 rounded-xl border border-white/8 bg-black/40 text-center">
                  <div className="text-xs text-white/60 font-medium mb-1">{city}</div>
                  <div className={`text-xl font-black ${score >= 90 ? 'text-green-400' : score >= 80 ? 'text-emerald-300' : 'text-yellow-400'}`}>
                    {score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ranked Supplier Matches */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Top Ranked Renewable Energy Matches</h2>
              <p className="text-xs text-white/50 mt-0.5">Scored across Capacity, Location, RTC Delivery, and Pricing</p>
            </div>
            <Link to="/map" className="text-xs font-semibold text-green-400 hover:underline">
              View on Live Map 🗺️
            </Link>
          </div>

          <div className="space-y-4">
            {matches.map((m) => {
              const sup = m.supplier_profile;
              const ai = m.ai_analysis;
              return (
                <div key={m.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 card-hover">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{sup.name}</h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-green-500/40 text-green-400">
                          {sup.category?.toUpperCase()}
                        </span>
                        {m.status !== 'pending' && (
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            m.status === 'accepted' ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {m.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60">
                        {sup.states_covered?.join(' · ')} • Portfolio: <span className="text-green-400 font-semibold">{sup.capacity_mw} MW</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-black text-green-400 leading-tight">{m.match_score}%</div>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Match Score</span>
                      </div>
                      <div className="flex gap-2">
                        {m.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleAction(m.id, 'accept')}
                              className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs transition-all glow-green cursor-pointer"
                            >
                              Express Interest
                            </button>
                            <button
                              onClick={() => handleAction(m.id, 'reject')}
                              className="px-3 py-2 rounded-xl border border-white/15 hover:border-red-500/50 hover:text-red-400 text-white/60 text-xs transition-all cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleAction(m.id, 'negotiate')}
                            className="px-4 py-2 rounded-xl border border-green-500/50 text-green-400 text-xs font-bold hover:bg-green-500/10 cursor-pointer"
                          >
                            Open PPA Terms
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Qualitative Match Reasons */}
                  {ai?.match_reasons && (
                    <div className="mt-4 pt-4 border-t border-white/8 grid md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-white/40 block mb-1">Key Match Advantages:</span>
                        <ul className="space-y-1 text-white/80 list-disc list-inside">
                          {ai.match_reasons.slice(0, 2).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-white/40 block mb-1">Commercial Estimates:</span>
                        <p className="text-white/70">
                          Est. Annual Cost: <span className="text-green-400 font-semibold">₹{ai.estimated_annual_cost_inr_cr || '35.5'} Cr</span> • Est. CO₂ Offset:{' '}
                          <span className="text-white font-medium">{ai.carbon_offset_tons_per_year?.toLocaleString() || '115,000'} tons/yr</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

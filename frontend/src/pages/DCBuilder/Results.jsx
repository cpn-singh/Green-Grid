import React, { useEffect, useState } from 'react';
import { dcAPI, matchAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/ui';

// Helper to get the correct URL slug for an energy type
const getSourceSlug = (type) => {
  const s = String(type).toLowerCase();
  if (s.includes('pumped')) return 'pumped-hydro';
  if (s.includes('hydro')) return 'large-hydro';
  if (s.includes('bess') || s.includes('storage')) return 'bess';
  if (s.includes('biomass')) return 'biomass';
  if (s.includes('wind')) return 'wind';
  return 'solar';
};

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
        // Validate responses
        const validProfile = pRes?.data?.project_name ? pRes.data : null;
        const validAnalysis = aRes?.data && typeof aRes.data === 'object' ? aRes.data : null;
        const validMatches = Array.isArray(mRes?.data) ? mRes.data : [];

        setProfile(validProfile);
        setAnalysis(validAnalysis);
        setMatches(validMatches);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data", err);
        setProfile(null);
        setAnalysis(null);
        setMatches([]);
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
      <div className="min-h-screen bg-[#08090a] text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-400">Loading analysis and matches...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#08090a] text-white flex flex-col items-center justify-center px-4 pt-20">
        <Navbar />
        <Card className="max-w-md text-center p-8">
          <h2 className="text-xl font-bold mb-2">No Profile Found</h2>
          <p className="text-sm text-neutral-400 mb-6">Please submit your data center specifications first.</p>
          <Link to="/dc/profile">
            <Button variant="primary">Configure Profile</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090a] text-white pt-24 pb-20 px-4 md:px-12">
      <Navbar />
      
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="mb-2">
              <Badge>Analysis Complete</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {profile.project_name}
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Location: <span className="text-white font-medium">{profile.preferred_city}, {profile.preferred_state}</span> • {profile.it_load_mw} MW IT Load • PUE {profile.target_pue}
            </p>
          </div>
          <Link to="/dc/profile">
            <Button variant="outline">Edit Specs</Button>
          </Link>
        </div>

        {/* Analytics Metrics */}
        {analysis && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-emerald-500/20">
              <span className="text-xs font-medium uppercase text-neutral-400">
                Annual Power Demand
              </span>
              <p className="text-2xl font-bold text-emerald-400 mt-2">
                {analysis.estimated_annual_mwh.toLocaleString()} <span className="text-sm font-normal text-neutral-500">MWh/yr</span>
              </p>
              <span className="text-xs text-neutral-500 block mt-1">Based on 8,760 hours & PUE</span>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-medium uppercase text-neutral-400">
                Clean Capacity Needed
              </span>
              <p className="text-2xl font-bold text-white mt-2">
                {analysis.renewable_needed_mw} <span className="text-sm font-normal text-neutral-500">MW</span>
              </p>
              <span className="text-xs text-neutral-500 block mt-1">{profile.green_goal_pct}% renewable goal</span>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-medium uppercase text-neutral-400">
                Peak Facility Load
              </span>
              <p className="text-2xl font-bold text-white mt-2">
                {analysis.peak_demand_mw} <span className="text-sm font-normal text-neutral-500">MW</span>
              </p>
              <span className="text-xs text-neutral-500 block mt-1">Includes 15% headroom safety</span>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-medium uppercase text-neutral-400">
                Cooling Overhead
              </span>
              <p className="text-2xl font-bold text-emerald-400 mt-2">
                {analysis.cooling_overhead_pct}%
              </p>
              <span className="text-xs text-neutral-500 block mt-1">Based on {profile.cooling_type} cooling</span>
            </Card>
          </div>
        )}

        {/* Location Recommendation */}
        {analysis?.location_scores && Object.keys(analysis.location_scores).length > 0 && (
          <Card className="p-6">
            <h3 className="text-base font-bold mb-1">
              Location Feasibility
            </h3>
            <p className="text-sm text-neutral-400 mb-5">
              Ranked by grid access, policies, and clean energy availability.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(analysis.location_scores).map(([city, score]) => (
                <div key={city} className="p-3 rounded border border-white/10 bg-black/40 text-center">
                  <div className="text-xs font-medium text-neutral-400 mb-1 truncate">{city}</div>
                  <div className={`text-lg font-bold ${score >= 90 ? 'text-emerald-400' : score >= 80 ? 'text-emerald-300' : 'text-yellow-400'}`}>
                    {score}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Matches List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                Top Renewable Energy Matches
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Scored by capacity, location, RTC delivery, and pricing.
              </p>
            </div>
            <Link to="/map" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors hidden sm:block">
              View on Map &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {matches.map((m) => {
              const sup = m.supplier_profile;
              const ai = m.ai_analysis;
              
              return (
                <Card key={m.id} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    
                    {/* Match Details */}
                    <div className="space-y-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="text-lg font-bold text-white">{sup.name}</h3>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                          {sup.category?.toUpperCase()}
                        </span>
                        
                        {m.status !== 'pending' && (
                          <span className={`text-xs uppercase px-2 py-0.5 rounded border ${
                            m.status === 'accepted' 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                          }`}>
                            {m.status}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-neutral-400">
                        {sup.states_covered?.join(' · ')} | Portfolio: <span className="text-emerald-400 font-medium">{sup.capacity_mw} MW</span>
                      </p>
                      
                      {sup.energy_types && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {sup.energy_types.map((et) => (
                            <Link
                              key={et}
                              to={`/sources/${getSourceSlug(et)}`}
                              className="text-xs px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/10 transition-colors"
                            >
                              {et}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Match Score & Actions */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400 leading-none mb-1">{m.match_score}%</div>
                        <span className="text-xs text-neutral-500 uppercase tracking-wide">Match Score</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        {m.status === 'pending' ? (
                          <>
                            <Button
                              onClick={() => handleAction(m.id, 'accept')}
                              variant="primary"
                              className="px-4 py-2 text-sm"
                            >
                              Connect
                            </Button>
                            <button
                              onClick={() => handleAction(m.id, 'reject')}
                              className="px-4 py-2 rounded-md border border-white/10 hover:border-red-500/50 hover:text-red-400 text-neutral-400 text-sm transition-colors"
                            >
                              Dismiss
                            </button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleAction(m.id, 'negotiate')}
                            variant="outline"
                            className="text-sm"
                          >
                            View Terms
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Analysis Details */}
                  {ai?.match_reasons && (
                    <div className="mt-5 pt-5 border-t border-white/10 grid md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <span className="text-xs uppercase text-neutral-500 block mb-2 font-medium">
                          Advantages
                        </span>
                        <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
                          {ai.match_reasons.slice(0, 2).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-neutral-500 block mb-2 font-medium">
                          Commercial Estimates
                        </span>
                        <div className="space-y-1.5 text-neutral-300">
                          <p>
                            Est. Annual Cost: <span className="text-emerald-400 font-medium">₹{ai.estimated_annual_cost_inr_cr || '35.5'} Cr</span>
                          </p>
                          <p>
                            Est. CO₂ Offset: <span className="text-white font-medium">{ai.carbon_offset_tons_per_year?.toLocaleString() || '115,000'} tons/yr</span>
                          </p>
                        </div>
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
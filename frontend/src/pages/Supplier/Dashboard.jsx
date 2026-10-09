import React, { useEffect, useState } from 'react';
import { supplierAPI, matchAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/ui';

const DEMO_SUPPLIER_PROFILE = {
  name: 'Adani Green Energy (AGEL) — Khavda Complex',
  category: 'IPP',
  capacity_mw: 20000.0,
  available_capacity_mw: 4500.0,
  energy_types: ['Solar', 'Wind', 'Hybrid', 'BESS'],
  sourcing_models: ['Physical PPA', 'vPPA', 'Open Access', 'RTC/FDRE'],
  states_covered: ['Gujarat', 'Rajasthan', 'Maharashtra'],
  rtc_availability_pct: 88,
};

const DEMO_MATCHES = [
  {
    id: 'demo-match-1',
    match_score: 96,
    status: 'accepted',
    dc_profile: {
      project_name: 'CtrlS AI Hyperscale Campus DC-1',
      preferred_city: 'Navi Mumbai',
      preferred_state: 'Maharashtra',
      it_load_mw: 150.0,
      tier: 'iv',
    },
  },
  {
    id: 'demo-match-2',
    match_score: 92,
    status: 'negotiating',
    dc_profile: {
      project_name: 'Yotta Data Services — D1 AI Cloud',
      preferred_city: 'Greater Noida',
      preferred_state: 'Uttar Pradesh',
      it_load_mw: 250.0,
      tier: 'iv',
    },
  },
  {
    id: 'demo-match-3',
    match_score: 88,
    status: 'pending',
    dc_profile: {
      project_name: 'NTT Global Data Centers — Hyperscale Campus',
      preferred_city: 'Chennai',
      preferred_state: 'Tamil Nadu',
      it_load_mw: 100.0,
      tier: 'iii',
    },
  },
];

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      supplierAPI.getProfile().catch(() => ({ data: null })),
      matchAPI.getMyMatches().catch(() => ({ data: [] })),
    ])
      .then(([pRes, mRes]) => {
        if (!isMounted) return;
        const validProfile =
          pRes?.data && typeof pRes.data === 'object' && !Array.isArray(pRes.data) && pRes.data.name
            ? pRes.data
            : null;
        const validMatches = Array.isArray(mRes?.data) ? mRes.data : [];

        setProfile(validProfile);
        setMatches(validMatches);
      })
      .catch(() => {
        if (!isMounted) return;
        setProfile(null);
        setMatches([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = async (matchId, action) => {
    try {
      const res = await matchAPI.actOnMatch(matchId, action);
      const updatedMatch = res?.data;
      if (updatedMatch?.id) {
        setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));
      } else {
        setMatches((prev) =>
          prev.map((m) => (m.id === matchId ? { ...m, status: action === 'negotiate' ? 'negotiating' : action } : m))
        );
      }
    } catch (err) {
      // In demo mode or if offline, simulate the action optimistically
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, status: action === 'negotiate' ? 'negotiating' : action } : m))
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020504] text-white flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Active data selection with graceful fallbacks
  const activeProfile = profile || DEMO_SUPPLIER_PROFILE;
  const isPreviewMode = !profile;
  const displayMatches = matches.length > 0 ? matches : (isPreviewMode ? DEMO_MATCHES : []);

  const acceptedCount = displayMatches.filter(
    (m) => m?.status === 'accepted' || m?.status === 'negotiating'
  ).length;

  const avgMatchScore = displayMatches.length
    ? Math.round(displayMatches.reduce((acc, m) => acc + (m?.match_score || 0), 0) / displayMatches.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#020504] text-white pt-24 pb-20 px-4 md:px-12">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Banner if in Preview Mode */}
        {isPreviewMode && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-xs font-semibold text-emerald-300 font-sans">
                  Preview Mode: Showing Sample Renewable Supplier &amp; Matchmaking Leads
                </p>
                <p className="text-[11px] text-[#91a399] font-sans">
                  Sign in or publish your asset specifications to link your real-time generation capacity.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline" className="text-xs !py-1.5 !px-3">
                  Sign In
                </Button>
              </Link>
              <Link to="/supplier/profile">
                <Button variant="primary" className="text-xs !py-1.5 !px-3">
                  Register Asset Specs →
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge>Supplier Portal // Capacity Dashboard</Badge>
              {isPreviewMode && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Demo Preview
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white uppercase font-sans">
              {activeProfile.name || 'Energy Supplier Dashboard'}
            </h1>
            <p className="text-xs md:text-sm text-[#94a3b8] mt-1 font-sans">
              Active Available Capacity:{' '}
              <span className="text-emerald-400 font-mono font-semibold">
                {activeProfile.available_capacity_mw || 0} MW
              </span>{' '}
              • Category:{' '}
              <span className="text-white uppercase font-mono">{activeProfile.category || 'IPP'}</span>
            </p>
          </div>
          <Link to="/supplier/profile">
            <Button variant="outline">Edit Capacity ⚡</Button>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-5 border-emerald-500/25">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
              Inquiries &amp; Matches
            </span>
            <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">{displayMatches.length}</p>
            <span className="text-[11px] text-[#94a3b8] block mt-1 font-sans">Data centers evaluated</span>
          </Card>

          <Card className="p-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
              Accepted Deals
            </span>
            <p className="text-3xl font-mono font-bold text-white mt-2">{acceptedCount}</p>
            <span className="text-[11px] text-[#94a3b8] block mt-1 font-sans">Active buyer discussions</span>
          </Card>

          <Card className="p-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
              Avg Match Score
            </span>
            <p className="text-3xl font-mono font-bold text-emerald-300 mt-2">{avgMatchScore}%</p>
            <span className="text-[11px] text-[#94a3b8] block mt-1 font-sans">Based on Gemini AI scoring</span>
          </Card>
        </div>

        {/* Opportunities List */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase font-sans mb-4">
            Matched Data Center Opportunities
          </h2>
          <div className="space-y-4">
            {displayMatches.length === 0 ? (
              <Card className="p-8 text-center text-[#94a3b8] text-xs font-sans">
                No active DC matches yet. When Data Center builders configure their load specifications in your states, they will appear here.
              </Card>
            ) : (
              displayMatches.map((m) => {
                const dc = m?.dc_profile || {};
                const status = m?.status || 'pending';
                const matchScore = m?.match_score || 0;
                return (
                  <Card key={m?.id || Math.random()} className="p-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white font-sans">
                          {dc.project_name || 'Hyperscale Data Center'}
                        </h3>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                            status === 'accepted'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : status === 'negotiating'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-[#94a3b8] font-sans">
                        Location:{' '}
                        <span className="text-white">
                          {dc.preferred_city || 'India'}, {dc.preferred_state || 'Grid'}
                        </span>{' '}
                        • Required Load:{' '}
                        <span className="text-emerald-400 font-mono font-semibold">{dc.it_load_mw || 0} MW</span> • Tier{' '}
                        {dc.tier ? String(dc.tier).toUpperCase() : 'III'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-emerald-400 leading-tight">
                          {matchScore}%
                        </div>
                        <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest">
                          Compatibility
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction(m.id, 'negotiate')}
                          variant="primary"
                          className="px-4 py-2 text-xs"
                        >
                          Respond to Lead →
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

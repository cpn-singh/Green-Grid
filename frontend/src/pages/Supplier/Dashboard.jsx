import React, { useEffect, useState } from 'react';
import { supplierAPI, matchAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/ui';

const DEMO_SUPPLIER_PROFILE = {
  name: 'Adani Green Energy - Khavda Complex',
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
      project_name: 'CtrlS Campus DC-1',
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
      project_name: 'Yotta Data Services D1',
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
      project_name: 'NTT Global Data Centers',
      preferred_city: 'Chennai',
      preferred_state: 'Tamil Nadu',
      it_load_mw: 100.0,
      tier: 'iii',
    },
  },
];

// Helper for status badge styling
const getStatusStyle = (status) => {
  switch (status) {
    case 'accepted':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'negotiating':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default:
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }
};

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
        
        const validProfile = pRes?.data?.name ? pRes.data : null;
        const validMatches = Array.isArray(mRes?.data) ? mRes.data : [];

        setProfile(validProfile);
        setMatches(validMatches);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
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
      // Optimistic update for demo mode
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, status: action === 'negotiate' ? 'negotiating' : action } : m))
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090a] text-white flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#08090a] text-white pt-20 sm:pt-24 pb-20 px-3 sm:px-6 md:px-12">
      <Navbar />
      
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* Preview Mode Banner */}
        {isPreviewMode && (
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-emerald-400">
                Preview Mode: Showing Sample Data
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Sign in or publish your asset specifications to link your real-time generation capacity.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="outline" className="text-sm px-4 py-2">
                  Sign In
                </Button>
              </Link>
              <Link to="/supplier/profile">
                <Button variant="primary" className="text-sm px-4 py-2">
                  Register Asset
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge>Capacity Dashboard</Badge>
              {isPreviewMode && (
                <span className="text-xs uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Demo
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              {activeProfile.name || 'Energy Supplier Dashboard'}
            </h1>
            <p className="text-sm text-neutral-400">
              Available Capacity:{' '}
              <span className="text-emerald-400 font-medium">
                {activeProfile.available_capacity_mw || 0} MW
              </span>{' '}
              • Category:{' '}
              <span className="text-white uppercase">{activeProfile.category || 'IPP'}</span>
            </p>
          </div>
          <Link to="/supplier/profile">
            <Button variant="outline">Edit Capacity</Button>
          </Link>
        </div>

        {/* Metrics Overview */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-5 border-emerald-500/20">
            <span className="text-xs uppercase font-medium text-neutral-400">
              Total Inquiries
            </span>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{displayMatches.length}</p>
            <span className="text-xs text-neutral-500 block mt-1">Data centers evaluated</span>
          </Card>

          <Card className="p-5">
            <span className="text-xs uppercase font-medium text-neutral-400">
              Active Discussions
            </span>
            <p className="text-3xl font-bold text-white mt-2">{acceptedCount}</p>
            <span className="text-xs text-neutral-500 block mt-1">Accepted matches and negotiations</span>
          </Card>

          <Card className="p-5">
            <span className="text-xs uppercase font-medium text-neutral-400">
              Average Match Score
            </span>
            <p className="text-3xl font-bold text-emerald-300 mt-2">{avgMatchScore}%</p>
            <span className="text-xs text-neutral-500 block mt-1">Overall compatibility rating</span>
          </Card>
        </div>

        {/* Matches List */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-4">
            Data Center Opportunities
          </h2>
          
          <div className="space-y-4">
            {displayMatches.length === 0 ? (
              <Card className="p-8 text-center text-neutral-400 text-sm">
                No active matches yet. When Data Center builders configure their load specifications in your covered states, they will appear here.
              </Card>
            ) : (
              displayMatches.map((m) => {
                const dc = m?.dc_profile || {};
                const status = m?.status || 'pending';
                const matchScore = m?.match_score || 0;
                
                return (
                  <Card key={m?.id || Math.random()} className="p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">
                          {dc.project_name || 'Data Center Project'}
                        </h3>
                        <span className={`text-xs uppercase px-2 py-0.5 rounded border ${getStatusStyle(status)}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400">
                        Location: <span className="text-white">{dc.preferred_city || 'India'}, {dc.preferred_state || 'Grid'}</span>
                        {' '}• Required Load: <span className="text-emerald-400 font-medium">{dc.it_load_mw || 0} MW</span>
                        {' '}• Tier {dc.tier ? String(dc.tier).toUpperCase() : 'III'}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400 leading-none mb-1">
                          {matchScore}%
                        </div>
                        <span className="text-xs text-neutral-500 uppercase">
                          Compatibility
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction(m.id, 'negotiate')}
                          variant="primary"
                          className="px-4 py-2 text-sm font-medium"
                        >
                          Respond
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
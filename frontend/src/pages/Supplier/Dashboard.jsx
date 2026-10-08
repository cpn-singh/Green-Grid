import React, { useEffect, useState } from 'react';
import { supplierAPI, matchAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/ui';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supplierAPI.getProfile().catch(() => ({ data: null })),
      matchAPI.getMyMatches().catch(() => ({ data: [] })),
    ])
      .then(([pRes, mRes]) => {
        setProfile(pRes.data);
        setMatches(mRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (matchId, action) => {
    try {
      const res = await matchAPI.actOnMatch(matchId, action);
      setMatches(matches.map((m) => (m.id === matchId ? res.data : m)));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020504] text-white flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020504] text-white pt-24 pb-20 px-4 md:px-12">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="mb-2">
              <Badge>Supplier Portal // Capacity Dashboard</Badge>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white uppercase font-sans">
              {profile?.name || 'Energy Supplier Dashboard'}
            </h1>
            <p className="text-xs md:text-sm text-[#94a3b8] mt-1 font-sans">
              Active Available Capacity: <span className="text-emerald-400 font-mono font-semibold">{profile?.available_capacity_mw || 0} MW</span> • Category:{' '}
              <span className="text-white uppercase font-mono">{profile?.category || 'IPP'}</span>
            </p>
          </div>
          <Link to="/supplier/profile">
            <Button variant="outline">
              Edit Capacity ⚡
            </Button>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-5 border-emerald-500/25">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
              Inquiries &amp; Matches
            </span>
            <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">{matches.length}</p>
            <span className="text-[11px] text-[#94a3b8] block mt-1 font-sans">Data centers evaluated</span>
          </Card>

          <Card className="p-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
              Accepted Deals
            </span>
            <p className="text-3xl font-mono font-bold text-white mt-2">
              {matches.filter((m) => m.status === 'accepted' || m.status === 'negotiating').length}
            </p>
            <span className="text-[11px] text-[#94a3b8] block mt-1 font-sans">Active buyer discussions</span>
          </Card>

          <Card className="p-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">
              Avg Match Score
            </span>
            <p className="text-3xl font-mono font-bold text-emerald-300 mt-2">
              {matches.length ? Math.round(matches.reduce((acc, m) => acc + m.match_score, 0) / matches.length) : 0}%
            </p>
            <span className="text-[11px] text-[#94a3b8] block mt-1 font-sans">Based on Gemini AI scoring</span>
          </Card>
        </div>

        {/* Opportunities List */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase font-sans mb-4">
            Matched Data Center Opportunities
          </h2>
          <div className="space-y-4">
            {matches.length === 0 ? (
              <Card className="p-8 text-center text-[#94a3b8] text-xs font-sans">
                No active DC matches yet. When Data Center builders configure their load specifications in your states, they will appear here.
              </Card>
            ) : (
              matches.map((m) => {
                const dc = m.dc_profile;
                return (
                  <Card key={m.id} className="p-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white font-sans">{dc.project_name}</h3>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          m.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#94a3b8] font-sans">
                        Location: <span className="text-white">{dc.preferred_city}, {dc.preferred_state}</span> • Required Load:{' '}
                        <span className="text-emerald-400 font-mono font-semibold">{dc.it_load_mw} MW</span> • Tier {dc.tier?.toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-emerald-400 leading-tight">{m.match_score}%</div>
                        <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest">Compatibility</span>
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

import React, { useEffect, useState } from 'react';
import { supplierAPI, matchAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

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
      <div className="min-h-screen bg-[#0a0f0a] text-white flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white pt-24 pb-20 px-4 md:px-12">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Supplier Portal</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">{profile?.name || 'Energy Supplier Dashboard'}</h1>
            <p className="text-sm text-white/50 mt-1">
              Active Available Capacity: <span className="text-green-400 font-semibold">{profile?.available_capacity_mw || 0} MW</span> • Category:{' '}
              <span className="text-white uppercase">{profile?.category || 'IPP'}</span>
            </p>
          </div>
          <Link to="/supplier/profile" className="px-4 py-2 rounded-lg border border-white/20 text-xs font-semibold hover:border-green-400">
            Edit Capacity ⚡
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-green-500/20 bg-green-500/5">
            <span className="text-xs text-white/50 font-medium">Inquiries & Matches</span>
            <p className="text-3xl font-black text-green-400 mt-2">{matches.length}</p>
            <span className="text-[11px] text-white/40 block mt-1">Data centers evaluated</span>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
            <span className="text-xs text-white/50 font-medium">Accepted Deals</span>
            <p className="text-3xl font-black text-white mt-2">
              {matches.filter((m) => m.status === 'accepted' || m.status === 'negotiating').length}
            </p>
            <span className="text-[11px] text-white/40 block mt-1">Active buyer discussions</span>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
            <span className="text-xs text-white/50 font-medium">Avg Match Score</span>
            <p className="text-3xl font-black text-emerald-300 mt-2">
              {matches.length ? Math.round(matches.reduce((acc, m) => acc + m.match_score, 0) / matches.length) : 0}%
            </p>
            <span className="text-[11px] text-white/40 block mt-1">Based on Gemini AI scoring</span>
          </div>
        </div>

        {/* Opportunities List */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-4">Matched Data Center Opportunities</h2>
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-white/3 text-center text-white/50 text-sm">
                No active DC matches yet. When Data Center builders configure their load specifications in your states, they will appear here.
              </div>
            ) : (
              matches.map((m) => {
                const dc = m.dc_profile;
                return (
                  <div key={m.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-4 card-hover">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white">{dc.project_name}</h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          m.status === 'accepted' ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">
                        Location: <span className="text-white">{dc.preferred_city}, {dc.preferred_state}</span> • Required Load:{' '}
                        <span className="text-green-400 font-semibold">{dc.it_load_mw} MW</span> • Tier {dc.tier?.toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-black text-green-400 leading-tight">{m.match_score}%</div>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Compatibility</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(m.id, 'negotiate')}
                          className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs transition-all glow-green cursor-pointer"
                        >
                          Respond to Lead →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

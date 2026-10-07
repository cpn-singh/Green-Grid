import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dcAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function ProfileForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_name: 'Hyperscale Alpha Mumbai',
    preferred_city: 'Mumbai',
    preferred_state: 'Maharashtra',
    tier: 'tier3',
    it_load_mw: 20.0,
    server_types: ['HPC/AI', 'Standard Cloud'],
    cooling_type: 'liquid',
    target_pue: 1.30,
    green_goal_pct: 100,
    sourcing_models: ['Physical PPA', 'RTC/FDRE', 'Open Access'],
    budget_inr_cr: { min: 40, max: 120 },
    launch_timeline: 'Q1 2027',
    latitude: 19.0760,
    longitude: 72.8777,
  });

  const toggleArrayItem = (field, item) => {
    const list = formData[field];
    if (list.includes(item)) {
      setFormData({ ...formData, [field]: list.filter((x) => x !== item) });
    } else {
      setFormData({ ...formData, [field]: [...list, item] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dcAPI.saveProfile(formData);
      navigate('/dc/results');
    } catch (err) {
      alert('Error triggering Gemini AI energy calculations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white pt-24 pb-16 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mb-8">
          <span className="text-xs font-bold text-green-400 tracking-widest uppercase">DC Builder Specification</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">Configure Data Center Clean Energy Profile</h1>
          <p className="text-sm text-white/50 mt-1">
            Gemini AI will analyze your cooling requirements, PUE targets, and IT capacity to output load metrics and score top energy providers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Project / Campus Name</label>
              <input
                type="text"
                required
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Target Location Hub</label>
              <select
                value={formData.preferred_city}
                onChange={(e) => {
                  const city = e.target.value;
                  let state = 'Maharashtra';
                  let lat = 19.0760, lng = 72.8777;
                  if (city === 'Pune') { lat = 18.5204; lng = 73.8567; }
                  else if (city === 'Chennai') { state = 'Tamil Nadu'; lat = 13.0827; lng = 80.2707; }
                  else if (city === 'Bengaluru') { state = 'Karnataka'; lat = 12.9716; lng = 77.5946; }
                  else if (city === 'Hyderabad') { state = 'Telangana'; lat = 17.3850; lng = 78.4867; }
                  else if (city === 'Noida') { state = 'Uttar Pradesh'; lat = 28.5355; lng = 77.3910; }
                  setFormData({ ...formData, preferred_city: city, preferred_state: state, latitude: lat, longitude: lng });
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141b14] border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              >
                <option value="Mumbai">Mumbai (Navi Mumbai / BKC)</option>
                <option value="Pune">Pune (Hinjawadi / Chakan)</option>
                <option value="Chennai">Chennai (Ambattur / Siruseri)</option>
                <option value="Bengaluru">Bengaluru (Whitefield / Electronic City)</option>
                <option value="Hyderabad">Hyderabad (HITEC City / Shamshabad)</option>
                <option value="Noida">Noida (Sector 62 / Greater Noida)</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Total IT Load (MW)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={formData.it_load_mw}
                onChange={(e) => setFormData({ ...formData, it_load_mw: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Target PUE</label>
              <input
                type="number"
                step="0.05"
                min="1.1"
                max="2.0"
                required
                value={formData.target_pue}
                onChange={(e) => setFormData({ ...formData, target_pue: parseFloat(e.target.value) || 1.3 })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Renewable Goal (%)</label>
              <input
                type="number"
                min="10"
                max="100"
                required
                value={formData.green_goal_pct}
                onChange={(e) => setFormData({ ...formData, green_goal_pct: parseInt(e.target.value) || 100 })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Uptime Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141b14] border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              >
                <option value="tier3">Tier III (99.982% uptime, N+1 concurrent)</option>
                <option value="tier4">Tier IV (99.995% uptime, 2N fault-tolerant)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Cooling Architecture</label>
              <select
                value={formData.cooling_type}
                onChange={(e) => setFormData({ ...formData, cooling_type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141b14] border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              >
                <option value="liquid">Direct-to-Chip Liquid / Immersion (AI HPC Optimized)</option>
                <option value="air">Chilled Water / Precision Air Cooling</option>
                <option value="hybrid">Evaporative Hybrid Cooling</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2">Preferred Sourcing Frameworks</label>
            <div className="flex flex-wrap gap-2">
              {['Physical PPA', 'vPPA', 'RTC/FDRE', 'Open Access', 'Group Captive'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => toggleArrayItem('sourcing_models', m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    formData.sourcing_models.includes(m)
                      ? 'border-green-400 bg-green-500/20 text-green-300'
                      : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-base transition-all glow-green cursor-pointer mt-4"
          >
            {loading ? '🧠 Gemini Calculating Energy Analysis & Match Scores...' : '⚡ Run Gemini Energy Analysis & Find Matches →'}
          </button>
        </form>
      </div>
    </div>
  );
}

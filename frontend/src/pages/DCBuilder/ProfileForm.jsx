import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dcAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Card, Badge, Button } from '../../components/ui';

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
    <div className="min-h-screen bg-[#020504] text-white pt-24 pb-16 px-4">
      <Navbar />
      <Card className="max-w-3xl mx-auto p-8 md:p-10">
        <div className="mb-8">
          <Badge>DC Builder Specification // Energy Sizing</Badge>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white uppercase mt-4 mb-2 font-sans">
            Configure Data Center <span className="text-emerald-400">Clean Energy Profile</span>
          </h1>
          <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed font-sans">
            Gemini AI will analyze your cooling requirements, PUE targets, and IT capacity to output load metrics and score top energy providers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Project / Campus Name
              </label>
              <input
                type="text"
                required
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                className="sf-input text-xs"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Target Location Hub
              </label>
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
                className="sf-select text-xs"
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
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Total IT Load (MW)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={formData.it_load_mw}
                onChange={(e) => setFormData({ ...formData, it_load_mw: parseFloat(e.target.value) || 0 })}
                className="sf-input text-xs"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Target PUE
              </label>
              <input
                type="number"
                step="0.05"
                min="1.1"
                max="2.0"
                required
                value={formData.target_pue}
                onChange={(e) => setFormData({ ...formData, target_pue: parseFloat(e.target.value) || 1.3 })}
                className="sf-input text-xs"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Renewable Goal (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                required
                value={formData.green_goal_pct}
                onChange={(e) => setFormData({ ...formData, green_goal_pct: parseInt(e.target.value) || 100 })}
                className="sf-input text-xs"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Uptime Tier
              </label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="sf-select text-xs"
              >
                <option value="tier3">Tier III (99.982% uptime, N+1 concurrent)</option>
                <option value="tier4">Tier IV (99.995% uptime, 2N fault-tolerant)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Cooling Architecture
              </label>
              <select
                value={formData.cooling_type}
                onChange={(e) => setFormData({ ...formData, cooling_type: e.target.value })}
                className="sf-select text-xs"
              >
                <option value="liquid">Direct-to-Chip Liquid / Immersion (AI HPC Optimized)</option>
                <option value="air">Chilled Water / Precision Air Cooling</option>
                <option value="hybrid">Evaporative Hybrid Cooling</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-2.5">
              Preferred Sourcing Frameworks
            </label>
            <div className="flex flex-wrap gap-2">
              {['Physical PPA', 'vPPA', 'RTC/FDRE', 'Open Access', 'Group Captive'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => toggleArrayItem('sourcing_models', m)}
                  className={`sf-cluster-pill ${formData.sourcing_models.includes(m) ? 'active' : ''}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-4 text-xs font-mono uppercase tracking-wider mt-4"
          >
            {loading ? '🧠 Calculating Energy Analysis...' : '⚡ Run Energy Analysis & Find Matches →'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

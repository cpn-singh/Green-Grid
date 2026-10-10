import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { dcAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Card, Badge, Button } from '../../components/ui';
import { ENERGY_SOURCES } from '../../data/energySourcesData';

export default function ProfileForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    project_name: 'Mumbai DC-1',
    preferred_city: 'Mumbai',
    preferred_state: 'Maharashtra',
    tier: 'tier3',
    it_load_mw: 20.0,
    server_types: ['HPC/AI', 'Standard Cloud'],
    cooling_type: 'liquid',
    target_pue: 1.30,
    green_goal_pct: 100,
    sourcing_models: ['Physical PPA', 'RTC/FDRE', 'Open Access'],
    preferred_energy_sources: ['solar', 'wind', 'pumped-hydro', 'bess'],
    budget_inr_cr: { min: 40, max: 120 },
    launch_timeline: 'Q1 2027',
    latitude: 19.0760,
    longitude: 72.8777,
  });

  useEffect(() => {
    if (location.state?.preferredSource) {
      const srcId = location.state.preferredSource;
      if (!formData.preferred_energy_sources.includes(srcId)) {
        setFormData(prev => ({
          ...prev,
          preferred_energy_sources: [...prev.preferred_energy_sources, srcId]
        }));
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value
    }));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    
    // Map cities to their coordinates and state
    const locationMap = {
      'Mumbai': { state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
      'Pune': { state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
      'Chennai': { state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
      'Bengaluru': { state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
      'Hyderabad': { state: 'Telangana', lat: 17.3850, lng: 78.4867 },
      'Noida': { state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 }
    };
    
    const loc = locationMap[city] || locationMap['Mumbai'];
    
    setFormData(prev => ({
      ...prev,
      preferred_city: city,
      preferred_state: loc.state,
      latitude: loc.lat,
      longitude: loc.lng
    }));
  };

  const toggleArrayItem = (field, item) => {
    const list = formData[field];
    setFormData(prev => ({
      ...prev,
      [field]: list.includes(item) 
        ? list.filter((x) => x !== item) 
        : [...list, item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dcAPI.saveProfile(formData);
      navigate('/dc/results');
    } catch (err) {
      alert('Failed to save profile and calculate matches.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white pt-24 pb-16 px-4">
      <Navbar />
      <Card className="max-w-3xl mx-auto p-6 md:p-10">
        <div className="mb-8">
          <Badge>Energy Sizing Profile</Badge>
          <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
            Configure Data Center Energy Profile
          </h1>
          <p className="text-sm text-neutral-400">
            Configure your IT capacity, PUE targets, and cooling requirements to find optimal energy suppliers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-neutral-400 mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                name="project_name"
                required
                value={formData.project_name}
                onChange={handleChange}
                className="sf-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1.5">
                Target Location Hub
              </label>
              <select
                name="preferred_city"
                value={formData.preferred_city}
                onChange={handleCityChange}
                className="sf-select w-full text-sm"
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
              <label className="block text-sm text-neutral-400 mb-1.5">
                Total IT Load (MW)
              </label>
              <input
                type="number"
                name="it_load_mw"
                step="0.5"
                min="1"
                required
                value={formData.it_load_mw}
                onChange={handleChange}
                className="sf-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1.5">
                Target PUE
              </label>
              <input
                type="number"
                name="target_pue"
                step="0.01"
                min="1.0"
                max="2.0"
                required
                value={formData.target_pue}
                onChange={handleChange}
                className="sf-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1.5">
                Renewable Goal (%)
              </label>
              <input
                type="number"
                name="green_goal_pct"
                min="10"
                max="100"
                required
                value={formData.green_goal_pct}
                onChange={handleChange}
                className="sf-input w-full text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-neutral-400 mb-1.5">
                Uptime Tier
              </label>
              <select
                name="tier"
                value={formData.tier}
                onChange={handleChange}
                className="sf-select w-full text-sm"
              >
                <option value="tier3">Tier III (99.982% uptime, N+1)</option>
                <option value="tier4">Tier IV (99.995% uptime, 2N)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1.5">
                Cooling Architecture
              </label>
              <select
                name="cooling_type"
                value={formData.cooling_type}
                onChange={handleChange}
                className="sf-select w-full text-sm"
              >
                <option value="liquid">Direct-to-Chip Liquid / Immersion</option>
                <option value="air">Chilled Water / Precision Air</option>
                <option value="hybrid">Evaporative Hybrid Cooling</option>
              </select>
            </div>
          </div>

          {/* Renewable Generation Mix Preference */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="block text-sm text-neutral-400">
                Renewable Generation Portfolio Mix
              </label>
              <Link to="/sources" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                Explore All Sources &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ENERGY_SOURCES.map((src) => {
                const isSelected = formData.preferred_energy_sources.includes(src.id);
                return (
                  <div
                    key={src.id}
                    onClick={() => toggleArrayItem('preferred_energy_sources', src.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center gap-3 overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-black/50 border-white/10 text-neutral-400 hover:border-emerald-500/30'
                    }`}
                  >
                    <img
                      src={src.image}
                      alt={src.shortName}
                      className="w-8 h-8 rounded shrink-0 border border-white/10 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium truncate text-white">
                          {src.shortName}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <span className="block text-xs text-neutral-500 truncate">
                        {src.tariffInrPerKwh} | {src.cufRange}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2.5">
              Preferred Sourcing Frameworks
            </label>
            <div className="flex flex-wrap gap-2">
              {['Physical PPA', 'vPPA', 'RTC/FDRE', 'Open Access', 'Group Captive'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => toggleArrayItem('sourcing_models', m)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    formData.sourcing_models.includes(m) 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
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
            className="w-full py-3 mt-6 font-medium text-sm"
          >
            {loading ? 'Calculating Matches...' : 'Run Analysis & Find Matches'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
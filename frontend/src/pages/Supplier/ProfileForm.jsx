import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function SupplierProfileForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'CleanMax Solar & Wind IPP',
    category: 'ipp',
    capacity_mw: 2500.0,
    available_capacity_mw: 600.0,
    energy_types: ['Solar', 'Wind', 'BESS'],
    sourcing_models: ['Physical PPA', 'Open Access', 'RTC/FDRE'],
    states_covered: ['Maharashtra', 'Gujarat', 'Tamil Nadu'],
    min_contract_years: 10,
    price_per_unit_inr: { min: 4.1, max: 4.9 },
    rtc_availability_pct: 82,
    website: 'https://cleanmax.com',
    latitude: 19.0178,
    longitude: 72.8478,
    description: 'Leading provider of round-the-clock green energy solutions for hyperscalers and industrial data centers.',
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
      await supplierAPI.saveProfile(formData);
      navigate('/supplier/dashboard');
    } catch (err) {
      alert('Failed to save supplier profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white pt-24 pb-16 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mb-8">
          <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Energy Supplier Listing</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">Register Clean Energy Capacity</h1>
          <p className="text-sm text-white/50 mt-1">
            Publish your available solar, wind, hydro, and battery capacity to match with incoming hyperscale data centers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Company / Entity Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Supplier Classification</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141b14] border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              >
                <option value="ipp">Utility Hyperscale IPP (Gigawatt parks)</option>
                <option value="ci">Commercial & Industrial (C&I) Specialist</option>
                <option value="epc">EPC & Turnkey Contractor</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Total Portfolio (MW)</label>
              <input
                type="number"
                required
                value={formData.capacity_mw}
                onChange={(e) => setFormData({ ...formData, capacity_mw: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Available for PPA (MW)</label>
              <input
                type="number"
                required
                value={formData.available_capacity_mw}
                onChange={(e) => setFormData({ ...formData, available_capacity_mw: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">RTC Firm Availability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={formData.rtc_availability_pct}
                onChange={(e) => setFormData({ ...formData, rtc_availability_pct: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2">Energy Types Offered</label>
            <div className="flex flex-wrap gap-2">
              {['Solar', 'Wind', 'Hybrid', 'BESS', 'Pumped Hydro', 'Green Hydrogen'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleArrayItem('energy_types', t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    formData.energy_types.includes(t)
                      ? 'border-green-400 bg-green-500/20 text-green-300'
                      : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2">Supported Contracting Frameworks</label>
            <div className="flex flex-wrap gap-2">
              {['Physical PPA', 'vPPA', 'RTC/FDRE', 'Open Access', 'Group Captive', 'Green Tariff'].map((m) => (
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

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">Description & Track Record</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-green-400 focus:outline-none"
              placeholder="Past corporate PPAs, major park locations, dispatch reliability..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold text-base transition-all glow-green cursor-pointer mt-4"
          >
            {loading ? 'Publishing Supplier Profile...' : '⚡ Publish Capacity to Match Engine →'}
          </button>
        </form>
      </div>
    </div>
  );
}

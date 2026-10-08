import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Card, Badge, Button } from '../../components/ui';

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
    <div className="min-h-screen bg-[#020504] text-white pt-24 pb-16 px-4">
      <Navbar />
      <Card className="max-w-3xl mx-auto p-8 md:p-10">
        <div className="mb-8">
          <Badge>Energy Supplier Listing // Asset Specs</Badge>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white uppercase mt-4 mb-2 font-sans">
            Register Clean Energy <span className="text-emerald-400">Capacity</span>
          </h1>
          <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed font-sans">
            Publish your available solar, wind, hydro, and battery capacity to match with incoming hyperscale data centers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Company / Entity Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="sf-input text-xs"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Supplier Classification
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="sf-select text-xs"
              >
                <option value="ipp">Utility Hyperscale IPP (Gigawatt parks)</option>
                <option value="ci">Commercial & Industrial (C&I) Specialist</option>
                <option value="epc">EPC & Turnkey Contractor</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Total Portfolio (MW)
              </label>
              <input
                type="number"
                required
                value={formData.capacity_mw}
                onChange={(e) => setFormData({ ...formData, capacity_mw: parseFloat(e.target.value) || 0 })}
                className="sf-input text-xs"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                Available for PPA (MW)
              </label>
              <input
                type="number"
                required
                value={formData.available_capacity_mw}
                onChange={(e) => setFormData({ ...formData, available_capacity_mw: parseFloat(e.target.value) || 0 })}
                className="sf-input text-xs"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
                RTC Firm Availability (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={formData.rtc_availability_pct}
                onChange={(e) => setFormData({ ...formData, rtc_availability_pct: parseInt(e.target.value) || 0 })}
                className="sf-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-2.5">
              Energy Types Offered
            </label>
            <div className="flex flex-wrap gap-2">
              {['Solar', 'Wind', 'Hybrid', 'BESS', 'Pumped Hydro', 'Green Hydrogen'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleArrayItem('energy_types', t)}
                  className={`sf-cluster-pill ${formData.energy_types.includes(t) ? 'active' : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-2.5">
              Supported Contracting Frameworks
            </label>
            <div className="flex flex-wrap gap-2">
              {['Physical PPA', 'vPPA', 'RTC/FDRE', 'Open Access', 'Group Captive', 'Green Tariff'].map((m) => (
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

          <div>
            <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
              Description &amp; Track Record
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="sf-input text-xs"
              placeholder="Past corporate PPAs, major park locations, dispatch reliability..."
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-4 text-xs font-mono uppercase tracking-wider mt-4"
          >
            {loading ? 'Publishing Supplier Profile...' : '⚡ Publish Capacity to Match Engine →'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

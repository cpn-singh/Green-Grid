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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value
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
      await supplierAPI.saveProfile(formData);
      navigate('/supplier/dashboard');
    } catch (err) {
      alert('Failed to save supplier profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white pt-24 pb-16 px-4">
      <Navbar />
      
      <Card className="max-w-3xl mx-auto p-6 md:p-10">
        <div className="mb-8">
          <Badge>Asset Specifications</Badge>
          <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
            Register Clean Energy Capacity
          </h1>
          <p className="text-sm text-neutral-400">
            Publish your available solar, wind, hydro, and battery capacity to match with incoming data centers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="name">
                Company / Entity Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="sf-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="category">
                Supplier Classification
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="sf-select w-full text-sm"
              >
                <option value="ipp">Utility Hyperscale IPP (Gigawatt parks)</option>
                <option value="ci">Commercial & Industrial (C&I) Specialist</option>
                <option value="epc">EPC & Turnkey Contractor</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="capacity_mw">
                Total Portfolio (MW)
              </label>
              <input
                id="capacity_mw"
                name="capacity_mw"
                type="number"
                required
                value={formData.capacity_mw}
                onChange={handleChange}
                className="sf-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="available_capacity_mw">
                Available for PPA (MW)
              </label>
              <input
                id="available_capacity_mw"
                name="available_capacity_mw"
                type="number"
                required
                value={formData.available_capacity_mw}
                onChange={handleChange}
                className="sf-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="rtc_availability_pct">
                RTC Firm Availability (%)
              </label>
              <input
                id="rtc_availability_pct"
                name="rtc_availability_pct"
                type="number"
                min="0"
                max="100"
                required
                value={formData.rtc_availability_pct}
                onChange={handleChange}
                className="sf-input w-full text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2.5">
              Energy Types Offered
            </label>
            <div className="flex flex-wrap gap-2">
              {['Solar', 'Wind', 'Hybrid', 'BESS', 'Pumped Hydro', 'Green Hydrogen'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleArrayItem('energy_types', t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    formData.energy_types.includes(t) 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2.5">
              Supported Contracting Frameworks
            </label>
            <div className="flex flex-wrap gap-2">
              {['Physical PPA', 'vPPA', 'RTC/FDRE', 'Open Access', 'Group Captive', 'Green Tariff'].map((m) => (
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

          <div>
            <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="description">
              Description & Track Record
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="sf-input w-full text-sm"
              placeholder="Past corporate PPAs, major park locations, dispatch reliability..."
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3 mt-6 font-medium text-sm"
          >
            {loading ? 'Publishing Profile...' : 'Publish Capacity'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
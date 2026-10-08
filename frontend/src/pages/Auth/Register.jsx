import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Card, Badge, Button } from '../../components/ui';

export default function Register() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'dc_builder';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: defaultRole,
    company_name: '',
    contact_phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(formData);
      if (data.user.role === 'dc_builder') {
        navigate('/dc/profile');
      } else {
        navigate('/supplier/profile');
      }
    } catch (err) {
      setError(err.response?.data?.username?.[0] || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020504] text-white flex flex-col justify-center items-center px-4 pt-24 pb-12">
      <Navbar />
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <Badge>Institutional Onboarding</Badge>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-center mb-1 text-white uppercase font-sans">
          Create Enterprise Account
        </h2>
        <p className="text-xs text-[#94a3b8] text-center mb-6 font-sans">
          Select your primary role to configure your portal
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <div className="flex rounded border border-white/[0.08] p-1 mb-6 bg-black/60 gap-1.5">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'dc_builder' })}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
              formData.role === 'dc_builder'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            🏗️ DC Builder
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'energy_supplier' })}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
              formData.role === 'energy_supplier'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            ⚡ Energy Supplier
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
              Company / Organization
            </label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="sf-input text-xs"
              placeholder="e.g. Sify Cloud or Avaada Energy"
            />
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="sf-input text-xs"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
              Business Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="sf-input text-xs"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[11px] text-[#94a3b8] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="sf-input text-xs"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3 mt-3"
          >
            {loading ? 'Creating Account...' : 'Continue to Specifications →'}
          </Button>
        </form>

        <p className="text-center text-xs text-[#64748b] mt-6 font-mono">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}

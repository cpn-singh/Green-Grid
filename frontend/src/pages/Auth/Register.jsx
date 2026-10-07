import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

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
    <div className="min-h-screen bg-[#0a0f0a] text-white flex flex-col justify-center items-center px-4 pt-24 pb-12">
      <Navbar />
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400/90">Institutional Onboarding</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-center mb-1 text-white">Create Enterprise Account</h2>
        <p className="text-sm text-white/50 text-center mb-6">Select your primary role to configure your portal</p>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

        <div className="flex rounded-xl border border-white/10 p-1 mb-6 bg-black/40">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'dc_builder' })}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              formData.role === 'dc_builder' ? 'bg-green-500 text-black glow-green' : 'text-white/60 hover:text-white'
            }`}
          >
            🏗️ DC Builder
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'energy_supplier' })}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              formData.role === 'energy_supplier' ? 'bg-green-500 text-black glow-green' : 'text-white/60 hover:text-white'
            }`}
          >
            ⚡ Energy Supplier
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Company / Organization</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-400"
              placeholder="e.g. Sify Cloud or Avaada Energy"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-400"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Business Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-400"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm transition-all glow-green cursor-pointer mt-2"
          >
            {loading ? 'Creating Account...' : 'Continue to Specifications →'}
          </button>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

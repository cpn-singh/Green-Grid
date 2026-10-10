import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Card, Button } from '../../components/ui';

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
      // Handles typical Django Rest Framework error arrays
      setError(err.response?.data?.username?.[0] || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const setRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col justify-center items-center px-4 pt-24 pb-12">
      <Navbar />
      
      <Card className="w-full max-w-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-sm text-neutral-400 text-center mb-6">
          Select your role and enter your details to get started
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Role Selection Toggle */}
        <div className="flex rounded-lg border border-white/10 p-1 mb-6 bg-black/50 gap-1">
          <button
            type="button"
            onClick={() => setRole('dc_builder')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              formData.role === 'dc_builder'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            DC Builder
          </button>
          <button
            type="button"
            onClick={() => setRole('energy_supplier')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              formData.role === 'energy_supplier'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Energy Supplier
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="company_name">
              Company / Organization
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              required
              value={formData.company_name}
              onChange={handleChange}
              className="sf-input w-full text-sm"
              placeholder="e.g. Sify Cloud or Avaada Energy"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="sf-input w-full text-sm"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="email">
              Business Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="sf-input w-full text-sm"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="sf-input w-full text-sm"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-2.5 mt-2 font-medium"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-500 hover:text-emerald-400 transition-colors">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}
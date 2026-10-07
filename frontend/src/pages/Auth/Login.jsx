import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(formData.username, formData.password);
      if (data.user.role === 'dc_builder') {
        navigate('/dc/results');
      } else {
        navigate('/supplier/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white flex flex-col justify-center items-center px-4 pt-20">
      <Navbar />
      <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400/90">GreenGrid Access</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-center mb-1 text-white">Welcome Back</h2>
        <p className="text-xs text-white/50 text-center mb-6">Enter your institutional credentials</p>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Card, Badge, Button } from '../../components/ui';

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
    <div className="min-h-screen bg-[#020504] text-white flex flex-col justify-center items-center px-4 pt-20">
      <Navbar />
      <Card className="w-full max-w-sm p-8">
        <div className="flex justify-center mb-6">
          <Badge>Institutional Access</Badge>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-center mb-1 text-white uppercase font-sans">
          Welcome Back
        </h2>
        <p className="text-xs text-[#94a3b8] text-center mb-6 font-sans">
          Enter your institutional credentials
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
            {loading ? 'Signing in...' : 'Sign In →'}
          </Button>
        </form>

        <p className="text-center text-xs text-[#64748b] mt-6 font-mono">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 underline">
            Register now
          </Link>
        </p>
      </Card>
    </div>
  );
}

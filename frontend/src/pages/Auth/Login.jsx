import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Card, Button } from '../../components/ui';

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
      
      // Route users based on their role
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col justify-center items-center px-4 pt-16">
      <Navbar />
      
      <Card className="w-full max-w-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-neutral-400 text-center mb-6">
          Sign in to your account
        </p>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter username"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-500 hover:text-emerald-400 transition-colors">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ visible = true }) {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isVisible = visible || scrolled;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-3.5 transition-all duration-700 ease-out ${
        scrolled
          ? 'bg-[#020504]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent'
      } ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-8 pointer-events-none'
      }`}
      style={{
        transitionProperty: 'opacity, transform, background-color, border-color, backdrop-filter',
        transitionDelay: isVisible ? '150ms' : '0ms'
      }}
    >
      <div className="flex items-center gap-3">
        <Link to="/" className="text-base sm:text-lg font-bold tracking-tight text-white group flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-emerald-500 via-emerald-300 to-white/40 shadow-[0_0_12px_rgba(16,185,129,0.5)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 transform-gpu [perspective:600px]">
            <img
              src="/logo.png"
              alt="GreenGrid"
              className="w-full h-full object-cover rounded-full select-none"
            />
          </div>
          <span className="font-bold tracking-[-0.02em] text-white uppercase text-sm sm:text-base">
            GreenGrid <span className="text-emerald-400 font-mono text-xs font-medium tracking-normal">(AGI)</span>
          </span>
        </Link>
      </div>

      <ul className="hidden md:flex items-center gap-7 text-[11px] font-mono tracking-wider uppercase text-neutral-300">
        <li>
          <Link to="/" className="hover:text-emerald-400 transition-colors">Platform</Link>
        </li>
        <li>
          <a href="/#simulator" className="hover:text-emerald-400 transition-colors">Simulator</a>
        </li>
        <li>
          <a href="/#providers" className="hover:text-emerald-400 transition-colors">Providers</a>
        </li>
        <li>
          <Link to="/map" className="hover:text-emerald-400 transition-colors">Geospatial Map</Link>
        </li>
        <li>
          <a href="/#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
        </li>
        {user?.role === 'dc_builder' && (
          <>
            <li>
              <Link to="/dc/profile" className="hover:text-emerald-400 transition-colors">Facility Specs</Link>
            </li>
            <li>
              <Link to="/dc/results" className="hover:text-emerald-400 transition-colors">Clean Matches</Link>
            </li>
          </>
        )}
        {user?.role === 'energy_supplier' && (
          <>
            <li>
              <Link to="/supplier/profile" className="hover:text-emerald-400 transition-colors">Asset Specs</Link>
            </li>
            <li>
              <Link to="/supplier/dashboard" className="hover:text-emerald-400 transition-colors">Inquiries</Link>
            </li>
          </>
        )}
      </ul>

      <div className="flex items-center gap-3.5">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 hidden sm:inline font-mono">
              {user.company_name || user.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded bg-white/[0.03] border border-white/15 hover:border-red-500/40 hover:text-red-300 transition-all text-neutral-300 cursor-pointer font-mono uppercase tracking-wider"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-xs font-mono tracking-wider uppercase text-neutral-300 hover:text-white transition-colors px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="sf-btn text-xs px-4 py-2 rounded cursor-pointer"
            >
              Get Started →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

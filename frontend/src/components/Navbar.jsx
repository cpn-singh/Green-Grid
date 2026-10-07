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
        scrolled ? 'bg-[#090b0e]/85 backdrop-blur-xl border-b border-white/[0.07] shadow-xl shadow-black/40' : 'bg-transparent'
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
        <Link to="/" className="text-lg font-bold tracking-tight text-white group">
          <span className="font-semibold tracking-[-0.02em] text-white">Green<span className="text-emerald-400 font-normal">Grid</span></span>
        </Link>
      </div>

      <ul className="hidden md:flex items-center gap-7 text-[13px] font-medium text-neutral-300">
        <li><Link to="/" className="hover:text-emerald-400 transition-colors">Platform</Link></li>
        <li><a href="/#simulator" className="hover:text-emerald-400 transition-colors">Simulator</a></li>
        <li><a href="/#providers" className="hover:text-emerald-400 transition-colors">Providers</a></li>
        <li><Link to="/map" className="hover:text-emerald-400 transition-colors">Geospatial Map</Link></li>
        <li><a href="/#contact" className="hover:text-emerald-400 transition-colors">Contact</a></li>
        {user?.role === 'dc_builder' && (
          <>
            <li><Link to="/dc/profile" className="hover:text-emerald-400 transition-colors">Facility Specs</Link></li>
            <li><Link to="/dc/results" className="hover:text-emerald-400 transition-colors">Clean Matches</Link></li>
          </>
        )}
        {user?.role === 'energy_supplier' && (
          <>
            <li><Link to="/supplier/profile" className="hover:text-emerald-400 transition-colors">Asset Specs</Link></li>
            <li><Link to="/supplier/dashboard" className="hover:text-emerald-400 transition-colors">Inquiries</Link></li>
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
              className="text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:border-red-500/40 hover:text-red-300 transition-all text-neutral-300 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-xs font-medium text-neutral-300 hover:text-white transition-colors px-2 py-1">
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-neutral-950 transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_25px_rgba(52,211,153,0.35)] cursor-pointer"
            >
              Get Started →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

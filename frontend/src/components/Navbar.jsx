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
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-3.5 transition-all duration-700 ease-out ${
        scrolled
          ? 'bg-[#080b09]/92 backdrop-blur-md border-b border-[#19241d] shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
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
        <Link to="/" className="text-base sm:text-lg font-bold tracking-tight text-[#f0f4f1] group flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-[#22c55e] via-[#34d399] to-white/40 shadow-[0_0_12px_rgba(34,197,94,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 transform-gpu [perspective:600px]">
            <img
              src="/logo.png"
              alt="GreenGrid"
              className="w-full h-full object-cover rounded-full select-none"
            />
          </div>
          <span className="font-bold font-display uppercase tracking-[-0.02em] text-[#f0f4f1] text-sm sm:text-base">
            GreenGrid
          </span>
        </Link>
      </div>

      <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-mono tracking-wider uppercase text-[#6b7c72]">
        <li>
          <a href="#sizing" className="hover:text-[#22c55e] transition-colors">Dispatch Sizing</a>
        </li>
        <li>
          <a href="#indian-dcs" className="hover:text-[#22c55e] transition-colors">Indian AI DCs</a>
        </li>
        <li>
          <a href="#suppliers" className="hover:text-[#22c55e] transition-colors">Suppliers</a>
        </li>
        <li>
          <Link to="/map" className="hover:text-[#22c55e] transition-colors">National Radar</Link>
        </li>
        <li>
          <a href="#inquiry" className="hover:text-[#22c55e] transition-colors">Offtake Desk</a>
        </li>
        {user?.role === 'dc_builder' && (
          <>
            <li>
              <Link to="/dc/profile" className="hover:text-[#22c55e] transition-colors">Facility Specs</Link>
            </li>
            <li>
              <Link to="/dc/results" className="hover:text-[#22c55e] transition-colors">Clean Matches</Link>
            </li>
          </>
        )}
        {user?.role === 'energy_supplier' && (
          <>
            <li>
              <Link to="/supplier/profile" className="hover:text-[#22c55e] transition-colors">Asset Specs</Link>
            </li>
            <li>
              <Link to="/supplier/dashboard" className="hover:text-[#22c55e] transition-colors">Inquiries</Link>
            </li>
          </>
        )}
      </ul>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6b7c72] hidden sm:inline font-mono">
              {user.company_name || user.username}
            </span>
            <button
              onClick={handleLogout}
              className="btn-busbar !py-1.5 !px-3 !text-[11px]"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-[11px] font-mono tracking-wider uppercase text-[#6b7c72] hover:text-[#f0f4f1] transition-colors px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-signal !py-1.5 !px-3.5 !text-[11px]"
            >
              Get Started →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

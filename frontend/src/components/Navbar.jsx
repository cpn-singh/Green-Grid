import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ visible = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle scroll state for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isVisible = visible || scrolled;

  const navClasses = `
    fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300
    ${scrolled ? 'bg-[#080b09]/95 backdrop-blur-md border-b border-[#19241d] shadow-lg' : 'bg-transparent'}
    ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
  `;

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={navClasses}>
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            state={{ toLogo: true }}
            onClick={handleLogoClick}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-green-500 to-white/40 shadow-md group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="GreenGrid Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-bold uppercase text-[#f0f4f1] text-sm md:text-base tracking-wide">
              GreenGrid
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-7 text-xs font-mono uppercase text-[#91a399]">
          <li>
            <Link to="/map" className="hover:text-green-500 transition-colors">National Radar</Link>
          </li>
          <li>
            <Link to="/simulator" className="hover:text-green-500 transition-colors">Grid Simulator</Link>
          </li>
          <li>
            <Link to="/dc/profile" className="hover:text-green-500 transition-colors">DC Sizing</Link>
          </li>
          <li>
            <Link to="/dc/results" className="hover:text-green-500 transition-colors">Clean Matches</Link>
          </li>
          <li>
            <Link to="/supplier/dashboard" className="hover:text-green-500 transition-colors">Suppliers</Link>
          </li>

          {user?.role === 'energy_supplier' && (
            <li>
              <Link to="/supplier/profile" className="hover:text-green-500 transition-colors">Asset Specs</Link>
            </li>
          )}
        </ul>

        {/* Auth / User Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#91a399] hidden sm:block font-mono">
                {user.company_name || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="btn-busbar px-3 py-1.5 text-xs"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-xs font-mono uppercase text-[#91a399] hover:text-white transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-signal px-3.5 py-1.5 text-xs"
              >
                Get Started &rarr;
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-xs font-mono"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[60px] z-40 bg-[#080b09]/98 border-b border-[#19241d] p-5 backdrop-blur-xl md:hidden shadow-2xl animate-fadeIn">
          <ul className="flex flex-col gap-4 text-xs font-mono uppercase text-[#91a399]">
            <li>
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-green-500 transition-colors block py-1"
              >
                National Radar
              </Link>
            </li>
            <li>
              <Link
                to="/simulator"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-green-500 transition-colors block py-1"
              >
                Grid Simulator
              </Link>
            </li>
            <li>
              <Link
                to="/dc/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-green-500 transition-colors block py-1"
              >
                DC Sizing Profile
              </Link>
            </li>
            <li>
              <Link
                to="/dc/results"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-green-500 transition-colors block py-1"
              >
                Clean Matches
              </Link>
            </li>
            <li>
              <Link
                to="/supplier/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-green-500 transition-colors block py-1"
              >
                Suppliers Dashboard
              </Link>
            </li>
            {user?.role === 'energy_supplier' && (
              <li>
                <Link
                  to="/supplier/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-green-500 transition-colors block py-1"
                >
                  Asset Specs
                </Link>
              </li>
            )}
            {!user && (
              <li className="pt-2 border-t border-white/10">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-white transition-colors block py-1"
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
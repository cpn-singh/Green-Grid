import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Radio,
  Sliders,
  Cpu,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Sun,
  LogIn,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Navbar({ visible = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll state for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change or ESC
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isVisible = visible || scrolled;

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Radar Map', path: '/map', icon: Radio },
    { name: 'Grid Sim', path: '/simulator', icon: Sliders },
    { name: 'DC Sizing', path: '/dc/profile', icon: Cpu },
    { name: 'Matches', path: '/dc/results', icon: ShieldCheck },
    { name: 'Suppliers', path: '/supplier/dashboard', icon: Building2 },
    { name: 'Clean Sources', path: '/sources', icon: Sun },
    ...(user?.role === 'energy_supplier'
      ? [{ name: 'Asset Specs', path: '/supplier/profile', icon: FileSpreadsheet }]
      : [])
  ];

  return (
    <>
      <nav
        aria-label="Main Navigation"
        className={`fixed top-0 inset-x-0 w-full z-[3050] transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-[#080b09]/95 backdrop-blur-md border-b border-[#19241d] shadow-2xl py-3'
            : 'bg-gradient-to-b from-[#080b09]/90 via-[#080b09]/50 to-transparent py-4'
        } ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand / Logo */}
          <Link
            to="/"
            state={{ toLogo: true }}
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none"
            aria-label="SYLVRA Home"
          >
            <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-white/40 shadow-md group-hover:scale-105 transition-transform duration-200">
              <img
                src="/sylvra-s-logo.png?v=6"
                alt="SYLVRA Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <img
                src="/sylvra-wordmark.png"
                alt="SYLVRA"
                className="h-4 sm:h-[18px] w-auto object-contain my-0.5 group-hover:brightness-110 transition-all"
              />
              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400/80 hidden xs:block -mt-0.5">
                24/7 Clean Power
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-mono uppercase text-[#91a399]">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`px-2.5 py-1.5 rounded transition-all duration-150 inline-flex items-center gap-1.5 ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-500/10 font-medium border border-emerald-500/20'
                        : 'hover:text-[#f0f4f1] hover:bg-white/5'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Medium screen / Tablet nav (compact icons or subset) */}
          <ul className="hidden md:flex lg:hidden items-center gap-1 text-xs font-mono uppercase text-[#91a399]">
            {navLinks.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`px-2 py-1 rounded transition-colors ${
                      isActive ? 'text-emerald-400 bg-emerald-500/10' : 'hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions / Auth / Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs text-[#91a399] hidden sm:inline-block font-mono max-w-[120px] truncate">
                  {user.company_name || user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-busbar px-2.5 sm:px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-mono uppercase text-[#91a399] hover:text-white px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors hidden sm:inline-block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-signal px-3 sm:px-3.5 py-1.5 text-xs inline-flex items-center gap-1"
                >
                  <span>Get Started</span>
                  <span className="hidden xs:inline">&rarr;</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-md bg-white/5 hover:bg-white/10 active:bg-white/15 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer focus-visible:outline-none focus-visible:border-emerald-500"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu & Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[3000] md:hidden animate-fadeIn">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="fixed top-0 inset-x-0 bottom-0 pt-16 pb-6 px-4 bg-[#080b09]/98 border-t border-[#19241d] overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80 mb-3 px-2">
                Navigation Modules
              </div>
              <ul className="flex flex-col gap-1 font-mono uppercase text-sm">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-3 rounded-lg border transition-all ${
                          isActive
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-semibold'
                            : 'border-transparent text-[#91a399] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/30" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Auth section in mobile drawer */}
            <div className="pt-4 border-t border-white/10 mt-6 space-y-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-2 text-xs font-mono text-slate-400 bg-white/5 rounded-md flex justify-between items-center">
                    <span>Active Account</span>
                    <span className="text-white font-medium">{user.company_name || user.username}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full btn-busbar py-2.5 text-xs font-mono uppercase flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-busbar py-2.5 text-xs font-mono uppercase flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-signal py-2.5 text-xs font-mono uppercase flex items-center justify-center"
                  >
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Building2,
  Cpu,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
} from 'lucide-react';

const platformLinks = [
  { to: '/map', label: 'Grid radar', icon: Globe },
  { to: '/simulator', label: 'Cost simulator', icon: SlidersHorizontal },
  { to: '/dc/profile', label: 'Data centre sizing', icon: Cpu },
  { to: '/dc/results', label: 'Power matches', icon: ShieldCheck },
  { to: '/supplier/dashboard', label: 'Supplier dashboard', icon: Building2 },
  { to: '/sources', label: 'Renewable sources', icon: Sun },
];

const energyLinks = [
  { to: '/solar', label: 'Solar power', detail: 'Khavda and Bhadla' },
  { to: '/wind', label: 'Wind power', detail: 'Muppandal and Jaisalmer' },
  { to: '/hydro', label: 'Hydropower', detail: 'Tehri and Chenab' },
  { to: '/pumped-hydro', label: 'Pumped storage', detail: 'Pinnapuram' },
  { to: '/bess', label: 'Battery storage', detail: 'BESS' },
  { to: '/green-hydrogen', label: 'Green hydrogen', detail: 'Fuel cells' },
];

const phoneNumber = '+919350349962';
const whatsappUrl =
  'https://wa.me/919350349962?text=Hello%20SYLVRA%20Team%2C%20I%27d%20like%20to%20know%20more%20about%20clean%20power%20and%20energy%20pricing.';
const emailAddress = 'cpnsingh2001@gmail.com';

function FooterLink({ to, children, onClick, className = '' }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07100b] ${className}`}
    >
      {children}
    </Link>
  );
}

export default function Footer({ onOpenContact }) {
  const currentYear = new Date().getFullYear();

  const handleContactClick = (event) => {
    if (!onOpenContact) return;

    event.preventDefault();
    onOpenContact();
  };

  return (
    <footer className="border-t border-white/10 bg-[#07100b] text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <Link
              to="/"
              aria-label="SYLVRA home"
              className="group inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <img
                src="/sylvra-s-logo.png?v=6"
                alt=""
                aria-hidden="true"
                className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="flex flex-col gap-1">
                <img
                  src="/sylvra-wordmark.png"
                  alt="SYLVRA"
                  className="h-5 w-auto max-w-32 object-contain object-left"
                />
                <span className="text-[10px] tracking-[0.18em] text-emerald-400">
                  Artificial Green Intelligence
                </span>
              </span>
            </Link>

            <p className="max-w-md text-sm leading-6 text-slate-400">
              We help data centres explore cleaner power options across India,
              bringing energy projects, suppliers and computing needs into one place.
            </p>

            <p className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Built around a cleaner energy future
            </p>
          </div>

          {/* Platform navigation */}
          <nav aria-label="Platform" className="lg:col-span-2">
            <h2 className="mb-4 text-sm font-semibold text-white">Explore SYLVRA</h2>
            <ul className="space-y-3">
              {platformLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <FooterLink to={to}>
                    <Icon aria-hidden="true" className="h-4 w-4 text-emerald-400/80" />
                    {label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Energy links */}
          <nav aria-label="Energy solutions" className="lg:col-span-3">
            <h2 className="mb-4 text-sm font-semibold text-white">Energy solutions</h2>
            <ul className="space-y-3">
              {energyLinks.map(({ to, label, detail }) => (
                <li key={to}>
                  <FooterLink to={to} className="group w-full justify-between">
                    <span>
                      {label}
                      <span className="ml-1.5 text-xs text-slate-500">
                        · {detail}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-colors group-hover:text-emerald-300"
                    />
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="mb-3 text-sm font-semibold text-white">Get in touch</h2>
            <p className="mb-5 text-sm leading-6 text-slate-400">
              Have a question about clean energy or data centre power? Talk to our team.
            </p>

            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-3 rounded-lg border border-white/10 px-3.5 py-3 text-sm text-slate-300 transition-colors hover:border-emerald-400/40 hover:bg-white/[0.03] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Phone aria-hidden="true" className="h-4 w-4 text-emerald-400" />
                <span>+91 93503 49962</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-white/10 px-3.5 py-3 text-sm text-slate-300 transition-colors hover:border-emerald-400/40 hover:bg-white/[0.03] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <MessageSquare aria-hidden="true" className="h-4 w-4 text-emerald-400" />
                <span>Message us on WhatsApp</span>
                <ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 text-slate-500" />
              </a>

              <a
                href={`mailto:${emailAddress}?subject=SYLVRA%20enquiry`}
                className="flex items-start gap-3 rounded-lg border border-white/10 px-3.5 py-3 text-sm text-slate-300 transition-colors hover:border-emerald-400/40 hover:bg-white/[0.03] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="break-all">{emailAddress}</span>
              </a>
            </div>

            <Link
              to="/contact"
              onClick={handleContactClick}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-[#07100b] transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07100b]"
            >
              Contact the team
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Copyright and secondary links */}
        <div className="flex flex-col gap-4 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} SYLVRA Energy Technologies. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <FooterLink to="/contact" onClick={handleContactClick}>
              Contact
            </FooterLink>
            <FooterLink to="/map">Grid radar</FooterLink>
            <FooterLink to="/simulator">Cost simulator</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

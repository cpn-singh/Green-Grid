import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Clock,
  Sparkles,
  MapPin,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { contactAPI } from '../../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'Cost & Grid Simulation',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [copiedType, setCopiedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please provide your name, email, and message.');
      return;
    }

    setLoading(true);
    const generatedTicketId = `SYL-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    let activeTicketId = generatedTicketId;

    // 1. Dispatch directly to cpnsingh2001@gmail.com via FormSubmit
    try {
      await fetch('https://formsubmit.co/ajax/cpnsingh2001@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _replyto: formData.email,
          phone: formData.phone || 'Not provided',
          organization: formData.organization || 'Not provided',
          inquiry_type: formData.inquiryType,
          message: formData.message,
          ticket_id: generatedTicketId,
          _subject: `[SYLVRA Inquiry - ${generatedTicketId}] ${formData.inquiryType} from ${formData.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });
    } catch (emailErr) {
      console.warn('FormSubmit email transmission warning:', emailErr);
    }

    // 2. Also log to Django Backend Database
    try {
      const response = await contactAPI.submitInquiry({
        ticket_id: generatedTicketId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        inquiry_type: formData.inquiryType,
        message: formData.message
      });
      if (response?.data?.ticket_id) {
        activeTicketId = response.data.ticket_id;
      }
    } catch (apiErr) {
      console.warn('Backend API submission skipped or failed, fallback to local logging', apiErr);
    }

    try {
      const existing = JSON.parse(localStorage.getItem('sylvra_contact_submissions') || '[]');
      existing.unshift({
        id: activeTicketId,
        ...formData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('sylvra_contact_submissions', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage save failed', err);
    }

    setTicketId(activeTicketId);
    setLoading(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      inquiryType: 'Cost & Grid Simulation',
      message: ''
    });
  };

  const whatsappMessage = encodeURIComponent(
    `Hello SYLVRA Team,\n\nName: ${formData.name || 'Visitor'}\nOrganization: ${formData.organization || 'N/A'}\nTopic: ${formData.inquiryType}\n\nMessage: ${formData.message || 'I would like to discuss clean power matching and cost simulation.'}`
  );

  return (
    <div className="min-h-screen bg-[#000204] text-[#f0f4f1] font-sans selection:bg-emerald-500/20 selection:text-white flex flex-col pt-16">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-white/10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24/7 Operations & Dispatch Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Contact <span className="text-emerald-400">SYLVRA</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Connect directly with our energy architects, transmission specialists, and grid simulation team. Reach us immediately on WhatsApp, direct phone call, or email.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Channels + Working Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Fast Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Direct Contact Lines
            </div>

            {/* WhatsApp & Call Card */}
            <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/30 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  WhatsApp & Direct Call
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/25">
                  Live Dispatch
                </span>
              </div>

              <div>
                <a
                  href="tel:+919350349962"
                  className="text-2xl sm:text-3xl font-mono font-bold text-white hover:text-emerald-400 transition-colors block"
                >
                  9350349962
                </a>
                <div className="text-xs text-slate-400 mt-1">
                  +91 9350349962 • Instant response for Data Centers & Suppliers
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <a
                  href={`https://wa.me/919350349962?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href="tel:+919350349962"
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Directly</span>
                </a>
                <button
                  onClick={() => copyToClipboard('9350349962', 'phone')}
                  title="Copy number"
                  className="p-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-slate-300"
                >
                  {copiedType === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-black/60 border border-teal-500/30 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  Official Email Inbox
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-teal-500/15 text-teal-300 px-2 py-0.5 rounded border border-teal-500/25">
                  Primary Desk
                </span>
              </div>

              <div>
                <a
                  href="mailto:cpnsingh2001@gmail.com?subject=SYLVRA%20Clean%20Power%20%26%20Cost%20Simulation%20Inquiry"
                  className="text-lg sm:text-xl font-mono font-bold text-white hover:text-teal-400 transition-colors break-all block"
                >
                  cpnsingh2001@gmail.com
                </a>
                <div className="text-xs text-slate-400 mt-1">
                  For formal PPAs, technical interconnect requests, and partnerships.
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="mailto:cpnsingh2001@gmail.com?subject=SYLVRA%20Clean%20Power%20%26%20Cost%20Simulation%20Inquiry"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-600/20"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open Email Client</span>
                </a>
                <button
                  onClick={() => copyToClipboard('cpnsingh2001@gmail.com', 'email')}
                  title="Copy email"
                  className="p-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-slate-300"
                >
                  {copiedType === 'email' ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Operational Metrics */}
            <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-3 font-mono text-xs">
              <div className="text-slate-400 uppercase tracking-wider text-[11px]">
                Engineering Desk Availability
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Operational Coverage:
                </span>
                <span className="text-white font-medium">24/7 RTC Active</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Inquiry Response SLA:
                </span>
                <span className="text-emerald-400 font-medium">&lt; 4 Hours</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Supported Corridors:
                </span>
                <span className="text-white font-medium">Pan-India (WR, NR, SR)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-black/60 border border-white/15 shadow-2xl relative">
              {submitted ? (
                <div className="py-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                      Inquiry Dispatched Successfully
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                      Transmission Confirmed
                    </h2>
                    <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
                      Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your inquiry ticket{' '}
                      <span className="font-mono text-emerald-400 font-semibold">{ticketId}</span> has been logged. Our dispatch team will follow up via{' '}
                      <span className="text-white font-medium">{formData.email}</span>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/80 border border-white/10 max-w-md mx-auto text-left text-xs font-mono space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Ticket Reference:</span>
                      <span className="text-emerald-400 font-bold">{ticketId}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Inquiry Category:</span>
                      <span className="text-white">{formData.inquiryType}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Contact Method:</span>
                      <span className="text-slate-200">{formData.phone || formData.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <a
                      href={`https://wa.me/919350349962?text=${encodeURIComponent(`Hi SYLVRA Desk, following up on ticket ${ticketId} regarding ${formData.inquiryType}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <button
                      onClick={resetForm}
                      className="py-2.5 px-5 rounded-xl border border-white/20 hover:bg-white/10 text-slate-200 text-xs font-medium transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Send a Direct Message
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Fill out the form below and our team will prepare customized grid capacity and cost analysis for your facility.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Full Name <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Vikram Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Work Email Address <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. vikram@datacenter.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 9XXXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Company or Facility Name
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="e.g. AI Hyper Compute Campus"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c140f] border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm transition-colors"
                    >
                      <option value="Cost & Grid Simulation">Cost Sim Tariff, Savings & PPA Modeling</option>
                      <option value="Data Center Siting & Load Sizing">Data Center Siting & Sizing Wizard</option>
                      <option value="Renewable PPA / Supplier Onboarding">Renewable Power Supplier / Asset Specs</option>
                      <option value="CTU Interconnect & Substation Access">CTU Substation & Transmission Feasibility</option>
                      <option value="Enterprise & Strategic Partnerships">Enterprise & Strategic Partnerships</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Project Details & Requirements <span className="text-emerald-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Specify your targeted MW load, location corridor (Gujarat, Rajasthan, Maharashtra, etc.), target clean power percentage, or timeline..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs font-mono text-slate-500">
                      Direct WhatsApp: +91 9350349962
                    </span>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <span>Transmitting...</span>
                      ) : (
                        <>
                          <span>Transmit Inquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

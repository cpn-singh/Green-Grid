import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  User,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { contactAPI } from '../services/api';

export default function ContactModal({ isOpen, onClose }) {
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

  if (!isOpen) return null;

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
      setError('Please fill in your name, email, and message.');
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

    // Always log to localStorage as client-side backup
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
    `Hello SYLVRA Team,\n\nName: ${formData.name || 'Visitor'}\nOrganization: ${formData.organization || 'N/A'}\nInquiry: ${formData.inquiryType}\n\nMessage: ${formData.message || 'I would like to inquire about clean power siting and cost simulation.'}`
  );

  return (
    <div className="fixed inset-0 z-[3500] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#080d0a] border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-950/40 text-[#f0f4f1] overflow-hidden my-auto z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top subtle glow strip */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                SYLVRA // 24/7 Operations Desk
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Get in Touch with Our Energy Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Contact us via WhatsApp, phone, email, or send an inquiry directly below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fast Contact Channels Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 sm:p-6 bg-black/40 border-b border-white/10">
          {/* Phone / WhatsApp */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Phone className="w-3.5 h-3.5" />
                  WHATSAPP & CALL
                </span>
                <span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Instant
                </span>
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-white">
                9350349962
              </div>
              <div className="text-xs text-slate-400">
                +91 9350349962 (India Hotline)
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/919350349962?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+919350349962"
                className="flex-1 py-1.5 px-3 rounded-lg border border-white/20 hover:bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call</span>
              </a>
              <button
                onClick={() => copyToClipboard('9350349962', 'phone')}
                title="Copy phone number"
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300"
              >
                {copiedType === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/30 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-teal-400 mb-1">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Mail className="w-3.5 h-3.5" />
                  OFFICIAL EMAIL
                </span>
                <span className="text-[10px] bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                  Direct Inbox
                </span>
              </div>
              <div className="text-sm sm:text-base font-mono font-bold text-white break-all">
                cpnsingh2001@gmail.com
              </div>
              <div className="text-xs text-slate-400">
                Data Center Siting & Clean Power Desk
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="mailto:cpnsingh2001@gmail.com?subject=SYLVRA%20Power%20%26%20Cost%20Simulation%20Inquiry"
                className="flex-1 py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
              <button
                onClick={() => copyToClipboard('cpnsingh2001@gmail.com', 'email')}
                title="Copy email address"
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300"
              >
                {copiedType === 'email' ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body: Form or Success */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  Transmission Confirmed
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Inquiry Dispatched!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your dispatch reference ticket is{' '}
                  <span className="font-mono text-emerald-400 font-semibold">{ticketId}</span>. Our clean power engineers will reach out to{' '}
                  <span className="text-white font-medium">{formData.email}</span> within 2-4 business hours.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 max-w-md mx-auto text-left text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Reference ID:</span>
                  <span className="text-emerald-400">{ticketId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Inquiry Scope:</span>
                  <span className="text-white">{formData.inquiryType}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-emerald-400">Queued for Dispatch</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <a
                  href={`https://wa.me/919350349962?text=${encodeURIComponent(`Hi SYLVRA Team, I just submitted inquiry ${ticketId} regarding ${formData.inquiryType}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Follow Up on WhatsApp</span>
                </a>
                <button
                  onClick={resetForm}
                  className="py-2 px-4 rounded-lg border border-white/20 hover:bg-white/10 text-slate-200 text-xs font-medium transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Send Direct Dispatch Inquiry
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. vikram@datacenter.com"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9XXXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. Hyperscale Corp"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Inquiry Topic
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1611] border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm"
                >
                  <option value="Cost & Grid Simulation">Cost Sim Tariff & Savings Analysis</option>
                  <option value="Data Center Siting & Load Sizing">Data Center Siting & Load Sizing</option>
                  <option value="Renewable PPA / Hybrid Supplier Contract">Renewable PPA / Hybrid Supplier Contract</option>
                  <option value="CTU Interconnect & Transmission Grid">CTU Interconnect & Transmission Grid</option>
                  <option value="Investor & Partnership Desk">Investor & Partnership Desk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Message Details <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Detail your IT load sizing, location preferences, or cost simulation requirements..."
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-neutral-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-500">
                  Response SLA: Under 4 hours
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Routing Inquiry...</span>
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
  );
}

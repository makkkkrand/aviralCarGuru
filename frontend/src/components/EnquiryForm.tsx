import React, { useState } from 'react';
import { 
  apiClient, 
  CreateEnquiryRequest, 
  EnquiryResponse 
} from '../api/client';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  User,
  MapPin,
  Calendar
} from 'lucide-react';

interface EnquiryFormProps {
  onScheduleTestDrive?: () => void;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({ onScheduleTestDrive }) => {
  const [enquiryType, setEnquiryType] = useState<any>('FINANCE_ASSISTANCE');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<any>('EMAIL');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<any>('AFTERNOON');
  const [postalCode, setPostalCode] = useState('90210');
  const [message, setMessage] = useState('I would like to speak with a finance specialist regarding bespoke lease incentives.');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnquiryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: CreateEnquiryRequest = {
      enquiryType,
      customer: {
        firstName,
        lastName,
        email,
        phone,
        preferredContactMethod,
      },
      preferredTimeSlot,
      postalCode,
      message,
    };

    try {
      const res = await apiClient.createEnquiry(payload);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error submitting enquiry to concierge desk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="customer-enquiry" className="py-20 relative">
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Dedicated Concierge Service</span>
          </div>
          <h2 className="heading-hero text-4xl sm:text-5xl lg:text-6xl text-white mb-3">
            CUSTOMER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">ENQUIRY</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Reach our private client advisors for vehicle allocations, trade-in valuations, and personalized credit structures.
          </p>
        </div>

        {!result ? (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl bg-[#090e1c]/95 border-white/10 shadow-2xl relative overflow-hidden">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center space-x-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Enquiry Topic Selection */}
              <div>
                <label className="form-label mb-2.5">Nature of Inquiry</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { id: 'FINANCE_ASSISTANCE', label: 'Financing & Lease' },
                    { id: 'VEHICLE_AVAILABILITY', label: 'Fleet Inventory' },
                    { id: 'PRICE_QUOTE', label: 'Price Quote' },
                    { id: 'TRADE_IN', label: 'Trade Valuation' },
                    { id: 'GENERAL', label: 'General Inquiry' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setEnquiryType(cat.id)}
                      className={`p-3.5 rounded-2xl text-xs font-bold text-center border transition-all ${
                        enquiryType === cat.id
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christian"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Von Koenigsegg"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="christian@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Telephone / Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="form-label">Preferred Contact</label>
                  <select
                    value={preferredContactMethod}
                    onChange={(e) => setPreferredContactMethod(e.target.value)}
                    className="form-control"
                  >
                    <option value="EMAIL">Email Consultation</option>
                    <option value="PHONE">Phone Call</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="SMS">Text / SMS</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Time Window</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="form-control"
                  >
                    <option value="MORNING">Morning (9am - 12pm)</option>
                    <option value="AFTERNOON">Afternoon (12pm - 5pm)</option>
                    <option value="EVENING">Evening (5pm - 8pm)</option>
                    <option value="ANYTIME">Anytime</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Postal / Zip Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="form-control font-mono"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="form-label">Specific Inquiries or Trade-In Notes</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-control resize-none"
                  placeholder="Tell our concierge team about any vehicle options or credit terms you have in mind..."
                />
              </div>

              {/* Submission CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Confidential • Never sold to third party brokers</span>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  {onScheduleTestDrive && (
                    <button
                      type="button"
                      onClick={onScheduleTestDrive}
                      className="btn-pill btn-outline text-xs py-3 px-5 border-white/20 hover:border-cyan-400"
                    >
                      Book Test Drive Instead
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-pill btn-cyan text-xs py-3.5 px-8 shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 flex-1 sm:flex-none font-bold"
                  >
                    {loading ? (
                      <span className="flex items-center space-x-2">
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send to Concierge</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        ) : (
          <div className="glass-panel p-10 sm:p-14 rounded-3xl bg-[#090e1c] border-cyan-500/40 text-center shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 flex items-center justify-center mx-auto mb-6 shadow-glow-cyan">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="badge-luxury mb-4">Inquiry Dispatched</span>

            <h3 className="text-3xl font-display font-extrabold text-white mb-2">
              Concierge Ticket Assigned
            </h3>
            
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-8">
              A certified automotive financing advisor has received your request and will contact you via your preferred window.
            </p>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 max-w-sm mx-auto mb-8">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Inquiry Tracking Reference Ticket</span>
              <span className="text-xl font-mono font-bold text-cyan-400 tracking-wider">
                {result.referenceTicket}
              </span>
            </div>

            <button
              onClick={() => setResult(null)}
              className="btn-pill btn-cyan text-xs px-8 py-3"
            >
              Submit Another Inquiry
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

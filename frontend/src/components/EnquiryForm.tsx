import React, { useState } from 'react';
import { apiClient, CreateEnquiryRequest, EnquiryResponse } from '../api/client';
import { MessageSquare, Send, CheckCircle2, Phone, Mail, Clock, ShieldCheck, Sparkles } from 'lucide-react';

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
      setError(err.message || 'Error sending enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="customer-enquiry" className="py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Dedicated Concierge Service</span>
          </div>
          <h2 className="heading-hero text-4xl sm:text-5xl text-white mb-2">
            CUSTOMER <span className="text-cyan-400">ENQUIRY</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Reach our private client advisors for vehicle reservations, trade-in valuations, and personalized credit structures.
          </p>
        </div>

        {!result ? (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-[#090e1c]/95 border-white/10 shadow-2xl">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Enquiry Topic Selection */}
              <div>
                <label className="form-label">Nature of Enquiry</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'FINANCE_ASSISTANCE', label: 'Financing & Lease' },
                    { id: 'VEHICLE_AVAILABILITY', label: 'Fleet Availability' },
                    { id: 'PRICE_QUOTE', label: 'Price Quote' },
                    { id: 'TRADE_IN', label: 'Trade-In Valuation' },
                    { id: 'GENERAL', label: 'General Enquiry' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setEnquiryType(cat.id)}
                      className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                        enquiryType === cat.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-sm shadow-cyan-500/10'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control"
                    placeholder="Sophia"
                  />
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-control"
                    placeholder="Reynolds"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="sophia@example.com"
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>

              {/* Preferences: Contact Method & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Preferred Contact Channel</label>
                  <select
                    value={preferredContactMethod}
                    onChange={(e) => setPreferredContactMethod(e.target.value as any)}
                    className="form-control"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Direct Call</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="SMS">SMS Text</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Best Time to Connect</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value as any)}
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
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="form-control"
                    placeholder="90210"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="form-label">Your Message or Requirements *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-control resize-none"
                  placeholder="Tell us what you're looking for..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-slate-500">
                  By submitting, you consent to secure advisor contact under our privacy policy.
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-pill btn-cyan px-8 py-3.5 text-sm font-bold flex items-center space-x-2 shadow-lg shadow-cyan-500/25 w-full sm:w-auto justify-center"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Enquiry...' : 'Submit Customer Enquiry'}</span>
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Success confirmation */
          <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center bg-[#0a101f] border-cyan-500/30 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-4 text-cyan-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-1">
              Enquiry Dispatched
            </span>
            <h3 className="text-3xl font-display font-extrabold text-white mb-2">
              We Received Your Enquiry
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
              A Velora customer concierge specialist has been assigned to your ticket and will reach out via {preferredContactMethod}.
            </p>

            <div className="glass-panel p-4 rounded-xl max-w-sm mx-auto mb-6 bg-cyan-950/20 border-cyan-500/30 text-center">
              <span className="text-xs text-slate-400 block mb-1">Reference Ticket</span>
              <span className="font-mono text-xl font-bold text-cyan-300">{result.referenceTicket}</span>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setResult(null)}
                className="btn-pill btn-cyan px-6 py-3 text-sm font-semibold"
              >
                Send Another Message
              </button>
              {onScheduleTestDrive && (
                <button
                  onClick={onScheduleTestDrive}
                  className="btn-pill btn-outline px-6 py-3 text-sm"
                >
                  Schedule Test Drive
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { apiClient, CreateEnquiryRequest, EnquiryResponse } from '../api/client';
import { CheckCircle2, Calendar, ArrowRight, Phone, Mail, MapPin, Check, HelpCircle, ShieldCheck, RefreshCw, Zap, Truck, Car, Percent } from 'lucide-react';

interface EnquiryFormProps {
  onScheduleTestDrive?: () => void;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({ onScheduleTestDrive }) => {
  const [enquiryType, setEnquiryType] = useState<any>('FINANCE_ASSISTANCE');
  const [consultationTopic, setConsultationTopic] = useState('NEW_CAR_LOAN');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<any>('PHONE');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<any>('AFTERNOON');
  const [postalCode, setPostalCode] = useState('400051');
  const [budgetOrLoanAmount, setBudgetOrLoanAmount] = useState('₹15 - ₹35 Lakhs');
  const [message, setMessage] = useState('I need expert advice on the lowest available auto loan interest rate, down payment options, and pre-approved offers for my vehicle purchase.');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnquiryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fullMessage = `[Topic: ${consultationTopic}] [Budget/Loan: ${budgetOrLoanAmount}] ${message}`;

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
      message: fullMessage,
    };

    try {
      const res = await apiClient.createEnquiry(payload);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error transmitting consultation request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="max-w-2xl mb-8">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            CarGuru Advisory Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Vehicle Finance Enquiry &amp; Consultation
          </h1>
          <p className="text-sm text-slate-600 leading-normal">
            Get unbiased, expert financial guidance for any vehicle transaction in India. Whether you need a fresh car loan, EV subsidy consultation, loan balance transfer, or commercial fleet leasing, our certified gurus assist you free of charge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Consultation Pillars & Direct Contact (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                What Our Gurus Consult On
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start space-x-2.5">
                  <Car className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-900 font-semibold">New Car &amp; SUV Loan Structuring</div>
                    <p className="text-slate-600 leading-normal">Compare HDFC, ICICI, SBI, and Kotak terms. Zero dealership markups.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Percent className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-900 font-semibold">Loan Refinancing &amp; Balance Transfer</div>
                    <p className="text-slate-600 leading-normal">Switch high-interest loans (11%+) to 8.49% p.a. and lower monthly EMIs.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <RefreshCw className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-900 font-semibold">Pre-Owned Valuation &amp; Used Car Loans</div>
                    <p className="text-slate-600 leading-normal">Fair market price assessment, RTO NOC verification, and financing up to 85%.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Zap className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-900 font-semibold">Electric Vehicle Green Finance</div>
                    <p className="text-slate-600 leading-normal">State subsidies, central FAME tax benefits, and preferential EV interest rates.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Truck className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-900 font-semibold">Commercial Vehicles &amp; Fleet Leasing</div>
                    <p className="text-slate-600 leading-normal">Working capital friendly asset financing for transport &amp; taxi businesses.</p>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Free Advice</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero CIBIL Impact</span>
                </span>
              </div>
            </div>

            {/* Direct Helpline Card */}
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">National Advisory Desk</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">+91 1800 209 8888 (Toll-Free Pan-India)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">advisory@carguru.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">Mumbai · Delhi NCR · Bengaluru · Hyderabad · Pune</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              
              {result ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <Check className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">Consultation Request Logged</h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      A certified CarGuru vehicle finance specialist will contact you during your preferred time window.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5 max-w-xs mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Ticket Reference:</span>
                      <span className="font-mono font-bold text-slate-900">{result.referenceTicket}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Status:</span>
                      <span className="font-semibold text-emerald-700">{result.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Assigned To:</span>
                      <span className="text-slate-800">Senior Auto Finance Advisor</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setResult(null)}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    Request Another Consultation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Book Free Vehicle Finance Consultation
                  </div>

                  {error && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">Consultation Topic</label>
                      <select
                        value={consultationTopic}
                        onChange={(e) => setConsultationTopic(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      >
                        <option value="NEW_CAR_LOAN">New Car / SUV Financing Advice</option>
                        <option value="REFINANCE_TRANSFER">Loan Balance Transfer &amp; Lower EMI</option>
                        <option value="USED_CAR_LOAN">Pre-Owned Vehicle Loan &amp; Valuation</option>
                        <option value="EV_GREEN_LOAN">Electric Vehicle Subsidies &amp; Rates</option>
                        <option value="COMMERCIAL_FLEET">Commercial Fleet Leasing &amp; Credit</option>
                        <option value="TOP_UP_LOAN">Top-Up Cash Loan on Existing Car</option>
                        <option value="CIBIL_COUNSELING">CIBIL Score Verification &amp; Repair</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">Target Budget / Loan Amount</label>
                      <select
                        value={budgetOrLoanAmount}
                        onChange={(e) => setBudgetOrLoanAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      >
                        <option value="Under ₹8 Lakhs">Under ₹8 Lakhs (Entry/Used)</option>
                        <option value="₹8 - ₹15 Lakhs">₹8 - ₹15 Lakhs (Hatchback/Sedan)</option>
                        <option value="₹15 - ₹35 Lakhs">₹15 - ₹35 Lakhs (SUV / EV)</option>
                        <option value="₹35 - ₹75 Lakhs">₹35 - ₹75 Lakhs (Premium / Fortuner / EV)</option>
                        <option value="Above ₹75 Lakhs">Above ₹75 Lakhs (Luxury Marque)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">Mobile Phone (India)</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98201 92830"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">Preferred Contact Mode</label>
                      <select
                        value={preferredContactMethod}
                        onChange={(e) => setPreferredContactMethod(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      >
                        <option value="PHONE">Direct Phone Call</option>
                        <option value="WHATSAPP">WhatsApp Summary &amp; Call</option>
                        <option value="EMAIL">Email Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">PIN Code (6-digit)</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="400051"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">Consultation Requirements &amp; Queries</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors shadow-xs disabled:opacity-50"
                    >
                      {loading ? 'Routing to Certified Advisor...' : 'Request Free Finance Consultation'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

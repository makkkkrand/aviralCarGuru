import React, { useState } from 'react';
import { 
  apiClient, 
  FinancingApplicationRequest, 
  FinancingApplicationResponse 
} from '../api/client';
import { 
  FileText, 
  User, 
  Briefcase, 
  Car, 
  CheckSquare, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Lock,
  Sparkles,
  Info
} from 'lucide-react';

interface FinancingApplicationWizardProps {
  initialTerms?: {
    vehiclePrice: number;
    downPayment: number;
    tenureMonths: number;
    monthlyPayment: number;
    vehicleId?: string;
  } | null;
  onTrackApplication: (refNumber: string) => void;
}

export const FinancingApplicationWizard: React.FC<FinancingApplicationWizardProps> = ({
  initialTerms,
  onTrackApplication,
}) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<FinancingApplicationResponse | null>(null);

  // Step 1: Personal Details
  const [firstName, setFirstName] = useState('Alexander');
  const [lastName, setLastName] = useState('Wright');
  const [dateOfBirth, setDateOfBirth] = useState('1992-06-15');
  const [email, setEmail] = useState('alex.wright@example.com');
  const [phone, setPhone] = useState('+1-555-019-2830');
  const [addressLine1, setAddressLine1] = useState('450 Ocean Drive');
  const [addressLine2, setAddressLine2] = useState('Suite 14B');
  const [city, setCity] = useState('Miami');
  const [state, setState] = useState('FL');
  const [postalCode, setPostalCode] = useState('33139');
  const [housingStatus, setHousingStatus] = useState<any>('OWN_WITH_MORTGAGE');
  const [monthlyHousingPayment, setMonthlyHousingPayment] = useState<number>(2400);

  // Step 2: Employment Details
  const [employerName, setEmployerName] = useState('AeroTech Solutions');
  const [jobTitle, setJobTitle] = useState('Vice President of Engineering');
  const [employmentType, setEmploymentType] = useState<any>('FULL_TIME');
  const [monthlyGrossIncome, setMonthlyGrossIncome] = useState<number>(14500);
  const [monthsAtCurrentEmployer, setMonthsAtCurrentEmployer] = useState<number>(36);

  // Step 3: Vehicle & Loan Terms
  const [make, setMake] = useState('Mercedes-AMG');
  const [model, setModel] = useState('GT 4-Door Coupe');
  const [year, setYear] = useState<number>(2026);
  const [trim, setTrim] = useState('63 S E Performance');
  const [purchasePrice, setPurchasePrice] = useState<number>(initialTerms?.vehiclePrice || 98500);
  const [downPayment, setDownPayment] = useState<number>(initialTerms?.downPayment || 15000);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [tenureMonths, setTenureMonths] = useState<number>(initialTerms?.tenureMonths || 60);

  // Step 4: Consents
  const [creditCheckAuthorized, setCreditCheckAuthorized] = useState<boolean>(true);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] = useState<boolean>(true);
  const [contactViaSmsAccepted, setContactViaSmsAccepted] = useState<boolean>(true);

  const calculatedLoanAmount = Math.max(0, purchasePrice + (purchasePrice * 0.07) - downPayment - tradeInValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: FinancingApplicationRequest = {
      applicant: {
        firstName,
        lastName,
        dateOfBirth,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        housingStatus,
        monthlyHousingPayment: Number(monthlyHousingPayment),
      },
      employment: {
        employerName,
        jobTitle,
        employmentType,
        monthlyGrossIncome: Number(monthlyGrossIncome),
        monthsAtCurrentEmployer: Number(monthsAtCurrentEmployer),
      },
      vehicleDetails: {
        make,
        model,
        year: Number(year),
        trim,
        purchasePrice: Number(purchasePrice),
      },
      loanTerms: {
        downPayment: Number(downPayment),
        tradeInValue: Number(tradeInValue),
        tenureMonths: Number(tenureMonths),
        requestedLoanAmount: Number(calculatedLoanAmount),
      },
      consents: {
        creditCheckAuthorized,
        termsAndConditionsAccepted,
        contactViaSmsAccepted,
      },
    };

    try {
      const res = await apiClient.submitFinancingApplication(payload);
      setSubmissionResult(res);
    } catch (err: any) {
      setError(err.message || 'Error submitting financing application');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { number: 1, title: 'Borrower', icon: User },
    { number: 2, title: 'Employment', icon: Briefcase },
    { number: 3, title: 'Vehicle & Terms', icon: Car },
    { number: 4, title: 'Authorization', icon: CheckSquare },
  ];

  return (
    <section id="financing-application-wizard" className="py-20 relative">
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Wizard Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Encrypted Direct Underwriting</span>
          </div>
          <h2 className="heading-hero text-4xl sm:text-5xl lg:text-6xl text-white mb-3">
            CREDIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">APPLICATION</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Submit your full portfolio directly into the Velora automated underwriting engine. Receive conditional term sanction in minutes.
          </p>
        </div>

        {/* Wizard Step Progress Tracker */}
        {!submissionResult && (
          <div className="mb-10">
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {stepsList.map((s) => {
                const Icon = s.icon;
                const isCurrent = step === s.number;
                const isDone = step > s.number;
                return (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => {
                      if (step > s.number) setStep(s.number);
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/15 border-cyan-400/80 shadow-md shadow-cyan-500/15'
                        : isDone
                        ? 'bg-white/[0.04] border-cyan-500/30 text-slate-300'
                        : 'bg-white/[0.02] border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-cyan-400 text-black font-bold'
                          : isDone
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-white/5 text-slate-500'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <div className="hidden sm:block overflow-hidden">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">Step 0{s.number}</span>
                        <span className={`text-xs font-bold block truncate ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                          {s.title}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Form Area */}
        {!submissionResult ? (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl bg-[#090e1c]/95 border-white/10 shadow-2xl">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: BORROWER PROFILE */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h3 className="text-xl font-display font-bold text-white">Borrower Personal Identification</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Please ensure name and address match your government-issued ID.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Legal First Name *</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Legal Last Name *</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Date of Birth (YYYY-MM-DD) *</label>
                      <input
                        type="date"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="form-control font-mono"
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
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
                      />
                    </div>
                    <div>
                      <label className="form-label">Residential Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Suite / Unit / Apt</label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div>
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="form-control font-mono"
                        />
                      </div>
                      <div>
                        <label className="form-label">Zip *</label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="form-control font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-white/10">
                    <div>
                      <label className="form-label">Housing Status</label>
                      <select
                        value={housingStatus}
                        onChange={(e) => setHousingStatus(e.target.value)}
                        className="form-control"
                      >
                        <option value="OWN_OUTRIGHT">Own Home (Outright)</option>
                        <option value="OWN_WITH_MORTGAGE">Own Home (With Mortgage)</option>
                        <option value="RENT">Rent / Lease</option>
                        <option value="OTHER">Other Arrangement</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Monthly Rent or Mortgage ($)</label>
                      <input
                        type="number"
                        required
                        value={monthlyHousingPayment}
                        onChange={(e) => setMonthlyHousingPayment(Number(e.target.value))}
                        className="form-control font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: EMPLOYMENT & FINANCIALS */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h3 className="text-xl font-display font-bold text-white">Employment & Revenue Verification</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Used by our algorithm to calculate Debt-to-Income (DTI) compliance.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Current Employer / Corporation *</label>
                      <input
                        type="text"
                        required
                        value={employerName}
                        onChange={(e) => setEmployerName(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Position / Job Title *</label>
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Employment Type</label>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                        className="form-control"
                      >
                        <option value="FULL_TIME">Full Time Permanent</option>
                        <option value="SELF_EMPLOYED">Business Owner / Self-Employed</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACTOR">Contractor</option>
                        <option value="RETIRED">Retired / Investment Income</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Tenure at Position (Months) *</label>
                      <input
                        type="number"
                        required
                        value={monthsAtCurrentEmployer}
                        onChange={(e) => setMonthsAtCurrentEmployer(Number(e.target.value))}
                        className="form-control font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="form-label">Monthly Gross Income (Before Tax) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                        <input
                          type="number"
                          required
                          value={monthlyGrossIncome}
                          onChange={(e) => setMonthlyGrossIncome(Number(e.target.value))}
                          className="form-control pl-8 text-base font-mono"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Annual equivalent: ${(monthlyGrossIncome * 12).toLocaleString()}/year
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: VEHICLE & DESIRED LOAN TERMS */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h3 className="text-xl font-display font-bold text-white">Vehicle Specifications & Credit Request</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Adjust down payment and desired loan duration.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Vehicle Make</label>
                      <input
                        type="text"
                        required
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Vehicle Model</label>
                      <input
                        type="text"
                        required
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Model Year</label>
                      <input
                        type="number"
                        required
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="form-control font-mono"
                      />
                    </div>
                    <div>
                      <label className="form-label">Trim & Specification</label>
                      <input
                        type="text"
                        required
                        value={trim}
                        onChange={(e) => setTrim(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Agreed Purchase Price ($) *</label>
                      <input
                        type="number"
                        required
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                        className="form-control font-mono"
                      />
                    </div>
                    <div>
                      <label className="form-label">Down Payment Committed ($) *</label>
                      <input
                        type="number"
                        required
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="form-control font-mono"
                      />
                    </div>
                    <div>
                      <label className="form-label">Trade-In Allowance ($)</label>
                      <input
                        type="number"
                        value={tradeInValue}
                        onChange={(e) => setTradeInValue(Number(e.target.value))}
                        className="form-control font-mono"
                      />
                    </div>
                    <div>
                      <label className="form-label">Requested Term</label>
                      <select
                        value={tenureMonths}
                        onChange={(e) => setTenureMonths(Number(e.target.value))}
                        className="form-control"
                      >
                        <option value={36}>36 Months</option>
                        <option value={48}>48 Months</option>
                        <option value={60}>60 Months (Standard)</option>
                        <option value={72}>72 Months</option>
                        <option value={84}>84 Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-cyan-300 font-bold block uppercase tracking-wider">Estimated Total Credit Required</span>
                      <span className="text-2xl font-black text-white font-mono">
                        ${calculatedLoanAmount.toLocaleString()}
                      </span>
                    </div>
                    <span className="badge-luxury">Subsidized Rate Eligible</span>
                  </div>
                </div>
              )}

              {/* STEP 4: AUTHORIZATION & SUBMIT */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h3 className="text-xl font-display font-bold text-white">Underwriting Consents & Declarations</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Please review the compliance legal disclosures below.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:border-cyan-400/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={creditCheckAuthorized}
                        onChange={(e) => setCreditCheckAuthorized(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-700 text-cyan-500 focus:ring-cyan-400"
                      />
                      <span className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-white block mb-0.5">Bureau Inquiry Authorization</strong>
                        I authorize Velora and its underwriting bank partners to obtain consumer reports to evaluate my creditworthiness.
                      </span>
                    </label>

                    <label className="flex items-start space-x-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:border-cyan-400/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={termsAndConditionsAccepted}
                        onChange={(e) => setTermsAndConditionsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-700 text-cyan-500 focus:ring-cyan-400"
                      />
                      <span className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-white block mb-0.5">Electronic Disclosures & Terms</strong>
                        I certify that all information supplied is truthful and accurate to the best of my knowledge.
                      </span>
                    </label>

                    <label className="flex items-start space-x-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:border-cyan-400/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={contactViaSmsAccepted}
                        onChange={(e) => setContactViaSmsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-700 text-cyan-500 focus:ring-cyan-400"
                      />
                      <span className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-white block mb-0.5">Real-Time SMS Application Alerts</strong>
                        Receive automated notifications when an underwriter approves or requests additional documents.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Actions */}
              <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="btn-pill btn-outline text-xs px-6 py-3 flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="btn-pill btn-cyan text-xs px-8 py-3.5 flex items-center space-x-2 font-bold shadow-lg shadow-cyan-500/20"
                  >
                    <span>Proceed to Step 0{step + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !creditCheckAuthorized || !termsAndConditionsAccepted}
                    className="btn-pill btn-cyan text-xs px-10 py-4 flex items-center space-x-2 font-bold shadow-xl shadow-cyan-500/30 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center space-x-2">
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Submitting to Underwriter...</span>
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Final Application</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>
          </div>
        ) : (
          /* Submission Success Card */
          <div className="glass-panel p-10 sm:p-14 rounded-3xl bg-[#090e1c] border-cyan-400/50 text-center shadow-2xl relative">
            <div className="w-20 h-20 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 flex items-center justify-center mx-auto mb-6 shadow-glow-cyan">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="badge-luxury mb-4">Application Registered</span>

            <h3 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">
              Credit Dossier Transmitted
            </h3>

            <p className="text-slate-300 text-sm max-w-lg mx-auto mb-8">
              Your application has entered the automated verification queue. You may now upload bank statements or track real-time underwriter milestones.
            </p>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 max-w-md mx-auto mb-8">
              <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Application Reference</span>
              <span className="text-2xl font-mono font-bold text-cyan-400 tracking-wider">
                {submissionResult.referenceNumber}
              </span>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-xs text-slate-400 font-mono">
                <span>Status: <strong className="text-white">{submissionResult.status}</strong></span>
                <span>Tier: <strong className="text-cyan-300">Fast-Track</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onTrackApplication(submissionResult.referenceNumber)}
                className="btn-pill btn-cyan text-xs px-8 py-3.5 font-bold shadow-lg shadow-cyan-500/25 flex items-center space-x-2"
              >
                <span>Track Application & Upload Docs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

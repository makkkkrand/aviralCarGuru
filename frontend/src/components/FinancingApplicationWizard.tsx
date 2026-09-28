import React, { useState } from 'react';
import { apiClient, FinancingApplicationRequest, FinancingApplicationResponse } from '../api/client';
import { FileText, User, Briefcase, Car, CheckSquare, ArrowRight, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';

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
        requestedLoanAmount: calculatedLoanAmount,
      },
      consents: {
        creditCheckAuthorized,
        termsAndConditionsAccepted,
        contactViaSmsAccepted,
      },
    };

    try {
      const response = await apiClient.submitFinancingApplication(payload);
      setSubmissionResult(response);
    } catch (err: any) {
      setError(err.message || 'Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="loan-application" className="py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Official Loan Application</span>
          </div>
          <h2 className="heading-hero text-4xl sm:text-5xl text-white mb-2">
            VELORA <span className="text-cyan-400">FINANCING APPLICATION</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Secure, encrypted application directly processed by Velora Financial Underwriting.
          </p>
        </div>

        {!submissionResult ? (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-[#090e1c]/95 border-white/10 shadow-2xl">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              {[
                { s: 1, label: 'Personal', icon: User },
                { s: 2, label: 'Employment', icon: Briefcase },
                { s: 3, label: 'Vehicle & Loan', icon: Car },
                { s: 4, label: 'Consents', icon: CheckSquare },
              ].map((item) => {
                const Icon = item.icon;
                const isCurrent = step === item.s;
                const isDone = step > item.s;
                return (
                  <div key={item.s} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        isCurrent
                          ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                          : isDone
                          ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/40'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}
                    >
                      {isDone ? '✓' : item.s}
                    </div>
                    <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                      isCurrent ? 'text-cyan-400' : 'text-slate-400'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-xl font-bold text-white mb-4">1. Primary Applicant Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        required
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
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="form-control"
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Apt / Suite</label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
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
                      <label className="form-label">State / Region *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Postal / Zip Code *</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="form-label">Housing Status</label>
                      <select
                        value={housingStatus}
                        onChange={(e) => setHousingStatus(e.target.value as any)}
                        className="form-control"
                      >
                        <option value="OWN_WITH_MORTGAGE">Own with Mortgage</option>
                        <option value="OWN_OUTRIGHT">Own Outright</option>
                        <option value="RENT">Rent</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Monthly Housing Payment ($)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={monthlyHousingPayment}
                        onChange={(e) => setMonthlyHousingPayment(Number(e.target.value))}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Employment Details */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-xl font-bold text-white mb-4">2. Employment & Financial Standing</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Current Employer Name *</label>
                      <input
                        type="text"
                        required
                        value={employerName}
                        onChange={(e) => setEmployerName(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Job Title / Role *</label>
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Employment Classification</label>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value as any)}
                        className="form-control"
                      >
                        <option value="FULL_TIME">Full-Time Employee</option>
                        <option value="PART_TIME">Part-Time</option>
                        <option value="CONTRACTOR">Contractor / 1099</option>
                        <option value="SELF_EMPLOYED">Self-Employed / Founder</option>
                        <option value="RETIRED">Retired</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Monthly Gross Income ($) *</label>
                      <input
                        type="number"
                        required
                        min="1000"
                        value={monthlyGrossIncome}
                        onChange={(e) => setMonthlyGrossIncome(Number(e.target.value))}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Time at Employer (Months)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={monthsAtCurrentEmployer}
                        onChange={(e) => setMonthsAtCurrentEmployer(Number(e.target.value))}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Vehicle & Loan Terms */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-xl font-bold text-white mb-4">3. Vehicle & Financing Breakdown</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Make</label>
                      <input
                        type="text"
                        required
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Model</label>
                      <input
                        type="text"
                        required
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Year</label>
                      <input
                        type="number"
                        required
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Trim / Package</label>
                      <input
                        type="text"
                        value={trim}
                        onChange={(e) => setTrim(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Vehicle MSRP ($)</label>
                      <input
                        type="number"
                        required
                        min="1000"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="form-label">Down Payment ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Trade-in Allowance ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={tradeInValue}
                        onChange={(e) => setTradeInValue(Number(e.target.value))}
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Term Length</label>
                      <select
                        value={tenureMonths}
                        onChange={(e) => setTenureMonths(Number(e.target.value))}
                        className="form-control"
                      >
                        {[24, 36, 48, 60, 72, 84].map(m => (
                          <option key={m} value={m}>{m} Months</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex justify-between items-center mt-4">
                    <span className="text-sm font-semibold text-slate-300">Total Requested Loan Principal</span>
                    <span className="text-xl font-bold font-display text-cyan-300">
                      ${calculatedLoanAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 4: Consents */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in">
                  <h3 className="text-xl font-bold text-white mb-2">4. Disclosures & Consents</h3>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-cyan-500/30">
                      <input
                        type="checkbox"
                        checked={creditCheckAuthorized}
                        onChange={(e) => setCreditCheckAuthorized(e.target.checked)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <strong className="text-white block mb-0.5">Automated Credit Evaluation Authorization *</strong>
                        I authorize Velora and its underwriting bank syndicate to check my credit history and verify employment details to evaluate this vehicle financing application.
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-cyan-500/30">
                      <input
                        type="checkbox"
                        checked={termsAndConditionsAccepted}
                        onChange={(e) => setTermsAndConditionsAccepted(e.target.checked)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <strong className="text-white block mb-0.5">Terms and Truth-in-Lending Disclosures *</strong>
                        I certify that all statements made in this application are true, accurate, and made for the purpose of obtaining luxury auto credit.
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-cyan-500/30">
                      <input
                        type="checkbox"
                        checked={contactViaSmsAccepted}
                        onChange={(e) => setContactViaSmsAccepted(e.target.checked)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <strong className="text-white block mb-0.5">Concierge Updates via SMS</strong>
                        Receive instantaneous status notifications, document verification alerts, and loan officer updates via SMS.
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-8 mt-6 border-t border-white/10">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="btn-pill btn-outline text-sm px-6 py-3 flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="btn-pill btn-cyan text-sm px-8 py-3 flex items-center space-x-2 font-bold"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !creditCheckAuthorized || !termsAndConditionsAccepted}
                    className="btn-pill btn-cyan text-sm px-10 py-3.5 font-bold flex items-center space-x-2 shadow-lg shadow-cyan-500/30"
                  >
                    <Shield className="w-4 h-4" />
                    <span>{loading ? 'Submitting Application...' : 'Submit Loan Application'}</span>
                  </button>
                )}
              </div>

            </form>
          </div>
        ) : (
          /* Submission Success Card */
          <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center bg-[#0a101f] border-cyan-500/30 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-6 text-cyan-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-2">
              Application Successfully Logged
            </span>
            <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-3">
              Application Submitted
            </h3>
            <p className="text-slate-300 text-sm max-w-lg mx-auto mb-8">
              Your formal financing file has been committed to the underwriting database and queued for rapid automated review.
            </p>

            <div className="glass-panel p-6 rounded-2xl max-w-md mx-auto text-left space-y-3 mb-8 bg-cyan-950/20 border-cyan-500/30">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Application Number</span>
                <span className="font-mono font-bold text-cyan-300 text-base">{submissionResult.referenceNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Initial Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {submissionResult.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Estimated Decision</span>
                <span className="font-semibold text-white">{submissionResult.estimatedDecisionDate}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onTrackApplication(submissionResult.referenceNumber)}
                className="btn-pill btn-cyan px-8 py-3.5 text-sm font-bold flex items-center justify-center space-x-2"
              >
                <span>Track Application & Upload Docs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSubmissionResult(null)}
                className="btn-pill btn-outline px-6 py-3.5 text-sm"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

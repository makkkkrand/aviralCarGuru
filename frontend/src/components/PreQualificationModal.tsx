import React, { useState } from 'react';
import { apiClient, PreQualificationResponse } from '../api/client';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Lock,
  DollarSign,
  Briefcase
} from 'lucide-react';

interface PreQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToApplication: () => void;
}

export const PreQualificationModal: React.FC<PreQualificationModalProps> = ({
  isOpen,
  onClose,
  onProceedToApplication,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [annualIncome, setAnnualIncome] = useState<number>(140000);
  const [employmentStatus, setEmploymentStatus] = useState<any>('EMPLOYED_FULL_TIME');
  const [estimatedCreditScore, setEstimatedCreditScore] = useState<any>('EXCELLENT_750_PLUS');
  const [desiredLoanAmount, setDesiredLoanAmount] = useState<number>(75000);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PreQualificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.submitPreQualification({
        firstName,
        lastName,
        email,
        phone,
        annualIncome: Number(annualIncome),
        employmentStatus,
        estimatedCreditScore,
        desiredLoanAmount: Number(desiredLoanAmount),
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit pre-qualification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-10 rounded-3xl border-white/15 bg-[#090e1c] max-h-[92vh] overflow-y-auto relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/50 transition-colors"
          aria-label="Close Pre-Qualification Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!result ? (
          <div>
            {/* Modal Header */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>60-Second Soft Inquiry</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                Instant Pre-Qualification
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Zero impact on your credit bureau score. Calculate your eligible maximum vehicle tier and interest bracket.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christian"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control text-xs"
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
                    className="form-control text-xs"
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
                    className="form-control text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="form-label">Annual Gross Income ($) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      required
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                      className="form-control pl-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Desired Loan Size ($) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      required
                      value={desiredLoanAmount}
                      onChange={(e) => setDesiredLoanAmount(Number(e.target.value))}
                      className="form-control pl-8 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Employment Status</label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className="form-control text-xs"
                  >
                    <option value="EMPLOYED_FULL_TIME">Employed Full-Time</option>
                    <option value="SELF_EMPLOYED">Self-Employed / Founder</option>
                    <option value="EMPLOYED_PART_TIME">Part-Time</option>
                    <option value="RETIRED">Retired / Investment</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Self-Estimated Credit Score</label>
                  <select
                    value={estimatedCreditScore}
                    onChange={(e) => setEstimatedCreditScore(e.target.value)}
                    className="form-control text-xs"
                  >
                    <option value="EXCELLENT_750_PLUS">Tier 1: 750+ (Excellent)</option>
                    <option value="GOOD_700_749">Tier 2: 700 - 749 (Good)</option>
                    <option value="FAIR_640_699">Tier 3: 640 - 699 (Fair)</option>
                    <option value="BELOW_640">Tier 4: Under 640 (Sub-Prime)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Soft bureau pull only • 100% score safe</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-pill btn-cyan text-xs py-3 px-7 font-bold shadow-lg shadow-cyan-500/25"
                >
                  {loading ? 'Evaluating...' : 'Check My Pre-Approval'}
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 flex items-center justify-center mx-auto mb-6 shadow-glow-cyan">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="badge-luxury mb-3">Pre-Qualification Successful</span>

            <h3 className="text-3xl font-display font-black text-white mb-2">
              Max Eligible Credit: ${result.maxEligibleAmount?.toLocaleString()}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Congratulations! Based on your preliminary profile, you qualify for Velora subsidized prime financing.
            </p>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 max-w-sm mx-auto mb-6 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Reference Code:</span>
                <span className="font-mono text-cyan-400 font-bold">{result.preApprovalReferenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated APR Range:</span>
                <span className="font-mono text-white font-bold">{result.estimatedAprFrom}% - {result.estimatedAprTo}% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Offer Valid Until:</span>
                <span className="font-mono text-slate-300">{result.validUntil}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onProceedToApplication();
                }}
                className="btn-pill btn-cyan text-xs py-3.5 px-8 font-bold w-full sm:w-auto shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2"
              >
                <span>Lock In Terms & Complete Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

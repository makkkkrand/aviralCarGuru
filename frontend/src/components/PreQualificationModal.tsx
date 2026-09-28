import React, { useState } from 'react';
import { apiClient, PreQualificationResponse } from '../api/client';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

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
  const [annualIncome, setAnnualIncome] = useState<number>(120000);
  const [employmentStatus, setEmploymentStatus] = useState<any>('EMPLOYED_FULL_TIME');
  const [estimatedCreditScore, setEstimatedCreditScore] = useState<any>('EXCELLENT_750_PLUS');
  const [desiredLoanAmount, setDesiredLoanAmount] = useState<number>(65000);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border-white/15 bg-[#0b101d] max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {!result ? (
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Soft Credit Inquiries Only</span>
            </div>
            
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
              Instant Pre-Qualification
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Check your personalized financing power with zero impact on your credit bureau score.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control"
                    placeholder="Alexander"
                  />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-control"
                    placeholder="Wright"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="alex@example.com"
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="+1 (555) 012-3456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Gross Annual Income</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      required
                      min="10000"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                      className="form-control pl-7"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Desired Loan Size</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      required
                      min="5000"
                      value={desiredLoanAmount}
                      onChange={(e) => setDesiredLoanAmount(Number(e.target.value))}
                      className="form-control pl-7"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Employment Status</label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value as any)}
                    className="form-control"
                  >
                    <option value="EMPLOYED_FULL_TIME">Employed Full-Time</option>
                    <option value="EMPLOYED_PART_TIME">Employed Part-Time</option>
                    <option value="SELF_EMPLOYED">Self-Employed / Business Owner</option>
                    <option value="RETIRED">Retired / Investments</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Estimated Credit Score</label>
                  <select
                    value={estimatedCreditScore}
                    onChange={(e) => setEstimatedCreditScore(e.target.value as any)}
                    className="form-control"
                  >
                    <option value="EXCELLENT_750_PLUS">Excellent (750+)</option>
                    <option value="GOOD_700_749">Good (700 - 749)</option>
                    <option value="FAIR_640_699">Fair (640 - 699)</option>
                    <option value="BELOW_640">Building Credit (&lt; 640)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-pill btn-cyan w-full py-3.5 font-bold text-sm shadow-lg shadow-cyan-500/25"
                >
                  {loading ? 'Evaluating Pre-Qualification...' : 'Check My Pre-Approval Now'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-4 text-cyan-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block mb-1">
              Pre-Approval Confirmed
            </span>
            <h3 className="font-display font-extrabold text-3xl text-white mb-2">
              You are Pre-Approved!
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Congratulations! Your estimated financing profile qualifies for our prime luxury rate tiers.
            </p>

            <div className="glass-panel p-5 rounded-xl border-cyan-500/30 bg-cyan-950/20 text-left space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Pre-Approval Code</span>
                <span className="font-mono font-bold text-cyan-300 text-base">{result.preApprovalReferenceCode}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Max Eligible Amount</span>
                <span className="font-bold text-white text-lg">${result.maxEligibleAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Estimated APR Range</span>
                <span className="font-semibold text-cyan-400">{result.estimatedAprFrom}% - {result.estimatedAprTo}%</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-white/10">
                <span>Offer Valid Until</span>
                <span>{result.validUntil}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onClose();
                  onProceedToApplication();
                }}
                className="btn-pill btn-cyan flex-1 py-3 text-sm font-bold flex items-center justify-center space-x-2"
              >
                <span>Proceed to Formal Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="btn-pill btn-outline py-3 px-6 text-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

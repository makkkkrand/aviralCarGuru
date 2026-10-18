import React, { useState } from 'react';
import { apiClient, PreQualificationResponse } from '../api/client';
import { formatINR, formatINRLakhCrore } from '../utils/formatters';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Check } from 'lucide-react';

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
  const [firstName, setFirstName] = useState('Aarav');
  const [lastName, setLastName] = useState('Sharma');
  const [email, setEmail] = useState('aarav.sharma@carguru.in');
  const [phone, setPhone] = useState('+91 98201 92830');
  const [annualIncome, setAnnualIncome] = useState<number>(3600000); // 36 Lakh/year
  const [employmentStatus, setEmploymentStatus] = useState<any>('EMPLOYED_FULL_TIME');
  const [estimatedCreditScore, setEstimatedCreditScore] = useState<any>('EXCELLENT_750_PLUS');
  const [desiredLoanAmount, setDesiredLoanAmount] = useState<number>(2000000); // 20 Lakh loan

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg p-6 rounded-xl border border-slate-200 bg-white max-h-[90vh] overflow-y-auto relative shadow-xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>

        {result ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold mb-0.5">
                CarGuru Bureau Assessment Approved
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">
                Pre-Approved for Vehicle Loan
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Based on your self-reported profile, you qualify for subsidized Tier-1 auto finance rates across our Indian banking syndicates.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Pre-Approval Code</span>
                <span className="font-mono font-bold text-slate-900">{result.preApprovalReferenceCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Maximum Eligible Loan</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  {formatINR(result.maxEligibleAmount)} ({formatINRLakhCrore(result.maxEligibleAmount)})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Indicative APR Range</span>
                <span className="font-semibold text-slate-900 tabular-nums">{result.estimatedAprFrom}% - {result.estimatedAprTo}% p.a.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Sanction Validity</span>
                <span className="text-slate-700 font-medium">{result.validUntil}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToApplication();
                }}
                className="flex-1 py-2 px-3 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <span>Proceed to Formal Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center space-x-1.5 text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>CarGuru Soft-Pull Bureau Pre-Qualification</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Instant Auto Loan Eligibility Check
              </h2>
              <p className="text-xs text-slate-600">
                Check your eligible loan sanction and indicative EMI before dealership negotiations with zero impact on your CIBIL score.
              </p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Mobile Phone (India)</label>
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
                <label className="text-slate-600 font-medium block mb-1">CIBIL Score Band</label>
                <select
                  value={estimatedCreditScore}
                  onChange={(e) => setEstimatedCreditScore(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                >
                  <option value="EXCELLENT_750_PLUS">Prime CIBIL 775+ (Lowest Rates)</option>
                  <option value="GOOD_700_749">Good CIBIL 725-774</option>
                  <option value="FAIR_640_699">Standard CIBIL 675-724</option>
                  <option value="BUILDING_UNDER_640">Below 675 / First-Time Buyer</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Employment Status</label>
                <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                >
                  <option value="EMPLOYED_FULL_TIME">Salaried Professional</option>
                  <option value="SELF_EMPLOYED">Business Owner / Partner</option>
                  <option value="RETIRED">Professional / Private Fleet</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Gross Annual Income (INR)</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatINRLakhCrore(annualIncome)}</span>
                </div>
                <input
                  type="number"
                  min="300000"
                  step="100000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 tabular-nums"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Desired Vehicle Loan Amount (INR)</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatINRLakhCrore(desiredLoanAmount)}</span>
                </div>
                <input
                  type="number"
                  min="200000"
                  step="100000"
                  value={desiredLoanAmount}
                  onChange={(e) => setDesiredLoanAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 tabular-nums"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                {loading ? 'Evaluating Bureau Parameters...' : 'Check Pre-Qualification'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

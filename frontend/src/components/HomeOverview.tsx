import React, { useState, useEffect } from 'react';
import { apiClient, VehicleSummary } from '../api/client';
import { formatINRLakhCrore, formatINR } from '../utils/formatters';
import { ArrowRight, Calculator, FileCheck, ShieldCheck, ChevronRight, CheckCircle2, HelpCircle, RefreshCw, Zap, Truck, Car, Percent, FileText, User, Building2, Check, Sparkles, TrendingUp, Award, Clock } from 'lucide-react';

interface HomeOverviewProps {
  onNavigate: (page: string) => void;
  onSelectVehicleForFinancing: (vehicle: VehicleSummary) => void;
  onOpenTestDrive: (vehicleId?: string) => void;
  onOpenChecklistModal?: (category?: 'salaried' | 'self_employed' | 'used_car' | 'commercial') => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  onNavigate,
  onSelectVehicleForFinancing,
  onOpenTestDrive,
  onOpenChecklistModal,
}) => {
  const [featuredVehicles, setFeaturedVehicles] = useState<VehicleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick interactive hero estimator
  const [quickLoanAmount, setQuickLoanAmount] = useState<number>(2000000); // 20 Lakhs
  const [quickTenure, setQuickTenure] = useState<number>(60); // 5 Years

  // Approximate EMI calculation for the hero preview: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateQuickEmi = (p: number, months: number, annualRate = 8.49) => {
    const r = annualRate / 100 / 12;
    const factor = Math.pow(1 + r, months);
    return Math.round((p * (r * factor)) / (factor - 1));
  };

  const quickEmi = calculateQuickEmi(quickLoanAmount, quickTenure);

  useEffect(() => {
    apiClient.lookupVehicles('', '', 3)
      .then((res) => setFeaturedVehicles(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-16 pb-20 space-y-16">
      
      {/* 1. Hero Section: Executive Slate Grid Background with Live EMI Estimator & Trust Badges */}
      <section className="bg-hero-grid text-white border-b border-slate-800 relative overflow-hidden py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Mission & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-800/80 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>CarGuru India · Nationwide Vehicle Finance &amp; Loan Advisory</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Any Vehicle. Any State.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                  Preferential Auto Financing &amp; Advisory.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                CarGuru India bridges prospective vehicle owners, enterprises, and fleet operators with India’s leading lending syndicates. Enjoy starting rates from <strong className="text-emerald-400 font-semibold">8.49% p.a.</strong>, zero-impact CIBIL checks, transparent state RTO calculation, and dedicated advisory desks for all 28 Indian states.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('calculator')}
                  className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all rounded-lg font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-98"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Launch EMI Calculator</span>
                </button>
                <button
                  onClick={() => onNavigate('concierge')}
                  className="flex items-center space-x-2 px-5 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all rounded-lg font-medium text-xs backdrop-blur-sm"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span>Free Loan Consultation</span>
                </button>
                {onOpenChecklistModal && (
                  <button
                    onClick={() => onOpenChecklistModal('salaried')}
                    className="flex items-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all rounded-lg font-medium text-xs backdrop-blur-sm"
                  >
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>Document Checklist</span>
                  </button>
                )}
              </div>

              {/* Partner Banks Strip */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2.5">
                  Lending Consortium &amp; Banking Partners
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono">
                  <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">HDFC Bank</span>
                  <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">ICICI Bank</span>
                  <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">SBI Wealth</span>
                  <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">Kotak Mahindra</span>
                  <span className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-700/60">Axis Bank</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick-EMI Estimator Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Instant Loan Estimator
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800/80 font-mono font-semibold">
                    8.49% Prime APR
                  </span>
                </div>

                {/* Amount Selection */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-400 font-medium">Desired Loan Amount</span>
                    <span className="text-white font-bold font-mono text-sm">{formatINRLakhCrore(quickLoanAmount)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[1000000, 2000000, 3500000, 5000000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setQuickLoanAmount(amt)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors border ${
                          quickLoanAmount === amt
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {formatINRLakhCrore(amt)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min={300000}
                    max={10000000}
                    step={100000}
                    value={quickLoanAmount}
                    onChange={(e) => setQuickLoanAmount(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Tenure Selection */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-400 font-medium">Repayment Tenure</span>
                    <span className="text-white font-bold font-mono text-sm">{quickTenure} Months ({(quickTenure / 12).toFixed(0)} Yrs)</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[36, 48, 60, 84].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setQuickTenure(m)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors border ${
                          quickTenure === m
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {m} Mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimated Monthly EMI Output */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                    Estimated Monthly Repayment (EMI)
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                      {formatINR(quickEmi)}
                      <span className="text-xs text-slate-400 font-normal ml-1">/ month</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">Includes Principal &amp; Interest</span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => onNavigate('calculator')}
                    className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors text-center shadow-md active:scale-98"
                  >
                    Customize with State Taxes &rarr;
                  </button>
                  <button
                    onClick={() => onNavigate('apply')}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg border border-slate-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* National Coverage Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80 text-center">
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">₹4,850+ Cr</div>
              <div className="text-xs text-slate-300 mt-0.5">Nationwide Loan Volume</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">28 States &amp; UTs</div>
              <div className="text-xs text-slate-300 mt-0.5">750+ Registered RTOs</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
              <div className="text-xl sm:text-2xl font-bold text-sky-400 font-mono">24 - 48 Hrs</div>
              <div className="text-xs text-slate-300 mt-0.5">Average Sanction Speed</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">100% On-Road</div>
              <div className="text-xs text-slate-300 mt-0.5">Available Funding Option</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Portal Showcase: Customer vs Admin/Analyst separation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full text-indigo-300">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enterprise Architecture · Categorized Portals</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Two Purpose-Built Interfaces in One Ecosystem
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Experience seamless separation between customer-facing loan discovery and banking underwriter/analyst administration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-indigo-500/20 active:scale-98"
              >
                <span>Open Admin &amp; Analyst Desk &rarr;</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            {/* Normal User Scope */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  Normal Customer &amp; Buyer Tools
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Public Client
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Browse luxury, EV, SUV, and commercial fleets, run instant multi-tier EMI estimations, verify document checklists for salaried vs business owners, and submit 4-stage loan applications with real-time tracking.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">EMI Calculator</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Pre-Qualification</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Document Checklist</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Loan Application</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Status Tracker</span>
              </div>
            </div>

            {/* Admin / Analyst Scope */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  Admin, Underwriter &amp; Analyst Portal
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/30">
                  Internal Staff
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Credit risk underwriting desk to sanction/reject applications, verify KYC &amp; salary documents, manage advisory leads CRM, dispatch test drive showroom slots, and inspect portfolio risk KPIs.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/60">Underwriting Desk</span>
                <span className="text-[10px] bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/60">Document Verification</span>
                <span className="text-[10px] bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/60">Leads CRM</span>
                <span className="text-[10px] bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/60">Portfolio Analytics</span>
                <span className="text-[10px] bg-indigo-950/80 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/60">Antigravity Prompts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Vehicle Financing Categories (Comprehensive Business Scope) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 mb-2">
              <Car className="w-3.5 h-3.5 text-slate-700" />
              <span>Full Automotive Financing Spectrum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              What Kind of Vehicle Are You Financing?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              From personal daily commuters to heavy commercial haulers and high-voltage electric fleets, explore structured loan options tailored for each category.
            </p>
          </div>
          <button
            onClick={() => onNavigate('concierge')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors shadow-xs shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Consult a Vehicle Finance Guru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. New Passenger Cars */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">New Car &amp; SUV Loans</h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">From 8.49%</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Up to 100% on-road funding for all major automotive brands across India (Mahindra, Tata, Toyota, Hyundai, Honda, Maruti Suzuki, Skoda). Includes ex-showroom, RTO road taxes, and insurance.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('calculator')}
                className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center space-x-1 transition-colors"
              >
                <span>Calculate EMI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onOpenChecklistModal && (
                <button
                  type="button"
                  onClick={() => onOpenChecklistModal('salaried')}
                  className="text-[11px] text-slate-500 hover:text-slate-900 underline"
                >
                  Required Docs
                </button>
              )}
            </div>
          </div>

          {/* 2. Electric Vehicles (EV) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Electric Vehicle (EV) Financing</h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Green Concession</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Concessional Green Auto Loans with special interest discounts (from 8.25% p.a.) and central/state subsidy advisory for Tata EV, Hyundai IONIQ, BYD, and premium electric sedans.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('calculator')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 transition-colors"
              >
                <span>Explore Green EMI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('concierge')}
                className="text-[11px] text-slate-500 hover:text-slate-900 underline"
              >
                Subsidy Guide
              </button>
            </div>
          </div>

          {/* 3. Used & Certified Pre-Owned */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Used &amp; Certified Pre-Owned</h3>
                <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Quick Valuation</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Financing up to 90% of market value for verified pre-owned cars from authorized dealerships or private sellers. Valuation checks and RTO ownership transfer assistance included.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('concierge')}
                className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center space-x-1 transition-colors"
              >
                <span>Used Car Loan Advisory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onOpenChecklistModal && (
                <button
                  type="button"
                  onClick={() => onOpenChecklistModal('used_car')}
                  className="text-[11px] text-slate-500 hover:text-slate-900 underline"
                >
                  Used Car Docs
                </button>
              )}
            </div>
          </div>

          {/* 4. Loan Balance Transfer */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Percent className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Loan Balance Transfer</h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Reduce EMI</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Paying high interest on your existing auto loan? Transfer your loan balance to prime rates (from 8.49%) and unlock additional top-up cash with zero hassle.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('concierge')}
                className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center space-x-1 transition-colors"
              >
                <span>Calculate Balance Savings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-emerald-700 font-medium">Save up to ₹1.2L</span>
            </div>
          </div>

          {/* 5. Commercial Vehicle & Fleet */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Commercial &amp; Fleet Finance</h3>
                <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Corporate Rates</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Structured business credit lines for corporate employee fleets, tourism coaches, cargo logistics, and light commercial vehicles with seasonal repayment terms.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('concierge')}
                className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center space-x-1 transition-colors"
              >
                <span>Request Fleet Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onOpenChecklistModal && (
                <button
                  type="button"
                  onClick={() => onOpenChecklistModal('commercial')}
                  className="text-[11px] text-slate-500 hover:text-slate-900 underline"
                >
                  Fleet Docs
                </button>
              )}
            </div>
          </div>

          {/* 6. Unbiased Free Consultation Desk */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-3.5 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
                <Sparkles className="w-3 h-3" />
                <span>Zero Obligation Advisory</span>
              </div>
              <h3 className="text-base font-bold text-white">CarGuru Advisory Desk</h3>
              <p className="text-xs text-slate-300 leading-normal">
                Speak directly with certified automotive financial advisors. We evaluate loan tenure, bank comparison, tax write-offs, and CIBIL optimization free of cost.
              </p>
            </div>
            <button
              onClick={() => onNavigate('concierge')}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-all text-center shadow-xs active:scale-98"
            >
              Book Free Consultation Call
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Vehicle Fleet Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Available Fleet</div>
            <h2 className="text-2xl font-bold text-slate-900">Popular Models &amp; Vehicles</h2>
          </div>
          <button
            onClick={() => onNavigate('fleet')}
            className="flex items-center space-x-1 text-xs font-medium text-slate-900 hover:text-slate-700 transition-colors"
          >
            <span>Browse Full National Inventory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <div
                key={vehicle.vehicleId}
                className="rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-xs">
                      {vehicle.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-xs text-slate-500 font-medium mb-1">
                      {vehicle.year} · {vehicle.make}
                    </div>

                    <h3 className="font-semibold text-lg text-slate-900 mb-0.5">
                      {vehicle.model}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4">{vehicle.trim}</p>

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <div className="text-[11px] font-medium text-slate-500 uppercase">Ex-Showroom Price</div>
                        <div className="text-lg font-bold text-slate-900 tabular-nums font-mono">
                          {formatINRLakhCrore(vehicle.baseMSRP)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-medium text-slate-500 uppercase">Loan Rate</div>
                        <div className="text-sm font-semibold text-emerald-700 tabular-nums">8.49% p.a.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <button
                    onClick={() => onSelectVehicleForFinancing(vehicle)}
                    className="flex-1 py-2.5 px-3 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors text-center shadow-xs"
                  >
                    Calculate EMI
                  </button>
                  <button
                    onClick={() => onOpenTestDrive(vehicle.vehicleId)}
                    className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition-colors"
                  >
                    Test Drive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Required Loan Documents Guide (Salaried vs Self-Employed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Clear Lending Guidelines · Zero Disbursal Delays</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Required Documents Checklist for Auto Loans
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-normal">
                Avoid back-and-forth bank queries. Review the exact paperwork required by Indian lending syndicates (HDFC, ICICI, SBI, Kotak, Axis) tailored to your borrower profile.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {onOpenChecklistModal && (
                <button
                  type="button"
                  onClick={() => onOpenChecklistModal('salaried')}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Interactive Checklist</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('documents')}
                className="flex items-center space-x-1 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium transition-colors"
              >
                <span>View Full Documents Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Salaried Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                    <User className="w-3.5 h-3.5 text-slate-700" />
                    <span>Salaried Individuals</span>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded">MNC / Govt</span>
                </div>
                <ul className="text-xs space-y-1.5 text-slate-600 my-2">
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>PAN Card &amp; Aadhaar Card</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Latest 3 Months Salary Pay Slips</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Last 6 Months Salary Bank Account</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Form 16 or 2 Years ITR V</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenChecklistModal ? onOpenChecklistModal('salaried') : onNavigate('documents')}
                className="mt-3 text-[11px] font-semibold text-slate-900 hover:text-slate-700 underline text-left"
              >
                Check Salaried Checklist &rarr;
              </button>
            </div>

            {/* Self-Employed Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                    <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    <span>Self-Employed / Business</span>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded">Proprietor / Pvt Ltd</span>
                </div>
                <ul className="text-xs space-y-1.5 text-slate-600 my-2">
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>PAN Card &amp; Entity GST Certificate</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>2 Years Audited Financials &amp; ITR</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Computation of Income &amp; Balance Sheet</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>12 Months Current Bank Account</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenChecklistModal ? onOpenChecklistModal('self_employed') : onNavigate('documents')}
                className="mt-3 text-[11px] font-semibold text-slate-900 hover:text-slate-700 underline text-left"
              >
                Check Business Checklist &rarr;
              </button>
            </div>

            {/* Pre-Owned & Refinance Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                    <Car className="w-3.5 h-3.5 text-slate-700" />
                    <span>Pre-Owned &amp; Refinance</span>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded">Used Car</span>
                </div>
                <ul className="text-xs space-y-1.5 text-slate-600 my-2">
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Buyer &amp; Seller KYC Documentation</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Original Vehicle Registration (RC)</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Active Comprehensive Insurance</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>RTO Form 29 &amp; 30 / Foreclosure Letter</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenChecklistModal ? onOpenChecklistModal('used_car') : onNavigate('documents')}
                className="mt-3 text-[11px] font-semibold text-slate-900 hover:text-slate-700 underline text-left"
              >
                Check Used Car Checklist &rarr;
              </button>
            </div>

            {/* Commercial & Fleet Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900">
                    <Truck className="w-3.5 h-3.5 text-slate-700" />
                    <span>Commercial &amp; Fleet</span>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded">Logistics</span>
                </div>
                <ul className="text-xs space-y-1.5 text-slate-600 my-2">
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Entity Registration &amp; Partner KYC</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Commercial Driving Permit / Badge</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>12 Months Revenue Bank Statements</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>Client Transport Contracts (Optional)</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onOpenChecklistModal ? onOpenChecklistModal('commercial') : onNavigate('documents')}
                className="mt-3 text-[11px] font-semibold text-slate-900 hover:text-slate-700 underline text-left"
              >
                Check Fleet Checklist &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Three-Step Financing & Advisory Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="max-w-xl mb-6">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">How CarGuru Works</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Vehicle Financing in 3 Easy Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-500">01 / CALCULATION</div>
              <h3 className="text-base font-semibold text-slate-900">Model EMI &amp; State Taxes</h3>
              <p className="text-xs text-slate-600 leading-normal">
                Choose any vehicle segment, calibrate down payment, and calculate exact monthly EMIs with real-time state RTO road taxes included.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-500">02 / CONSULTATION</div>
              <h3 className="text-base font-semibold text-slate-900">Expert Advice &amp; Sanction</h3>
              <p className="text-xs text-slate-600 leading-normal">
                Submit your enquiry or apply online. A CarGuru advisor matches your application with the lowest interest bank partner for instant approval.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-500">03 / DISBURSAL</div>
              <h3 className="text-base font-semibold text-slate-900">Doorstep Document Handover</h3>
              <p className="text-xs text-slate-600 leading-normal">
                Upload your KYC online. Loan disbursements are settled directly with dealers or sellers with complimentary doorstep registration service.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

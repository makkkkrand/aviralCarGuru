import React, { useState, useEffect } from 'react';
import { apiClient, VehicleSummary } from '../api/client';
import { formatINRLakhCrore, formatINR } from '../utils/formatters';
import { ArrowRight, Calculator, Compass, FileCheck, ShieldCheck, ChevronRight, CheckCircle2, HelpCircle, RefreshCw, Zap, Truck, Car, Percent, FileText, User, Building2 } from 'lucide-react';

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

  useEffect(() => {
    apiClient.lookupVehicles('', '', 3)
      .then((res) => setFeaturedVehicles(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 pb-16 space-y-16">
      
      {/* 1. Hero Section: All Vehicle Financing in India */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pt-8 pb-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CarGuru India · Nationwide Vehicle Finance &amp; Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-snug mb-4">
            Comprehensive vehicle financing &amp; loan consultation across India.
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
            Whether you are financing a new car, electric vehicle, certified used automobile, luxury marque, or commercial fleet, CarGuru connects you to preferential interest rates (from 8.49% p.a.), instant CIBIL pre-qualification, and unbiased expert loan advisory across all 28 Indian states.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('calculator')}
              className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded-lg font-medium text-xs shadow-xs"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Vehicle EMI</span>
            </button>
            <button
              onClick={() => onNavigate('concierge')}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-colors rounded-lg font-medium text-xs"
            >
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span>Free Finance Consultation</span>
            </button>
            <button
              onClick={() => onNavigate('fleet')}
              className="flex items-center space-x-1.5 px-4 py-2.5 text-slate-700 hover:text-slate-900 font-medium text-xs transition-colors"
            >
              <span>Explore Vehicles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Core Value Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-slate-200">
          <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Starting Lending Rate</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Low APR</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1 tabular-nums">8.49% p.a.</div>
            <p className="text-xs text-slate-600 leading-normal">
              Tie-ups with India's premier auto loan lenders (HDFC, ICICI, SBI Wealth, Kotak, Axis Bank) with up to 100% on-road funding.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Bureau Assessment</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Zero Score Drop</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">Instant CIBIL Check</div>
            <p className="text-xs text-slate-600 leading-normal">
              Soft-pull credit verification in under 60 seconds. Know your eligible loan amount and EMI before visiting any dealership.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Vehicle Scope</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">All Categories</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">Any Vehicle Financed</div>
            <p className="text-xs text-slate-600 leading-normal">
              New passenger cars, electric SUVs, certified pre-owned, luxury models, balance transfer refinancing, and commercial fleets.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Vehicle Financing Categories (Broad Business Scope) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Vehicle Financing Spectrum</div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            What Kind of Vehicle Are You Financing?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
              <Car className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">New Car &amp; SUV Loans</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Up to 100% on-road funding for all major automobile brands in India (Mahindra, Tata, Toyota, Hyundai, Honda, Maruti Suzuki, Skoda). Starting 8.49% p.a.
            </p>
            <button
              onClick={() => onNavigate('calculator')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center space-x-1 pt-1"
            >
              <span>Calculate New Car EMI</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Electric Vehicle (EV) Financing</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Preferential Green Auto Loans with special interest concessions (from 8.25% p.a.) and central/state subsidy advisory for Tata, Hyundai, BYD, and premium EVs.
            </p>
            <button
              onClick={() => onNavigate('calculator')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center space-x-1 pt-1"
            >
              <span>Explore EV Loan Terms</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Used &amp; Certified Pre-Owned</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Financing for quality inspected pre-owned cars from authorized dealerships or private sellers. Valuation checks and RTO ownership transfer assistance included.
            </p>
            <button
              onClick={() => onNavigate('concierge')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center space-x-1 pt-1"
            >
              <span>Used Car Valuation &amp; Loan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
              <Percent className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Loan Balance Transfer &amp; Refinancing</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Paying high interest on your existing vehicle loan? Transfer your auto loan balance to lower rates and reduce monthly EMIs with top-up cash availability.
            </p>
            <button
              onClick={() => onNavigate('concierge')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center space-x-1 pt-1"
            >
              <span>Request Balance Transfer Advisory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Commercial Vehicle &amp; Fleet Finance</h3>
            <p className="text-xs text-slate-600 leading-normal">
              Customized credit lines for logistics operators, employee transport, cargo carriers, and luxury tour operators across India with flexible seasonal repayment options.
            </p>
            <button
              onClick={() => onNavigate('concierge')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center space-x-1 pt-1"
            >
              <span>Fleet Financing Consultation</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 rounded-xl bg-slate-100 border border-slate-200/90 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Free Consultation Desk</div>
              <h3 className="text-sm font-bold text-slate-900">Unbiased Vehicle Finance Advisory</h3>
              <p className="text-xs text-slate-600 leading-normal">
                Not sure whether to lease, take a 5-year loan, or transfer your existing balance? Talk to a certified CarGuru finance advisor today with zero obligations.
              </p>
            </div>
            <button
              onClick={() => onNavigate('concierge')}
              className="w-full py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors text-center shadow-xs"
            >
              Book Free Consultation
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
                className="rounded-xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
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
                        <div className="text-lg font-bold text-slate-900 tabular-nums">
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
                    className="flex-1 py-2 px-3 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors text-center shadow-xs"
                  >
                    Calculate EMI
                  </button>
                  <button
                    onClick={() => onOpenTestDrive(vehicle.vehicleId)}
                    className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition-colors"
                  >
                    Test Drive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Required Loan Documents Guide (Salaried vs Self-Employed) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200/90 shadow-xs">
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
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
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
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
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
                    <span>Personal + Enterprise PAN Cards</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>GST Registration &amp; 6M 3B Returns</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>2-3 Years ITR + Computation Sheet</span>
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
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
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
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
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

      {/* 4. Three-Step Financing & Advisory Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <div className="max-w-xl mb-6">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">How CarGuru Works</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Vehicle Financing in 3 Easy Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-500">01 / CALCULATION</div>
              <h3 className="text-base font-semibold text-slate-900">Model EMI &amp; State Taxes</h3>
              <p className="text-xs text-slate-600 leading-normal">
                Choose any vehicle segment, calibrate down payment, and calculate exact monthly EMIs with real-time state RTO road taxes included.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-500">02 / CONSULTATION</div>
              <h3 className="text-base font-semibold text-slate-900">Expert Advice &amp; Sanction</h3>
              <p className="text-xs text-slate-600 leading-normal">
                Submit your enquiry or apply online. A CarGuru advisor matches your application with the lowest interest bank partner for instant approval.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
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

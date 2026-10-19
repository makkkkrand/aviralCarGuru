import React, { useState, useEffect } from 'react';
import { apiClient, LoanCalculationResponse, VehicleSummary } from '../api/client';
import { formatINR, formatINRLakhCrore, INDIAN_STATES_RTO, INDIAN_BANK_PARTNERS } from '../utils/formatters';
import { Calculator, ArrowRight, ShieldCheck, HelpCircle, Check, Info, FileText } from 'lucide-react';

interface FinancingCalculatorProps {
  initialVehicle?: VehicleSummary | null;
  onApplyForLoan: (terms: {
    vehiclePrice: number;
    downPayment: number;
    tenureMonths: number;
    monthlyPayment: number;
    vehicleId?: string;
  }) => void;
  onPreQualify: () => void;
  onOpenChecklist?: () => void;
}

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({
  initialVehicle,
  onApplyForLoan,
  onPreQualify,
  onOpenChecklist,
}) => {
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicle?.vehicleId || 'custom');

  // Loan Category
  const [loanCategory, setLoanCategory] = useState<string>('NEW_CAR');

  const [vehiclePrice, setVehiclePrice] = useState<number>(initialVehicle?.baseMSRP || 2690000); // Default to a popular Indian SUV (XUV700 ₹26.9L)
  const [downPayment, setDownPayment] = useState<number>(538000); // 20%
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [creditTier, setCreditTier] = useState<string>('EXCELLENT');
  const [interestRateAnnual, setInterestRateAnnual] = useState<number>(8.49);

  // Indian State RTO selection
  const [selectedStateCode, setSelectedStateCode] = useState<string>('MH');
  const [salesTaxRate, setSalesTaxRate] = useState<number>(12.0);

  const [calculationResult, setCalculationResult] = useState<LoanCalculationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load vehicles for vehicle selector
  useEffect(() => {
    apiClient.lookupVehicles()
      .then((res) => setVehicles(res))
      .catch(() => {});
  }, []);

  // Update if initialVehicle prop changes
  useEffect(() => {
    if (initialVehicle) {
      setSelectedVehicleId(initialVehicle.vehicleId);
      setVehiclePrice(initialVehicle.baseMSRP);
      setDownPayment(Math.round(initialVehicle.baseMSRP * 0.20));
    }
  }, [initialVehicle]);

  // Handle loan category changes (New car, EV, Used, Commercial, Balance Transfer)
  const handleCategoryChange = (category: string) => {
    setLoanCategory(category);
    switch (category) {
      case 'EV':
        setInterestRateAnnual(8.25);
        break;
      case 'USED':
        setInterestRateAnnual(10.50);
        break;
      case 'COMMERCIAL':
        setInterestRateAnnual(9.75);
        break;
      case 'REFINANCE':
        setInterestRateAnnual(8.49);
        break;
      case 'NEW_CAR':
      default:
        setInterestRateAnnual(8.49);
    }
  };

  // Adjust APR based on CIBIL Tier
  const handleTierChange = (tier: string) => {
    setCreditTier(tier);
    const baseRate = loanCategory === 'EV' ? 8.25 : loanCategory === 'USED' ? 10.50 : loanCategory === 'COMMERCIAL' ? 9.75 : 8.49;
    switch (tier) {
      case 'EXCELLENT':
        setInterestRateAnnual(baseRate);
        break;
      case 'GOOD':
        setInterestRateAnnual(baseRate + 0.75);
        break;
      case 'FAIR':
        setInterestRateAnnual(baseRate + 1.75);
        break;
      case 'REBUILDING':
        setInterestRateAnnual(baseRate + 3.25);
        break;
      default:
        setInterestRateAnnual(baseRate);
    }
  };

  const handleStateChange = (code: string) => {
    setSelectedStateCode(code);
    const found = INDIAN_STATES_RTO.find((s) => s.code === code);
    if (found) {
      setSalesTaxRate(found.rtoRate);
    }
  };

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicleId(id);
    if (id === 'custom') return;
    const v = vehicles.find((x) => x.vehicleId === id);
    if (v) {
      setVehiclePrice(v.baseMSRP);
      setDownPayment(Math.round(v.baseMSRP * 0.20));
      const cat = (v.category || '').toLowerCase();
      const mod = (v.model || '').toLowerCase();
      if (cat.includes('electric') || mod.includes('ev')) {
        handleCategoryChange('EV');
      } else if (cat.includes('pre-owned')) {
        handleCategoryChange('USED');
      } else if (cat.includes('commercial')) {
        handleCategoryChange('COMMERCIAL');
      } else {
        handleCategoryChange('NEW_CAR');
      }
    }
  };

  // Run calculation via API
  useEffect(() => {
    const runCalculation = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.calculateLoan({
          vehiclePrice,
          downPayment,
          tradeInValue,
          interestRateAnnual,
          tenureMonths,
          salesTaxRate,
        });
        setCalculationResult(res);
      } catch (err: any) {
        setError(err.message || 'Calculation error');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      runCalculation();
    }, 120);

    return () => clearTimeout(timer);
  }, [vehiclePrice, downPayment, tradeInValue, interestRateAnnual, tenureMonths, salesTaxRate]);

  const downPaymentPercent = vehiclePrice > 0 ? Math.round((downPayment / vehiclePrice) * 100) : 0;

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="max-w-2xl mb-8">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            CarGuru India Auto Finance
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Vehicle Loan &amp; EMI Calculator
          </h1>
          <p className="text-sm text-slate-600 leading-normal">
            Calibrate financing for any vehicle: New Cars, Electric Vehicles, Certified Pre-Owned, Luxury Marque, or Commercial Fleets. Real-time Indian state RTO road taxes and amortization schedules included.
          </p>
        </div>

        {/* Loan Category Pills */}
        <div className="mb-6 p-1.5 bg-slate-100 rounded-xl inline-flex flex-wrap gap-1 border border-slate-200">
          {[
            { id: 'NEW_CAR', label: 'New Car / SUV (8.49%)' },
            { id: 'EV', label: 'Electric Vehicle (8.25%)' },
            { id: 'USED', label: 'Pre-Owned Car (10.50%)' },
            { id: 'COMMERCIAL', label: 'Commercial Fleet (9.75%)' },
            { id: 'REFINANCE', label: 'Balance Transfer / Refinance' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                loanCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. Vehicle & Amount Selection */}
            <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Select Model from Catalog or Enter Custom Amount
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                >
                  <option value="custom">Custom Vehicle Amount (₹ INR)</option>
                  {vehicles.map((v) => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.year} {v.make} {v.model} ({v.category}) — {formatINRLakhCrore(v.baseMSRP)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                  <span>Vehicle Ex-Showroom / Valuation Amount (INR)</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatINR(vehiclePrice)} ({formatINRLakhCrore(vehiclePrice)})
                  </span>
                </div>
                <input
                  type="number"
                  min="300000"
                  max="100000000"
                  step="100000"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 tabular-nums"
                />
                <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                  {[
                    { label: '₹8 Lakh (Hatch)', val: 800000 },
                    { label: '₹18 Lakh (Sedan/EV)', val: 1800000 },
                    { label: '₹27 Lakh (SUV)', val: 2690000 },
                    { label: '₹50 Lakh (Premium)', val: 5000000 },
                    { label: '₹1.5 Cr (Luxury)', val: 15000000 },
                    { label: '₹2.7 Cr (Supercar)', val: 27000000 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setVehiclePrice(preset.val);
                        setDownPayment(Math.round(preset.val * 0.20));
                        setSelectedVehicleId('custom');
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded transition-colors whitespace-nowrap"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Down Payment & Trade-In Valuation */}
            <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                  <span>Down Payment ({downPaymentPercent}% of Value)</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatINR(downPayment)} ({formatINRLakhCrore(downPayment)})
                  </span>
                </div>
                <div className="flex gap-2 mb-2">
                  {[0, 10, 15, 20, 25, 30, 40].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPayment(Math.round(vehiclePrice * (pct / 100)))}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        downPaymentPercent === pct
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {pct === 0 ? 'Zero Down' : `${pct}%`}
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="0"
                  max={vehiclePrice * 0.8}
                  step="50000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                  <span>Existing Car Trade-In / Exchange Allowance (INR)</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatINR(tradeInValue)}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="40000000"
                  step="100000"
                  value={tradeInValue}
                  onChange={(e) => setTradeInValue(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 tabular-nums"
                />
              </div>
            </div>

            {/* 3. Tenure, State RTO Tax & CIBIL */}
            <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                  <span>Loan Tenure</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {tenureMonths} Months ({tenureMonths / 12} Years)
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[12, 24, 36, 48, 60, 84].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-colors tabular-nums ${
                        tenureMonths === m
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {m} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* State RTO Selection */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                  <span>Vehicle Registration State &amp; RTO Rate</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{salesTaxRate}% RTO Tax</span>
                </div>
                <select
                  value={selectedStateCode}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                >
                  {INDIAN_STATES_RTO.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name} — {state.rtoRate}% RTO Tax
                    </option>
                  ))}
                </select>
              </div>

              {/* CIBIL Score Tier */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                  <span>CIBIL Score Tier &amp; Rate</span>
                  <span className="font-semibold text-emerald-700 tabular-nums">{interestRateAnnual}% p.a.</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'EXCELLENT', label: 'Prime 775+' },
                    { id: 'GOOD', label: 'Good 725-774' },
                    { id: 'FAIR', label: 'Standard 675-724' },
                    { id: 'REBUILDING', label: 'Below 675' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleTierChange(tier.id)}
                      className={`p-2 rounded-lg text-left transition-colors border text-xs ${
                        creditTier === tier.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`font-medium mb-0.5 ${creditTier === tier.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {tier.label}
                      </div>
                      <div className="font-bold tabular-nums">
                        {tier.id === creditTier ? `${interestRateAnnual}% p.a.` : 'Check Rate'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Calculated Results & Schedule (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Primary Payment Card */}
            <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Estimated Monthly EMI
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight tabular-nums flex items-baseline">
                  {calculationResult ? formatINR(calculationResult.monthlyPayment) : '---'}
                  <span className="text-xs text-slate-500 font-normal ml-2">/ month</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Net Sanctioned Loan Amount</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {calculationResult ? formatINR(calculationResult.netCapitalizedCost) : '---'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Estimated State RTO Tax ({salesTaxRate}%)</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {calculationResult ? formatINR(calculationResult.totalSalesTax) : '---'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Interest Payable</span>
                  <span className="font-semibold text-emerald-700 tabular-nums">
                    {calculationResult ? formatINR(calculationResult.totalInterest) : '---'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-semibold">
                  <span className="text-slate-800">Total On-Road Outlay</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {calculationResult ? formatINR(calculationResult.totalCost) : '---'}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    onApplyForLoan({
                      vehiclePrice,
                      downPayment,
                      tenureMonths,
                      monthlyPayment: calculationResult?.monthlyPayment || 0,
                      vehicleId: selectedVehicleId !== 'custom' ? selectedVehicleId : undefined,
                    });
                  }}
                  className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium text-xs rounded-lg flex items-center justify-center space-x-2 shadow-xs"
                >
                  <span>Apply for this Loan Structure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onPreQualify}
                  className="w-full py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Instant CIBIL Soft-Pull Check</span>
                </button>

                {onOpenChecklist && (
                  <button
                    onClick={onOpenChecklist}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Required Loan Documents</span>
                  </button>
                )}
              </div>

              {/* Banking Syndicate Logos / Names */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] text-slate-400 font-medium mb-1.5">Lending Partners:</div>
                <div className="flex flex-wrap gap-1.5">
                  {INDIAN_BANK_PARTNERS.map((bank) => (
                    <span key={bank.name} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-semibold text-slate-600">
                      {bank.logoText} · {bank.minApr}%
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Annual Amortization Table */}
            {calculationResult?.amortizationSchedule && calculationResult.amortizationSchedule.length > 0 && (
              <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <div className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-3">
                  Annual Amortization Schedule (INR)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 pb-2">
                        <th className="py-1.5 font-medium">Year</th>
                        <th className="py-1.5 font-medium text-right">Principal</th>
                        <th className="py-1.5 font-medium text-right">Interest</th>
                        <th className="py-1.5 font-medium text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {calculationResult.amortizationSchedule.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                          <td className="py-1.5 text-slate-700 font-medium">Yr {row.year}</td>
                          <td className="py-1.5 text-right text-slate-900 tabular-nums">
                            {formatINR(row.principalPaid)}
                          </td>
                          <td className="py-1.5 text-right text-emerald-700 tabular-nums">
                            {formatINR(row.interestPaid)}
                          </td>
                          <td className="py-1.5 text-right text-slate-600 tabular-nums">
                            {formatINR(row.remainingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

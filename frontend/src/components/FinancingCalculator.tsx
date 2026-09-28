import React, { useState, useEffect } from 'react';
import { apiClient, LoanCalculationResponse, VehicleSummary } from '../api/client';
import { Calculator, DollarSign, Calendar, Percent, TrendingDown, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

interface FinancingCalculatorProps {
  initialVehicle?: VehicleSummary | null;
  onApplyForLoan: (terms: { vehiclePrice: number; downPayment: number; tenureMonths: number; monthlyPayment: number; vehicleId?: string }) => void;
  onPreQualify: () => void;
}

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({
  initialVehicle,
  onApplyForLoan,
  onPreQualify,
}) => {
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicle?.vehicleId || 'custom');
  
  const [vehiclePrice, setVehiclePrice] = useState<number>(initialVehicle?.baseMSRP || 65000);
  const [downPayment, setDownPayment] = useState<number>(10000);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [creditTier, setCreditTier] = useState<string>('EXCELLENT');
  const [interestRateAnnual, setInterestRateAnnual] = useState<number>(3.99);
  const [salesTaxRate, setSalesTaxRate] = useState<number>(7.0);

  const [calculationResult, setCalculationResult] = useState<LoanCalculationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load vehicles for vehicle selector
  useEffect(() => {
    apiClient.lookupVehicles()
      .then(res => setVehicles(res))
      .catch(() => {});
  }, []);

  // Update if initialVehicle prop changes
  useEffect(() => {
    if (initialVehicle) {
      setSelectedVehicleId(initialVehicle.vehicleId);
      setVehiclePrice(initialVehicle.baseMSRP);
      setDownPayment(Math.round(initialVehicle.baseMSRP * 0.15));
    }
  }, [initialVehicle]);

  // Adjust APR based on Credit Tier
  const handleTierChange = (tier: string) => {
    setCreditTier(tier);
    switch (tier) {
      case 'EXCELLENT':
        setInterestRateAnnual(3.99);
        break;
      case 'GOOD':
        setInterestRateAnnual(5.49);
        break;
      case 'FAIR':
        setInterestRateAnnual(7.49);
        break;
      case 'REBUILDING':
        setInterestRateAnnual(10.99);
        break;
      default:
        setInterestRateAnnual(4.99);
    }
  };

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicleId(id);
    if (id === 'custom') return;
    const found = vehicles.find(v => v.vehicleId === id);
    if (found) {
      setVehiclePrice(found.baseMSRP);
      setDownPayment(Math.round(found.baseMSRP * 0.15));
    }
  };

  // Perform calculation
  const executeCalculation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.calculateLoan({
        vehiclePrice: Number(vehiclePrice),
        downPayment: Number(downPayment),
        tradeInValue: Number(tradeInValue),
        interestRateAnnual: Number(interestRateAnnual),
        tenureMonths: Number(tenureMonths),
        salesTaxRate: Number(salesTaxRate),
      });
      setCalculationResult(res);
    } catch (err: any) {
      setError(err.message || 'Calculation error');
    } finally {
      setLoading(false);
    }
  };

  // Auto-recalculate with a short debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      executeCalculation();
    }, 250);
    return () => clearTimeout(timer);
  }, [vehiclePrice, downPayment, tradeInValue, tenureMonths, interestRateAnnual, salesTaxRate]);

  return (
    <section id="financing-calculator" className="py-16">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-4 h-4" />
            <span>Interactive Auto Loan Estimator</span>
          </div>
          <h2 className="heading-hero text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            PRECISION <span className="text-cyan-400">FINANCING</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Configure vehicle price, down payment, and preferred loan tenure. Real-time amortization powered by the Velora Spring Boot Microservice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl space-y-6 bg-[#0a0f1d]/90">
            
            {/* Vehicle Selector */}
            <div>
              <label className="form-label flex items-center justify-between">
                <span>Select Vehicle from Fleet</span>
                <span className="text-cyan-400 text-xs lowercase">or choose custom</span>
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => handleVehicleSelect(e.target.value)}
                className="form-control bg-[#11192e] text-white"
              >
                <option value="custom">Custom Vehicle / Price</option>
                {vehicles.map((v) => (
                  <option key={v.vehicleId} value={v.vehicleId}>
                    {v.year} {v.make} {v.model} ({v.trim}) - ${v.baseMSRP.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Vehicle MSRP / Purchase Price</label>
                <span className="font-display font-bold text-xl text-white">
                  ${Number(vehiclePrice).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="250000"
                step="1000"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="mb-2"
              />
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">$10,000</span>
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Math.max(1000, Number(e.target.value)))}
                  className="form-control text-sm py-1.5 px-3"
                />
                <span className="text-xs text-slate-500">$250,000</span>
              </div>
            </div>

            {/* Down Payment & Trade-in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="form-label mb-0">Down Payment</label>
                  <span className="text-xs font-semibold text-cyan-400">
                    {vehiclePrice > 0 ? Math.round((downPayment / vehiclePrice) * 100) : 0}%
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
                    className="form-control pl-7 text-sm"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[10, 15, 20, 30].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPayment(Math.round(vehiclePrice * (pct / 100)))}
                      className="px-2 py-1 text-[11px] rounded bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Trade-in Allowance</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(Math.max(0, Number(e.target.value)))}
                    className="form-control pl-7 text-sm"
                    placeholder="0"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Deducted directly from capitalized cost</span>
              </div>
            </div>

            {/* Loan Tenure Selector */}
            <div>
              <label className="form-label">Financing Term</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[24, 36, 48, 60, 72, 84].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenureMonths(m)}
                    className={`py-2.5 px-3 rounded-xl text-center text-sm font-semibold transition-all border ${
                      tenureMonths === m
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-sm shadow-cyan-500/20'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {m} mos
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Score Tier */}
            <div>
              <label className="form-label">Credit Rating Tier</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { tier: 'EXCELLENT', label: 'Excellent (750+)', apr: '3.99%' },
                  { tier: 'GOOD', label: 'Good (700-749)', apr: '5.49%' },
                  { tier: 'FAIR', label: 'Fair (640-699)', apr: '7.49%' },
                  { tier: 'REBUILDING', label: 'Building (<640)', apr: '10.99%' },
                ].map((item) => (
                  <button
                    key={item.tier}
                    type="button"
                    onClick={() => handleTierChange(item.tier)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      creditTier === item.tier
                        ? 'bg-cyan-500/20 border-cyan-400/60 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-white">{item.label}</span>
                    <span className="text-[11px] text-cyan-400 font-mono">{item.apr} APR</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tax & APR Fine Tuning */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <label className="form-label">Est. Sales Tax (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={salesTaxRate}
                  onChange={(e) => setSalesTaxRate(Number(e.target.value))}
                  className="form-control text-sm"
                />
              </div>
              <div>
                <label className="form-label">Annual Percentage Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRateAnnual}
                  onChange={(e) => setInterestRateAnnual(Number(e.target.value))}
                  className="form-control text-sm"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Live Estimate Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 bg-gradient-to-b from-[#0d162a]/90 to-[#070b15]/95 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Estimated Monthly Payment
              </span>

              {/* Monthly EMI Display */}
              <div className="flex items-baseline space-x-2 my-2">
                <span className="text-5xl sm:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                  ${calculationResult?.monthlyPayment ? calculationResult.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </span>
                <span className="text-slate-400 font-medium text-sm">/ month</span>
              </div>

              <p className="text-xs text-slate-400 mb-6">
                Based on {tenureMonths} month term at {interestRateAnnual}% APR with ${downPayment.toLocaleString()} down.
              </p>

              {/* Financial Breakdown Table */}
              <div className="space-y-3 py-4 border-y border-white/10 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Financed Amount (Cap. Cost)</span>
                  <span className="font-semibold text-white">
                    ${calculationResult?.netCapitalizedCost ? calculationResult.netCapitalizedCost.toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Estimated Total Sales Tax</span>
                  <span className="font-semibold text-white">
                    ${calculationResult?.totalSalesTax ? calculationResult.totalSalesTax.toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Finance Interest</span>
                  <span className="font-semibold text-cyan-400">
                    ${calculationResult?.totalInterest ? calculationResult.totalInterest.toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300 font-medium pt-2 border-t border-white/5">
                  <span className="text-white">Total Out-of-Pocket Cost</span>
                  <span className="font-bold text-white">
                    ${calculationResult?.totalCost ? calculationResult.totalCost.toLocaleString() : '0'}
                  </span>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => onApplyForLoan({
                    vehiclePrice,
                    downPayment,
                    tenureMonths,
                    monthlyPayment: calculationResult?.monthlyPayment || 0,
                    vehicleId: selectedVehicleId !== 'custom' ? selectedVehicleId : undefined,
                  })}
                  className="btn-pill btn-cyan w-full py-3.5 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25"
                >
                  <span>Apply with these Loan Terms</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onPreQualify}
                  className="btn-pill btn-outline w-full py-3 text-xs flex items-center justify-center space-x-2"
                >
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Check Instant Pre-Qualification (Soft Pull)</span>
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              )}
            </div>

            {/* Amortization Year Breakdown Card */}
            {calculationResult?.amortizationSchedule && calculationResult.amortizationSchedule.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                  <span>Amortization Schedule Overview</span>
                  <span className="text-cyan-400 font-normal lowercase">{tenureMonths / 12} Years</span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {calculationResult.amortizationSchedule.map((item) => (
                    <div
                      key={item.year}
                      className="p-2.5 rounded-lg bg-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-300">Year {item.year}</span>
                      <div className="text-right">
                        <span className="text-cyan-400 font-medium">Principal: ${item.principalPaid.toLocaleString()}</span>
                        <span className="text-slate-400 ml-2">Int: ${item.interestPaid.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

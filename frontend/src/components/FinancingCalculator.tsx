import React, { useState, useEffect } from 'react';
import { apiClient, LoanCalculationResponse, VehicleSummary } from '../api/client';
import { 
  Calculator, 
  DollarSign, 
  Calendar, 
  Percent, 
  TrendingDown, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';

interface FinancingCalculatorProps {
  initialVehicle?: VehicleSummary | null;
  onApplyForLoan: (terms: { 
    vehiclePrice: number; 
    downPayment: number; 
    tenureMonths: number; 
    monthlyPayment: number; 
    vehicleId?: string 
  }) => void;
  onPreQualify: () => void;
}

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({
  initialVehicle,
  onApplyForLoan,
  onPreQualify,
}) => {
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicle?.vehicleId || 'custom');
  
  const [vehiclePrice, setVehiclePrice] = useState<number>(initialVehicle?.baseMSRP || 98500);
  const [downPayment, setDownPayment] = useState<number>(15000);
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
      setError(err.message || 'Calculation error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Auto-recalculate with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      executeCalculation();
    }, 200);
    return () => clearTimeout(timer);
  }, [vehiclePrice, downPayment, tradeInValue, tenureMonths, interestRateAnnual, salesTaxRate]);

  return (
    <section id="financing-calculator" className="py-20 relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[400px] bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-4 h-4" />
            <span>Interactive Auto Loan Studio</span>
          </div>
          <h2 className="heading-hero text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            PRECISION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">FINANCING</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Configure vehicle price, down payment, and preferred loan tenure. Real-time amortization powered by the Velora Spring Boot Microservice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl space-y-6 bg-[#090d19]/90 border-white/10 shadow-2xl">
            
            {/* Vehicle Selector */}
            <div>
              <label className="form-label flex items-center justify-between">
                <span>Select Fleet Model</span>
                <span className="text-cyan-400 text-[11px] lowercase font-mono">or enter custom MSRP</span>
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => handleVehicleSelect(e.target.value)}
                className="form-control bg-[#11192e] text-white border-white/15 focus:border-cyan-400 font-medium"
              >
                <option value="custom">Custom Vehicle / Manual Specification</option>
                {vehicles.map((v) => (
                  <option key={v.vehicleId} value={v.vehicleId}>
                    {v.year} {v.make} {v.model} ({v.trim}) — ${v.baseMSRP.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Price Slider & Input */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <label className="form-label mb-0">Vehicle MSRP / Purchase Price</label>
                <span className="font-display font-black text-2xl text-white">
                  ${Number(vehiclePrice).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="300000"
                step="1000"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="mb-3"
              />
              <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                <span>$15,000</span>
                <span>$150,000</span>
                <span>$300,000</span>
              </div>
            </div>

            {/* Down Payment & Trade-In Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Down Payment */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label mb-0">Down Payment</label>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {Math.round((downPayment / (vehiclePrice || 1)) * 100)}%
                  </span>
                </div>
                <div className="relative mb-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
                    className="form-control pl-8 py-2 font-mono text-white text-base"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(10000, vehiclePrice * 0.7)}
                  step="500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                />
              </div>

              {/* Trade-in Value */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <label className="form-label mb-0">Trade-In Equity</label>
                  <span className="text-[11px] text-slate-400 font-mono">Optional</span>
                </div>
                <div className="relative mb-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(Math.max(0, Number(e.target.value)))}
                    className="form-control pl-8 py-2 font-mono text-white text-base"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={tradeInValue}
                  onChange={(e) => setTradeInValue(Number(e.target.value))}
                />
              </div>

            </div>

            {/* Loan Tenure Selector */}
            <div>
              <label className="form-label">Loan Duration (Months)</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[24, 36, 48, 60, 72, 84].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenureMonths(m)}
                    className={`py-3 rounded-xl text-xs font-bold font-mono transition-all border ${
                      tenureMonths === m
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/30'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {m} Mo
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Score Tier Selector */}
            <div>
              <label className="form-label">Credit Profile / Rating</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { tier: 'EXCELLENT', label: '740+ Tier 1', apr: '3.99%' },
                  { tier: 'GOOD', label: '680-739 Good', apr: '5.49%' },
                  { tier: 'FAIR', label: '620-679 Fair', apr: '7.49%' },
                  { tier: 'REBUILDING', label: 'Sub-Prime', apr: '10.99%' },
                ].map((item) => (
                  <button
                    key={item.tier}
                    type="button"
                    onClick={() => handleTierChange(item.tier)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      creditTier === item.tier
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/15'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[11px] font-bold block">{item.label}</span>
                    <span className="text-sm font-mono font-extrabold text-white">{item.apr}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Live Amortization Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-panel p-8 rounded-3xl border-cyan-500/30 bg-gradient-to-b from-[#0b1426] to-[#060911] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">
                    Estimated Payment
                  </span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="font-display font-black text-5xl sm:text-6xl text-white">
                      ${calculationResult?.monthlyPayment ? Math.round(calculationResult.monthlyPayment).toLocaleString() : '---'}
                    </span>
                    <span className="text-slate-400 text-sm font-semibold">/mo</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                    {interestRateAnnual}% APR
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown Items */}
              <div className="py-6 space-y-3.5 border-b border-white/10 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Total Vehicle Price:</span>
                  <span className="font-bold text-white">${Number(vehiclePrice).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Down Payment & Trade:</span>
                  <span className="font-bold text-emerald-400">-${(Number(downPayment) + Number(tradeInValue)).toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Sales Tax (Est. {salesTaxRate}%):</span>
                  <span className="font-bold text-slate-200">
                    +${calculationResult?.totalSalesTax ? Math.round(calculationResult.totalSalesTax).toLocaleString() : '---'}
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Net Capitalized Cost:</span>
                  <span className="font-bold text-white">
                    ${calculationResult?.netCapitalizedCost ? Math.round(calculationResult.netCapitalizedCost).toLocaleString() : '---'}
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Estimated Total Interest:</span>
                  <span className="font-bold text-cyan-300">
                    +${calculationResult?.totalInterest ? Math.round(calculationResult.totalInterest).toLocaleString() : '---'}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="text-slate-200 font-sans font-bold">Total Cost of Loan:</span>
                  <span className="font-bold text-white font-mono">
                    ${calculationResult?.totalCost ? Math.round(calculationResult.totalCost).toLocaleString() : '---'}
                  </span>
                </div>
              </div>

              {/* Loan Actions */}
              <div className="pt-6 space-y-3">
                <button
                  onClick={() => onApplyForLoan({
                    vehiclePrice,
                    downPayment,
                    tenureMonths,
                    monthlyPayment: calculationResult?.monthlyPayment || 0,
                    vehicleId: selectedVehicleId !== 'custom' ? selectedVehicleId : undefined,
                  })}
                  className="btn-pill btn-cyan w-full py-4 text-xs font-bold shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2"
                >
                  <span>Apply with These Terms</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onPreQualify}
                  className="btn-pill btn-outline w-full py-3.5 text-xs font-bold border-white/15 hover:border-cyan-400 text-slate-200"
                >
                  Instant Soft Pre-Qualification
                </button>
              </div>

              <div className="mt-6 flex items-center space-x-2 text-[11px] text-slate-400 justify-center">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Calculated via Velora Banking API • 256-Bit SSL Protection</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

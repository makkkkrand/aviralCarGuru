import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Calculator, 
  Flame, 
  Gauge, 
  ChevronRight,
  Award,
  Layers
} from 'lucide-react';

interface HeroProps {
  onExploreFleet: () => void;
  onOpenCalculator: () => void;
  onPreQualify: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreFleet, onOpenCalculator, onPreQualify }) => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Dynamic Ambient Luxury Lighting Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[140px] pointer-events-none rounded-full animate-ambient" />
      <div className="absolute top-1/3 left-10 w-[450px] h-[350px] bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-blue-700/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Subtle Mesh Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visionary Hero Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Superbadge */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider mb-6 w-fit backdrop-blur-md shadow-sm shadow-cyan-500/15">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase text-[11px] font-bold">2026 Bespoke Luxury Fleet & Auto Credit</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-white/60 font-normal">Real-Time Underwriting</span>
            </div>

            {/* Giant Monolith Heading */}
            <h1 className="heading-hero text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tighter leading-none mb-6">
              DRIVE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                YOUR
              </span> <br />
              <span className="relative inline-block">
                DESIRE
                <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-[2px] opacity-80" />
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-xl mb-8">
              Experience the pinnacle of high-performance automotive acquisition. Bespoke sub-prime & elite financing from <span className="text-cyan-400 font-semibold">3.99% APR</span> with instant algorithmic pre-approval.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreFleet}
                className="btn-pill btn-cyan text-sm px-8 py-4 flex items-center space-x-2.5 font-bold shadow-xl shadow-cyan-500/25 group"
              >
                <span>Explore The Fleet</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onOpenCalculator}
                className="btn-pill btn-outline text-sm px-7 py-4 flex items-center space-x-2.5 border-white/20 hover:border-cyan-400 group"
              >
                <Calculator className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Calculate Payment</span>
              </button>
            </div>

            {/* Live Trust Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/10 max-w-lg">
              <div>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-white block">
                  3.99<span className="text-cyan-400 text-xl font-sans">%</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mt-0.5">
                  Starting APR
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-white block">
                  60<span className="text-cyan-400 text-xl font-sans">s</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mt-0.5">
                  Pre-Qualification
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-white block">
                  $0
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mt-0.5">
                  Down Available
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Executive Summary Card */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Glassmorphic Concierge Box */}
            <div className="glass-panel p-7 sm:p-8 rounded-3xl border-white/15 bg-gradient-to-b from-white/[0.08] to-black/60 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">Velora Private Client</h3>
                    <p className="text-[11px] text-slate-400">Direct Dealer & Lender Network</p>
                  </div>
                </div>
                <span className="badge-luxury">Tier 1 Elite</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Zero Hard Credit Impact:</strong> Soft pull verification guarantees your credit score is 100% protected while exploring options.
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Instant Amortization:</strong> Custom term structures from 24 to 84 months with transparent APR and monthly schedule.
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Encrypted Dossier:</strong> Upload bank statements, pay stubs, and driver's licenses via tamper-proof audit trails.
                  </p>
                </div>
              </div>

              {/* Pre-Qualify CTA inside card */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">Ready to test eligibility?</span>
                  <span className="text-xs text-cyan-300 font-bold">Instant decision in under 1 minute</span>
                </div>
                <button
                  onClick={onPreQualify}
                  className="btn-pill btn-cyan py-2 px-4 text-xs font-bold shrink-0"
                >
                  Start Soft Check
                </button>
              </div>
            </div>

            {/* Quick Highlight Pills */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3 border-white/10 hover:border-cyan-500/40 transition-colors">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Delivery</span>
                  <span className="text-xs font-bold text-white">White-Glove Enclosed</span>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3 border-white/10 hover:border-cyan-500/40 transition-colors">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Warranty</span>
                  <span className="text-xs font-bold text-white">Full Factory Certified</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Featured Showcase Hero Banner (Mercedes-AMG GT Coupe) */}
        <div className="mt-14 relative rounded-3xl overflow-hidden glass-panel p-2.5 border-white/15 shadow-2xl shadow-cyan-950/40 group">
          <div className="relative h-[320px] sm:h-[420px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b1220] to-[#04070e]">
            <img
              src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
              alt="Mercedes-AMG GT Coupe in hyper cyan metallic finish"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 brightness-95"
            />
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-black/20 to-black/40" />

            {/* Floating Top Badges */}
            <div className="absolute top-6 left-6 flex items-center space-x-3">
              <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 flex items-center space-x-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Flagship Performance</span>
              </span>
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-slate-200 text-xs font-mono font-medium border border-white/15">
                MSRP $98,500
              </span>
            </div>

            {/* Bottom Card Overlay */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 right-6 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase block mb-1">
                  2026 Icon of the Month
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-black text-white drop-shadow-xl tracking-tight">
                  Mercedes-AMG GT 4-Door Coupe
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm font-medium mt-1 max-w-xl">
                  63 S E Performance • 831 Horsepower Hybrid V8 • 0-60 in 2.9 seconds
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onOpenCalculator}
                  className="btn-pill btn-cyan text-xs sm:text-sm px-6 py-3.5 shadow-xl shadow-cyan-500/30 flex items-center space-x-2 font-bold"
                >
                  <span>Finance from $1,240/mo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

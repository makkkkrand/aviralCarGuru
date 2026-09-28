import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Calculator } from 'lucide-react';

interface HeroProps {
  onExploreFleet: () => void;
  onOpenCalculator: () => void;
  onPreQualify: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreFleet, onOpenCalculator, onPreQualify }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading and Brand Identity */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 w-fit shadow-sm shadow-cyan-500/10">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Generation Luxury Auto Financing</span>
            </div>

            {/* Main Headline strictly matching theme image */}
            <h1 className="heading-hero text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tighter leading-none mb-6">
              DRIVE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                YOUR
              </span> <br />
              DESIRE
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button
                onClick={onExploreFleet}
                className="btn-pill btn-cyan text-sm px-8 py-3.5 flex items-center space-x-2 font-bold group"
              >
                <span>Explore Our Fleet</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onOpenCalculator}
                className="btn-pill btn-outline text-sm px-7 py-3.5 flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>Calculate Loan</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Subtitle & Featured Car Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 bg-[#0d1424]/80">
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light mb-6">
                Discover a curated collection of exceptional high-performance vehicles, tailored with bespoke finance rates and concierge consultation.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">Starting APR</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">3.99%</span>
                  <span className="text-[11px] text-slate-500 block">Up to 72 months</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">Pre-Approval</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">60 Sec</span>
                  <span className="text-[11px] text-slate-500 block">No credit impact</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Verified Auto Underwriters</span>
                </div>
                <button
                  onClick={onPreQualify}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 flex items-center space-x-1"
                >
                  <span>Soft Pre-Check</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick feature pills */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel p-4 flex items-center space-x-3 rounded-xl">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide block">Approval Speed</span>
                  <span className="text-sm font-semibold text-white">Instant Soft Pull</span>
                </div>
              </div>
              <div className="glass-panel p-4 flex items-center space-x-3 rounded-xl">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide block">Document Flow</span>
                  <span className="text-sm font-semibold text-white">100% Digital</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Featured Car Showcase Image Banner */}
        <div className="mt-12 relative rounded-3xl overflow-hidden glass-panel p-2 border-white/15 shadow-2xl shadow-cyan-950/40 group">
          <div className="relative h-[280px] sm:h-[400px] md:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b1220] to-[#04070e]">
            <img
              src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
              alt="Mercedes-AMG GT Coupe in metallic teal cyan"
              className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700 brightness-95"
            />
            {/* Water Reflection Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-transparent to-black/30" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 right-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2 inline-block border border-white/10">
                  Featured Icon
                </span>
                <h3 className="text-2xl sm:text-4xl font-display font-bold text-white drop-shadow-md">
                  Mercedes-AMG GT 4-Door Coupe
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  63 S E Performance • 831 HP Hybrid V8 • From $98,500 MSRP
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onOpenCalculator}
                  className="btn-pill btn-cyan text-xs sm:text-sm px-6 py-3 shadow-lg shadow-cyan-500/25"
                >
                  Finance from $1,240/mo
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

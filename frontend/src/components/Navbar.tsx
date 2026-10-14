import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Compass, 
  Calculator, 
  FileText, 
  PhoneCall, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight,
  Gauge
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTestDrive: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenTestDrive }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'fleet', label: 'Curated Fleet', icon: Compass },
    { id: 'calculator', label: 'Financing Studio', icon: Calculator },
    { id: 'apply', label: 'Credit Portal', icon: FileText },
    { id: 'enquiry', label: 'VIP Concierge', icon: PhoneCall },
    { id: 'track', label: 'Live Registry', icon: ShieldCheck },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#05070d]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/80 py-3' 
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo & Hallmark */}
        <div 
          onClick={() => {
            setActiveTab('hero');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 group-hover:scale-105 transition-all duration-300">
              <Car className="w-5 h-5 text-black stroke-[2.4]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border-2 border-cyan-400 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-black text-2xl tracking-[0.2em] text-white group-hover:text-cyan-400 transition-colors">
                VELORA
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold tracking-wider border border-cyan-500/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] tracking-[0.25em] text-slate-400 uppercase -mt-1 font-semibold font-mono">
              Bespoke Automotive
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (Floating Glass Pill) */}
        <nav className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan-400 rounded-full shadow-glow-cyan" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={onOpenTestDrive}
            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-400/50 hover:text-cyan-300 transition-all flex items-center space-x-1.5"
          >
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Book Test Drive</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('enquiry');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-pill btn-cyan text-xs py-2 px-5 shadow-lg shadow-cyan-500/25 flex items-center space-x-1"
          >
            <span>VIP Inquiry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/50 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#05070d]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-3 transition-all animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-cyan-400" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col space-y-2.5">
            <button
              onClick={() => {
                onOpenTestDrive();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl text-xs font-bold text-center border border-white/20 bg-white/5 text-slate-100 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Book Test Drive
            </button>
            <button
              onClick={() => {
                setActiveTab('enquiry');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-pill btn-cyan w-full py-3 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              VIP Concierge Inquiry
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

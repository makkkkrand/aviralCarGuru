import React, { useState } from 'react';
import { Car, Menu, X, ArrowUpRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTestDrive: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenTestDrive }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'fleet', label: 'Vehicles & Fleet' },
    { id: 'calculator', label: 'EMI Calculator' },
    { id: 'documents', label: 'Required Documents' },
    { id: 'apply', label: 'Apply for Loan' },
    { id: 'concierge', label: 'Finance Consultation' },
    { id: 'track', label: 'Track Application' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Brand Wordmark: CarGuru India */}
        <button
          onClick={() => handleNavClick('overview')}
          className="flex items-center space-x-2.5 text-left focus:outline-none rounded-lg p-1 group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition-colors">
            <Car className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-wider text-slate-900">
                CARGURU
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                India
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Vehicle Financing &amp; Advisory
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-md ${
                  isActive
                    ? 'text-slate-900 bg-slate-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Primary Action Buttons */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleNavClick('concierge')}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-lg border border-slate-200"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Loan Advice</span>
          </button>

          <button
            onClick={onOpenTestDrive}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg shadow-xs"
          >
            <span>Book Test Drive</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-3 mt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                handleNavClick('concierge');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg border border-slate-200"
            >
              Loan Consultation
            </button>
            <button
              onClick={() => {
                onOpenTestDrive();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg shadow-xs"
            >
              Book Test Drive
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

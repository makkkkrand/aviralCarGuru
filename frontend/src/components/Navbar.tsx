import React, { useState } from 'react';
import { Car, FileText, PhoneCall, ShieldCheck, Compass, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTestDrive: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenTestDrive }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'fleet', label: 'Our Fleet', icon: Compass },
    { id: 'calculator', label: 'Financing', icon: Car },
    { id: 'apply', label: 'Apply for Loan', icon: FileText },
    { id: 'enquiry', label: 'Customer Enquiry', icon: PhoneCall },
    { id: 'track', label: 'Track Status', icon: ShieldCheck },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('hero')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-widest text-white group-hover:text-cyan-400 transition-colors">
              VELORA
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase -mt-1 font-semibold">
              CarGuru Elite
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          <button
            onClick={onOpenTestDrive}
            className="btn-pill btn-outline text-xs px-5 py-2.5"
          >
            Book Test Drive
          </button>
          <button
            onClick={() => setActiveTab('enquiry')}
            className="btn-pill btn-cyan text-xs px-6 py-2.5"
          >
            Contact Concierge
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060911]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left font-medium ${
                activeTab === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 text-cyan-400" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col space-y-2">
            <button
              onClick={() => {
                onOpenTestDrive();
                setMobileMenuOpen(false);
              }}
              className="btn-pill btn-outline w-full py-3 text-sm"
            >
              Book Test Drive
            </button>
            <button
              onClick={() => {
                setActiveTab('enquiry');
                setMobileMenuOpen(false);
              }}
              className="btn-pill btn-cyan w-full py-3 text-sm"
            >
              Contact Concierge
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

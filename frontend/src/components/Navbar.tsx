import React, { useState } from 'react';
import { Car, Menu, X, ArrowUpRight, ShieldCheck, HelpCircle, Users, LayoutDashboard } from 'lucide-react';
import { UserProfile } from '../api/client';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTestDrive: () => void;
  currentUser: UserProfile;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTestDrive,
  currentUser,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Normal public user navigation items
  const customerNavItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'fleet', label: 'Vehicles & Fleet' },
    { id: 'calculator', label: 'EMI Calculator' },
    { id: 'documents', label: 'Required Documents' },
    { id: 'apply', label: 'Apply for Loan' },
    { id: 'concierge', label: 'Loan Advisory' },
    { id: 'track', label: 'Track Application' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStaffRole = currentUser.role === 'admin' || currentUser.role === 'underwriter' || currentUser.role === 'analyst';

  const getRoleBadgeStyle = () => {
    switch (currentUser.role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'underwriter':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analyst':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Wordmark: CarGuru India */}
        <button
          onClick={() => handleNavClick('overview')}
          className="flex items-center space-x-2 text-left focus:outline-none rounded-lg p-1 group shrink-0"
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
            <span className="text-[9px] text-slate-500 font-medium tracking-wide">
              Vehicle Financing &amp; Advisory
            </span>
          </div>
        </button>

        {/* Customer Navigation Links */}
        <nav className="hidden xl:flex items-center gap-0.5">
          {customerNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-1.5 text-xs font-medium transition-colors rounded-md ${
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

        {/* Right Action Bar: Admin Portal Switch + User Persona Switcher */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Admin & Analyst Portal Button */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border shadow-xs ${
              activeTab === 'admin'
                ? 'bg-purple-900 text-white border-purple-950'
                : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-purple-600" />
            <span>Admin &amp; Analyst Desk</span>
            {isStaffRole && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {/* User Persona Switcher */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-[10px] text-slate-700">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </span>
              <span className={`text-[9px] font-semibold uppercase px-1 py-0.2 rounded border ${getRoleBadgeStyle()}`}>
                {currentUser.role}
              </span>
            </div>
          </button>

          {/* Test Drive CTA */}
          <button
            onClick={onOpenTestDrive}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg shadow-xs"
          >
            <span>Test Drive</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={onOpenAuthModal}
            className="p-1.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg flex items-center space-x-1"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px]">{currentUser.role}</span>
          </button>

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
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          {/* Admin portal shortcut for mobile */}
          <div className="pb-2 mb-2 border-b border-slate-100">
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between ${
                activeTab === 'admin'
                  ? 'bg-purple-900 text-white'
                  : 'bg-purple-50 text-purple-900 border border-purple-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-4 h-4 text-purple-600" />
                <span>Admin &amp; Analyst Portal</span>
              </div>
              <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-bold">Desk</span>
            </button>
          </div>

          <div className="text-[10px] uppercase font-bold text-slate-400 px-3.5 py-1">Customer Financing Tools</div>
          {customerNavItems.map((item) => {
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
                onOpenAuthModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg border border-slate-200"
            >
              Switch Role ({currentUser.role})
            </button>
            <button
              onClick={() => {
                onOpenTestDrive();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg shadow-xs"
            >
              Test Drive
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


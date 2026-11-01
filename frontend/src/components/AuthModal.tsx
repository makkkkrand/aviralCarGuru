import React, { useState } from 'react';
import { UserProfile, setDemoModeActive } from '../api/client';
import { X, ShieldCheck, UserCheck, Briefcase, BarChart3, Lock, CheckCircle2, ArrowRight, LogOut } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user_client_01',
    name: 'Aarav Sharma',
    email: 'client@carguru.in',
    role: 'client',
    title: 'Customer / Auto Loan Applicant',
    department: 'Retail Banking Customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: ['view_own_applications', 'apply_loan', 'submit_documents', 'calculate_emi', 'book_test_drive'],
  },
  {
    id: 'user_underwriter_01',
    name: 'Priya Nair',
    email: 'underwriter@carguru.in',
    role: 'underwriter',
    title: 'Senior Credit & Underwriting Officer',
    department: 'Risk & Underwriting Desk',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'view_all_applications',
      'review_applications',
      'approve_reject_loan',
      'verify_documents',
      'adjust_apr_terms',
      'view_enquiries',
    ],
  },
  {
    id: 'user_analyst_01',
    name: 'Rohan Mehta',
    email: 'analyst@carguru.in',
    role: 'analyst',
    title: 'Lead Credit Portfolio Analyst',
    department: 'Financial Analytics & Risk',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'view_portfolio_analytics',
      'view_risk_metrics',
      'export_reports',
      'view_cibil_distribution',
      'view_all_applications',
    ],
  },
  {
    id: 'user_admin_01',
    name: 'Vikramaditya Singhania',
    email: 'admin@carguru.in',
    role: 'admin',
    title: 'Executive Platform Owner & Operations Lead',
    department: 'Executive Management',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'view_all_applications',
      'review_applications',
      'manage_leads',
      'manage_test_drives',
      'manage_inventory',
      'view_portfolio_analytics',
      'manage_users',
    ],
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'personas'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'analyst' | 'client'>('admin');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Production sign in: disable static demo fallback so UI reflects real MongoDB state
    setDemoModeActive(false);

    const emailLower = email.toLowerCase().trim();

    // 1. Check if email matches an onboarded employee in localStorage
    try {
      const onboarded = JSON.parse(localStorage.getItem('carguru_onboarded_employees') || '[]');
      const empMatch = onboarded.find((emp: any) => emp.email?.toLowerCase() === emailLower);
      if (empMatch) {
        onSelectUser({
          id: empMatch.employeeId,
          name: empMatch.name,
          email: empMatch.email,
          role: empMatch.role,
          title: empMatch.title,
          department: empMatch.department,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          permissions: empMatch.permissions || [],
        });
        onClose();
        return;
      }
    } catch {
      // ignore
    }

    // 2. Categorize role based on explicit selectedRole for actual users
    let userRole: 'admin' | 'analyst' | 'client' = selectedRole;
    let userTitle = 'Platform Administrator & Operations Lead';
    let userDept = 'Executive Operations';
    let permissions = [
      'view_all_applications',
      'review_applications',
      'manage_leads',
      'manage_test_drives',
      'manage_inventory',
      'view_portfolio_analytics',
      'manage_employees',
    ];

    if (userRole === 'analyst') {
      userTitle = 'Credit Risk & Portfolio Analyst';
      userDept = 'Financial Risk Analytics';
      permissions = ['view_portfolio_analytics', 'view_risk_metrics', 'view_all_applications'];
    } else if (userRole === 'client') {
      userTitle = 'Retail Customer / Buyer';
      userDept = 'Retail Banking Customer';
      permissions = ['view_own_applications', 'apply_loan', 'submit_documents', 'calculate_emi'];
    }

    const namePart = emailLower.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    onSelectUser({
      id: `user_${Date.now()}`,
      name: formattedName || (userRole === 'admin' ? 'Administrator' : userRole === 'analyst' ? 'Portfolio Analyst' : 'Customer'),
      email: emailLower,
      role: userRole as any,
      title: userTitle,
      department: userDept,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      permissions,
    });
    onClose();
  };

  const handleSelectDemoUser = (user: UserProfile) => {
    // Enable demo mode specifically for the 1-click evaluation switcher
    setDemoModeActive(true);
    onSelectUser(user);
    onClose();
  };

  const handleSignOut = () => {
    setDemoModeActive(false);
    onSelectUser(DEMO_USERS[0]);
    onClose();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">ADMIN / OWNER</span>;
      case 'underwriter':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">UNDERWRITER</span>;
      case 'analyst':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">PORTFOLIO ANALYST</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded">CUSTOMER / APPLICANT</span>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      case 'underwriter':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'analyst':
        return <BarChart3 className="w-5 h-5 text-emerald-600" />;
      default:
        return <UserCheck className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Enterprise Access</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              CarGuru Identity &amp; Role Management
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current logged in status badge */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">Active Session:</span>
            <span className="font-semibold text-slate-900">{currentUser.name}</span>
            {getRoleBadge(currentUser.role)}
          </div>
          <span className="text-[11px] text-slate-500">{currentUser.department}</span>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 border-b border-slate-200 flex space-x-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Enterprise Staff &amp; Client Login
          </button>
          <button
            onClick={() => setActiveTab('personas')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'personas'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1-Click Role Switcher (Instant Demo)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'personas' ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                <strong>Instant Demo Sandbox:</strong> Selecting a role below switches your active session and enables pre-populated demo records for immediate evaluation of approval and underwriting flows.
              </div>

              {DEMO_USERS.map((user) => {
                const isSelected = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectDemoUser(user)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900/5 ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">{user.name}</span>
                          {getRoleBadge(user.role)}
                        </div>
                        <div className="text-xs text-slate-500">{user.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-2">
                      {isSelected ? (
                        <div className="flex items-center space-x-1 text-slate-900 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 text-xs font-semibold">
                          <span>Switch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Designated Staff / Account Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all flex flex-col items-center justify-center ${
                      selectedRole === 'admin'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-1 ring-purple-600'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mb-1 text-purple-600" />
                    <span>Admin</span>
                    <span className="text-[10px] text-purple-700 font-normal">Full Privileges</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('analyst')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all flex flex-col items-center justify-center ${
                      selectedRole === 'analyst'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mb-1 text-emerald-600" />
                    <span>Analyst</span>
                    <span className="text-[10px] text-emerald-700 font-normal">Risk & Analytics</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('client')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all flex flex-col items-center justify-center ${
                      selectedRole === 'client'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-600'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 mb-1 text-blue-600" />
                    <span>Client</span>
                    <span className="text-[10px] text-blue-700 font-normal">Loan Applicant</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.in"
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate &amp; Access Dashboard</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Connected to CarGuru Enterprise Directory. Authenticated staff accounts (Admin, Underwriter, Analyst) are granted internal management desk privileges.</span>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

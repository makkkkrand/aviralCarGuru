import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeOverview } from './components/HomeOverview';
import { FleetCatalog } from './components/FleetCatalog';
import { FinancingCalculator } from './components/FinancingCalculator';
import { FinancingApplicationWizard } from './components/FinancingApplicationWizard';
import { ApplicationTracker } from './components/ApplicationTracker';
import { EnquiryForm } from './components/EnquiryForm';
import { PreQualificationModal } from './components/PreQualificationModal';
import { TestDriveModal } from './components/TestDriveModal';
import { DocumentChecklist, LoanApplicantType } from './components/DocumentChecklist';
import { VehicleSummary } from './api/client';
import { Car, MapPin, Phone, HelpCircle, ShieldCheck, FileText } from 'lucide-react';

export function App() {
  // Sync page state with window hash (supporting direct bookmarking and browser back/forward)
  const getInitialTab = (): string => {
    const hash = window.location.hash.replace('#', '').replace('/', '');
    const validTabs = ['overview', 'fleet', 'calculator', 'documents', 'apply', 'track', 'concierge'];
    return validTabs.includes(hash) ? hash : 'overview';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [preQualifyOpen, setPreQualifyOpen] = useState<boolean>(false);
  const [testDriveOpen, setTestDriveOpen] = useState<boolean>(false);
  const [testDriveVehicleId, setTestDriveVehicleId] = useState<string>('CG-2026-XUV700');

  // Document checklist modal state
  const [checklistModalOpen, setChecklistModalOpen] = useState<boolean>(false);
  const [checklistCategory, setChecklistCategory] = useState<LoanApplicantType>('salaried');

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSummary | null>(null);
  const [initialLoanTerms, setInitialLoanTerms] = useState<any>(null);
  const [trackedReference, setTrackedReference] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace('/', '');
      const validTabs = ['overview', 'fleet', 'calculator', 'documents', 'apply', 'track', 'concierge'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicleForFinancing = (vehicle: VehicleSummary) => {
    setSelectedVehicle(vehicle);
    navigateToPage('calculator');
  };

  const handleApplyForLoan = (terms: any) => {
    setInitialLoanTerms(terms);
    navigateToPage('apply');
  };

  const handleTrackApplication = (ref: string) => {
    setTrackedReference(ref);
    navigateToPage('track');
  };

  const handleOpenTestDrive = (vehicleId = 'CG-2026-XUV700') => {
    setTestDriveVehicleId(vehicleId);
    setTestDriveOpen(true);
  };

  const handleOpenChecklistModal = (category: LoanApplicantType = 'salaried') => {
    setChecklistCategory(category);
    setChecklistModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateToPage}
        onOpenTestDrive={() => handleOpenTestDrive()}
      />

      {/* Page Router — Strictly Page-Wise based on Menu */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <HomeOverview
            onNavigate={navigateToPage}
            onSelectVehicleForFinancing={handleSelectVehicleForFinancing}
            onOpenTestDrive={handleOpenTestDrive}
            onOpenChecklistModal={handleOpenChecklistModal}
          />
        )}

        {activeTab === 'fleet' && (
          <FleetCatalog
            onSelectVehicleForFinancing={handleSelectVehicleForFinancing}
            onBookTestDrive={handleOpenTestDrive}
          />
        )}

        {activeTab === 'calculator' && (
          <FinancingCalculator
            initialVehicle={selectedVehicle}
            onApplyForLoan={handleApplyForLoan}
            onPreQualify={() => setPreQualifyOpen(true)}
            onOpenChecklist={() => handleOpenChecklistModal('salaried')}
          />
        )}

        {activeTab === 'documents' && (
          <div className="pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <DocumentChecklist
                variant="embedded"
                onProceedToApply={() => navigateToPage('apply')}
              />
            </div>
          </div>
        )}

        {activeTab === 'apply' && (
          <FinancingApplicationWizard
            initialTerms={initialLoanTerms}
            onTrackApplication={handleTrackApplication}
          />
        )}

        {activeTab === 'concierge' && (
          <EnquiryForm onScheduleTestDrive={() => handleOpenTestDrive()} />
        )}

        {activeTab === 'track' && (
          <ApplicationTracker initialRef={trackedReference} />
        )}
      </main>

      {/* Global Modals */}
      <PreQualificationModal
        isOpen={preQualifyOpen}
        onClose={() => setPreQualifyOpen(false)}
        onProceedToApplication={() => navigateToPage('apply')}
      />

      <TestDriveModal
        isOpen={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        defaultVehicleId={testDriveVehicleId}
      />

      {/* Document Checklist Modal Accessible from any context */}
      <DocumentChecklist
        isOpen={checklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
        variant="modal"
        defaultCategory={checklistCategory}
        onProceedToApply={() => {
          setChecklistModalOpen(false);
          navigateToPage('apply');
        }}
      />

      {/* Professional CarGuru India Automotive Finance Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-white">
                  <Car className="w-4 h-4" />
                </div>
                <span className="font-bold text-base tracking-wider text-white">CARGURU INDIA</span>
              </div>
              <p className="text-slate-400 leading-normal max-w-xs">
                Pan-India vehicle financing, loan calculators, CIBIL pre-qualification, and unbiased auto loan consultation for any vehicle segment across all 28 Indian states.
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                RBI Compliant Lending Syndicates (HDFC · ICICI · Kotak · SBI · Axis)
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Vehicle Financing</div>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => navigateToPage('fleet')} className="hover:text-white transition-colors">New Cars &amp; SUVs</button></li>
                <li><button onClick={() => navigateToPage('fleet')} className="hover:text-white transition-colors">Electric Vehicles (EV Loans)</button></li>
                <li><button onClick={() => navigateToPage('fleet')} className="hover:text-white transition-colors">Certified Pre-Owned Cars</button></li>
                <li><button onClick={() => navigateToPage('fleet')} className="hover:text-white transition-colors">Commercial Vehicles &amp; Fleets</button></li>
                <li><button onClick={() => navigateToPage('fleet')} className="hover:text-white transition-colors">Luxury &amp; Performance Fleet</button></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Loan Advisory &amp; Tools</div>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => navigateToPage('calculator')} className="hover:text-white transition-colors">Auto Loan &amp; EMI Calculator</button></li>
                <li><button onClick={() => navigateToPage('documents')} className="hover:text-white transition-colors">Required Documents (Salaried vs Business)</button></li>
                <li><button onClick={() => navigateToPage('concierge')} className="hover:text-white transition-colors">Free Vehicle Finance Consultation</button></li>
                <li><button onClick={() => navigateToPage('concierge')} className="hover:text-white transition-colors">Balance Transfer &amp; Refinancing</button></li>
                <li><button onClick={() => setPreQualifyOpen(true)} className="hover:text-white transition-colors">Soft-Pull CIBIL Eligibility Check</button></li>
                <li><button onClick={() => navigateToPage('track')} className="hover:text-white transition-colors">Application &amp; Ticket Status Tracker</button></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Pan-India Support &amp; Hubs</div>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>BKC, Mumbai (Maharashtra)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Aerocity, New Delhi (Delhi NCR)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>UB City, Bengaluru (Karnataka)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>+91 1800 209 8888 (Toll-Free Pan-India)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>&copy; 2026 CarGuru India. All rights reserved. Pan-India vehicle loan processing across all 28 states.</div>
            <div className="flex items-center space-x-3">
              <span>State RTO Registration &amp; Tax Compliant</span>
              <span>·</span>
              <span>Bank-Grade 256-Bit SSL Encryption</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

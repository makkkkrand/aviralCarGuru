import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FinancingCalculator } from './components/FinancingCalculator';
import { FinancingApplicationWizard } from './components/FinancingApplicationWizard';
import { EnquiryForm } from './components/EnquiryForm';
import { FleetCatalog } from './components/FleetCatalog';
import { ApplicationTracker } from './components/ApplicationTracker';
import { PreQualificationModal } from './components/PreQualificationModal';
import { TestDriveModal } from './components/TestDriveModal';
import { VehicleSummary } from './api/client';
import { ShieldCheck, Sparkles, Car, Code, Server, Layers } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [preQualifyOpen, setPreQualifyOpen] = useState<boolean>(false);
  const [testDriveOpen, setTestDriveOpen] = useState<boolean>(false);
  const [testDriveVehicleId, setTestDriveVehicleId] = useState<string>('VEL-2026-GT');

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSummary | null>(null);
  const [initialLoanTerms, setInitialLoanTerms] = useState<any>(null);
  const [trackedReference, setTrackedReference] = useState<string>('');

  const handleSelectVehicleForFinancing = (vehicle: VehicleSummary) => {
    setSelectedVehicle(vehicle);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyForLoan = (terms: any) => {
    setInitialLoanTerms(terms);
    setActiveTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackApplication = (ref: string) => {
    setTrackedReference(ref);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTestDrive = (vehicleId = 'VEL-2026-GT') => {
    setTestDriveVehicleId(vehicleId);
    setTestDriveOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTestDrive={() => handleOpenTestDrive()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'hero' && (
          <>
            <Hero
              onExploreFleet={() => setActiveTab('fleet')}
              onOpenCalculator={() => setActiveTab('calculator')}
              onPreQualify={() => setPreQualifyOpen(true)}
            />
            <FleetCatalog
              onSelectVehicleForFinancing={handleSelectVehicleForFinancing}
              onBookTestDrive={handleOpenTestDrive}
            />
            <FinancingCalculator
              initialVehicle={selectedVehicle}
              onApplyForLoan={handleApplyForLoan}
              onPreQualify={() => setPreQualifyOpen(true)}
            />
            <EnquiryForm onScheduleTestDrive={() => handleOpenTestDrive()} />
          </>
        )}

        {activeTab === 'fleet' && (
          <div className="pt-20">
            <FleetCatalog
              onSelectVehicleForFinancing={handleSelectVehicleForFinancing}
              onBookTestDrive={handleOpenTestDrive}
            />
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="pt-20">
            <FinancingCalculator
              initialVehicle={selectedVehicle}
              onApplyForLoan={handleApplyForLoan}
              onPreQualify={() => setPreQualifyOpen(true)}
            />
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="pt-20">
            <FinancingApplicationWizard
              initialTerms={initialLoanTerms}
              onTrackApplication={handleTrackApplication}
            />
          </div>
        )}

        {activeTab === 'enquiry' && (
          <div className="pt-20">
            <EnquiryForm onScheduleTestDrive={() => handleOpenTestDrive()} />
          </div>
        )}

        {activeTab === 'track' && (
          <div className="pt-20">
            <ApplicationTracker initialRef={trackedReference} />
          </div>
        )}
      </main>

      {/* Modals */}
      <PreQualificationModal
        isOpen={preQualifyOpen}
        onClose={() => setPreQualifyOpen(false)}
        onProceedToApplication={() => {
          setActiveTab('apply');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <TestDriveModal
        isOpen={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        defaultVehicleId={testDriveVehicleId}
      />

      {/* Luxury Footer */}
      <footer className="glass-nav border-t border-white/10 mt-20 pt-16 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                  <Car className="w-4 h-4 text-black font-bold" />
                </div>
                <span className="font-display font-black text-xl tracking-widest text-white">VELORA</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Bespoke high-performance automotive financing and concierge acquisition platform.
              </p>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-cyan-400">
                <Code className="w-3.5 h-3.5" />
                <span>OpenAPI 3.1 Contract Synchronized</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Automotive Fleet</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => setActiveTab('fleet')} className="hover:text-cyan-400">Mercedes-AMG GT Coupe</button></li>
                <li><button onClick={() => setActiveTab('fleet')} className="hover:text-cyan-400">Porsche Taycan Turbo S</button></li>
                <li><button onClick={() => setActiveTab('fleet')} className="hover:text-cyan-400">Audi RS e-tron GT</button></li>
                <li><button onClick={() => setActiveTab('fleet')} className="hover:text-cyan-400">Aston Martin DB12</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Financing & Advisory</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => setActiveTab('calculator')} className="hover:text-cyan-400">Loan & EMI Calculator</button></li>
                <li><button onClick={() => setPreQualifyOpen(true)} className="hover:text-cyan-400">Instant Pre-Qualification</button></li>
                <li><button onClick={() => setActiveTab('apply')} className="hover:text-cyan-400">Credit Application</button></li>
                <li><button onClick={() => setActiveTab('track')} className="hover:text-cyan-400">Check Status & Upload Docs</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Architecture Stack</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Spring Boot 3.3.4 (Java 21)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Spring Data MongoDB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  <span>OpenAPI Code Generator</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Docker Multi-Stage Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <span>© 2026 Velora CarGuru. All rights reserved.</span>
            <span>Contract-First Swagger Architecture • Production Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

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
import { 
  ShieldCheck, 
  Sparkles, 
  Car, 
  Code, 
  Server, 
  Layers, 
  Compass, 
  Calculator, 
  Lock, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Ambient Background Light Source */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,210,223,0.1),rgba(255,255,255,0))] pointer-events-none" />

      {/* Modern Glassmorphic Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTestDrive={() => handleOpenTestDrive()}
      />

      {/* Router View Port */}
      <main className="flex-1 relative z-10">
        {activeTab === 'hero' && (
          <>
            <Hero
              onExploreFleet={() => {
                setActiveTab('fleet');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCalculator={() => {
                setActiveTab('calculator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onPreQualify={() => setPreQualifyOpen(true)}
            />
            
            <div className="border-t border-white/5">
              <FleetCatalog
                onSelectVehicleForFinancing={handleSelectVehicleForFinancing}
                onBookTestDrive={handleOpenTestDrive}
              />
            </div>

            <div className="border-t border-white/5 bg-gradient-to-b from-[#05070d] via-[#090d19] to-[#05070d]">
              <FinancingCalculator
                initialVehicle={selectedVehicle}
                onApplyForLoan={handleApplyForLoan}
                onPreQualify={() => setPreQualifyOpen(true)}
              />
            </div>

            <div className="border-t border-white/5">
              <EnquiryForm onScheduleTestDrive={() => handleOpenTestDrive()} />
            </div>
          </>
        )}

        {activeTab === 'fleet' && (
          <div className="pt-24">
            <FleetCatalog
              onSelectVehicleForFinancing={handleSelectVehicleForFinancing}
              onBookTestDrive={handleOpenTestDrive}
            />
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="pt-24">
            <FinancingCalculator
              initialVehicle={selectedVehicle}
              onApplyForLoan={handleApplyForLoan}
              onPreQualify={() => setPreQualifyOpen(true)}
            />
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="pt-24">
            <FinancingApplicationWizard
              initialTerms={initialLoanTerms}
              onTrackApplication={handleTrackApplication}
            />
          </div>
        )}

        {activeTab === 'enquiry' && (
          <div className="pt-24">
            <EnquiryForm onScheduleTestDrive={() => handleOpenTestDrive()} />
          </div>
        )}

        {activeTab === 'track' && (
          <div className="pt-24">
            <ApplicationTracker initialRef={trackedReference} />
          </div>
        )}
      </main>

      {/* Floating Modals */}
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

      {/* Ultra-Luxury Footer */}
      <footer className="border-t border-white/10 bg-[#04060b] mt-24 pt-20 pb-14 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            
            {/* Brand Col */}
            <div className="lg:col-span-2">
              <div 
                onClick={() => {
                  setActiveTab('hero');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center space-x-3 cursor-pointer mb-5"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Car className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <span className="font-display font-black text-2xl tracking-[0.2em] text-white">
                  VELORA
                </span>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
                Bespoke high-performance automotive financing atelier and concierge acquisition gateway. Providing high-net-worth underwriting and subprime accessible credit programs.
              </p>

              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-cyan-400 font-mono">
                <Code className="w-3.5 h-3.5" />
                <span>OpenAPI 3.1 Contract Synchronized</span>
              </div>
            </div>

            {/* Quick Links: Fleet */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5 font-mono">
                Performance Fleet
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li>
                  <button onClick={() => { setActiveTab('fleet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                    <span>Mercedes-AMG GT Coupe</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('fleet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                    <span>Porsche Taycan Turbo S</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('fleet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                    <span>Audi RS e-tron GT</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('fleet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
                    <span>Aston Martin DB12</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Links: Finance */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5 font-mono">
                Finance & Advisory
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li>
                  <button onClick={() => { setActiveTab('calculator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">
                    Loan & Amortization Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => setPreQualifyOpen(true)} className="hover:text-cyan-400 transition-colors">
                    Instant Soft Pre-Approval
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('apply'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">
                    Underwriting Application
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('track'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">
                    Track Dossier & Upload Docs
                  </button>
                </li>
              </ul>
            </div>

            {/* Microservice Architecture Info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5 font-mono">
                System Topology
              </h4>
              <div className="space-y-2.5 text-xs text-slate-400">
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
                  <span>Contract-First CodeGen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TLS 1.3 / OWASP Hardened</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <span className="font-mono">© 2026 Velora CarGuru Atelier. All rights reserved.</span>
            <div className="flex items-center space-x-6 text-[11px] font-mono">
              <span className="text-slate-400">Privacy Protection</span>
              <span className="text-slate-400">Security Architecture</span>
              <span className="text-cyan-400/80">Production Gateway Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

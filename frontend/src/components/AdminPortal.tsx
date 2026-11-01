import React, { useState, useEffect } from 'react';
import {
  apiClient,
  FinancingApplicationDetail,
  EnquiryDetail,
  PortfolioSummary,
  UserProfile,
  VehicleSummary,
  BackendStatus,
} from '../api/client';
import {
  ShieldCheck,
  FileCheck,
  Users,
  Calendar,
  BarChart3,
  Car,
  Code2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  Copy,
  ChevronRight,
  TrendingUp,
  Percent,
  RefreshCw,
  Building2,
  FileText,
  BadgeAlert,
  ArrowUpRight,
  Sliders,
  Server,
  Database,
  Activity,
  Terminal,
  Cpu,
  Zap,
  Settings,
  Link as LinkIcon,
  Globe,
  RotateCcw,
  Lock,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: UserProfile;
  onOpenAuthModal: () => void;
  onSwitchToClientView: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onOpenAuthModal,
  onSwitchToClientView,
}) => {
  const [activeTab, setActiveTab] = useState<
    'applications' | 'leads' | 'test_drives' | 'analytics' | 'inventory'
  >(currentUser.role === 'analyst' ? 'analytics' : 'applications');

  // Applications State
  const [applications, setApplications] = useState<FinancingApplicationDetail[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [empFilter, setEmpFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<FinancingApplicationDetail | null>(null);

  // Review Form State
  const [reviewStatus, setReviewStatus] = useState<string>('');
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [offeredApr, setOfferedApr] = useState<number>(8.49);
  const [reviewNote, setReviewNote] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Enquiries / Leads State
  const [enquiries, setEnquiries] = useState<EnquiryDetail[]>([]);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryDetail | null>(null);
  const [leadStatus, setLeadStatus] = useState('');
  const [assignedAdvisor, setAssignedAdvisor] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');

  // Test Drives State
  const [testDrives, setTestDrives] = useState<any[]>([]);

  // Analytics State
  const [portfolioData, setPortfolioData] = useState<PortfolioSummary | null>(null);

  // Inventory State
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: 2026,
    trim: '',
    baseMSRP: 2500000,
    category: 'Premium SUV',
    imageUrl: '',
  });

  // Backend Integration & Gateway State
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [isPingingBackend, setIsPingingBackend] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customBackendUrl, setCustomBackendUrl] = useState(() => apiClient.getBaseUrl());
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [testEndpointResult, setTestEndpointResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    isMixedContent?: boolean;
    solutionPresets?: any;
  } | null>(null);
  const [endpointSavedNotice, setEndpointSavedNotice] = useState(false);
  const [copiedTerminalCommand, setCopiedTerminalCommand] = useState(false);
  const [copiedTunnelCommand, setCopiedTunnelCommand] = useState(false);
  const [copiedCloudflareCommand, setCopiedCloudflareCommand] = useState(false);
  const [activeTunnelTab, setActiveTunnelTab] = useState<'tunnel' | 'chrome' | 'local'>('tunnel');

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [currentUser]);

  const loadAllData = async () => {
    setAppsLoading(true);
    // Asynchronously probe backend connection status
    apiClient.checkBackendStatus().then(setBackendStatus).catch(() => {});

    try {
      const [appsRes, enqsRes, drivesRes, statsRes, fleetRes] = await Promise.allSettled([
        apiClient.listApplications({ status: statusFilter, employmentType: empFilter, search: searchQuery }),
        apiClient.listEnquiries(),
        apiClient.listTestDrives(),
        apiClient.getPortfolioSummary(),
        apiClient.lookupVehicles('', '', 20),
      ]);

      if (appsRes.status === 'fulfilled') setApplications(appsRes.value.applications || []);
      if (enqsRes.status === 'fulfilled') setEnquiries(enqsRes.value.enquiries || []);
      if (drivesRes.status === 'fulfilled') setTestDrives(drivesRes.value.bookings || []);
      if (statsRes.status === 'fulfilled') setPortfolioData(statsRes.value);
      if (fleetRes.status === 'fulfilled') setVehicles(fleetRes.value || []);
    } catch (err) {
      console.warn('Admin data load notice:', err);
    } finally {
      setAppsLoading(false);
    }
  };

  const handlePingBackend = async () => {
    setIsPingingBackend(true);
    try {
      const status = await apiClient.checkBackendStatus();
      setBackendStatus(status);
    } catch (e) {
      console.warn('Backend ping failed:', e);
    } finally {
      setIsPingingBackend(false);
    }
  };

  const handleTestEndpoint = async (urlToTest: string) => {
    setTestingEndpoint(true);
    setTestEndpointResult(null);
    try {
      const res = await apiClient.checkBackendStatus(urlToTest);
      if (res.connected) {
        setTestEndpointResult({
          success: true,
          message: `Successfully connected to Spring Boot 3 (${res.engine})!`,
          latencyMs: res.latencyMs,
        });
      } else {
        setTestEndpointResult({
          success: false,
          message: res.error || 'Connection failed. Verify service is running.',
          isMixedContent: res.isMixedContentBlocked,
          solutionPresets: res.solutionPresets,
        });
      }
    } catch (e: any) {
      setTestEndpointResult({
        success: false,
        message: e.message || 'Network error connecting to endpoint',
      });
    } finally {
      setTestingEndpoint(false);
    }
  };

  const handleSaveEndpoint = async (urlToSave: string) => {
    const updated = apiClient.setBaseUrl(urlToSave);
    setCustomBackendUrl(updated);
    setEndpointSavedNotice(true);
    setTimeout(() => {
      setEndpointSavedNotice(false);
      setShowConfigModal(false);
    }, 1200);
    await handlePingBackend();
    loadAllData();
  };

  const handleResetEndpoint = async () => {
    const updated = apiClient.resetBaseUrl();
    setCustomBackendUrl(updated);
    setTestEndpointResult(null);
    setEndpointSavedNotice(true);
    setTimeout(() => {
      setEndpointSavedNotice(false);
      setShowConfigModal(false);
    }, 1200);
    await handlePingBackend();
    loadAllData();
  };

  const handleFilterApplications = async () => {
    setAppsLoading(true);
    try {
      const res = await apiClient.listApplications({
        status: statusFilter,
        employmentType: empFilter,
        search: searchQuery,
      });
      setApplications(res.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleSelectAppForReview = (app: FinancingApplicationDetail) => {
    setSelectedApp(app);
    setReviewStatus(app.status);
    setApprovedAmount(app.loanTerms?.approvedAmount || app.loanTerms?.requestedLoanAmount || 0);
    setOfferedApr(app.loanTerms?.offeredApr || 8.49);
    setReviewNote('');
  };

  const handleSubmitReview = async () => {
    if (!selectedApp) return;
    setIsSubmittingReview(true);
    try {
      const res = await apiClient.reviewApplication(selectedApp.applicationId, {
        status: reviewStatus,
        approvedAmount: Number(approvedAmount),
        offeredApr: Number(offeredApr),
        note: reviewNote,
        underwriterName: `${currentUser.name} (${currentUser.title})`,
      });
      setSelectedApp(res.application);
      // update local list
      setApplications((prev) =>
        prev.map((a) => (a.applicationId === res.application.applicationId ? res.application : a))
      );
      // refresh analytics
      const stats = await apiClient.getPortfolioSummary();
      setPortfolioData(stats);
      alert('Underwriting decision saved and applicant status updated successfully.');
    } catch (err: any) {
      alert(`Error submitting review: ${err.message}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleVerifyDocument = async (docId: string, status: 'VERIFIED' | 'REJECTED') => {
    if (!selectedApp) return;
    try {
      await apiClient.verifyDocument(selectedApp.applicationId, docId, status);
      // refresh app details
      const updated = await apiClient.getFinancingApplication(selectedApp.applicationId);
      setSelectedApp(updated);
      setApplications((prev) =>
        prev.map((a) => (a.applicationId === updated.applicationId ? updated : a))
      );
    } catch (err: any) {
      alert(`Error verifying document: ${err.message}`);
    }
  };

  const handleUpdateEnquiry = async (enquiryId: string) => {
    try {
      const res = await apiClient.updateEnquiry(enquiryId, {
        status: leadStatus,
        assignedAdvisor,
        resolutionNote: resolutionNote ? `[${currentUser.name}]: ${resolutionNote}` : undefined,
      });
      setEnquiries((prev) =>
        prev.map((e) => (e.enquiryId === enquiryId ? res.enquiry : e))
      );
      setSelectedEnquiry(null);
      alert('Enquiry ticket updated successfully.');
    } catch (err: any) {
      alert(`Error updating enquiry: ${err.message}`);
    }
  };

  const handleUpdateTestDrive = async (bookingId: string, newStatus: string) => {
    try {
      await apiClient.updateTestDrive(bookingId, { status: newStatus });
      setTestDrives((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      alert(`Error updating test drive: ${err.message}`);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiClient.addVehicleToCatalog(newVehicle);
      setVehicles((prev) => [created, ...prev]);
      setNewVehicle({
        make: '',
        model: '',
        year: 2026,
        trim: '',
        baseMSRP: 2500000,
        category: 'Premium SUV',
        imageUrl: '',
      });
      alert('Vehicle successfully registered in CarGuru fleet catalog.');
    } catch (err: any) {
      alert(`Error adding vehicle: ${err.message}`);
    }
  };

  const formatCurrency = (val?: number) => {
    if (!val) return '₹0';
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" /> Under Review
          </span>
        );
      case 'DOCS_REQUIRED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <BadgeAlert className="w-3 h-3 mr-1" /> Docs Required
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="pt-20 pb-16 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Executive Header */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
                Enterprise Portal
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-slate-300 text-xs font-medium">Pan-India Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              CarGuru Management &amp; Analytics Portal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Internal credit underwriting desk, lead CRM, test drive showroom dispatch, and portfolio risk intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider">{currentUser.role}</div>
              </div>
            </div>

            <button
              onClick={onOpenAuthModal}
              className="px-3 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Switch Persona</span>
            </button>

            <button
              onClick={() => {
                setCustomBackendUrl(apiClient.getBaseUrl());
                setTestEndpointResult(null);
                setShowConfigModal(true);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 border border-white/10"
              title="Configure Backend API endpoint URL"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure Endpoint</span>
            </button>

            <button
              onClick={onSwitchToClientView}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 border border-white/10"
            >
              <span>Customer View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={loadAllData}
              disabled={appsLoading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs transition-colors border border-white/10"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${appsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Backend Endpoint Configuration Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Configure Backend API Endpoint</h3>
                    <p className="text-xs text-slate-500">
                      Connect the web portal to your local Spring Boot service or a deployed microservice.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mixed Content / HTTPS Explainer Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Why does testing http://localhost:8080 fail while Java is running?</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  This preview is hosted over secure <strong>HTTPS</strong>. Modern web browsers (Chrome, Edge, Firefox, Safari) strictly block HTTPS pages from calling plain <code>http://localhost</code> (Mixed Content &amp; Private Network Access security).
                </p>
                <div className="text-[11px] text-amber-900 font-semibold pt-0.5">
                  Pick any of the 3 instant solutions below to connect your local Java backend:
                </div>
              </div>

              {/* 3 Solution Pathways Tabs */}
              <div className="space-y-3">
                <div className="flex border-b border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTunnelTab('tunnel')}
                    className={`pb-2 px-3 font-semibold transition-colors flex items-center space-x-1.5 border-b-2 ${
                      activeTunnelTab === 'tunnel'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Option 1: HTTPS Tunnel (Recommended)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTunnelTab('chrome')}
                    className={`pb-2 px-3 font-semibold transition-colors flex items-center space-x-1.5 border-b-2 ${
                      activeTunnelTab === 'chrome'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Option 2: Browser Setting</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTunnelTab('local')}
                    className={`pb-2 px-3 font-semibold transition-colors flex items-center space-x-1.5 border-b-2 ${
                      activeTunnelTab === 'local'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Option 3: Local Frontend</span>
                  </button>
                </div>

                {/* Option 1: Tunnel Content */}
                {activeTunnelTab === 'tunnel' && (
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2.5">
                    <div className="text-slate-700 leading-relaxed">
                      Run this single command in a new terminal window on your computer to expose your local port 8080 via a free HTTPS URL:
                    </div>

                    <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-3 py-2 rounded-lg font-mono text-[11px]">
                      <span>npx localtunnel --port 8080</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('npx localtunnel --port 8080');
                          setCopiedTunnelCommand(true);
                          setTimeout(() => setCopiedTunnelCommand(false), 2000);
                        }}
                        className="ml-3 px-2 py-0.5 bg-white/20 hover:bg-white/30 text-white rounded text-[10px] font-sans flex items-center space-x-1"
                      >
                        {copiedTunnelCommand ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedTunnelCommand ? 'Copied' : 'Copy Command'}</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      localtunnel prints a secure URL (e.g. <code>https://bright-goat-42.loca.lt</code>). Paste it in the URL input below (ending with <code>/api/v1</code>) and click <strong>Test Connection</strong>!
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-1 border-t border-slate-200">
                      <span>Alternatives:</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('cloudflared tunnel --url http://localhost:8080');
                          setCopiedCloudflareCommand(true);
                          setTimeout(() => setCopiedCloudflareCommand(false), 2000);
                        }}
                        className="text-blue-600 hover:underline font-mono text-[10px]"
                      >
                        {copiedCloudflareCommand ? 'Copied cloudflared!' : 'cloudflared tunnel --url http://localhost:8080'}
                      </button>
                      <span>·</span>
                      <code className="text-slate-600 font-mono text-[10px]">ngrok http 8080</code>
                    </div>
                  </div>
                )}

                {/* Option 2: Chrome Content */}
                {activeTunnelTab === 'chrome' && (
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
                    <div className="font-semibold text-slate-800">
                      Allow Direct Localhost Calls in Chrome or Edge:
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                      <li>Click the <strong>Tune / Lock icon</strong> in your browser's address bar (left of the website URL).</li>
                      <li>Click <strong>Site settings</strong>.</li>
                      <li>Find the <strong>Insecure content</strong> permission and set it to <strong>Allow</strong>.</li>
                      <li>Return to this tab, refresh the page, and click <strong>Test Connection</strong>.</li>
                    </ol>
                    <div className="text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                      Tip: We also added <code>Access-Control-Allow-Private-Network</code> support to <code>CorsConfig.java</code> so Chrome will authorize the local preflight.
                    </div>
                  </div>
                )}

                {/* Option 3: Local Frontend Content */}
                {activeTunnelTab === 'local' && (
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
                    <div className="font-semibold text-slate-800">
                      Run Both Frontend and Backend Locally:
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      When the frontend runs on <code>http://localhost:3000</code>, both frontend and backend are on <code>http://</code>, so browsers never trigger mixed-content blocks.
                    </div>
                    <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px]">
                      cd frontend &amp;&amp; npm run dev
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Then open <code>http://localhost:3000</code> in your browser.
                    </div>
                  </div>
                )}
              </div>

              {/* URL Input Form */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-slate-700">
                  Backend API Base URL (must end with /api/v1):
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={customBackendUrl}
                    onChange={(e) => {
                      setCustomBackendUrl(e.target.value);
                      setTestEndpointResult(null);
                    }}
                    placeholder="https://your-tunnel.loca.lt/api/v1 or http://localhost:8080/api/v1"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-500">Quick Presets:</div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomBackendUrl('http://localhost:8080/api/v1');
                        handleTestEndpoint('http://localhost:8080/api/v1');
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-[11px] font-medium transition-colors"
                    >
                      Local Port 8080
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomBackendUrl('http://localhost:8081/api/v1');
                        handleTestEndpoint('http://localhost:8081/api/v1');
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-[11px] font-medium transition-colors"
                    >
                      Local Port 8081
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomBackendUrl('/api/v1');
                        handleTestEndpoint('/api/v1');
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-[11px] font-medium transition-colors"
                    >
                      Cloud Gateway Sandbox (/api/v1)
                    </button>
                  </div>
                </div>
              </div>

              {/* Test Connection Action & Result */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Live Endpoint Probe:</span>
                  <button
                    type="button"
                    onClick={() => handleTestEndpoint(customBackendUrl)}
                    disabled={testingEndpoint || !customBackendUrl.trim()}
                    className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-800 transition-colors flex items-center space-x-1"
                  >
                    <Activity className={`w-3.5 h-3.5 ${testingEndpoint ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
                    <span>{testingEndpoint ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                {testEndpointResult && (
                  <div
                    className={`p-3 rounded-lg text-[11px] space-y-1.5 ${
                      testEndpointResult.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : testEndpointResult.isMixedContent
                        ? 'bg-amber-50 text-amber-900 border border-amber-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {testEndpointResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : testEndpointResult.isMixedContent ? (
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold leading-relaxed">{testEndpointResult.message}</div>
                        {testEndpointResult.latencyMs && (
                          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                            Round-trip response: {testEndpointResult.latencyMs}ms
                          </div>
                        )}
                      </div>
                    </div>

                    {testEndpointResult.isMixedContent && (
                      <div className="pt-2 border-t border-amber-200 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTunnelTab('tunnel')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[10px] flex items-center space-x-1"
                        >
                          <Zap className="w-3 h-3" />
                          <span>View HTTPS Tunnel Solution</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomBackendUrl('/api/v1');
                            handleTestEndpoint('/api/v1');
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded font-medium text-[10px]"
                        >
                          Switch to Cloud Gateway (/api/v1)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Local Spring Boot Command Helper */}
                <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/60 mt-2">
                  <span>Start local backend in terminal:</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('cd backend && ./mvnw spring-boot:run');
                      setCopiedTerminalCommand(true);
                      setTimeout(() => setCopiedTerminalCommand(false), 2000);
                    }}
                    className="font-mono text-[10px] bg-slate-200/70 hover:bg-slate-200 text-slate-800 px-2 py-0.5 rounded flex items-center space-x-1"
                  >
                    {copiedTerminalCommand ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTerminalCommand ? 'Copied!' : 'mvn spring-boot:run'}</span>
                  </button>
                </div>
              </div>

              {endpointSavedNotice && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Configuration saved! Base URL updated across all client workflows.</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetEndpoint}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default (:8080)</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEndpoint(customBackendUrl)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save &amp; Connect</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 mb-6 flex flex-wrap gap-1 shadow-xs">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'applications'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Underwriting Applications Desk</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800">
              {applications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'leads'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Enquiry &amp; Advisory Leads</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800">
              {enquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('test_drives')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'test_drives'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Test Drive Dispatch</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800">
              {testDrives.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'analytics'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Credit &amp; Portfolio Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Fleet &amp; Pricing Inventory</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: APPLICATIONS UNDERWRITING DESK                    */}
        {/* ======================================================== */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700 flex items-center mr-1">
                  <Filter className="w-3.5 h-3.5 mr-1 text-slate-500" /> Filter Status:
                </span>
                {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'DOCS_REQUIRED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setTimeout(handleFilterApplications, 0);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilterApplications()}
                    placeholder="Search name, ref, car..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 w-48 sm:w-60"
                  />
                </div>
                <button
                  onClick={handleFilterApplications}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Reference / Date</th>
                      <th className="px-4 py-3">Applicant Name</th>
                      <th className="px-4 py-3">Employment &amp; Income</th>
                      <th className="px-4 py-3">Vehicle Details</th>
                      <th className="px-4 py-3">Loan Amount</th>
                      <th className="px-4 py-3">CIBIL Score</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center">
                          <div className="max-w-xs mx-auto text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-xs font-bold text-slate-700">No Applications in Queue</div>
                            <div className="text-[11px] text-slate-500">
                              No loan dossiers have been submitted in MongoDB yet. Once customers submit financing requests via the public portal, they will appear here in real-time.
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => {
                        const monthlyInc = app.employment?.monthlyGrossIncome || 0;
                        const cibil = (app as any).cibilScore || 750;
                        return (
                          <tr key={app.applicationId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-slate-900">
                              <div>{app.referenceNumber}</div>
                              <div className="text-[10px] text-slate-400 font-sans">
                                {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-900">
                                {app.applicant?.firstName} {app.applicant?.lastName}
                              </div>
                              <div className="text-[11px] text-slate-500">{app.applicant?.email}</div>
                              <div className="text-[10px] text-slate-400">{app.applicant?.city}, {app.applicant?.state}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-800">
                                {app.employment?.employmentType?.replace('_', ' ') || 'Salaried'}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                                {app.employment?.employerName || app.employment?.jobTitle || 'Corporate'}
                              </div>
                              <div className="text-[11px] font-bold text-slate-900">
                                {formatCurrency(monthlyInc)}/mo
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-900">
                                {app.vehicleDetails?.make} {app.vehicleDetails?.model}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {app.vehicleDetails?.trim || 'Standard'} ({app.vehicleDetails?.year || 2026})
                              </div>
                              <div className="text-[10px] text-slate-400">
                                MSRP: {formatCurrency(app.vehicleDetails?.purchasePrice)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-900">
                                {formatCurrency(app.loanTerms?.requestedLoanAmount)}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {app.loanTerms?.tenureMonths} mos ({Math.round(app.loanTerms?.tenureMonths / 12)} yrs)
                              </div>
                              {app.loanTerms?.approvedAmount && (
                                <div className="text-[10px] text-emerald-700 font-semibold">
                                  Approved: {formatCurrency(app.loanTerms?.approvedAmount)}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded ${
                                  cibil >= 775
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : cibil >= 725
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {cibil}
                              </span>
                            </td>
                            <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleSelectAppForReview(app)}
                                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold text-[11px] hover:bg-slate-800 transition-colors shadow-xs"
                              >
                                Review Dossier
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Application Detail Underwriting Modal / Review Desk */}
            {selectedApp && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
                  
                  {/* Modal Header */}
                  <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Credit Underwriting Dossier
                        </span>
                        <span>·</span>
                        <span className="text-[11px] font-mono font-semibold text-emerald-400">
                          {selectedApp.referenceNumber}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {selectedApp.applicant?.firstName} {selectedApp.applicant?.lastName} — Loan Assessment
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                    {/* Key Applicant Financial Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-bold uppercase">CIBIL Credit Score</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                          {(selectedApp as any).cibilScore || 785}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Prime Bureau Tier</div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-bold uppercase">Monthly Income</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                          {formatCurrency(selectedApp.employment?.monthlyGrossIncome)}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {selectedApp.employment?.employerName}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-bold uppercase">Requested Loan</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                          {formatCurrency(selectedApp.loanTerms?.requestedLoanAmount)}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Tenure: {selectedApp.loanTerms?.tenureMonths} Months
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="text-slate-500 text-[10px] font-bold uppercase">Debt-To-Income</div>
                        <div className="text-xl font-extrabold text-slate-900 mt-0.5">24.5%</div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Healthy &lt; 50%</div>
                      </div>
                    </div>

                    {/* Applicant & Vehicle Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                        <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1.5 text-slate-600" /> Applicant &amp; KYC Profile
                        </h4>
                        <div className="space-y-1.5 text-slate-600">
                          <div><span className="font-semibold text-slate-700">Full Name:</span> {selectedApp.applicant?.firstName} {selectedApp.applicant?.lastName}</div>
                          <div><span className="font-semibold text-slate-700">Email:</span> {selectedApp.applicant?.email}</div>
                          <div><span className="font-semibold text-slate-700">Phone:</span> {selectedApp.applicant?.phone}</div>
                          <div><span className="font-semibold text-slate-700">Address:</span> {selectedApp.applicant?.addressLine1}, {selectedApp.applicant?.city}, {selectedApp.applicant?.state} - {selectedApp.applicant?.postalCode}</div>
                          <div><span className="font-semibold text-slate-700">Housing:</span> {selectedApp.applicant?.housingStatus || 'Own with Mortgage'}</div>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                        <h4 className="font-bold text-slate-900 mb-2 flex items-center">
                          <Car className="w-3.5 h-3.5 mr-1.5 text-slate-600" /> Vehicle Collateral &amp; Down Payment
                        </h4>
                        <div className="space-y-1.5 text-slate-600">
                          <div><span className="font-semibold text-slate-700">Vehicle:</span> {selectedApp.vehicleDetails?.make} {selectedApp.vehicleDetails?.model} ({selectedApp.vehicleDetails?.year})</div>
                          <div><span className="font-semibold text-slate-700">Trim:</span> {selectedApp.vehicleDetails?.trim}</div>
                          <div><span className="font-semibold text-slate-700">Purchase Price:</span> {formatCurrency(selectedApp.vehicleDetails?.purchasePrice)}</div>
                          <div><span className="font-semibold text-slate-700">Down Payment:</span> {formatCurrency(selectedApp.loanTerms?.downPayment)}</div>
                          <div><span className="font-semibold text-slate-700">Down Payment %:</span> {Math.round(((selectedApp.loanTerms?.downPayment || 0) / (selectedApp.vehicleDetails?.purchasePrice || 1)) * 100)}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Required Documents Review Panel */}
                    <div className="border border-slate-200 rounded-xl p-4">
                      <h4 className="font-bold text-slate-900 mb-2.5 flex items-center justify-between">
                        <span className="flex items-center">
                          <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                          Document Verification Checklist
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          Click to verify or flag applicant documents
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {selectedApp.requiredDocuments?.map((doc) => (
                          <div
                            key={doc.documentId}
                            className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div>
                              <div className="font-semibold text-slate-800">
                                {doc.documentType.replace('_', ' ')}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {doc.fileName || 'Pending upload by applicant'}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  doc.status === 'VERIFIED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : doc.status === 'UPLOADED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {doc.status}
                              </span>
                              {doc.status !== 'VERIFIED' && (
                                <button
                                  onClick={() => handleVerifyDocument(doc.documentId, 'VERIFIED')}
                                  className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700"
                                >
                                  Mark Verified
                                </button>
                              )}
                              {doc.status !== 'REJECTED' && (
                                <button
                                  onClick={() => handleVerifyDocument(doc.documentId, 'REJECTED')}
                                  className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700"
                                >
                                  Flag/Reject
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Underwriter Action Box */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
                      <h4 className="font-bold text-white text-sm flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
                        Underwriting Sanction &amp; Approval Action
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                            Decision Status
                          </label>
                          <select
                            value={reviewStatus}
                            onChange={(e) => setReviewStatus(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                          >
                            <option value="UNDER_REVIEW">UNDER REVIEW</option>
                            <option value="APPROVED">APPROVE LOAN SANCTION</option>
                            <option value="DOCS_REQUIRED">REQUEST FURTHER DOCUMENTS</option>
                            <option value="REJECTED">DECLINE / REJECT LOAN</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                            Approved Loan Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={approvedAmount}
                            onChange={(e) => setApprovedAmount(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                            Sanctioned APR Rate (%)
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            value={offeredApr}
                            onChange={(e) => setOfferedApr(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Underwriter Rationale &amp; Audit Trail Note
                        </label>
                        <textarea
                          rows={2}
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                          placeholder="e.g. Approved at 8.49% prime rate. CIBIL score verified at 785. 3 months salary slips validated against Bank of Baroda account."
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none placeholder:text-slate-500"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={handleSubmitReview}
                          disabled={isSubmittingReview}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center space-x-1.5 shadow-md"
                        >
                          <Check className="w-4 h-4" />
                          <span>{isSubmittingReview ? 'Saving Decision...' : 'Commit Underwriting Decision'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ENQUIRIES & ADVISORY LEADS CRM                    */}
        {/* ======================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-semibold text-slate-700">Filter Leads:</span>
                {['ALL', 'NEW', 'IN_PROGRESS', 'CONTACTED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      enquiryStatusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-500">
                Total Leads in Pipeline: <span className="font-bold text-slate-900">{enquiries.length}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Ticket / Date</th>
                    <th className="px-4 py-3">Customer Contact</th>
                    <th className="px-4 py-3">Type &amp; Subject</th>
                    <th className="px-4 py-3">Assigned Advisor</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enquiries.filter((e) => enquiryStatusFilter === 'ALL' || e.status === enquiryStatusFilter).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <div className="max-w-xs mx-auto text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                            <Users className="w-5 h-5" />
                          </div>
                          <div className="text-xs font-bold text-slate-700">No Advisory Leads</div>
                          <div className="text-[11px] text-slate-500">
                            No consultation inquiries match the filter criteria in MongoDB.
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    enquiries
                      .filter((e) => enquiryStatusFilter === 'ALL' || e.status === enquiryStatusFilter)
                      .map((enq) => (
                      <tr key={enq.enquiryId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">
                          <div>{enq.referenceTicket}</div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">
                            {enq.customer?.firstName} {enq.customer?.lastName}
                          </div>
                          <div className="text-[11px] text-slate-500">{enq.customer?.email}</div>
                          <div className="text-[10px] text-slate-400">{enq.customer?.phone}</div>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="font-semibold text-slate-800">{enq.enquiryType?.replace('_', ' ')}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-2">{enq.message}</div>
                          {enq.vehicleReference?.make && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Target: {enq.vehicleReference?.make} {enq.vehicleReference?.model}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-medium">
                          {(enq as any).assignedAdvisor || 'Unassigned'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              enq.status === 'NEW'
                                ? 'bg-blue-100 text-blue-800'
                                : enq.status === 'IN_PROGRESS'
                                ? 'bg-amber-100 text-amber-800'
                                : enq.status === 'CONTACTED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setLeadStatus(enq.status);
                              setAssignedAdvisor((enq as any).assignedAdvisor || 'Priya Nair');
                              setResolutionNote('');
                            }}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold text-[11px] hover:bg-slate-800"
                          >
                            Manage Lead
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Lead Management Modal */}
            {selectedEnquiry && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-base text-slate-900">
                      Manage Advisory Ticket — {selectedEnquiry.referenceTicket}
                    </h3>
                    <button onClick={() => setSelectedEnquiry(null)} className="p-1 text-slate-400 hover:text-slate-900">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-800">
                      {selectedEnquiry.customer?.firstName} {selectedEnquiry.customer?.lastName}
                    </div>
                    <div className="text-slate-600">
                      {selectedEnquiry.customer?.email} · {selectedEnquiry.customer?.phone}
                    </div>
                    <div className="mt-1 text-slate-700 italic">&ldquo;{selectedEnquiry.message}&rdquo;</div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Lead Pipeline Status
                    </label>
                    <select
                      value={leadStatus}
                      onChange={(e) => setLeadStatus(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="NEW">NEW LEAD</option>
                      <option value="IN_PROGRESS">IN PROGRESS / DISCUSSING LOAN</option>
                      <option value="CONTACTED">CONTACTED &amp; QUOTE DELIVERED</option>
                      <option value="CONVERTED">CONVERTED TO APPLICATION</option>
                      <option value="CANCELLED">CANCELLED / NOT INTERESTED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Assign CarGuru Relationship Officer
                    </label>
                    <select
                      value={assignedAdvisor}
                      onChange={(e) => setAssignedAdvisor(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="Priya Nair (Senior Loan Advisor - Mumbai BKC)">Priya Nair (Senior Loan Advisor - Mumbai BKC)</option>
                      <option value="Vikramaditya Singhania (VIP Luxury Concierge - Delhi)">Vikramaditya Singhania (VIP Luxury Concierge - Delhi)</option>
                      <option value="Karan Verma (Trade-in & Refinancing Specialist)">Karan Verma (Trade-in &amp; Refinancing Specialist)</option>
                      <option value="Sunil Rao (Fleet & Commercial Loans - Bengaluru)">Sunil Rao (Fleet &amp; Commercial Loans - Bengaluru)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                      Add Internal CRM Note
                    </label>
                    <textarea
                      rows={2}
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="e.g. Client requested 8.49% rate quote for 5-year tenure. Sent WhatsApp proposal."
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateEnquiry(selectedEnquiry.enquiryId)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
                    >
                      Save Lead Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: TEST DRIVE SHOWROOM DISPATCH                      */}
        {/* ======================================================== */}
        {activeTab === 'test_drives' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">Pan-India Showroom Test Drive Bookings</h3>
                <span className="text-xs text-slate-500">Confirmed Slots: {testDrives.length}</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Confirmation #</th>
                    <th className="px-4 py-3">Customer Details</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Showroom Location</th>
                    <th className="px-4 py-3">Scheduled Slot</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {testDrives.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <div className="max-w-xs mx-auto text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                            <Car className="w-5 h-5" />
                          </div>
                          <div className="text-xs font-bold text-slate-700">No Test Drive Bookings</div>
                          <div className="text-[11px] text-slate-500">
                            No dealership test drive slots booked in MongoDB yet.
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    testDrives.map((b) => (
                    <tr key={b.bookingId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{b.confirmationCode}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{b.customer?.firstName} {b.customer?.lastName}</div>
                        <div className="text-[11px] text-slate-500">{b.customer?.phone}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{b.vehicleId}</td>
                      <td className="px-4 py-3 text-slate-600">{b.dealershipLocation}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{b.preferredDate}</div>
                        <div className="text-[10px] text-slate-500">{b.preferredTimeSlot}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => handleUpdateTestDrive(b.bookingId, 'COMPLETED')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700"
                        >
                          Completed
                        </button>
                        <button
                          onClick={() => handleUpdateTestDrive(b.bookingId, 'RESCHEDULED')}
                          className="px-2.5 py-1 bg-amber-600 text-white rounded text-[10px] font-semibold hover:bg-amber-700"
                        >
                          Reschedule
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CREDIT RISK & PORTFOLIO ANALYTICS (Analyst View)  */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && portfolioData && (
          <div className="space-y-6">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Total Loan Volume</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  ₹{(portfolioData.kpis.totalRequestedVolume / 10000000).toFixed(2)} Cr
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Approved: ₹{(portfolioData.kpis.totalApprovedVolume / 10000000).toFixed(2)} Cr
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Sanction Approval Rate</span>
                  <Percent className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  {portfolioData.kpis.approvalRate}%
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {portfolioData.kpis.approvedCount} approved · {portfolioData.kpis.underReviewCount} pending review
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Average Loan Ticket</span>
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  ₹{(portfolioData.kpis.avgTicketSize / 100000).toFixed(1)} Lakhs
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Across {portfolioData.kpis.totalApplications} formal applications
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Active Consultation Leads</span>
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-2">
                  {portfolioData.kpis.activeEnquiries} Leads
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {portfolioData.kpis.scheduledTestDrives} Scheduled VIP Drives
                </div>
              </div>
            </div>

            {/* Credit Bureau Tiers & Employment Risk Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CIBIL Score Tier Breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">CIBIL Bureau Risk Segmentation</h3>
                  <span className="text-[11px] text-slate-400">RBI Lending Guidelines</span>
                </div>
                <div className="space-y-3">
                  {portfolioData.cibilDistribution.map((tier) => (
                    <div key={tier.tier} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-800">
                        <span>{tier.tier}</span>
                        <span className="text-slate-500">
                          {tier.count} applicants (Est Default: {tier.defaultRateEst})
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-900 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              (tier.count / (portfolioData.kpis.totalApplications || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employment Segment Breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Employment Profile Distribution</h3>
                  <span className="text-[11px] text-slate-400">Salaried vs Business Owners</span>
                </div>
                <div className="space-y-3">
                  {portfolioData.employmentDistribution.map((emp) => (
                    <div key={emp.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-800">
                        <span>{emp.name.replace('_', ' ')}</span>
                        <span className="text-slate-500">
                          {emp.count} applicants ({emp.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${emp.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Volume Growth Historical Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Monthly Financing Growth &amp; Disbursement History</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                {portfolioData.monthlyVolumeHistory.map((m) => (
                  <div key={m.month} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-bold">{m.month}</div>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">₹{m.volumeCr} Cr</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{m.approvals} Sanctions</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && !portfolioData && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-900 mb-1">No Portfolio Risk Analytics Yet</div>
            <div className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no active loan applications in MongoDB to aggregate risk and underwriting performance metrics.
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: FLEET & PRICING INVENTORY (Website Owner)         */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Add Vehicle Form */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Register New Vehicle into CarGuru Fleet Catalog</h3>
              <form onSubmit={handleAddVehicle} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Make / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMW, Tata, Mercedes"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harrier EV, Taycan"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Base MSRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={newVehicle.baseMSRP}
                    onChange={(e) => setNewVehicle({ ...newVehicle, baseMSRP: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Trim / Variant</label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury Line AWD"
                    value={newVehicle.trim}
                    onChange={(e) => setNewVehicle({ ...newVehicle, trim: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Category</label>
                  <select
                    value={newVehicle.category}
                    onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="Premium SUV">Premium SUV</option>
                    <option value="Electric Vehicle">Electric Vehicle</option>
                    <option value="Luxury Performance">Luxury Performance</option>
                    <option value="Commercial Vehicle & Fleet">Commercial Vehicle &amp; Fleet</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Add Vehicle to Catalog
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Fleet Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-900">
                Live Inventory Vehicles ({vehicles.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {vehicles.map((v) => (
                  <div key={v.vehicleId} className="border border-slate-200 rounded-xl p-3 flex space-x-3 bg-slate-50">
                    <img
                      src={v.imageUrl}
                      alt={v.model}
                      className="w-24 h-20 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold text-slate-500">{v.category}</div>
                      <div className="font-bold text-slate-900 truncate">{v.make} {v.model}</div>
                      <div className="text-xs font-extrabold text-slate-900 mt-1">{formatCurrency(v.baseMSRP)}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{v.vehicleId}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

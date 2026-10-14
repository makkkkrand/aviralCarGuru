import React, { useState, useEffect } from 'react';
import { 
  apiClient, 
  FinancingApplicationDetail, 
  EnquiryDetail 
} from '../api/client';
import { 
  Search, 
  ShieldCheck, 
  FileUp, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  Car,
  ChevronRight,
  UploadCloud,
  FileCheck
} from 'lucide-react';

interface ApplicationTrackerProps {
  initialRef?: string;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ initialRef = '' }) => {
  const [referenceQuery, setReferenceQuery] = useState(initialRef);
  const [applicantEmail, setApplicantEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [application, setApplication] = useState<FinancingApplicationDetail | null>(null);
  const [enquiry, setEnquiry] = useState<EnquiryDetail | null>(null);

  // Document upload state
  const [docType, setDocType] = useState<any>('PAY_SLIP');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialRef) {
      handleSearch(initialRef);
    }
  }, [initialRef]);

  const handleSearch = async (refToSearch?: string) => {
    const q = (refToSearch || referenceQuery).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setApplication(null);
    setEnquiry(null);

    try {
      if (q.startsWith('VEL-ENQ') || q.startsWith('enq_')) {
        // Search Enquiry
        const res = await apiClient.getEnquiryById(q);
        setEnquiry(res);
      } else {
        // Search Financing Application
        const res = await apiClient.getFinancingApplication(q, applicantEmail || undefined);
        setApplication(res);
      }
    } catch (err: any) {
      setError(err.message || 'Reference record not located in central registry');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    setUploading(true);
    setUploadSuccess(null);

    try {
      const fileName = uploadFileName || `${docType.toLowerCase()}_verification.pdf`;
      const res = await apiClient.uploadApplicationDocument(application.applicationId || application.referenceNumber, {
        documentType: docType,
        fileName,
        fileContentType: 'application/pdf',
        fileContentBase64: 'JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZ...==', // Simulated base64
      });

      setUploadSuccess(`Attached document "${res.fileName}" securely to underwriting file.`);
      setUploadFileName('');
      // Refresh application detail
      const refreshed = await apiClient.getFinancingApplication(application.applicationId || application.referenceNumber);
      setApplication(refreshed);
    } catch (err: any) {
      setError(err.message || 'Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id="status-tracker" className="py-20 relative">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Encrypted Registry Portal</span>
          </div>
          <h2 className="heading-hero text-4xl sm:text-5xl lg:text-6xl text-white mb-3">
            APPLICATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">TRACKER</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Look up real-time underwriting milestones, track concierge ticket status, or upload verification documents directly to your loan dossier.
          </p>
        </div>

        {/* Search Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-[#090e1c]/95 border-white/10 shadow-2xl mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="form-label">Reference ID / Application Number</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. VEL-2026-..., app_..., or VEL-ENQ-..."
                  value={referenceQuery}
                  onChange={(e) => setReferenceQuery(e.target.value)}
                  className="form-control pl-10 font-mono text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-4 flex items-end">
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading || !referenceQuery.trim()}
                className="btn-pill btn-cyan w-full py-3.5 text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {loading ? 'Searching Registry...' : 'Search Record'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* RESULT: FINANCING APPLICATION FOUND */}
        {application && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Status Summary Banner */}
            <div className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-[#0d172e] to-[#070b14] border-white/15 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Reference: {application.referenceNumber}
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  {application.vehicleDetails?.year} {application.vehicleDetails?.make} {application.vehicleDetails?.model}
                </h3>
                <span className="text-xs text-cyan-300 font-mono mt-1 block">
                  Requested Loan: ${application.loanTerms?.requestedLoanAmount?.toLocaleString() || application.vehicleDetails?.purchasePrice?.toLocaleString() || '---'}
                </span>
              </div>

              <div className="flex flex-col md:items-end">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Current Decision</span>
                <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-glow-cyan">
                  {application.status}
                </span>
                <span className="text-[11px] text-slate-400 mt-2">
                  Submitted: {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>

            {/* Application Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Applicant Summary */}
              <div className="glass-panel p-6 rounded-3xl bg-[#090e1c] border-white/10 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <User className="w-4 h-4" />
                  <span>Borrower Information</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span className="font-bold text-white">{application.applicant?.firstName} {application.applicant?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-slate-300">{application.applicant?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-300">{application.applicant?.city}, {application.applicant?.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Gross:</span>
                    <span className="font-mono text-white font-bold">${application.employment?.monthlyGrossIncome?.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>

              {/* Loan Structure */}
              <div className="glass-panel p-6 rounded-3xl bg-[#090e1c] border-white/10 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Approved / Requested Terms</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Term Duration:</span>
                    <span className="font-mono text-white font-bold">{application.loanTerms?.tenureMonths} Months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Down Payment:</span>
                    <span className="font-mono text-emerald-400 font-bold">${application.loanTerms?.downPayment?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interest Rate:</span>
                    <span className="font-mono text-cyan-300 font-bold">3.99% Subsidized</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Underwriter:</span>
                    <span className="text-slate-300">Velora Elite Auto Desk</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Attached Documents List */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-[#090e1c] border-white/10">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>Verification Document Requirements</span>
              </h4>

              {application.requiredDocuments && application.requiredDocuments.length > 0 ? (
                <div className="space-y-2 mb-6">
                  {application.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <div>
                          <span className="font-bold text-white block">{doc.fileName || doc.documentType}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{doc.documentType} • Status: {doc.status}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        doc.status === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/15 text-center text-xs text-slate-400 mb-6">
                  No pending documents required. You can optionally upload updated pay stubs or bank statements below.
                </div>
              )}

              {/* Upload Document Form */}
              <form onSubmit={handleDocumentSubmit} className="pt-4 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="form-control text-xs"
                    >
                      <option value="PAY_SLIP">Recent Pay Stub</option>
                      <option value="BANK_STATEMENT">Bank Statement</option>
                      <option value="GOVERNMENT_ID">Government Photo ID</option>
                      <option value="PROOF_OF_RESIDENCE">Proof of Residence</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="form-label">File Description / Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. wright_paystub_oct.pdf"
                        value={uploadFileName}
                        onChange={(e) => setUploadFileName(e.target.value)}
                        className="form-control text-xs"
                      />
                      <button
                        type="submit"
                        disabled={uploading}
                        className="btn-pill btn-cyan text-xs py-2.5 px-6 shrink-0 font-bold"
                      >
                        {uploading ? 'Uploading...' : 'Attach Doc'}
                      </button>
                    </div>
                  </div>
                </div>

                {uploadSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}
              </form>
            </div>

          </div>
        )}

        {/* RESULT: ENQUIRY FOUND */}
        {enquiry && (
          <div className="glass-panel p-8 sm:p-10 rounded-3xl bg-[#090e1c] border-white/15 shadow-2xl animate-in fade-in duration-300 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                  Concierge Ticket: {enquiry.referenceTicket}
                </span>
                <h3 className="text-2xl font-display font-bold text-white">
                  Customer Inquiry ({enquiry.enquiryType})
                </h3>
              </div>
              <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 self-start sm:self-center">
                {enquiry.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 uppercase font-semibold block mb-1">Customer</span>
                <span className="font-bold text-white block text-sm">{enquiry.customer?.firstName} {enquiry.customer?.lastName}</span>
                <span className="text-slate-400 font-mono block">{enquiry.customer?.email}</span>
                <span className="text-slate-400 font-mono block">{enquiry.customer?.phone}</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 uppercase font-semibold block mb-1">Routing Details</span>
                <span className="text-slate-300 block">Preferred Time: <strong className="text-white">{enquiry.preferredTimeSlot}</strong></span>
                <span className="text-slate-300 block">Postal Zone: <strong className="text-white">{enquiry.postalCode}</strong></span>
                <span className="text-slate-300 block">Contact Method: <strong className="text-white">{enquiry.customer?.preferredContactMethod}</strong></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Customer Request Note:</span>
              <p className="text-sm text-slate-200 italic leading-relaxed">
                "{enquiry.message}"
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

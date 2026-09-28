import React, { useState, useEffect } from 'react';
import { apiClient, FinancingApplicationDetail, EnquiryDetail } from '../api/client';
import { Search, ShieldCheck, FileUp, CheckCircle, Clock, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

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
      setError(err.message || 'Reference not found in registry');
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
        fileContentBase64: 'JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZ...==', // Simulated PDF base64
      });

      setUploadSuccess(`Successfully attached ${res.fileName} to your loan file.`);
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
    <section id="status-tracker" className="py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Encrypted Registry Portal</span>
          </div>
          <h2 className="heading-hero text-4xl sm:text-5xl text-white mb-2">
            TRACK <span className="text-cyan-400">APPLICATION & ENQUIRY</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Look up real-time underwriting milestones and upload required verification documents.
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-[#090e1c]/95 border-white/10 shadow-2xl mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={referenceQuery}
                onChange={(e) => setReferenceQuery(e.target.value)}
                placeholder="Enter Reference (e.g. VEL-APP-2026-XXXX or VEL-ENQ-XXXX)"
                className="form-control pl-10"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-pill btn-cyan px-8 py-3 text-sm font-bold flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <span>{loading ? 'Searching...' : 'Check Status'}</span>
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Financing Application Detail Card */}
        {application && (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-[#090e1c]/95 border-cyan-500/30 shadow-2xl space-y-8 animate-in fade-in">
            
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Financing File
                </span>
                <h3 className="text-2xl font-display font-extrabold text-white">
                  {application.referenceNumber}
                </h3>
                <span className="text-xs text-slate-500">
                  Applicant: {application.applicant.firstName} {application.applicant.lastName} • {application.applicant.email}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {application.status}
                </span>
              </div>
            </div>

            {/* Vehicle & Loan Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Vehicle</span>
                <span className="font-semibold text-white text-sm">
                  {application.vehicleDetails.year} {application.vehicleDetails.make} {application.vehicleDetails.model}
                </span>
                <span className="text-xs text-slate-500 block">{application.vehicleDetails.trim}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Purchase Price</span>
                <span className="font-semibold text-white text-sm">
                  ${application.vehicleDetails.purchasePrice.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Financed Term</span>
                <span className="font-semibold text-cyan-300 text-sm">
                  {application.loanTerms.tenureMonths} Months (${application.loanTerms.requestedLoanAmount.toLocaleString()})
                </span>
              </div>
            </div>

            {/* Verification Documents Checklist & Upload */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Verification Documents</span>
              </h4>

              <div className="space-y-2 mb-6">
                {application.requiredDocuments?.map((doc) => (
                  <div
                    key={doc.documentId || doc.documentType}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        doc.status === 'UPLOADED' || doc.status === 'VERIFIED' ? 'bg-green-400' : 'bg-amber-400'
                      }`} />
                      <span className="font-semibold text-slate-200">{doc.documentType}</span>
                      {doc.fileName && <span className="text-slate-500">({doc.fileName})</span>}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      doc.status === 'UPLOADED' || doc.status === 'VERIFIED'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Upload Document Box */}
              <form onSubmit={handleDocumentSubmit} className="glass-panel p-5 rounded-2xl border-white/10 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Upload Required Document
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Document Category</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="form-control text-xs"
                    >
                      <option value="PAY_SLIP">Pay Slip / Proof of Income</option>
                      <option value="GOVERNMENT_ID">Government Photo ID (Passport / License)</option>
                      <option value="BANK_STATEMENT">Bank Statement</option>
                      <option value="PROOF_OF_RESIDENCE">Proof of Residence (Utility Bill)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">File Description</label>
                    <input
                      type="text"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      placeholder="e.g. august_2026_paystub.pdf"
                      className="form-control text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    PDF, JPEG, or PNG up to 10MB supported.
                  </span>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-pill btn-cyan text-xs px-5 py-2.5 flex items-center space-x-2"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Attaching...' : 'Attach Document'}</span>
                  </button>
                </div>

                {uploadSuccess && (
                  <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-xs">
                    {uploadSuccess}
                  </div>
                )}
              </form>
            </div>

            {/* Underwriting History Timeline */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                Underwriting Timeline
              </h4>
              <div className="space-y-3">
                {application.statusHistory?.map((h, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-white">{h.status}: </span>
                      <span className="text-slate-400">{h.note}</span>
                      <span className="text-slate-600 block text-[10px] mt-0.5">{h.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Customer Enquiry Detail Card */}
        {enquiry && (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl bg-[#090e1c]/95 border-cyan-500/30 shadow-2xl space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">Customer Enquiry</span>
                <h3 className="text-2xl font-display font-extrabold text-white">{enquiry.referenceTicket}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {enquiry.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block">Contact</span>
                <span className="text-white font-semibold">{enquiry.customer.firstName} {enquiry.customer.lastName}</span>
                <div>{enquiry.customer.email} • {enquiry.customer.phone}</div>
              </div>
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="text-white font-semibold">{enquiry.enquiryType}</span>
                <div>Preferred: {enquiry.customer.preferredContactMethod} ({enquiry.preferredTimeSlot})</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs">
              <span className="text-slate-500 block mb-1">Message Content</span>
              <p className="text-slate-200">{enquiry.message}</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

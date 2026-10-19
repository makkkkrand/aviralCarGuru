import React, { useState, useEffect } from 'react';
import { apiClient, FinancingApplicationDetail, EnquiryDetail } from '../api/client';
import { formatINR, formatINRLakhCrore } from '../utils/formatters';
import { Search, ShieldCheck, FileUp, Clock, AlertCircle, FileText, CheckCircle2, Building2, Check, ArrowRight } from 'lucide-react';
import { DocumentChecklist } from './DocumentChecklist';

interface ApplicationTrackerProps {
  initialRef?: string;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ initialRef = '' }) => {
  const [referenceQuery, setReferenceQuery] = useState(initialRef || 'VEL-APP-2026-DEMO01');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);

  const [application, setApplication] = useState<FinancingApplicationDetail | null>(null);
  const [enquiry, setEnquiry] = useState<EnquiryDetail | null>(null);

  // Document upload state
  const [docType, setDocType] = useState<any>('PAY_SLIP');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Cancel enquiry state
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of purchase timeline');

  useEffect(() => {
    if (initialRef) {
      handleSearch(initialRef);
    } else {
      // Default to load demo application
      handleSearch('VEL-APP-2026-DEMO01');
    }
  }, [initialRef]);

  const handleSearch = async (refToSearch?: string) => {
    const q = (refToSearch || referenceQuery).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setApplication(null);
    setEnquiry(null);
    setUploadSuccess(null);

    try {
      if (q.startsWith('VEL-ENQ') || q.startsWith('CG-ENQ') || q.startsWith('enq_')) {
        const res = await apiClient.getEnquiryById(q);
        setEnquiry(res);
      } else {
        const res = await apiClient.getFinancingApplication(q, applicantEmail || undefined);
        setApplication(res);
      }
    } catch (err: any) {
      setError(err.message || 'Reference code not found. Please verify the code.');
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
      const fileNameToSubmit = uploadFileName.trim() || `${docType.toLowerCase()}_kyc_verified.pdf`;
      await apiClient.uploadApplicationDocument(application.applicationId, {
        documentType: docType,
        fileName: fileNameToSubmit,
        fileContentType: 'application/pdf',
        fileContentBase64: 'JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDw...',
      });

      setUploadSuccess(`Successfully submitted ${docType.replace('_', ' ')} (${fileNameToSubmit}). Status updated.`);
      setUploadFileName('');

      // Refresh application details to show uploaded document
      const updated = await apiClient.getFinancingApplication(application.applicationId);
      setApplication(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelEnquiry = async () => {
    if (!enquiry) return;
    setCancelling(true);
    try {
      await apiClient.cancelEnquiry(enquiry.enquiryId, { reason: cancelReason });
      const updated = await apiClient.getEnquiryById(enquiry.enquiryId);
      setEnquiry(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel enquiry ticket');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'SANCTIONED':
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">SANCTIONED / APPROVED</span>;
      case 'UNDER_REVIEW':
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">UNDERWRITING IN PROGRESS</span>;
      case 'SUBMITTED':
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">DOCUMENTS RECEIVED</span>;
      case 'DECLINED':
      case 'CANCELLED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">{status}</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="max-w-2xl mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            CarGuru India Portal
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Application &amp; Consultation Status
          </h1>
          <p className="text-xs text-slate-600 leading-normal">
            Track real-time underwriting progress for your vehicle loan dossier or advisory enquiry. Upload required documents (PAN Card, ITR Form 16, Salary Slips, Bank Statements) for expedited sanction.
          </p>
        </div>

        {/* Search Bar & Quick Demo Chips */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={referenceQuery}
                onChange={(e) => setReferenceQuery(e.target.value)}
                placeholder="Enter Reference Number (e.g. VEL-APP-2026-DEMO01)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors shadow-xs"
            >
              {loading ? 'Locating...' : 'Track Reference'}
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>Quick Samples:</span>
            <button
              type="button"
              onClick={() => {
                setReferenceQuery('VEL-APP-2026-DEMO01');
                handleSearch('VEL-APP-2026-DEMO01');
              }}
              className="text-slate-700 underline font-mono hover:text-slate-900"
            >
              VEL-APP-2026-DEMO01 (Loan)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setReferenceQuery('VEL-ENQ-DEMO01');
                handleSearch('VEL-ENQ-DEMO01');
              }}
              className="text-slate-700 underline font-mono hover:text-slate-900"
            >
              VEL-ENQ-DEMO01 (Consultation)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs mb-6 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. FINANCING APPLICATION RESULT */}
        {application && (
          <div className="space-y-6">
            
            {/* Summary Top Card */}
            <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[11px] text-slate-500 font-mono mb-0.5">Reference: {application.referenceNumber}</div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {application.vehicleDetails.year} {application.vehicleDetails.make} {application.vehicleDetails.model}
                  </h2>
                </div>
                <div>{getStatusBadge(application.status)}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Applicant</div>
                  <div className="font-semibold text-slate-900">{application.applicant.firstName} {application.applicant.lastName}</div>
                  <div className="text-slate-500 text-[11px]">{application.applicant.city}, {application.applicant.state} ({application.applicant.postalCode})</div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">Asset / Ex-Showroom</div>
                  <div className="font-semibold text-slate-900 tabular-nums">
                    {formatINR(application.vehicleDetails.purchasePrice)}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    ({formatINRLakhCrore(application.vehicleDetails.purchasePrice)})
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">Down Payment</div>
                  <div className="font-semibold text-slate-900 tabular-nums">
                    {formatINR(application.loanTerms.downPayment)}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {application.loanTerms.tenureMonths} Mo @ 8.49% p.a. Prime
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium">Requested Principal</div>
                  <div className="font-semibold text-emerald-700 tabular-nums">
                    {formatINR(application.loanTerms.requestedLoanAmount || (application.vehicleDetails.purchasePrice - application.loanTerms.downPayment))}
                  </div>
                  <div className="text-slate-500 text-[11px]">Pan-India Settlement Desk</div>
                </div>
              </div>
            </div>

            {/* Workflow Milestones */}
            <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <h3 className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-4">
                CarGuru Underwriting &amp; Sanction Milestones
              </h3>

              <div className="space-y-4">
                {application.statusHistory && application.statusHistory.length > 0 ? (
                  application.statusHistory.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                        <Check className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-semibold text-slate-900">{step.status}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(step.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{step.note}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Initial underwriting record created.</p>
                )}
              </div>
            </div>

            {/* KYC & Financial Documents Section */}
            <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                    KYC &amp; Income Verification Documents
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Upload PAN Card, Aadhaar, ITR Form 16, or recent salary slips to speed up bank disbursement.
                  </p>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2">
                {application.requiredDocuments?.map((doc) => (
                  <div key={doc.documentId} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="font-semibold text-slate-900">{doc.documentType.replace('_', ' ')}</div>
                        <div className="text-[11px] text-slate-500">{doc.fileName || 'Pending upload from applicant'}</div>
                      </div>
                    </div>
                    <div>
                      {doc.status === 'VERIFIED' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">VERIFIED</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">PENDING KYC</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Form */}
              <form onSubmit={handleDocumentSubmit} className="pt-3 border-t border-slate-100 space-y-3">
                <div className="text-xs font-semibold text-slate-800">Upload Additional Document</div>

                {uploadSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    >
                      <option value="PAY_SLIP">Salary Slip (Recent 3 Months)</option>
                      <option value="TAX_RETURN">ITR Form 16 / Computation</option>
                      <option value="BANK_STATEMENT">Bank Statement (6 Months)</option>
                      <option value="GOVERNMENT_ID">PAN Card / Aadhaar Copy</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 font-medium block mb-1">Document File Name</label>
                    <input
                      type="text"
                      placeholder="e.g. ITR_AY2025_26.pdf"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full py-1.5 px-3 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Transmitting...' : 'Upload Document'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* 2. ENQUIRY / CONSULTATION TICKET RESULT */}
        {enquiry && (
          <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-[11px] text-slate-500 font-mono">Ticket #{enquiry.referenceTicket}</div>
                <h2 className="text-base font-bold text-slate-900">CarGuru Finance Consultation Status</h2>
              </div>
              <div>{getStatusBadge(enquiry.status)}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Customer:</span>
                <div className="font-semibold text-slate-900">{enquiry.customer.firstName} {enquiry.customer.lastName}</div>
                <div className="text-slate-500 text-[11px]">{enquiry.customer.phone}</div>
              </div>

              <div>
                <span className="text-slate-500 font-medium">Inquiry Type:</span>
                <div className="font-semibold text-slate-900">{enquiry.enquiryType}</div>
                <div className="text-slate-500 text-[11px]">PIN: {enquiry.postalCode}</div>
              </div>

              <div>
                <span className="text-slate-500 font-medium">Logged At:</span>
                <div className="font-semibold text-slate-900">
                  {new Date(enquiry.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium block mb-1">Requirement Details:</span>
              <p className="text-slate-700 italic">"{enquiry.message}"</p>
            </div>

            {enquiry.status !== 'CANCELLED' && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Need to reschedule or withdraw this request?</span>
                <button
                  onClick={handleCancelEnquiry}
                  disabled={cancelling}
                  className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-medium transition-colors"
                >
                  {cancelling ? 'Updating...' : 'Cancel Consultation Ticket'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

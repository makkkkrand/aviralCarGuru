import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, Car, Calendar, MapPin, Building2, FileText, Phone, Mail } from 'lucide-react';
import { formatINR, formatINRLakhCrore } from '../utils/formatters';

export type InvoiceType = 'loan' | 'test_drive' | 'enquiry';

interface FinanceInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: InvoiceType;
  data: any; // FinancingApplicationDetail | TestDriveBooking | EnquiryDetail
}

export const FinanceInvoiceModal: React.FC<FinanceInvoiceModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Calculate invoice numbers & values based on type
  const invoiceNumber =
    type === 'loan'
      ? `CG-INV-${(data.referenceNumber || 'APP-2026').replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`
      : type === 'test_drive'
      ? `CG-PASS-${(data.confirmationCode || 'TD-2026').replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`
      : `CG-VOUCH-${(data.referenceTicket || 'ENQ-2026').replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 print:shadow-none print:border-none print:m-0 print:max-w-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="bg-slate-900 px-6 py-3 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-500/30">
              Official Document
            </span>
            <span className="text-xs font-semibold text-slate-300 font-mono">{invoiceNumber}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 space-y-6 text-slate-800 text-xs bg-white print:p-6" id="printable-invoice">
          
          {/* Header Strip */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Car className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-extrabold text-base tracking-wider text-slate-900">CARGURU INDIA</div>
                  <div className="text-[10px] text-slate-500 font-medium">Pan-India Automotive Financing Consortium</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-2 leading-relaxed">
                402, Maker Chambers V, Nariman Point, Mumbai 400021<br />
                GSTIN: 27AABCV8942N1ZG · CIN: U65923MH2026PTC192842<br />
                RBI Registered Loan Syndicate Intermediary Desk
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block px-3 py-1 rounded bg-slate-100 border border-slate-200 font-bold text-[11px] uppercase tracking-wider text-slate-900">
                {type === 'loan'
                  ? 'Loan Sanction & Tax Invoice'
                  : type === 'test_drive'
                  ? 'Showroom Test Drive Pass'
                  : 'Advisory Service Voucher'}
              </div>
              <div className="font-mono text-xs font-bold text-slate-900 pt-1">
                Ref #{invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-500">Date: {invoiceDate}</div>
              <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Digitally Certified
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 1. LOAN SANCTION INVOICE CONTENT                          */}
          {/* ========================================================= */}
          {type === 'loan' && (
            <div className="space-y-6">
              {/* Bill To & Lending Partner */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                    Billed To / Borrower
                  </div>
                  <div className="font-bold text-sm text-slate-900">
                    {data.applicant?.firstName} {data.applicant?.lastName}
                  </div>
                  <div className="text-slate-600 mt-0.5">{data.applicant?.email}</div>
                  <div className="text-slate-600">{data.applicant?.phone}</div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    {data.applicant?.city}, {data.applicant?.state} - {data.applicant?.postalCode}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-1">
                    PAN: {data.applicant?.panNumber || 'ABCDE1234F'} · CIBIL: {data.cibilScore || 775}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                    Sanctioning Lending Syndicate
                  </div>
                  <div className="font-bold text-sm text-slate-900 flex items-center">
                    <Building2 className="w-4 h-4 mr-1.5 text-blue-600" />
                    HDFC Auto Finance Consortium
                  </div>
                  <div className="text-slate-600 mt-0.5">Underwriting Unit · Pan-India Auto Hub</div>
                  <div className="text-slate-500 text-[11px]">
                    Vehicle Asset: {data.vehicleDetails?.year} {data.vehicleDetails?.make} {data.vehicleDetails?.model} ({data.vehicleDetails?.trim || 'Standard'})
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Ex-Showroom: {formatINR(data.vehicleDetails?.purchasePrice || 2500000)}
                  </div>
                </div>
              </div>

              {/* Sanctioned Terms Table */}
              <div>
                <div className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
                  Approved Financing Structure &amp; Fee Breakdown
                </div>
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Component / Description</th>
                      <th className="p-2.5">Tenure / Rate</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-900">
                        Sanctioned Principal Loan Amount
                        <div className="text-[10px] text-slate-500 font-normal">Disbursable to authorized dealer account</div>
                      </td>
                      <td className="p-2.5 font-mono text-slate-700">
                        {data.loanTerms?.tenureMonths || 60} Mos @ {data.loanTerms?.offeredApr || 8.49}% p.a.
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        {formatINR(data.loanTerms?.approvedAmount || data.loanTerms?.requestedLoanAmount || 2000000)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Borrower Down Payment (Equity)</td>
                      <td className="p-2.5 text-slate-500">Paid directly at showroom</td>
                      <td className="p-2.5 text-right font-mono text-slate-700">
                        {formatINR(data.loanTerms?.downPayment || 500000)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Lender Processing Fee (0.50% concessional)</td>
                      <td className="p-2.5 text-slate-500">Standard syndicated tariff</td>
                      <td className="p-2.5 text-right font-mono text-slate-700">₹6,500.00</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">GST on Processing Fee @ 18%</td>
                      <td className="p-2.5 text-slate-500">CGST (9%) + SGST (9%)</td>
                      <td className="p-2.5 text-right font-mono text-slate-700">₹1,170.00</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">State RTO Hypothecation &amp; Stamp Duty</td>
                      <td className="p-2.5 text-slate-500">State specific statutory levy</td>
                      <td className="p-2.5 text-right font-mono text-slate-700">₹1,500.00</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="p-2.5">Monthly Equated Installment (EMI)</td>
                      <td className="p-2.5 text-emerald-700">Starting 1st of next month</td>
                      <td className="p-2.5 text-right font-mono text-emerald-800 text-sm">
                        ₹{Math.round(((data.loanTerms?.approvedAmount || data.loanTerms?.requestedLoanAmount || 2000000) * 0.0205)).toLocaleString('en-IN')}/mo
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. TEST DRIVE PASS CONTENT                                */}
          {/* ========================================================= */}
          {type === 'test_drive' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                    Driver / Customer
                  </div>
                  <div className="font-bold text-sm text-slate-900">
                    {data.customer?.firstName} {data.customer?.lastName}
                  </div>
                  <div className="text-slate-600 mt-0.5">{data.customer?.phone}</div>
                  <div className="text-slate-600">{data.customer?.email}</div>
                  <div className="text-[11px] text-slate-500 mt-2 font-mono">
                    Security Pass Code: {data.confirmationCode}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                    Showroom Hub &amp; Schedule
                  </div>
                  <div className="font-bold text-sm text-slate-900 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1" />
                    {data.dealershipLocation || 'Andheri West Showroom Hub, Mumbai'}
                  </div>
                  <div className="text-slate-700 font-semibold mt-1 flex items-center">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 mr-1" />
                    {data.preferredDate || 'Upcoming Slot'} · {data.preferredTimeSlot || '11:00 AM - 12:30 PM'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Assigned Vehicle: <strong className="text-slate-800">{data.vehicleId}</strong>
                  </div>
                </div>
              </div>

              {/* Protocol & Verification Checklist */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                <div className="font-bold text-xs text-slate-900">Pre-Drive Security &amp; Safety Compliance:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Valid Original Driving License</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Zero Liability Test Drive Insurance</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Dealership Co-Pilot Accompaniment</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Sanitized &amp; 100% Fuelled/Charged Asset</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. ADVISORY CONSULTATION VOUCHER CONTENT                  */}
          {/* ========================================================= */}
          {type === 'enquiry' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                    Client Details
                  </div>
                  <div className="font-bold text-sm text-slate-900">
                    {data.customer?.firstName} {data.customer?.lastName}
                  </div>
                  <div className="text-slate-600 mt-0.5">{data.customer?.email}</div>
                  <div className="text-slate-600">{data.customer?.phone}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    Ticket Ref: {data.referenceTicket}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                    Advisory Assignment
                  </div>
                  <div className="font-bold text-sm text-slate-900">
                    Lead Guru: {data.assignedAdvisor || 'Senior Financial Advisor'}
                  </div>
                  <div className="text-slate-600 text-[11px]">Specialization: Auto Loans &amp; Tax Structuring</div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    Category: {data.enquiryType?.replace('_', ' ') || 'General Financing'}
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <div className="font-bold text-xs text-slate-900">Consultation Deliverables (Complimentary Voucher):</div>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Multi-Bank Interest Rate Comparison across HDFC, SBI, ICICI, Kotak &amp; Axis.</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>CIBIL Score Optimization and Debt-to-Income (DTI) Assessment.</span>
                  </li>
                  <li className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Sec 80EEB EV Tax Benefit analysis and commercial fleet depreciation schedules.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Footer Terms & Signatures */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <div>This is a computer-generated tax invoice and pro-forma sanction voucher.</div>
              <div>Authorized by CarGuru India Lending Syndicate Operations.</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">CarGuru India Operations Desk</div>
              <div className="font-mono text-[10px] text-slate-400">AUTHENTICATED DIGITAL DISPATCH</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

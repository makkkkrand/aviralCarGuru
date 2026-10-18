import React, { useState } from 'react';
import { FileText, CheckCircle2, AlertCircle, X, Download, Printer, User, Building2, Car, HelpCircle, ShieldCheck, ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';

export type LoanApplicantType = 'salaried' | 'self_employed' | 'used_car' | 'commercial';

interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  mandatory: boolean;
  note?: string;
  acceptedFormats: string;
}

interface DocumentChecklistProps {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: 'modal' | 'embedded';
  defaultCategory?: LoanApplicantType;
  onProceedToApply?: () => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  isOpen = true,
  onClose,
  variant = 'modal',
  defaultCategory = 'salaried',
  onProceedToApply,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LoanApplicantType>(defaultCategory);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  if (variant === 'modal' && !isOpen) return null;

  const categories: { id: LoanApplicantType; label: string; icon: React.ReactNode; badge: string }[] = [
    { id: 'salaried', label: 'Salaried Employees', icon: <User className="w-3.5 h-3.5" />, badge: 'MNC / Corporate / Govt' },
    { id: 'self_employed', label: 'Self-Employed / Business', icon: <Building2 className="w-3.5 h-3.5" />, badge: 'Proprietor / Partner / Director' },
    { id: 'used_car', label: 'Pre-Owned & Refinance', icon: <Car className="w-3.5 h-3.5" />, badge: 'Used Car & Balance Transfer' },
    { id: 'commercial', label: 'Commercial & Fleet', icon: <Building2 className="w-3.5 h-3.5" />, badge: 'Transport & Logistics' },
  ];

  const documentData: Record<LoanApplicantType, { description: string; items: ChecklistItem[] }> = {
    salaried: {
      description: 'Standard documentation for executives, software engineers, government officers, and corporate employees with regular monthly salary credits.',
      items: [
        {
          id: 'sal_pan',
          title: 'Permanent Account Number (PAN) Card',
          subtitle: 'Original/Clear scan of personal PAN card',
          mandatory: true,
          note: 'Mandatory under RBI KYC directives for CIBIL bureau verification and tax record match.',
          acceptedFormats: 'PDF / JPEG / Digilocker e-PAN',
        },
        {
          id: 'sal_aadhaar',
          title: 'Aadhaar Card or Passport / Voter ID',
          subtitle: 'Valid government identity & residential address proof',
          mandatory: true,
          note: 'Ensure your current mobile number is linked to Aadhaar for instant OTP paperless e-KYC.',
          acceptedFormats: 'e-Aadhaar PDF / Front & Back Scan',
        },
        {
          id: 'sal_payslips',
          title: 'Salary Slips (Last 3 Months)',
          subtitle: 'Official salary pay slips showing Basic, HRA, Gross, and Net Take-Home',
          mandatory: true,
          note: 'Must carry employer company logo, employee code, and breakdown of statutory deductions (PF/TDS).',
          acceptedFormats: 'Official PDF from HR Portal',
        },
        {
          id: 'sal_bank',
          title: 'Salary Bank Account Statement (Last 6 Months)',
          subtitle: 'Detailed statement of the bank account where monthly salary is credited',
          mandatory: true,
          note: 'Download official e-statement from Net Banking. Avoid scans with missing transaction pages or passwords.',
          acceptedFormats: 'Bank-generated PDF e-Statement',
        },
        {
          id: 'sal_form16',
          title: 'Form 16 (Part A & B) or 2 Years ITR',
          subtitle: 'Certificate of tax deducted at source issued by employer',
          mandatory: true,
          note: 'Verifies annual gross earnings and continuous employment record across financial years.',
          acceptedFormats: 'Form 16 PDF / ITR-V Acknowledgement',
        },
        {
          id: 'sal_empid',
          title: 'Corporate Employee ID or Work Email Verification',
          subtitle: 'Proof of active employment in the current organization',
          mandatory: false,
          note: 'Expedites special corporate tier discounts and waived processing fees.',
          acceptedFormats: 'Company ID Card Scan / Offer Letter',
        },
      ],
    },
    self_employed: {
      description: 'Documentation for business owners, partners, private limited directors, doctors, chartered accountants, and independent professionals.',
      items: [
        {
          id: 'se_pan',
          title: 'PAN Card (Individual + Enterprise)',
          subtitle: 'Personal PAN of Promoters/Directors + Firm PAN (if Partnership/Company)',
          mandatory: true,
          note: 'Both individual and commercial entity PAN cards required for corporate loans.',
          acceptedFormats: 'PDF / Clear Color Scan',
        },
        {
          id: 'se_aadhaar',
          title: 'Aadhaar & Residential Address Proof',
          subtitle: 'KYC of all primary partners, proprietors, or major directors',
          mandatory: true,
          note: 'Passport, Voter ID, or Utility bill (under 2 months) accepted for current residential address.',
          acceptedFormats: 'Aadhaar PDF / Passport Copies',
        },
        {
          id: 'se_gst',
          title: 'GST Registration & Latest 3B Returns (6 Months)',
          subtitle: 'GST Certificate (REG-06) and proof of active business turnover',
          mandatory: true,
          note: 'Validates legal business continuity and active commercial cash flows.',
          acceptedFormats: 'GST Portal Downloaded PDFs',
        },
        {
          id: 'se_entity',
          title: 'Business Registration / Incorporation Proof',
          subtitle: 'Udyam MSME Certificate / Shop & Establishment Act / MOA & AOA / Partnership Deed',
          mandatory: true,
          note: 'Document proving firm existence and authorized signatory authority.',
          acceptedFormats: 'Official Government Certificate PDF',
        },
        {
          id: 'se_itr',
          title: 'Last 2 to 3 Years Income Tax Returns (ITR)',
          subtitle: 'ITR-3 / ITR-4 / ITR-5 with complete Computation of Income sheet',
          mandatory: true,
          note: 'Audited Financials (Balance Sheet & Profit & Loss Statement with CA seal) required for loans > ₹25 Lakhs.',
          acceptedFormats: 'ITR Acknowledgement & Computation PDF',
        },
        {
          id: 'se_current_bank',
          title: 'Current Account Bank Statements (Last 12 Months)',
          subtitle: 'Primary operating bank account of the business enterprise',
          mandatory: true,
          note: 'Must reflect regular customer inflows without cheque return or ECS bounce charges.',
          acceptedFormats: 'Official PDF Bank e-Statements',
        },
      ],
    },
    used_car: {
      description: 'Specific documentation required for purchasing certified pre-owned vehicles or refinancing an existing car loan to lower interest rates.',
      items: [
        {
          id: 'uc_kyc',
          title: 'Buyer & Seller KYC (PAN & Aadhaar)',
          subtitle: 'Identity and address proof of both purchasing applicant and current car owner',
          mandatory: true,
          note: 'Needed for RTO ownership transfer and anti-fraud title verification.',
          acceptedFormats: 'Color Scan / Digilocker PDF',
        },
        {
          id: 'uc_rc',
          title: 'Vehicle Registration Certificate (RC Book / Smart Card)',
          subtitle: 'Original copy of the current vehicle registration certificate',
          mandatory: true,
          note: 'CarGuru verifies hypothecation status, chassis number, and road tax validity across Parivahan RTO database.',
          acceptedFormats: 'Clear Front & Back Photo/Scan',
        },
        {
          id: 'uc_insurance',
          title: 'Valid Comprehensive Vehicle Insurance Policy',
          subtitle: 'Active insurance certificate with minimum 60 days validity remaining',
          mandatory: true,
          note: 'Third-party only insurance must be upgraded to comprehensive cover before loan disbursement.',
          acceptedFormats: 'Insurance Policy Schedule PDF',
        },
        {
          id: 'uc_rto_forms',
          title: 'RTO Transfer Forms (Form 29 & Form 30)',
          subtitle: 'Statutory transfer forms signed by registered seller',
          mandatory: true,
          note: 'CarGuru assistance team prepares and pre-fills these forms for your signature.',
          acceptedFormats: 'Signed Physical Form Scan',
        },
        {
          id: 'uc_foreclosure',
          title: 'Foreclosure Letter (For Loan Refinancing / Balance Transfer Only)',
          subtitle: 'Official letter from current lender stating exact loan settlement amount',
          mandatory: false,
          note: 'Required only if switching an existing high-interest car loan to CarGuru preferential rate.',
          acceptedFormats: 'Bank Foreclosure Letter PDF',
        },
      ],
    },
    commercial: {
      description: 'Documentation for logistics operators, tourist taxi providers, corporate transport fleets, and commercial cargo vehicle acquisition.',
      items: [
        {
          id: 'com_pan_kyc',
          title: 'Entity & Proprietor / Partner KYC',
          subtitle: 'PAN, Aadhaar, and Director / Partner identification documents',
          mandatory: true,
          note: 'Individual KYC of all guarantors/partners required by commercial lending desks.',
          acceptedFormats: 'Official Scan / PDF',
        },
        {
          id: 'com_permit',
          title: 'Commercial Driving License / Badge / State Permit',
          subtitle: 'Permit eligibility for commercial passenger or goods carrier category',
          mandatory: true,
          note: 'Not required if applying as a non-driving commercial transport enterprise.',
          acceptedFormats: 'Commercial License / RTO Permit',
        },
        {
          id: 'com_contracts',
          title: 'Client Service Contracts / Vendor Agreements',
          subtitle: 'Active client contracts (e.g. corporate cab services, courier logistics)',
          mandatory: false,
          note: 'Helps secure higher loan-to-value (up to 95%) and flexible seasonal repayment schedules.',
          acceptedFormats: 'Contract Copy / Work Order PDF',
        },
        {
          id: 'com_bank_12m',
          title: 'Commercial Bank Statements (Last 12 Months)',
          subtitle: 'Operating bank statement reflecting fleet revenue collections',
          mandatory: true,
          note: 'Demonstrates debt servicing capacity for multi-vehicle fleet financing.',
          acceptedFormats: 'Complete e-Statement PDF',
        },
      ],
    },
  };

  const currentDocs = documentData[selectedCategory];
  const totalCount = currentDocs.items.length;
  const checkedCount = currentDocs.items.filter((item) => checkedItems[item.id]).length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = () => {
    const updated: Record<string, boolean> = { ...checkedItems };
    currentDocs.items.forEach((item) => {
      updated[item.id] = true;
    });
    setCheckedItems(updated);
  };

  const handleResetChecklist = () => {
    const updated: Record<string, boolean> = { ...checkedItems };
    currentDocs.items.forEach((item) => {
      delete updated[item.id];
    });
    setCheckedItems(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const content = (
    <div className="space-y-5">
      {/* Category Persona Selector */}
      <div>
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Select Your Profile / Loan Type
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className={isSelected ? 'text-white' : 'text-slate-600'}>{cat.icon}</span>
                  <span className="text-xs font-bold leading-tight">{cat.label}</span>
                </div>
                <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {cat.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Overview & Preparedness Meter */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-slate-900">
              {categories.find((c) => c.id === selectedCategory)?.label} Checklist
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {currentDocs.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[11px] font-medium text-slate-700 hover:text-slate-900 underline"
            >
              Check All
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={handleResetChecklist}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-700 underline"
            >
              Reset
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1 text-[11px] font-medium text-slate-700 hover:text-slate-900"
              title="Print Checklist"
            >
              <Printer className="w-3 h-3" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-slate-600 font-medium">Document Readiness</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {checkedCount} of {totalCount} Ready ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                progressPercent === 100
                  ? 'bg-emerald-600'
                  : progressPercent >= 50
                  ? 'bg-slate-900'
                  : 'bg-amber-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Document Items Interactive Checklist */}
      <div className="space-y-2">
        {currentDocs.items.map((item) => {
          const isChecked = !!checkedItems[item.id];
          const isExpanded = expandedItem === item.id;
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isChecked
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <label className="flex items-start space-x-3 cursor-pointer flex-1 select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 focus:ring-0 border-slate-300 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold ${isChecked ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                        {item.title}
                      </span>
                      {item.mandatory ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-medium uppercase tracking-wider bg-slate-100 text-slate-600">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                      {item.subtitle}
                    </p>
                  </div>
                </label>

                <button
                  type="button"
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  title="View details and requirements"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expandable Explanation & Pitfall Prevention */}
              {isExpanded && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] space-y-1.5 pl-7">
                  {item.note && (
                    <div className="flex items-start space-x-1.5 text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item.note}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Accepted: <strong className="text-slate-700">{item.acceptedFormats}</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 24-Hour Sanction Guarantee Tips */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-900 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>CarGuru Pro Tip for 24-Hour Sanction:</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-normal">
          Ensure that the name spelling on your PAN Card, Bank Statement, and Aadhaar match identically. Download password-free digital PDF statements directly from net banking rather than phone camera photos.
        </p>
      </div>

      {/* Footer CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-[11px] text-slate-500">
          Have questions regarding any specific document? Call toll-free <strong>1800 209 8888</strong>.
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {variant === 'modal' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Close
            </button>
          )}

          {onProceedToApply && (
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                onProceedToApply();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
            >
              <span>Apply for Loan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (variant === 'embedded') {
    return (
      <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs">
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            Required Documents Guide
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Auto Loan Document Checklist (India)
          </h3>
          <p className="text-xs text-slate-600">
            Verify the exact paperwork required by Indian partner banks (HDFC, ICICI, SBI, Kotak, Axis) for your applicant profile.
          </p>
        </div>
        {content}
      </div>
    );
  }

  // Modal variant
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5 pr-8">
          <div className="inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mb-1.5">
            <FileText className="w-3 h-3" />
            <span>Official Bank Checklist</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Required Documents for Vehicle Financing
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Compare paperwork requirements for Salaried Professionals vs. Self-Employed Business Owners across India.
          </p>
        </div>

        {content}
      </div>
    </div>
  );
};

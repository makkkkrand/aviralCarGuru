import React, { useState } from 'react';
import { apiClient, FinancingApplicationRequest, FinancingApplicationResponse } from '../api/client';
import { formatINR, formatINRLakhCrore, INDIAN_STATES_RTO } from '../utils/formatters';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Building2, User, FileText, Check, Car, HelpCircle } from 'lucide-react';
import { DocumentChecklist } from './DocumentChecklist';

interface FinancingApplicationWizardProps {
  initialTerms?: {
    vehiclePrice: number;
    downPayment: number;
    tenureMonths: number;
    monthlyPayment: number;
    vehicleId?: string;
  } | null;
  onTrackApplication: (refNumber: string) => void;
}

export const FinancingApplicationWizard: React.FC<FinancingApplicationWizardProps> = ({
  initialTerms,
  onTrackApplication,
}) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<FinancingApplicationResponse | null>(null);
  const [checklistOpen, setChecklistOpen] = useState<boolean>(false);

  // Vehicle Category / Loan Purpose
  const [vehicleCategory, setVehicleCategory] = useState<string>('NEW_CAR');

  // Step 1: Personal Details (India)
  const [firstName, setFirstName] = useState('Aarav');
  const [lastName, setLastName] = useState('Sharma');
  const [panNumber, setPanNumber] = useState('ABCPS1234F');
  const [dateOfBirth, setDateOfBirth] = useState('1988-06-14');
  const [email, setEmail] = useState('aarav.sharma@carguru.in');
  const [phone, setPhone] = useState('+91 98201 92830');
  const [addressLine1, setAddressLine1] = useState('Flat 1802, Worli Sea Face');
  const [addressLine2, setAddressLine2] = useState('Sea View Enclave');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('400018');
  const [housingStatus, setHousingStatus] = useState<any>('OWN_WITH_MORTGAGE');
  const [monthlyHousingPayment, setMonthlyHousingPayment] = useState<number>(65000);

  // Step 2: Employment / Business in India
  const [employerName, setEmployerName] = useState('Tata Consultancy Services');
  const [jobTitle, setJobTitle] = useState('Principal Consultant');
  const [employmentType, setEmploymentType] = useState<any>('FULL_TIME');
  const [monthlyGrossIncome, setMonthlyGrossIncome] = useState<number>(350000); // 3.5 Lakh/mo
  const [monthsAtCurrentEmployer, setMonthsAtCurrentEmployer] = useState<number>(48);

  // Step 3: Vehicle & Loan Terms (INR)
  const [make, setMake] = useState('Mahindra');
  const [model, setModel] = useState('XUV700');
  const [year, setYear] = useState<number>(2026);
  const [trim, setTrim] = useState('AX7 Luxury AWD');
  const [purchasePrice, setPurchasePrice] = useState<number>(initialTerms?.vehiclePrice || 2690000);
  const [downPayment, setDownPayment] = useState<number>(initialTerms?.downPayment || 538000);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [tenureMonths, setTenureMonths] = useState<number>(initialTerms?.tenureMonths || 60);

  // Step 4: Consents
  const [creditCheckAuthorized, setCreditCheckAuthorized] = useState<boolean>(true);
  const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] = useState<boolean>(true);
  const [contactViaSmsAccepted, setContactViaSmsAccepted] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: FinancingApplicationRequest = {
      applicant: {
        firstName,
        lastName,
        dateOfBirth,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        housingStatus,
        monthlyHousingPayment,
      },
      employment: {
        employerName,
        jobTitle,
        employmentType,
        monthlyGrossIncome,
        monthsAtCurrentEmployer,
      },
      vehicleDetails: {
        vehicleId: initialTerms?.vehicleId || 'CG-2026-XUV700',
        make,
        model,
        year,
        trim: `[${vehicleCategory}] ${trim}`,
        purchasePrice,
      },
      loanTerms: {
        downPayment,
        tradeInValue,
        tenureMonths,
        requestedLoanAmount: Math.max(0, purchasePrice - downPayment - tradeInValue),
      },
      consents: {
        creditCheckAuthorized,
        termsAndConditionsAccepted,
        contactViaSmsAccepted,
      },
    };

    try {
      const response = await apiClient.submitFinancingApplication(payload);
      setSubmissionResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to submit financing application');
    } finally {
      setLoading(false);
    }
  };

  // Confirmation view if submitted successfully
  if (submissionResult) {
    return (
      <div className="pt-20 pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-xl bg-white border border-slate-200/90 shadow-sm text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-1">
                CarGuru Sanction Assigned
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Vehicle Loan Application Registered
              </h2>
              <p className="text-xs text-slate-600 leading-normal">
                Your dossier has been routed to our certified underwriting desk across India's top lending partners for expedited sanction.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Tracking Reference:</span>
                <span className="font-mono font-bold text-slate-900">{submissionResult.referenceNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Primary Applicant:</span>
                <span className="font-semibold text-slate-900">{firstName} {lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Vehicle / Asset:</span>
                <span className="font-semibold text-slate-900">{year} {make} {model}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Requested Principal:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatINR(purchasePrice - downPayment - tradeInValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Underwriting Status:</span>
                <span className="font-semibold text-emerald-700">{submissionResult.status}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onTrackApplication(submissionResult.referenceNumber)}
                className="flex-1 py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors shadow-xs"
              >
                Track in Status Portal
              </button>
              <button
                onClick={() => setSubmissionResult(null)}
                className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition-colors"
              >
                New Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            CarGuru India Auto Credit
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Vehicle Loan Application
          </h1>
          <p className="text-xs text-slate-600 leading-normal">
            Apply online for new car, electric vehicle, pre-owned automobile, or commercial fleet financing with preferential rates and fast-track approval across India.
          </p>
        </div>

        {/* Document Checklist Helper Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900">Required Documents Checklist:</span>
              <span className="text-slate-600 ml-1">View bank paperwork rules for Salaried vs Self-Employed.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setChecklistOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-lg font-semibold text-xs transition-colors shrink-0 shadow-xs flex items-center justify-center space-x-1"
          >
            <span>View Document Checklist</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          {[
            { num: 1, label: 'Applicant KYC' },
            { num: 2, label: 'Income & Work' },
            { num: 3, label: 'Vehicle Terms' },
            { num: 4, label: 'Review & Consent' },
          ].map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div key={s.num} className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span className={`text-xs hidden sm:inline ${isActive ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* STEP 1: Applicant Details (India) */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  Step 1: Personal Identification &amp; Residential KYC
                </h2>
                <div className="flex items-center space-x-1 text-slate-500 text-xs">
                  <User className="w-3.5 h-3.5" />
                  <span>Individual / Entity KYC</span>
                </div>
              </div>

              {/* Loan Purpose / Vehicle Type Selection */}
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Vehicle Financing Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'NEW_CAR', label: 'New Car / SUV' },
                    { id: 'EV', label: 'Electric Vehicle (EV)' },
                    { id: 'USED_CAR', label: 'Certified Pre-Owned' },
                    { id: 'COMMERCIAL', label: 'Commercial Fleet' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setVehicleCategory(cat.id)}
                      className={`p-2 rounded-lg text-xs font-medium text-left border transition-colors ${
                        vehicleCategory === cat.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">First Name (as on PAN)</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCPS1234F"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 uppercase font-mono focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Mobile Phone (India)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98201 92830"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs text-slate-600 font-medium block mb-1">Residential Street Address</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 mb-2"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">PIN Code (6-digit)</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="400018"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Income & Employment */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Step 2: Indian Employment &amp; Financial Profile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Employer / Business Name</label>
                  <input
                    type="text"
                    required
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Designation / Nature of Business</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  >
                    <option value="FULL_TIME">Salaried Professional (MNC / Corporate)</option>
                    <option value="SELF_EMPLOYED">Business Owner / Partner / Director</option>
                    <option value="CONTRACTOR">Self-Employed Professional (Doctor, CA, Lawyer)</option>
                    <option value="RETIRED">Fleet Operator / Commercial Entity</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Tenure in Business/Work (Months)</label>
                  <input
                    type="number"
                    min="1"
                    value={monthsAtCurrentEmployer}
                    onChange={(e) => setMonthsAtCurrentEmployer(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 tabular-nums"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                    <span>Gross Monthly Income / Profit (INR)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{formatINR(monthlyGrossIncome)} ({formatINRLakhCrore(monthlyGrossIncome)}/mo)</span>
                  </div>
                  <input
                    type="number"
                    min="25000"
                    step="25000"
                    value={monthlyGrossIncome}
                    onChange={(e) => setMonthlyGrossIncome(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 tabular-nums"
                  />
                </div>

                {/* Dynamic Documentation Requirement Callout based on Employment Type */}
                <div className="sm:col-span-2 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {employmentType === 'SELF_EMPLOYED' || employmentType === 'CONTRACTOR'
                          ? 'Documentation for Self-Employed / Business Loan'
                          : 'Documentation for Salaried Professional Loan'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {employmentType === 'SELF_EMPLOYED' || employmentType === 'CONTRACTOR'
                        ? 'PAN + Aadhaar + 2-3 Yrs ITR with Computation + 12 Months Current Account Statement + GST Certificate.'
                        : 'PAN + Aadhaar + Latest 3 Months Salary Slips + 6 Months Salary Bank Statement + Form 16.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChecklistOpen(true)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-md font-semibold text-[11px] shrink-0 transition-colors shadow-xs"
                  >
                    View Checklist
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Vehicle & Loan Terms */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Step 3: Vehicle Selection &amp; Loan Parameters (INR)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Make &amp; Model</label>
                  <input
                    type="text"
                    value={`${make} ${model}`}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Model Year &amp; Variant</label>
                  <input
                    type="text"
                    value={`${year} · ${trim}`}
                    onChange={(e) => setTrim(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                    <span>Ex-Showroom / Asset Price (INR)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{formatINRLakhCrore(purchasePrice)}</span>
                  </div>
                  <input
                    type="number"
                    min="300000"
                    step="50000"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 tabular-nums"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                    <span>Down Payment (INR)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{formatINRLakhCrore(downPayment)}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="25000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 tabular-nums"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Loan Tenure</label>
                  <select
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  >
                    <option value={24}>24 Months (2 Years)</option>
                    <option value={36}>36 Months (3 Years)</option>
                    <option value={48}>48 Months (4 Years)</option>
                    <option value={60}>60 Months (5 Years)</option>
                    <option value={72}>72 Months (6 Years)</option>
                    <option value={84}>84 Months (7 Years)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Requested Loan Principal</label>
                  <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-900 tabular-nums">
                    {formatINR(purchasePrice - downPayment - tradeInValue)} ({formatINRLakhCrore(purchasePrice - downPayment - tradeInValue)})
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Consents */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Step 4: Application Review &amp; Statutory Consents
              </h2>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-semibold text-slate-900">{firstName} {lastName} ({panNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Residence:</span>
                  <span className="font-semibold text-slate-900">{city}, {state} ({postalCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle / Segment:</span>
                  <span className="font-semibold text-slate-900">{year} {make} {model} ({vehicleCategory})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Loan Principal:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatINR(purchasePrice - downPayment - tradeInValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tenure:</span>
                  <span className="font-semibold text-slate-900">{tenureMonths} Months starting 8.49% p.a.</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <label className="flex items-start space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={creditCheckAuthorized}
                    onChange={(e) => setCreditCheckAuthorized(e.target.checked)}
                    className="mt-0.5 rounded text-slate-900 focus:ring-0"
                  />
                  <span>
                    I authorize CarGuru India and its RBI-registered banking partners (HDFC, ICICI, Kotak, SBI, Axis) to fetch bureau records for loan underwriting.
                  </span>
                </label>

                <label className="flex items-start space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAndConditionsAccepted}
                    onChange={(e) => setTermsAndConditionsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-slate-900 focus:ring-0"
                  />
                  <span>
                    I agree to CarGuru India terms &amp; conditions and privacy policy.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center space-x-1.5 px-5 py-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-1.5 px-6 py-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                {loading ? <span>Transmitting...</span> : <span>Submit Loan Application</span>}
              </button>
            )}
          </div>

        </form>

      </div>

      {/* Required Document Checklist Modal */}
      <DocumentChecklist
        isOpen={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        defaultCategory={employmentType === 'SELF_EMPLOYED' || employmentType === 'CONTRACTOR' ? 'self_employed' : 'salaried'}
      />
    </div>
  );
};

/**
 * CarGuru India - Vehicle Financing & Loan Advisory API Client
 */

export interface VehicleSummary {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  baseMSRP: number;
  category: string;
  imageUrl: string;
}

export interface VehicleFinanceProfile {
  vehicleId: string;
  baseMSRP: number;
  eligibleAprStarting: number;
  maxTenureMonths: number;
  estimatedMonthlyLease: number;
  availableIncentives: string[];
}

export interface AmortizationScheduleRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface LoanCalculationResponse {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  totalSalesTax: number;
  netCapitalizedCost: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  tenureMonths: number;
  interestRateAnnual: number;
  amortizationSchedule: AmortizationScheduleRow[];
}

export interface FinancingApplicationRequest {
  applicant: {
    firstName: string;
    lastName: string;
    panNumber?: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    housingStatus: string;
    monthlyHousingPayment: number;
    [key: string]: any;
  };
  employment: {
    employmentType: string;
    employerName: string;
    jobTitle: string;
    monthsAtCurrentEmployer: number;
    monthlyGrossIncome: number;
    [key: string]: any;
  };
  vehicleDetails: {
    vehicleCategory?: string;
    vehicleId?: string;
    make: string;
    model: string;
    year: number;
    trim: string;
    purchasePrice: number;
    [key: string]: any;
  };
  loanTerms: {
    downPayment: number;
    tradeInValue: number;
    tenureMonths: number;
    requestedLoanAmount: number;
    [key: string]: any;
  };
  consents?: {
    creditCheckAuthorized?: boolean;
    creditBureauAuthorized?: boolean;
    termsAndConditionsAccepted?: boolean;
    agreeTermsAndPrivacy?: boolean;
    contactViaSmsAccepted?: boolean;
    [key: string]: any;
  };
}

export interface FinancingApplicationResponse {
  applicationId: string;
  referenceNumber: string;
  status: string;
  submittedAt: string;
  estimatedDecisionDate: string;
}

export interface ApplicationDocument {
  documentId: string;
  documentType: string;
  status: string;
  fileName?: string;
  uploadedAt?: string;
}

export interface StatusHistoryItem {
  status: string;
  timestamp: string;
  note: string;
}

export interface FinancingApplicationDetail {
  applicationId: string;
  referenceNumber: string;
  status: string;
  submittedAt: string;
  applicant?: any;
  employment?: any;
  vehicleDetails?: any;
  loanTerms?: any;
  requiredDocuments?: ApplicationDocument[];
  statusHistory?: StatusHistoryItem[];
}

export interface CreateEnquiryRequest {
  enquiryType: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContactMethod: string;
  };
  vehicleReference?: {
    vehicleId?: string;
    make?: string;
    model?: string;
  };
  preferredTimeSlot?: string;
  postalCode?: string;
  message?: string;
}

export interface EnquiryResponse {
  enquiryId: string;
  referenceTicket: string;
  status: string;
  createdAt: string;
}

export interface EnquiryDetail {
  enquiryId: string;
  referenceTicket: string;
  enquiryType: string;
  status: string;
  customer?: any;
  vehicleReference?: any;
  preferredTimeSlot?: string;
  postalCode?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string[];
}

export interface PreQualificationRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  annualIncome: number;
  employmentStatus?: any;
  estimatedCreditScore?: any;
  desiredLoanAmount: number;
  [key: string]: any;
}

export interface PreQualificationResponse {
  isEligible: boolean;
  maxEligibleAmount: number;
  estimatedAprFrom: number;
  estimatedAprTo: number;
  preApprovalReferenceCode: string;
  validUntil: string;
}

export interface TestDriveBookingResponse {
  bookingId: string;
  confirmationCode: string;
  status: string;
  scheduledDateTime: string;
  dealershipLocation: string;
}

export interface UploadDocumentParams {
  documentType: string;
  fileName: string;
  fileContentType?: string;
  fileContentBase64?: string;
  [key: string]: any;
}

class ApiClient {
  private baseUrl = '/api/v1';

  async lookupVehicles(query = '', make = '', limit = 10): Promise<VehicleSummary[]> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (make) params.append('make', make);
    if (limit) params.append('limit', limit.toString());

    const res = await fetch(`${this.baseUrl}/catalog/vehicles/lookup?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to lookup vehicles: ${res.statusText}`);
    return res.json();
  }

  async getVehicleFinanceProfile(vehicleId: string): Promise<VehicleFinanceProfile> {
    const res = await fetch(`${this.baseUrl}/catalog/vehicles/${encodeURIComponent(vehicleId)}/finance-profile`);
    if (!res.ok) throw new Error(`Failed to get finance profile: ${res.statusText}`);
    return res.json();
  }

  async calculateLoan(params: {
    vehiclePrice: number;
    downPayment?: number;
    tradeInValue?: number;
    salesTaxRate?: number;
    interestRateAnnual: number;
    tenureMonths: number;
  }): Promise<LoanCalculationResponse> {
    return this.calculateFinancing(params);
  }

  async calculateFinancing(params: {
    vehiclePrice: number;
    downPayment?: number;
    tradeInValue?: number;
    salesTaxRate?: number;
    interestRateAnnual: number;
    tenureMonths: number;
  }): Promise<LoanCalculationResponse> {
    const res = await fetch(`${this.baseUrl}/financing/calculator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Calculation failed with status ${res.status}`);
    }
    return res.json();
  }

  async getFinancingOptions(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/financing/options`);
    if (!res.ok) throw new Error(`Failed to get financing options: ${res.statusText}`);
    return res.json();
  }

  async submitPreQualification(params: PreQualificationRequest): Promise<PreQualificationResponse> {
    const res = await fetch(`${this.baseUrl}/financing/pre-qualification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Pre-qualification failed: ${res.status}`);
    }
    return res.json();
  }

  async submitFinancingApplication(payload: FinancingApplicationRequest): Promise<FinancingApplicationResponse> {
    return this.submitApplication(payload);
  }

  async submitApplication(payload: FinancingApplicationRequest): Promise<FinancingApplicationResponse> {
    const res = await fetch(`${this.baseUrl}/financing/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Application submission failed: ${res.status}`);
    }
    return res.json();
  }

  async getFinancingApplication(applicationIdOrRef: string, applicantEmail?: string): Promise<FinancingApplicationDetail> {
    return this.getApplication(applicationIdOrRef, applicantEmail);
  }

  async getApplication(applicationIdOrRef: string, applicantEmail?: string): Promise<FinancingApplicationDetail> {
    let url = `${this.baseUrl}/financing/applications/${encodeURIComponent(applicationIdOrRef)}`;
    if (applicantEmail) {
      url += `?applicantEmail=${encodeURIComponent(applicantEmail)}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Application lookup failed: ${res.status}`);
    }
    return res.json();
  }

  async uploadApplicationDocument(
    applicationIdOrRef: string,
    paramsOrType: UploadDocumentParams | string,
    fileName?: string
  ): Promise<any> {
    const docType = typeof paramsOrType === 'string' ? paramsOrType : paramsOrType.documentType;
    const file = typeof paramsOrType === 'string' ? fileName || 'document.pdf' : paramsOrType.fileName;
    return this.uploadDocument(applicationIdOrRef, docType, file);
  }

  async uploadDocument(applicationIdOrRef: string, documentType: string, fileName: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/financing/applications/${encodeURIComponent(applicationIdOrRef)}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentType, fileName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Document upload failed: ${res.status}`);
    }
    return res.json();
  }

  async createEnquiry(payload: CreateEnquiryRequest): Promise<EnquiryResponse> {
    return this.submitEnquiry(payload);
  }

  async submitEnquiry(payload: CreateEnquiryRequest): Promise<EnquiryResponse> {
    const res = await fetch(`${this.baseUrl}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Enquiry submission failed: ${res.status}`);
    }
    return res.json();
  }

  async getEnquiryById(enquiryIdOrRef: string): Promise<EnquiryDetail> {
    return this.getEnquiry(enquiryIdOrRef);
  }

  async getEnquiry(enquiryIdOrRef: string): Promise<EnquiryDetail> {
    const res = await fetch(`${this.baseUrl}/enquiries/${encodeURIComponent(enquiryIdOrRef)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Enquiry lookup failed: ${res.status}`);
    }
    return res.json();
  }

  async bookTestDrive(payload: any): Promise<TestDriveBookingResponse> {
    const res = await fetch(`${this.baseUrl}/enquiries/test-drive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Test drive booking failed: ${res.status}`);
    }
    return res.json();
  }

  async cancelEnquiry(enquiryIdOrRef: string, reasonOrObj: string | { reason?: string } = 'Cancelled by customer'): Promise<any> {
    const reason = typeof reasonOrObj === 'string' ? reasonOrObj : (reasonOrObj?.reason || 'Cancelled by customer');
    const res = await fetch(`${this.baseUrl}/enquiries/${encodeURIComponent(enquiryIdOrRef)}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Cancellation failed: ${res.status}`);
    }
    return res.json();
  }

  // ==========================================
  // ADMIN & UNDERWRITER API CLIENT METHODS
  // ==========================================

  async listApplications(params: {
    status?: string;
    employmentType?: string;
    search?: string;
  } = {}): Promise<{ total: number; applications: FinancingApplicationDetail[] }> {
    const searchParams = new URLSearchParams();
    if (params.status && params.status !== 'ALL') searchParams.append('status', params.status);
    if (params.employmentType && params.employmentType !== 'ALL') searchParams.append('employmentType', params.employmentType);
    if (params.search) searchParams.append('search', params.search);

    const res = await fetch(`${this.baseUrl}/financing/applications?${searchParams.toString()}`);
    if (!res.ok) throw new Error(`Failed to list applications: ${res.statusText}`);
    return res.json();
  }

  async reviewApplication(
    applicationIdOrRef: string,
    payload: {
      status?: string;
      approvedAmount?: number;
      offeredApr?: number;
      note?: string;
      underwriterName?: string;
    }
  ): Promise<{ success: boolean; application: FinancingApplicationDetail }> {
    const res = await fetch(`${this.baseUrl}/financing/applications/${encodeURIComponent(applicationIdOrRef)}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Underwriting review failed: ${res.status}`);
    }
    return res.json();
  }

  async verifyDocument(
    applicationIdOrRef: string,
    documentId: string,
    status: 'VERIFIED' | 'REJECTED' | 'UPLOADED' = 'VERIFIED'
  ): Promise<{ success: boolean; document: ApplicationDocument }> {
    const res = await fetch(
      `${this.baseUrl}/financing/applications/${encodeURIComponent(applicationIdOrRef)}/documents/${encodeURIComponent(documentId)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Document verification failed: ${res.status}`);
    }
    return res.json();
  }

  async listEnquiries(params: {
    status?: string;
    type?: string;
  } = {}): Promise<{ total: number; enquiries: EnquiryDetail[] }> {
    const searchParams = new URLSearchParams();
    if (params.status && params.status !== 'ALL') searchParams.append('status', params.status);
    if (params.type && params.type !== 'ALL') searchParams.append('type', params.type);

    const res = await fetch(`${this.baseUrl}/enquiries?${searchParams.toString()}`);
    if (!res.ok) throw new Error(`Failed to list enquiries: ${res.statusText}`);
    return res.json();
  }

  async updateEnquiry(
    enquiryIdOrRef: string,
    payload: {
      status?: string;
      assignedAdvisor?: string;
      resolutionNote?: string;
    }
  ): Promise<{ success: boolean; enquiry: EnquiryDetail }> {
    const res = await fetch(`${this.baseUrl}/enquiries/${encodeURIComponent(enquiryIdOrRef)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Enquiry update failed: ${res.status}`);
    }
    return res.json();
  }

  async listTestDrives(): Promise<{ total: number; bookings: any[] }> {
    try {
      const res = await fetch(`${this.baseUrl}/enquiries/test-drive`);
      if (!res.ok) {
        console.warn(`listTestDrives returned status ${res.status}`);
        return { total: 0, bookings: [] };
      }
      return res.json();
    } catch (e) {
      console.warn('listTestDrives network error:', e);
      return { total: 0, bookings: [] };
    }
  }

  async updateTestDrive(
    bookingId: string,
    payload: {
      status?: string;
      dealershipLocation?: string;
      notes?: string;
    }
  ): Promise<{ success: boolean; booking: any }> {
    const res = await fetch(`${this.baseUrl}/enquiries/test-drive/${encodeURIComponent(bookingId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Test drive update failed: ${res.status}`);
    }
    return res.json();
  }

  // ==========================================
  // FINANCIAL ANALYST API CLIENT METHODS
  // ==========================================

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const res = await fetch(`${this.baseUrl}/analytics/portfolio-summary`);
    if (!res.ok) throw new Error(`Failed to get portfolio summary: ${res.statusText}`);
    return res.json();
  }

  async addVehicleToCatalog(payload: {
    make: string;
    model: string;
    year: number;
    trim: string;
    baseMSRP: number;
    category: string;
    imageUrl?: string;
  }): Promise<VehicleSummary> {
    const res = await fetch(`${this.baseUrl}/catalog/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Add vehicle failed: ${res.status}`);
    }
    return res.json();
  }

  // ==========================================
  // AUTH & PERSONA API CLIENT METHODS
  // ==========================================

  async getSystemUsers(): Promise<UserProfile[]> {
    const res = await fetch(`${this.baseUrl}/auth/users`);
    if (!res.ok) throw new Error(`Failed to load users: ${res.statusText}`);
    return res.json();
  }

  async login(credentials: { email?: string; password?: string; role?: string }): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Login failed: ${res.status}`);
    }
    return res.json();
  }
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'underwriter' | 'analyst' | 'admin';
  title: string;
  department: string;
  avatarUrl: string;
  permissions: string[];
}

export interface PortfolioSummary {
  kpis: {
    totalApplications: number;
    totalRequestedVolume: number;
    totalApprovedVolume: number;
    approvalRate: number;
    avgTicketSize: number;
    activeEnquiries: number;
    scheduledTestDrives: number;
    underReviewCount: number;
    docsRequiredCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
  cibilDistribution: Array<{
    tier: string;
    count: number;
    defaultRateEst: string;
  }>;
  employmentDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  vehicleMix: Array<{
    make: string;
    count: number;
  }>;
  monthlyVolumeHistory: Array<{
    month: string;
    volumeCr: number;
    approvals: number;
  }>;
}

export const apiClient = new ApiClient();

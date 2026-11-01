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

export interface BackendStatus {
  connected: boolean;
  backendUrl: string;
  engine: string;
  usingLiveBackend: boolean;
  latencyMs?: number;
  error?: string | null;
  timestamp: string;
  routes?: string[];
  isMixedContentBlocked?: boolean;
  isHttpsContext?: boolean;
  solutionPresets?: {
    tunnelCommand: string;
    cloudflaredCommand: string;
    ngrokCommand: string;
    chromeInsecureHelp: string;
  };
}

export function isDemoModeActive(): boolean {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('carguru_demo_mode') === 'true';
  }
  return false;
}

export function setDemoModeActive(active: boolean): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('carguru_demo_mode', active ? 'true' : 'false');
  }
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.resolveInitialBaseUrl();
  }

  private resolveInitialBaseUrl(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('carguru_backend_api_url');
      if (saved && saved.trim()) {
        const cleaned = saved.trim().replace(/\/+$/, '');
        return cleaned.endsWith('/api/v1') ? cleaned : `${cleaned}/api/v1`;
      }
    }
    const envUrl = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE_URL || '';
    if (envUrl && envUrl.trim()) {
      const cleaned = envUrl.trim().replace(/\/+$/, '');
      return cleaned.endsWith('/api/v1') ? cleaned : `${cleaned}/api/v1`;
    }
    // Default to the user's local Spring Boot service on port 8080
    return 'http://localhost:8080/api/v1';
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string, persist = true): string {
    let cleaned = url.trim().replace(/\/+$/, '');
    if (!cleaned) {
      cleaned = 'http://localhost:8080';
    }
    const finalUrl = cleaned.endsWith('/api/v1') ? cleaned : `${cleaned}/api/v1`;
    this.baseUrl = finalUrl;
    if (persist && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('carguru_backend_api_url', finalUrl);
    }
    return finalUrl;
  }

  resetBaseUrl(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('carguru_backend_api_url');
    }
    this.baseUrl = 'http://localhost:8080/api/v1';
    return this.baseUrl;
  }

  /**
   * Safe fetch with automatic gateway fallback if target backend is temporarily unreachable
   */
  private async request(path: string, options?: RequestInit): Promise<Response> {
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    const primaryUrl = `${this.baseUrl}${formattedPath}`;

    // Add bypass header for public HTTPS tunnels (e.g. localtunnel)
    const customHeaders: Record<string, string> = {
      'Bypass-Tunnel-Reminder': 'true',
    };
    if (options?.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          customHeaders[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          customHeaders[key] = value;
        });
      } else {
        Object.assign(customHeaders, options.headers);
      }
    }

    const mergedOptions: RequestInit = {
      ...options,
      headers: customHeaders,
    };

    try {
      const res = await fetch(primaryUrl, mergedOptions);
      // ONLY if 1-Click Role Switcher (Instant Demo) is active, allow fallback to demo mock data when 404
      if (res.status === 404 && isDemoModeActive() && !this.baseUrl.startsWith('/api/v1')) {
        try {
          const fallbackRes = await fetch(`/api/v1${formattedPath}`, mergedOptions);
          if (fallbackRes.ok) {
            return fallbackRes;
          }
        } catch {
          // ignore fallback error and return original 404 response
        }
      }
      return res;
    } catch (networkErr) {
      // If the primary URL was an external or localhost target and failed, fallback ONLY if in Instant Demo mode
      if (isDemoModeActive() && !this.baseUrl.startsWith('/api/v1')) {
        try {
          const fallbackRes = await fetch(`/api/v1${formattedPath}`, mergedOptions);
          return fallbackRes;
        } catch {
          // ignore fallback error and throw original
        }
      }
      throw networkErr;
    }
  }

  async checkBackendStatus(targetUrl?: string): Promise<BackendStatus> {
    const rawTarget = targetUrl || this.baseUrl;
    const cleaned = rawTarget.trim().replace(/\/+$/, '');
    const candidateApiBase = cleaned.endsWith('/api/v1') ? cleaned : `${cleaned}/api/v1`;
    const candidateRoot = cleaned.replace(/\/api\/v1\/?$/, '');

    const isBrowserHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isTargetHttp = candidateApiBase.startsWith('http://');
    const isLocalhostTarget = candidateApiBase.includes('localhost') || candidateApiBase.includes('127.0.0.1');
    const isMixedContentBlocked = isBrowserHttps && isTargetHttp;

    const solutionPresets = {
      tunnelCommand: 'npx localtunnel --port 8080',
      cloudflaredCommand: 'cloudflared tunnel --url http://localhost:8080',
      ngrokCommand: 'ngrok http 8080',
      chromeInsecureHelp: 'In Chrome/Edge: Click tune/lock icon in address bar -> Site settings -> Set "Insecure content" to Allow -> Reload.',
    };

    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      // Probe direct endpoint from browser
      const res = await fetch(`${candidateApiBase}/catalog/vehicles/lookup?limit=1`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
        },
        signal: controller.signal,
      }).catch(() => null);

      if (res && res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('json')) {
          clearTimeout(timeout);
          return {
            connected: true,
            backendUrl: candidateApiBase,
            engine: 'Spring Boot 3.3.4 (Java 21 + Spring Data MongoDB)',
            usingLiveBackend: true,
            latencyMs: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            isHttpsContext: isBrowserHttps,
          };
        }
      }

      // Check actuator on target host
      const resActuator = await fetch(`${candidateRoot}/actuator/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
        },
        signal: controller.signal,
      }).catch(() => null);
      clearTimeout(timeout);

      if (resActuator && resActuator.ok) {
        return {
          connected: true,
          backendUrl: candidateApiBase,
          engine: 'Spring Boot 3.3.4 (Actuator Live)',
          usingLiveBackend: true,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          isHttpsContext: isBrowserHttps,
        };
      }
    } catch (e: any) {
      // ignore
    }

    const mixedContentErrorMsg = `Browser Mixed Content Block: This web application is running on HTTPS (${typeof window !== 'undefined' ? window.location.origin : 'https'}), so your browser blocks unencrypted HTTP calls to ${candidateApiBase}. Even though your Spring Boot service is active, Chrome/Edge/Firefox blocks it for security.`;

    // Fallback info from local gateway
    try {
      const sysRes = await fetch('/api/v1/system/backend-status');
      if (sysRes.ok) {
        const sysData = await sysRes.json();
        return {
          connected: false,
          backendUrl: candidateApiBase,
          engine: 'Spring Boot 3.3.4 (Standby / Mixed Content Block)',
          usingLiveBackend: false,
          error: isMixedContentBlocked
            ? mixedContentErrorMsg
            : `Could not reach ${candidateApiBase}. Please verify your Spring Boot backend is running.`,
          timestamp: new Date().toISOString(),
          routes: sysData.routes,
          isMixedContentBlocked,
          isHttpsContext: isBrowserHttps,
          solutionPresets,
        };
      }
    } catch {
      // ignore
    }

    return {
      connected: false,
      backendUrl: candidateApiBase,
      engine: 'Spring Boot 3.3.4 (Standby / Mixed Content Block)',
      usingLiveBackend: false,
      error: isMixedContentBlocked
        ? mixedContentErrorMsg
        : `Could not connect to ${candidateApiBase}.`,
      timestamp: new Date().toISOString(),
      isMixedContentBlocked,
      isHttpsContext: isBrowserHttps,
      solutionPresets,
    };
  }

  async lookupVehicles(query = '', make = '', limit = 10): Promise<VehicleSummary[]> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (make) params.append('make', make);
    if (limit) params.append('limit', limit.toString());

    const res = await this.request(`/catalog/vehicles/lookup?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to lookup vehicles: ${res.statusText}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.vehicles || []);
  }

  async getVehicleFinanceProfile(vehicleId: string): Promise<VehicleFinanceProfile> {
    const res = await this.request(`/catalog/vehicles/${encodeURIComponent(vehicleId)}/finance-profile`);
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
    const res = await this.request('/financing/calculator', {
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

  async getFinancingOptions(creditTier = 'EXCELLENT'): Promise<any> {
    const res = await this.request(`/financing/options?creditTier=${encodeURIComponent(creditTier)}`);
    if (!res.ok) throw new Error(`Failed to get financing options: ${res.statusText}`);
    return res.json();
  }

  async submitPreQualification(params: PreQualificationRequest): Promise<PreQualificationResponse> {
    const res = await this.request('/financing/pre-qualification', {
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
    const res = await this.request('/financing/applications', {
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
    let url = `/financing/applications/${encodeURIComponent(applicationIdOrRef)}`;
    if (applicantEmail) {
      url += `?applicantEmail=${encodeURIComponent(applicantEmail)}`;
    }
    const res = await this.request(url);
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
    const res = await this.request(`/financing/applications/${encodeURIComponent(applicationIdOrRef)}/documents`, {
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
    const res = await this.request('/enquiries', {
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
    const res = await this.request(`/enquiries/${encodeURIComponent(enquiryIdOrRef)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Enquiry lookup failed: ${res.status}`);
    }
    return res.json();
  }

  async bookTestDrive(payload: any): Promise<TestDriveBookingResponse> {
    const res = await this.request('/enquiries/test-drive', {
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
    const res = await this.request(`/enquiries/${encodeURIComponent(enquiryIdOrRef)}/cancel`, {
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

    const res = await this.request(`/financing/applications?${searchParams.toString()}`);
    if (!res.ok) throw new Error(`Failed to list applications: ${res.statusText}`);
    const data = await res.json();
    const applications: FinancingApplicationDetail[] = Array.isArray(data) ? data : (data.applications || []);
    const total = typeof data.total === 'number' ? data.total : (typeof data.totalCount === 'number' ? data.totalCount : applications.length);
    return { total, applications };
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
    const res = await this.request(`/financing/applications/${encodeURIComponent(applicationIdOrRef)}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Underwriting review failed: ${res.status}`);
    }
    const data = await res.json();
    const application: FinancingApplicationDetail = data.application || data;
    return { success: true, application };
  }

  async verifyDocument(
    applicationIdOrRef: string,
    documentId: string,
    status: 'VERIFIED' | 'REJECTED' | 'UPLOADED' = 'VERIFIED'
  ): Promise<{ success: boolean; document: ApplicationDocument }> {
    const res = await this.request(
      `/financing/applications/${encodeURIComponent(applicationIdOrRef)}/documents/${encodeURIComponent(documentId)}`,
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
    const data = await res.json();
    const document: ApplicationDocument = data.document || data;
    return { success: true, document };
  }

  async listEnquiries(params: {
    status?: string;
    type?: string;
  } = {}): Promise<{ total: number; enquiries: EnquiryDetail[] }> {
    const searchParams = new URLSearchParams();
    if (params.status && params.status !== 'ALL') searchParams.append('status', params.status);
    if (params.type && params.type !== 'ALL') searchParams.append('type', params.type);

    const res = await this.request(`/enquiries?${searchParams.toString()}`);
    if (!res.ok) throw new Error(`Failed to list enquiries: ${res.statusText}`);
    const data = await res.json();
    const enquiries: EnquiryDetail[] = Array.isArray(data) ? data : (data.enquiries || []);
    const total = typeof data.total === 'number' ? data.total : (typeof data.totalCount === 'number' ? data.totalCount : enquiries.length);
    return { total, enquiries };
  }

  async updateEnquiry(
    enquiryIdOrRef: string,
    payload: {
      status?: string;
      assignedAdvisor?: string;
      resolutionNote?: string;
    }
  ): Promise<{ success: boolean; enquiry: EnquiryDetail }> {
    const res = await this.request(`/enquiries/${encodeURIComponent(enquiryIdOrRef)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Enquiry update failed: ${res.status}`);
    }
    const data = await res.json();
    const enquiry: EnquiryDetail = data.enquiry || data;
    return { success: true, enquiry };
  }

  async listTestDrives(): Promise<{ total: number; bookings: any[] }> {
    try {
      const res = await this.request('/enquiries/test-drive');
      if (!res.ok) {
        console.warn(`listTestDrives returned status ${res.status}`);
        return { total: 0, bookings: [] };
      }
      const data = await res.json();
      const bookings: any[] = Array.isArray(data) ? data : (data.bookings || []);
      const total = typeof data.total === 'number' ? data.total : bookings.length;
      return { total, bookings };
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
    const res = await this.request(`/enquiries/test-drive/${encodeURIComponent(bookingId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Test drive update failed: ${res.status}`);
    }
    const data = await res.json();
    const booking: any = data.booking || data;
    return { success: true, booking };
  }

  // ==========================================
  // FINANCIAL ANALYST API CLIENT METHODS
  // ==========================================

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const res = await this.request('/analytics/portfolio-summary');
    if (!res.ok) throw new Error(`Failed to get portfolio summary: ${res.statusText}`);
    const data = await res.json();
    return {
      kpis: data.kpis || {
        totalApplications: 0,
        totalRequestedVolume: 0,
        totalApprovedVolume: 0,
        approvalRate: 0,
        avgTicketSize: 0,
        activeEnquiries: 0,
        scheduledTestDrives: 0,
        underReviewCount: 0,
        docsRequiredCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
      },
      cibilDistribution: data.cibilDistribution || [],
      employmentDistribution: data.employmentDistribution || [],
      vehicleMix: data.vehicleMix || [],
      monthlyVolumeHistory: data.monthlyVolumeHistory || [],
    };
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
    const res = await this.request('/catalog/vehicles', {
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
    const res = await this.request('/auth/users');
    if (!res.ok) throw new Error(`Failed to load users: ${res.statusText}`);
    return res.json();
  }

  async login(credentials: { email?: string; password?: string; role?: string }): Promise<{ token: string; user: UserProfile }> {
    const res = await this.request('/auth/login', {
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

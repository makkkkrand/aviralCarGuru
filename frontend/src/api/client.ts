import type { components, paths } from './generated/schema';

export type Schemas = components['schemas'];

export type LoanCalculationRequest = Schemas['LoanCalculationRequest'];
export type LoanCalculationResponse = Schemas['LoanCalculationResponse'];
export type FinanceOptionsResponse = Schemas['FinanceOptionsResponse'];
export type PreQualificationRequest = Schemas['PreQualificationRequest'];
export type PreQualificationResponse = Schemas['PreQualificationResponse'];
export type FinancingApplicationRequest = Schemas['FinancingApplicationRequest'];
export type FinancingApplicationResponse = Schemas['FinancingApplicationResponse'];
export type FinancingApplicationDetail = Schemas['FinancingApplicationDetail'];
export type DocumentSubmissionRequest = Schemas['DocumentSubmissionRequest'];
export type DocumentSubmissionResponse = Schemas['DocumentSubmissionResponse'];

export type CreateEnquiryRequest = Schemas['CreateEnquiryRequest'];
export type EnquiryResponse = Schemas['EnquiryResponse'];
export type EnquiryDetail = Schemas['EnquiryDetail'];
export type EnquiryCategoriesResponse = Schemas['EnquiryCategoriesResponse'];
export type TestDriveBookingRequest = Schemas['TestDriveBookingRequest'];
export type TestDriveBookingResponse = Schemas['TestDriveBookingResponse'];
export type CancelEnquiryRequest = Schemas['CancelEnquiryRequest'];

export type VehicleSummary = Schemas['VehicleSummary'];
export type VehicleFinanceProfile = Schemas['VehicleFinanceProfile'];

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.message || errJson.error || JSON.stringify(errJson);
    } catch {
      errorDetail = `HTTP ${response.status} ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const apiClient = {
  // --- FINANCING ---
  async calculateLoan(data: LoanCalculationRequest): Promise<LoanCalculationResponse> {
    return request<LoanCalculationResponse>('/api/v1/financing/calculator', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getFinancingOptions(creditTier?: string): Promise<FinanceOptionsResponse> {
    const query = creditTier ? `?creditTier=${encodeURIComponent(creditTier)}` : '';
    return request<FinanceOptionsResponse>(`/api/v1/financing/options${query}`);
  },

  async submitPreQualification(data: PreQualificationRequest): Promise<PreQualificationResponse> {
    return request<PreQualificationResponse>('/api/v1/financing/pre-qualification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async submitFinancingApplication(data: FinancingApplicationRequest): Promise<FinancingApplicationResponse> {
    return request<FinancingApplicationResponse>('/api/v1/financing/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getFinancingApplication(applicationId: string, applicantEmail?: string): Promise<FinancingApplicationDetail> {
    const query = applicantEmail ? `?applicantEmail=${encodeURIComponent(applicantEmail)}` : '';
    return request<FinancingApplicationDetail>(`/api/v1/financing/applications/${encodeURIComponent(applicationId)}${query}`);
  },

  async uploadApplicationDocument(
    applicationId: string,
    data: DocumentSubmissionRequest
  ): Promise<DocumentSubmissionResponse> {
    return request<DocumentSubmissionResponse>(`/api/v1/financing/applications/${encodeURIComponent(applicationId)}/documents`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // --- ENQUIRIES ---
  async createEnquiry(data: CreateEnquiryRequest): Promise<EnquiryResponse> {
    return request<EnquiryResponse>('/api/v1/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getEnquiryById(enquiryId: string): Promise<EnquiryDetail> {
    return request<EnquiryDetail>(`/api/v1/enquiries/${encodeURIComponent(enquiryId)}`);
  },

  async getEnquiryCategories(): Promise<EnquiryCategoriesResponse> {
    return request<EnquiryCategoriesResponse>('/api/v1/enquiries/categories');
  },

  async bookTestDrive(data: TestDriveBookingRequest): Promise<TestDriveBookingResponse> {
    return request<TestDriveBookingResponse>('/api/v1/enquiries/test-drive', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async cancelEnquiry(enquiryId: string, data: CancelEnquiryRequest): Promise<EnquiryResponse> {
    return request<EnquiryResponse>(`/api/v1/enquiries/${encodeURIComponent(enquiryId)}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // --- CATALOG LOOKUP ---
  async lookupVehicles(query?: string, make?: string, limit = 10): Promise<VehicleSummary[]> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (make) params.append('make', make);
    if (limit) params.append('limit', limit.toString());
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<VehicleSummary[]>(`/api/v1/catalog/vehicles/lookup${qs}`);
  },

  async getVehicleFinanceProfile(vehicleId: string): Promise<VehicleFinanceProfile> {
    return request<VehicleFinanceProfile>(`/api/v1/catalog/vehicles/${encodeURIComponent(vehicleId)}/finance-profile`);
  },
};

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-Memory Fleet
interface VehicleSummary {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  baseMSRP: number;
  category: string;
  imageUrl: string;
}

const fleet: VehicleSummary[] = [
  {
    vehicleId: 'VEL-2026-GT',
    make: 'Mercedes-AMG',
    model: 'GT 4-Door Coupe',
    year: 2026,
    trim: '63 S E Performance',
    baseMSRP: 27000000.0,
    category: 'Luxury Performance',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
  },
  {
    vehicleId: 'VEL-2026-TAYCAN',
    make: 'Porsche',
    model: 'Taycan',
    year: 2026,
    trim: 'Turbo S Cross Turismo',
    baseMSRP: 25200000.0,
    category: 'Electric Performance',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    vehicleId: 'CG-2026-XUV700',
    make: 'Mahindra',
    model: 'XUV700',
    year: 2026,
    trim: 'AX7 Luxury AWD',
    baseMSRP: 2690000.0,
    category: 'Premium SUV',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    vehicleId: 'CG-2026-FORTUNER',
    make: 'Toyota',
    model: 'Fortuner',
    year: 2026,
    trim: 'GR-Sport 4x4 AT',
    baseMSRP: 5140000.0,
    category: 'Full-Size SUV',
    imageUrl: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
  },
  {
    vehicleId: 'CG-2026-CURVV',
    make: 'Tata',
    model: 'Curvv EV',
    year: 2026,
    trim: 'Empowered+ 55 Long Range',
    baseMSRP: 1925000.0,
    category: 'Electric SUV Coupe',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    vehicleId: 'CG-2026-IONIQ5',
    make: 'Hyundai',
    model: 'IONIQ 5',
    year: 2026,
    trim: 'Long Range RWD',
    baseMSRP: 4605000.0,
    category: 'Electric Vehicle',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
  },
  {
    vehicleId: 'VEL-2026-M8',
    make: 'BMW',
    model: 'M8 Competition',
    year: 2026,
    trim: 'Gran Coupe',
    baseMSRP: 24400000.0,
    category: 'High-Performance Sedan',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    vehicleId: 'CG-2024-BMW3',
    make: 'BMW (Certified Pre-Owned)',
    model: '3 Series Gran Limousine',
    year: 2024,
    trim: '330Li M Sport (12,000 km)',
    baseMSRP: 4150000.0,
    category: 'Certified Pre-Owned',
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
  },
  {
    vehicleId: 'CG-2026-WINGER',
    make: 'Tata Commercial',
    model: 'Winger Fleet Executive',
    year: 2026,
    trim: '12-Seater Luxury Fleet',
    baseMSRP: 1720000.0,
    category: 'Commercial Vehicle & Fleet',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  },
  {
    vehicleId: 'VEL-2026-DB12',
    make: 'Aston Martin',
    model: 'DB12',
    year: 2026,
    trim: 'Super Tourer',
    baseMSRP: 45900000.0,
    category: 'Super Tourer',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
  },
];

// In-Memory Data Stores
const enquiries = new Map<string, any>();
const testDriveBookings = new Map<string, any>();
const financingApplications = new Map<string, any>();

// Seed sample applications for immediate testing across personas
const sampleAppId = 'app_sample_velora_01';
const sampleAppRef = 'VEL-APP-2026-DEMO01';
financingApplications.set(sampleAppId, {
  applicationId: sampleAppId,
  referenceNumber: sampleAppRef,
  status: 'UNDER_REVIEW',
  submittedAt: new Date(Date.now() - 86400000).toISOString(),
  cibilScore: 785,
  applicant: {
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@velora.in',
    phone: '+91 98201 92830',
    dateOfBirth: '1988-06-14',
    addressLine1: 'Flat 1802, Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400018',
    housingStatus: 'OWN_WITH_MORTGAGE',
    monthlyHousingPayment: 180000,
  },
  employment: {
    employmentType: 'FULL_TIME',
    employerName: 'Reliance Capital Advisory',
    jobTitle: 'Senior Vice President',
    monthsAtCurrentEmployer: 84,
    monthlyGrossIncome: 1850000,
  },
  vehicleDetails: {
    vehicleId: 'VEL-2026-GT',
    make: 'Mercedes-AMG',
    model: 'GT 4-Door Coupe',
    year: 2026,
    trim: '63 S E Performance',
    purchasePrice: 27000000,
  },
  loanTerms: {
    downPayment: 5400000,
    tradeInValue: 0,
    tenureMonths: 60,
    requestedLoanAmount: 21600000,
    approvedAmount: 21600000,
    offeredApr: 8.49,
  },
  requiredDocuments: [
    {
      documentId: 'DOC-INIT-ID01',
      documentType: 'GOVERNMENT_ID',
      status: 'VERIFIED',
      fileName: 'PAN_Card_AaravSharma.pdf',
      uploadedAt: new Date(Date.now() - 80000000).toISOString(),
    },
    {
      documentId: 'DOC-INIT-PAY01',
      documentType: 'PAY_SLIP',
      status: 'VERIFIED',
      fileName: 'SalarySlips_Q1_2026.pdf',
      uploadedAt: new Date(Date.now() - 75000000).toISOString(),
    },
    {
      documentId: 'DOC-INIT-BANK01',
      documentType: 'BANK_STATEMENT',
      status: 'PENDING',
    },
  ],
  statusHistory: [
    {
      status: 'SUBMITTED',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      note: 'Application submitted via CarGuru India Client Portal.',
    },
    {
      status: 'UNDER_REVIEW',
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      note: 'Assigned to Senior Underwriting Officer at Mumbai Flagship. KYC & PAN verified.',
    },
  ],
});

// Seed App 2: Self-Employed Business / MSME Owner (APPROVED)
const sampleAppId2 = 'app_sample_velora_02';
financingApplications.set(sampleAppId2, {
  applicationId: sampleAppId2,
  referenceNumber: 'VEL-APP-2026-DEMO02',
  status: 'APPROVED',
  submittedAt: new Date(Date.now() - 172800000).toISOString(),
  cibilScore: 760,
  applicant: {
    firstName: 'Rajesh',
    lastName: 'Kulkarni',
    email: 'rajesh@kulkarni-eng.com',
    phone: '+91 98220 54123',
    dateOfBirth: '1979-11-20',
    addressLine1: 'Plot 44, Kalyani Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411006',
    housingStatus: 'OWN_OUTRIGHT',
    monthlyHousingPayment: 0,
  },
  employment: {
    employmentType: 'SELF_EMPLOYED',
    employerName: 'Kulkarni Precision Engineering Ltd',
    jobTitle: 'Managing Director & Founder',
    monthsAtCurrentEmployer: 140,
    monthlyGrossIncome: 650000,
  },
  vehicleDetails: {
    vehicleId: 'CG-2026-XUV700',
    make: 'Mahindra',
    model: 'XUV700',
    year: 2026,
    trim: 'AX7 Luxury AWD',
    purchasePrice: 2690000,
  },
  loanTerms: {
    downPayment: 590000,
    tradeInValue: 0,
    tenureMonths: 60,
    requestedLoanAmount: 2100000,
    approvedAmount: 2100000,
    offeredApr: 8.75,
  },
  requiredDocuments: [
    {
      documentId: 'DOC-KULK-01',
      documentType: 'GOVERNMENT_ID',
      status: 'VERIFIED',
      fileName: 'Aadhaar_PAN_Rajesh.pdf',
      uploadedAt: new Date(Date.now() - 170000000).toISOString(),
    },
    {
      documentId: 'DOC-KULK-02',
      documentType: 'ITR_RETURNS',
      status: 'VERIFIED',
      fileName: 'ITR_FY24_25_Computation.pdf',
      uploadedAt: new Date(Date.now() - 165000000).toISOString(),
    },
    {
      documentId: 'DOC-KULK-03',
      documentType: 'GST_CERTIFICATE',
      status: 'VERIFIED',
      fileName: 'GSTIN_Registration_Certificate.pdf',
      uploadedAt: new Date(Date.now() - 160000000).toISOString(),
    },
  ],
  statusHistory: [
    {
      status: 'SUBMITTED',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      note: 'Application submitted for Mahindra XUV700 AX7 AWD.',
    },
    {
      status: 'UNDER_REVIEW',
      timestamp: new Date(Date.now() - 120000000).toISOString(),
      note: 'GST return and 2-year ITR verified by underwriting team.',
    },
    {
      status: 'APPROVED',
      timestamp: new Date(Date.now() - 40000000).toISOString(),
      note: 'Approved for ₹21,00,000 at 8.75% preferential MSME rate via HDFC Bank Syndicate.',
    },
  ],
});

// Seed App 3: Electric Vehicle - Salaried Doctor (NEW SUBMITTED)
const sampleAppId3 = 'app_sample_velora_03';
financingApplications.set(sampleAppId3, {
  applicationId: sampleAppId3,
  referenceNumber: 'VEL-APP-2026-DEMO03',
  status: 'SUBMITTED',
  submittedAt: new Date(Date.now() - 7200000).toISOString(),
  cibilScore: 810,
  applicant: {
    firstName: 'Dr. Meera',
    lastName: 'Nambiar',
    email: 'meera.nambiar@apollohealth.org',
    phone: '+91 94470 12890',
    dateOfBirth: '1985-03-12',
    addressLine1: 'Villa 12, Sobha Green Meadows',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560034',
    housingStatus: 'OWN_OUTRIGHT',
    monthlyHousingPayment: 0,
  },
  employment: {
    employmentType: 'FULL_TIME',
    employerName: 'Apollo Hospitals & Research',
    jobTitle: 'Consultant Neurosurgeon',
    monthsAtCurrentEmployer: 96,
    monthlyGrossIncome: 920000,
  },
  vehicleDetails: {
    vehicleId: 'CG-2026-CURVV',
    make: 'Tata',
    model: 'Curvv EV',
    year: 2026,
    trim: 'Empowered+ 55 Long Range',
    purchasePrice: 1925000,
  },
  loanTerms: {
    downPayment: 325000,
    tradeInValue: 0,
    tenureMonths: 48,
    requestedLoanAmount: 1600000,
  },
  requiredDocuments: [
    {
      documentId: 'DOC-MEERA-01',
      documentType: 'GOVERNMENT_ID',
      status: 'UPLOADED',
      fileName: 'PAN_Passport_DrMeera.pdf',
      uploadedAt: new Date(Date.now() - 5000000).toISOString(),
    },
    {
      documentId: 'DOC-MEERA-02',
      documentType: 'PAY_SLIP',
      status: 'PENDING',
    },
  ],
  statusHistory: [
    {
      status: 'SUBMITTED',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      note: 'Green EV loan application initiated. High credit score fast-track eligible.',
    },
  ],
});

// Seed App 4: Commercial Fleet Logistics (DOCS_REQUIRED)
const sampleAppId4 = 'app_sample_velora_04';
financingApplications.set(sampleAppId4, {
  applicationId: sampleAppId4,
  referenceNumber: 'VEL-APP-2026-DEMO04',
  status: 'DOCS_REQUIRED',
  submittedAt: new Date(Date.now() - 259200000).toISOString(),
  cibilScore: 710,
  applicant: {
    firstName: 'Gurpreet',
    lastName: 'Singh',
    email: 'gurpreet@swiftlogix.in',
    phone: '+91 98140 88231',
    dateOfBirth: '1982-08-05',
    addressLine1: 'Transport Nagar, Sector 26',
    city: 'Chandigarh',
    state: 'Punjab',
    postalCode: '160019',
    housingStatus: 'OWN_WITH_MORTGAGE',
    monthlyHousingPayment: 45000,
  },
  employment: {
    employmentType: 'SELF_EMPLOYED',
    employerName: 'SwiftLogix Freight & Fleet LLP',
    jobTitle: 'Partner / Fleet Operations Head',
    monthsAtCurrentEmployer: 60,
    monthlyGrossIncome: 420000,
  },
  vehicleDetails: {
    vehicleId: 'CG-2026-WINGER',
    make: 'Tata Commercial',
    model: 'Winger Fleet Executive',
    year: 2026,
    trim: '12-Seater Luxury Fleet',
    purchasePrice: 1720000,
  },
  loanTerms: {
    downPayment: 320000,
    tradeInValue: 0,
    tenureMonths: 60,
    requestedLoanAmount: 1400000,
  },
  requiredDocuments: [
    {
      documentId: 'DOC-LOGIX-01',
      documentType: 'GOVERNMENT_ID',
      status: 'VERIFIED',
      fileName: 'PAN_Aadhaar_GurpreetSingh.pdf',
    },
    {
      documentId: 'DOC-LOGIX-02',
      documentType: 'BANK_STATEMENT',
      status: 'PENDING',
    },
    {
      documentId: 'DOC-LOGIX-03',
      documentType: 'BUSINESS_PROOF',
      status: 'PENDING',
    },
  ],
  statusHistory: [
    {
      status: 'SUBMITTED',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      note: 'Commercial fleet financing request submitted.',
    },
    {
      status: 'DOCS_REQUIRED',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      note: 'Underwriter requested 12-month current account statement and partnership deed.',
    },
  ],
});

// Seed sample enquiries
const sampleEnqId = 'enq_sample_01';
const sampleEnqRef = 'VEL-ENQ-DEMO01';
enquiries.set(sampleEnqId, {
  enquiryId: sampleEnqId,
  referenceTicket: sampleEnqRef,
  enquiryType: 'PRICE_QUOTE',
  status: 'IN_PROGRESS',
  assignedAdvisor: 'Priya Nair (Senior Loan Advisor)',
  customer: {
    firstName: 'Vikramaditya',
    lastName: 'Singhania',
    email: 'v.singhania@apexholding.in',
    phone: '+91 98110 44210',
    preferredContactMethod: 'EMAIL',
  },
  vehicleReference: {
    vehicleId: 'VEL-2026-DB12',
    make: 'Aston Martin',
    model: 'DB12',
  },
  preferredTimeSlot: 'AFTERNOON',
  postalCode: '110037',
  message: 'Inquiring regarding custom luxury structured finance with balloon payment option for Delhi delivery.',
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
  resolutionNotes: ['VIP concierge assigned for Delhi Aerocity private preview.', 'Quoted 8.49% ultra-HNW rate structure.'],
});

enquiries.set('enq_sample_02', {
  enquiryId: 'enq_sample_02',
  referenceTicket: 'VEL-ENQ-DEMO02',
  enquiryType: 'FINANCE_ASSISTANCE',
  status: 'NEW',
  assignedAdvisor: 'Unassigned',
  customer: {
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    email: 'ananya.d@fintechinnovate.com',
    phone: '+91 99201 11234',
    preferredContactMethod: 'WHATSAPP',
  },
  vehicleReference: {
    vehicleId: 'CG-2026-IONIQ5',
    make: 'Hyundai',
    model: 'IONIQ 5',
  },
  preferredTimeSlot: 'MORNING',
  postalCode: '400051',
  message: 'Looking for 0% down payment corporate lease or low-interest EV scheme for corporate employees.',
  createdAt: new Date(Date.now() - 10800000).toISOString(),
  updatedAt: new Date(Date.now() - 10800000).toISOString(),
  resolutionNotes: [],
});

enquiries.set('enq_sample_03', {
  enquiryId: 'enq_sample_03',
  referenceTicket: 'VEL-ENQ-DEMO03',
  enquiryType: 'TRADE_IN',
  status: 'CONTACTED',
  assignedAdvisor: 'Karan Verma (Trade-in Valuation Specialist)',
  customer: {
    firstName: 'Sunil',
    lastName: 'Bansal',
    email: 'sbansal@bansaltextiles.in',
    phone: '+91 98300 44921',
    preferredContactMethod: 'PHONE',
  },
  vehicleReference: {
    vehicleId: 'CG-2026-FORTUNER',
    make: 'Toyota',
    model: 'Fortuner',
  },
  preferredTimeSlot: 'AFTERNOON',
  postalCode: '700016',
  message: 'Exchange existing 2021 Innova Crysta (45,000 km) for new Fortuner GR-Sport with auto loan adjustment.',
  createdAt: new Date(Date.now() - 43200000).toISOString(),
  updatedAt: new Date(Date.now() - 14400000).toISOString(),
  resolutionNotes: ['Spoke with client on phone. Estimated trade-in credit: ₹18.5 Lakhs.'],
});

// Seed sample test drives
testDriveBookings.set('book_sample_01', {
  bookingId: 'book_sample_01',
  confirmationCode: 'VEL-DRIVE-MUM01',
  customer: {
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@velora.in',
    phone: '+91 98201 92830',
  },
  vehicleId: 'VEL-2026-GT',
  dealershipLocation: 'CarGuru Flagship Center - BKC, Mumbai',
  preferredDate: '2026-10-25',
  preferredTimeSlot: '14:00 - 15:30',
  driverLicenseValid: true,
  notes: 'Interested in track pack features and financing terms.',
  status: 'CONFIRMED',
  scheduledDateTime: '2026-10-25T14:00:00.000Z',
  createdAt: new Date(Date.now() - 86400000).toISOString(),
});

testDriveBookings.set('book_sample_02', {
  bookingId: 'book_sample_02',
  confirmationCode: 'VEL-DRIVE-DEL02',
  customer: {
    firstName: 'Kavita',
    lastName: 'Rao',
    email: 'kavita.rao@delhicapital.com',
    phone: '+91 98100 55219',
  },
  vehicleId: 'CG-2026-XUV700',
  dealershipLocation: 'CarGuru Hub - Aerocity, New Delhi',
  preferredDate: '2026-10-26',
  preferredTimeSlot: '11:00 - 12:30',
  driverLicenseValid: true,
  notes: 'Testing ADAS features and family seating comfort.',
  status: 'CONFIRMED',
  scheduledDateTime: '2026-10-26T11:00:00.000Z',
  createdAt: new Date(Date.now() - 28800000).toISOString(),
});

// ==========================================
// 1. CATALOG ROUTES
// ==========================================

app.get('/api/v1/catalog/vehicles/lookup', (req: Request, res: Response) => {
  const query = (req.query.query as string)?.toLowerCase();
  const make = (req.query.make as string)?.toLowerCase();
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

  let results = fleet.filter((v) => {
    if (make && !v.make.toLowerCase().includes(make)) return false;
    if (query) {
      return (
        v.make.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.trim.toLowerCase().includes(query)
      );
    }
    return true;
  });

  res.json(results.slice(0, limit));
});

app.get('/api/v1/catalog/vehicles/:vehicleId/finance-profile', (req: Request, res: Response) => {
  const vehicle = fleet.find((v) => v.vehicleId.toLowerCase() === req.params.vehicleId.toLowerCase());
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const estLease = Math.round(vehicle.baseMSRP * 0.0115 * 100) / 100;
  res.json({
    vehicleId: vehicle.vehicleId,
    baseMSRP: vehicle.baseMSRP,
    eligibleAprStarting: 8.49,
    maxTenureMonths: 84,
    estimatedMonthlyLease: estLease,
    availableIncentives: [
      '₹5,00,000 Velora India Private Client Loyalty Bonus',
      'Preferential 8.49% Auto Loan with HDFC & ICICI Private Banking',
      'Complimentary 3-Year Pan-India Performance Roadside Assistance & Maintenance',
    ],
  });
});

// ==========================================
// 2. FINANCING ROUTES
// ==========================================

app.post('/api/v1/financing/calculator', (req: Request, res: Response) => {
  const {
    vehiclePrice,
    downPayment = 0,
    tradeInValue = 0,
    salesTaxRate = 7.0,
    interestRateAnnual,
    tenureMonths,
  } = req.body;

  if (typeof vehiclePrice !== 'number' || typeof interestRateAnnual !== 'number' || typeof tenureMonths !== 'number') {
    return res.status(400).json({ error: 'Missing required numeric calculation parameters' });
  }

  const totalSalesTax = Math.round(vehiclePrice * (salesTaxRate / 100) * 100) / 100;
  let netCapitalizedCost = Math.max(0, vehiclePrice + totalSalesTax - downPayment - tradeInValue);
  netCapitalizedCost = Math.round(netCapitalizedCost * 100) / 100;

  let monthlyPayment = 0;
  let totalInterest = 0;
  let totalCost = 0;

  if (netCapitalizedCost <= 0) {
    monthlyPayment = 0;
    totalInterest = 0;
    totalCost = vehiclePrice + totalSalesTax;
  } else if (interestRateAnnual <= 0) {
    monthlyPayment = Math.round((netCapitalizedCost / tenureMonths) * 100) / 100;
    totalInterest = 0;
    totalCost = netCapitalizedCost;
  } else {
    const monthlyRate = interestRateAnnual / 100 / 12;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    monthlyPayment = netCapitalizedCost * ((monthlyRate * factor) / (factor - 1));
    monthlyPayment = Math.round(monthlyPayment * 100) / 100;

    totalCost = Math.round(monthlyPayment * tenureMonths * 100) / 100;
    totalInterest = Math.max(0, Math.round((totalCost - netCapitalizedCost) * 100) / 100);
  }

  // Build annual amortization schedule
  const schedule = [];
  let remainingBalance = netCapitalizedCost;
  const monthlyRate = interestRateAnnual / 100 / 12;
  const totalYears = Math.ceil(tenureMonths / 12);

  for (let y = 1; y <= totalYears; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    const monthsInThisYear = Math.min(12, tenureMonths - (y - 1) * 12);

    for (let m = 1; m <= monthsInThisYear; m++) {
      const interestForMonth = remainingBalance * monthlyRate;
      const principalForMonth = Math.min(remainingBalance, monthlyPayment - interestForMonth);
      yearInterest += interestForMonth;
      yearPrincipal += principalForMonth;
      remainingBalance = Math.max(0, remainingBalance - principalForMonth);
    }

    schedule.push({
      year: y,
      principalPaid: Math.round(yearPrincipal * 100) / 100,
      interestPaid: Math.round(yearInterest * 100) / 100,
      remainingBalance: Math.round(remainingBalance * 100) / 100,
    });
  }

  res.json({
    vehiclePrice,
    downPayment,
    tradeInValue,
    totalSalesTax,
    netCapitalizedCost,
    monthlyPayment,
    totalInterest,
    totalCost,
    tenureMonths,
    interestRateAnnual,
    amortizationSchedule: schedule,
  });
});

app.get('/api/v1/financing/options', (req: Request, res: Response) => {
  res.json({
    tenureOptionsMonths: [24, 36, 48, 60, 72, 84],
    minDownPaymentPercentage: 15.0,
    interestRateTiers: [
      {
        creditTier: 'EXCELLENT',
        aprFrom: 8.49,
        aprTo: 8.99,
        description: 'CIBIL 775+ (Prime Luxury Banking Tier)',
      },
      {
        creditTier: 'GOOD',
        aprFrom: 9.25,
        aprTo: 9.99,
        description: 'CIBIL 725 - 774 (Preferred Partner Rate)',
      },
      {
        creditTier: 'FAIR',
        aprFrom: 10.25,
        aprTo: 11.50,
        description: 'CIBIL 675 - 724 (Standard Auto Loan)',
      },
      {
        creditTier: 'REBUILDING',
        aprFrom: 12.00,
        aprTo: 14.50,
        description: 'CIBIL Below 675 / First-Time Exotics',
      },
    ],
  });
});

app.post('/api/v1/financing/pre-qualification', (req: Request, res: Response) => {
  const { annualIncome = 0, desiredLoanAmount = 0 } = req.body;
  const maxLoan = Math.round(annualIncome * 0.85 * 100) / 100;
  const isEligible = desiredLoanAmount <= maxLoan;

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  res.json({
    isEligible,
    maxEligibleAmount: maxLoan,
    estimatedAprFrom: 8.49,
    estimatedAprTo: 9.75,
    preApprovalReferenceCode: `VEL-PRE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    validUntil: validUntil.toISOString().split('T')[0],
  });
});

app.post('/api/v1/financing/applications', (req: Request, res: Response) => {
  const { applicant, employment, vehicleDetails, loanTerms, consents } = req.body;
  const appId = `app_${crypto.randomUUID()}`;
  const currentYear = new Date().getFullYear();
  const ref = `VEL-APP-${currentYear}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const now = new Date().toISOString();

  const estDecision = new Date();
  estDecision.setDate(estDecision.getDate() + 2);

  const newDoc = {
    applicationId: appId,
    referenceNumber: ref,
    status: 'SUBMITTED',
    submittedAt: now,
    applicant,
    employment,
    vehicleDetails,
    loanTerms,
    consents,
    requiredDocuments: [
      {
        documentId: `DOC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        documentType: 'GOVERNMENT_ID',
        status: 'PENDING',
      },
      {
        documentId: `DOC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        documentType: 'PAY_SLIP',
        status: 'PENDING',
      },
    ],
    statusHistory: [
      {
        status: 'SUBMITTED',
        timestamp: now,
        note: 'Financing application submitted through Velora Portal. Under automated underwriter review.',
      },
    ],
  };

  financingApplications.set(appId, newDoc);

  res.status(201).json({
    applicationId: appId,
    referenceNumber: ref,
    status: 'SUBMITTED',
    submittedAt: now,
    estimatedDecisionDate: estDecision.toISOString().split('T')[0],
  });
});

// Admin/Analyst/Client List Applications
app.get('/api/v1/financing/applications', (req: Request, res: Response) => {
  const { status, employmentType, search } = req.query;
  let allApps = Array.from(financingApplications.values());

  if (status && typeof status === 'string' && status !== 'ALL') {
    allApps = allApps.filter((a) => a.status === status);
  }

  if (employmentType && typeof employmentType === 'string' && employmentType !== 'ALL') {
    allApps = allApps.filter((a) => a.employment?.employmentType === employmentType);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    allApps = allApps.filter((a) =>
      a.referenceNumber?.toLowerCase().includes(q) ||
      a.applicant?.firstName?.toLowerCase().includes(q) ||
      a.applicant?.lastName?.toLowerCase().includes(q) ||
      a.applicant?.email?.toLowerCase().includes(q) ||
      a.vehicleDetails?.make?.toLowerCase().includes(q) ||
      a.vehicleDetails?.model?.toLowerCase().includes(q)
    );
  }

  // Sort by submittedAt desc
  allApps.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  res.json({
    total: allApps.length,
    applications: allApps,
  });
});

app.get('/api/v1/financing/applications/:applicationId', (req: Request, res: Response) => {
  const query = req.params.applicationId.trim();
  const applicantEmail = req.query.applicantEmail as string;

  let found = financingApplications.get(query);
  if (!found) {
    for (const appDoc of financingApplications.values()) {
      if (appDoc.referenceNumber?.toLowerCase() === query.toLowerCase()) {
        found = appDoc;
        break;
      }
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Financing application not found' });
  }

  if (applicantEmail && found.applicant?.email?.toLowerCase() !== applicantEmail.toLowerCase()) {
    return res.status(404).json({ error: 'No matching application for provided email' });
  }

  res.json(found);
});

// Underwriter Application Review (Admin / Underwriter action)
app.patch('/api/v1/financing/applications/:applicationId/review', (req: Request, res: Response) => {
  const query = req.params.applicationId.trim();
  let found = financingApplications.get(query);
  if (!found) {
    for (const appDoc of financingApplications.values()) {
      if (appDoc.referenceNumber?.toLowerCase() === query.toLowerCase()) {
        found = appDoc;
        break;
      }
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Financing application not found' });
  }

  const { status, approvedAmount, offeredApr, note, underwriterName = 'Credit Officer' } = req.body;
  const now = new Date().toISOString();

  if (status) {
    found.status = status;
  }
  if (typeof approvedAmount === 'number') {
    found.loanTerms = found.loanTerms || {};
    found.loanTerms.approvedAmount = approvedAmount;
  }
  if (typeof offeredApr === 'number') {
    found.loanTerms = found.loanTerms || {};
    found.loanTerms.offeredApr = offeredApr;
  }

  found.statusHistory = found.statusHistory || [];
  found.statusHistory.push({
    status: status || found.status,
    timestamp: now,
    note: note || `Review updated by ${underwriterName}. Status: ${status || found.status}.`,
  });

  res.json({
    success: true,
    application: found,
  });
});

app.post('/api/v1/financing/applications/:applicationId/documents', (req: Request, res: Response) => {
  const query = req.params.applicationId.trim();
  let found = financingApplications.get(query);
  if (!found) {
    for (const appDoc of financingApplications.values()) {
      if (appDoc.referenceNumber?.toLowerCase() === query.toLowerCase()) {
        found = appDoc;
        break;
      }
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Financing application not found' });
  }

  const { documentType, fileName } = req.body;
  const docId = `DOC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const now = new Date().toISOString();

  // Update required documents list
  found.requiredDocuments = (found.requiredDocuments || []).filter(
    (d: any) => d.documentType !== documentType
  );
  found.requiredDocuments.push({
    documentId: docId,
    documentType,
    fileName,
    status: 'UPLOADED',
    uploadedAt: now,
  });

  // Append history note
  found.statusHistory = found.statusHistory || [];
  found.statusHistory.push({
    status: 'DOCUMENT_UPLOADED',
    timestamp: now,
    note: `Uploaded ${documentType} (${fileName || 'document'}).`,
  });

  res.status(201).json({
    documentId: docId,
    documentType,
    fileName,
    status: 'UPLOADED',
    uploadTimestamp: now,
  });
});

// Document verification by underwriter
app.patch('/api/v1/financing/applications/:applicationId/documents/:documentId', (req: Request, res: Response) => {
  const query = req.params.applicationId.trim();
  const docId = req.params.documentId.trim();
  let found = financingApplications.get(query);
  if (!found) {
    for (const appDoc of financingApplications.values()) {
      if (appDoc.referenceNumber?.toLowerCase() === query.toLowerCase()) {
        found = appDoc;
        break;
      }
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Financing application not found' });
  }

  const { status = 'VERIFIED' } = req.body;
  const doc = (found.requiredDocuments || []).find((d: any) => d.documentId === docId);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  doc.status = status;
  found.statusHistory.push({
    status: `DOC_${status}`,
    timestamp: new Date().toISOString(),
    note: `Document ${doc.documentType} marked as ${status}.`,
  });

  res.json({ success: true, document: doc });
});

// ==========================================
// 3. ENQUIRIES ROUTES
// ==========================================

// Admin List Enquiries
app.get('/api/v1/enquiries', (req: Request, res: Response) => {
  const { status, type } = req.query;
  let allEnqs = Array.from(enquiries.values());

  if (status && typeof status === 'string' && status !== 'ALL') {
    allEnqs = allEnqs.filter((e) => e.status === status);
  }
  if (type && typeof type === 'string' && type !== 'ALL') {
    allEnqs = allEnqs.filter((e) => e.enquiryType === type);
  }

  allEnqs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    total: allEnqs.length,
    enquiries: allEnqs,
  });
});

app.post('/api/v1/enquiries', (req: Request, res: Response) => {
  const { enquiryType, customer, vehicleReference, preferredTimeSlot = 'ANYTIME', postalCode, message } = req.body;
  const enquiryId = `enq_${crypto.randomUUID()}`;
  const ticket = `VEL-ENQ-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const now = new Date().toISOString();

  const newDoc = {
    enquiryId,
    referenceTicket: ticket,
    enquiryType,
    status: 'NEW',
    assignedAdvisor: 'Pending Assignment',
    customer,
    vehicleReference,
    preferredTimeSlot,
    postalCode,
    message,
    createdAt: now,
    updatedAt: now,
    resolutionNotes: [],
  };

  enquiries.set(enquiryId, newDoc);

  res.status(201).json({
    enquiryId,
    referenceTicket: ticket,
    status: 'NEW',
    createdAt: now,
  });
});

app.get('/api/v1/enquiries/categories', (_req: Request, res: Response) => {
  res.json({
    categories: ['GENERAL', 'VEHICLE_AVAILABILITY', 'PRICE_QUOTE', 'FINANCE_ASSISTANCE', 'TRADE_IN'],
    contactMethods: ['EMAIL', 'PHONE', 'WHATSAPP', 'SMS'],
    timeSlots: ['MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME'],
  });
});

// Admin List Test Drives (Must precede /:enquiryId wildcard)
app.get('/api/v1/enquiries/test-drive', (_req: Request, res: Response) => {
  const allBookings = Array.from(testDriveBookings.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({
    total: allBookings.length,
    bookings: allBookings,
  });
});

app.post('/api/v1/enquiries/test-drive', (req: Request, res: Response) => {
  const { customer, vehicleId, dealershipLocation, preferredDate, preferredTimeSlot, driverLicenseValid, notes } = req.body;
  const bookingId = `book_${crypto.randomUUID()}`;
  const code = `VEL-DRIVE-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const location = dealershipLocation?.trim() || 'CarGuru Flagship Center - BKC, Mumbai';
  const now = new Date().toISOString();

  // Scheduled at 14:00 UTC on preferred date
  const scheduledDateTime = preferredDate ? `${preferredDate}T14:00:00.000Z` : now;

  const booking = {
    bookingId,
    confirmationCode: code,
    customer,
    vehicleId,
    dealershipLocation: location,
    preferredDate,
    preferredTimeSlot,
    driverLicenseValid: Boolean(driverLicenseValid),
    notes,
    status: 'CONFIRMED',
    scheduledDateTime,
    createdAt: now,
  };

  testDriveBookings.set(bookingId, booking);

  res.status(201).json({
    bookingId,
    confirmationCode: code,
    status: 'CONFIRMED',
    scheduledDateTime,
    dealershipLocation: location,
  });
});

// Update Test Drive Status (Admin Action - Must precede /:enquiryId)
app.patch('/api/v1/enquiries/test-drive/:bookingId', (req: Request, res: Response) => {
  const id = req.params.bookingId.trim();
  let found = testDriveBookings.get(id);
  if (!found) {
    for (const b of testDriveBookings.values()) {
      if (b.confirmationCode?.toLowerCase() === id.toLowerCase()) {
        found = b;
        break;
      }
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Test drive booking not found' });
  }

  const { status, dealershipLocation, notes } = req.body;
  if (status) found.status = status;
  if (dealershipLocation) found.dealershipLocation = dealershipLocation;
  if (notes) found.notes = notes;

  res.json({ success: true, booking: found });
});

// Specific Enquiry Lookup (Wildcard route after static sub-paths)
app.get('/api/v1/enquiries/:enquiryId', (req: Request, res: Response, next: any) => {
  const query = req.params.enquiryId.trim();
  if (query === 'test-drive' || query === 'categories') {
    return next();
  }

  let found = enquiries.get(query);
  if (!found) {
    for (const enq of enquiries.values()) {
      if (enq.referenceTicket?.toLowerCase() === query.toLowerCase()) {
        found = enq;
        break;
      }
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  res.json(found);
});

// Admin Update Enquiry (assign advisor, update status, append note)
app.patch('/api/v1/enquiries/:enquiryId', (req: Request, res: Response, next: any) => {
  const query = req.params.enquiryId.trim();
  if (query === 'test-drive') {
    return next();
  }

  let found = enquiries.get(query);
  if (!found) {
    for (const enq of enquiries.values()) {
      if (enq.referenceTicket?.toLowerCase() === query.toLowerCase()) {
        found = enq;
        break;
      }
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  const { status, assignedAdvisor, resolutionNote } = req.body;
  if (status) found.status = status;
  if (assignedAdvisor) found.assignedAdvisor = assignedAdvisor;
  if (resolutionNote) {
    found.resolutionNotes = found.resolutionNotes || [];
    found.resolutionNotes.push(resolutionNote);
  }
  found.updatedAt = new Date().toISOString();

  res.json({ success: true, enquiry: found });
});

app.patch('/api/v1/enquiries/:enquiryId/cancel', (req: Request, res: Response) => {
  const query = req.params.enquiryId.trim();
  let found = enquiries.get(query);
  if (!found) {
    for (const enq of enquiries.values()) {
      if (enq.referenceTicket?.toLowerCase() === query.toLowerCase()) {
        found = enq;
        break;
      }
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  const { reason = 'Cancelled by customer' } = req.body;
  found.status = 'CANCELLED';
  found.updatedAt = new Date().toISOString();
  found.resolutionNotes = found.resolutionNotes || [];
  found.resolutionNotes.push(`Cancelled by customer: ${reason}`);

  res.json({
    enquiryId: found.enquiryId,
    referenceTicket: found.referenceTicket,
    status: 'CANCELLED',
    createdAt: found.createdAt,
  });
});

// ==========================================
// 4. PORTFOLIO & CREDIT RISK ANALYTICS (Analyst & Admin)
// ==========================================

app.get('/api/v1/analytics/portfolio-summary', (_req: Request, res: Response) => {
  const allApps = Array.from(financingApplications.values());
  const allEnqs = Array.from(enquiries.values());
  const allBookings = Array.from(testDriveBookings.values());

  let totalRequestedVolume = 0;
  let totalApprovedVolume = 0;
  let approvedCount = 0;
  let underReviewCount = 0;
  let docsRequiredCount = 0;
  let rejectedCount = 0;

  const cibilBuckets = {
    primePlus: 0, // 775+
    prime: 0,     // 725-774
    fair: 0,      // 675-724
    subprime: 0,  // <675
  };

  const employmentMix: Record<string, number> = {
    FULL_TIME: 0,
    SELF_EMPLOYED: 0,
    BUSINESS_OWNER: 0,
    PROFESSIONAL: 0,
  };

  const vehicleMix: Record<string, number> = {};

  allApps.forEach((app) => {
    const reqAmount = app.loanTerms?.requestedLoanAmount || 0;
    const appAmount = app.loanTerms?.approvedAmount || 0;
    totalRequestedVolume += reqAmount;

    if (app.status === 'APPROVED') {
      approvedCount++;
      totalApprovedVolume += appAmount || reqAmount;
    } else if (app.status === 'UNDER_REVIEW') {
      underReviewCount++;
    } else if (app.status === 'DOCS_REQUIRED') {
      docsRequiredCount++;
    } else if (app.status === 'REJECTED') {
      rejectedCount++;
    }

    const cibil = app.cibilScore || 750;
    if (cibil >= 775) cibilBuckets.primePlus++;
    else if (cibil >= 725) cibilBuckets.prime++;
    else if (cibil >= 675) cibilBuckets.fair++;
    else cibilBuckets.subprime++;

    const empType = app.employment?.employmentType || 'FULL_TIME';
    employmentMix[empType] = (employmentMix[empType] || 0) + 1;

    const vMake = app.vehicleDetails?.make || 'Unknown';
    vehicleMix[vMake] = (vehicleMix[vMake] || 0) + 1;
  });

  const totalApps = allApps.length;
  const approvalRate = totalApps > 0 ? Math.round((approvedCount / totalApps) * 100) : 0;
  const avgTicketSize = totalApps > 0 ? Math.round(totalRequestedVolume / totalApps) : 0;

  res.json({
    kpis: {
      totalApplications: totalApps,
      totalRequestedVolume,
      totalApprovedVolume,
      approvalRate,
      avgTicketSize,
      activeEnquiries: allEnqs.length,
      scheduledTestDrives: allBookings.length,
      underReviewCount,
      docsRequiredCount,
      approvedCount,
      rejectedCount,
    },
    cibilDistribution: [
      { tier: 'Prime+ (775+)', count: cibilBuckets.primePlus, defaultRateEst: '0.4%' },
      { tier: 'Prime (725-774)', count: cibilBuckets.prime, defaultRateEst: '1.2%' },
      { tier: 'Fair (675-724)', count: cibilBuckets.fair, defaultRateEst: '3.1%' },
      { tier: 'Subprime (<675)', count: cibilBuckets.subprime, defaultRateEst: '7.8%' },
    ],
    employmentDistribution: Object.entries(employmentMix).map(([name, count]) => ({
      name,
      count,
      percentage: totalApps > 0 ? Math.round((count / totalApps) * 100) : 0,
    })),
    vehicleMix: Object.entries(vehicleMix).map(([name, count]) => ({
      make: name,
      count,
    })),
    monthlyVolumeHistory: [
      { month: 'Jun 2026', volumeCr: 12.4, approvals: 14 },
      { month: 'Jul 2026', volumeCr: 15.8, approvals: 19 },
      { month: 'Aug 2026', volumeCr: 18.2, approvals: 22 },
      { month: 'Sep 2026', volumeCr: 21.6, approvals: 27 },
      { month: 'Oct 2026 (MTD)', volumeCr: 26.5, approvals: 31 },
    ],
  });
});

// Admin Add or Update Vehicle in Catalog
app.post('/api/v1/catalog/vehicles', (req: Request, res: Response) => {
  const { make, model, year, trim, baseMSRP, category, imageUrl } = req.body;
  if (!make || !model || !baseMSRP) {
    return res.status(400).json({ error: 'Make, model, and baseMSRP are required' });
  }

  const vehicleId = `CG-${year || 2026}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const newVehicle: VehicleSummary = {
    vehicleId,
    make,
    model,
    year: year || 2026,
    trim: trim || 'Standard',
    baseMSRP: Number(baseMSRP),
    category: category || 'Passenger Vehicle',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  };

  fleet.unshift(newVehicle);
  res.status(201).json(newVehicle);
});

// ==========================================
// 5. AUTHENTICATION & PERSONA MANAGEMENT
// ==========================================

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'underwriter' | 'analyst' | 'admin';
  title: string;
  department: string;
  avatarUrl: string;
  permissions: string[];
}

const systemUsers: UserProfile[] = [
  {
    id: 'user_client_01',
    name: 'Aarav Sharma',
    email: 'client@carguru.in',
    role: 'client',
    title: 'Customer / Applicant',
    department: 'Private Client',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: ['view_own_applications', 'apply_loan', 'submit_documents', 'calculate_emi', 'book_test_drive'],
  },
  {
    id: 'user_underwriter_01',
    name: 'Priya Nair',
    email: 'underwriter@carguru.in',
    role: 'underwriter',
    title: 'Senior Credit & Underwriting Officer',
    department: 'Risk & Underwriting Desk',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'view_all_applications',
      'review_applications',
      'approve_reject_loan',
      'verify_documents',
      'adjust_apr_terms',
      'view_enquiries',
    ],
  },
  {
    id: 'user_analyst_01',
    name: 'Rohan Mehta',
    email: 'analyst@carguru.in',
    role: 'analyst',
    title: 'Lead Credit Portfolio Analyst',
    department: 'Financial Analytics & Risk',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'view_portfolio_analytics',
      'view_risk_metrics',
      'export_reports',
      'view_cibil_distribution',
      'view_all_applications',
    ],
  },
  {
    id: 'user_admin_01',
    name: 'Vikramaditya Singhania',
    email: 'admin@carguru.in',
    role: 'admin',
    title: 'Executive Platform Owner & Operations Lead',
    department: 'Executive Leadership',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    permissions: [
      'view_all_applications',
      'review_applications',
      'manage_leads',
      'manage_test_drives',
      'manage_inventory',
      'view_portfolio_analytics',
      'manage_users',
    ],
  },
];

app.get('/api/v1/auth/users', (_req: Request, res: Response) => {
  res.json(systemUsers);
});

app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  let matchedUser = systemUsers.find(
    (u) => (email && u.email.toLowerCase() === email.toLowerCase()) || (role && u.role === role)
  );

  if (!matchedUser) {
    matchedUser = systemUsers.find((u) => u.role === 'admin') || systemUsers[0];
  }

  res.json({
    token: `token_${matchedUser.id}_${Date.now()}`,
    user: matchedUser,
  });
});

// ==========================================
// 4. FRONTEND VITE INTEGRATION
// ==========================================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: __dirname,
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Velora CarGuru full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

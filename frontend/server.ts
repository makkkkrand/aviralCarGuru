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

// Seed a sample application for immediate testing in Application Tracker
const sampleAppId = 'app_sample_velora_01';
const sampleAppRef = 'VEL-APP-2026-DEMO01';
financingApplications.set(sampleAppId, {
  applicationId: sampleAppId,
  referenceNumber: sampleAppRef,
  status: 'UNDER_REVIEW',
  submittedAt: new Date(Date.now() - 86400000).toISOString(),
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
      status: 'PENDING',
    },
  ],
  statusHistory: [
    {
      status: 'SUBMITTED',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      note: 'Application submitted via Velora India Private Client Portal.',
    },
    {
      status: 'UNDER_REVIEW',
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      note: 'Assigned to Senior Underwriting Officer at Mumbai Flagship. KYC verified.',
    },
  ],
});

// Seed sample enquiry
const sampleEnqId = 'enq_sample_01';
const sampleEnqRef = 'VEL-ENQ-DEMO01';
enquiries.set(sampleEnqId, {
  enquiryId: sampleEnqId,
  referenceTicket: sampleEnqRef,
  enquiryType: 'PRICE_QUOTE',
  status: 'IN_PROGRESS',
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
  message: 'Inquiring regarding custom Q-bespoke interior leather specifications and delivery to New Delhi.',
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
  resolutionNotes: ['VIP concierge assigned for Delhi Aerocity private preview.'],
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

// ==========================================
// 3. ENQUIRIES ROUTES
// ==========================================

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

app.get('/api/v1/enquiries/:enquiryId', (req: Request, res: Response) => {
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

  res.json(found);
});

app.post('/api/v1/enquiries/test-drive', (req: Request, res: Response) => {
  const { customer, vehicleId, dealershipLocation, preferredDate, preferredTimeSlot, driverLicenseValid, notes } = req.body;
  const bookingId = `book_${crypto.randomUUID()}`;
  const code = `VEL-DRIVE-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const location = dealershipLocation?.trim() || 'Velora Flagship Experience Center - BKC, Mumbai';
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

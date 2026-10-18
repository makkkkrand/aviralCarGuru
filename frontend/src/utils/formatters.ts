/**
 * Indian Rupee (INR) Formatting & Banking Utilities for Velora India
 */

export function formatINR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function formatINRLakhCrore(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount) || amount === 0) return '₹0';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2)} Lakh`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatNumberIndian(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  return Math.round(amount).toLocaleString('en-IN');
}

export const INDIAN_STATES_RTO = [
  { code: 'MH', name: 'Maharashtra (Mumbai / Pune)', rtoRate: 12.0 },
  { code: 'DL', name: 'Delhi NCR (New Delhi)', rtoRate: 10.0 },
  { code: 'KA', name: 'Karnataka (Bengaluru)', rtoRate: 14.0 },
  { code: 'TS', name: 'Telangana (Hyderabad)', rtoRate: 12.5 },
  { code: 'TN', name: 'Tamil Nadu (Chennai)', rtoRate: 12.0 },
  { code: 'GJ', name: 'Gujarat (Ahmedabad / Surat)', rtoRate: 10.5 },
  { code: 'WB', name: 'West Bengal (Kolkata)', rtoRate: 11.0 },
  { code: 'HR', name: 'Haryana (Gurugram / Faridabad)', rtoRate: 10.0 },
  { code: 'UP', name: 'Uttar Pradesh (Noida / Lucknow)', rtoRate: 10.0 },
  { code: 'PB', name: 'Punjab (Chandigarh / Ludhiana)', rtoRate: 11.5 },
  { code: 'RJ', name: 'Rajasthan (Jaipur)', rtoRate: 11.0 },
  { code: 'KL', name: 'Kerala (Kochi / Trivandrum)', rtoRate: 13.0 },
  { code: 'ALL', name: 'Other States & UTs (Pan-India)', rtoRate: 11.0 },
];

export const INDIAN_BANK_PARTNERS = [
  { name: 'HDFC Bank Private Banking', minApr: 8.49, logoText: 'HDFC' },
  { name: 'ICICI Bank Wealth Management', minApr: 8.55, logoText: 'ICICI' },
  { name: 'Kotak Mahindra Privy League', minApr: 8.50, logoText: 'KOTAK' },
  { name: 'Axis Bank Burgundy Private', minApr: 8.65, logoText: 'AXIS' },
  { name: 'State Bank of India (SBI Wealth)', minApr: 8.45, logoText: 'SBI' },
];

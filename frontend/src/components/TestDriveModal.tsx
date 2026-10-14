import React, { useState } from 'react';
import { apiClient, TestDriveBookingResponse } from '../api/client';
import { 
  X, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Car, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Gauge
} from 'lucide-react';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVehicleId?: string;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  defaultVehicleId = 'VEL-2026-GT',
}) => {
  const [vehicleId, setVehicleId] = useState(defaultVehicleId);
  const [dealershipLocation, setDealershipLocation] = useState('Velora Beverly Hills Experience Center');
  const [preferredDate, setPreferredDate] = useState('2026-10-18');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<any>('AFTERNOON');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [driverLicenseValid, setDriverLicenseValid] = useState(true);
  const [notes, setNotes] = useState('Looking forward to experiencing dynamic drive mode.');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestDriveBookingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.bookTestDrive({
        vehicleId,
        dealershipLocation,
        preferredDate,
        preferredTimeSlot,
        driverLicenseValid,
        customer: {
          firstName,
          lastName,
          email,
          phone,
          preferredContactMethod: 'EMAIL',
        },
        notes,
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error booking VIP test drive session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-10 rounded-3xl border-white/15 bg-[#090e1c] max-h-[92vh] overflow-y-auto relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/50 transition-colors"
          aria-label="Close Test Drive Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!result ? (
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Private Track & Road Experience</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                Reserve VIP Test Drive
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Experience high-performance handling under direct guidance of a factory certified drive specialist.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christian"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Von Koenigsegg"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-control text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="christian@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control text-xs"
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control text-xs"
                  />
                </div>
              </div>

              {/* Vehicle & Dealership Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="form-label">Select Performance Chassis</label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="form-control text-xs font-mono"
                  >
                    <option value="VEL-2026-GT">Mercedes-AMG GT Coupe (V8 Hybrid)</option>
                    <option value="VEL-2026-TY">Porsche Taycan Turbo S (Electric)</option>
                    <option value="VEL-2026-RS">Audi RS e-tron GT (Quattro)</option>
                    <option value="VEL-2026-DB">Aston Martin DB12 (Twin-Turbo)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Dealership Experience Center</label>
                  <select
                    value={dealershipLocation}
                    onChange={(e) => setDealershipLocation(e.target.value)}
                    className="form-control text-xs"
                  >
                    <option value="Velora Beverly Hills Experience Center">Beverly Hills Experience Center</option>
                    <option value="Velora Manhattan Track & Lounge">Manhattan Track & Lounge</option>
                    <option value="Velora Miami Waterfront Hub">Miami Waterfront Hub</option>
                    <option value="Velora Silicon Valley Atelier">Silicon Valley Atelier</option>
                  </select>
                </div>
              </div>

              {/* Schedule Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="form-control text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="form-label">Preferred Time Window</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="form-control text-xs"
                  >
                    <option value="MORNING">Morning Session (10:00 AM)</option>
                    <option value="AFTERNOON">Afternoon Session (2:00 PM)</option>
                    <option value="EVENING">Sunset Session (5:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Driver License Checkbox */}
              <div className="pt-2">
                <label className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:border-cyan-400/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={driverLicenseValid}
                    onChange={(e) => setDriverLicenseValid(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 text-cyan-500 focus:ring-cyan-400"
                  />
                  <span className="text-xs text-slate-300">
                    I confirm that I possess a valid, unexpired driver's license and will present it upon arrival.
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Complimentary concierge valet provided</span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !driverLicenseValid}
                  className="btn-pill btn-cyan text-xs py-3 px-8 font-bold shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {loading ? 'Reserving Session...' : 'Confirm Reservation'}
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 flex items-center justify-center mx-auto mb-6 shadow-glow-cyan">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="badge-luxury mb-3">Reservation Confirmed</span>

            <h3 className="text-3xl font-display font-black text-white mb-2">
              VIP Drive Session Booked
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Your appointment at {result.dealershipLocation || dealershipLocation} is confirmed. A concierge specialist will reach out to verify arrival logistics.
            </p>

            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 max-w-sm mx-auto mb-6 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Confirmation Code:</span>
                <span className="font-mono text-cyan-400 font-bold">{result.confirmationCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Booking ID:</span>
                <span className="font-mono text-white font-bold">{result.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Date & Time:</span>
                <span className="font-mono text-slate-300">{result.scheduledDateTime}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-pill btn-cyan text-xs px-8 py-3 font-bold shadow-lg shadow-cyan-500/25"
            >
              Done & Return to Fleet
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

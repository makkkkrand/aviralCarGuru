import React, { useState } from 'react';
import { apiClient, TestDriveBookingResponse } from '../api/client';
import { X, Calendar, MapPin, CheckCircle2, Car, Clock, ShieldCheck } from 'lucide-react';

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
  const [preferredDate, setPreferredDate] = useState('2026-10-06');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<any>('AFTERNOON');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [driverLicenseValid, setDriverLicenseValid] = useState(true);
  const [notes, setNotes] = useState('Looking forward to testing the dynamic handling mode.');

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
      setError(err.message || 'Error booking test drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border-white/15 bg-[#0b101d] max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {!result ? (
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>Track & Highway Experience</span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
              Book a VIP Test Drive
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Experience unfiltered luxury performance. A dedicated product specialist will prepare the vehicle for your arrival.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Vehicle</label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="form-control"
                  >
                    <option value="VEL-2026-GT">Mercedes-AMG GT Coupe</option>
                    <option value="VEL-2026-TAYCAN">Porsche Taycan Turbo S</option>
                    <option value="VEL-2026-RSETRON">Audi RS e-tron GT</option>
                    <option value="VEL-2026-M8">BMW M8 Competition</option>
                    <option value="VEL-2026-DB12">Aston Martin DB12</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Showroom Location</label>
                  <select
                    value={dealershipLocation}
                    onChange={(e) => setDealershipLocation(e.target.value)}
                    className="form-control text-xs"
                  >
                    <option value="Velora Beverly Hills Experience Center">Beverly Hills Center</option>
                    <option value="Velora Manhattan Private Gallery">Manhattan Gallery</option>
                    <option value="Velora Miami Waterfront Showroom">Miami Waterfront</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Preferred Time</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value as any)}
                    className="form-control"
                  >
                    <option value="MORNING">Morning (10:00 AM)</option>
                    <option value="AFTERNOON">Afternoon (2:00 PM)</option>
                    <option value="EVENING">Evening (5:30 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control"
                    placeholder="Alexander"
                  />
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-control"
                    placeholder="Wright"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="alex@example.com"
                  />
                </div>
                <div>
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="+1 (555) 012-3456"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={driverLicenseValid}
                  onChange={(e) => setDriverLicenseValid(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-xs text-slate-300">
                  I confirm that I possess a valid, unexpired driver's license (must be presented upon arrival).
                </span>
              </label>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !driverLicenseValid}
                  className="btn-pill btn-cyan w-full py-3.5 font-bold text-sm shadow-lg shadow-cyan-500/25"
                >
                  {loading ? 'Confirming Appointment...' : 'Schedule Private Test Drive'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-4 text-cyan-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block mb-1">
              Reservation Confirmed
            </span>
            <h3 className="font-display font-extrabold text-3xl text-white mb-2">
              You're Scheduled!
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Your private test drive appointment has been booked. Please bring your driver's license.
            </p>

            <div className="glass-panel p-5 rounded-xl border-cyan-500/30 bg-cyan-950/20 text-left space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Confirmation Code</span>
                <span className="font-mono font-bold text-cyan-300 text-base">{result.confirmationCode}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Location</span>
                <span className="font-semibold text-white">{result.dealershipLocation}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Status</span>
                <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-300 font-bold">
                  {result.status}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-pill btn-cyan w-full py-3 text-sm font-semibold"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

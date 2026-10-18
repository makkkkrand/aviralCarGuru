import React, { useState } from 'react';
import { apiClient, TestDriveBookingResponse } from '../api/client';
import { X, Calendar, CheckCircle2, Clock, MapPin, Check } from 'lucide-react';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultVehicleId?: string;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  defaultVehicleId = 'CG-2026-XUV700',
}) => {
  const [vehicleId, setVehicleId] = useState(defaultVehicleId);
  const [dealershipLocation, setDealershipLocation] = useState('CarGuru Experience Hub, BKC, Mumbai');
  const todayPlus3 = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(todayPlus3);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<any>('AFTERNOON');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [driverLicenseValid, setDriverLicenseValid] = useState(true);
  const [notes, setNotes] = useState('Interested in evaluating vehicle driving comfort, fuel/range efficiency, and financing options.');

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

  const experienceCenters = [
    'CarGuru Experience Hub, BKC, Mumbai',
    'CarGuru Partner Atelier, Aerocity, New Delhi',
    'CarGuru Experience Center, UB City, Bengaluru',
    'CarGuru Delivery Hub, Jubilee Hills, Hyderabad',
    'CarGuru Hub, Viman Nagar, Pune',
    'CarGuru Doorstep VIP Test Drive (Pan-India at Residence / Office)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg p-6 rounded-xl border border-slate-200 bg-white max-h-[90vh] overflow-y-auto relative shadow-xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>

        {result ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold mb-0.5">
                Evaluation Reserved
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">
                Test Drive Appointment Confirmed
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your test drive and vehicle consultation appointment has been reserved with a CarGuru automotive specialist.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Confirmation Code</span>
                <span className="font-mono font-bold text-slate-900">{result.confirmationCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Hub / Location</span>
                <span className="font-semibold text-slate-900">{dealershipLocation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Scheduled Date</span>
                <span className="font-semibold text-slate-900">{preferredDate} ({preferredTimeSlot})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="font-semibold text-emerald-700">{result.status}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 text-white font-medium text-xs rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              Close Confirmation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                CarGuru Pan-India Network
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Book Test Drive &amp; Vehicle Review
              </h2>
              <p className="text-xs text-slate-600">
                Schedule a test drive at your nearest CarGuru Hub or request a doorstep evaluation at your residence.
              </p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                {error}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Select Hub or Doorstep Delivery</label>
                <select
                  value={dealershipLocation}
                  onChange={(e) => setDealershipLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                >
                  {experienceCenters.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Time Slot</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  >
                    <option value="MORNING">Morning (10:00 AM - 1:00 PM)</option>
                    <option value="AFTERNOON">Afternoon (2:00 PM - 5:00 PM)</option>
                    <option value="EVENING">Evening (5:00 PM - 7:30 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Mobile Phone (India)</label>
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

              <div>
                <label className="text-slate-600 font-medium block mb-1">Special Preferences / Driving Route</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={driverLicenseValid}
                  onChange={(e) => setDriverLicenseValid(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-0"
                />
                <span>I hold a valid permanent Indian Driving Licence (LMV category).</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                {loading ? 'Reserving Schedule...' : 'Confirm Test Drive Appointment'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

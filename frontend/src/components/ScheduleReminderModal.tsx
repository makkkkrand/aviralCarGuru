import React, { useState } from 'react';
import { X, Bell, Send, CheckCircle2, MessageSquare, PhoneCall, Mail, Calendar, Clock, Sparkles } from 'lucide-react';

export type ReminderCategory = 'loan' | 'test_drive' | 'enquiry';

interface ScheduleReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ReminderCategory;
  targetId: string; // referenceNumber, confirmationCode, or referenceTicket
  recipientName: string;
  recipientContact: string; // phone or email
  metadata?: any;
  onReminderScheduled?: (reminder: any) => void;
}

export const ScheduleReminderModal: React.FC<ScheduleReminderModalProps> = ({
  isOpen,
  onClose,
  category,
  targetId,
  recipientName,
  recipientContact,
  metadata = {},
  onReminderScheduled,
}) => {
  const getDefaultType = () => {
    if (category === 'loan') return 'EMI_PAYMENT_DUE';
    if (category === 'test_drive') return 'TEST_DRIVE_24H_PRIOR';
    return 'ADVISOR_FOLLOW_UP';
  };

  const [reminderType, setReminderType] = useState<string>(getDefaultType());
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState<string>('10:00');
  const [customNote, setCustomNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  if (!isOpen) return null;

  // Generate automated message preview based on selected parameters
  const generateMessagePreview = () => {
    const name = recipientName || 'Valued Customer';
    if (category === 'loan') {
      if (reminderType === 'EMI_PAYMENT_DUE') {
        return `Namaste ${name}, your monthly vehicle loan installment of ₹${metadata?.emi || '24,500'} (Ref: ${targetId}) is scheduled for auto-debit on ${scheduledDate}. Please ensure adequate bank balance to protect your CIBIL score. — CarGuru India`;
      } else if (reminderType === 'DOCS_PENDING') {
        return `Dear ${name}, additional KYC/salary documents are required to complete your auto loan sanction for ${metadata?.vehicle || 'your vehicle'} (${targetId}). Upload online today for expedited disbursement. — CarGuru India`;
      }
      return `Dear ${name}, your vehicle loan sanction letter (${targetId}) expires on ${scheduledDate}. Please review terms and accept sanction to lock your 8.49% rate. — CarGuru India`;
    }

    if (category === 'test_drive') {
      return `Hello ${name}, friendly reminder for your scheduled test drive of ${metadata?.vehicle || 'your selected car'} on ${scheduledDate} at ${scheduledTime} (${metadata?.location || 'Andheri West Hub'}). Booking Pass: ${targetId}. Please carry your valid driver license! — CarGuru India`;
    }

    // Enquiry
    return `Hello ${name}, your dedicated financial advisor (${metadata?.advisor || 'Priya Nair'}) has scheduled a vehicle loan advisory follow-up call on ${scheduledDate} at ${scheduledTime} regarding ticket ${targetId}. — CarGuru India`;
  };

  const handleSendReminder = (isInstant = false) => {
    setIsSubmitting(true);
    const reminderRecord = {
      id: `rem_${Date.now()}`,
      category,
      targetId,
      recipientName,
      recipientContact,
      reminderType,
      channel,
      scheduledDate: isInstant ? new Date().toISOString() : `${scheduledDate}T${scheduledTime}:00`,
      isInstant,
      message: customNote || generateMessagePreview(),
      createdAt: new Date().toISOString(),
      status: isInstant ? 'DISPATCHED' : 'SCHEDULED',
    };

    // Save into localStorage reminder history
    try {
      const existing = JSON.parse(localStorage.getItem('carguru_reminders_log') || '[]');
      existing.unshift(reminderRecord);
      localStorage.setItem('carguru_reminders_log', JSON.stringify(existing.slice(0, 50)));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setDispatchedSuccess(true);
      if (onReminderScheduled) onReminderScheduled(reminderRecord);
      setTimeout(() => {
        setDispatchedSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-xs">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {category === 'loan'
                  ? 'Schedule Loan & EMI Reminder'
                  : category === 'test_drive'
                  ? 'Schedule Test Drive Reminder'
                  : 'Schedule Advisory Lead Follow-up'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Target: {targetId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {dispatchedSuccess ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="font-bold text-base text-slate-900">Reminder Dispatched / Scheduled!</div>
              <p className="text-slate-500 text-xs">
                Notification queued for {recipientName} via {channel}. Audit logged successfully.
              </p>
            </div>
          ) : (
            <>
              {/* Recipient summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Recipient</span>
                  <div className="font-bold text-slate-900">{recipientName}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Contact Destination</span>
                  <div className="font-mono text-slate-800">{recipientContact}</div>
                </div>
              </div>

              {/* Reminder Type Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                  Reminder Type / Alert Purpose
                </label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  {category === 'loan' && (
                    <>
                      <option value="EMI_PAYMENT_DUE">Upcoming Monthly EMI Payment Due Alert</option>
                      <option value="DOCS_PENDING">Pending KYC &amp; Income Documents Verification</option>
                      <option value="SANCTION_EXPIRY">Sanction Letter Acceptance &amp; Disbursal Expiry</option>
                    </>
                  )}
                  {category === 'test_drive' && (
                    <>
                      <option value="TEST_DRIVE_24H_PRIOR">24-Hour Prior Test Drive Showroom Reminder</option>
                      <option value="SLOT_CONFIRMED">Showroom Slot Confirmation &amp; Gate Pass</option>
                      <option value="RESCHEDULE_PROMPT">Slot Reschedule &amp; Showroom Coordinator Alert</option>
                    </>
                  )}
                  {category === 'enquiry' && (
                    <>
                      <option value="ADVISOR_FOLLOW_UP">Financial Guru Consultation Callback Reminder</option>
                      <option value="QUOTATION_EXPIRY">Bank Interest Rate Quotation Expiry Alert</option>
                      <option value="SPECIAL_OFFER">Festive / EV Financing Concessional APR Alert</option>
                    </>
                  )}
                </select>
              </div>

              {/* Channel Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                  Notification Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('WHATSAPP')}
                    className={`p-2.5 rounded-lg border font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      channel === 'WHATSAPP'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('SMS')}
                    className={`p-2.5 rounded-lg border font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      channel === 'SMS'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                    <span>SMS Alert</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('EMAIL')}
                    className={`p-2.5 rounded-lg border font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      channel === 'EMAIL'
                        ? 'border-purple-600 bg-purple-50 text-purple-800 ring-1 ring-purple-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <span>Email</span>
                  </button>
                </div>
              </div>

              {/* Schedule Timing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Trigger Time (IST)
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Message Preview */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center justify-between">
                  <span>Automated Message Payload Preview</span>
                  <span className="text-[10px] text-slate-400 font-normal">Editable</span>
                </label>
                <textarea
                  rows={3}
                  value={customNote || generateMessagePreview()}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-[11px] text-slate-800 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendReminder(true)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Instant Alert Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendReminder(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Schedule For {scheduledDate}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

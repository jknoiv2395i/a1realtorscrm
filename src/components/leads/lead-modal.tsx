'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lead } from '@/lib/mock-data';
import { X, User, Phone, Mail, MapPin, IndianRupee, Briefcase, PlusCircle, Loader2 } from 'lucide-react';

interface LeadModalProps {
  onClose: () => void;
  onSave: (newLead: Lead) => void;
}

export function LeadModal({ onClose, onSave }: LeadModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<Partial<Lead>>({
    clientName: '',
    contactNumber: '+91 ',
    email: '',
    budgetMinLakhs: 75,
    budgetMaxLakhs: 150,
    preferredLocality: 'Bandra / Worli',
    preferredType: 'BHK_2',
    buyingIntent: 'SELF_USE',
    stage: 'NEW_INQUIRY',
    source: 'Direct Website Inquiry',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Explicit payload: never rely on Partial<Lead> spread ──────────────
    const leadPayload = {
      clientName:        (formData.clientName        || '').trim(),
      contactNumber:     (formData.contactNumber     || '').trim(),
      email:             (formData.email             || '').trim() || null,
      budgetMinLakhs:    Number(formData.budgetMinLakhs)  || 75,
      budgetMaxLakhs:    Number(formData.budgetMaxLakhs)  || 150,
      preferredLocality: (formData.preferredLocality || 'Mumbai').trim(),
      preferredType:     formData.preferredType      || 'BHK_2',
      buyingIntent:      formData.buyingIntent       || 'SELF_USE',
      stage:             formData.stage              || 'NEW_INQUIRY',
      source:            (formData.source            || 'Website Inquiry').trim(),
      notes:             (formData.notes             || '').trim() || null,
    };

    console.log('[LeadModal] Submitting lead payload:', leadPayload);

    if (!leadPayload.clientName || !leadPayload.contactNumber) {
      setErrorMessage('Client Name and Contact Number are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      console.log('[LeadModal] Dispatching POST /api/leads ...');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });

      console.log('[LeadModal] Server response status:', res.status);
      const data = await res.json();
      console.log('[LeadModal] Server response body:', data);

      if (!res.ok) {
        throw new Error(data.error || `Server returned ${res.status}`);
      }

      if (data.success && data.lead) {
        onSave(data.lead);
      }
      router.refresh();
      onClose();
    } catch (err: any) {
      console.error('[LeadModal] Submission error details:', err);
      setErrorMessage(err.message || 'Failed to connect to database API');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slateDark-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-bold text-slate-100">Add New Buyer / Investor Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Client Full Name *</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g. Vikramaditya Rao"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Contact Number (WhatsApp) *</label>
              <input
                type="text"
                required
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+91 98200 12345"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Budget Min (INR Lakhs)</label>
              <input
                type="number"
                value={formData.budgetMinLakhs}
                onChange={(e) => setFormData({ ...formData, budgetMinLakhs: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Budget Max (INR Lakhs)</label>
              <input
                type="number"
                value={formData.budgetMaxLakhs}
                onChange={(e) => setFormData({ ...formData, budgetMaxLakhs: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Preferred Locality / Micro-market</label>
              <input
                type="text"
                value={formData.preferredLocality}
                onChange={(e) => setFormData({ ...formData, preferredLocality: e.target.value })}
                placeholder="e.g. Worli, Whitefield, Cyber City"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Buying Intent</label>
              <select
                value={formData.buyingIntent}
                onChange={(e) => setFormData({ ...formData, buyingIntent: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              >
                <option value="SELF_USE">Self Use (End User)</option>
                <option value="INVESTMENT">Investment (Rental / Capital Appreciation)</option>
                <option value="END_USER_REPLACEMENT">Upgrade / Replacement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Initial Notes / Requirements</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Requires high-floor sea view with bank home loan eligibility..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gold-500 text-slateDark-950 font-bold hover:bg-gold-400 transition-colors shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <span>Save Lead</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

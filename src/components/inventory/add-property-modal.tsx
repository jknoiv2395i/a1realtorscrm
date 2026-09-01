'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/mock-data';
import { X, Building2, MapPin, ShieldCheck, IndianRupee, Image, PlusCircle, Check, Loader2 } from 'lucide-react';

interface AddPropertyModalProps {
  onClose: () => void;
  onSave: (property: Property) => void;
}

export function AddPropertyModal({ onClose, onSave }: AddPropertyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    locality: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'BHK_2' as Property['type'],
    reraNumber: `P518000${Math.floor(10000 + Math.random() * 90000)}`,
    carpetAreaSqFt: 950,
    priceInLakhs: 145,
    possessionStatus: 'READY_TO_MOVE' as Property['possessionStatus'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    bedrooms: 2,
    bathrooms: 2,
    description: '',
    amenities: 'Clubhouse, Gym, Swimming Pool, 24x7 Security, EV Charging',
    isFeatured: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.locality) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amenities: formData.amenities,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save property to database');
      }

      const createdProp: Property = {
        ...data.property,
        amenities: typeof data.property.amenities === 'string'
          ? data.property.amenities.split(',').map((a: string) => a.trim())
          : data.property.amenities,
      };

      onSave(createdProp);
      onClose();
    } catch (err: any) {
      console.error('AddPropertyModal Error:', err);
      setErrorMessage(err.message || 'Error connecting to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slateDark-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-bold text-slate-100">Add New Property Listing / Mandate</h2>
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
              <label className="block text-slate-400 font-semibold mb-1">Property Title / Project Name *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Lodha Park - Tower A"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">MahaRERA Registration No. *</label>
              <input
                type="text"
                required
                value={formData.reraNumber}
                onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                placeholder="P51900012345"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Locality / Micro-market *</label>
              <input
                type="text"
                required
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                placeholder="e.g. Lower Parel"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Typology</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              >
                <option value="BHK_1">1 BHK Luxury</option>
                <option value="BHK_2">2 BHK Premium</option>
                <option value="BHK_3">3 BHK Ultra</option>
                <option value="BHK_4">4 BHK Sky Villa</option>
                <option value="PENTHOUSE">Penthouse</option>
                <option value="VILLA">Private Villa</option>
                <option value="COMMERCIAL">Commercial Office</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Price (INR Lakhs) *</label>
              <input
                type="number"
                required
                value={formData.priceInLakhs}
                onChange={(e) => setFormData({ ...formData, priceInLakhs: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Carpet Area (Sq.Ft)</label>
              <input
                type="number"
                value={formData.carpetAreaSqFt}
                onChange={(e) => setFormData({ ...formData, carpetAreaSqFt: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Possession Status</label>
              <select
                value={formData.possessionStatus}
                onChange={(e) => setFormData({ ...formData, possessionStatus: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              >
                <option value="READY_TO_MOVE">Ready to Move</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
                <option value="NEW_LAUNCH">New Launch</option>
                <option value="RESALE">Resale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Amenities (Comma separated)</label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
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
                  <span>Saving Property...</span>
                </>
              ) : (
                <span>Add Property Listing</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

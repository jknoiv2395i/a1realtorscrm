'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/mock-data';
import { formatPriceInLakhs, formatPricePerSqFt, calculateIndianTax, formatINR } from '@/lib/formatters';
import { X, Building2, ShieldCheck, MapPin, CheckCircle, Calculator, FileText, ChevronRight, Share2 } from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [stampDutyPercent, setStampDutyPercent] = useState<number>(5);
  const taxBreakdown = calculateIndianTax(property.priceInLakhs, stampDutyPercent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slateDark-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header Image & Title Banner */}
        <div className="relative h-64 w-full">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slateDark-900 via-slateDark-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slateDark-950/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gold-500/20 text-gold-400 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-gold-500/30">
                  {property.type.replace('_', ' ')}
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {property.possessionStatus.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">{property.title}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                {property.locality}, {property.city}, {property.state}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-gold-400">{formatPriceInLakhs(property.priceInLakhs)}</p>
              <p className="text-xs font-semibold text-slate-300">
                {formatPricePerSqFt(property.priceInRupees, property.carpetAreaSqFt)}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* RERA Compliance & Carpet Area Card */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-gold-500/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-gold-400" />
              <div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">RERA Registered Property</p>
                <p className="text-sm font-extrabold text-gold-400 font-mono">{property.reraNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-300">
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">RERA Carpet Area</span>
                <span className="font-extrabold text-slate-100 text-sm">{property.carpetAreaSqFt} sq. ft.</span>
              </div>
              <div className="border-l border-slate-700 h-8" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Bedrooms & Baths</span>
                <span className="font-extrabold text-slate-100 text-sm">{property.bedrooms} Bed / {property.bathrooms} Bath</span>
              </div>
            </div>
          </div>

          {/* Description & Amenities */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Property Description</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{property.description}</p>

            <div className="mt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-gold-400" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Indian Tax & Statutory Cost Estimator Module */}
          <div className="p-5 rounded-xl bg-slateDark-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-gold-400" />
                <h3 className="text-sm font-bold text-slate-100">Statutory Tax & Cost Breakdown (Indian Compliance)</h3>
              </div>

              {/* State Selector for Stamp Duty */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">State Stamp Duty Rate:</span>
                <select
                  value={stampDutyPercent}
                  onChange={(e) => setStampDutyPercent(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-gold-500"
                >
                  <option value={5}>Maharashtra / MH (5%)</option>
                  <option value={5.6}>Karnataka / KA (5.6%)</option>
                  <option value={6}>Delhi NCR / HR (6%)</option>
                  <option value={7}>Tamil Nadu / TN (7%)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Agreement Value</span>
                <p className="text-sm font-bold text-slate-100 mt-1">{formatINR(taxBreakdown.agreementValue)}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Stamp Duty ({taxBreakdown.stampDutyRate}%)</span>
                <p className="text-sm font-bold text-amber-400 mt-1">{formatINR(taxBreakdown.stampDutyAmount)}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">GST ({taxBreakdown.gstRate}% {taxBreakdown.isAffordable ? 'Affordable' : 'Standard'})</span>
                <p className="text-sm font-bold text-blue-400 mt-1">{formatINR(taxBreakdown.gstAmount)}</p>
              </div>

              <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/30">
                <span className="text-gold-400 text-[10px] uppercase font-extrabold">Total All-In Cost</span>
                <p className="text-sm font-black text-gold-300 mt-1">{formatINR(taxBreakdown.totalAcquisitionCost)}</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              * Registration fee estimated at 1% (capped at ₹30,000). GST calculated as per 2026 CBIC guidelines for residential construction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

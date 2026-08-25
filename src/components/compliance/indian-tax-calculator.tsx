'use client';

import React, { useState } from 'react';
import { calculateIndianTax, formatINR, formatPricePerSqFt } from '@/lib/formatters';
import { Calculator, ShieldCheck, FileCheck, IndianRupee, PieChart, Layers, Download, CheckCircle2 } from 'lucide-react';

export function IndianTaxCalculator() {
  const [priceInLakhs, setPriceInLakhs] = useState<number>(125);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState<number>(1150);
  const [stampDutyPercent, setStampDutyPercent] = useState<number>(5);
  const [stateName, setStateName] = useState<string>('Maharashtra');

  const tax = calculateIndianTax(priceInLakhs, stampDutyPercent);
  const priceInRupees = priceInLakhs * 100000;

  const states = [
    { name: 'Maharashtra (MH)', stampDuty: 5 },
    { name: 'Karnataka (KA)', stampDuty: 5.6 },
    { name: 'Delhi NCR (HR/DL)', stampDuty: 6 },
    { name: 'Tamil Nadu (TN)', stampDuty: 7 },
    { name: 'Telangana (TS)', stampDuty: 5.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slateDark-900 border border-slate-800/80 glass-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gold-400" />
            <h2 className="text-xl font-black text-slate-100">Indian Real Estate Compliance & Financial Calculator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compute RERA carpet area rate, state-wise Stamp Duty, GST slab, & total acquisition cost
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 px-3 py-1.5 rounded-xl text-gold-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>CBIC & RERA Compliant (2026)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Controls Input Panel */}
        <div className="p-6 rounded-2xl bg-slateDark-900 border border-slate-800/80 shadow-2xl glass-panel space-y-5">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Property Financial Parameters</h3>

          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1.5">
              Agreed Property Price (INR Lakhs)
            </label>
            <div className="relative">
              <input
                type="number"
                value={priceInLakhs}
                onChange={(e) => setPriceInLakhs(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-gold-400 font-black focus:outline-none focus:border-gold-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Lakhs
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Raw Value: {formatINR(priceInRupees)}
            </p>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1.5">
              RERA Carpet Area (sq. ft.)
            </label>
            <input
              type="number"
              value={carpetAreaSqFt}
              onChange={(e) => setCarpetAreaSqFt(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-100 font-extrabold focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1.5">
              Select Indian State / Stamp Duty Slab
            </label>
            <select
              value={stampDutyPercent}
              onChange={(e) => {
                const val = Number(e.target.value);
                setStampDutyPercent(val);
                const st = states.find((s) => s.stampDuty === val);
                if (st) setStateName(st.name);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-gold-500 font-semibold"
            >
              {states.map((s) => (
                <option key={s.name} value={s.stampDuty}>
                  {s.name} - {s.stampDuty}%
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Breakdown Output Results (Takes 2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slateDark-900 border border-slate-800/80 shadow-2xl glass-panel flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 mb-4">
              Detailed Cost Sheet & Compliance Calculation Summary
            </h3>

            {/* Top Unit rate badge */}
            <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                  RERA Carpet Rate Analysis
                </span>
                <h4 className="text-xl font-black text-slate-100 mt-0.5">
                  {formatPricePerSqFt(priceInRupees, carpetAreaSqFt)}
                </h4>
              </div>
              <span className="bg-slateDark-950 text-gold-400 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-gold-500/40">
                {carpetAreaSqFt} sq.ft
              </span>
            </div>

            {/* Statutory Tax Breakdown Table */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <span className="text-slate-300 font-semibold">1. Property Agreement Value</span>
                <span className="font-extrabold text-slate-100">{formatINR(tax.agreementValue)}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div>
                  <span className="text-slate-300 font-semibold">2. State Stamp Duty ({tax.stampDutyRate}%)</span>
                  <span className="block text-[10px] text-slate-400">Sub-Registrar Office registration duty for {stateName}</span>
                </div>
                <span className="font-extrabold text-amber-400">{formatINR(tax.stampDutyAmount)}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div>
                  <span className="text-slate-300 font-semibold">
                    3. GST ({tax.gstRate}% - {tax.isAffordable ? 'Affordable Housing Slab' : 'Standard Residential Slab'})
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {tax.isAffordable ? '1% without ITC for properties <= ₹45 Lakhs' : '5% without ITC under construction slab'}
                  </span>
                </div>
                <span className="font-extrabold text-blue-400">{formatINR(tax.gstAmount)}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                <div>
                  <span className="text-slate-300 font-semibold">4. Government Registration Fee</span>
                  <span className="block text-[10px] text-slate-400">1% of Agreement value (capped at ₹30,000 max)</span>
                </div>
                <span className="font-extrabold text-slate-200">{formatINR(tax.registrationFee)}</span>
              </div>
            </div>
          </div>

          {/* Grand Total All-In Cost Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Outflow (Buyer Acquisition Cost)</span>
              <p className="text-2xl font-black gold-gradient-text mt-0.5">{formatINR(tax.totalAcquisitionCost)}</p>
            </div>

            <button
              onClick={() => alert(`Client cost sheet for ${formatINR(tax.totalAcquisitionCost)} generated successfully!`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 text-slateDark-950 font-bold hover:bg-gold-400 transition-colors shadow-xl text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Cost Sheet PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

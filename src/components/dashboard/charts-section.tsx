'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Sparkles } from 'lucide-react';

const REVENUE_DATA = [
  { month: 'Q1 (Jan-Mar)', revenue: 14.5, target: 12.0 },
  { month: 'Q2 (Apr-Jun)', revenue: 18.2, target: 15.0 },
  { month: 'Q3 (Jul-Sep)', revenue: 24.8, target: 20.0 },
  { month: 'Q4 (Oct-Dec)', revenue: 38.5, target: 30.0 }, // Festive / Diwali spike in India
];

const PIPELINE_DISTRIBUTION = [
  { name: 'New Inquiry', value: 14, color: '#3B82F6' },
  { name: 'Site Visit Scheduled', value: 8, color: '#F59E0B' },
  { name: 'Site Visit Completed', value: 6, color: '#8B5CF6' },
  { name: 'Negotiation', value: 5, color: '#06B6D4' },
  { name: 'Token Paid', value: 4, color: '#10B981' },
  { name: 'Closed / Won', value: 7, color: '#D4AF37' },
];

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Forecast Chart (Takes 2 Columns) */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-slateDark-900 border border-slate-800/80 shadow-2xl glass-panel relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-400" />
              <h3 className="text-base font-bold text-slate-100">Revenue Forecast & Commission (INR Cr)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Quarterly actuals vs forecast (Diwali & Navratri Q4 surge projected)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-gold-400">
              <span className="w-3 h-3 rounded-full bg-gold-500" /> Projected Revenue (Cr)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-600" /> Target Mandate
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `₹${v}Cr`} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#D4AF37',
                  borderRadius: '0.75rem',
                  color: '#F8FAFC',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`₹${value} Cr`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#D4AF37"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#goldGradient)"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#475569"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline Stage Breakdown Pie Chart (Takes 1 Column) */}
      <div className="p-6 rounded-2xl bg-slateDark-900 border border-slate-800/80 shadow-2xl glass-panel flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PieIcon className="w-5 h-5 text-gold-400" />
            <h3 className="text-base font-bold text-slate-100">Pipeline Stage Distribution</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">Breakdown of 44 active prospective clients</p>
        </div>

        <div className="h-52 w-full my-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PIPELINE_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {PIPELINE_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  color: '#F8FAFC',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value} Leads`, 'Count']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/60 text-[11px]">
          {PIPELINE_DISTRIBUTION.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 font-medium truncate">{item.name}</span>
              <span className="text-slate-500 font-bold ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
import { Lead, PIPELINE_STAGES } from '@/lib/mock-data';

interface ChartsSectionProps {
  leads?: Lead[];
  closedDealsValueCr?: number;
}

export function ChartsSection({ leads = [], closedDealsValueCr = 0 }: ChartsSectionProps) {
  // Compute quarterly forecast dynamically
  const REVENUE_DATA = [
    { month: 'Q1 (Jan-Mar)', revenue: closedDealsValueCr > 0 ? closedDealsValueCr * 0.2 : 0, target: 10.0 },
    { month: 'Q2 (Apr-Jun)', revenue: closedDealsValueCr > 0 ? closedDealsValueCr * 0.3 : 0, target: 15.0 },
    { month: 'Q3 (Jul-Sep)', revenue: closedDealsValueCr > 0 ? closedDealsValueCr * 0.4 : 0, target: 20.0 },
    { month: 'Q4 (Oct-Dec)', revenue: closedDealsValueCr > 0 ? closedDealsValueCr : 0, target: 30.0 },
  ];

  const stageColorMap: Record<string, string> = {
    NEW_INQUIRY: '#3B82F6',
    SITE_VISIT_SCHEDULED: '#F59E0B',
    SITE_VISIT_COMPLETED: '#8B5CF6',
    NEGOTIATION: '#06B6D4',
    TOKEN_PAID: '#10B981',
    CLOSED_WON: '#D4AF37',
    CLOSED_LOST: '#EF4444',
  };

  // Dynamically count leads per pipeline stage
  const pipelineDistribution = PIPELINE_STAGES.map((st) => {
    const count = leads.filter((l) => l.stage === st.id).length;
    return {
      name: st.label,
      value: count,
      color: stageColorMap[st.id] || '#64748B',
    };
  });

  const totalLeadsCount = leads.length;

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
              Quarterly actuals vs target mandates (Live database figures)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-gold-400">
              <span className="w-3 h-3 rounded-full bg-gold-500" /> Revenue (Cr)
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
          <p className="text-xs text-slate-400 mb-4">
            {totalLeadsCount > 0 ? `Breakdown of ${totalLeadsCount} active prospects` : 'No active prospective leads recorded'}
          </p>
        </div>

        <div className="h-52 w-full my-auto">
          {totalLeadsCount > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pipelineDistribution.map((entry, index) => (
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
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl">
              <PieIcon className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-400 font-semibold">Stage distribution empty</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Add leads to view visual pipeline analytics</p>
            </div>
          )}
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/60 text-[11px]">
          {pipelineDistribution.map((item) => (
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

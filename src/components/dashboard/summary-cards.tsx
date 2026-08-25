'use client';

import React from 'react';
import { IndianRupee, Users, CalendarCheck, CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { formatINR } from '@/lib/formatters';

interface SummaryCardsProps {
  totalPortfolioValueINR: number;
  activeLeadsCount: number;
  siteVisitsCount: number;
  closedDealsCount: number;
  closedValueINR: number;
}

export function SummaryCards({
  totalPortfolioValueINR,
  activeLeadsCount,
  siteVisitsCount,
  closedDealsCount,
  closedValueINR,
}: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Portfolio Value',
      value: formatINR(totalPortfolioValueINR),
      subtitle: 'Active Properties under mandate',
      growth: '+14.2% MoM',
      icon: IndianRupee,
      color: 'from-amber-500/20 to-gold-500/5',
      borderColor: 'border-gold-500/30',
      iconBg: 'bg-gold-500/20 text-gold-400',
    },
    {
      title: 'Active Leads Pipeline',
      value: activeLeadsCount.toString(),
      subtitle: 'Self-use & Investor prospects',
      growth: '+8 new this week',
      icon: Users,
      color: 'from-blue-500/20 to-indigo-500/5',
      borderColor: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20 text-blue-400',
    },
    {
      title: 'Scheduled Site Visits',
      value: siteVisitsCount.toString(),
      subtitle: 'Confirmed for this week',
      growth: '3 visits today',
      icon: CalendarCheck,
      color: 'from-purple-500/20 to-pink-500/5',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400',
    },
    {
      title: 'Closed Deals (YTD)',
      value: formatINR(closedValueINR),
      subtitle: `${closedDealsCount} Transactions finalized`,
      growth: '100% RERA compliant',
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-slateDark-900 border ${card.borderColor} backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] shadow-xl relative overflow-hidden group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-2xl font-black text-slate-50 mt-1 tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl ${card.iconBg} shadow-inner`}>
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 truncate">{card.subtitle}</span>
              <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ArrowUpRight className="w-3 h-3" />
                {card.growth}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

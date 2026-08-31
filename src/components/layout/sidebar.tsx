'use client';

import React from 'react';
import { 
  Building2, 
  Users, 
  Kanban, 
  Calculator, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronRight,
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: TrendingUp, badge: null },
    { id: 'pipeline', label: 'Lead & Pipeline Kanban', icon: Kanban, badge: 'Hot' },
    { id: 'calculator', label: 'Stamp Duty & GST Calc', icon: Calculator, badge: 'Tax' },
    { id: 'activities', label: 'Site Visits & Follow-ups', icon: Calendar, badge: '4 Today' },
  ];

  return (
    <aside className="w-64 bg-slateDark-900 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-slateDark-950 font-bold text-xl shadow-lg gold-border-glow">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg tracking-wide gold-gradient-text">A1 CRM</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">
                IN
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">India Real Estate CRM</p>
          </div>
        </div>

        {/* Agency Info Banner */}
        <div className="mx-3 my-4 p-3 rounded-lg bg-slate-800/40 border border-gold-500/10 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
          <div className="text-xs">
            <p className="text-slate-200 font-semibold truncate">Royal Estates India</p>
            <p className="text-slate-400 text-[10px]">MahaRERA: A51800099887</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Core Modules
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30 font-semibold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-gold-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-gold-500/20 text-gold-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold text-sm">
              AB
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-100">Agency Broker</p>
              <p className="text-[10px] text-gold-400/90 font-medium">Principal Administrator</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-rose-400 transition-colors p-1" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

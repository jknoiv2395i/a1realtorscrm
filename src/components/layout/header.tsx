'use client';

import React, { useState } from 'react';
import { Search, Plus, Bell, MapPin, Sparkles, Filter, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onOpenAddLead: () => void;
  onOpenAddProperty: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Header({
  selectedCity,
  setSelectedCity,
  onOpenAddLead,
  onOpenAddProperty,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cities = ['All India', 'Mumbai', 'Bengaluru', 'Gurugram (NCR)', 'Pune', 'Hyderabad'];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slateDark-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Client Name, Locality, RERA ID, or Budget..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/40 transition-all"
          />
        </div>
      </div>

      {/* City Selector & Action Controls */}
      <div className="flex items-center gap-3">
        {/* City Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs font-medium text-slate-200 hover:border-gold-500/40 transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {cityDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slateDark-900 border border-slate-700/80 rounded-xl shadow-2xl py-1 z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Filter Metro Market
              </div>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setCityDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-gold-500/10 hover:text-gold-400 text-left transition-colors"
                >
                  <span>{city}</span>
                  {selectedCity === city && <Check className="w-3.5 h-3.5 text-gold-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-gold-400 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
        </button>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddLead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/40 hover:bg-gold-500 hover:text-slateDark-950 text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Lead</span>
          </button>

          <button
            onClick={onOpenAddProperty}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </button>
        </div>
      </div>
    </header>
  );
}

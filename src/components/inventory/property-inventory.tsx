'use client';

import React, { useState } from 'react';
import { Property } from '@/lib/mock-data';
import { formatPriceInLakhs, formatPricePerSqFt } from '@/lib/formatters';
import { PropertyDetailModal } from './property-detail-modal';
import { AddPropertyModal } from './add-property-modal';
import { 
  Building2, 
  Grid, 
  List, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Maximize2, 
  Filter, 
  Bed, 
  Bath, 
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';

interface PropertyInventoryProps {
  properties: Property[];
  onAddProperty: (property: Property) => void;
  isAddPropertyOpen: boolean;
  setIsAddPropertyOpen: (open: boolean) => void;
  searchQuery: string;
  selectedCity: string;
}

export function PropertyInventory({
  properties,
  onAddProperty,
  isAddPropertyOpen,
  setIsAddPropertyOpen,
  searchQuery,
  selectedCity,
}: PropertyInventoryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedPossession, setSelectedPossession] = useState<string>('ALL');
  const [activeModalProperty, setActiveModalProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter((prop) => {
    // City filter
    if (selectedCity !== 'All India' && !prop.city.toLowerCase().includes(selectedCity.toLowerCase().split(' ')[0])) {
      return false;
    }
    // Type filter
    if (selectedType !== 'ALL' && prop.type !== selectedType) {
      return false;
    }
    // Possession filter
    if (selectedPossession !== 'ALL' && prop.possessionStatus !== selectedPossession) {
      return false;
    }
    // Text search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        prop.title.toLowerCase().includes(q) ||
        prop.locality.toLowerCase().includes(q) ||
        prop.reraNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Module Action Header */}
      <div className="p-5 rounded-2xl bg-slateDark-900 border border-slate-800/80 glass-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gold-400" />
            Indian Property Inventory Mandates
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified RERA registered residential & commercial listings ({filteredProperties.length} Mandates)
          </p>
        </div>

        {/* Filter Controls, Layout Toggle, and Add Property Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Add Property Button */}
          <button
            onClick={() => setIsAddPropertyOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gold-500 text-slateDark-950 font-bold hover:bg-gold-400 text-xs transition-colors shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Property</span>
          </button>

          {/* BHK Type Selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gold-500"
          >
            <option value="ALL">All Configurations (BHK)</option>
            <option value="BHK_1">1 BHK</option>
            <option value="BHK_2">2 BHK</option>
            <option value="BHK_3">3 BHK</option>
            <option value="BHK_4">4 BHK</option>
            <option value="PENTHOUSE">Penthouse / Sky Villa</option>
          </select>

          {/* Possession Filter */}
          <select
            value={selectedPossession}
            onChange={(e) => setSelectedPossession(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gold-500"
          >
            <option value="ALL">All Possession Status</option>
            <option value="READY_TO_MOVE">Ready to Move</option>
            <option value="UNDER_CONSTRUCTION">Under Construction</option>
            <option value="NEW_LAUNCH">New Launch</option>
          </select>

          {/* View Mode Toggle Button */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-gold-500 text-slateDark-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-gold-500 text-slateDark-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Property Cards Grid / List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => setActiveModalProperty(property)}
              className="rounded-2xl bg-slateDark-900 border border-slate-800/80 overflow-hidden shadow-xl hover:border-gold-500/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-slateDark-950/80 backdrop-blur-md text-gold-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-gold-500/30">
                      {property.type.replace('_', ' ')}
                    </span>
                    <span className="bg-slateDark-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
                      {property.possessionStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slateDark-950/90 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-gold-400" />
                    RERA Verified
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-100 group-hover:text-gold-400 transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gold-400/80" />
                        {property.locality}, {property.city}
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Area Specs */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-black text-gold-400">
                        {formatPriceInLakhs(property.priceInLakhs)}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {formatPricePerSqFt(property.priceInRupees, property.carpetAreaSqFt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-extrabold text-slate-200">
                        {property.carpetAreaSqFt} <span className="text-[10px] font-normal text-slate-400">sq.ft</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Carpet Area</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="px-5 py-3 bg-slate-800/30 border-t border-slate-800/80 flex items-center justify-between text-xs text-gold-400 font-semibold group-hover:bg-gold-500/10 transition-colors">
                <span>View Stamp Duty & Cost Sheet</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => setActiveModalProperty(property)}
              className="p-4 rounded-xl bg-slateDark-900 border border-slate-800/80 hover:border-gold-500/40 transition-all flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-100">{property.title}</h3>
                    <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                      {property.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gold-400" />
                    {property.locality}, {property.city}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    RERA: {property.reraNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
                <div className="text-right">
                  <p className="text-base font-black text-gold-400">{formatPriceInLakhs(property.priceInLakhs)}</p>
                  <p className="text-[11px] text-slate-400">{formatPricePerSqFt(property.priceInRupees, property.carpetAreaSqFt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-200">{property.carpetAreaSqFt} sq. ft.</p>
                  <p className="text-[10px] text-emerald-400">{property.possessionStatus.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Property Detail Modal */}
      {activeModalProperty && (
        <PropertyDetailModal
          property={activeModalProperty}
          onClose={() => setActiveModalProperty(null)}
        />
      )}

      {/* Add Property Modal */}
      {isAddPropertyOpen && (
        <AddPropertyModal
          onClose={() => setIsAddPropertyOpen(false)}
          onSave={onAddProperty}
        />
      )}
    </div>
  );
}

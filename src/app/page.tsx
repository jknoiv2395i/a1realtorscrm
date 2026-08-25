'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { PropertyInventory } from '@/components/inventory/property-inventory';
import { LeadPipeline } from '@/components/leads/lead-pipeline';
import { IndianTaxCalculator } from '@/components/compliance/indian-tax-calculator';
import { ActivitiesView } from '@/components/activities/activities-view';
import { MOCK_PROPERTIES, MOCK_LEADS, MOCK_ACTIVITIES, Property, Activity } from '@/lib/mock-data';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCity, setSelectedCity] = useState<string>('All India');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Central interactive state for properties and site visits / activities
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);

  // Modal open states
  const [isAddLeadOpen, setIsAddLeadOpen] = useState<boolean>(false);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState<boolean>(false);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState<boolean>(false);

  // Handlers for adding data dynamically
  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
  };

  const handleAddActivity = (newAct: Activity) => {
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleOpenAddProperty = () => {
    setActiveTab('inventory');
    setIsAddPropertyOpen(true);
  };

  const handleOpenScheduleVisit = () => {
    setActiveTab('activities');
    setIsScheduleVisitOpen(true);
  };

  // Compute live portfolio metrics from properties state
  const totalPortfolioValueINR = properties.reduce((acc, p) => acc + p.priceInRupees, 0);
  const activeLeadsCount = MOCK_LEADS.length;
  const siteVisitsCount = activities.filter((a) => a.type === 'SITE_VISIT').length;
  const closedDealsCount = 1;
  const closedValueINR = 48500000; // ₹4.85 Cr

  return (
    <div className="flex min-h-screen bg-slateDark-950 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Header */}
        <Header
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          onOpenAddLead={() => setIsAddLeadOpen(true)}
          onOpenAddProperty={handleOpenAddProperty}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Tab View Container */}
        <main className="p-6 flex-1 space-y-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SummaryCards
                totalPortfolioValueINR={totalPortfolioValueINR}
                activeLeadsCount={activeLeadsCount}
                siteVisitsCount={siteVisitsCount}
                closedDealsCount={closedDealsCount}
                closedValueINR={closedValueINR}
              />

              <ChartsSection />

              <ActivityFeed />
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="animate-in fade-in duration-300">
              <PropertyInventory
                properties={properties}
                onAddProperty={handleAddProperty}
                isAddPropertyOpen={isAddPropertyOpen}
                setIsAddPropertyOpen={setIsAddPropertyOpen}
                searchQuery={searchQuery}
                selectedCity={selectedCity}
              />
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="animate-in fade-in duration-300">
              <LeadPipeline
                searchQuery={searchQuery}
                isAddLeadOpen={isAddLeadOpen}
                setIsAddLeadOpen={setIsAddLeadOpen}
              />
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="animate-in fade-in duration-300">
              <IndianTaxCalculator />
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="animate-in fade-in duration-300">
              <ActivitiesView
                activities={activities}
                onAddActivity={handleAddActivity}
                isScheduleVisitOpen={isScheduleVisitOpen}
                setIsScheduleVisitOpen={setIsScheduleVisitOpen}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

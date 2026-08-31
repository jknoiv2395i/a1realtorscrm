'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { LeadPipeline } from '@/components/leads/lead-pipeline';
import { IndianTaxCalculator } from '@/components/compliance/indian-tax-calculator';
import { ActivitiesView } from '@/components/activities/activities-view';
import { Property, Activity, Lead } from '@/lib/mock-data';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCity, setSelectedCity] = useState<string>('All India');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Central interactive state initialized empty for clean production launch
  const [properties, setProperties] = useState<Property[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Modal open states
  const [isAddLeadOpen, setIsAddLeadOpen] = useState<boolean>(false);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState<boolean>(false);

  const handleAddActivity = (newAct: Activity) => {
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleOpenScheduleVisit = () => {
    setActiveTab('activities');
    setIsScheduleVisitOpen(true);
  };

  const handleOpenAddLead = () => {
    setActiveTab('pipeline');
    setIsAddLeadOpen(true);
  };

  // Compute live portfolio metrics dynamically from state
  const totalPortfolioValueINR = properties.reduce((acc, p) => acc + p.priceInRupees, 0);
  const activeLeadsCount = leads.length;
  const siteVisitsCount = activities.filter((a) => a.type === 'SITE_VISIT').length;
  const closedDeals = leads.filter((l) => l.stage === 'CLOSED_WON');
  const closedDealsCount = closedDeals.length;
  const closedValueINR = closedDeals.reduce((acc, l) => acc + (l.budgetMaxLakhs * 100000), 0);

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
          onOpenAddLead={handleOpenAddLead}
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

              <ChartsSection leads={leads} closedDealsValueCr={closedValueINR / 10000000} />

              <ActivityFeed
                activities={activities}
                leads={leads}
                onOpenScheduleVisit={handleOpenScheduleVisit}
                onOpenAddLead={handleOpenAddLead}
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

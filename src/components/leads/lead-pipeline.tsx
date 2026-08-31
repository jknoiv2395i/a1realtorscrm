'use client';

import React, { useState, useEffect } from 'react';
import { Lead, PIPELINE_STAGES } from '@/lib/mock-data';
import { formatPriceInLakhs, generateWhatsAppLink } from '@/lib/formatters';
import { LeadModal } from './lead-modal';
import { 
  Kanban, 
  Table, 
  MessageSquare, 
  Plus, 
  User, 
  MapPin, 
  Phone, 
  ArrowRight, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';

interface LeadPipelineProps {
  searchQuery: string;
  isAddLeadOpen: boolean;
  setIsAddLeadOpen: (open: boolean) => void;
}

export function LeadPipeline({
  searchQuery,
  isAddLeadOpen,
  setIsAddLeadOpen,
}: LeadPipelineProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch leads from Google Sheets / API
  useEffect(() => {
    async function loadLeads() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/leads');
        const data = await res.json();
        if (data.success && data.leads && data.leads.length > 0) {
          setLeads(data.leads);
        }
      } catch (err) {
        console.warn('Unable to load leads from API:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeads();
  }, []);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStage: Lead['stage']) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: targetStage } : l))
    );

    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, stage: targetStage }),
      });
    } catch (err) {
      console.error('Failed to update stage on Google Sheet:', err);
    }
  };

  const handleAddLead = async (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
    } catch (err) {
      console.error('Failed to post lead to Google Sheet:', err);
    }
  };

  // Filter leads by search query
  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.clientName.toLowerCase().includes(q) ||
      lead.preferredLocality.toLowerCase().includes(q) ||
      lead.contactNumber.includes(q)
    );
  });

  // Handle stage change (Simulating drag or quick stage bump)
  const handleMoveStage = async (leadId: string, currentStage: string) => {
    const stageOrder = PIPELINE_STAGES.map((s) => s.id);
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1] as Lead['stage'];
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, stage: nextStage } : l))
      );
    }
  };

  const handleAddNewLead = (newLeadData: Partial<Lead>) => {
    const created: Lead = {
      id: `lead-${Date.now()}`,
      clientName: newLeadData.clientName || 'New Client',
      contactNumber: newLeadData.contactNumber || '+91 98200 00000',
      email: newLeadData.email || '',
      budgetMinLakhs: newLeadData.budgetMinLakhs || 50,
      budgetMaxLakhs: newLeadData.budgetMaxLakhs || 100,
      preferredLocality: newLeadData.preferredLocality || 'Mumbai Central',
      preferredType: newLeadData.preferredType || 'BHK_2',
      buyingIntent: newLeadData.buyingIntent || 'SELF_USE',
      stage: 'NEW_INQUIRY',
      source: 'Website Form',
      createdAt: new Date().toISOString().split('T')[0],
      notes: newLeadData.notes || '',
    };
    setLeads([created, ...leads]);
  };

  return (
    <div className="space-y-6">
      {/* Header bar with total leads summary & view toggle */}
      <div className="p-5 rounded-2xl bg-slateDark-900 border border-slate-800/80 glass-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Kanban className="w-5 h-5 text-gold-400" />
            <h2 className="text-xl font-black text-slate-100">Buyer Lead Pipeline & Conversion Board</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Track inquiries across 6 Indian real estate purchase stages
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-gold-500 text-slateDark-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-gold-500 text-slateDark-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gold-500 text-slateDark-950 font-bold hover:bg-gold-400 text-xs transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-slateDark-900/80 border border-slate-800/80 rounded-2xl p-3 flex flex-col justify-between min-h-[500px] shadow-lg"
              >
                {/* Stage Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{stage.icon}</span>
                      <h3 className="text-xs font-extrabold text-slate-200 truncate">{stage.label}</h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.badgeBg}`}>
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Stage Leads Column Cards */}
                  <div className="space-y-3">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-gold-500/40 transition-all duration-200 shadow-md group relative space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-gold-400 transition-colors">
                            {lead.clientName}
                          </h4>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                            lead.buyingIntent === 'INVESTMENT' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {lead.buyingIntent}
                          </span>
                        </div>

                        <p className="text-[11px] font-bold text-gold-400">
                          {formatPriceInLakhs(lead.budgetMinLakhs)} - {formatPriceInLakhs(lead.budgetMaxLakhs)}
                        </p>

                        <div className="text-[10px] text-slate-400 space-y-0.5">
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold-400/80" />
                            {lead.preferredLocality}
                          </p>
                          {lead.propertyTitle && (
                            <p className="text-slate-300 line-clamp-1 italic">
                              Mandate: {lead.propertyTitle}
                            </p>
                          )}
                        </div>

                        {/* Action Bar */}
                        <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between">
                          <a
                            href={generateWhatsAppLink(lead.contactNumber, lead.clientName, lead.propertyTitle)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slateDark-950 transition-colors"
                            title="Direct WhatsApp Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {stage.id !== 'CLOSED_WON' && (
                            <button
                              onClick={() => handleMoveStage(lead.id, lead.stage)}
                              className="flex items-center gap-1 text-[10px] font-bold text-gold-400 hover:text-white transition-colors"
                            >
                              <span>Next Stage</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="py-8 px-2 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
                        <p className="text-[11px] font-semibold text-slate-400">No leads in stage</p>
                        <p className="text-[10px] text-slate-500">Click &apos;+ Add Lead&apos; to create an inquiry</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl bg-slateDark-900 border border-slate-800/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/80">
                <tr>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">WhatsApp Contact</th>
                  <th className="p-4">Budget Range</th>
                  <th className="p-4">Locality</th>
                  <th className="p-4">Intent</th>
                  <th className="p-4">Pipeline Stage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-100">{lead.clientName}</td>
                      <td className="p-4 font-mono text-slate-300">{lead.contactNumber}</td>
                      <td className="p-4 font-extrabold text-gold-400">
                        {formatPriceInLakhs(lead.budgetMinLakhs)} - {formatPriceInLakhs(lead.budgetMaxLakhs)}
                      </td>
                      <td className="p-4">{lead.preferredLocality}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lead.buyingIntent === 'INVESTMENT' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {lead.buyingIntent}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-300">
                        {lead.stage.replace(/_/g, ' ')}
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={generateWhatsAppLink(lead.contactNumber, lead.clientName, lead.propertyTitle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slateDark-950 font-bold transition-all text-[11px]"
                        >
                          <MessageSquare className="w-3 h-3" />
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      <p className="text-sm font-bold text-slate-300">No buyer inquiries found</p>
                      <p className="text-xs text-slate-500 mt-1">Click &apos;+ Add Lead&apos; above to record your first client prospect.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddLeadOpen && (
        <LeadModal
          onClose={() => setIsAddLeadOpen(false)}
          onSave={handleAddNewLead}
        />
      )}
    </div>
  );
}

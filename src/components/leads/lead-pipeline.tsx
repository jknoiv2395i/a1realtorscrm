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
  ArrowRight, 
  ArrowLeft,
  Loader2
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Fetch leads from Supabase API
  useEffect(() => {
    async function loadLeads() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/leads');
        const data = await res.json();
        if (data.success && data.leads) {
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

  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Handle stage change with optimistic UI update and PATCH persistence
  const handleStageChange = async (leadId: string, currentStage: string, direction: 'next' | 'prev') => {
    const stageOrder = PIPELINE_STAGES.map((s) => s.id);
    const currentIndex = stageOrder.indexOf(currentStage);

    let targetIndex = currentIndex;
    if (direction === 'next' && currentIndex < stageOrder.length - 1) {
      targetIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    }

    if (targetIndex === currentIndex) return;

    const newStage = stageOrder[targetIndex] as Lead['stage'];

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );

    setUpdatingLeadId(leadId);
    setErrorToast(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, stage: newStage }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Rollback on error
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, stage: currentStage as Lead['stage'] } : l))
        );
        const errDesc = data.error || 'Failed to persist stage transition to Supabase';
        setErrorToast(errDesc);
        console.error('Failed to update stage:', errDesc);
      }
    } catch (err: any) {
      // Rollback on network failure
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, stage: currentStage as Lead['stage'] } : l))
      );
      setErrorToast('Network error: Unable to reach database');
      console.error('Network error during stage update:', err);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleAddNewLead = (savedLead: Lead) => {
    setLeads((prev) => [savedLead, ...prev.filter((l) => l.id !== savedLead.id)]);
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

  // Sort leads globally by creation date descending
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  });

  return (
    <div className="space-y-6">
      {/* Header bar with total leads summary & view toggle */}
      <div className="p-5 rounded-2xl bg-slateDark-900 border border-slate-800/80 glass-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Kanban className="w-5 h-5 text-gold-400" />
            <h2 className="text-xl font-black text-slate-100">Buyer Lead Pipeline & Conversion Matrix</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Fixed row-matrix layout ordered by creation date with bi-directional stage controls & Supabase sync
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
              <span>Matrix Kanban</span>
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

      {errorToast && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <span>{errorToast}</span>
          <button
            onClick={() => setErrorToast(null)}
            className="text-rose-400 hover:text-white font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Kanban Matrix Row View */}
      {viewMode === 'kanban' ? (
        <div className="space-y-4">
          {/* Stage Headers Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 sticky top-0 z-10 bg-slateDark-950/90 backdrop-blur-md pb-2">
            {PIPELINE_STAGES.map((stage) => {
              const stageCount = sortedLeads.filter((l) => l.stage === stage.id).length;
              return (
                <div
                  key={stage.id}
                  className="bg-slateDark-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm shrink-0">{stage.icon}</span>
                    <h3 className="text-xs font-extrabold text-slate-200 truncate">{stage.label}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${stage.badgeBg}`}>
                    {stageCount}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Matrix Rows (Sorted Globally by Creation Date) */}
          {sortedLeads.length > 0 ? (
            <div className="space-y-3">
              {sortedLeads.map((lead, rowIndex) => (
                <div
                  key={lead.id}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 p-2 rounded-2xl bg-slateDark-900/60 border border-slate-800/60 hover:border-slate-700/80 transition-all shadow-lg"
                >
                  {PIPELINE_STAGES.map((stage, colIndex) => {
                    const isOccupied = lead.stage === stage.id;
                    const isFirstStage = colIndex === 0;
                    const isLastStage = colIndex === PIPELINE_STAGES.length - 1;
                    const isUpdating = updatingLeadId === lead.id;

                    if (!isOccupied) {
                      return (
                        <div
                          key={`${lead.id}-${stage.id}`}
                          className="h-full min-h-[120px] rounded-xl border border-dashed border-slate-800/40 bg-slate-900/20 flex items-center justify-center p-2"
                        >
                          <span className="text-[10px] text-slate-700/60 font-mono">Row #{rowIndex + 1}</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={lead.id}
                        className="p-3.5 rounded-xl bg-slate-800/80 border border-gold-500/40 shadow-xl space-y-2.5 relative flex flex-col justify-between hover:border-gold-400 transition-all"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[9px] font-mono text-gold-400 font-extrabold">#{rowIndex + 1}</span>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                              lead.buyingIntent === 'INVESTMENT' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {lead.buyingIntent}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-100">{lead.clientName}</h4>

                          <p className="text-[11px] font-bold text-gold-400">
                            {formatPriceInLakhs(lead.budgetMinLakhs)} - {formatPriceInLakhs(lead.budgetMaxLakhs)}
                          </p>

                          <div className="text-[10px] text-slate-400 space-y-0.5">
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gold-400/80 shrink-0" />
                              <span className="truncate">{lead.preferredLocality}</span>
                            </p>
                          </div>
                        </div>

                        {/* Stage Controls & WhatsApp Action Bar */}
                        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-1">
                          <button
                            disabled={isFirstStage || isUpdating}
                            onClick={() => handleStageChange(lead.id, lead.stage, 'prev')}
                            className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-1 rounded bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-slate-700/60 disabled:hover:text-slate-300"
                            title="Move to Previous Stage"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Prev</span>
                          </button>

                          <a
                            href={generateWhatsAppLink(lead.contactNumber, lead.clientName, lead.propertyTitle)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slateDark-950 transition-colors"
                            title="Direct WhatsApp Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            disabled={isLastStage || isUpdating}
                            onClick={() => handleStageChange(lead.id, lead.stage, 'next')}
                            className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-1 rounded bg-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-slateDark-950 transition-colors disabled:opacity-30 disabled:hover:bg-gold-500/20 disabled:hover:text-gold-400"
                            title="Move to Next Stage"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slateDark-900/50 space-y-3">
              <Kanban className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-200">No buyer leads available</h3>
              <p className="text-xs text-slate-400">Click &apos;+ Add Lead&apos; above to record your first prospect.</p>
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl bg-slateDark-900 border border-slate-800/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/80">
                <tr>
                  <th className="p-4">#</th>
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
                {sortedLeads.length > 0 ? (
                  sortedLeads.map((lead, idx) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono text-slate-500 font-bold">{idx + 1}</td>
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
                    <td colSpan={8} className="p-12 text-center text-slate-400">
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

'use client';

import React from 'react';
import { Activity, Lead } from '@/lib/mock-data';
import { generateWhatsAppLink, formatPriceInLakhs } from '@/lib/formatters';
import { Calendar, PhoneCall, MessageSquare, CheckCircle, Clock, ExternalLink, Flame, ShieldCheck, Plus } from 'lucide-react';

interface ActivityFeedProps {
  activities?: Activity[];
  leads?: Lead[];
  onOpenScheduleVisit?: () => void;
  onOpenAddLead?: () => void;
}

export function ActivityFeed({
  activities = [],
  leads = [],
  onOpenScheduleVisit,
  onOpenAddLead,
}: ActivityFeedProps) {
  const hotLeads = leads.filter((l) => l.stage === 'NEGOTIATION' || l.stage === 'TOKEN_PAID');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Follow-up & Scheduled Site Visit Tasks */}
      <div className="p-6 rounded-2xl bg-slateDark-900 border border-slate-800/80 shadow-2xl glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold-400" />
            <h3 className="text-base font-bold text-slate-100">Immediate Follow-ups & Site Visits</h3>
          </div>
          <span className="text-xs bg-gold-500/20 text-gold-400 font-semibold px-2.5 py-1 rounded-full border border-gold-500/30">
            {activities.length} Scheduled
          </span>
        </div>

        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const isVisit = activity.type === 'SITE_VISIT';
              const isWhatsApp = activity.type === 'WHATSAPP';

              return (
                <div
                  key={activity.id}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600 transition-all flex items-start gap-3 group"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isVisit ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    isWhatsApp ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {isVisit && <Calendar className="w-4 h-4" />}
                    {isWhatsApp && <MessageSquare className="w-4 h-4" />}
                    {!isVisit && !isWhatsApp && <PhoneCall className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-gold-400 transition-colors">
                        {activity.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                        {new Date(activity.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-medium">
                      <span>👤 {activity.clientName}</span>
                      <span>📍 {activity.locality}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30 space-y-3">
              <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-300">No scheduled follow-ups or site visits</p>
                <p className="text-[11px] text-slate-500 mt-1">Book client property walkthroughs & calls</p>
              </div>
              {onOpenScheduleVisit && (
                <button
                  onClick={onOpenScheduleVisit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-slateDark-950 text-xs font-bold transition-all border border-gold-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Site Visit</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hot Leads Ready to Close */}
      <div className="p-6 rounded-2xl bg-slateDark-900 border border-slate-800/80 shadow-2xl glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 animate-bounce" />
            <h3 className="text-base font-bold text-slate-100">Hot Deals in Closing Pipeline</h3>
          </div>
          <span className="text-xs text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            {hotLeads.length} High Intent
          </span>
        </div>

        <div className="space-y-3">
          {hotLeads.length > 0 ? (
            hotLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-gold-500/40 transition-all flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-100 truncate">{lead.clientName}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lead.stage === 'TOKEN_PAID' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {lead.stage === 'TOKEN_PAID' ? '💰 Token Paid' : '💬 Negotiation'}
                    </span>
                  </div>
                  <p className="text-xs text-gold-400 font-semibold mt-0.5">
                    Budget: {formatPriceInLakhs(lead.budgetMinLakhs)} - {formatPriceInLakhs(lead.budgetMaxLakhs)}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                    Property: {lead.propertyTitle} ({lead.preferredLocality})
                  </p>
                </div>

                {/* Action WhatsApp Button */}
                <a
                  href={generateWhatsAppLink(lead.contactNumber, lead.clientName, lead.propertyTitle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 hover:text-slateDark-950 text-emerald-400 text-xs font-bold transition-all border border-emerald-500/30 shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            ))
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30 space-y-3">
              <Flame className="w-8 h-8 text-slate-500 mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-300">No active negotiation or token stage deals</p>
                <p className="text-[11px] text-slate-500 mt-1">Leads moved to Negotiation or Token Paid will feature here</p>
              </div>
              {onOpenAddLead && (
                <button
                  onClick={onOpenAddLead}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-slateDark-950 text-xs font-bold transition-all border border-gold-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Lead</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

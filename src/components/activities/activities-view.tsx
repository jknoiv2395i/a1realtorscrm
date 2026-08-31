'use client';

import React, { useState } from 'react';
import { Activity } from '@/lib/mock-data';
import { generateWhatsAppLink } from '@/lib/formatters';
import { ScheduleVisitModal } from './schedule-visit-modal';
import { Calendar, PhoneCall, MessageSquare, CheckCircle2, Clock, Plus, MapPin, User } from 'lucide-react';

interface ActivitiesViewProps {
  activities: Activity[];
  onAddActivity: (activity: Activity) => void;
  isScheduleVisitOpen: boolean;
  setIsScheduleVisitOpen: (open: boolean) => void;
}

export function ActivitiesView({
  activities,
  onAddActivity,
  isScheduleVisitOpen,
  setIsScheduleVisitOpen,
}: ActivitiesViewProps) {
  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slateDark-900 border border-slate-800/80 glass-panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-400" />
            Site Visits & Buyer Follow-up Schedule
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize broker appointments, physical property tours, and client calls
          </p>
        </div>

        <button
          onClick={() => setIsScheduleVisitOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gold-500 text-slateDark-950 font-bold hover:bg-gold-400 text-xs transition-colors shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Schedule Site Visit</span>
        </button>
      </div>

      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-5 rounded-2xl bg-slateDark-900 border border-slate-800/80 shadow-xl space-y-4 hover:border-gold-500/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    act.type === 'SITE_VISIT' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    act.type === 'WHATSAPP' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {act.type === 'SITE_VISIT' && <Calendar className="w-5 h-5" />}
                    {act.type === 'WHATSAPP' && <MessageSquare className="w-5 h-5" />}
                    {act.type !== 'SITE_VISIT' && act.type !== 'WHATSAPP' && <PhoneCall className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-100">{act.title}</h3>
                    <p className="text-xs text-gold-400 font-medium">
                      {new Date(act.scheduledAt).toLocaleString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  act.isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {act.isCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
                {act.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-gold-400" /> {act.clientName}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" /> {act.locality}
                  </span>
                </div>

                <a
                  href={generateWhatsAppLink('+919820011223', act.clientName || 'Valued Client', act.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline text-xs font-semibold"
                >
                  Send Reminder
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slateDark-900/50 space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-200">No site visits or follow-ups scheduled</h3>
            <p className="text-xs text-slate-400 mt-1">
              Click &apos;+ Schedule Site Visit&apos; to book client property walkthroughs, calls, or reminders.
            </p>
          </div>
          <button
            onClick={() => setIsScheduleVisitOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-slateDark-950 font-bold hover:bg-gold-400 text-xs transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Schedule First Visit</span>
          </button>
        </div>
      )}

      {/* Schedule Visit Modal */}
      {isScheduleVisitOpen && (
        <ScheduleVisitModal
          onClose={() => setIsScheduleVisitOpen(false)}
          onSave={onAddActivity}
        />
      )}
    </div>
  );
}

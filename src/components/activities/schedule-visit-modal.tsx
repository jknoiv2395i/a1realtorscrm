'use client';

import React, { useState } from 'react';
import { Activity } from '@/lib/mock-data';
import { X, Calendar, Clock, MapPin, User, MessageSquare, PhoneCall, Check } from 'lucide-react';

interface ScheduleVisitModalProps {
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

export function ScheduleVisitModal({ onClose, onSave }: ScheduleVisitModalProps) {
  const [formData, setFormData] = useState({
    type: 'SITE_VISIT' as Activity['type'],
    title: '',
    clientName: '',
    locality: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.clientName) return;

    const scheduledAt = `${formData.date}T${formData.time}:00`;

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: formData.type,
      title: formData.title,
      clientName: formData.clientName,
      locality: formData.locality || 'Prime Locality',
      scheduledAt,
      description: formData.description || 'Property inspection & broker walkthrough with buyer family.',
      isCompleted: false,
    };

    onSave(newActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slateDark-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-bold text-slate-100">Schedule Site Visit / Follow-up Appointment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Appointment Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'SITE_VISIT', label: 'Site Visit', icon: Calendar },
                { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
                { id: 'CALL', label: 'Phone Call', icon: PhoneCall },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = formData.type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: item.id as any })}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-gold-500/20 text-gold-400 border-gold-500/40 shadow-sm'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Title / Property Mandatory Name *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Site Visit: Rustomjee Crown 3BHK"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Client Full Name *</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g. Aarav Singhania"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Property Locality / Area</label>
              <input
                type="text"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                placeholder="e.g. Prabhadevi, Mumbai"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Appointment Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Time Slot *</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Visit Instructions / Agenda</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Confirm key handover with building security manager & architect walkthrough..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gold-500 text-slateDark-950 font-bold hover:bg-gold-400 transition-colors shadow-lg"
            >
              Confirm & Schedule Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

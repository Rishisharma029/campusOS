import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Flame, PhoneCall, MapPin, CheckCircle, Radio } from 'lucide-react';
import { useRealtime } from '../context/RealtimeContext';

export const EmergencySOS: React.FC = () => {
  const { emergencyAlerts, triggerEmergencySOS, resolveEmergencySOS } = useRealtime();
  const [selectedLocation, setSelectedLocation] = useState('Block B - Lab 4');
  const [customNote, setCustomNote] = useState('');

  const handleTrigger = (type: 'Security' | 'Medical' | 'Fire') => {
    triggerEmergencySOS(type, selectedLocation);
    setCustomNote('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Warning Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-rose-900/50 to-slate-900 border border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-600 text-white shadow-lg shadow-red-500/40 animate-pulse">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Campus Emergency SOS Dispatch System
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 border border-red-400/40">24/7 Live Response</span>
            </h1>
            <p className="text-xs text-red-200/80">
              Triggering SOS immediately notifies Campus Security Control, Medical Unit, and Control Room with live GPS coordinates.
            </p>
          </div>
        </div>
      </div>

      {/* SOS Action Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Medical SOS */}
        <div
          onClick={() => handleTrigger('Medical')}
          className="glass-card p-6 border-red-500/30 hover:border-red-500 bg-gradient-to-b from-slate-900 to-red-950/30 cursor-pointer group text-center space-y-3 transition-all transform hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
            <AlertTriangle size={32} className="animate-bounce" />
          </div>
          <h3 className="text-lg font-bold text-white">Medical Emergency</h3>
          <p className="text-xs text-slate-400">First Aid, Ambulance, Cardiac/Injury Response</p>
          <span className="inline-block text-xs font-semibold px-4 py-1.5 rounded-xl bg-red-600 text-white shadow-md">
            TRIGGER MEDICAL SOS
          </span>
        </div>

        {/* Security SOS */}
        <div
          onClick={() => handleTrigger('Security')}
          className="glass-card p-6 border-amber-500/30 hover:border-amber-500 bg-gradient-to-b from-slate-900 to-amber-950/30 cursor-pointer group text-center space-y-3 transition-all transform hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-full bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
            <ShieldAlert size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">Security Threat</h3>
          <p className="text-xs text-slate-400">Unauthorized Entry, Theft, Altercation Dispatch</p>
          <span className="inline-block text-xs font-semibold px-4 py-1.5 rounded-xl bg-amber-600 text-white shadow-md">
            TRIGGER SECURITY SOS
          </span>
        </div>

        {/* Fire SOS */}
        <div
          onClick={() => handleTrigger('Fire')}
          className="glass-card p-6 border-orange-500/30 hover:border-orange-500 bg-gradient-to-b from-slate-900 to-orange-950/30 cursor-pointer group text-center space-y-3 transition-all transform hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
            <Flame size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">Fire Hazard</h3>
          <p className="text-xs text-slate-400">Smoke, Gas Leak, Fire Alarm Suppression</p>
          <span className="inline-block text-xs font-semibold px-4 py-1.5 rounded-xl bg-orange-600 text-white shadow-md">
            TRIGGER FIRE SOS
          </span>
        </div>
      </div>

      {/* Target Location Selection */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <MapPin className="text-red-400" size={18} />
          Set Current Campus Location for Dispatch
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['Block B - Lab 4', 'Central Library Ground Floor', 'Boys Hostel A - Mess', 'Main Gate Entry', 'Block A - Computer Hall'].map(loc => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                selectedLocation === loc
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Active Alerts Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Radio className="text-red-400 animate-pulse" size={18} />
          Active Emergency Alerts & Response Queue
        </h3>
        <div className="space-y-2">
          {emergencyAlerts.map(alert => (
            <div
              key={alert.id}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    {alert.type} Alert ({alert.id})
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      alert.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {alert.status}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">{alert.location} &bull; Triggered by {alert.sender} ({alert.timestamp})</p>
                </div>
              </div>
              {alert.status !== 'RESOLVED' && (
                <button
                  onClick={() => resolveEmergencySOS(alert.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <CheckCircle size={14} />
                  Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

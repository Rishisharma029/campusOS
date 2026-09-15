import React from 'react';
import {
  Bus,
  TrendingUp,
  Clock,
  Users,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export const TransportDashboard: React.FC = () => {
  const { toast } = useToast();

  const fleet = [
    { number: 'KA-01-EQ-9012', route: 'Route 1 (North Express)', driver: 'Suresh Kumar', speed: '42 km/h', eta: '6 Mins', passCount: 38, capacity: 50, status: 'ON_TIME' },
    { number: 'KA-01-EQ-4411', route: 'Route 2 (South City)', driver: 'Ramesh Gowda', speed: '36 km/h', eta: '12 Mins', passCount: 45, capacity: 50, status: 'ON_TIME' },
    { number: 'KA-01-EQ-8820', route: 'Route 3 (East Sector)', driver: 'Anand Verma', speed: '40 km/h', eta: '4 Mins', passCount: 22, capacity: 50, status: 'DELAYED_5M' },
    { number: 'KA-01-EQ-1190', route: 'Route 4 (Metro Feeder)', driver: 'Ganesh Pillai', speed: '28 km/h', eta: '8 Mins', passCount: 48, capacity: 50, status: 'ON_TIME' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Transport Briefing */}
      <div className="glass-card p-6 border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                Fleet Telemetry & Campus Transit Operations
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>22 / 24 Campus buses active with live GPS telemetry linked to student apps.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Clock size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>94.6% On-time schedule adherence recorded across all 18 city routes.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Route 3 running 5 minutes behind schedule due to central flyover repair.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Users size={14} className="text-teal-400 shrink-0 mt-0.5" />
                <span>1,420 Active student & faculty semester transit passes verified.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => toast('Route Alert Sent', 'Push notification broadcast to Route 3 passengers regarding 5m delay.', 'info')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <Radio size={16} />
              <span>Broadcast Route Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Transport KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buses On Road</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bus size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">22 / 24</h3>
            <span className="text-[11px] text-emerald-400 block mt-1">2 in Routine Service Bay</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Routes</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <MapPin size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">18 Routes</h3>
            <span className="text-[11px] text-blue-300 block mt-1">City & Suburban Corridors</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On-Time Efficiency</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">94.6%</h3>
            <span className="text-[11px] text-emerald-400 block mt-1">GPS Telemetry Monitored</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Commuters</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">1,420</h3>
            <span className="text-[11px] text-purple-300 block mt-1">Students, Faculty & Staff</span>
          </div>
        </div>
      </div>

      {/* Live GPS Fleet Telemetry Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Live GPS Bus Fleet Status</h3>
            <p className="text-xs text-slate-400">Realtime speed, passenger load, and Gate 1 arrival countdown</p>
          </div>
          <button
            onClick={() => toast('Fleet Telemetry Refreshed', 'GPS coordinates synchronized across all 22 active vehicles.', 'success')}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs cursor-pointer"
          >
            Refresh GPS Coordinates
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Bus Number</th>
                <th className="pb-3 font-semibold">Route</th>
                <th className="pb-3 font-semibold">Driver</th>
                <th className="pb-3 font-semibold">Current Speed</th>
                <th className="pb-3 font-semibold">ETA to Gate 1</th>
                <th className="pb-3 font-semibold">Occupancy</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {fleet.map((bus, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 font-bold font-mono text-cyan-400">{bus.number}</td>
                  <td className="py-3 font-medium text-white">{bus.route}</td>
                  <td className="py-3 text-slate-400">{bus.driver}</td>
                  <td className="py-3 font-mono text-slate-300">{bus.speed}</td>
                  <td className="py-3 font-bold text-emerald-400">{bus.eta}</td>
                  <td className="py-3 text-slate-300">{bus.passCount} / {bus.capacity}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                      bus.status === 'ON_TIME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {bus.status === 'ON_TIME' ? 'On Time' : 'Delayed 5m'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

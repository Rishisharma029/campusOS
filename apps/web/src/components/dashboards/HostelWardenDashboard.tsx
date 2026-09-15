import React from 'react';
import {
  Home,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Wrench,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export const HostelWardenDashboard: React.FC = () => {
  const { toast } = useToast();

  const blocks = [
    { name: 'Block A (Boys Hostel - Senior)', capacity: 350, occupied: 320, curfewCompliance: '98.5%', status: 'CHECKED_IN' },
    { name: 'Block B (Girls Hostel - Central)', capacity: 350, occupied: 335, curfewCompliance: '99.4%', status: 'CHECKED_IN' },
    { name: 'Block C (International & Scholars)', capacity: 200, occupied: 165, curfewCompliance: '99.0%', status: 'CHECKED_IN' },
  ];

  const pendingPasses = [
    { student: 'Rohan Deshmukh', roll: '2024CS081', room: 'Room A-304', reason: 'Weekend Visit Home (Pune)', duration: '19 Sep - 21 Sep', status: 'PENDING' },
    { student: 'Sneha Kulkarni', roll: '2024EC019', room: 'Room B-212', reason: 'Family Function in City', duration: 'Today, 06:00 PM - 10:00 PM', status: 'PENDING' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hostel Briefing */}
      <div className="glass-card p-6 border-rose-500/40 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                Campus Residence & Hostel Operations Desk
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>820 / 900 Beds occupied (91.1% capacity). All 3 hostel blocks operational.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Clock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Night curfew check-in: 99.2% students scanned into their blocks.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Wrench size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>6 Open maintenance tickets: 2 Plumbing, 3 Wi-Fi router reboot, 1 Geyser check.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <ShieldCheck size={14} className="text-teal-400 shrink-0 mt-0.5" />
                <span>CCTV perimeter and biometric turnstiles operational at Main Residence Gates.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => toast('Roll Call Active', 'Biometric turnstile check-in log refreshed.', 'success')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <QrCode size={16} />
              <span>Initiate Curfew Roll Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Hostel KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hostel Occupancy</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Home size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">820 / 900</h3>
            <span className="text-[11px] text-emerald-400 block mt-1">91.1% Capacity Reached</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Curfew Compliance</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">99.2%</h3>
            <span className="text-[11px] text-emerald-400 block mt-1">Biometric Gates Verified</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Night Out Passes</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-amber-400">2 Pending</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Parent Approval Verified via SMS</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maintenance Issues</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Wrench size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">6 Active</h3>
            <span className="text-[11px] text-blue-300 block mt-1">Estate Team Dispatched</span>
          </div>
        </div>
      </div>

      {/* Blocks Overview & Pending Passes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Residential Blocks Occupancy</h3>
              <p className="text-xs text-slate-400">Room availability and curfew check-ins</p>
            </div>
          </div>

          <div className="space-y-3">
            {blocks.map((b, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{b.name}</h4>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Curfew Adherence: <strong className="text-emerald-400">{b.curfewCompliance}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-white">{b.occupied} / {b.capacity} Beds</span>
                    <span className="block text-[10px] text-slate-400">{b.capacity - b.occupied} Vacant</span>
                  </div>
                  <button
                    onClick={() => toast('Block Inspection', `Inspection audit scheduled for ${b.name}.`, 'info')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/30 font-semibold text-xs cursor-pointer"
                  >
                    Inspect Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Gatepass Approvals */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Gatepass Queue</h3>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">Parent Verified</span>
          </div>

          <div className="space-y-3">
            {pendingPasses.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{p.student}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{p.room}</span>
                </div>
                <p className="text-[11px] text-slate-300">{p.reason}</p>
                <span className="text-[10px] text-slate-400 block font-mono">{p.duration}</span>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => toast('Gatepass Approved', `Digital pass generated for ${p.student}.`, 'success')}
                    className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => toast('Gatepass Rejected', `Request declined for ${p.student}.`, 'error')}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 font-semibold text-[10px] cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

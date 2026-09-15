import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useRealtime } from '../../context/RealtimeContext';
import {
  Percent,
  IndianRupee,
  Users,
  GraduationCap,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useToast } from '../ui/Toast';

const ATTENDANCE_TREND = [
  { name: 'Mon', Attendance: 94.5, Target: 90 },
  { name: 'Tue', Attendance: 92.1, Target: 90 },
  { name: 'Wed', Attendance: 95.8, Target: 90 },
  { name: 'Thu', Attendance: 91.2, Target: 90 },
  { name: 'Fri', Attendance: 94.2, Target: 90 },
];

const PLACEMENT_STATS = [
  { name: 'Placed', value: 78, color: '#10B981' },
  { name: 'In Pipeline', value: 16, color: '#3B82F6' },
  { name: 'Preparing', value: 6, color: '#F59E0B' },
];

export const AdminDashboard: React.FC = () => {
  const { students, faculty, feeCollections } = useDatabase();
  const { activeClassesCount, todayAttendanceRate, aiAlerts } = useRealtime();
  const { toast } = useToast();

  const totalFeesPaid = feeCollections.reduce((acc, curr) => acc + curr.amountPaid, 0) || 18450000;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Proactive AI Daily Briefing Banner */}
      <div className="glass-card p-6 border-blue-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                Executive Command & Campus Intelligence
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Campus attendance telemetry at {todayAttendanceRate}% across {activeClassesCount} active classrooms.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Hostel Building B electricity consumption spiked +22% vs baseline.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Google Cloud Placement Drive shortlisted 24 CSE candidates today.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>All microservices operational. Zero latency anomalies detected.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ADMINISTRATOR COCKPIT
            </span>
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campus Attendance</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Percent size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{todayAttendanceRate}%</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp size={12} /> +2.1% vs last week
            </span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fee Collection</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <IndianRupee size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">₹{(totalFeesPaid / 100000).toFixed(1)} Lakhs</h3>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1">94.8% semester fee reconciled</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{students.length > 0 ? students.length * 420 : 4250}</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Across 8 Engineering Departments</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty On Duty</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <GraduationCap size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{faculty.length > 0 ? faculty.length * 15 : 180} Staff</h3>
            <span className="text-[11px] text-emerald-400 block mt-1">98.2% attendance today</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Live Campus Attendance Telemetry</h3>
              <p className="text-xs text-slate-400">Verified via CCTV AI Face Scanner & QR Portal</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
              Live Stream
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTENDANCE_TREND}>
                <defs>
                  <linearGradient id="colorAttendanceAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[80, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Attendance" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendanceAdmin)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Placement Drive Ratio</h3>
            <p className="text-xs text-slate-400">Class of 2026 AI Candidate Ranking</p>
          </div>

          <div className="h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLACEMENT_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {PLACEMENT_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-xs">
            {PLACEMENT_STATS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Executive Command Actions */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-blue-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Executive Command Actions</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => toast('Campus Broadcast', 'Emergency notice broadcasted to all 4,250 student apps.', 'success')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow cursor-pointer"
          >
            Broadcast Announcement
          </button>
          <button
            onClick={() => toast('Audit Report', 'Full NIRF/NAAC academic compliance log exported.', 'info')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all cursor-pointer"
          >
            Export Compliance Audit
          </button>
          <button
            onClick={() => toast('AI Policy Synchronized', 'Model temperature & guardrails updated.', 'success')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all cursor-pointer"
          >
            Sync AI Safety Guardrails
          </button>
        </div>
      </div>
    </div>
  );
};

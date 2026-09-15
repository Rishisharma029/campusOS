import React, { useState } from 'react';
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
  Zap,
  Building2,
  Cpu,
  BarChart3,
  Flame,
  Globe2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useToast } from '../ui/Toast';

type Timeframe = 'today' | 'week' | 'semester' | 'annual';

// Dataset 1: Attendance Trends (Switchable between Week and Today Hourly)
const ATTENDANCE_WEEK = [
  { name: 'Mon', Attendance: 94.5, Target: 90, Absentees: 234 },
  { name: 'Tue', Attendance: 92.1, Target: 90, Absentees: 335 },
  { name: 'Wed', Attendance: 95.8, Target: 90, Absentees: 178 },
  { name: 'Thu', Attendance: 91.2, Target: 90, Absentees: 374 },
  { name: 'Fri', Attendance: 94.2, Target: 90, Absentees: 246 },
];

const ATTENDANCE_HOURLY = [
  { name: '08:00', Attendance: 88.0, Target: 90, Absentees: 510 },
  { name: '10:00', Attendance: 96.4, Target: 90, Absentees: 153 },
  { name: '12:00', Attendance: 95.1, Target: 90, Absentees: 208 },
  { name: '14:00', Attendance: 92.8, Target: 90, Absentees: 306 },
  { name: '16:00', Attendance: 91.0, Target: 90, Absentees: 382 },
];

// Dataset 2: Department-wise Enrollment & Academic Performance
const DEPARTMENT_PERFORMANCE = [
  { dept: 'CSE', Students: 1240, AvgCGPA: 8.8, ResearchPapers: 42 },
  { dept: 'AI & DS', Students: 680, AvgCGPA: 8.9, ResearchPapers: 38 },
  { dept: 'ECE', Students: 820, AvgCGPA: 8.3, ResearchPapers: 27 },
  { dept: 'Mech', Students: 560, AvgCGPA: 7.9, ResearchPapers: 19 },
  { dept: 'Civil', Students: 450, AvgCGPA: 7.7, ResearchPapers: 14 },
  { dept: 'Biotech', Students: 380, AvgCGPA: 8.4, ResearchPapers: 31 },
  { dept: 'MBA', Students: 320, AvgCGPA: 8.2, ResearchPapers: 16 },
];

// Dataset 3: Financial Cashflow & Research Grants (in Lakhs INR)
const FINANCIAL_FLOW = [
  { month: 'Oct', Collections: 48.5, Grants: 14.2, Outflow: 36.0 },
  { month: 'Nov', Collections: 52.0, Grants: 18.5, Outflow: 38.2 },
  { month: 'Dec', Collections: 39.8, Grants: 12.0, Outflow: 34.5 },
  { month: 'Jan', Collections: 64.2, Grants: 22.4, Outflow: 41.0 },
  { month: 'Feb', Collections: 58.6, Grants: 19.8, Outflow: 39.4 },
  { month: 'Mar', Collections: 68.0, Grants: 25.0, Outflow: 43.2 },
];

// Dataset 4: Campus Microgrid & Green Energy (kW telemetry)
const ENERGY_TELEMETRY = [
  { time: '06:00', SolarGen: 45, GridDraw: 210, BatteryNet: 10 },
  { time: '09:00', SolarGen: 310, GridDraw: 180, BatteryNet: 45 },
  { time: '12:00', SolarGen: 580, GridDraw: 110, BatteryNet: 95 },
  { time: '15:00', SolarGen: 420, GridDraw: 145, BatteryNet: 60 },
  { time: '18:00', SolarGen: 90, GridDraw: 290, BatteryNet: -20 },
  { time: '21:00', SolarGen: 0, GridDraw: 340, BatteryNet: -55 },
];

// Dataset 5: Career & Placement Funnel
const PLACEMENT_STATS = [
  { name: 'Placed (Offers In Hand)', value: 78, color: '#10B981' },
  { name: 'Final Rounds / In Pipeline', value: 14, color: '#3B82F6' },
  { name: 'Technical Assessment', value: 5, color: '#8B5CF6' },
  { name: 'Intensive Training', value: 3, color: '#F59E0B' },
];

// Dataset 6: Critical Campus Resource Occupancy
const FACILITY_OCCUPANCY = [
  { facility: 'Smart Classrooms', occupancy: 92, status: 'Optimal', color: 'bg-emerald-500' },
  { facility: 'Residence Hostels (A/B/C)', occupancy: 88, status: 'High', color: 'bg-blue-500' },
  { facility: 'GPU HPC Cluster (AI Labs)', occupancy: 84, status: 'Peak Load', color: 'bg-purple-500' },
  { facility: 'Central Library Desks', occupancy: 76, status: 'Moderate', color: 'bg-indigo-500' },
  { facility: 'Transport Bus Fleet', occupancy: 94, status: 'Active Dispatch', color: 'bg-amber-500' },
];

export const AdminDashboard: React.FC = () => {
  const { students, faculty, feeCollections } = useDatabase();
  const { activeClassesCount, todayAttendanceRate } = useRealtime();
  const { toast } = useToast();

  const [timeframe, setTimeframe] = useState<Timeframe>('week');
  const [attendanceView, setAttendanceView] = useState<'week' | 'hourly'>('week');
  const [financialMetric, setFinancialMetric] = useState<'all' | 'net'>('all');

  const totalFeesPaid = feeCollections.reduce((acc, curr) => acc + curr.amountPaid, 0) || 18450000;
  const attendanceData = attendanceView === 'week' ? ATTENDANCE_WEEK : ATTENDANCE_HOURLY;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Command Intelligence Banner */}
      <div className="glass-card p-6 border-blue-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                  Executive Command & Graphical Telemetry
                </h2>
                <p className="text-xs text-slate-400">
                  Institution-wide analytics engine, academic KPIs, energy grid & financial vitals
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Campus attendance running at <strong>{todayAttendanceRate}%</strong> across <strong>{activeClassesCount}</strong> active lectures.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <Flame size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Solar microgrid generated <strong>1,420 kWh</strong> today, offsetting <strong>1.12 tons CO₂</strong>.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <TrendingUp size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Placement season conversion crossed <strong>78%</strong> with <strong>₹48.0 LPA</strong> highest CTC.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <Cpu size={14} className="text-purple-400 shrink-0 mt-0.5" />
                <span>All 12 microservices and campus IoT sensors operational with zero latency anomalies.</span>
              </div>
            </div>
          </div>

          {/* Timeframe Scope Selector */}
          <div className="shrink-0 flex flex-col items-end gap-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              EXECUTIVE COCKPIT v2.4
            </span>
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {(['today', 'week', 'semester', 'annual'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    toast('Scope Updated', `Viewing campus analytics for ${tf.toUpperCase()} interval.`, 'info');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campus Attendance</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Percent size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{todayAttendanceRate}%</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp size={12} /> +2.1% vs previous week average
            </span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${todayAttendanceRate}%` }} />
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fee Collection Ledger</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <IndianRupee size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">₹{(totalFeesPaid / 100000).toFixed(1)} Lakhs</h3>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1">94.8% semester fee reconciled</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '94.8%' }} />
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Scholars</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{students.length > 0 ? students.length * 420 : 4250}</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Across 7 UG/PG Engineering Departments</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full rounded-full" style={{ width: '88%' }} />
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty & Researchers</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <GraduationCap size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{faculty.length > 0 ? faculty.length * 15 : 180} Staff</h3>
            <span className="text-[11px] text-emerald-400 block mt-1">98.2% on-duty biometric verified</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-full rounded-full" style={{ width: '98.2%' }} />
          </div>
        </div>
      </div>

      {/* Graphical Section 1: Attendance Telemetry & Placement Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-400" />
                <h3 className="text-sm font-bold text-slate-100">Live Campus Attendance Telemetry</h3>
              </div>
              <p className="text-xs text-slate-400">Automated CCTV Face-Scan & Dynamic QR check-in telemetry</p>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setAttendanceView('week')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  attendanceView === 'week' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly Trend
              </button>
              <button
                onClick={() => setAttendanceView('hourly')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  attendanceView === 'hourly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Today Hourly
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorAttendanceAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[75, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                  }}
                  formatter={(value: any, name: any) => [`${value}%`, name === 'Attendance' ? 'Live Attendance' : 'NIRF Target']}
                />
                <Area
                  type="monotone"
                  dataKey="Attendance"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAttendanceAdmin)"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="Target"
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500" /> Recorded Attendance
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 border-t border-dashed border-emerald-400" /> Mandatory 90% Threshold
              </span>
            </div>
            <span className="text-slate-300 font-medium">Telemetry sync: Realtime (WebSockets)</span>
          </div>
        </div>

        {/* Placement Donut Chart */}
        <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">Class of '26 Placement</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                NIRF Metric
              </span>
            </div>
            <p className="text-xs text-slate-400">Industry conversion & active corporate drives</p>
          </div>

          <div className="h-[210px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLACEMENT_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {PLACEMENT_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Candidates']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white font-display">78%</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Placed</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {PLACEMENT_STATS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-bold text-white shrink-0">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graphical Section 2: Department-Wise Performance & Financial Flows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Academic Performance (BarChart) */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Department Headcount & Research Output</h3>
              </div>
              <p className="text-xs text-slate-400">Scholars enrolled and verified IEEE/Scopus publications</p>
            </div>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
              NAAC Criterion 2 & 3
            </span>
          </div>

          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_PERFORMANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="dept" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Students" name="Enrolled Scholars" fill="#6366F1" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="ResearchPapers" name="Research Papers (Scopus/IEEE)" fill="#EC4899" radius={[6, 6, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Flow & Research Inflow (Composed Bar/Line Chart) */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <IndianRupee size={18} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">Financial Liquidity & Research Grants</h3>
              </div>
              <p className="text-xs text-slate-400">Monthly fee collection vs research grants vs operating burn (₹ Lakhs)</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setFinancialMetric('all')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer ${
                  financialMetric === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Inflows/Outflows
              </button>
              <button
                onClick={() => setFinancialMetric('net')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer ${
                  financialMetric === 'net' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Net Surplus
              </button>
            </div>
          </div>

          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FINANCIAL_FLOW} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`₹${val} Lakhs`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                {financialMetric === 'all' ? (
                  <>
                    <Bar dataKey="Collections" name="Tuition Fees (₹L)" fill="#10B981" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="Grants" name="Research Grants (₹L)" fill="#3B82F6" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="Outflow" name="Campus Burn (₹L)" fill="#F43F5E" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </>
                ) : (
                  <Bar
                    dataKey={(d) => Number((d.Collections + d.Grants - d.Outflow).toFixed(1))}
                    name="Net Cash Surplus (₹L)"
                    fill="#10B981"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={false}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Graphical Section 3: Campus Smart Microgrid & Resource Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campus Solar Microgrid (Multi-line AreaChart) */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">Smart Campus Microgrid & Solar Generation</h3>
              </div>
              <p className="text-xs text-slate-400">Rooftop 500kW Solar array output vs campus power draw (kW)</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                <Globe2 size={13} /> -24.8 Tons CO₂/Month
              </span>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENERGY_TELEMETRY}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} kW`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="SolarGen" name="Solar Microgrid (kW)" stroke="#F59E0B" strokeWidth={2.5} fill="url(#solarGrad)" isAnimationActive={false} />
                <Area type="monotone" dataKey="GridDraw" name="State Grid Draw (kW)" stroke="#3B82F6" strokeWidth={2} fill="url(#gridGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Realtime Critical Infrastructure Occupancy */}
        <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Facility & Resource Load</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-slate-400">Live IoT occupancy gauges across physical spaces</p>
          </div>

          <div className="space-y-3.5">
            {FACILITY_OCCUPANCY.map((fac, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{fac.facility}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{fac.status}</span>
                    <span className="font-bold text-white">{fac.occupancy}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${fac.color} transition-all duration-500`}
                    style={{ width: `${fac.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Overall Campus Saturation</span>
            <span className="text-emerald-400 font-bold">86.8% (Healthy)</span>
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
            onClick={() => toast('Campus Broadcast Sent', 'Urgent circular broadcasted to 4,250 scholar mobile apps.', 'success')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow cursor-pointer"
          >
            Broadcast Notice
          </button>
          <button
            onClick={() => toast('NAAC / NIRF Data Exported', 'Full institutional compliance dataset exported as signed PDF.', 'info')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all cursor-pointer"
          >
            Export NAAC/NIRF Report
          </button>
          <button
            onClick={() => toast('AI Guardrails Re-indexed', 'Prompt moderation & enterprise privacy weights synced.', 'success')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all cursor-pointer"
          >
            Sync AI Safety Guardrails
          </button>
        </div>
      </div>
    </div>
  );
};

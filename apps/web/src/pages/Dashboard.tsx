import React from 'react';
import { useRole } from '../context/RoleContext';
import { useDatabase } from '../context/DatabaseContext';
import { useRealtime } from '../context/RealtimeContext';
import {
  Users,
  GraduationCap,
  Percent,
  IndianRupee,
  BookOpen,
  Clock,
  Home,
  Bus,
  Sparkles,
  Zap,
  Smile,
  AlertTriangle,
  TrendingUp,
  Award,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const ATTENDANCE_TREND = [
  { name: 'Mon', Attendance: 94.5, Target: 90 },
  { name: 'Tue', Attendance: 92.1, Target: 90 },
  { name: 'Wed', Attendance: 95.8, Target: 90 },
  { name: 'Thu', Attendance: 91.2, Target: 90 },
  { name: 'Fri', Attendance: 94.2, Target: 90 },
];

const REVENUE_DATA = [
  { name: 'Jan', Fee: 4.5, Hostel: 1.2 },
  { name: 'Feb', Fee: 3.8, Hostel: 1.0 },
  { name: 'Mar', Fee: 5.2, Hostel: 1.5 },
  { name: 'Apr', Fee: 6.8, Hostel: 1.9 },
];

const PLACEMENT_STATS = [
  { name: 'Placed', value: 78, color: '#10B981' },
  { name: 'In Pipeline', value: 16, color: '#3B82F6' },
  { name: 'Preparing', value: 6, color: '#F59E0B' },
];

export const Dashboard: React.FC = () => {
  const { currentRole } = useRole();
  const { students, faculty, feeCollections } = useDatabase();
  const {
    activeClassesCount,
    todayAttendanceRate,
    studentMoodScore,
    aiAlerts,
    liveNotifications,
  } = useRealtime();

  const totalStudents = students.length || 1240;
  const totalFaculty = faculty.length || 85;
  const totalFeesPaid = feeCollections.reduce((acc, curr) => acc + curr.amountPaid, 0) || 18450000;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Live Operational Ticker Bar */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
            <Zap size={13} className="animate-bounce text-blue-400" />
            REALTIME ENGINE
          </span>
          <span className="text-slate-300">Role View: <strong className="text-white font-semibold">{currentRole} Portal</strong></span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Active Campus Classes: <strong className="text-emerald-400">{activeClassesCount} Rooms</strong></span>
          <span>&bull;</span>
          <span>Today Attendance: <strong className="text-blue-400">{todayAttendanceRate}%</strong></span>
        </div>
      </div>

      {/* Grid of 8 Live Animated Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: Today's Attendance */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Attendance</span>
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

        {/* Widget 2: Active Classes */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Classes</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <BookOpen size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{activeClassesCount} / 50</h3>
            <span className="text-[11px] text-slate-400 block mt-1">CCTV Face Verifier active</span>
          </div>
        </div>

        {/* Widget 3: Assignment Deadlines */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Deadlines</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">4 Due Today</h3>
            <span className="text-[11px] text-amber-400 font-medium block mt-1">AI Plagiarism Checker ready</span>
          </div>
        </div>

        {/* Widget 4: Fee Collection */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fee Collection</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <IndianRupee size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">₹{(totalFeesPaid / 100000).toFixed(1)} Lakhs</h3>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1">GST & Receipts auto-generated</span>
          </div>
        </div>

        {/* Widget 5: Hostel Occupancy */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hostel Occupancy</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Home size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">820 / 900 Rooms</h3>
            <span className="text-[11px] text-slate-400 block mt-1">91.1% capacity reached</span>
          </div>
        </div>

        {/* Widget 6: Placement Rate */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement Rate</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <GraduationCap size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">78.4% Placed</h3>
            <span className="text-[11px] text-cyan-400 font-medium block mt-1">Highest package: ₹44 LPA</span>
          </div>
        </div>

        {/* Widget 7: Student Mood Index */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Mood Index</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Smile size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{studentMoodScore} / 100</h3>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1">High satisfaction level</span>
          </div>
        </div>

        {/* Widget 8: AI Risk & Realtime Alerts */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden border-blue-500/40 bg-gradient-to-b from-slate-900 to-blue-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">AI Live Alerts</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Sparkles size={18} className="animate-spin" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 line-clamp-2">{aiAlerts[0]}</h3>
            <span className="text-[10px] text-blue-400 block mt-1 font-semibold">Updated 2m ago</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Neon Area Chart: Attendance Trend */}
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
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="Attendance" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Placement Distribution */}
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
                >
                  {PLACEMENT_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around text-xs">
            {PLACEMENT_STATS.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                <span className="text-slate-300 font-medium">{stat.name} ({stat.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  AlertTriangle,
  QrCode,
  Check,
  X,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export const FacultyDashboard: React.FC = () => {
  const { leaves, updateLeaveStatus } = useDatabase();
  const { toast } = useToast();

  const [approvedLeaves, setApprovedLeaves] = useState<string[]>([]);

  const classesToday = [
    { name: 'Database Management Systems (CS302)', section: 'CSE-3A', time: '09:00 AM - 10:00 AM', room: 'LHC-101', enrolled: 60, present: 56 },
    { name: 'Advanced Algorithms & Complexity (CS501)', section: 'MTech-1', time: '11:30 AM - 12:30 PM', room: 'Room 304', enrolled: 25, present: 24 },
    { name: 'DBMS Hands-on Query Lab', section: 'CSE-3A (Batch B1)', time: '02:00 PM - 04:00 PM', room: 'Computing Lab 2', enrolled: 30, present: 29 },
  ];

  const atRiskStudents = [
    { name: 'Kavita Menon', roll: '2024CS088', attendance: '64.2%', missedClasses: 5 },
    { name: 'Aditya Patil', roll: '2024CS042', attendance: '68.0%', missedClasses: 4 },
    { name: 'Tanmay Saxena', roll: '2024CS112', attendance: '71.5%', missedClasses: 3 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Faculty AI Briefing Banner */}
      <div className="glass-card p-6 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                Good morning, Dr. Arindam Sen
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>3 Lectures scheduled today. Average CSE-3A attendance is 94.2%.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Clock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>24 Lab reports pending your evaluation for DBMS Query Optimization.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Calendar size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Department Faculty Board meeting scheduled for 03:00 PM today.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <AlertTriangle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>3 Students flagged below 75% attendance in your CS302 course.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => toast('QR Attendance Generated', 'Dynamic rolling QR Code launched on classroom projector display.', 'success')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <QrCode size={16} />
              <span>Launch Classroom QR Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Faculty KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lectures Today</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">3 Sessions</h3>
            <span className="text-[11px] text-emerald-400 block mt-1 font-medium">1 Lecture Done &bull; 2 Upcoming</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Attendance</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">93.8% Avg</h3>
            <span className="text-[11px] text-emerald-400 block mt-1">+1.5% above department standard</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Grading</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">24 Papers</h3>
            <span className="text-[11px] text-amber-400 block mt-1">Midterm Quiz & Lab Reports</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Research Papers</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <GraduationCap size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">12 Published</h3>
            <span className="text-[11px] text-purple-300 block mt-1">IEEE & Springer Scopus Index</span>
          </div>
        </div>
      </div>

      {/* Teaching Schedule & At-Risk Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Today's Teaching Schedule</h3>
              <p className="text-xs text-slate-400">Classroom Occupancy & Active Headcount</p>
            </div>
          </div>

          <div className="space-y-3">
            {classesToday.map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-mono">{c.section}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>{c.room}</span>
                    <span>&bull;</span>
                    <span className="text-slate-300 font-mono">{c.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">{c.present} / {c.enrolled}</span>
                    <span className="block text-[10px] text-slate-400">Attended</span>
                  </div>
                  <button
                    onClick={() => toast('Lecture Started', `Session started for ${c.name}.`, 'info')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    Start Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students At Risk of Low Attendance */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Attendance Risk Radar</h3>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">Action Needed</span>
          </div>

          <div className="space-y-3">
            {atRiskStudents.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{s.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{s.roll} &bull; Missed {s.missedClasses} classes</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-400">{s.attendance}</span>
                  <button
                    onClick={() => toast('Parent Alert', `SMS & Email warning sent for ${s.name}.`, 'info')}
                    className="block text-[10px] text-blue-400 hover:underline mt-0.5 cursor-pointer"
                  >
                    Send Notice
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

import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  FileText,
  AlertCircle,
  Bus,
  Home,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { students, exams } = useDatabase();
  const { toast } = useToast();

  const currentStudent = students[0] || {
    name: 'Rishi Sharma',
    rollNo: '2024CS001',
    department: 'Computer Science',
    cgpa: 8.92,
    attendanceRate: 88.5,
  };

  const schedule = [
    { time: '09:00 AM - 10:00 AM', subject: 'Database Management Systems', code: 'CS302', room: 'LHC-101', prof: 'Dr. Arindam Sen', status: 'COMPLETED' },
    { time: '10:15 AM - 11:15 AM', subject: 'Operating Systems & Kernels', code: 'CS304', room: 'Room 302 (Block A)', prof: 'Prof. Rajesh Mehta', status: 'IN_PROGRESS' },
    { time: '11:30 AM - 01:00 PM', subject: 'Robotics & Embedded Systems Lab', code: 'EC401', room: 'Mech Lab 2', prof: 'Dr. Sarah Jenkins', status: 'UPCOMING' },
    { time: '02:00 PM - 03:00 PM', subject: 'Cloud Computing & DevOps', code: 'CS308', room: 'LHC-204', prof: 'Dr. Neha Verma', status: 'UPCOMING' },
  ];

  const assignments = [
    { title: 'Self-Balancing AVL Trees Implementation', course: 'Data Structures (CS201)', due: 'Today, 11:59 PM', priority: 'HIGH' },
    { title: 'Database Normalization (3NF & BCNF) Proofs', course: 'DBMS (CS302)', due: 'Tomorrow, 05:00 PM', priority: 'MEDIUM' },
    { title: 'ROS2 Node Publisher & Subscriber Nodes', course: 'Robotics (EC401)', due: 'In 3 Days', priority: 'LOW' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Personalized Student AI Briefing */}
      <div className="glass-card p-6 border-indigo-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                  Welcome back, {currentStudent.name}!
                </h2>
                <p className="text-xs text-indigo-300 font-mono">Roll: {currentStudent.rollNo} &bull; 6th Semester &bull; {currentStudent.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Attendance safe at {currentStudent.attendanceRate}%. 2 more classes required this week for 90% distinction.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Clock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>2 Assignments due today. AI Code Reviewer available in Academic Copilot.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Calendar size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Midterm Examinations commence in 5 days. Hall ticket issued.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Bus size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Campus Bus Route 12 running 5 mins behind schedule due to ring road signal.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => toast('Gatepass Ready', 'Active Digital Student ID: 2024CS001. QR valid for next 4 hours.', 'success')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <QrCode size={16} />
              <span>Digital Gatepass</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Student KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Attendance</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{currentStudent.attendanceRate}%</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp size={12} /> Eligible for Midterm Exams (&gt;75%)
            </span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current CGPA</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{currentStudent.cgpa} / 10.0</h3>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1">Top 5% in CSE Department</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignments Pending</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">2 Due Today</h3>
            <span className="text-[11px] text-amber-400 font-medium block mt-1">1 Under AI Review</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semester Fee Status</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-emerald-400">100% Paid</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Receipt #REC-2026-9042 Generated</span>
          </div>
        </div>
      </div>

      {/* Today's Classes & Assignment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Lectures Timeline */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Today's Class Schedule</h3>
              <p className="text-xs text-slate-400">Synchronized with Academic Timetable & Attendance Radar</p>
            </div>
            <Link to="/timetable" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold">
              Full Schedule <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  item.status === 'IN_PROGRESS'
                    ? 'bg-blue-950/40 border-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.subject}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-mono">{item.code}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{item.room}</span>
                    <span>&bull;</span>
                    <span>{item.prof}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-300">{item.time}</span>
                  {item.status === 'COMPLETED' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Attended</span>
                  )}
                  {item.status === 'IN_PROGRESS' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">Live Now</span>
                  )}
                  {item.status === 'UPCOMING' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Upcoming</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Submissions & Deadlines */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Tasks & Submissions</h3>
            <Link to="/assignments" className="text-xs text-blue-400 hover:text-blue-300">View LMS</Link>
          </div>

          <div className="space-y-3">
            {assignments.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    item.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.priority} Priority
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.due}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                <p className="text-[11px] text-slate-400">{item.course}</p>
                <button
                  onClick={() => toast('Submission Modal', `Submitting ${item.title}. File upload ready.`, 'info')}
                  className="w-full mt-2 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-semibold text-xs border border-blue-500/30 transition-all cursor-pointer"
                >
                  Upload Solution
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

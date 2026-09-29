import React, { useState, useEffect } from 'react';
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
  Play,
  Square,
  Video,
  ShieldCheck,
  Timer,
  Radio,
  Zap,
  FastForward,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface TeachingClass {
  id: string;
  name: string;
  code: string;
  section: string;
  time: string;
  room: string;
  enrolled: number;
  present: number;
  durationMinutes: number;
  completed?: boolean;
}

export const FacultyDashboard: React.FC = () => {
  const {
    students,
    leaves,
    updateLeaveStatus,
    activeClassSession,
    startClassSession,
    endClassSession,
    markStudentAttendance,
    attendanceRecords,
  } = useDatabase();
  const { toast } = useToast();

  const [classesList, setClassesList] = useState<TeachingClass[]>([
    {
      id: 'c1',
      name: 'Database Management Systems (CS302)',
      code: 'CS302',
      section: 'CSE-3A',
      time: '09:00 AM - 10:00 AM',
      room: 'LHC-101',
      enrolled: 60,
      present: 56,
      durationMinutes: 50,
      completed: false,
    },
    {
      id: 'c2',
      name: 'Advanced Algorithms & Complexity (CS501)',
      code: 'CS501',
      section: 'MTech-1',
      time: '11:30 AM - 12:30 PM',
      room: 'Room 304',
      enrolled: 25,
      present: 24,
      durationMinutes: 60,
      completed: false,
    },
    {
      id: 'c3',
      name: 'DBMS Hands-on Query Lab',
      code: 'CS302L',
      section: 'CSE-3A (Batch B1)',
      time: '02:00 PM - 04:00 PM',
      room: 'Computing Lab 2',
      enrolled: 30,
      present: 29,
      durationMinutes: 120,
      completed: false,
    },
  ]);

  // Active Attendance Window Modal State
  const [selectedClass, setSelectedClass] = useState<TeachingClass | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(50 * 60); // 50 mins default
  const [isSessionFinalized, setIsSessionFinalized] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'aiCamera'>('roster');

  const atRiskStudents = [
    { name: 'Kavita Menon', roll: '2024CS088', attendance: '64.2%', missedClasses: 5 },
    { name: 'Aditya Patil', roll: '2024CS042', attendance: '68.0%', missedClasses: 4 },
    { name: 'Tanmay Saxena', roll: '2024CS112', attendance: '71.5%', missedClasses: 3 },
  ];

  // Live Timer Countdown for Active Attendance Window
  useEffect(() => {
    let timer: any;
    if (isAttendanceModalOpen && selectedClass && !isSessionFinalized && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoCloseClass();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAttendanceModalOpen, selectedClass, isSessionFinalized, secondsRemaining]);

  // Start Class Action: Opens attendance window and broadcasts live session
  const handleStartClass = (cls: TeachingClass) => {
    setSelectedClass(cls);
    setSecondsRemaining(cls.durationMinutes * 60);
    setIsSessionFinalized(false);
    setIsAttendanceModalOpen(true);

    startClassSession({
      id: cls.id,
      name: cls.name,
      code: cls.code,
      section: cls.section,
      room: cls.room,
      faculty: 'Dr. Arindam Sen',
      durationMinutes: cls.durationMinutes,
    });

    toast(
      'Live Classroom Attendance Window Open',
      `Session active for ${cls.name}. Attendance window will auto-close when period concludes.`,
      'info'
    );
  };

  // Automatic or Manual End Class and Lock Attendance Window
  const handleAutoCloseClass = () => {
    if (!selectedClass) return;
    setIsSessionFinalized(true);

    // Update list to mark this class as completed
    setClassesList((prev) =>
      prev.map((c) =>
        c.id === selectedClass.id ? { ...c, completed: true, present: Math.min(c.enrolled, c.present + 1) } : c
      )
    );

    endClassSession();

    toast(
      'Class Concluded & Attendance Locked',
      `Session period for ${selectedClass.name} ended. Attendance window automatically locked and committed to ERP ledger.`,
      'success'
    );

    // Auto-close modal after brief finalization confirmation
    setTimeout(() => {
      setIsAttendanceModalOpen(false);
    }, 1800);
  };

  // Fast-Forward to trigger instant auto-close (useful for demonstrating to the Principal)
  const handleFastForwardAutoClose = () => {
    setSecondsRemaining(3);
    toast(
      'Fast-Forwarding Session',
      'Class time expiring in 3 seconds... Demonstrating automatic attendance window closure.',
      'warning'
    );
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  // Helper to get real-time attendance status of enrolled students
  const getStudentStatus = (studentId: string, rollNo?: string) => {
    const today = '2026-09-25';
    const rec =
      attendanceRecords[`${today}_${studentId}`] ||
      (rollNo ? attendanceRecords[`${today}_${rollNo}`] : undefined) ||
      (studentId === 'STU001' ? attendanceRecords[`${today}_std_2026_001`] : undefined);
    return rec ? rec.status : 'Present';
  };

  const handleToggleAttendance = (studentId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    markStudentAttendance(studentId, '2026-09-25', nextStatus, {
      course: selectedClass?.code || 'B.Tech CSE',
      markedBy: 'Dr. Arindam Sen (Faculty)',
    });
    toast(
      `Marked ${nextStatus}`,
      `Student status updated to ${nextStatus}. Real-time percentage recalculated.`,
      nextStatus === 'Absent' ? 'warning' : 'success'
    );
  };

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
                <span>3 Lectures scheduled today. Click <strong>Start Class</strong> to initiate live automated attendance.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Clock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Automated statutory lock enabled: Attendance window auto-closes when class concludes.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {activeClassSession && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
                <Radio size={14} />
                <span>Live Class: {activeClassSession.code} in {activeClassSession.room}</span>
              </div>
            )}
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
            {classesList.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  c.completed
                    ? 'bg-slate-950/60 border-emerald-500/30'
                    : activeClassSession?.id === c.id
                    ? 'bg-blue-950/30 border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-mono">
                      {c.section}
                    </span>
                    {c.completed && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                        Finalized & Locked ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>{c.room}</span>
                    <span>&bull;</span>
                    <span className="text-slate-300 font-mono">{c.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">
                      {c.present} / {c.enrolled}
                    </span>
                    <span className="block text-[10px] text-slate-400">Attended</span>
                  </div>

                  {c.completed ? (
                    <button
                      onClick={() => handleStartClass(c)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 cursor-pointer"
                    >
                      View Summary
                    </button>
                  ) : activeClassSession?.id === c.id ? (
                    <button
                      onClick={() => setIsAttendanceModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer animate-pulse"
                    >
                      <Radio size={13} />
                      <span>Live Window</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartClass(c)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1"
                    >
                      <Play size={13} />
                      <span>Start Class</span>
                    </button>
                  )}
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

      {/* LIVE CLASSROOM ATTENDANCE WINDOW MODAL */}
      <Modal
        isOpen={isAttendanceModalOpen}
        onClose={() => {
          if (!isSessionFinalized) {
            toast('Window Minimized', 'Attendance window continues running in background until class concludes.', 'info');
          }
          setIsAttendanceModalOpen(false);
        }}
        title={`Live Attendance Window — ${selectedClass?.name || 'Class Session'}`}
        size="xl"
      >
        <div className="p-6 space-y-5 text-slate-200">
          {/* Header Bar with Live Badge & Auto-Close Countdown */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold animate-pulse">
                  <Radio size={12} /> LIVE CLASS IN SESSION
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedClass?.room} &bull; Section {selectedClass?.section}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{selectedClass?.name}</h3>
              <p className="text-xs text-slate-400">
                Scheduled: {selectedClass?.time} &bull; Faculty: Dr. Arindam Sen
              </p>
            </div>

            {/* Countdown Auto-Close Timer */}
            <div className="flex flex-col sm:items-end gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Timer size={12} className="text-amber-400" /> Attendance Window Closes In:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-amber-400 font-mono tracking-tight">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-[10px] text-slate-400">until auto-lock</span>
              </div>
            </div>
          </div>

          {/* Compliance Notice Banner */}
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-white">Automated Statutory Lockout:</strong> Per UGC & AICTE Academic Mandates (§14), attendance recording is strictly confined to the lecture period. This window will <strong>automatically seal and lock</strong> when the period ends.
            </div>
          </div>

          {/* View Modes Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('roster')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === 'roster'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Classroom Roster Checklist ({students.length} Enrolled)
              </button>
              <button
                onClick={() => setActiveTab('aiCamera')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  activeTab === 'aiCamera'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video size={13} />
                <span>AI Face Scanner & Gate Feed</span>
              </button>
            </div>

            <div className="text-xs font-mono text-emerald-400 font-bold">
              Active Headcount: {students.length} Students Monitored
            </div>
          </div>

          {/* Tab 1: Live Roster Checklist */}
          {activeTab === 'roster' ? (
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-950/40">
              {students.map((s) => {
                const status = getStudentStatus(s.id, s.rollNo);
                const isPresent = status === 'Present';
                return (
                  <div key={s.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-900/60 transition-all">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name.replace(/^\./, '')} />
                      <div>
                        <span className="font-semibold text-xs text-white block">
                          {s.name.replace(/^\./, '')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {s.rollNo} &bull; Overall: {s.attendanceRate}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={isPresent ? 'success' : 'danger'} className="text-[10px]">
                        {isPresent ? 'Present (In Class)' : 'Marked Absent'}
                      </Badge>
                      <button
                        onClick={() => handleToggleAttendance(s.id, status)}
                        className={`text-[10px] px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer ${
                          isPresent
                            ? 'bg-rose-600/20 text-rose-300 border-rose-500/30 hover:bg-rose-600/40'
                            : 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/50'
                        }`}
                      >
                        {isPresent ? 'Mark Absent' : 'Mark Present'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Tab 2: Simulated AI Face Scanner & IoT Turnstile Live Feed */
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Video size={14} /> AI Facial Stream (LHC-101 Overhead Cam 04)
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Active 30 FPS</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 rounded bg-slate-900/80 text-emerald-300 flex items-center justify-between">
                  <span>[09:02:14 AM] ✓ AI Face Match: Rishi Sharma (2024CS001) - 99.4% confidence</span>
                  <span className="text-[10px] text-slate-500">Seat Row 3</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 text-emerald-300 flex items-center justify-between">
                  <span>[09:03:02 AM] ✓ RFID Turnstile: Diya Sharma (2024EC042) - Gate 1 Check-in</span>
                  <span className="text-[10px] text-slate-500">Seat Row 2</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 text-emerald-300 flex items-center justify-between">
                  <span>[09:04:18 AM] ✓ AI Face Match: Rohan Sen (2024CS019) - 98.8% confidence</span>
                  <span className="text-[10px] text-slate-500">Seat Row 4</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 text-slate-400 flex items-center justify-between">
                  <span>[09:06:55 AM] ℹ Continuous facial vector tracking enabled for active lecture headcount...</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Bar: Fast-Forward Demo & End Class Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            {/* Principal Demo Shortcut Button */}
            <button
              onClick={handleFastForwardAutoClose}
              className="text-xs px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Fast-forward timer to 3 seconds to demonstrate automatic closure to the Principal"
            >
              <FastForward size={14} />
              <span>Demo: Fast-Forward to End of Class (Auto-Close)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Keep Running in Background
              </button>
              <button
                onClick={handleAutoCloseClass}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
              >
                <Square size={13} />
                <span>End Class Now & Lock Attendance</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

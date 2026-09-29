import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  FileText,
  Printer,
  Upload,
  Send,
  AlertCircle,
  FileCheck2,
  Lock,
  Layers,
  Award,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useOfflineAttendanceSync } from '../../lib/offlineAttendanceSync';
import { useDatabase } from '../../context/DatabaseContext';
import { Modal } from '../ui/Modal';

export interface ClassSession {
  id: string;
  code: string;
  name: string;
  time: string;
  room: string;
  faculty: string;
  status: 'Present' | 'Absent' | 'Late';
  verificationMethod: string;
  verifiedAt: string;
  auditHash: string;
}

export interface DayAttendance {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  dayOfWeek: number; // 0 Sun - 6 Sat
  isWeekend: boolean;
  status?: 'Present' | 'Absent' | 'Late' | 'Holiday' | 'Weekend';
  classes: ClassSession[];
}

export interface ODAppealRecord {
  id: string;
  dateStr: string;
  category: string;
  reason: string;
  documentName: string;
  approvingAuthority: string;
  status: 'Pending Review' | 'HOD Approved' | 'Rejected';
  submittedAt: string;
  step: number; // 1: Submitted, 2: Advisor Endorsed, 3: HOD Sanctioned
}

interface StudentAttendanceCalendarProps {
  studentId?: string;
  studentName?: string;
  rollNo?: string;
  initialAttendanceRate?: number;
}

export const StudentAttendanceCalendar: React.FC<StudentAttendanceCalendarProps> = ({
  studentId = 'STU001',
  studentName = 'Rishi Sharma',
  rollNo = '2024CS001',
  initialAttendanceRate = 86.4,
}) => {
  const { toast } = useToast();
  const { students, addNotification, attendanceRecords } = useDatabase();
  const { isOnline, isSyncing, pendingCount, triggerSync } = useOfflineAttendanceSync();

  const activeStudent = students.find(s => s.id === studentId || s.rollNo === rollNo) || students[0] || {
    id: studentId,
    name: studentName,
    rollNo: rollNo,
    department: 'Computer Science & Engineering',
    course: 'B.Tech CSE',
    attendanceRate: initialAttendanceRate,
  };

  // Helper to get effective live status for any date from the global database context
  const getLiveDayRecord = (dateStr: string) => {
    return (
      attendanceRecords[`${dateStr}_${activeStudent.id}`] ||
      attendanceRecords[`${dateStr}_${activeStudent.rollNo}`] ||
      attendanceRecords[`${dateStr}_STU001`] ||
      attendanceRecords[`${dateStr}_std_2026_001`]
    );
  };

  // Current calendar view state: default to September 2026 (current semester)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 is September (0-indexed)

  // Modals state
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);

  // New appeal form state
  const [appealCategory, setAppealCategory] = useState('Official On-Duty (OD) - Hackathon / Conference');
  const [appealScope, setAppealScope] = useState('All Sessions on this Date');
  const [appealAuthority, setAppealAuthority] = useState('Dr. Arindam Sen (Head of Department, CSE)');
  const [appealDocName, setAppealDocName] = useState('SIH2026_Duty_Leave_Sanction.pdf');
  const [appealRemarks, setAppealRemarks] = useState('Represented the University team at the Smart India Hackathon Grand Finale.');

  // Pre-seeded appeals map (Day 4 seeded with an active SIH appeal to demonstrate institutional workflow to Principal)
  const [appealsMap, setAppealsMap] = useState<Record<string, ODAppealRecord>>({
    '2026-09-04': {
      id: 'OD-2026-882',
      dateStr: '2026-09-04',
      category: 'Official University On-Duty (OD) - Smart India Hackathon',
      reason: 'Official university representation at Smart India Hackathon 2026 Grand Finale at AICTE Nodal Center.',
      documentName: 'SIH2026_Sanction_Order.pdf',
      approvingAuthority: 'Dr. Arindam Sen (HOD, Computer Science)',
      status: 'Pending Review',
      submittedAt: 'Sep 05, 2026 • 10:30 AM',
      step: 2,
    },
  });

  // Seeded calendar attendance records for the student
  const [recordsMap] = useState<Record<string, { status: 'Present' | 'Absent' | 'Late'; classes: ClassSession[] }>>(() => {
    const map: Record<string, { status: 'Present' | 'Absent' | 'Late'; classes: ClassSession[] }> = {};
    const defaultClassesData = [
      { code: 'CS302', name: 'Database Management Systems', time: '09:00 AM - 10:00 AM', room: 'LHC-101', faculty: 'Dr. Arindam Sen' },
      { code: 'CS304', name: 'Operating Systems & Kernels', time: '10:15 AM - 11:15 AM', room: 'Block A-302', faculty: 'Prof. Rajesh Mehta' },
      { code: 'EC401', name: 'Robotics & Embedded Systems', time: '11:30 AM - 01:00 PM', room: 'Mech Lab 2', faculty: 'Dr. Sarah Jenkins' },
      { code: 'CS308', name: 'Cloud Computing & DevOps', time: '02:00 PM - 03:00 PM', room: 'LHC-204', faculty: 'Dr. Neha Verma' },
    ];

    // Seed days for September 2026 (days 1 to 30)
    for (let day = 1; day <= 30; day++) {
      const d = new Date(2026, 8, day);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends

      const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
      const isAbsentDay = day === 4 || day === 11;
      const isLateDay = day === 8 || day === 15;
      const dayStatus = isAbsentDay ? 'Absent' : isLateDay ? 'Late' : 'Present';

      map[dateStr] = {
        status: dayStatus,
        classes: defaultClassesData.map((cls, idx) => {
          let sessionStatus: 'Present' | 'Absent' | 'Late' = 'Present';
          let method = 'Biometric RFID Turnstile Gate A';
          let timeCaptured = cls.time.split(' - ')[0];
          let hash = `SHA256-${(day * 137 + idx * 83).toString(16).slice(0, 6)}`;

          if (isAbsentDay) {
            sessionStatus = 'Absent';
            method = 'No RFID / Turnstile Log Captured';
            timeCaptured = '--';
            hash = 'UNRECORDED';
          } else if (isLateDay && idx === 0) {
            sessionStatus = 'Late';
            method = 'Turnstile Gate 2 (Tardy Entry Logged)';
            timeCaptured = '09:18 AM';
          } else if (idx === 1) {
            method = 'AI Facial Recognition Cam-04 (99.4% Match)';
          } else if (idx === 3) {
            method = 'Faculty Biometric Sign-off (Dr. Neha Verma)';
          }

          return {
            ...cls,
            id: `${dateStr}_${cls.code}_${idx}`,
            status: sessionStatus,
            verificationMethod: method,
            verifiedAt: timeCaptured,
            auditHash: hash,
          };
        }),
      };
    }
    return map;
  });

  // Selected date for day inspection
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-25');

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const jumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8);
    setSelectedDate('2026-09-25');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Generate days in month with real-time faculty attendance synchronization
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 Sun, 1 Mon ...

    const days: (DayAttendance | null)[] = [];

    // Prefix empty slots
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const d = new Date(currentYear, currentMonth, day);
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const baseRecord = recordsMap[dateStr];
      const liveRecord = getLiveDayRecord(dateStr);

      let status: DayAttendance['status'] = isWeekend ? 'Weekend' : undefined;
      let classes: ClassSession[] = [];

      if (isWeekend) {
        status = 'Weekend';
      } else if (liveRecord) {
        status = liveRecord.status;
      } else if (baseRecord) {
        status = baseRecord.status;
      }

      if (baseRecord) {
        if (liveRecord && liveRecord.status === 'Absent') {
          classes = baseRecord.classes.map(cls => ({
            ...cls,
            status: 'Absent',
            verificationMethod: `Marked Absent by Faculty: ${liveRecord.markedBy}`,
            verifiedAt: liveRecord.timestamp || '--',
          }));
        } else if (liveRecord && liveRecord.status === 'Present') {
          classes = baseRecord.classes.map(cls => ({
            ...cls,
            status: 'Present',
            verificationMethod: `Verified Present by Faculty: ${liveRecord.markedBy}`,
            verifiedAt: liveRecord.timestamp || '08:58 AM',
          }));
        } else if (liveRecord && liveRecord.status === 'Late') {
          classes = baseRecord.classes.map((cls, idx) => ({
            ...cls,
            status: idx === 0 ? 'Late' : 'Present',
            verificationMethod: idx === 0 ? `Tardy Entry: ${liveRecord.markedBy}` : cls.verificationMethod,
            verifiedAt: idx === 0 ? liveRecord.timestamp || '09:18 AM' : cls.verifiedAt,
          }));
        } else {
          classes = baseRecord.classes;
        }
      }

      days.push({
        dateStr,
        dayNumber: day,
        dayOfWeek,
        isWeekend,
        status,
        classes,
      });
    }

    return days;
  }, [currentYear, currentMonth, recordsMap, attendanceRecords, activeStudent.id, activeStudent.rollNo]);

  // Aggregate monthly statistics
  const stats = useMemo(() => {
    let workingDays = 0;
    let presentDays = 0;
    let absentDays = 0;
    let lateDays = 0;

    calendarDays.forEach(day => {
      if (!day || day.isWeekend) return;
      workingDays++;
      if (day.status === 'Present') presentDays++;
      else if (day.status === 'Absent') absentDays++;
      else if (day.status === 'Late') {
        lateDays++;
        presentDays += 0.5;
      }
    });

    const calculatedRate = workingDays > 0 ? ((presentDays / workingDays) * 100).toFixed(1) : initialAttendanceRate.toString();
    const cushionDays = Math.max(0, Math.floor((presentDays - 0.75 * workingDays) / 0.75));

    return {
      workingDays,
      presentDays: Math.floor(presentDays),
      absentDays,
      lateDays,
      rate: parseFloat(calculatedRate),
      cushionDays,
    };
  }, [calendarDays, initialAttendanceRate]);

  // Selected day details
  const selectedDayData = useMemo(() => {
    const matchingDay = calendarDays.find(d => d && d.dateStr === selectedDate);
    const parts = selectedDate.split('-');
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const liveRecord = getLiveDayRecord(selectedDate);

    return {
      dateStr: selectedDate,
      formattedDate: dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      isWeekend,
      status: isWeekend ? 'Weekend' : matchingDay?.status || (liveRecord ? liveRecord.status : 'Not Marked'),
      classes: matchingDay?.classes || [],
      markedBy: liveRecord?.markedBy,
      timestamp: liveRecord?.timestamp,
    };
  }, [selectedDate, calendarDays, attendanceRecords, activeStudent.id, activeStudent.rollNo]);

  // Handle OD / Grievance Submission
  const handleSubmitAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    const appealId = `OD-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newAppeal: ODAppealRecord = {
      id: appealId,
      dateStr: selectedDate,
      category: appealCategory,
      reason: appealRemarks,
      documentName: appealDocName || 'Supporting_Document.pdf',
      approvingAuthority: appealAuthority,
      status: 'Pending Review',
      submittedAt: 'Today • Just now',
      step: 1,
    };

    setAppealsMap(prev => ({
      ...prev,
      [selectedDate]: newAppeal,
    }));

    addNotification({
      title: `OD Sanction Filed (${appealId})`,
      message: `Formal On-Duty appeal submitted for ${selectedDate}. Routed to ${appealAuthority}.`,
      category: 'academic',
    });

    toast(
      'Grievance / OD Appeal Submitted',
      `Application #${appealId} successfully filed. Routed to ${appealAuthority} for verification.`,
      'success'
    );

    setIsAppealModalOpen(false);
  };

  const activeAppealForSelectedDate = appealsMap[selectedDate];

  return (
    <div className="space-y-6">
      {/* Top Banner: Student Info, Statutory Status & Institutional Sync */}
      <div className="glass-card p-5 border-blue-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <CalendarIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white font-display">Student Attendance Calendar</h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <ShieldCheck size={11} /> Tamper-Proof Official Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                <span className="font-semibold text-white">{activeStudent.name.replace(/^\./, '')}</span> &bull; Roll: <span className="font-mono text-slate-200">{activeStudent.rollNo}</span> &bull; {activeStudent.course} &bull; {activeStudent.department}
              </p>
            </div>
          </div>

          {/* Action Tools: Download Official Slip & Network Resilience */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsTranscriptModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              title="Generate Official Attendance Slip for Exam Hall Pass / Principal verification"
            >
              <Printer size={13} />
              <span>Official Attendance Slip</span>
            </button>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-400 animate-pulse'
            }`}>
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span>{isOnline ? 'ERP Gateway Synced' : 'Low Internet / Offline Resilient'}</span>
            </div>

            {pendingCount > 0 && (
              <button
                onClick={() => triggerSync()}
                disabled={isSyncing}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-semibold cursor-pointer transition-all"
                title="Click to flush offline queue"
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                <span>{pendingCount} Pending Sync</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Professional Institutional Attendance Statistics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Attendance Rate */}
        <div className="glass-card p-4 space-y-1 relative overflow-hidden border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Percentage</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-white">{stats.rate}%</h3>
            <span className={`text-[11px] font-bold flex items-center gap-0.5 ${stats.rate >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <TrendingUp size={12} /> {stats.rate >= 75 ? 'Statutory Eligible' : 'Shortage Alert'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Min 75% UGC/AICTE threshold required for exams</p>
        </div>

        {/* Card 2: Present Days */}
        <div className="glass-card p-4 space-y-1 relative overflow-hidden border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sessions Attended</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-emerald-400">{stats.presentDays}</h3>
            <span className="text-xs text-slate-400 font-mono">/ {stats.workingDays} working days</span>
          </div>
          <p className="text-[11px] text-emerald-400/80">Biometric & RFID verified check-ins</p>
        </div>

        {/* Card 3: Absent Days */}
        <div className="glass-card p-4 space-y-1 relative overflow-hidden border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absences Recorded</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-rose-400">{stats.absentDays}</h3>
            <span className="text-xs text-slate-400">days missed</span>
          </div>
          <p className="text-[11px] text-slate-400">Requires formal OD / Medical sanction</p>
        </div>

        {/* Card 4: Statutory Cushion (Replaces 'Safe Bunk Buffer') */}
        <div className="glass-card p-4 space-y-1 relative overflow-hidden border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck size={12} className="text-indigo-400" /> Academic Cushion
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-indigo-400">
              {stats.cushionDays} Days
            </h3>
            <span className="text-[11px] text-indigo-300 font-semibold">Margin</span>
          </div>
          <p className="text-[11px] text-slate-400">Permissible emergency buffer before dropping below 75%</p>
        </div>
      </div>

      {/* Main Calendar Grid and Day Details Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 glass-card p-6 space-y-5">
          {/* Calendar Header with Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-white font-display">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={jumpToToday}
                className="px-2.5 py-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-all cursor-pointer"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-2 self-start">
              {/* Legend pills */}
              <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400 mr-2">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 inline-block" /> Present
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 inline-block" /> Absent
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Late
                </span>
              </div>

              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-bold text-slate-400 pb-1">
            <div className="text-rose-400/80">Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div className="text-rose-400/80">Sat</div>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={`empty_${idx}`} className="h-20 sm:h-24 rounded-xl bg-slate-950/20 border border-transparent" />;
              }

              const isSelected = selectedDate === day.dateStr;
              const isToday = day.dateStr === '2026-09-25';
              const hasActiveAppeal = Boolean(appealsMap[day.dateStr]);

              let statusColor = 'border-slate-800/60 bg-slate-900/40 text-slate-400';
              let badgeColor = 'bg-slate-800 text-slate-400';

              if (day.status === 'Present') {
                statusColor = 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:border-emerald-500/60';
                badgeColor = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
              } else if (day.status === 'Absent') {
                statusColor = 'border-rose-500/40 bg-rose-950/20 text-rose-300 hover:border-rose-500/70';
                badgeColor = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
              } else if (day.status === 'Late') {
                statusColor = 'border-amber-500/30 bg-amber-950/20 text-amber-300 hover:border-amber-500/60';
                badgeColor = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
              } else if (day.isWeekend) {
                statusColor = 'border-slate-900 bg-slate-950/40 text-slate-600 opacity-60';
              }

              return (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${statusColor} ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20 border-blue-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold ${isToday ? 'px-1.5 py-0.5 rounded-md bg-blue-600 text-white' : ''}`}>
                      {day.dayNumber}
                    </span>
                    {day.status === 'Present' && <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />}
                    {day.status === 'Absent' && <XCircle size={13} className="text-rose-400 shrink-0" />}
                    {day.status === 'Late' && <Clock size={13} className="text-amber-400 shrink-0" />}
                  </div>

                  {/* Status Indicator Pill & OD Appeal Badge */}
                  <div className="w-full space-y-1">
                    {hasActiveAppeal && (
                      <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40 block text-center truncate">
                        OD Appeal
                      </span>
                    )}
                    {day.status ? (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded block text-center truncate ${badgeColor}`}>
                        {day.status}
                      </span>
                    ) : day.isWeekend ? (
                      <span className="text-[9px] text-slate-600 block text-center">Off</span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel (4 cols) */}
        <div className="lg:col-span-4 glass-card p-6 space-y-5">
          {/* Day Inspection Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Day Inspection</span>
              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                <Lock size={10} className="text-emerald-400" /> Read-Only Record
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">{selectedDayData.formattedDate}</h4>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                selectedDayData.status === 'Present'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : selectedDayData.status === 'Absent'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : selectedDayData.status === 'Late'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                Overall: {selectedDayData.status}
              </span>

              {activeAppealForSelectedDate && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeAppealForSelectedDate.id} Active
                </span>
              )}
            </div>
          </div>

          {/* Classes for the Selected Day with Official Telemetry */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Lectures & Labs</span>
              <span className="text-[11px] font-normal text-slate-400">{selectedDayData.classes.length} Sessions</span>
            </h5>

            {selectedDayData.classes.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/80">
                No classes scheduled for this day (Weekend or Institutional Holiday).
              </div>
            ) : (
              selectedDayData.classes.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-2.5 hover:border-slate-700/80 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">{c.name}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">{c.faculty}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/90 text-blue-300 rounded-md border border-slate-700 shrink-0">
                      {c.code}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{c.time}</span>
                    <span className="text-slate-300">{c.room}</span>
                  </div>

                  {/* Tamper-Proof Official Telemetry Row (No Student Edit Buttons) */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                    <span className={`font-semibold flex items-center gap-1.5 ${
                      c.status === 'Present' ? 'text-emerald-400' : c.status === 'Absent' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {c.status === 'Present' && <CheckCircle2 size={12} />}
                      {c.status === 'Absent' && <XCircle size={12} />}
                      {c.status === 'Late' && <Clock size={12} />}
                      {c.status}
                    </span>

                    <span className="text-slate-400 truncate max-w-[200px]" title={c.verificationMethod}>
                      {c.status === 'Present' ? `✓ ${c.verificationMethod}` : c.status === 'Late' ? `⚠ ${c.verificationMethod}` : `✗ ${c.verificationMethod}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Institutional Compliance & On-Duty (OD) Appeal Action Section */}
          {selectedDayData.classes.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-3">
              {/* Scenario 1: Day has an active appeal already submitted */}
              {activeAppealForSelectedDate ? (
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                      <FileCheck2 size={14} /> On-Duty (OD) Sanction Filed
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {activeAppealForSelectedDate.id}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    <strong className="text-white">Category:</strong> {activeAppealForSelectedDate.category}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    <strong className="text-slate-300">Approving Authority:</strong> {activeAppealForSelectedDate.approvingAuthority}
                  </p>

                  {/* SOP Workflow Stepper */}
                  <div className="pt-1.5 mt-2 border-t border-amber-500/20">
                    <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                      Institutional Approval Workflow:
                    </span>
                    <div className="grid grid-cols-3 gap-1 text-[9px] text-center font-semibold">
                      <div className="py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        1. Submitted ✓
                      </div>
                      <div className="py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse">
                        2. Faculty Review ⏳
                      </div>
                      <div className="py-1 rounded bg-slate-900 text-slate-500 border border-slate-800">
                        3. HOD Sanction
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedDayData.status === 'Absent' || selectedDayData.status === 'Late' ? (
                /* Scenario 2: Student is Absent or Late -> Can submit formal OD Appeal */
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-amber-400" /> Discrepancy & OD Redressal
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                      Statutory Procedure
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Attendance records are tamper-proof and locked per University Statute §14.B. If you were on sanctioned university representation (Hackathon, Sports, Symposium) or hospitalized, submit an official OD/Medical Appeal.
                  </p>

                  <button
                    onClick={() => setIsAppealModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>Apply for On-Duty (OD) / Medical Sanction</span>
                  </button>
                </div>
              ) : (
                /* Scenario 3: All Present -> Compliant Record Confirmation */
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Academic Compliance Verified
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    All classroom sessions for this date are authenticated via Campus Gateway IoT turnstiles and AI facial recognition cameras. Record is cryptographically locked.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Formal On-Duty (OD) / Medical Sanction Appeal Modal */}
      <Modal
        isOpen={isAppealModalOpen}
        onClose={() => setIsAppealModalOpen(false)}
        title="Formal On-Duty (OD) / Medical Sanction Form"
        size="lg"
      >
        <form onSubmit={handleSubmitAppeal} className="p-5 space-y-4">
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-300 flex items-start gap-2.5">
            <ShieldCheck size={18} className="shrink-0 text-blue-400 mt-0.5" />
            <div>
              <strong className="font-semibold text-white">University Academic Grievance Cell:</strong>
              <p className="text-[11px] text-blue-300/80 mt-0.5">
                Students cannot self-mark attendance. Applications are routed through the Department HOD and Academic Registrar for verification.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Student Roll & Name</label>
              <input
                type="text"
                disabled
                value={`${activeStudent.rollNo} - ${activeStudent.name.replace(/^\./, '')}`}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Date of Absence</label>
              <input
                type="text"
                disabled
                value={selectedDayData.formattedDate}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Appeal Category *</label>
              <select
                value={appealCategory}
                onChange={e => setAppealCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Official On-Duty (OD) - Hackathon / Conference">Official OD - Hackathon / Technical Symposium</option>
                <option value="Medical Leave - Hospitalization / Sick Bay Certificate">Medical Leave - Hospitalization / Sick Bay</option>
                <option value="Sports & Cultural Representation (Inter-College)">Sports & Cultural Council Representation</option>
                <option value="Hardware / Biometric Turnstile Sensor Anomaly">Biometric Turnstile Hardware Lag / Desync</option>
                <option value="Career & Placement Cell Off-Campus Drive">Placement Cell Off-Campus Drive Duty</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Affected Session(s)</label>
              <select
                value={appealScope}
                onChange={e => setAppealScope(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All Sessions on this Date">All Sessions on this Date</option>
                <option value="CS302 - Database Management Systems">CS302 - Database Management Systems (09:00 AM)</option>
                <option value="CS304 - Operating Systems & Kernels">CS304 - Operating Systems & Kernels (10:15 AM)</option>
                <option value="EC401 - Robotics & Embedded Systems">EC401 - Robotics & Embedded Systems (11:30 AM)</option>
                <option value="CS308 - Cloud Computing & DevOps">CS308 - Cloud Computing & DevOps (02:00 PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Reviewing Faculty / Approving Authority *</label>
            <select
              value={appealAuthority}
              onChange={e => setAppealAuthority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Dr. Arindam Sen (Head of Department, CSE)">Dr. Arindam Sen (Head of Department, Computer Science)</option>
              <option value="Prof. Rajesh Mehta (Dean Academics)">Prof. Rajesh Mehta (Dean of Academic Affairs)</option>
              <option value="Dr. Sarah Jenkins (Faculty In-Charge, Robotics)">Dr. Sarah Jenkins (Faculty In-Charge, Robotics)</option>
              <option value="Dr. Neha Verma (Faculty Advisor)">Dr. Neha Verma (Faculty Advisor)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Supporting Document / Sanction Order (PDF / Image)</label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-dashed border-slate-700">
              <Upload size={16} className="text-blue-400 ml-1" />
              <input
                type="text"
                value={appealDocName}
                onChange={e => setAppealDocName(e.target.value)}
                placeholder="Upload or type document reference filename..."
                className="w-full bg-transparent text-xs text-slate-200 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono shrink-0">Attached</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Student Explanation / Justification *</label>
            <textarea
              rows={3}
              required
              value={appealRemarks}
              onChange={e => setAppealRemarks(e.target.value)}
              placeholder="State the detailed reason for absence and institutional endorsement..."
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAppealModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Send size={13} />
              <span>Submit to HOD & Academic Cell</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Official Attendance Transcript & Print Report (PDF) */}
      <Modal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        title="Official Semester Attendance Transcript"
        size="xl"
      >
        <div className="p-6 space-y-6 text-slate-200">
          {/* Institution Official Header */}
          <div className="text-center border-b border-slate-700 pb-4 space-y-1">
            <div className="inline-flex items-center gap-2 text-indigo-400 font-extrabold tracking-widest text-sm uppercase">
              <Award size={18} /> Genova Institute of Science & Advanced Computing
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              Official Semester Attendance Transcript & Statutory Eligibility Slip
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Accredited Grade 'A++' by NAAC &bull; Approved by AICTE & UGC &bull; Academic Year 2026-27
            </p>
          </div>

          {/* Student Profile Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">Student Name:</span>
              <strong className="text-white text-sm">{activeStudent.name.replace(/^\./, '')}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">University Roll No:</span>
              <strong className="text-blue-400 font-mono">{activeStudent.rollNo}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Program & Branch:</span>
              <span className="text-slate-200">{activeStudent.course} ({activeStudent.department})</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Current Term:</span>
              <span className="text-slate-200">Semester VII &bull; Section A</span>
            </div>
          </div>

          {/* Semester Summary Statistics */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Working Days</span>
              <strong className="text-lg text-white font-mono">{stats.workingDays}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Lectures</span>
              <strong className="text-lg text-white font-mono">{stats.workingDays * 4}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Attended Sessions</span>
              <strong className="text-lg text-emerald-400 font-mono">{Math.round(stats.presentDays * 4)}</strong>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-300 block">Overall Percentage</span>
              <strong className="text-lg text-emerald-400 font-mono">{stats.rate}%</strong>
            </div>
          </div>

          {/* Course-Wise Breakdown Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Faculty In-Charge</th>
                  <th className="p-3 text-center">Attended / Total</th>
                  <th className="p-3 text-center">Percentage</th>
                  <th className="p-3 text-right">Statutory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-400">CS302</td>
                  <td className="p-3 font-semibold text-white">Database Management Systems</td>
                  <td className="p-3 text-slate-400">Dr. Arindam Sen</td>
                  <td className="p-3 text-center font-mono">20 / 22</td>
                  <td className="p-3 text-center font-bold text-emerald-400 font-mono">90.9%</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Eligible</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-400">CS304</td>
                  <td className="p-3 font-semibold text-white">Operating Systems & Kernels</td>
                  <td className="p-3 text-slate-400">Prof. Rajesh Mehta</td>
                  <td className="p-3 text-center font-mono">19 / 22</td>
                  <td className="p-3 text-center font-bold text-emerald-400 font-mono">86.4%</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Eligible</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-400">EC401</td>
                  <td className="p-3 font-semibold text-white">Robotics & Embedded Systems</td>
                  <td className="p-3 text-slate-400">Dr. Sarah Jenkins</td>
                  <td className="p-3 text-center font-mono">18 / 22</td>
                  <td className="p-3 text-center font-bold text-emerald-400 font-mono">81.8%</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Eligible</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-blue-400">CS308</td>
                  <td className="p-3 font-semibold text-white">Cloud Computing & DevOps</td>
                  <td className="p-3 text-slate-400">Dr. Neha Verma</td>
                  <td className="p-3 text-center font-mono">19 / 22</td>
                  <td className="p-3 text-center font-bold text-emerald-400 font-mono">86.4%</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Eligible</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Statutory Eligibility & Signatures */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Examination Clearance</span>
              <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> QUALIFIED FOR SEMESTER END EXAMINATIONS
              </p>
              <p className="text-[11px] text-slate-400">Compliant with AICTE/UGC Section 13 Minimum 75% Attendance Mandate.</p>
            </div>

            <div className="text-right font-mono text-[10px] text-slate-400 border-l border-slate-800 pl-4">
              <p className="text-slate-200 font-semibold">Digitally Signed & Certified</p>
              <p>Office of Controller of Examinations</p>
              <p className="text-indigo-400">SHA-256 Seal: 8bfa93...481d</p>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => setIsTranscriptModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Official Transcript (PDF)</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

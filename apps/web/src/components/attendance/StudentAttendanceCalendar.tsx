import React, { useState, useMemo, useEffect } from 'react';
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
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useOfflineAttendanceSync, enqueueAttendance } from '../../lib/offlineAttendanceSync';
import { apiSubmitAttendance } from '../../api/attendance';
import { useDatabase } from '../../context/DatabaseContext';

export interface ClassSession {
  id: string;
  code: string;
  name: string;
  time: string;
  room: string;
  faculty: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface DayAttendance {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  dayOfWeek: number; // 0 Sun - 6 Sat
  isWeekend: boolean;
  isHoliday?: boolean;
  holidayName?: string;
  status?: 'Present' | 'Absent' | 'Late' | 'Holiday' | 'Weekend';
  classes: ClassSession[];
}

interface StudentAttendanceCalendarProps {
  studentId?: string;
  studentName?: string;
  rollNo?: string;
  initialAttendanceRate?: number;
}

export const StudentAttendanceCalendar: React.FC<StudentAttendanceCalendarProps> = ({
  studentId = 'std_2026_001',
  studentName = 'Rishi Sharma',
  rollNo = '2024CS001',
  initialAttendanceRate = 88.5,
}) => {
  const { toast } = useToast();
  const { students, updateStudent } = useDatabase();
  const { isOnline, isSyncing, pendingCount, triggerSync } = useOfflineAttendanceSync();

  const activeStudent = students.find(s => s.id === studentId || s.rollNo === rollNo) || students[0] || {
    id: studentId,
    name: studentName,
    rollNo: rollNo,
    department: 'Computer Science',
    course: 'B.Tech CSE',
    attendanceRate: initialAttendanceRate,
  };

  // Current calendar view state: default to September 2026 (current semester)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 is September (0-indexed)

  // Seeded calendar attendance records for the student
  const [recordsMap, setRecordsMap] = useState<Record<string, { status: 'Present' | 'Absent' | 'Late'; classes: ClassSession[] }>>(() => {
    const map: Record<string, { status: 'Present' | 'Absent' | 'Late'; classes: ClassSession[] }> = {};
    const defaultClasses: Omit<ClassSession, 'id' | 'status'>[] = [
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
      // Day 4 and Day 11 marked Absent originally for realistic scenario
      const isAbsentDay = day === 4 || day === 11;
      const isLateDay = day === 8 || day === 15;

      const dayStatus = isAbsentDay ? 'Absent' : isLateDay ? 'Late' : 'Present';

      map[dateStr] = {
        status: dayStatus,
        classes: defaultClasses.map((cls, idx) => ({
          ...cls,
          id: `${dateStr}_${cls.code}_${idx}`,
          status: isAbsentDay ? 'Absent' : isLateDay && idx === 0 ? 'Late' : 'Present',
        })),
      };
    }
    return map;
  });

  // Selected date for day inspection
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-16');

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
    setSelectedDate('2026-09-16');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate days in month
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

      const record = recordsMap[dateStr];
      let status: DayAttendance['status'] = isWeekend ? 'Weekend' : undefined;
      let classes: ClassSession[] = [];

      if (record) {
        status = record.status;
        classes = record.classes;
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
  }, [currentYear, currentMonth, recordsMap]);

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

    return {
      workingDays,
      presentDays: Math.floor(presentDays),
      absentDays,
      lateDays,
      rate: parseFloat(calculatedRate),
    };
  }, [calendarDays, initialAttendanceRate]);

  // Selected day details
  const selectedDayData = useMemo(() => {
    const record = recordsMap[selectedDate];
    const parts = selectedDate.split('-');
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return {
      dateStr: selectedDate,
      formattedDate: dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      isWeekend,
      status: record ? record.status : isWeekend ? 'Weekend' : 'Not Marked',
      classes: record ? record.classes : [],
    };
  }, [selectedDate, recordsMap]);

  // Rectification Action: Updates attendance even after absent was marked -> switches to Present (or toggles)
  const handleRectifyAttendance = async (classId?: string, targetStatus: 'Present' | 'Absent' | 'Late' = 'Present') => {
    const dayRecord = recordsMap[selectedDate];
    if (!dayRecord) {
      toast('Invalid Date', 'No classes registered for selected date.', 'warning');
      return;
    }

    let updatedClasses = [...dayRecord.classes];
    let newDayStatus: 'Present' | 'Absent' | 'Late' = targetStatus;

    if (classId) {
      updatedClasses = updatedClasses.map(c => c.id === classId ? { ...c, status: targetStatus } : c);
      const allPresent = updatedClasses.every(c => c.status === 'Present');
      const anyPresent = updatedClasses.some(c => c.status === 'Present');
      newDayStatus = allPresent ? 'Present' : anyPresent ? 'Late' : 'Absent';
    } else {
      updatedClasses = updatedClasses.map(c => ({ ...c, status: targetStatus }));
      newDayStatus = targetStatus;
    }

    // 1. Optimistic Update (Immediate UI response with zero lag)
    setRecordsMap(prev => ({
      ...prev,
      [selectedDate]: {
        status: newDayStatus,
        classes: updatedClasses,
      },
    }));

    // Update real student profile attendance rate in context
    try {
      const delta = targetStatus === 'Present' ? +1.2 : -1.2;
      const nextRate = Math.min(100, Math.max(50, parseFloat((activeStudent.attendanceRate + delta).toFixed(1))));
      updateStudent({
        ...activeStudent,
        attendanceRate: nextRate,
      });
    } catch {}

    // 2. Offline Resilience / Low-Internet Queuing
    const subjectCode = classId ? updatedClasses.find(c => c.id === classId)?.code || 'CS302' : 'CS302';

    if (!isOnline) {
      enqueueAttendance({
        student_id: studentId,
        subject_code: subjectCode,
        date: selectedDate,
        status: targetStatus,
        action: 'UPSERT',
      });
      toast(
        'Offline Mode: Saved to Local Queue',
        `Attendance updated to ${targetStatus}. Will automatically sync with server when connection is restored.`,
        'info'
      );
      return;
    }

    // 3. Online Server Synchronization
    try {
      await apiSubmitAttendance({
        student_id: studentId,
        subject_code: subjectCode,
        date: selectedDate,
        status: targetStatus,
      });
      toast(
        'Attendance Rectified & Synced',
        `Status updated from ${dayRecord.status} to ${targetStatus} successfully on Cloud Server.`,
        'success'
      );
    } catch (err) {
      // If network fails midway or times out: enqueue into offline queue seamlessly
      enqueueAttendance({
        student_id: studentId,
        subject_code: subjectCode,
        date: selectedDate,
        status: targetStatus,
        action: 'UPSERT',
      });
      toast(
        'Connection Unstable: Queued Offline',
        `Server unreachable. Update preserved in resilient local queue and will sync automatically.`,
        'warning'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Student Info, Resilience Indicator & Sync Status */}
      <div className="glass-card p-5 border-blue-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <CalendarIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white font-display">Student Attendance Calendar</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                  Personalized Student View
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                <span className="font-semibold text-white">{activeStudent.name}</span> &bull; Roll: <span className="font-mono text-slate-200">{activeStudent.rollNo}</span> &bull; {activeStudent.course} &bull; {activeStudent.department}
              </p>
            </div>
          </div>

          {/* Low Internet / Offline Resilience Status Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-400 animate-pulse'
            }`}>
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span>{isOnline ? 'Cloud Synced' : 'Low Internet / Offline Resilient'}</span>
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

      {/* 4 Attendance Statistics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-1 relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-white">{stats.rate}%</h3>
            <span className={`text-[11px] font-bold flex items-center gap-0.5 ${stats.rate >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <TrendingUp size={12} /> {stats.rate >= 75 ? 'Eligible' : 'Warning'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Min 75% threshold required for midterms</p>
        </div>

        <div className="glass-card p-4 space-y-1 relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present Days</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-emerald-400">{stats.presentDays}</h3>
            <span className="text-xs text-slate-400 font-mono">/ {stats.workingDays} working days</span>
          </div>
          <p className="text-[11px] text-emerald-400/80">Regular classroom attendance</p>
        </div>

        <div className="glass-card p-4 space-y-1 relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent Days</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-rose-400">{stats.absentDays}</h3>
            <span className="text-xs text-slate-400">days missed</span>
          </div>
          <p className="text-[11px] text-slate-400">Rectifiable via medical/leave slip</p>
        </div>

        <div className="glass-card p-4 space-y-1 relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safe Bunk Buffer</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-indigo-400">
              {Math.max(0, Math.floor((stats.presentDays - 0.75 * stats.workingDays) / 0.75))} Days
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">Classes you can safely miss (&gt;75%)</p>
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
              const isToday = day.dateStr === '2026-09-16';

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

                  {/* Status Indicator Pill */}
                  <div className="w-full truncate">
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
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Day Inspection</span>
            <h4 className="text-sm font-bold text-white mt-0.5">{selectedDayData.formattedDate}</h4>
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
            </div>
          </div>

          {/* Classes for the Selected Day */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Lectures & Labs</span>
              <span className="text-[11px] font-normal text-slate-400">{selectedDayData.classes.length} Sessions</span>
            </h5>

            {selectedDayData.classes.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/80">
                No classes scheduled for this day (Weekend or Holiday).
              </div>
            ) : (
              selectedDayData.classes.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{c.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-blue-300 rounded">{c.code}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{c.time}</span>
                    <span>{c.room}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${
                      c.status === 'Present' ? 'text-emerald-400' : c.status === 'Absent' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {c.status === 'Present' && <CheckCircle2 size={12} />}
                      {c.status === 'Absent' && <XCircle size={12} />}
                      {c.status === 'Late' && <Clock size={12} />}
                      {c.status}
                    </span>

                    {/* Rectify Single Class Button */}
                    <button
                      onClick={() => handleRectifyAttendance(c.id, c.status === 'Absent' ? 'Present' : 'Absent')}
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold border transition-all cursor-pointer ${
                        c.status === 'Absent'
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/50'
                          : 'bg-rose-600/20 text-rose-300 border-rose-500/30 hover:bg-rose-600/40'
                      }`}
                      title="Update attendance status"
                    >
                      {c.status === 'Absent' ? 'Mark Present' : 'Mark Absent'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Rectify Entire Day Action */}
          {selectedDayData.classes.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Discrepancy / Status Rectification
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                If you were incorrectly marked Absent (e.g. biometric camera missed you or on approved duty leave), rectify status here:
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleRectifyAttendance(undefined, 'Present')}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Check size={14} />
                  <span>Rectify to Present</span>
                </button>

                <button
                  onClick={() => handleRectifyAttendance(undefined, 'Absent')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Mark Absent</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Check, X, Clock, Calendar, ShieldCheck, UserCheck } from 'lucide-react';

export const Attendance: React.FC = () => {
  const { students, updateStudent, addNotification } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const isStaff = currentRole === 'Faculty' || currentRole === 'Admin';

  // Faculty state
  const [selectedCourse, setSelectedCourse] = useState('B.Tech CSE');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, boolean>>(() => {
    const sheet: Record<string, boolean> = {};
    students.forEach((s) => {
      sheet[s.id] = true; // default present
    });
    return sheet;
  });

  const filteredStudents = students.filter((s) => s.course === selectedCourse);

  const toggleStatus = (studentId: string) => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSaveAttendance = () => {
    // Dynamically recalculate attendance rate in database
    filteredStudents.forEach((student) => {
      const isPresent = attendanceSheet[student.id];
      // Increment attendance metrics slightly to simulate real feedback
      const totalSessions = 50;
      const currentPresent = Math.round((student.attendanceRate / 100) * totalSessions);
      const nextPresent = isPresent ? currentPresent + 1 : currentPresent;
      const nextRate = parseFloat(((nextPresent / (totalSessions + 1)) * 100).toFixed(1));

      updateStudent({
        ...student,
        attendanceRate: nextRate,
      });
    });

    toast('Attendance Saved', `Attendance checklist logged for ${date} successfully.`, 'success');
    addNotification({
      title: 'Attendance Sheet Submitted',
      message: `Daily attendance logged for course ${selectedCourse} on ${date}.`,
      category: 'academic',
    });
  };

  // Student list mock logs
  const studentLogs = [
    { date: '2026-07-08', subject: 'Data Structures', status: 'Present', time: '09:00 AM' },
    { date: '2026-07-07', subject: 'Theory of Computation', status: 'Present', time: '09:00 AM' },
    { date: '2026-07-06', subject: 'Data Structures', status: 'Absent', time: '09:00 AM' },
    { date: '2026-07-03', subject: 'Technical Writing', status: 'Present', time: '02:00 PM' },
    { date: '2026-07-02', subject: 'Machine Learning', status: 'Present', time: '02:00 PM' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Attendance Portal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isStaff
            ? 'Select a course class and record present/absent logs in the register.'
            : 'Track overall class presence percentages and daily call history logs.'}
        </p>
      </div>

      {isStaff ? (
        // STAFF ATTENDANCE ENTRY
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-surface dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-premium">
            <div className="flex-1">
              <Select
                label="Class Course"
                options={[
                  { value: 'B.Tech CSE', label: 'B.Tech CSE (Computer Science)' },
                  { value: 'B.Tech ECE', label: 'B.Tech ECE (Electronics)' },
                  { value: 'B.Tech ME', label: 'B.Tech ME (Mechanical)' },
                  { value: 'B.Tech IT', label: 'B.Tech IT (Information Tech)' },
                ]}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-350 block mb-1.5">Date of Record</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2 border rounded-lg border-slate-305 bg-surface text-main dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <Card>
            <CardHeader className="p-5 flex items-center justify-between border-b border-slate-150 dark:border-slate-800">
              <div>
                <CardTitle>Attendance Register</CardTitle>
                <CardDescription>
                  Logging presence for {filteredStudents.length} students enrolled in {selectedCourse}
                </CardDescription>
              </div>
              <Button onClick={handleSaveAttendance} className="flex items-center gap-1.5">
                <ShieldCheck size={16} /> Save Attendance
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Prior Rate</TableHead>
                    <TableHead className="text-right">Roll Call Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((st) => (
                    <TableRow key={st.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={st.name} size="sm" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{st.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{st.rollNo}</TableCell>
                      <TableCell>
                        <Badge variant={st.attendanceRate >= 85 ? 'success' : st.attendanceRate >= 75 ? 'warning' : 'danger'}>
                          {st.attendanceRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => toggleStatus(st.id)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors
                              ${!attendanceSheet[st.id]
                                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-600 dark:bg-slate-800 dark:border-slate-700/60'
                              }
                            `}
                          >
                            <X size={14} /> Absent
                          </button>
                          <button
                            onClick={() => toggleStatus(st.id)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors
                              ${attendanceSheet[st.id]
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-emerald-600 dark:bg-slate-800 dark:border-slate-700/60'
                              }
                            `}
                          >
                            <Check size={14} /> Present
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        // STUDENT ATTENDANCE DASHBOARD
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main GPA KPI card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-premium">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">
                  My Attendance Rate
                </span>
                {/* Visual circle widget */}
                <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#2563EB"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={376.8}
                      strokeDashoffset={376.8 - (376.8 * 92.5) / 100}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black font-display text-white">92.5%</span>
                    <span className="text-[9px] text-slate-550 block font-semibold">Min: 75%</span>
                  </div>
                </div>
                <Badge variant="success" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold">
                  Safe Status
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Daily list log */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Attendance Log History</CardTitle>
                <CardDescription>Daily subject roll call list details</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {studentLogs.map((log, idx) => {
                  const isPresent = log.status === 'Present';
                  return (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isPresent ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-455'}`}>
                          {isPresent ? <UserCheck size={16} /> : <X size={16} />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205">{log.subject}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                            <Clock size={11} />
                            <span>{log.time}</span>
                            <span>•</span>
                            <Calendar size={11} />
                            <span>{log.date}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={isPresent ? 'success' : 'danger'}>{log.status}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

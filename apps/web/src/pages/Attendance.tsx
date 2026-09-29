import React, { useState } from 'react';
import { useDatabase, type Student } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Camera, Upload, Video, Sparkles, ShieldCheck, Calendar as CalendarIcon } from 'lucide-react';
import { StudentAttendanceCalendar } from '../components/attendance/StudentAttendanceCalendar';

export const Attendance: React.FC = () => {
  const { students, addNotification, attendanceRecords, markStudentAttendance, batchMarkAttendance } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const isStaff = currentRole === 'Faculty' || currentRole === 'Admin';

  const [selectedCourse, setSelectedCourse] = useState('B.Tech CSE');
  const [selectedDate, setSelectedDate] = useState('2026-09-25');
  const [attendanceMode, setAttendanceMode] = useState<'Manual' | 'Camera' | 'GroupPhoto' | 'CCTV'>('Camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const filteredStudents = students.filter((s) => s.course === selectedCourse);

  // Helper to get real-time status of student for selectedDate
  const getStudentStatus = (studentId: string, rollNo?: string): 'Present' | 'Absent' | 'Late' => {
    const key = `${selectedDate}_${studentId}`;
    const rec = attendanceRecords[key] ||
                (rollNo ? attendanceRecords[`${selectedDate}_${rollNo}`] : undefined) ||
                (studentId === 'STU001' ? attendanceRecords[`${selectedDate}_std_2026_001`] : undefined);
    return rec ? rec.status : 'Present';
  };

  const handleToggleStatus = (student: Student) => {
    const current = getStudentStatus(student.id, student.rollNo);
    const newStatus: 'Present' | 'Absent' = current === 'Present' ? 'Absent' : 'Present';

    markStudentAttendance(student.id, selectedDate, newStatus, {
      course: selectedCourse,
      markedBy: 'Dr. Arindam Sen (Faculty)',
    });

    toast(
      newStatus === 'Absent' ? 'Marked Absent' : 'Marked Present',
      `${student.name.replace(/^\./, '')} marked ${newStatus.toUpperCase()} for ${selectedDate}. Student portal updated in real-time.`,
      newStatus === 'Absent' ? 'warning' : 'success'
    );
  };

  const handleStartAIScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      const verifiedCount = Math.max(1, filteredStudents.length - 1);
      setScanResult(`AI Face Verification complete: ${verifiedCount} / ${filteredStudents.length} faces recognized (99.4% confidence).`);

      const batch = filteredStudents.map((s, idx) => ({
        studentId: s.id,
        date: selectedDate,
        status: (idx === filteredStudents.length - 1 ? 'Absent' : 'Present') as 'Present' | 'Absent',
        course: selectedCourse,
      }));
      batchMarkAttendance(batch, 'AI Camera 04 Face Recognition');

      toast('AI Facial Recognition Success', `Automated attendance marked for ${verifiedCount} students. Synced in real time.`, 'success');
    }, 1800);
  };

  const handleSaveAttendance = () => {
    toast('Attendance Saved', `Attendance records for ${selectedDate} finalized and locked into university ERP ledger.`, 'success');
    addNotification({
      title: 'Attendance Sheet Committed',
      message: `Daily attendance logged for course ${selectedCourse} on ${selectedDate}.`,
      category: 'academic',
    });
  };

  if (!isStaff) {
    const currentStudent = students[0] || {
      id: 'STU001',
      name: 'Rishi Sharma',
      rollNo: '2024CS001',
      attendanceRate: 88.5,
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <StudentAttendanceCalendar
          studentId={currentStudent.id}
          studentName={currentStudent.name.replace(/^\./, '')}
          rollNo={currentStudent.rollNo}
          initialAttendanceRate={currentStudent.attendanceRate}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-display m-0 leading-tight flex items-center gap-2">
            Attendance Portal
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AI Face Recognition v2.0
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Automated facial recognition via live camera, group photos, and classroom CCTV feeds. Real-time ERP ledger sync.
          </p>
        </div>

        {/* AI Mode Selector */}
        {isStaff && (
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setAttendanceMode('Camera')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                attendanceMode === 'Camera' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera size={14} /> Live Camera
            </button>
            <button
              onClick={() => setAttendanceMode('GroupPhoto')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                attendanceMode === 'GroupPhoto' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload size={14} /> Group Photo
            </button>
            <button
              onClick={() => setAttendanceMode('CCTV')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                attendanceMode === 'CCTV' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video size={14} /> Classroom CCTV
            </button>
          </div>
        )}
      </div>

      {/* AI Facial Scanner View */}
      {isStaff && (
        <Card className="glass-card border-blue-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/20">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Mode: {attendanceMode} Facial Scanner
              </span>
              <h3 className="text-base font-bold text-slate-100">Automatic Classroom Attendance Marking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan classroom faces via webcam or CCTV feed. AI matches biometric vectors against student enrollment database and updates records in real time.
              </p>
              {scanResult && (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>{scanResult}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleStartAIScan}
              disabled={isScanning}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles size={16} className={isScanning ? 'animate-spin' : ''} />
              {isScanning ? 'Scanning Facial Biometrics...' : 'Start AI Face Recognition'}
            </button>
          </CardContent>
        </Card>
      )}

      {/* Table Section */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 m-0">
              Course Attendance Checklist
            </h3>
            <p className="text-xs text-slate-400">
              Verifying enrolled students for {selectedCourse} &bull; Changes reflect immediately on student calendars
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Session Date Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <CalendarIcon size={14} className="text-blue-400" />
              <span className="font-semibold text-white">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-blue-300 font-mono focus:outline-none cursor-pointer"
              />
            </div>

            <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-36">
              <option value="B.Tech CSE">B.Tech CSE</option>
              <option value="B.Tech ECE">B.Tech ECE</option>
              <option value="B.Tech ME">B.Tech ME</option>
            </Select>

            <Button size="sm" onClick={handleSaveAttendance}>
              Save Checklist
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Current Attendance</TableHead>
                <TableHead>Status on {selectedDate}</TableHead>
                <TableHead className="text-right">Faculty Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => {
                const currentStatus = getStudentStatus(s.id, s.rollNo);
                const isPresent = currentStatus === 'Present';
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name.replace(/^\./, '')} />
                        <div>
                          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block">
                            {s.name.replace(/^\./, '')}
                          </span>
                          <span className="text-[10px] text-slate-400">{s.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{s.rollNo}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-bold ${s.attendanceRate >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {s.attendanceRate}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isPresent ? 'success' : 'danger'} className="text-[10px]">
                        {isPresent ? 'Verified Present' : 'Marked Absent'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={isPresent ? 'outline' : 'primary'}
                        onClick={() => handleToggleStatus(s)}
                      >
                        {isPresent ? 'Mark Absent' : 'Mark Present'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

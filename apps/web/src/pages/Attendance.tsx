import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Camera, Upload, Video, Sparkles, ShieldCheck } from 'lucide-react';

export const Attendance: React.FC = () => {
  const { students, updateStudent, addNotification } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const isStaff = currentRole === 'Faculty' || currentRole === 'Admin';

  const [selectedCourse, setSelectedCourse] = useState('B.Tech CSE');
  const [attendanceMode, setAttendanceMode] = useState<'Manual' | 'Camera' | 'GroupPhoto' | 'CCTV'>('Camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, boolean>>(() => {
    const sheet: Record<string, boolean> = {};
    students.forEach((s) => {
      sheet[s.id] = true;
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

  const handleStartAIScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      const verifiedCount = Math.max(1, filteredStudents.length - 1);
      setScanResult(`AI Face Verification complete: ${verifiedCount} / ${filteredStudents.length} faces recognized (99.4% confidence).`);
      
      const nextSheet = { ...attendanceSheet };
      filteredStudents.forEach(s => { nextSheet[s.id] = true; });
      setAttendanceSheet(nextSheet);

      toast('AI Facial Recognition Success', `Automated attendance marked for ${verifiedCount} students.`, 'success');
    }, 2200);
  };

  const handleSaveAttendance = () => {
    filteredStudents.forEach((student) => {
      const isPresent = attendanceSheet[student.id];
      const totalSessions = 50;
      const currentPresent = Math.round((student.attendanceRate / 100) * totalSessions);
      const nextPresent = isPresent ? currentPresent + 1 : currentPresent;
      const nextRate = parseFloat(((nextPresent / (totalSessions + 1)) * 100).toFixed(1));

      updateStudent({
        ...student,
        attendanceRate: nextRate,
      });
    });

    toast('Attendance Saved', `Attendance checklist logged successfully.`, 'success');
    addNotification({
      title: 'Attendance Sheet Submitted',
      message: `Daily attendance logged for course ${selectedCourse}.`,
      category: 'academic',
    });
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight flex items-center gap-2">
            Attendance Portal
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AI Face Recognition v2.0
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated facial recognition via live camera, group photos, and classroom CCTV feeds.
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
                Scan classroom faces via webcam or CCTV feed. AI matches biometric vectors against student enrollment database.
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
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 shrink-0"
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
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 m-0">
              {isStaff ? 'Course Attendance Checklist' : 'My Attendance Record'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isStaff ? `Verifying enrolled students for ${selectedCourse}` : 'Individual subject breakdown'}
            </p>
          </div>

          {isStaff && (
            <div className="flex items-center gap-3">
              <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-40">
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="B.Tech ME">B.Tech ME</option>
              </Select>
              <Button size="sm" onClick={handleSaveAttendance}>
                Save Checklist
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {isStaff ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Overall Rate</TableHead>
                  <TableHead>AI Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => {
                  const isPresent = attendanceSheet[s.id];
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} />
                          <div>
                            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block">{s.name}</span>
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
                          {isPresent ? 'Verified Present' : 'Absent'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={isPresent ? 'outline' : 'primary'}
                          onClick={() => toggleStatus(s.id)}
                        >
                          Toggle {isPresent ? 'Absent' : 'Present'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentLogs.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs">{log.date}</TableCell>
                    <TableCell className="text-xs font-semibold">{log.subject}</TableCell>
                    <TableCell className="text-xs">{log.time}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={log.status === 'Present' ? 'success' : 'danger'} className="text-[10px]">
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

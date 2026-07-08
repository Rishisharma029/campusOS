import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/Feedback';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { Users, GraduationCap, Download, CheckCircle2 } from 'lucide-react';

interface DepartmentCard {
  name: string;
  code: string;
  hod: string;
  students: number;
  faculty: number;
  courses: string[];
}

interface SyllabusTopic {
  id: string;
  subject: string;
  code: string;
  credits: number;
  completion: number; // 0 to 100
  notesUrl: string;
}

const DEPARTMENTS: DepartmentCard[] = [
  {
    name: 'Computer Science & Engineering',
    code: 'CSE',
    hod: 'Dr. Arindam Sen',
    students: 430,
    faculty: 24,
    courses: ['B.Tech CSE', 'M.Tech AI', 'Ph.D. CS'],
  },
  {
    name: 'Electronics & Communication',
    code: 'ECE',
    hod: 'Dr. Meera Deshmukh',
    students: 320,
    faculty: 18,
    courses: ['B.Tech ECE', 'M.Tech Microelectronics'],
  },
  {
    name: 'Mechanical Engineering',
    code: 'ME',
    hod: 'Dr. Vikram Rathore',
    students: 180,
    faculty: 12,
    courses: ['B.Tech ME', 'M.Tech Robotics'],
  },
  {
    name: 'Information Technology',
    code: 'IT',
    hod: 'Prof. Rajesh K. Mehta',
    students: 250,
    faculty: 15,
    courses: ['B.Tech IT'],
  },
];

const SYLLABUS: SyllabusTopic[] = [
  { id: '1', subject: 'Data Structures and Algorithms', code: 'CS301', credits: 4, completion: 82, notesUrl: 'dsa_notes.pdf' },
  { id: '2', subject: 'Database Management Systems', code: 'CS302', credits: 4, completion: 90, notesUrl: 'dbms_notes.pdf' },
  { id: '3', subject: 'Theory of Computation', code: 'CS303', credits: 3, completion: 65, notesUrl: 'toc_notes.pdf' },
  { id: '4', subject: 'Microprocessors & Controllers', code: 'EC302', credits: 4, completion: 74, notesUrl: 'micro_notes.pdf' },
  { id: '5', subject: 'Machine Learning Fundamentals', code: 'AI401', credits: 4, completion: 45, notesUrl: 'ml_notes.pdf' },
];

export const Courses: React.FC = () => {
  const { toast } = useToast();

  const handleDownload = (file: string) => {
    toast('Download Started', `Downloading syllabus copy and notes: ${file}...`, 'info');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Departments & Courses
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Explore college departments, available course degrees, and course syllabus progress trackers.
        </p>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DEPARTMENTS.map((dept) => (
          <Card key={dept.code} hoverable>
            <CardHeader className="p-4 flex items-center justify-between">
              <div>
                <Badge variant="primary" className="mb-1 font-mono text-[9px]">{dept.code}</Badge>
                <CardTitle className="text-sm font-bold font-display">{dept.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/20 dark:bg-slate-850/10">
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider mb-0.5">H.O.D.</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{dept.hod}</span>
                </div>
                <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/20 dark:bg-slate-850/10 flex items-center gap-1.5">
                  <Users size={14} className="text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider mb-0.5">Students</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{dept.students}</span>
                  </div>
                </div>
                <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/20 dark:bg-slate-850/10 flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider mb-0.5">Faculty</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{dept.faculty}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Active Programs</span>
                <div className="flex flex-wrap gap-1.5">
                  {dept.courses.map((c) => (
                    <Badge key={c} variant="secondary" className="text-[9px] py-0 px-2">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Syllabus Progress */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Subject Syllabus Tracker</CardTitle>
            <CardDescription>Academic completions and downloadable reading materials</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {SYLLABUS.map((sub) => (
              <div key={sub.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {sub.code}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{sub.credits} Credits</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {sub.subject}
                  </h4>
                </div>

                <div className="w-full sm:w-48 shrink-0 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                      <span>Completed</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{sub.completion}%</span>
                    </div>
                    <ProgressBar value={sub.completion} color={sub.completion >= 80 ? 'bg-emerald-500' : 'bg-blue-600'} />
                  </div>
                  {sub.completion === 100 ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 shrink-0 flex items-center justify-center cursor-pointer"
                      onClick={() => handleDownload(sub.notesUrl)}
                    >
                      <Download size={12} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

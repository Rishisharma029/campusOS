import React, { useState } from 'react';
import { useDatabase, type Exam, type Result } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { Printer, Plus, ShieldAlert, Sparkles, TrendingUp, BookOpen, Lock, Shuffle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const marksSchema = z.object({
  studentId: z.string().min(1, 'Select a student'),
  subjectName: z.string().min(2, 'Enter subject name'),
  marksObtained: z.string().min(1, 'Enter marks obtained'),
  maxMarks: z.string().min(1, 'Enter max marks'),
  grade: z.string().min(1, 'Grade is required (O, A+, A, B, etc.)'),
});

type MarksFormInputs = z.infer<typeof marksSchema>;

export const Examinations: React.FC = () => {
  const { exams, results, addResult, students, addNotification } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(true);
  const [secureBrowserMode, setSecureBrowserMode] = useState(false);

  const isStaff = currentRole === 'Faculty' || currentRole === 'Admin';
  const isStudent = currentRole === 'Student' || currentRole === 'Parent';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MarksFormInputs>({
    resolver: zodResolver(marksSchema),
    defaultValues: {
      maxMarks: '100',
    } as any,
  });

  const onSubmitMarks = (data: MarksFormInputs) => {
    const student = students.find((s) => s.id === data.studentId);
    if (!student) return;

    addResult({
      studentId: data.studentId,
      studentName: student.name,
      subjectName: data.subjectName,
      marksObtained: parseInt(data.marksObtained),
      maxMarks: parseInt(data.maxMarks),
      grade: data.grade,
    });

    toast('Marks Published', `Recorded ${data.subjectName} grade for ${student.name}.`, 'success');
    addNotification({
      title: 'Exam Result Published',
      message: `Grade ${data.grade} assigned for ${data.subjectName} to student ${student.name}.`,
      category: 'exam',
    });

    reset();
    setIsEntryModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight flex items-center gap-2">
            Examination Engine & AI Result Analytics
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              AI Analytics & Question Bank
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Exam scheduling, secure proctored browser, marks upload, and AI grade prediction.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          {isStudent && (
            <Button size="sm" variant="outline" onClick={() => setIsTicketModalOpen(true)} className="gap-1.5">
              <Printer size={14} /> Download Hall Ticket PDF
            </Button>
          )}
          {isStaff && (
            <Button size="sm" onClick={() => setIsEntryModalOpen(true)} className="gap-1.5">
              <Plus size={14} /> Enter Marks
            </Button>
          )}
        </div>
      </div>

      {/* AI Result Analysis Banner Card */}
      {showAIAnalysis && (
        <Card className="glass-card border-purple-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">AI Performance & CGPA Predictive Analysis</h3>
                  <p className="text-xs text-slate-400">Evaluates historical marks, strength clusters & risk factors</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30">
                Low Failure Risk Score: 3.2%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Strongest Subject</span>
                <h4 className="text-xs font-bold text-emerald-400">Data Structures (92.5%)</h4>
                <p className="text-[10px] text-slate-400">High problem-solving score</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Focus Subject (Weakness)</span>
                <h4 className="text-xs font-bold text-rose-400">Digital Comms (64.0%)</h4>
                <p className="text-[10px] text-slate-400">Recommend lab revision modules</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Predicted Semester CGPA</span>
                <h4 className="text-xs font-bold text-purple-400">8.92 / 10.0</h4>
                <p className="text-[10px] text-slate-400">Based on mid-term trends</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">AI Recommendation</span>
                <h4 className="text-xs font-bold text-blue-400">Apply for Honors Thesis</h4>
                <p className="text-[10px] text-slate-400">Top 5% percentile eligible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="schedule">
        <TabList>
          <TabTrigger value="schedule">Exam Schedules</TabTrigger>
          <TabTrigger value="results">Semester Grades</TabTrigger>
          <TabTrigger value="questionbank">Question Bank AI</TabTrigger>
        </TabList>

        <TabContent value="schedule" className="mt-4">
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Exam Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Mode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-semibold text-xs">{exam.course}</TableCell>
                    <TableCell className="text-xs">{exam.subject}</TableCell>
                    <TableCell className="text-xs">
                      {exam.examDate} ({exam.duration})
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary" className="text-[10px]">
                        {exam.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold">{exam.room}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1 inline-flex">
                        <Lock size={10} /> Secure Proctored
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabContent>

        <TabContent value="results" className="mt-4">
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Marks Obtained</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((res) => {
                  const percent = ((res.marksObtained / res.maxMarks) * 100).toFixed(1);
                  return (
                    <TableRow key={res.id}>
                      <TableCell className="font-semibold text-xs">{res.studentName}</TableCell>
                      <TableCell className="text-xs">{res.subjectName}</TableCell>
                      <TableCell className="text-xs">
                        {res.marksObtained} / {res.maxMarks}
                      </TableCell>
                      <TableCell>
                        <Badge variant={res.grade.startsWith('A') || res.grade === 'O' ? 'success' : 'warning'} className="text-[10px]">
                          Grade {res.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-xs text-blue-500">
                        {percent}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabContent>

        <TabContent value="questionbank" className="mt-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Shuffle className="text-purple-400" size={16} />
                  AI Automated Question Randomization Engine
                </h3>
                <p className="text-xs text-slate-400">Generate 50+ unique exam paper sets with bloom taxonomy weights</p>
              </div>
              <button
                onClick={() => toast('Question Bank Generated', '150 randomized MCQs & theory questions exported.', 'success')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Generate Question Set
              </button>
            </div>
          </Card>
        </TabContent>
      </Tabs>

      {/* Enter Marks Modal */}
      <Modal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} title="Upload Exam Marks">
        <form onSubmit={handleSubmit(onSubmitMarks)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Select Student</label>
            <Select {...register('studentId')}>
              <option value="">Select a student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </Select>
            {errors.studentId && <span className="text-[10px] text-rose-500">{errors.studentId.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Subject Name</label>
            <Input placeholder="e.g. Data Structures" {...register('subjectName')} />
            {errors.subjectName && <span className="text-[10px] text-rose-500">{errors.subjectName.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Marks Obtained</label>
              <Input type="number" placeholder="85" {...register('marksObtained')} />
              {errors.marksObtained && <span className="text-[10px] text-rose-500">{errors.marksObtained.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Max Marks</label>
              <Input type="number" placeholder="100" {...register('maxMarks')} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Grade Assigned</label>
            <Select {...register('grade')}>
              <option value="O">O (Outstanding)</option>
              <option value="A+">A+ (Excellent)</option>
              <option value="A">A (Very Good)</option>
              <option value="B+">B+ (Good)</option>
              <option value="B">B (Above Average)</option>
              <option value="C">C (Pass)</option>
              <option value="F">F (Fail)</option>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsEntryModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish Result</Button>
          </div>
        </form>
      </Modal>

      {/* Hall Ticket Modal */}
      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Admit Card / Hall Ticket">
        <div className="flex flex-col gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold border-b border-slate-800 pb-2 text-slate-200">
              <span>Student: Rishi Sharma</span>
              <span>Roll: 2026CSE001</span>
            </div>
            <p className="text-slate-400">Admit card verified for Mid-Semester Examinations 2026.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsTicketModalOpen(false)}>Print PDF</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

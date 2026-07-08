import React, { useState } from 'react';
import { useDatabase, type Exam, type Result } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { DataGrid, type Column, Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { Printer, Plus, ShieldAlert } from 'lucide-react';
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
    
    toast('Marks Saved', `Grade logged successfully for ${student.name}.`, 'success');
    addNotification({
      title: 'Exam Grade Reported',
      message: `${data.subjectName} grades entered for student ${student.name}. Result: ${data.marksObtained}/${data.maxMarks} (${data.grade}).`,
      category: 'exam',
    });
    setIsEntryModalOpen(false);
    reset();
  };

  const examColumns: Column<Exam>[] = [
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'type', label: 'Type', render: (row) => <Badge variant="secondary">{row.type}</Badge> },
    { key: 'examDate', label: 'Date', sortable: true },
    { key: 'duration', label: 'Duration' },
    { key: 'room', label: 'Room', render: (row) => <span className="font-semibold text-slate-800 dark:text-slate-205">{row.room}</span> },
  ];

  const resultsColumns: Column<Result>[] = [
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'subjectName', label: 'Subject', sortable: true },
    {
      key: 'marksObtained',
      label: 'Marks',
      render: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {row.marksObtained} / {row.maxMarks}
        </span>
      ),
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (row) => {
        const isPass = !['F', 'E'].includes(row.grade);
        return <Badge variant={isPass ? 'success' : 'danger'}>{row.grade}</Badge>;
      },
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
            Examinations & Grades
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish midterm timetables, evaluate class subjects, and print student hall tickets.
          </p>
        </div>
        <div className="flex gap-2">
          {isStudent && (
            <Button variant="outline" onClick={() => setIsTicketModalOpen(true)} className="flex items-center gap-1.5">
              <Printer size={16} /> Print Hall Ticket
            </Button>
          )}
          {isStaff && (
            <Button onClick={() => setIsEntryModalOpen(true)} className="flex items-center gap-1.5">
              <Plus size={16} /> Enter Exam Marks
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="schedule">
        <TabList>
          <TabTrigger value="schedule">Exam Schedules</TabTrigger>
          <TabTrigger value="results">Academic Results</TabTrigger>
        </TabList>

        {/* Tab 1: Schedules */}
        <TabContent value="schedule">
          <Card>
            <CardContent className="pt-6">
              <DataGrid columns={examColumns} data={exams} searchKey="subject" searchPlaceholder="Search exam subjects..." />
            </CardContent>
          </Card>
        </TabContent>

        {/* Tab 2: Results */}
        <TabContent value="results">
          <Card>
            <CardContent className="pt-6">
              <DataGrid columns={resultsColumns} data={results} searchKey="studentName" searchPlaceholder="Search students..." />
            </CardContent>
          </Card>
        </TabContent>
      </Tabs>

      {/* Enter Marks Modal */}
      <Modal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} title="Log Course Grades">
        <form onSubmit={handleSubmit(onSubmitMarks)} className="flex flex-col gap-4">
          <Select
            label="Enrolled Student"
            options={[
              { value: '', label: 'Select Student' },
              ...students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` })),
            ]}
            {...register('studentId')}
            error={errors.studentId?.message}
          />
          <Input label="Subject Title" placeholder="e.g. Data Structures" {...register('subjectName')} error={errors.subjectName?.message} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Marks Obtained" type="number" {...register('marksObtained')} error={errors.marksObtained?.message} />
            <Input label="Max Marks (Out of)" type="number" {...register('maxMarks')} error={errors.maxMarks?.message} />
          </div>
          <Select
            label="Letter Grade"
            options={[
              { value: '', label: 'Select Grade' },
              { value: 'O', label: 'O (Outstanding)' },
              { value: 'A+', label: 'A+ (Excellent)' },
              { value: 'A', label: 'A (Very Good)' },
              { value: 'B', label: 'B (Good)' },
              { value: 'C', label: 'C (Average)' },
              { value: 'F', label: 'F (Fail)' },
            ]}
            {...register('grade')}
            error={errors.grade?.message}
          />

          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button variant="outline" type="button" onClick={() => setIsEntryModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish Grade</Button>
          </div>
        </form>
      </Modal>

      {/* Hall Ticket Modal */}
      <Modal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="Download Admit Card" size="xl">
        <div className="flex flex-col gap-5">
          {/* Printable Layout */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 bg-surface dark:bg-slate-900 text-left flex flex-col gap-6 relative">
            {/* Stamp water-mark */}
            <div className="absolute right-6 top-16 opacity-10 rotate-12 select-none border-4 border-emerald-500 text-emerald-500 font-bold p-2 text-sm rounded">
              APPROVED ADMIT CARD
            </div>

            {/* Title Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white font-bold text-sm rounded-lg">
                  Ω
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-wider font-display text-slate-800 dark:text-slate-200">
                    ACADEMIA INSTITUTE OF TECHNOLOGY
                  </h3>
                  <span className="text-[9px] text-slate-400 font-semibold block">Affiliated to Central Tech University</span>
                </div>
              </div>
              <Badge variant="primary" className="text-[9px] px-2 py-0.5 uppercase tracking-widest font-mono">
                Hall Ticket
              </Badge>
            </div>

            {/* Student metadata */}
            <div className="flex gap-4 items-center">
              <Avatar name="Aarav Mehta" size="lg" className="border border-slate-200 dark:border-slate-800" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs flex-1">
                <div>
                  <span className="text-slate-400 font-medium block text-[9px] uppercase">Candidate Name</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-250">Aarav Mehta</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-[9px] uppercase">Roll Card Number</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-250">2024CS001</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-[9px] uppercase">Course Stream</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-250">B.Tech CSE</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block text-[9px] uppercase">Semester Term</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-250">Sem 5</span>
                </div>
              </div>
            </div>

            {/* Subjects table */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Approved Exam Schedule</span>
              <Table className="border border-slate-100 dark:border-slate-850 rounded-xl overflow-hidden text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2.0">Subject Code</TableHead>
                    <TableHead className="py-2.0">Paper Name</TableHead>
                    <TableHead className="py-2.0">Scheduled Date</TableHead>
                    <TableHead className="py-2.0">Assigned Hall</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-2.5 font-mono text-[10px]">CS301</TableCell>
                    <TableCell className="py-2.5 font-medium">Data Structures</TableCell>
                    <TableCell className="py-2.5">2026-07-15</TableCell>
                    <TableCell className="py-2.5">LHC-101</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2.5 font-mono text-[10px]">CS302</TableCell>
                    <TableCell className="py-2.5 font-medium">Database Systems</TableCell>
                    <TableCell className="py-2.5">2026-07-17</TableCell>
                    <TableCell className="py-2.5">LHC-102</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Security checklist warnings */}
            <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-150 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 items-start leading-relaxed">
              <ShieldAlert className="text-slate-400 shrink-0 mt-0.5" size={13} />
              <p>
                Candidates must carry a valid physical ID card alongside this hall ticket. Mobile phones, smart watches, and unauthorized calculators are strictly banned inside LHC exam halls. Report 30 mins before slots.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button variant="outline" onClick={() => setIsTicketModalOpen(false)}>
              Close
            </Button>
            <Button
              className="flex items-center gap-1.5"
              onClick={() => {
                toast('Admit Printing', 'Spooling admit card copy to device printer...', 'success');
                window.print();
              }}
            >
              <Printer size={14} /> Print Admit Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

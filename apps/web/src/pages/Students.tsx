import React, { useState } from 'react';
import { useDatabase, type Student } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { DataGrid, type Column } from '../components/ui/Table';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { ProgressBar } from '../components/ui/Feedback';
import { Plus, Eye, FileText, Printer, Trash2, Upload, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form validation schema
const studentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  rollNo: z.string().min(4, 'Roll number must be at least 4 characters'),
  department: z.string().min(1, 'Select a department'),
  course: z.string().min(1, 'Select a course'),
  year: z.string().min(1, 'Select year'),
  cgpa: z.string().min(1, 'GPA is required'),
  parentName: z.string().min(3, 'Parent name must be at least 3 characters'),
  parentEmail: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
});

type StudentFormInputs = z.infer<typeof studentSchema>;

export const Students: React.FC = () => {
  const { students, addStudent, deleteStudent } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Document upload mock state
  const [documents, setDocuments] = useState<string[]>([
    'Grade_Sheet_Sem_1.pdf',
    'Aadhar_Card_Verification.pdf',
    'College_Admission_Slip.pdf',
  ]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isAdmin = currentRole === 'Admin';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormInputs>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      year: '1',
      cgpa: '8.0',
    } as any,
  });

  const onSubmit = (data: StudentFormInputs) => {
    addStudent({
      ...data,
      year: parseInt(data.year),
      cgpa: parseFloat(data.cgpa),
      attendanceRate: 100.0,
      feePaid: 0,
      feeTotal: 180000,
      hostelRoom: 'Unassigned',
      transportBus: 'None (Day Scholar)',
      placementStatus: 'Preparing',
    });
    toast('Registration Successful', `${data.name} registered successfully!`, 'success');
    setIsAddModalOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      deleteStudent(id);
      toast('Record Deleted', `Student ${id} has been removed.`, 'warning');
      setIsDetailOpen(false);
    }
  };

  const handleUpload = () => {
    setUploadingDoc(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploadingDoc(false);
          setDocuments((prev) => [...prev, 'Uploaded_Certificate_' + Date.now() + '.pdf']);
          toast('Upload Complete', 'Document uploaded successfully.', 'success');
          return 100;
        }
        return p + 20;
      });
    }, 200);
  };

  const columns: Column<Student>[] = [
    {
      key: 'name',
      label: 'Student',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">{row.name}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">{row.email}</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    { key: 'rollNo', label: 'Roll Number', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'course', label: 'Course' },
    {
      key: 'cgpa',
      label: 'CGPA',
      render: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.cgpa} / 10</span>,
      sortable: true,
    },
    {
      key: 'attendanceRate',
      label: 'Attendance',
      render: (row) => {
        const rate = row.attendanceRate;
        const color = rate >= 85 ? 'success' : rate >= 75 ? 'warning' : 'danger';
        return <Badge variant={color}>{rate}%</Badge>;
      },
      sortable: true,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 flex items-center gap-1.5"
          onClick={() => {
            setSelectedStudent(row);
            setIsDetailOpen(true);
          }}
        >
          <Eye size={12} /> View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
            Students Database
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View, search, and manage registered college student profile files and documents.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1.5">
            <Plus size={16} /> Add New Student
          </Button>
        )}
      </div>

      {/* Grid List */}
      <Card>
        <CardContent className="pt-6">
          <DataGrid
            columns={columns}
            data={students}
            searchKey="name"
            searchPlaceholder="Search student name..."
            filters={[
              {
                key: 'department',
                label: 'Department',
                options: [
                  { value: 'Computer Science', label: 'Computer Science' },
                  { value: 'Electronics', label: 'Electronics' },
                  { value: 'Mechanical Eng.', label: 'Mechanical Engineering' },
                  { value: 'Information Tech.', label: 'Information Tech' },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Admit New Student" size="xl">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" {...register('name')} error={errors.name?.message} />
          <Input label="Student Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Roll Number" {...register('rollNo')} error={errors.rollNo?.message} />
          <Select
            label="Department"
            options={[
              { value: '', label: 'Select Department' },
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Electronics', label: 'Electronics' },
              { value: 'Mechanical Eng.', label: 'Mechanical Eng.' },
              { value: 'Information Tech.', label: 'Information Tech.' },
            ]}
            {...register('department')}
            error={errors.department?.message}
          />
          <Select
            label="Course Degree"
            options={[
              { value: '', label: 'Select Course' },
              { value: 'B.Tech CSE', label: 'B.Tech CSE' },
              { value: 'B.Tech ECE', label: 'B.Tech ECE' },
              { value: 'B.Tech ME', label: 'B.Tech ME' },
              { value: 'B.Tech IT', label: 'B.Tech IT' },
            ]}
            {...register('course')}
            error={errors.course?.message}
          />
          <Input label="Year of Study" type="number" {...register('year')} error={errors.year?.message} />
          <Input label="Current GPA" type="number" step="0.1" {...register('cgpa')} error={errors.cgpa?.message} />
          <Input label="Primary Phone" {...register('phone')} error={errors.phone?.message} />
          <Input label="Parent Name" {...register('parentName')} error={errors.parentName?.message} />
          <Input label="Parent Email" type="email" {...register('parentEmail')} error={errors.parentEmail?.message} />

          <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end gap-3 mt-2">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Admit Card</Button>
          </div>
        </form>
      </Modal>

      {/* Student Details Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedStudent ? `${selectedStudent.name} (Roll Card)` : 'Student Profile'}
        size="lg"
      >
        {selectedStudent && (
          <div className="flex flex-col gap-6">
            {/* Header Avatar and Basic */}
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <Avatar name={selectedStudent.name} size="xl" />
              <div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100">
                  {selectedStudent.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedStudent.course} • Department of {selectedStudent.department}
                </p>
                <div className="flex flex-wrap gap-2.5 mt-2.5">
                  <Badge variant="primary">Year {selectedStudent.year}</Badge>
                  <Badge variant="success">CGPA: {selectedStudent.cgpa}</Badge>
                  <Badge variant="info">Attendance: {selectedStudent.attendanceRate}%</Badge>
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <Tabs defaultValue="info">
              <TabList>
                <TabTrigger value="info">General Info</TabTrigger>
                <TabTrigger value="docs">Documents</TabTrigger>
                <TabTrigger value="idcard">ID Card Generator</TabTrigger>
              </TabList>

              {/* Tab 1: General Info */}
              <TabContent value="info" className="flex flex-col gap-4 pt-3.0">
                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div className="border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl bg-slate-50/30 dark:bg-slate-800/20">
                    <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[9px]">Roll Number</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedStudent.rollNo}</span>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl bg-slate-50/30 dark:bg-slate-800/20">
                    <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[9px]">Email Address</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold break-all">{selectedStudent.email}</span>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl bg-slate-50/30 dark:bg-slate-800/20">
                    <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[9px]">Phone</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedStudent.phone}</span>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl bg-slate-50/30 dark:bg-slate-800/20">
                    <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[9px]">Placement Status</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                      <Badge variant={selectedStudent.placementStatus === 'Placed' ? 'success' : 'secondary'}>
                        {selectedStudent.placementStatus}
                      </Badge>
                    </span>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl bg-slate-50/30 dark:bg-slate-800/20 col-span-2">
                    <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[9px]">Parent Contact</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold block">
                      {selectedStudent.parentName} (Parent)
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                      Email: {selectedStudent.parentEmail}
                    </span>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl bg-slate-50/30 dark:bg-slate-800/20">
                    <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[9px]">Hostel Quarter</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedStudent.hostelRoom}</span>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl bg-slate-50/30 dark:bg-slate-800/20">
                    <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[9px]">Transport Route</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedStudent.transportBus}</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-5 flex justify-end">
                    <Button variant="danger" size="sm" className="flex items-center gap-1.5" onClick={() => handleDelete(selectedStudent.id)}>
                      <Trash2 size={12} /> Delete Student Record
                    </Button>
                  </div>
                )}
              </TabContent>

              {/* Tab 2: Documents */}
              <TabContent value="docs" className="flex flex-col gap-4 pt-3.0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Academic verification files
                  </span>
                  <Button variant="outline" size="sm" className="h-8 px-2 flex items-center gap-1" onClick={handleUpload} disabled={uploadingDoc}>
                    <Upload size={12} /> Upload File
                  </Button>
                </div>

                {uploadingDoc && (
                  <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col gap-2">
                    <span className="text-[10px] text-slate-500 font-medium animate-pulse">Uploading file...</span>
                    <ProgressBar value={uploadProgress} color="bg-blue-600" />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-surface hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{doc}</span>
                      </div>
                      <Badge variant="success" className="text-[9px] flex items-center gap-1">
                        <CheckCircle size={8} /> Verified
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabContent>

              {/* Tab 3: ID Card Generator */}
              <TabContent value="idcard" className="flex flex-col gap-4 items-center pt-3.0">
                {/* Graphics Card Layout */}
                <div className="border border-slate-300 dark:border-slate-800 rounded-2xl p-6 w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-premium-lg relative overflow-hidden text-left flex flex-col justify-between h-[220px]">
                  {/* Backdrop shapes */}
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute left-0 top-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-xl pointer-events-none" />

                  {/* Top Bar Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                        Ω
                      </div>
                      <span className="text-[10px] font-bold tracking-wider text-blue-400 font-display">
                        ACADEMIA UNIVERSITY
                      </span>
                    </div>
                    <Badge variant="primary" className="bg-white/10 border-white/20 text-white font-mono text-[8px] uppercase">
                      Student ID
                    </Badge>
                  </div>

                  {/* Body grid */}
                  <div className="flex gap-4 items-center py-3">
                    <Avatar name={selectedStudent.name} size="lg" className="border-2 border-blue-500/30" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate leading-tight font-display">{selectedStudent.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{selectedStudent.course}</p>
                      <p className="text-[10px] font-mono text-blue-400 mt-1">Roll No: {selectedStudent.rollNo}</p>
                    </div>
                  </div>

                  {/* Footer barcode mock */}
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase tracking-widest block">Department</span>
                      <span className="text-[9px] font-semibold text-slate-350">{selectedStudent.department}</span>
                    </div>
                    {/* Barcode Mock */}
                    <div className="flex flex-col items-center">
                      <div className="flex gap-0.5 items-end h-6 bg-slate-900 px-1 rounded-sm">
                        <div className="w-[1.5px] h-full bg-white" />
                        <div className="w-[3px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[1.5px] h-full bg-white" />
                        <div className="w-[2.5px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[3px] h-full bg-white" />
                      </div>
                      <span className="text-[8px] font-mono text-slate-500 mt-0.5">{selectedStudent.id}</span>
                    </div>
                  </div>
                </div>

                {/* Print action button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 mt-2"
                  onClick={() => {
                    toast('Printer Triggered', 'Opening print preview dialog...', 'info');
                    window.print();
                  }}
                >
                  <Printer size={12} /> Print Physical ID Card
                </Button>
              </TabContent>
            </Tabs>
          </div>
        )}
      </Drawer>
    </div>
  );
};

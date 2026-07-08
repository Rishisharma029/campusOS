import React, { useState } from 'react';
import { useDatabase, type Faculty } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { DataGrid, type Column } from '../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { Plus, Check, X, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const leaveSchema = z.object({
  facultyName: z.string().min(3, 'Faculty name must be at least 3 characters'),
  startDate: z.string().min(1, 'Select a start date'),
  endDate: z.string().min(1, 'Select an end date'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

type LeaveFormInputs = z.infer<typeof leaveSchema>;

export const FacultyPage: React.FC = () => {
  const { faculty, leaves, addLeaveRequest, updateLeaveStatus } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const isAdmin = currentRole === 'Admin';
  const isFaculty = currentRole === 'Faculty';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveFormInputs>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      facultyName: isFaculty ? 'Dr. Vikram Rathore' : '', // Mock faculty default
    },
  });

  const onSubmitLeave = (data: LeaveFormInputs) => {
    addLeaveRequest(data);
    toast('Request Submitted', 'Your leave request has been submitted to the Admin.', 'success');
    setIsLeaveModalOpen(false);
    reset();
  };

  const handleLeaveApproval = (id: string, approve: boolean) => {
    const status = approve ? 'Approved' : 'Rejected';
    updateLeaveStatus(id, status);
    toast(`Leave ${status}`, `Leave request ${id} has been ${status.toLowerCase()}.`, approve ? 'success' : 'error');
  };

  const columns: Column<Faculty>[] = [
    {
      key: 'name',
      label: 'Faculty',
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
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    {
      key: 'courses',
      label: 'Courses Taught',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.courses.map((c) => (
            <Badge key={c} variant="secondary" className="text-[9px] py-0 px-1.5">
              {c}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'loadHours',
      label: 'Workload (Weekly)',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-850 dark:text-slate-250">{row.loadHours} hrs</span>
          <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${row.loadHours >= 15 ? 'bg-amber-500' : 'bg-blue-500'}`}
              style={{ width: `${(row.loadHours / 20) * 100}%` }}
            />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const isActive = row.status === 'Active';
        return <Badge variant={isActive ? 'success' : 'warning'}>{row.status}</Badge>;
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
            Faculty Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor educator designations, schedules, workload hours, and administrative leaves.
          </p>
        </div>
        {isFaculty && (
          <Button onClick={() => setIsLeaveModalOpen(true)} className="flex items-center gap-1.5">
            <Plus size={16} /> Request Leave
          </Button>
        )}
      </div>

      <Tabs defaultValue="directory">
        <TabList>
          <TabTrigger value="directory">Faculty Directory</TabTrigger>
          <TabTrigger value="leaves">
            Leaves Ledger{' '}
            {leaves.filter((l) => l.status === 'Pending').length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-bold text-[9px]">
                {leaves.filter((l) => l.status === 'Pending').length}
              </span>
            )}
          </TabTrigger>
        </TabList>

        {/* Tab 1: Directory */}
        <TabContent value="directory">
          <Card>
            <CardContent className="pt-6">
              <DataGrid
                columns={columns}
                data={faculty}
                searchKey="name"
                searchPlaceholder="Search faculty members..."
                filters={[
                  {
                    key: 'department',
                    label: 'Department',
                    options: [
                      { value: 'Computer Science', label: 'Computer Science' },
                      { value: 'Electronics', label: 'Electronics' },
                      { value: 'Mechanical Eng.', label: 'Mechanical Engineering' },
                    ],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabContent>

        {/* Tab 2: Leaves */}
        <TabContent value="leaves" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaves.length > 0 ? (
            leaves.map((l) => (
              <Card key={l.id} hoverable>
                <CardHeader className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={l.facultyName} size="sm" />
                    <div>
                      <CardTitle className="text-xs">{l.facultyName}</CardTitle>
                      <CardDescription className="text-[10px]">Leave Request {l.id}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'danger'}>
                    {l.status}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                    <Calendar size={13} className="text-slate-400" />
                    <span>
                      {l.startDate} to {l.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    {l.reason}
                  </p>

                  {/* Actions for Admin */}
                  {isAdmin && l.status === 'Pending' && (
                    <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 border-rose-200"
                        onClick={() => handleLeaveApproval(l.id, false)}
                      >
                        <X size={12} className="mr-1" /> Reject
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="h-8"
                        onClick={() => handleLeaveApproval(l.id, true)}
                      >
                        <Check size={12} className="mr-1" /> Approve
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="md:col-span-2 text-center py-10 text-slate-400 text-xs">
              No leave requests registered.
            </div>
          )}
        </TabContent>
      </Tabs>

      {/* Leave Modal */}
      <Modal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} title="Submit Leave Request">
        <form onSubmit={handleSubmit(onSubmitLeave)} className="flex flex-col gap-4">
          <Input label="Faculty Name" readOnly {...register('facultyName')} error={errors.facultyName?.message} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" {...register('startDate')} error={errors.startDate?.message} />
            <Input label="End Date" type="date" {...register('endDate')} error={errors.endDate?.message} />
          </div>
          <Textarea label="Reason for Leave" {...register('reason')} error={errors.reason?.message} />

          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button variant="outline" type="button" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import { useDatabase, type PlacementDrive } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { DataGrid, type Column } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Plus, Briefcase, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const driveSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  role: z.string().min(3, 'Role designation is required'),
  driveDate: z.string().min(1, 'Select drive date'),
  packageOffer: z.string().min(2, 'Enter package offer (e.g. 12 LPA)'),
  eligibleCgpa: z.string().min(1, 'CGPA Cutoff Required'),
});

type DriveFormInputs = z.infer<typeof driveSchema>;

export const Placement: React.FC = () => {
  const { placements, addPlacementDrive, students } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [registeredDrives, setRegisteredDrives] = useState<string[]>([]);

  const isStaff = currentRole === 'Placement Cell' || currentRole === 'Admin';
  const isStudent = currentRole === 'Student' || currentRole === 'Parent';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriveFormInputs>({
    resolver: zodResolver(driveSchema),
  });

  const onSubmitDrive = (data: DriveFormInputs) => {
    addPlacementDrive({
      company: data.company,
      role: data.role,
      driveDate: data.driveDate,
      packageOffer: data.packageOffer,
      eligibleCgpa: parseFloat(data.eligibleCgpa),
      status: 'Upcoming',
    });
    toast('Drive Published', `${data.company} placement drive listed.`, 'success');
    setIsDriveModalOpen(false);
    reset();
  };

  const handleRegister = (companyId: string) => {
    setRegisteredDrives((prev) => [...prev, companyId]);
    toast('Application Submitted', 'You registered for this drive successfully.', 'success');
  };

  // Student specific CGPA checks
  const studentCgpa = students[0].cgpa; // Aarav 8.7

  const columns: Column<PlacementDrive>[] = [
    { key: 'company', label: 'Company', sortable: true },
    { key: 'role', label: 'Designation Role', sortable: true },
    { key: 'driveDate', label: 'Drive Date', sortable: true },
    { key: 'packageOffer', label: 'CTC Package', sortable: true },
    {
      key: 'eligibleCgpa',
      label: 'CGPA Cutoff',
      render: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {row.eligibleCgpa} CGPA
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status',
      label: 'Drive Status',
      render: (row) => {
        const type = row.status === 'Ongoing' ? 'warning' : row.status === 'Closed' ? 'danger' : 'primary';
        return <Badge variant={type}>{row.status}</Badge>;
      },
      sortable: true,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (row) => {
        const isEligible = studentCgpa >= row.eligibleCgpa;
        const isRegistered = registeredDrives.includes(row.id);

        if (isStudent) {
          if (row.status === 'Closed') {
            return <span className="text-xs text-slate-400">Applications Closed</span>;
          }
          if (isRegistered) {
            return (
              <Badge variant="success" className="h-8 flex items-center justify-center gap-1.5 px-3">
                <CheckCircle size={10} /> Registered
              </Badge>
            );
          }
          return (
            <Button
              variant={isEligible ? 'primary' : 'outline'}
              size="sm"
              className="h-8 text-xs cursor-pointer"
              disabled={!isEligible}
              onClick={() => handleRegister(row.id)}
            >
              {isEligible ? 'Apply Now' : 'Not Eligible'}
            </Button>
          );
        }
        return <span className="text-xs text-slate-500 font-semibold">Staff view only</span>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
            Placement Cell Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish hiring drive calendars, register candidate details, and review qualification ratios.
          </p>
        </div>
        {isStaff && (
          <Button onClick={() => setIsDriveModalOpen(true)} className="flex items-center gap-1.5">
            <Plus size={16} /> Add Placement Drive
          </Button>
        )}
      </div>

      {isStudent && (
        <Card className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center gap-3.5 text-xs text-slate-650 dark:text-slate-350">
            <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg shrink-0">
              <Briefcase size={16} />
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-100">Eligible CGPA Verification</span>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Your current average GPA is <span className="font-bold text-blue-600 dark:text-blue-400">{studentCgpa}</span>. You qualify for any drives requiring a cutoff at or below this value.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drives Grid */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recruitment Drives Calendar</CardTitle>
            <CardDescription>Scheduled corporate hiring drives details</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <DataGrid columns={columns} data={placements} searchKey="company" searchPlaceholder="Search companies..." />
        </CardContent>
      </Card>

      {/* Add Drive Modal */}
      <Modal isOpen={isDriveModalOpen} onClose={() => setIsDriveModalOpen(false)} title="Log New Placement Drive">
        <form onSubmit={handleSubmit(onSubmitDrive)} className="flex flex-col gap-4">
          <Input label="Company Name" placeholder="e.g. Google" {...register('company', { required: true })} error={errors.company?.message} />
          <Input label="Designation / Role" placeholder="e.g. SDE-1" {...register('role', { required: true })} error={errors.role?.message} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Drive Date" type="date" {...register('driveDate', { required: true })} error={errors.driveDate?.message} />
            <Input label="CTC Offer (INR)" placeholder="e.g. 24 LPA" {...register('packageOffer', { required: true })} error={errors.packageOffer?.message} />
          </div>
          <Input label="CGPA Cutoff Required" type="number" step="0.1" placeholder="e.g. 8.5" {...register('eligibleCgpa', { required: true })} error={errors.eligibleCgpa?.message} />

          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button variant="outline" type="button" onClick={() => setIsDriveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish hiring drive</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

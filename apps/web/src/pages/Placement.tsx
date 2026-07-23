import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { Plus, Sparkles, FileText, Mic, Download } from 'lucide-react';
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
  const { placements, addPlacementDrive } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [registeredDrives, setRegisteredDrives] = useState<string[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(88);
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
  const [simMode, setSimMode] = useState<'Voice' | 'Coding' | 'Behavioral' | 'HR'>('Voice');
  const [isSimActive, setIsSimActive] = useState(false);
  const [simScore, setSimScore] = useState<number | null>(null);

  const isStaff = currentRole === 'Placement Cell' || currentRole === 'Admin';

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
    if (registeredDrives.includes(companyId)) return;
    setRegisteredDrives([...registeredDrives, companyId]);
    toast('Registration Confirmed', 'Resume submitted for screening.', 'success');
  };

  const handleRunATSCheck = () => {
    setIsAnalyzingATS(true);
    setTimeout(() => {
      setIsAnalyzingATS(false);
      setAtsScore(92);
      toast('ATS Score Generated', 'Resume match score updated to 92/100.', 'success');
    }, 1500);
  };

  const handleStartSim = () => {
    setIsSimActive(true);
    setSimScore(null);
    setTimeout(() => {
      setIsSimActive(false);
      setSimScore(94);
      toast('Mock Interview Complete', 'AI Score: 94/100. Excellent technical articulation!', 'success');
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight flex items-center gap-2">
            Placement Cell & AI Interview Hub
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              AI ATS & Interview Simulator
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recruitment drives, AI resume ATS analyzer, candidate ranking, and voice mock interviews.
          </p>
        </div>

        {isStaff && (
          <Button size="sm" onClick={() => setIsDriveModalOpen(true)} className="gap-1.5 self-start">
            <Plus size={14} /> Schedule Recruitment Drive
          </Button>
        )}
      </div>

      <Tabs defaultValue="drives">
        <TabList>
          <TabTrigger value="drives">Active Drives & Companies</TabTrigger>
          <TabTrigger value="resume">AI Resume Builder & ATS Score</TabTrigger>
          <TabTrigger value="interview">AI Mock Interview Simulator</TabTrigger>
        </TabList>

        <TabContent value="drives" className="mt-4">
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>CGPA Cutoff</TableHead>
                  <TableHead>Drive Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placements.map((drive) => {
                  const isReg = registeredDrives.includes(drive.id);
                  return (
                    <TableRow key={drive.id}>
                      <TableCell className="font-bold text-xs">{drive.company}</TableCell>
                      <TableCell className="text-xs">{drive.role}</TableCell>
                      <TableCell className="text-xs font-semibold text-emerald-500">{drive.packageOffer}</TableCell>
                      <TableCell className="text-xs font-mono">{drive.eligibleCgpa} CGPA</TableCell>
                      <TableCell className="text-xs">{drive.driveDate}</TableCell>
                      <TableCell>
                        <Badge variant="success" className="text-[10px]">{drive.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={isReg ? 'outline' : 'primary'}
                          onClick={() => handleRegister(drive.id)}
                        >
                          {isReg ? 'Applied ✓' : 'Apply Now'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabContent>

        <TabContent value="resume" className="mt-4">
          <Card className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="text-cyan-400" size={20} />
                  AI Automated Resume Builder & ATS Screener
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generates ATS-optimized resume from your student profile and project achievements.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunATSCheck}
                  disabled={isAnalyzingATS}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <Sparkles size={14} className={isAnalyzingATS ? 'animate-spin' : ''} />
                  {isAnalyzingATS ? 'Scanning Resume...' : 'Re-Analyze ATS Match'}
                </button>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700">
                  <Download size={14} /> Export PDF
                </button>
              </div>
            </div>

            {atsScore !== null && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-lg">
                    {atsScore}%
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">ATS Screener Rating</span>
                    <h4 className="text-xs font-bold text-slate-100">Top Tier Candidate Match</h4>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1 text-xs text-slate-300">
                  <span className="font-bold text-cyan-400">AI Improvement Tips:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-400 text-[11px]">
                    <li>Include quantified metrics for Computer Vision & LLM projects (+4% ATS match).</li>
                    <li>Add AWS / Cloud Practitioner certification badge.</li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </TabContent>

        <TabContent value="interview" className="mt-4">
          <Card className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Mic className="text-cyan-400" size={20} />
                  AI Voice & Technical Interview Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate real-world tech & HR rounds with voice evaluation and instant scoring.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                {(['Voice', 'Coding', 'Behavioral', 'HR'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSimMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      simMode === mode ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto animate-pulse">
                <Mic size={28} />
              </div>
              <h4 className="text-sm font-bold text-slate-100">Ready for {simMode} Interview Round?</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                AI interviewer will ask 5 technical questions based on your profile, record your spoken answer, and evaluate confidence, syntax, and clarity.
              </p>

              <button
                onClick={handleStartSim}
                disabled={isSimActive}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 inline-flex items-center gap-2"
              >
                <Sparkles size={16} className={isSimActive ? 'animate-spin' : ''} />
                {isSimActive ? 'Interview in Progress... Speak Now' : 'Start Mock Interview Round'}
              </button>

              {simScore !== null && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs inline-block">
                  🎯 AI Interview Score: <strong>{simScore} / 100</strong> (Strong Hire Rating)
                </div>
              )}
            </div>
          </Card>
        </TabContent>
      </Tabs>

      {/* Schedule Drive Modal */}
      <Modal isOpen={isDriveModalOpen} onClose={() => setIsDriveModalOpen(false)} title="Schedule Placement Drive">
        <form onSubmit={handleSubmit(onSubmitDrive)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Company Name</label>
            <Input placeholder="e.g. Google Cloud" {...register('company')} />
            {errors.company && <span className="text-[10px] text-rose-500">{errors.company.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Role Designation</label>
            <Input placeholder="e.g. Software Engineer (L3)" {...register('role')} />
            {errors.role && <span className="text-[10px] text-rose-500">{errors.role.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Package Offer</label>
              <Input placeholder="e.g. 18 LPA" {...register('packageOffer')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Minimum CGPA</label>
              <Input placeholder="e.g. 7.5" {...register('eligibleCgpa')} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Drive Date</label>
            <Input type="date" {...register('driveDate')} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDriveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish Drive</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

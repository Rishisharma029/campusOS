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
import { Plus, Sparkles, FileText, Mic, Download, Briefcase, Award, CheckCircle2, TrendingUp, AlertTriangle, ExternalLink, Zap, Shield, Lock, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlacementIntelligenceEngine, type PlacementIntelligenceReport } from '../lib/placementIntelligenceEngine';

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

  const [report, setReport] = useState<PlacementIntelligenceReport>(
    PlacementIntelligenceEngine.analyzeCandidatePlacement('2026CSE001')
  );
  const [executedActions, setExecutedActions] = useState<string[]>([]);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [registeredDrives, setRegisteredDrives] = useState<string[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(91);
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
  const [simMode, setSimMode] = useState<'Voice' | 'Coding' | 'Behavioral' | 'HR'>('Voice');
  const [isSimActive, setIsSimActive] = useState(false);
  const [simScore, setSimScore] = useState<number | null>(null);

  const isStaff = currentRole === 'Placement Cell' || currentRole === 'Admin';
  const isReadOnly = currentRole === 'Student';

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

  const handleExecutePlacementAction = (payload: string, title: string) => {
    const res = PlacementIntelligenceEngine.executePlacementAction(payload);
    setExecutedActions(prev => [...prev, payload]);
    toast('AI Placement Action Dispatched', res.message, 'success');
  };

  const runAtsScan = () => {
    setIsAnalyzingATS(true);
    setTimeout(() => {
      setIsAnalyzingATS(false);
      setAtsScore(91);
      toast('ATS Screener Complete', 'Resume matched 91% for Tier-1 Product Engineering roles.', 'success');
    }, 1500);
  };

  const startSimulation = () => {
    setIsSimActive(true);
    setSimScore(null);
    setTimeout(() => {
      setIsSimActive(false);
      const score = Math.floor(88 + Math.random() * 8);
      setSimScore(score);
      toast('Interview Complete', `AI Evaluated Score: ${score}/100 in ${simMode} Round.`, 'info');
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
            AI Placement Intelligence & Career Portal
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
              Prediction Engine v3.0
            </span>
          </h1>
          <p className="text-xs text-slate-400">Placement Probability %, Skill Gap Radar, Certifications & Target Companies</p>
        </div>
        {isStaff && (
          <Button onClick={() => setIsDriveModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500">
            <Plus size={16} />
            List Placement Drive
          </Button>
        )}
      </div>

      <Tabs defaultValue="intelligence">
        <TabList className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <TabTrigger value="intelligence" className="text-xs flex items-center gap-1.5">
            <Sparkles size={14} className="text-cyan-400" />
            AI Placement Intelligence
          </TabTrigger>
          <TabTrigger value="drives" className="text-xs flex items-center gap-1.5">
            <Briefcase size={14} className="text-blue-400" />
            Placement Drives ({placements.length})
          </TabTrigger>
          <TabTrigger value="ats" className="text-xs flex items-center gap-1.5">
            <FileText size={14} className="text-purple-400" />
            ATS Resume Screener
          </TabTrigger>
          <TabTrigger value="mock" className="text-xs flex items-center gap-1.5">
            <Mic size={14} className="text-emerald-400" />
            AI Voice Interview Simulator
          </TabTrigger>
        </TabList>

        {/* Tab 1: AI Placement Intelligence (Requested Feature) */}
        <TabContent value="intelligence" className="space-y-6 mt-4">
          {/* Executive Candidate Placement Banner */}
          <div className="glass-card p-6 border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-blue-950/40 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  Candidate Profile: {report.studentName} ({report.studentId})
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  Placement Probability: <span className="text-emerald-400">{report.placementProbability}%</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Projected Compensation: <strong className="text-white font-mono">{report.projectedPackageRange}</strong> (Tier-1 Software Engineering)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Resume Score</span>
                <p className="text-2xl font-extrabold text-purple-400">{report.atsResumeScore} / 100</p>
                <span className="text-[10px] text-emerald-400 font-semibold">Tier-1 Format Match</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic CGPA</span>
                <p className="text-2xl font-extrabold text-cyan-400">{report.cgpa} / 10</p>
                <span className="text-[10px] text-cyan-400 font-semibold">Department Rank #2</span>
              </div>
            </div>
          </div>

          {/* Grid: Skill Gap Analysis & Recommended Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Skill Gap Analysis */}
            <div className="glass-card p-5 space-y-4 border-amber-500/30 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-400" />
                    AI Skill Gap Analysis & Mastered Competencies
                  </h3>
                  <span className="text-[10px] text-amber-300 font-mono">3 Gaps Identified</span>
                </div>

                {/* Mastered Skills List */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mastered Core Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.masteredSkills.map((sk, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1">
                        <Check size={12} /> {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skill Gaps */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Missing Skill Gaps (Required for Tier-1 Target):</span>
                  <div className="space-y-2">
                    {report.skillGaps.map((sg, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{sg.skill}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${sg.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                            {sg.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{sg.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <Button
                  onClick={() => handleExecutePlacementAction('LAUNCH_SYSTEM_DESIGN_MOCK', 'Launch System Design Mock')}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs py-2.5 flex items-center justify-center gap-2"
                >
                  <Mic size={14} />
                  Launch AI System Design Mock Practice &rarr;
                </Button>
              </div>
            </div>

            {/* Right Column: Recommended Industry Certifications */}
            <div className="glass-card p-5 space-y-4 border-purple-500/30 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Award size={15} className="text-purple-400" />
                    Recommended Industry Certifications
                  </h3>
                  <span className="text-[10px] text-purple-300 font-mono">High CTC Boost</span>
                </div>

                <div className="space-y-3">
                  {report.recommendedCertifications.map(cert => {
                    const isEnrolled = executedActions.includes('ENROLL_AWS_CERTIFICATION') && cert.id === 'cert-1';

                    return (
                      <div key={cert.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-purple-500/40 transition-all">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{cert.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-semibold">
                            {cert.salaryImpact}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Provider: <strong className="text-slate-200">{cert.provider}</strong></span>
                          <span>Duration: <strong className="text-slate-200">{cert.duration}</strong></span>
                        </div>

                        <div className="pt-1">
                          <button
                            onClick={() => handleExecutePlacementAction('ENROLL_AWS_CERTIFICATION', cert.title)}
                            disabled={isEnrolled}
                            className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                              isEnrolled ? 'bg-emerald-600 text-white cursor-default' : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40'
                            }`}
                          >
                            {isEnrolled ? <><CheckCircle2 size={13} /> Enrolled ✓</> : <><Zap size={13} /> Enroll & Claim Practice Vouchers &rarr;</>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Companies to Target Matrix */}
          <div className="glass-card p-6 space-y-4 border-cyan-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase size={16} className="text-cyan-400" />
                  Target Companies Matching Matrix
                </h3>
                <p className="text-xs text-slate-400">Categorized by Dream (Tier 1), Target (Tier 2), and Safe (Tier 3) based on historical recruitment data</p>
              </div>

              <Button
                onClick={() => handleExecutePlacementAction('TAILOR_RESUME_GOOGLE', 'Auto-Tailor Resume')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs"
              >
                <Sparkles size={14} />
                Auto-Tailor Resume for Google &rarr;
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.targetCompanies.map(comp => (
                <div key={comp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 font-extrabold text-xs flex items-center justify-center border border-cyan-500/30">
                        {comp.logo}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{comp.name}</h4>
                        <span className="text-[10px] text-slate-400">Max CTC: <strong className="text-emerald-400 font-mono">{comp.maxPackage}</strong></span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                      comp.category === 'DREAM' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      comp.category === 'TARGET' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {comp.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">AI Profile Match Score:</span>
                      <strong className="text-cyan-400 font-mono font-bold">{comp.matchScore}% Match</strong>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${comp.matchScore}%` }} />
                    </div>
                  </div>

                  <div className="pt-1 text-[10px] text-slate-400">
                    <span>Active Roles: </span>
                    <strong className="text-slate-200">{comp.rolesHiring.join(', ')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabContent>

        {/* Tab 2: Placement Drives */}
        <TabContent value="drives" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company & Role</TableHead>
                    <TableHead>Drive Date</TableHead>
                    <TableHead>Package (CTC)</TableHead>
                    <TableHead>CGPA Cutoff</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placements.map(drive => {
                    const isRegistered = registeredDrives.includes(drive.id);
                    return (
                      <TableRow key={drive.id}>
                        <TableCell>
                          <div>
                            <p className="font-bold text-white text-xs">{drive.company}</p>
                            <p className="text-[10px] text-slate-400">{drive.role}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-300 font-mono">{drive.driveDate}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-emerald-400">{drive.packageOffer}</TableCell>
                        <TableCell className="text-xs font-mono text-slate-300">{drive.eligibleCgpa} CGPA</TableCell>
                        <TableCell>
                          <Badge variant={drive.status === 'Upcoming' ? 'default' : 'secondary'} className="text-[10px]">
                            {drive.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={isRegistered ? 'secondary' : 'default'}
                            className="text-xs py-1 h-8"
                            onClick={() => {
                              if (!isRegistered) {
                                setRegisteredDrives(prev => [...prev, drive.id]);
                                toast('Registered', `Successfully registered for ${drive.company} drive.`, 'success');
                              }
                            }}
                          >
                            {isRegistered ? 'Registered ✓' : 'Register Now'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabContent>

        {/* Tab 3: ATS Resume Screener */}
        <TabContent value="ats" className="space-y-4 mt-4">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText size={16} className="text-purple-400" />
              AI Resume ATS Compatibility Screener
            </h3>
            <p className="text-xs text-slate-400">Scan your resume against Tier-1 Product Engineering ATS parsers (Google, Microsoft, Amazon).</p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Current Uploaded Resume: <span className="text-cyan-400">Rishi_Sharma_Software_Engineer.pdf</span></p>
                <p className="text-[10px] text-slate-400">Uploaded 2 days ago &bull; Verified Format</p>
              </div>

              <Button onClick={runAtsScan} disabled={isAnalyzingATS} className="bg-purple-600 hover:bg-purple-500 text-xs">
                {isAnalyzingATS ? 'Scanning ATS...' : 'Run Live ATS Scan'}
              </Button>
            </div>

            {atsScore !== null && (
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ATS Score</span>
                  <p className="text-xl font-extrabold text-purple-300">{atsScore} / 100</p>
                </div>
                <p className="text-slate-300">Strong ATS keyword density for React 19, TypeScript, and Data Structures.</p>
              </div>
            )}
          </div>
        </TabContent>

        {/* Tab 4: AI Voice Interview Simulator */}
        <TabContent value="mock" className="space-y-4 mt-4">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mic size={16} className="text-emerald-400" />
              AI Voice Interview Simulator
            </h3>
            <p className="text-xs text-slate-400">Simulate real-time voice interview rounds for System Design, Coding, and HR interviews.</p>

            <div className="flex items-center gap-2">
              {(['Voice', 'Coding', 'Behavioral', 'HR'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setSimMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    simMode === mode ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {mode} Round
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <Mic size={24} className={isSimActive ? 'animate-bounce' : ''} />
              </div>
              <h4 className="text-sm font-bold text-white">AI Mock Round: {simMode} Interview</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {isSimActive ? 'AI Interviewer is evaluating your speech clarity and technical answers...' : 'Click below to start your 4-minute simulated interview.'}
              </p>

              <Button onClick={startSimulation} disabled={isSimActive} className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold px-6">
                {isSimActive ? 'Interview in Progress...' : 'Start AI Interview Session'}
              </Button>
            </div>

            {simScore !== null && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Evaluated Performance</span>
                  <p className="text-xl font-extrabold text-emerald-300">{simScore} / 100</p>
                </div>
                <p className="text-slate-300">Excellent technical reasoning and clear articulation of system architecture.</p>
              </div>
            )}
          </div>
        </TabContent>
      </Tabs>

      {/* List Placement Drive Modal */}
      <Modal isOpen={isDriveModalOpen} onClose={() => setIsDriveModalOpen(false)} title="List Placement Drive">
        <form onSubmit={handleSubmit(onSubmitDrive)} className="space-y-4">
          <Input label="Company Name" placeholder="e.g. Google India" error={errors.company?.message} {...register('company')} />
          <Input label="Role Designation" placeholder="e.g. Software Engineer I" error={errors.role?.message} {...register('role')} />
          <Input label="Drive Date" type="date" error={errors.driveDate?.message} {...register('driveDate')} />
          <Input label="Package Offer (CTC)" placeholder="e.g. 18 LPA" error={errors.packageOffer?.message} {...register('packageOffer')} />
          <Input label="Eligible CGPA Cutoff" type="number" step="0.1" placeholder="e.g. 7.5" error={errors.eligibleCgpa?.message} {...register('eligibleCgpa')} />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsDriveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
              Publish Drive
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

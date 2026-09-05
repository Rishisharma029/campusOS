import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  Building2, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ExternalLink, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Users, 
  FileText, 
  Download, 
  ShieldCheck, 
  Check, 
  Briefcase,
  Star,
  Layers,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { 
  ApplicationTrackingEngine, 
  APPLICATION_STAGES, 
  INTERNSHIP_STAGES, 
  type ApplicationRecord, 
  type ApplicationStage, 
  type InternshipLifecycleRecord,
  type InternshipStage 
} from '../../lib/applicationTrackingEngine';
import { useToast } from '../../components/ui/Toast';

export const CareerApplications: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'INTERNSHIP_LIFECYCLE'>('PIPELINE');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');

  // Application Pipeline State
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => 
    ApplicationTrackingEngine.getApplications()
  );

  // Internship Lifecycle State
  const [internships, setInternships] = useState<InternshipLifecycleRecord[]>(() => 
    ApplicationTrackingEngine.getInternships()
  );
  const [selectedInternship, setSelectedInternship] = useState<InternshipLifecycleRecord>(() => internships[0]);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);

  // Advance Application Stage
  const handleAdvanceStage = (app: ApplicationRecord) => {
    const currentIndex = APPLICATION_STAGES.indexOf(app.stage);
    if (currentIndex < APPLICATION_STAGES.length - 1) {
      const nextStage = APPLICATION_STAGES[currentIndex + 1];
      const updated = ApplicationTrackingEngine.updateStage(app.id, nextStage);
      setApplications([...updated]);
      toast(
        'Pipeline Stage Advanced',
        `${app.role} application moved to "${nextStage}".`,
        'success'
      );
    }
  };

  // Toggle Milestone Status
  const handleToggleMilestone = (msId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    const updated = ApplicationTrackingEngine.updateMilestoneStatus(selectedInternship.id, msId, nextStatus as any);
    setInternships([...updated]);
    const match = updated.find(i => i.id === selectedInternship.id);
    if (match) setSelectedInternship({ ...match });
    toast(
      'Milestone Updated',
      `Milestone status changed to ${nextStatus}. Progress updated to ${match?.progressPercentage}%.`,
      'info'
    );
  };

  // Issue Certificate
  const handleIssueCertificate = () => {
    const updatedRecord = ApplicationTrackingEngine.issueCertificate(selectedInternship.id);
    if (updatedRecord) {
      const allInternships = ApplicationTrackingEngine.getInternships();
      setInternships([...allInternships]);
      setSelectedInternship({ ...updatedRecord });
      setIsCertModalOpen(true);
      toast(
        'Certificate Issued',
        `Official institutional certificate minted with verification hash: ${updatedRecord.certificate?.verificationHash}`,
        'success'
      );
    }
  };

  const filteredApps = applications.filter(a => {
    if (selectedStageFilter === 'ALL') return true;
    return a.stage === selectedStageFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
            <CheckSquare size={14} className="text-cyan-400" />
            <span>GENOVA • CAREER & INDUSTRY INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Application Tracking & Internship Mentorship
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            End-to-end recruitment tracking pipeline spanning 8 lifecycle stages, integrated with structured internship milestones, dedicated mentor evaluations, and cryptographically verified institutional credentials.
          </p>

          {/* Mode Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('PIPELINE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'PIPELINE'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Layers size={14} />
              <span>General Application Pipeline (8 Stages)</span>
            </button>
            <button
              onClick={() => setActiveTab('INTERNSHIP_LIFECYCLE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'INTERNSHIP_LIFECYCLE'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Award size={14} />
              <span>Internship Progress & Mentorship (6 Stages)</span>
            </button>
            <button
              onClick={() => navigate('/career/opportunities')}
              className="ml-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Briefcase size={13} />
              <span>Back to Marketplace</span>
            </button>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TAB 1: 8-STAGE GENERAL APPLICATION PIPELINE */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-5 animate-fade-in">
          {/* Pipeline Visual Stepper Bar */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm overflow-x-auto">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Recruitment Lifecycle Stepper (8 Stages)</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">
                Saved ➔ Applied ➔ Shortlisted ➔ Assessment ➔ Interview ➔ Selected ➔ Joined ➔ Completed
              </span>
            </div>

            <div className="flex items-center min-w-[760px] justify-between relative">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
              {APPLICATION_STAGES.map((stg, index) => {
                const countInStage = applications.filter(a => a.stage === stg).length;
                const isSelected = selectedStageFilter === stg;
                return (
                  <button
                    key={stg}
                    onClick={() => setSelectedStageFilter(selectedStageFilter === stg ? 'ALL' : stg)}
                    className={`relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group transition-all`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-extrabold transition-transform group-hover:scale-110 ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-md'
                        : countInStage > 0
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-[11px] font-bold ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : countInStage > 0
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}>
                      {stg}
                    </span>
                    {countInStage > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                        {countInStage} active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Applications Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing <strong>{filteredApps.length}</strong> applications{' '}
                {selectedStageFilter !== 'ALL' && `in stage "${selectedStageFilter}"`}
              </span>
              {selectedStageFilter !== 'ALL' && (
                <button
                  onClick={() => setSelectedStageFilter('ALL')}
                  className="text-blue-600 hover:underline cursor-pointer font-semibold"
                >
                  Clear filter (Show all)
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredApps.map((app) => {
                const currentStageIdx = APPLICATION_STAGES.indexOf(app.stage);

                return (
                  <div
                    key={app.id}
                    className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Bar: Type, Role, Company, Stage Badge */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-200 dark:border-blue-900 uppercase tracking-wider">
                              {app.type}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">{app.company}</span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                            {app.role}
                          </h3>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded-xl inline-flex items-center gap-1.5 ${
                            app.stage === 'Selected' || app.stage === 'Joined' || app.stage === 'Completed'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-300 dark:border-emerald-800'
                              : app.stage === 'Interview' || app.stage === 'Assessment'
                              ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-300 dark:border-blue-800'
                              : 'bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-300 dark:border-amber-800'
                          }`}>
                            <Sparkles size={11} />
                            <span>Stage: {app.stage}</span>
                          </span>
                        </div>
                      </div>

                      {/* Mini Stepper on Card */}
                      <div className="mt-3 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                        {APPLICATION_STAGES.map((s, idx) => (
                          <span
                            key={s}
                            className={`${
                              idx < currentStageIdx
                                ? 'text-emerald-500 font-black'
                                : idx === currentStageIdx
                                ? 'text-blue-600 dark:text-blue-400 font-black underline'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                            title={s}
                          >
                            {idx < currentStageIdx ? '✓' : idx + 1}
                          </span>
                        ))}
                      </div>

                      {/* Next Action Box */}
                      <div className="mt-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                          Next Action Required
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                          {app.nextAction}
                        </p>
                      </div>

                      {/* Optional Stage Specific Details (Interview, Assessment, Offer) */}
                      {app.interviewSchedule && app.stage === 'Interview' && (
                        <div className="mt-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                            Interview Scheduled
                          </span>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {app.interviewSchedule.round}
                          </div>
                          <div className="text-slate-500 flex items-center gap-2 text-[11px]">
                            <span>{app.interviewSchedule.date}</span>
                            <span>•</span>
                            <span>{app.interviewSchedule.interviewer}</span>
                          </div>
                        </div>
                      )}

                      {app.offerDetails && (app.stage === 'Selected' || app.stage === 'Joined') && (
                        <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                            Offer Package Details
                          </span>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {app.offerDetails.ctc}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            Joining: <strong>{app.offerDetails.joiningDate}</strong> • Acceptance Deadline: {app.offerDetails.expiryDate}
                          </div>
                        </div>
                      )}

                      {/* Metadata Details */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                        <div>
                          <span>Location: </span>
                          <strong className="text-slate-800 dark:text-slate-200">{app.location}</strong>
                        </div>
                        <div>
                          <span>Stipend/CTC: </span>
                          <strong className="text-slate-800 dark:text-slate-200">{app.salaryOrStipend}</strong>
                        </div>
                        <div>
                          <span>Applied Date: </span>
                          <strong className="text-slate-800 dark:text-slate-200">{app.appliedDate}</strong>
                        </div>
                        <div>
                          <span>Last Activity: </span>
                          <strong className="text-slate-800 dark:text-slate-200">{app.lastUpdated}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Advance Pipeline Simulator & Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {app.history.length} audit logs
                      </span>

                      <div className="flex items-center gap-2">
                        {currentStageIdx < APPLICATION_STAGES.length - 1 ? (
                          <button
                            onClick={() => handleAdvanceStage(app)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform hover:scale-105"
                          >
                            <span>Advance to {APPLICATION_STAGES[currentStageIdx + 1]}</span>
                            <ArrowRight size={12} />
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 size={13} />
                            <span>Completed ✓</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 6-STAGE INTERNSHIP PROGRESS & MENTORSHIP LIFECYCLE */}
      {activeTab === 'INTERNSHIP_LIFECYCLE' && (
        <div className="space-y-6 animate-fade-in">
          {/* Internship Stepper */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Active Industrial Internship
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedInternship.role}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Company: <strong>{selectedInternship.company}</strong> • Period: {selectedInternship.startDate} to {selectedInternship.endDate} • Stipend: {selectedInternship.stipend}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Progress Completion</span>
                  <span className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    {selectedInternship.progressPercentage}%
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-blue-600 flex items-center justify-center font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                  {selectedInternship.progressPercentage}%
                </div>
              </div>
            </div>

            {/* 6-Stage Visual Stepper */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Internship Lifecycle Stages:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {INTERNSHIP_STAGES.map((stg, idx) => {
                const currentStageIdx = INTERNSHIP_STAGES.indexOf(selectedInternship.internshipStage);
                const isPassed = idx <= currentStageIdx;
                return (
                  <div
                    key={stg}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      stg === selectedInternship.internshipStage
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                        : isPassed
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">{idx + 1}</div>
                    <div className="text-xs font-extrabold mt-0.5 truncate">{stg}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">
                      {isPassed ? '✓ Passed' : 'Upcoming'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Sprint Milestones Progress Tracking */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <span>Weekly Milestone & Progress Tracking</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Check deliverables off as you submit sprint GitHub pull requests and pass code reviews.
                    </p>
                  </div>
                </div>

                {/* Milestones List */}
                <div className="space-y-3">
                  {selectedInternship.milestones.map((ms) => (
                    <div
                      key={ms.id}
                      className={`p-4 rounded-xl border transition-all ${
                        ms.status === 'Completed'
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : ms.status === 'In Progress'
                          ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800/80 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                              Week {ms.week}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ms.status === 'Completed'
                                ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                                : ms.status === 'In Progress'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                            }`}>
                              {ms.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {ms.title}
                          </h4>
                        </div>

                        <button
                          onClick={() => handleToggleMilestone(ms.id, ms.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0 ${
                            ms.status === 'Completed'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white'
                          }`}
                        >
                          {ms.status === 'Completed' ? 'Completed ✓' : 'Mark Completed'}
                        </button>
                      </div>

                      {/* Deliverables Checklist */}
                      <div className="mt-3 space-y-1 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Sprint Deliverables:
                        </span>
                        {ms.deliverables.map((deliv, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                            <span className={ms.status === 'Completed' ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                              {ms.status === 'Completed' ? '✓' : '•'}
                            </span>
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>

                      {/* Mentor Review Note if exists */}
                      {ms.mentorFeedbackNote && (
                        <div className="mt-2.5 p-2 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <MessageSquare size={12} className="text-blue-500 shrink-0 mt-0.5" />
                          <span><strong>Mentor Note:</strong> {ms.mentorFeedbackNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Mentor Feedback & Certificate Card */}
            <div className="space-y-4">
              {/* Mentor Card */}
              {selectedInternship.mentor && (
                <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                      {selectedInternship.mentor.avatarInitials}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        Assigned Industry Mentor
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {selectedInternship.mentor.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {selectedInternship.mentor.title}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                    <div className="text-slate-500">Cadence: <strong className="text-slate-800 dark:text-slate-200">{selectedInternship.mentor.meetingCadence}</strong></div>
                    <div className="text-slate-500">Email: <strong className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">{selectedInternship.mentor.email}</strong></div>
                  </div>

                  {/* Mentor Feedback Evaluation */}
                  {selectedInternship.feedback && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100">Mentor Evaluation Score</span>
                        <div className="flex items-center gap-1 font-mono font-bold text-amber-500 text-sm">
                          <Star size={14} className="fill-amber-500" />
                          <span>{selectedInternship.feedback.overallRating} / 5.0</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Technical Proficiency</span>
                          <span className="font-mono font-bold text-blue-600">{selectedInternship.feedback.technicalProficiency}/5.0</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Problem Solving</span>
                          <span className="font-mono font-bold text-blue-600">{selectedInternship.feedback.problemSolving}/5.0</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Ownership & Communication</span>
                          <span className="font-mono font-bold text-blue-600">{selectedInternship.feedback.communicationAndOwnership}/5.0</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "{selectedInternship.feedback.qualitativeSummary}"
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Certificate & Completion Card */}
              <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 rounded-2xl border border-indigo-500/30 p-5 shadow-lg text-white space-y-4">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-amber-400" />
                  <h4 className="text-sm font-extrabold text-white">
                    Internship Completion Certificate
                  </h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Upon 100% milestone completion and mentor evaluation sign-off, an official institutional certificate is minted on the GENOVA verifiable credentials ledger.
                </p>

                {selectedInternship.certificate ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-1">
                      <div className="text-slate-400">Credential ID:</div>
                      <div className="font-mono font-bold text-cyan-300 text-xs truncate">
                        {selectedInternship.certificate.certificateId}
                      </div>
                      <div className="text-slate-400 mt-1">Verification Hash:</div>
                      <div className="font-mono text-[10px] text-emerald-400 truncate">
                        {selectedInternship.certificate.verificationHash}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCertModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-102"
                    >
                      <Award size={14} />
                      <span>View Official Certificate</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleIssueCertificate}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-102"
                  >
                    <Award size={14} />
                    <span>Mint & Issue Verified Certificate</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL VERIFIED CERTIFICATE MODAL */}
      {isCertModalOpen && selectedInternship.certificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl border-2 border-amber-500/40 max-w-2xl w-full p-8 shadow-2xl space-y-6 text-center text-white relative">
            
            {/* Certificate Header Banner */}
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              <span>◆ GENOVA VERIFIABLE CREDENTIALS REGISTRY ◆</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-slate-100">
                Certificate of Industrial Internship Completion
              </h2>
              <p className="text-xs text-slate-400 italic">
                This is to officially certify that
              </p>
            </div>

            <div className="text-xl md:text-2xl font-extrabold text-cyan-400 font-display border-b border-white/10 pb-3 inline-block px-8">
              {selectedInternship.certificate.recipientName}
            </div>

            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              has successfully completed all milestones and technical requirements as{' '}
              <strong className="text-white">{selectedInternship.certificate.role}</strong> at{' '}
              <strong className="text-white">{selectedInternship.certificate.company}</strong> with mentor rating{' '}
              <strong className="text-amber-400">4.9 / 5.0</strong>.
            </p>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-300 font-semibold max-w-md mx-auto">
              "{selectedInternship.certificate.honorsCitation}"
            </div>

            {/* Cryptographic Verification Details */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-[10px] font-mono text-left bg-slate-900/60 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 block">Credential ID:</span>
                <span className="font-bold text-slate-200">{selectedInternship.certificate.certificateId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Issue Date:</span>
                <span className="font-bold text-slate-200">{selectedInternship.certificate.issueDate}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Cryptographic Verification Hash:</span>
                <span className="font-bold text-emerald-400 break-all">{selectedInternship.certificate.verificationHash}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast('Certificate Downloaded', 'Official PDF with cryptographic watermark saved.', 'success');
                  setIsCertModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Download size={14} />
                <span>Download Verified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

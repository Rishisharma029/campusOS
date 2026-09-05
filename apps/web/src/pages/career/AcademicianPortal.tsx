import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  Building2, 
  BookOpen, 
  Award, 
  FileText, 
  Handshake, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Check, 
  Send, 
  ExternalLink,
  ShieldCheck,
  Star,
  Layers,
  Plus
} from 'lucide-react';
import { 
  AcademicianPortalEngine, 
  type AcademicianModuleTab,
  type FacultyInternship,
  type IndustrialTraining,
  type FacultyDevelopmentProgram,
  type ConsultancyOpportunity,
  type SponsoredResearchProject,
  type IndustryMentorshipPairing,
  type AcademicCollaborationMoU
} from '../../lib/academicianPortalEngine';
import { useToast } from '../../components/ui/Toast';

export const AcademicianPortal: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<AcademicianModuleTab>('FACULTY_INTERNSHIP');

  // State for all 7 modules
  const [internships, setInternships] = useState<FacultyInternship[]>(() => 
    AcademicianPortalEngine.getInternships()
  );
  const [trainings, setTrainings] = useState<IndustrialTraining[]>(() => 
    AcademicianPortalEngine.getTrainings()
  );
  const [fdps, setFdps] = useState<FacultyDevelopmentProgram[]>(() => 
    AcademicianPortalEngine.getFDPs()
  );
  const [consultancies, setConsultancies] = useState<ConsultancyOpportunity[]>(() => 
    AcademicianPortalEngine.getConsultancies()
  );
  const [researchProjects] = useState<SponsoredResearchProject[]>(() => 
    AcademicianPortalEngine.getResearchProjects()
  );
  const [mentorships] = useState<IndustryMentorshipPairing[]>(() => 
    AcademicianPortalEngine.getMentorships()
  );
  const [collaborations] = useState<AcademicCollaborationMoU[]>(() => 
    AcademicianPortalEngine.getCollaborations()
  );

  // Modals state
  const [selectedInternshipForModal, setSelectedInternshipForModal] = useState<FacultyInternship | null>(null);
  const [selectedConsultancyForBid, setSelectedConsultancyForBid] = useState<ConsultancyOpportunity | null>(null);
  const [bidProposalText, setBidProposalText] = useState<string>('Faculty proposal with mathematical formulation and laboratory validation on hardware test benches.');

  // Handlers
  const handleApplyInternship = (internship: FacultyInternship) => {
    const updated = AcademicianPortalEngine.applyForInternship(internship.id);
    setInternships(updated);
    setSelectedInternshipForModal(null);
    toast('Application Submitted', `Your research sabbatical application to ${internship.company} is now under review.`, 'success');
  };

  const handleEnrollTraining = (training: IndustrialTraining) => {
    const updated = AcademicianPortalEngine.enrollInTraining(training.id);
    setTrainings(updated);
    toast('Enrolled in Training Rig', `Seat confirmed for ${training.title}. Lab access provisioned.`, 'success');
  };

  const handleRegisterFDP = (fdp: FacultyDevelopmentProgram) => {
    const updated = AcademicianPortalEngine.registerForFDP(fdp.id);
    setFdps(updated);
    toast('Registered for National FDP', `Enrolled in ${fdp.title}. Academic credits will be auto-indexed.`, 'success');
  };

  const handleSubmitBid = (consultancy: ConsultancyOpportunity) => {
    const updated = AcademicianPortalEngine.submitConsultancyBid(consultancy.id);
    setConsultancies(updated);
    setSelectedConsultancyForBid(null);
    toast('Consultancy Bid Submitted', `Proposal submitted for ${consultancy.title} (${consultancy.budgetValuation}).`, 'success');
  };

  const tabs: { id: AcademicianModuleTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'FACULTY_INTERNSHIP', label: 'Faculty Internship', icon: Briefcase },
    { id: 'INDUSTRIAL_TRAINING', label: 'Industrial Training', icon: Award },
    { id: 'FDP', label: 'FDP', icon: BookOpen },
    { id: 'CONSULTANCY', label: 'Consultancy', icon: DollarSign },
    { id: 'RESEARCH_PROJECTS', label: 'Research Projects', icon: TrendingUp },
    { id: 'INDUSTRY_MENTORSHIP', label: 'Industry Mentorship', icon: Users },
    { id: 'COLLABORATION', label: 'Collaboration', icon: Handshake }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Hero Header: Faculty & Researcher Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 border border-indigo-500/30 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
              <GraduationCap size={14} className="text-indigo-400" />
              <span>SIH26044 • ACADEMICIAN & FACULTY ECOSYSTEM</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
              Academician Industry Portal
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Bridge academia and industry. Access corporate faculty residencies, industrial training bootcamps, AICTE FDPs, paid industry consultancy, sponsored R&D grants, and student co-mentorship.
            </p>

            <div className="mt-4 flex items-center gap-3 text-xs text-indigo-200">
              <span className="font-bold text-white">Faculty: Dr. Siddharth Sen</span>
              <span>•</span>
              <span>Dept. of Computer Science & Autonomous Systems</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={13} />
                <span>Verified Principal Investigator</span>
              </span>
            </div>
          </div>

          {/* Key Macro Metrics */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Research Grants
              </span>
              <div className="text-lg font-black text-cyan-300 mt-0.5">₹1.29 Crore</div>
              <span className="text-[10px] text-emerald-400 font-semibold">2 Sponsored Labs</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Consultancy & IP
              </span>
              <div className="text-lg font-black text-amber-300 mt-0.5">₹24.3 Lakhs</div>
              <span className="text-[10px] text-slate-300">1 Patent Granted</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Co-Mentored Teams
              </span>
              <div className="text-lg font-black text-indigo-300 mt-0.5">4 Capstones</div>
              <span className="text-[10px] text-emerald-400">100% Industry Linked</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                FDP & Training Credits
              </span>
              <div className="text-lg font-black text-emerald-300 mt-0.5">13 Credits</div>
              <span className="text-[10px] text-cyan-400">AICTE Approved</span>
            </div>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 7 Core Modules Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-102'
                  : 'bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* WORKSPACE 1: Faculty Internship (Corporate Sabbaticals & Residencies) */}
      {activeTab === 'FACULTY_INTERNSHIP' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Faculty Internships & Corporate Research Sabbaticals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immerse into tier-1 corporate R&D centers during summer/winter terms. Work directly on live industrial production rigs.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              {internships.length} Sabbatical Openings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {internships.map((internship) => (
              <div
                key={internship.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase">
                      {internship.mode}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {internship.honorarium.split('+')[0]}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {internship.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <Building2 size={13} />
                    <span>{internship.company}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    {internship.researchFocus}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <div><strong>Duration:</strong> {internship.duration}</div>
                    <div><strong>Deadline:</strong> {internship.deadline}</div>
                    <div><strong>Eligibility:</strong> {internship.eligibility}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  {internship.applied ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                      <Clock size={12} />
                      <span>{internship.applicationStatus || 'Under Review'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedInternshipForModal(internship)}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                    >
                      <Send size={13} />
                      <span>Apply for Sabbatical</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE 2: Industrial Training */}
      {activeTab === 'INDUSTRIAL_TRAINING' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Enterprise Industrial Training & Hardware Rigs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deep-dive training on industrial micro-supercomputers, automotive network rigs, and enterprise geospatial clusters.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">
              {trainings.length} Active Tracks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trainings.map((tr) => (
              <div
                key={tr.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      {tr.duration}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {tr.domain}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {tr.title}
                  </h3>

                  <div className="text-xs text-indigo-500 font-semibold flex items-center gap-1">
                    <Award size={13} />
                    <span>{tr.provider}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Facility Access</span>
                    <div className="font-medium text-slate-700 dark:text-slate-300">{tr.labFacility}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Credential: {tr.credentialAwarded}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Curriculum Competencies</span>
                    <div className="flex flex-wrap gap-1">
                      {tr.skillsCovered.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  {tr.enrolled ? (
                    <span className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>{tr.status === 'Completed' ? 'Completed & Certified' : 'Seat Reserved (Enrolled)'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnrollTraining(tr)}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                    >
                      <Award size={13} />
                      <span>Enroll in Industrial Rig</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE 3: Faculty Development Programs (FDP) */}
      {activeTab === 'FDP' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Faculty Development Programs (AICTE / DST Approved)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Accredited pedagogical courses in emerging autonomous mobility, robotics perception, and agentic workflows.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              {fdps.length} FDPs Scheduled
            </span>
          </div>

          <div className="space-y-3">
            {fdps.map((fdp) => (
              <div
                key={fdp.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      {fdp.sponsoringAgency}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {fdp.mode} • {fdp.dates}
                    </span>
                    <span className="text-xs font-bold text-emerald-500">
                      +{fdp.creditsAwarded} National Credits
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
                    {fdp.title}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Key Syllabi Modules:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {fdp.curriculumHighlights.map((ch, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-indigo-500">▪</span>
                          <span>{ch}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  {fdp.registered ? (
                    <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <span>Registration Confirmed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegisterFDP(fdp)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                    >
                      <BookOpen size={13} />
                      <span>Register for FDP</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE 4: Consultancy (Corporate Technical Advisory) */}
      {activeTab === 'CONSULTANCY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Industry Consultancy & Technical Advisory Desk
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monetize deep academic domain expertise. Submit technical advisory proposals on high-value corporate engineering challenges.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {consultancies.length} Active Industry RFPs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {consultancies.map((cons) => (
              <div
                key={cons.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {cons.timeline}
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {cons.budgetValuation}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {cons.title}
                  </h3>

                  <div className="text-xs font-bold text-indigo-500 flex items-center gap-1">
                    <Building2 size={13} />
                    <span>{cons.clientCompany}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Deliverables:</span>
                    {cons.deliverablesSummary.map((d, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {cons.expertiseRequired.map((e) => (
                      <span key={e} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {cons.bidsSubmittedCount} proposals submitted
                  </span>

                  {cons.bidStatus === 'Awarded' ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Awarded to You
                    </span>
                  ) : cons.bidStatus === 'Bid Submitted' ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      Bid Active
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedConsultancyForBid(cons)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md transition-all"
                    >
                      <Send size={12} />
                      <span>Submit Bid</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE 5: Sponsored Research Projects */}
      {activeTab === 'RESEARCH_PROJECTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Sponsored R&D Projects & Grant Portfolios
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track national agency grants (DST, SERB) and corporate co-sponsored innovation laboratories.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              {researchProjects.length} Funded Grants
            </span>
          </div>

          <div className="space-y-4">
            {researchProjects.map((rp) => (
              <div
                key={rp.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                        {rp.projectCode}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {rp.duration}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        {rp.status}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5">
                      {rp.title}
                    </h3>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Sponsor: <span className="text-slate-800 dark:text-slate-200 font-semibold">{rp.sponsoringBody}</span> • Co-PI: {rp.principalInvestigator}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Endowment</span>
                    <div className="text-xl font-black text-cyan-600 dark:text-cyan-400">{rp.totalGrantAmount}</div>
                    <span className="text-xs text-emerald-500 font-semibold">{rp.disbursedAmount}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{rp.currentMilestone}</span>
                    <span className="font-mono font-bold text-cyan-500">{rp.progressPercentage}% Completed</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500" 
                      style={{ width: `${rp.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE 6: Industry Mentorship */}
      {activeTab === 'INDUSTRY_MENTORSHIP' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Faculty & Industry Co-Mentorship Teams
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guide student capstone engineering teams paired with principal corporate engineers.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              {mentorships.length} Active Cohorts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentorships.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {m.teamName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {m.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {m.projectTitle}
                </h3>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Industry Co-Mentor:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {m.industryCoMentor.name} ({m.industryCoMentor.company})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Student Leads:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {m.studentMembers.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Review Cadence:</span>
                    <span className="text-slate-600 dark:text-slate-400">{m.meetingCadence}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Faculty Rating:</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star size={12} className="fill-amber-500" />
                      <span>{m.facultyRating} / 5.0</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <strong>Upcoming Milestone:</strong> {m.nextMilestone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE 7: Institutional Collaboration MoUs */}
      {activeTab === 'COLLABORATION' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                University-Industry Collaboration MoUs & Charters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Institutional partnerships, intellectual property licensing, and joint innovation centers.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-500 border border-teal-500/20">
              {collaborations.length} Active MoUs
            </span>
          </div>

          <div className="space-y-4">
            {collaborations.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-500 border border-teal-500/20">
                        {c.status}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {c.validity}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5">
                      {c.mouTitle}
                    </h3>

                    <div className="text-xs font-semibold text-indigo-500 flex items-center gap-1.5 mt-1">
                      <Building2 size={13} />
                      <span>{c.corporatePartner}</span>
                      <span>•</span>
                      <span>{c.universityDepartment}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Financial Commitment</span>
                    <div className="text-base font-black text-teal-600 dark:text-teal-400">{c.financialCommitment}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {c.scope}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Joint Initiatives:</span>
                  {c.activeInitiatives.map((init, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-teal-500 font-bold">✓</span>
                      <span>{init}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Sabbatical Application Modal */}
      {selectedInternshipForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Apply for Faculty Research Sabbatical
                </h3>
                <span className="text-xs text-slate-400">{selectedInternshipForModal.company}</span>
              </div>
              <button
                onClick={() => setSelectedInternshipForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Position</span>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{selectedInternshipForModal.title}</div>
                <div className="text-emerald-500 font-semibold">{selectedInternshipForModal.honorarium}</div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Research Statement / Proposal Outline</label>
                <textarea
                  rows={4}
                  defaultValue={`I propose to research targetless multi-sensor extrinsic calibration algorithms utilizing continuous point cloud optimization during my 2-month summer term at ${selectedInternshipForModal.company}.`}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedInternshipForModal(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyInternship(selectedInternshipForModal)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send size={13} />
                <span>Submit Sabbatical Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Submit Consultancy Bid Modal */}
      {selectedConsultancyForBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Submit Consultancy Proposal Bid
                </h3>
                <span className="text-xs text-slate-400">{selectedConsultancyForBid.clientCompany}</span>
              </div>
              <button
                onClick={() => setSelectedConsultancyForBid(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Consultancy Assignment</span>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{selectedConsultancyForBid.title}</div>
                <div className="text-emerald-500 font-semibold">{selectedConsultancyForBid.budgetValuation}</div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Methodology & Milestone Breakdown</label>
                <textarea
                  rows={4}
                  value={bidProposalText}
                  onChange={(e) => setBidProposalText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedConsultancyForBid(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitBid(selectedConsultancyForBid)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send size={13} />
                <span>Submit Technical Proposal Bid</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

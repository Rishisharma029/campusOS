import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Sparkles, 
  Target, 
  Users, 
  CheckSquare, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  Handshake, 
  Award, 
  ShieldCheck, 
  Filter, 
  ArrowRight, 
  Calendar, 
  Video, 
  Star, 
  FolderGit2, 
  Code2, 
  TrendingUp, 
  Layers, 
  X, 
  Check, 
  ExternalLink,
  Sliders,
  Send
} from 'lucide-react';
import { 
  IndustryPortalEngine, 
  type IndustryPortalModule, 
  type IndustryCandidate, 
  type IndustryInterview, 
  type CorporateTrainingProgram, 
  type UniversityCollaborationMoU,
  type SkillCriterion
} from '../../lib/industryPortalEngine';
import { 
  InternshipMarketplaceEngine, 
  type MarketplaceOpportunity, 
  type OpportunityCategory 
} from '../../lib/internshipMarketplaceEngine';
import { useToast } from '../../components/ui/Toast';

export const IndustryPortal: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeModule, setActiveModule] = useState<IndustryPortalModule>('CANDIDATE_POOL');

  // Opportunities State
  const [opportunities, setOpportunities] = useState<MarketplaceOpportunity[]>(() => 
    InternshipMarketplaceEngine.getOpportunities()
  );
  const [selectedOppForShortlist, setSelectedOppForShortlist] = useState<MarketplaceOpportunity>(() => opportunities[0]);

  // Candidate Pool Skill-First Search State
  const [selectedSkills, setSelectedSkills] = useState<SkillCriterion[]>([
    { name: 'Python', minLevel: 80 },
    { name: 'React', minLevel: 75 }
  ]);
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(8.0);
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [newSkillInput, setNewSkillInput] = useState<string>('ROS2');

  // Candidate Diagnostics Modal
  const [inspectedCandidate, setInspectedCandidate] = useState<IndustryCandidate | null>(null);

  // Post Opportunity Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [formRole, setFormRole] = useState<string>('');
  const [formType, setFormType] = useState<OpportunityCategory>('Internship');
  const [formCompany, setFormCompany] = useState<string>('Genova Industry Partner');
  const [formDomain, setFormDomain] = useState<string>('Autonomous Systems & AI');
  const [formRequiredSkills, setFormRequiredSkills] = useState<string>('Python, PyTorch, OpenCV');
  const [formMinCgpa, setFormMinCgpa] = useState<number>(7.5);
  const [formDepts, setFormDepts] = useState<string>('Computer Science, Electronics');
  const [formExperience, setFormExperience] = useState<any>('Pre-final / Final Year');
  const [formLocation, setFormLocation] = useState<'Remote' | 'Hybrid' | 'On-Site'>('Hybrid');
  const [formCity, setFormCity] = useState<string>('Bengaluru Technical Hub');
  const [formDuration, setFormDuration] = useState<string>('6 Months (Full-Time)');
  const [formDeadline, setFormDeadline] = useState<string>('Nov 30, 2026');
  const [formComp, setFormComp] = useState<string>('₹45,000 / month + PPO');
  const [formDesc, setFormDesc] = useState<string>('');

  // Interviews State
  const [interviews, setInterviews] = useState<IndustryInterview[]>(() => 
    IndustryPortalEngine.getInterviews()
  );
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [intvCandName, setIntvCandName] = useState<string>('Rishi Sharma');
  const [intvRole, setIntvRole] = useState<string>('Computer Vision Intern');
  const [intvRound, setIntvRound] = useState<string>('Technical Architecture & Code Screen');
  const [intvDate, setIntvDate] = useState<string>('Sep 12, 2026');
  const [intvTime, setIntvTime] = useState<string>('02:00 PM IST');

  // Training & Collaboration State
  const [trainingPrograms] = useState<CorporateTrainingProgram[]>(() => 
    IndustryPortalEngine.getTrainingPrograms()
  );
  const [collaborations] = useState<UniversityCollaborationMoU[]>(() => 
    IndustryPortalEngine.getCollaborations()
  );

  // Skill-first searched candidates
  const candidateResults = useMemo(() => {
    return IndustryPortalEngine.searchCandidatesBySkills({
      skills: selectedSkills,
      minCgpa: minCgpaFilter,
      department: deptFilter,
      gradYear: 'ALL'
    });
  }, [selectedSkills, minCgpaFilter, deptFilter]);

  // AI Shortlist candidates for selected opportunity
  const aiShortlistData = useMemo(() => {
    if (!selectedOppForShortlist) return { shortlisted: [], meanCohortFit: 0, topMatchesCount: 0 };
    return IndustryPortalEngine.runAIShortlist(selectedOppForShortlist);
  }, [selectedOppForShortlist]);

  // Add Skill to Filter
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (selectedSkills.some(s => s.name.toLowerCase() === newSkillInput.trim().toLowerCase())) return;
    setSelectedSkills([...selectedSkills, { name: newSkillInput.trim(), minLevel: 75 }]);
    setNewSkillInput('');
  };

  // Remove Skill from Filter
  const handleRemoveSkill = (skillName: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.name !== skillName));
  };

  // Handle Post Opportunity
  const handlePostOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRole.trim() || !formCompany.trim()) return;

    const skillsArray = formRequiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    const deptsArray = formDepts.split(',').map(d => d.trim()).filter(Boolean);

    const newOpp = InternshipMarketplaceEngine.createOpportunity({
      role: formRole.trim(),
      type: formType,
      company: formCompany.trim(),
      industryDomain: formDomain.trim(),
      requiredSkills: skillsArray,
      eligibility: {
        minCgpa: Number(formMinCgpa),
        eligibleDepartments: deptsArray,
        gradYears: ['2025', '2026', '2027']
      },
      experience: formExperience,
      location: formLocation,
      cityOrMode: formCity.trim(),
      duration: formDuration.trim(),
      deadline: formDeadline.trim(),
      compensation: formComp.trim(),
      description: formDesc.trim() || `Exciting ${formType} role in ${formDomain}.`,
      responsibilities: [
        `Lead technical deliverables for ${formRole}`,
        `Deploy production code with high test coverage`,
        `Collaborate closely with principal architects`
      ],
      learningOutcomes: [
        'Enterprise engineering mentorship',
        'Direct pre-placement offer pathway'
      ],
      featured: true
    });

    setOpportunities(InternshipMarketplaceEngine.getOpportunities());
    setIsPostModalOpen(false);
    toast(
      'Opportunity Published to CampusOS',
      `${newOpp.role} listed in Centralized Marketplace. Ready for AI Matching.`,
      'success'
    );
  };

  // Handle Schedule Interview
  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = IndustryPortalEngine.scheduleInterview({
      candidateName: intvCandName,
      role: intvRole,
      roundTitle: intvRound,
      date: intvDate,
      time: intvTime,
      interviewers: ['Technical Hiring Committee'],
      meetingLink: `https://meet.genova.ai/industry/${intvCandName.toLowerCase().replace(/\s+/g, '-')}`,
      status: 'Scheduled'
    });
    setInterviews([...updated]);
    setIsScheduleModalOpen(false);
    toast(
      'Interview Scheduled',
      `Interview invite sent to ${intvCandName} for ${intvRole}.`,
      'success'
    );
  };

  const MODULE_NAV = [
    { id: 'OVERVIEW', label: 'Overview', icon: Building2 },
    { id: 'POST_OPPORTUNITY', label: 'Post Opportunity', icon: Plus },
    { id: 'SKILL_REQUIREMENTS', label: 'Skill Requirements', icon: Target },
    { id: 'CANDIDATE_POOL', label: 'Candidate Pool', icon: Users, highlight: true },
    { id: 'AI_SHORTLISTING', label: 'AI Shortlisting', icon: Sparkles, highlight: true },
    { id: 'APPLICATIONS', label: 'Applications', icon: CheckSquare },
    { id: 'INTERVIEWS', label: 'Interviews', icon: Video },
    { id: 'MENTORSHIP', label: 'Mentorship', icon: Briefcase },
    { id: 'TRAINING_PROGRAMS', label: 'Training Programs', icon: GraduationCap },
    { id: 'COLLABORATION', label: 'Collaboration & MoUs', icon: Handshake },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Enterprise Industry Portal Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-2xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-3">
            <Building2 size={14} className="text-cyan-400" />
            <span>GENOVA • INDUSTRY & CORPORATE RECRUITER PORTAL</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Industry Dashboard & Talent Ecosystem
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Skill-first talent acquisition platform for enterprise recruiters. Source candidates by cryptographically verified code proficiency and proof-of-work projects, not merely unstructured resumes.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800 text-xs">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <Plus size={14} />
              <span>Post New Opportunity</span>
            </button>
            <button
              onClick={() => navigate('/career/ai-recruiter')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <Sparkles size={14} />
              <span>AI Recruiter (JD Parser & Ranking)</span>
            </button>
            <button
              onClick={() => setActiveModule('CANDIDATE_POOL')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Users size={14} />
              <span>Skill-First Candidate Pool</span>
            </button>
            <button
              onClick={() => navigate('/career/opportunities')}
              className="ml-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <span>View Public Marketplace</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 9-Module Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {MODULE_NAV.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => {
                if (mod.id === 'POST_OPPORTUNITY') {
                  setIsPostModalOpen(true);
                } else {
                  setActiveModule(mod.id as IndustryPortalModule);
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : mod.highlight
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-100'
                  : 'bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
              }`}
            >
              <Icon size={13} />
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: OVERVIEW */}
      {activeModule === 'OVERVIEW' && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Listings</span>
              <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-1">
                {opportunities.length}
              </div>
              <span className="text-[10px] text-blue-500 font-semibold mt-0.5 block">Across 7 Categories</span>
            </div>

            <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Verified Candidate Pool</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                1,450+
              </div>
              <span className="text-[10px] text-emerald-500 font-semibold mt-0.5 block">100% Code Verified</span>
            </div>

            <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Interviews Scheduled</span>
              <div className="text-2xl font-extrabold font-mono text-purple-600 dark:text-purple-400 mt-1">
                {interviews.length}
              </div>
              <span className="text-[10px] text-purple-500 font-semibold mt-0.5 block">Google Meet Synchronized</span>
            </div>

            <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">University MoUs</span>
              <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {collaborations.length} Active
              </div>
              <span className="text-[10px] text-amber-500 font-semibold mt-0.5 block">Sponsored Labs & Grants</span>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div 
              onClick={() => setActiveModule('CANDIDATE_POOL')}
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/30 cursor-pointer hover:scale-102 transition-all space-y-2 text-white"
            >
              <div className="flex items-center justify-between">
                <Users size={20} className="text-cyan-400" />
                <ArrowRight size={14} className="text-slate-400" />
              </div>
              <h3 className="text-base font-extrabold">Skill-First Candidate Discovery</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter students by verified skills (e.g., Python ≥ 80%, React ≥ 90%) and inspect verified proof-of-work repositories.
              </p>
            </div>

            <div 
              onClick={() => setActiveModule('AI_SHORTLISTING')}
              className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 cursor-pointer hover:scale-102 transition-all space-y-2 text-white"
            >
              <div className="flex items-center justify-between">
                <Sparkles size={20} className="text-purple-400" />
                <ArrowRight size={14} className="text-slate-400" />
              </div>
              <h3 className="text-base font-extrabold">Automated AI Shortlisting</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Benchmark the entire student cohort against your custom role requirements and 1-click batch shortlist top candidates.
              </p>
            </div>

            <div 
              onClick={() => setIsPostModalOpen(true)}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 cursor-pointer hover:scale-102 transition-all space-y-2 text-white"
            >
              <div className="flex items-center justify-between">
                <Plus size={20} className="text-emerald-400" />
                <ArrowRight size={14} className="text-slate-400" />
              </div>
              <h3 className="text-base font-extrabold">Post an Industry Opportunity</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Launch internships, research projects, apprenticeships, full-time jobs, workshops, mentorships, or training cohorts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: CANDIDATE POOL (Skill-First Candidate Discovery) */}
      {activeModule === 'CANDIDATE_POOL' && (
        <div className="space-y-6 animate-fade-in">
          {/* Skill-First Filter Command Center */}
          <div className="p-5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  Skill-First Talent Search
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sliders size={16} className="text-blue-600" />
                  <span>Filter by Verified Skills & Competencies (Not Merely Resumes)</span>
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Found <strong>{candidateResults.length}</strong> matching candidates
              </span>
            </div>

            {/* Active Skill Filters */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Required Skill Competencies (with Minimum Verified Proficiency %):
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {selectedSkills.map((sk) => (
                  <div
                    key={sk.name}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center gap-2 text-xs"
                  >
                    <span className="font-bold text-blue-700 dark:text-blue-300">{sk.name}</span>
                    <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">≥ {sk.minLevel}%</span>
                    <button
                      onClick={() => handleRemoveSkill(sk.name)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {/* Add Skill Pill */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Add skill (e.g. ROS2, PostGIS)..."
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-44"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Threshold Controls */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Min CGPA:</span>
                {[7.0, 7.5, 8.0, 8.5, 9.0].map((c) => (
                  <button
                    key={c}
                    onClick={() => setMinCgpaFilter(c)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
                      minCgpaFilter === c
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    ≥ {c}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-slate-500 font-semibold">Department:</span>
                {['ALL', 'Computer Science', 'Information Tech.', 'Electronics'].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setDeptFilter(dept)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-all ${
                      deptFilter === dept
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {candidateResults.map((cand) => (
              <div
                key={cand.id}
                className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-blue-400 transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Name, CGPA, Match Score */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {cand.name}
                        </h4>
                        <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold">
                          ✓ Passport Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {cand.degree} • Batch {cand.batch}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-extrabold flex items-center gap-1">
                        <Sparkles size={11} />
                        <span>Skill Fit: {cand.matchScore}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        CGPA: {cand.cgpa}
                      </span>
                    </div>
                  </div>

                  {/* Verified Skills Grid */}
                  <div className="mt-3 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Verified Technical Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.skills.map((sk) => {
                        const isQuerySkill = selectedSkills.some(s => s.name.toLowerCase() === sk.name.toLowerCase());
                        return (
                          <span
                            key={sk.name}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 ${
                              isQuerySkill
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{sk.name}</span>
                            <span>{sk.level}%</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Featured Proof-of-Work Projects */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Verified Projects & Repositories:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {cand.featuredProjects.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Quick Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    Readiness: <strong>{cand.careerReadiness}%</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectedCandidate(cand)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Inspect Skills
                    </button>
                    <button
                      onClick={() => {
                        setIntvCandName(cand.name);
                        setIsScheduleModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Video size={12} />
                      <span>Schedule Interview</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 3: AI SHORTLISTING */}
      {activeModule === 'AI_SHORTLISTING' && (
        <div className="space-y-6 animate-fade-in">
          {/* Opportunity Selector */}
          <div className="p-5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  Automated Candidate Shortlisting
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Select Target Opportunity to Benchmark Cohort:
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedOppForShortlist.id}
                  onChange={(e) => {
                    const match = opportunities.find(o => o.id === e.target.value);
                    if (match) setSelectedOppForShortlist(match);
                  }}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  {opportunities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.role} ({o.type} • {o.company})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    toast('Batch Shortlist Executed', `Top ${aiShortlistData.topMatchesCount} candidates fast-tracked to Interview Stage.`, 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Batch Shortlist Top Candidates
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Required Skills for {selectedOppForShortlist.role}: </span>
                <strong className="text-blue-600 dark:text-blue-400">
                  {selectedOppForShortlist.requiredSkills.join(', ')}
                </strong>
              </div>
              <span className="font-mono text-slate-500">
                Mean Cohort Fit: <strong>{aiShortlistData.meanCohortFit}%</strong>
              </span>
            </div>
          </div>

          {/* Shortlisted Candidates Leaderboard */}
          <div className="space-y-3">
            {aiShortlistData.shortlisted.map((cand, idx) => (
              <div
                key={cand.id}
                className="bg-surface dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start md:items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-sm text-slate-600 dark:text-slate-300 shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{cand.name}</h4>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                        CGPA: {cand.cgpa}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                      <span className="text-emerald-600 font-semibold">
                        Why: {cand.matchedSkills?.join(', ') || 'Skills match'}
                      </span>
                      {cand.missingSkills && cand.missingSkills.length > 0 && (
                        <span className="text-amber-600 font-semibold">
                          • Gaps: {cand.missingSkills.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-mono font-extrabold text-blue-600 dark:text-blue-400">
                      {cand.matchScore}% Match
                    </span>
                    <span className="text-[10px] text-slate-400 block">AI Verified</span>
                  </div>

                  <button
                    onClick={() => {
                      setIntvCandName(cand.name);
                      setIntvRole(selectedOppForShortlist.role);
                      setIsScheduleModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Invite / Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: SKILL REQUIREMENTS */}
      {activeModule === 'SKILL_REQUIREMENTS' && (
        <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Industry Skill Taxonomy & Benchmark Standards
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Define standardized criteria and weights for candidate role matching across CampusOS.
              </p>
            </div>
            <button
              onClick={() => navigate('/career/industry-mapping')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs cursor-pointer"
            >
              Open Full Taxonomy Mapper
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-extrabold text-blue-600 uppercase text-[11px] block">Autonomous Robotics</span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• ROS2 Humble DDS (Req: ≥ 75%)</li>
                <li>• Nav2 Costmap Inflation (Req: ≥ 75%)</li>
                <li>• 3D LiDAR SLAM (Req: ≥ 70%)</li>
                <li>• CAN Bus Telemetry (Req: ≥ 70%)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-extrabold text-purple-600 uppercase text-[11px] block">Computer Vision & Edge AI</span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• Python Scientific Stack (Req: ≥ 80%)</li>
                <li>• OpenCV Feature Tracking (Req: ≥ 75%)</li>
                <li>• PyTorch / TensorRT INT8 (Req: ≥ 70%)</li>
                <li>• Edge Deployment (Req: ≥ 65%)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-extrabold text-emerald-600 uppercase text-[11px] block">Full Stack & Systems</span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• React 19 & TypeScript (Req: ≥ 80%)</li>
                <li>• Node.js / FastAPI (Req: ≥ 75%)</li>
                <li>• SQL Index Optimization (Req: ≥ 70%)</li>
                <li>• Automated Testing & CI/CD (Req: ≥ 70%)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: APPLICATIONS & INTERVIEWS */}
      {activeModule === 'INTERVIEWS' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Video size={16} className="text-blue-600" />
              <span>Scheduled Technical Interview Rounds</span>
            </h3>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={13} />
              <span>Schedule New Interview</span>
            </button>
          </div>

          <div className="space-y-3">
            {interviews.map((intv) => (
              <div
                key={intv.id}
                className="bg-surface dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{intv.candidateName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-blue-600 font-semibold">{intv.role}</span>
                    <span className="px-2 py-0.2 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[10px] font-bold">
                      {intv.status}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Round: <strong>{intv.roundTitle}</strong> • Time: {intv.date} ({intv.time})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={intv.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5"
                  >
                    <Video size={12} />
                    <span>Join Google Meet</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 6: MENTORSHIP & TRAINING */}
      {activeModule === 'TRAINING_PROGRAMS' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap size={16} className="text-purple-600" />
              <span>Sponsored Corporate Training Programs & Hardware Rigs</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {trainingPrograms.map((tp) => (
              <div
                key={tp.id}
                className="bg-surface dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1 text-[10px]">
                    <span className="font-bold text-purple-600 uppercase">{tp.domain}</span>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">{tp.status}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{tp.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">Company: {tp.company} • Duration: {tp.duration}</p>
                  
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>Sponsored Rig:</strong> {tp.sponsoredHardwareRig}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
                  <span>Enrolled: <strong>{tp.enrolledStudentsCount} Students</strong></span>
                  <span className="text-blue-600 font-bold">{tp.credentialIssued.split(' ')[0]} Credential</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: COLLABORATION & MOUS */}
      {activeModule === 'COLLABORATION' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Handshake size={16} className="text-amber-500" />
              <span>University-Industry Research MoUs & Capstone Grants</span>
            </h3>
          </div>

          <div className="space-y-4">
            {collaborations.map((collab) => (
              <div
                key={collab.id}
                className="bg-surface dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                      {collab.type}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {collab.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Partner: <strong>{collab.company}</strong> • University: {collab.universityDepartment}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      {collab.grantAmount}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Valid: {collab.validUntil}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Charter Deliverables:
                  </span>
                  {collab.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                      <Check size={12} className="text-emerald-500" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSPECT CANDIDATE MODAL */}
      {inspectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{inspectedCandidate.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">✓ Verified</span>
                </div>
                <p className="text-slate-500 mt-0.5">{inspectedCandidate.degree} • CGPA: {inspectedCandidate.cgpa}</p>
              </div>
              <button onClick={() => setInspectedCandidate(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Verified Skills Breakdown:</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {inspectedCandidate.skills.map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</span>
                    <span className="font-mono font-bold text-blue-600">{s.level}% Verified</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-white font-mono text-[10px] break-all">
              Passport Verification Hash: {inspectedCandidate.passportHash}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setInspectedCandidate(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold cursor-pointer">
                Close
              </button>
              <button
                onClick={() => {
                  setIntvCandName(inspectedCandidate.name);
                  setIsScheduleModalOpen(true);
                  setInspectedCandidate(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <form onSubmit={handleScheduleInterview} className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Schedule Technical Interview
              </h3>
              <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={intvCandName}
                  onChange={(e) => setIntvCandName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Position / Role</label>
                <input
                  type="text"
                  value={intvRole}
                  onChange={(e) => setIntvRole(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Round Title</label>
                <input
                  type="text"
                  value={intvRound}
                  onChange={(e) => setIntvRound(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Date</label>
                  <input
                    type="text"
                    value={intvDate}
                    onChange={(e) => setIntvDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Time</label>
                  <input
                    type="text"
                    value={intvTime}
                    onChange={(e) => setIntvTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer">
                Confirm Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POST OPPORTUNITY MODAL (ALL 7 TYPES & 8 MANDATORY FIELDS) */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <form onSubmit={handlePostOpportunity} className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Post New Opportunity (Industry Portal)
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Publish across 7 categories with standardized 8-field skill contract.
                </p>
              </div>
              <button type="button" onClick={() => setIsPostModalOpen(false)} className="p-1 text-slate-400 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-slate-500 font-semibold block mb-1">Role Title</label>
                <input
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="e.g. Computer Vision Intern"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Opportunity Type (7 Tiers)</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as OpportunityCategory)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  <option value="Internship">Internship</option>
                  <option value="Project">Project</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                  <option value="Job">Job</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Mentorship">Mentorship</option>
                  <option value="Training">Training</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-500 font-semibold block mb-1">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={formRequiredSkills}
                  onChange={(e) => setFormRequiredSkills(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Min CGPA Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  value={formMinCgpa}
                  onChange={(e) => setFormMinCgpa(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Location / Remote Mode</label>
                <select
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-Site">On-Site</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Duration</label>
                <input
                  type="text"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">Deadline</label>
                <input
                  type="text"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-500 font-semibold block mb-1">Stipend / Package</label>
                <input
                  type="text"
                  value={formComp}
                  onChange={(e) => setFormComp(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-500 font-semibold block mb-1">Role Description & Responsibilities</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe project deliverables, team context, and expected technical ownership..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setIsPostModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-md">
                Publish Opportunity
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

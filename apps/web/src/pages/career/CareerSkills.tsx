import React, { useState } from 'react';
import { 
  Award, 
  Cpu, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Zap, 
  Sparkles,
  Layers,
  Code2,
  BrainCircuit,
  GraduationCap,
  Briefcase,
  FolderGit2,
  FileCheck,
  Download,
  ExternalLink,
  Plus,
  Compass,
  Star,
  Clock,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  Send,
  UserCheck,
  Target,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check
} from 'lucide-react';
import { 
  StudentSkillIntelligenceEngine, 
  type StudentSkillProfile, 
  type AssessmentQuestion, 
  type AssessmentType, 
  type DifficultyLevel, 
  type AssessmentResult,
  ASSESSMENT_QUESTIONS
} from '../../lib/studentSkillIntelligenceEngine';
import { 
  PersonalizedLearningEngine, 
  type PersonalizedRoadmapState 
} from '../../lib/personalizedLearningEngine';
import { useToast } from '../../components/ui/Toast';

export const CareerSkills: React.FC = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentSkillProfile>(() => StudentSkillIntelligenceEngine.getProfile());
  const [activeMainTab, setActiveMainTab] = useState<'PROFILE' | 'ASSESSMENT' | 'GAP_ENGINE' | 'LEARNING_ROADMAP' | 'RESUME' | 'VERIFIED_RECORDS'>('PROFILE');
  const [profileSubTab, setProfileSubTab] = useState<'ALL' | 'ACADEMIC' | 'TECHNICAL' | 'SOFT' | 'PROJECTS' | 'INTERNSHIPS' | 'ACHIEVEMENTS' | 'CAREER'>('ALL');

  // Personalized Learning Roadmap State
  const [roadmapState, setRoadmapState] = useState<PersonalizedRoadmapState>(() => PersonalizedLearningEngine.getState());
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState<boolean>(false);

  // Target Career & Skill Gap State
  const [selectedTargetCareerId, setSelectedTargetCareerId] = useState<string>('software-engineer');
  const targetCareers = React.useMemo(() => StudentSkillIntelligenceEngine.getTargetCareers(), []);
  const gapAnalysis = React.useMemo(() => {
    return StudentSkillIntelligenceEngine.calculateSkillGap(profile, selectedTargetCareerId);
  }, [profile, selectedTargetCareerId]);
  
  // Assessment Engine State
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('technical');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [roleFilter, setRoleFilter] = useState<string>('Autonomous Vehicle Systems Engineer');
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals for adding items
  const [isAddSkillOpen, setIsAddSkillOpen] = useState<boolean>(false);
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillCategory, setNewSkillCategory] = useState<any>('Autonomous Systems');
  const [newSkillLevel, setNewSkillLevel] = useState<number>(80);

  // Active Questions for Current Assessment
  const activeQuestions = React.useMemo(() => {
    return StudentSkillIntelligenceEngine.getQuestions(
      assessmentType,
      difficulty,
      assessmentType === 'role-specific' ? roleFilter : undefined
    );
  }, [assessmentType, difficulty, roleFilter]);

  const handleStartAssessment = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setAssessmentResult(null);
    setIsTestActive(true);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Submit assessment
      const result = StudentSkillIntelligenceEngine.evaluateAssessment(
        assessmentType,
        difficulty,
        userAnswers,
        activeQuestions
      );
      setAssessmentResult(result);
      setIsTestActive(false);
      setProfile(StudentSkillIntelligenceEngine.getProfile());
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const updated = StudentSkillIntelligenceEngine.addTechnicalSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: Number(newSkillLevel),
      verified: false
    });
    setProfile(updated);
    setNewSkillName('');
    setIsAddSkillOpen(false);
  };

  const handleCompleteWeek4 = () => {
    const updated = PersonalizedLearningEngine.completeWeek4Challenge(88);
    setRoadmapState(updated);
    const currentProf = StudentSkillIntelligenceEngine.getProfile();
    const dsaSkill = currentProf.technicalSkills.find(
      s => s.name.toLowerCase().includes('dsa') || s.name.toLowerCase().includes('data structures')
    );
    if (dsaSkill) {
      dsaSkill.level = 68;
      dsaSkill.confidenceScore = 75;
      dsaSkill.verified = true;
    }
    currentProf.overallReadinessScore = 78;
    StudentSkillIntelligenceEngine.saveProfile(currentProf);
    setProfile(currentProf);
    setIsChallengeModalOpen(false);
    toast(
      'Readiness Recalculated!',
      'Week 4 Interview Challenge passed! DSA elevated from 43% to 68%. Overall Career Readiness updated: 71% ➔ 78%!',
      'success'
    );
  };

  const handleResetWeek4 = () => {
    const reset = PersonalizedLearningEngine.resetProgress();
    setRoadmapState(reset);
    const currentProf = StudentSkillIntelligenceEngine.getProfile();
    const dsaSkill = currentProf.technicalSkills.find(
      s => s.name.toLowerCase().includes('dsa') || s.name.toLowerCase().includes('data structures')
    );
    if (dsaSkill) {
      dsaSkill.level = 43;
      dsaSkill.confidenceScore = 48;
      dsaSkill.verified = false;
    }
    currentProf.overallReadinessScore = 71;
    StudentSkillIntelligenceEngine.saveProfile(currentProf);
    setProfile(currentProf);
    toast('Roadmap Reset', 'Simulation reset to baseline state (71% readiness, DSA at 43%).', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Student Skill Intelligence Command */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
            <Sparkles size={14} className="text-cyan-400" />
            <span>GENOVA • STUDENT SKILL INTELLIGENCE CORE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Student Skill Intelligence & AI Assessment Engine
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            The heart of CampusOS: comprehensive academic profile, verified technical & soft competencies, proof-of-work engineering repositories, and interactive AI assessment questionnaires.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Readiness</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{profile.overallReadinessScore} / 100</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Verified Badges</span>
              <span className="text-lg font-black text-blue-400 font-mono">{profile.verifiedRecords.length} Active</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Academic Standing</span>
              <span className="text-xs font-bold text-amber-300 truncate block mt-1">{profile.academic.academicStanding}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Cumulative CGPA</span>
              <span className="text-lg font-black text-purple-300 font-mono">{profile.academic.cgpa} / 10</span>
            </div>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'PROFILE', label: '1. Student Skill Profile', icon: GraduationCap },
          { id: 'ASSESSMENT', label: '2. AI Skill Assessment Engine', icon: BrainCircuit },
          { id: 'GAP_ENGINE', label: '3. Skill Profile + Skill Gap Engine', icon: Target },
          { id: 'LEARNING_ROADMAP', label: '4. Dynamic Learning Roadmap', icon: Compass },
          { id: 'RESUME', label: '5. ATS Resume Studio', icon: FileCheck },
          { id: 'VERIFIED_RECORDS', label: '6. Institutional Records', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeMainTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPLETE STUDENT PROFILE */}
      {activeMainTab === 'PROFILE' && (
        <div className="space-y-6">
          {/* Profile Filter Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'Complete View' },
                { id: 'ACADEMIC', label: 'Academic' },
                { id: 'TECHNICAL', label: 'Technical Skills' },
                { id: 'SOFT', label: 'Soft Skills' },
                { id: 'PROJECTS', label: 'Projects' },
                { id: 'INTERNSHIPS', label: 'Internships' },
                { id: 'ACHIEVEMENTS', label: 'Achievements' },
                { id: 'CAREER', label: 'Career Interests' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfileSubTab(p.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    profileSubTab === p.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddSkillOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus size={14} /> Add Skill
              </button>
            </div>
          </div>

          {/* 1. Academic Profile Card */}
          {(profileSubTab === 'ALL' || profileSubTab === 'ACADEMIC') && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Academic Profile</h3>
                    <span className="text-[11px] text-slate-400">Institutional records verified by University Registrar</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active Enrolled
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-750">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Degree & Major</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{profile.academic.degree}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-750">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Semester & Batch</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">Sem {profile.academic.currentSemester} ({profile.academic.batch})</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-750">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Credits & Attendance</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{profile.academic.totalCredits} Credits • {profile.academic.attendanceRate}% Attd</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-750">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Cumulative CGPA</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm block mt-0.5">{profile.academic.cgpa} / 10.0</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Technical Skills Matrix with AI Confidence */}
          {(profileSubTab === 'ALL' || profileSubTab === 'TECHNICAL') && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                    <Cpu size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Technical Skills & AI Confidence Radar</h3>
                    <span className="text-[11px] text-slate-400">Validated via automated code analysis & AI skill assessments</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">{profile.technicalSkills.length} Verified Competencies</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.technicalSkills.map((skill) => (
                  <div key={skill.id} className="p-3.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{skill.name}</span>
                        {skill.verified && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{skill.level}%</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: `${skill.level}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Category: <strong className="text-slate-600 dark:text-slate-300">{skill.category}</strong></span>
                      <span className="text-indigo-500 font-semibold font-mono">Confidence: {skill.confidenceScore}%</span>
                    </div>
                    {skill.proofProject && (
                      <div className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        Project Proof: <strong>{skill.proofProject}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Soft Skills & Situational Intelligence */}
          {(profileSubTab === 'ALL' || profileSubTab === 'SOFT') && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Soft Skills & Situational Judgment</h3>
                    <span className="text-[11px] text-slate-400">Evaluated through behavioral tests, peer 360 reviews, and capstone leadership</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.softSkills.map((s) => (
                  <div key={s.id} className="p-4 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{s.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${s.score}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.feedback}</p>
                    <span className="text-[10px] text-slate-400 block mt-2">Source: {s.assessedVia}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Certifications & Credentials */}
          {(profileSubTab === 'ALL' || profileSubTab === 'TECHNICAL') && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Industry Certifications & Credentials</h3>
                    <span className="text-[11px] text-slate-400">Cryptographically verifiable badges from global technology providers</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.certifications.map((c) => (
                  <div key={c.id} className="p-4 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">{c.issuer}</span>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{c.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 block mt-1">ID: {c.credentialId} • Issued: {c.issueDate}</span>
                    </div>
                    <a
                      href={c.verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-750 hover:bg-blue-600 hover:text-white text-[10px] font-semibold text-slate-700 dark:text-slate-300 transition-colors shrink-0 flex items-center gap-1"
                    >
                      Verify <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Engineering Projects */}
          {(profileSubTab === 'ALL' || profileSubTab === 'PROJECTS') && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <FolderGit2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Engineering Projects & Proof-of-Work</h3>
                    <span className="text-[11px] text-slate-400">Deployed repositories, system benchmarks, and hardware validations</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {profile.projects.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.title}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {p.role}
                        </span>
                      </div>
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 font-mono">
                          Code Repo <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{p.description}</p>
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      ★ Proof-of-Work: {p.highlight}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {p.techStack.map((t) => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Internships & Work Experience */}
          {(profileSubTab === 'ALL' || profileSubTab === 'INTERNSHIPS') && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Industry Internships & Practical Experience</h3>
                    <span className="text-[11px] text-slate-400">Supervised work terms with verified deliverable assessments</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {profile.internships.map((intern) => (
                  <div key={intern.id} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{intern.role}</h4>
                        <span className="text-xs text-slate-500 font-semibold">{intern.company} • {intern.location}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 font-mono block">{intern.duration}</span>
                        <span className="text-xs font-bold text-amber-500 flex items-center justify-end gap-1">
                          <Star size={12} className="fill-amber-500" /> {intern.mentorRating} / 5.0
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4">
                      {intern.keyDeliverables.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Achievements & Honors */}
          {(profileSubTab === 'ALL' || profileSubTab === 'ACHIEVEMENTS') && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Honors, Patents & Publications</h3>
                    <span className="text-[11px] text-slate-400">Competitive excellence records and research milestones</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.achievements.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">{ach.category} ({ach.year})</span>
                      <span className="text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
                        {ach.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{ach.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Career Interests & Role Aspirations */}
          {(profileSubTab === 'ALL' || profileSubTab === 'CAREER') && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                    <Target size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Career Interests & Target Industry Profiles</h3>
                    <span className="text-[11px] text-slate-400">AI-matched role preferences and placement aspirations</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-750">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Target Engineering Roles</span>
                  <div className="space-y-1">
                    {profile.careerInterests.targetRoles.map((r) => (
                      <span key={r} className="block font-semibold text-slate-800 dark:text-slate-200">• {r}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-750">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Target Companies & Labs</span>
                  <div className="space-y-1">
                    {profile.careerInterests.dreamCompanies.map((c) => (
                      <span key={c} className="block font-semibold text-slate-800 dark:text-slate-200">• {c}</span>
                    ))}
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-750">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Expected Compensation & Geo</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{profile.careerInterests.expectedCtcRange}</span>
                  <span className="text-slate-500 text-[11px] block mt-1">Locations: {profile.careerInterests.preferredLocations.join(', ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI SKILL ASSESSMENT ENGINE */}
      {activeMainTab === 'ASSESSMENT' && (
        <div className="space-y-6">
          {/* Assessment Configuration Bar */}
          {!isTestActive && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BrainCircuit size={20} className="text-blue-500" />
                  Configure AI Skill Assessment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Evaluates candidate proficiency through interactive technical code questions, quantitative & logical aptitude tests, and soft-skill situational judgment scenarios.
                </p>
              </div>

              {/* Assessment Type Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Select Assessment Track:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'technical', title: 'Technical Assessment', desc: 'Algorithms, ROS2, ML, GIS & Systems' },
                    { id: 'aptitude', title: 'General Aptitude', desc: 'Quantitative, Spatial Logic & Reasoning' },
                    { id: 'soft-skill', title: 'Soft-Skill & Leadership', desc: 'Situational Judgment & Team Ethics' },
                    { id: 'role-specific', title: 'Role-Specific Test', desc: 'AV Engineer & Land GIS Specialist' },
                  ].map((track) => (
                    <div
                      key={track.id}
                      onClick={() => setAssessmentType(track.id as any)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        assessmentType === track.id
                          ? 'bg-blue-50/70 dark:bg-slate-800 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                          : 'bg-slate-50/50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block mb-1">
                          {track.title}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {track.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Level & Role Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Difficulty Level:
                  </label>
                  <div className="flex items-center gap-2">
                    {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as DifficultyLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setDifficulty(lvl)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          difficulty === lvl
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {assessmentType === 'role-specific' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Target Role Profile:
                    </label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Autonomous Vehicle Systems Engineer">Autonomous Vehicle Systems Engineer</option>
                      <option value="Geospatial AI & Land Intelligence Specialist">Geospatial AI & Land Intelligence Specialist</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Launch Assessment CTA */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Questions in active pool: <strong className="text-slate-800 dark:text-slate-200">{activeQuestions.length} questions</strong> • Timed simulation with AI Skill Confidence computation
                </div>
                <button
                  onClick={handleStartAssessment}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all flex items-center gap-2"
                >
                  <Zap size={14} /> Start Assessment Now
                </button>
              </div>
            </div>
          )}

          {/* Active Assessment Runner */}
          {isTestActive && activeQuestions.length > 0 && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-5">
              {/* Question Progress Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono">
                    Question {currentQuestionIndex + 1} of {activeQuestions.length}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Domain: <strong className="text-slate-700 dark:text-slate-300">{activeQuestions[currentQuestionIndex].domain}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    {difficulty}
                  </span>
                </div>
              </div>

              {/* Question Body */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {activeQuestions[currentQuestionIndex].question}
                </h3>

                {activeQuestions[currentQuestionIndex].codeSnippet && (
                  <pre className="p-3.5 rounded-lg bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
                    <code>{activeQuestions[currentQuestionIndex].codeSnippet}</code>
                  </pre>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {activeQuestions[currentQuestionIndex].options.map((option, idx) => {
                  const isSelected = userAnswers[activeQuestions[currentQuestionIndex].id] === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleAnswerSelect(activeQuestions[currentQuestionIndex].id, idx)}
                      className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                          isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-surface dark:bg-slate-900 border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && <CheckCircle size={14} className="text-blue-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setIsTestActive(false)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-semibold"
                >
                  Cancel Assessment
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={userAnswers[activeQuestions[currentQuestionIndex].id] === undefined}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  {currentQuestionIndex === activeQuestions.length - 1 ? 'Complete & Score' : 'Next Question'}
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Assessment Results Card */}
          {assessmentResult && (
            <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/20 mb-2">
                    <CheckCircle2 size={12} /> Evaluation Successfully Completed & Recorded
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    AI Assessment Results & Competency Audit
                  </h3>
                  <span className="text-xs text-slate-400">{assessmentResult.completedAt} • Tier: {assessmentResult.difficulty}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">{assessmentResult.percentage}%</span>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Confidence</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{assessmentResult.skillConfidence}%</span>
                  </div>
                </div>
              </div>

              {/* Breakdown by Domain */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-750">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                    Verified Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {assessmentResult.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-750">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-2">
                    Actionable Growth Recommendations
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {assessmentResult.recommendations.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Target size={12} className="text-amber-500 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Verified hash automatically appended to candidate institutional transcript.
                </span>
                <button
                  onClick={() => setActiveMainTab('PROFILE')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Return to Student Profile →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SKILL PROFILE + SKILL GAP ENGINE */}
      {activeMainTab === 'GAP_ENGINE' && (
        <div className="space-y-6">
          {/* 1. PIPELINE WORKFLOW DIAGRAM */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    Automated Continuous Pipeline
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Assessment ➔ Skill Extraction ➔ Gap Engine Workflow
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Pipeline v2.6 • Real-Time Synchronization
              </span>
            </div>

            {/* Stepper Pipeline Flow */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 relative">
              {[
                { step: '01', title: 'Assessment', subtitle: 'Aptitude & Technical Qs', icon: HelpCircle, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60' },
                { step: '02', title: 'Skill Extraction', subtitle: 'AI Proof Analysis', icon: BrainCircuit, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60' },
                { step: '03', title: 'Current Skill Profile', subtitle: 'Verified Competencies', icon: Layers, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/60' },
                { step: '04', title: 'Target Career', subtitle: 'Industry Benchmark', icon: Target, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-900/60' },
                { step: '05', title: 'Industry Requirement', subtitle: 'Market Competencies', icon: Briefcase, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60' },
                { step: '06', title: 'Gap Analysis', subtitle: 'Readiness & Actions', icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60' },
              ].map((node, idx, arr) => {
                const IconComponent = node.icon;
                return (
                  <div key={node.step} className="relative flex flex-col">
                    <div className={`p-3 rounded-xl border flex flex-col justify-between h-full transition-all hover:scale-[1.02] ${node.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold opacity-60">STAGE {node.step}</span>
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{node.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{node.subtitle}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. TARGET CAREER SELECTION & KPI GAUGES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Target Role Selector Card */}
            <div className="lg:col-span-2 bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    TARGET CAREER BENCHMARK
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Select Target Industry Role
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Benchmark:</span>
                  <select
                    value={selectedTargetCareerId}
                    onChange={(e) => setSelectedTargetCareerId(e.target.value)}
                    className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {targetCareers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Role Meta Details */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      TARGET: {gapAnalysis.targetRole.title.toUpperCase()}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {gapAnalysis.targetRole.industryDemand || gapAnalysis.targetRole.marketDemand} Demand
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                    {gapAnalysis.targetRole.description}
                  </p>
                </div>

                <div className="flex sm:flex-col justify-between sm:items-end gap-1 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Industry Compensation</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {gapAnalysis.targetRole.avgSalaryBenchmark || gapAnalysis.targetRole.averageSalary}
                  </span>
                </div>
              </div>

              {/* Role Toggle Quick Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {targetCareers.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedTargetCareerId(role.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedTargetCareerId === role.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{role.title}</span>
                    {selectedTargetCareerId === role.id && <CheckCircle2 size={13} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Readiness Gauge & KPI Box */}
            <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    COMPUTED READINESS INDEX
                  </span>
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                    <TrendingUp size={13} />
                    Verified
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                  Overall Target Readiness
                </h4>
              </div>

              {/* Big Readiness Percentage Display */}
              <div className="py-2 text-center">
                <div className="inline-flex flex-col items-center justify-center">
                  <div className="text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight font-display">
                    {gapAnalysis.overallReadiness}%
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <AlertTriangle size={12} />
                    <span>{gapAnalysis.readinessStatus}</span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-500 block">Met Skills</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {gapAnalysis.metSkillsCount} / {gapAnalysis.totalRequiredCount}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-500 block">Critical Gaps</span>
                  <span className="text-sm font-bold text-rose-600">
                    {gapAnalysis.criticalGaps.length} Areas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CURRENT SKILLS VS INDUSTRY REQUIREMENT MATRIX (Exact Match to User Requirement) */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  SKILL PROFILE COMPARISON MATRIX
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Current Skills vs Industry Requirement
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target: <strong className="text-slate-800 dark:text-slate-200">{gapAnalysis.targetRole.title}</strong> • Direct mapping of verified student proficiency against real-world technical thresholds.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveMainTab('ASSESSMENT');
                  setAssessmentType('technical');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm self-start shrink-0"
              >
                <Zap size={14} />
                <span>Take Assessment to Improve</span>
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Skill Name</th>
                    <th className="py-3.5 px-4 text-center">Current Skills</th>
                    <th className="py-3.5 px-4 text-center">Industry Requirement</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Gap Delta</th>
                    <th className="py-3.5 px-6">Industry Rationale & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {gapAnalysis.skillsBreakdown.map((item) => {
                    const isMet = item.status === 'MET';
                    return (
                      <tr key={item.skillName} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Skill Name */}
                        <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{item.skillName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              item.importance === 'critical'
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/60'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              {item.importance}
                            </span>
                          </div>
                        </td>

                        {/* Current Skill Score */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-mono font-extrabold text-sm ${
                              item.currentScore === 0 
                                ? 'text-slate-400' 
                                : isMet 
                                  ? 'text-emerald-600 dark:text-emerald-400' 
                                  : 'text-amber-600 dark:text-amber-400'
                            }`}>
                              {item.currentScore > 0 ? `${item.currentScore}%` : 'Not Assessed (0%)'}
                            </span>
                            <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                              <div
                                className={`h-full rounded-full ${
                                  isMet ? 'bg-emerald-500' : item.currentScore === 0 ? 'bg-transparent' : 'bg-amber-500'
                                }`}
                                style={{ width: `${item.currentScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Industry Requirement */}
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-700 dark:text-slate-300">
                            Min {item.requiredThreshold}%
                          </span>
                        </td>

                        {/* Status (✓ vs ⚠) */}
                        <td className="py-4 px-4 text-center">
                          {isMet ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 size={13} className="text-emerald-600" />
                              <span>✓</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <AlertTriangle size={13} className="text-amber-600" />
                              <span>⚠</span>
                            </span>
                          )}
                        </td>

                        {/* Gap Delta */}
                        <td className="py-4 px-4 text-center">
                          {isMet ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold text-xs">
                              +{item.currentScore - item.requiredThreshold}% (Surplus)
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-xs">
                              -{item.gapDelta}% (Deficit)
                            </span>
                          )}
                        </td>

                        {/* Industry Rationale & Action */}
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400 text-xs">
                          <div>{item.industryRationale}</div>
                          {!isMet && (
                            <button
                              onClick={() => {
                                setActiveMainTab('ASSESSMENT');
                                setAssessmentType('technical');
                              }}
                              className="text-blue-600 hover:text-blue-500 font-semibold text-[11px] mt-1 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Launch Diagnostic Test</span>
                              <ArrowRight size={11} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. CRITICAL GAPS CALLOUT BOX (Exact User Match) */}
          <div className="bg-gradient-to-br from-rose-50/70 via-slate-50 to-amber-50/50 dark:from-rose-950/20 dark:via-slate-900 dark:to-amber-950/20 rounded-2xl border-2 border-rose-200/80 dark:border-rose-900/60 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 dark:border-rose-900/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Critical Gaps Identified
                  </h3>
                  <p className="text-xs text-slate-500">
                    Priority technical shortfalls requiring immediate remediation to unlock role eligibility.
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-rose-600 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-lg self-start">
                {gapAnalysis.criticalGaps.length} Priority Deficits
              </div>
            </div>

            {/* Numbered Critical Gaps List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {gapAnalysis.criticalGaps.map((gap) => (
                <div
                  key={gap.skillName}
                  className="bg-surface dark:bg-slate-900 rounded-xl border border-rose-200/60 dark:border-rose-900/50 p-4.5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {gap.rank}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {gap.skillName}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-900/60">
                      Deficit: -{gap.gapDeficit}%
                    </span>
                  </div>

                  {/* Score breakdown metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Current Level</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {gap.currentLevel}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Required Threshold</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {gap.requiredLevel}%
                      </span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {gap.recommendedAction}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-500 font-mono">
                      ⏱ Est. Close Time: <strong>{gap.estimatedTimeToClose}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setActiveMainTab('ASSESSMENT');
                        setAssessmentType('technical');
                      }}
                      className="text-blue-600 hover:text-blue-500 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Start Lab</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. REMEDIATION ROADMAP */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  ACTION PLAN TO 100% READINESS
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Targeted Skill Bridging Roadmap
                </h3>
              </div>
              <span className="text-xs text-slate-400">Step-by-step guidance</span>
            </div>

            <div className="space-y-3">
              {gapAnalysis.remediationRoadmap.map((item) => (
                <div
                  key={item.step}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                      0{item.step}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.estimatedHours}
                    </span>
                    <button
                      onClick={() => {
                        setActiveMainTab('ASSESSMENT');
                        setAssessmentType('technical');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Begin Step
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PERSONALIZED LEARNING ROADMAP (Dynamic Closed-Loop Recalculation) */}
      {activeMainTab === 'LEARNING_ROADMAP' && (
        <div className="space-y-6">
          {/* 1. DYNAMIC CLOSED-LOOP PIPELINE WORKFLOW */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    Closed-Loop Adaptive Engine
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Dynamic Learning Roadmap & Live Recalculation Loop
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Real-Time Competency Synchronizer
              </span>
            </div>

            {/* Stepper Pipeline Flow */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
              {[
                { step: '01', title: 'GOAL', subtitle: 'Software Engineer', icon: Target, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60' },
                { step: '02', title: 'Skill Gap', subtitle: 'DSA Deficit (-27%)', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60' },
                { step: '03', title: 'Learning Resources', subtitle: 'Video & Cheat-Sheets', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60' },
                { step: '04', title: 'Project', subtitle: 'Hands-on Repository', icon: Code2, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/60' },
                { step: '05', title: 'Assessment', subtitle: 'Interview Challenge', icon: BrainCircuit, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60' },
                { step: '06', title: 'Skill Improvement', subtitle: 'DSA: 43% ➔ 68%', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60' },
                { step: '07', title: 'Readiness Update', subtitle: '71% ➔ 78% Live', icon: Award, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60' },
              ].map((node) => {
                const IconComponent = node.icon;
                return (
                  <div key={node.step} className={`p-3 rounded-xl border flex flex-col justify-between h-full transition-all hover:scale-[1.02] ${node.color}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold opacity-70">STAGE {node.step}</span>
                      <IconComponent size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{node.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{node.subtitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. DYNAMIC LIVE READINESS RECALCULATION BANNER */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-800 p-6 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <TrendingUp size={13} />
                <span>DYNAMIC RECALCULATION ENGINE ACTIVE</span>
              </div>
              <h3 className="text-xl font-extrabold font-display">
                Automated Readiness Recalculation: {roadmapState.baseReadiness}% ➔ {roadmapState.activeReadiness}%
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                As you advance through the weekly modules and pass the Week 4 Interview Challenge, your verified DSA competency elevates from <strong className="text-amber-300">{roadmapState.dsaBaseSkill}%</strong> to <strong className="text-emerald-300">{roadmapState.isWeek4Completed ? roadmapState.dsaImprovedSkill : roadmapState.dsaBaseSkill}%</strong>, triggering real-time recalculation of institutional role readiness.
              </p>
            </div>

            {/* Big Live Readiness Display */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/60 p-5 rounded-2xl border border-indigo-500/30">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ACTIVE CAREER READINESS
                </span>
                <div className="text-5xl font-black font-display tracking-tight text-emerald-400 mt-1">
                  {roadmapState.activeReadiness}%
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-2 ${
                  roadmapState.isWeek4Completed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {roadmapState.isWeek4Completed ? 'Accelerated Shortlist Ready' : '71% Initial Baseline'}
                </span>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col gap-2 shrink-0">
                {!roadmapState.isWeek4Completed ? (
                  <button
                    onClick={() => setIsChallengeModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
                  >
                    <Zap size={14} />
                    <span>Take Week 4 Challenge</span>
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Week 4 Verified (+7% Boost)</span>
                  </div>
                )}

                {roadmapState.isWeek4Completed ? (
                  <button
                    onClick={handleResetWeek4}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                  >
                    <RefreshCw size={12} />
                    <span>Reset Simulation</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteWeek4}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>1-Click Simulate (71% ➔ 78%)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3. INTERACTIVE 4-WEEK PROGRESSIVE ROADMAP (Exact match to User Request) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  TARGET DEFICIT: DSA REMEDIATION PATHWAY
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  4-Week Accelerated Mastery Roadmap
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {roadmapState.weeks.filter(w => w.completed).length} of {roadmapState.weeks.length} Weeks Completed
              </span>
            </div>

            {/* Weeks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {roadmapState.weeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className={`bg-surface dark:bg-slate-900 rounded-2xl border p-5 shadow-sm space-y-4 transition-all ${
                    week.completed
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/10 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                        week.completed
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                      }`}>
                        W{week.weekNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                            {week.title}
                          </h4>
                          {week.completed && (
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 size={11} /> Passed ({week.score}%)
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {week.focusArea}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {week.description}
                  </p>

                  {/* Learning Resources */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Learning Resources:
                    </span>
                    <div className="space-y-1 text-xs">
                      {week.learningResources.map((res, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <BookOpen size={13} className="text-blue-600 shrink-0" />
                            <span className="truncate font-medium text-slate-800 dark:text-slate-200">{res.title}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono text-slate-400">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">{res.type}</span>
                            <span>{res.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Deliverable */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Code2 size={13} className="text-indigo-600" />
                        Project: {week.projectDeliverable.title}
                      </span>
                      <span className="text-[10px] text-blue-600 font-mono font-semibold">GitHub Starter</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {week.projectDeliverable.description}
                    </p>
                  </div>

                  {/* Assessment Card & Action */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Assessment Type:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{week.assessment.title}</span>
                    </div>

                    {week.weekNumber === 4 && !week.completed && (
                      <button
                        onClick={() => setIsChallengeModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Zap size={13} />
                        <span>Take Challenge</span>
                      </button>
                    )}

                    {week.completed && (
                      <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                        <Check size={14} /> Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. INDUSTRY CERTIFICATION PROGRAMS (Official Statement Alignment) */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                  OFFICIAL INDUSTRY CERTIFICATION TRACKS
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Curated Industry-Recognized Certification Programs
                </h3>
              </div>
              <span className="text-xs text-slate-400">Institutional Exam Voucher Eligible</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roadmapState.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>{cert.issuer}</span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 font-bold">
                        {cert.level}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {cert.title}
                    </h4>
                    <div className="mt-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {cert.projectedSalaryImpact}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">{cert.duration}</span>
                    <a
                      href={cert.verificationBadgeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-500 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Enroll</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. INDUSTRY-RELEVANT SPECIALIZED TRAINING LABS */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">
                  HANDS-ON SPECIALIZED LAB RIGS
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Industry-Relevant Training & Simulation Sandboxes
                </h3>
              </div>
              <span className="text-xs text-slate-400">Hardware & GPU Accelerated</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadmapState.specializedLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3 hover:border-cyan-300 dark:hover:border-cyan-800 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{lab.industryDomain}</span>
                      <span className="font-bold text-cyan-600">{lab.weeklyHours}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {lab.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {lab.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                    <div>Rig: <strong className="text-slate-700 dark:text-slate-300">{lab.hardwareOrCloudRig}</strong></div>
                    <div>Partner: <strong className="text-blue-600">{lab.industryPartner}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WEEK 4 INTERVIEW CHALLENGE MODAL */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  WEEK 4 CAPSTONE ASSESSMENT
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Tier-1 Algorithmic Interview Challenge
                </h3>
                <p className="text-xs text-slate-500">
                  Passing this timed screening automatically elevates DSA to 68% and updates Career Readiness to 78%.
                </p>
              </div>
              <button
                onClick={() => setIsChallengeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Simulated Challenge Questions */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Problem 1: Thread-Safe LRU Cache Eviction</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600">Medium</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Implement an O(1) get and put cache with doubly-linked list nodes. Test cases: 14/14 Passed.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Problem 2: Shortest Path in Obstacle Grid (Dijkstra)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600">Medium</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Calculate lowest-cost path with weighted cell traversals. Test cases: 18/18 Passed.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Problem 3: Binary Tree Maximum Path Sum</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600">Hard</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Recursive depth-first evaluation with negative value branches. Test cases: 22/22 Passed.
                </p>
              </div>
            </div>

            {/* Recalculation Preview Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  Automated Recalculation Ready
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  Candidate Readiness will update: <strong>71% ➔ 78%</strong>
                </span>
              </div>
              <span className="text-base font-black font-mono text-emerald-600">Score: 88%</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsChallengeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteWeek4}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Zap size={14} />
                <span>Submit & Recalculate Readiness</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ATS RESUME STUDIO */}
      {activeMainTab === 'RESUME' && (
        <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded mb-1">
                ATS OPTIMIZED: 96 / 100
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Automated Verified Engineering Resume
              </h3>
              <p className="text-xs text-slate-500">Auto-synthesized from verified institutional coursework, project proofs, and assessment benchmarks.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm self-start"
            >
              <Download size={14} /> Print / Save PDF
            </button>
          </div>

          {/* Interactive Resume View */}
          <div className="p-8 rounded-xl bg-white text-slate-900 border border-slate-300 shadow-sm max-w-3xl mx-auto space-y-5 font-sans">
            <div className="border-b border-slate-300 pb-3 text-center">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-950">{profile.fullName}</h2>
              <p className="text-xs font-medium text-slate-600 mt-0.5">{profile.resume.headline}</p>
              <div className="text-[11px] text-slate-500 mt-1 space-x-3">
                <span>{profile.email}</span>
                <span>•</span>
                <span>github.com/rishi-sharma</span>
                <span>•</span>
                <span>Campus ID: {profile.studentId}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-1.5">
                Executive Summary
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{profile.resume.summary}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-1.5">
                Education & Academic Standing
              </h4>
              <div className="flex justify-between text-xs">
                <div>
                  <strong>{profile.academic.degree}</strong>
                  <div className="text-slate-600">{profile.academic.department} • {profile.academic.academicStanding}</div>
                </div>
                <div className="text-right font-mono">
                  <span>CGPA: <strong>{profile.academic.cgpa} / 10</strong></span>
                  <div className="text-slate-500">{profile.academic.batch}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-1.5">
                Verified Technical Projects
              </h4>
              <div className="space-y-3">
                {profile.projects.map((p) => (
                  <div key={p.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{p.title} ({p.role})</span>
                      <span className="font-normal text-slate-500 text-[11px]">Verified Proof-of-Work</span>
                    </div>
                    <p className="text-slate-700 mt-0.5">{p.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Stack: {p.techStack.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 mb-1.5">
                Work Experience & Internships
              </h4>
              <div className="space-y-3">
                {profile.internships.map((intern) => (
                  <div key={intern.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{intern.role} — {intern.company}</span>
                      <span className="font-normal text-slate-500 text-[11px]">{intern.duration}</span>
                    </div>
                    <ul className="list-disc pl-4 text-slate-700 mt-0.5 space-y-0.5">
                      {intern.keyDeliverables.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXISTING VERIFIED RECORDS */}
      {activeMainTab === 'VERIFIED_RECORDS' && (
        <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Institutional Verified Records & Audit Hashes
                </h3>
                <span className="text-xs text-slate-400">Cryptographically verifiable seals for transcripts, awards, and AI assessments</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-500">100% Tamper Proof</span>
          </div>

          <div className="space-y-3">
            {profile.verifiedRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{rec.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {rec.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Issuer: <strong className="text-slate-700 dark:text-slate-300">{rec.issuer}</strong> • Record: {rec.recordType}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                    <span>Hash: {rec.verificationHash}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">{rec.verifiedAt}</span>
                  <button
                    onClick={() => alert(`Record ${rec.id} cryptographic hash verified against campus ledger.`)}
                    className="mt-1 text-xs text-blue-500 hover:underline font-semibold cursor-pointer"
                  >
                    Audit Seal Signature →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {isAddSkillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add Technical Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. C++ TEB Local Planner"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Autonomous Systems">Autonomous Systems</option>
                  <option value="Geospatial AI">Geospatial AI</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Systems & Hardware">Systems & Hardware</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Proficiency Level: {newSkillLevel}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSkillOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

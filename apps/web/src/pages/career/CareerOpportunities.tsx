import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  GraduationCap,
  Layers,
  Code2,
  BookOpen,
  Users,
  Compass,
  X,
  Check,
  Zap,
  Award,
  Target,
  AlertTriangle,
  Bot,
  CheckSquare
} from 'lucide-react';
import { 
  InternshipMarketplaceEngine, 
  type MarketplaceOpportunity, 
  type OpportunityCategory,
  type ApplicationSubmission 
} from '../../lib/internshipMarketplaceEngine';
import { 
  AIOpportunityMatchingEngine, 
  type AIMatchAnalysis 
} from '../../lib/aiOpportunityMatchingEngine';
import { StudentSkillIntelligenceEngine } from '../../lib/studentSkillIntelligenceEngine';
import { useToast } from '../../components/ui/Toast';

const CATEGORY_TABS: { id: string; label: string; count?: number }[] = [
  { id: 'ALL', label: 'All Opportunities' },
  { id: 'Internship', label: 'Internships' },
  { id: 'Project', label: 'Projects' },
  { id: 'Apprenticeship', label: 'Apprenticeships' },
  { id: 'Job', label: 'Jobs' },
  { id: 'Workshop', label: 'Workshops' },
  { id: 'Mentorship', label: 'Mentorship' },
  { id: 'Training', label: 'Training' },
];

export const CareerOpportunities: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [opportunities, setOpportunities] = useState<MarketplaceOpportunity[]>(() => 
    InternshipMarketplaceEngine.getOpportunities()
  );
  const [applications, setApplications] = useState<ApplicationSubmission[]>(() => 
    InternshipMarketplaceEngine.getApplications()
  );
  const [studentProfile] = useState(() => StudentSkillIntelligenceEngine.getProfile());

  // Views, AI Match Me & Filters
  const [viewMode, setViewMode] = useState<'STUDENT' | 'INDUSTRY_DASHBOARD'>('STUDENT');
  const [aiMatchMeActive, setAiMatchMeActive] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [query, setQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  // Drawer & Modal State
  const [selectedOpp, setSelectedOpp] = useState<(MarketplaceOpportunity & { aiMatch?: AIMatchAnalysis }) | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Form State for "Create Opportunity"
  const [formRole, setFormRole] = useState<string>('');
  const [formType, setFormType] = useState<OpportunityCategory>('Internship');
  const [formCompany, setFormCompany] = useState<string>('');
  const [formDomain, setFormDomain] = useState<string>('Software Engineering');
  const [formRequiredSkills, setFormRequiredSkills] = useState<string>('React, Node.js, SQL, Testing');
  const [formMinCgpa, setFormMinCgpa] = useState<number>(7.5);
  const [formDepts, setFormDepts] = useState<string>('Computer Science, Information Tech.');
  const [formExperience, setFormExperience] = useState<any>('Fresher / No Prior Exp');
  const [formLocation, setFormLocation] = useState<'Remote' | 'Hybrid' | 'On-Site'>('Hybrid');
  const [formCityOrMode, setFormCityOrMode] = useState<string>('Bengaluru / Hybrid');
  const [formDuration, setFormDuration] = useState<string>('6 Months (Full-Time)');
  const [formDeadline, setFormDeadline] = useState<string>('Nov 15, 2026');
  const [formComp, setFormComp] = useState<string>('₹45,000 / month');
  const [formDesc, setFormDesc] = useState<string>('');

  // AI Matched Opportunities Multi-factor Scoring
  const matchedOpportunities = useMemo(() => {
    return AIOpportunityMatchingEngine.matchAllOpportunities(opportunities, studentProfile);
  }, [opportunities, studentProfile]);

  // Filtered Opportunities
  const filtered = useMemo(() => {
    const list = aiMatchMeActive 
      ? matchedOpportunities 
      : matchedOpportunities.slice().sort((a, b) => b.applicantsCount - a.applicantsCount);

    return list.filter((o) => {
      const matchesCategory = activeCategory === 'ALL' || o.type === activeCategory;
      const matchesLocation = locationFilter === 'ALL' || o.location === locationFilter;
      const matchesQuery = 
        o.role.toLowerCase().includes(query.toLowerCase()) ||
        o.company.toLowerCase().includes(query.toLowerCase()) ||
        o.industryDomain.toLowerCase().includes(query.toLowerCase()) ||
        o.requiredSkills.some(s => s.toLowerCase().includes(query.toLowerCase()));

      return matchesCategory && matchesLocation && matchesQuery;
    });
  }, [matchedOpportunities, aiMatchMeActive, activeCategory, locationFilter, query]);

  // Handle Apply
  const handleApply = (opp: MarketplaceOpportunity) => {
    const studentId = studentProfile.studentId || (studentProfile as any).id || 'STU001';
    const studentName = studentProfile.fullName || (studentProfile as any).name || 'Rishi Sharma';
    const submission = InternshipMarketplaceEngine.applyToOpportunity(
      opp.id,
      studentId,
      studentName
    );
    setApplications(prev => [submission, ...prev.filter(a => a.opportunityId !== opp.id)]);
    toast(
      'Application Submitted Successfully',
      `Applied to ${opp.role} at ${opp.company}. Institutional verified transcript hash: ${submission.verificationHash}`,
      'success'
    );
  };

  // Handle Create Opportunity
  const handleCreateOpportunity = (e: React.FormEvent) => {
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
      cityOrMode: formCityOrMode.trim(),
      duration: formDuration.trim(),
      deadline: formDeadline.trim(),
      compensation: formComp.trim(),
      description: formDesc.trim() || `Exciting ${formType} opportunity in ${formDomain}.`,
      responsibilities: [
        `Deliver high-quality outcomes in ${formRole}`,
        `Collaborate closely with senior engineering and industry teams`,
        `Apply hands-on skills in ${skillsArray.slice(0, 3).join(', ')}`
      ],
      learningOutcomes: [
        'Hands-on industrial project experience',
        'Direct mentorship from technical leads',
        'Verified institutional proof-of-work certificate'
      ],
      featured: false
    });

    setOpportunities(InternshipMarketplaceEngine.getOpportunities());
    setIsCreateModalOpen(false);
    toast('Opportunity Published', `${newOpp.role} listed in Centralized Marketplace.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Centralized Internship Marketplace Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
            <Briefcase size={14} className="text-cyan-400" />
            <span>GENOVA • CENTRALIZED INTERNSHIP & OPPORTUNITY MARKETPLACE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Internship Marketplace & Industry Dashboard
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Centralized ecosystem connecting students with verified enterprise internships, research projects, apprenticeships, full-time jobs, specialized workshops, executive mentorship, and industry training rigs.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">View Perspective:</span>
              <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  onClick={() => setViewMode('STUDENT')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    viewMode === 'STUDENT'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Student Marketplace
                </button>
                <button
                  onClick={() => navigate('/career/industry-portal')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    viewMode === 'INDUSTRY_DASHBOARD'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Industry Dashboard
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => navigate('/career/copilot')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105 border border-indigo-400/30"
              >
                <Bot size={14} />
                <span>Ask Career Copilot</span>
              </button>
              <button
                onClick={() => navigate('/career/industry-portal')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                <Building2 size={14} />
                <span>Industry Portal</span>
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                <Plus size={14} />
                <span>Create Opportunity</span>
              </button>
              <button
                onClick={() => navigate('/career/applications')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                <CheckSquare size={14} />
                <span>Application Tracking Pipeline</span>
              </button>
              <button
                onClick={() => navigate('/career/industry-mapping')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <Target size={14} />
                <span>Industry Skill Mapping</span>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 7 Opportunity Categories Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeCategory === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* AI Match Me Control Hero Bar (Replaces passive "Search jobs" mindset) */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900 border border-blue-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-extrabold text-white flex items-center gap-2">
                <span>AI Match Me</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {aiMatchMeActive ? 'ACTIVE INTELLIGENCE' : 'PAUSED'}
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Automated multi-factor matching across your verified skills (Python, OpenCV, ML, ROS2...), proof-of-work project portfolio, and institutional academic eligibility.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAiMatchMeActive(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
              aiMatchMeActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105 ring-2 ring-blue-400/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles size={13} className={aiMatchMeActive ? 'animate-spin-slow' : ''} />
            <span>AI Match Me</span>
          </button>
          <button
            onClick={() => setAiMatchMeActive(false)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              !aiMatchMeActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search size={13} />
            <span>Standard Search</span>
          </button>
        </div>
      </div>

      {/* Search & Location Filter Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, role titles, companies, or tech stack..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Location Mode:</span>
          {['ALL', 'Remote', 'Hybrid', 'On-Site'].map((loc) => (
            <button
              key={loc}
              onClick={() => setLocationFilter(loc)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                locationFilter === loc
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List Cards */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Showing <strong>{filtered.length}</strong> opportunities</span>
            {aiMatchMeActive && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Ranked by AI Match Readiness
              </span>
            )}
          </div>
          <span className="font-mono">
            Candidate: <strong>{studentProfile.fullName}</strong> ({studentProfile.academic.degree} • CGPA: {studentProfile.academic.cgpa})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((opp) => {
            const hasApplied = applications.some(a => a.opportunityId === opp.id);
            const aiMatch = opp.aiMatch || AIOpportunityMatchingEngine.analyzeOpportunity(opp, studentProfile);

            return (
              <div
                key={opp.id}
                className={`bg-surface dark:bg-slate-900 rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  aiMatch.matchScore >= 85
                    ? 'border-emerald-500/40 dark:border-emerald-500/30 hover:border-emerald-500 shadow-emerald-500/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700'
                }`}
              >
                {/* Highlight banner for top recommended opportunity */}
                {aiMatch.matchScore >= 85 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500/20 to-transparent px-3 py-1 text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1 pointer-events-none">
                    <Sparkles size={10} /> Top AI Recommended
                  </div>
                )}

                <div>
                  {/* Top Bar: Opportunity Category, Role, Company, and Prominent Match % */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          opp.type === 'Internship' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900' :
                          opp.type === 'Job' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900' :
                          opp.type === 'Project' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900' :
                          opp.type === 'Apprenticeship' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900' :
                          opp.type === 'Workshop' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900' :
                          opp.type === 'Mentorship' ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900' :
                          'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                        }`}>
                          {opp.type}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{opp.company}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                        {opp.role}
                      </h3>
                    </div>

                    {/* Exact Prominent Match Badge (e.g. "Match: 88%") */}
                    <div className="text-right shrink-0">
                      <div className={`px-2.5 py-1.5 rounded-xl border font-mono text-xs font-extrabold flex items-center gap-1.5 shadow-xs ${
                        aiMatch.matchScore >= 80
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                          : aiMatch.matchScore >= 65
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                      }`}>
                        <Sparkles size={12} className={aiMatch.matchScore >= 80 ? 'text-emerald-500' : 'text-blue-500'} />
                        <span>Match: <strong>{aiMatch.matchScore}%</strong></span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                        {aiMatch.matchTier}
                      </span>
                    </div>
                  </div>

                  {/* Description Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* The 3 Core AI Match Breakdown Sections: Why?, Gap:, Eligibility: */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs">
                    
                    {/* 1. Why? Section */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                        <Check size={12} className="stroke-[3]" /> Why?
                      </span>
                      <div className="space-y-1">
                        {aiMatch.whyFactors.map((w) => (
                          <div key={w.id} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                            <span className="text-emerald-500 font-extrabold text-xs">✓</span>
                            <span className="font-semibold">{w.label}</span>
                          </div>
                        ))}
                        {aiMatch.whyFactors.length === 0 && (
                          <span className="text-[10px] text-slate-400 italic">No direct matches yet</span>
                        )}
                      </div>
                    </div>

                    {/* 2. Gap: Section */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 uppercase tracking-wider">
                        <AlertTriangle size={11} className="stroke-[2.5]" /> Gap:
                      </span>
                      <div className="space-y-1">
                        {aiMatch.gaps.map((g) => (
                          <div key={g.id} className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
                            <span className="text-amber-500 font-extrabold text-xs">⚠</span>
                            <span className="font-semibold">{g.skill}</span>
                          </div>
                        ))}
                        {aiMatch.gaps.length === 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                            <span className="font-bold">✓</span>
                            <span className="font-medium">No critical gaps!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. Eligibility: Section */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 uppercase tracking-wider">
                        <GraduationCap size={12} /> Eligibility:
                      </span>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <span className={aiMatch.eligibility.degreeMatch ? 'text-emerald-500 font-extrabold text-xs' : 'text-rose-500 font-bold'}>
                            {aiMatch.eligibility.degreeMatch ? '✓' : '✗'}
                          </span>
                          <span className="font-semibold">Degree</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <span className={aiMatch.eligibility.cgpaMatch ? 'text-emerald-500 font-extrabold text-xs' : 'text-rose-500 font-bold'}>
                            {aiMatch.eligibility.cgpaMatch ? '✓' : '✗'}
                          </span>
                          <span className="font-semibold">CGPA</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <span className={aiMatch.eligibility.gradYearMatch ? 'text-emerald-500 font-extrabold text-xs' : 'text-rose-500 font-bold'}>
                            {aiMatch.eligibility.gradYearMatch ? '✓' : '✗'}
                          </span>
                          <span className="font-semibold">Graduation year</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Meta Specs (Location, Duration, Deadline) */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-blue-500" />
                      <span>{opp.cityOrMode}</span>
                    </span>
                    <span>Duration: <strong className="text-slate-700 dark:text-slate-300">{opp.duration}</strong></span>
                    <span>Deadline: <strong className="text-rose-500">{opp.deadline}</strong></span>
                  </div>
                </div>

                {/* Footer: Compensation & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Stipend / Package</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {opp.compensation}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {aiMatch.gaps.length > 0 && (
                      <button
                        onClick={() => navigate('/career/skills')}
                        className="px-2.5 py-1.5 rounded-lg text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 text-[11px] font-bold cursor-pointer transition-colors border border-amber-500/20"
                        title="Bridge identified gaps in your 4-Week Dynamic Roadmap"
                      >
                        Bridge Gaps
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOpp(opp)}
                      className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer transition-colors"
                    >
                      Details
                    </button>

                    {hasApplied ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 size={13} />
                        <span>Applied ✓</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(opp)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-105"
                      >
                        <ShieldCheck size={13} />
                        <span>Apply with Passport</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL DRAWER / MODAL WITH FULL AI MATCH DIAGNOSTICS */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {selectedOpp.type} • {selectedOpp.company}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedOpp.role}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Location: {selectedOpp.cityOrMode} • Compensation: {selectedOpp.compensation} • Deadline: {selectedOpp.deadline}
                </p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* AI Match Diagnostics Card inside Modal */}
            {(() => {
              const aiMatch = selectedOpp.aiMatch || AIOpportunityMatchingEngine.analyzeOpportunity(selectedOpp, studentProfile);
              return (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-blue-500" />
                      <span>AI Match Analysis & Institutional Eligibility</span>
                    </span>
                    <span className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                      aiMatch.matchScore >= 80
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                    }`}>
                      Match: {aiMatch.matchScore}% ({aiMatch.matchTier})
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {aiMatch.summaryRationale}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                        Why? (Verified Proof)
                      </span>
                      {aiMatch.whyFactors.map((w) => (
                        <div key={w.id} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{w.label}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                        Gap (Actionable)
                      </span>
                      {aiMatch.gaps.map((g) => (
                        <div key={g.id} className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <span className="text-amber-500 font-bold">⚠</span>
                          <span>{g.skill}</span>
                        </div>
                      ))}
                      {aiMatch.gaps.length === 0 && (
                        <span className="text-[11px] text-emerald-500">None!</span>
                      )}
                    </div>

                    <div>
                      <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                        Eligibility
                      </span>
                      <div className="space-y-0.5 text-[11px] text-slate-700 dark:text-slate-300">
                        <div>✓ {aiMatch.eligibility.degreeLabel}</div>
                        <div>✓ {aiMatch.eligibility.cgpaLabel}</div>
                        <div>✓ {aiMatch.eligibility.gradYearLabel}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Detailed Description */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                Opportunity Overview
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedOpp.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                Key Responsibilities & Deliverables
              </h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                {selectedOpp.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight size={12} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
                Learning Outcomes & Industry Growth
              </h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                {selectedOpp.learningOutcomes.map((lo, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{lo}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                {selectedOpp.applicantsCount} Active Applicants
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApply(selectedOpp);
                    setSelectedOpp(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Confirm Application with Verified Passport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE OPPORTUNITY MODAL (Industry Dashboard) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  INDUSTRY RECRUITER CONSOLE
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Create Opportunity
                </h3>
                <p className="text-xs text-slate-500">
                  Publish internships, projects, apprenticeships, jobs, workshops, mentorships, and training.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-3.5 text-xs">
              {/* Opportunity Type (7 Requested Categories) */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Opportunity Type (Select 1 of 7 Categories) *
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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

              {/* Role Title & Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Developer Intern"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Genova Labs, NVIDIA, Google"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <label className="font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                  Required Skills (Comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, SQL, Testing"
                  value={formRequiredSkills}
                  onChange={(e) => setFormRequiredSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400">CampusOS will match candidates against these skills.</span>
              </div>

              {/* Eligibility & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Eligibility (Min CGPA Cutoff) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formMinCgpa}
                    onChange={(e) => setFormMinCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Experience Level *
                  </label>
                  <select
                    value={formExperience}
                    onChange={(e) => setFormExperience(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Fresher / No Prior Exp">Fresher / No Prior Exp</option>
                    <option value="Pre-final / Final Year">Pre-final / Final Year</option>
                    <option value="0 - 1 Years">0 - 1 Years</option>
                    <option value="1 - 2 Years">1 - 2 Years</option>
                    <option value="Open to All Students">Open to All Students</option>
                  </select>
                </div>
              </div>

              {/* Location/remote & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Location / Remote *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Remote, Hybrid (Bengaluru)"
                    value={formCityOrMode}
                    onChange={(e) => setFormCityOrMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Months, 6 Months, Full-time"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Deadline & Compensation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Application Deadline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nov 30, 2026"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Compensation / Stipend
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50,000 / month, ₹18 LPA"
                    value={formComp}
                    onChange={(e) => setFormComp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide an overview of the role, responsibilities, and expected outcomes..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default CareerOpportunities;

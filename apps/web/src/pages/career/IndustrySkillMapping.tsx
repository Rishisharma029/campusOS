import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { 
  Building2, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  FileText, 
  Check, 
  X, 
  Users, 
  Award, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { 
  IndustrySkillMappingEngine, 
  type IndustryRoleDefinition, 
  type StandardizedSkillProfile, 
  type StudentCohortComparisonResult 
} from '../../lib/industrySkillMappingEngine';
import { useToast } from '../../components/ui/Toast';

export const IndustrySkillMapping: React.FC = () => {
  const { students } = useDatabase();
  const { toast } = useToast();

  const [roles, setRoles] = useState<IndustryRoleDefinition[]>(() => 
    IndustrySkillMappingEngine.getIndustryRoles()
  );
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-fullstack-dev');
  const [activeTab, setActiveTab] = useState<'COHORT' | 'STANDARDIZED_PROFILE' | 'MACRO_ANALYTICS'>('COHORT');
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SHORTLIST' | 'POOL' | 'GAPS'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Selected student for drawer view
  const [selectedStudent, setSelectedStudent] = useState<StudentCohortComparisonResult | null>(null);

  // Modal for defining new industry role
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState<boolean>(false);
  const [newRoleTitle, setNewRoleTitle] = useState<string>('');
  const [newRoleCompany, setNewRoleCompany] = useState<string>('');
  const [newRoleRequiredSkills, setNewRoleRequiredSkills] = useState<string>('React, Node.js, SQL, Git, REST APIs, Testing');
  const [newRolePreferredSkills, setNewRolePreferredSkills] = useState<string>('Docker, AWS, System Design');
  const [newRoleMinCgpa, setNewRoleMinCgpa] = useState<number>(7.5);
  const [newRoleComp, setNewRoleComp] = useState<string>('₹16.0 LPA - ₹24.0 LPA');
  const [newRoleDesc, setNewRoleDesc] = useState<string>('');

  // Current active role definition
  const currentRole = useMemo(() => {
    return roles.find(r => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  // Run conversion and comparison engine on cohort
  const comparisonData = useMemo(() => {
    return IndustrySkillMappingEngine.compareCohortAgainstRole(students, currentRole);
  }, [students, currentRole]);

  // Filtered Cohort Matches
  const filteredMatches = useMemo(() => {
    return comparisonData.cohortMatches.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'ALL' ? true :
        statusFilter === 'SHORTLIST' ? student.verdict === 'Shortlist Ready' :
        statusFilter === 'POOL' ? student.verdict === 'Interview Pool' :
        student.verdict === 'Action Required (Gaps)' || student.verdict === 'Conditional Eligible';

      const matchesDept = departmentFilter === 'ALL' || student.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [comparisonData.cohortMatches, searchQuery, statusFilter, departmentFilter]);

  // Handle Save New Custom Role
  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;

    const reqArray = newRoleRequiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    const prefArray = newRolePreferredSkills.split(',').map(s => s.trim()).filter(Boolean);

    const newRole: IndustryRoleDefinition = {
      id: `custom-role-${Date.now()}`,
      title: newRoleTitle.trim(),
      companyName: newRoleCompany.trim() || 'Enterprise Partner',
      industrySector: 'Software Engineering',
      experienceLevel: 'Campus Fresher',
      compensationRange: newRoleComp.trim(),
      requiredSkills: reqArray,
      preferredSkills: prefArray,
      minCgpaCutoff: Number(newRoleMinCgpa),
      eligibleDepartments: ['Computer Science', 'Information Tech.', 'Electronics'],
      description: newRoleDesc.trim() || 'Customized enterprise technical competency profile.',
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    const updatedRoles = IndustrySkillMappingEngine.saveIndustryRole(newRole);
    setRoles(updatedRoles);
    setSelectedRoleId(newRole.id);
    setIsCreateRoleModalOpen(false);
    toast('Role Standardized', `CampusOS converted "${newRole.title}" into canonical skill taxonomy.`, 'success');
  };

  // Export Cohort Shortlist
  const handleExportShortlist = () => {
    const csvContent = [
      ['Student Name', 'Roll No', 'Department', 'CGPA', 'Overall Match %', 'Required Skills Met', 'Verdict'].join(','),
      ...comparisonData.cohortMatches.map(m => [
        `"${m.name}"`,
        m.rollNo,
        `"${m.department}"`,
        m.cgpa,
        `${m.overallMatchScore}%`,
        `"${m.requiredSkillsMet}/${m.requiredSkillsTotal}"`,
        `"${m.verdict}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusOS_Shortlist_${currentRole.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast('Shortlist Exported', `Downloaded candidate roster for ${currentRole.title}.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Industry Skill Mapping Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
            <Sparkles size={14} className="text-cyan-400" />
            <span>GENOVA • INDUSTRY SKILL MAPPING ENGINE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Industry Skill Mapping & Cohort Comparison
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Industries define required and preferred competencies. CampusOS converts them into standardized institutional profiles, then dynamically benchmarks every student across the university cohort against them.
          </p>

          {/* Quick Metrics Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Target Role</span>
              <span className="text-sm font-bold text-white truncate block">{currentRole.title}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Required Skills</span>
              <span className="text-sm font-bold text-cyan-400">{currentRole.requiredSkills.length} Strictly Gated</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Preferred Skills</span>
              <span className="text-sm font-bold text-indigo-400">{currentRole.preferredSkills.length} Value-Add</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Cohort Analyzed</span>
              <span className="text-sm font-bold text-emerald-400">{students.length} Students Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection & Pipeline Action Bar */}
      <div className="bg-surface dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Industry Role:
          </span>
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRoleId(r.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedRoleId === r.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Briefcase size={13} />
              <span>{r.title}</span>
              {selectedRoleId === r.id && <Check size={13} />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end lg:self-center">
          <button
            onClick={() => setIsCreateRoleModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Plus size={14} />
            <span>Define New Role</span>
          </button>
          <button
            onClick={handleExportShortlist}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download size={14} />
            <span>Export Shortlist CSV</span>
          </button>
        </div>
      </div>

      {/* Role Summary Banner: Required vs Preferred Skills */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-slate-900 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 dark:border-blue-900/40 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              ROLE: {currentRole.title.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500">
              • {currentRole.companyName} ({currentRole.compensationRange})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span>CampusOS Hash:</span>
            <strong className="text-blue-600 dark:text-blue-400">{comparisonData.standardizedProfile.profileHash}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          {/* Required Skills Box */}
          <div className="bg-surface dark:bg-slate-900 p-3.5 rounded-xl border border-blue-200/60 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-blue-600" />
                Required Skills (Mandatory Baseline):
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Weight: 75% Total</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentRole.requiredSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-1 text-[11px]"
                >
                  <Check size={11} />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills Box */}
          <div className="bg-surface dark:bg-slate-900 p-3.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles size={13} className="text-indigo-600" />
                Preferred Skills (Bonus Multipliers):
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Weight: 25% Total</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentRole.preferredSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-1 text-[11px]"
                >
                  <span>+</span>
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'COHORT', label: `Cohort Comparison Leaderboard (${comparisonData.cohortMatches.length})`, icon: Users },
          { id: 'STANDARDIZED_PROFILE', label: 'Standardized Taxonomy Profile', icon: Layers },
          { id: 'MACRO_ANALYTICS', label: 'Campus Macro Analytics & Deficits', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COHORT COMPARISON LEADERBOARD */}
      {activeTab === 'COHORT' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student, roll no, department..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Filter Status:</span>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'SHORTLIST', label: 'Shortlist Ready' },
                { id: 'POOL', label: 'Interview Pool' },
                { id: 'GAPS', label: 'Gaps Identified' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    statusFilter === f.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Student Cohort Comparison Table */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Candidate</th>
                    <th className="py-3.5 px-4 text-center">CGPA</th>
                    <th className="py-3.5 px-4 text-center">Overall Match</th>
                    <th className="py-3.5 px-4 text-center">Required Skills Met</th>
                    <th className="py-3.5 px-4 text-center">Preferred Bonus</th>
                    <th className="py-3.5 px-4 text-center">Verdict</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredMatches.map((match) => (
                    <tr
                      key={match.studentId}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Candidate Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {match.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                              {match.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {match.rollNo} • {match.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CGPA */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`font-mono font-bold ${match.cgpaEligible ? 'text-slate-900 dark:text-slate-100' : 'text-rose-500'}`}>
                          {match.cgpa.toFixed(1)}
                        </span>
                      </td>

                      {/* Overall Match */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-extrabold text-sm text-blue-600 dark:text-blue-400">
                            {match.overallMatchScore}%
                          </span>
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${match.overallMatchScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Required Skills Met */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                          match.requiredSkillsMet === match.requiredSkillsTotal
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-900'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-900'
                        }`}>
                          {match.requiredSkillsMet} / {match.requiredSkillsTotal}
                        </span>
                      </td>

                      {/* Preferred Bonus */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md font-mono text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border border-indigo-200 dark:border-indigo-900">
                          +{match.preferredSkillsMet} / {match.preferredSkillsTotal}
                        </span>
                      </td>

                      {/* Verdict */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 ${
                          match.verdictColor === 'emerald'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : match.verdictColor === 'blue'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                            : match.verdictColor === 'amber'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                        }`}>
                          {match.verdictColor === 'emerald' && <CheckCircle2 size={11} />}
                          {match.verdictColor === 'rose' && <AlertTriangle size={11} />}
                          <span>{match.verdict}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => setSelectedStudent(match)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Diagnostic Radar</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STANDARDIZED TAXONOMY PROFILE */}
      {activeTab === 'STANDARDIZED_PROFILE' && (
        <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                CANONICAL STANDARDIZATION TAXONOMY
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Standardized Profile for {currentRole.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                CampusOS transforms raw industry recruiter inputs into measurable institutional competencies with strict pass benchmarks.
              </p>
            </div>
            <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Fingerprint: <strong>{comparisonData.standardizedProfile.profileHash}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisonData.standardizedProfile.competencies.map((comp) => (
              <div
                key={comp.canonicalId}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  comp.tier === 'REQUIRED'
                    ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/10'
                    : 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      comp.tier === 'REQUIRED'
                        ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                        : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                    }`}>
                      {comp.tier}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {comp.domain}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-2">
                    {comp.skillName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {comp.industryRationale}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Benchmark Threshold:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    Min {comp.benchmarkThreshold}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MACRO ANALYTICS */}
      {activeTab === 'MACRO_ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Cohort Summary Metrics */}
            <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  COHORT READINESS METRICS
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Macro Placement Readiness
                </h4>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500">Average Cohort Match</span>
                  <span className="font-bold text-base font-mono text-blue-600 dark:text-blue-400">
                    {comparisonData.analytics.averageCohortMatch}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500">Shortlist Ready Pool</span>
                  <span className="font-bold text-base font-mono text-emerald-600">
                    {comparisonData.analytics.shortlistReadyCount} Candidates
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500">Action Required (Gaps)</span>
                  <span className="font-bold text-base font-mono text-rose-600">
                    {comparisonData.analytics.actionRequiredCount} Candidates
                  </span>
                </div>
              </div>
            </div>

            {/* Curriculum Interventions */}
            <div className="lg:col-span-2 bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  FACULTY & PLACEMENT INTERVENTIONS
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Identified Institutional Bottlenecks
                </h4>
              </div>

              <div className="space-y-2.5">
                {comparisonData.analytics.curriculumInterventions.map((ci, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 text-xs flex items-start gap-2.5"
                  >
                    <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {ci}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Breakdown Pass Rates */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Cohort Competency Breakdown vs Industry Benchmarks
            </h4>

            <div className="space-y-3">
              {comparisonData.analytics.skillSummaries.map((sk) => (
                <div key={sk.skillName} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{sk.skillName}</span>
                      <span className="text-[10px] font-mono text-slate-400">({sk.tier})</span>
                    </div>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {sk.passPercentage}% Pass Rate ({sk.studentsPassingCount}/{comparisonData.cohortMatches.length} students)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sk.passPercentage >= 75 ? 'bg-emerald-500' : sk.passPercentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${sk.passPercentage}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Recommendation: {sk.curriculumRecommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STUDENT DETAIL RADAR DRAWER / MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedStudent.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-blue-100 dark:bg-blue-950 text-blue-600">
                    {selectedStudent.rollNo}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedStudent.department} • CGPA: {selectedStudent.cgpa} • Benchmark: {currentRole.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Candidate Summary Cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 block">Overall Match</span>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
                  {selectedStudent.overallMatchScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 block">Required Skills</span>
                <span className="text-lg font-black text-emerald-600 font-mono">
                  {selectedStudent.requiredSkillsMet} / {selectedStudent.requiredSkillsTotal}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 block">Verdict</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">
                  {selectedStudent.verdict}
                </span>
              </div>
            </div>

            {/* Side-by-Side Skill Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Competency Comparison Breakdown
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                {selectedStudent.evaluations.map((ev) => (
                  <div key={ev.canonicalId} className="p-3 flex items-center justify-between text-xs bg-surface dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ev.isMet ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {ev.skillName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {ev.domain} • Tier: {ev.tier}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {ev.studentScore}%
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Threshold: {ev.benchmarkThreshold}%
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                        ev.isMet
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600'
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600'
                      }`}>
                        {ev.statusText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Gaps Note */}
            {selectedStudent.criticalGaps.length > 0 && (
              <div className="p-3.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 text-xs space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-300 block">
                  Identified Gaps to Close:
                </span>
                <ul className="list-disc pl-4 text-slate-600 dark:text-slate-300 space-y-0.5">
                  {selectedStudent.criticalGaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INDUSTRY ROLE MODAL */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Define Industry Role Benchmark
                </h3>
                <p className="text-xs text-slate-500">
                  CampusOS will convert these requirements into a standardized skill profile.
                </p>
              </div>
              <button
                onClick={() => setIsCreateRoleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Developer, DevOps Engineer"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google, Microsoft, Genova Labs"
                  value={newRoleCompany}
                  onChange={(e) => setNewRoleCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                  Required Skills (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="React, Node.js, SQL, Git, REST APIs, Testing"
                  value={newRoleRequiredSkills}
                  onChange={(e) => setNewRoleRequiredSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400">Strict gating: students missing these will be flagged.</span>
              </div>

              <div>
                <label className="font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">
                  Preferred Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Docker, AWS, System Design"
                  value={newRolePreferredSkills}
                  onChange={(e) => setNewRolePreferredSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400">Value-add proficiencies that boost candidate ranking.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Min CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRoleMinCgpa}
                    onChange={(e) => setNewRoleMinCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Compensation Band
                  </label>
                  <input
                    type="text"
                    value={newRoleComp}
                    onChange={(e) => setNewRoleComp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer shadow-sm"
                >
                  Standardize & Benchmark Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default IndustrySkillMapping;

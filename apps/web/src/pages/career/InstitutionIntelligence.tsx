import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  Layers, 
  Calendar, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Send,
  BookOpen,
  PieChart,
  Target,
  Flame
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell
} from 'recharts';
import { 
  InstitutionIntelligenceEngine, 
  DEFAULT_INTELLIGENCE_DATA,
  type InstitutionIntelligenceData,
  type SkillGapItem 
} from '../../lib/institutionIntelligenceEngine';
import { useToast } from '../../components/ui/Toast';

export const InstitutionIntelligence: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [intelData, setIntelData] = useState<InstitutionIntelligenceData>(() => 
    InstitutionIntelligenceEngine.getIntelligence()
  );

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Deploy Remedial Intervention for a Cohort Skill Gap
  const handleDeployRemedial = (gap: SkillGapItem) => {
    const updated = InstitutionIntelligenceEngine.deployRemedialIntervention(gap.id);
    setIntelData(updated);
    toast(
      'Remedial Intervention Launched',
      `Targeted lab module initialized for ${gap.affectedStudentsCount} students facing ${gap.skillName} gaps.`,
      'success'
    );
  };

  // Prescriptive AI Policy Action
  const handleExecutePrescriptive = () => {
    const updated = InstitutionIntelligenceEngine.executePrescriptivePolicyAction();
    setIntelData(updated);
    toast(
      'Prescriptive Policy Action Executed',
      'Auto-scheduled DSA & Cloud Intensive Bootcamp for 2nd and 3rd year cohorts across CSE & IT.',
      'success'
    );
  };

  // Color-coded heat badge styling according to mastery percentage
  const getHeatBadge = (val: number) => {
    if (val >= 80) {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold';
    }
    if (val >= 65) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30 font-semibold';
    }
    if (val >= 50) {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30 font-semibold';
    }
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-black';
  };

  // Cohort health badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Mastered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Competent':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Lagging':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Deficient':
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  // Recharts data for Demand Surge Trends
  const demandTrendChartData = useMemo(() => {
    return [
      { quarter: 'Q1 2026', 'AI/ML': 58, Cloud: 62, Python: 68, React: 70, Cybersecurity: 55 },
      { quarter: 'Q2 2026', 'AI/ML': 72, Cloud: 71, Python: 74, React: 75, Cybersecurity: 66 },
      { quarter: 'Q3 2026', 'AI/ML': 90, Cloud: 83, Python: 81, React: 79, Cybersecurity: 79 },
      { quarter: 'Q4 (Est.)', 'AI/ML': 99, Cloud: 92, Python: 88, React: 84, Cybersecurity: 89 },
    ];
  }, []);

  // Department Readiness bar data
  const deptBarData = useMemo(() => {
    return intelData.departmentReadiness.map(d => ({
      name: d.department.replace(' & Engineering', '').replace(' & Communication', '').replace(' & Automation', '').replace(' & Infrastructure', ''),
      Readiness: d.readinessPercentage,
      Students: d.enrolledStudents
    }));
  }, [intelData]);

  // Skill Gap bar data
  const gapChartData = useMemo(() => {
    return intelData.topSkillGaps.map(g => ({
      name: g.skillName.split(' ')[0],
      Students: g.affectedStudentsCount,
      Severity: g.severity
    }));
  }, [intelData]);

  // Safe fallbacks to prevent crashes if user had old localStorage schema
  const prescriptive = intelData?.prescriptiveInsight?.recommendationQuote
    ? intelData.prescriptiveInsight
    : DEFAULT_INTELLIGENCE_DATA.prescriptiveInsight;

  const cohortHeatmap = (Array.isArray(intelData?.cohortHeatmap) && intelData.cohortHeatmap.length > 0)
    ? intelData.cohortHeatmap
    : DEFAULT_INTELLIGENCE_DATA.cohortHeatmap;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 md:p-8 border border-blue-500/30 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
              <BarChart3 size={14} className="text-blue-400" />
              <span>SIH26044 • INSTITUTIONAL EXECUTIVE INTELLIGENCE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
              Institution Intelligence Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Macro analytics around university student employability readiness, cohort-level skill gaps, corporate recruitment funnels, and real-time industry skill demand trends.
            </p>

            <div className="mt-4 flex items-center gap-3 text-xs text-blue-200">
              <span className="font-bold text-white">GENOVA University Consortium</span>
              <span>•</span>
              <span>1,940 Active Enrolled Cohort</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck size={13} />
                <span>Cryptographically Sealed Telemetry</span>
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-all shadow-sm"
            >
              <Download size={14} />
              <span>Executive Brief</span>
            </button>
            <button
              onClick={() => navigate('/career/industry-portal')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
            >
              <Building2 size={14} />
              <span>Industry Recruiter Portal</span>
            </button>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary KPI Hero Metrics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Student Readiness 76% */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Student Readiness
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-display">
              {intelData.macroStudentReadiness}%
            </span>
            <span className="text-xs font-bold text-emerald-500 flex items-center">
              <ArrowUpRight size={14} />
              <span>+4.2% vs last sem</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Across 1,940 assessed university engineering students.
          </p>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-3">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${intelData.macroStudentReadiness}%` }} />
          </div>
        </div>

        {/* KPI 2: Top Skill Gap: DSA (1,240 students) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Top Cohort Skill Gap
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <AlertTriangle size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-display">
              1,240
            </span>
            <span className="text-xs font-bold text-slate-400">students</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            DSA (Data Structures & Algorithmic problem solving).
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 font-medium">
            <span>Critical Severity</span>
            <span className="text-amber-500 font-bold">64% of cohort</span>
          </div>
        </div>

        {/* KPI 3: Internship Funnel: 1,284 applications / 423 selected */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Internship Selection
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Briefcase size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display">
              {intelData.internshipStats.selectedCandidates}
            </span>
            <span className="text-xs font-bold text-slate-400">/ {intelData.internshipStats.totalApplications} applied</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {intelData.internshipStats.selectionRatePercentage}% conversion rate • 142 industry mentors.
          </p>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-3">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${intelData.internshipStats.selectionRatePercentage}%` }} />
          </div>
        </div>

        {/* KPI 4: Placement: Readiness 74% / Outcome 81% */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Placement Conversion
            </span>
            <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <GraduationCap size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-display">
              {intelData.placementStats.finalPlacementPercentage}%
            </span>
            <span className="text-xs font-bold text-purple-500">({intelData.placementStats.readinessPercentage}% ready)</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            1,180 placed • Highest ₹{intelData.placementStats.highestPackageLpa} LPA • Avg ₹{intelData.placementStats.averagePackageLpa} LPA.
          </p>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-3">
            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600" style={{ width: `${intelData.placementStats.finalPlacementPercentage}%` }} />
          </div>
        </div>

      </div>

      {/* PRESCRIPTIVE AI DECISION SUPPORT BANNER (SIH26044 Recommendation Engine) */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>PRESCRIPTIVE AI DECISION SUPPORT • COHORT POLICY OPTIMIZATION</span>
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider font-extrabold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>Critical Institutional Finding:</span>
              </div>
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-black text-white font-display tracking-tight border-l-4 border-amber-400 pl-4 py-1 leading-snug shadow-sm">
                "{prescriptive.recommendationQuote}"
              </blockquote>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {prescriptive.criticalWindowReason}
            </p>

            <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Users size={14} />
                <span>Impacted Students: {prescriptive.impactedStudentsCount.toLocaleString()} (2nd & 3rd Year)</span>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-300 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                <Target size={14} />
                <span>DSA Deficit: 54%-61% vs 75% Target</span>
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                <Target size={14} />
                <span>Cloud Deficit: 38%-49% vs 70% Target</span>
              </span>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="shrink-0 flex flex-col items-start lg:items-end gap-3">
            {prescriptive.executed ? (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/50 text-white shadow-xl space-y-2 max-w-sm">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <CheckCircle2 size={18} />
                  <span>Bootcamp Active & Enrolled</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  DSA & Cloud Intensive Rig deployed to student dashboards. 920 students in 2nd & 3rd year now enrolled in corrective sandbox labs.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 font-semibold pt-1">
                  ✓ Telemetry stream synced with Academic Dean
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-w-xs">
                <button
                  onClick={handleExecutePrescriptive}
                  className="w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-blue-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:scale-[1.02] border border-white/20"
                >
                  <Zap size={16} className="text-amber-200 fill-amber-200" />
                  <span>{prescriptive.suggestedActionTitle}</span>
                  <ArrowRight size={15} />
                </button>
                <p className="text-[11px] text-slate-400 text-center lg:text-right">
                  1-click policy action automatically provisions cloud sandboxes, algorithmic rig, and faculty mentoring sessions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INSTITUTION SKILL-GAP HEATMAP MATRIX (1st to 4th Year Progression) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-6 md:p-7 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-1">
              <Flame size={13} className="text-orange-500" />
              <span>CROSS-SECTIONAL COHORT HEATMAP • SIH26044 INTELLIGENCE</span>
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>Institution Skill-Gap Heatmap</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                1st • 2nd • 3rd • 4th Year
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Proficiency scores (%) evaluated through continuous compiler executions, lab assessments, and real-time git commits across 1,940 students.
            </p>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-2 text-[11px] font-semibold flex-wrap bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 mr-1">Proficiency Band:</span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">≥80% Mastered</span>
            <span className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">65-79% Competent</span>
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">50-64% Lagging</span>
            <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">&lt;50% Deficient</span>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Skill Domain</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-4 text-center">1st Year</th>
                <th className="py-3.5 px-4 text-center">2nd Year</th>
                <th className="py-3.5 px-4 text-center">3rd Year</th>
                <th className="py-3.5 px-4 text-center">4th Year</th>
                <th className="py-3.5 px-4 text-center">Benchmark</th>
                <th className="py-3.5 px-4 text-center">Cohort Health</th>
                <th className="py-3.5 px-4 text-center">Progression (1st → 4th)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {cohortHeatmap.map((row) => {
                const isCriticalFocus = row.skill === 'DSA' || row.skill === 'Cloud';
                const delta = row.year4 - row.year1;
                return (
                  <tr 
                    key={row.skill} 
                    className={`transition-colors ${
                      isCriticalFocus 
                        ? 'bg-amber-500/5 dark:bg-amber-950/20 hover:bg-amber-500/10' 
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white font-display">
                          {row.skill}
                        </span>
                        {isCriticalFocus && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/30 uppercase">
                            Prescriptive Focus
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-12 py-1 rounded-lg border text-xs ${getHeatBadge(row.year1)}`}>
                        {row.year1}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-12 py-1 rounded-lg border text-xs ${getHeatBadge(row.year2)}`}>
                        {row.year2}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-12 py-1 rounded-lg border text-xs ${getHeatBadge(row.year3)}`}>
                        {row.year3}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-12 py-1 rounded-lg border text-xs ${getHeatBadge(row.year4)}`}>
                        {row.year4}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                      {row.benchmark}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              row.year4 >= 80 
                                ? 'bg-emerald-500' 
                                : row.year4 >= 65 
                                ? 'bg-blue-500' 
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${row.year4}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-extrabold text-emerald-500 dark:text-emerald-400 w-10 text-right">
                          +{delta}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Heatmap Insights Footer */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="font-bold text-indigo-500">Longitudinal Summary:</span>
            <span>Python and Web progression remain on an optimal growth path (82% → 94%). Algorithmic DSA and Cloud infrastructure plateau during 2nd & 3rd year.</span>
          </div>
          <div className="shrink-0 text-[11px] font-mono text-slate-400">
            Cohort Sample Size: N=1,940
          </div>
        </div>
      </div>

      {/* Row 2: Top Skill Gaps & Industry Demand Surge Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Top Skill Gaps Cohort Radar (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Top Cohort Skill Gaps</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  ACTION REQUIRED
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Exact headcount of students with critical skill deficiencies across university assessments.
              </p>
            </div>

            <button
              onClick={() => {
                intelData.topSkillGaps.forEach(g => {
                  InstitutionIntelligenceEngine.deployRemedialIntervention(g.id);
                });
                setIntelData(InstitutionIntelligenceEngine.getIntelligence());
                toast('Batch Interventions Deployed', 'CampusOS scheduled automatic remedial sandboxes for all 4 gap areas.', 'success');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition-all"
            >
              <Zap size={12} />
              <span>Deploy All Remedials</span>
            </button>
          </div>

          {/* Gaps List Cards */}
          <div className="space-y-3">
            {intelData.topSkillGaps.map((gap) => (
              <div
                key={gap.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {gap.skillName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      gap.severity === 'Critical'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {gap.severity}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      {gap.affectedStudentsCount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">students ({gap.percentageOfCohort}%)</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                  <span className="text-indigo-500 font-bold shrink-0">↳ Solution:</span>
                  <span>{gap.recommendedIntervention}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-[11px] text-slate-400">
                    Status: {gap.remedialDeployed ? '✓ Remedial Active on Student Dashboards' : 'Pending Academic Deployment'}
                  </span>

                  {gap.remedialDeployed ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDeployRemedial(gap)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                    >
                      <Zap size={11} />
                      <span>Deploy Remedial Rig</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Industry Demand Surge Trends (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Industry Demand Trends (Market Pulse)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  SURGING SKILLS
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time growth in corporate hiring requisitions across 118 verified enterprise recruiters.
              </p>
            </div>
          </div>

          {/* 5 Most Demanded Skills with Surge % Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {intelData.industryDemandTrends.map((trend) => (
              <div
                key={trend.skill}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {trend.skill}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ↑ {trend.growthPercentage}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {trend.activeMarketOpenings} Active Openings
                </div>
                <div className="text-[10px] font-semibold text-indigo-500 truncate">
                  {trend.demandCategory}
                </div>
              </div>
            ))}
          </div>

          {/* Area Trajectory Chart */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Multi-Quarter Demand Trajectory Index
              </span>
              <span className="text-[10px] text-slate-400">Q1 - Q4 Forecast</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandTrendChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} 
                  />
                  <Area type="monotone" dataKey="AI/ML" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAI)" />
                  <Area type="monotone" dataKey="Cloud" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCloud)" />
                  <Area type="monotone" dataKey="Python" stroke="#10b981" strokeWidth={1.5} fill="none" />
                  <Area type="monotone" dataKey="Cybersecurity" stroke="#f59e0b" strokeWidth={1.5} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-400 pt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"/> AI/ML (↑31%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"/> Cloud (↑24%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Python (↑18%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"/> Cyber (↑27%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Department Breakdown & Recruitment Outcomes Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Readiness Matrix (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Department Employability Benchmarks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Departmental readiness scores and identified primary skill bottlenecks.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {intelData.departmentReadiness.map((dept) => (
              <div
                key={dept.department}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {dept.department}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {dept.enrolledStudents} Students • Primary Gap: <span className="font-semibold text-amber-500">{dept.topGap}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        dept.readinessPercentage >= 80 
                          ? 'bg-emerald-500' 
                          : dept.readinessPercentage >= 70 
                          ? 'bg-blue-500' 
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${dept.readinessPercentage}%` }}
                    />
                  </div>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white w-10 text-right">
                    {dept.readinessPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruitment & Internship Outcomes Funnel (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Recruitment Conversion Funnels
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative progression from student readiness to offer acceptance.
            </p>
          </div>

          <div className="space-y-3">
            {/* Internship Stage */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Internship Conversion Funnel</span>
                <span className="text-emerald-500 font-bold">{intelData.internshipStats.selectionRatePercentage}% selected</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{intelData.internshipStats.totalApplications}</div>
                  <div className="text-[10px] text-slate-400">Applied</div>
                </div>
                <div className="p-2 rounded-lg bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="font-mono font-bold text-indigo-500">{intelData.internshipStats.shortlistedCount}</div>
                  <div className="text-[10px] text-slate-400">Shortlisted</div>
                </div>
                <div className="p-2 rounded-lg bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="font-mono font-bold text-emerald-500">{intelData.internshipStats.selectedCandidates}</div>
                  <div className="text-[10px] text-slate-400">Selected</div>
                </div>
              </div>
            </div>

            {/* Placement Stage */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Campus Placement Outcomes</span>
                <span className="text-purple-500 font-bold">{intelData.placementStats.finalPlacementPercentage}% placed</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{intelData.placementStats.totalEligibleStudents}</div>
                  <div className="text-[10px] text-slate-400">Eligible</div>
                </div>
                <div className="p-2 rounded-lg bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="font-mono font-bold text-purple-500">{intelData.placementStats.readinessPercentage}%</div>
                  <div className="text-[10px] text-slate-400">Ready</div>
                </div>
                <div className="p-2 rounded-lg bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="font-mono font-bold text-emerald-500">{intelData.placementStats.placedStudentsCount}</div>
                  <div className="text-[10px] text-slate-400">Offers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: Executive Brief Export */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Export Executive Institutional Brief
                </h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                A formal executive summary dossier is compiled for the Vice-Chancellor, Governing Body, and Placement Deans:
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div>Institution: GENOVA University Consortium</div>
                <div>Macro Student Employability Readiness: 76%</div>
                <div>Critical Gaps Identified: DSA (1,240), Cloud (860), AI/ML (720), Comm (610)</div>
                <div>Internship Performance: 1,284 Applied / 423 Selected (32.9%)</div>
                <div>Final Placement Outcome: 81% (1,180 Students Placed)</div>
                <div>Fastest Growing Market Demand: AI/ML (+31%), Cybersecurity (+27%), Cloud (+24%)</div>
                <div>Timestamp: {intelData.lastUpdated}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(intelData, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `Institution_Intelligence_Executive_Brief_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  toast('Executive Brief Downloaded', 'Executive briefing report saved to local disk.', 'success');
                  setIsExportModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download size={13} />
                <span>Download Executive Brief (JSON)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

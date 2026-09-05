import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  CheckSquare, 
  Clock, 
  ClipboardList, 
  FileText, 
  Library, 
  Calendar, 
  GraduationCap, 
  ArrowRight, 
  Award,
  BarChart3
} from 'lucide-react';

export const AcademicsHub: React.FC = () => {
  const navigate = useNavigate();

  const academicModules = [
    {
      title: 'Academician & Faculty Industry Portal',
      description: 'Corporate sabbaticals, industrial training rigs, AICTE FDPs, paid consultancy, and sponsored R&D grants.',
      path: '/career/academician',
      icon: GraduationCap,
      color: 'from-indigo-600 to-purple-600',
      badge: 'SIH26044',
      metric: '7 Modules'
    },
    {
      title: 'Course Catalog & Syllabi',
      description: 'Departmental curriculum, elective enrollment, prerequisites, and learning outcome maps.',
      path: '/courses',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Active Term',
      metric: '148 Active Courses'
    },
    {
      title: 'Attendance Intelligence',
      description: 'Biometric tracking, automated threshold warning alerts, and medical leave reconciliations.',
      path: '/attendance',
      icon: CheckSquare,
      color: 'from-emerald-500 to-teal-600',
      badge: '91.8% Avg',
      metric: 'Realtime Biometric'
    },
    {
      title: 'Timetable & Scheduling',
      description: 'AI conflict-free scheduling engine, room allocations, and faculty load distribution.',
      path: '/timetable',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      badge: 'Optimized',
      metric: 'Zero Clashes'
    },
    {
      title: 'Continuous Evaluation & Assignments',
      description: 'Submission portals, automated plagiarism screening, and rubric-driven peer reviews.',
      path: '/assignments',
      icon: ClipboardList,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Due This Week',
      metric: '24 Open Submissions'
    },
    {
      title: 'Examinations & Grading',
      description: 'Hall tickets, seating arrangement plans, encrypted grade sheets, and GPA computation.',
      path: '/examinations',
      icon: FileText,
      color: 'from-rose-500 to-red-600',
      badge: 'Midterms',
      metric: 'Gradebook Encrypted'
    },
    {
      title: 'Digital Research Library',
      description: 'Catalog access, IEEE/Elsevier journal integrations, RFID issue status, and digital e-readers.',
      path: '/library',
      icon: Library,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Digital E-Vault',
      metric: '45,000+ Titles'
    },
    {
      title: 'Unified Academic Calendar',
      description: 'Institutional milestones, examination cycles, guest symposiums, and term breaks.',
      path: '/calendar',
      icon: Calendar,
      color: 'from-teal-500 to-emerald-600',
      badge: 'AY 2026-27',
      metric: 'Syncs with Google/Outlook'
    },
    {
      title: 'Faculty & Department Registry',
      description: 'Faculty directory, publication records, research labs, and office consultation hours.',
      path: '/faculty',
      icon: GraduationCap,
      color: 'from-violet-500 to-purple-600',
      badge: '180+ Faculty',
      metric: '12 Engineering Depts'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
            <GraduationCap size={14} />
            <span>GENOVA Academic Command</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Academics & Curriculum Engine
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Institutional curriculum management, continuous automated evaluations, timetable optimization, and research library integration.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Award size={14} className="text-amber-400" />
              <span>Accreditation: Tier-1 NBA / NAAC A++ Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <BarChart3 size={14} className="text-emerald-400" />
              <span>Current Term GPA Average: 8.42</span>
            </div>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grid of Academic Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {academicModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.title}
              onClick={() => navigate(mod.path)}
              className="group relative rounded-xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {mod.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 font-mono">
                  {mod.metric}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  Launch <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

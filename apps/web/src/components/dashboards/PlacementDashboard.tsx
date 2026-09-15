import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Briefcase,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Building2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export const PlacementDashboard: React.FC = () => {
  const { placements } = useDatabase();
  const { toast } = useToast();

  const upcomingDrives = [
    { company: 'Google Cloud India', role: 'Cloud Solutions Architect', date: 'Tomorrow, 10:00 AM', package: '₹44.0 LPA', status: 'SHORTLISTED', applicants: 148 },
    { company: 'Microsoft IDC', role: 'Software Engineer (R&D)', date: '18 Sep 2026', package: '₹38.5 LPA', status: 'TEST_SCHEDULED', applicants: 210 },
    { company: 'Atlassian', role: 'Full Stack Systems Engineer', date: '22 Sep 2026', package: '₹32.0 LPA', status: 'APPLICATIONS_OPEN', applicants: 185 },
    { company: 'NVIDIA Graphics', role: 'CUDA / Deep Learning Engineer', date: '25 Sep 2026', package: '₹28.0 LPA', status: 'UPCOMING', applicants: 92 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Placement Briefing */}
      <div className="glass-card p-6 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                Campus Placements & Corporate Relations Desk
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>78.4% of eligible Class of 2026 students placed with average CTC of ₹11.4 LPA.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Award size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Highest package recorded at ₹44.0 LPA by Google Cloud India.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Building2 size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>48 Visiting corporate partners registered for Spring 2026 placement season.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Calendar size={14} className="text-purple-400 shrink-0 mt-0.5" />
                <span>Google Cloud on-campus interview round starting tomorrow in Block A Auditorium.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => toast('New Drive Created', 'Recruitment drive post broadcasted to eligible students.', 'success')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <Briefcase size={16} />
              <span>+ Post Recruitment Drive</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Placement KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">78.4%</h3>
            <span className="text-[11px] text-emerald-400 block mt-1">+6.2% higher vs last year batch</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Package</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-amber-400">₹44.0 LPA</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Google Cloud Solutions Architect</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average CTC</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">₹11.4 LPA</h3>
            <span className="text-[11px] text-blue-300 block mt-1">Across all B.Tech branches</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visiting Recruiters</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Building2 size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">48 Companies</h3>
            <span className="text-[11px] text-purple-300 block mt-1">Tier-1 MNCs & AI Startups</span>
          </div>
        </div>
      </div>

      {/* Active Recruitment Drives Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Active Campus Placement Drives</h3>
            <p className="text-xs text-slate-400">Manage candidate shortlists, interview rounds, and offers</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold">Role Offered</th>
                <th className="pb-3 font-semibold">Drive Date</th>
                <th className="pb-3 font-semibold">Compensation</th>
                <th className="pb-3 font-semibold">Applicants</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {upcomingDrives.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-white">{d.company}</td>
                  <td className="py-3 text-slate-300">{d.role}</td>
                  <td className="py-3 text-slate-400">{d.date}</td>
                  <td className="py-3 font-bold text-emerald-400">{d.package}</td>
                  <td className="py-3 text-blue-400 font-semibold">{d.applicants} students</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold text-[10px]">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => toast('Shortlist Generated', `Downloaded 24 shortlisted resumes for ${d.company}.`, 'success')}
                      className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px] cursor-pointer"
                    >
                      View Candidates
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

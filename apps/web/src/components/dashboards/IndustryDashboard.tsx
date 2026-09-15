import React from 'react';
import {
  Building2,
  Users,
  Search,
  Sparkles,
  CheckCircle2,
  Calendar,
  Award,
  Video,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export const IndustryDashboard: React.FC = () => {
  const { toast } = useToast();

  const candidates = [
    { name: 'Rishi Sharma', roll: '2024CS001', cgpa: 8.92, skills: ['PyTorch', 'FastAPI', 'Distributed Systems', 'TypeScript'], match: '98% Match', status: 'SHORTLISTED' },
    { name: 'Aditi Rao', roll: '2024CS019', cgpa: 9.15, skills: ['React', 'Next.js', 'PostgreSQL', 'GraphQL'], match: '95% Match', status: 'INTERVIEW_SCHEDULED' },
    { name: 'Siddharth Verma', roll: '2024AI004', cgpa: 8.78, skills: ['Computer Vision', 'YOLOv8', 'TensorFlow', 'ROS2'], match: '92% Match', status: 'NEW_APPLICATION' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Corporate Partner Briefing */}
      <div className="glass-card p-6 border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                Corporate Recruiter & Industry Partner Portal
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>148 Student applications received for Software Engineer & AI Architect roles.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Users size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>34 High-match candidates ranked by AI skill parser (&gt;90% match).</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Calendar size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>8 Technical interview slots scheduled for today in Video Interview Room 1.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Award size={14} className="text-purple-400 shrink-0 mt-0.5" />
                <span>12 Offer letters generated with pre-placement letter of intent.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => toast('Interview Room Active', 'Launching HD Video Assessment Portal with code editor.', 'info')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <Video size={16} />
              <span>Launch Live Interview Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Recruiter KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Applicants</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">148</h3>
            <span className="text-[11px] text-cyan-300 block mt-1">Class of 2026 Graduates</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Shortlisted</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-emerald-400">34 Profiles</h3>
            <span className="text-[11px] text-emerald-300 block mt-1">High Coding & CGPA Score</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interviews Scheduled</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Calendar size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">8 Today</h3>
            <span className="text-[11px] text-blue-300 block mt-1">Round 2 Technical Evaluation</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offers Extended</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Award size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">12 Selected</h3>
            <span className="text-[11px] text-purple-300 block mt-1">₹32.0 - ₹44.0 LPA Packages</span>
          </div>
        </div>
      </div>

      {/* AI Candidate Talent Pool */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">AI-Ranked Candidate Talent Pool</h3>
            <p className="text-xs text-slate-400">Semantic skill matching based on verified GitHub code and coursework</p>
          </div>
          <button
            onClick={() => toast('Filters Applied', 'Showing top candidates with PyTorch and React.', 'info')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs cursor-pointer"
          >
            Filter by Skills
          </button>
        </div>

        <div className="space-y-3">
          {candidates.map((c, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h4 className="text-xs font-bold text-white">{c.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{c.roll}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {c.match}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {c.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700 font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-white">CGPA: {c.cgpa}</span>
                  <span className="block text-[10px] text-slate-400">{c.status}</span>
                </div>
                <button
                  onClick={() => toast('Offer Portal', `Pre-placement offer generated for ${c.name}.`, 'success')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

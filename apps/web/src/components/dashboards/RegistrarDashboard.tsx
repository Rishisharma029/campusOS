import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Building2,
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  FileCheck,
  Calendar,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export const RegistrarDashboard: React.FC = () => {
  const { students, exams } = useDatabase();
  const { toast } = useToast();

  const requests = [
    { student: 'Rohan Sharma', roll: '2022CS018', type: 'Migration Certificate', program: 'B.Tech CSE', date: 'Yesterday', status: 'PENDING' },
    { student: 'Aditi Varma', roll: '2021EC004', type: 'Official Degree Transcript', program: 'B.Tech ECE', date: '14 Sep 2026', status: 'PENDING' },
    { student: 'Farhan Akhtar', roll: '2023ME091', type: 'Bonafide Certificate (Passport)', program: 'B.Tech Mech', date: '14 Sep 2026', status: 'APPROVED' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Registrar Briefing */}
      <div className="glass-card p-6 border-indigo-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                Academic Governance & Institutional Registry
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>4,250 Active student enrollments audited across 8 engineering disciplines.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Award size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>180 Final Year Graduation clearances in progress for Convocation 2026.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Calendar size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Spring 2026 Examination gazette published with 12 examination halls allocated.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <ShieldCheck size={14} className="text-teal-400 shrink-0 mt-0.5" />
                <span>NAAC A++ Compliance Metrics at 99.4% conformity.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => toast('Gazette Published', 'Official Spring Semester Gazette generated and signed.', 'success')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <FileCheck size={16} />
              <span>Publish Academic Gazette</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Registrar KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enrollments</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">4,250</h3>
            <span className="text-[11px] text-emerald-400 block mt-1">Verified on National Academic Depository</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Degree Clearances</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">180 Pending</h3>
            <span className="text-[11px] text-amber-400 block mt-1">Final Year Convocation Batch</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Centers</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Calendar size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">12 Halls</h3>
            <span className="text-[11px] text-blue-300 block mt-1">CCTV & Invigilation Prepared</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accreditation Score</span>
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">3.82 / 4.0</h3>
            <span className="text-[11px] text-teal-300 block mt-1">NAAC A++ Grade Maintained</span>
          </div>
        </div>
      </div>

      {/* Official Certificate & Transcript Requests Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Document Verification & Transcript Queue</h3>
            <p className="text-xs text-slate-400">Digital verification via Digilocker & QR Seals</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">Roll No</th>
                <th className="pb-3 font-semibold">Requested Document</th>
                <th className="pb-3 font-semibold">Program</th>
                <th className="pb-3 font-semibold">Applied Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {requests.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-white">{r.student}</td>
                  <td className="py-3 font-mono text-slate-400">{r.roll}</td>
                  <td className="py-3 font-medium text-blue-400">{r.type}</td>
                  <td className="py-3">{r.program}</td>
                  <td className="py-3 text-slate-400">{r.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                      r.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {r.status === 'PENDING' ? (
                      <button
                        onClick={() => toast('Certificate Approved', `${r.type} digitally stamped for ${r.student}.`, 'success')}
                        className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] cursor-pointer"
                      >
                        Sign & Issue
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Issued</span>
                    )}
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

import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  BookMarked,
  AlertCircle,
  Download,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export const LibrarianDashboard: React.FC = () => {
  const { books } = useDatabase();
  const { toast } = useToast();

  const totalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0) || 48200;
  const availableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0) || 44780;
  const issuedCopies = totalCopies - availableCopies;

  const circulation = [
    { title: 'Introduction to Algorithms (CLRS)', student: 'Rishi Sharma (2024CS001)', issueDate: '10 Sep 2026', dueDate: '24 Sep 2026', status: 'ACTIVE' },
    { title: 'Database System Concepts (Silberschatz)', student: 'Aarav Patel (2024CS042)', issueDate: '01 Sep 2026', dueDate: '15 Sep 2026', status: 'OVERDUE' },
    { title: 'Artificial Intelligence: A Modern Approach', student: 'Priya Sharma (2024AI012)', issueDate: '08 Sep 2026', dueDate: '22 Sep 2026', status: 'ACTIVE' },
    { title: 'Operating System Concepts', student: 'Mehul Das (2024CS099)', issueDate: '28 Aug 2026', dueDate: '11 Sep 2026', status: 'OVERDUE' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Library AI Briefing */}
      <div className="glass-card p-6 border-amber-500/40 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                Library Circulation & Digital Knowledge Repository
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{totalCopies.toLocaleString()} volumes cataloged across Central Library & Department Annexes.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <BookOpen size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>{issuedCopies} books currently checked out. 18 RFID self-kiosks active.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <AlertCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>142 Books overdue for return. Fine notifications dispatched.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Download size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>1,840 IEEE & ScienceDirect research papers downloaded by scholars today.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => toast('RFID Kiosk Online', 'RFID Self-Service Return Kiosk connected and synced.', 'success')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>RFID Circulation Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Library KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Catalog</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BookOpen size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{totalCopies.toLocaleString()}</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Physical & E-Books Cataloged</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Books Checked Out</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <BookMarked size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">{issuedCopies}</h3>
            <span className="text-[11px] text-blue-400 block mt-1">Active Borrower Leases</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue Books</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertCircle size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-rose-400">142</h3>
            <span className="text-[11px] text-rose-300 block mt-1">₹4,260 Fine Accrued</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Digital Archive Access</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Download size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">1,840</h3>
            <span className="text-[11px] text-purple-300 block mt-1">IEEE / JSTOR Journal Downloads</span>
          </div>
        </div>
      </div>

      {/* Circulation Desk Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Live Circulation Desk & Overdue Tracking</h3>
            <p className="text-xs text-slate-400">RFID Barcode checkouts with auto fine calculation</p>
          </div>
          <button
            onClick={() => toast('Book Issue Modal', 'Scan student RFID badge or enter roll number to issue.', 'info')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs cursor-pointer"
          >
            + Issue Book (RFID)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Book Title</th>
                <th className="pb-3 font-semibold">Borrower</th>
                <th className="pb-3 font-semibold">Issue Date</th>
                <th className="pb-3 font-semibold">Due Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {circulation.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-white">{item.title}</td>
                  <td className="py-3 text-slate-300">{item.student}</td>
                  <td className="py-3 text-slate-400">{item.issueDate}</td>
                  <td className="py-3 text-slate-400">{item.dueDate}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                      item.status === 'OVERDUE' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => toast('Book Returned', `${item.title} checked back in.`, 'success')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold text-[11px] cursor-pointer"
                    >
                      Return
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

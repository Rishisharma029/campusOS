import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  IndianRupee,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export const AccountantDashboard: React.FC = () => {
  const { feeCollections } = useDatabase();
  const { toast } = useToast();

  const totalCollected = feeCollections.reduce((acc, curr) => acc + curr.amountPaid, 0) || 18450000;

  const recentTransactions = [
    { student: 'Rishi Sharma', roll: '2024CS001', receipt: 'REC-2026-9042', amount: '₹85,000', method: 'Razorpay UPI', date: 'Today, 10:30 AM', status: 'SUCCESS' },
    { student: 'Pooja Bhatt', roll: '2024CS014', receipt: 'REC-2026-9041', amount: '₹85,000', method: 'Net Banking', date: 'Today, 09:15 AM', status: 'SUCCESS' },
    { student: 'Aman Deep Singh', roll: '2024EC032', receipt: 'REC-2026-9040', amount: '₹42,500', method: 'Challan / HDFC', date: 'Yesterday', status: 'SUCCESS' },
    { student: 'Sara Ali Khan', roll: '2024ME011', receipt: 'REC-2026-9039', amount: '₹85,000', method: 'Credit Card', date: 'Yesterday', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Finance AI Briefing Banner */}
      <div className="glass-card p-6 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-lg">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold text-white font-display tracking-tight">
                Finance & Fee Revenue Command Center
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>₹1.84 Crores collected for Spring 2026 Semester (88% of total dues reconciled).</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CreditCard size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>₹4.20 Lakhs received in last 24 hours via Razorpay & HDFC Gateway.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>84 Students have outstanding fee balances with deadline in 4 days.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <Receipt size={14} className="text-teal-400 shrink-0 mt-0.5" />
                <span>Automated GST e-Invoices synced with Tally & PFMS portal.</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <button
              onClick={() => toast('GST Report Exported', 'Tally XML and Excel reconciliation sheet exported.', 'success')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <FileSpreadsheet size={16} />
              <span>Export Tally / GST Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Fee Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <IndianRupee size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">₹1.84 Cr</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp size={12} /> 88% Target Reached
            </span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Collections</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <CreditCard size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">₹4.20 Lakhs</h3>
            <span className="text-[11px] text-blue-400 block mt-1">48 Transactions settled</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Dues</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-rose-400">₹25.8 Lakhs</h3>
            <span className="text-[11px] text-rose-300 block mt-1">84 Defaulter Reminders Dispatched</span>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scholarships Disbursed</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Receipt size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white">₹34.5 Lakhs</h3>
            <span className="text-[11px] text-purple-300 block mt-1">Govt Merit & Defense Quota</span>
          </div>
        </div>
      </div>

      {/* Recent Ledger Transactions Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Recent Fee Receipts & Digital Collections</h3>
            <p className="text-xs text-slate-400">Direct integration with Razorpay & Bank Webhooks</p>
          </div>
          <button
            onClick={() => toast('Receipt Generator', 'Enter student roll number to generate instant duplicate receipt.', 'info')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer"
          >
            + Create Offline Receipt
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Roll Number</th>
                <th className="pb-3 font-semibold">Receipt Number</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentTransactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-white">{tx.student}</td>
                  <td className="py-3 font-mono text-slate-400">{tx.roll}</td>
                  <td className="py-3 font-mono text-blue-400">{tx.receipt}</td>
                  <td className="py-3 font-bold text-emerald-400">{tx.amount}</td>
                  <td className="py-3">{tx.method}</td>
                  <td className="py-3 text-slate-400">{tx.date}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                      {tx.status}
                    </span>
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

import React, { useState } from 'react';
import { useDatabase, type FeeCollection } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { DataGrid, type Column, Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { CreditCard, Plus, Receipt, Landmark, AlertTriangle, TrendingUp, Award, Building, Send, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FinanceIntelligenceEngine, type FinanceIntelligenceReport } from '../lib/financeIntelligenceEngine';
import { StepUpAuthModal } from '../components/security/StepUpAuthModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const billingSchema = z.object({
  studentId: z.string().min(1, 'Select a student'),
  amount: z.coerce.number().min(1000, 'Min payment is ₹1,000').max(180000, 'Amount exceeds fee bracket'),
  method: z.string().min(1, 'Select payment method'),
});

type BillingFormInputs = z.infer<typeof billingSchema>;

const formatCurrency = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return Number(val).toLocaleString();
};

export const Fees: React.FC = () => {
  const databaseContext = useDatabase();
  const { feeCollections = [], collectFee = () => {}, students = [] } = databaseContext || {};
  const roleContext = useRole();
  const currentRole = roleContext?.currentRole || 'Admin';
  const toastContext = useToast();
  const toast = toastContext?.toast || ((t: string, m?: string) => console.log(t, m));

  const [finReport] = useState<FinanceIntelligenceReport>(
    FinanceIntelligenceEngine.generateFinanceIntelligence()
  );
  const [executedActions, setExecutedActions] = useState<string[]>([]);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  const [isStepUpOpen, setIsStepUpOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>('');

  const requestFinanceActionWithStepUp = (actionId: string) => {
    setPendingAction(actionId);
    setIsStepUpOpen(true);
  };

  const isStaff = currentRole === 'Accountant' || currentRole === 'Admin';
  const isStudent = currentRole === 'Student' || currentRole === 'Parent';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BillingFormInputs>({
    defaultValues: {
      amount: 45000,
      method: 'Online Gateway',
    },
  });

  const onSubmitPayment = (data: BillingFormInputs) => {
    const student = students.find((s) => s.id === data.studentId);
    if (!student) return;

    collectFee(data.studentId, data.amount, data.method);
    toast('Payment Collected', `₹${formatCurrency(data.amount)} received successfully for ${student.name}.`, 'success');
    setIsCollectModalOpen(false);
    reset();
  };

  const handleExecuteFinanceAction = (actionId: string) => {
    setExecutedActions((prev) => [...prev, actionId]);
    const actionMap: Record<string, string> = {
      DISPATCH_FEE_REMINDERS: 'Automated SMS & WhatsApp payment reminders dispatched to 42 high-risk student guardians.',
      APPROVE_SCHOLARSHIP_DISBURSEMENT: 'Disbursed ₹25.0 Lakhs scholarship pool to 5 merit candidates.',
      REALLOCATE_LAB_BUDGET: 'Reallocated ₹12.5 Lakhs surplus from CSE to AI/ML Research Lab equipment fund.',
    };

    toast(
      'AI Finance Action Executed',
      actionMap[actionId] || 'Financial optimization plan applied.',
      'success'
    );
  };

  const currentStudent = students[0];
  const outstandingBal = currentStudent ? (currentStudent.feeTotal || 0) - (currentStudent.feePaid || 0) : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-950/40 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono tracking-wider">
                AI FINANCE & BUDGET INTELLIGENCE
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2 m-0">
              <Landmark size={22} className="text-emerald-400" />
              Fee Collections & Predictive Finance Hub
            </h1>
            <p className="text-xs text-slate-300">
              Predict default risks, department spending trends, and manage student fee receipts in real-time.
            </p>
          </div>

          {isStaff && (
            <Button
              onClick={() => setIsCollectModalOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 self-start md:self-auto"
            >
              <Plus size={15} /> Collect Fee & Issue Receipt
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue={isStudent ? 'my-fees' : 'ai-finance'}>
        <TabList className="bg-slate-950/80 p-1 border border-slate-800 rounded-xl">
          {isStaff && <TabTrigger value="ai-finance">🧠 AI Finance Intelligence</TabTrigger>}
          {isStudent && <TabTrigger value="my-fees">💳 My Fee Portal</TabTrigger>}
          <TabTrigger value="history">🧾 Fee Collection Ledger</TabTrigger>
        </TabList>

        {/* 1. AI Finance Intelligence Tab (Admin / Accountant) */}
        {isStaff && (
          <TabContent value="ai-finance" className="space-y-6 pt-4">
            {/* Top KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-4 space-y-1.5 border-rose-500/30">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Flagged Fee Defaults</span>
                  <AlertTriangle size={15} className="text-rose-400" />
                </div>
                <div className="text-xl font-extrabold text-white font-mono">{finReport.totalDefaultsFlagged} Students</div>
                <div className="text-[10px] text-rose-300 font-mono">Total Risk: ₹{formatCurrency(finReport.totalOverdueRisk)}</div>
              </div>

              <div className="glass-card p-4 space-y-1.5 border-emerald-500/30">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Q4 Projected Surplus</span>
                  <TrendingUp size={15} className="text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-emerald-400 font-mono">+₹{formatCurrency(finReport.projectedQ4Surplus)}</div>
                <div className="text-[10px] text-slate-400">12-Month Fiscal Forecast</div>
              </div>

              <div className="glass-card p-4 space-y-1.5 border-cyan-500/30">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Scholarship Pool</span>
                  <Award size={15} className="text-cyan-400" />
                </div>
                <div className="text-xl font-extrabold text-cyan-300 font-mono">₹25.0 Lakhs</div>
                <div className="text-[10px] text-cyan-400 font-mono">5 Eligible Candidates Matched</div>
              </div>

              <div className="glass-card p-4 space-y-1.5 border-amber-500/30">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Department Spend Audit</span>
                  <Building size={15} className="text-amber-400" />
                </div>
                <div className="text-xl font-extrabold text-amber-300 font-mono">84.2% Utilized</div>
                <div className="text-[10px] text-amber-400 font-mono">CSE Lab Reallocation Rec.</div>
              </div>
            </div>

            {/* Budget Trends Recharts Chart */}
            <div className="glass-card p-5 space-y-4 border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-400" />
                    12-Month Revenue & Budget Spending Trend Prediction
                  </h3>
                  <p className="text-xs text-slate-400">Actual collections vs ML projected budget expenditure</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/30">
                  CONFIDENCE: {finReport.confidenceScore}%
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={finReport.budgetTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="collectionsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                      formatter={(val: any) => [`₹${formatCurrency(Number(val))} Lakhs`, '']}
                    />
                    <Area type="monotone" dataKey="collections" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#collectionsGrad)" name="Collections" />
                    <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#expensesGrad)" name="Expenditures" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grid: Fee Defaults & Scholarship Allocation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. Fee Defaults Prediction Table */}
              <div className="glass-card p-5 space-y-4 border-rose-500/30 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle size={15} className="text-rose-400" />
                      AI Fee Defaults Risk Prediction Engine
                    </h3>
                    <span className="text-[10px] text-rose-300 font-mono font-bold">HIGH RISK FLAGGED</span>
                  </div>

                  <div className="space-y-2.5">
                    {finReport.defaultRiskStudents.map((st) => (
                      <div key={st.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-white">{st.studentName} ({st.rollNumber})</p>
                            <p className="text-[10px] text-slate-400">{st.department} &bull; Overdue: <strong className="text-rose-400 font-mono">₹{formatCurrency(st.overdueAmount)}</strong></p>
                          </div>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono ${
                            st.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {st.defaultProbability}% RISK
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 italic">Mitigation: {st.recommendedMitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <Button
                    onClick={() => handleExecuteFinanceAction('DISPATCH_FEE_REMINDERS')}
                    disabled={executedActions.includes('DISPATCH_FEE_REMINDERS')}
                    className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs py-2 flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    {executedActions.includes('DISPATCH_FEE_REMINDERS') ? 'Reminders Dispatched ✓' : 'Dispatch Payment Reminders & UPI Links →'}
                  </Button>
                </div>
              </div>

              {/* 2. Scholarship Allocation Optimization */}
              <div className="glass-card p-5 space-y-4 border-cyan-500/30 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Award size={15} className="text-cyan-400" />
                      AI Scholarship Allocation Matcher
                    </h3>
                    <span className="text-[10px] text-cyan-300 font-mono">₹25.0 Lakhs Fund Pool</span>
                  </div>

                  <div className="space-y-2.5">
                    {finReport.scholarshipAllocations.map((sch) => (
                      <div key={sch.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-white">{sch.studentName} ({sch.department})</p>
                            <p className="text-[10px] text-slate-400">Scheme: <strong className="text-cyan-300">{sch.scholarshipScheme}</strong> &bull; CGPA: <strong className="text-emerald-400 font-mono">{sch.cgpa}</strong></p>
                          </div>
                          <span className="text-[10px] font-mono font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                            +₹{formatCurrency(sch.recommendedGrantAmount)} Grant
                          </span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-slate-900 overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${sch.matchScore}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <Button
                    onClick={() => requestFinanceActionWithStepUp('APPROVE_SCHOLARSHIP_DISBURSEMENT')}
                    disabled={executedActions.includes('APPROVE_SCHOLARSHIP_DISBURSEMENT')}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs py-2 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    {executedActions.includes('APPROVE_SCHOLARSHIP_DISBURSEMENT') ? 'Scholarships Approved ✓' : 'Approve AI Scholarship Disbursement →'}
                  </Button>
                </div>
              </div>
            </div>
          </TabContent>
        )}

        {/* 2. My Fee Portal (Student View) */}
        {isStudent && currentStudent && (
          <TabContent value="my-fees" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 space-y-1 bg-slate-900/60 border-slate-800">
                <span className="text-xs text-slate-400">Total Semester Fee</span>
                <p className="text-xl font-extrabold text-white font-mono">₹{formatCurrency(currentStudent.feeTotal)}</p>
              </div>

              <div className="glass-card p-4 space-y-1 bg-slate-900/60 border-emerald-500/30">
                <span className="text-xs text-slate-400">Paid Amount</span>
                <p className="text-xl font-extrabold text-emerald-400 font-mono">₹{formatCurrency(currentStudent.feePaid)}</p>
              </div>

              <div className="glass-card p-4 space-y-1 bg-slate-900/60 border-rose-500/30">
                <span className="text-xs text-slate-400">Outstanding Balance</span>
                <p className="text-xl font-extrabold text-rose-400 font-mono">₹{formatCurrency(outstandingBal)}</p>
              </div>
            </div>

            <div className="glass-card p-5 space-y-4 border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard size={16} className="text-emerald-400" />
                Pay Outstanding Semester Fee Online
              </h3>

              {outstandingBal > 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-white">Spring Semester 2026 Tuition Fee</p>
                    <p className="text-xs text-slate-400">Due Date: 15th August 2026 &bull; Penalty Free Payment</p>
                  </div>
                  <Button
                    onClick={() => {
                      collectFee(currentStudent.id, outstandingBal, 'Online Gateway');
                      toast('Payment Success', `Outstanding fee balance of ₹${formatCurrency(outstandingBal)} paid.`, 'success');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-6"
                  >
                    Pay ₹{formatCurrency(outstandingBal)} Now via UPI / Netbanking
                  </Button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} /> All semester fees paid in full! No pending dues.
                </div>
              )}
            </div>
          </TabContent>
        )}

        {/* 3. Fee Collection Ledger Tab */}
        <TabContent value="history" className="pt-4">
          <Card className="border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white">Fee Receipt Collections Ledger</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Real-time audit log of fee transactions</CardDescription>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded border border-emerald-500/30">
                  {feeCollections.length} Transactions Recorded
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeCollections.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="text-xs font-mono text-cyan-400 font-bold">{fee.receiptNo}</TableCell>
                      <TableCell className="text-xs font-bold text-white">{fee.studentName}</TableCell>
                      <TableCell className="text-xs font-mono font-bold text-emerald-400">₹{formatCurrency(fee.amount)}</TableCell>
                      <TableCell className="text-xs text-slate-300">{fee.method}</TableCell>
                      <TableCell className="text-xs text-slate-400 font-mono">{fee.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabContent>
      </Tabs>

      {/* Collect Fee Modal */}
      <Modal isOpen={isCollectModalOpen} onClose={() => setIsCollectModalOpen(false)} title="Collect Fee Payment">
        <form onSubmit={handleSubmit(onSubmitPayment)} className="space-y-4">
          <Select label="Select Student" error={errors.studentId?.message} {...register('studentId')}>
            <option value="">-- Choose Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNo}) - Pending: ₹{formatCurrency((s.feeTotal || 0) - (s.feePaid || 0))}
              </option>
            ))}
          </Select>
          <Input label="Payment Amount (₹)" type="number" placeholder="e.g. 45000" error={errors.amount?.message} {...register('amount')} />
          <Select label="Payment Method" error={errors.method?.message} {...register('method')}>
            <option value="Online Gateway">Online Gateway (UPI / Cards)</option>
            <option value="Bank Demand Draft">Bank Demand Draft</option>
            <option value="NEFT / RTGS">NEFT / RTGS Transfer</option>
            <option value="Cash Counter">Cash Counter</option>
          </Select>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCollectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500">
              Collect & Print Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Zero-Trust Step-Up 2FA OTP Modal */}
      <StepUpAuthModal
        isOpen={isStepUpOpen}
        onClose={() => setIsStepUpOpen(false)}
        onSuccess={() => {
          if (pendingAction) {
            handleExecuteFinanceAction(pendingAction);
            setPendingAction('');
          }
        }}
        actionTitle="Approve AI Scholarship Disbursement"
        actionDescription="Authorizing the disbursement of ₹25.0 Lakhs scholarship pool to 5 merit candidates. This high-risk financial operation requires 2FA Step-Up OTP verification."
      />
    </div>
  );
};

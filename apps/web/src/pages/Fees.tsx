import React, { useState } from 'react';
import { useDatabase, type FeeCollection } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { DataGrid, type Column, Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { CreditCard, Plus, Receipt, Printer, Landmark } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const billingSchema = z.object({
  studentId: z.string().min(1, 'Select a student'),
  amount: z.coerce.number().min(1000, 'Min payment is ₹1,000').max(180000, 'Amount exceeds fee bracket'),
  method: z.string().min(1, 'Select payment method'),
});

type BillingFormInputs = z.infer<typeof billingSchema>;

export const Fees: React.FC = () => {
  const { feeCollections, collectFee, students } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeCollection | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const isStaff = currentRole === 'Accountant' || currentRole === 'Admin';
  const isStudent = currentRole === 'Student' || currentRole === 'Parent';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BillingFormInputs>();

  const onSubmitPayment = (data: BillingFormInputs) => {
    collectFee(data.studentId, data.amount, data.method);
    toast('Payment Collected', `₹${data.amount.toLocaleString()} received successfully.`, 'success');
    setIsCollectModalOpen(false);
    reset();
  };

  // Student specific parameters
  const activeStudent = students[0]; // Aarav
  const outstandingBal = activeStudent.feeTotal - activeStudent.feePaid;

  const handleSelfPay = () => {
    collectFee(activeStudent.id, outstandingBal, 'Online Gateway');
    toast('Payment Success', `Outstanding fee balance of ₹${outstandingBal.toLocaleString()} paid.`, 'success');
  };

  const columns: Column<FeeCollection>[] = [
    { key: 'receiptNo', label: 'Receipt ID', sortable: true },
    { key: 'studentName', label: 'Student', sortable: true },
    {
      key: 'amountPaid',
      label: 'Amount Paid',
      render: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">₹{row.amountPaid.toLocaleString()}</span>,
      sortable: true,
    },
    { key: 'paymentDate', label: 'Payment Date', sortable: true },
    { key: 'paymentMethod', label: 'Method' },
    {
      key: 'id',
      label: 'Receipt',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 flex items-center gap-1"
          onClick={() => {
            setSelectedReceipt(row);
            setIsReceiptOpen(true);
          }}
        >
          <Receipt size={12} /> View Invoice
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
            Accounts & Fees
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log student semester dues payments, review cash logs, and print invoices.
          </p>
        </div>
        {isStaff && (
          <Button onClick={() => setIsCollectModalOpen(true)} className="flex items-center gap-1.5">
            <Plus size={16} /> Record Payment
          </Button>
        )}
      </div>

      {isStudent ? (
        // STUDENT VIEW
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div>
                <CardTitle>My Fee Summary</CardTitle>
                <CardDescription>Academic year fee ledger</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Total Annual Fees</span>
                <span className="font-bold text-slate-805 dark:text-slate-205">₹{activeStudent.feeTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Amount Settled</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{activeStudent.feePaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Outstanding Balance</span>
                <span className="font-bold text-rose-500">₹{outstandingBal.toLocaleString()}</span>
              </div>

              {outstandingBal > 0 ? (
                <Button className="w-full flex items-center justify-center gap-1.5 mt-2" onClick={handleSelfPay}>
                  <CreditCard size={14} /> Pay Outstanding Dues
                </Button>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30 rounded-xl justify-center font-semibold mt-2">
                  All Fees Settled for 2026
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>My Payment History</CardTitle>
                <CardDescription>Review receipts of processed dues</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt ID</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeCollections
                    .filter((c) => c.studentId === activeStudent.id)
                    .map((col) => (
                      <TableRow key={col.id}>
                        <TableCell className="font-mono text-xs font-semibold">{col.receiptNo}</TableCell>
                        <TableCell className="font-bold">₹{col.amountPaid.toLocaleString()}</TableCell>
                        <TableCell>{col.paymentDate}</TableCell>
                        <TableCell>{col.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 flex items-center gap-1 ml-auto"
                            onClick={() => {
                              setSelectedReceipt(col);
                              setIsReceiptOpen(true);
                            }}
                          >
                            <Receipt size={12} /> View Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        // ACCOUNTANT VIEW
        <div className="flex flex-col gap-6">
          {/* KPI Mini-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
            <Card className="relative overflow-hidden">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">
                  <Landmark size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Invoiced</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200 block mt-1">₹9,00,000</span>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg">
                  <Landmark size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Received</span>
                  <span className="text-base font-bold text-slate-850 dark:text-slate-200 block mt-1">
                    ₹{feeCollections.reduce((acc, curr) => acc + curr.amountPaid, 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-rose-50 text-rose-650 dark:bg-rose-900/20 dark:text-rose-450 rounded-lg">
                  <Landmark size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Outstanding</span>
                  <span className="text-base font-bold text-slate-850 dark:text-slate-200 block mt-1">₹4,80,000</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ledger Table */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Accounts Ledger</CardTitle>
                <CardDescription>Processed payments transactions history</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <DataGrid columns={columns} data={feeCollections} searchKey="studentName" searchPlaceholder="Search students..." />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal isOpen={isCollectModalOpen} onClose={() => setIsCollectModalOpen(false)} title="Record Fee Payment">
        <form onSubmit={handleSubmit(onSubmitPayment)} className="flex flex-col gap-4">
          <Select
            label="Student Candidate"
            options={[
              { value: '', label: 'Select Student' },
              ...students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` })),
            ]}
            {...register('studentId', { required: true })}
            error={errors.studentId?.message}
          />
          <Input label="Collection Amount (INR)" type="number" placeholder="e.g. 50000" {...register('amount', { required: true })} error={errors.amount?.message} />
          <Select
            label="Payment Mode"
            options={[
              { value: '', label: 'Select Method' },
              { value: 'UPI / NetBanking', label: 'UPI / NetBanking' },
              { value: 'Credit Card', label: 'Credit Card' },
              { value: 'Debit Card', label: 'Debit Card' },
              { value: 'Demand Draft', label: 'Demand Draft' },
              { value: 'Cash Counter', label: 'Cash Counter' },
            ]}
            {...register('method', { required: true })}
            error={errors.method?.message}
          />

          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button variant="outline" type="button" onClick={() => setIsCollectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Record Payment</Button>
          </div>
        </form>
      </Modal>

      {/* Invoice Receipt Modal */}
      <Modal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} title="Tax Invoice Receipt" size="lg">
        {selectedReceipt && (
          <div className="flex flex-col gap-5">
            {/* Invoice Layout */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-surface dark:bg-slate-900 text-left flex flex-col gap-5 text-xs">
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xs font-bold font-display text-slate-805 dark:text-slate-205">ACADEMIA UNIVERSITY</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">VAT / GST REG: IN2026COLLEGE</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold block font-mono text-[10px] text-blue-600 dark:text-blue-400">{selectedReceipt.receiptNo}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{selectedReceipt.paymentDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 uppercase tracking-widest text-[8px] font-bold block mb-1">Received From</span>
                  <span className="font-bold text-slate-800 dark:text-slate-250 block">{selectedReceipt.studentName}</span>
                  <span className="text-slate-500 dark:text-slate-450 block font-mono">Roll: {selectedReceipt.studentId}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 uppercase tracking-widest text-[8px] font-bold block mb-1">Receipt Summary</span>
                  <span className="font-bold text-slate-800 dark:text-slate-250 block">₹{selectedReceipt.amountPaid.toLocaleString()}</span>
                  <span className="text-slate-550 dark:text-slate-450 block">Method: {selectedReceipt.paymentMethod}</span>
                </div>
              </div>

              <Table className="border border-slate-100 dark:border-slate-800/80 rounded-lg overflow-hidden mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-1.5">Description</TableHead>
                    <TableHead className="py-1.5 text-right">Tax</TableHead>
                    <TableHead className="py-1.5 text-right">Total (INR)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-2.0 font-semibold">Semester course fee payments</TableCell>
                    <TableCell className="py-2.0 text-right">₹0.00 (Exempt)</TableCell>
                    <TableCell className="py-2.0 text-right font-bold">₹{selectedReceipt.amountPaid.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
              <Button variant="outline" onClick={() => setIsReceiptOpen(false)}>
                Close
              </Button>
              <Button
                className="flex items-center gap-1.5"
                onClick={() => {
                  toast('Receipt Printing', 'Spooling invoice details to device printer...', 'success');
                  window.print();
                }}
              >
                <Printer size={14} /> Print Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

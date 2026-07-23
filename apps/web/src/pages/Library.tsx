import React, { useState } from 'react';
import { useDatabase, type Book } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { Plus, RefreshCw, QrCode, Radio, Sparkles, BookOpen, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const issueSchema = z.object({
  bookId: z.string().min(1, 'Select a book'),
  studentId: z.string().min(1, 'Select a student'),
});

type IssueFormInputs = z.infer<typeof issueSchema>;

export const Library: React.FC = () => {
  const { books, issueBook, returnBook, students } = useDatabase();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isScanningQR, setIsScanningQR] = useState(false);

  const isStaff = currentRole === 'Librarian' || currentRole === 'Admin';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IssueFormInputs>({
    resolver: zodResolver(issueSchema),
  });

  const onSubmitIssue = (data: IssueFormInputs) => {
    const student = students.find((s) => s.id === data.studentId);
    if (!student) return;

    const success = issueBook(data.bookId, data.studentId, student.name);
    if (success) {
      toast('Book Issued', `Book ID ${data.bookId} borrowed successfully by ${student.name}.`, 'success');
      setIsIssueModalOpen(false);
      reset();
    } else {
      toast('Error Issuing Book', 'Available stock is zero or book ID is invalid.', 'error');
    }
  };

  const handleReturn = (bookId: string, studentId: string) => {
    returnBook(bookId, studentId);
    toast('Book Returned', 'Returned book check-in completed.', 'success');
  };

  const handleQRScan = () => {
    setIsScanningQR(true);
    setTimeout(() => {
      setIsScanningQR(false);
      toast('RFID Tag Recognized', 'Book "Introduction to Algorithms (4th Ed)" checked out via RFID gate.', 'success');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight flex items-center gap-2">
            Library 2.0 & Digital E-Books
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              RFID & QR Automated Checkout
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Catalog search, RFID gate issue/return, fines tracking, and AI book recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={handleQRScan}
            disabled={isScanningQR}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <QrCode size={14} className={isScanningQR ? 'animate-spin' : ''} />
            {isScanningQR ? 'Scanning RFID...' : 'Simulate RFID Gate Checkout'}
          </button>
          {isStaff && (
            <Button size="sm" onClick={() => setIsIssueModalOpen(true)} className="gap-1.5">
              <Plus size={14} /> Manual Issue Book
            </Button>
          )}
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <Card className="glass-card border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles size={20} className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100">AI Reading Recommendation for You</h3>
              <p className="text-xs text-slate-400">Based on your enrollment in CS301 (Data Structures): "Clean Code & Refactoring by Martin Fowler"</p>
            </div>
          </div>

          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs rounded-xl border border-slate-700 shrink-0">
            Open E-Book PDF
          </button>
        </CardContent>
      </Card>

      <Tabs defaultValue="catalog">
        <TabList>
          <TabTrigger value="catalog">Book Catalog & RFID Stock</TabTrigger>
          <TabTrigger value="digital">Digital E-Library Vault</TabTrigger>
        </TabList>

        <TabContent value="catalog" className="mt-4">
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Copies (Avail / Total)</TableHead>
                  <TableHead className="text-right">Issued To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-bold text-xs">{book.title}</TableCell>
                    <TableCell className="text-xs">{book.author}</TableCell>
                    <TableCell className="text-xs font-mono">{book.isbn}</TableCell>
                    <TableCell>
                      <Badge variant="primary" className="text-[10px]">{book.category}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      {book.availableCopies} / {book.totalCopies}
                    </TableCell>
                    <TableCell className="text-right">
                      {book.issuedTo.length > 0 ? (
                        <div className="flex flex-col items-end text-[10px]">
                          {book.issuedTo.map((iss) => (
                            <span key={iss.studentId} className="text-slate-300 font-medium">
                              {iss.studentName} (Due: {iss.dueDate})
                              {isStaff && (
                                <button
                                  onClick={() => handleReturn(book.id, iss.studentId)}
                                  className="ml-2 text-emerald-400 hover:underline"
                                >
                                  Check In
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">In Shelf</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabContent>

        <TabContent value="digital" className="mt-4">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="text-emerald-400" size={18} />
              University E-Book Vault & Research PDF Repositories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {['Introduction to Algorithms 4th Edition.pdf', 'Distributed Systems Principles 2025.pdf', 'Neural Networks and Deep Learning.pdf'].map((book, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{book}</h4>
                  <span className="text-[10px] text-slate-400 block">PDF Document &bull; 14.2 MB</span>
                  <button className="w-full py-1.5 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                    <Download size={12} /> Download PDF
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </TabContent>
      </Tabs>

      {/* Manual Issue Modal */}
      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Issue Book to Student">
        <form onSubmit={handleSubmit(onSubmitIssue)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Select Book</label>
            <Select {...register('bookId')}>
              <option value="">Select a book...</option>
              {books.map((b) => (
                <option key={b.id} value={b.id} disabled={b.availableCopies === 0}>
                  {b.title} ({b.availableCopies} available)
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Select Student</label>
            <Select {...register('studentId')}>
              <option value="">Select a student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Issue Book</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

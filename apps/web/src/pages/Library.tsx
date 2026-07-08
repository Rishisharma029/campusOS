import React, { useState } from 'react';
import { useDatabase, type Book } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { DataGrid, type Column, Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { Plus, RefreshCw } from 'lucide-react';
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

  const isStaff = currentRole === 'Librarian' || currentRole === 'Admin';
  const isStudent = currentRole === 'Student' || currentRole === 'Parent';

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

  // Student specific borrowed books list
  const activeStudent = students[0]; // Aarav
  const borrowedBooks = books.flatMap((bk) =>
    bk.issuedTo
      .filter((iss) => iss.studentId === activeStudent.id)
      .map((iss) => ({
        ...iss,
        bookTitle: bk.title,
        bookAuthor: bk.author,
        bookId: bk.id,
      }))
  );

  const columns: Column<Book>[] = [
    { key: 'title', label: 'Book Title', sortable: true },
    { key: 'author', label: 'Author', sortable: true },
    { key: 'isbn', label: 'ISBN Code' },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'availableCopies',
      label: 'Inventory Available',
      render: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {row.availableCopies} / {row.totalCopies} copies
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
            Library Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse available text books, check library copies, and manage book borrowings.
          </p>
        </div>
        {isStaff && (
          <Button onClick={() => setIsIssueModalOpen(true)} className="flex items-center gap-1.5">
            <Plus size={16} /> Issue Book Copy
          </Button>
        )}
      </div>

      {isStudent ? (
        // STUDENT DASHBOARD
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div>
                <CardTitle>My Borrows Summary</CardTitle>
                <CardDescription>Active book check-outs</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-850">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Books Checked Out</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{borrowedBooks.length} Books</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-850">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Overdue Penalties</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0.00 (None)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>My Borrowed Books</CardTitle>
                <CardDescription>Dues schedules for book returns</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book ID</TableHead>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowedBooks.length > 0 ? (
                    borrowedBooks.map((borrow, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs font-semibold">{borrow.bookId}</TableCell>
                        <TableCell>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">{borrow.bookTitle}</span>
                          <span className="text-[10px] text-slate-400">{borrow.bookAuthor}</span>
                        </TableCell>
                        <TableCell>{borrow.issueDate}</TableCell>
                        <TableCell>
                          <Badge variant="warning">{borrow.dueDate}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                        No checked-out books.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        // STAFF / LIBRARIAN VIEW
        <Tabs defaultValue="catalog">
          <TabList>
            <TabTrigger value="catalog">Books Catalog</TabTrigger>
            <TabTrigger value="issued">
              Issued Records Ledger{' '}
              {books.flatMap((b) => b.issuedTo).length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-bold text-[9px]">
                  {books.flatMap((b) => b.issuedTo).length}
                </span>
              )}
            </TabTrigger>
          </TabList>

          {/* Tab 1: Catalog */}
          <TabContent value="catalog">
            <Card>
              <CardContent className="pt-6">
                <DataGrid columns={columns} data={books} searchKey="title" searchPlaceholder="Search book titles..." />
              </CardContent>
            </Card>
          </TabContent>

          {/* Tab 2: Issued Books */}
          <TabContent value="issued" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.flatMap((b) => b.issuedTo).length > 0 ? (
              books.flatMap((b) =>
                b.issuedTo.map((iss) => ({
                  ...iss,
                  bookTitle: b.title,
                  bookId: b.id,
                }))
              ).map((record, index) => (
                <Card key={index} hoverable>
                  <CardHeader className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 block mb-0.5">{record.bookId}</span>
                      <CardTitle className="text-xs">{record.bookTitle}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                      <span className="text-slate-400">Issued To:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {record.studentName} ({record.studentId})
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                      <span className="text-slate-400">Issue Date:</span>
                      <span>{record.issueDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/40">
                      <span className="text-slate-400">Due Date:</span>
                      <Badge variant="warning">{record.dueDate}</Badge>
                    </div>

                    <div className="flex justify-end mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/10 border-emerald-200"
                        onClick={() => handleReturn(record.bookId, record.studentId)}
                      >
                        <RefreshCw size={12} className="mr-1.5" /> Return Check-in
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="md:col-span-2 text-center py-10 text-slate-400 text-xs">
                No active borrowings recorded.
              </div>
            )}
          </TabContent>
        </Tabs>
      )}

      {/* Issue Book Modal */}
      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Issue Library Book">
        <form onSubmit={handleSubmit(onSubmitIssue)} className="flex flex-col gap-4">
          <Select
            label="Book Title Catalog"
            options={[
              { value: '', label: 'Select Book' },
              ...books.map((b) => ({ value: b.id, label: `${b.title} (${b.availableCopies} Left)` })),
            ]}
            {...register('bookId', { required: true })}
            error={errors.bookId?.message}
          />
          <Select
            label="Student Borrowee"
            options={[
              { value: '', label: 'Select Student' },
              ...students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` })),
            ]}
            {...register('studentId', { required: true })}
            error={errors.studentId?.message}
          />

          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button variant="outline" type="button" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Issue Book</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import { apiFetch } from "../lib/apiClient";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies_total: number;
  copies_available: number;
  created_at: string;
}

export interface BookBorrow {
  id: string;
  book_id: string;
  student_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  fine_amount: number;
  created_at: string;
}

export async function apiGetBooks(skip = 0, limit = 50): Promise<Book[]> {
  return apiFetch<Book[]>(`/api/v1/books?skip=${skip}&limit=${limit}`);
}

export async function apiGetBook(id: string): Promise<Book> {
  return apiFetch<Book>(`/api/v1/books/${id}`);
}

export async function apiCreateBook(data: Partial<Book>): Promise<Book> {
  return apiFetch<Book>("/api/v1/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiBorrowBook(bookId: string, studentId: string, days = 14): Promise<BookBorrow> {
  const issue = new Date().toISOString().split("T")[0];
  const due = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  
  return apiFetch<BookBorrow>(`/api/v1/books/${bookId}/borrow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      book_id: bookId,
      student_id: studentId,
      issue_date: issue,
      due_date: due,
    }),
  });
}

export async function apiReturnBook(borrowId: string): Promise<BookBorrow> {
  const today = new Date().toISOString().split("T")[0];
  return apiFetch<BookBorrow>(`/api/v1/borrows/${borrowId}/return`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ return_date: today }),
  });
}

export async function apiGetStudentBorrows(studentId: string): Promise<BookBorrow[]> {
  return apiFetch<BookBorrow[]>(`/api/v1/borrows/student/${studentId}`);
}

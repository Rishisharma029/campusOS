import { apiFetch } from "../lib/apiClient";

export interface FeeCollection {
  id: string;
  student_id: string;
  invoice_no: string;
  amount_total: number;
  amount_paid: number;
  due_date: string;
  status: string; // Paid | Pending | Overdue
  payment_mode: string;
  academic_year: string;
  fee_type: string;
  created_at: string;
}

export async function apiGetAllFees(skip = 0, limit = 50): Promise<FeeCollection[]> {
  return apiFetch<FeeCollection[]>(`/api/v1/fees?skip=${skip}&limit=${limit}`);
}

export async function apiGetStudentFees(studentId: string): Promise<FeeCollection[]> {
  return apiFetch<FeeCollection[]>(`/api/v1/fees/student/${studentId}`);
}

export async function apiCreateFee(data: Partial<FeeCollection>): Promise<FeeCollection> {
  return apiFetch<FeeCollection>("/api/v1/fees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiPayFee(feeId: string, amount: number, mode: string): Promise<FeeCollection> {
  return apiFetch<FeeCollection>(`/api/v1/fees/${feeId}/pay`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount_paid: amount, payment_mode: mode }),
  });
}

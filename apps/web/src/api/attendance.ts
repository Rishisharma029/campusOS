import { apiFetch } from "../lib/apiClient";

export interface AttendanceResponse {
  id: string;
  student_id: string;
  subject_code: string;
  date: string;
  status: string; // Present | Absent | Late
  created_at: string;
}

export interface ResultResponse {
  id: string;
  student_id: string;
  subject_name: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  exam_type: string;
  created_at: string;
}

export async function apiGetAttendance(studentId: string): Promise<AttendanceResponse[]> {
  return apiFetch<AttendanceResponse[]>(`/api/v1/attendance?student_id=${studentId}`);
}

export async function apiSubmitAttendance(data: Partial<AttendanceResponse>): Promise<AttendanceResponse> {
  return apiFetch<AttendanceResponse>("/api/v1/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiGetResults(studentId: string): Promise<ResultResponse[]> {
  return apiFetch<ResultResponse[]>(`/api/v1/results?student_id=${studentId}`);
}

export async function apiSubmitResult(data: Partial<ResultResponse>): Promise<ResultResponse> {
  return apiFetch<ResultResponse>("/api/v1/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

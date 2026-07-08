import { apiFetch } from "../lib/apiClient";
import type { AttendanceResponse, ResultResponse } from "./attendance";

export interface StudentProfile {
  id: string;
  user_id: string;
  roll_no: string;
  department: string;
  course: string;
  year: number;
  semester: number;
  enrollment_year: number;
  cgpa: number;
  parent_name: string;
  parent_email: string;
  phone: string;
  attendance_rate: number;
  status: string;
  hostel_room: string;
  transport_bus: string;
  placement_status: string;
  created_at: string;
}

export async function apiGetStudents(skip = 0, limit = 50): Promise<StudentProfile[]> {
  return apiFetch<StudentProfile[]>(`/api/v1/students?skip=${skip}&limit=${limit}`);
}

export async function apiGetStudent(id: string): Promise<StudentProfile> {
  return apiFetch<StudentProfile>(`/api/v1/students/${id}`);
}

export async function apiCreateStudent(data: Partial<StudentProfile>): Promise<StudentProfile> {
  return apiFetch<StudentProfile>("/api/v1/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiUpdateStudent(id: string, data: Partial<StudentProfile>): Promise<StudentProfile> {
  return apiFetch<StudentProfile>(`/api/v1/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiDeleteStudent(id: string): Promise<void> {
  await apiFetch(`/api/v1/students/${id}`, {
    method: "DELETE",
  });
}

export async function apiGetStudentAttendance(id: string, skip = 0, limit = 100): Promise<AttendanceResponse[]> {
  return apiFetch<AttendanceResponse[]>(`/api/v1/students/${id}/attendance?skip=${skip}&limit=${limit}`);
}

export async function apiGetStudentResults(id: string): Promise<ResultResponse[]> {
  return apiFetch<ResultResponse[]>(`/api/v1/students/${id}/results`);
}

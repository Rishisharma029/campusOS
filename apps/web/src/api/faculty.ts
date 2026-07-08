import { apiFetch } from "../lib/apiClient";

export interface FacultyProfile {
  id: string;
  user_id: string;
  employee_id: string;
  department_id?: string;
  designation: string;
  workload_hours: number;
  qualification: string;
  join_date?: string;
  status: string;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  faculty_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string; // Pending | Approved | Rejected
  created_at: string;
}

export async function apiGetFaculty(skip = 0, limit = 50): Promise<FacultyProfile[]> {
  return apiFetch<FacultyProfile[]>(`/api/v1/faculty?skip=${skip}&limit=${limit}`);
}

export async function apiGetFacultyMember(id: string): Promise<FacultyProfile> {
  return apiFetch<FacultyProfile>(`/api/v1/faculty/${id}`);
}

export async function apiCreateFaculty(data: Partial<FacultyProfile>): Promise<FacultyProfile> {
  return apiFetch<FacultyProfile>("/api/v1/faculty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiUpdateFaculty(id: string, data: Partial<FacultyProfile>): Promise<FacultyProfile> {
  return apiFetch<FacultyProfile>(`/api/v1/faculty/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiGetFacultyLeaves(facultyId: string): Promise<LeaveRequest[]> {
  return apiFetch<LeaveRequest[]>(`/api/v1/faculty/${facultyId}/leaves`);
}

export async function apiApplyLeave(facultyId: string, data: Partial<LeaveRequest>): Promise<LeaveRequest> {
  return apiFetch<LeaveRequest>(`/api/v1/faculty/${facultyId}/leaves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, faculty_id: facultyId }),
  });
}

export async function apiApproveLeave(leaveId: string, approve: boolean): Promise<LeaveRequest> {
  return apiFetch<LeaveRequest>(`/api/v1/faculty/leaves/${leaveId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: approve ? "Approved" : "Rejected" }),
  });
}

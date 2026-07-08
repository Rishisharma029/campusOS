import { apiFetch } from "../lib/apiClient";

export interface Department {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Course {
  id: string;
  department_id: string;
  name: string;
  code: string;
  duration_years: number;
  created_at: string;
}

export interface Subject {
  id: string;
  course_id: string;
  name: string;
  code: string;
  credits: number;
  created_at: string;
}

export async function apiGetDepartments(): Promise<Department[]> {
  return apiFetch<Department[]>("/api/v1/departments");
}

export async function apiCreateDepartment(data: Partial<Department>): Promise<Department> {
  return apiFetch<Department>("/api/v1/departments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiGetCourses(): Promise<Course[]> {
  return apiFetch<Course[]>("/api/v1/courses");
}

export async function apiCreateCourse(data: Partial<Course>): Promise<Course> {
  return apiFetch<Course>("/api/v1/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function apiGetSubjects(): Promise<Subject[]> {
  return apiFetch<Subject[]>("/api/v1/subjects");
}

export async function apiGetSubjectsByCourse(courseId: string): Promise<Subject[]> {
  return apiFetch<Subject[]>(`/api/v1/subjects/course/${courseId}`);
}

export async function apiCreateSubject(data: Partial<Subject>): Promise<Subject> {
  return apiFetch<Subject>("/api/v1/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

import { apiFetch, setAccessToken, setRefreshToken, clearTokens } from "../lib/apiClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: string;
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionDevice {
  id: string;
  ip_address: string;
  device_type: string;
  os_name: string;
  browser_name: string;
  last_activity: string;
}

export async function apiLogin(data: LoginRequest): Promise<TokenResponse> {
  const res = await apiFetch<TokenResponse>("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  setAccessToken(res.access_token);
  setRefreshToken(res.refresh_token);
  return res;
}

export async function apiLogout(): Promise<void> {
  try {
    await apiFetch("/api/v1/auth/sessions/revoke-all", { method: "POST" });
  } finally {
    clearTokens();
  }
}

export async function apiGetMe(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/api/v1/users/me");
}

export async function apiGetSessions(): Promise<SessionDevice[]> {
  return apiFetch<SessionDevice[]>("/api/v1/auth/sessions");
}

export async function apiRevokeSession(sessionId: string): Promise<void> {
  await apiFetch(`/api/v1/auth/sessions/${sessionId}/revoke`, { method: "POST" });
}

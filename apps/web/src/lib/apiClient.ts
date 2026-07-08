const API_BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

let _accessToken: string | null = sessionStorage.getItem("access_token");
let _refreshToken: string | null = localStorage.getItem("refresh_token");
let _isRefreshing = false;
let _refreshSubscribers: ((token: string) => void)[] = [];

export const setAccessToken = (token: string) => {
  _accessToken = token;
  sessionStorage.setItem("access_token", token);
};

export const setRefreshToken = (token: string) => {
  _refreshToken = token;
  localStorage.setItem("refresh_token", token);
};

export const clearTokens = () => {
  _accessToken = null;
  _refreshToken = null;
  sessionStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getAccessToken = () => _accessToken;
export const getRefreshToken = () => _refreshToken;

function subscribeTokenRefresh(cb: (token: string) => void) {
  _refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  _refreshSubscribers.forEach((cb) => cb(token));
  _refreshSubscribers = [];
}

async function performRefresh(): Promise<string> {
  const token = getRefreshToken();
  if (!token) {
    throw new Error("No refresh token available");
  }

  const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: token }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();
  setAccessToken(data.access_token);
  setRefreshToken(data.refresh_token);
  return data.access_token;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (_accessToken) {
    headers.set("Authorization", `Bearer ${_accessToken}`);
  }
  
  const finalOptions = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${path}`, finalOptions);

  if (response.status === 401 && path !== "/api/v1/auth/login" && path !== "/api/v1/auth/refresh") {
    // If unauthorized, attempt token refresh
    if (!_isRefreshing) {
      _isRefreshing = true;
      try {
        const newAccessToken = await performRefresh();
        _isRefreshing = false;
        onRefreshed(newAccessToken);
      } catch (err) {
        _isRefreshing = false;
        clearTokens();
        // Redirect to login page in browser environment
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw err;
      }
    }

    // Wait for refresh to complete and retry the request
    return new Promise<T>((resolve, reject) => {
      subscribeTokenRefresh(async (token) => {
        try {
          headers.set("Authorization", `Bearer ${token}`);
          const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
          if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            reject(new Error(json.detail || "Request failed"));
            return;
          }
          const data = await res.json() as T;
          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.detail || `API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

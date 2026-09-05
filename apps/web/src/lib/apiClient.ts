const API_BASE = (import.meta.env.VITE_API_URL as string) || "";

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
  sessionStorage.removeItem("auth_active");
  sessionStorage.removeItem("auth_user");
  sessionStorage.removeItem("auth_mode");
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
    clearTokens();
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

async function retryWithToken<T>(path: string, options: RequestInit, token: string): Promise<T> {
  const retryHeaders = new Headers(options.headers || {});
  retryHeaders.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers: retryHeaders });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.detail || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
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
    if (_isRefreshing) {
      // Refresh already in progress — subscribe and wait for it to complete
      return new Promise<T>((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          retryWithToken<T>(path, options, newToken).then(resolve).catch(reject);
        });
      });
    }

    // No refresh in progress — start one
    _isRefreshing = true;
    try {
      const newAccessToken = await performRefresh();
      _isRefreshing = false;
      onRefreshed(newAccessToken);
      // Retry the original request with the new token
      return retryWithToken<T>(path, options, newAccessToken);
    } catch (err) {
      _isRefreshing = false;
      // Notify all waiting subscribers of failure
      _refreshSubscribers.forEach((cb) => cb(""));
      _refreshSubscribers = [];
      clearTokens();
      // Redirect to login page only if not already there, respecting base path
      if (typeof window !== "undefined" && !window.location.pathname.endsWith("/login")) {
        const basePath = window.location.hostname.endsWith("github.io") ? "/campusOS" : "";
        window.location.href = `${basePath}/login`;
      }
      throw err;
    }
  }

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.detail || `API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
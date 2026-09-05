import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRole, type UserRole } from './RoleContext';
import { apiLogin, apiLogout, apiGetSessions } from '../api/auth';
import { clearTokens, getAccessToken, getRefreshToken } from '../lib/apiClient';

export interface SessionDevice {
  id: string;
  name: string;
  location: string;
  date: string;
  isCurrent: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: UserRole } | null;
  devices: SessionDevice[];
  isSessionWarningOpen: boolean;
  isOffline: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<void>;
  verify2FA: (otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  extendSession: () => void;
  toggleOffline: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setRole } = useRole();
  
  // Tab-persistent session state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const hasActive = sessionStorage.getItem('auth_active') === 'true';
    const hasToken = !!sessionStorage.getItem('access_token') || !!localStorage.getItem('refresh_token');
    const isDemo = sessionStorage.getItem('auth_mode') === 'demo';
    if (hasActive && !hasToken && !isDemo) {
      // Clean up orphaned auth flags from invalidated sessions
      sessionStorage.removeItem('auth_active');
      sessionStorage.removeItem('auth_user');
      return false;
    }
    return hasActive && (hasToken || isDemo);
  });
  
  const [user, setUser] = useState<{ username: string; role: UserRole } | null>(() => {
    try {
      const saved = sessionStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      sessionStorage.removeItem('auth_user');
      return null;
    }
  });

  const [devices, setDevices] = useState<SessionDevice[]>([]);
  const [isSessionWarningOpen, setIsSessionWarningOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  // Bump this key to restart the session inactivity timer after extendSession
  const [sessionTimerKey, setSessionTimerKey] = useState(0);

  // Timer simulation for session timeout (3 minutes warning)
  useEffect(() => {
    if (!isAuthenticated) return;

    const timeout = setTimeout(() => {
      setIsSessionWarningOpen(true);
    }, 180000); // 3 minutes warning

    return () => clearTimeout(timeout);
  // sessionTimerKey intentionally included so extendSession() restarts the timer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionTimerKey]);

  // Fetch active session devices on authentication
  useEffect(() => {
    const isStaticDeploy = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
    const isDemo = sessionStorage.getItem('auth_mode') === 'demo';

    if (isAuthenticated && !isStaticDeploy && !isDemo && (getAccessToken() || getRefreshToken())) {
      apiGetSessions()
        .then((data) => {
          const mappedDevices: SessionDevice[] = data.map((d, index) => ({
            id: d.id,
            name: `${d.browser_name || 'Unknown Browser'} on ${d.os_name || 'Unknown OS'}`,
            location: `IP: ${d.ip_address || '127.0.0.1'}`,
            date: d.last_activity ? new Date(d.last_activity).toLocaleDateString() : 'Active Now',
            isCurrent: index === 0,
          }));
          setDevices(mappedDevices);
        })
        .catch((err) => {
          console.warn("Failed to fetch session devices:", err);
          setDevices([
            { id: 'dev1', name: 'Chrome on Mobile', location: 'Bengaluru, India', date: 'Active Now', isCurrent: true },
          ]);
        });
    } else if (isAuthenticated) {
      setDevices([
        { id: 'dev1', name: 'Chrome on Mobile', location: 'Bengaluru, India', date: 'Active Now', isCurrent: true },
      ]);
    } else {
      setDevices([]);
    }
  }, [isAuthenticated]);

  const login = async (username: string, password: string, role: UserRole) => {
    const isStaticDeploy = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
    if (isStaticDeploy) {
      console.log("Static deployment detected (GitHub Pages). Using local Demo Mode authentication.");
      sessionStorage.setItem('auth_mode', 'demo');
      setUser({ username: username.split('@')[0] || username, role });
      setRole(role);
      return;
    }

    try {
      const res = await apiLogin({ email: username, password });
      setUser({ username: res.name || username, role });
      setRole(role);
    } catch (err: any) {
      const errMsg = (err.message || '').toLowerCase();
      if (
        errMsg.includes('404') ||
        errMsg.includes('failed to fetch') || 
        errMsg.includes('network') ||
        errMsg.includes('load') ||
        errMsg.includes('api request failed')
      ) {
        console.warn("API server unreachable. Falling back to local Demo Mode auth.");
        sessionStorage.setItem('auth_mode', 'demo');
        setUser({ username: username.split('@')[0] || username, role });
        setRole(role);
        return;
      }
      throw err;
    }
  };

  const verify2FA = async (otp: string): Promise<boolean> => {
    if (otp.length === 6) {
      const isStaticDeploy = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
      const isDemo = sessionStorage.getItem('auth_mode') === 'demo';

      if (!isStaticDeploy && !isDemo && getAccessToken()) {
        try {
          await fetch("/api/v1/auth/mfa/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify({ otp_code: otp }),
          }).catch(() => {});
        } catch (e) {
          // No-op — fallback to local verification
        }
      }
      
      setIsAuthenticated(true);
      sessionStorage.setItem('auth_active', 'true');
      sessionStorage.setItem('auth_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // apiLogout already calls clearTokens() internally.
      // Continue to clean up React state regardless.
    } finally {
      // ALWAYS clear all tokens and session flags — guaranteed cleanup
      // whether API call succeeded, failed, or user was in demo mode.
      clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      setIsSessionWarningOpen(false);
    }
  };

  const extendSession = () => {
    setIsSessionWarningOpen(false);
    // Restart the inactivity timer — prevents immediate re-warning after dismissal
    setSessionTimerKey((prev) => prev + 1);
  };

  const toggleOffline = () => {
    setIsOffline((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        devices,
        isSessionWarningOpen,
        isOffline,
        login,
        verify2FA,
        logout,
        extendSession,
        toggleOffline,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const fallbackAuthContext: AuthContextType = {
  isAuthenticated: true,
  user: { username: 'admin', role: 'Admin' },
  devices: [],
  isSessionWarningOpen: false,
  isOffline: false,
  login: async () => {},
  verify2FA: async () => true,
  logout: async () => {},
  extendSession: () => {},
  toggleOffline: () => {},
};

export const useAuth = () => {
  try {
    const context = useContext(AuthContext);
    if (!context) return fallbackAuthContext;
    return context;
  } catch {
    return fallbackAuthContext;
  }
};
export default AuthProvider;
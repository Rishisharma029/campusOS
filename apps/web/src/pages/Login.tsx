import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { OTPInput } from '../components/ui/OTPInput';
import { ShieldCheck, Laptop, Smartphone, Key, Lock, User, Server, Globe } from 'lucide-react';
import type { UserRole } from '../context/RoleContext';

export const Login: React.FC = () => {
  const { login, verify2FA, isAuthenticated, devices } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const splineRef = useRef<HTMLElement | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [step, setStep] = useState<'credentials' | 'twofactor'>('credentials');
  
  const [otpVal, setOtpVal] = useState('');
  const [otpError, setOtpError] = useState('');

  // Password strength calculation states
  const [pwdStrength, setPwdStrength] = useState({ score: 0, label: 'Weak', color: 'bg-red-500' });

  // Hide 3D embedded text and CTA in Spline scene so our custom branding displays cleanly
  useEffect(() => {
    const viewer = splineRef.current;
    if (!viewer) return;

    const cleanupScene = () => {
      const app = (viewer as any)._spline;
      if (!app?._scene) return;

      const toHide = ['Text', 'Text 2', 'Text 3', 'Text 4', 'CTA', 'Rectangle', 'Сursor'];
      app._scene.traverse((o: any) => {
        if (
          toHide.includes(o.name) ||
          o.name?.toLowerCase().includes('text') ||
          o.name?.toLowerCase().includes('cta') ||
          o.name?.toLowerCase().includes('rectangle')
        ) {
          o.visible = false;
        }
      });
      app.requestRender?.();
    };

    viewer.addEventListener('load-complete', cleanupScene);
    const interval = setInterval(cleanupScene, 200);
    const timeout = setTimeout(() => clearInterval(interval), 6000);

    return () => {
      viewer.removeEventListener('load-complete', cleanupScene);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Monitor password change to update strength indicator
  useEffect(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = 'Weak';
    let color = 'bg-red-500';
    if (score >= 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
    } else if (score >= 2) {
      label = 'Medium';
      color = 'bg-amber-500';
    }

    setPwdStrength({ score, label, color });
  }, [password]);

  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast('Empty fields', 'Please enter your username and password.', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(username, password, selectedRole);
      toast('2FA Required', 'Enter the 6-digit OTP code to continue.', 'info');
      setStep('twofactor');
    } catch (err: any) {
      toast('Login Failed', err.message || 'Invalid email or password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpVal.length < 6) {
      setOtpError('OTP code must be 6 digits.');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await verify2FA(otpVal);
      if (success) {
        toast('Welcome back', `Logged in as ${selectedRole} successfully!`, 'success');
        navigate('/');
      } else {
        setOtpError('Invalid code. Please try again.');
        toast('Verification Failed', 'Invalid OTP code entered.', 'error');
      }
    } catch (err: any) {
      toast('Verification Failed', err.message || 'MFA validation failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      
      {/* Brand Identity Pane with Interactive Spline 3D Scene */}
      <div className="flex-1 bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-slate-900 p-8 md:p-12 flex flex-col justify-between text-white border-r border-blue-900/40 relative overflow-hidden min-h-[500px]">
        {/* Spline 3D Interactive Canvas */}
        <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
          <spline-viewer
            ref={splineRef as any}
            url="https://prod.spline.design/r3J9s106Ku9w6vmO/scene.splinecode"
            className="w-full h-full block"
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          />
        </div>

        {/* Subtle gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 pointer-events-none z-[1]" />

        <div className="flex items-center gap-3 relative z-10 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg font-black text-white text-xl font-display tracking-tight">
            C
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight m-0">CampusOS</h1>
            <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">ERP portal v2</p>
          </div>
        </div>

        <div className="my-auto py-8 max-w-md relative z-10 space-y-4 pointer-events-auto">
          <span className="px-2.5 py-1 text-[10px] bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-full font-bold uppercase tracking-wider backdrop-blur-md">
            Enterprise Grade
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight tracking-tight text-white text-balance drop-shadow-md">
            The Operating System for Modern Education.
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed drop-shadow-sm max-w-sm">
            CampusOS unifies academic directories, smart analytics predictive engines, timetabling networks, and library borrows in a single, responsive canvas.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-6 pointer-events-auto">
          <span>© 2026 CampusOS Inc.</span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Operational
          </span>
        </div>
      </div>

      {/* Forms & Security Access Pane */}
      <div className="w-full md:w-[480px] bg-surface flex flex-col justify-center p-8 relative">
        <div className="w-full max-w-sm mx-auto space-y-8">
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-slate-850 dark:text-slate-100">
              {step === 'credentials' ? 'Sign in to Portal' : 'Two-Factor Verification'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {step === 'credentials' 
                ? 'Select your administrative role and enter credentials.' 
                : 'A verification code has been sent to your registered device.'}
            </p>
          </div>

          {step === 'credentials' ? (
            <>
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="portal-role-select" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Select Portal Role</label>
                <div className="relative">
                  <select
                    id="portal-role-select"
                    aria-label="Select Portal Role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full h-9 rounded-xl border border-main bg-surface px-3 py-1 text-xs text-slate-800 dark:text-slate-100 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="Admin" className="bg-slate-900 text-slate-100 py-1">System Administrator</option>
                    <option value="Student" className="bg-slate-900 text-slate-100 py-1">Student Portal</option>
                    <option value="Faculty" className="bg-slate-900 text-slate-100 py-1">Faculty Portal</option>
                    <option value="Accountant" className="bg-slate-900 text-slate-100 py-1">Finance Accountant</option>
                    <option value="Librarian" className="bg-slate-900 text-slate-100 py-1">Librarian Ledger</option>
                    <option value="Registrar" className="bg-slate-900 text-slate-100 py-1">Registrar / Academic Affairs</option>
                    <option value="Placement Cell" className="bg-slate-900 text-slate-100 py-1">Placement Coordinator</option>
                    <option value="Industry Portal" className="bg-slate-900 text-slate-100 py-1">Industry Partner / Recruiter Portal</option>
                    <option value="Hostel Warden" className="bg-slate-900 text-slate-100 py-1">Hostel Warden</option>
                    <option value="Transport Manager" className="bg-slate-900 text-slate-100 py-1">Transport Manager</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="username-input" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User size={14} />
                  </span>
                  <input
                    id="username-input"
                    aria-label="Username or Email"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter email or username"
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-main text-xs bg-surface text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="password-input" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Password</label>
                  <button type="button" onClick={() => toast('Password Reset', 'Please contact system administrator.', 'info')} className="text-[10px] font-semibold text-primary hover:text-primary-dark cursor-pointer bg-transparent border-0 p-0">Forgot?</button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock size={14} />
                  </span>
                  <input
                    id="password-input"
                    aria-label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-main text-xs bg-surface text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Password strength indicators */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold">
                      <span>Password Strength</span>
                      <span className={pwdStrength.score >= 4 ? 'text-emerald-500' : pwdStrength.score >= 2 ? 'text-amber-500' : 'text-red-500'}>
                        {pwdStrength.label}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <div
                          key={idx}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            idx <= pwdStrength.score ? pwdStrength.color : 'bg-slate-200 dark:bg-slate-700/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full h-9 mt-2 flex items-center justify-center gap-1.5">
                <ShieldCheck size={16} /> Authenticate Session
              </Button>
            </form>
            
            {/* Quick Demo Login Panel */}
            <div className="pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block text-center">
                ✨ Quick Demo Portals (Bypass Backend)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    setUsername('admin@campusos.org');
                    setPassword('AdminPassword@123');
                    setSelectedRole('Admin');
                    setIsLoading(true);
                    try {
                      await login('admin@campusos.org', 'AdminPassword@123', 'Admin', true);
                      toast('MFA Provisioned', 'Demo code: 123456 (or any 6 digits).', 'info');
                      setStep('twofactor');
                    } catch (e) {
                      toast('Demo Login Error', 'Failed to initialize.', 'error');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="py-1 px-2 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setUsername('student@campusos.org');
                    setPassword('StudentPassword@123');
                    setSelectedRole('Student');
                    setIsLoading(true);
                    try {
                      await login('student@campusos.org', 'StudentPassword@123', 'Student', true);
                      toast('MFA Provisioned', 'Demo code: 123456 (or any 6 digits).', 'info');
                      setStep('twofactor');
                    } catch (e) {
                      toast('Demo Login Error', 'Failed to initialize.', 'error');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="py-1 px-2 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-center"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setUsername('industry@campusos.org');
                    setPassword('IndustryPassword@123');
                    setSelectedRole('Industry Portal');
                    setIsLoading(true);
                    try {
                      await login('industry@campusos.org', 'IndustryPassword@123', 'Industry Portal', true);
                      toast('MFA Provisioned', 'Demo code: 123456 (or any 6 digits).', 'info');
                      setStep('twofactor');
                    } catch (e) {
                      toast('Demo Login Error', 'Failed to initialize.', 'error');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="py-1 px-2 border border-emerald-500/30 bg-emerald-500/10 rounded-lg text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer text-center"
                >
                  Industry Portal
                </button>
              </div>
            </div>
            </>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <OTPInput
                value={otpVal}
                onChange={(val) => {
                  setOtpVal(val);
                  setOtpError('');
                }}
                error={otpError}
              />
              
              <div className="flex flex-col gap-2">
                <Button type="submit" isLoading={isLoading} className="w-full h-9 flex items-center justify-center gap-1.5">
                  <Key size={14} /> Verify & Access Portal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => setStep('credentials')}
                  className="w-full h-9 text-xs"
                >
                  Back to login
                </Button>
              </div>
            </form>
          )}

          {/* Connected Device Summary Section */}
          <div className="pt-6 border-t border-main space-y-3">
            <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Server size={12} /> Active Access Locations
            </h3>
            <div className="space-y-2 text-[10px]">
              {devices.map((dev) => (
                <div key={dev.id} className="flex justify-between items-center p-2 border border-main/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                  <div className="flex items-center gap-2">
                    {dev.name.includes('iPhone') ? (
                      <Smartphone size={13} className="text-slate-400" />
                    ) : (
                      <Laptop size={13} className="text-slate-400" />
                    )}
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        {dev.name}
                        {dev.isCurrent && (
                          <span className="px-1 py-0.2 rounded bg-blue-100 text-blue-800 text-[8px] font-bold">CURRENT</span>
                        )}
                      </p>
                      <p className="text-[9px] text-slate-400 flex items-center gap-0.5">
                        <Globe size={8} /> {dev.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold">{dev.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

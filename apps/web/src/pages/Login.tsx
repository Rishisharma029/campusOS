import React, { useState, useEffect } from 'react';
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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [step, setStep] = useState<'credentials' | 'twofactor'>('credentials');
  
  const [otpVal, setOtpVal] = useState('');
  const [otpError, setOtpError] = useState('');

  // Password strength calculation states
  const [pwdStrength, setPwdStrength] = useState({ score: 0, label: 'Weak', color: 'bg-red-500' });

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
      
      {/* Brand Identity Pane */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 p-8 md:p-16 flex flex-col justify-between text-white border-r border-blue-900/40 relative overflow-hidden">
        
        {/* Animated grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg font-black text-white text-xl font-display tracking-tight">
            C
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight m-0">CampusOS</h1>
            <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">ERP portal v2</p>
          </div>
        </div>

        <div className="my-16 max-w-md relative z-10 space-y-4">
          <span className="px-2.5 py-1 text-[10px] bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full font-bold uppercase tracking-wider">
            Enterprise Grade
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight tracking-tight text-white text-balance">
            The Operating System for Modern Education.
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            CampusOS unifies academic directories, smart analytics predictive engines, timetabling networks, and library borrows in a single, responsive canvas.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-400 border-t border-slate-800 pt-6">
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
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Select Portal Role</label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full h-9 rounded-xl border border-main bg-surface px-3 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  >
                    <option value="Admin">System Administrator</option>
                    <option value="Student">Student Portal</option>
                    <option value="Faculty">Faculty Portal</option>
                    <option value="Parent">Parent/Guardian Portal</option>
                    <option value="Accountant">Finance Accountant</option>
                    <option value="Librarian">Librarian Ledger</option>
                    <option value="Placement Cell">Placement Coordinator</option>
                    <option value="Hostel Warden">Hostel Warden</option>
                    <option value="Transport Manager">Transport Manager</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User size={14} />
                  </span>
                  <input
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
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Password</label>
                  <a href="#forgot" className="text-[10px] font-semibold text-primary hover:text-primary-dark">Forgot?</a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock size={14} />
                  </span>
                  <input
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
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    setUsername('admin@campusos.org');
                    setPassword('AdminPassword@123');
                    setSelectedRole('Admin');
                    setIsLoading(true);
                    try {
                      await login('admin@campusos.org', 'AdminPassword@123', 'Admin');
                      toast('MFA Provisioned', 'Demo code verification required.', 'info');
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
                      await login('student@campusos.org', 'StudentPassword@123', 'Student');
                      toast('MFA Provisioned', 'Demo code verification required.', 'info');
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
                    setUsername('parent@campusos.org');
                    setPassword('ParentPassword@123');
                    setSelectedRole('Parent');
                    setIsLoading(true);
                    try {
                      await login('parent@campusos.org', 'ParentPassword@123', 'Parent');
                      toast('MFA Provisioned', 'Demo code verification required.', 'info');
                      setStep('twofactor');
                    } catch (e) {
                      toast('Demo Login Error', 'Failed to initialize.', 'error');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="py-1 px-2 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer text-center"
                >
                  Parent
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

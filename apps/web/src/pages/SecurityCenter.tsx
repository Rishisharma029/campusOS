import React, { useState } from 'react';
import { Shield, Key, Lock, Smartphone, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  ip: string;
  device: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
}

export const SecurityCenter: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  const [auditLogs] = useState<AuditLog[]>([
    { id: 'log-801', user: 'admin@campusos.edu', action: 'Modified RBAC Faculty Permissions', ip: '192.168.1.45', device: 'Chrome / Windows 11', timestamp: '10 mins ago', status: 'SUCCESS' },
    { id: 'log-802', user: 'student_9402', action: 'Failed 2FA OTP Attempt', ip: '103.24.11.89', device: 'Safari / iPhone 15 Pro', timestamp: '45 mins ago', status: 'WARNING' },
    { id: 'log-803', user: 'registrar@campusos.edu', action: 'Exported Semester 6 Results CSV', ip: '192.168.1.12', device: 'Firefox / macOS Sonoma', timestamp: '2 hours ago', status: 'SUCCESS' },
  ]);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="text-emerald-400" size={26} />
            CampusOS Security & Access Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure 2FA, view live security audit logs, manage active session devices, and RBAC permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Controls */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Lock className="text-emerald-400" size={18} />
            Authentication & Encryption Settings
          </h3>

          {/* 2FA Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Two-Factor Authentication (2FA)</h4>
              <p className="text-[10px] text-slate-400">TOTP Authenticator app / SMS verification</p>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Login Alerts Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Instant Login Alerts</h4>
              <p className="text-[10px] text-slate-400">Receive email notification for new device logins</p>
            </div>
            <button
              onClick={() => setLoginAlertsEnabled(!loginAlertsEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                loginAlertsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {loginAlertsEnabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Encryption Badge */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle size={14} />
              AES-256 System Encryption Active
            </span>
            <p className="text-[11px] text-emerald-200/80">
              All student records, financial invoices, and password hashes are encrypted at rest and in transit.
            </p>
          </div>
        </div>

        {/* Audit Logs Workspace */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="text-blue-400" size={18} />
            Real-time Security Audit Logs & Session History
          </h3>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{log.action}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    User: {log.user} &bull; IP: {log.ip} &bull; Device: {log.device}
                  </p>
                </div>

                <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

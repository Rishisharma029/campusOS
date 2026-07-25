import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast';
import { Shield, ShieldAlert, Lock, Unlock, AlertTriangle, KeyRound, Monitor, Ban, FileSpreadsheet, Activity, RefreshCw } from 'lucide-react';
import { SessionSecurityEngine, type ActiveSessionRecord, type RateLimitIpBanRecord, type DlpExportAuditRecord } from '../lib/sessionSecurityEngine';
import { SecurityRadarEngine } from '../lib/securityRadar';

export const SecurityVault: React.FC = () => {
  const toastContext = useToast();
  const toast = toastContext?.toast || ((t: string, m?: string) => console.log(t, m));

  const [sessions, setSessions] = useState<ActiveSessionRecord[]>(SessionSecurityEngine.getActiveSessions());
  const [ipBans, setIpBans] = useState<RateLimitIpBanRecord[]>(SessionSecurityEngine.getIpBans());
  const [dlpAudits] = useState<DlpExportAuditRecord[]>(SessionSecurityEngine.getDlpAudits());
  const radarLogs = SecurityRadarEngine.getSecurityRadarLogs();

  const [manualIpToBan, setManualIpToBan] = useState<string>('');
  const [manualBanReason, setManualBanReason] = useState<string>('');

  const handleRemoteLockout = (sessionId: string, userName: string) => {
    SessionSecurityEngine.invalidateSession(sessionId);
    setSessions([...SessionSecurityEngine.getActiveSessions()]);
    toast('Session Terminated', `Session ${sessionId} for ${userName} remotely invalidated. User forced to re-authenticate.`, 'warning');
  };

  const handleManualBanIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualIpToBan.trim()) return;
    const newBan = SessionSecurityEngine.banIpAddress(manualIpToBan, manualBanReason || 'Manual Admin Security Lockout');
    setIpBans([...SessionSecurityEngine.getIpBans()]);
    toast('IP Ban Issued', `IP ${newBan.ipAddress} banned for 30 minutes.`, 'error');
    setManualIpToBan('');
    setManualBanReason('');
  };

  const handleUnbanIp = (ipAddress: string) => {
    SessionSecurityEngine.unbanIpAddress(ipAddress);
    setIpBans([...SessionSecurityEngine.getIpBans()]);
    toast('IP Ban Resolved', `IP ${ipAddress} unbanned successfully.`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-rose-500/40 bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-950/40 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono tracking-wider">
                ENTERPRISE MULTI-LAYER SECURITY SOC
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2 m-0">
              <Shield size={22} className="text-rose-400" />
              Security Operations Center (SOC) & Audit Vault
            </h1>
            <p className="text-xs text-slate-300">
              Real-time session hijacking protection, rate limiting IP bans, DLP exfiltration guards, and Zero-Trust 2FA step-up logs.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/20 px-3 py-1.5 rounded-full border border-rose-500/30 self-start md:self-auto flex items-center gap-2">
            <Activity size={14} className="animate-pulse" /> SOC THREAT MONITOR ACTIVE
          </span>
        </div>
      </div>

      {/* KPI Security Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-1.5 border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Tracked Sessions</span>
            <Monitor size={15} className="text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">{sessions.filter(s => s.status === 'ACTIVE_SECURE').length} Sessions</div>
          <div className="text-[10px] text-slate-400">1 Suspected Hijack Flagged</div>
        </div>

        <div className="glass-card p-4 space-y-1.5 border-rose-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rate Limit IP Bans</span>
            <Ban size={15} className="text-rose-400" />
          </div>
          <div className="text-xl font-extrabold text-rose-400 font-mono">{ipBans.filter(b => b.status === 'ACTIVE_BAN').length} Active Bans</div>
          <div className="text-[10px] text-rose-300 font-mono">Brute-force protection enabled</div>
        </div>

        <div className="glass-card p-4 space-y-1.5 border-cyan-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Security Radar Incidents</span>
            <ShieldAlert size={15} className="text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-cyan-300 font-mono">{radarLogs.length} Logged</div>
          <div className="text-[10px] text-cyan-400 font-mono">Unauthorized URL scans</div>
        </div>

        <div className="glass-card p-4 space-y-1.5 border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DLP Data Export Audits</span>
            <FileSpreadsheet size={15} className="text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-amber-300 font-mono">{dlpAudits.length} Audited</div>
          <div className="text-[10px] text-amber-400 font-mono">Bulk exfiltration guard active</div>
        </div>
      </div>

      <Tabs defaultValue="sessions">
        <TabList className="bg-slate-950/80 p-1 border border-slate-800 rounded-xl">
          <TabTrigger value="sessions">🌐 Active Sessions & Remote Lockout</TabTrigger>
          <TabTrigger value="ip-bans">⛔ Rate Limiting & IP Bans</TabTrigger>
          <TabTrigger value="dlp">📦 DLP Export Audits</TabTrigger>
          <TabTrigger value="radar">🚨 Security Radar Log</TabTrigger>
        </TabList>

        {/* Tab 1: Active Sessions & Remote Lockout */}
        <TabContent value="sessions" className="space-y-4 pt-4">
          <Card className="border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white">Live User Session Ledger & Device Fingerprints</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Monitor active user connections & issue 1-Click remote session lockouts</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSessions([...SessionSecurityEngine.getActiveSessions()])}
                  className="h-8 px-3 text-xs flex items-center gap-1.5 border-slate-700 text-slate-300"
                >
                  <RefreshCw size={13} /> Refresh Telemetry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className={`p-4 rounded-xl border transition-all ${
                      sess.status === 'SUSPECTED_HIJACK'
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : sess.status === 'LOCKED_OUT'
                        ? 'bg-slate-950 border-slate-900 opacity-60'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{sess.userName} ({sess.userRole})</h4>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                              sess.status === 'SUSPECTED_HIJACK'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                                : sess.status === 'LOCKED_OUT'
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {sess.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          ID: {sess.userId} &bull; IP: <strong className="text-cyan-300">{sess.ipAddress}</strong> &bull; Location: {sess.location}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Device: {sess.deviceFingerprint} &bull; Connected: {sess.loginTimestamp}
                        </p>
                      </div>

                      {sess.status !== 'LOCKED_OUT' && (
                        <Button
                          onClick={() => handleRemoteLockout(sess.id, sess.userName)}
                          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 px-4 flex items-center gap-1.5 self-start md:self-center"
                        >
                          <Lock size={13} /> Remote Lockout & Invalidate &rarr;
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabContent>

        {/* Tab 2: Rate Limiting & IP Bans */}
        <TabContent value="ip-bans" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Manual IP Ban Control Panel */}
            <Card className="lg:col-span-1 border-slate-800">
              <CardHeader>
                <div>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <Ban size={16} className="text-rose-400" />
                    Manual IP Security Ban
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">Issue instant 30-min firewall lockout</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualBanIp} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Target IP Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 198.51.100.42"
                      value={manualIpToBan}
                      onChange={(e) => setManualIpToBan(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-rose-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300">Reason for Lockout</label>
                    <input
                      type="text"
                      placeholder="e.g. Excessive login failures"
                      value={manualBanReason}
                      onChange={(e) => setManualBanReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-rose-500 mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2">
                    Enforce Immediate IP Ban
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Active IP Ban Ledger */}
            <Card className="lg:col-span-2 border-slate-800">
              <CardHeader>
                <div>
                  <CardTitle className="text-sm font-bold text-white">Active Rate Limit IP Firewall Bans</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Automated & manual IP throttle ledger</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ipBans.map((ban) => (
                    <div key={ban.ipAddress} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-400 font-mono">{ban.ipAddress}</span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono ${
                            ban.status === 'ACTIVE_BAN' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {ban.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{ban.reason}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Banned At: {ban.bannedAt} &bull; Expires: {ban.expiresAt}</p>
                      </div>

                      {ban.status === 'ACTIVE_BAN' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnbanIp(ban.ipAddress)}
                          className="h-8 px-3 text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          <Unlock size={13} /> Unban IP
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabContent>

        {/* Tab 3: DLP Export Audits */}
        <TabContent value="dlp" className="pt-4">
          <Card className="border-slate-800">
            <CardHeader>
              <div>
                <CardTitle className="text-sm font-bold text-white">Data Loss Prevention (DLP) Data Export Ledger</CardTitle>
                <CardDescription className="text-xs text-slate-400">Real-time audit log of bulk database reports & exfiltration inspection</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dlpAudits.map((dlp) => (
                  <div key={dlp.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{dlp.reportType} ({dlp.recordsExported} Records)</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono ${
                          dlp.riskLevel === 'HIGH_BULK_EXFILTRATION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {dlp.riskLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">User: {dlp.user} &bull; Timestamp: {dlp.timestamp}</p>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded border border-emerald-500/30">
                      {dlp.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabContent>

        {/* Tab 4: Security Radar Log */}
        <TabContent value="radar" className="pt-4">
          <Card className="border-slate-800">
            <CardHeader>
              <div>
                <CardTitle className="text-sm font-bold text-white">Security Radar: Unauthorized Student Route Access Ledger</CardTitle>
                <CardDescription className="text-xs text-slate-400">Recorded IP addresses, Student IDs, and URL navigation attempts</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {radarLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 font-bold">🚨 {log.threatLevel}</span>
                        <span className="text-white font-bold">{log.studentName} ({log.studentId})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-900">
                      <div>Attempted Route: <strong className="text-rose-300">{log.attemptedRoute}</strong></div>
                      <div>IP Address: <strong className="text-cyan-300">{log.ipAddress}</strong></div>
                      <div>Radar Status: <strong className="text-amber-400">{log.status}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabContent>
      </Tabs>
    </div>
  );
};

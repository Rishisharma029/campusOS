import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { Activity, Zap, ShieldCheck, Bot, Clock, Users, Database, CheckCircle2, RefreshCw, Cpu, Server, Radio } from 'lucide-react';
import { SystemHealthEngine, type CampusVitalSummary, type SubsystemHealthItem } from '../lib/systemHealthEngine';

export const SystemHealth: React.FC = () => {
  const toastContext = useToast();
  const toast = toastContext?.toast || ((t: string, m?: string) => console.log(t, m));

  const [vitals, setVitals] = useState<CampusVitalSummary>(SystemHealthEngine.getVitalSummary());
  const [subsystems] = useState<SubsystemHealthItem[]>(SystemHealthEngine.getSubsystems());
  const [diagnosing, setDiagnosing] = useState(false);

  const handleRunDiagnostics = () => {
    setDiagnosing(true);
    setTimeout(() => {
      const updated = SystemHealthEngine.runDiagnosticCheck();
      setVitals({ ...updated });
      setDiagnosing(false);
      toast('System Diagnostic Complete', `Full campus telemetry verified. Services: ${updated.servicesOnlinePercent}%, Response Time: ${updated.responseTimeSec}s.`, 'success');
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-950/40 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SYSTEM HEALTH & LIVE VITALITY TELEMETRY
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2 m-0">
              <Activity size={22} className="text-emerald-400" />
              Campus System Vitals & Live Pulse
            </h1>
            <p className="text-xs text-slate-300">
              Real-time monitoring of campus uptime, AI agent heartbeat, API latency, security threat levels, IoT energy savings, and live headcount.
            </p>
          </div>

          <Button
            onClick={handleRunDiagnostics}
            isLoading={diagnosing}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2.5 px-4 flex items-center gap-2 shadow-lg shadow-emerald-500/20 self-start md:self-auto"
          >
            <RefreshCw size={14} className={diagnosing ? 'animate-spin' : ''} /> Run Full Campus Diagnostic
          </Button>
        </div>
      </div>

      {/* 6 Primary Live Vital Cards (Verbatim User Requested Telemetry) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Services Online */}
        <div className="glass-card p-5 space-y-3 border-emerald-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Services Online</span>
            <Server size={18} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
              {vitals.servicesOnlinePercent}%
            </span>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              ALL SYSTEMS GO
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">Database, API, Auth & Storage Operational</p>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${vitals.servicesOnlinePercent}%` }} />
          </div>
        </div>

        {/* 2. AI Agents */}
        <div className="glass-card p-5 space-y-3 border-purple-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Agents</span>
            <Bot size={18} className="text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-300 font-mono tracking-tight">
              {vitals.activeAiAgentsCount} Active
            </span>
            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
              ADK & GEMINI
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">CAO, Academic, Faculty & Vision AI Subagents</p>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full w-full animate-pulse" />
          </div>
        </div>

        {/* 3. Response Time */}
        <div className="glass-card p-5 space-y-3 border-cyan-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response Time</span>
            <Clock size={18} className="text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-300 font-mono tracking-tight">
              {vitals.responseTimeSec} sec
            </span>
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
              SUB-SECOND
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">Global API & DB Query Latency</p>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full w-4/5" />
          </div>
        </div>

        {/* 4. Threat Level */}
        <div className="glass-card p-5 space-y-3 border-emerald-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Threat Level</span>
            <ShieldCheck size={18} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
              {vitals.threatLevel}
            </span>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              SECURE
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">SOC Radar & Vision AI Monitoring 48 CCTV Feeds</p>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-full" />
          </div>
        </div>

        {/* 5. Energy Saving Today */}
        <div className="glass-card p-5 space-y-3 border-amber-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Energy Saving Today</span>
            <Zap size={18} className="text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
              {vitals.energySavingTodayPercent}%
            </span>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              ₹4.2L / MO
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">Smart HVAC & Vacant Room Power Auto-Cutoff</p>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${vitals.energySavingTodayPercent * 3}%` }} />
          </div>
        </div>

        {/* 6. Current Occupancy */}
        <div className="glass-card p-5 space-y-3 border-blue-500/40 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Occupancy</span>
            <Users size={18} className="text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-300 font-mono tracking-tight">
              {vitals.currentOccupancyPercent}%
            </span>
            <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
              CAMPUS LIVE
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">1,420 Active Students & Staff Present</p>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${vitals.currentOccupancyPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Subsystem Microservice Health Ledger */}
      <Card className="border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Radio size={16} className="text-emerald-400" />
                Subsystem Health & Micro-Service Response Ledger
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Live ping latency & service availability</CardDescription>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/30">
              LAST DIAGNOSTIC: {vitals.lastDiagnosticTimestamp}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subsystems.map((sub) => (
              <div key={sub.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{sub.name}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Category: {sub.category.replace('_', ' ')} &bull; Last Ping: {sub.lastPing}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>Latency: <strong className="text-cyan-300">{sub.latencyMs}ms</strong></div>
                  <div>Uptime: <strong className="text-emerald-400">{sub.uptimePercentage}%</strong></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

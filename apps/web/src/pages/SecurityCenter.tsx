import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { SecurityVisionEngine, type VisionDetection } from '../lib/securityVisionEngine';
import { SecurityRadarEngine, type SecurityRadarAuditLog } from '../lib/securityRadar';
import {
  ShieldAlert,
  Sparkles,
  Camera,
  UserX,
  Users,
  Briefcase,
  AlertTriangle,
  Send,
  CheckCircle2,
  Lock,
  Eye,
  Shield,
  Zap,
  PhoneCall,
  MapPin,
  Clock,
} from 'lucide-react';

export const SecurityCenter: React.FC = () => {
  const { currentRole } = useRole();
  const isStudent = currentRole === 'Student';

  const [detections, setDetections] = useState<VisionDetection[]>(
    SecurityVisionEngine.getVisionDetections()
  );
  const [executedPayloads, setExecutedPayloads] = useState<string[]>([]);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleExecuteSecurityAction = (payload: string, description: string) => {
    const res = SecurityVisionEngine.executeSecurityAction(payload);
    setExecutedPayloads(prev => [...prev, payload]);
    if (payload === 'TRIGGER_CAMPUS_SOS') setSosTriggered(true);
    setActiveMessage(res.message);
    setTimeout(() => setActiveMessage(null), 6000);
  };

  const getDetectionIcon = (type: string) => {
    switch (type) {
      case 'UNKNOWN_VISITOR': return <UserX size={18} className="text-rose-400" />;
      case 'OVERCROWDING': return <Users size={18} className="text-amber-400" />;
      case 'UNATTENDED_BAG': return <Briefcase size={18} className="text-purple-400" />;
      default: return <ShieldAlert size={18} className="text-red-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-rose-500/40 bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-600 text-white shadow-lg shadow-rose-500/20">
                <ShieldAlert size={24} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                  AI Safety & CCTV Vision AI Center
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                    Vision AI Model v4.0
                  </span>
                </h1>
                <p className="text-xs text-slate-300">Live CCTV Telemetry: Unknown Visitors &bull; Overcrowding &bull; Unattended Bags &bull; Emergency SOS</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExecuteSecurityAction('TRIGGER_CAMPUS_SOS', 'Emergency SOS Lockdown')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
                sosTriggered
                  ? 'bg-red-700 text-white animate-bounce shadow-2xl shadow-red-500'
                  : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/30'
              }`}
            >
              <ShieldAlert size={16} />
              {sosTriggered ? '🚨 SOS LOCKDOWN ACTIVE 🚨' : 'Trigger Emergency SOS Lockdown'}
            </button>
          </div>
        </div>
      </div>

      {/* Dispatch Feedback Message */}
      {activeMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-white text-xs font-bold flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 size={18} className="text-rose-400" />
          <span>{activeMessage}</span>
        </div>
      )}

      {/* Vision AI Detection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Eye size={16} className="text-rose-400" />
            Active Vision AI Anomaly Detections ({detections.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">48 CCTV Feeds Live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {detections.map(vis => {
            const isExecuted = executedPayloads.includes(vis.actionPayload);

            return (
              <div
                key={vis.id}
                className="glass-card p-5 space-y-4 flex flex-col justify-between border-rose-500/30 hover:border-rose-500/50 transition-all relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800">
                        {getDetectionIcon(vis.type)}
                      </div>
                      <span className="text-xs font-extrabold text-white font-mono">
                        {vis.type.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse font-mono">
                      {vis.confidence}% CONFIDENCE
                    </span>
                  </div>

                  {/* Simulated Vision AI CCTV Snapshot Frame with Bounding Box */}
                  <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1"><Camera size={10} /> {vis.cameraLocation}</span>
                      <span>{vis.timestamp}</span>
                    </div>

                    {/* Bounding Box Visual Overlay */}
                    <div className="self-center p-2 rounded border-2 border-dashed border-rose-500 bg-rose-500/10 text-[10px] font-bold text-rose-300 font-mono animate-pulse">
                      [VISION AI DETECTED: {vis.type}]
                    </div>

                    <div className="text-[9px] text-emerald-400 font-mono">
                      ● CCTV RECORDING & SCANNING
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{vis.description}</p>
                </div>

                {/* 1-Click Security Dispatch Action */}
                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleExecuteSecurityAction(vis.actionPayload, vis.description)}
                    disabled={isExecuted}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isExecuted
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/20'
                    }`}
                  >
                    {isExecuted ? (
                      <>
                        <CheckCircle2 size={14} /> Guard Dispatched ✓
                      </>
                    ) : (
                      <>
                        <Zap size={14} /> Dispatch Security Response &rarr;
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Radar Audit Ledger (Under Radar Tracking) */}
      <div className="glass-card p-6 space-y-4 border-rose-500/30">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-400" />
              Security Radar: Unauthorized Student Route Access Ledger
            </h3>
            <p className="text-xs text-slate-400">Under-radar audit log recording IP addresses, Student IDs, Device Fingerprints, and Timestamp of unauthorized URL attempts</p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            {SecurityRadarEngine.getSecurityRadarLogs().length} Incidents Monitored
          </span>
        </div>

        <div className="space-y-3">
          {SecurityRadarEngine.getSecurityRadarLogs().map(log => (
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
      </div>
    </div>
  );
};

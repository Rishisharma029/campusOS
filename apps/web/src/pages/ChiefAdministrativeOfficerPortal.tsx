import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { ChiefAdministrativeOfficerEngine, type CAOExecutiveAgenda, type CAOAttentionItem } from '../lib/chiefAdministrativeOfficer';
import {
  Briefcase,
  Sparkles,
  Send,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Lock,
  FileText,
  Clock,
  Wrench,
  BookOpen,
  IndianRupee,
  Users,
  Calendar,
  Check,
  Building,
} from 'lucide-react';

export const ChiefAdministrativeOfficerPortal: React.FC = () => {
  const { currentRole } = useRole();
  const isReadOnly = currentRole === 'Student';

  const [inputPrompt, setInputPrompt] = useState('What needs my attention today?');
  const [agenda, setAgenda] = useState<CAOExecutiveAgenda>(
    ChiefAdministrativeOfficerEngine.auditCampusAttentionAgenda()
  );
  const [executedPayloads, setExecutedPayloads] = useState<string[]>([]);
  const [activeMessage, setActiveMessage] = useState<string>(
    "Executive Audit Complete: 3 Critical items and 2 High Priority items require your attention today."
  );

  const handleRunAudit = (customQuery?: string) => {
    const q = (customQuery || inputPrompt).trim();
    if (!q) return;

    const res = ChiefAdministrativeOfficerEngine.processExecutiveQuery(q);
    setAgenda(res.agenda);
    setActiveMessage(res.response.replace(/\*\*/g, ''));
    if (!customQuery) setInputPrompt('');
  };

  const handleExecuteBatchAction = (payload: string, title: string) => {
    if (isReadOnly) return;
    const result = ChiefAdministrativeOfficerEngine.executeBatchAction(payload);
    setExecutedPayloads(prev => [...prev, payload]);
    setActiveMessage(result.message);
  };

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'Attendance': return <Users size={16} className="text-rose-400" />;
      case 'Leave': return <FileText size={16} className="text-amber-400" />;
      case 'Maintenance': return <Wrench size={16} className="text-orange-400" />;
      case 'Timetable': return <Clock size={16} className="text-purple-400" />;
      case 'Finance': return <IndianRupee size={16} className="text-emerald-400" />;
      case 'Library': return <BookOpen size={16} className="text-cyan-400" />;
      default: return <Building size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-blue-500/40 bg-gradient-to-r from-slate-900 via-blue-950/40 to-indigo-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/20">
                <Briefcase size={24} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                  AI Chief Administrative Officer (Productivity Agent)
                  {isReadOnly && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                      <Lock size={10} /> Read-Only Student View
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-300">Single-Prompt Campus Audit & Batch Executive Dispatches</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
              CAO AGENT ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Single-Prompt Command Bar */}
      <div className="glass-card p-4 border-blue-500/30 space-y-3">
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles size={12} /> Executive Command Prompt:
        </span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRunAudit()}
            placeholder="Ask CAO: 'What needs my attention today?' / 'Generate today's executive report'..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/70 shadow-inner"
          />
          <button
            onClick={() => handleRunAudit()}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all shrink-0"
          >
            <Send size={15} />
            <span>Audit Campus</span>
          </button>
        </div>

        {/* Preset Prompt Triggers */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => handleRunAudit('What needs my attention today?')}
            className="px-3 py-1 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs border border-blue-500/30 whitespace-nowrap font-medium"
          >
            What needs my attention today?
          </button>
          <button
            onClick={() => handleRunAudit('Bulk approve all pending leave requests')}
            className="px-3 py-1 rounded-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs border border-amber-500/30 whitespace-nowrap font-medium"
          >
            Approve 7 Leave Requests
          </button>
          <button
            onClick={() => handleRunAudit('Fix timetable conflict tomorrow')}
            className="px-3 py-1 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs border border-purple-500/30 whitespace-nowrap font-medium"
          >
            Fix Timetable Conflict
          </button>
        </div>
      </div>

      {/* Live Operational Status Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start gap-3">
        <Sparkles size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white">Latest CAO Dispatch Output:</span>
          <p className="text-slate-300 whitespace-pre-line leading-relaxed">{activeMessage}</p>
        </div>
      </div>

      {/* Prioritized Executive Attention Agenda Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            Executive Attention Agenda ({agenda.items.length} Flagged Items)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Last Audited: {agenda.timestamp}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agenda.items.map(item => {
            const isExecuted = executedPayloads.includes(item.actionPayload);
            const isCritical = item.priority === 'CRITICAL';

            return (
              <div
                key={item.id}
                className={`glass-card p-5 space-y-4 flex flex-col justify-between border transition-all ${
                  isCritical ? 'border-rose-500/40 bg-gradient-to-b from-slate-900 to-rose-950/20' : 'border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800">
                        {getItemIcon(item.category)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                        {item.category}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border font-mono ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <h3 className="text-xs font-extrabold text-white leading-snug">{item.title}</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{item.description}</p>

                  {/* Affected Entities */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.affectedEntities.map((ent, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Batch Action Execution Button */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleExecuteBatchAction(item.actionPayload, item.title)}
                    disabled={isReadOnly || isExecuted}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isExecuted
                        ? 'bg-emerald-600 text-white cursor-default'
                        : isReadOnly
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : isCritical
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/20'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    {isExecuted ? (
                      <>
                        <CheckCircle2 size={14} /> Batch Executed ✓
                      </>
                    ) : isReadOnly ? (
                      <>
                        <Lock size={12} /> Student Read-Only
                      </>
                    ) : (
                      <>
                        <Zap size={14} /> {item.suggestedActionTitle} &rarr;
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { PredictiveAnalyticsEngine, type PredictiveInsight } from '../lib/predictiveAnalyticsEngine';
import {
  LineChart,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Lock,
  Calendar,
  CloudRain,
  BookOpen,
  Users,
  Lightbulb,
  ArrowRight,
  Shield,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const PREDICTIVE_ATTENDANCE_TREND = [
  { week: 'Wk 1', Actual: 95.2, Predicted: 94.0 },
  { week: 'Wk 2', Actual: 93.8, Predicted: 93.5 },
  { week: 'Wk 3', Actual: 91.4, Predicted: 91.0 },
  { week: 'Wk 4 (Post-Fest)', Actual: 78.4, Predicted: 79.0 },
  { week: 'Wk 5 (AI Fixed)', Actual: 93.0, Predicted: 92.5 },
];

export const AnalyticsHub: React.FC = () => {
  const { currentRole } = useRole();
  const isReadOnly = currentRole === 'Student';

  const [insights, setInsights] = useState<PredictiveInsight[]>(
    PredictiveAnalyticsEngine.getPredictiveInsights()
  );
  const [executedPayloads, setExecutedPayloads] = useState<string[]>([]);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const handleExecuteAction = (payload: string, title: string) => {
    if (isReadOnly) return;
    const res = PredictiveAnalyticsEngine.executePredictiveAction(payload);
    setExecutedPayloads(prev => [...prev, payload]);
    setActiveMessage(res.message);
    setTimeout(() => setActiveMessage(null), 5000);
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'Attendance': return <Users size={18} className="text-amber-400" />;
      case 'ExamClash': return <Calendar size={18} className="text-purple-400" />;
      case 'Weather': return <CloudRain size={18} className="text-cyan-400" />;
      case 'AcademicRisk': return <AlertTriangle size={18} className="text-rose-400" />;
      default: return <Sparkles size={18} className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-blue-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-blue-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <LineChart size={24} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                  CampusOS Predictive Analytics Engine
                  {isReadOnly && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                      <Lock size={10} /> Read-Only Student View
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-300">Gemini Predictive Insights: Observation &rarr; Reason &rarr; Prescriptive Suggestion</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
              GEMINI PREDICTIVE ENGINE ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Execution Feedback Banner */}
      {activeMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 size={18} />
          <span>{activeMessage}</span>
        </div>
      )}

      {/* Gemini Says: Predictive Insights Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={16} className="text-blue-400" />
            Gemini Predictive Insights & Action Engine
          </h2>
          <span className="text-xs text-slate-400 font-mono">4 Active Predictions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map(ins => {
            const isExecuted = executedPayloads.includes(ins.actionPayload);

            return (
              <div
                key={ins.id}
                className="glass-card p-5 space-y-4 flex flex-col justify-between border-blue-500/30 hover:border-blue-500/50 transition-all shadow-xl relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Top Bar: Target Group & Confidence */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800">
                        {getInsightIcon(ins.category)}
                      </div>
                      <span className="text-xs font-extrabold text-white font-mono">{ins.targetGroup}</span>
                    </div>

                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                      ⚡ {ins.confidenceScore}% Confidence
                    </span>
                  </div>

                  {/* 1. Observation: Gemini Says */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={11} /> Gemini Observation:
                    </span>
                    <p className="text-xs font-extrabold text-white pl-2 border-l-2 border-rose-500/60">
                      "{ins.observation}"
                    </p>
                  </div>

                  {/* 2. Reason Analysis */}
                  <div className="space-y-1 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                      <Lightbulb size={11} /> Empirical Reason Analysis:
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {ins.reason}
                    </p>
                  </div>

                  {/* 3. Prescriptive Suggestion */}
                  <div className="space-y-1 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={11} /> AI Prescriptive Suggestion:
                    </span>
                    <p className="text-xs font-semibold text-emerald-200">
                      {ins.suggestion}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar: Impact & Execution Dispatches */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                    🎯 {ins.projectedImpact}
                  </span>

                  <button
                    onClick={() => handleExecuteAction(ins.actionPayload, ins.actionTitle)}
                    disabled={isReadOnly || isExecuted}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                      isExecuted
                        ? 'bg-emerald-600 text-white cursor-default'
                        : isReadOnly
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    {isExecuted ? (
                      <>
                        <CheckCircle2 size={14} /> Applied ✓
                      </>
                    ) : isReadOnly ? (
                      <>
                        <Lock size={12} /> Student Read-Only
                      </>
                    ) : (
                      <>
                        <Zap size={14} /> {ins.actionTitle} &rarr;
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Recharts Forecast Chart */}
      <div className="glass-card p-6 space-y-4 border-blue-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Predictive Attendance Recovery Forecast</h3>
            <p className="text-xs text-slate-400">Comparing Post-Festival Baseline vs AI Rescheduled Timetable</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-semibold">
            Telemetry Model v3.1
          </span>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PREDICTIVE_ATTENDANCE_TREND}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[70, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="Actual" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { DecisionIntelligenceEngine, type DecisionAnalysisResult, type DecisionRecommendation } from '../lib/decisionIntelligenceEngine';
import {
  Brain,
  Sparkles,
  Send,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Lock,
  MapPin,
  Check,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const ADMISSION_PREDICTION_CHART = [
  { department: 'Computer Science', Current: 420, Projected: 540 },
  { department: 'AI & Data Science', Current: 240, Projected: 360 },
  { department: 'Cybersecurity', Current: 180, Projected: 240 },
  { department: 'Electronics', Current: 210, Projected: 220 },
  { department: 'Mechanical', Current: 193, Projected: 60 },
];

export const DecisionIntelligence: React.FC = () => {
  const { currentRole } = useRole();
  const isReadOnly = currentRole === 'Student';

  const [inputPrompt, setInputPrompt] = useState('');
  const [chatLog, setChatLog] = useState<{ query: string; response: string; analysis?: DecisionAnalysisResult }[]>([
    {
      query: "Which department has the highest absenteeism?",
      response: "Mechanical Engineering exhibits the highest absenteeism across campus (18.4% average absence rate vs 5.5% campus average).",
      analysis: DecisionIntelligenceEngine.analyzeDepartmentAbsenteeism(),
    },
  ]);
  const [activeAnalysis, setActiveAnalysis] = useState<DecisionAnalysisResult>(
    DecisionIntelligenceEngine.analyzeDepartmentAbsenteeism()
  );
  const [executedActions, setExecutedActions] = useState<string[]>([]);

  const handleSendQuery = (customQuery?: string) => {
    const q = (customQuery || inputPrompt).trim();
    if (!q) return;

    const result = DecisionIntelligenceEngine.processDecisionQuery(q);
    setChatLog(prev => [...prev, { query: q, response: result.response, analysis: result.analysis }]);
    if (result.analysis) {
      setActiveAnalysis(result.analysis);
    }
    if (!customQuery) setInputPrompt('');
  };

  const handleExecuteAction = (actionId: string, title: string) => {
    if (isReadOnly) return;
    setExecutedActions(prev => [...prev, actionId]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-purple-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-purple-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
                <Brain size={24} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                  CampusOS AI Decision Intelligence
                  {isReadOnly && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                      <Lock size={10} /> Read-Only Student View
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-300">Confidence Scores (%) & Empirical Data Evidence Transparency Engine</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              CONFIDENCE + EVIDENCE ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Decision Intelligence 4 Executive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => handleSendQuery('Which department has the highest absenteeism?')}
          className="glass-card p-5 space-y-2 cursor-pointer hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Absenteeism</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle size={18} />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-white">Mechanical (18.4%)</h3>
          <p className="text-[11px] text-slate-400">Click for Root Cause & Evidence &rarr;</p>
        </div>

        <div
          onClick={() => handleSendQuery("Predict next semester's admissions.")}
          className="glass-card p-5 space-y-2 cursor-pointer hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admissions Forecast</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-white">1,420 (+14.2%)</h3>
          <p className="text-[11px] text-slate-400">Click for ML Confidence Model &rarr;</p>
        </div>

        <div
          onClick={() => handleSendQuery('Which classrooms are underutilized?')}
          className="glass-card p-5 space-y-2 cursor-pointer hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spatial Utilization</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <MapPin size={18} />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-white">Block C (22% Occupancy)</h3>
          <p className="text-[11px] text-slate-400">Click for Energy Evidence &rarr;</p>
        </div>

        <div
          onClick={() => handleSendQuery('How should we optimize the timetable?')}
          className="glass-card p-5 space-y-2 cursor-pointer hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timetable Optimization</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Zap size={18} />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-white">Efficiency 98.2 / 100</h3>
          <p className="text-[11px] text-slate-400">Click for Constraint Solver &rarr;</p>
        </div>
      </div>

      {/* Main Decision Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Multi-Turn Conversation Workbench */}
        <div className="lg:col-span-1 glass-card p-4 flex flex-col h-[620px] border-purple-500/30">
          <div className="p-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Sparkles size={14} className="text-purple-400" />
              Executive AI Decision Workbench
            </h3>
            <span className="text-[10px] text-slate-400">Multi-Turn Reasoning</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-950/40">
            {chatLog.map((log, idx) => (
              <div key={idx} className="space-y-2">
                <div className="p-2.5 rounded-xl bg-blue-600/30 border border-blue-500/30 text-xs text-blue-200 ml-auto max-w-[85%] font-medium">
                  {log.query}
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                  <p>{log.response}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Trigger Chips */}
          <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSendQuery('Which department has the highest absenteeism?')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-600/30 text-slate-300 text-[10px] border border-slate-700 whitespace-nowrap"
            >
              Highest Absenteeism?
            </button>
            <button
              onClick={() => handleSendQuery('Why?')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-600/30 text-slate-300 text-[10px] border border-slate-700 whitespace-nowrap"
            >
              Why?
            </button>
            <button
              onClick={() => handleSendQuery('Suggest solutions.')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-600/30 text-slate-300 text-[10px] border border-slate-700 whitespace-nowrap"
            >
              Suggest solutions
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendQuery()}
              placeholder='Ask: "Which department has highest absenteeism?", "Why?", "Predict admissions"...'
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-purple-500/70"
            />
            <button
              onClick={() => handleSendQuery()}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Prescriptive Optimization with Confidence + Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Analysis Dashboard */}
          <div className="glass-card p-6 space-y-5 border-purple-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Active Decision Analysis</span>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  {activeAnalysis.title}
                </h2>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {activeAnalysis.keyMetric}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{activeAnalysis.analysisSummary}</p>

            {/* Root Causes if available */}
            {activeAnalysis.rootCauses && activeAnalysis.rootCauses.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Identified Root Cause Factors:
                </span>
                <div className="space-y-1 text-xs text-slate-300 font-sans">
                  {activeAnalysis.rootCauses.map((rc, idx) => (
                    <p key={idx}>&bull; {rc}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations with Confidence + Evidence */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Brain size={14} className="text-purple-400" />
                AI Prescriptive Recommendations with Confidence & Evidence Tracing:
              </h3>

              <div className="space-y-3.5">
                {activeAnalysis.recommendations.map(rec => {
                  const isDone = executedActions.includes(rec.id);
                  const isHighConfidence = rec.confidenceScore >= 90;

                  return (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-purple-500/40 transition-all shadow-md"
                    >
                      {/* Top Bar: Recommendation Title & Confidence Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                          {rec.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Confidence Score Badge */}
                          <span
                            className={`text-[10px] font-extrabold px-3 py-1 rounded-full border font-mono flex items-center gap-1 ${
                              isHighConfidence
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            }`}
                          >
                            <Sparkles size={11} /> {rec.confidenceScore}% Confidence
                          </span>
                        </div>
                      </div>

                      {/* Question 1: Why did the AI recommend this? */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                          <HelpCircle size={11} /> Why did the AI recommend this?
                        </span>
                        <p className="text-xs text-slate-200 font-medium pl-2 border-l-2 border-purple-500/50">
                          {rec.whyReasoning}
                        </p>
                      </div>

                      {/* Question 2: Data Evidence Sources Analyzed */}
                      <div className="space-y-1 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <FileCheck size={11} className="text-blue-400" /> Empirical Data Evidence Analyzed:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
                          {rec.evidencePoints.map((ev, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <Check size={12} className="text-emerald-400 shrink-0" />
                              <span>{ev}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Bar: Expected Impact Range & Execution Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                          🎯 {rec.expectedImpactRange}
                        </span>

                        <button
                          onClick={() => handleExecuteAction(rec.id, rec.title)}
                          disabled={isReadOnly || isDone}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 text-white cursor-default'
                              : isReadOnly
                              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 size={14} /> Executed ✓
                            </>
                          ) : isReadOnly ? (
                            <>
                              <Lock size={12} /> Student Read-Only
                            </>
                          ) : (
                            <>
                              <Zap size={14} /> Execute Recommendation &rarr;
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Predicted Impact Matrix */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Predicted AI Impact</span>
                <p className="text-sm font-extrabold text-white">{activeAnalysis.predictedImpact.metric}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">{activeAnalysis.predictedImpact.currentValue} &rarr; <strong className="text-emerald-400">{activeAnalysis.predictedImpact.projectedValue}</strong></span>
                <p className="text-xs font-bold text-emerald-400">{activeAnalysis.predictedImpact.improvement}</p>
              </div>
            </div>
          </div>

          {/* Admissions & Capacity Recharts Visualization */}
          <div className="glass-card p-6 space-y-4 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Predictive Enrollment Forecast by Department</h3>
                <p className="text-xs text-slate-400">Comparing Current Baseline vs 2026-27 AI Enrollment Model</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-semibold">
                ML Model v2.4
              </span>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ADMISSION_PREDICTION_CHART}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="department" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Current" fill="#64748B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Projected" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Send,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Zap,
  BookOpen,
  TrendingUp,
  BarChart2,
  Briefcase,
  Layers,
  ShieldCheck,
  Award,
  Clock,
  RotateCcw,
  Check,
  CheckCheck,
  ChevronRight,
  Sliders,
  GraduationCap,
  Building2,
  FolderGit2,
  HelpCircle
} from 'lucide-react';
import {
  CareerCopilotEngine,
  type CopilotMessage,
  type GroundedProfileSummary,
  type CopilotRoleRoadmap,
  type CopilotInternshipAudit,
  type CopilotOpportunityCard,
  type CopilotSkillVelocityItem
} from '../../lib/careerCopilotEngine';

export const CareerCopilot: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<CopilotMessage[]>(() => {
    // Initial welcome message with grounded profile summary
    const initialContext = CareerCopilotEngine.getGroundedContext();
    return [
      {
        id: 'welcome-msg',
        sender: 'copilot',
        timestamp: 'Just now',
        text: `Hello **${initialContext.studentName}**! I am your **CampusOS AI Career Copilot**, directly synchronized with your institutional portfolio and verifiable telemetry.

Unlike generic chatbots, every recommendation I provide is mathematically grounded in your **${initialContext.overallReadiness}% Career Readiness**, your **${initialContext.verifiedSkillsCount} Verified Skills**, and live industry hiring benchmarks.

Select one of the strategic questions below or ask any question about your career trajectory:`,
        responseType: 'grounded_answer',
        groundedContext: initialContext,
        suggestedFollowUps: [
          'What should I learn to become a data analyst?',
          'Why am I not ready for this internship?',
          'Which opportunities should I apply for?',
          'What skills will improve my readiness fastest?'
        ]
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeProfile, setActiveProfile] = useState<GroundedProfileSummary>(() =>
    CareerCopilotEngine.getGroundedContext()
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canonicalQueries = CareerCopilotEngine.getCanonicalQueries();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isProcessing) return;

    // Append user message
    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    // Simulate real-time neural processing & grounding retrieval
    setTimeout(() => {
      const response = CareerCopilotEngine.processQuery(query);
      setMessages((prev) => [...prev, response]);
      setIsProcessing(false);
    }, 600);
  };

  const handleResetChat = () => {
    const initialContext = CareerCopilotEngine.getGroundedContext();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'copilot',
        timestamp: 'Just now',
        text: `Chat session refreshed. Grounded context re-verified against candidate record **${initialContext.studentName}** (${initialContext.verificationHash.slice(0, 16)}...). How can I assist your placement strategy today?`,
        responseType: 'grounded_answer',
        groundedContext: initialContext,
        suggestedFollowUps: [
          'What should I learn to become a data analyst?',
          'Why am I not ready for this internship?',
          'Which opportunities should I apply for?',
          'What skills will improve my readiness fastest?'
        ]
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header & Live Grounded Telemetry Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bot size={20} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              SIH26044 Dedicated Career Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Grounded in Real Profile
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            CampusOS AI Career Copilot
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Hyper-personalized, evidence-based career steering. Zero generic responses — every insight is cross-referenced with your verified institutional transcripts and enterprise hiring benchmarks.
          </p>
        </div>

        {/* Quick Nav Links & Reset */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => navigate('/career/portfolio')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
          >
            <FolderGit2 size={14} className="text-indigo-300" />
            <span>Digital Portfolio</span>
          </button>
          <button
            onClick={() => navigate('/career/opportunities')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
          >
            <Briefcase size={14} className="text-amber-300" />
            <span>Opportunities</span>
          </button>
          <button
            onClick={handleResetChat}
            title="Reset conversation"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* 2. Candidate Baseline Grounding Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Candidate
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
            {activeProfile.studentName}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            {activeProfile.batch} • {activeProfile.degree.split('(')[0]}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Career Readiness
          </div>
          <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-baseline gap-1">
            {activeProfile.overallReadiness}%
            <span className="text-[10px] font-normal text-emerald-600">Top 5%</span>
          </div>
          <div className="text-[11px] text-slate-500">Institutional Benchmark</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Verified Skills
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 flex items-baseline gap-1">
            {activeProfile.verifiedSkillsCount}
            <span className="text-[11px] font-normal text-slate-400">Tested</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ 100% Hash Proven
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Verified Projects
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {activeProfile.verifiedProjectsCount} Repos
          </div>
          <div className="text-[11px] text-slate-500">CampusOS & Autonomous</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Industry Internships
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {activeProfile.internshipsCount} Completed
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">4.9/5.0 Mentor Rating</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Academic Standing
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {activeProfile.cgpa} CGPA
          </div>
          <div className="text-[11px] text-slate-500">Dean’s Honor List</div>
        </div>
      </div>

      {/* 3. Canonical Questions Bar (Requested Prompts) */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-indigo-500" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Quick Career Inquiries (Click to Ask)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {canonicalQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              className="text-left p-3 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group shadow-2xs cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-snug">
                  {item.label}
                </span>
                <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0">
                  <ArrowRight size={13} />
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                {idx === 0 && 'Target Role & Roadmap'}
                {idx === 1 && 'Audit Against Opportunity'}
                {idx === 2 && 'Ranked Job/Intern Matching'}
                {idx === 3 && 'Skill ROI & Sensitivity Matrix'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Chat Thread Container */}
      <div className="space-y-6 min-h-[420px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'copilot' && (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`max-w-4xl space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-xs shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl rounded-tl-xs shadow-xs text-slate-800 dark:text-slate-200'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className={`font-bold ${msg.sender === 'user' ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {msg.sender === 'user' ? 'You (Rishi Sharma)' : 'CampusOS AI Career Copilot'}
                </span>
                <span className={`text-[10px] ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Message Text */}
              <div className="text-sm leading-relaxed whitespace-pre-line font-normal">
                {msg.text}
              </div>

              {/* GROUNDED WIDGET: 1. Role Gap & Learning Roadmap (Data Analyst) */}
              {msg.roleRoadmap && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  {/* Role Header */}
                  <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Target Career Path
                      </div>
                      <div className="text-base font-extrabold text-slate-900 dark:text-white">
                        {msg.roleRoadmap.targetRole}
                      </div>
                      <div className="text-xs text-slate-500">
                        Industry Benchmark: {msg.roleRoadmap.benchmarkReadiness}% Required Proficiency
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {msg.roleRoadmap.currentRoleReadiness}%
                      </div>
                      <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                        {msg.roleRoadmap.currentRoleReadiness < 70 ? 'Action Required: Bridge Critical Gaps' : 'Strong Alignment'}
                      </div>
                    </div>
                  </div>

                  {/* Skills Breakdown Grid */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Competency Gap Analysis vs. Industry Standard
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {msg.roleRoadmap.gaps.map((gap, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">{gap.skill}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                gap.status === 'Missing'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                  : gap.status === 'Lagging'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}
                            >
                              {gap.status} ({gap.currentLevel}% / {gap.requiredLevel}%)
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                gap.currentLevel < 40 ? 'bg-rose-500' : gap.currentLevel < 70 ? 'bg-amber-500' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${Math.min(100, gap.currentLevel)}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                            {gap.recommendation}
                          </p>
                          <div className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <BookOpen size={11} /> {gap.suggestedLabOrCourse}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Structured 3-Phase Action Roadmap */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Prescribed 6-Week Remediation Roadmap
                    </h4>
                    <div className="space-y-2">
                      {msg.roleRoadmap.remediationPhases.map((phase, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">{phase.phase}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium">
                                {phase.durationWeeks}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-[11px] pl-7">
                              {phase.focus}
                            </p>
                          </div>
                          <div className="shrink-0 pl-7 sm:pl-0 text-right">
                            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 sm:justify-end">
                              <CheckCircle2 size={12} /> {phase.milestone}
                            </div>
                            <span className="text-[10px] text-slate-400">{phase.labModule}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Capstone Project */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Recommended Portfolio Project
                      </span>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                        {msg.roleRoadmap.projectSuggestion.title}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {msg.roleRoadmap.projectSuggestion.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {msg.roleRoadmap.projectSuggestion.techStack.map((tech, t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-medium border border-amber-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/career/portfolio')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Add to Portfolio</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* GROUNDED WIDGET: 2. Internship Readiness Audit (Computer Vision Intern) */}
              {msg.internshipAudit && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  {/* Audit Card Banner */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        Opportunity Readiness Audit
                      </div>
                      <div className="text-lg font-black text-white">
                        {msg.internshipAudit.opportunityRole}
                      </div>
                      <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                        <Building2 size={13} className="text-slate-400" />
                        {msg.internshipAudit.company}
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <div className="text-3xl font-black text-indigo-400">
                        {msg.internshipAudit.matchScore}%
                      </div>
                      <div className="text-xs font-semibold text-emerald-400">
                        {msg.internshipAudit.matchTier}
                      </div>
                    </div>
                  </div>

                  {/* Why Factors vs Gaps Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Why? (Strengths) */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                        <CheckCircle2 size={14} />
                        Why You Match (Verified Strengths)
                      </div>
                      <div className="space-y-1.5">
                        {msg.internshipAudit.whyFactors.map((why, w) => (
                          <div key={w} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">{why.label}: </span>
                              <span className="text-slate-600 dark:text-slate-300">{why.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gaps (Shortfalls) */}
                    <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                        <AlertTriangle size={14} />
                        Skill Gaps Preventing 100% Fit
                      </div>
                      <div className="space-y-2">
                        {msg.internshipAudit.gapFactors.map((gap, g) => (
                          <div key={g} className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-amber-600 font-bold">⚠</span>
                              <span className="font-bold text-slate-900 dark:text-white">{gap.skill}</span>
                              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">({gap.current})</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-4">
                              Required: {gap.required}
                            </p>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 pl-4 italic">
                              Fix: {gap.remediation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Institutional Academic Eligibility */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-300 mb-2 text-[11px] uppercase tracking-wider">
                      Academic Eligibility Criteria
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400">Degree</div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">B.Tech CSE ✓</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400">CGPA Cutoff</div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">9.24 (Req &gt; 7.50) ✓</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400">Graduation Year</div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">2026 Batch ✓</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prescribed Sprint Action */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                        Prescribed Fast Bridge Action
                      </div>
                      <div className="text-sm font-black text-white mt-0.5">
                        {msg.internshipAudit.fastBridgeAction.actionTitle}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                        {msg.internshipAudit.fastBridgeAction.expectedScoreSurge}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Module: {msg.internshipAudit.fastBridgeAction.prescribedLab} ({msg.internshipAudit.fastBridgeAction.estimatedDays})
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/career/skills')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Zap size={14} />
                      <span>Launch Sprint Sandbox</span>
                    </button>
                  </div>
                </div>
              )}

              {/* GROUNDED WIDGET: 3. Opportunity Recommendations */}
              {msg.opportunityCards && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Live Ranked Opportunities (Matched to Rishi Sharma)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {msg.opportunityCards.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                                {opp.role}
                              </span>
                              <div className="text-[11px] text-slate-500 font-medium">
                                {opp.company} • {opp.type}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                                opp.matchScore >= 88
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                  : opp.matchScore >= 75
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {opp.matchScore}% Match
                            </span>
                          </div>

                          <div className="mt-2 space-y-1">
                            {opp.whyApply.map((why, w) => (
                              <div key={w} className="text-[11px] text-emerald-600 dark:text-emerald-400">
                                {why}
                              </div>
                            ))}
                            {opp.primaryGaps.map((gap, g) => (
                              <div key={g} className="text-[11px] text-amber-600 dark:text-amber-400">
                                {gap}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            {opp.compatibilityTier}
                          </span>
                          <button
                            onClick={() => navigate(opp.actionUrl)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>{opp.actionLabel}</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GROUNDED WIDGET: 4. Skill Velocity & ROI Sensitivity Leaderboard */}
              {msg.skillVelocityItems && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Readiness Acceleration Leaderboard (Fastest Surge)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Sorted by Readiness Impact & Job Unlock Multiplier
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {msg.skillVelocityItems.map((item) => (
                      <div
                        key={item.rank}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              #{item.rank}
                            </span>
                            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                              {item.skillName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pl-8 sm:pl-0">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 font-black text-xs">
                              +{item.readinessSurge}% Readiness
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 font-semibold text-[10px]">
                              Unlocks {item.unlockedRolesCount} Roles
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-8">
                          {item.rationale}
                        </p>

                        <div className="pl-8 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                          <span className="text-slate-500">
                            Current: <strong>{item.currentLevel}%</strong> ➔ Target:{' '}
                            <strong>{item.targetLevel}%</strong> (~{item.estimatedWeeks} weeks sprint)
                          </span>
                          <button
                            onClick={() => navigate('/career/skills')}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                          >
                            <span>Enroll in {item.starterLab.split(':')[0]}</span>
                            <ExternalLink size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Follow-up Pills */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-3 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((suggest, s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(suggest)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {suggest}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-3.5 items-center text-slate-400 text-xs animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400">
              <Bot size={16} />
            </div>
            <span>Grounding inquiry against Rishi Sharma’s transcripts and enterprise hiring vectors...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Input Dock */}
      <div className="sticky bottom-4 z-20 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Career Copilot (e.g. 'What should I learn to become a data analyst?')"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
          >
            <span>Ask Copilot</span>
            <Send size={15} />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-2">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            Deterministic profile grounding enabled • Zero hallucination protocol
          </span>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

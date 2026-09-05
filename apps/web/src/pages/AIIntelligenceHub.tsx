import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  Brain, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Activity,
  Layers
} from 'lucide-react';

export const AIIntelligenceHub: React.FC = () => {
  const navigate = useNavigate();

  const aiModules = [
    {
      title: 'ADK Autonomous Multi-Agent Swarms',
      description: 'Agent Development Kit orchestrating autonomous background agents with tool-calling capabilities.',
      path: '/adk-agents',
      icon: Bot,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Autonomous',
      metric: '5 Swarm Agents Active'
    },
    {
      title: 'AI Academic Copilot',
      description: 'Personalized student study mentor, lecture audio synthesizer, and dynamic quiz generator.',
      path: '/academic-copilot',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-600',
      badge: 'Multimodal',
      metric: '2,400+ Queries/day'
    },
    {
      title: 'AI Faculty Copilot',
      description: 'Automated lesson planning, question paper generator, and automated rubric grading assistant.',
      path: '/faculty-copilot',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Curriculum-Trained',
      metric: '95% Prep Time Saved'
    },
    {
      title: 'Executive Decision Intelligence',
      description: 'Predictive institutional modeling, retention risk forecaster, and resource allocation simulations.',
      path: '/decision-intelligence',
      icon: Brain,
      color: 'from-amber-500 to-rose-600',
      badge: 'Executive',
      metric: 'Institutional Neural Net'
    },
    {
      title: 'Chief Administrative Officer (CAO) Agent',
      description: 'Autonomous executive administrative officer handling vendor contracts, budget audit, and policy checks.',
      path: '/cao',
      icon: Cpu,
      color: 'from-indigo-600 to-purple-800',
      badge: 'Enterprise Agent',
      metric: 'Role: Admin & Registrar'
    },
    {
      title: 'RAG Institutional Document Center',
      description: 'Retrieval Augmented Generation indexed across institutional policies, UGC guidelines, and regulations.',
      path: '/doc-center',
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Vector Embeddings',
      metric: '12,500 Chunks Vectorized'
    },
    {
      title: 'SOC Security Vault & Radar',
      description: 'Autonomous zero-trust threat detector, privilege escalation sentinel, and telemetry auditor.',
      path: '/security-vault',
      icon: ShieldCheck,
      color: 'from-red-500 to-slate-900',
      badge: 'SOC Grade',
      metric: 'Zero-Trust Enforced'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
            <Brain size={14} />
            <span>GENOVA CampusOS AI Intelligence Suite</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Autonomous Agents & Neural Decision Intelligence
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Next-generation autonomous agent swarms, multimodal student and faculty copilots, vector-embedded institutional knowledge, and executive intelligence engines.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Activity size={14} className="text-emerald-400" />
              <span>Inference Engine: Online (Gemini / Vertex AI)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Layers size={14} className="text-purple-400" />
              <span>Multi-Agent Swarm: Layer 3 Orchestrator Active</span>
            </div>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Grid of AI Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.title}
              onClick={() => navigate(mod.path)}
              className="group relative rounded-xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-purple-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {mod.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 font-mono">
                  {mod.metric}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                  Launch <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

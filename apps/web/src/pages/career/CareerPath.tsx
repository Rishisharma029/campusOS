import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitBranch, 
  Target, 
  CheckCircle, 
  Circle, 
  Compass, 
  ArrowRight, 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Layers,
  Code2,
  CheckCircle2,
  Check,
  ExternalLink,
  BookOpen,
  Award,
  Zap,
  Rocket
} from 'lucide-react';
import { 
  CareerIntelligenceEngine, 
  type CareerGoalIntelligence 
} from '../../lib/careerIntelligenceEngine';
import { useToast } from '../../components/ui/Toast';

interface CareerTrack {
  id: string;
  title: string;
  role: string;
  avgSalary: string;
  readiness: number;
  description: string;
  milestones: { title: string; desc: string; completed: boolean }[];
}

export const CareerPath: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeMainTab, setActiveMainTab] = useState<'EXPLORER' | 'MILESTONES'>('EXPLORER');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('software-engineer');

  // Milestone Tracks (Preserving existing codebase tracks)
  const tracks: CareerTrack[] = [
    {
      id: 'av-systems',
      title: 'Autonomous Systems & AV Architect',
      role: 'Robotics Software Engineer / Autonomous Vehicle Architect',
      avgSalary: '₹28L - ₹45L / $140k+',
      readiness: 85,
      description: 'Design, simulate, and deploy autonomous mobile robots, ROS2 navigation nodes, and sensor fusion algorithms.',
      milestones: [
        { title: 'ROS2 & Microcontroller Telemetry', desc: 'Hardware-in-the-loop motor and CAN bus driver integration.', completed: true },
        { title: 'Nav2 Path Planning & Costmaps', desc: 'Dynamic obstacle avoidance and global/local trajectory planner tuning.', completed: true },
        { title: 'LiDAR SLAM & PointCloud Fusion', desc: 'Realtime 3D mapping and localization with Kalman filter integration.', completed: true },
        { title: 'Full Autonomy Field Deployment', desc: 'Live teleoperation and autonomous GPS waypoint mission completion.', completed: false },
      ]
    },
    {
      id: 'land-gis',
      title: 'Geospatial AI & Smart Infrastructure',
      role: 'Geospatial Data Engineer / Land Intelligence Analyst',
      avgSalary: '₹22L - ₹38L / $125k+',
      readiness: 78,
      description: 'Leverage multi-spectral satellite imagery, drone telemetry, and cadastral shapefiles for automated land intelligence.',
      milestones: [
        { title: 'GIS Geometry & Spatial Databases', desc: 'PostGIS, GeoJSON, and coordinate reference transformation.', completed: true },
        { title: 'Multi-Spectral Remote Sensing', desc: 'NDVI, soil moisture, and land use segmentation models.', completed: true },
        { title: 'Cadastral Boundary AI Matcher', desc: 'Automated parcel boundary extraction from drone orthomosaics.', completed: false },
        { title: 'Autonomous Drone Survey Bridge', desc: 'Cloud API ingest pipeline for live aerial telemetry data.', completed: false },
      ]
    },
    {
      id: 'ai-ml',
      title: 'Edge AI & Multimodal Intelligence',
      role: 'Applied Machine Learning Engineer',
      avgSalary: '₹26L - ₹42L / $135k+',
      readiness: 90,
      description: 'Build low-latency edge inference models, multi-agent LLM systems, and computer vision pipelines.',
      milestones: [
        { title: 'PyTorch Model Optimization & TensorRT', desc: 'Quantization and hardware acceleration on Jetson/edge TPU.', completed: true },
        { title: 'Real-time Object Detection & Tracking', desc: 'Sub-20ms multi-camera detection and optical flow.', completed: true },
        { title: 'Multi-Agent LLM Orchestration', desc: 'RAG pipelines with tool calling and vector embeddings.', completed: true },
        { title: 'Production Distributed Serving', desc: 'Triton inference server deployment with auto-scaling.', completed: false },
      ]
    },
  ];

  const [selectedTrack, setSelectedTrack] = useState<CareerTrack>(tracks[0]);

  // Career Explorer Data
  const careerGuidance: CareerGoalIntelligence = useMemo(() => {
    return CareerIntelligenceEngine.getCareerGuidance(selectedGoalId);
  }, [selectedGoalId]);

  const availableGoals = useMemo(() => {
    return CareerIntelligenceEngine.getAvailableCareerGoals();
  }, []);

  const handleStartNextAction = () => {
    toast(
      'Guided Project Initiated',
      `Scaffolding ${careerGuidance.bestNextAction.title}. Template linked to engineering portfolio.`,
      'success'
    );
    navigate('/career/portfolio');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
            <Sparkles size={14} className="text-cyan-400" />
            <span>GENOVA • CAREER INTELLIGENCE & EXPLORER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
            Career Explorer & Trajectory Intelligence
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Data-driven career guidance powered by your individual verified skills, expressed technical interests, and live market industry demand.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium pt-3 border-t border-slate-800/80">
            <span className="text-slate-400">Three-Pillar Guidance Engine:</span>
            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
              1. Individual Skills ({careerGuidance.threePillars.individualSkillsScore}%)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              2. Student Interests ({careerGuidance.threePillars.interestAlignmentScore}%)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              3. Industry Demand ({careerGuidance.threePillars.industryDemandScore}%)
            </span>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'EXPLORER', label: '1. Career Explorer (AI Guidance)', icon: Compass },
          { id: 'MILESTONES', label: '2. Engineering Milestones & Trajectories', icon: GitBranch },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeMainTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CAREER EXPLORER (Exact Match to User Requirement) */}
      {/* ========================================================================= */}
      {activeMainTab === 'EXPLORER' && (
        <div className="space-y-6">
          {/* Career Goal Selection Studio */}
          <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  STUDENT CAREER GOAL SELECTION
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Target Trajectory: {careerGuidance.goalTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Change Goal:</span>
                <select
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {availableGoals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visual Goal Selector Quick Pills */}
            <div className="flex flex-wrap gap-2">
              {availableGoals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoalId(g.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedGoalId === g.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  <Target size={13} />
                  <span>{g.title}</span>
                  {selectedGoalId === g.id && <Check size={13} />}
                </button>
              ))}
            </div>
          </div>

          {/* Core Results: Career Readiness Gauge + Best-Fit Roles Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Career Readiness Display (Exact 72%) */}
            <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TARGET EVALUATION
                  </span>
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                    <TrendingUp size={13} />
                    Live Computed
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                  Career Readiness Score
                </h4>
              </div>

              {/* Big Readiness Number (72%) */}
              <div className="text-center py-4">
                <div className="inline-flex flex-col items-center justify-center">
                  <div className="text-6xl font-black text-blue-600 dark:text-blue-400 tracking-tight font-display">
                    {careerGuidance.careerReadiness}%
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    <AlertTriangle size={12} />
                    <span>{careerGuidance.readinessStatus}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 max-w-xs mx-auto">
                  Based on verified institutional skill tests, project repositories, and placement benchmark criteria.
                </p>
              </div>

              {/* Mini Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Skills</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {careerGuidance.threePillars.individualSkillsScore}%
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Interests</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {careerGuidance.threePillars.interestAlignmentScore}%
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Demand</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {careerGuidance.threePillars.industryDemandScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Best-Fit Roles Leaderboard (Exact match: SWE 91%, Frontend 87%, Backend 79%, DevOps 61%) */}
            <div className="lg:col-span-2 bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    COMPUTED MATCH LEADERBOARD
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Best-Fit Industry Roles
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Ranked by Skill Compatibility</span>
              </div>

              {/* Roles List */}
              <div className="space-y-3">
                {careerGuidance.bestFitRoles.map((role, idx) => (
                  <div
                    key={role.title}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-200 dark:hover:border-blue-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                        idx === 0 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                            {role.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/20">
                            {role.marketDemand} Demand
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {role.category} • {role.salaryRange} • <strong className="text-emerald-600">{role.hiringTrend}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-base font-black font-mono text-blue-600 dark:text-blue-400">
                          {role.matchPercentage}%
                        </span>
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${role.matchPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Skills + Best Next Action Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Missing Skills (Exact match: Docker, System Design, Testing) */}
            <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Missing Skills to Unlock 90%+ Readiness
                    </h3>
                    <p className="text-xs text-slate-500">
                      High-impact competencies required by Tier-1 hiring teams.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg">
                  {careerGuidance.missingSkills.length} Identified
                </span>
              </div>

              {/* Missing Skills Items */}
              <div className="space-y-3">
                {careerGuidance.missingSkills.map((sk) => (
                  <div
                    key={sk.name}
                    className="p-4 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                          {sk.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {sk.category}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        sk.urgency === 'Critical'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 border border-rose-300 dark:border-rose-900'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-600 border border-amber-300 dark:border-amber-900'
                      }`}>
                        {sk.urgency} Priority
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Current: <strong className="text-slate-700 dark:text-slate-300">{sk.currentLevel}%</strong> ➔ Target: <strong className="text-blue-600 dark:text-blue-400">{sk.targetLevel}%</strong></span>
                      <span className="font-mono">⏱ Est. {sk.timeToAcquire}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                      Resource: <strong className="text-slate-800 dark:text-slate-200">{sk.recommendedResource}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Best Next Action (Exact match: Build REST API project) */}
            <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-slate-900 rounded-2xl border-2 border-blue-200/80 dark:border-blue-900/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/40 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                      <Rocket size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        CAMPUSOS RECOMMENDATION
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                        Best Next Action
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    Highest ROI
                  </span>
                </div>

                {/* Big Action Callout */}
                <div className="bg-surface dark:bg-slate-900 rounded-xl p-4 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
                  <h4 className="text-lg font-black text-blue-600 dark:text-blue-400 font-display">
                    {careerGuidance.bestNextAction.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {careerGuidance.bestNextAction.summary}
                  </p>
                </div>

                {/* Project Blueprint Checklist */}
                <div className="space-y-2 pt-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Action Blueprint & Deliverables:
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {careerGuidance.bestNextAction.projectScope.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 size={13} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-mono">
                  ⏱ Est. Effort: ~{careerGuidance.bestNextAction.estimatedHours} Hours
                </span>
                <button
                  onClick={handleStartNextAction}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-[1.02]"
                >
                  <Rocket size={14} />
                  <span>Start Guided Project Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MILESTONES & TRAJECTORIES (Preserving Existing Track Features) */}
      {/* ========================================================================= */}
      {activeMainTab === 'MILESTONES' && (
        <div className="space-y-6">
          {/* Track Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tracks.map((track) => (
              <div
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTrack.id === track.id
                    ? 'bg-blue-50/50 dark:bg-slate-800/80 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-surface dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Target Track
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                      {track.readiness}% Match
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {track.role}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{track.avgSalary}</span>
                  <ChevronRight size={14} className={selectedTrack.id === track.id ? 'text-blue-500' : 'text-slate-400'} />
                </div>
              </div>
            ))}
          </div>

          {/* Selected Track Detailed Roadmap */}
          <div className="bg-surface dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Career Trajectory Breakdown</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedTrack.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  {selectedTrack.description}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Industry Benchmark</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedTrack.avgSalary}</span>
                </div>
              </div>
            </div>

            {/* Milestone Steps */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Engineering Milestones & Verification Checkpoints
              </h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {selectedTrack.milestones.map((m, index) => (
                  <div key={m.title} className="relative group">
                    <div className={`absolute -left-[27px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-surface dark:bg-slate-900 border-2 ${
                      m.completed ? 'border-emerald-500 text-emerald-500' : 'border-slate-400 text-slate-400'
                    }`}>
                      {m.completed ? <CheckCircle size={12} className="text-emerald-500 fill-emerald-500/20" /> : <Circle size={8} />}
                    </div>

                    <div className="bg-slate-50/60 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/70 dark:border-slate-750">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Step {index + 1}: {m.title}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          m.completed 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {m.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CareerPath;

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  Download, 
  RefreshCw, 
  Sliders, 
  Copy, 
  ExternalLink,
  Plus,
  Send,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  AIRecruiterEngine, 
  PRESET_JOB_DESCRIPTIONS, 
  type ExtractedJobRequirements, 
  type CandidateRankingResult,
  type JobDescriptionTemplate 
} from '../../lib/aiRecruiterEngine';
import { useToast } from '../../components/ui/Toast';

export const AIRecruiter: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Selected Preset or Custom JD
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_JOB_DESCRIPTIONS[0].id);
  const [rawJdInput, setRawJdInput] = useState<string>(PRESET_JOB_DESCRIPTIONS[0].rawText);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // Extracted Requirements State (Recruiter can adjust)
  const [requirements, setRequirements] = useState<ExtractedJobRequirements>(() => 
    AIRecruiterEngine.extractRequirementsFromJD(PRESET_JOB_DESCRIPTIONS[0].rawText)
  );

  // Active Expanded Candidate for Explainability Deep Dive
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>('cand-rishi');

  // Cryptographic Ledger Inspection Modal
  const [inspectingCandidate, setInspectingCandidate] = useState<CandidateRankingResult | null>(null);

  // Export Modal
  const [exportModalCandidate, setExportModalCandidate] = useState<CandidateRankingResult | null>(null);

  // Trigger Semantic Extraction
  const handleRunExtraction = (textToExtract: string) => {
    setIsExtracting(true);
    setTimeout(() => {
      const extracted = AIRecruiterEngine.extractRequirementsFromJD(textToExtract);
      setRequirements(extracted);
      setIsExtracting(false);
      toast('Semantic Extraction Complete', `Identified ${extracted.requiredSkills.length} required skills & academic criteria.`, 'success');
    }, 450);
  };

  // Switch Presets
  const handleSelectPreset = (preset: JobDescriptionTemplate) => {
    setSelectedPresetId(preset.id);
    setRawJdInput(preset.rawText);
    handleRunExtraction(preset.rawText);
  };

  // File Upload Simulator
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setRawJdInput(text);
          setSelectedPresetId('custom');
          handleRunExtraction(text);
        }
      };
      reader.readAsText(file);
    }
  };

  // Live Ranked Candidates
  const rankedCandidates = useMemo(() => {
    return AIRecruiterEngine.rankCandidates(requirements);
  }, [requirements]);

  // Shortlist Toggle
  const handleToggleShortlist = (candidateId: string) => {
    const isShortlisted = AIRecruiterEngine.toggleShortlist(candidateId);
    // Force re-render of ranked list
    setRequirements(prev => ({ ...prev }));
    toast(
      isShortlisted ? 'Candidate Shortlisted' : 'Removed from Shortlist',
      isShortlisted ? 'Candidate added to active enterprise interview pipeline.' : 'Candidate removed from pipeline.',
      isShortlisted ? 'success' : 'info'
    );
  };

  // Quick Skill Slider adjustment
  const handleUpdateSkillMin = (skillName: string, newMin: number) => {
    setRequirements(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.map(s => 
        s.name === skillName ? { ...s, minLevel: newMin } : s
      )
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-indigo-500/20 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-black text-white tracking-tight font-display">
                    CampusOS AI Recruiter
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    SIH26044 INTELLIGENCE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Upload raw Job Descriptions to automatically extract criteria, rank the student cohort, and explain matches through verified proof-of-work.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/career/industry-portal')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-all"
            >
              <Building2 size={14} />
              <span>Industry Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/career/portfolio')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
            >
              <FolderGit2 size={14} />
              <span>Employability Portfolio</span>
            </button>
          </div>
        </div>

        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Preset JD Quick Selector Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText size={14} className="text-indigo-500" />
            <span>Select Sample Enterprise Job Description:</span>
          </span>
          <label className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer">
            <Upload size={13} />
            <span>Upload Custom JD (.txt)</span>
            <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_JOB_DESCRIPTIONS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20 ring-2 ring-indigo-400/40'
                    : 'bg-surface dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {preset.domain}
                  </span>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
                <div className="text-xs font-bold truncate">{preset.title}</div>
                <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {preset.company}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: JD Ingestion & Semantic Requirements Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Raw JD Input Box */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-blue-500" />
                <span>Job Description Source Text</span>
              </h2>
              <button
                onClick={() => handleRunExtraction(rawJdInput)}
                disabled={isExtracting}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                <RefreshCw size={11} className={isExtracting ? 'animate-spin' : ''} />
                <span>Re-Extract</span>
              </button>
            </div>

            <textarea
              value={rawJdInput}
              onChange={(e) => {
                setRawJdInput(e.target.value);
                setSelectedPresetId('custom');
              }}
              rows={6}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed"
              placeholder="Paste job description here..."
            />

            <button
              onClick={() => handleRunExtraction(rawJdInput)}
              disabled={isExtracting}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Sparkles size={14} />
              <span>{isExtracting ? 'Extracting Semantics...' : 'Parse & Extract Requirements'}</span>
            </button>
          </div>

          {/* Extracted Requirements Inspector */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                  CampusOS Semantic Parser
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {requirements.roleTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {requirements.companyName} • {requirements.workType} ({requirements.location})
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                ACTIVE CRITERIA
              </span>
            </div>

            {/* 1. Required Skills with Live Proficiency Sliders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Award size={13} className="text-blue-500" />
                  <span>1. Required Skills ({requirements.requiredSkills.length})</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Weight: 50%</span>
              </div>

              <div className="space-y-2.5">
                {requirements.requiredSkills.map((skill) => (
                  <div key={skill.name} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{skill.name}</span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        Target ≥ {skill.minLevel}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={95}
                      step={5}
                      value={skill.minLevel}
                      onChange={(e) => handleUpdateSkillMin(skill.name, parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Preferred Skills */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-purple-500" />
                  <span>2. Preferred Bonus Skills ({requirements.preferredSkills.length})</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Weight: 20%</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {requirements.preferredSkills.map((pref) => (
                  <span
                    key={pref.name}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                  >
                    +{pref.bonusWeight}x {pref.name}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Academic Eligibility Benchmarks */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <GraduationCap size={13} className="text-emerald-500" />
                  <span>3. Academic Eligibility Benchmarks</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Weight: 15%</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Min CGPA</span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                    ≥ {requirements.eligibility.minCgpa.toFixed(1)} / 10.0
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Eligible Batches</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                    {requirements.eligibility.allowedBatches.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Experience & Capstone Criteria */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <FolderGit2 size={13} className="text-amber-500" />
                  <span>4. Project & Capstone Proof</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Weight: 15%</span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400">
                Minimum <span className="font-bold text-slate-900 dark:text-white">{requirements.experience.minProjects} verified capstone</span> in {requirements.experience.requiredProjectDomains.join(' or ')}.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Candidate Ranking & Explainability Suite (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Ranking Header Bar */}
          <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  AI Candidate Compatibility Ranking
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {rankedCandidates.length} COHORT PROFILES
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated against verified skill proficiencies, faculty-audited capstones, and academic benchmarks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  rankedCandidates.slice(0, 3).forEach(c => {
                    if (!c.shortlisted) AIRecruiterEngine.toggleShortlist(c.candidate.id);
                  });
                  setRequirements(prev => ({ ...prev }));
                  toast('Batch Shortlisted', 'Top 3 ranked candidates shortlisted into interview desk.', 'success');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <CheckCircle2 size={13} />
                <span>Shortlist Top 3</span>
              </button>
            </div>
          </div>

          {/* Ranked Candidates Cards List */}
          <div className="space-y-4">
            {rankedCandidates.map((res) => {
              const cand = res.candidate;
              const isExpanded = expandedCandidateId === cand.id;

              // Color classes based on match %
              const isTopTier = res.overallMatchScore >= 85;
              const isMidTier = res.overallMatchScore >= 75 && res.overallMatchScore < 85;
              const badgeBg = isTopTier 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                : isMidTier 
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' 
                : 'bg-amber-500/10 text-amber-500 border-amber-500/30';

              const ringColor = isTopTier ? 'text-emerald-500' : isMidTier ? 'text-blue-500' : 'text-amber-500';

              return (
                <div
                  key={cand.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'border-indigo-500/40 bg-surface dark:bg-slate-900 shadow-lg ring-1 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Candidate Summary Card Header */}
                  <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      {/* Rank Number Badge */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                        res.rank === 1
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white border-amber-300 shadow-md shadow-amber-500/20'
                          : res.rank === 2
                          ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white border-slate-200'
                          : res.rank === 3
                          ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 border-amber-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}>
                        #{res.rank}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white">
                            {cand.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeBg}`}>
                            {res.overallMatchScore}% Match
                          </span>
                          {res.shortlisted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                              <CheckCircle2 size={10} />
                              <span>Shortlisted</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span>{cand.degree}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">CGPA: {cand.cgpa.toFixed(2)}</span>
                          <span>•</span>
                          <span>Batch {cand.batch}</span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Score Dial & Quick Expand Button */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase">Composite Fit</div>
                        <div className={`text-xl font-black ${ringColor}`}>
                          {res.overallMatchScore}%
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedCandidateId(isExpanded ? null : cand.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isExpanded
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title="Toggle Explainability Breakdown"
                      >
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Explainability Drawer */}
                  {isExpanded && (
                    <div className="px-4 pb-5 md:px-5 space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      
                      {/* Weighted Score Breakdown Meters */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Required Skills</span>
                          <div className="text-xs font-black text-blue-600 dark:text-blue-400 mt-0.5">
                            {res.scoreBreakdown.requiredSkillsScore} / 50 pts
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Preferred Bonus</span>
                          <div className="text-xs font-black text-purple-600 dark:text-purple-400 mt-0.5">
                            {res.scoreBreakdown.preferredSkillsScore} / 20 pts
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Project Evidence</span>
                          <div className="text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">
                            {res.scoreBreakdown.projectEvidenceScore} / 15 pts
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Academic Benchmark</span>
                          <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {res.scoreBreakdown.eligibilityScore} / 15 pts
                          </div>
                        </div>
                      </div>

                      {/* SECTION 1: Explain Why This Candidate Matches (SIH26044 Requirement) */}
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={15} />
                          <span>Why {cand.name.split(' ')[0]} Matches This Role:</span>
                        </div>

                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {res.whyMatches.skillHighlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span>{highlight}</span>
                            </li>
                          ))}

                          {res.whyMatches.projectEvidence.map((proj, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span className="font-medium text-slate-800 dark:text-slate-200">{proj}</span>
                            </li>
                          ))}

                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold shrink-0">✓</span>
                            <span>{res.whyMatches.eligibilityAffirmation}</span>
                          </li>
                        </ul>
                      </div>

                      {/* SECTION 2: Skill Gaps & Remedial Action */}
                      {(res.gaps.missingRequired.length > 0 || res.gaps.missingPreferred.length > 0) && (
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                            <AlertTriangle size={15} />
                            <span>Identified Gaps & Recommended Upskilling:</span>
                          </div>

                          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                            {res.gaps.missingRequired.map((gap, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-amber-700 dark:text-amber-300">
                                <span className="font-bold">⚠</span>
                                <span>{gap}</span>
                              </div>
                            ))}

                            {res.gaps.missingPreferred.length > 0 && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                                Optional Bonus Competencies Missing: {res.gaps.missingPreferred.join(', ')}.
                              </div>
                            )}

                            {res.gaps.remedialRecommendations.map((rec, idx) => (
                              <div key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                                ↳ Remedial Pathway: {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cryptographic Ledger Attestation Hash Bar */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <ShieldCheck size={14} className="text-cyan-400 shrink-0" />
                          <span className="text-[11px] text-slate-400 truncate">
                            Cryptographic Passport: <span className="font-mono text-cyan-300 font-bold">{cand.passportHash}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => setInspectingCandidate(res)}
                          className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline shrink-0 cursor-pointer"
                        >
                          Verify Attestation Proof
                        </button>
                      </div>

                      {/* Recruiter Action Strip */}
                      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                        <button
                          onClick={() => setExportModalCandidate(res)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Download size={13} />
                          <span>Export Candidate Dossier</span>
                        </button>

                        <button
                          onClick={() => navigate('/career/portfolio')}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ExternalLink size={13} />
                          <span>View Full Portfolio</span>
                        </button>

                        <button
                          onClick={() => handleToggleShortlist(cand.id)}
                          className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105 ${
                            res.shortlisted
                              ? 'bg-slate-700 hover:bg-slate-600 text-white'
                              : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white'
                          }`}
                        >
                          <CheckCircle2 size={14} />
                          <span>{res.shortlisted ? 'Remove from Shortlist' : 'Shortlist for Interview'}</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODAL 1: Cryptographic Ledger Proof Inspection Modal */}
      {inspectingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-cyan-400" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Cryptographic Employability Ledger Proof
                </h3>
              </div>
              <button
                onClick={() => setInspectingCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Candidate Profile</span>
                <div className="font-bold text-white text-sm">{inspectingCandidate.candidate.name}</div>
                <div className="text-slate-400">{inspectingCandidate.candidate.degree} (Batch {inspectingCandidate.candidate.batch})</div>
                <div className="text-cyan-400 font-mono text-[11px]">Passport Hash: {inspectingCandidate.candidate.passportHash}</div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Verified Skill Matrix</span>
                <div className="grid grid-cols-2 gap-2">
                  {inspectingCandidate.candidate.skills.slice(0, 6).map(s => (
                    <div key={s.name} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{s.name}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{s.level}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Attested Capstone Repositories</span>
                <div className="space-y-1">
                  {inspectingCandidate.candidate.featuredProjects.map(proj => (
                    <div key={proj} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="font-medium">✓ {proj}</span>
                      <span className="text-[10px] font-bold text-emerald-500">FACULTY AUDITED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inspectingCandidate.candidate.passportHash);
                  toast('Hash Copied', 'Cryptographic verification hash copied to clipboard.', 'success');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy Hash</span>
              </button>
              <button
                onClick={() => setInspectingCandidate(null)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Export Candidate Dossier Modal */}
      {exportModalCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Download size={20} className="text-indigo-400" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Export Candidate Dossier
                </h3>
              </div>
              <button
                onClick={() => setExportModalCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                A verified recruitment summary packet for <strong className="text-slate-900 dark:text-white">{exportModalCandidate.candidate.name}</strong> has been generated for corporate hiring managers:
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div>Candidate: {exportModalCandidate.candidate.name}</div>
                <div>Role Evaluated: {requirements.roleTitle}</div>
                <div>AI Compatibility Score: {exportModalCandidate.overallMatchScore}% (#{exportModalCandidate.rank} Rank)</div>
                <div>Verified Skills Count: {exportModalCandidate.candidate.skills.length}</div>
                <div>Institutional Attestation: GENOVA Institute of Technology</div>
                <div>Status: {exportModalCandidate.shortlisted ? 'SHORTLISTED FOR INTERVIEW' : 'EVALUATED'}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportModalCandidate, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `Candidate_Dossier_${exportModalCandidate.candidate.name.replace(/\s+/g, '_')}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  toast('Dossier Downloaded', 'Candidate recruitment packet saved as JSON.', 'success');
                  setExportModalCandidate(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download size={14} />
                <span>Download Signed Dossier (JSON)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

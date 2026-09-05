import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderGit2, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  Sparkles, 
  QrCode, 
  Share2, 
  Star, 
  TrendingUp, 
  Code2, 
  Briefcase, 
  Layers, 
  FileCheck, 
  X, 
  Check, 
  ArrowRight,
  GraduationCap,
  Calendar,
  Building2,
  Lock,
  Zap,
  RotateCcw,
  CheckCheck,
  Clock,
  ChevronRight,
  Bot
} from 'lucide-react';
import { 
  DigitalPortfolioEngine, 
  VERIFICATION_PIPELINES,
  type DigitalPortfolioData, 
  type ClaimType,
  type NewClaimSubmission,
  type VerifiedSkillItem, 
  type VerifiedProjectItem, 
  type VerifiedCertificateItem, 
  type VerifiedInternshipItem, 
  type VerifiedAchievementItem 
} from '../../lib/digitalPortfolioEngine';
import { useToast } from '../../components/ui/Toast';

type TabTier = 'ALL' | 'SKILLS' | 'PROJECTS' | 'CERTIFICATES' | 'INTERNSHIPS' | 'ACHIEVEMENTS';

export const CareerPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [portfolio, setPortfolio] = useState<DigitalPortfolioData>(() => DigitalPortfolioEngine.getPortfolio());
  const [activeTab, setActiveTab] = useState<TabTier>('ALL');
  const [activePipelineTier, setActivePipelineTier] = useState<ClaimType>('CERTIFICATE');

  // Verification Simulator State
  const [isVerifySimulatorOpen, setIsVerifySimulatorOpen] = useState<boolean>(false);
  const [simulatorTier, setSimulatorTier] = useState<ClaimType>('CERTIFICATE');
  const [claimTitle, setClaimTitle] = useState<string>('AWS Certified Solutions Architect — Associate');
  const [claimIssuer, setClaimIssuer] = useState<string>('Amazon Web Services');
  const [claimCategory, setClaimCategory] = useState<string>('Cloud Infrastructure');
  const [claimDetails, setClaimDetails] = useState<string>('Architecting fault-tolerant VPC topologies, IAM security perimeters, and automated S3 lifecycle tiering.');
  const [simulatingStep, setSimulatingStep] = useState<number>(0); // 0 = idle, 1 = claim, 2 = verify, 3 = badge, 4 = done
  const [verifiedItemResult, setVerifiedItemResult] = useState<{ title: string; hash: string; seal: string } | null>(null);

  // Upgraded Proof Modal State
  const [proofModalItem, setProofModalItem] = useState<{
    title: string;
    type: string;
    issuer: string;
    hash: string;
    date: string;
    scoreOrRating?: string;
    verificationMethod?: string;
    badgeSeal?: string;
    claimDate?: string;
    trustScore?: string;
  } | null>(null);

  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  const handleOpenProof = (
    title: string, 
    type: string, 
    issuer: string, 
    hash: string, 
    date: string, 
    scoreOrRating?: string,
    verificationMethod?: string,
    badgeSeal?: string,
    claimDate?: string,
    trustScore?: string
  ) => {
    setProofModalItem({
      title,
      type,
      issuer,
      hash,
      date,
      scoreOrRating,
      verificationMethod: verificationMethod || 'Multi-Agent Cryptographic Oracle Consensus',
      badgeSeal: badgeSeal || 'Gold Verified',
      claimDate: claimDate || 'Spring 2026',
      trustScore: trustScore || '100% Tamper-Proof'
    });
  };

  // Run the 4-Stage Verification Protocol Simulator
  const handleExecuteVerificationSimulation = () => {
    if (!claimTitle.trim() || !claimIssuer.trim()) {
      toast('Incomplete Claim Payload', 'Please provide a title and issuing authority for the claim.', 'error');
      return;
    }

    setSimulatingStep(1); // Stage 1: Ingesting Claim

    setTimeout(() => {
      setSimulatingStep(2); // Stage 2: Verification Oracle executing

      setTimeout(() => {
        setSimulatingStep(3); // Stage 3: Verified Badge minting

        setTimeout(() => {
          // Stage 4: Appended to Portfolio
          const updated = DigitalPortfolioEngine.submitAndVerifyClaim({
            tier: simulatorTier,
            title: claimTitle,
            issuerOrCompany: claimIssuer,
            categoryOrDomain: claimCategory,
            details: claimDetails
          });

          setPortfolio(updated);
          setSimulatingStep(4);

          const generatedHash = `0xVER-${simulatorTier.substring(0, 3)}-${Date.now().toString().slice(-6)}`;
          setVerifiedItemResult({
            title: claimTitle,
            hash: generatedHash,
            seal: simulatorTier === 'PROJECT' ? 'Academic Verified' : simulatorTier === 'INTERNSHIP' ? 'Enterprise Verified' : 'Gold Verified'
          });

          toast(
            'Claim Successfully Verified & Minted',
            `"${claimTitle}" has passed verification protocol and is now sealed to your Digital Employability Portfolio!`,
            'success'
          );
        }, 800);
      }, 900);
    }, 800);
  };

  // Load Presets in Simulator
  const handleLoadPreset = (tier: ClaimType) => {
    setSimulatorTier(tier);
    setSimulatingStep(0);
    setVerifiedItemResult(null);

    if (tier === 'CERTIFICATE') {
      setClaimTitle('AWS Certified Solutions Architect — Associate');
      setClaimIssuer('Amazon Web Services');
      setClaimCategory('Cloud Infrastructure');
      setClaimDetails('Validation of VPC peering, S3 multi-region replication, and IAM security controls.');
    } else if (tier === 'SKILL') {
      setClaimTitle('Rust Embedded Systems & Concurrency');
      setClaimIssuer('AI Algorithmic Rig & Micro-Controller Sandbox');
      setClaimCategory('Systems Programming');
      setClaimDetails('Passed 14 automated unit tests on zero-cost abstractions, memory ownership, and async actors.');
    } else if (tier === 'INTERNSHIP') {
      setClaimTitle('Software Engineering Intern (Cloud Platforms)');
      setClaimIssuer('Google Cloud India');
      setClaimCategory('Distributed Systems');
      setClaimDetails('Architected high-throughput Spanner replication pipelines with 99.99% reliability SLA.');
    } else if (tier === 'PROJECT') {
      setClaimTitle('Autonomous Drone Swarm Cooperative Navigation');
      setClaimIssuer('University Robotics Senate & GitHub Actions');
      setClaimCategory('Robotics & Edge AI');
      setClaimDetails('ROS2 micro-ROS drone mesh with ultra-wideband localized positioning and obstacle avoidance.');
    } else if (tier === 'ACHIEVEMENT') {
      setClaimTitle('Smart India Hackathon 2026 Winner (Problem SIH26044)');
      setClaimIssuer('Ministry of Education & AICTE, Govt. of India');
      setClaimCategory('Hackathon');
      setClaimDetails('Ranked 1st nationwide for building the complete CampusOS enterprise employability & internship operating system.');
    }
  };

  const handleExportTranscript = () => {
    toast(
      'Exporting Verified Engineering Transcript',
      'Minting cryptographically watermarked PDF and JSON-LD credential for RISHI SHARMA...',
      'success'
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header: RISHI SHARMA Digital Employability Portfolio */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 border border-slate-800 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center font-display font-extrabold text-2xl md:text-3xl text-cyan-400 border border-blue-500/30">
                  RS
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-md" title="Identity Cryptographically Verified">
                <ShieldCheck size={14} className="stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
                <ShieldCheck size={13} className="text-cyan-400" />
                <span>SIH26044 • VERIFIED DIGITAL EMPLOYABILITY PASSPORT</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-display text-white">
                {portfolio.candidateName}
              </h1>
              <p className="mt-1 text-xs md:text-sm text-slate-300 font-medium max-w-xl">
                {portfolio.roleHeadline} • <span className="text-cyan-400">{portfolio.institution}</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{portfolio.degree}</span>
                <span>•</span>
                <span>CGPA: <strong className="text-emerald-400">{portfolio.cgpa}</strong></span>
                <span>•</span>
                <span className="truncate">Hash: <strong className="text-blue-400">{portfolio.passportHash.slice(0, 16)}...</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col items-end gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/career/copilot')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105 border border-indigo-400/30"
            >
              <Bot size={14} />
              <span>Ask Career Copilot</span>
            </button>
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <QrCode size={14} />
              <span>Recruiter Passport (QR)</span>
            </button>
            <button
              onClick={handleExportTranscript}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center gap-2 cursor-pointer border border-slate-700 transition-colors"
            >
              <Download size={14} />
              <span>Export Verified Transcript</span>
            </button>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Headline KPI Ribbon: 84% Readiness, 17 Skills, 8 Certifications, 6 Projects, 2 Internships */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 1. Career Readiness: 84% */}
        <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-blue-500/30 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Career Readiness
            </span>
            <Sparkles size={16} className="text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
              {portfolio.careerReadinessScore}%
            </span>
            <span className="text-[11px] font-bold text-emerald-500">Tier-1 Ready</span>
          </div>
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${portfolio.careerReadinessScore}%` }} />
          </div>
        </div>

        {/* 2. Verified Skills: 17 */}
        <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-emerald-500/30 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Verified Skills
            </span>
            <Award size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {portfolio.stats.verifiedSkillsCount}
            </span>
            <span className="text-[11px] text-slate-500">All Passed ✓</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Coding sandboxes & AI assessments
          </p>
        </div>

        {/* 3. Certifications: 8 */}
        <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-purple-500/30 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Certifications
            </span>
            <GraduationCap size={16} className="text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
              {portfolio.stats.certificationsCount}
            </span>
            <span className="text-[11px] text-slate-500">Industry Creds</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            AWS, NVIDIA, CNCF, Meta
          </p>
        </div>

        {/* 4. Projects: 6 */}
        <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-indigo-500/30 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Projects
            </span>
            <FolderGit2 size={16} className="text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
              {portfolio.stats.projectsCount}
            </span>
            <span className="text-[11px] text-slate-500">Production</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Verified Git CI/CD test suites
          </p>
        </div>

        {/* 5. Internships: 2 */}
        <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-amber-500/30 p-4 shadow-sm relative overflow-hidden col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Internships
            </span>
            <Briefcase size={16} className="text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {portfolio.stats.internshipsCount}
            </span>
            <span className="text-[11px] text-slate-500">4.9/5.0 Mean</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Genova & AeroDynamics Labs
          </p>
        </div>
      </div>

      {/* 17. VERIFICATION + TRUST PIPELINE (SIH26044 Core Requirement) */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/90 p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>SIH26044 • VERIFICATION + TRUST ARCHITECTURE</span>
            </div>
            
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Deterministic Proof-of-Competency Pipeline
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              <strong className="text-emerald-400 font-bold">This prevents the portfolio from being just a collection of claims.</strong> Every student credential, skill, internship, project, and achievement passes through our deterministic 4-stage verification oracle before receiving an immutable verified badge.
            </p>

            {/* Trust Guarantee Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs pt-1">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                <CheckCircle2 size={13} />
                <span>100% Cryptographically Verified</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold">
                <Lock size={13} />
                <span>Zero Unverified Self-Claims</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold">
                <Sparkles size={13} />
                <span>5 Multi-Tier Verification Protocols</span>
              </span>
            </div>
          </div>

          {/* CTA to run the simulator */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <button
              onClick={() => {
                handleLoadPreset('CERTIFICATE');
                setIsVerifySimulatorOpen(true);
              }}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02] border border-white/20"
            >
              <Zap size={16} className="text-slate-950 fill-slate-950" />
              <span>Run Verification Protocol</span>
              <ArrowRight size={14} />
            </button>
            <span className="text-[11px] text-slate-400 text-center lg:text-right">
              Live Simulator: Claim → Verification → Badge → Portfolio
            </span>
          </div>
        </div>

        {/* Pipeline Architecture Interactive Flow Selector */}
        <div className="relative z-10 pt-4 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Explore 4-Stage Verification Protocols:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['CERTIFICATE', 'SKILL', 'INTERNSHIP', 'PROJECT', 'ACHIEVEMENT'] as ClaimType[]).map((t) => {
                const p = VERIFICATION_PIPELINES[t];
                const isSelected = activePipelineTier === t;
                return (
                  <button
                    key={t}
                    onClick={() => setActivePipelineTier(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 border border-slate-700'
                    }`}
                  >
                    <span>{p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* The 4-Stage Visual Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Stage 1: Claim */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                  Stage 1 • Claim
                </span>
                <span className="text-xs font-black text-slate-500 font-mono">01</span>
              </div>
              <h4 className="text-sm font-extrabold text-white">
                {VERIFICATION_PIPELINES[activePipelineTier].step1}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Candidate provides documentation, credential identifiers, code links, or proctored attempts.
              </p>
              <div className="text-[11px] font-mono text-blue-400 pt-1">
                ↳ Input payload & identity timestamp
              </div>
            </div>

            {/* Stage 2: Verification */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase">
                  Stage 2 • Verification
                </span>
                <span className="text-xs font-black text-slate-500 font-mono">02</span>
              </div>
              <h4 className="text-sm font-extrabold text-white">
                {VERIFICATION_PIPELINES[activePipelineTier].step2}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {VERIFICATION_PIPELINES[activePipelineTier].rationale}
              </p>
              <div className="text-[11px] font-mono text-indigo-400 pt-1">
                ↳ Oracle: {VERIFICATION_PIPELINES[activePipelineTier].exampleAuthority}
              </div>
            </div>

            {/* Stage 3: Verified Badge */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                  Stage 3 • Verified Badge
                </span>
                <span className="text-xs font-black text-slate-500 font-mono">03</span>
              </div>
              <h4 className="text-sm font-extrabold text-white">
                {VERIFICATION_PIPELINES[activePipelineTier].step3}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cryptographically signed ledger hash issued with tamper-proof institutional certificate authority stamp.
              </p>
              <div className="text-[11px] font-mono text-amber-400 pt-1">
                ↳ SHA-256 seal & verifiable cryptographic hash
              </div>
            </div>

            {/* Stage 4: Portfolio */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  Stage 4 • Portfolio
                </span>
                <span className="text-xs font-black text-slate-500 font-mono">04</span>
              </div>
              <h4 className="text-sm font-extrabold text-white">
                {VERIFICATION_PIPELINES[activePipelineTier].step4}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Published with public verification link and QR code, directly consumable by corporate recruiters.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 pt-1">
                ↳ Permanent verifiable passport ledger
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Spotlight: SKILLS & PROJECTS (Exact Prompt Specification) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SKILLS Spotlight: React 91%, Python 82%, SQL 74% */}
        <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                Primary Competencies
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Code2 size={16} className="text-blue-600" />
                <span>SKILLS</span>
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('SKILLS')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All 17 Verified Skills</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-4 pt-1">
            {/* React: 91% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">React</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    ✓ Verified (91%)
                  </span>
                </div>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">91%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-lg overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-md transition-all duration-1000 shadow-sm" style={{ width: '91%' }} />
              </div>
              <span className="text-[10px] text-slate-400 block">
                React 19, TypeScript, Frontend Systems Rig & Architecture Benchmarks
              </span>
            </div>

            {/* Python: 82% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">Python</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    ✓ Verified (82%)
                  </span>
                </div>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">82%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-lg overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-md transition-all duration-1000 shadow-sm" style={{ width: '82%' }} />
              </div>
              <span className="text-[10px] text-slate-400 block">
                Algorithmic problem solving, ROS2 rclpy client, PyTorch dataset loaders
              </span>
            </div>

            {/* SQL: 74% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">SQL</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    ✓ Verified (74%)
                  </span>
                </div>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">74%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-lg overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-500 h-full rounded-md transition-all duration-1000 shadow-sm" style={{ width: '74%' }} />
              </div>
              <span className="text-[10px] text-slate-400 block">
                PostgreSQL index tuning, PostGIS spatial queries, ACID transactions
              </span>
            </div>
          </div>
        </div>

        {/* PROJECTS Spotlight: ✓ CampusOS, ✓ AI Document Intelligence, ✓ Autonomous Mobility */}
        <div className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                Flagship Technical Builds
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FolderGit2 size={16} className="text-blue-600" />
                <span>PROJECTS</span>
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('PROJECTS')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All 6 Verified Projects</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {/* 1. CampusOS */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-extrabold text-sm">✓</span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    CampusOS
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold font-mono">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enterprise autonomous multi-agent operating system integrating copilots, digital twins, and skill intelligence.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {['React 19', 'TypeScript', 'ADK', 'Gemini'].map(t => (
                    <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono pt-1">
                  <span className="text-emerald-500 font-bold">Claim ✓</span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-bold">Verify ✓</span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-bold">Badge ✓</span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-bold">Portfolio ✓</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenProof('CampusOS', 'Project Proof', 'University Senate Audit', '0xPRJ-CAMPUSOS-8419A', 'Sep 2026', 'Production Grade • 100% CI/CD Pass', 'GitHub Actions Automated Test Rig + Faculty Capstone Jury Audit', 'Academic Verified', 'Aug 2026', '100% Tamper-Proof')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 cursor-pointer shrink-0 flex items-center gap-1"
              >
                <ShieldCheck size={12} />
                <span>Ledger Proof</span>
              </button>
            </div>

            {/* 2. AI Document Intelligence */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-extrabold text-sm">✓</span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    AI Document Intelligence
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold font-mono">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Multimodal RAG knowledge vector hub indexing 15,000+ institutional documents with 98.2% factual extraction accuracy.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {['Python', 'pgvector', 'FastAPI', 'Gemini Pro'].map(t => (
                    <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono pt-1">
                  <span className="text-emerald-500 font-bold">Claim ✓</span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-bold">Verify ✓</span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-bold">Badge ✓</span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-bold">Portfolio ✓</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenProof('AI Document Intelligence', 'Project Proof', 'Academic Vector Benchmark', '0xPRJ-DOCINTEL-7721F', 'Aug 2026', '98.2% Factual Accuracy', 'Multimodal pgvector Evaluation & Benchmark Suite', 'Academic Verified', 'Jul 2026', '100% Tamper-Proof')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 cursor-pointer shrink-0 flex items-center gap-1"
              >
                <ShieldCheck size={12} />
                <span>Ledger Proof</span>
              </button>
            </div>

            {/* 3. Autonomous Mobility */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-extrabold text-sm">✓</span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    Autonomous Mobility
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold font-mono">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Full-stack ROS2 Humble electric campus shuttle with dual LiDAR point clouds, Nav2 inflation, and zero disengagements.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {['ROS2 Humble', 'Nav2', 'C++', 'Python', 'CAN Bus'].map(t => (
                    <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono pt-1">
                  <span className="text-emerald-500 font-bold">Claim ✓</span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-bold">Verify ✓</span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-bold">Badge ✓</span>
                  <span>➔</span>
                  <span className="text-emerald-500 font-bold">Portfolio ✓</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenProof('Autonomous Mobility', 'Project Proof', 'Genova Mobility Systems Audit', '0xPRJ-AUTONOMY-3310D', 'Jul 2026', 'Zero Disengagements • 45Hz Sensor Rig', 'Field Autonomy Track Telemetry + Hardware-in-the-loop Rig', 'Academic Verified', 'Jun 2026', '100% Tamper-Proof')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 cursor-pointer shrink-0 flex items-center gap-1"
              >
                <ShieldCheck size={12} />
                <span>Ledger Proof</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SIH26044 5-Tier Verification Explorer Tabs */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All Verified Records', count: portfolio.stats.verifiedSkillsCount + portfolio.stats.projectsCount + portfolio.stats.certificationsCount + portfolio.stats.internshipsCount + portfolio.stats.achievementsCount },
              { id: 'SKILLS', label: 'Skills', count: portfolio.stats.verifiedSkillsCount },
              { id: 'PROJECTS', label: 'Projects', count: portfolio.stats.projectsCount },
              { id: 'CERTIFICATES', label: 'Certifications', count: portfolio.stats.certificationsCount },
              { id: 'INTERNSHIPS', label: 'Internships', count: portfolio.stats.internshipsCount },
              { id: 'ACHIEVEMENTS', label: 'Achievements', count: portfolio.stats.achievementsCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabTier)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 hidden md:block">
            SIH26044 Multi-Tier Verifiable Evidence Ledger
          </div>
        </div>

        {/* 1. SKILLS SECTION */}
        {(activeTab === 'ALL' || activeTab === 'SKILLS') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code2 size={14} className="text-blue-500" />
                <span>Verified Skills Tier ({portfolio.skills.length} Competencies)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {portfolio.skills.map((sk) => (
                <div
                  key={sk.id}
                  className="bg-surface dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{sk.category}</span>
                      <button
                        onClick={() => handleOpenProof(
                          sk.name, 
                          'Skill Verification', 
                          sk.verifiedBy, 
                          sk.verificationHash, 
                          sk.verifiedAt, 
                          `${sk.level}% Mastery Score`,
                          sk.verificationMethod || 'AI Algorithmic Coding Sandbox & Compiler Benchmark',
                          sk.badgeSeal || 'Gold Verified',
                          sk.claimDate || 'Spring 2026',
                          sk.trustScore || '100% Tamper-Proof'
                        )}
                        className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold cursor-pointer hover:bg-emerald-500/20 flex items-center gap-0.5"
                      >
                        <ShieldCheck size={10} />
                        <span>✓ VERIFIED</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{sk.name}</h4>
                      <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">{sk.level}%</span>
                    </div>
                  </div>

                  <div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${sk.level}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800/80 pt-1.5">
                      <span className="text-emerald-500 font-bold">Claim ➔ Verify ➔ Badge ➔ Mint</span>
                      <span className="truncate max-w-[90px] text-slate-500">{sk.verifiedBy.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. PROJECTS SECTION */}
        {(activeTab === 'ALL' || activeTab === 'PROJECTS') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderGit2 size={14} className="text-indigo-500" />
                <span>Verified Projects Tier ({portfolio.projects.length} Repositories)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-surface dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{proj.category}</span>
                      <button
                        onClick={() => handleOpenProof(
                          proj.title, 
                          'Project Verification', 
                          proj.verifiedBy, 
                          proj.verificationHash, 
                          proj.verifiedAt, 
                          `${proj.stars} Stars • Passed CI/CD`,
                          proj.verificationMethod || 'Faculty Capstone Jury & GitHub CI/CD Test Suite',
                          proj.badgeSeal || 'Academic Verified',
                          proj.claimDate || 'Spring 2026',
                          proj.trustScore || '100% Tamper-Proof'
                        )}
                        className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold cursor-pointer hover:bg-emerald-500/20 flex items-center gap-1"
                      >
                        <ShieldCheck size={11} />
                        <span>✓ VERIFIED</span>
                      </button>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                      <strong>Highlight:</strong> {proj.highlight}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {proj.techStack.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-slate-400">
                        Verified by: <strong>{proj.verifiedBy.split(' ')[0]}</strong>
                      </span>
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold flex items-center gap-1 hover:underline text-xs"
                      >
                        <span>Repository</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span className="text-emerald-500 font-bold">Claim ➔ Verify ➔ Badge ➔ Mint</span>
                      <span className="text-slate-500">{proj.badgeSeal || 'Academic Verified'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CERTIFICATIONS SECTION */}
        {(activeTab === 'ALL' || activeTab === 'CERTIFICATES') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap size={14} className="text-purple-500" />
                <span>Verified Certifications Tier ({portfolio.certifications.length} Credentials)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {portfolio.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-surface dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">{cert.issuer}</span>
                      <button
                        onClick={() => handleOpenProof(
                          cert.title, 
                          'Certificate Verification', 
                          cert.verifiedBy, 
                          cert.verificationHash, 
                          cert.issueDate, 
                          `Credential ID: ${cert.credentialId}`,
                          cert.verificationMethod || 'Issuer Public Key & Official Credential Authority Query',
                          cert.badgeSeal || 'Enterprise Verified',
                          cert.claimDate || 'Spring 2026',
                          cert.trustScore || '100% Tamper-Proof'
                        )}
                        className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold cursor-pointer hover:bg-emerald-500/20 flex items-center gap-1"
                      >
                        <ShieldCheck size={11} />
                        <span>✓ VERIFIED</span>
                      </button>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                      {cert.title}
                    </h4>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">
                      ID: {cert.credentialId}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {cert.skillsCovered.map(sc => (
                        <span key={sc} className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 font-mono">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">{cert.issueDate}</span>
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold flex items-center gap-1 hover:underline text-[11px]"
                      >
                        <span>Verify URL</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span className="text-emerald-500 font-bold">Claim ➔ Verify ➔ Badge ➔ Mint</span>
                      <span className="text-slate-500">Gold Seal</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INTERNSHIPS SECTION */}
        {(activeTab === 'ALL' || activeTab === 'INTERNSHIPS') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase size={14} className="text-amber-500" />
                <span>Verified Internships Tier ({portfolio.internships.length} Placements)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.internships.map((intn) => (
                <div
                  key={intn.id}
                  className="bg-surface dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">{intn.company}</span>
                        <span className="text-[10px] text-slate-400">• {intn.location}</span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                        {intn.role}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleOpenProof(
                        intn.role, 
                        'Internship Verification', 
                        intn.verifiedBy, 
                        intn.verificationHash, 
                        intn.verifiedAt, 
                        `${intn.mentorRating}/5.0 Mentor Rating`,
                        intn.verificationMethod || 'Corporate Mentor Rating & University Placement Senate Audit',
                        intn.badgeSeal || 'Enterprise Verified',
                        intn.claimDate || 'Summer 2026',
                        intn.trustScore || '100% Tamper-Proof'
                      )}
                      className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold cursor-pointer hover:bg-emerald-500/20 shrink-0 flex items-center gap-1"
                    >
                      <ShieldCheck size={12} />
                      <span>✓ VERIFIED</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>Duration: <strong className="text-slate-800 dark:text-slate-200">{intn.duration}</strong></div>
                    <div>Stipend: <strong className="text-slate-800 dark:text-slate-200 font-mono">{intn.stipend}</strong></div>
                    <div className="col-span-2">
                      Mentor: <strong className="text-slate-800 dark:text-slate-200">{intn.mentorName}</strong> ({intn.mentorRating}/5.0)
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Verified Outcomes:</span>
                    {intn.keyOutcomes.map((ko, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                        <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{ko}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                    <span className="text-emerald-500 font-bold">Claim ➔ Verify ➔ Badge ➔ Mint</span>
                    <span className="text-slate-500">{intn.badgeSeal || 'Enterprise Verified'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ACHIEVEMENTS SECTION */}
        {(activeTab === 'ALL' || activeTab === 'ACHIEVEMENTS') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span>Verified Achievements & Patents ({portfolio.achievements.length} Honors)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolio.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-surface dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase">
                        {ach.category} • {ach.year}
                      </span>
                      <button
                        onClick={() => handleOpenProof(
                          ach.title, 
                          'Achievement Verification', 
                          ach.issuedBy, 
                          ach.verificationHash, 
                          ach.year, 
                          'Official Gazette & Jury Endorsement',
                          ach.verificationMethod || 'Official Competition Jury Record & Patent Gazette Entry',
                          ach.badgeSeal || 'Gold Verified',
                          ach.claimDate || '2026',
                          ach.trustScore || '100% Tamper-Proof'
                        )}
                        className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold cursor-pointer hover:bg-emerald-500/20 flex items-center gap-1"
                      >
                        <ShieldCheck size={11} />
                        <span>✓ VERIFIED</span>
                      </button>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {ach.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ach.description}
                    </p>
                    
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span className="text-emerald-500 font-bold">Claim ➔ Verify ➔ Badge ➔ Mint</span>
                      <span className="text-slate-500">Issuer: {ach.issuedBy.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CRYPTOGRAPHIC LEDGER PROOF MODAL (SIH26044 4-Stage Trace) */}
      {proofModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl border-2 border-emerald-500/40 max-w-lg w-full p-6 md:p-7 shadow-2xl space-y-5 text-white">
            <div className="flex items-start justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-xs">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest block">
                      SIH26044 VERIFICATION & TRUST AUDIT
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {proofModalItem.badgeSeal || 'Gold Verified'}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-extrabold text-white font-display mt-0.5">
                    {proofModalItem.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setProofModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Prevents unverified portfolio claims:</strong> This record went through our 4-stage verification oracle before receiving an immutable badge signature.
            </p>

            {/* 4-Stage Verification Audit Timeline */}
            <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-xs">
              {/* Stage 1 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-0.5 w-full">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-slate-200 uppercase">Stage 1 • Claim Submission</span>
                    <span className="text-slate-400 font-mono text-[10px]">{proofModalItem.claimDate || 'Spring 2026'}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Logged by <strong className="text-slate-200">{portfolio.candidateName}</strong> with raw payload & metadata.
                  </div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-0.5 w-full">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-indigo-300 uppercase">Stage 2 • Verification Oracle</span>
                    <span className="text-emerald-400 font-bold text-[10px]">PASSED ✓</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Method: <strong className="text-slate-200">{proofModalItem.verificationMethod}</strong>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Authority: <strong className="text-slate-200">{proofModalItem.issuer}</strong>
                  </div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-0.5 w-full">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-amber-300 uppercase">Stage 3 • Verified Badge Minted</span>
                    <span className="text-amber-400 font-mono text-[10px]">{proofModalItem.trustScore || '100% Tamper-Proof'}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Badge Tier: <strong className="text-slate-200">{proofModalItem.badgeSeal || 'Gold Verified'}</strong>
                  </div>
                  {proofModalItem.scoreOrRating && (
                    <div className="text-slate-400 text-[11px]">
                      Benchmark: <strong className="text-emerald-400">{proofModalItem.scoreOrRating}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Stage 4 */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-0.5 w-full">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-emerald-400 uppercase">Stage 4 • Portfolio Publication</span>
                    <span className="text-slate-400 font-mono text-[10px]">{proofModalItem.date}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 break-all pt-0.5">
                    SHA-256: <strong className="text-emerald-400">{proofModalItem.hash}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setProofModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(proofModalItem.hash);
                  toast('Verification Hash Copied', proofModalItem.hash, 'info');
                  setProofModalItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Copy Ledger Hash</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 17. INTERACTIVE VERIFICATION PROTOCOL SIMULATOR MODAL */}
      {isVerifySimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl border-2 border-emerald-500/50 max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-5 text-white">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-xs">
                  <Zap size={20} className="fill-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest block">
                      SIH26044 VERIFICATION ENGINE SIMULATOR
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-extrabold text-white font-display">
                    Execute Verification Protocol
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVerifySimulatorOpen(false);
                  setSimulatingStep(0);
                  setVerifiedItemResult(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Test how an unverified student claim traverses through the multi-agent verification oracle and earns an official cryptographic verified badge on their portfolio:
            </p>

            {/* Tier Selector Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                1. Select Claim Stream to Verify:
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {(['CERTIFICATE', 'SKILL', 'INTERNSHIP', 'PROJECT', 'ACHIEVEMENT'] as ClaimType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    disabled={simulatingStep > 0 && simulatingStep < 4}
                    onClick={() => handleLoadPreset(t)}
                    className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                      simulatorTier === t
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {t === 'CERTIFICATE' ? 'Cert' : t === 'INTERNSHIP' ? 'Intern' : t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Claim Title / Position / Exam:</label>
                <input
                  type="text"
                  disabled={simulatingStep > 0 && simulatingStep < 4}
                  value={claimTitle}
                  onChange={(e) => setClaimTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:border-emerald-500 focus:outline-hidden"
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Issuer / Corporate Mentor / Authority:</label>
                  <input
                    type="text"
                    disabled={simulatingStep > 0 && simulatingStep < 4}
                    value={claimIssuer}
                    onChange={(e) => setClaimIssuer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:border-emerald-500 focus:outline-hidden"
                    placeholder="e.g. Amazon Web Services"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Category / Domain:</label>
                  <input
                    type="text"
                    disabled={simulatingStep > 0 && simulatingStep < 4}
                    value={claimCategory}
                    onChange={(e) => setClaimCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:border-emerald-500 focus:outline-hidden"
                    placeholder="e.g. Cloud Systems"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Claim Payload / Deliverable Details:</label>
                <textarea
                  rows={2}
                  disabled={simulatingStep > 0 && simulatingStep < 4}
                  value={claimDetails}
                  onChange={(e) => setClaimDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:border-emerald-500 focus:outline-hidden resize-none"
                  placeholder="Describe evidence or validation keys..."
                />
              </div>
            </div>

            {/* Live Simulation Progress */}
            {simulatingStep > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Clock size={14} className="animate-spin text-emerald-400" />
                    <span>Executing 4-Stage Verification Protocol:</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">Stage {simulatingStep} of 4</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className={`p-2 rounded-lg text-center text-[10px] font-bold border ${simulatingStep >= 1 ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                    1. Ingest Claim
                  </div>
                  <div className={`p-2 rounded-lg text-center text-[10px] font-bold border ${simulatingStep >= 2 ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                    2. Oracle Audit
                  </div>
                  <div className={`p-2 rounded-lg text-center text-[10px] font-bold border ${simulatingStep >= 3 ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                    3. Mint Badge
                  </div>
                  <div className={`p-2 rounded-lg text-center text-[10px] font-bold border ${simulatingStep >= 4 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                    4. Mint to Portfolio
                  </div>
                </div>

                {simulatingStep === 4 && verifiedItemResult && (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-white flex items-center gap-1.5">
                        <CheckCircle2 size={15} className="text-emerald-400" />
                        <span>✓ Verified Badge Awarded & Published</span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                        Hash: {verifiedItemResult.hash} • {verifiedItemResult.seal}
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                      Live on Portfolio
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              {simulatingStep === 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsVerifySimulatorOpen(false);
                    setSimulatingStep(0);
                    setVerifiedItemResult(null);
                    // Switch tab to the minted tier
                    setActiveTab(simulatorTier === 'CERTIFICATE' ? 'CERTIFICATES' : simulatorTier === 'INTERNSHIP' ? 'INTERNSHIPS' : (simulatorTier + 'S') as TabTier);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <CheckCheck size={16} />
                  <span>View Verified Item in Portfolio</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={simulatingStep > 0 && simulatingStep < 4}
                    onClick={() => {
                      setIsVerifySimulatorOpen(false);
                      setSimulatingStep(0);
                    }}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={simulatingStep > 0 && simulatingStep < 4}
                    onClick={handleExecuteVerificationSimulation}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Zap size={14} className="fill-slate-950" />
                    <span>Run 4-Stage Verification Protocol</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RECRUITER PASSPORT QR CODE MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl border border-blue-500/40 max-w-sm w-full p-6 shadow-2xl space-y-4 text-center text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                DIGITAL EMPLOYABILITY PASSPORT
              </span>
              <button onClick={() => setIsQrModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-white/10 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="py-2">
              <h3 className="text-lg font-extrabold text-white">
                {portfolio.candidateName}
              </h3>
              <p className="text-xs text-slate-400">
                Scan to view verified employability credentials on any mobile device
              </p>
            </div>

            {/* QR Simulation Box */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
              <div className="w-full h-full border-4 border-slate-900 rounded-xl flex flex-col items-center justify-center text-slate-900 p-2">
                <QrCode size={110} className="text-slate-900" />
                <span className="text-[8px] font-mono font-bold tracking-widest uppercase mt-1">GENOVA VERIFIED</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300 break-all">
              https://campusos.genova.ai/verify/{portfolio.passportHash.slice(0, 16)}
            </div>

            <button
              onClick={() => {
                toast('Link Copied', 'Public verified portfolio link copied to clipboard.', 'success');
                setIsQrModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Copy Recruiter Share Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

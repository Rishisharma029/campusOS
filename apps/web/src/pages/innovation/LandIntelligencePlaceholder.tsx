import React, { useState } from 'react';
import { 
  Layers, 
  Globe, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Sliders, 
  Database, 
  FileCode,
  Sparkles,
  GitBranch,
  Copy,
  Check,
  Play,
  Terminal,
  Compass,
  MapPin,
  Satellite,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const LandIntelligencePlaceholder: React.FC = () => {
  const BHOOMILENS_GITHUB_URL = 'https://github.com/Rishisharma029/bhoomilens';
  const BHOOMILENS_CLONE_CMD = 'git clone https://github.com/Rishisharma029/bhoomilens.git';

  const [serviceUrl, setServiceUrl] = useState<string>('http://localhost:5001');
  const [authToken, setAuthToken] = useState<string>('genova_bhoomilens_sec_01');
  const [connectionStatus, setConnectionStatus] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('IDLE');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONNECT' | 'MOUNT' | 'API_DOCS'>('OVERVIEW');
  const [copied, setCopied] = useState(false);
  const [pingLog, setPingLog] = useState<string[]>([
    `[Ready] Standing by to connect BhoomiLens Geospatial engine.`,
    `Repository: ${BHOOMILENS_GITHUB_URL}`
  ]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { toast } = useToast();

  const handleCopyClone = () => {
    navigator.clipboard.writeText(BHOOMILENS_CLONE_CMD);
    setCopied(true);
    toast('Command Copied', 'Git clone command copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestConnection = () => {
    setConnectionStatus('CONNECTING');
    setPingLog((prev) => [
      `[${new Date().toLocaleTimeString()}] Pinging BhoomiLens service endpoint: ${serviceUrl}/health...`,
      ...prev
    ]);

    setTimeout(() => {
      setConnectionStatus('DISCONNECTED');
      setPingLog((prev) => [
        `[${new Date().toLocaleTimeString()}] BhoomiLens local service at ${serviceUrl} is awaiting launch. Click 'Open BhoomiLens Repository' to run locally.`,
        ...prev
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner with Direct GitHub Action Button */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 p-6 md:p-8 border border-emerald-500/30 text-white shadow-2xl">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Layers size={14} />
              <span>GENOVA INNOVATION • ACTIVE REPO INTEGRATION</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Satellite size={13} />
              <span>BhoomiLens Geospatial AI</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-display flex items-center gap-3">
              <span>BhoomiLens</span>
              <span className="text-emerald-400 text-lg md:text-2xl font-light">| Land Intelligence System (LIS)</span>
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
              High-precision Geospatial AI, Cadastral Boundary Analytics, Drone Orthomosaics, and Multi-Spectral Ground Telemetry.
            </p>
          </div>

          {/* Action CTAs: Direct Link to GitHub & Local Bridge */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={BHOOMILENS_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <GitBranch size={16} />
              <span>Connect to BhoomiLens on GitHub</span>
              <ExternalLink size={14} className="ml-0.5" />
            </a>

            <button
              type="button"
              onClick={handleCopyClone}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-mono text-xs transition-all cursor-pointer shadow"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>git clone bhoomilens</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('MOUNT')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Play size={14} />
              <span>Mount Live BhoomiLens UI</span>
            </button>
          </div>

          {/* Quick Bridge Status Badge */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Official GitHub: <strong>Rishisharma029/bhoomilens</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Globe size={14} className="text-emerald-400" />
              <span>Local Service Port: <strong>5001</strong></span>
            </div>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'OVERVIEW', label: 'Architecture & Features' },
          { id: 'CONNECT', label: 'BhoomiLens Bridge & Setup' },
          { id: 'MOUNT', label: 'Live Embedded App Container' },
          { id: 'API_DOCS', label: 'LIS API Contracts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Architecture & Features */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Compass size={18} className="text-emerald-500" />
                BhoomiLens: Next-Gen Land Intelligence Architecture
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                BhoomiLens unifies aerial drone surveys, satellite multi-spectral imagery, and digital cadastral records to automate campus perimeter surveillance, encroachment detection, and soil fertility analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <Satellite size={16} />
                  <span>Multi-Spectral Drone Ingest</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Ingestion of high-res orthomosaics, NDVI vegetation health indexes, and digital surface elevation models (DSM).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <MapPin size={16} />
                  <span>Cadastral Boundary AI</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Deep learning geometry matching to align physical drone survey footage with state revenue & municipal land deed records.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <Layers size={16} />
                  <span>Topography & Soil Hydrology</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Real-time runoff modeling, slope gradient calculation, and automated soil fertility scoring for green campus zones.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  <Globe size={16} />
                  <span>GENOVA AI Micro-Frontend Bridge</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Zero-latency embedding and Web Component protocol bridge allowing BhoomiLens to run directly inside GENOVA AI.
                </p>
              </div>
            </div>

            {/* Direct Link Banner Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <GitBranch size={14} className="text-emerald-400" />
                  GitHub Codebase Available
                </span>
                <p className="text-[11px] text-slate-400">
                  Explore full open-source geospatial models, FastAPI backend, and frontend source code.
                </p>
              </div>
              <a
                href={BHOOMILENS_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <span>Open Repository</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Quick Bridge Status Panel */}
          <div className="bg-surface dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Bridge Diagnostic
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Standalone Target</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{serviceUrl}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Repository</span>
                  <a
                    href={BHOOMILENS_GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-emerald-500 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>Rishisharma029/bhoomilens</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Integration Mode</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    BhoomiLens Micro-Frontend Bridge
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleTestConnection}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <RefreshCw size={14} className={connectionStatus === 'CONNECTING' ? 'animate-spin' : ''} />
                <span>Test Bridge Connection</span>
              </button>
              <button
                onClick={() => setActiveTab('MOUNT')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Play size={13} />
                <span>Mount Embedded View</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: BhoomiLens Bridge & Setup */}
      {activeTab === 'CONNECT' && (
        <div className="bg-surface dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sliders size={18} className="text-emerald-500" />
                BhoomiLens Service Bridge Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Connect your running BhoomiLens development server or cloud deployment to CampusOS.
              </p>
            </div>
            <a
              href={BHOOMILENS_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <GitBranch size={13} /> View on GitHub
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                BhoomiLens Service URL / Endpoint
              </label>
              <input
                type="text"
                value={serviceUrl}
                onChange={(e) => setServiceUrl(e.target.value)}
                placeholder="http://localhost:5001"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: http://localhost:5001 (or http://localhost:3000)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Handshake / API Secret Token
              </label>
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="genova_bhoomilens_sec_01"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Transmitted in Authorization header for secure telemetry ingest</span>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Terminal size={14} /> Quick Run Instructions for BhoomiLens
            </span>
            <div className="font-mono text-xs text-slate-300 space-y-1.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
              <div className="text-slate-500"># 1. Clone repository</div>
              <div className="text-emerald-400">git clone https://github.com/Rishisharma029/bhoomilens.git</div>
              <div className="text-slate-500 pt-1"># 2. Enter directory and run</div>
              <div className="text-emerald-400">cd bhoomilens && npm install && npm run dev</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Bridge Console Telemetry</div>
            {pingLog.map((log, idx) => (
              <div key={idx} className="text-[11px] leading-relaxed">
                {log}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestConnection}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <RefreshCw size={14} className={connectionStatus === 'CONNECTING' ? 'animate-spin' : ''} />
              Test Connection
            </button>
            <button
              onClick={() => toast('Saved', `Bridge set to ${serviceUrl}`, 'success')}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Live Embedded App Container */}
      {activeTab === 'MOUNT' && (
        <div className="bg-surface dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Database size={18} className="text-emerald-500" />
                Live BhoomiLens Micro-Frontend Container
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Embedded view of BhoomiLens running on <code className="font-mono text-emerald-500">{serviceUrl}</code>.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMounted(!isMounted)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isMounted 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-emerald-600 text-white shadow'
                }`}
              >
                <Play size={12} />
                <span>{isMounted ? 'Unmount Container' : 'Mount BhoomiLens'}</span>
              </button>
              <a
                href={BHOOMILENS_GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:underline font-semibold px-2 py-1"
              >
                <span>GitHub Repo</span> <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {isMounted ? (
            <div className="w-full h-[650px] rounded-xl overflow-hidden border border-emerald-500/40 shadow-2xl bg-black">
              <iframe
                src={serviceUrl}
                title="BhoomiLens Standalone App"
                className="w-full h-full border-0"
                allow="geolocation; camera; microphone"
              />
            </div>
          ) : (
            <div className="w-full h-96 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-center p-6 text-center">
              <Globe size={40} className="text-emerald-500/60 mb-3 animate-pulse" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                BhoomiLens Geospatial UI Ready to Mount
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1.5 leading-relaxed">
                Connect your running BhoomiLens server at <code className="font-mono text-emerald-500">{serviceUrl}</code>. Or visit the official repository to run the project.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsMounted(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Play size={13} /> Mount Container Now
                </button>
                <a
                  href={BHOOMILENS_GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <GitBranch size={13} /> View on GitHub
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: LIS API Contracts */}
      {activeTab === 'API_DOCS' && (
        <div className="bg-surface dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCode size={18} className="text-emerald-500" />
              BhoomiLens REST & WebSocket API Specs
            </h3>
            <span className="text-xs text-emerald-400 font-mono">OpenAPI 3.1</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standard specifications implemented by BhoomiLens to stream geospatial coordinates into CampusOS:
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-emerald-500 font-bold">GET</span> <span className="text-slate-800 dark:text-slate-200">/api/v1/health</span>
              <p className="font-sans text-[11px] text-slate-400 mt-1">Healthcheck returning system telemetry, GPU status, and loaded GIS GeoTIFF datasets.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-blue-500 font-bold">POST</span> <span className="text-slate-800 dark:text-slate-200">/api/v1/land/cadastral/match</span>
              <p className="font-sans text-[11px] text-slate-400 mt-1">Payload with boundary GeoJSON or drone orthomosaic bounding box for AI parcel analysis.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-purple-500 font-bold">WS</span> <span className="text-slate-800 dark:text-slate-200">/ws/drone/telemetry</span>
              <p className="font-sans text-[11px] text-slate-400 mt-1">Real-time WebSocket stream of aerial drone telemetry coordinates and camera video feed.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

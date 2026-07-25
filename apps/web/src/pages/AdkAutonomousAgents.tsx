import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast';
import { Cpu, Bot, Database, Terminal, Sparkles, Zap, CheckCircle2, RefreshCw, Code, Layers } from 'lucide-react';
import { AdkAutonomousAgentEngine, type AdkAgentDefinition, type RagVectorDocument, type GeminiToolCallLog } from '../lib/adkAutonomousAgentEngine';

export const AdkAutonomousAgents: React.FC = () => {
  const toastContext = useToast();
  const toast = toastContext?.toast || ((t: string, m?: string) => console.log(t, m));

  const [agents] = useState<AdkAgentDefinition[]>(AdkAutonomousAgentEngine.getAgents());
  const [ragDocs] = useState<RagVectorDocument[]>(AdkAutonomousAgentEngine.getRagDocuments());
  const [toolLogs] = useState<GeminiToolCallLog[]>(AdkAutonomousAgentEngine.getToolCallingLogs());

  const handleTestAgent = (agentName: string) => {
    toast('ADK Agent Dispatched', `${agentName} triggered successfully via Gemini Tool Calling pipeline.`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-purple-500/40 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-950/40 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono tracking-wider">
                LAYER 3: AUTONOMOUS AGENTS ARCHITECTURE
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2 m-0">
              <Bot size={22} className="text-purple-400" />
              ADK Autonomous Agents & Gemini AI Core Console
            </h1>
            <p className="text-xs text-slate-300">
              Agent Development Kit (ADK) orchestration, RAG Vector DB document search, and Gemini native Tool Calling telemetry.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-500/30 self-start md:self-auto flex items-center gap-2">
            <Cpu size={14} className="animate-spin text-purple-400" /> GEMINI AI CORE CONNECTED
          </span>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-1.5 border-purple-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active ADK Agents</span>
            <Bot size={15} className="text-purple-400" />
          </div>
          <div className="text-xl font-extrabold text-purple-300 font-mono">{agents.length} Agents Online</div>
          <div className="text-[10px] text-slate-400">Gemini 1.5 Pro & Flash Powered</div>
        </div>

        <div className="glass-card p-4 space-y-1.5 border-cyan-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>RAG Vector DB Index</span>
            <Database size={15} className="text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-cyan-300 font-mono">{ragDocs.reduce((acc, d) => acc + d.chunkCount, 0)} Chunks</div>
          <div className="text-[10px] text-cyan-400 font-mono">1536-Dim Embedding Vectors</div>
        </div>

        <div className="glass-card p-4 space-y-1.5 border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tool Calling Invocation</span>
            <Terminal size={15} className="text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">100% Success Rate</div>
          <div className="text-[10px] text-slate-400">Average Latency: 180ms</div>
        </div>

        <div className="glass-card p-4 space-y-1.5 border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>OCR & Multimodal AI</span>
            <Sparkles size={15} className="text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-amber-300 font-mono">Multimodal Active</div>
          <div className="text-[10px] text-amber-400 font-mono">Vision & PDF Text Parser</div>
        </div>
      </div>

      <Tabs defaultValue="agents">
        <TabList className="bg-slate-950/80 p-1 border border-slate-800 rounded-xl">
          <TabTrigger value="agents">🤖 Active ADK Autonomous Agents</TabTrigger>
          <TabTrigger value="rag">📚 RAG Vector Document Index</TabTrigger>
          <TabTrigger value="tools">⚡ Gemini Tool Calling Logs</TabTrigger>
        </TabList>

        {/* Tab 1: Active ADK Autonomous Agents */}
        <TabContent value="agents" className="space-y-4 pt-4">
          <Card className="border-slate-800">
            <CardHeader>
              <div>
                <CardTitle className="text-sm font-bold text-white">ADK Agent Registry & Real-Time Telemetry</CardTitle>
                <CardDescription className="text-xs text-slate-400">Autonomous subagents operating across Layer 1 ERP and Layer 2 Executive Intelligence</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {agents.map((ag) => (
                  <div key={ag.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <div>
                          <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                            <Bot size={14} className="text-purple-400" />
                            {ag.name}
                          </h4>
                          <p className="text-[10px] text-purple-300 font-mono">{ag.role}</p>
                        </div>
                        <span className="text-[9px] font-extrabold font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {ag.model}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{ag.description}</p>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono">Bound Tool Functions:</span>
                        <div className="flex flex-wrap gap-1">
                          {ag.tools.map((t, idx) => (
                            <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-850 text-[10px] text-slate-400 font-mono italic">
                        Last Telemetry: {ag.lastAction}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 size={11} /> {ag.status.replace('_', ' ')}
                      </span>
                      <Button
                        onClick={() => handleTestAgent(ag.name)}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <Zap size={12} /> Dispatch Agent &rarr;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabContent>

        {/* Tab 2: RAG Vector Document Index */}
        <TabContent value="rag" className="pt-4">
          <Card className="border-slate-800">
            <CardHeader>
              <div>
                <CardTitle className="text-sm font-bold text-white">Retrieval-Augmented Generation (RAG) Document Store</CardTitle>
                <CardDescription className="text-xs text-slate-400">Indexed vector embeddings for campus regulations, syllabi, and financial policies</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ragDocs.map((doc) => (
                  <div key={doc.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{doc.docName}</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Vector Chunks: <strong className="text-purple-300">{doc.chunkCount}</strong> &bull; Dimensions: {doc.embeddingDimensions}D &bull; Status: {doc.indexingStatus}
                      </p>
                      <p className="text-[10px] text-slate-500 italic">Last Query Match: "{doc.lastQueryMatch}"</p>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded border border-emerald-500/30">
                      INDEXED & VECTORIZED ✓
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabContent>

        {/* Tab 3: Gemini Tool Calling Logs */}
        <TabContent value="tools" className="pt-4">
          <Card className="border-slate-800">
            <CardHeader>
              <div>
                <CardTitle className="text-sm font-bold text-white">Gemini Native Tool Calling Execution Ledger</CardTitle>
                <CardDescription className="text-xs text-slate-400">Sub-second function invocation telemetry & argument payloads</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {toolLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">⚡ {log.toolInvoked}()</span>
                        <span className="text-white font-bold">via {log.agentName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-900">
                      <div>Payload Arguments: <code className="text-cyan-300">{log.inputArguments}</code></div>
                      <div>Execution Latency: <strong className="text-purple-300">{log.executionTimeMs}ms</strong> &bull; Status: <strong className="text-emerald-400">{log.resultStatus}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabContent>
      </Tabs>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Bot, Mic, MicOff, Volume2, VolumeX, Send, Sparkles, X, Globe, MapPin, Calendar, CheckSquare, BarChart2, BookOpen, Award, FileText, UserCheck, HelpCircle, Key, Play, ShieldAlert, CheckCircle2, FileCode } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useRole } from '../context/RoleContext';
import { CampusOSAIOrchestrator, type SubAgentRole } from '../lib/multiAgentOrchestrator';
import type { RAGQueryResult } from '../lib/ragKnowledgeBase';
import type { ToolCallExecution } from '../lib/agentTools';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionableLink?: string;
  intent?: string;
  actions?: string[];
  toolExecutions?: ToolCallExecution[];
  citations?: RAGQueryResult[];
  routedAgent?: SubAgentRole;
  isGeminiLive?: boolean;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { students } = useDatabase();
  const { currentRole } = useRole();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello! I am your ${currentRole} AI Orchestrator. Connected to 10 specialized sub-agents, tool execution engines (ReserveRoom, SubmitLeave, SendEmail), and document RAG knowledge base. How can I assist your workflow today?`,
      timestamp: 'Just now',
      routedAgent: currentRole === 'Faculty' ? 'FacultyAgent' : currentRole === 'Parent' ? 'ParentAgent' : currentRole === 'Admin' ? 'PrincipalAgent' : 'StudentAgent',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi' | 'es' | 'fr'>('en');

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Process query via Multi-Agent Orchestrator & Tool Calling Engine
    setTimeout(() => {
      const orchestratorResult = CampusOSAIOrchestrator.processUserRequest(query, currentRole);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: orchestratorResult.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionableLink: orchestratorResult.actionableLink,
        intent: orchestratorResult.intent,
        actions: orchestratorResult.actions,
        toolExecutions: orchestratorResult.toolExecutions,
        citations: orchestratorResult.citations,
        routedAgent: orchestratorResult.routedAgent,
        isGeminiLive: !!geminiApiKey,
      };

      setMessages(prev => [...prev, aiMsg]);

      // Speech synthesis
      if (ttsEnabled && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(orchestratorResult.response.replace(/[*#•]/g, ''));
        utterance.rate = 1.0;
        synth.speak(utterance);
      }
    }, 500);
  };

  const saveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowKeyInput(false);
  };

  const toggleVoice = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputQuery("I won't be able to attend class tomorrow.");
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-card w-full max-w-3xl overflow-hidden flex flex-col h-[660px] border border-blue-500/30 shadow-2xl relative">
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/20">
              <Bot size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
                CampusOS ADK Multi-Agent Orchestrator
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  10 Agents & Tool Execution Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">Grounded RAG Document Retrieval & Tool Execution</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                geminiApiKey ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Configure Gemini API Key"
            >
              <Key size={14} />
              <span className="hidden sm:inline">{geminiApiKey ? 'Key Active' : 'Gemini Key'}</span>
            </button>

            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2 rounded-lg border transition-all ${
                ttsEnabled
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={ttsEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
            >
              {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Gemini API Key Drawer Input */}
        {showKeyInput && (
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 text-xs">
            <Key size={14} className="text-emerald-400 shrink-0" />
            <input
              type="password"
              value={geminiApiKey}
              onChange={e => saveApiKey(e.target.value)}
              placeholder="Paste Google Gemini API Key (e.g. AIzaSy...)"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
            >
              Save Key
            </button>
          </div>
        )}

        {/* Actionable Agent Preset Chips */}
        <div className="p-2.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleSend("I won't be able to attend class tomorrow.")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-amber-600/30 text-amber-300 text-xs border border-slate-700 hover:border-amber-500/40 transition-all shrink-0 font-medium"
          >
            <FileText size={12} className="text-amber-400" />
            Submit Leave Application
          </button>
          <button
            onClick={() => handleSend('Book Lab 3 tomorrow.')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600/30 text-blue-300 text-xs border border-slate-700 hover:border-blue-500/40 transition-all shrink-0 font-medium"
          >
            <Calendar size={12} className="text-blue-400" />
            Reserve Room / Lab 3
          </button>
          <button
            onClick={() => handleSend('Find an empty classroom.')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 text-xs border border-slate-700 hover:border-indigo-500/40 transition-all shrink-0 font-medium"
          >
            <MapPin size={12} className="text-indigo-400" />
            Find Empty Classroom
          </button>
          <button
            onClick={() => handleSend("Generate today's attendance report.")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-600/30 text-emerald-300 text-xs border border-slate-700 hover:border-emerald-500/40 transition-all shrink-0 font-medium"
          >
            <BarChart2 size={12} className="text-emerald-400" />
            Generate Attendance Report
          </button>
          <button
            onClick={() => handleSend('Can I register late for exams?')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-purple-600/30 text-purple-300 text-xs border border-slate-700 hover:border-purple-500/40 transition-all shrink-0 font-medium"
          >
            <BookOpen size={12} className="text-purple-400" />
            RAG Exam Reg Rules
          </button>
          <button
            onClick={() => handleSend('Email my professor.')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-600/30 text-cyan-300 text-xs border border-slate-700 hover:border-cyan-500/40 transition-all shrink-0 font-medium"
          >
            <UserCheck size={12} className="text-cyan-400" />
            Email Advisor
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-slate-900/40 to-slate-950/60">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-600 text-white shadow-md'
                }`}
              >
                {msg.sender === 'user' ? <span className="text-xs font-bold">You</span> : <Sparkles size={14} />}
              </div>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Routed Sub-Agent Tag & Intent */}
                {msg.routedAgent && (
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                      <Bot size={11} /> {msg.routedAgent}
                    </span>
                    {msg.intent && (
                      <span className="text-[9px] font-mono text-slate-400">
                        intent: <strong className="text-slate-300">{msg.intent}</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Structured Application Workflow Actions Log */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-purple-300 space-y-1">
                    <span className="font-bold text-purple-400 flex items-center gap-1">
                      <FileCode size={11} /> Application Action Steps Executed:
                    </span>
                    {msg.actions.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                        <CheckCircle2 size={10} className="text-emerald-400 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tool Executions Status Box */}
                {msg.toolExecutions && msg.toolExecutions.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-[10px] space-y-1.5">
                    <span className="font-bold text-blue-400 flex items-center gap-1">
                      <Play size={10} /> Tool Executed: {msg.toolExecutions[0].toolName}()
                    </span>
                    <pre className="text-[9px] bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400 overflow-x-auto">
                      {JSON.stringify(msg.toolExecutions[0].result, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Document RAG Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[10px] text-amber-200/90 space-y-1">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <BookOpen size={11} /> Grounded RAG Citation Source:
                    </span>
                    <p className="font-semibold">{msg.citations[0].document.title} ({msg.citations[0].document.section})</p>
                  </div>
                )}

                {/* Text Response */}
                <p className="whitespace-pre-line text-slate-100 font-sans">{msg.text}</p>

                {msg.actionableLink && (
                  <a
                    href={msg.actionableLink}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline"
                  >
                    Open relative campus module &rarr;
                  </a>
                )}
                <span className="block text-[10px] opacity-60 text-right mt-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Speech Recognition Indicator */}
        {isListening && (
          <div className="px-4 py-2 bg-blue-900/40 border-t border-blue-500/30 flex items-center gap-3 text-xs text-blue-300 animate-pulse">
            <Mic className="text-blue-400 animate-bounce" size={16} />
            <span>Listening... Speak now ("Book Lab 3 tomorrow" / "I won't be able to attend class")</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={toggleVoice}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Voice Speech-to-Text"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Try: 'I won't be able to attend class tomorrow' / 'Book Lab 3' / 'Generate attendance report'..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/70 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Send size={15} />
            <span>Execute Agent</span>
          </button>
        </div>
      </div>
    </div>
  );
};

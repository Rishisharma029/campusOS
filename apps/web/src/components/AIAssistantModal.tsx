import React, { useState, useEffect } from 'react';
import { Bot, Mic, MicOff, Volume2, VolumeX, Send, Sparkles, X, Globe, MapPin, Calendar, CheckSquare, BarChart2 } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

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
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { students } = useDatabase();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am CampusOS AI Assistant 2.0. Ask me anything about your timetable, attendance, exams, lab locations, or pending assignments!",
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi' | 'es' | 'fr'>('en');

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
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

    // AI Response synthesis
    setTimeout(() => {
      let aiText = "I checked our university database for you.";
      let link: string | undefined = undefined;

      const q = query.toLowerCase();
      if (q.includes('lab 4') || q.includes('where is')) {
        aiText = "Lab 4 is located on the 2nd floor of Block B (Computer Science Wing), right next to the IoT Innovation Hub.";
        link = '/map';
      } else if (q.includes('exam') || q.includes('next exam')) {
        aiText = "Your next scheduled exam is 'Advanced Algorithms' (CS301) on October 15, 2026, 10:00 AM at Hall 2B.";
        link = '/examinations';
      } else if (q.includes('attendance')) {
        const student = students[0] || { attendanceRate: 92.5 };
        aiText = `Your overall attendance across all enrolled subjects is ${student.attendanceRate}%. You are well above the 75% threshold!`;
        link = '/attendance';
      } else if (q.includes('assignment') || q.includes('pending')) {
        aiText = "You have 2 pending assignments: 1) Distributed Systems Lab Report (Due Tomorrow), 2) Database Normalization Quiz (Due in 3 days).";
        link = '/assignments';
      } else {
        aiText = `Based on CampusOS AI Knowledge Base: "${query}". All system checks pass. Let me know if you need specific details or navigation support!`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionableLink: link,
      };

      setMessages(prev => [...prev, aiMsg]);

      // TTS audio simulation
      if (ttsEnabled && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(aiText);
        utterance.rate = 1.0;
        synth.speak(utterance);
      }
    }, 600);
  };

  const toggleVoice = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputQuery('Where is Lab 4?');
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-card w-full max-w-2xl overflow-hidden flex flex-col h-[600px] border border-blue-500/30 shadow-2xl relative">
        {/* Header */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <Bot size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
                CampusOS AI Assistant
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">v2.0 Voice & Multilingual</span>
              </h3>
              <p className="text-xs text-slate-400">Contextual RAG & University Knowledge Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
              <Globe size={13} />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
              </select>
            </div>

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

        {/* Preset Prompt Shortcuts */}
        <div className="p-2.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleSend('Where is Lab 4?')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/70 hover:bg-blue-600/30 text-slate-300 text-xs border border-slate-700 hover:border-blue-500/40 transition-all shrink-0"
          >
            <MapPin size={12} className="text-blue-400" />
            Where is Lab 4?
          </button>
          <button
            onClick={() => handleSend('When is my next exam?')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/70 hover:bg-blue-600/30 text-slate-300 text-xs border border-slate-700 hover:border-blue-500/40 transition-all shrink-0"
          >
            <Calendar size={12} className="text-purple-400" />
            When is my next exam?
          </button>
          <button
            onClick={() => handleSend('Show my attendance')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/70 hover:bg-blue-600/30 text-slate-300 text-xs border border-slate-700 hover:border-blue-500/40 transition-all shrink-0"
          >
            <BarChart2 size={12} className="text-emerald-400" />
            Show my attendance
          </button>
          <button
            onClick={() => handleSend('What assignments are pending?')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/70 hover:bg-blue-600/30 text-slate-300 text-xs border border-slate-700 hover:border-blue-500/40 transition-all shrink-0"
          >
            <CheckSquare size={12} className="text-amber-400" />
            Pending assignments?
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-900/40 to-slate-950/60">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md'
                }`}
              >
                {msg.sender === 'user' ? <span className="text-xs font-bold">You</span> : <Sparkles size={14} />}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                {msg.actionableLink && (
                  <a
                    href={msg.actionableLink}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 underline"
                  >
                    Open relative module &rarr;
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
            <span>Listening... Speak now ("Where is Lab 4?")</span>
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
            placeholder="Type your question or ask voice AI..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/70 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

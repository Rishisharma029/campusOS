import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, HelpCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  data?: any; // To render structured UI blocks (like charts or timetables)
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am CampusOS AI, your smart administrative assistant. Ask me anything about student dropout risks, fee analysis, timetable generation, or campus facility occupancies.',
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    'Predict student dropout risk',
    'Generate tomorrow\'s timetable',
    'Evaluate fee payment risks',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // User Message
    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let aiText = '';
      let aiData = null;

      const normText = text.toLowerCase();
      if (normText.includes('dropout') || normText.includes('predict')) {
        aiText = 'Based on our current predictive ML model (analyzing CGPA < 6.5 and Attendance < 75%), 3 students are at high risk of dropping out this semester:';
        aiData = {
          type: 'dropout',
          list: [
            { name: 'Rohan Mehta', cgpa: '5.8', attendance: '68%', risk: 'High (84%)', department: 'CSE' },
            { name: 'Sneha Rao', cgpa: '6.1', attendance: '72%', risk: 'Medium (62%)', department: 'ECE' },
            { name: 'Arjun Das', cgpa: '5.9', attendance: '70%', risk: 'High (78%)', department: 'ME' },
          ],
        };
      } else if (normText.includes('timetable') || normText.includes('schedule')) {
        aiText = 'Generating optimized mock timetable schedule slots for tomorrow, Thursday, July 9, 2026:';
        aiData = {
          type: 'timetable',
          slots: [
            { time: '09:00 AM - 10:30 AM', subject: 'Advanced Software Architectures (CS-401)', room: 'LHC-102', instructor: 'Dr. R. K. Sen' },
            { time: '11:00 AM - 12:30 PM', subject: 'Data Mining and Warehousing (CS-403)', room: 'LHC-204', instructor: 'Prof. Ananya Roy' },
            { time: '02:00 PM - 03:30 PM', subject: 'Human-Computer Interaction (CS-405)', room: 'Lab 3 (3rd Floor)', instructor: 'Dr. Hardik Lal' },
          ],
        };
      } else if (normText.includes('fee') || normText.includes('dues') || normText.includes('payment')) {
        aiText = 'I have evaluated outstanding fees risks. Active defaults show high risk for students with outstanding payments past 30 days of standard invoice billing:';
        aiData = {
          type: 'fee',
          list: [
            { name: 'Kunal Verma', outstanding: '₹65,000', pastDue: '45 Days', risk: 'Critical', action: 'Dues Alert Sent' },
            { name: 'Priya Iyer', outstanding: '₹40,000', pastDue: '35 Days', risk: 'High', action: 'Pending Reminder' },
          ],
        };
      } else {
        aiText = "I can retrieve real-time smart campus logs. For instance, right now LHC-101 has 85% classroom utilization and Bus Route 12 is running 5 minutes ahead of schedule. Type 'Predict dropout risk' or 'timetable' for interactive evaluations.";
      }

      const aiMsg: Message = {
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: aiData,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-surface border-l border-main shadow-premium-lg z-[100] flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-main flex items-center justify-between bg-slate-50 dark:bg-slate-900/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-205 font-display flex items-center gap-1">
              CampusOS Assistant <Sparkles size={12} className="text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> AI Engine Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 text-xs">
                  <Bot size={12} />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-850 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                <p>{msg.text}</p>

                {/* Render Custom UI Block Data */}
                {msg.data && msg.data.type === 'dropout' && (
                  <div className="mt-3 space-y-2 text-[11px]">
                    {msg.data.list.map((item: any, i: number) => (
                      <div key={i} className="p-2 rounded-lg bg-surface border border-main text-slate-700 dark:text-slate-300 flex justify-between items-center shadow-sm">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name} ({item.department})</p>
                          <p className="text-[10px] text-slate-400">CGPA: {item.cgpa} | Attendance: {item.attendance}</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 font-bold">
                          {item.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Render Timetable Data */}
                {msg.data && msg.data.type === 'timetable' && (
                  <div className="mt-3 space-y-2 text-[11px]">
                    {msg.data.slots.map((item: any, i: number) => (
                      <div key={i} className="p-2 rounded-lg bg-surface border border-main text-slate-700 dark:text-slate-300 shadow-sm">
                        <p className="font-semibold text-primary">{item.subject}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{item.time}</p>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>Room: {item.room}</span>
                          <span>{item.instructor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Render Fee Risk Data */}
                {msg.data && msg.data.type === 'fee' && (
                  <div className="mt-3 space-y-2 text-[11px]">
                    {msg.data.list.map((item: any, i: number) => (
                      <div key={i} className="p-2 rounded-lg bg-surface border border-main text-slate-700 dark:text-slate-300 flex justify-between items-center shadow-sm">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                          <p className="text-[10px] text-slate-400">Owed: <strong className="text-red-500">{item.outstanding}</strong> | Overdue: {item.pastDue}</p>
                        </div>
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 font-semibold">
                          <CheckCircle size={10} /> {item.action}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 mx-8">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 text-xs">
              <Bot size={12} className="animate-pulse" />
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200/50 dark:border-slate-700/50 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-450 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-450 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-450 dark:bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="p-3 border-t border-main bg-slate-50/50 dark:bg-slate-900/5 space-y-1.5">
        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
          <HelpCircle size={11} /> Suggested Queries:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-surface border border-main text-slate-600 dark:text-slate-350 hover:border-primary hover:text-primary transition-all duration-200 focus:outline-none"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputVal);
        }}
        className="p-3 border-t border-main flex gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask a campus administrative query..."
          className="flex-1 px-3 py-1.5 border border-main rounded-xl text-xs bg-surface text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button type="submit" size="sm" className="px-3">
          <Send size={14} />
        </Button>
      </form>
    </div>
  );
};

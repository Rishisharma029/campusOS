import React, { useState } from 'react';
import { FileText, Upload, Sparkles, Languages, HelpCircle, BookOpen, Check, FileCode, Play } from 'lucide-react';

interface ProcessedDoc {
  id: string;
  name: string;
  size: string;
  summary: string;
  keyPoints: string[];
  translatedText?: string;
  quiz: { question: string; options: string[]; answer: number }[];
}

export const AIDocumentCenter: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<ProcessedDoc>({
    id: 'doc-1',
    name: 'Advanced_Neural_Networks_Lecture4.pdf',
    size: '2.4 MB',
    summary: 'This document covers backpropagation algorithms, gradient descent optimization (Adam, RMSProp), vanishing gradient problems, and residual skip connections in modern deep architectures.',
    keyPoints: [
      'Backpropagation uses the chain rule to compute partial derivatives of loss wrt weights.',
      'Adam optimizer combines momentum and adaptive learning rates for faster convergence.',
      'Skip connections in ResNets mitigate vanishing gradients by allowing identity mapping.',
    ],
    quiz: [
      {
        question: 'Which optimizer combines both Momentum and RMSProp concepts?',
        options: ['SGD with Nesterov', 'Adam Optimizer', 'Adagrad', 'L-BFGS'],
        answer: 1,
      },
      {
        question: 'What primary problem do skip connections solve in deep networks?',
        options: ['Overfitting', 'Memory Leaks', 'Vanishing Gradients', 'Dead Neurons'],
        answer: 2,
      },
    ],
  });

  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'points' | 'translate' | 'quiz'>('summary');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setActiveDoc({
          id: `doc-${Date.now()}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          summary: `AI Document Analysis for ${file.name}: Extracted core academic concepts, references, and mathematical formulas into structured summaries.`,
          keyPoints: [
            `Primary focus: Core syllabus coverage for ${file.name.replace(/\.[^/.]+$/, '')}.`,
            'Identified key definitions, theorems, and practical exercise problems.',
            'Cross-linked with Semester 5 Exam Question Bank.',
          ],
          quiz: [
            {
              question: `What is the primary topic discussed in ${file.name}?`,
              options: ['Core Concepts', 'Historical Context', 'Numerical Proofs', 'Case Studies'],
              answer: 0,
            },
          ],
        });
      }, 1500);
    }
  };

  const handleQuizSubmit = () => {
    let score = 0;
    activeDoc.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) score++;
    });
    setQuizScore(score);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="text-purple-400" size={26} />
            AI Smart Document Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload PDF, DOCX, PPT, or lecture notes. AI instantly summarizes, translates, extracts key concepts, and generates interactive quizzes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Dropzone & Upload Panel */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Upload size={16} className="text-blue-400" />
              Upload Academic Notes / Slides
            </h3>
            
            <label className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-900/40">
              <input type="file" accept=".pdf,.docx,.ppt,.pptx,.txt" onChange={handleFileUpload} className="hidden" />
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 mb-2">
                <FileText size={28} />
              </div>
              <span className="text-xs font-semibold text-slate-200">Click or Drag PDF / DOCX</span>
              <span className="text-[10px] text-slate-400 mt-1">Supports up to 50MB files</span>
            </label>
          </div>

          {isProcessing && (
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2 animate-pulse">
              <Sparkles size={16} className="animate-spin" />
              <span>AI is reading, parsing formulas & generating quiz...</span>
            </div>
          )}

          {/* Active Document Info */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Document</span>
            <h4 className="text-xs font-bold text-slate-200 truncate">{activeDoc.name}</h4>
            <span className="text-[10px] text-slate-500">{activeDoc.size} &bull; Processed via RAG</span>
          </div>
        </div>

        {/* AI Output Workspace */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'summary' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen size={14} />
              AI Summary
            </button>
            <button
              onClick={() => setActiveTab('points')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'points' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode size={14} />
              Key Concepts
            </button>
            <button
              onClick={() => setActiveTab('translate')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'translate' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Languages size={14} />
              Translate
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'quiz' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle size={14} />
              AI Quiz
            </button>
          </div>

          {/* Tab Contents */}
          <div className="min-h-[280px]">
            {activeTab === 'summary' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Executive AI Summary</h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  {activeDoc.summary}
                </p>
              </div>
            )}

            {activeTab === 'points' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Key Concept Takeaways</h4>
                <div className="space-y-2">
                  {activeDoc.keyPoints.map((point, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                      <span className="p-1 rounded bg-purple-500/20 text-purple-400 shrink-0 font-mono text-[10px]">{idx + 1}</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'translate' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Target Language</h4>
                  <select
                    value={selectedLanguage}
                    onChange={e => setSelectedLanguage(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1 outline-none"
                  >
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                  </select>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <span className="text-[10px] text-purple-400 font-bold block">Translated via OpenAI Neural MT:</span>
                  <p className="italic">
                    "{activeDoc.summary} (Translated into {selectedLanguage}: 
                    यह दस्तावेज़ बैकप्रॉपैगेशन एल्गोरिदम, ग्रेडिएंट डिसेंट ऑप्टिमाइज़ेशन और modern architectures का वर्णन करता है।)"
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Auto-Generated Quiz ({activeDoc.quiz.length} Questions)</h4>
                {activeDoc.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-semibold text-slate-100">Q{qIdx + 1}: {q.question}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                          className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                            userAnswers[qIdx] === oIdx
                              ? 'bg-purple-600/30 text-purple-300 border-purple-500'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleQuizSubmit}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-purple-500/20"
                  >
                    Submit Answers
                  </button>
                  {quizScore !== null && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
                      Score: {quizScore} / {activeDoc.quiz.length}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

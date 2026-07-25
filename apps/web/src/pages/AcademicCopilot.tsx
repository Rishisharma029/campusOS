import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { AcademicCopilotEngine, type AcademicCopilotResult, type Flashcard } from '../lib/academicCopilotEngine';
import {
  BookOpen,
  Sparkles,
  FileText,
  Scan,
  CheckCircle2,
  HelpCircle,
  RotateCw,
  Calendar,
  Zap,
  Check,
  Award,
  Upload,
  Download,
  Lightbulb,
  ArrowRight,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const AcademicCopilot: React.FC = () => {
  const { currentRole } = useRole();
  const samples = AcademicCopilotEngine.getSampleNotes();

  const [inputNotesText, setInputNotesText] = useState(samples[0].text);
  const [selectedSubject, setSelectedSubject] = useState(samples[0].subject);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'QUIZ' | 'FLASHCARDS' | 'REVISION'>('SUMMARY');

  // Study Kit State
  const [studyKit, setStudyKit] = useState<AcademicCopilotResult>(
    AcademicCopilotEngine.generateCopilotStudyGuide(samples[0].text, samples[0].subject)
  );

  // Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Flashcards State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [flashcardDeck, setFlashcardDeck] = useState<Flashcard[]>(studyKit.flashcards);

  // Revision Plan Completed Tasks State
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const handleRunOCRAndGenerate = (customText?: string, customSubject?: string) => {
    const textToProcess = (customText || inputNotesText).trim();
    if (!textToProcess) return;

    setIsProcessingOCR(true);
    setTimeout(() => {
      setIsProcessingOCR(false);
      const newKit = AcademicCopilotEngine.generateCopilotStudyGuide(textToProcess, customSubject || selectedSubject);
      setStudyKit(newKit);
      setFlashcardDeck(newKit.flashcards);
      setUserAnswers({});
      setSubmittedQuiz(false);
      setCurrentCardIndex(0);
      setIsCardFlipped(false);
    }, 1200);
  };

  const handleSelectSample = (sample: { label: string; text: string; subject: string }) => {
    setInputNotesText(sample.text);
    setSelectedSubject(sample.subject);
    handleRunOCRAndGenerate(sample.text, sample.subject);
  };

  const handleOptionSelect = (quizId: string, optionIdx: number) => {
    if (submittedQuiz) return;
    setUserAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    studyKit.quizzes.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionIndex) score += 1;
    });
    return score;
  };

  const toggleFlashcardMastery = (id: string) => {
    setFlashcardDeck(prev =>
      prev.map(fc => (fc.id === id ? { ...fc, mastered: !fc.mastered } : fc))
    );
  };

  const toggleTaskCompletion = (key: string) => {
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-indigo-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/20">
                <BookOpen size={24} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                  AI Academic Copilot
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                    OCR Notes & AI Study Kit
                  </span>
                </h1>
                <p className="text-xs text-slate-300">Exact OCR Extraction &rarr; AI Shortened Summary, Quizzes, Flashcards & 7-Day Revision Plan</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              OCR & AI ENGINE READY
            </span>
          </div>
        </div>
      </div>

      {/* Input Dropzone & Sample Selector */}
      <div className="glass-card p-5 space-y-4 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Scan size={15} className="text-cyan-400" />
            Upload Notes Image / Document or Paste Text
          </span>

          {/* Sample Triggers */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 font-medium">Try Samples:</span>
            {samples.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(s)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium border border-slate-700 whitespace-nowrap"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text / Image Input */}
        <div className="space-y-3">
          <textarea
            value={inputNotesText}
            onChange={e => setInputNotesText(e.target.value)}
            rows={4}
            placeholder="Paste your raw lecture notes text here or drop notes images..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/70 font-mono leading-relaxed shadow-inner"
          />

          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              placeholder="Subject Name (e.g. Operating Systems)"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500/70"
            />

            <button
              onClick={() => handleRunOCRAndGenerate()}
              disabled={isProcessingOCR}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
            >
              {isProcessingOCR ? (
                <>
                  <Scan size={14} className="animate-spin" /> Processing OCR & AI...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Extract OCR & Build Study Kit &rarr;
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabbed Study Kit Workspace */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('SUMMARY')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'SUMMARY' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText size={14} />
            Exact OCR & AI Summary
          </button>
          <button
            onClick={() => setActiveTab('QUIZ')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'QUIZ' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <HelpCircle size={14} />
            Interactive Quiz ({studyKit.quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('FLASHCARDS')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'FLASHCARDS' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RotateCw size={14} />
            3D Flashcards ({flashcardDeck.length})
          </button>
          <button
            onClick={() => setActiveTab('REVISION')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'REVISION' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calendar size={14} />
            7-Day Revision Plan
          </button>
        </div>

        {/* Tab 1: Exact OCR Verbatim Text vs AI Shortened Summary */}
        {activeTab === 'SUMMARY' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: Exact OCR Text */}
            <div className="glass-card p-5 space-y-3 border-cyan-500/30 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Scan size={14} /> Exact Verbatim OCR Notes Output
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                    RAW TEXT
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
                  {studyKit.exactOCRText}
                </div>
              </div>
            </div>

            {/* Right Col: AI Shortened & Understandable Summary */}
            <div className="glass-card p-5 space-y-4 border-indigo-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> AI Shortened & Understandable Summary
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                  HIGH-YIELD
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-200">
                <p className="text-slate-300 italic">{studyKit.shortSummary.overview}</p>

                {/* Key Takeaways */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={12} /> Key Takeaways:
                  </span>
                  <ul className="space-y-1 pl-2">
                    {studyKit.shortSummary.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-200 leading-snug">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important Formulas */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Zap size={12} /> Formulas & Cheat Sheet:
                  </span>
                  <div className="space-y-1">
                    {studyKit.shortSummary.importantFormulas.map((form, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300">
                        {form}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exam Tips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb size={12} /> High-Yield Exam Tips:
                  </span>
                  <div className="space-y-1">
                    {studyKit.shortSummary.examTips.map((tip, idx) => (
                      <p key={idx} className="p-2 rounded bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-200">
                        💡 {tip}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Quiz Runner */}
        {activeTab === 'QUIZ' && (
          <div className="glass-card p-6 space-y-6 border-purple-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle size={16} className="text-purple-400" />
                  AI Generated Practice Quiz
                </h3>
                <p className="text-xs text-slate-400">Test your understanding with instant feedback</p>
              </div>

              {submittedQuiz && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 text-white font-mono shadow-md">
                  Score: {calculateQuizScore()} / {studyKit.quizzes.length}
                </span>
              )}
            </div>

            <div className="space-y-6">
              {studyKit.quizzes.map((q, qIdx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white leading-relaxed">
                    {qIdx + 1}. {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      const isCorrect = optIdx === q.correctOptionIndex;

                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                      if (submittedQuiz) {
                        if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                        else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-purple-950 border-purple-500 text-purple-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submittedQuiz && isCorrect && <CheckCircle2 size={14} className="text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {submittedQuiz && (
                    <div className="p-3 rounded-xl bg-slate-900 text-[11px] text-slate-300 border border-slate-800 leading-relaxed">
                      <strong className="text-purple-400">Explanation: </strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!submittedQuiz ? (
              <button
                onClick={() => setSubmittedQuiz(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20"
              >
                Submit Quiz Answers &rarr;
              </button>
            ) : (
              <button
                onClick={() => {
                  setSubmittedQuiz(false);
                  setUserAnswers({});
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700"
              >
                Retake Practice Quiz
              </button>
            )}
          </div>
        )}

        {/* Tab 3: 3D Flip Flashcards */}
        {activeTab === 'FLASHCARDS' && (
          <div className="glass-card p-6 space-y-6 border-indigo-500/30 max-w-xl mx-auto text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 font-mono">
                Card {currentCardIndex + 1} of {flashcardDeck.length}
              </span>
              <span className="text-[10px] text-slate-400">Click card to flip</span>
            </div>

            {/* 3D Flip Card */}
            <div
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="h-64 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 border-2 border-indigo-500/40 p-6 flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-all hover:scale-102"
            >
              {!isCardFlipped ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
                    CONCEPT / QUESTION
                  </span>
                  <h3 className="text-base font-extrabold text-white leading-snug">
                    {flashcardDeck[currentCardIndex]?.frontConcept}
                  </h3>
                  <p className="text-[10px] text-slate-400 italic pt-2">Click to reveal answer &rarr;</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                    EXPLANATION / ANSWER
                  </span>
                  <p className="text-xs font-semibold text-emerald-200 leading-relaxed">
                    {flashcardDeck[currentCardIndex]?.backExplanation}
                  </p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : flashcardDeck.length - 1));
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => toggleFlashcardMastery(flashcardDeck[currentCardIndex].id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  flashcardDeck[currentCardIndex]?.mastered
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 size={14} />
                {flashcardDeck[currentCardIndex]?.mastered ? 'Mastered ✓' : 'Mark as Mastered'}
              </button>

              <button
                onClick={() => {
                  setIsCardFlipped(false);
                  setCurrentCardIndex(prev => (prev < flashcardDeck.length - 1 ? prev + 1 : 0));
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: 7-Day Spaced Repetition Revision Plan */}
        {activeTab === 'REVISION' && (
          <div className="glass-card p-6 space-y-4 border-emerald-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-400" />
                  7-Day Spaced Repetition Revision Schedule
                </h3>
                <p className="text-xs text-slate-400">Structured daily study roadmap for optimal exam retention</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studyKit.revisionPlan.map(day => (
                <div key={day.dayNumber} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-extrabold text-white">{day.dayLabel}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {day.estimatedMinutes} Mins
                    </span>
                  </div>

                  <p className="text-[11px] text-cyan-400 font-semibold">{day.focusArea}</p>

                  <div className="space-y-2">
                    {day.tasks.map((task, tIdx) => {
                      const taskKey = `day-${day.dayNumber}-task-${tIdx}`;
                      const isDone = !!completedTasks[taskKey];

                      return (
                        <label
                          key={tIdx}
                          onClick={() => toggleTaskCompletion(taskKey)}
                          className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}}
                            className="mt-0.5 accent-emerald-500"
                          />
                          <span className={isDone ? 'line-through text-slate-500' : ''}>{task}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

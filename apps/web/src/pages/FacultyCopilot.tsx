import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import {
  FacultyCopilotEngine,
  type FacultyQuizQuestion,
  type SubjectiveEvaluationResult,
  type GeneratedAssignment,
  type PPTSlideDeck,
} from '../lib/facultyCopilotEngine';
import {
  Briefcase,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  FileEdit,
  Presentation,
  Send,
  Plus,
  Zap,
  Download,
  Copy,
  Award,
  BookOpen,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Code,
} from 'lucide-react';

export const FacultyCopilot: React.FC = () => {
  const { currentRole } = useRole();
  const isStudent = currentRole === 'Student';

  const [activeTab, setActiveTab] = useState<'QUIZ' | 'EVALUATE' | 'ASSIGNMENT' | 'PPT'>('QUIZ');

  // 1. Quiz State
  const [quizTopic, setQuizTopic] = useState('Operating Systems - Deadlocks & Semaphores');
  const [quizDifficulty, setQuizDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [quizQuestions, setQuizQuestions] = useState<FacultyQuizQuestion[]>(
    FacultyCopilotEngine.generateTodaysQuiz(quizTopic, 3, quizDifficulty)
  );
  const [quizPublished, setQuizPublished] = useState(false);

  // 2. Subjective Answer Evaluator State
  const [evalQuestion, setEvalQuestion] = useState(
    'Explain the four Coffman conditions necessary for a deadlock to occur in an Operating System.'
  );
  const [evalStudentAnswer, setEvalStudentAnswer] = useState(
    'Deadlocks happen when processes get stuck waiting for each other. The four Coffman conditions are: 1. Mutual Exclusion (only one process uses resource at a time), 2. Hold and Wait (process holds resource while waiting for another), 3. No Preemption (resources cannot be stolen), 4. Circular Wait (processes form a loop of waiting). We use wait() and signal() semaphores to handle lock access.'
  );
  const [evalReferenceAnswer, setEvalReferenceAnswer] = useState(
    'A deadlock requires 4 simultaneous Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Banker\'s algorithm is used for deadlock avoidance using Need = Max - Allocation.'
  );
  const [evalResult, setEvalResult] = useState<SubjectiveEvaluationResult | null>(
    FacultyCopilotEngine.evaluateSubjectiveAnswer(evalQuestion, evalStudentAnswer, evalReferenceAnswer)
  );
  const [isEvaluating, setIsEvaluating] = useState(false);

  // 3. Assignment State
  const [asgTopic, setAsgTopic] = useState('System Design - Distributed Caching with Redis');
  const [asgTargetClass, setAsgTargetClass] = useState('B.Tech CSE 3rd Year');
  const [asgDueDate, setAsgDueDate] = useState('7 Days from today');
  const [assignment, setAssignment] = useState<GeneratedAssignment>(
    FacultyCopilotEngine.createAssignment(asgTopic, asgTargetClass, asgDueDate)
  );
  const [asgDispatched, setAsgDispatched] = useState(false);

  // 4. PPT State
  const [pptTopic, setPptTopic] = useState('Microservices Architecture & API Gateways');
  const [pptDeck, setPptDeck] = useState<PPTSlideDeck>(
    FacultyCopilotEngine.generatePPT(pptTopic, 4)
  );
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // Handlers
  const handleGenerateQuiz = () => {
    setQuizQuestions(FacultyCopilotEngine.generateTodaysQuiz(quizTopic, 3, quizDifficulty));
    setQuizPublished(false);
  };

  const handleEvaluateSubjective = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvalResult(FacultyCopilotEngine.evaluateSubjectiveAnswer(evalQuestion, evalStudentAnswer, evalReferenceAnswer));
    }, 1000);
  };

  const handleCreateAssignment = () => {
    setAssignment(FacultyCopilotEngine.createAssignment(asgTopic, asgTargetClass, asgDueDate));
    setAsgDispatched(false);
  };

  const handleGeneratePPT = () => {
    setPptDeck(FacultyCopilotEngine.generatePPT(pptTopic, 4));
    setCurrentSlideIdx(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 border-indigo-500/40 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-purple-950/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20">
                <Briefcase size={24} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
                  AI Faculty Copilot
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                    Teacher Automation Suite
                  </span>
                </h1>
                <p className="text-xs text-slate-300">Generate Quizzes &bull; Evaluate Subjective Answers &bull; Create Assignments &bull; Generate PPTs</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              FACULTY AI ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('QUIZ')}
          className={`px-4 py-2.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'QUIZ' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <HelpCircle size={14} />
          1. Generate Today's Quiz
        </button>
        <button
          onClick={() => setActiveTab('EVALUATE')}
          className={`px-4 py-2.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'EVALUATE' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Award size={14} />
          2. Evaluate Subjective Answers
        </button>
        <button
          onClick={() => setActiveTab('ASSIGNMENT')}
          className={`px-4 py-2.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'ASSIGNMENT' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <FileEdit size={14} />
          3. Create Assignment
        </button>
        <button
          onClick={() => setActiveTab('PPT')}
          className={`px-4 py-2.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'PPT' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Presentation size={14} />
          4. Generate PPT Slide Deck
        </button>
      </div>

      {/* Tab 1: Generate Today's Quiz */}
      {activeTab === 'QUIZ' && (
        <div className="glass-card p-6 space-y-6 border-indigo-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle size={16} className="text-indigo-400" />
                AI Daily Quiz Generator
              </h3>
              <p className="text-xs text-slate-400">Generate multi-question classroom quizzes with 1-click publishing</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={quizTopic}
                onChange={e => setQuizTopic(e.target.value)}
                placeholder="Quiz Topic..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/70"
              />
              <button
                onClick={handleGenerateQuiz}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Sparkles size={14} /> Generate Quiz
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{idx + 1}. {q.question}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Question #{idx + 1}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border text-xs ${
                        oIdx === q.correctOptionIndex
                          ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {opt} {oIdx === q.correctOptionIndex && '✓ (Correct Key)'}
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 italic">Explanation: {q.explanation}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">Target Class: <strong>B.Tech CSE (3rd Year)</strong></span>

            <button
              onClick={() => setQuizPublished(true)}
              disabled={quizPublished}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                quizPublished
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
              }`}
            >
              {quizPublished ? (
                <>
                  <CheckCircle2 size={15} /> Quiz Published to Student Portals ✓
                </>
              ) : (
                <>
                  <Send size={15} /> Publish Quiz to Live Student Portals &rarr;
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Evaluate Subjective Answers */}
      {activeTab === 'EVALUATE' && (
        <div className="glass-card p-6 space-y-6 border-purple-500/30">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award size={16} className="text-purple-400" />
              AI Subjective Answer Grader & Rubric Evaluator
            </h3>
            <p className="text-xs text-slate-400">Paste student written paragraph/essay answers for instant AI grading & detailed feedback</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Exam Question:</label>
                <textarea
                  value={evalQuestion}
                  onChange={e => setEvalQuestion(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-purple-500/70"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Student Written Answer (Raw Submission):</label>
                <textarea
                  value={evalStudentAnswer}
                  onChange={e => setEvalStudentAnswer(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-purple-500/70 font-mono leading-relaxed"
                />
              </div>

              <button
                onClick={handleEvaluateSubjective}
                disabled={isEvaluating}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {isEvaluating ? 'Evaluating Rubric & Content...' : 'Evaluate Answer & Calculate Grade \u2192'}
              </button>
            </div>

            {/* AI Evaluation Output */}
            {evalResult && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">AI Score</span>
                    <p className="text-2xl font-extrabold text-purple-400">{evalResult.score} / {evalResult.maxScore}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                    Grade {evalResult.grade} ({evalResult.percentage}%)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Key Strengths Identified:</span>
                  <ul className="space-y-1 pl-2 text-slate-300">
                    {evalResult.keyStrengths.map((str, idx) => (
                      <li key={idx}>✓ {str}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Missing Points for Full Marks:</span>
                  <ul className="space-y-1 pl-2 text-slate-300">
                    {evalResult.missingPoints.map((mp, idx) => (
                      <li key={idx}>⚠️ {mp}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
                  <strong className="text-white">Suggested Feedback for Student:</strong>
                  <p className="mt-1">{evalResult.suggestedFeedbackText}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Create Assignment */}
      {activeTab === 'ASSIGNMENT' && (
        <div className="glass-card p-6 space-y-6 border-cyan-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileEdit size={16} className="text-cyan-400" />
                AI Assignment Creator
              </h3>
              <p className="text-xs text-slate-400">Formulate course assignments with problem statements, deliverables, and rubric weights</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={asgTopic}
                onChange={e => setAsgTopic(e.target.value)}
                placeholder="Assignment Topic..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500/70"
              />
              <button
                onClick={handleCreateAssignment}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Sparkles size={14} /> Create Assignment
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-white">{assignment.title}</h4>
                <p className="text-[10px] text-slate-400">Target Class: <strong className="text-slate-200">{assignment.targetClass}</strong> &bull; Due: <strong className="text-cyan-400 font-mono">{assignment.dueDate}</strong></p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Max Marks: {assignment.maxMarks}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Problem Statement:</span>
              <p className="text-slate-200 leading-relaxed p-3 rounded-xl bg-slate-900 border border-slate-800">
                {assignment.problemStatement}
              </p>
            </div>

            {assignment.starterCodeSnippet && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <Code size={12} /> Starter Code Hint:
                </span>
                <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                  {assignment.starterCodeSnippet}
                </pre>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grading Rubric Breakdown:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {assignment.rubricBreakdown.map((rb, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">{rb.criteria}</span>
                    <strong className="text-cyan-400 font-mono">{rb.weight}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => setAsgDispatched(true)}
              disabled={asgDispatched}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                asgDispatched
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
              }`}
            >
              {asgDispatched ? (
                <>
                  <CheckCircle2 size={15} /> Assignment Dispatched to Class Portal ✓
                </>
              ) : (
                <>
                  <Send size={15} /> Dispatch Assignment to B.Tech CSE Class &rarr;
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Generate PPT Slide Deck */}
      {activeTab === 'PPT' && (
        <div className="glass-card p-6 space-y-6 border-emerald-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Presentation size={16} className="text-emerald-400" />
                AI Presentation Slide Deck Generator (PPT)
              </h3>
              <p className="text-xs text-slate-400">Generate structured presentation decks with speaker notes and PowerPoint exports</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pptTopic}
                onChange={e => setPptTopic(e.target.value)}
                placeholder="Lecture PPT Topic..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500/70"
              />
              <button
                onClick={handleGeneratePPT}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Sparkles size={14} /> Generate PPT
              </button>
            </div>
          </div>

          {/* Interactive Slide Viewer */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono font-bold text-white">{pptDeck.title}</span>
              <span>Slide {currentSlideIdx + 1} of {pptDeck.slides.length}</span>
            </div>

            <div className="h-72 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/40 p-6 flex flex-col justify-between shadow-2xl">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                  SLIDE {pptDeck.slides[currentSlideIdx]?.slideNumber}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {pptDeck.slides[currentSlideIdx]?.heading}
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-200 pl-2">
                  {pptDeck.slides[currentSlideIdx]?.bulletPoints.map((bp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                <strong className="text-emerald-400">Speaker Notes: </strong> {pptDeck.slides[currentSlideIdx]?.speakerNotes}
              </div>
            </div>

            {/* Slide Navigation & Export */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrentSlideIdx(prev => (prev > 0 ? prev - 1 : pptDeck.slides.length - 1))}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => alert("PowerPoint Slide Deck (.pptx) exported successfully!")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Download size={15} /> Download PowerPoint (.pptx) &rarr;
              </button>

              <button
                onClick={() => setCurrentSlideIdx(prev => (prev < pptDeck.slides.length - 1 ? prev + 1 : 0))}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

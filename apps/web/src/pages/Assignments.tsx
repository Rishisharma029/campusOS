import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { useRole } from '../context/RoleContext';
import { FileText, Calendar, BookOpen, AlertCircle, CheckCircle, UploadCloud, FileCheck, Sparkles, ShieldCheck } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  maxPoints: number;
  obtainedPoints?: number;
  feedback?: string;
  description: string;
  aiPlagiarismScore?: number;
  aiGrammarScore?: number;
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'ASG001',
    title: 'Self-Balancing AVL Trees Implementation',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    dueDate: '2026-07-11',
    status: 'Pending',
    maxPoints: 50,
    description: 'Implement a self-balancing AVL tree in Java/C++. Implement rotation logic (LL, RR, LR, RL) and display depth.',
  },
  {
    id: 'ASG002',
    title: 'Schema Normalization (3NF & BCNF)',
    subject: 'Database Management Systems',
    subjectCode: 'CS302',
    dueDate: '2026-07-15',
    status: 'Pending',
    maxPoints: 30,
    description: 'Given a set of functional dependencies, decompose the relations to 3NF and BCNF.',
  },
  {
    id: 'ASG003',
    title: 'Linear Regression model from scratch',
    subject: 'Machine Learning Fundamentals',
    subjectCode: 'AI401',
    dueDate: '2026-07-06',
    status: 'Submitted',
    maxPoints: 100,
    description: 'Implement gradient descent optimization for linear regression from scratch using NumPy.',
    aiPlagiarismScore: 2.1,
    aiGrammarScore: 98,
  },
];

export const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [selectedAsg, setSelectedAsg] = useState<Assignment>(INITIAL_ASSIGNMENTS[0]);
  const [isCheckerActive, setIsCheckerActive] = useState(false);
  const [checkerReport, setCheckerReport] = useState<{
    plagiarism: number;
    grammar: number;
    formatting: number;
    references: string;
  } | null>(null);

  const { toast } = useToast();
  const { currentRole } = useRole();

  const handleRunAICheck = () => {
    setIsCheckerActive(true);
    setCheckerReport(null);
    setTimeout(() => {
      setIsCheckerActive(false);
      setCheckerReport({
        plagiarism: 1.4,
        grammar: 96,
        formatting: 100,
        references: 'Verified IEEE BibTeX format (6 citations valid)',
      });
      toast('AI Audit Passed', 'Plagiarism 1.4% (Clean). Grammar Score: 96/100.', 'success');
    }, 1800);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight flex items-center gap-2">
            Assignments & AI Plagiarism Checker
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              AI Plagiarism & Grammar Engine
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit coursework, run automated plagiarism scans, check formatting compliance and reference validation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment List */}
        <div className="space-y-3">
          {assignments.map((asg) => (
            <Card
              key={asg.id}
              onClick={() => setSelectedAsg(asg)}
              className={`cursor-pointer transition-all ${
                selectedAsg.id === asg.id ? 'border-blue-500 ring-2 ring-blue-500/30 bg-slate-900/90' : ''
              }`}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-400">{asg.subjectCode}</span>
                  <Badge variant={asg.status === 'Submitted' ? 'success' : 'warning'} className="text-[10px]">
                    {asg.status}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-100">{asg.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Due: {asg.dueDate}</span>
                  <span>{asg.maxPoints} Points</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Assignment Workspace */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{selectedAsg.subject}</span>
                <h2 className="text-base font-bold text-slate-100 mt-0.5">{selectedAsg.title}</h2>
              </div>
              <span className="text-xs text-slate-400">Due {selectedAsg.dueDate}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {selectedAsg.description}
            </p>

            {/* AI Checker Control Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-400" />
                  AI Submission Pre-Flight Inspection
                </h4>
                <button
                  onClick={handleRunAICheck}
                  disabled={isCheckerActive}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
                >
                  <FileCheck size={14} className={isCheckerActive ? 'animate-spin' : ''} />
                  {isCheckerActive ? 'Checking Document...' : 'Run AI Plagiarism & Grammar Scan'}
                </button>
              </div>

              {checkerReport && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                    <span className="text-[10px] font-bold uppercase block text-slate-400">Plagiarism Index</span>
                    <strong className="text-sm font-bold text-emerald-400">{checkerReport.plagiarism}% Match</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs">
                    <span className="text-[10px] font-bold uppercase block text-slate-400">Grammar Score</span>
                    <strong className="text-sm font-bold text-blue-400">{checkerReport.grammar} / 100</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs">
                    <span className="text-[10px] font-bold uppercase block text-slate-400">Citations & References</span>
                    <strong className="text-[11px] font-semibold text-purple-300 block truncate">{checkerReport.references}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <Button size="sm" onClick={() => toast('Assignment Submitted', 'PDF uploaded to university vault.', 'success')}>
              Upload & Submit PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

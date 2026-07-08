import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { useRole } from '../context/RoleContext';
import { FileText, Calendar, BookOpen, AlertCircle, CheckCircle, UploadCloud, FileCheck } from 'lucide-react';

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
    description: 'Implement a self-balancing AVL tree in Java/C++. Implement rotation logic (LL, RR, LR, RL) and display depth. Include a short PDF design document.'
  },
  {
    id: 'ASG002',
    title: 'Schema Normalization (3NF & BCNF)',
    subject: 'Database Management Systems',
    subjectCode: 'CS302',
    dueDate: '2026-07-15',
    status: 'Pending',
    maxPoints: 30,
    description: 'Given a set of functional dependencies, decompose the relations to 3NF and BCNF. Provide step-by-step mathematical proofs for lossy/lossless joins.'
  },
  {
    id: 'ASG003',
    title: 'Linear Regression model from scratch',
    subject: 'Machine Learning Fundamentals',
    subjectCode: 'AI401',
    dueDate: '2026-07-06',
    status: 'Submitted',
    maxPoints: 100,
    description: 'Implement gradient descent optimization for linear regression from scratch using NumPy. Plot cost convergence and test on the housing price dataset.'
  },
  {
    id: 'ASG004',
    title: 'Research Paper Abstract & BibTeX citations',
    subject: 'Technical Writing',
    subjectCode: 'HU301',
    dueDate: '2026-07-04',
    status: 'Graded',
    maxPoints: 20,
    obtainedPoints: 18,
    feedback: 'Excellent summary of the thesis. Ensure BibTeX citation formats follow strict IEEE guidelines in your next report.',
    description: 'Write a 250-word scientific abstract summarizing your semester project. Include 3 BibTeX citation sources.'
  }
];

export const Assignments: React.FC = () => {
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Submitted' | 'Graded'>('All');
  
  // Submit modal states
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileName, setFileName] = useState('');

  const filtered = assignments.filter(asg => {
    if (filter === 'All') return true;
    return asg.status === filter;
  });

  const handleOpenSubmit = (asg: Assignment) => {
    setSelectedAsg(asg);
    setSubmissionText('');
    setFileName('');
  };

  const handleCloseSubmit = () => {
    setSelectedAsg(null);
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsg) return;

    // Simulate submission saving
    setAssignments(prev => prev.map(asg => {
      if (asg.id === selectedAsg.id) {
        return { ...asg, status: 'Submitted' };
      }
      return asg;
    }));

    toast(
      'Assignment Submitted',
      `Your submission for "${selectedAsg.title}" was recorded successfully.`,
      'success'
    );
    handleCloseSubmit();
  };

  const handleSimulateFileSelect = () => {
    setFileName('solution_attachment.pdf');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
            Assignments Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit coursework tasks, check due dates, and review faculty grading feedback.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          {(['All', 'Pending', 'Submitted', 'Graded'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Assignments List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {filtered.length > 0 ? (
            filtered.map(asg => (
              <Card key={asg.id} className="border border-slate-150 dark:border-slate-800/80 hover:shadow-premium transition-all">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {asg.subjectCode}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-40 font-medium">{asg.subject}</span>
                    </div>

                    <Badge
                      variant={
                        asg.status === 'Pending'
                          ? 'warning'
                          : asg.status === 'Submitted'
                          ? 'primary'
                          : 'success'
                      }
                      className="text-[9px] py-0 px-2 font-semibold"
                    >
                      {asg.status}
                    </Badge>
                  </div>

                  <CardTitle className="text-sm font-bold font-display mt-2 leading-snug">
                    {asg.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-0 flex flex-col gap-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
                    {asg.description}
                  </p>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>Due: <strong className="text-slate-700 dark:text-slate-300">{asg.dueDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={13} className="text-slate-400" />
                        <span>Weight: <strong className="text-slate-700 dark:text-slate-300">{asg.maxPoints} pts</strong></span>
                      </div>
                    </div>

                    {asg.status === 'Pending' && currentRole === 'Student' && (
                      <Button
                        size="sm"
                        onClick={() => handleOpenSubmit(asg)}
                        className="h-8 font-semibold text-xs cursor-pointer flex items-center gap-1"
                      >
                        <UploadCloud size={13} /> Submit Assignment
                      </Button>
                    )}

                    {asg.status === 'Submitted' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                        <CheckCircle size={14} /> Submitted & Awaiting Grade
                      </span>
                    )}

                    {asg.status === 'Graded' && (
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-500 mr-2">Score:</span>
                        <strong className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-200/40">
                          {asg.obtainedPoints} / {asg.maxPoints}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Feedback Box */}
                  {asg.feedback && (
                    <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] flex gap-2">
                      <FileCheck size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 dark:text-slate-350 block mb-0.5">Faculty Feedback:</strong>
                        <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{asg.feedback}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
              <AlertCircle size={24} className="text-slate-300" />
              <span>No assignments match the selected filter.</span>
            </Card>
          )}
        </div>

        {/* Sidebar Summary Info */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/80 dark:bg-slate-850/20 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">COMPLETION</span>
                  <strong className="text-xl font-bold font-display text-slate-800 dark:text-slate-200">
                    {Math.round((assignments.filter(a => a.status !== 'Pending').length / assignments.length) * 100)}%
                  </strong>
                </div>
                <div className="bg-slate-50/80 dark:bg-slate-850/20 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">TOTAL SCORING</span>
                  <strong className="text-xl font-bold font-display text-slate-800 dark:text-slate-200">
                    {assignments.reduce((sum, a) => sum + (a.obtainedPoints || 0), 0)} pts
                  </strong>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-2 mt-2 leading-relaxed">
                <div className="flex justify-between items-center">
                  <span>Graded Tasks</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {assignments.filter(a => a.status === 'Graded').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Tasks</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {assignments.filter(a => a.status === 'Pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Performance</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    90% (Grade: A)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Submission Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-500 leading-relaxed space-y-2">
              <p>1. Attachments must be submitted in PDF or ZIP format (max file size 16MB).</p>
              <p>2. Submissions are timestamped immediately. Late submissions are subject to a 10% penalty per day.</p>
              <p>3. Plagiarism scans run automatically upon upload. Ensure proper citation formatting is followed.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submission Modal */}
      {selectedAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                  Upload: {selectedAsg.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Subject: {selectedAsg.subject} ({selectedAsg.subjectCode})
                </span>
              </div>
              <button 
                onClick={handleCloseSubmit} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment}>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Written Solution / Notes (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter details about your submission, repository URLs, or any other notes for the faculty..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Solution Attachment (PDF/ZIP)
                  </label>
                  
                  {fileName ? (
                    <div className="border border-emerald-200 dark:border-emerald-950/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-3 rounded-lg flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <FileText size={14} /> {fileName}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setFileName('')} 
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSimulateFileSelect}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 p-6 rounded-lg text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <UploadCloud size={24} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">
                        Click to upload solution file
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PDF, ZIP, or DOCX formats accepted (max 16MB)
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button" 
                  onClick={handleCloseSubmit} 
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  type="submit" 
                  disabled={!fileName && !submissionText} 
                  className="cursor-pointer"
                >
                  Confirm Submission
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

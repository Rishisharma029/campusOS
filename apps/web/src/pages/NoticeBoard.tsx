import React, { useState } from 'react';
import { Bell, Sparkles, Filter, Tag, CheckCircle2, Pin } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  category: 'Department' | 'Semester' | 'Course' | 'General';
  target: string;
  date: string;
  pinned: boolean;
  rawText: string;
  aiSummary: string;
}

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n-101',
    title: 'Final Semester Project Submission Deadline Extended',
    category: 'Semester',
    target: 'Semester 8 All Departments',
    date: 'Today, 10:30 AM',
    pinned: true,
    rawText: 'All final year undergraduate students are hereby informed that due to upcoming national hackathon participation, the capstone project report submission date is extended from Oct 15 to Oct 22, 2026. Please ensure soft copies are uploaded to the Student Portal document vault.',
    aiSummary: 'Capstone project report submission extended to Oct 22, 2026. Upload soft copy to portal.',
  },
  {
    id: 'n-102',
    title: 'AI & Cloud Infrastructure Workshop by Industry Experts',
    category: 'Department',
    target: 'Computer Science & IT',
    date: 'Yesterday',
    pinned: false,
    rawText: 'Department of CSE is hosting a 2-day hands-on workshop on Kubernetes, Distributed Systems, and Large Language Model fine-tuning. Registration is free for enrolled CSE/IT students.',
    aiSummary: 'Free 2-day Kubernetes & LLM Workshop for CSE/IT students. Register via portal.',
  },
  {
    id: 'n-103',
    title: 'Mid-Semester Examination Time Table Published',
    category: 'Course',
    target: 'B.Tech All Courses',
    date: '3 days ago',
    pinned: false,
    rawText: 'The official schedule for October Mid-Semester examinations has been finalized. Morning shift starts at 09:30 AM and Evening shift at 02:00 PM. Admit cards can be downloaded from Examinations section.',
    aiSummary: 'Mid-Semester Exam schedule live. Morning: 9:30 AM, Evening: 2:00 PM. Download admit cards.',
  },
];

export const NoticeBoard: React.FC = () => {
  const [notices] = useState<Notice[]>(INITIAL_NOTICES);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedNotice, setSelectedNotice] = useState<Notice>(INITIAL_NOTICES[0]);

  const filteredNotices = filterCategory === 'All'
    ? notices
    : notices.filter(n => n.category === filterCategory);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="text-amber-400" size={26} />
            Smart AI Notice Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Department-specific and course-targeted notices with instant AI summarization.
          </p>
        </div>

        {/* Filter Pill */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {['All', 'Department', 'Semester', 'Course'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterCategory === cat ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notice List */}
        <div className="space-y-3">
          {filteredNotices.map(notice => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                selectedNotice.id === notice.id
                  ? 'bg-slate-800/90 border-amber-500/50 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {notice.category}
                </span>
                {notice.pinned && <Pin size={14} className="text-amber-400" />}
              </div>
              <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{notice.title}</h4>
              <span className="text-[10px] text-slate-400 block mt-1">{notice.target} &bull; {notice.date}</span>
            </div>
          ))}
        </div>

        {/* Selected Notice Detail & AI Summary */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedNotice.category} Notice</span>
                <h2 className="text-lg font-bold text-slate-100 mt-0.5">{selectedNotice.title}</h2>
              </div>
              <span className="text-xs text-slate-400">{selectedNotice.date}</span>
            </div>

            {/* AI Summary Box */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles size={14} />
                AI Bullet Summary
              </span>
              <p className="text-xs text-amber-200/90 font-medium">{selectedNotice.aiSummary}</p>
            </div>

            {/* Full Original Text */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Full Official Notice</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {selectedNotice.rawText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

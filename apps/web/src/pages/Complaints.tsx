import React, { useState } from 'react';
import { LifeBuoy, Plus, Sparkles, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface Ticket {
  id: string;
  category: 'Electricity' | 'Hostel' | 'Faculty' | 'Infrastructure';
  subject: string;
  description: string;
  anonymous: boolean;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  aiCategoryTag: string;
  date: string;
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TK-408',
    category: 'Electricity',
    subject: 'Main AC Unit trip in Computer Lab 3',
    description: 'The server rack power supply tripped twice during practical exams.',
    anonymous: false,
    priority: 'High',
    status: 'In Progress',
    aiCategoryTag: 'Infrastructure / Power Grid',
    date: '2 hours ago',
  },
  {
    id: 'TK-409',
    category: 'Hostel',
    subject: 'Hot water geyser not working in Room 304',
    description: '3rd floor bathroom geyser heating element requires replacement.',
    anonymous: true,
    priority: 'Medium',
    status: 'Open',
    aiCategoryTag: 'Hostel Maintenance',
    date: 'Yesterday',
  },
];

export const Complaints: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [showModal, setShowModal] = useState(false);

  const [category, setCategory] = useState<Ticket['category']>('Infrastructure');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    const newTicket: Ticket = {
      id: `TK-${Math.floor(100 + Math.random() * 900)}`,
      category,
      subject,
      description,
      anonymous,
      priority: description.toLowerCase().includes('urgent') || description.toLowerCase().includes('power') ? 'High' : 'Medium',
      status: 'Open',
      aiCategoryTag: `${category} Auto-Route`,
      date: 'Just now',
    };

    setTickets([newTicket, ...tickets]);
    setShowModal(false);
    setSubject('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <LifeBuoy className="text-cyan-400" size={26} />
            Smart Complaint & Ticket Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submit anonymous or tracked grievances. AI classifies priority and dispatches to maintenance teams.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all self-start"
        >
          <Plus size={16} />
          New Complaint Ticket
        </button>
      </div>

      {/* Ticket List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{ticket.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {ticket.category}
                </span>
                {ticket.anonymous && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Shield size={10} />
                    Anonymous
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ticket.status === 'Open' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {ticket.status}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-100">{ticket.subject}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{ticket.description}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <Sparkles size={11} />
                {ticket.aiCategoryTag}
              </span>
              <span>{ticket.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Lodge Complaint Ticket</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                >
                  <option value="Electricity">Electricity & Power</option>
                  <option value="Hostel">Hostel Maintenance</option>
                  <option value="Faculty">Faculty Feedback</option>
                  <option value="Infrastructure">Infrastructure & Labs</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Brief title..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain problem clearly..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anon"
                  checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800"
                />
                <label htmlFor="anon" className="text-slate-300 cursor-pointer">Submit Anonymously (Identity protected by encryption)</label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

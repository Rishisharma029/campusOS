import React, { useState } from 'react';
import { Trophy, Award, Flame, Users, Calendar, Sparkles, CheckCircle2, Star, Zap } from 'lucide-react';

interface Club {
  id: string;
  name: string;
  category: string;
  members: number;
  lead: string;
  description: string;
  joined: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  badges: string[];
  streak: number;
}

export const ClubsAndEvents: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([
    { id: 'c-1', name: 'AI & Robotics Society', category: 'Technical', members: 142, lead: 'Dr. Sarah Jenkins', description: 'Building autonomous drones, humanoid robots & competing in RoboMaster.', joined: true },
    { id: 'c-2', name: 'CyberSecurity Guild', category: 'Technical', members: 98, lead: 'Prof. Alan Turing', description: 'Ethical hacking, CTF competitions, penetration testing lab sessions.', joined: false },
    { id: 'c-3', name: 'Code & Competitive Devs', category: 'Coding', members: 230, lead: 'Alex Mercer', description: 'Weekly LeetCode sprints, Hackathons, and Open Source contributions.', joined: true },
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Rishi Sharma', xp: 4850, level: 12, badges: ['🔥 30-Day Streak', '🏆 Hackathon Winner', '🧠 AI Wizard'], streak: 32 },
    { rank: 2, name: 'Ananya Roy', xp: 4200, level: 10, badges: ['⚡ 100% Attendance', '📜 Top Contributor'], streak: 21 },
    { rank: 3, name: 'Vikram Patel', xp: 3950, level: 9, badges: ['📚 Library Scholar', '🤖 Robot Builder'], streak: 14 },
  ]);

  const toggleJoin = (id: string) => {
    setClubs(prev => prev.map(c => c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="text-amber-400" size={26} />
            Campus Clubs, Gamification & XP Leaderboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Earn XP for attendance, hackathons, and assignments. Level up and unlock certificates!
          </p>
        </div>

        {/* User Streak & Level Card */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 p-3 rounded-2xl border border-amber-500/30">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
            <Flame size={18} className="animate-bounce" />
            <span>32-Day Streak</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="text-xs font-bold text-slate-200">
            <span>Level 12 Scholar</span>
            <span className="block text-[10px] text-amber-400">4,850 XP</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Star className="text-amber-400" size={18} />
          Global Campus Leaderboard (Top XP Achievers)
        </h3>
        <div className="space-y-2">
          {leaderboard.map(user => (
            <div
              key={user.rank}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                user.rank === 1
                  ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  user.rank === 1 ? 'bg-amber-500 text-black' : user.rank === 2 ? 'bg-slate-300 text-black' : 'bg-amber-800 text-white'
                }`}>
                  #{user.rank}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{user.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {user.badges.map((b, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="font-mono font-bold text-amber-400">{user.xp} XP</span>
                <span className="text-slate-400">Lvl {user.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Clubs Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Users className="text-blue-400" size={18} />
          Active Student Clubs & Societies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clubs.map(club => (
            <div key={club.id} className="glass-card p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {club.category}
                  </span>
                  <span className="text-xs text-slate-400">{club.members} Members</span>
                </div>
                <h4 className="text-base font-bold text-slate-100">{club.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{club.description}</p>
              </div>

              <button
                onClick={() => toggleJoin(club.id)}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                  club.joined
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                }`}
              >
                {club.joined ? 'Member (Joined)' : 'Join Club (+100 XP)'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

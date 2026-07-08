import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ChevronLeft, ChevronRight, Calendar, Bookmark, Briefcase, Award, Flag } from 'lucide-react';

interface AcademicEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'class' | 'exam' | 'placement' | 'holiday';
  time?: string;
  location?: string;
}

export const UnifiedCalendar: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['class', 'exam', 'placement', 'holiday']);
  const [selectedDateEvents, setSelectedDateEvents] = useState<AcademicEvent[]>([]);
  const [activeDateStr, setActiveDateStr] = useState<string>('2026-07-08');

  // Hardcoded academic events for July 2026
  const academicEvents: AcademicEvent[] = [
    { id: '1', title: 'Midterm Exam: Algorithms (CS-302)', date: '2026-07-10', category: 'exam', time: '10:00 AM - 01:00 PM', location: 'LHC-101' },
    { id: '2', title: 'Google placement recruitment drive', date: '2026-07-15', category: 'placement', time: '09:00 AM onwards', location: 'Main Seminar Hall' },
    { id: '3', title: 'Expert Lecture: DevOps Best Practices', date: '2026-07-08', category: 'class', time: '11:00 AM - 12:30 PM', location: 'LHC-204' },
    { id: '4', title: 'College Mess Review Committee meeting', date: '2026-07-08', category: 'class', time: '03:00 PM', location: 'Office Room 12' },
    { id: '5', title: 'Muharram Public Holiday', date: '2026-07-17', category: 'holiday', time: 'Full Day', location: 'Campus Closed' },
    { id: '6', title: 'Vercel Hackathon registrations cutoff', date: '2026-07-22', category: 'placement', time: '11:59 PM', location: 'Online portal' },
    { id: '7', title: 'End Semester Project Submissions', date: '2026-07-28', category: 'exam', time: '05:00 PM', location: 'Dept Lab 1' },
  ];

  const handleFilterToggle = (category: string) => {
    setSelectedFilters((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `2026-07-${day.toString().padStart(2, '0')}`;
    return academicEvents.filter(
      (e) => e.date === dateStr && selectedFilters.includes(e.category)
    );
  };

  const handleDayClick = (day: number) => {
    const dateStr = `2026-07-${day.toString().padStart(2, '0')}`;
    const dayEvents = academicEvents.filter((e) => e.date === dateStr);
    setSelectedDateEvents(dayEvents);
    setActiveDateStr(dateStr);
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'exam':
        return 'danger';
      case 'placement':
        return 'warning';
      case 'holiday':
        return 'success';
      default:
        return 'primary';
    }
  };

  // Generate July 2026 Calendar Grid cells
  // July 1, 2026 is a Wednesday (start day offset = 3)
  const totalDays = 31;
  const offset = 3;
  const gridCells = [];

  // Empty cells for offset
  for (let i = 0; i < offset; i++) {
    gridCells.push(<div key={`empty-${i}`} className="min-h-[80px] bg-slate-50/20 dark:bg-slate-900/5 border border-main/50" />);
  }

  // Days of the month
  for (let d = 1; d <= totalDays; d++) {
    const events = getEventsForDay(d);
    const dateStr = `2026-07-${d.toString().padStart(2, '0')}`;
    const isActive = activeDateStr === dateStr;

    gridCells.push(
      <div
        key={`day-${d}`}
        onClick={() => handleDayClick(d)}
        className={`min-h-[80px] p-2 border border-main flex flex-col justify-between hover:bg-surface-hover/80 transition-colors cursor-pointer relative bg-surface ${
          isActive ? 'ring-2 ring-primary ring-inset z-10' : ''
        }`}
      >
        <span className={`text-xs font-bold font-display ${isActive ? 'text-primary' : 'text-slate-700 dark:text-slate-350'}`}>
          {d}
        </span>
        
        {/* Event dots indicator */}
        <div className="flex gap-1 flex-wrap mt-2.5">
          {events.map((e) => (
            <span
              key={e.id}
              className={`w-1.5 h-1.5 rounded-full ${
                e.category === 'exam'
                  ? 'bg-danger'
                  : e.category === 'placement'
                  ? 'bg-warning'
                  : e.category === 'holiday'
                  ? 'bg-success'
                  : 'bg-primary'
              }`}
              title={e.title}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Unified Academic Calendar
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Consolidated schedules, midterm evaluations, holidays, and campus placement drives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Calendar Grid Controller */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Calendar Header Month selector */}
          <div className="flex items-center justify-between p-3.5 bg-surface border border-main rounded-xl shadow-premium">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <h2 className="text-sm font-bold font-display text-slate-800 dark:text-slate-200">
                July 2026
              </h2>
            </div>
            <div className="flex gap-1.5">
              <button className="p-1 rounded-md border border-main hover:bg-surface-hover text-slate-400"><ChevronLeft size={16} /></button>
              <button className="p-1 rounded-md border border-main hover:bg-surface-hover text-slate-400"><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month Cell Grid */}
          <div className="grid grid-cols-7 border border-main rounded-2xl overflow-hidden shadow-premium bg-surface divide-y divide-x divide-main">
            {gridCells}
          </div>

        </div>

        {/* Sidebar Filters & Agenda Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Category Filters */}
          <Card className="shadow-premium border border-main bg-surface">
            <div className="p-3.5 border-b border-main">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
                Filter Event Types
              </h3>
            </div>
            <CardContent className="p-3.5 space-y-2">
              <button
                onClick={() => handleFilterToggle('class')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedFilters.includes('class')
                    ? 'bg-blue-50/40 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400'
                    : 'border-main text-slate-400 bg-surface'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Bookmark size={13} /> Lecture Slots
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              </button>

              <button
                onClick={() => handleFilterToggle('exam')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedFilters.includes('exam')
                    ? 'bg-red-50/40 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400'
                    : 'border-main text-slate-400 bg-surface'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Award size={13} /> Midterms & Exams
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              </button>

              <button
                onClick={() => handleFilterToggle('placement')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedFilters.includes('placement')
                    ? 'bg-amber-50/40 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400'
                    : 'border-main text-slate-400 bg-surface'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Briefcase size={13} /> Placement Drives
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              </button>

              <button
                onClick={() => handleFilterToggle('holiday')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedFilters.includes('holiday')
                    ? 'bg-emerald-50/40 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400'
                    : 'border-main text-slate-400 bg-surface'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Flag size={13} /> Campus Holidays
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </button>
            </CardContent>
          </Card>

          {/* Day Agenda Details Card */}
          <Card className="shadow-premium border border-main bg-surface">
            <div className="p-3.5 border-b border-main">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
                Agenda for {new Date(activeDateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>
            <CardContent className="p-3.5 space-y-3.5">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((e) => (
                  <div key={e.id} className="p-3 border border-main rounded-xl bg-slate-50/50 dark:bg-slate-900/5 space-y-1.5">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200 leading-tight">
                        {e.title}
                      </span>
                      <Badge variant={getEventsForDay(parseInt(e.date.split('-')[2])).length > 0 ? getCategoryBadgeColor(e.category) : 'secondary'} className="shrink-0">
                        {e.category}
                      </Badge>
                    </div>
                    {e.time && (
                      <p className="text-[9px] text-slate-450 font-medium">Time: {e.time}</p>
                    )}
                    {e.location && (
                      <p className="text-[9px] text-slate-450 font-medium">Venue: {e.location}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-[10px] text-slate-400 font-medium">
                  No events listed for this date. Click on a calendar date cell to verify schedules.
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
};

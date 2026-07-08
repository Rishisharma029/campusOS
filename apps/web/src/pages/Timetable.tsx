import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Clock, MapPin, User } from 'lucide-react';

interface ClassSchedule {
  subject: string;
  code: string;
  faculty: string;
  room: string;
  time: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

const TIMETABLE: Record<string, ClassSchedule[]> = {
  Monday: [
    { subject: 'Data Structures and Algorithms', code: 'CS301', faculty: 'Dr. Arindam Sen', room: 'LHC-101', time: '09:00 AM - 10:30 AM', type: 'Lecture' },
    { subject: 'Database Management Systems', code: 'CS302', faculty: 'Prof. Rajesh K. Mehta', room: 'LHC-102', time: '11:00 AM - 12:30 PM', type: 'Lecture' },
    { subject: 'Digital Communications Lab', code: 'EC308', faculty: 'Prof. Meera Deshmukh', room: 'Lab Block-4', time: '01:30 PM - 03:30 PM', type: 'Lab' },
  ],
  Tuesday: [
    { subject: 'Theory of Computation', code: 'CS303', faculty: 'Dr. Vikrant Singh', room: 'LHC-201', time: '09:00 AM - 10:30 AM', type: 'Lecture' },
    { subject: 'Data Structures Lab', code: 'CS307', faculty: 'Dr. Arindam Sen', room: 'Computing Lab-2', time: '11:00 AM - 01:00 PM', type: 'Lab' },
    { subject: 'Technical Writing', code: 'HU301', faculty: 'Prof. Sarah Thomas', room: 'LHC-103', time: '02:00 PM - 03:30 PM', type: 'Tutorial' },
  ],
  Wednesday: [
    { subject: 'Data Structures and Algorithms', code: 'CS301', faculty: 'Dr. Arindam Sen', room: 'LHC-101', time: '09:00 AM - 10:30 AM', type: 'Lecture' },
    { subject: 'Database Management Systems', code: 'CS302', faculty: 'Prof. Rajesh K. Mehta', room: 'LHC-102', time: '11:00 AM - 12:30 PM', type: 'Lecture' },
    { subject: 'Machine Learning', code: 'AI401', faculty: 'Dr. Amit Patel', room: 'LHC-204', time: '02:00 PM - 03:30 PM', type: 'Lecture' },
  ],
  Thursday: [
    { subject: 'Theory of Computation', code: 'CS303', faculty: 'Dr. Vikrant Singh', room: 'LHC-201', time: '09:00 AM - 10:30 AM', type: 'Lecture' },
    { subject: 'Analog & Digital Electronics', code: 'EC301', faculty: 'Prof. Meera Deshmukh', room: 'LHC-104', time: '11:00 AM - 12:30 PM', type: 'Lecture' },
    { subject: 'Academic Mentoring Class', code: 'ME001', faculty: 'Dr. Vikram Rathore', room: 'LHC-101', time: '01:30 PM - 03:00 PM', type: 'Tutorial' },
  ],
  Friday: [
    { subject: 'Analog & Digital Electronics', code: 'EC301', faculty: 'Prof. Meera Deshmukh', room: 'LHC-104', time: '09:00 AM - 10:30 AM', type: 'Lecture' },
    { subject: 'Database Systems Lab', code: 'CS308', faculty: 'Prof. Rajesh K. Mehta', room: 'Database Lab', time: '11:00 AM - 01:00 PM', type: 'Lab' },
    { subject: 'Guest Lecture Series', code: 'GL001', faculty: 'External Experts', room: 'Auditorium', time: '02:00 PM - 04:00 PM', type: 'Lecture' },
  ],
};

export const Timetable: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Timetable & Schedules
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          View weekly schedules, class assignments, teaching faculty, and classroom locations.
        </p>
      </div>

      {/* Week Timeline layout */}
      <div className="flex flex-col gap-6">
        {Object.entries(TIMETABLE).map(([day, slots]) => (
          <div key={day} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left Day Badge */}
            <div className="lg:col-span-2 pt-2.0">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-800 dark:text-slate-300">
                {day}
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">
                {slots.length} Classes scheduled
              </span>
            </div>

            {/* Slots timeline */}
            <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {slots.map((slot, idx) => (
                <Card key={idx} hoverable className="border border-slate-150 dark:border-slate-800/80">
                  <CardHeader className="p-4 flex items-center justify-between border-none">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                        {slot.code}
                      </span>
                      <span className="text-slate-300">•</span>
                      <Badge
                        variant={
                          slot.type === 'Lecture'
                            ? 'primary'
                            : slot.type === 'Lab'
                            ? 'success'
                            : 'warning'
                        }
                        className="text-[8px] py-0 px-1.5"
                      >
                        {slot.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0 flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-150 leading-snug">
                      {slot.subject}
                    </h4>

                    <div className="flex flex-col gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400 shrink-0" />
                        <span>{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-slate-400 shrink-0" />
                        <span>{slot.faculty}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{slot.room}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

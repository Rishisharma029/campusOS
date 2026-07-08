import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, AlertTriangle, UserCheck, ShieldAlert, Mail } from 'lucide-react';

export const AnalyticsHub: React.FC = () => {
  const { toast } = useToast();

  // Radar competency data comparing major departments
  const departmentCompetencies = [
    { subject: 'Placements Rate', CSE: 96, ECE: 88, ME: 72 },
    { subject: 'Avg CGPA', CSE: 82, ECE: 78, ME: 70 },
    { subject: 'Research Papers', CSE: 90, ECE: 85, ME: 60 },
    { subject: 'Student Satisfaction', CSE: 88, ECE: 80, ME: 85 },
    { subject: 'Faculty Density', CSE: 75, ECE: 82, ME: 90 },
    { subject: 'Lab Infrastructure', CSE: 92, ECE: 95, ME: 80 }
  ];

  // Donut placement sector split data
  const placementSectorData = [
    { name: 'Software Development', value: 124 },
    { name: 'Electronics & Core', value: 64 },
    { name: 'Consulting & Analytics', value: 48 },
    { name: 'Core Mech & Auto', value: 32 },
    { name: 'Logistics & Supply', value: 12 }
  ];

  const SECTOR_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Heatmap: Simulated attendance rates for the last 30 days
  const attendanceHeatmapData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // Generate simulated rates between 65% and 98%
    const rate = Math.floor(75 + Math.random() * 23);
    return { day, rate };
  });

  const getHeatmapColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-500 hover:bg-emerald-600 text-white';
    if (rate >= 80) return 'bg-emerald-400/80 hover:bg-emerald-500/80 text-white';
    if (rate >= 75) return 'bg-amber-400 hover:bg-amber-500 text-slate-900';
    return 'bg-red-400 hover:bg-red-500 text-white';
  };

  const handleSendMail = (studentName: string) => {
    toast('Warning Alert Dispatched', `Administrative alert successfully sent to ${studentName} and their parent.`, 'success');
  };

  const handleSendDuesSMS = (studentName: string) => {
    toast('Dues Warning Dispatched', `SMS & Email reminders dispatched for ${studentName}'s outstanding fees.`, 'info');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Advanced Analytics & AI Hub
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ML prediction engines, dropout risk evaluations, outstanding fee indicators, and competency indices.
        </p>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <Card className="shadow-premium border border-main bg-surface">
          <CardHeader className="p-4 border-b border-main">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
              Department Competency Radar Map
            </h3>
          </CardHeader>
          <CardContent className="h-[300px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={departmentCompetencies}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" style={{ fontSize: 9, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} style={{ fontSize: 8 }} />
                <Radar name="CSE Dept" dataKey="CSE" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} />
                <Radar name="ECE Dept" dataKey="ECE" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                <Radar name="ME Dept" dataKey="ME" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.25} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="shadow-premium border border-main bg-surface">
          <CardHeader className="p-4 border-b border-main">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
              Placement Sector Distro (Donut)
            </h3>
          </CardHeader>
          <CardContent className="h-[300px] p-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={placementSectorData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {placementSectorData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Heatmap Row & AI predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Heatmap grid */}
        <Card className="shadow-premium border border-main bg-surface lg:col-span-1">
          <CardHeader className="p-4 border-b border-main">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0">
              Roll Call Heatmap (Last 30 Days)
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-6 gap-2">
              {attendanceHeatmapData.map(d => (
                <div
                  key={d.day}
                  title={`Day ${d.day}: ${d.rate}% attendance rate`}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-all ${getHeatmapColor(d.rate)}`}
                >
                  <span>{d.day}</span>
                  <span className="text-[7px] font-normal opacity-80">{d.rate}%</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold border-t border-main pt-2">
              <span className="text-red-500 font-extrabold flex items-center gap-0.5">
                <AlertTriangle size={10} /> &lt;75% Risk
              </span>
              <span className="text-emerald-500 font-extrabold flex items-center gap-0.5">
                <UserCheck size={10} /> &gt;90% Ideal
              </span>
            </div>
          </CardContent>
        </Card>

        {/* AI Dropout predictions list */}
        <Card className="shadow-premium border border-main bg-surface lg:col-span-1">
          <CardHeader className="p-4 border-b border-main">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-red-500" /> AI Dropout Risk Predictor
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              
              <div className="p-3 border border-main rounded-xl flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/5">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-850 dark:text-slate-100 m-0">Rohan Mehta (CSE)</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">CGPA: 5.8 | Attendance: 68%</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 font-bold">84% Risk</span>
                  <button onClick={() => handleSendMail('Rohan Mehta')} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer" title="Send Alert">
                    <Mail size={12} />
                  </button>
                </div>
              </div>

              <div className="p-3 border border-main rounded-xl flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/5">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-850 dark:text-slate-100 m-0">Arjun Das (ME)</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">CGPA: 5.9 | Attendance: 70%</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 font-bold">78% Risk</span>
                  <button onClick={() => handleSendMail('Arjun Das')} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer" title="Send Alert">
                    <Mail size={12} />
                  </button>
                </div>
              </div>

              <div className="p-3 border border-main rounded-xl flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/5">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-850 dark:text-slate-100 m-0">Sneha Rao (ECE)</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">CGPA: 6.1 | Attendance: 72%</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 font-bold">62% Risk</span>
                  <button onClick={() => handleSendMail('Sneha Rao')} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer" title="Send Alert">
                    <Mail size={12} />
                  </button>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* AI Fee Default risk tracker */}
        <Card className="shadow-premium border border-main bg-surface lg:col-span-1">
          <CardHeader className="p-4 border-b border-main">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display m-0 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-amber-500" /> Fee Default Risk Models
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              
              <div className="p-3 border border-main rounded-xl flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/5">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-850 dark:text-slate-100 m-0">Kunal Verma (Account #42)</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Owed: ₹65,000 | Overdue: 45 Days</p>
                </div>
                <Button size="sm" className="h-7 text-[10px] px-2 flex items-center gap-1" onClick={() => handleSendDuesSMS('Kunal Verma')}>
                  <Mail size={11} /> Alert
                </Button>
              </div>

              <div className="p-3 border border-main rounded-xl flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/5">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-850 dark:text-slate-100 m-0">Priya Iyer (Account #102)</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Owed: ₹40,000 | Overdue: 35 Days</p>
                </div>
                <Button size="sm" className="h-7 text-[10px] px-2 flex items-center gap-1" onClick={() => handleSendDuesSMS('Priya Iyer')}>
                  <Mail size={11} /> Alert
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
};

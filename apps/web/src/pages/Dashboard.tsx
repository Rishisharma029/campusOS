import React from 'react';
import { useRole } from '../context/RoleContext';
import { useDatabase } from '../context/DatabaseContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  GraduationCap,
  Percent,
  IndianRupee,
  BookOpen,
  BookMarked,
  Clock,
  Calendar,
  Home,
  Bus,
} from 'lucide-react';

// Mock chart data matching Color System & Aesthetics
const admissionsData = [
  { name: '2021', CSE: 120, ECE: 90, ME: 60 },
  { name: '2022', CSE: 140, ECE: 85, ME: 55 },
  { name: '2023', CSE: 170, ECE: 95, ME: 65 },
  { name: '2024', CSE: 190, ECE: 110, ME: 70 },
  { name: '2025', CSE: 240, ECE: 120, ME: 75 },
];

const attendanceData = [
  { name: 'Mon', CSE: 95, ECE: 91, ME: 84 },
  { name: 'Tue', CSE: 93, ECE: 88, ME: 80 },
  { name: 'Wed', CSE: 96, ECE: 92, ME: 85 },
  { name: 'Thu', CSE: 91, ECE: 89, ME: 78 },
  { name: 'Fri', CSE: 94, ECE: 90, ME: 82 },
];

const revenueData = [
  { name: 'Jan', Fees: 4.5, Hostel: 1.2, Transport: 0.8 },
  { name: 'Feb', Fees: 3.8, Hostel: 1.0, Transport: 0.6 },
  { name: 'Mar', Fees: 5.2, Hostel: 1.5, Transport: 1.1 },
  { name: 'Apr', Fees: 2.1, Hostel: 0.8, Transport: 0.5 },
  { name: 'May', Fees: 8.5, Hostel: 2.4, Transport: 1.8 },
  { name: 'Jun', Fees: 7.2, Hostel: 2.0, Transport: 1.5 },
];

const placementPieData = [
  { name: 'Placed', value: 65 },
  { name: 'Applied/In Progress', value: 20 },
  { name: 'Preparing/Unapplied', value: 15 },
];

const departmentCompareData = [
  { name: 'CS', Students: 430, Faculty: 24 },
  { name: 'ECE', Students: 320, Faculty: 18 },
  { name: 'ME', Students: 180, Faculty: 12 },
  { name: 'IT', Students: 250, Faculty: 15 },
];

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const Dashboard: React.FC = () => {
  const { currentRole } = useRole();
  const { students, faculty, feeCollections } = useDatabase();

  // Calculations for Admin Widgets
  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const avgAttendance = (students.reduce((acc, curr) => acc + curr.attendanceRate, 0) / totalStudents).toFixed(1);
  const totalFeeCollected = feeCollections.reduce((acc, curr) => acc + curr.amountPaid, 0);

  // Dynamic layout rendering based on currentRole
  const renderWidgets = () => {
    switch (currentRole) {
      case 'Admin':
        return (
          <>
            {/* Student Count Widget */}
            <Card hoverable className="relative overflow-hidden">
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Users size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Students</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{totalStudents}</h3>
                </div>
              </CardContent>
            </Card>

            {/* Faculty Count Widget */}
            <Card hoverable className="relative overflow-hidden">
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Faculty</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{totalFaculty}</h3>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Rate Widget */}
            <Card hoverable className="relative overflow-hidden">
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-450">
                  <Percent size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg. Attendance</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{avgAttendance}%</h3>
                </div>
              </CardContent>
            </Card>

            {/* Fee Collection Widget */}
            <Card hoverable className="relative overflow-hidden">
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-450">
                  <IndianRupee size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fees Collected</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">₹{totalFeeCollected.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 'Student':
        const studentInfo = students[0]; // Aaron
        return (
          <>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Percent size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">My Attendance</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{studentInfo.attendanceRate}%</h3>
                </div>
              </CardContent>
            </Card>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">My CGPA</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{studentInfo.cgpa} / 10.0</h3>
                </div>
              </CardContent>
            </Card>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-450">
                  <IndianRupee size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fees Outstanding</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">₹{(studentInfo.feeTotal - studentInfo.feePaid).toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-450">
                  <BookMarked size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hostel Room</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{studentInfo.hostelRoom}</h3>
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 'Faculty':
        return (
          <>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Clock size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weekly Load Hours</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">14 Hours</h3>
                </div>
              </CardContent>
            </Card>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <Users size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Students</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">120 Students</h3>
                </div>
              </CardContent>
            </Card>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-450">
                  <Calendar size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Classes Scheduled Today</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">3 Classes</h3>
                </div>
              </CardContent>
            </Card>
          </>
        );

      default:
        // Generic fallback for smaller roles
        return (
          <>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Users size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ERP Users Active</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">45 Online</h3>
                </div>
              </CardContent>
            </Card>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <BookOpen size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Courses</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">12 Courses</h3>
                </div>
              </CardContent>
            </Card>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-450">
                  <Home size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hostel Occupancy</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">84% Filled</h3>
                </div>
              </CardContent>
            </Card>
            <Card hoverable>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-450">
                  <Bus size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Bus Fleet</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">8 Buses</h3>
                </div>
              </CardContent>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          Welcome back, {currentRole} Portal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Here is your high-level overview of the college database and active metrics for today.
        </p>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {renderWidgets()}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Admissions trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Admissions Trend</CardTitle>
              <CardDescription>Student intakes grouped by major branches (CSE, ECE, ME) over past 5 years</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={admissionsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="CSE" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="ECE" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ME" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Placements Ratio */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Placement Metrics</CardTitle>
              <CardDescription>Final year graduation statuses</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={placementPieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {placementPieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Weekly Attendance Area Chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Average daily roll call rate (%) by department</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorCSE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorECE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[70, 100]} stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="CSE" stroke="#2563EB" fillOpacity={1} fill="url(#colorCSE)" strokeWidth={2} />
                <Area type="monotone" dataKey="ECE" stroke="#10B981" fillOpacity={1} fill="url(#colorECE)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Department Comparison Bar Chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Department Breakdown</CardTitle>
              <CardDescription>Comparing Students and Faculty capacities</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentCompareData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Students" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Faculty" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Chart 5: Revenue Streams (Admin/Accountant specific) */}
      {(currentRole === 'Admin' || currentRole === 'Accountant') && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Revenue Collections Trend</CardTitle>
              <CardDescription>Earnings split by Fees, Hostels, and Transport over past 6 months (Lakhs INR)</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Fees" stackId="a" fill="#2563EB" />
                <Bar dataKey="Hostel" stackId="a" fill="#10B981" />
                <Bar dataKey="Transport" stackId="a" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

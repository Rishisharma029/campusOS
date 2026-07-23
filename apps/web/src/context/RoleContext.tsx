import React, { createContext, useContext, useState } from 'react';

export type UserRole =
  | 'Admin'
  | 'Student'
  | 'Faculty'
  | 'Parent'
  | 'Accountant'
  | 'Librarian'
  | 'Placement Cell'
  | 'Hostel Warden'
  | 'Transport Manager';

export interface ModuleInfo {
  name: string;
  path: string;
  icon: string;
}

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  allowedModules: ModuleInfo[];
  allRoles: UserRole[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const allRoles: UserRole[] = [
  'Admin',
  'Student',
  'Faculty',
  'Parent',
  'Accountant',
  'Librarian',
  'Placement Cell',
  'Hostel Warden',
  'Transport Manager',
];

const ALL_MODULES: Record<string, ModuleInfo> = {
  Dashboard: { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  CampusMap: { name: '3D Campus Map', path: '/map', icon: 'Compass' },
  Emergency: { name: 'Emergency SOS', path: '/emergency', icon: 'ShieldAlert' },
  DocCenter: { name: 'AI Doc Center', path: '/doc-center', icon: 'Sparkles' },
  NoticeBoard: { name: 'Notice Board', path: '/noticeboard', icon: 'Bell' },
  Complaints: { name: 'Complaints', path: '/complaints', icon: 'LifeBuoy' },
  Clubs: { name: 'Clubs & Leaderboard', path: '/clubs', icon: 'Trophy' },
  Security: { name: 'Security Center', path: '/security', icon: 'Lock' },

  Students: { name: 'Students', path: '/students', icon: 'Users' },
  Faculty: { name: 'Faculty', path: '/faculty', icon: 'GraduationCap' },
  Departments: { name: 'Departments', path: '/departments', icon: 'Layers' },
  Courses: { name: 'Courses', path: '/courses', icon: 'BookOpen' },
  Subjects: { name: 'Subjects', path: '/subjects', icon: 'BookMarked' },
  Timetable: { name: 'Timetable', path: '/timetable', icon: 'Clock' },
  Attendance: { name: 'Attendance', path: '/attendance', icon: 'CheckSquare' },
  Examinations: { name: 'Examinations', path: '/examinations', icon: 'ShieldAlert' },
  Results: { name: 'Results', path: '/results', icon: 'Award' },
  Assignments: { name: 'Assignments', path: '/assignments', icon: 'ClipboardList' },
  Fees: { name: 'Fees', path: '/fees', icon: 'CreditCard' },
  Library: { name: 'Library', path: '/library', icon: 'Library' },
  Hostel: { name: 'Hostel', path: '/hostel', icon: 'Home' },
  Transport: { name: 'Transport', path: '/transport', icon: 'Bus' },
  Placement: { name: 'Placement', path: '/placement', icon: 'Briefcase' },
  
  Calendar: { name: 'Academic Calendar', path: '/calendar', icon: 'Calendar' },
  DigitalTwin: { name: 'Campus Digital Twin', path: '/twin', icon: 'Network' },
  Analytics: { name: 'Analytics Hub', path: '/analytics', icon: 'LineChart' },
  Docs: { name: 'Design System', path: '/docs', icon: 'FileText' },
  
  Reports: { name: 'Reports', path: '/reports', icon: 'TrendingUp' },
  Settings: { name: 'Settings', path: '/settings', icon: 'Settings' },
};

const ROLE_MODULES_MAP: Record<UserRole, string[]> = {
  Admin: Object.keys(ALL_MODULES),
  Student: [
    'Dashboard',
    'CampusMap',
    'Emergency',
    'DocCenter',
    'NoticeBoard',
    'Complaints',
    'Clubs',
    'Courses',
    'Timetable',
    'Attendance',
    'Examinations',
    'Results',
    'Assignments',
    'Fees',
    'Library',
    'Hostel',
    'Transport',
    'Placement',
    'Calendar',
    'Analytics',
    'Settings',
  ],
  Faculty: [
    'Dashboard',
    'CampusMap',
    'Emergency',
    'DocCenter',
    'NoticeBoard',
    'Complaints',
    'Students',
    'Departments',
    'Courses',
    'Timetable',
    'Attendance',
    'Examinations',
    'Assignments',
    'Calendar',
    'Analytics',
    'Settings',
  ],
  Parent: [
    'Dashboard',
    'CampusMap',
    'Emergency',
    'NoticeBoard',
    'Attendance',
    'Results',
    'Fees',
    'Library',
    'Transport',
    'Analytics',
    'Settings',
  ],
  Accountant: ['Dashboard', 'Emergency', 'Fees', 'Reports', 'Settings'],
  Librarian: ['Dashboard', 'Emergency', 'Library', 'Reports', 'Settings'],
  'Placement Cell': ['Dashboard', 'Emergency', 'Placement', 'Reports', 'Settings'],
  'Hostel Warden': ['Dashboard', 'Emergency', 'Hostel', 'Complaints', 'Reports', 'Settings'],
  'Transport Manager': ['Dashboard', 'Emergency', 'Transport', 'Reports', 'Settings'],
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('erp_role');
    return (saved as UserRole) || 'Admin';
  });

  const setRole = (role: UserRole) => {
    setRoleState(role);
    localStorage.setItem('erp_role', role);
  };

  const allowedModules = (ROLE_MODULES_MAP[currentRole] || ROLE_MODULES_MAP['Admin'])
    .map((modName) => ALL_MODULES[modName])
    .filter(Boolean);

  return (
    <RoleContext.Provider value={{ currentRole, setRole, allowedModules, allRoles }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

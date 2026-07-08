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
  icon: string; // lucide icon name
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

// All modules definition
const ALL_MODULES: Record<string, ModuleInfo> = {
  Dashboard: { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
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
  
  // V2 Module extensions
  Calendar: { name: 'Academic Calendar', path: '/calendar', icon: 'Calendar' },
  DigitalTwin: { name: 'Campus Digital Twin', path: '/twin', icon: 'Network' },
  Analytics: { name: 'Analytics Hub', path: '/analytics', icon: 'LineChart' },
  Docs: { name: 'Design System', path: '/docs', icon: 'FileText' },
  
  Reports: { name: 'Reports', path: '/reports', icon: 'TrendingUp' },
  Notifications: { name: 'Notifications', path: '/notifications', icon: 'Bell' },
  Settings: { name: 'Settings', path: '/settings', icon: 'Settings' },
};

// Map roles to their permitted sidebar modules
const ROLE_MODULES_MAP: Record<UserRole, string[]> = {
  Admin: Object.keys(ALL_MODULES), // Admin gets everything
  Student: [
    'Dashboard',
    'Courses',
    'Subjects',
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
    'DigitalTwin',
    'Analytics',
    'Docs',
    'Settings',
  ],
  Faculty: [
    'Dashboard',
    'Students',
    'Departments',
    'Courses',
    'Subjects',
    'Timetable',
    'Attendance',
    'Examinations',
    'Assignments',
    'Calendar',
    'DigitalTwin',
    'Analytics',
    'Docs',
    'Settings',
  ],
  Parent: [
    'Dashboard',
    'Attendance',
    'Results',
    'Fees',
    'Library',
    'Transport',
    'Calendar',
    'DigitalTwin',
    'Analytics',
    'Settings',
  ],
  Accountant: ['Dashboard', 'Fees', 'Reports', 'Calendar', 'Docs', 'Settings'],
  Librarian: ['Dashboard', 'Library', 'Reports', 'Calendar', 'Docs', 'Settings'],
  'Placement Cell': ['Dashboard', 'Placement', 'Reports', 'Calendar', 'Docs', 'Settings'],
  'Hostel Warden': ['Dashboard', 'Hostel', 'Reports', 'Calendar', 'Docs', 'Settings'],
  'Transport Manager': ['Dashboard', 'Transport', 'Reports', 'Calendar', 'Docs', 'Settings'],
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

  const allowedModules = ROLE_MODULES_MAP[currentRole].map((modName) => ALL_MODULES[modName]);

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

import React, { createContext, useContext, useState } from 'react';

export type UserRole =
  | 'Admin'
  | 'Student'
  | 'Faculty'
  | 'Parent'
  | 'Accountant'
  | 'Librarian'
  | 'Registrar'
  | 'Placement Cell'
  | 'Hostel Warden'
  | 'Transport Manager';

export interface ModuleInfo {
  name: string;
  path: string;
  icon: string;
  layer?: 'Layer 1: Daily Operations' | 'Layer 2: Executive Intelligence' | 'Layer 3: Autonomous Agents';
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
  'Registrar',
  'Placement Cell',
  'Hostel Warden',
  'Transport Manager',
];

const ALL_MODULES: Record<string, ModuleInfo> = {
  // Layer 3: Autonomous Agents (ADK, RAG, Tool Calling, Gemini)
  ADKAgents: { name: 'ADK Autonomous Agents', path: '/adk-agents', icon: 'Bot', layer: 'Layer 3: Autonomous Agents' },
  AcademicCopilot: { name: 'AI Academic Copilot', path: '/academic-copilot', icon: 'BookOpen', layer: 'Layer 3: Autonomous Agents' },
  FacultyCopilot: { name: 'AI Faculty Copilot', path: '/faculty-copilot', icon: 'Briefcase', layer: 'Layer 3: Autonomous Agents' },
  Placement: { name: 'AI Placement Intelligence', path: '/placement', icon: 'Briefcase', layer: 'Layer 3: Autonomous Agents' },
  DocCenter: { name: 'RAG Doc Center', path: '/doc-center', icon: 'Sparkles', layer: 'Layer 3: Autonomous Agents' },

  // Layer 2: Executive Intelligence
  CAO: { name: 'AI Chief Admin Officer', path: '/cao', icon: 'Briefcase', layer: 'Layer 2: Executive Intelligence' },
  DecisionIntelligence: { name: 'AI Decision Intelligence', path: '/decision-intelligence', icon: 'Brain', layer: 'Layer 2: Executive Intelligence' },
  Analytics: { name: 'Analytics Hub', path: '/analytics', icon: 'LineChart', layer: 'Layer 2: Executive Intelligence' },
  DigitalTwin: { name: 'Campus Digital Twin', path: '/twin', icon: 'Network', layer: 'Layer 2: Executive Intelligence' },
  Fees: { name: 'AI Finance Intelligence', path: '/fees', icon: 'CreditCard', layer: 'Layer 2: Executive Intelligence' },
  EnergyPortal: { name: 'AI Energy & Sustainability', path: '/energy', icon: 'Zap', layer: 'Layer 2: Executive Intelligence' },
  Security: { name: 'Security Center', path: '/security', icon: 'Lock', layer: 'Layer 2: Executive Intelligence' },
  SecurityVault: { name: 'SOC Security Vault', path: '/security-vault', icon: 'Shield', layer: 'Layer 2: Executive Intelligence' },
  SystemHealth: { name: 'System Health & Vitals', path: '/system-health', icon: 'Activity', layer: 'Layer 2: Executive Intelligence' },
  Reports: { name: 'Reports & Exports', path: '/reports', icon: 'TrendingUp', layer: 'Layer 2: Executive Intelligence' },

  // Layer 1: Daily Operations
  Dashboard: { name: 'Dashboard', path: '/', icon: 'LayoutDashboard', layer: 'Layer 1: Daily Operations' },
  Attendance: { name: 'Attendance', path: '/attendance', icon: 'CheckSquare', layer: 'Layer 1: Daily Operations' },
  Timetable: { name: 'Timetable', path: '/timetable', icon: 'Clock', layer: 'Layer 1: Daily Operations' },
  Faculty: { name: 'Faculty', path: '/faculty', icon: 'GraduationCap', layer: 'Layer 1: Daily Operations' },
  Students: { name: 'Students', path: '/students', icon: 'Users', layer: 'Layer 1: Daily Operations' },
  Courses: { name: 'Courses', path: '/courses', icon: 'BookOpen', layer: 'Layer 1: Daily Operations' },
  Assignments: { name: 'Assignments', path: '/assignments', icon: 'ClipboardList', layer: 'Layer 1: Daily Operations' },
  Library: { name: 'Library', path: '/library', icon: 'Library', layer: 'Layer 1: Daily Operations' },
  Hostel: { name: 'Hostel', path: '/hostel', icon: 'Home', layer: 'Layer 1: Daily Operations' },
  Transport: { name: 'Transport', path: '/transport', icon: 'Bus', layer: 'Layer 1: Daily Operations' },
  NoticeBoard: { name: 'Notice Board', path: '/noticeboard', icon: 'Bell', layer: 'Layer 1: Daily Operations' },
  Complaints: { name: 'Complaints', path: '/complaints', icon: 'LifeBuoy', layer: 'Layer 1: Daily Operations' },
  Clubs: { name: 'Clubs & Leaderboard', path: '/clubs', icon: 'Trophy', layer: 'Layer 1: Daily Operations' },
  CampusMap: { name: '3D Campus Map', path: '/map', icon: 'Compass', layer: 'Layer 1: Daily Operations' },
  Emergency: { name: 'Emergency SOS', path: '/emergency', icon: 'ShieldAlert', layer: 'Layer 1: Daily Operations' },
  Calendar: { name: 'Academic Calendar', path: '/calendar', icon: 'Calendar', layer: 'Layer 1: Daily Operations' },
  Settings: { name: 'Settings', path: '/settings', icon: 'Settings', layer: 'Layer 1: Daily Operations' },
};

const ROLE_MODULES_MAP: Record<UserRole, string[]> = {
  Admin: Object.keys(ALL_MODULES),
  Student: [
    'Dashboard',
    'AcademicCopilot',
    'ADKAgents',
    'Placement',
    'DigitalTwin',
    'CampusMap',
    'Courses',
    'Timetable',
    'Assignments',
    'Hostel',
    'Complaints',
    'NoticeBoard',
    'Emergency',
    'DocCenter',
    'Clubs',
    'Attendance',
    'Library',
    'Transport',
    'Calendar',
    'Settings',
  ],
  Faculty: [
    'Dashboard',
    'FacultyCopilot',
    'ADKAgents',
    'CampusMap',
    'Emergency',
    'DocCenter',
    'NoticeBoard',
    'Complaints',
    'Students',
    'Courses',
    'Timetable',
    'Attendance',
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
    'Fees',
    'Library',
    'Transport',
    'Analytics',
    'Settings',
  ],
  Registrar: [
    'Dashboard',
    'Emergency',
    'Students',
    'Faculty',
    'Courses',
    'Attendance',
    'Reports',
    'CAO',
    'DecisionIntelligence',
    'Analytics',
    'SystemHealth',
    'Calendar',
    'Settings',
  ],
  Accountant: ['Dashboard', 'Emergency', 'Fees', 'Reports', 'SystemHealth', 'Settings'],
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

const fallbackRoleContext: RoleContextType = {
  currentRole: 'Admin',
  setRole: () => {},
  allowedModules: Object.values(ALL_MODULES),
  allRoles,
};

export const useRole = () => {
  try {
    const context = useContext(RoleContext);
    if (!context) return fallbackRoleContext;
    return context;
  } catch {
    return fallbackRoleContext;
  }
};

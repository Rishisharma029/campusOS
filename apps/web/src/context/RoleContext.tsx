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
  | 'Industry Portal'
  | 'Hostel Warden'
  | 'Transport Manager';

export interface ModuleInfo {
  name: string;
  path: string;
  icon: string;
  section?: 'Core' | 'CAREER & INDUSTRY' | 'GENOVA INNOVATION' | 'Operations';
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
  'Industry Portal',
  'Hostel Warden',
  'Transport Manager',
];

const ALL_MODULES: Record<string, ModuleInfo> = {
  // Core Platform (Top Tier)
  Dashboard: { name: 'Dashboard', path: '/', icon: 'LayoutDashboard', section: 'Core' },
  Campus: { name: 'Campus', path: '/campus', icon: 'Building2', section: 'Core' },
  Academics: { name: 'Academics', path: '/academics', icon: 'GraduationCap', section: 'Core' },
  AIIntelligence: { name: 'AI Intelligence', path: '/ai-intelligence', icon: 'Brain', section: 'Core' },

  // CAREER & INDUSTRY
  Skills: { name: 'Skills', path: '/career/skills', icon: 'Award', section: 'CAREER & INDUSTRY' },
  IndustryMapping: { name: 'Industry Mapping', path: '/career/industry-mapping', icon: 'Target', section: 'CAREER & INDUSTRY' },
  CareerPath: { name: 'Career Path', path: '/career/path', icon: 'GitBranch', section: 'CAREER & INDUSTRY' },
  Opportunities: { name: 'Opportunities', path: '/career/opportunities', icon: 'Briefcase', section: 'CAREER & INDUSTRY' },
  Applications: { name: 'Applications', path: '/career/applications', icon: 'CheckSquare', section: 'CAREER & INDUSTRY' },
  Portfolio: { name: 'Portfolio', path: '/career/portfolio', icon: 'FolderGit2', section: 'CAREER & INDUSTRY' },
  IndustryPortal: { name: 'Industry Portal', path: '/career/industry-portal', icon: 'Building2', section: 'CAREER & INDUSTRY' },
  AIRecruiter: { name: 'AI Recruiter', path: '/career/ai-recruiter', icon: 'Sparkles', section: 'CAREER & INDUSTRY' },
  Academician: { name: 'Academician Portal', path: '/career/academician', icon: 'GraduationCap', section: 'CAREER & INDUSTRY' },
  InstitutionIntelligence: { name: 'Institution Intelligence', path: '/career/institution-intelligence', icon: 'BarChart3', section: 'CAREER & INDUSTRY' },
  CareerCopilot: { name: 'AI Career Copilot', path: '/career/copilot', icon: 'Bot', section: 'CAREER & INDUSTRY' },

  // GENOVA INNOVATION
  LandIntelligence: { name: 'Land Intelligence', path: '/innovation/land-intelligence', icon: 'Layers', section: 'GENOVA INNOVATION' },
  AutonomousMobility: { name: 'Autonomous Mobility', path: '/innovation/autonomous-mobility', icon: 'Navigation', section: 'GENOVA INNOVATION' },

  // Layer 3: Autonomous Agents & Copilots
  ADKAgents: { name: 'ADK Autonomous Agents', path: '/adk-agents', icon: 'Bot', section: 'Operations', layer: 'Layer 3: Autonomous Agents' },
  AcademicCopilot: { name: 'AI Academic Copilot', path: '/academic-copilot', icon: 'BookOpen', section: 'Operations', layer: 'Layer 3: Autonomous Agents' },
  FacultyCopilot: { name: 'AI Faculty Copilot', path: '/faculty-copilot', icon: 'Briefcase', section: 'Operations', layer: 'Layer 3: Autonomous Agents' },
  Placement: { name: 'AI Placement Intelligence', path: '/placement', icon: 'Briefcase', section: 'Operations', layer: 'Layer 3: Autonomous Agents' },
  DocCenter: { name: 'RAG Doc Center', path: '/doc-center', icon: 'Sparkles', section: 'Operations', layer: 'Layer 3: Autonomous Agents' },

  // Layer 2: Executive Intelligence
  CAO: { name: 'AI Chief Admin Officer', path: '/cao', icon: 'Briefcase', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },
  DecisionIntelligence: { name: 'AI Decision Intelligence', path: '/decision-intelligence', icon: 'Brain', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },
  Analytics: { name: 'Analytics Hub', path: '/analytics', icon: 'LineChart', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },
  DigitalTwin: { name: 'Campus Digital Twin', path: '/twin', icon: 'Network', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },
  Fees: { name: 'AI Finance Intelligence', path: '/fees', icon: 'CreditCard', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },
  EnergyPortal: { name: 'AI Energy & Sustainability', path: '/energy', icon: 'Zap', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },
  Security: { name: 'Security Center', path: '/security', icon: 'Lock', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },
  SecurityVault: { name: 'SOC Security Vault', path: '/security-vault', icon: 'Shield', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },
  SystemHealth: { name: 'System Health & Vitals', path: '/system-health', icon: 'Activity', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },
  Reports: { name: 'Reports & Exports', path: '/reports', icon: 'TrendingUp', section: 'Operations', layer: 'Layer 2: Executive Intelligence' },

  // Layer 1: Daily Operations
  Attendance: { name: 'Attendance', path: '/attendance', icon: 'CheckSquare', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Timetable: { name: 'Timetable', path: '/timetable', icon: 'Clock', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Faculty: { name: 'Faculty', path: '/faculty', icon: 'GraduationCap', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Students: { name: 'Students', path: '/students', icon: 'Users', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Courses: { name: 'Courses', path: '/courses', icon: 'BookOpen', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Assignments: { name: 'Assignments', path: '/assignments', icon: 'ClipboardList', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Library: { name: 'Library', path: '/library', icon: 'Library', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Hostel: { name: 'Hostel', path: '/hostel', icon: 'Home', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Transport: { name: 'Transport', path: '/transport', icon: 'Bus', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  NoticeBoard: { name: 'Notice Board', path: '/noticeboard', icon: 'Bell', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Complaints: { name: 'Complaints', path: '/complaints', icon: 'LifeBuoy', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Clubs: { name: 'Clubs & Leaderboard', path: '/clubs', icon: 'Trophy', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  CampusMap: { name: '3D Campus Map', path: '/map', icon: 'Compass', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Emergency: { name: 'Emergency SOS', path: '/emergency', icon: 'ShieldAlert', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Calendar: { name: 'Academic Calendar', path: '/calendar', icon: 'Calendar', section: 'Operations', layer: 'Layer 1: Daily Operations' },
  Settings: { name: 'Settings', path: '/settings', icon: 'Settings', section: 'Operations', layer: 'Layer 1: Daily Operations' },
};

// These 4 core platform hubs are always visible for all roles.
// Role-specific career/innovation modules are in ROLE_MODULES_MAP.
const GENOVA_PRIMARY_MODULES = [
  'Dashboard',
  'Campus',
  'Academics',
  'AIIntelligence',
];

const ROLE_MODULES_MAP: Record<UserRole, string[]> = {
  Admin: Object.keys(ALL_MODULES),
  Student: [
    'Dashboard',
    'Skills',
    'CareerPath',
    'Opportunities',
    'Applications',
    'Portfolio',
    'CareerCopilot',
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
    'Academician',
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
  'Placement Cell': ['Dashboard', 'Emergency', 'Placement', 'InstitutionIntelligence', 'CareerCopilot', 'Reports', 'Settings'],
  'Industry Portal': [
    'Dashboard',
    'IndustryPortal',
    'AIRecruiter',
    'CareerCopilot',
    'Opportunities',
    'Applications',
    'IndustryMapping',
    'Skills',
    'Portfolio',
    'Placement',
    'Reports',
    'Settings',
  ],
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

  const rawAllowed = ROLE_MODULES_MAP[currentRole] || ROLE_MODULES_MAP['Admin'];
  const combinedKeys = Array.from(new Set([...GENOVA_PRIMARY_MODULES, ...rawAllowed]));
  const allowedModules = combinedKeys
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

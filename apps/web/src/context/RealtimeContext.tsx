import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LiveNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'alert' | 'success' | 'ai';
  targetRole?: string;
}

export interface EmergencyAlert {
  id: string;
  type: 'Security' | 'Medical' | 'Fire';
  location: string;
  sender: string;
  timestamp: string;
  status: 'ACTIVE' | 'DISPATCHED' | 'RESOLVED';
}

interface RealtimeContextType {
  isConnected: boolean;
  activeClassesCount: number;
  todayAttendanceRate: number;
  liveNotifications: LiveNotification[];
  emergencyAlerts: EmergencyAlert[];
  studentMoodScore: number; // 0 - 100
  aiAlerts: string[];
  triggerEmergencySOS: (type: 'Security' | 'Medical' | 'Fire', location: string) => void;
  resolveEmergencySOS: (id: string) => void;
  addNotification: (title: string, message: string, type?: LiveNotification['type']) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected] = useState(true);
  const [activeClassesCount, setActiveClassesCount] = useState(42);
  const [todayAttendanceRate, setTodayAttendanceRate] = useState(94.2);
  const [studentMoodScore, setStudentMoodScore] = useState(88);

  const [liveNotifications, setLiveNotifications] = useState<LiveNotification[]>([
    {
      id: 'n1',
      title: 'AI Attendance Marked',
      message: 'Classroom CCTV automatically verified 48 students in CSE-3A.',
      time: 'Just now',
      type: 'ai',
    },
    {
      id: 'n2',
      title: 'Placement Drive Alert',
      message: 'Google Cloud Drive applications close today at 11:59 PM.',
      time: '12m ago',
      type: 'info',
    },
    {
      id: 'n3',
      title: 'Fee Collection Update',
      message: '₹4.2L collected online in last 2 hours via UPI Gateway.',
      time: '25m ago',
      type: 'success',
    },
  ]);

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([
    {
      id: 'sos-101',
      type: 'Medical',
      location: 'Block B - Lab 4',
      sender: 'Dr. Sarah Jenkins',
      timestamp: '10 mins ago',
      status: 'DISPATCHED',
    },
  ]);

  const [aiAlerts] = useState<string[]>([
    'High attendance anomaly detected in Mech Lab 2 (12% lower than usual).',
    '3 Students flagged for dropout risk based on mid-term performance trends.',
    'Hostel Building B electricity usage spike (+22% vs baseline).',
  ]);

  // Periodic subtle live updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTodayAttendanceRate(prev => Math.min(99.9, Math.max(90, +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1))));
      setStudentMoodScore(prev => Math.min(98, Math.max(70, Math.round(prev + (Math.random() * 2 - 1)))));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const triggerEmergencySOS = (type: 'Security' | 'Medical' | 'Fire', location: string) => {
    const newSOS: EmergencyAlert = {
      id: `sos-${Date.now().toString().slice(-4)}`,
      type,
      location,
      sender: 'CurrentUser (Active Session)',
      timestamp: 'Just now',
      status: 'ACTIVE',
    };
    setEmergencyAlerts(prev => [newSOS, ...prev]);
    addNotification(`EMERGENCY ${type.toUpperCase()} TRIGGERED`, `Alert sent for ${location}. Campus Quick Response Team dispatched.`, 'alert');
  };

  const resolveEmergencySOS = (id: string) => {
    setEmergencyAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED' } : a));
  };

  const addNotification = (title: string, message: string, type: LiveNotification['type'] = 'info') => {
    setLiveNotifications(prev => [
      { id: Date.now().toString(), title, message, time: 'Just now', type },
      ...prev.slice(0, 15),
    ]);
  };

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        activeClassesCount,
        todayAttendanceRate,
        liveNotifications,
        emergencyAlerts,
        studentMoodScore,
        aiAlerts,
        triggerEmergencySOS,
        resolveEmergencySOS,
        addNotification,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
};

export interface SecurityRadarAuditLog {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  attemptedRoute: string;
  ipAddress: string;
  userAgent: string;
  threatLevel: 'HIGH_UNAUTHORIZED_ACCESS_ATTEMPT' | 'CRITICAL';
  status: 'UNDER_RADAR_MONITORED';
}

export class SecurityRadarEngine {
  private static auditLogs: SecurityRadarAuditLog[] = [
    {
      id: 'rad-101',
      timestamp: '2026-07-25 17:10:42',
      studentId: '2026CSE088',
      studentName: 'Vikram Patel',
      attemptedRoute: '/cao',
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0',
      threatLevel: 'HIGH_UNAUTHORIZED_ACCESS_ATTEMPT',
      status: 'UNDER_RADAR_MONITORED',
    },
  ];

  /**
   * Logs an unauthorized route access attempt by a student
   */
  static logUnauthorizedAttempt(studentId: string = '2026CSE001', studentName: string = 'Rishi Sharma', attemptedRoute: string): SecurityRadarAuditLog {
    const newLog: SecurityRadarAuditLog = {
      id: `rad-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      studentId,
      studentName,
      attemptedRoute,
      ipAddress: '192.168.1.101 (Campus WiFi - Hostel Block A)',
      userAgent: navigator.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      threatLevel: 'HIGH_UNAUTHORIZED_ACCESS_ATTEMPT',
      status: 'UNDER_RADAR_MONITORED',
    };

    this.auditLogs.unshift(newLog);
    return newLog;
  }

  /**
   * Retrieves all security radar audit logs for Security Control Room & Admins
   */
  static getSecurityRadarLogs(): SecurityRadarAuditLog[] {
    return this.auditLogs;
  }
}

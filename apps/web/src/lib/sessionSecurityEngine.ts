export interface ActiveSessionRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  ipAddress: string;
  location: string;
  deviceFingerprint: string;
  loginTimestamp: string;
  status: 'ACTIVE_SECURE' | 'SUSPECTED_HIJACK' | 'LOCKED_OUT';
}

export interface RateLimitIpBanRecord {
  ipAddress: string;
  failedAttempts: number;
  reason: string;
  bannedAt: string;
  expiresAt: string;
  status: 'ACTIVE_BAN' | 'RESOLVED';
}

export interface DlpExportAuditRecord {
  id: string;
  timestamp: string;
  user: string;
  reportType: string;
  recordsExported: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH_BULK_EXFILTRATION';
  status: 'APPROVED_BY_ADMIN' | 'BLOCKED_PENDING_KEY';
}

export class SessionSecurityEngine {
  private static sessions: ActiveSessionRecord[] = [
    {
      id: 'sess-101',
      userId: 'ADM-001',
      userName: 'Dr. Rajesh Sharma (Principal)',
      userRole: 'Admin',
      ipAddress: '192.168.1.10',
      location: 'Administrative Block - Desk PC',
      deviceFingerprint: 'Chrome 122 / Windows 11',
      loginTimestamp: '2026-07-25 08:30:12',
      status: 'ACTIVE_SECURE',
    },
    {
      id: 'sess-102',
      userId: 'STU-2026-001',
      userName: 'Rishi Sharma',
      userRole: 'Student',
      ipAddress: '192.168.1.101',
      location: 'Hostel Block A - Campus WiFi',
      deviceFingerprint: 'Chrome 122 / Windows 11',
      loginTimestamp: '2026-07-25 09:15:40',
      status: 'ACTIVE_SECURE',
    },
    {
      id: 'sess-103',
      userId: 'STU-2026-042',
      userName: 'Ananya Roy',
      userRole: 'Student',
      ipAddress: '103.42.18.99 (Remote VPN)',
      location: 'Out-of-State IP (Mumbai)',
      deviceFingerprint: 'Safari / iOS 17',
      loginTimestamp: '2026-07-25 11:22:05',
      status: 'SUSPECTED_HIJACK',
    },
  ];

  private static ipBans: RateLimitIpBanRecord[] = [
    {
      ipAddress: '198.51.100.42',
      failedAttempts: 6,
      reason: 'Brute-force login scanning & unauthorized URL probes',
      bannedAt: '2026-07-25 16:40:00',
      expiresAt: '2026-07-25 17:10:00',
      status: 'ACTIVE_BAN',
    },
  ];

  private static dlpAudits: DlpExportAuditRecord[] = [
    {
      id: 'dlp-501',
      timestamp: '2026-07-25 16:05:12',
      user: 'Accountant (Suresh Verma)',
      reportType: 'Fee Collections Ledger',
      recordsExported: 420,
      riskLevel: 'HIGH_BULK_EXFILTRATION',
      status: 'APPROVED_BY_ADMIN',
    },
  ];

  /**
   * Retrieves all active tracked sessions
   */
  static getActiveSessions(): ActiveSessionRecord[] {
    return this.sessions;
  }

  /**
   * Invalidate a session (1-Click Remote Lockout)
   */
  static invalidateSession(sessionId: string): void {
    const sess = this.sessions.find(s => s.id === sessionId);
    if (sess) {
      sess.status = 'LOCKED_OUT';
    }
  }

  /**
   * Retrieves active rate limiting IP bans
   */
  static getIpBans(): RateLimitIpBanRecord[] {
    return this.ipBans;
  }

  /**
   * Manually ban an offending IP address
   */
  static banIpAddress(ipAddress: string, reason: string): RateLimitIpBanRecord {
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 60 * 1000);
    const newBan: RateLimitIpBanRecord = {
      ipAddress,
      failedAttempts: 5,
      reason,
      bannedAt: now.toISOString().replace('T', ' ').slice(0, 19),
      expiresAt: expires.toISOString().replace('T', ' ').slice(0, 19),
      status: 'ACTIVE_BAN',
    };
    this.ipBans.unshift(newBan);
    return newBan;
  }

  /**
   * Unban an IP address
   */
  static unbanIpAddress(ipAddress: string): void {
    const ban = this.ipBans.find(b => b.ipAddress === ipAddress);
    if (ban) {
      ban.status = 'RESOLVED';
    }
  }

  /**
   * Retrieves DLP Data Export Audits
   */
  static getDlpAudits(): DlpExportAuditRecord[] {
    return this.dlpAudits;
  }

  /**
   * Logs a DLP Data Export Event
   */
  static logDlpExport(user: string, reportType: string, recordsCount: number): DlpExportAuditRecord {
    const isBulk = recordsCount > 50;
    const newRecord: DlpExportAuditRecord = {
      id: `dlp-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user,
      reportType,
      recordsExported: recordsCount,
      riskLevel: isBulk ? 'HIGH_BULK_EXFILTRATION' : 'LOW',
      status: isBulk ? 'BLOCKED_PENDING_KEY' : 'APPROVED_BY_ADMIN',
    };
    this.dlpAudits.unshift(newRecord);
    return newRecord;
  }

  /**
   * Verifies Zero-Trust 2FA OTP Challenge Code (Generates 6-digit dynamic OTP)
   */
  static generateStepUpOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static verifyStepUpOtp(inputOtp: string, expectedOtp: string): boolean {
    return inputOtp.trim() === expectedOtp.trim();
  }
}

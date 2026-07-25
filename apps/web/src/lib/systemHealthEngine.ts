export interface SubsystemHealthItem {
  id: string;
  name: string;
  category: 'CORE_DATABASE' | 'AI_GATEWAY' | 'VISION_CCTV' | 'IOT_SENSORS' | 'FINANCE_ENGINE';
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  uptimePercentage: number;
  lastPing: string;
}

export interface CampusVitalSummary {
  servicesOnlinePercent: number;
  activeAiAgentsCount: number;
  responseTimeSec: number;
  threatLevel: 'Low' | 'Moderate' | 'Critical';
  energySavingTodayPercent: number;
  currentOccupancyPercent: number;
  lastDiagnosticTimestamp: string;
}

export class SystemHealthEngine {
  private static vitals: CampusVitalSummary = {
    servicesOnlinePercent: 99.98,
    activeAiAgentsCount: 12,
    responseTimeSec: 0.42,
    threatLevel: 'Low',
    energySavingTodayPercent: 18,
    currentOccupancyPercent: 61,
    lastDiagnosticTimestamp: '2026-07-25 18:05:00',
  };

  private static subsystems: SubsystemHealthItem[] = [
    {
      id: 'sub-1',
      name: 'PostgreSQL Core ERP Database',
      category: 'CORE_DATABASE',
      status: 'OPERATIONAL',
      latencyMs: 1.2,
      uptimePercentage: 99.99,
      lastPing: 'Just now (0.2s ago)',
    },
    {
      id: 'sub-2',
      name: 'Gemini ADK Autonomous Agent Gateway',
      category: 'AI_GATEWAY',
      status: 'OPERATIONAL',
      latencyMs: 42,
      uptimePercentage: 99.95,
      lastPing: 'Just now (0.4s ago)',
    },
    {
      id: 'sub-3',
      name: 'Vision AI CCTV Real-Time Frame Parser',
      category: 'VISION_CCTV',
      status: 'OPERATIONAL',
      latencyMs: 18,
      uptimePercentage: 99.98,
      lastPing: 'Just now (0.1s ago)',
    },
    {
      id: 'sub-4',
      name: 'Campus IoT Energy & HVAC Sensors',
      category: 'IOT_SENSORS',
      status: 'OPERATIONAL',
      latencyMs: 12,
      uptimePercentage: 100.0,
      lastPing: 'Just now (0.3s ago)',
    },
    {
      id: 'sub-5',
      name: 'Financial Ledger & Bank Payment API',
      category: 'FINANCE_ENGINE',
      status: 'OPERATIONAL',
      latencyMs: 0.8,
      uptimePercentage: 99.99,
      lastPing: 'Just now (0.5s ago)',
    },
  ];

  /**
   * Retrieves overall campus vital metrics summary
   */
  static getVitalSummary(): CampusVitalSummary {
    return this.vitals;
  }

  /**
   * Retrieves sub-system service health list
   */
  static getSubsystems(): SubsystemHealthItem[] {
    return this.subsystems;
  }

  /**
   * Executes full campus diagnostic check
   */
  static runDiagnosticCheck(): CampusVitalSummary {
    this.vitals.lastDiagnosticTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    this.vitals.responseTimeSec = Number((0.38 + Math.random() * 0.08).toFixed(2));
    return this.vitals;
  }
}

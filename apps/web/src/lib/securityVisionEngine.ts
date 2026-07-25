export interface VisionDetection {
  id: string;
  type: 'UNKNOWN_VISITOR' | 'OVERCROWDING' | 'UNATTENDED_BAG' | 'EMERGENCY_SOS';
  cameraLocation: string; // e.g. "Security Gate 1 CCTV #4"
  timestamp: string;
  confidence: number; // e.g. 94%
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  actionPayload: string;
}

export class SecurityVisionEngine {
  /**
   * Generates active Vision AI security detections across campus CCTV feeds
   */
  static getVisionDetections(): VisionDetection[] {
    return [
      {
        id: 'vis-1',
        type: 'UNKNOWN_VISITOR',
        cameraLocation: 'Security Gate 1 (Camera #2)',
        timestamp: '2 Mins Ago',
        confidence: 96,
        description: 'Unrecognized face scan without active digital visitor pass detected entering Block A corridor.',
        severity: 'HIGH',
        actionPayload: 'DISPATCH_GUARD_GATE1',
      },
      {
        id: 'vis-2',
        type: 'OVERCROWDING',
        cameraLocation: 'Central Mess & Canteen (Camera #7)',
        timestamp: '5 Mins Ago',
        confidence: 91,
        description: 'Crowd density exceeded 88% capacity limit (340 persons in 400 sq.m zone). Risk of bottleneck.',
        severity: 'WARNING',
        actionPayload: 'DISPERSE_CANTEEN_CROWD',
      },
      {
        id: 'vis-3',
        type: 'UNATTENDED_BAG',
        cameraLocation: 'Library Ground Floor (Camera #11)',
        timestamp: '8 Mins Ago',
        confidence: 94,
        description: 'Stationary unclaimed backpack detected without owner present for > 4 minutes.',
        severity: 'CRITICAL',
        actionPayload: 'INSPECT_UNATTENDED_BAG',
      },
    ];
  }

  /**
   * Dispatches 1-click security action
   */
  static executeSecurityAction(actionPayload: string): { success: boolean; message: string } {
    switch (actionPayload) {
      case 'DISPATCH_GUARD_GATE1':
        return {
          success: true,
          message: 'Security Dispatched: Guard Unit #3 dispatched to Gate 1 to intercept unknown visitor.',
        };
      case 'DISPERSE_CANTEEN_CROWD':
        return {
          success: true,
          message: 'Crowd Management Activated: Automated public address announcement sent to Canteen to open Side Exit B.',
        };
      case 'INSPECT_UNATTENDED_BAG':
        return {
          success: true,
          message: 'Bomb Squad & Security Alerted: Guard Unit #1 dispatched to Library Ground Floor for luggage inspection.',
        };
      case 'TRIGGER_CAMPUS_SOS':
        return {
          success: true,
          message: '🚨 EMERGENCY SOS LOCKDOWN DISPATCHED: Automated alerts sent to Local Police Station, Campus Security Gate 1 & 2, and Admin Command Center.',
        };
      default:
        return {
          success: true,
          message: `Executed security dispatch: ${actionPayload}`,
        };
    }
  }
}

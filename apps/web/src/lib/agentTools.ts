import { searchRAGKnowledgeBase, type RAGQueryResult } from './ragKnowledgeBase';

export interface ToolCallExecution {
  toolName: string;
  args: Record<string, any>;
  result: any;
  status: 'SUCCESS' | 'ERROR';
}

export interface AgentToolResponse {
  intent: string;
  actions: string[];
  response: string;
  toolExecutions: ToolCallExecution[];
  actionableLink?: string;
  citations?: RAGQueryResult[];
}

export const AgentTools = {
  // Tool 1: ReserveRoom
  ReserveRoom: (args: { room: string; date: string; timeSlot: string; reason: string }): ToolCallExecution => {
    return {
      toolName: 'ReserveRoom',
      args,
      status: 'SUCCESS',
      result: {
        reservationId: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
        room: args.room,
        date: args.date || 'Tomorrow',
        timeSlot: args.timeSlot || '02:00 PM - 04:00 PM',
        status: 'CONFIRMED',
        message: `Successfully reserved ${args.room} for ${args.date || 'Tomorrow'} (${args.timeSlot || '2:00 PM'}). Digital key code generated.`,
      },
    };
  },

  // Tool 2: SubmitLeaveApplication
  SubmitLeaveApplication: (args: { studentId: string; startDate: string; endDate: string; reason: string }): ToolCallExecution => {
    return {
      toolName: 'SubmitLeaveApplication',
      args,
      status: 'SUCCESS',
      result: {
        applicationId: `LV-${Math.floor(100 + Math.random() * 900)}`,
        studentId: args.studentId || '2026CSE001',
        dates: `${args.startDate || 'Tomorrow'} to ${args.endDate || 'Next Day'}`,
        reason: args.reason || 'Medical checkup',
        status: 'SUBMITTED_TO_ADVISOR',
        message: `Leave application generated and submitted to Faculty Advisor (Dr. Arindam Sen) for approval signature.`,
      },
    };
  },

  // Tool 3: GenerateAttendanceReport
  GenerateAttendanceReport: (args: { courseId: string; threshold: number }): ToolCallExecution => {
    return {
      toolName: 'GenerateAttendanceReport',
      args,
      status: 'SUCCESS',
      result: {
        courseId: args.courseId || 'B.Tech CSE',
        threshold: args.threshold || 75,
        totalEnrolled: 48,
        shortageCount: 3,
        shortageStudents: ['Rishi Sharma (68.2%)', 'Ananya Roy (71.4%)', 'Vikram Patel (73.0%)'],
        message: `Attendance audit complete for ${args.courseId || 'B.Tech CSE'}. 3 students flagged below ${args.threshold}%.`,
      },
    };
  },

  // Tool 4: FindAvailableRoom
  FindAvailableRoom: (args: { building?: string; timeSlot?: string }): ToolCallExecution => {
    return {
      toolName: 'FindAvailableRoom',
      args,
      status: 'SUCCESS',
      result: {
        availableRooms: [
          { room: 'LHC-204', block: 'Block A', capacity: 60, status: 'EMPTY' },
          { room: 'Lab-3', block: 'Block A', capacity: 40, status: 'EMPTY' },
          { room: 'B-302', block: 'Block B', capacity: 45, status: 'EMPTY' },
        ],
        message: `Found 3 vacant classrooms for ${args.timeSlot || 'current slot'}. Recommended: LHC-204 (Block A).`,
      },
    };
  },

  // Tool 5: SendEmail
  SendEmail: (args: { to: string; subject: string; body: string }): ToolCallExecution => {
    return {
      toolName: 'SendEmail',
      args,
      status: 'SUCCESS',
      result: {
        messageId: `MSG-${Date.now()}`,
        recipient: args.to,
        subject: args.subject,
        status: 'DISPATCHED',
        message: `Email dispatched to ${args.to} via Campus Mail Gateway.`,
      },
    };
  },

  // Tool 6: CalculateAttendanceRecovery
  CalculateAttendanceRecovery: (args: { currentRate: number; totalSessions: number; targetRate: number }): ToolCallExecution => {
    const currentRate = args.currentRate || 68.2;
    const totalSessions = args.totalSessions || 14;
    const targetRate = args.targetRate || 75;

    const currentAttended = Math.round((currentRate / 100) * totalSessions);
    // formula: (currentAttended + X) / (totalSessions + X) >= targetRate/100
    // => currentAttended + X >= 0.75 * totalSessions + 0.75 * X
    // => 0.25 * X >= 0.75 * totalSessions - currentAttended
    const requiredClasses = Math.max(1, Math.ceil((0.75 * totalSessions - currentAttended) / 0.25));

    return {
      toolName: 'CalculateAttendanceRecovery',
      args,
      status: 'SUCCESS',
      result: {
        currentRate: `${currentRate}%`,
        targetRate: `${targetRate}%`,
        attendedSessions: currentAttended,
        totalSessions,
        requiredConsecutiveClasses: requiredClasses,
        message: `To recover attendance from ${currentRate}% to ${targetRate}%, you must attend the next ${requiredClasses} consecutive classes without absence.`,
      },
    };
  },

  // Tool 7: NotifyAdvisor
  NotifyAdvisor: (args: { studentId: string; note: string }): ToolCallExecution => {
    return {
      toolName: 'NotifyAdvisor',
      args,
      status: 'SUCCESS',
      result: {
        advisorName: 'Dr. Arindam Sen',
        advisorEmail: 'arindam.sen@campusos.edu',
        status: 'NOTIFIED',
        message: `Notification sent to Faculty Advisor (Dr. Arindam Sen): "${args.note || 'Student attendance recovery request'}"`,
      },
    };
  },

  // Tool 8: QueryRAGDocuments
  QueryRAGDocuments: (args: { query: string }): ToolCallExecution => {
    const citations = searchRAGKnowledgeBase(args.query);
    return {
      toolName: 'QueryRAGDocuments',
      args,
      status: 'SUCCESS',
      result: {
        citations,
        count: citations.length,
        message: `Retrieved ${citations.length} grounded document sections from official campus RAG knowledge base.`,
      },
    };
  },
};

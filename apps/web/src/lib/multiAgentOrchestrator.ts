import { AgentTools, type AgentToolResponse } from './agentTools';
import { searchRAGKnowledgeBase } from './ragKnowledgeBase';
import { DecisionIntelligenceEngine } from './decisionIntelligenceEngine';
import { ChiefAdministrativeOfficerEngine } from './chiefAdministrativeOfficer';

export type SubAgentRole =
  | 'StudentAgent'
  | 'FacultyAgent'
  | 'PrincipalAgent'
  | 'ParentAgent'
  | 'PlacementAgent'
  | 'FinanceAgent'
  | 'AttendanceAgent'
  | 'TimetableAgent'
  | 'LibraryAgent'
  | 'TransportAgent'
  | 'SecurityAgent'
  | 'ChiefAdministrativeOfficerAgent';

export interface MultiAgentRouteResult extends AgentToolResponse {
  routedAgent: SubAgentRole;
  agentDescription: string;
}

export class CampusOSAIOrchestrator {
  /**
   * Master Coordinator router to direct user query to specialized agent
   */
  static processUserRequest(query: string, currentRole: string = 'Student'): MultiAgentRouteResult {
    const q = query.toLowerCase();

    // 0. AI Chief Administrative Officer Single-Prompt Productivity Query ("What needs my attention today?")
    if (
      q.includes('needs my attention') ||
      q.includes('what needs attention') ||
      q.includes('attention today') ||
      q.includes('cao report') ||
      q.includes('executive summary') ||
      q.includes('chief administrative officer')
    ) {
      const caoRes = ChiefAdministrativeOfficerEngine.processExecutiveQuery(query);
      return {
        routedAgent: 'ChiefAdministrativeOfficerAgent',
        agentDescription: 'AI Chief Administrative Officer (Productivity Agent)',
        intent: 'executive_attention_agenda',
        actions: [
          'AuditCampusModules(Attendance, Leave, Maintenance, Timetable, Fees, Library)',
          'ConsolidateAttentionAgenda()',
          'GenerateBatchResolutionDispatches()',
        ],
        toolExecutions: [
          {
            toolName: 'AuditCampusAttentionAgenda',
            args: { query, role: currentRole },
            status: 'SUCCESS',
            result: caoRes.agenda,
          }
        ],
        response: caoRes.response,
        actionableLink: '/cao',
      };
    }

    // 0.1 Decision Intelligence Prompts
    if (
      q.includes('absenteeism') ||
      q.includes('highest absence') ||
      q.includes('predict admissions') ||
      q.includes('underutilized') ||
      q.includes('optimize timetable') ||
      q.includes('optimise timetable') ||
      q.includes('suggest solution') ||
      q.includes('root cause')
    ) {
      const decisionRes = DecisionIntelligenceEngine.processDecisionQuery(query);
      return {
        routedAgent: 'PrincipalAgent',
        agentDescription: 'Executive AI Decision Support Engine',
        intent: 'decision_intelligence_query',
        actions: [
          'InvokeDecisionIntelligenceEngine()',
          'ExecuteMultiTurnReasoning()',
          'SynthesizeImpactPrediction()',
        ],
        toolExecutions: [
          {
            toolName: 'RunDecisionIntelligenceModel',
            args: { query, role: currentRole },
            status: 'SUCCESS',
            result: decisionRes.analysis || { status: 'COMPLETE', summary: decisionRes.response }
          }
        ],
        response: decisionRes.response,
        actionableLink: '/decision-intelligence',
      };
    }

    // 1. Leave Application & Attendance Absence Intent
    if (q.includes("won't be able") || q.includes("cannot attend") || q.includes("leave") || q.includes("absent")) {
      const toolExec1 = AgentTools.SubmitLeaveApplication({
        studentId: '2026CSE001',
        startDate: 'Tomorrow',
        endDate: 'Next Day',
        reason: query,
      });

      const toolExec2 = AgentTools.NotifyAdvisor({
        studentId: '2026CSE001',
        note: `Student filed leave: "${query}"`,
      });

      return {
        routedAgent: 'StudentAgent',
        agentDescription: 'Student Operations & Leave Management Agent',
        intent: 'submit_leave_application',
        actions: [
          'ParseLeaveReason(UserPrompt)',
          'SubmitLeaveApplication(Student: 2026CSE001)',
          'NotifyAdvisor(Dr. Arindam Sen)',
          'ReturnStatus(SUBMITTED_TO_ADVISOR)',
        ],
        toolExecutions: [toolExec1, toolExec2],
        response: `I have generated your leave application and submitted it directly to your Faculty Advisor (Dr. Arindam Sen) for approval.\n\nApplication ID: ${toolExec1.result.applicationId}\nStatus: SUBMITTED_TO_ADVISOR\nParent SMS Notification: Dispatched`,
        actionableLink: '/faculty',
      };
    }

    // 2. Room Booking Intent ("Book Lab 3 tomorrow", "Reserve LHC-204")
    if (q.includes("book") || q.includes("reserve") || q.includes("room reservation")) {
      const roomMatch = query.match(/(lab[- ]?\d+|lhc[- ]?\d+|room[- ]?\d+)/i);
      const targetRoom = roomMatch ? roomMatch[0].toUpperCase() : 'Lab-3';

      const toolExec = AgentTools.ReserveRoom({
        room: targetRoom,
        date: q.includes('tomorrow') ? 'Tomorrow' : 'Today',
        timeSlot: '02:00 PM - 04:00 PM',
        reason: 'Project work & Lab testing',
      });

      return {
        routedAgent: 'TimetableAgent',
        agentDescription: 'Timetable & Room Scheduling Agent',
        intent: 'reserve_room',
        actions: [
          `FindVacantSlot(${targetRoom})`,
          `ReserveRoom(Room: ${targetRoom}, Slot: 2:00 PM)`,
          'UpdateRoomAllocationRegistry()',
        ],
        toolExecutions: [toolExec],
        response: `I have reserved **${targetRoom}** for ${q.includes('tomorrow') ? 'tomorrow' : 'today'} at 02:00 PM.\n\nReservation Code: **${toolExec.result.reservationId}**\nStatus: CONFIRMED\nDigital Keycard: Active in your student pass.`,
        actionableLink: '/timetable',
      };
    }

    // 3. Find Vacant Classroom ("Find an empty classroom")
    if (q.includes("empty classroom") || q.includes("vacant room") || q.includes("available room")) {
      const toolExec = AgentTools.FindAvailableRoom({ building: 'Block A' });
      return {
        routedAgent: 'TimetableAgent',
        agentDescription: 'Classroom Occupancy & Space Finder Agent',
        intent: 'find_available_room',
        actions: [
          'QueryCCTVSpaceSensors()',
          'FindAvailableRoom(Building: Block A)',
          'FilterVacantSlots()',
        ],
        toolExecutions: [toolExec],
        response: `Found 3 vacant classrooms right now:\n1. **LHC-204** (Block A, Capacity: 60) - Recommended\n2. **Lab-3** (Block A, Capacity: 40)\n3. **Room B-302** (Block B, Capacity: 45)\n\nWould you like me to book LHC-204 for your study group?`,
        actionableLink: '/map',
      };
    }

    // 4. Generate Attendance Report ("Generate today's attendance report")
    if (q.includes("generate") && (q.includes("attendance report") || q.includes("report"))) {
      const toolExec = AgentTools.GenerateAttendanceReport({ courseId: 'B.Tech CSE', threshold: 75 });
      return {
        routedAgent: 'AttendanceAgent',
        agentDescription: 'Attendance & Biometrics Operations Agent',
        intent: 'generate_attendance_report',
        actions: [
          'QueryClassroomCCTVLogs()',
          'CalculateAttendancePercentages()',
          'GenerateAttendanceReport(Course: B.Tech CSE)',
          'FlagShortageStudents(Threshold: 75%)',
        ],
        toolExecutions: [toolExec],
        response: `Daily attendance audit complete for **B.Tech CSE**:\n• Total Students Scanned: 48\n• Verified Present: 45 (93.8% class rate)\n• Shortage Flagged (< 75%): 3 Students (Rishi Sharma, Ananya Roy, Vikram Patel)\n\nOfficial PDF audit report logged to Registrar Portal.`,
        actionableLink: '/reports',
      };
    }

    // 5. Email Professor ("Email my professor")
    if (q.includes("email my professor") || q.includes("email professor") || q.includes("contact advisor")) {
      const toolExec = AgentTools.SendEmail({
        to: 'arindam.sen@campusos.edu',
        subject: 'Student Inquiry - Rishi Sharma (2026CSE001)',
        body: 'Dear Dr. Arindam Sen, I am writing to request a brief meeting regarding project guidance during your office hours.',
      });

      return {
        routedAgent: 'FacultyAgent',
        agentDescription: 'Faculty Communication & Mentorship Agent',
        intent: 'send_email_professor',
        actions: [
          'LookupFacultyAdvisor(Dr. Arindam Sen)',
          'ComposeEmailDraft()',
          'SendEmail(Recipient: arindam.sen@campusos.edu)',
        ],
        toolExecutions: [toolExec],
        response: `Dispatched an email to your Faculty Advisor **Dr. Arindam Sen** (\`arindam.sen@campusos.edu\`):\n\nSubject: Student Inquiry - Rishi Sharma (2026CSE001)\nStatus: DISPATCHED ✓`,
        actionableLink: '/faculty',
      };
    }

    // 6. Deep Attendance Recovery Analysis ("Show my attendance", "Why is attendance below 75%?")
    if (q.includes("show my attendance") || q.includes("attendance drop")) {
      const toolExec1 = AgentTools.CalculateAttendanceRecovery({ currentRate: 68.2, totalSessions: 14, targetRate: 75 });
      const toolExec2 = AgentTools.NotifyAdvisor({ studentId: '2026CSE001', note: 'Attendance recovery calculation requested' });

      return {
        routedAgent: 'AttendanceAgent',
        agentDescription: 'Attendance Anomaly & Recovery Agent',
        intent: 'attendance_analysis_recovery',
        actions: [
          'QueryAttendanceDatabase(Student: 2026CSE001)',
          'CalculatePercentage(EC308: 68.2%)',
          'CheckEligibilityThreshold(Required: 75%)',
          'CalculateAttendanceRecovery(Current: 68.2%, Target: 75%)',
          'NotifyAdvisor(Dr. Arindam Sen)',
        ],
        toolExecutions: [toolExec1, toolExec2],
        response: `Attendance Deep Analysis for **Rishi Sharma**:\n• Overall Aggregate: 92.5%\n• Subject Shortage Flagged: Digital Communications (EC308) at **68.2%** (4 missed lab sessions out of 14).\n\n🎯 **Recovery Action Plan**:\nTo reach the required 75% threshold before mid-semester exams, you must attend the next **${toolExec1.result.requiredConsecutiveClasses} consecutive classes** without absence.\n\nI have notified your advisor Dr. Arindam Sen to log your medical waiver if applicable.`,
        actionableLink: '/attendance',
      };
    }

    // 7. RAG Document Grounded Queries ("Can I register late for exams?", "Fee refund rules", etc.)
    const ragCitations = searchRAGKnowledgeBase(query);
    if (ragCitations.length > 0) {
      const topCitation = ragCitations[0].document;
      const toolExec = AgentTools.QueryRAGDocuments({ query });

      let agentName: SubAgentRole = 'StudentAgent';
      if (topCitation.category === 'Exams' || topCitation.category === 'Regulations') agentName = 'PrincipalAgent';
      if (topCitation.category === 'Fees') agentName = 'FinanceAgent';
      if (topCitation.category === 'Hostel') agentName = 'StudentAgent';
      if (topCitation.category === 'Faculty') agentName = 'FacultyAgent';
      if (topCitation.category === 'Map') agentName = 'TimetableAgent';

      return {
        routedAgent: agentName,
        agentDescription: `Document RAG Retrieval Agent (${topCitation.category})`,
        intent: 'rag_document_query',
        actions: [
          `SearchRAGKnowledgeBase(Query: "${query}")`,
          `RetrieveGroundedPassage(Source: ${topCitation.title})`,
          `SynthesizeAnswer()`,
        ],
        toolExecutions: [toolExec],
        citations: ragCitations,
        response: `According to **${topCitation.title}** (${topCitation.section}):\n\n"${topCitation.content}"\n\n*[Answer grounded strictly in official university documents]*`,
        actionableLink: topCitation.category === 'Fees' ? '/fees' : topCitation.category === 'Exams' ? '/examinations' : '/doc-center',
      };
    }

    // Fallback default routing
    // Sanitize user input before echoing — strip HTML tags and limit length
    const safeQuery = query.replace(/<[^>]*>/g, '').replace(/[<>"']/g, '').slice(0, 80);
    return {
      routedAgent: 'StudentAgent',
      agentDescription: 'Campus Operations General Agent',
      intent: 'general_inquiry',
      actions: [
        'ParseUserQuery(UserInput)',
        'SearchCampusDatabase()',
        'SynthesizeResponse()',
      ],
      toolExecutions: [],
      response: `I have processed your campus request. All campus systems are operating normally. Let me know if you would like me to book a classroom, submit a leave application, or check exam regulations!`,
    };
  }
}

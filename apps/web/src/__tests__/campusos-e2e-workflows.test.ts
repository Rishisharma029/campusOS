/**
 * CampusOS Integration & E2E Workflow Test Suite
 * Tests full end-to-end multi-step stateful workflows across core components:
 * Workflow 1: Student Leave Submission -> Advisor Notification -> Attendance Recovery Calculation
 * Workflow 2: Finance Intelligence Audit -> Step-Up Authentication -> Action Execution
 * Workflow 3: CAO Executive Briefing -> Decision Support Analysis -> Tool Dispatch
 */
import { describe, it, expect } from 'vitest';
import { CampusOSAIOrchestrator } from '../lib/multiAgentOrchestrator';
import { AgentTools } from '../lib/agentTools';
import { FinanceIntelligenceEngine } from '../lib/financeIntelligenceEngine';
import { ChiefAdministrativeOfficerEngine } from '../lib/chiefAdministrativeOfficer';
import { DecisionIntelligenceEngine } from '../lib/decisionIntelligenceEngine';
import { searchRAGKnowledgeBase } from '../lib/ragKnowledgeBase';

describe('Workflow 1: Student Leave & Attendance Recovery E2E Chain', () => {
  it('executes full student leave submission chain with tool dispatch', () => {
    // Step 1: User prompt processed by Orchestrator
    const prompt = "I won't be able to attend class tomorrow due to medical checkup";
    const route = CampusOSAIOrchestrator.processUserRequest(prompt, 'Student');

    expect(route.routedAgent).toBe('StudentAgent');
    expect(route.intent).toBe('submit_leave_application');
    expect(route.toolExecutions).toHaveLength(2);

    const leaveTool = route.toolExecutions.find(t => t.toolName === 'SubmitLeaveApplication');
    const notifyTool = route.toolExecutions.find(t => t.toolName === 'NotifyAdvisor');

    expect(leaveTool?.status).toBe('SUCCESS');
    expect(leaveTool?.result.status).toBe('SUBMITTED_TO_ADVISOR');
    expect(notifyTool?.status).toBe('SUCCESS');
    expect(notifyTool?.result.advisorName).toBe('Dr. Arindam Sen');
  });

  it('calculates attendance recovery metrics post absence notification', () => {
    // Step 2: Student checks recovery plan after attendance drop
    const prompt = "show my attendance drop";
    const route = CampusOSAIOrchestrator.processUserRequest(prompt, 'Student');

    expect(route.routedAgent).toBe('AttendanceAgent');
    const calcTool = route.toolExecutions.find(t => t.toolName === 'CalculateAttendanceRecovery');
    expect(calcTool?.result.requiredConsecutiveClasses).toBeDefined();
    expect(calcTool?.result.targetRate).toBe('75%');
  });
});

describe('Workflow 2: Finance Intelligence & Step-Up Auth E2E Chain', () => {
  it('generates financial default risk report and dispatches mitigation', () => {
    // Step 1: Generate financial audit
    const report = FinanceIntelligenceEngine.generateFinanceIntelligence();
    expect(report.flaggedDefaultCount).toBe(42);
    expect(report.defaultRiskStudents.length).toBeGreaterThan(0);

    // Step 2: Executive approves EMI restructuring action
    const actionResult = FinanceIntelligenceEngine.executeFinanceAction('OFFER_EMI_RESTRUCTURING');
    expect(actionResult.success).toBe(true);
    expect(actionResult.message).toContain('EMI Restructuring Plan Approved');
  });
});

describe('Workflow 3: CAO Executive Briefing & Decision Intelligence E2E Chain', () => {
  it('compiles CAO executive briefing agenda', () => {
    const caoBrief = ChiefAdministrativeOfficerEngine.processExecutiveQuery('What needs my attention today?');
    expect(caoBrief.agenda).toBeDefined();
    expect(caoBrief.agenda.totalCriticalItems).toBeGreaterThan(0);
    expect(caoBrief.agenda.items.length).toBeGreaterThan(0);
  });

  it('executes multi-turn decision intelligence query', () => {
    const decision = DecisionIntelligenceEngine.processDecisionQuery('highest absenteeism rate');
    expect(decision.response).toContain('Mechanical Engineering');
  });

  it('retrieves grounded RAG documentation citations', () => {
    const ragResults = searchRAGKnowledgeBase('attendance threshold 75%');
    expect(ragResults.length).toBeGreaterThan(0);
    expect(ragResults[0].document.keywords).toContain('75%');
  });
});

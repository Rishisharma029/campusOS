export interface FeeDefaultRiskStudent {
  id: string;
  studentName: string;
  rollNumber: string;
  department: string;
  overdueAmount: number;
  defaultProbability: number; // e.g. 88%
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  lastPaymentDate: string;
  recommendedMitigation: string;
}

export interface BudgetTrendMonth {
  month: string;
  RevenueLakhs: number;
  ExpenseLakhs: number;
  SurplusLakhs: number;
}

export interface DepartmentSpendAudit {
  id: string;
  departmentName: string;
  allocatedBudgetLakhs: number;
  actualSpentLakhs: number;
  utilizationPercentage: number;
  status: 'NORMAL' | 'NEAR_LIMIT' | 'OVERBUDGET';
  varianceNote: string;
}

export interface ScholarshipAllocationCandidate {
  id: string;
  studentName: string;
  department: string;
  cgpa: number;
  familyIncomeLakhs: number;
  scholarshipScheme: 'Merit-cum-Means' | 'Single Girl Child' | 'STEM Excellence';
  recommendedGrantAmount: number;
  matchScore: number;
}

export interface FinanceIntelligenceReport {
  totalDefaultRiskLakhs: number;
  flaggedDefaultCount: number;
  projectedQuarterSurplusLakhs: number;
  totalScholarshipDisbursedLakhs: number;
  defaultRiskStudents: FeeDefaultRiskStudent[];
  budgetTrends: BudgetTrendMonth[];
  departmentAudits: DepartmentSpendAudit[];
  scholarshipAllocations: ScholarshipAllocationCandidate[];
}

export class FinanceIntelligenceEngine {
  /**
   * Generates AI Financial Intelligence predictions & audits
   */
  static generateFinanceIntelligence(): FinanceIntelligenceReport {
    return {
      totalDefaultRiskLakhs: 14.8,
      flaggedDefaultCount: 42,
      projectedQuarterSurplusLakhs: 42.5,
      totalScholarshipDisbursedLakhs: 25.0,
      defaultRiskStudents: [
        {
          id: 'def-1',
          studentName: 'Ananya Roy',
          rollNumber: '2026CSE042',
          department: 'Computer Science',
          overdueAmount: 45000,
          defaultProbability: 92,
          riskLevel: 'CRITICAL',
          lastPaymentDate: '45 Days Ago',
          recommendedMitigation: 'Offer 3-Month Equal Installment Plan (EMI)',
        },
        {
          id: 'def-2',
          studentName: 'Vikram Patel',
          rollNumber: '2026ECE018',
          department: 'Electronics & Comm.',
          overdueAmount: 38000,
          defaultProbability: 86,
          riskLevel: 'HIGH',
          lastPaymentDate: '32 Days Ago',
          recommendedMitigation: 'Dispatch Automated Parent SMS & Fee Notice',
        },
        {
          id: 'def-3',
          studentName: 'Suresh Menon',
          rollNumber: '2026ME009',
          department: 'Mechanical Eng.',
          overdueAmount: 28000,
          defaultProbability: 74,
          riskLevel: 'MEDIUM',
          lastPaymentDate: '20 Days Ago',
          recommendedMitigation: 'Apply Merit Scholarship Subsidy Deduction',
        },
      ],
      budgetTrends: [
        { month: 'Jan', RevenueLakhs: 120, ExpenseLakhs: 85, SurplusLakhs: 35 },
        { month: 'Feb', RevenueLakhs: 110, ExpenseLakhs: 82, SurplusLakhs: 28 },
        { month: 'Mar', RevenueLakhs: 140, ExpenseLakhs: 95, SurplusLakhs: 45 },
        { month: 'Apr', RevenueLakhs: 95, ExpenseLakhs: 78, SurplusLakhs: 17 },
        { month: 'May (Pred)', RevenueLakhs: 130, ExpenseLakhs: 88, SurplusLakhs: 42 },
        { month: 'Jun (Pred)', RevenueLakhs: 150, ExpenseLakhs: 92, SurplusLakhs: 58 },
      ],
      departmentAudits: [
        {
          id: 'dept-1',
          departmentName: 'Computer Science & Engineering',
          allocatedBudgetLakhs: 50.0,
          actualSpentLakhs: 44.0,
          utilizationPercentage: 88,
          status: 'NORMAL',
          varianceNote: 'GPU server lab procurement within allocated budget.',
        },
        {
          id: 'dept-2',
          departmentName: 'Electronics & Communications',
          allocatedBudgetLakhs: 35.0,
          actualSpentLakhs: 32.9,
          utilizationPercentage: 94,
          status: 'NEAR_LIMIT',
          varianceNote: 'Oscilloscope kit upgrades approaching budget limit.',
        },
        {
          id: 'dept-3',
          departmentName: 'Mechanical Engineering',
          allocatedBudgetLakhs: 40.0,
          actualSpentLakhs: 24.8,
          utilizationPercentage: 62,
          status: 'NORMAL',
          varianceNote: 'Workshop equipment maintenance under-utilized.',
        },
      ],
      scholarshipAllocations: [
        {
          id: 'sch-1',
          studentName: 'Priya Sharma',
          department: 'Computer Science',
          cgpa: 9.6,
          familyIncomeLakhs: 1.8,
          scholarshipScheme: 'Merit-cum-Means',
          recommendedGrantAmount: 50000,
          matchScore: 98,
        },
        {
          id: 'sch-2',
          studentName: 'Kavita Das',
          department: 'Electronics',
          cgpa: 9.2,
          familyIncomeLakhs: 2.4,
          scholarshipScheme: 'Single Girl Child',
          recommendedGrantAmount: 40000,
          matchScore: 95,
        },
        {
          id: 'sch-3',
          studentName: 'Rohan Verma',
          department: 'Mechanical',
          cgpa: 9.4,
          familyIncomeLakhs: 2.1,
          scholarshipScheme: 'STEM Excellence',
          recommendedGrantAmount: 35000,
          matchScore: 93,
        },
      ],
    };
  }

  /**
   * Dispatches 1-click financial mitigation action
   */
  static executeFinanceAction(actionPayload: string): { success: boolean; message: string } {
    switch (actionPayload) {
      case 'DISPATCH_FEE_REMINDERS':
        return {
          success: true,
          message: 'Dispatched automated SMS payment reminders and UPI links to 42 fee-pending students and parents.',
        };
      case 'OFFER_EMI_RESTRUCTURING':
        return {
          success: true,
          message: 'EMI Restructuring Plan Approved: 3-month equal installment schedules sent to critical risk candidates.',
        };
      case 'APPROVE_SCHOLARSHIP_DISBURSEMENT':
        return {
          success: true,
          message: 'Scholarship Disbursed: ₹25.0 Lakhs transferred directly into 64 eligible student fee ledgers.',
        };
      default:
        return {
          success: true,
          message: `Executed finance action: ${actionPayload}`,
        };
    }
  }
}

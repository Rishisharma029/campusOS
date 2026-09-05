/**
 * GENOVA CampusOS AI — Institution Intelligence Engine
 * 
 * Fulfills SIH26044 requirement for Institutional & Administrative Analytics:
 * 1. STUDENT READINESS: 76% (Macro university aggregate)
 * 2. TOP SKILL GAPS:
 *    - DSA: 1,240 students
 *    - Cloud: 860 students
 *    - AI/ML: 720 students
 *    - Communication: 610 students
 * 3. INTERNSHIP CONVERSION:
 *    - 1,284 applications
 *    - 423 selected
 * 4. PLACEMENT METRICS:
 *    - Readiness: 74%
 *    - Placement: 81%
 * 5. INDUSTRY DEMAND SURGE:
 *    - Python: ↑ 18%
 *    - Cloud: ↑ 24%
 *    - AI/ML: ↑ 31%
 *    - React: ↑ 12%
 *    - Cybersecurity: ↑ 27%
 */

export interface DepartmentReadiness {
  department: string;
  readinessPercentage: number;
  enrolledStudents: number;
  topGap: string;
}

export interface SkillGapItem {
  id: string;
  skillName: string;
  affectedStudentsCount: number;
  percentageOfCohort: number;
  severity: 'Critical' | 'Moderate' | 'High';
  recommendedIntervention: string;
  remedialDeployed: boolean;
}

export interface InternshipConversionStats {
  totalApplications: number;
  selectedCandidates: number;
  shortlistedCount: number;
  interviewScheduledCount: number;
  completedInternships: number;
  selectionRatePercentage: number;
  activeIndustryMentors: number;
}

export interface PlacementOutcomeStats {
  readinessPercentage: number;
  finalPlacementPercentage: number;
  totalEligibleStudents: number;
  placedStudentsCount: number;
  highestPackageLpa: number;
  averagePackageLpa: number;
  medianPackageLpa: number;
  activeHiringPartners: number;
}

export interface IndustryDemandTrendItem {
  skill: string;
  growthPercentage: number; // e.g. 18 for +18%
  activeMarketOpenings: number;
  demandCategory: 'Core Programming' | 'Cloud & DevOps' | 'Artificial Intelligence' | 'Frontend Systems' | 'Security & Infrastructure';
  quarterlyTrajectory: { quarter: string; demandIndex: number }[];
}

export interface CohortYearHeatmapRow {
  skill: string;
  category: 'Core' | 'Algorithms' | 'Cloud' | 'Soft Skills' | 'Specialized';
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  benchmark: number; // e.g. 75%
  status: 'Mastered' | 'Lagging' | 'Deficient' | 'Competent';
}

export interface PrescriptiveDecisionInsight {
  id: string;
  recommendationQuote: string;
  impactedStudentsCount: number;
  criticalWindowReason: string;
  suggestedActionTitle: string;
  executed: boolean;
}

export interface InstitutionIntelligenceData {
  macroStudentReadiness: number; // 76%
  departmentReadiness: DepartmentReadiness[];
  topSkillGaps: SkillGapItem[];
  internshipStats: InternshipConversionStats;
  placementStats: PlacementOutcomeStats;
  industryDemandTrends: IndustryDemandTrendItem[];
  cohortHeatmap: CohortYearHeatmapRow[];
  prescriptiveInsight: PrescriptiveDecisionInsight;
  lastUpdated: string;
}

export const DEFAULT_INTELLIGENCE_DATA: InstitutionIntelligenceData = {
  macroStudentReadiness: 76,
  departmentReadiness: [
    { department: 'Computer Science & Engineering', readinessPercentage: 82, enrolledStudents: 640, topGap: 'System Design' },
    { department: 'Information Technology', readinessPercentage: 78, enrolledStudents: 420, topGap: 'Cloud Architecture' },
    { department: 'Electronics & Communication', readinessPercentage: 72, enrolledStudents: 380, topGap: 'DSA' },
    { department: 'Mechanical & Automation', readinessPercentage: 68, enrolledStudents: 290, topGap: 'Python & AI' },
    { department: 'Civil & Infrastructure', readinessPercentage: 65, enrolledStudents: 210, topGap: 'GIS & Spatial Data' }
  ],
  topSkillGaps: [
    {
      id: 'gap-dsa',
      skillName: 'DSA (Data Structures & Algorithms)',
      affectedStudentsCount: 1240,
      percentageOfCohort: 64,
      severity: 'Critical',
      recommendedIntervention: '4-Week Intensive LeetCode & Algorithmic Rig (Arrays, Trees, Dynamic Programming)',
      remedialDeployed: false
    },
    {
      id: 'gap-cloud',
      skillName: 'Cloud (AWS / GCP / Docker / DevOps)',
      affectedStudentsCount: 860,
      percentageOfCohort: 44,
      severity: 'High',
      recommendedIntervention: 'AWS Solutions Architect & Containerization Cloud Sandboxes',
      remedialDeployed: false
    },
    {
      id: 'gap-aiml',
      skillName: 'AI/ML (PyTorch / TensorRT / Computer Vision)',
      affectedStudentsCount: 720,
      percentageOfCohort: 37,
      severity: 'High',
      recommendedIntervention: 'NVIDIA Jetson Orin Edge AI & Model Optimization Cohort',
      remedialDeployed: true
    },
    {
      id: 'gap-comm',
      skillName: 'Communication & Behavioral Soft Skills',
      affectedStudentsCount: 610,
      percentageOfCohort: 31,
      severity: 'Moderate',
      recommendedIntervention: 'AI Voice Mock Interview Simulator & Corporate Case Study Workshops',
      remedialDeployed: false
    }
  ],
  internshipStats: {
    totalApplications: 1284,
    selectedCandidates: 423,
    shortlistedCount: 680,
    interviewScheduledCount: 512,
    completedInternships: 318,
    selectionRatePercentage: 32.9,
    activeIndustryMentors: 142
  },
  placementStats: {
    readinessPercentage: 74,
    finalPlacementPercentage: 81,
    totalEligibleStudents: 1450,
    placedStudentsCount: 1180,
    highestPackageLpa: 44.5,
    averagePackageLpa: 11.8,
    medianPackageLpa: 9.6,
    activeHiringPartners: 118
  },
  industryDemandTrends: [
    {
      skill: 'Python',
      growthPercentage: 18,
      activeMarketOpenings: 1840,
      demandCategory: 'Core Programming',
      quarterlyTrajectory: [
        { quarter: 'Q1', demandIndex: 68 },
        { quarter: 'Q2', demandIndex: 74 },
        { quarter: 'Q3', demandIndex: 81 },
        { quarter: 'Q4 (Est.)', demandIndex: 88 }
      ]
    },
    {
      skill: 'Cloud',
      growthPercentage: 24,
      activeMarketOpenings: 1420,
      demandCategory: 'Cloud & DevOps',
      quarterlyTrajectory: [
        { quarter: 'Q1', demandIndex: 62 },
        { quarter: 'Q2', demandIndex: 71 },
        { quarter: 'Q3', demandIndex: 83 },
        { quarter: 'Q4 (Est.)', demandIndex: 92 }
      ]
    },
    {
      skill: 'AI/ML',
      growthPercentage: 31,
      activeMarketOpenings: 1690,
      demandCategory: 'Artificial Intelligence',
      quarterlyTrajectory: [
        { quarter: 'Q1', demandIndex: 58 },
        { quarter: 'Q2', demandIndex: 72 },
        { quarter: 'Q3', demandIndex: 90 },
        { quarter: 'Q4 (Est.)', demandIndex: 99 }
      ]
    },
    {
      skill: 'React',
      growthPercentage: 12,
      activeMarketOpenings: 1150,
      demandCategory: 'Frontend Systems',
      quarterlyTrajectory: [
        { quarter: 'Q1', demandIndex: 70 },
        { quarter: 'Q2', demandIndex: 75 },
        { quarter: 'Q3', demandIndex: 79 },
        { quarter: 'Q4 (Est.)', demandIndex: 84 }
      ]
    },
    {
      skill: 'Cybersecurity',
      growthPercentage: 27,
      activeMarketOpenings: 890,
      demandCategory: 'Security & Infrastructure',
      quarterlyTrajectory: [
        { quarter: 'Q1', demandIndex: 55 },
        { quarter: 'Q2', demandIndex: 66 },
        { quarter: 'Q3', demandIndex: 79 },
        { quarter: 'Q4 (Est.)', demandIndex: 89 }
      ]
    }
  ],
  cohortHeatmap: [
    { skill: 'Python', category: 'Core', year1: 82, year2: 88, year3: 91, year4: 94, benchmark: 80, status: 'Mastered' },
    { skill: 'DSA', category: 'Algorithms', year1: 48, year2: 54, year3: 61, year4: 67, benchmark: 75, status: 'Lagging' },
    { skill: 'Cloud', category: 'Cloud', year1: 31, year2: 38, year3: 49, year4: 58, benchmark: 70, status: 'Deficient' },
    { skill: 'Communication', category: 'Soft Skills', year1: 74, year2: 78, year3: 81, year4: 85, benchmark: 75, status: 'Competent' },
    { skill: 'AI/ML', category: 'Specialized', year1: 42, year2: 56, year3: 73, year4: 82, benchmark: 75, status: 'Competent' },
    { skill: 'React / Web', category: 'Core', year1: 65, year2: 74, year3: 84, year4: 89, benchmark: 75, status: 'Mastered' },
    { skill: 'System Design', category: 'Specialized', year1: 28, year2: 41, year3: 59, year4: 71, benchmark: 70, status: 'Lagging' }
  ],
  prescriptiveInsight: {
    id: 'rec-dsa-cloud-y23',
    recommendationQuote: 'The university should prioritize DSA + Cloud training for second- and third-year students.',
    impactedStudentsCount: 920,
    criticalWindowReason: 'Cross-sectional analysis reveals DSA proficiency plateaus at 54% (2nd Year) and 61% (3rd Year), falling significantly short of the 75% industry recruitment benchmark. Concurrently, Cloud proficiency lags drastically at 38% (2nd Year) and 49% (3rd Year). Second and third-year cohorts represent the critical corrective window prior to final-year corporate placement drives.',
    suggestedActionTitle: 'Auto-Schedule 2nd & 3rd Year DSA + Cloud Intensive Bootcamp',
    executed: false
  },
  lastUpdated: 'Live Campus Stream • Sep 05, 2026'
};

export class InstitutionIntelligenceEngine {
  private static STORAGE_KEY = 'genova_institution_intelligence_data';

  public static getIntelligence(): InstitutionIntelligenceData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_INTELLIGENCE_DATA,
          ...parsed,
          cohortHeatmap: Array.isArray(parsed.cohortHeatmap) && parsed.cohortHeatmap.length > 0 
            ? parsed.cohortHeatmap 
            : DEFAULT_INTELLIGENCE_DATA.cohortHeatmap,
          prescriptiveInsight: parsed.prescriptiveInsight && parsed.prescriptiveInsight.recommendationQuote
            ? { ...DEFAULT_INTELLIGENCE_DATA.prescriptiveInsight, ...parsed.prescriptiveInsight }
            : DEFAULT_INTELLIGENCE_DATA.prescriptiveInsight,
          topSkillGaps: Array.isArray(parsed.topSkillGaps) && parsed.topSkillGaps.length > 0
            ? parsed.topSkillGaps
            : DEFAULT_INTELLIGENCE_DATA.topSkillGaps,
          departmentReadiness: Array.isArray(parsed.departmentReadiness) && parsed.departmentReadiness.length > 0
            ? parsed.departmentReadiness
            : DEFAULT_INTELLIGENCE_DATA.departmentReadiness,
          industryDemandTrends: Array.isArray(parsed.industryDemandTrends) && parsed.industryDemandTrends.length > 0
            ? parsed.industryDemandTrends
            : DEFAULT_INTELLIGENCE_DATA.industryDemandTrends,
          internshipStats: parsed.internshipStats || DEFAULT_INTELLIGENCE_DATA.internshipStats,
          placementStats: parsed.placementStats || DEFAULT_INTELLIGENCE_DATA.placementStats
        };
      }
    } catch {}
    return DEFAULT_INTELLIGENCE_DATA;
  }

  public static deployRemedialIntervention(gapId: string): InstitutionIntelligenceData {
    const data = this.getIntelligence();
    const target = data.topSkillGaps.find(g => g.id === gapId);
    if (target) {
      target.remedialDeployed = true;
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      } catch {}
    }
    return data;
  }

  public static executePrescriptivePolicyAction(): InstitutionIntelligenceData {
    const data = this.getIntelligence();
    if (!data.prescriptiveInsight) {
      data.prescriptiveInsight = { ...DEFAULT_INTELLIGENCE_DATA.prescriptiveInsight };
    }
    data.prescriptiveInsight.executed = true;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {}
    return data;
  }
}

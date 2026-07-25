export interface SkillGapItem {
  skill: string;
  category: 'SystemDesign' | 'Infrastructure' | 'Database' | 'Security';
  priority: 'CRITICAL' | 'MEDIUM';
  rationale: string;
}

export interface RecommendedCertification {
  id: string;
  title: string;
  provider: string;
  duration: string;
  salaryImpact: string;
  courseUrl: string;
}

export interface TargetCompany {
  id: string;
  category: 'DREAM' | 'TARGET' | 'SAFE';
  name: string;
  logo: string;
  maxPackage: string;
  matchScore: number; // e.g. 95%
  hiringStatus: 'DRIVE_OPEN' | 'UPCOMING' | 'APPLICATIONS_CLOSED';
  rolesHiring: string[];
}

export interface PlacementIntelligenceReport {
  studentId: string;
  studentName: string;
  cgpa: number;
  placementProbability: number; // e.g. 94%
  projectedPackageRange: string; // e.g. "₹18.0 LPA - ₹24.0 LPA"
  atsResumeScore: number; // e.g. 91%
  masteredSkills: string[];
  skillGaps: SkillGapItem[];
  recommendedCertifications: RecommendedCertification[];
  targetCompanies: TargetCompany[];
}

export class PlacementIntelligenceEngine {
  /**
   * Generates AI Placement Intelligence analysis for a candidate
   */
  static analyzeCandidatePlacement(studentId: string = '2026CSE001'): PlacementIntelligenceReport {
    return {
      studentId,
      studentName: 'Rishi Sharma',
      cgpa: 9.4,
      placementProbability: 94,
      projectedPackageRange: '₹18.0 LPA - ₹24.0 LPA',
      atsResumeScore: 91,
      masteredSkills: [
        'React 19',
        'TypeScript',
        'Python',
        'Data Structures & Algorithms',
        'Express / Node.js',
        'Prisma ORM',
        'PostgreSQL',
      ],
      skillGaps: [
        {
          skill: 'System Design (HLD & LLD)',
          category: 'SystemDesign',
          priority: 'CRITICAL',
          rationale: 'Required for Tier-1 Google & Microsoft System Architecture rounds.',
        },
        {
          skill: 'Distributed Caching (Redis Cluster)',
          category: 'Database',
          priority: 'MEDIUM',
          rationale: 'High demand in Atlassian & Amazon high-throughput microservices.',
        },
        {
          skill: 'Kubernetes & Docker Orchestration',
          category: 'Infrastructure',
          priority: 'MEDIUM',
          rationale: 'Prerequisite for DevOps & Cloud Systems Software Engineer roles.',
        },
      ],
      recommendedCertifications: [
        {
          id: 'cert-1',
          title: 'AWS Certified Solutions Architect – Associate',
          provider: 'Amazon Web Services',
          duration: '4 Weeks (Self-Paced)',
          salaryImpact: '+14% Expected CTC Boost',
          courseUrl: 'https://aws.amazon.com/certification',
        },
        {
          id: 'cert-2',
          title: 'CKA: Certified Kubernetes Administrator',
          provider: 'Cloud Native Computing Foundation (CNCF)',
          duration: '6 Weeks',
          salaryImpact: '+18% Cloud Engineering CTC',
          courseUrl: 'https://cncf.io/certification/cka',
        },
        {
          id: 'cert-3',
          title: 'HashiCorp Certified: Terraform Associate',
          provider: 'HashiCorp',
          duration: '3 Weeks',
          salaryImpact: '+10% Infrastructure CTC',
          courseUrl: 'https://hashicorp.com/certification',
        },
      ],
      targetCompanies: [
        // Dream Companies (Tier 1)
        {
          id: 'comp-1',
          category: 'DREAM',
          name: 'Google India',
          logo: 'G',
          maxPackage: '₹44.0 LPA',
          matchScore: 92,
          hiringStatus: 'DRIVE_OPEN',
          rolesHiring: ['Software Engineer I', 'AI/ML Systems Engineer'],
        },
        {
          id: 'comp-2',
          category: 'DREAM',
          name: 'Microsoft Research',
          logo: 'MS',
          maxPackage: '₹42.0 LPA',
          matchScore: 95,
          hiringStatus: 'DRIVE_OPEN',
          rolesHiring: ['Software Development Engineer', 'Cloud Architect'],
        },
        {
          id: 'comp-3',
          category: 'DREAM',
          name: 'Amazon Development Center',
          logo: 'AMZ',
          maxPackage: '₹38.0 LPA',
          matchScore: 91,
          hiringStatus: 'UPCOMING',
          rolesHiring: ['SDE-1 (Backend & AWS)'],
        },
        // Target Companies (Tier 2)
        {
          id: 'comp-4',
          category: 'TARGET',
          name: 'Atlassian',
          logo: 'ATL',
          maxPackage: '₹32.0 LPA',
          matchScore: 96,
          hiringStatus: 'DRIVE_OPEN',
          rolesHiring: ['Full Stack Engineer (React/TypeScript)'],
        },
        {
          id: 'comp-5',
          category: 'TARGET',
          name: 'Adobe Systems',
          logo: 'ADB',
          maxPackage: '₹28.0 LPA',
          matchScore: 94,
          hiringStatus: 'DRIVE_OPEN',
          rolesHiring: ['Product Engineer (Web Platform)'],
        },
        // Safe Companies (Tier 3)
        {
          id: 'comp-6',
          category: 'SAFE',
          name: 'TCS Digital',
          logo: 'TCS',
          maxPackage: '₹9.0 LPA',
          matchScore: 99,
          hiringStatus: 'DRIVE_OPEN',
          rolesHiring: ['Digital Developer Cadre'],
        },
      ],
    };
  }

  /**
   * Executes 1-click placement action
   */
  static executePlacementAction(actionPayload: string): { success: boolean; message: string } {
    switch (actionPayload) {
      case 'ENROLL_AWS_CERTIFICATION':
        return {
          success: true,
          message: 'Enrolled in AWS Certified Solutions Architect Pathway: Free vouchers and practice test access dispatched to your student portal.',
        };
      case 'TAILOR_RESUME_GOOGLE':
        return {
          success: true,
          message: 'AI Resume Tailored for Google India: Formatted ATS resume targeting Google SDE-1 principles. PDF downloaded.',
        };
      case 'LAUNCH_SYSTEM_DESIGN_MOCK':
        return {
          success: true,
          message: 'AI Voice System Design Mock Interview Session Initialized: Prepare your microphone to start HLD/LLD practice.',
        };
      default:
        return {
          success: true,
          message: `Executed placement action: ${actionPayload}`,
        };
    }
  }
}

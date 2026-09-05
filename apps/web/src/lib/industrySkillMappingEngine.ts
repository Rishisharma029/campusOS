/**
 * GENOVA CampusOS AI — Industry Skill Mapping & Cohort Comparison Engine
 * Converts raw industry requirements into standardized skill taxonomy profiles
 * and benchmarks every university student against them.
 */

export type SkillRequirementTier = 'REQUIRED' | 'PREFERRED';

export type SkillDomain = 
  | 'Frontend' 
  | 'Backend' 
  | 'Database' 
  | 'Architecture' 
  | 'DevOps & Cloud' 
  | 'Engineering Practices' 
  | 'Quality Assurance'
  | 'Robotics & Autonomy'
  | 'Data & AI';

export interface RawSkillInput {
  name: string;
  tier: SkillRequirementTier;
  minThreshold?: number; // default 60% for required, 50% for preferred
}

export interface IndustryRoleDefinition {
  id: string;
  title: string;
  companyName: string;
  industrySector: string;
  experienceLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Campus Fresher';
  compensationRange: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minCgpaCutoff: number;
  eligibleDepartments: string[];
  description: string;
  createdDate: string;
}

export interface StandardizedCompetency {
  canonicalId: string;
  skillName: string;
  domain: SkillDomain;
  tier: SkillRequirementTier;
  benchmarkThreshold: number; // 0 - 100
  weightPercentage: number;
  industryRationale: string;
  recommendedEvaluationMethod: 'Code Assessment' | 'Project Repo' | 'Aptitude' | 'System Architecture Interview';
}

export interface StandardizedSkillProfile {
  roleId: string;
  roleTitle: string;
  companyName: string;
  profileHash: string;
  standardizedAt: string;
  competencies: StandardizedCompetency[];
  requiredCount: number;
  preferredCount: number;
  totalEvaluationWeight: number;
}

export interface StudentSkillEvaluation {
  skillName: string;
  canonicalId: string;
  domain: SkillDomain;
  tier: SkillRequirementTier;
  studentScore: number;
  benchmarkThreshold: number;
  isMet: boolean;
  gapDelta: number; // 0 if met, or deficit percentage
  statusText: 'MET ✓' | 'GAP ⚠' | 'BONUS +' | 'ABSENT -';
}

export interface StudentCohortComparisonResult {
  studentId: string;
  name: string;
  rollNo: string;
  department: string;
  course: string;
  cgpa: number;
  year: number;
  attendanceRate: number;
  overallMatchScore: number; // 0 - 100
  requiredSkillsMet: number;
  requiredSkillsTotal: number;
  preferredSkillsMet: number;
  preferredSkillsTotal: number;
  verdict: 'Shortlist Ready' | 'Interview Pool' | 'Conditional Eligible' | 'Action Required (Gaps)';
  verdictColor: 'emerald' | 'blue' | 'amber' | 'rose';
  evaluations: StudentSkillEvaluation[];
  criticalGaps: string[];
  bonusStrengths: string[];
  cgpaEligible: boolean;
}

export interface CohortSkillMasterySummary {
  skillName: string;
  tier: SkillRequirementTier;
  domain: SkillDomain;
  cohortAverageScore: number;
  studentsPassingCount: number;
  studentsFailingCount: number;
  passPercentage: number;
  curriculumRecommendation: string;
}

export interface CohortMacroAnalytics {
  roleId: string;
  roleTitle: string;
  totalStudentsAnalyzed: number;
  shortlistReadyCount: number;
  interviewPoolCount: number;
  actionRequiredCount: number;
  averageCohortMatch: number;
  highestMatchScore: number;
  skillSummaries: CohortSkillMasterySummary[];
  curriculumInterventions: string[];
}

// Canonical Skill Taxonomy Database
const CANONICAL_TAXONOMY: Record<string, { domain: SkillDomain; canonicalName: string; defaultThreshold: number; rationale: string; evalMethod: any }> = {
  'react': {
    domain: 'Frontend',
    canonicalName: 'React.js',
    defaultThreshold: 65,
    rationale: 'Component lifecycles, virtual DOM, hooks architecture, and responsive state management.',
    evalMethod: 'Code Assessment'
  },
  'node.js': {
    domain: 'Backend',
    canonicalName: 'Node.js',
    defaultThreshold: 65,
    rationale: 'Asynchronous event loop, Express middleware, worker threads, and REST endpoint construction.',
    evalMethod: 'Code Assessment'
  },
  'nodejs': {
    domain: 'Backend',
    canonicalName: 'Node.js',
    defaultThreshold: 65,
    rationale: 'Asynchronous event loop, Express middleware, worker threads, and REST endpoint construction.',
    evalMethod: 'Code Assessment'
  },
  'sql': {
    domain: 'Database',
    canonicalName: 'SQL & Relational DBs',
    defaultThreshold: 60,
    rationale: 'Relational schema normalization, complex multi-table joins, indexing strategies, and ACID transactions.',
    evalMethod: 'Code Assessment'
  },
  'git': {
    domain: 'Engineering Practices',
    canonicalName: 'Git & Version Control',
    defaultThreshold: 60,
    rationale: 'Git workflows, rebase, branch protection rules, conflict resolution, and atomic commits.',
    evalMethod: 'Project Repo'
  },
  'rest apis': {
    domain: 'Backend',
    canonicalName: 'RESTful API Architecture',
    defaultThreshold: 65,
    rationale: 'HTTP methods, status codes, payload validation, JWT authentication, and OpenAPI documentation.',
    evalMethod: 'Project Repo'
  },
  'testing': {
    domain: 'Quality Assurance',
    canonicalName: 'Automated Testing (Unit & E2E)',
    defaultThreshold: 60,
    rationale: 'Unit tests, integration suites, test-driven development (Jest, PyTest, Cypress), and CI mock coverage.',
    evalMethod: 'Code Assessment'
  },
  'docker': {
    domain: 'DevOps & Cloud',
    canonicalName: 'Docker Containerization',
    defaultThreshold: 55,
    rationale: 'Multi-stage Dockerfiles, image caching optimization, port bindings, and docker-compose orchestration.',
    evalMethod: 'Project Repo'
  },
  'aws': {
    domain: 'DevOps & Cloud',
    canonicalName: 'AWS Cloud Services',
    defaultThreshold: 50,
    rationale: 'Core compute (EC2/ECS), storage (S3), serverless (Lambda), IAM policies, and VPC networking.',
    evalMethod: 'System Architecture Interview'
  },
  'system design': {
    domain: 'Architecture',
    canonicalName: 'High-Level & Low-Level System Design',
    defaultThreshold: 65,
    rationale: 'Scalable distributed architectures, load balancing, horizontal scaling, caching (Redis), and message queues.',
    evalMethod: 'System Architecture Interview'
  },
  'python': {
    domain: 'Backend',
    canonicalName: 'Python 3',
    defaultThreshold: 65,
    rationale: 'Object-oriented patterns, async asyncio, package management, and algorithmic scripting.',
    evalMethod: 'Code Assessment'
  },
  'dsa': {
    domain: 'Engineering Practices',
    canonicalName: 'Data Structures & Algorithms',
    defaultThreshold: 70,
    rationale: 'Time & space complexity optimization, graph traversals, dynamic programming, and binary trees.',
    evalMethod: 'Code Assessment'
  },
  'ros2': {
    domain: 'Robotics & Autonomy',
    canonicalName: 'ROS2 Humble',
    defaultThreshold: 65,
    rationale: 'Distributed publish-subscribe nodes, DDS middleware, QoS profiles, and action clients.',
    evalMethod: 'Project Repo'
  },
  'nav2': {
    domain: 'Robotics & Autonomy',
    canonicalName: 'Nav2 Autonomous Navigation',
    defaultThreshold: 60,
    rationale: 'Costmaps, behavior trees, AMCL localization, and path planners.',
    evalMethod: 'Project Repo'
  },
  'gis': {
    domain: 'Data & AI',
    canonicalName: 'Geospatial GIS & Remote Sensing',
    defaultThreshold: 60,
    rationale: 'Coordinate reference systems, PostGIS spatial queries, and satellite raster processing.',
    evalMethod: 'Project Repo'
  }
};

// Pre-configured Industry Roles
export const DEFAULT_INDUSTRY_ROLES: IndustryRoleDefinition[] = [
  {
    id: 'role-fullstack-dev',
    title: 'Full Stack Developer',
    companyName: 'Genova Cloud & Enterprise Labs',
    industrySector: 'Product Engineering / SaaS',
    experienceLevel: 'Campus Fresher',
    compensationRange: '₹14.0 LPA - ₹22.0 LPA',
    requiredSkills: ['React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'Testing'],
    preferredSkills: ['Docker', 'AWS', 'System Design'],
    minCgpaCutoff: 7.5,
    eligibleDepartments: ['Computer Science', 'Information Tech.', 'Electronics'],
    description: 'Design, develop, and scale modern web applications with responsive frontend architectures, high-throughput backend services, and automated CI test suites.',
    createdDate: 'Sep 2026'
  },
  {
    id: 'role-av-systems',
    title: 'Autonomous Vehicle Systems Engineer',
    companyName: 'Genova Mobility Systems',
    industrySector: 'Autonomous Transportation & Robotics',
    experienceLevel: 'Campus Fresher',
    compensationRange: '₹18.0 LPA - ₹28.0 LPA',
    requiredSkills: ['Python', 'ROS2', 'Nav2', 'Git', 'DSA'],
    preferredSkills: ['Docker', 'System Design', 'Testing'],
    minCgpaCutoff: 8.0,
    eligibleDepartments: ['Computer Science', 'Electronics', 'Mechanical Eng.'],
    description: 'Engineer drive-by-wire autonomy pipelines, real-time sensor fusion, behavioral motion planning, and ROS2 telemetry safety watchdogs.',
    createdDate: 'Sep 2026'
  },
  {
    id: 'role-geospatial-ai',
    title: 'Geospatial AI & Land Intelligence Specialist',
    companyName: 'AeroLand GIS Technologies',
    industrySector: 'AgriTech & Urban Infrastructure',
    experienceLevel: 'Campus Fresher',
    compensationRange: '₹15.0 LPA - ₹24.0 LPA',
    requiredSkills: ['Python', 'SQL', 'GIS', 'REST APIs'],
    preferredSkills: ['AWS', 'Docker', 'Testing'],
    minCgpaCutoff: 7.0,
    eligibleDepartments: ['Computer Science', 'Information Tech.', 'Civil Eng.'],
    description: 'Apply deep learning to high-resolution satellite and drone imagery, cadastral boundary verification, and PostGIS parcel intelligence.',
    createdDate: 'Sep 2026'
  }
];

// Student cohort skill knowledge base mapping
const STUDENT_BASE_SKILLS: Record<string, Record<string, number>> = {
  // STU001: Rishi Sharma (B.Tech CSE, CGPA 9.24) - strong Python, React, SQL, ROS2
  'STU001': {
    'react': 76,
    'node.js': 68,
    'sql': 61,
    'git': 84,
    'rest apis': 75,
    'testing': 38, // GAP
    'docker': 77,
    'aws': 42,
    'system design': 0, // CRITICAL GAP
    'python': 82,
    'dsa': 43,
    'ros2': 88,
    'nav2': 81,
    'gis': 79
  },
  // STU004: Ananya Iyer (B.Tech CSE, CGPA 9.6) - Top tier Full Stack champion
  'STU004': {
    'react': 94,
    'node.js': 90,
    'sql': 88,
    'git': 95,
    'rest apis': 92,
    'testing': 86,
    'docker': 82,
    'aws': 78,
    'system design': 85,
    'python': 89,
    'dsa': 92
  },
  // STU002: Diya Sharma (B.Tech ECE, CGPA 9.2) - Strong embedded, modest web
  'STU002': {
    'react': 54,
    'node.js': 45,
    'sql': 62,
    'git': 78,
    'rest apis': 60,
    'testing': 40,
    'docker': 50,
    'aws': 35,
    'system design': 40,
    'python': 80,
    'dsa': 72,
    'ros2': 65
  },
  // STU003: Rohan Sen (B.Tech ME, CGPA 7.1) - Hardware & CAD focused, learning web
  'STU003': {
    'react': 32,
    'node.js': 28,
    'sql': 40,
    'git': 58,
    'rest apis': 35,
    'testing': 20,
    'docker': 30,
    'aws': 15,
    'system design': 20,
    'python': 64,
    'dsa': 38
  },
  // STU005: Kabir Malhotra (B.Tech IT, CGPA 8.0) - Solid backend & cloud
  'STU005': {
    'react': 68,
    'node.js': 82,
    'sql': 75,
    'git': 80,
    'rest apis': 85,
    'testing': 62,
    'docker': 70,
    'aws': 65,
    'system design': 55,
    'python': 70,
    'dsa': 60
  }
};

export class IndustrySkillMappingEngine {
  private static ROLES_STORAGE_KEY = 'genova_industry_roles';

  /**
   * Retrieves all defined industry roles (default + custom stored)
   */
  public static getIndustryRoles(): IndustryRoleDefinition[] {
    try {
      const stored = localStorage.getItem(this.ROLES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Combine defaults with user created
        const combined = [...DEFAULT_INDUSTRY_ROLES];
        parsed.forEach((p: IndustryRoleDefinition) => {
          if (!combined.some(c => c.id === p.id)) {
            combined.push(p);
          }
        });
        return combined;
      }
    } catch (e) {
      console.error('Failed to parse industry roles from storage', e);
    }
    return DEFAULT_INDUSTRY_ROLES;
  }

  /**
   * Save a new or updated industry role
   */
  public static saveIndustryRole(role: IndustryRoleDefinition): IndustryRoleDefinition[] {
    const roles = this.getIndustryRoles();
    const existingIndex = roles.findIndex(r => r.id === role.id);
    if (existingIndex >= 0) {
      roles[existingIndex] = role;
    } else {
      roles.unshift(role);
    }
    try {
      localStorage.setItem(this.ROLES_STORAGE_KEY, JSON.stringify(roles));
    } catch (e) {
      console.error('Failed to store industry role', e);
    }
    return roles;
  }

  /**
   * CampusOS Conversion Engine:
   * Converts raw industry requirements into a standardized skill profile.
   */
  public static convertToStandardizedProfile(role: IndustryRoleDefinition): StandardizedSkillProfile {
    const competencies: StandardizedCompetency[] = [];

    // Weights: Required skills share 75% total weight; Preferred skills share 25% total weight
    const requiredWeightPerItem = role.requiredSkills.length > 0 
      ? Math.round(75 / role.requiredSkills.length) 
      : 0;
    const preferredWeightPerItem = role.preferredSkills.length > 0 
      ? Math.round(25 / role.preferredSkills.length) 
      : 0;

    // 1. Process Required Skills
    role.requiredSkills.forEach((rawSkill) => {
      const key = rawSkill.toLowerCase().trim();
      const meta = CANONICAL_TAXONOMY[key] || {
        domain: 'Engineering Practices',
        canonicalName: rawSkill,
        defaultThreshold: 60,
        rationale: `Core institutional requirement for ${role.title} engineering track.`,
        evalMethod: 'Code Assessment'
      };

      competencies.push({
        canonicalId: `canon-${key.replace(/[^a-z0-9]/g, '-')}`,
        skillName: meta.canonicalName,
        domain: meta.domain,
        tier: 'REQUIRED',
        benchmarkThreshold: meta.defaultThreshold,
        weightPercentage: requiredWeightPerItem,
        industryRationale: meta.rationale,
        recommendedEvaluationMethod: meta.evalMethod
      });
    });

    // 2. Process Preferred Skills
    role.preferredSkills.forEach((rawSkill) => {
      const key = rawSkill.toLowerCase().trim();
      const meta = CANONICAL_TAXONOMY[key] || {
        domain: 'DevOps & Cloud',
        canonicalName: rawSkill,
        defaultThreshold: 50,
        rationale: `Value-add proficiency providing competitive advantage in high-scale environments.`,
        evalMethod: 'Project Repo'
      };

      competencies.push({
        canonicalId: `canon-pref-${key.replace(/[^a-z0-9]/g, '-')}`,
        skillName: meta.canonicalName,
        domain: meta.domain,
        tier: 'PREFERRED',
        benchmarkThreshold: meta.defaultThreshold,
        weightPercentage: preferredWeightPerItem,
        industryRationale: meta.rationale,
        recommendedEvaluationMethod: meta.evalMethod
      });
    });

    const profileHash = `0xCOS${Math.abs(role.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 8191).toString(16).toUpperCase()}`;

    return {
      roleId: role.id,
      roleTitle: role.title,
      companyName: role.companyName,
      profileHash,
      standardizedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      competencies,
      requiredCount: role.requiredSkills.length,
      preferredCount: role.preferredSkills.length,
      totalEvaluationWeight: 100
    };
  }

  /**
   * Evaluates a single student against a standardized role profile
   */
  public static evaluateStudentAgainstProfile(
    student: { id: string; name: string; rollNo: string; department: string; course: string; cgpa: number; year: number; attendanceRate: number },
    profile: StandardizedSkillProfile,
    minCgpaCutoff: number = 7.5
  ): StudentCohortComparisonResult {
    const studentSkills = STUDENT_BASE_SKILLS[student.id] || {
      'react': Math.floor(40 + (student.cgpa * 4)),
      'node.js': Math.floor(45 + (student.cgpa * 3)),
      'sql': Math.floor(50 + (student.cgpa * 3)),
      'git': Math.floor(55 + (student.cgpa * 4)),
      'rest apis': Math.floor(50 + (student.cgpa * 3)),
      'testing': Math.floor(30 + (student.cgpa * 3)),
      'docker': Math.floor(35 + (student.cgpa * 3)),
      'aws': Math.floor(25 + (student.cgpa * 3)),
      'system design': Math.floor(20 + (student.cgpa * 4))
    };

    const evaluations: StudentSkillEvaluation[] = [];
    let requiredMetCount = 0;
    let preferredMetCount = 0;
    let totalScoreContribution = 0;
    const criticalGaps: string[] = [];
    const bonusStrengths: string[] = [];

    profile.competencies.forEach((comp) => {
      // Find matching student proficiency
      const lookupKey = Object.keys(studentSkills).find(k => 
        comp.skillName.toLowerCase().includes(k) || k.includes(comp.skillName.toLowerCase().split(' ')[0])
      );
      const studentScore = lookupKey ? studentSkills[lookupKey] : 0;
      const isMet = studentScore >= comp.benchmarkThreshold;
      const gapDelta = Math.max(0, comp.benchmarkThreshold - studentScore);

      let statusText: 'MET ✓' | 'GAP ⚠' | 'BONUS +' | 'ABSENT -';

      if (comp.tier === 'REQUIRED') {
        if (isMet) {
          requiredMetCount++;
          statusText = 'MET ✓';
        } else {
          criticalGaps.push(`${comp.skillName} (Deficit: -${gapDelta}%)`);
          statusText = 'GAP ⚠';
        }
        // Required skills contribute to 75% of overall score
        const ratio = Math.min(1.0, studentScore / (comp.benchmarkThreshold || 1));
        totalScoreContribution += ratio * comp.weightPercentage;
      } else {
        // Preferred Tier
        if (isMet) {
          preferredMetCount++;
          bonusStrengths.push(comp.skillName);
          statusText = 'BONUS +';
          totalScoreContribution += comp.weightPercentage;
        } else {
          statusText = 'ABSENT -';
          const partial = Math.min(1.0, studentScore / (comp.benchmarkThreshold || 1));
          totalScoreContribution += partial * comp.weightPercentage;
        }
      }

      evaluations.push({
        skillName: comp.skillName,
        canonicalId: comp.canonicalId,
        domain: comp.domain,
        tier: comp.tier,
        studentScore,
        benchmarkThreshold: comp.benchmarkThreshold,
        isMet,
        gapDelta,
        statusText
      });
    });

    const overallMatchScore = Math.min(99, Math.max(10, Math.round(totalScoreContribution)));
    const cgpaEligible = student.cgpa >= minCgpaCutoff;

    // Verdict calculation
    let verdict: 'Shortlist Ready' | 'Interview Pool' | 'Conditional Eligible' | 'Action Required (Gaps)';
    let verdictColor: 'emerald' | 'blue' | 'amber' | 'rose';

    const requiredPassRate = profile.requiredCount > 0 ? requiredMetCount / profile.requiredCount : 1;

    if (requiredPassRate === 1 && cgpaEligible && overallMatchScore >= 85) {
      verdict = 'Shortlist Ready';
      verdictColor = 'emerald';
    } else if (requiredPassRate >= 0.8 && overallMatchScore >= 70) {
      verdict = 'Interview Pool';
      verdictColor = 'blue';
    } else if (requiredPassRate >= 0.5) {
      verdict = 'Conditional Eligible';
      verdictColor = 'amber';
    } else {
      verdict = 'Action Required (Gaps)';
      verdictColor = 'rose';
    }

    return {
      studentId: student.id,
      name: student.name,
      rollNo: student.rollNo,
      department: student.department,
      course: student.course,
      cgpa: student.cgpa,
      year: student.year,
      attendanceRate: student.attendanceRate,
      overallMatchScore,
      requiredSkillsMet: requiredMetCount,
      requiredSkillsTotal: profile.requiredCount,
      preferredSkillsMet: preferredMetCount,
      preferredSkillsTotal: profile.preferredCount,
      verdict,
      verdictColor,
      evaluations,
      criticalGaps,
      bonusStrengths,
      cgpaEligible
    };
  }

  /**
   * Compares the entire student cohort against a standardized role profile
   */
  public static compareCohortAgainstRole(
    students: any[],
    role: IndustryRoleDefinition
  ): {
    standardizedProfile: StandardizedSkillProfile;
    cohortMatches: StudentCohortComparisonResult[];
    analytics: CohortMacroAnalytics;
  } {
    const standardizedProfile = this.convertToStandardizedProfile(role);

    // Evaluate each student
    const cohortMatches = students.map((s) => 
      this.evaluateStudentAgainstProfile(s, standardizedProfile, role.minCgpaCutoff)
    ).sort((a, b) => b.overallMatchScore - a.overallMatchScore);

    // Aggregate Macro Analytics
    const totalCount = cohortMatches.length;
    let shortlistCount = 0;
    let poolCount = 0;
    let gapCount = 0;
    let totalScoreSum = 0;
    let maxScore = 0;

    cohortMatches.forEach((m) => {
      totalScoreSum += m.overallMatchScore;
      if (m.overallMatchScore > maxScore) maxScore = m.overallMatchScore;
      if (m.verdict === 'Shortlist Ready') shortlistCount++;
      else if (m.verdict === 'Interview Pool') poolCount++;
      else gapCount++;
    });

    // Compute cohort skill summaries
    const skillSummaries: CohortSkillMasterySummary[] = standardizedProfile.competencies.map((comp) => {
      let passCount = 0;
      let scoreSum = 0;

      cohortMatches.forEach((match) => {
        const evalItem = match.evaluations.find(e => e.canonicalId === comp.canonicalId);
        if (evalItem) {
          scoreSum += evalItem.studentScore;
          if (evalItem.isMet) passCount++;
        }
      });

      const avgScore = totalCount > 0 ? Math.round(scoreSum / totalCount) : 0;
      const passPct = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

      let rec = 'Institutional proficiency on track.';
      if (passPct < 50) {
        rec = `High Institutional Deficit: Schedule a dedicated ${comp.skillName} crash workshop before industry drive.`;
      } else if (passPct < 75) {
        rec = `Moderate Deficit: Deploy mock diagnostic lab challenges in ${comp.domain} curriculum.`;
      }

      return {
        skillName: comp.skillName,
        tier: comp.tier,
        domain: comp.domain,
        cohortAverageScore: avgScore,
        studentsPassingCount: passCount,
        studentsFailingCount: totalCount - passCount,
        passPercentage: passPct,
        curriculumRecommendation: rec
      };
    });

    const curriculumInterventions: string[] = skillSummaries
      .filter(s => s.passPercentage < 65)
      .map(s => `${s.skillName} (${s.domain}): ${s.studentsFailingCount} of ${totalCount} students need remediation before ${role.companyName} drives.`);

    const analytics: CohortMacroAnalytics = {
      roleId: role.id,
      roleTitle: role.title,
      totalStudentsAnalyzed: totalCount,
      shortlistReadyCount: shortlistCount,
      interviewPoolCount: poolCount,
      actionRequiredCount: gapCount,
      averageCohortMatch: totalCount > 0 ? Math.round(totalScoreSum / totalCount) : 0,
      highestMatchScore: maxScore,
      skillSummaries,
      curriculumInterventions
    };

    return {
      standardizedProfile,
      cohortMatches,
      analytics
    };
  }
}

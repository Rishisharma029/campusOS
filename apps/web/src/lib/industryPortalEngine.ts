/**
 * GENOVA CampusOS AI — Industry Portal & Enterprise Dashboard Engine
 * 
 * Manages the full Industry Dashboard suite:
 *  ├── Post Opportunity
 *  ├── Skill Requirements
 *  ├── Candidate Pool (Skill-first candidate search based on verified skills)
 *  ├── AI Shortlisting
 *  ├── Applications
 *  ├── Interviews
 *  ├── Mentorship
 *  ├── Training Programs
 *  └── Collaboration
 */

import { InternshipMarketplaceEngine, type MarketplaceOpportunity } from './internshipMarketplaceEngine';
import { PORTFOLIO_DATA } from './digitalPortfolioEngine';

export type IndustryPortalModule =
  | 'OVERVIEW'
  | 'POST_OPPORTUNITY'
  | 'SKILL_REQUIREMENTS'
  | 'CANDIDATE_POOL'
  | 'AI_SHORTLISTING'
  | 'APPLICATIONS'
  | 'INTERVIEWS'
  | 'MENTORSHIP'
  | 'TRAINING_PROGRAMS'
  | 'COLLABORATION';

export interface SkillCriterion {
  name: string;
  minLevel: number; // 0 to 100
}

export interface CandidateSearchQuery {
  skills: SkillCriterion[];
  minCgpa: number;
  department: string;
  gradYear: string;
}

export interface IndustryCandidate {
  id: string;
  name: string;
  email: string;
  degree: string;
  department: string;
  batch: string;
  cgpa: number;
  careerReadiness: number;
  skills: { name: string; level: number; verified: boolean }[];
  featuredProjects: string[];
  certificationsCount: number;
  internshipsCompleted: number;
  passportHash: string;
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
}

export interface IndustryInterview {
  id: string;
  candidateName: string;
  role: string;
  roundTitle: string;
  date: string;
  time: string;
  interviewers: string[];
  meetingLink: string;
  status: 'Scheduled' | 'Completed' | 'Feedback Pending';
  rating?: number;
}

export interface CorporateTrainingProgram {
  id: string;
  title: string;
  company: string;
  domain: string;
  duration: string;
  enrolledStudentsCount: number;
  sponsoredHardwareRig: string;
  skillsTaught: string[];
  credentialIssued: string;
  status: 'Active' | 'Upcoming' | 'Completed';
}

export interface UniversityCollaborationMoU {
  id: string;
  title: string;
  company: string;
  universityDepartment: string;
  type: 'Corporate Research Lab' | 'Joint R&D MoU' | 'Funded Capstone Grant' | 'Campus Recruitment Charter';
  grantAmount: string;
  commencedDate: string;
  validUntil: string;
  deliverables: string[];
  status: 'Active' | 'Under Review';
}

// Full Cohort Candidates with Verified Skills and Proof-of-Work
const COHORT_CANDIDATES: IndustryCandidate[] = [
  {
    id: 'cand-rishi',
    name: 'Rishi Sharma',
    email: 'rishi.sharma@genova.edu',
    degree: 'B.Tech in Computer Science & Engineering',
    department: 'Computer Science',
    batch: '2027',
    cgpa: 9.24,
    careerReadiness: 84,
    skills: [
      { name: 'React', level: 91, verified: true },
      { name: 'Python', level: 82, verified: true },
      { name: 'SQL', level: 74, verified: true },
      { name: 'ROS2', level: 90, verified: true },
      { name: 'Nav2', level: 86, verified: true },
      { name: 'TypeScript', level: 94, verified: true },
      { name: 'PyTorch', level: 88, verified: true },
      { name: 'OpenCV', level: 78, verified: true },
      { name: 'DSA', level: 76, verified: true },
      { name: 'System Design', level: 78, verified: true }
    ],
    featuredProjects: ['CampusOS', 'AI Document Intelligence', 'Autonomous Mobility'],
    certificationsCount: 8,
    internshipsCompleted: 2,
    passportHash: '0xGENOVA9942FA71C0B819E7'
  },
  {
    id: 'cand-arjun',
    name: 'Arjun Verma',
    email: 'arjun.verma@genova.edu',
    degree: 'B.Tech in Computer Science & Engineering',
    department: 'Computer Science',
    batch: '2026',
    cgpa: 9.14,
    careerReadiness: 81,
    skills: [
      { name: 'Python', level: 82, verified: true },
      { name: 'React', level: 76, verified: true },
      { name: 'SQL', level: 61, verified: true },
      { name: 'DSA', level: 68, verified: true },
      { name: 'ROS2', level: 90, verified: true },
      { name: 'OpenCV', level: 80, verified: true },
      { name: 'PostGIS', level: 85, verified: true }
    ],
    featuredProjects: ['GENOVA Autonomous Mobility System', 'Land Intelligence Cadastral Matcher'],
    certificationsCount: 5,
    internshipsCompleted: 1,
    passportHash: '0xPASSPORT88102A'
  },
  {
    id: 'cand-neha',
    name: 'Neha Sharma',
    email: 'neha.sharma@genova.edu',
    degree: 'B.Tech in Information Technology',
    department: 'Information Tech.',
    batch: '2026',
    cgpa: 8.85,
    careerReadiness: 76,
    skills: [
      { name: 'React', level: 88, verified: true },
      { name: 'Node.js', level: 84, verified: true },
      { name: 'SQL', level: 82, verified: true },
      { name: 'Git', level: 89, verified: true },
      { name: 'REST APIs', level: 86, verified: true },
      { name: 'Testing', level: 80, verified: true }
    ],
    featuredProjects: ['High-Throughput Microservice API Gateway', 'Institutional ERP Attendance'],
    certificationsCount: 4,
    internshipsCompleted: 1,
    passportHash: '0xPASSPORT77312F'
  },
  {
    id: 'cand-priya',
    name: 'Priya Patel',
    email: 'priya.patel@genova.edu',
    degree: 'B.Tech in Electronics & Communication',
    department: 'Electronics',
    batch: '2026',
    cgpa: 8.62,
    careerReadiness: 79,
    skills: [
      { name: 'C++', level: 86, verified: true },
      { name: 'CAN Bus', level: 84, verified: true },
      { name: 'Microcontrollers', level: 88, verified: true },
      { name: 'Python', level: 74, verified: true },
      { name: 'ROS2', level: 75, verified: true }
    ],
    featuredProjects: ['Drive-by-Wire Automotive Actuator Interface', 'STM32 Telemetry Controller'],
    certificationsCount: 3,
    internshipsCompleted: 1,
    passportHash: '0xPASSPORT44198D'
  },
  {
    id: 'cand-siddharth',
    name: 'Siddharth Verma',
    email: 'siddharth.verma@genova.edu',
    degree: 'B.Tech in Computer Science',
    department: 'Computer Science',
    batch: '2027',
    cgpa: 8.42,
    careerReadiness: 72,
    skills: [
      { name: 'Python', level: 88, verified: true },
      { name: 'PyTorch', level: 85, verified: true },
      { name: 'OpenCV', level: 82, verified: true },
      { name: 'YOLO', level: 75, verified: true },
      { name: 'TensorRT', level: 72, verified: true }
    ],
    featuredProjects: ['Edge Pedestrian Detection Camera', 'Autonomous Drone Obstacle Avoidance'],
    certificationsCount: 3,
    internshipsCompleted: 0,
    passportHash: '0xPASSPORT33091B'
  }
];

// Seed Interviews
const DEFAULT_INTERVIEWS: IndustryInterview[] = [
  {
    id: 'intv-1',
    candidateName: 'Rishi Sharma',
    role: 'Computer Vision Intern',
    roundTitle: 'Round 2: Multi-Camera Optical Flow & Edge TensorRT',
    date: 'Sep 08, 2026',
    time: '03:00 PM - 04:00 PM IST',
    interviewers: ['Dr. Siddharth Sen (Perception Lead)', 'Anita Desai (Staff Engineer)'],
    meetingLink: 'https://meet.genova.ai/industry/cv-rishi',
    status: 'Scheduled'
  },
  {
    id: 'intv-2',
    candidateName: 'Neha Sharma',
    role: 'Full Stack Product Engineer',
    roundTitle: 'Round 1: Distributed React Architecture & System Design',
    date: 'Sep 09, 2026',
    time: '11:30 AM - 12:30 PM IST',
    interviewers: ['Kunal Roy (Head of Engineering)'],
    meetingLink: 'https://meet.genova.ai/industry/fs-neha',
    status: 'Scheduled'
  },
  {
    id: 'intv-3',
    candidateName: 'Priya Patel',
    role: 'Drive-by-Wire Embedded Systems Apprentice',
    roundTitle: 'Round 1: CAN Bus Telemetry & RTOS Microcontrollers',
    date: 'Sep 04, 2026',
    time: '02:00 PM IST',
    interviewers: ['Rajesh Nair (Principal Embedded Architect)'],
    meetingLink: 'https://meet.genova.ai/industry/dbw-priya',
    status: 'Completed',
    rating: 4.8
  }
];

// Seed Corporate Training Programs
const DEFAULT_TRAINING_PROGRAMS: CorporateTrainingProgram[] = [
  {
    id: 'train-1',
    title: 'NVIDIA Jetson Orin Edge AI & TensorRT Accelerator Lab',
    company: 'NVIDIA Deep Learning Institute & Genova',
    domain: 'Edge AI & Robotics Perception',
    duration: '4 Weeks (Saturdays & Sundays)',
    enrolledStudentsCount: 36,
    sponsoredHardwareRig: '8x NVIDIA Jetson AGX Orin 64GB Micro-Supercomputers',
    skillsTaught: ['TensorRT INT8 Calibration', 'DeepStream SDK', 'YOLOv8 Edge Optimization'],
    credentialIssued: 'NVIDIA DLI Certified Edge AI Practitioner',
    status: 'Active'
  },
  {
    id: 'train-2',
    title: 'Continental Automotive ISO 26262 Embedded Safety Rig',
    company: 'Continental Automotive Systems',
    domain: 'Automotive Functional Safety & CAN Bus',
    duration: '6 Weeks (Intensive Industry Cohort)',
    enrolledStudentsCount: 28,
    sponsoredHardwareRig: 'Automotive HIL Chassis Bench with Vector CANoe Telemetry',
    skillsTaught: ['ISO 26262 ASIL-D Standards', 'CANoe Diagnostics', 'Hardware Watchdogs'],
    credentialIssued: 'Continental Automotive Certified Safety Engineer',
    status: 'Upcoming'
  },
  {
    id: 'train-3',
    title: 'AeroLand Cadastral Satellite AI Raster Processing Cohort',
    company: 'AeroLand GIS Technologies',
    domain: 'Geospatial AI & Remote Sensing',
    duration: '3 Weeks (Cloud Sandbox)',
    enrolledStudentsCount: 42,
    sponsoredHardwareRig: 'AeroLand Dedicated Cloud GPU Cluster (A100 80GB)',
    skillsTaught: ['PostGIS Geodesic Indices', 'GeoTIFF Tiling', 'U-Net Parcel Segmentation'],
    credentialIssued: 'AeroLand Verified Geospatial Specialist',
    status: 'Completed'
  }
];

// Seed Collaboration MoUs & Research Grants
const DEFAULT_COLLABORATIONS: UniversityCollaborationMoU[] = [
  {
    id: 'collab-1',
    title: 'Genova Autonomous Mobility Systems Center of Excellence',
    company: 'Genova Mobility Systems Pvt. Ltd.',
    universityDepartment: 'Department of Computer Science & Robotics Lab',
    type: 'Corporate Research Lab',
    grantAmount: '₹1.85 Crore Initial Endowment',
    commencedDate: 'Jan 2025',
    validUntil: 'Dec 2028 (3 Years Remaining)',
    deliverables: [
      'Joint development of Campus Autonomous Shuttle test vehicle',
      'Annual sponsored intake of 15 Full-Time Engineers and 25 Interns',
      'Access to Genova physical drive-by-wire autonomy test track'
    ],
    status: 'Active'
  },
  {
    id: 'collab-2',
    title: 'AeroLand Satellite Geospatial AI Research Fellowship',
    company: 'AeroLand GIS Technologies',
    universityDepartment: 'Department of Information Technology & Remote Sensing',
    type: 'Funded Capstone Grant',
    grantAmount: '₹65 Lakh Annual Research Grant',
    commencedDate: 'May 2025',
    validUntil: 'May 2027',
    deliverables: [
      'Automated agricultural land parcel boundary extraction algorithms',
      'Joint publication in IEEE Geospatial & Remote Sensing Letters',
      'Direct PPO pipeline for top capstone student contributors'
    ],
    status: 'Active'
  },
  {
    id: 'collab-3',
    title: 'Continental Automotive Tier-1 Campus Hiring Charter',
    company: 'Continental Automotive Group',
    universityDepartment: 'Electronics & Communication Engineering',
    type: 'Campus Recruitment Charter',
    grantAmount: 'Sponsored Lab Hardware & Testing Benches (Valued at ₹45L)',
    commencedDate: 'Aug 2025',
    validUntil: 'Aug 2028',
    deliverables: [
      'Guaranteed Day-1 campus placement slots for embedded engineers',
      'Direct sponsorship of final-year automotive capstones',
      'Executive technical mentorship for student robotics teams'
    ],
    status: 'Active'
  }
];

export class IndustryPortalEngine {
  private static CANDIDATES_KEY = 'genova_industry_cohort_candidates';
  private static INTERVIEWS_KEY = 'genova_industry_interviews';

  /**
   * Retrieves all candidate profiles in the cohort
   */
  public static getCandidates(): IndustryCandidate[] {
    try {
      const stored = localStorage.getItem(this.CANDIDATES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse candidates', e);
    }
    return COHORT_CANDIDATES;
  }

  /**
   * Skill-First Search Engine:
   * Finds candidates based strictly on verified skill proficiencies, min thresholds, and projects
   * rather than static keyword resumes!
   */
  public static searchCandidatesBySkills(query: CandidateSearchQuery): IndustryCandidate[] {
    const candidates = this.getCandidates();

    return candidates.map((cand) => {
      let matchedCount = 0;
      const matchedList: string[] = [];
      const missingList: string[] = [];

      query.skills.forEach((crit) => {
        const studentSkill = cand.skills.find(
          s => s.name.toLowerCase() === crit.name.toLowerCase() ||
               s.name.toLowerCase().includes(crit.name.toLowerCase()) ||
               crit.name.toLowerCase().includes(s.name.toLowerCase())
        );

        if (studentSkill && studentSkill.level >= crit.minLevel) {
          matchedCount++;
          matchedList.push(`${crit.name} (${studentSkill.level}%)`);
        } else {
          missingList.push(crit.name);
        }
      });

      const skillFitPercentage = query.skills.length > 0
        ? Math.round((matchedCount / query.skills.length) * 100)
        : 100;

      // Check CGPA
      const passesCgpa = cand.cgpa >= query.minCgpa;
      // Check Department
      const passesDept = query.department === 'ALL' || cand.department.toLowerCase().includes(query.department.toLowerCase());
      // Check Batch
      const passesBatch = query.gradYear === 'ALL' || cand.batch.includes(query.gradYear);

      let adjustedMatchScore = skillFitPercentage;
      if (!passesCgpa) adjustedMatchScore = Math.max(0, adjustedMatchScore - 25);
      if (!passesDept) adjustedMatchScore = Math.max(0, adjustedMatchScore - 15);
      if (!passesBatch) adjustedMatchScore = Math.max(0, adjustedMatchScore - 10);

      return {
        ...cand,
        matchScore: adjustedMatchScore,
        matchedSkills: matchedList,
        missingSkills: missingList
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  /**
   * AI Shortlisting Engine:
   * Scans candidate pool against a target opportunity, automatically scoring and ranking candidates
   */
  public static runAIShortlist(opportunity: MarketplaceOpportunity): {
    shortlisted: IndustryCandidate[];
    meanCohortFit: number;
    topMatchesCount: number;
  } {
    const query: CandidateSearchQuery = {
      skills: opportunity.requiredSkills.map(s => ({ name: s, minLevel: 65 })),
      minCgpa: opportunity.eligibility.minCgpa,
      department: 'ALL',
      gradYear: 'ALL'
    };

    const results = this.searchCandidatesBySkills(query);
    const topMatches = results.filter(r => (r.matchScore || 0) >= 70);
    const totalScores = results.reduce((acc, c) => acc + (c.matchScore || 0), 0);
    const meanCohortFit = Math.round(totalScores / results.length);

    return {
      shortlisted: results,
      meanCohortFit,
      topMatchesCount: topMatches.length
    };
  }

  /**
   * Retrieves Scheduled Interviews
   */
  public static getInterviews(): IndustryInterview[] {
    try {
      const stored = localStorage.getItem(this.INTERVIEWS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_INTERVIEWS;
  }

  /**
   * Schedules a new interview
   */
  public static scheduleInterview(interview: Omit<IndustryInterview, 'id'>): IndustryInterview[] {
    const list = this.getInterviews();
    const newIntv: IndustryInterview = {
      ...interview,
      id: `intv-${Date.now()}`
    };
    list.unshift(newIntv);
    try {
      localStorage.setItem(this.INTERVIEWS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save interview', e);
    }
    return list;
  }

  /**
   * Retrieves Corporate Training Programs
   */
  public static getTrainingPrograms(): CorporateTrainingProgram[] {
    return DEFAULT_TRAINING_PROGRAMS;
  }

  /**
   * Retrieves University Collaborations & MoUs
   */
  public static getCollaborations(): UniversityCollaborationMoU[] {
    return DEFAULT_COLLABORATIONS;
  }
}

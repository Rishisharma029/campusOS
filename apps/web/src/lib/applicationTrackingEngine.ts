/**
 * GENOVA CampusOS AI — Application Tracking & Internship Mentorship Engine
 * 
 * Pipeline 1 (General Career Applications):
 * Saved ➔ Applied ➔ Shortlisted ➔ Assessment ➔ Interview ➔ Selected ➔ Joined ➔ Completed
 * 
 * Pipeline 2 (Internship Lifecycle & Mentorship):
 * Application ➔ Mentor Assigned ➔ Progress ➔ Feedback ➔ Completion ➔ Certificate
 */

import { StudentSkillIntelligenceEngine, type VerifiedRecord } from './studentSkillIntelligenceEngine';

export type ApplicationStage = 
  | 'Saved'
  | 'Applied'
  | 'Shortlisted'
  | 'Assessment'
  | 'Interview'
  | 'Selected'
  | 'Joined'
  | 'Completed';

export const APPLICATION_STAGES: ApplicationStage[] = [
  'Saved',
  'Applied',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Selected',
  'Joined',
  'Completed'
];

export type InternshipStage = 
  | 'Application'
  | 'Mentor Assigned'
  | 'Progress'
  | 'Feedback'
  | 'Completion'
  | 'Certificate';

export const INTERNSHIP_STAGES: InternshipStage[] = [
  'Application',
  'Mentor Assigned',
  'Progress',
  'Feedback',
  'Completion',
  'Certificate'
];

export interface ApplicationHistoryEntry {
  stage: ApplicationStage;
  date: string;
  notes?: string;
}

export interface ApplicationRecord {
  id: string;
  opportunityId: string;
  role: string;
  company: string;
  type: 'Internship' | 'Project' | 'Apprenticeship' | 'Job' | 'Workshop' | 'Mentorship' | 'Training';
  stage: ApplicationStage;
  appliedDate: string;
  lastUpdated: string;
  salaryOrStipend: string;
  location: string;
  nextAction: string;
  history: ApplicationHistoryEntry[];
  assessmentDetails?: {
    platform: string;
    deadline: string;
    score?: number;
    status: 'Pending' | 'Completed' | 'Passed';
  };
  interviewSchedule?: {
    round: string;
    date: string;
    interviewer: string;
    format: string;
    meetingLink?: string;
  };
  offerDetails?: {
    ctc: string;
    joiningDate: string;
    expiryDate: string;
    offerLetterUrl?: string;
  };
}

export interface InternshipMilestone {
  id: string;
  week: number;
  title: string;
  deliverables: string[];
  status: 'Completed' | 'In Progress' | 'Upcoming';
  submissionLink?: string;
  mentorFeedbackNote?: string;
}

export interface MentorFeedback {
  mentorName: string;
  mentorTitle: string;
  mentorCompany: string;
  overallRating: number; // out of 5
  technicalProficiency: number; // out of 5
  problemSolving: number; // out of 5
  communicationAndOwnership: number; // out of 5
  strengths: string[];
  growthAreas: string[];
  qualitativeSummary: string;
  submittedAt: string;
}

export interface InternshipCertificate {
  certificateId: string;
  verificationHash: string;
  issueDate: string;
  recipientName: string;
  role: string;
  company: string;
  issuer: string;
  honorsCitation: string;
}

export interface InternshipLifecycleRecord {
  id: string;
  applicationId: string;
  role: string;
  company: string;
  internshipStage: InternshipStage;
  progressPercentage: number; // 0 to 100
  startDate: string;
  endDate: string;
  stipend: string;
  mentor?: {
    name: string;
    title: string;
    company: string;
    email: string;
    meetingCadence: string;
    avatarInitials: string;
  };
  milestones: InternshipMilestone[];
  feedback?: MentorFeedback;
  certificate?: InternshipCertificate;
}

// Seed Mock Applications across all 8 stages
const DEFAULT_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-1',
    opportunityId: 'opp-cv-intern-1',
    role: 'Computer Vision Intern',
    company: 'Genova Vision AI & Robotics',
    type: 'Internship',
    stage: 'Interview',
    appliedDate: 'Aug 28, 2026',
    lastUpdated: 'Sep 04, 2026',
    salaryOrStipend: '₹40,000 / month + PPO',
    location: 'Bengaluru / Hybrid',
    nextAction: 'Round 2 Technical Interview on Edge Perception with Lead Architect',
    history: [
      { stage: 'Saved', date: 'Aug 25, 2026', notes: 'Bookmarked via AI Match Me (88% Match)' },
      { stage: 'Applied', date: 'Aug 28, 2026', notes: 'Submitted verified cryptographic skill passport' },
      { stage: 'Shortlisted', date: 'Aug 31, 2026', notes: 'Candidate profile cleared automated AI screening' },
      { stage: 'Assessment', date: 'Sep 02, 2026', notes: 'Scored 94% on Python/OpenCV algorithmic challenge' },
      { stage: 'Interview', date: 'Sep 04, 2026', notes: 'Interview round scheduled with Perception Lead' },
    ],
    assessmentDetails: {
      platform: 'GENOVA CodeBench',
      deadline: 'Sep 02, 2026',
      score: 94,
      status: 'Passed'
    },
    interviewSchedule: {
      round: 'Technical Deep Dive: Multi-Camera Optical Flow & ROS2',
      date: 'Sep 08, 2026 • 03:00 PM IST',
      interviewer: 'Dr. Siddharth Sen (Head of Perception)',
      format: 'Google Meet / Code Sandbox',
      meetingLink: 'https://meet.genova.ai/cv-tech-round-rishi'
    }
  },
  {
    id: 'app-2',
    opportunityId: 'opp-intern-1',
    role: 'Autonomous Systems Software Engineer Intern',
    company: 'Genova Mobility Labs',
    type: 'Internship',
    stage: 'Selected',
    appliedDate: 'Aug 14, 2026',
    lastUpdated: 'Sep 02, 2026',
    salaryOrStipend: '₹45,000 / month + Pre-Placement Offer',
    location: 'Bengaluru / Hybrid',
    nextAction: 'Sign Institutional Internship Agreement & Verify Onboarding Details',
    history: [
      { stage: 'Saved', date: 'Aug 10, 2026', notes: 'Bookmarked via Genova Robotics portal' },
      { stage: 'Applied', date: 'Aug 14, 2026', notes: 'Verified passport submitted' },
      { stage: 'Shortlisted', date: 'Aug 18, 2026', notes: 'Selected for ROS2 navigation track' },
      { stage: 'Assessment', date: 'Aug 22, 2026', notes: 'Completed Nav2 costmap challenge with 92% accuracy' },
      { stage: 'Interview', date: 'Aug 27, 2026', notes: 'Technical Panel & System Architecture Interview' },
      { stage: 'Selected', date: 'Sep 02, 2026', notes: 'Offer extended: ₹45,000/mo + Pre-Placement Offer' }
    ],
    offerDetails: {
      ctc: '₹45,000 / month Stipend (PPO Target: ₹22.5 LPA)',
      joiningDate: 'Oct 01, 2026',
      expiryDate: 'Sep 15, 2026',
      offerLetterUrl: 'https://genova.ai/offers/GML-2026-AUTONOMY-088.pdf'
    }
  },
  {
    id: 'app-3',
    opportunityId: 'opp-proj-1',
    role: 'Cadastral GIS Satellite AI Parcel Boundary Extractor',
    company: 'AeroLand GIS Technologies',
    type: 'Project',
    stage: 'Joined',
    appliedDate: 'Jul 20, 2026',
    lastUpdated: 'Aug 25, 2026',
    salaryOrStipend: '₹60,000 Milestone Grant + GPU Credits',
    location: 'Remote',
    nextAction: 'Sprint 3: PostGIS GeoTIFF Raster Polygonization Phase',
    history: [
      { stage: 'Saved', date: 'Jul 15, 2026' },
      { stage: 'Applied', date: 'Jul 20, 2026' },
      { stage: 'Shortlisted', date: 'Jul 25, 2026' },
      { stage: 'Assessment', date: 'Aug 01, 2026' },
      { stage: 'Interview', date: 'Aug 08, 2026' },
      { stage: 'Selected', date: 'Aug 15, 2026' },
      { stage: 'Joined', date: 'Aug 25, 2026', notes: 'Project workspace initialized' }
    ]
  },
  {
    id: 'app-4',
    opportunityId: 'opp-appr-1',
    role: 'Drive-by-Wire Embedded Systems Apprentice',
    company: 'Continental Automotive & Genova',
    type: 'Apprenticeship',
    stage: 'Shortlisted',
    appliedDate: 'Aug 30, 2026',
    lastUpdated: 'Sep 03, 2026',
    salaryOrStipend: '₹35,000 / month + Certification',
    location: 'Pune Technical Center',
    nextAction: 'Take Online CAN Bus Diagnostic Screening Assessment',
    history: [
      { stage: 'Saved', date: 'Aug 28, 2026' },
      { stage: 'Applied', date: 'Aug 30, 2026' },
      { stage: 'Shortlisted', date: 'Sep 03, 2026', notes: 'Shortlisted based on microcontrollers background' }
    ]
  },
  {
    id: 'app-5',
    opportunityId: 'opp-job-1',
    role: 'Full Stack Product Engineer',
    company: 'Genova Cloud & Enterprise Labs',
    type: 'Job',
    stage: 'Saved',
    appliedDate: 'Not Applied',
    lastUpdated: 'Sep 01, 2026',
    salaryOrStipend: '₹16.0 LPA - ₹24.0 LPA',
    location: 'Hyderabad / Hybrid',
    nextAction: 'Complete DSA dynamic roadmap challenge to achieve 90% match readiness',
    history: [
      { stage: 'Saved', date: 'Sep 01, 2026', notes: 'Target Full-Time Career Goal' }
    ]
  }
];

// Seed Mock Internship Lifecycle Record (Progress, Mentor Feedback & Certificate)
const DEFAULT_INTERNSHIPS: InternshipLifecycleRecord[] = [
  {
    id: 'intern-prog-1',
    applicationId: 'app-2',
    role: 'Autonomous Systems Software Engineer Intern',
    company: 'Genova Mobility Labs',
    internshipStage: 'Progress',
    progressPercentage: 68,
    startDate: 'Jul 01, 2026',
    endDate: 'Dec 31, 2026',
    stipend: '₹45,000 / month',
    mentor: {
      name: 'Dr. Vikram Malhotra',
      title: 'Principal Autonomous Systems Architect',
      company: 'Genova Mobility Systems',
      email: 'vikram.malhotra@genovamobility.ai',
      meetingCadence: 'Weekly 1:1 on Tuesdays • 11:00 AM IST',
      avatarInitials: 'VM'
    },
    milestones: [
      {
        id: 'ms-1',
        week: 1,
        title: 'Onboarding & ROS2 Humble Workspace Setup',
        deliverables: ['CycloneDDS multi-robot configuration', 'CI/CD unit test harness setup'],
        status: 'Completed',
        submissionLink: 'https://github.com/genova/autonomy-rover/pull/12',
        mentorFeedbackNote: 'Flawless workspace initialization. High adherence to coding standards.'
      },
      {
        id: 'ms-2',
        week: 4,
        title: '3D LiDAR PointCloud Filtering & EKF Sensor Fusion',
        deliverables: ['PCL voxel grid downsampling filter', 'IMU-Wheel Odometry dual EKF filter'],
        status: 'Completed',
        submissionLink: 'https://github.com/genova/autonomy-rover/pull/34',
        mentorFeedbackNote: 'Superb sensor latency reduction. Frame rate maintained at 45Hz.'
      },
      {
        id: 'ms-3',
        week: 8,
        title: 'Nav2 Costmap Inflation Layer & Dynamic Obstacle Avoidance',
        deliverables: ['Custom plugin for dynamic pedestrian inflation', 'TEB local trajectory tuning'],
        status: 'In Progress',
        submissionLink: 'https://github.com/genova/autonomy-rover/pull/58',
        mentorFeedbackNote: 'Active development underway. Obstacle avoidance benchmark looks promising.'
      },
      {
        id: 'ms-4',
        week: 12,
        title: 'Hardware-in-the-Loop Field Trials & Final Evaluation',
        deliverables: ['Physical campus shuttle route demonstration', 'Final technical thesis & code handover'],
        status: 'Upcoming'
      }
    ],
    feedback: {
      mentorName: 'Dr. Vikram Malhotra',
      mentorTitle: 'Principal Autonomous Systems Architect',
      mentorCompany: 'Genova Mobility Systems',
      overallRating: 4.9,
      technicalProficiency: 5.0,
      problemSolving: 4.8,
      communicationAndOwnership: 4.9,
      strengths: [
        'Exceptional ROS2 architecture and multi-threaded C++ execution',
        'Intuitive grasp of real-time sensor fusion and EKF state estimation',
        'Independent problem ownership and structured Git discipline'
      ],
      growthAreas: [
        'Explore hardware CAN bus frame arbitration corner cases under bus saturation'
      ],
      qualitativeSummary: 'Rishi has proven to be an exemplary engineering intern. His contribution to the local Nav2 obstacle avoidance layer has significantly reduced obstacle false positives in real campus environments. On track for Pre-Placement Offer (PPO).',
      submittedAt: 'Sep 02, 2026'
    },
    certificate: {
      certificateId: 'GENOVA-INT-2026-AUTONOMY-0941',
      verificationHash: '0x8F9C4A2E7B1D03F69A284617CEBA0941F',
      issueDate: 'Estimated Dec 31, 2026',
      recipientName: 'Rishi Sharma',
      role: 'Autonomous Systems Software Engineer Intern',
      company: 'Genova Mobility Labs',
      issuer: 'Genova Autonomous Systems Institute & Academic Senate',
      honorsCitation: 'Awarded with Highest Technical Distinction for Breakthrough Perception Work'
    }
  }
];

export class ApplicationTrackingEngine {
  private static APPS_STORAGE_KEY = 'genova_application_pipeline_records';
  private static INTERNSHIP_STORAGE_KEY = 'genova_internship_lifecycle_records';

  /**
   * Retrieves all tracked applications
   */
  public static getApplications(): ApplicationRecord[] {
    try {
      const stored = localStorage.getItem(this.APPS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse applications from storage', e);
    }
    return DEFAULT_APPLICATIONS;
  }

  /**
   * Updates an application's stage
   */
  public static updateStage(
    appId: string, 
    newStage: ApplicationStage, 
    notes?: string
  ): ApplicationRecord[] {
    const apps = this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.stage = newStage;
      app.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      app.history.unshift({
        stage: newStage,
        date: app.lastUpdated,
        notes: notes || `Application advanced to ${newStage}`
      });

      // Update next action text
      if (newStage === 'Shortlisted') app.nextAction = 'Prepare for technical assessment or screening interview';
      else if (newStage === 'Assessment') app.nextAction = 'Complete online coding assessment';
      else if (newStage === 'Interview') app.nextAction = 'Attend scheduled panel interview';
      else if (newStage === 'Selected') app.nextAction = 'Review offer letter and sign institutional agreement';
      else if (newStage === 'Joined') app.nextAction = 'Complete onboarding sprints and sync with mentor';
      else if (newStage === 'Completed') app.nextAction = 'Internship/Role completed successfully. Certificate issued.';

      try {
        localStorage.setItem(this.APPS_STORAGE_KEY, JSON.stringify(apps));
      } catch (e) {
        console.error('Failed to save updated application', e);
      }
    }
    return apps;
  }

  /**
   * Retrieves all tracked internship lifecycles
   */
  public static getInternships(): InternshipLifecycleRecord[] {
    try {
      const stored = localStorage.getItem(this.INTERNSHIP_STORAGE_KEY);
      if (stored) {
        const parsed: InternshipLifecycleRecord[] = JSON.parse(stored);
        let modified = false;
        parsed.forEach(p => {
          if (p.certificate && p.certificate.recipientName === 'Aarav Mehta') {
            p.certificate.recipientName = 'Rishi Sharma';
            modified = true;
          }
          if (p.feedback && p.feedback.qualitativeSummary.includes('Aarav')) {
            p.feedback.qualitativeSummary = p.feedback.qualitativeSummary.replace(/Aarav/g, 'Rishi');
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(this.INTERNSHIP_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse internships from storage', e);
    }
    return DEFAULT_INTERNSHIPS;
  }

  /**
   * Updates an internship stage
   */
  public static updateInternshipStage(
    internshipId: string, 
    newStage: InternshipStage
  ): InternshipLifecycleRecord[] {
    const internships = this.getInternships();
    const record = internships.find(i => i.id === internshipId);
    if (record) {
      record.internshipStage = newStage;
      if (newStage === 'Completion' || newStage === 'Certificate') {
        record.progressPercentage = 100;
      }
      try {
        localStorage.setItem(this.INTERNSHIP_STORAGE_KEY, JSON.stringify(internships));
      } catch (e) {
        console.error('Failed to save internship stage update', e);
      }
    }
    return internships;
  }

  /**
   * Updates milestone status
   */
  public static updateMilestoneStatus(
    internshipId: string, 
    milestoneId: string, 
    status: 'Completed' | 'In Progress' | 'Upcoming'
  ): InternshipLifecycleRecord[] {
    const internships = this.getInternships();
    const record = internships.find(i => i.id === internshipId);
    if (record) {
      const ms = record.milestones.find(m => m.id === milestoneId);
      if (ms) {
        ms.status = status;
        // Recalculate progress percentage
        const completed = record.milestones.filter(m => m.status === 'Completed').length;
        record.progressPercentage = Math.round((completed / record.milestones.length) * 100);

        if (record.progressPercentage === 100) {
          record.internshipStage = 'Completion';
        }
        try {
          localStorage.setItem(this.INTERNSHIP_STORAGE_KEY, JSON.stringify(internships));
        } catch (e) {
          console.error('Failed to save milestone update', e);
        }
      }
    }
    return internships;
  }

  /**
   * Completes internship and issues cryptographic verified institutional certificate
   */
  public static issueCertificate(internshipId: string): InternshipLifecycleRecord | null {
    const internships = this.getInternships();
    const record = internships.find(i => i.id === internshipId);
    if (!record) return null;

    record.internshipStage = 'Certificate';
    record.progressPercentage = 100;
    record.milestones.forEach(m => m.status = 'Completed');

    const certId = `GENOVA-INT-${Date.now().toString().slice(-4)}-${record.company.slice(0, 3).toUpperCase()}`;
    const hash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`.toUpperCase();

    record.certificate = {
      certificateId: certId,
      verificationHash: hash,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      recipientName: 'Rishi Sharma',
      role: record.role,
      company: record.company,
      issuer: 'GENOVA Academic Senate & Industry Partner Consortium',
      honorsCitation: 'Awarded with Highest Academic Distinction for Enterprise Industrial Contributions'
    };

    // Save to local storage
    try {
      localStorage.setItem(this.INTERNSHIP_STORAGE_KEY, JSON.stringify(internships));
    } catch (e) {
      console.error('Failed to save certificate issuance', e);
    }

    // Automatically synchronize into Student Profile Verified Records
    try {
      const profile = StudentSkillIntelligenceEngine.getProfile();
      const newVerifiedRecord: VerifiedRecord = {
        id: `vr-${Date.now()}`,
        recordType: 'Industrial Internship Completion',
        title: `${record.role} • ${record.company}`,
        issuer: record.certificate.issuer,
        verificationHash: record.certificate.verificationHash,
        verifiedAt: record.certificate.issueDate,
        status: 'VERIFIED'
      };
      profile.verifiedRecords.unshift(newVerifiedRecord);
      StudentSkillIntelligenceEngine.saveProfile(profile);
    } catch (e) {
      console.error('Failed to synchronize verified record to student profile', e);
    }

    return record;
  }
}

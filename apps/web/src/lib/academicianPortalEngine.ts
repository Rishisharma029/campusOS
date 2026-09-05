/**
 * GENOVA CampusOS AI — Academician Portal Engine
 * 
 * Fulfills SIH26044 requirement for Academicians & Faculty:
 *  ├── Faculty Internship (Corporate research sabbaticals & industrial residencies)
 *  ├── Industrial Training (Enterprise technology immersion & certification bootcamps)
 *  ├── FDP (Faculty Development Programs, AICTE/DST pedagogical credits)
 *  ├── Consultancy (Corporate technical advisory, paid consulting contracts, bidding desk)
 *  ├── Research Projects (Sponsored R&D grants, milestone tracking, lab endowments)
 *  ├── Industry Mentorship (Co-mentoring student cohorts with corporate engineering leads)
 *  └── Collaboration (Institutional MoUs, joint innovation centers & IP licensing)
 */

export type AcademicianModuleTab =
  | 'FACULTY_INTERNSHIP'
  | 'INDUSTRIAL_TRAINING'
  | 'FDP'
  | 'CONSULTANCY'
  | 'RESEARCH_PROJECTS'
  | 'INDUSTRY_MENTORSHIP'
  | 'COLLABORATION';

export interface FacultyInternship {
  id: string;
  title: string;
  company: string;
  domain: string;
  duration: string;
  mode: 'On-Site R&D Proving Ground' | 'Hybrid' | 'Remote Research Cohort';
  honorarium: string;
  researchFocus: string;
  eligibility: string;
  deadline: string;
  applied: boolean;
  applicationStatus?: 'Submitted' | 'Under Review' | 'Accepted';
}

export interface IndustrialTraining {
  id: string;
  title: string;
  provider: string;
  domain: string;
  duration: string;
  labFacility: string;
  credentialAwarded: string;
  skillsCovered: string[];
  enrolled: boolean;
  status: 'Upcoming' | 'Enrolled' | 'Completed';
}

export interface FacultyDevelopmentProgram {
  id: string;
  title: string;
  sponsoringAgency: 'AICTE ATAL' | 'DST SERB' | 'IEEE Education Society' | 'Industry-Academia Board';
  mode: '1-Week Intensive' | '2-Week National FDP' | 'Weekend Masterclass';
  creditsAwarded: number;
  dates: string;
  curriculumHighlights: string[];
  registered: boolean;
}

export interface ConsultancyOpportunity {
  id: string;
  title: string;
  clientCompany: string;
  domain: string;
  budgetValuation: string;
  timeline: string;
  deliverablesSummary: string[];
  expertiseRequired: string[];
  bidsSubmittedCount: number;
  bidStatus?: 'Not Submitted' | 'Bid Submitted' | 'Awarded';
}

export interface SponsoredResearchProject {
  id: string;
  projectCode: string;
  title: string;
  sponsoringBody: string;
  industryPartner: string;
  totalGrantAmount: string;
  disbursedAmount: string;
  principalInvestigator: string;
  duration: string;
  progressPercentage: number;
  currentMilestone: string;
  publicationsExpected: number;
  status: 'Active' | 'Under Review' | 'Milestone 2 Completed';
}

export interface IndustryMentorshipPairing {
  id: string;
  teamName: string;
  projectTitle: string;
  studentMembers: string[];
  industryCoMentor: {
    name: string;
    designation: string;
    company: string;
  };
  meetingCadence: string;
  lastReviewDate: string;
  nextMilestone: string;
  facultyRating: number; // 1 to 5
  status: 'On Track' | 'Milestone Review Due' | 'Completed';
}

export interface AcademicCollaborationMoU {
  id: string;
  mouTitle: string;
  corporatePartner: string;
  universityDepartment: string;
  scope: string;
  validity: string;
  financialCommitment: string;
  activeInitiatives: string[];
  status: 'Active' | 'Renewal Pending';
}

// 1. Seed Faculty Internships (Corporate Sabbaticals)
const DEFAULT_FACULTY_INTERNSHIPS: FacultyInternship[] = [
  {
    id: 'f-int-1',
    title: 'Autonomous Robotics & Perception Faculty Sabbatical',
    company: 'Genova Mobility Systems Pvt. Ltd.',
    domain: 'Robotics & Computer Vision',
    duration: '2 Months (Summer / Winter Break)',
    mode: 'On-Site R&D Proving Ground',
    honorarium: '₹1,25,000 / month + Proving Ground Pass',
    researchFocus: 'Real-time multi-modal sensor fusion (LiDAR + Stereo Camera) on autonomous campus vehicles.',
    eligibility: 'Faculty with research publications in Robotics, Control Systems, or Deep Learning.',
    deadline: 'Oct 15, 2026',
    applied: true,
    applicationStatus: 'Under Review'
  },
  {
    id: 'f-int-2',
    title: 'ISO 26262 Automotive Safety & RTOS Faculty Residency',
    company: 'Continental Automotive Systems',
    domain: 'Embedded Systems & Functional Safety',
    duration: '6 Weeks (Flexible Sabbatical)',
    mode: 'Hybrid',
    honorarium: '₹95,000 / month + Hardware Access',
    researchFocus: 'Hardware-in-the-loop (HIL) automated fault injection and ASIL-D formal verification.',
    eligibility: 'Associate / Assistant Professors in ECE, EEE, or Mechatronics.',
    deadline: 'Nov 01, 2026',
    applied: false
  },
  {
    id: 'f-int-3',
    title: 'High-Throughput Spatial Analytics Research Fellowship',
    company: 'AeroLand GIS Technologies',
    domain: 'Geospatial AI & Remote Sensing',
    duration: '3 Months (Part-Time / Weekend)',
    mode: 'Remote Research Cohort',
    honorarium: '₹80,000 / month + A100 GPU Cluster',
    researchFocus: 'Deep learning for cadastral parcel segmentation and multispectral satellite raster indexing.',
    eligibility: 'Faculty with expertise in GIS, Remote Sensing, or Machine Learning.',
    deadline: 'Oct 30, 2026',
    applied: false
  }
];

// 2. Seed Industrial Training Bootcamps
const DEFAULT_INDUSTRIAL_TRAININGS: IndustrialTraining[] = [
  {
    id: 'ind-tr-1',
    title: 'NVIDIA Jetson Orin Edge AI TensorRT Certification Workshop',
    provider: 'NVIDIA Deep Learning Institute & Genova',
    domain: 'Edge Computing & Accelerator Programming',
    duration: '40 Hours (5 Days Hands-on)',
    labFacility: 'Campus NVIDIA Autonomous Robotics Rig (Lab 402)',
    credentialAwarded: 'NVIDIA DLI Certified Educator & Edge AI Specialist',
    skillsCovered: ['TensorRT INT8 Calibration', 'DeepStream SDK 7.0', 'CUDA Stream Optimization'],
    enrolled: true,
    status: 'Enrolled'
  },
  {
    id: 'ind-tr-2',
    title: 'Vector CANoe & Automotive Ethernet Protocol Masterclass',
    provider: 'Continental Automotive Academy',
    domain: 'Automotive Communication Networks',
    duration: '30 Hours (3 Weekends)',
    labFacility: 'Continental Hardware-in-the-Loop Chassis Bench',
    credentialAwarded: 'Continental Certified Automotive Network Instructor',
    skillsCovered: ['CAN FD Diagnostics', 'SOME/IP Automotive Ethernet', 'CAPL Test Scripting'],
    enrolled: false,
    status: 'Upcoming'
  },
  {
    id: 'ind-tr-3',
    title: 'PostgreSQL PostGIS & Geodesic Cloud Infrastructure',
    provider: 'AeroLand GIS & Open Source Geospatial Foundation',
    domain: 'Geospatial Database Engineering',
    duration: '25 Hours (Self-Paced + Live Lab Sessions)',
    labFacility: 'Dedicated Genova Cloud Sandboxes',
    credentialAwarded: 'OSGeo Verified Spatial Database Educator',
    skillsCovered: ['R-Tree Spatial Indexing', 'GeoJSON Raster Tiling', 'Distributed PostGIS'],
    enrolled: true,
    status: 'Completed'
  }
];

// 3. Seed Faculty Development Programs (FDP)
const DEFAULT_FDPS: FacultyDevelopmentProgram[] = [
  {
    id: 'fdp-1',
    title: 'AICTE ATAL National FDP on Autonomous Systems & Robot Operating Systems (ROS2)',
    sponsoringAgency: 'AICTE ATAL',
    mode: '1-Week Intensive',
    creditsAwarded: 4,
    dates: 'Sep 21 - Sep 26, 2026',
    curriculumHighlights: [
      'ROS2 Humble architecture & DDS middleware configuration',
      'Nav2 costmap inflation and dynamic obstacle avoidance',
      'Simulation of campus electric shuttles in Gazebo & Webots',
      'Pedagogy design for undergraduate robotics laboratories'
    ],
    registered: true
  },
  {
    id: 'fdp-2',
    title: 'DST SERB Masterclass on Generative AI & Autonomous Agentic Workflows in Higher Education',
    sponsoringAgency: 'DST SERB',
    mode: '2-Week National FDP',
    creditsAwarded: 6,
    dates: 'Oct 12 - Oct 24, 2026',
    curriculumHighlights: [
      'Retrieval-Augmented Generation (RAG) using institutional vector stores',
      'Autonomous AI agent architectures with Google ADK',
      'Ethical AI auditing and automated hallucination scoring',
      'Integrating AI copilots into curriculum delivery'
    ],
    registered: false
  },
  {
    id: 'fdp-3',
    title: 'IEEE Emerging Standards in Functional Safety & Cybersecurity for Connected Autonomous Vehicles',
    sponsoringAgency: 'IEEE Education Society',
    mode: 'Weekend Masterclass',
    creditsAwarded: 3,
    dates: 'Nov 07 - Nov 15, 2026',
    curriculumHighlights: [
      'ISO 26262 ASIL hazard risk assessments',
      'ISO/SAE 21434 road vehicle cybersecurity protocols',
      'Curriculum integration strategies for automotive engineering'
    ],
    registered: false
  }
];

// 4. Seed Industry Consultancy Opportunities (RFPs)
const DEFAULT_CONSULTANCIES: ConsultancyOpportunity[] = [
  {
    id: 'cons-1',
    title: 'LiDAR-Camera Extrinsic Calibration & Timestamp Sync Algorithm Consultancy',
    clientCompany: 'Genova Mobility Systems',
    domain: 'Computer Vision & Multi-Sensor Fusion',
    budgetValuation: '₹14,50,000 Total Honorarium',
    timeline: '4 Months (Intermittent Deliverables)',
    deliverablesSummary: [
      'Mathematical formulation of automatic targetless LiDAR-camera calibration',
      'Production Python / C++ shared library with < 2ms sync jitter',
      'Comprehensive validation report across sunny, rainy, and nocturnal runs'
    ],
    expertiseRequired: ['Camera Intrinsic Calibration', 'Point Cloud Registration', 'C++ 20'],
    bidsSubmittedCount: 3,
    bidStatus: 'Bid Submitted'
  },
  {
    id: 'cons-2',
    title: 'Thermal Runaway Predictive Model for Electric Vehicle Battery Packs',
    clientCompany: 'EcoVolt Power Systems',
    domain: 'Thermal Modeling & Electrochemical Sensors',
    budgetValuation: '₹18,00,000 Contract',
    timeline: '6 Months',
    deliverablesSummary: [
      'Finite element thermal dissipation analysis in multi-cell battery packs',
      'Edge microcontroller alert algorithm detecting pre-runaway outgassing',
      'Patent filing co-assigned to Genova Institute and EcoVolt'
    ],
    expertiseRequired: ['Thermal CFD Modeling', 'MATLAB Simulink', 'Electrochemical Dynamics'],
    bidsSubmittedCount: 2,
    bidStatus: 'Not Submitted'
  },
  {
    id: 'cons-3',
    title: 'Deep Learning Boundary Reconstruction for Agricultural Land Cadastral Maps',
    clientCompany: 'AeroLand GIS Technologies',
    domain: 'Geospatial AI & Satellite Processing',
    budgetValuation: '₹9,80,000 Retainer',
    timeline: '3 Months',
    deliverablesSummary: [
      'Polygon boundary regularization algorithm for noisy aerial segmentation masks',
      'Integration with PostGIS cadastral registry',
      'Training workshop for AeroLand engineering staff'
    ],
    expertiseRequired: ['Geometric Deep Learning', 'PostGIS', 'Computational Geometry'],
    bidsSubmittedCount: 4,
    bidStatus: 'Awarded'
  }
];

// 5. Seed Sponsored Research Projects
const DEFAULT_RESEARCH_PROJECTS: SponsoredResearchProject[] = [
  {
    id: 'res-proj-1',
    projectCode: 'DST/EE/2025/089',
    title: 'Autonomous Campus Transit: Edge-Computing Sensor Fusion for Obstacle Avoidance',
    sponsoringBody: 'Department of Science and Technology (DST) & Genova Mobility',
    industryPartner: 'Genova Mobility Systems Pvt. Ltd.',
    totalGrantAmount: '₹84,50,000',
    disbursedAmount: '₹52,00,000 (Tranche 1 & 2)',
    principalInvestigator: 'Dr. Siddharth Sen (Professor, Dept. of CSE)',
    duration: '36 Months (14 Months Remaining)',
    progressPercentage: 68,
    currentMilestone: 'Milestone 3: Dynamic Obstacle Tracking on Wet Asphalt',
    publicationsExpected: 4,
    status: 'Active'
  },
  {
    id: 'res-proj-2',
    projectCode: 'IND/AUTO/2026/014',
    title: 'ISO 26262 ASIL-D Compliant Steer-by-Wire Fail-Operational Firmware Architecture',
    sponsoringBody: 'Continental Automotive Industry Grant',
    industryPartner: 'Continental Automotive Systems',
    totalGrantAmount: '₹45,00,000',
    disbursedAmount: '₹45,00,000 (Full Endowment)',
    principalInvestigator: 'Dr. Siddharth Sen & Dr. Anjali Rao',
    duration: '24 Months (6 Months Remaining)',
    progressPercentage: 88,
    currentMilestone: 'Milestone 4: Formal Proof of Watchdog Deadlock Prevention',
    publicationsExpected: 3,
    status: 'Milestone 2 Completed'
  }
];

// 6. Seed Industry Mentorship Pairings (Faculty Co-Mentoring Students)
const DEFAULT_MENTORSHIP_PAIRINGS: IndustryMentorshipPairing[] = [
  {
    id: 'ment-1',
    teamName: 'Team Autonomy Alpha (Batch 2027)',
    projectTitle: 'CampusOS Electric Autonomous Shuttle with LiDAR Sensor Fusion',
    studentMembers: ['Rishi Sharma (Lead)', 'Priya Patel (Perception)'],
    industryCoMentor: {
      name: 'Anita Desai',
      designation: 'Staff Perception Engineer',
      company: 'Genova Mobility Systems'
    },
    meetingCadence: 'Bi-Weekly Technical Review (Thursdays 4:30 PM)',
    lastReviewDate: 'Sep 02, 2026',
    nextMilestone: 'Full Loop Autonomous Nav in Live Campus Traffic',
    facultyRating: 4.9,
    status: 'On Track'
  },
  {
    id: 'ment-2',
    teamName: 'Team AeroGIS (Batch 2026)',
    projectTitle: 'Automated Satellite Cadastral Land Parcel Alignment',
    studentMembers: ['Neha Sharma', 'Siddharth Verma'],
    industryCoMentor: {
      name: 'Rohan Deshmukh',
      designation: 'VP of Geospatial Platforms',
      company: 'AeroLand GIS Technologies'
    },
    meetingCadence: 'Monthly Capstone Evaluation',
    lastReviewDate: 'Aug 28, 2026',
    nextMilestone: 'Integration with Institutional Land Registry',
    facultyRating: 4.7,
    status: 'Milestone Review Due'
  }
];

// 7. Seed Academic Collaboration MoUs
const DEFAULT_COLLABORATION_MOUS: AcademicCollaborationMoU[] = [
  {
    id: 'mou-1',
    mouTitle: 'Genova Autonomous Systems Center of Excellence & Research Lab',
    corporatePartner: 'Genova Mobility Systems Pvt. Ltd.',
    universityDepartment: 'Computer Science & Robotics',
    scope: 'Sponsored Lab Space, 15 Annual Student PPOs, Faculty Sabbatical Access, Joint IP Licensing.',
    validity: 'Jan 2025 - Dec 2028 (3 Years Active)',
    financialCommitment: '₹1.85 Crore Endowment + Equipment',
    activeInitiatives: [
      'Campus Electric Autonomous Shuttle Project',
      'Faculty Sabbatical Fellowship Program',
      'Joint IEEE Publications & Patent CBR 89410'
    ],
    status: 'Active'
  },
  {
    id: 'mou-2',
    mouTitle: 'Continental Automotive Functional Safety Center & Hardware Test Rig',
    corporatePartner: 'Continental Automotive Systems',
    universityDepartment: 'Electronics & Communication',
    scope: 'Sponsored Vector CANoe Test Benches, Day-1 Hiring Priority, Industry FDP Cohorts.',
    validity: 'Aug 2025 - Aug 2028',
    financialCommitment: '₹65 Lakhs in Hardware & Annual Grants',
    activeInitiatives: [
      'ISO 26262 ASIL-D Embedded Safety Benchmark Lab',
      'Faculty Residency in Automotive Telemetry'
    ],
    status: 'Active'
  }
];

export class AcademicianPortalEngine {
  private static INTERNSHIPS_KEY = 'genova_academician_internships';
  private static TRAININGS_KEY = 'genova_academician_trainings';
  private static FDPS_KEY = 'genova_academician_fdps';
  private static CONSULTANCIES_KEY = 'genova_academician_consultancies';
  private static RESEARCH_KEY = 'genova_academician_research';
  private static MENTORSHIPS_KEY = 'genova_academician_mentorships';

  // 1. Faculty Internships
  public static getInternships(): FacultyInternship[] {
    try {
      const stored = localStorage.getItem(this.INTERNSHIPS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_FACULTY_INTERNSHIPS;
  }

  public static applyForInternship(id: string): FacultyInternship[] {
    const list = this.getInternships();
    const item = list.find(i => i.id === id);
    if (item) {
      item.applied = true;
      item.applicationStatus = 'Submitted';
      try {
        localStorage.setItem(this.INTERNSHIPS_KEY, JSON.stringify(list));
      } catch {}
    }
    return list;
  }

  // 2. Industrial Trainings
  public static getTrainings(): IndustrialTraining[] {
    try {
      const stored = localStorage.getItem(this.TRAININGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_INDUSTRIAL_TRAININGS;
  }

  public static enrollInTraining(id: string): IndustrialTraining[] {
    const list = this.getTrainings();
    const item = list.find(t => t.id === id);
    if (item) {
      item.enrolled = true;
      item.status = 'Enrolled';
      try {
        localStorage.setItem(this.TRAININGS_KEY, JSON.stringify(list));
      } catch {}
    }
    return list;
  }

  // 3. FDPs
  public static getFDPs(): FacultyDevelopmentProgram[] {
    try {
      const stored = localStorage.getItem(this.FDPS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_FDPS;
  }

  public static registerForFDP(id: string): FacultyDevelopmentProgram[] {
    const list = this.getFDPs();
    const item = list.find(f => f.id === id);
    if (item) {
      item.registered = true;
      try {
        localStorage.setItem(this.FDPS_KEY, JSON.stringify(list));
      } catch {}
    }
    return list;
  }

  // 4. Consultancy
  public static getConsultancies(): ConsultancyOpportunity[] {
    try {
      const stored = localStorage.getItem(this.CONSULTANCIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_CONSULTANCIES;
  }

  public static submitConsultancyBid(id: string): ConsultancyOpportunity[] {
    const list = this.getConsultancies();
    const item = list.find(c => c.id === id);
    if (item) {
      item.bidStatus = 'Bid Submitted';
      item.bidsSubmittedCount += 1;
      try {
        localStorage.setItem(this.CONSULTANCIES_KEY, JSON.stringify(list));
      } catch {}
    }
    return list;
  }

  // 5. Research Projects
  public static getResearchProjects(): SponsoredResearchProject[] {
    try {
      const stored = localStorage.getItem(this.RESEARCH_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_RESEARCH_PROJECTS;
  }

  // 6. Mentorship
  public static getMentorships(): IndustryMentorshipPairing[] {
    try {
      const stored = localStorage.getItem(this.MENTORSHIPS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_MENTORSHIP_PAIRINGS;
  }

  // 7. Collaboration MoUs
  public static getCollaborations(): AcademicCollaborationMoU[] {
    return DEFAULT_COLLABORATION_MOUS;
  }
}

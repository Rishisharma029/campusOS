/**
 * GENOVA CampusOS AI — Centralized Internship & Opportunity Marketplace Engine
 * Supports 7 opportunity categories with comprehensive industry metadata:
 * Role, Required Skills, Eligibility, Experience, Location/Remote, Duration, Deadline, Description.
 */

export type OpportunityCategory = 
  | 'Internship' 
  | 'Project' 
  | 'Apprenticeship' 
  | 'Job' 
  | 'Workshop' 
  | 'Mentorship' 
  | 'Training';

export interface MarketplaceOpportunity {
  id: string;
  role: string;
  type: OpportunityCategory;
  company: string;
  industryDomain: string;
  requiredSkills: string[];
  eligibility: {
    minCgpa: number;
    eligibleDepartments: string[];
    gradYears: string[];
  };
  experience: 'Fresher / No Prior Exp' | 'Pre-final / Final Year' | '0 - 1 Years' | '1 - 2 Years' | 'Open to All Students';
  location: 'Remote' | 'Hybrid' | 'On-Site';
  cityOrMode: string;
  duration: string;
  deadline: string;
  compensation: string;
  description: string;
  responsibilities: string[];
  learningOutcomes: string[];
  applicantsCount: number;
  featured: boolean;
  postedDate: string;
}

export interface ApplicationSubmission {
  opportunityId: string;
  studentId: string;
  studentName: string;
  appliedAt: string;
  verificationHash: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED';
}

const DEFAULT_OPPORTUNITIES: MarketplaceOpportunity[] = [
  // Exact Benchmark Opportunity: Computer Vision Intern
  {
    id: 'opp-cv-intern-1',
    role: 'Computer Vision Intern',
    type: 'Internship',
    company: 'Genova Vision AI & Robotics',
    industryDomain: 'Computer Vision & Edge Perception',
    requiredSkills: ['Python', 'OpenCV', 'ML', 'YOLO', 'Model deployment'],
    eligibility: {
      minCgpa: 8.0,
      eligibleDepartments: ['Computer Science', 'Information Tech.', 'Electronics'],
      gradYears: ['2025', '2026', '2027']
    },
    experience: 'Pre-final / Final Year',
    location: 'Hybrid',
    cityOrMode: 'Bengaluru / Hybrid',
    duration: '6 Months (Full-Time)',
    deadline: 'Nov 05, 2026',
    compensation: '₹40,000 / month + Pre-Placement Offer',
    description: 'Develop state-of-the-art computer vision models for campus autonomous rovers, implement OpenCV feature detection pipelines, and optimize edge inference models for real-time robotic navigation.',
    responsibilities: [
      'Design and train convolutional vision models for obstacle classification',
      'Implement real-time image pre-processing with OpenCV and NumPy',
      'Calibrate camera distortion matrices and evaluate edge frame rates'
    ],
    learningOutcomes: [
      'Production computer vision pipeline architecture',
      'End-to-end model deployment on edge devices',
      'Direct mentorship from senior computer vision researchers'
    ],
    applicantsCount: 41,
    featured: true,
    postedDate: 'Sep 2026'
  },
  // 1. Internship
  {
    id: 'opp-intern-1',
    role: 'Autonomous Systems Software Engineer Intern',
    type: 'Internship',
    company: 'Genova Mobility Labs',
    industryDomain: 'Autonomous Mobility & Robotics',
    requiredSkills: ['ROS2', 'Nav2', 'Python', 'Sensor Fusion'],
    eligibility: {
      minCgpa: 8.0,
      eligibleDepartments: ['Computer Science', 'Electronics', 'Mechanical Eng.'],
      gradYears: ['2025', '2026', '2027']
    },
    experience: 'Pre-final / Final Year',
    location: 'Hybrid',
    cityOrMode: 'Bengaluru / Hybrid',
    duration: '6 Months (Full-Time)',
    deadline: 'Oct 15, 2026',
    compensation: '₹45,000 / month + Pre-Placement Offer',
    description: 'Collaborate with senior autonomy engineers to calibrate LiDAR-camera sensor fusion, tune Nav2 local costmaps, and deploy drive-by-wire watchdog controllers on physical campus rovers.',
    responsibilities: [
      'Implement real-time sensor fusion filter for 64-beam LiDAR and stereo camera feeds',
      'Optimize trajectory costmaps in Nav2 to reduce dynamic obstacle latency under 20ms',
      'Conduct hardware-in-the-loop tests on the physical autonomy test rig'
    ],
    learningOutcomes: [
      'Production ROS2 Humble DDS middleware mastery',
      'Hands-on field calibration of industrial autonomous systems',
      'Direct mentorship from leading robotics architects'
    ],
    applicantsCount: 38,
    featured: true,
    postedDate: 'Sep 2026'
  },
  // 2. Project
  {
    id: 'opp-proj-1',
    role: 'Cadastral GIS Satellite AI Parcel Boundary Extractor',
    type: 'Project',
    company: 'AeroLand GIS Technologies',
    industryDomain: 'Land Intelligence & AgriTech',
    requiredSkills: ['Python', 'PostGIS', 'GeoTIFF', 'PyTorch'],
    eligibility: {
      minCgpa: 7.5,
      eligibleDepartments: ['Computer Science', 'Information Tech.', 'Civil Eng.'],
      gradYears: ['2025', '2026', '2027']
    },
    experience: 'Open to All Students',
    location: 'Remote',
    cityOrMode: 'Remote (Cloud GPU Cluster)',
    duration: '10 Weeks (Milestone-based)',
    deadline: 'Oct 20, 2026',
    compensation: '₹60,000 Milestone Grant + GPU Credits',
    description: 'Build a deep learning pipeline to segment agricultural parcel boundaries from high-resolution satellite raster imagery and evaluate topological accuracy against municipal land records.',
    responsibilities: [
      'Pre-process multi-spectral GeoTIFF raster scenes with GDAL and Rasterio',
      'Train U-Net boundary segmentation model on annotated cadastral parcel datasets',
      'Perform topological polygon overlays in PostGIS to compute geodesic surface overlap'
    ],
    learningOutcomes: [
      'Enterprise geospatial data engineering at scale',
      'Deep learning on multi-spectral satellite imagery',
      'Publishable joint research paper & code portfolio proof'
    ],
    applicantsCount: 24,
    featured: true,
    postedDate: 'Sep 2026'
  },
  // 3. Apprenticeship
  {
    id: 'opp-appr-1',
    role: 'Drive-by-Wire Embedded Systems Apprentice',
    type: 'Apprenticeship',
    company: 'Continental Automotive & Genova',
    industryDomain: 'Automotive Embedded Systems',
    requiredSkills: ['C++', 'CAN Bus', 'Microcontrollers', 'Git'],
    eligibility: {
      minCgpa: 7.8,
      eligibleDepartments: ['Electronics', 'Mechanical Eng.', 'Computer Science'],
      gradYears: ['2026', '2027']
    },
    experience: 'Fresher / No Prior Exp',
    location: 'On-Site',
    cityOrMode: 'Pune Technical Center',
    duration: '12 Months (Stipendiary Apprenticeship)',
    deadline: 'Oct 30, 2026',
    compensation: '₹35,000 / month + Industry Certification',
    description: 'Formal industrial apprenticeship program in automotive drive-by-wire architectures, motor controller PID loops, and safety-critical CAN bus telemetry standards (ISO 26262).',
    responsibilities: [
      'Program STM32 and TI microcontrollers for electronic steering and braking actuators',
      'Implement CAN bus cyclic heartbeats and hardware watchdog safety interrupts',
      'Participate in bench testing on physical vehicle chassis'
    ],
    learningOutcomes: [
      'Automotive SPICE and ISO 26262 functional safety compliance',
      'Real-world embedded motor control and actuator calibration',
      'Fast-track conversion to Full-Time Embedded Systems Engineer'
    ],
    applicantsCount: 42,
    featured: false,
    postedDate: 'Sep 2026'
  },
  // 4. Job
  {
    id: 'opp-job-1',
    role: 'Full Stack Product Engineer',
    type: 'Job',
    company: 'Genova Cloud & Enterprise Labs',
    industryDomain: 'Cloud & Enterprise SaaS',
    requiredSkills: ['React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'Testing'],
    eligibility: {
      minCgpa: 7.5,
      eligibleDepartments: ['Computer Science', 'Information Tech.', 'Electronics'],
      gradYears: ['2025', '2026']
    },
    experience: '0 - 1 Years',
    location: 'Hybrid',
    cityOrMode: 'Hyderabad / Hybrid',
    duration: 'Full-Time Permanent',
    deadline: 'Nov 10, 2026',
    compensation: '₹16.0 LPA - ₹24.0 LPA + ESOPs',
    description: 'Architect, develop, and scale responsive enterprise web platforms, high-throughput microservices, and automated continuous delivery pipelines serving thousands of institutional users.',
    responsibilities: [
      'Build modular, accessible UI components in React 19 and Tailwind CSS',
      'Design RESTful and event-driven backend services in Node.js and TypeScript',
      'Write comprehensive unit and end-to-end test suites achieving >85% test coverage',
      'Optimize database queries and schema indices in PostgreSQL'
    ],
    learningOutcomes: [
      'High-scale distributed systems architecture',
      'Production deployment with Docker and Kubernetes',
      'Ownership of critical enterprise platform modules'
    ],
    applicantsCount: 65,
    featured: true,
    postedDate: 'Sep 2026'
  },
  // 5. Workshop
  {
    id: 'opp-work-1',
    role: 'Advanced ROS2 DDS Multicast & Multi-Robot Swarm Workshop',
    type: 'Workshop',
    company: 'Open Robotics & Genova Mobility',
    industryDomain: 'Robotics Networking',
    requiredSkills: ['ROS2', 'Python', 'Linux'],
    eligibility: {
      minCgpa: 7.0,
      eligibleDepartments: ['Computer Science', 'Electronics', 'Mechanical Eng.'],
      gradYears: ['2025', '2026', '2027', '2028']
    },
    experience: 'Open to All Students',
    location: 'Remote',
    cityOrMode: 'Virtual Live Hands-on Lab',
    duration: '2 Days (16 Hours Intensive)',
    deadline: 'Oct 08, 2026',
    compensation: 'Free / Fully Sponsored (Certificate Included)',
    description: 'Intensive two-day hands-on workshop on configuring CycloneDDS and FastDDS for multi-robot UDP multicast on constrained campus networks with packet loss emulation.',
    responsibilities: [
      'Benchmark CycloneDDS vs FastDDS latency in controlled test rigs',
      'Configure ROS2 QoS profiles for lossy wireless robot communications',
      'Build multi-robot fleet monitoring dashboard in WebSockets'
    ],
    learningOutcomes: [
      'Advanced ROS2 middleware tuning for industrial fleet deployments',
      'Official Open Robotics Workshop Completion Certificate'
    ],
    applicantsCount: 88,
    featured: false,
    postedDate: 'Sep 2026'
  },
  // 6. Mentorship
  {
    id: 'opp-ment-1',
    role: '1-on-1 Tier-1 Systems Architecture Mentorship Program',
    type: 'Mentorship',
    company: 'Google / Microsoft Alumni & Genova',
    industryDomain: 'Distributed Systems & Tech Careers',
    requiredSkills: ['DSA', 'System Design'],
    eligibility: {
      minCgpa: 8.0,
      eligibleDepartments: ['Computer Science', 'Information Tech.', 'Electronics'],
      gradYears: ['2026', '2027']
    },
    experience: 'Pre-final / Final Year',
    location: 'Remote',
    cityOrMode: '1-on-1 Virtual Sessions',
    duration: '8 Weeks (Weekly 1-hr Sync)',
    deadline: 'Oct 18, 2026',
    compensation: 'Fully Sponsored Fellowship',
    description: 'Exclusive 8-week structured 1-on-1 mentorship pairing students directly with Principal Engineers at Tier-1 product organizations to master High-Level & Low-Level System Design and technical interview mastery.',
    responsibilities: [
      'Participate in weekly 1-on-1 architectural design reviews',
      'Receive line-by-line feedback on GitHub repositories and resume blueprints',
      'Complete 2 mock Tier-1 technical screening rounds with written evaluations'
    ],
    learningOutcomes: [
      'High-Level Design (HLD) mastery: load balancing, caching, sharding, and message queues',
      'Direct referrals to Tier-1 product engineering opportunities'
    ],
    applicantsCount: 52,
    featured: true,
    postedDate: 'Sep 2026'
  },
  // 7. Training
  {
    id: 'opp-train-1',
    role: 'Deep Learning on Jetson Orin Edge Hardware Training Rig',
    type: 'Training',
    company: 'NVIDIA Deep Learning Institute & Genova',
    industryDomain: 'Edge AI & Computer Vision',
    requiredSkills: ['Python', 'PyTorch'],
    eligibility: {
      minCgpa: 7.2,
      eligibleDepartments: ['Computer Science', 'Electronics', 'Information Tech.'],
      gradYears: ['2025', '2026', '2027']
    },
    experience: 'Open to All Students',
    location: 'Hybrid',
    cityOrMode: 'Campus AI Lab & Remote GPU Sandbox',
    duration: '4 Weeks (Saturdays & Sundays)',
    deadline: 'Oct 25, 2026',
    compensation: 'NVIDIA DLI Certificate + Orin Cloud Rig Access',
    description: 'Comprehensive 4-week industrial certification training program on TensorRT quantization, sub-20ms multi-camera optical flow, and YOLOv8 deployment on NVIDIA Jetson Orin micro-supercomputers.',
    responsibilities: [
      'Quantize FP32 PyTorch models to INT8 using TensorRT calibration tables',
      'Optimize multi-stream RTSP video decoding pipeline with DeepStream SDK',
      'Deploy real-time pedestrian obstacle detector on vehicle edge hardware'
    ],
    learningOutcomes: [
      'Official NVIDIA Deep Learning Institute (DLI) Credential',
      'Industrial edge computer vision model optimization techniques'
    ],
    applicantsCount: 74,
    featured: false,
    postedDate: 'Sep 2026'
  }
];

export class InternshipMarketplaceEngine {
  private static STORAGE_KEY = 'genova_marketplace_opportunities';
  private static APPLICATIONS_KEY = 'genova_marketplace_applications';

  public static getOpportunities(): MarketplaceOpportunity[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const combined = [...DEFAULT_OPPORTUNITIES];
        parsed.forEach((p: MarketplaceOpportunity) => {
          if (!combined.some(c => c.id === p.id)) {
            combined.unshift(p);
          }
        });
        return combined;
      }
    } catch (e) {
      console.error('Failed to parse opportunities from storage', e);
    }
    return DEFAULT_OPPORTUNITIES;
  }

  public static createOpportunity(opp: Omit<MarketplaceOpportunity, 'id' | 'applicantsCount' | 'postedDate'>): MarketplaceOpportunity {
    const opportunities = this.getOpportunities();
    const newOpportunity: MarketplaceOpportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      applicantsCount: 0,
      postedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    opportunities.unshift(newOpportunity);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(opportunities));
    } catch (e) {
      console.error('Failed to save opportunity to storage', e);
    }
    return newOpportunity;
  }

  public static getApplications(): ApplicationSubmission[] {
    try {
      return JSON.parse(localStorage.getItem(this.APPLICATIONS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  public static applyToOpportunity(opportunityId: string, studentId: string, studentName: string): ApplicationSubmission {
    const applications = this.getApplications();
    const existing = applications.find(a => a.opportunityId === opportunityId && a.studentId === studentId);
    if (existing) {
      return existing;
    }

    const newApp: ApplicationSubmission = {
      opportunityId,
      studentId,
      studentName,
      appliedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verificationHash: `0xPASSPORT${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      status: 'SUBMITTED'
    };

    applications.unshift(newApp);
    try {
      localStorage.setItem(this.APPLICATIONS_KEY, JSON.stringify(applications));
      // Increment applicant count on opportunity
      const opps = this.getOpportunities();
      const match = opps.find(o => o.id === opportunityId);
      if (match) {
        match.applicantsCount += 1;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(opps));
      }
    } catch (e) {
      console.error('Failed to save application', e);
    }
    return newApp;
  }

  /**
   * Calculates candidate skill match against opportunity required skills
   */
  public static calculateSkillMatch(opportunity: MarketplaceOpportunity, candidateSkills: { name: string; level: number }[]): {
    matchPercentage: number;
    matchedSkillsCount: number;
    totalSkillsCount: number;
    matchedList: string[];
    missingList: string[];
  } {
    const required = opportunity.requiredSkills;
    if (required.length === 0) {
      return { matchPercentage: 100, matchedSkillsCount: 0, totalSkillsCount: 0, matchedList: [], missingList: [] };
    }

    const matchedList: string[] = [];
    const missingList: string[] = [];

    required.forEach(req => {
      const match = candidateSkills.find(s => 
        s.name.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.name.toLowerCase())
      );
      if (match && match.level >= 50) {
        matchedList.push(req);
      } else {
        missingList.push(req);
      }
    });

    const matchPercentage = Math.round((matchedList.length / required.length) * 100);

    return {
      matchPercentage,
      matchedSkillsCount: matchedList.length,
      totalSkillsCount: required.length,
      matchedList,
      missingList
    };
  }
}

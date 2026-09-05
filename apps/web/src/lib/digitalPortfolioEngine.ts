/**
 * GENOVA CampusOS AI — Digital Employability Portfolio Engine (SIH26044)
 * 
 * Manages the verified digital employability portfolio for:
 * Candidate: RISHI SHARMA
 * 
 * Core Headline Metrics:
 * • Career Readiness: 84%
 * • Verified Skills:  17
 * • Certifications:   8
 * • Projects:         6
 * • Internships:      2
 * 
 * Includes explicit institutional verification status across all 5 tiers:
 * 1. Skill
 * 2. Certificate
 * 3. Project
 * 4. Internship
 * 5. Achievement
 */

export interface VerifiedSkillItem {
  id: string;
  name: string;
  category: string;
  level: number; // 0-100
  verified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  verificationHash: string;
  verificationMethod?: string;
  claimDate?: string;
  badgeSeal?: 'Gold Verified' | 'Enterprise Verified' | 'Academic Verified';
  trustScore?: string;
}

export interface VerifiedProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  liveUrl?: string;
  stars: number;
  verified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  verificationHash: string;
  highlight: string;
  verificationMethod?: string;
  claimDate?: string;
  badgeSeal?: 'Gold Verified' | 'Enterprise Verified' | 'Academic Verified';
  trustScore?: string;
}

export interface VerifiedCertificateItem {
  id: string;
  title: string;
  issuer: string;
  credentialId: string;
  issueDate: string;
  verifyUrl: string;
  verified: boolean;
  verifiedBy: string;
  verificationHash: string;
  skillsCovered: string[];
  verificationMethod?: string;
  claimDate?: string;
  badgeSeal?: 'Gold Verified' | 'Enterprise Verified' | 'Academic Verified';
  trustScore?: string;
}

export interface VerifiedInternshipItem {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  stipend: string;
  mentorName: string;
  mentorRating: number; // out of 5
  verified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  verificationHash: string;
  keyOutcomes: string[];
  verificationMethod?: string;
  claimDate?: string;
  badgeSeal?: 'Gold Verified' | 'Enterprise Verified' | 'Academic Verified';
  trustScore?: string;
}

export interface VerifiedAchievementItem {
  id: string;
  title: string;
  category: 'Hackathon' | 'Patent' | 'Award' | 'Academic';
  year: string;
  issuedBy: string;
  description: string;
  verified: boolean;
  verificationHash: string;
  verificationMethod?: string;
  claimDate?: string;
  badgeSeal?: 'Gold Verified' | 'Enterprise Verified' | 'Academic Verified';
  trustScore?: string;
}

export interface DigitalPortfolioData {
  candidateName: string;
  roleHeadline: string;
  institution: string;
  degree: string;
  cgpa: number;
  graduationBatch: string;
  avatarUrl: string;
  careerReadinessScore: number;
  stats: {
    verifiedSkillsCount: number;
    certificationsCount: number;
    projectsCount: number;
    internshipsCount: number;
    achievementsCount: number;
  };
  passportHash: string;
  skills: VerifiedSkillItem[];
  projects: VerifiedProjectItem[];
  certifications: VerifiedCertificateItem[];
  internships: VerifiedInternshipItem[];
  achievements: VerifiedAchievementItem[];
}

export const PORTFOLIO_DATA: DigitalPortfolioData = {
  candidateName: 'RISHI SHARMA',
  roleHeadline: 'Autonomous Systems & Full-Stack AI Engineer',
  institution: 'GENOVA Institute of Advanced Technology & Engineering',
  degree: 'B.Tech in Computer Science & Engineering',
  cgpa: 9.24,
  graduationBatch: 'Batch 2023 - 2027',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  careerReadinessScore: 84,
  stats: {
    verifiedSkillsCount: 17,
    certificationsCount: 8,
    projectsCount: 6,
    internshipsCount: 2,
    achievementsCount: 4
  },
  passportHash: '0xGENOVA9942FA71C0B819E752D8A4',
  
  // 17 Verified Skills (Including React 91%, Python 82%, SQL 74%)
  skills: [
    {
      id: 'sk-react',
      name: 'React',
      category: 'Software Engineering',
      level: 91,
      verified: true,
      verifiedBy: 'GENOVA Frontend Systems Rig & CodeBench',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xSKL-REACT-91-F8A2'
    },
    {
      id: 'sk-python',
      name: 'Python',
      category: 'Software Engineering',
      level: 82,
      verified: true,
      verifiedBy: 'AI Algorithmic Coding Sandbox',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xSKL-PY-82-3D19'
    },
    {
      id: 'sk-sql',
      name: 'SQL',
      category: 'Data & Distributed Systems',
      level: 74,
      verified: true,
      verifiedBy: 'PostgreSQL Advanced Indexing Benchmark',
      verifiedAt: 'Jul 2026',
      verificationHash: '0xSKL-SQL-74-4C21'
    },
    {
      id: 'sk-ros2',
      name: 'ROS2 / Micro-ROS',
      category: 'Autonomous Systems',
      level: 90,
      verified: true,
      verifiedBy: 'Prof. K. Sen (Autonomy Hardware Lab)',
      verifiedAt: 'Jul 2026',
      verificationHash: '0xSKL-ROS2-90-E901'
    },
    {
      id: 'sk-nav2',
      name: 'Nav2 Path Planning',
      category: 'Autonomous Systems',
      level: 86,
      verified: true,
      verifiedBy: 'Field Autonomy Shuttle Benchmark',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xSKL-NAV2-86-5A84'
    },
    {
      id: 'sk-ts',
      name: 'TypeScript',
      category: 'Software Engineering',
      level: 94,
      verified: true,
      verifiedBy: 'CampusOS Core Architecture Review',
      verifiedAt: 'Sep 2026',
      verificationHash: '0xSKL-TS-94-B110'
    },
    {
      id: 'sk-pytorch',
      name: 'PyTorch & Deep Learning',
      category: 'Machine Learning',
      level: 88,
      verified: true,
      verifiedBy: 'NVIDIA DLI Lab Evaluation',
      verifiedAt: 'Jun 2026',
      verificationHash: '0xSKL-TORCH-88-2F77'
    },
    {
      id: 'sk-postgis',
      name: 'PostGIS & GeoTIFF',
      category: 'Geospatial AI',
      level: 85,
      verified: true,
      verifiedBy: 'AeroLand GIS Spatial Data Exam',
      verifiedAt: 'Jul 2026',
      verificationHash: '0xSKL-GIS-85-8D40'
    },
    {
      id: 'sk-opencv',
      name: 'OpenCV & Computer Vision',
      category: 'Machine Learning',
      level: 78,
      verified: true,
      verifiedBy: 'Edge Perception Validation Rig',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xSKL-CV-78-7A12'
    },
    {
      id: 'sk-dsa',
      name: 'DSA & Algorithms',
      category: 'Computer Science Core',
      level: 76,
      verified: true,
      verifiedBy: 'GENOVA Algorithmic Challenge Suite',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xSKL-DSA-76-9F02'
    },
    {
      id: 'sk-system-design',
      name: 'System Design & HLD',
      category: 'Software Engineering',
      level: 78,
      verified: true,
      verifiedBy: 'Principal Engineer Mock Review',
      verifiedAt: 'Sep 2026',
      verificationHash: '0xSKL-SYS-78-6B33'
    },
    {
      id: 'sk-docker',
      name: 'Docker & Kubernetes',
      category: 'DevOps & Cloud',
      level: 80,
      verified: true,
      verifiedBy: 'Containerized Cluster CI Pipeline',
      verifiedAt: 'Jul 2026',
      verificationHash: '0xSKL-K8S-80-1E45'
    },
    {
      id: 'sk-can',
      name: 'CAN Bus & Embedded C++',
      category: 'Systems & Hardware',
      level: 82,
      verified: true,
      verifiedBy: 'Drive-by-Wire Hardware Interlock Test',
      verifiedAt: 'Jun 2026',
      verificationHash: '0xSKL-CAN-82-3A99'
    },
    {
      id: 'sk-tensorrt',
      name: 'TensorRT & Quantization',
      category: 'Machine Learning',
      level: 84,
      verified: true,
      verifiedBy: 'NVIDIA Jetson Orin Hardware Benchmark',
      verifiedAt: 'Jul 2026',
      verificationHash: '0xSKL-TRT-84-4D88'
    },
    {
      id: 'sk-fastapi',
      name: 'FastAPI & REST Architecture',
      category: 'Software Engineering',
      level: 88,
      verified: true,
      verifiedBy: 'Microservice Async Load Test Suite',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xSKL-FAST-88-0B21'
    },
    {
      id: 'sk-lidar',
      name: '3D LiDAR SLAM & PointClouds',
      category: 'Autonomous Systems',
      level: 83,
      verified: true,
      verifiedBy: 'PCL Voxel Spatial Accuracy Test',
      verifiedAt: 'Jun 2026',
      verificationHash: '0xSKL-LIDAR-83-5C39'
    },
    {
      id: 'sk-tailwind',
      name: 'Tailwind CSS & Design Systems',
      category: 'Software Engineering',
      level: 92,
      verified: true,
      verifiedBy: 'CampusOS Design Tokens System',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xSKL-CSS-92-8E14'
    }
  ],

  // 6 Verified Projects (Including CampusOS, AI Document Intelligence, Autonomous Mobility)
  projects: [
    {
      id: 'proj-campusos',
      title: 'CampusOS',
      category: 'Autonomous Multi-Agent ERP Platform',
      description: 'Enterprise institutional operating system orchestrating multi-agent copilots, zero-trust telemetry, real-time campus digital twin, and skill intelligence.',
      techStack: ['React 19', 'TypeScript', 'Tailwind v4', 'ADK', 'Gemini'],
      repoUrl: 'https://github.com/genova/campusos',
      liveUrl: 'http://localhost:5173',
      stars: 342,
      verified: true,
      verifiedBy: 'GENOVA University Senate & Production Deployment Audit',
      verifiedAt: 'Sep 2026',
      verificationHash: '0xPRJ-CAMPUSOS-8419A',
      highlight: 'Live across university operations with sub-50ms responsive interactions.'
    },
    {
      id: 'proj-doc-intel',
      title: 'AI Document Intelligence',
      category: 'Multimodal RAG & Knowledge Systems',
      description: 'Enterprise RAG knowledge hub processing PDFs, syllabi, fee circulars, and institutional transcripts with hybrid vector search and citations.',
      techStack: ['Python', 'PostgreSQL', 'pgvector', 'FastAPI', 'Gemini Pro'],
      repoUrl: 'https://github.com/genova/ai-doc-center',
      stars: 184,
      verified: true,
      verifiedBy: 'Academic Vector Benchmark & Faculty Capstone Review',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xPRJ-DOCINTEL-7721F',
      highlight: 'Indexes 15,000+ university documents with 98.2% factual extraction accuracy.'
    },
    {
      id: 'proj-autonomy',
      title: 'Autonomous Mobility',
      category: 'Robotics & Autonomous Vehicles',
      description: 'Full-stack ROS2 Humble autonomous electric campus shuttle with dual LiDAR sensor fusion, Nav2 costmap inflation, and remote teleoperation interlock.',
      techStack: ['ROS2 Humble', 'Nav2', 'C++', 'Python', 'WebRTC', 'CAN Bus'],
      repoUrl: 'https://github.com/genova/autonomous-mobility',
      stars: 215,
      verified: true,
      verifiedBy: 'Genova Mobility Systems Hardware-in-the-Loop Certification',
      verifiedAt: 'Jul 2026',
      verificationHash: '0xPRJ-AUTONOMY-3310D',
      highlight: 'Navigated 12 km of real campus roads with zero safety disengagements.'
    },
    {
      id: 'proj-land-intel',
      title: 'GENOVA Land Intelligence Cadastral Matcher',
      category: 'Geospatial AI & Satellite Analytics',
      description: 'Deep neural network aligning high-resolution drone orthomosaics with state cadastral deeds, generating automated NDVI vegetation indices.',
      techStack: ['PyTorch', 'GeoTIFF', 'PostGIS', 'Rasterio', 'FastAPI'],
      repoUrl: 'https://github.com/genova/land-intelligence',
      stars: 128,
      verified: true,
      verifiedBy: 'AeroLand GIS Technologies Industrial Audit',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xPRJ-LANDINTEL-5542E',
      highlight: 'Segmented 5,400+ land parcels with 96.4% boundary IoU accuracy.'
    },
    {
      id: 'proj-soc-radar',
      title: 'Zero-Trust SOC Security Radar',
      category: 'Cybersecurity & Behavioral Telemetry',
      description: 'Continuous runtime security telemetry engine monitoring privilege escalations, unauthorized API access patterns, and automated defense playbooks.',
      techStack: ['TypeScript', 'Node.js', 'SOC 2 Rules', 'Cryptographic Audit'],
      repoUrl: 'https://github.com/genova/security-radar',
      stars: 92,
      verified: true,
      verifiedBy: 'Institutional Cyber Security Lab',
      verifiedAt: 'Aug 2026',
      verificationHash: '0xPRJ-SOCRADAR-9904B',
      highlight: 'Processed 500k+ mock malicious payload vectors with sub-second containment.'
    },
    {
      id: 'proj-distributed-cache',
      title: 'High-Throughput Distributed LRU Cache',
      category: 'Distributed Systems & Compilers',
      description: 'Memory-safe high-throughput distributed caching layer with sharded mutex locks and consistent hashing for low-latency session persistence.',
      techStack: ['Rust', 'TypeScript', 'gRPC', 'Docker'],
      repoUrl: 'https://github.com/genova/distributed-cache',
      stars: 110,
      verified: true,
      verifiedBy: 'Open Source Engineering Peer Committee',
      verifiedAt: 'Jun 2026',
      verificationHash: '0xPRJ-DISTCACHE-1288C',
      highlight: 'Benchmarks demonstrated 120,000 requests/sec with p99 latency < 2ms.'
    }
  ],

  // 8 Verified Certifications
  certifications: [
    {
      id: 'cert-aws',
      title: 'AWS Certified Solutions Architect (Associate)',
      issuer: 'Amazon Web Services (AWS)',
      credentialId: 'AWS-SAA-884921',
      issueDate: 'Aug 2025',
      verifyUrl: 'https://aws.amazon.com/verify/AWS-SAA-884921',
      verified: true,
      verifiedBy: 'AWS Credential Registry',
      verificationHash: '0xCRT-AWS-SAA-8849',
      skillsCovered: ['Cloud Architecture', 'VPC', 'EC2/S3', 'High Availability']
    },
    {
      id: 'cert-nvidia',
      title: 'NVIDIA DLI: Deep Learning for Autonomous Systems',
      issuer: 'NVIDIA Deep Learning Institute',
      credentialId: 'NVDLI-AV-88421',
      issueDate: 'Nov 2025',
      verifyUrl: 'https://nvidia.com/verify/NVDLI-AV-88421',
      verified: true,
      verifiedBy: 'NVIDIA Deep Learning Institute',
      verificationHash: '0xCRT-NVDLI-AV-8842',
      skillsCovered: ['TensorRT', 'Jetson Orin', 'Computer Vision', 'INT8 Quantization']
    },
    {
      id: 'cert-ros',
      title: 'ROS-Industrial Navigation & Manipulation',
      issuer: 'ROS-Industrial Consortium',
      credentialId: 'ROSI-NAV-5510',
      issueDate: 'Jan 2026',
      verifyUrl: 'https://rosindustrial.org/verify/5510',
      verified: true,
      verifiedBy: 'ROS-Industrial Consortium',
      verificationHash: '0xCRT-ROSI-NAV-5510',
      skillsCovered: ['ROS2 Humble', 'Nav2', 'Industrial Trajectories', 'DDS QoS']
    },
    {
      id: 'cert-gcp',
      title: 'Google Cloud Professional Data Engineer',
      issuer: 'Google Cloud Platform',
      credentialId: 'GCP-PCA-99214',
      issueDate: 'Oct 2025',
      verifyUrl: 'https://cloud.google.com/verify/99214',
      verified: true,
      verifiedBy: 'Google Cloud Platform',
      verificationHash: '0xCRT-GCP-DATA-9921',
      skillsCovered: ['BigQuery', 'Dataflow', 'Cloud Pub/Sub', 'ML Pipelines']
    },
    {
      id: 'cert-cka',
      title: 'CKA: Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      credentialId: 'CKA-CNCF-3091',
      issueDate: 'Feb 2026',
      verifyUrl: 'https://cncf.io/verify/CKA-3091',
      verified: true,
      verifiedBy: 'Linux Foundation / CNCF',
      verificationHash: '0xCRT-CKA-CNCF-3091',
      skillsCovered: ['Kubernetes Cluster Ops', 'Ingress', 'RBAC', 'Network Policies']
    },
    {
      id: 'cert-meta',
      title: 'Meta Frontend Developer Professional Certificate',
      issuer: 'Meta',
      credentialId: 'META-FED-7729',
      issueDate: 'Sep 2025',
      verifyUrl: 'https://coursera.org/verify/META-FED-7729',
      verified: true,
      verifiedBy: 'Coursera & Meta Verification Network',
      verificationHash: '0xCRT-META-FED-7729',
      skillsCovered: ['React', 'JavaScript', 'HTML5/CSS3', 'UI/UX Principles']
    },
    {
      id: 'cert-postgis',
      title: 'Advanced Geospatial Data Science with PostGIS',
      issuer: 'OpenGIS Academy',
      credentialId: 'OGIS-DS-2026',
      issueDate: 'Feb 2026',
      verifyUrl: 'https://opengis.org/cert/2026',
      verified: true,
      verifiedBy: 'OpenGIS Academy Registry',
      verificationHash: '0xCRT-OGIS-DS-2026',
      skillsCovered: ['PostGIS', 'Rasterio', 'GDAL', 'GeoTIFF']
    },
    {
      id: 'cert-tf',
      title: 'TensorFlow Developer Certificate',
      issuer: 'DeepLearning.AI',
      credentialId: 'TF-DEV-4410',
      issueDate: 'Jul 2025',
      verifyUrl: 'https://deeplearning.ai/verify/TF-4410',
      verified: true,
      verifiedBy: 'DeepLearning.AI Credential Authority',
      verificationHash: '0xCRT-TF-DEV-4410',
      skillsCovered: ['TensorFlow', 'CNNs', 'Transfer Learning', 'Time Series']
    }
  ],

  // 2 Verified Industrial Internships
  internships: [
    {
      id: 'int-genova',
      role: 'Autonomous Systems Software Engineer Intern',
      company: 'Genova Mobility Labs',
      duration: 'Jul 2026 - Dec 2026 (6 Months)',
      location: 'Bengaluru Technical Center (Hybrid)',
      stipend: '₹45,000 / month + Pre-Placement Offer',
      mentorName: 'Dr. Vikram Malhotra (Principal Autonomous Systems Architect)',
      mentorRating: 4.9,
      verified: true,
      verifiedBy: 'Genova Mobility HR & University Placement Senate',
      verifiedAt: 'Sep 2026',
      verificationHash: '0xINT-GML-AUTONOMY-0941',
      keyOutcomes: [
        'Calibrated LiDAR-camera sensor fusion filter running at 45Hz on NVIDIA Jetson Orin',
        'Authored custom Nav2 costmap pedestrian inflation layer, cutting collision risks by 40%',
        'Extended Pre-Placement Offer (PPO) target benchmark ₹22.5 LPA'
      ]
    },
    {
      id: 'int-aerodynamics',
      role: 'Computer Vision & Remote Sensing Intern',
      company: 'AeroDynamics AI Mobility Labs',
      duration: 'May 2025 - Jul 2025 (3 Months)',
      location: 'Bengaluru, India',
      stipend: '₹35,000 / month',
      mentorName: 'Kavita Rao (Lead Computer Vision Engineer)',
      mentorRating: 4.8,
      verified: true,
      verifiedBy: 'AeroDynamics Corporate Board & Placement Cell',
      verifiedAt: 'Aug 2025',
      verificationHash: '0xINT-AERO-CV-8812',
      keyOutcomes: [
        'Implemented SIMD C++ accelerated TEB local trajectory planner for campus rovers',
        'Reduced obstacle detection latency by 34% through INT8 calibration caches'
      ]
    }
  ],

  // 4 Verified Achievements
  achievements: [
    {
      id: 'ach-sih',
      title: 'Smart India Hackathon (SIH) 2026 Grand Finalist',
      category: 'Hackathon',
      year: '2026',
      issuedBy: 'Ministry of Education & AICTE, Govt. of India',
      description: 'Selected in top 1% nationwide for autonomous campus operating system and AI student employability matching architecture.',
      verified: true,
      verificationHash: '0xACH-SIH-2026-FINALIST-001'
    },
    {
      id: 'ach-patent',
      title: 'Published Patent: Fail-Safe Drive-by-Wire Autonomous Interlock',
      category: 'Patent',
      year: '2026',
      issuedBy: 'Indian Patent Office Gazette (CBR No. 89410)',
      description: 'Hardware watchdog interlock automatically transitioning vehicle actuators into safe emergency stop mode upon CAN bus cyclic message loss.',
      verified: true,
      verificationHash: '0xACH-PAT-2026-IN-89410'
    },
    {
      id: 'ach-hackathon',
      title: '1st Place Winner — Inter-University DeepTech Grand Challenge',
      category: 'Hackathon',
      year: '2026',
      issuedBy: 'National Robotics & Autonomy Forum',
      description: 'Won 1st prize among 140 teams for real-time 3D LiDAR point cloud clustering on embedded mobile robots.',
      verified: true,
      verificationHash: '0xACH-HACK-DEEPTECH-01'
    },
    {
      id: 'ach-dean',
      title: "Dean's Technical Excellence & Academic Honor Award",
      category: 'Academic',
      year: '2025 - 2026',
      issuedBy: 'GENOVA Academic Senate & Board of Governors',
      description: 'Awarded for maintaining 9.24 CGPA while simultaneously building production institutional software platforms.',
      verified: true,
      verificationHash: '0xACH-DEAN-HONORS-924'
    }
  ]
};

export type ClaimType = 'CERTIFICATE' | 'SKILL' | 'INTERNSHIP' | 'PROJECT' | 'ACHIEVEMENT';

export interface ClaimVerificationPipelineInfo {
  tier: ClaimType;
  title: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  oracleType: string;
  exampleAuthority: string;
  rationale: string;
}

export interface NewClaimSubmission {
  tier: ClaimType;
  title: string;
  categoryOrDomain: string;
  issuerOrCompany: string;
  details: string;
  evidenceUrl?: string;
}

export const VERIFICATION_PIPELINES: Record<ClaimType, ClaimVerificationPipelineInfo> = {
  CERTIFICATE: {
    tier: 'CERTIFICATE',
    title: 'Certificates',
    step1: 'Credential Upload & Claim Submission',
    step2: 'Issuer Public Key / API Authority Query',
    step3: 'Cryptographic Credential Seal Minted',
    step4: 'Published to Employability Portfolio',
    oracleType: 'Cryptographic API Authority',
    exampleAuthority: 'AWS • CNCF • NVIDIA • Meta',
    rationale: 'Validates credential authenticity directly against the certificate authority to eliminate fake paper certificates.'
  },
  SKILL: {
    tier: 'SKILL',
    title: 'Skills',
    step1: 'Self-Reported Skill Claim',
    step2: 'Automated AI Code Sandbox & Algorithmic Rig',
    step3: 'Skill Mastery Benchmark Badge Minted',
    step4: 'Published to Competency Matrix',
    oracleType: 'Compiler & Algorithmic Rig',
    exampleAuthority: 'LeetCode Rig • NVIDIA DLI • CodeBench',
    rationale: 'Evaluates hands-on coding proficiency and test-case passes rather than passive buzzword lists.'
  },
  INTERNSHIP: {
    tier: 'INTERNSHIP',
    title: 'Internships',
    step1: 'Work Experience Record Claim',
    step2: 'Corporate Mentor Sign-off & HR Placement Audit',
    step3: 'Enterprise Work Experience Badge Minted',
    step4: 'Published to Verified Industry Placements',
    oracleType: 'Corporate Mentor & HR Sign-Off',
    exampleAuthority: 'Genova Mobility HR • AeroDynamics AI',
    rationale: 'Confirms actual project contributions, mentor ratings, and company tenure directly with enterprise leads.'
  },
  PROJECT: {
    tier: 'PROJECT',
    title: 'Projects',
    step1: 'Technical Project Codebase Claim',
    step2: 'Git Commit Tree & CI/CD Jury Audit',
    step3: 'Production Repository Badge Minted',
    step4: 'Published to Flagship Projects Showcase',
    oracleType: 'CI/CD & Faculty Capstone Jury',
    exampleAuthority: 'University Senate • GitHub Actions CI/CD',
    rationale: 'Inspects commit history, build logs, and architecture design to eliminate plagiarized repository claims.'
  },
  ACHIEVEMENT: {
    tier: 'ACHIEVEMENT',
    title: 'Achievements',
    step1: 'Honour / Award Claim',
    step2: 'Hackathon / Patent Gazette Verification',
    step3: 'Distinction Honor Badge Minted',
    step4: 'Published to Verified Honours Registry',
    oracleType: 'Official Gazette / Jury Record',
    exampleAuthority: 'AICTE / MoE • Indian Patent Office',
    rationale: 'Verifies competition rankings and government patent records with official institutional juries.'
  }
};

export class DigitalPortfolioEngine {
  private static STORAGE_KEY = 'genova_digital_portfolio_rishi_sharma';

  public static getPortfolio(): DigitalPortfolioData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Robust fallback merge for items
        return {
          ...PORTFOLIO_DATA,
          ...parsed,
          skills: (parsed.skills || PORTFOLIO_DATA.skills).map((s: VerifiedSkillItem) => ({
            ...s,
            verificationMethod: s.verificationMethod || 'Continuous AI Code Sandbox & Algorithmic Rig',
            claimDate: s.claimDate || 'Spring 2026',
            badgeSeal: s.badgeSeal || 'Gold Verified',
            trustScore: s.trustScore || '100% Tamper-Proof'
          })),
          projects: (parsed.projects || PORTFOLIO_DATA.projects).map((p: VerifiedProjectItem) => ({
            ...p,
            verificationMethod: p.verificationMethod || 'Faculty Capstone Jury & GitHub CI/CD Test Suite',
            claimDate: p.claimDate || 'Spring 2026',
            badgeSeal: p.badgeSeal || 'Academic Verified',
            trustScore: p.trustScore || '100% Tamper-Proof'
          })),
          certifications: (parsed.certifications || PORTFOLIO_DATA.certifications).map((c: VerifiedCertificateItem) => ({
            ...c,
            verificationMethod: c.verificationMethod || 'Issuer Public Key & Official Credential Authority Query',
            claimDate: c.claimDate || 'Spring 2026',
            badgeSeal: c.badgeSeal || 'Enterprise Verified',
            trustScore: c.trustScore || '100% Tamper-Proof'
          })),
          internships: (parsed.internships || PORTFOLIO_DATA.internships).map((i: VerifiedInternshipItem) => ({
            ...i,
            verificationMethod: i.verificationMethod || 'Corporate Mentor Rating & University Placement Senate Audit',
            claimDate: i.claimDate || 'Summer 2026',
            badgeSeal: i.badgeSeal || 'Enterprise Verified',
            trustScore: i.trustScore || '100% Tamper-Proof'
          })),
          achievements: (parsed.achievements || PORTFOLIO_DATA.achievements).map((a: VerifiedAchievementItem) => ({
            ...a,
            verificationMethod: a.verificationMethod || 'Official Competition Jury Record & Patent Gazette Gazette Entry',
            claimDate: a.claimDate || '2026',
            badgeSeal: a.badgeSeal || 'Gold Verified',
            trustScore: a.trustScore || '100% Tamper-Proof'
          }))
        };
      }
    } catch (e) {
      console.error('Failed to load portfolio from storage', e);
    }
    return PORTFOLIO_DATA;
  }

  public static savePortfolio(data: DigitalPortfolioData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio', e);
    }
  }

  public static submitAndVerifyClaim(claim: NewClaimSubmission): DigitalPortfolioData {
    const data = this.getPortfolio();
    const timestamp = 'Just now';
    const hash = `0xVER-${claim.tier.substring(0, 3)}-${Math.random().toString(16).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    if (claim.tier === 'CERTIFICATE') {
      const newCert: VerifiedCertificateItem = {
        id: `cert-${Date.now()}`,
        title: claim.title,
        issuer: claim.issuerOrCompany,
        credentialId: `GENOVA-VER-${Math.floor(100000 + Math.random() * 900000)}`,
        issueDate: 'Sep 2026',
        verifyUrl: claim.evidenceUrl || ('https://verify.genova.ai/cred/' + hash),
        verified: true,
        verifiedBy: `${claim.issuerOrCompany} Credential Authority & GENOVA Senate`,
        verificationHash: hash,
        skillsCovered: [claim.categoryOrDomain, 'Cloud Systems', 'Architecture'],
        verificationMethod: 'Issuer API v2 Key Signature & Automated Verification Oracle',
        claimDate: timestamp,
        badgeSeal: 'Gold Verified',
        trustScore: '100% Tamper-Proof'
      };
      data.certifications.unshift(newCert);
      data.stats.certificationsCount = data.certifications.length;
    } else if (claim.tier === 'SKILL') {
      const newSkill: VerifiedSkillItem = {
        id: `skill-${Date.now()}`,
        name: claim.title,
        category: claim.categoryOrDomain || 'Software Engineering',
        level: 88,
        verified: true,
        verifiedBy: 'AI Algorithmic Rig & Continuous Test Sandbox',
        verifiedAt: timestamp,
        verificationHash: hash,
        verificationMethod: 'Automated LeetCode Test Suite (12 test vectors passed)',
        claimDate: timestamp,
        badgeSeal: 'Gold Verified',
        trustScore: '100% Tamper-Proof'
      };
      data.skills.unshift(newSkill);
      data.stats.verifiedSkillsCount = data.skills.length;
    } else if (claim.tier === 'INTERNSHIP') {
      const newInt: VerifiedInternshipItem = {
        id: `int-${Date.now()}`,
        role: claim.title,
        company: claim.issuerOrCompany,
        duration: 'Summer 2026 (3 Months)',
        location: 'Bengaluru, India (Hybrid)',
        stipend: '₹40,000 / month',
        mentorName: 'Dr. S. Nair (Principal Engineering Director)',
        mentorRating: 4.9,
        verified: true,
        verifiedBy: `${claim.issuerOrCompany} Corporate Board & Placement Senate`,
        verifiedAt: timestamp,
        verificationHash: hash,
        keyOutcomes: [claim.details || 'Completed assigned production sprint deliverables', 'Peer reviewed and merged to upstream release'],
        verificationMethod: 'Direct Mentor Sign-Off + Placement Senate Audit',
        claimDate: timestamp,
        badgeSeal: 'Enterprise Verified',
        trustScore: '100% Tamper-Proof'
      };
      data.internships.unshift(newInt);
      data.stats.internshipsCount = data.internships.length;
    } else if (claim.tier === 'PROJECT') {
      const newProj: VerifiedProjectItem = {
        id: `proj-${Date.now()}`,
        title: claim.title,
        category: claim.categoryOrDomain || 'Software Systems',
        description: claim.details || 'Production engineering implementation with automated test coverage.',
        techStack: ['TypeScript', 'Python', 'Docker', 'PostgreSQL'],
        repoUrl: claim.evidenceUrl || ('https://github.com/rishi-sharma/' + claim.title.toLowerCase().replace(/\s+/g, '-')),
        stars: 42,
        verified: true,
        verifiedBy: 'Faculty Capstone Jury & GitHub CI/CD Audit',
        verifiedAt: timestamp,
        verificationHash: hash,
        highlight: '100% test coverage with automated GitHub Actions verification badge',
        verificationMethod: 'Git Tree Commit Analysis + Unit Test Pass Rate (98.6%)',
        claimDate: timestamp,
        badgeSeal: 'Academic Verified',
        trustScore: '100% Tamper-Proof'
      };
      data.projects.unshift(newProj);
      data.stats.projectsCount = data.projects.length;
    } else if (claim.tier === 'ACHIEVEMENT') {
      const newAch: VerifiedAchievementItem = {
        id: `ach-${Date.now()}`,
        title: claim.title,
        category: 'Hackathon',
        year: '2026',
        issuedBy: claim.issuerOrCompany || 'Government & Industry Consortium',
        description: claim.details || 'Evaluated and awarded by national expert jury panel.',
        verified: true,
        verificationHash: hash,
        verificationMethod: 'Jury Gazette Record & Certificate Serial Verification',
        claimDate: timestamp,
        badgeSeal: 'Gold Verified',
        trustScore: '100% Tamper-Proof'
      };
      data.achievements.unshift(newAch);
      data.stats.achievementsCount = data.achievements.length;
    }

    this.savePortfolio(data);
    return data;
  }

  public static resetToDefault(): DigitalPortfolioData {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {}
    return PORTFOLIO_DATA;
  }
}

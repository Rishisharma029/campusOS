export interface TechnicalSkill {
  id: string;
  name: string;
  category: 'Autonomous Systems' | 'Geospatial AI' | 'Machine Learning' | 'Software Engineering' | 'Systems & Hardware';
  level: number; // 0 to 100
  verified: boolean;
  verifiedBy?: string;
  proofProject?: string;
  confidenceScore: number; // Computed from assessments
}

export interface SoftSkill {
  id: string;
  name: string;
  score: number; // 0 to 100
  assessedVia: string;
  feedback: string;
  verified: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  credentialId: string;
  issueDate: string;
  expiryDate?: string;
  verifyUrl?: string;
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  verified: boolean;
  highlight: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  keyDeliverables: string[];
  mentorRating: number; // out of 5
  certificateUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Hackathon' | 'Publication' | 'Patent' | 'Honor';
  year: string;
  description: string;
  badge: string;
}

export interface CareerInterests {
  targetRoles: string[];
  dreamCompanies: string[];
  expectedCtcRange: string;
  preferredLocations: string[];
  domainFocus: string[];
}

export interface ResumeData {
  headline: string;
  summary: string;
  atsScore: number;
  lastUpdated: string;
  generatedTemplate: 'Modern Engineering' | 'Academic' | 'Minimalist';
}

export interface VerifiedRecord {
  id: string;
  recordType: string;
  title: string;
  issuer: string;
  verificationHash: string;
  verifiedAt: string;
  status: 'VERIFIED' | 'PENDING';
}

export interface AcademicProfile {
  degree: string;
  department: string;
  currentSemester: number;
  batch: string;
  cgpa: number;
  academicStanding: string;
  totalCredits: number;
  attendanceRate: number;
}

export interface StudentSkillProfile {
  studentId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  academic: AcademicProfile;
  technicalSkills: TechnicalSkill[];
  softSkills: SoftSkill[];
  certifications: Certification[];
  projects: Project[];
  internships: Internship[];
  achievements: Achievement[];
  careerInterests: CareerInterests;
  resume: ResumeData;
  verifiedRecords: VerifiedRecord[];
  overallReadinessScore: number;
}

export type AssessmentType = 'technical' | 'aptitude' | 'soft-skill' | 'role-specific';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface AssessmentQuestion {
  id: string;
  type: AssessmentType;
  roleCategory?: string;
  domain: string;
  difficulty: DifficultyLevel;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  skillTarget: string;
  weight: number;
}

export interface AssessmentResult {
  id: string;
  type: AssessmentType;
  difficulty: DifficultyLevel;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  skillConfidence: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  categoryBreakdown: Array<{
    category: string;
    score: number;
    total: number;
  }>;
}

export interface IndustrySkillRequirement {
  skillName: string;
  category: 'technical' | 'soft';
  minThreshold: number; // e.g. 60, 70, 75
  importance: 'critical' | 'important' | 'recommended';
  industryRationale: string;
}

export interface TargetCareerRole {
  id: string;
  title: string;
  domain: string;
  description: string;
  industryDemand: 'Very High' | 'High' | 'Steady';
  marketDemand?: string;
  avgSalaryBenchmark: string;
  averageSalary?: string;
  requiredSkills: IndustrySkillRequirement[];
}

export interface SkillGapItem {
  skillName: string;
  category: 'technical' | 'soft';
  currentScore: number;
  requiredThreshold: number;
  status: 'MET' | 'WARNING' | 'MISSING'; // MET = ✓, WARNING = ⚠, MISSING = ✗
  gapDelta: number;
  importance: 'critical' | 'important' | 'recommended';
  industryRationale: string;
}

export interface CriticalGap {
  rank: number;
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  gapDeficit: number;
  priority: 'High' | 'Medium';
  recommendedAction: string;
  recommendedCourseOrLab: string;
  estimatedTimeToClose: string;
}

export interface SkillGapAnalysisResult {
  targetRole: TargetCareerRole;
  overallReadiness: number; // e.g. 71%
  readinessStatus: 'Industry Ready' | 'Near Ready - Minor Gaps' | 'Action Required - Critical Gaps';
  skillsBreakdown: SkillGapItem[];
  criticalGaps: CriticalGap[];
  metSkillsCount: number;
  totalRequiredCount: number;
  remediationRoadmap: Array<{
    step: number;
    title: string;
    skillTarget: string;
    description: string;
    actionType: 'Course Lab' | 'Assessment Practice' | 'Capstone Build';
    estimatedHours: string;
  }>;
}

// INDUSTRY TARGET CAREER BENCHMARKS
export const TARGET_CAREER_ROLES: TargetCareerRole[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    domain: 'Core Software & Systems',
    description: 'Full-cycle application development, backend architecture, scalable microservices, and robust algorithms.',
    industryDemand: 'Very High',
    avgSalaryBenchmark: '₹18L - ₹32L ($120k+)',
    requiredSkills: [
      { skillName: 'Python', category: 'technical', minThreshold: 60, importance: 'critical', industryRationale: 'Core backend automation, scripting, and API prototyping standard.' },
      { skillName: 'React', category: 'technical', minThreshold: 60, importance: 'critical', industryRationale: 'Industry standard for responsive web platforms and user interface state engines.' },
      { skillName: 'SQL', category: 'technical', minThreshold: 60, importance: 'critical', industryRationale: 'Relational data query optimization, indexing, and transactional integrity.' },
      { skillName: 'DSA', category: 'technical', minThreshold: 70, importance: 'critical', industryRationale: 'Data Structures & Algorithms required for competitive technical coding screens.' },
      { skillName: 'System Design', category: 'technical', minThreshold: 65, importance: 'critical', industryRationale: 'High-availability distributed architectures, caching, and rate limiting.' },
    ]
  },
  {
    id: 'av-systems-architect',
    title: 'Autonomous Vehicle Systems Architect',
    domain: 'Autonomous Systems & Robotics',
    description: 'Robotics software architectures, ROS2 navigation, 3D LiDAR perception, and hardware-in-the-loop validation.',
    industryDemand: 'Very High',
    avgSalaryBenchmark: '₹28L - ₹45L ($145k+)',
    requiredSkills: [
      { skillName: 'ROS2 / Micro-ROS', category: 'technical', minThreshold: 75, importance: 'critical', industryRationale: 'Standard middleware for real-time robotic node communication and actions.' },
      { skillName: 'Nav2 Path Planning & Costmaps', category: 'technical', minThreshold: 75, importance: 'critical', industryRationale: 'Dynamic trajectory planning, collision avoidance, and costmap layers.' },
      { skillName: 'LiDAR SLAM & PointCloud2', category: 'technical', minThreshold: 70, importance: 'critical', industryRationale: 'Spatial 3D mapping and real-time obstacle segmentation.' },
      { skillName: 'Python', category: 'technical', minThreshold: 65, importance: 'important', industryRationale: 'ROS2 client libraries (rclpy) and automated test harnesses.' },
      { skillName: 'CAN Bus & Microcontroller Telemetry', category: 'technical', minThreshold: 70, importance: 'critical', industryRationale: 'Drive-by-wire motor control and hardware safety watchdog interlocks.' },
    ]
  },
  {
    id: 'geospatial-ai-specialist',
    title: 'Geospatial AI & Land Intelligence Specialist',
    domain: 'Geospatial Analytics & Remote Sensing',
    description: 'Satellite imagery analysis, drone telemetry processing, PostGIS cadastral parcel matching, and terrain AI.',
    industryDemand: 'High',
    avgSalaryBenchmark: '₹22L - ₹38L ($130k+)',
    requiredSkills: [
      { skillName: 'GIS Coordinate Modeling & GeoTIFF', category: 'technical', minThreshold: 75, importance: 'critical', industryRationale: 'Raster and vector spatial projections (WGS 84, UTM) and GDAL toolchains.' },
      { skillName: 'Drone Aerial Telemetry Processing', category: 'technical', minThreshold: 70, importance: 'critical', industryRationale: 'Orthomosaic tiling, flight log extraction, and point cloud surface modeling.' },
      { skillName: 'Python', category: 'technical', minThreshold: 70, importance: 'critical', industryRationale: 'Rasterio, Shapely, and PyTorch deep learning geospatial pipelines.' },
      { skillName: 'SQL', category: 'technical', minThreshold: 65, importance: 'critical', industryRationale: 'PostGIS spatial indexes (GIST) and topological polygon overlay calculations.' },
      { skillName: 'PyTorch & TensorRT Inference', category: 'technical', minThreshold: 70, importance: 'important', industryRationale: 'Computer vision segmentation (e.g. YOLO, SAM) for land deed delineation.' },
    ]
  },
  {
    id: 'ml-engineer',
    title: 'Applied Machine Learning & Edge AI Engineer',
    domain: 'Artificial Intelligence',
    description: 'Deep neural network training, quantization, TensorRT acceleration, and low-latency edge deployment.',
    industryDemand: 'Very High',
    avgSalaryBenchmark: '₹26L - ₹42L ($140k+)',
    requiredSkills: [
      { skillName: 'PyTorch & TensorRT Inference', category: 'technical', minThreshold: 80, importance: 'critical', industryRationale: 'Model quantization (INT8/FP8) and hardware-accelerated Tensor Core inference.' },
      { skillName: 'Python', category: 'technical', minThreshold: 80, importance: 'critical', industryRationale: 'Scientific computing, NumPy, PyTorch dataset loaders, and ONNX exports.' },
      { skillName: 'DSA', category: 'technical', minThreshold: 70, importance: 'critical', industryRationale: 'Memory-efficient tensor manipulation and low-latency algorithmic graphs.' },
      { skillName: 'System Design', category: 'technical', minThreshold: 65, importance: 'critical', industryRationale: 'Scalable model serving (Triton/FastAPI), caching, and batch inference.' },
    ]
  }
];

// Default Initial Student Profile
export const DEFAULT_STUDENT_PROFILE: StudentSkillProfile = {
  studentId: 'STU001',
  fullName: 'Rishi Sharma',
  email: 'rishi.sharma@university.edu',
  academic: {
    degree: 'B.Tech in Computer Science & Engineering',
    department: 'Computer Science',
    currentSemester: 7,
    batch: '2023 - 2027',
    cgpa: 9.24,
    academicStanding: "Dean's Honors List",
    totalCredits: 148,
    attendanceRate: 94.2
  },
  technicalSkills: [
    { id: 'ts-py', name: 'Python', category: 'Software Engineering', level: 82, verified: true, verifiedBy: 'Coding Sandbox', confidenceScore: 85 },
    { id: 'ts-react', name: 'React', category: 'Software Engineering', level: 76, verified: true, verifiedBy: 'Frontend Test Lab', confidenceScore: 78 },
    { id: 'ts-sql', name: 'SQL', category: 'Software Engineering', level: 61, verified: true, verifiedBy: 'Database Lab Exam', confidenceScore: 65 },
    { id: 'ts-dsa', name: 'DSA', category: 'Software Engineering', level: 43, verified: false, verifiedBy: 'Preliminary Test', confidenceScore: 45 },
    { id: 'ts-1', name: 'ROS2 / Micro-ROS', category: 'Autonomous Systems', level: 90, verified: true, verifiedBy: 'Prof. K. Sen (Robotics Lab)', proofProject: 'Autonomous Campus Shuttle Navigation', confidenceScore: 92 },
    { id: 'ts-2', name: 'Nav2 Path Planning & Costmaps', category: 'Autonomous Systems', level: 86, verified: true, verifiedBy: 'AI Assessment v2', proofProject: 'Autonomous Campus Shuttle Navigation', confidenceScore: 88 },
    { id: 'ts-3', name: 'LiDAR SLAM & PointCloud2', category: 'Autonomous Systems', level: 82, verified: true, verifiedBy: 'Autonomous Systems Test', confidenceScore: 84 },
    { id: 'ts-4', name: 'GIS Coordinate Modeling & GeoTIFF', category: 'Geospatial AI', level: 92, verified: true, verifiedBy: 'Geospatial Lab Benchmark', proofProject: 'Genova Land Intelligence System', confidenceScore: 94 },
    { id: 'ts-5', name: 'Drone Aerial Telemetry Processing', category: 'Geospatial AI', level: 88, verified: true, verifiedBy: 'Prof. R. Narang', confidenceScore: 89 },
    { id: 'ts-6', name: 'PyTorch & TensorRT Inference', category: 'Machine Learning', level: 92, verified: true, verifiedBy: 'NVIDIA DLI Certificate', confidenceScore: 93 },
    { id: 'ts-cv', name: 'OpenCV', category: 'Machine Learning', level: 78, verified: true, verifiedBy: 'Computer Vision Lab', confidenceScore: 80 },
    { id: 'ts-ml', name: 'ML', category: 'Machine Learning', level: 85, verified: true, verifiedBy: 'AI Assessment v2', confidenceScore: 88 },
    { id: 'ts-7', name: 'TypeScript / React 19 / Vite', category: 'Software Engineering', level: 96, verified: true, verifiedBy: 'CampusOS Codebase Core', confidenceScore: 97 },
    { id: 'ts-8', name: 'CAN Bus & Microcontroller Telemetry', category: 'Systems & Hardware', level: 84, verified: false, confidenceScore: 80 },
  ],
  softSkills: [
    { id: 'ss-1', name: 'Technical Leadership & Project Ownership', score: 92, assessedVia: 'Capston Lead Evaluation', feedback: 'Demonstrated superior coordination across autonomous robotics sub-teams.', verified: true },
    { id: 'ss-2', name: 'Complex Problem Solving & Root-Cause Debugging', score: 95, assessedVia: 'Algorithmic Situational Test', feedback: 'Excellent algorithmic intuition and low-latency decision formulation.', verified: true },
    { id: 'ss-3', name: 'Cross-Functional Collaboration', score: 88, assessedVia: 'Peer 360 Review', feedback: 'Proactively syncs firmware, computer vision, and frontend teams.', verified: true },
    { id: 'ss-4', name: 'Executive Presentation & Technical Writing', score: 86, assessedVia: 'Symposium Presentation', feedback: 'Articulates high-dimension spatial modeling to non-technical stakeholders.', verified: true },
  ],
  certifications: [
    { id: 'cert-1', title: 'Deep Learning for Autonomous Vehicles', issuer: 'NVIDIA Deep Learning Institute', credentialId: 'NVDLI-AV-88421', issueDate: 'Nov 2025', verifyUrl: 'https://nvidia.com/verify/NVDLI-AV-88421', verified: true },
    { id: 'cert-2', title: 'ROS-Industrial Navigation & Manipulation', issuer: 'ROS-Industrial Consortium', credentialId: 'ROSI-NAV-5510', issueDate: 'Jan 2026', verifyUrl: 'https://rosindustrial.org/verify/5510', verified: true },
    { id: 'cert-3', title: 'Professional Cloud Solutions Architect', issuer: 'Google Cloud Platform', credentialId: 'GCP-PCA-99214', issueDate: 'Aug 2025', verifyUrl: 'https://cloud.google.com/verify/99214', verified: true },
    { id: 'cert-4', title: 'Advanced Geospatial Data Science with PostGIS', issuer: 'OpenGIS Academy', credentialId: 'OGIS-DS-2026', issueDate: 'Feb 2026', verifyUrl: 'https://opengis.org/cert/2026', verified: true },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'GENOVA Autonomous Mobility System (AMS)',
      description: 'Built ROS2 navigation stack with 3D LiDAR point cloud clustering, dual EKF localization, and WebRTC remote teleoperation interlock for campus shuttle.',
      role: 'Lead Autonomy Engineer',
      techStack: ['ROS2 Humble', 'Nav2', 'C++', 'Python', 'FastAPI', 'WebRTC'],
      repoUrl: 'https://github.com/genova/autonomous-mobility',
      verified: true,
      highlight: 'Achieved zero-collision autonomous navigation across 12 km of real campus test routes.'
    },
    {
      id: 'proj-2',
      title: 'GENOVA Land Intelligence Cadastral Matcher (LIS)',
      description: 'Geospatial neural network aligning high-resolution drone orthomosaics with state cadastral deeds, generating automated NDVI vegetation indices.',
      role: 'Core Developer & AI Researcher',
      techStack: ['PyTorch', 'GeoTIFF', 'PostGIS', 'Rasterio', 'FastAPI'],
      repoUrl: 'https://github.com/genova/land-intelligence',
      verified: true,
      highlight: 'Segmented 5,400+ land parcels with 96.4% boundary IoU accuracy.'
    },
    {
      id: 'proj-3',
      title: 'CampusOS Autonomous Agent Swarm Core',
      description: 'Architected distributed multi-agent layer orchestrating academic copilots, zero-trust telemetry, and administrative dispatch tools.',
      role: 'Full-Stack Systems Architect',
      techStack: ['React 19', 'TypeScript', 'Tailwind v4', 'ADK', 'Gemini'],
      repoUrl: 'https://github.com/genova/campusos-web',
      verified: true,
      highlight: 'Powers live university operations with sub-50ms client responsiveness.'
    }
  ],
  internships: [
    {
      id: 'intern-1',
      company: 'AeroDynamics AI Mobility Labs',
      role: 'Autonomous Systems Engineering Intern',
      duration: 'May 2025 - Jul 2025 (3 mos)',
      location: 'Bengaluru, India',
      keyDeliverables: [
        'Implemented TEB local planner obstacle inflation tuned for pedestrians.',
        'Reduced trajectory compute latency by 34% using SIMD C++ optimizations.',
        'Authored comprehensive hardware-in-the-loop validation test harnesses.'
      ],
      mentorRating: 4.9,
      certificateUrl: 'https://aerodynamics.ai/verify/intern-rishi-s'
    },
    {
      id: 'intern-2',
      company: 'GeoSpatial Systems & Satellite Analytics',
      role: 'Remote Sensing Machine Learning Intern',
      duration: 'Dec 2024 - Jan 2025 (2 mos)',
      location: 'Hyderabad, India (Hybrid)',
      keyDeliverables: [
        'Built automated pipeline to download and tile Sentinel-2 multi-spectral bands.',
        'Created soil moisture anomaly detector trained on historical weather stations.'
      ],
      mentorRating: 4.8,
      certificateUrl: 'https://geospatialsys.com/verify/intern-rishi'
    }
  ],
  achievements: [
    { id: 'ach-1', title: 'Grand Winner - Smart India Autonomous Mobility Hackathon', category: 'Hackathon', year: '2026', description: 'Ranked 1st nationwide among 1,200 teams for deploying real-time autonomous shuttle navigation.', badge: '1st / 1200' },
    { id: 'ach-2', title: 'Research Publication - IEEE Robotics & Automation Letters (RA-L)', category: 'Publication', year: '2025', description: 'Co-authored paper: "Multi-Spectral Aerial Telemetry for Low-Altitude Autonomous Drone Land Surveying".', badge: 'IEEE RA-L' },
    { id: 'ach-3', title: 'Patent Filed - Dual-Tier Emergency Interlock for Campus Robotics', category: 'Patent', year: '2026', description: 'Co-inventor for fail-safe drive-by-wire teleoperation safety architecture.', badge: 'Indian Patent App' },
    { id: 'ach-4', title: "Dean's Academic Excellence Award (Consecutive 3 Semesters)", category: 'Honor', year: '2024-2026', description: 'Maintained top 0.5% percentile GPA across CSE department.', badge: 'Top 0.5%' },
  ],
  careerInterests: {
    targetRoles: [
      'Autonomous Systems Architect',
      'Robotics Software Engineer',
      'Geospatial AI Engineer',
      'Applied Machine Learning Scientist'
    ],
    dreamCompanies: [
      'Genova Innovation Labs',
      'Waymo',
      'Cruise',
      'NVIDIA Autonomous Vehicles',
      'Boston Dynamics',
      'Google DeepMind'
    ],
    expectedCtcRange: '₹32L - ₹48L ($145k+)',
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Pune', 'San Francisco / Remote'],
    domainFocus: ['Autonomous Mobile Robots', 'Remote Sensing', 'Edge TensorRT', 'ROS2 Nav2']
  },
  resume: {
    headline: 'Autonomous Systems & Geospatial AI Software Engineer | B.Tech CSE (9.14 CGPA)',
    summary: 'Engineering lead specializing in ROS2 autonomous vehicle stacks, 3D LiDAR perception, and deep learning remote sensing. Experienced in real-world hardware deployment, low-latency microservices, and IEEE published research.',
    atsScore: 96,
    lastUpdated: 'Sep 2026',
    generatedTemplate: 'Modern Engineering'
  },
  verifiedRecords: [
    { id: 'vr-1', recordType: 'Degree & Transcript Verification', title: 'Official Academic Transcript (Semesters 1-6)', issuer: 'Office of the Registrar', verificationHash: '0x8f2a99c4b12e77481a8f9d0c2e3f4b5a', verifiedAt: 'Aug 14, 2026', status: 'VERIFIED' },
    { id: 'vr-2', recordType: 'Hackathon Grand Winner Proof', title: 'National Smart Mobility Challenge 2026', issuer: 'Ministry of Education & Genova', verificationHash: '0x3d7b92e8a4c10f88921e5c4a7b9d3e2f', verifiedAt: 'Jul 28, 2026', status: 'VERIFIED' },
    { id: 'vr-3', recordType: 'Faculty Project Code Endorsement', title: 'ROS2 Autonomous Shuttle Navigation Architecture', issuer: 'Head of Robotics & Autonomous Systems Lab', verificationHash: '0x7a2c1e89b4f53d10893a2c4e6f8b0d1e', verifiedAt: 'Sep 02, 2026', status: 'VERIFIED' },
    { id: 'vr-4', recordType: 'AI Assessment Confidence Seal', title: 'Level 4 Expert Assessment in Autonomous & Geospatial Systems', issuer: 'GENOVA AI Skill Assessment Engine', verificationHash: '0x1b9e3d7a8f4c2e10984b6a8d0e2f4c6a', verifiedAt: 'Sep 05, 2026', status: 'VERIFIED' },
  ],
  overallReadinessScore: 94
};

// COMPREHENSIVE QUESTION BANK FOR AI SKILL ASSESSMENT ENGINE
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // 1. Technical Questions - Autonomous Systems & Robotics
  {
    id: 'tq-1',
    type: 'technical',
    domain: 'Autonomous Systems',
    difficulty: 'Intermediate',
    question: 'In ROS2 Humble, which mechanism is best suited for a non-blocking request to execute a long-running vehicle trajectory plan that yields periodic feedback?',
    options: [
      'Standard ROS2 Publisher/Subscriber topic',
      'Synchronous ROS2 Service call (Client/Server)',
      'ROS2 Action Server (rclcpp_action)',
      'Shared Memory Parameter Server'
    ],
    correctAnswerIndex: 2,
    explanation: 'ROS2 Actions are specifically designed for long-running preemptible goals with feedback (e.g. Nav2 NavigateToPose) providing goal, cancel, result, and feedback topics.',
    skillTarget: 'ROS2 / Micro-ROS',
    weight: 10
  },
  {
    id: 'tq-2',
    type: 'technical',
    domain: 'Autonomous Systems',
    difficulty: 'Advanced',
    question: 'Examine this Nav2 costmap inflation code snippet. What is the effect of setting cost_scaling_factor to a lower value?',
    codeSnippet: `inflation_layer:
  plugin: "nav2_costmap_2d::InflationLayer"
  inflation_radius: 1.75
  cost_scaling_factor: 2.0`,
    options: [
      'Costs decay much faster, resulting in a steeper and narrower risk boundary around obstacles.',
      'Costs decay slower with distance, producing higher penalty costs across a wider zone around obstacles.',
      'The inflation layer completely disables lethal collision warnings.',
      'Vehicle footprint is multiplied by the scaling factor during local trajectory rollouts.'
    ],
    correctAnswerIndex: 1,
    explanation: 'In Nav2, cost = exp(-1.0 * cost_scaling_factor * (distance - inscribed_radius)). Therefore, a lower cost_scaling_factor decreases the exponent magnitude, making decay slower and keeping costs higher further away from the obstacle.',
    skillTarget: 'Nav2 Path Planning & Costmaps',
    weight: 15
  },
  {
    id: 'tq-3',
    type: 'technical',
    domain: 'Geospatial AI',
    difficulty: 'Intermediate',
    question: 'Which index formula correctly calculates NDVI (Normalized Difference Vegetation Index) from multi-spectral remote sensing imagery?',
    options: [
      '(Red - Green) / (Red + Green)',
      '(NIR - Red) / (NIR + Red)',
      '(Blue - NIR) / (Blue + NIR)',
      '(SWIR - Red) / (SWIR + Red)'
    ],
    correctAnswerIndex: 1,
    explanation: 'NDVI is calculated as (NIR - Red) / (NIR + Red), utilizing healthy vegetation high reflectance in Near-Infrared (NIR) and high absorption in the Red chlorophyll absorption spectrum.',
    skillTarget: 'GIS Coordinate Modeling & GeoTIFF',
    weight: 10
  },
  {
    id: 'tq-4',
    type: 'technical',
    domain: 'Machine Learning',
    difficulty: 'Advanced',
    question: 'When deploying a YOLOv8 object detector to an NVIDIA Jetson Orin via TensorRT, what is the primary benefit of FP8 / INT8 Post-Training Quantization (PTQ)?',
    options: [
      'Eliminates the need for non-maximum suppression (NMS).',
      'Doubles or triples tensor throughput by leveraging Tensor Core matrix execution with minimal accuracy loss using calibration cache.',
      'Converts convolutional layers into recurrent LSTM cells automatically.',
      'Enables training on CPU without GPU drivers.'
    ],
    correctAnswerIndex: 1,
    explanation: 'INT8 PTQ maps 32-bit floats to 8-bit integers, utilizing TensorRT calibration caches to maximize INT8 Tensor Core hardware pipeline saturation with sub-1% mAP degradation.',
    skillTarget: 'PyTorch & TensorRT Inference',
    weight: 15
  },
  {
    id: 'tq-5',
    type: 'technical',
    domain: 'Software Engineering',
    difficulty: 'Expert',
    question: 'In high-frequency WebSocket vehicle telemetry streaming in Node/TypeScript, what pattern prevents memory pressure when the browser client lags behind incoming 100Hz CAN bus frames?',
    options: [
      'Unbounded array buffering in memory without backpressure',
      'Backpressure throttling with highWaterMark buffer drop or conflated latest-state emission',
      'JSON.stringify on every single incoming raw socket byte immediately',
      'Synchronous disk writing on every packet'
    ],
    correctAnswerIndex: 1,
    explanation: 'Conflation (dropping intermediate dropped frames and transmitting only the latest vehicle state) or backpressure stream throttling prevents Node event loop starvation and heap explosion.',
    skillTarget: 'TypeScript / React 19 / Vite',
    weight: 20
  },

  // 2. General Aptitude Tests
  {
    id: 'aq-1',
    type: 'aptitude',
    domain: 'Quantitative Aptitude',
    difficulty: 'Intermediate',
    question: 'An autonomous shuttle travels a 24 km loop from Campus Gate A to the Research Quad. On the forward trip it averages 30 km/h; on the return leg through crowded corridors it averages 20 km/h. What is the average speed of the shuttle for the complete 48 km round trip?',
    options: [
      '24.0 km/h',
      '25.0 km/h',
      '22.5 km/h',
      '26.4 km/h'
    ],
    correctAnswerIndex: 0,
    explanation: 'Average speed = Total Distance / Total Time. Forward time = 24 / 30 = 0.8 hours. Return time = 24 / 20 = 1.2 hours. Total time = 2.0 hours. Avg speed = 48 / 2.0 = 24 km/h. (Harmonic mean: 2*30*20/(30+20) = 24).',
    skillTarget: 'Quantitative Reasoning',
    weight: 10
  },
  {
    id: 'aq-2',
    type: 'aptitude',
    domain: 'Logical Reasoning',
    difficulty: 'Intermediate',
    question: 'Five sensors (A, B, C, D, E) are mounted on a vehicle perimeter. A is clockwise from B. C is between B and D. E is diametrically opposite to C. If B is pointing North, where is E pointing if they are evenly spaced at 72 degrees around a circle?',
    options: [
      'Directly South',
      'South-West',
      'North-East',
      'West-South-West'
    ],
    correctAnswerIndex: 1,
    explanation: 'Sensor C sits at approximately North-North-East; its diametric opposite (180 degrees opposite) faces directly toward the South-West quadrant.',
    skillTarget: 'Spatial & Logical Reasoning',
    weight: 10
  },
  {
    id: 'aq-3',
    type: 'aptitude',
    domain: 'Data Interpretation',
    difficulty: 'Advanced',
    question: 'A drone survey scans a 50-hectare agricultural plot. High-resolution orthomosaics require 180MB storage per hectare. The onboard telemetry link transmits at a sustained 24 Mbps (megabits per second). How many minutes will it take to downlink the uncompressed 50-hectare survey dataset to the ground station?',
    options: [
      '50 minutes',
      '25 minutes',
      '42 minutes',
      '60 minutes'
    ],
    correctAnswerIndex: 0,
    explanation: 'Total data = 50 * 180 MB = 9,000 Megabytes = 72,000 Megabits. Downlink rate = 24 Megabits/sec. Time = 72,000 / 24 = 3,000 seconds = 50 minutes.',
    skillTarget: 'Data Interpretation',
    weight: 15
  },

  // 3. Soft-Skill & Behavioral Assessment
  {
    id: 'sq-1',
    type: 'soft-skill',
    domain: 'Situational Judgment',
    difficulty: 'Intermediate',
    question: 'During field testing 24 hours prior to an institutional demonstration, the autonomous vehicle fails obstacle avoidance under rare low-sun glare conditions. The client suggests disabling the camera safety check and relying solely on ultrasonic sonar. What is your response as lead engineer?',
    options: [
      'Agree immediately to guarantee the demo proceeds without visible stoppages.',
      'Refuse to bypass safety interlocks. Formulate a risk mitigation plan: constrain the test route to non-glare angles and maintain physical manual e-stop protocol.',
      'Silently disable all logging so no failure telemetry is recorded during the demo.',
      'Cancel the entire demonstration and walk away from the project.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Professional engineering ethics prioritize safety and transparent risk mitigation over masking vulnerabilities. Maintaining interlocks while bounding operational design domain (ODD) is the gold standard.',
    skillTarget: 'Engineering Ethics & Accountability',
    weight: 15
  },
  {
    id: 'sq-2',
    type: 'soft-skill',
    domain: 'Team Leadership',
    difficulty: 'Advanced',
    question: 'Two senior team members disagree fundamentally on choosing ROS2 CycloneDDS vs FastDDS for multi-robot UDP multicast on campus Wi-Fi, delaying the sprint. How do you resolve this impasse?',
    options: [
      'Pick your personal favorite without conducting any benchmarks.',
      'Have both members benchmark packet drop, CPU overhead, and jitter in a controlled 15-minute test rig, using objective empirical data to make the decision.',
      'Tell them to fight it out in the team Slack channel.',
      'Switch the entire project to an untested custom networking library.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Empirical benchmarking depersonalizes technical disputes and grounds architectural trade-offs in verifiable data.',
    skillTarget: 'Technical Conflict Resolution',
    weight: 15
  },

  // 4. Role-Specific Questions
  {
    id: 'rq-1',
    type: 'role-specific',
    roleCategory: 'Autonomous Vehicle Systems Engineer',
    domain: 'Drive-by-Wire Systems',
    difficulty: 'Advanced',
    question: 'What is the function of a Heartbeat watchdog frame transmitted over the CAN bus between the high-level autonomy compute and the low-level steering motor controller?',
    options: [
      'To log vehicle speed to a remote cloud database once per hour.',
      'To verify continuous compute health at 50-100Hz; if missing for >100ms, the motor controller automatically transitions into a fail-safe mechanical brake state.',
      'To overclock the steering motor for sharper cornering.',
      'To stream camera video feed to the infotainment dashboard.'
    ],
    correctAnswerIndex: 1,
    explanation: 'CAN heartbeats are safety-critical watchdog pulses. If the main operating system hangs, the absence of heartbeat triggers the hardware safety interlock to apply mechanical brakes.',
    skillTarget: 'CAN Bus & Motor Telemetry',
    weight: 20
  },
  {
    id: 'rq-2',
    type: 'role-specific',
    roleCategory: 'Geospatial AI & Land Intelligence Specialist',
    domain: 'Cadastral GIS',
    difficulty: 'Advanced',
    question: 'When performing polygon intersection and topological overlay between satellite raster masks and municipal cadastral shapefiles, what PostGIS function computes the exact shared geographic overlap area in square meters?',
    options: [
      'ST_Buffer(geom, 10)',
      'ST_Area(ST_Intersection(cadastral_geom, raster_geom)::geography)',
      'ST_Centroid(cadastral_geom)',
      'ST_ConvexHull(cadastral_geom)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Casting the geometry intersection to the PostGIS geography type computes geodesic surface area in square meters on the WGS 84 spheroid.',
    skillTarget: 'GIS Coordinate Modeling & GeoTIFF',
    weight: 20
  }
];

export class StudentSkillIntelligenceEngine {
  private static STORAGE_KEY = 'genova_student_skill_profile';
  private static RESULTS_KEY = 'genova_assessment_results';

  // Get current active profile with local storage fallback
  public static getProfile(): StudentSkillProfile {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Auto-migrate old profile name
        if (parsed.fullName === 'Aarav Mehta' || !parsed.fullName) {
          parsed.fullName = 'Rishi Sharma';
          parsed.email = 'rishi.sharma@university.edu';
          if (parsed.academic) {
            parsed.academic.cgpa = 9.24;
          }
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
        }
        // Ensure standard skills like Python, React, SQL, DSA exist
        DEFAULT_STUDENT_PROFILE.technicalSkills.forEach((defSkill) => {
          if (!parsed.technicalSkills.some((s: any) => s.name.toLowerCase() === defSkill.name.toLowerCase())) {
            parsed.technicalSkills.push(defSkill);
          }
        });
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse stored student skill profile', e);
    }
    return DEFAULT_STUDENT_PROFILE;
  }

  // Save profile to local storage
  public static saveProfile(profile: StudentSkillProfile): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save student skill profile', e);
    }
  }

  // Add a new technical skill
  public static addTechnicalSkill(skill: Omit<TechnicalSkill, 'id' | 'confidenceScore'>): StudentSkillProfile {
    const profile = this.getProfile();
    const newSkill: TechnicalSkill = {
      ...skill,
      id: `ts-${Date.now()}`,
      confidenceScore: skill.level
    };
    profile.technicalSkills.push(newSkill);
    this.saveProfile(profile);
    return profile;
  }

  // Add a new project
  public static addProject(project: Omit<Project, 'id'>): StudentSkillProfile {
    const profile = this.getProfile();
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`
    };
    profile.projects.unshift(newProj);
    this.saveProfile(profile);
    return profile;
  }

  // Add a new certification
  public static addCertification(cert: Omit<Certification, 'id'>): StudentSkillProfile {
    const profile = this.getProfile();
    const newCert: Certification = {
      ...cert,
      id: `cert-${Date.now()}`
    };
    profile.certifications.unshift(newCert);
    this.saveProfile(profile);
    return profile;
  }

  // Retrieve questions filtered by type, difficulty, and optional role category
  public static getQuestions(
    type?: AssessmentType,
    difficulty?: DifficultyLevel,
    roleCategory?: string
  ): AssessmentQuestion[] {
    return ASSESSMENT_QUESTIONS.filter((q) => {
      if (type && q.type !== type) return false;
      if (difficulty && q.difficulty !== difficulty) return false;
      if (roleCategory && q.roleCategory && q.roleCategory !== roleCategory) return false;
      return true;
    });
  }

  // Evaluate an assessment session
  public static evaluateAssessment(
    type: AssessmentType,
    difficulty: DifficultyLevel,
    answers: Record<string, number>,
    questions: AssessmentQuestion[]
  ): AssessmentResult {
    let totalWeight = 0;
    let earnedWeight = 0;
    let correctCount = 0;

    const categoryMap: Record<string, { earned: number; total: number }> = {};

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswerIndex;
      totalWeight += q.weight;

      if (!categoryMap[q.domain]) {
        categoryMap[q.domain] = { earned: 0, total: 0 };
      }
      categoryMap[q.domain].total += q.weight;

      if (isCorrect) {
        earnedWeight += q.weight;
        correctCount += 1;
        categoryMap[q.domain].earned += q.weight;
      }
    });

    const percentage = Math.round((earnedWeight / (totalWeight || 1)) * 100);

    // AI Skill Confidence Score combines accuracy with difficulty tier bonus
    const difficultyMultiplier = 
      difficulty === 'Expert' ? 1.08 :
      difficulty === 'Advanced' ? 1.04 :
      difficulty === 'Intermediate' ? 1.0 : 0.95;

    const skillConfidence = Math.min(100, Math.round(percentage * difficultyMultiplier));

    // Strengths and Weaknesses derivation
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.entries(categoryMap).forEach(([domain, stats]) => {
      const domScore = Math.round((stats.earned / (stats.total || 1)) * 100);
      if (domScore >= 75) {
        strengths.push(`${domain} (${domScore}%)`);
      } else {
        weaknesses.push(`${domain} (${domScore}%)`);
      }
    });

    if (strengths.length === 0) strengths.push('Core foundational logic verified');
    if (weaknesses.length === 0) weaknesses.push('High mastery across evaluated domain');

    // Tailored actionable recommendations
    const recommendations: string[] = [];
    if (type === 'technical') {
      recommendations.push('Reinforce hardware-in-the-loop CAN bus latency constraints.');
      recommendations.push('Complete NVIDIA TensorRT INT8 quantization benchmark lab.');
    } else if (type === 'aptitude') {
      recommendations.push('Practice multi-stage probability and rate-of-work word puzzles.');
    } else if (type === 'soft-skill') {
      recommendations.push('Participate in cross-departmental engineering symposium debates.');
    } else {
      recommendations.push('Deploy standalone integration endpoints to verified Genova cloud registry.');
    }

    const result: AssessmentResult = {
      id: `eval-${Date.now()}`,
      type,
      difficulty,
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      percentage,
      skillConfidence,
      strengths,
      weaknesses,
      recommendations,
      categoryBreakdown: Object.entries(categoryMap).map(([category, s]) => ({
        category,
        score: s.earned,
        total: s.total
      }))
    };

    // Save result to local storage history
    this.saveAssessmentResult(result);

    // Automatically synchronize verified status and confidence to student profile
    this.applyResultToProfile(result, questions);

    return result;
  }

  private static saveAssessmentResult(result: AssessmentResult): void {
    try {
      const existing = JSON.parse(localStorage.getItem(this.RESULTS_KEY) || '[]');
      existing.unshift(result);
      localStorage.setItem(this.RESULTS_KEY, JSON.stringify(existing.slice(0, 20)));
    } catch (e) {
      console.error('Failed to save assessment result', e);
    }
  }

  public static getAssessmentHistory(): AssessmentResult[] {
    try {
      return JSON.parse(localStorage.getItem(this.RESULTS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  // Update profile with assessment outcome
  private static applyResultToProfile(result: AssessmentResult, questions: AssessmentQuestion[]): void {
    const profile = this.getProfile();

    // Add verified record entry
    const newRecord: VerifiedRecord = {
      id: `vr-${Date.now()}`,
      recordType: `AI Assessment (${result.type.toUpperCase()})`,
      title: `${result.difficulty} Level Evaluation — ${result.percentage}% Score`,
      issuer: 'GENOVA AI Skill Assessment Engine',
      verificationHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      verifiedAt: result.completedAt,
      status: 'VERIFIED'
    };
    profile.verifiedRecords.unshift(newRecord);

    // Update readiness score
    profile.overallReadinessScore = Math.min(99, Math.round((profile.overallReadinessScore * 0.7) + (result.skillConfidence * 0.3)));

    this.saveProfile(profile);
  }

  // Retrieve available target career roles
  public static getTargetCareers(): TargetCareerRole[] {
    return TARGET_CAREER_ROLES;
  }

  // Calculate skill gap analysis
  public static calculateSkillGap(
    profile: StudentSkillProfile,
    targetRoleId: string = 'software-engineer'
  ): SkillGapAnalysisResult {
    const targetRole = TARGET_CAREER_ROLES.find(r => r.id === targetRoleId) || TARGET_CAREER_ROLES[0];
    const skillsBreakdown: SkillGapItem[] = [];
    const criticalGaps: CriticalGap[] = [];

    let totalScoreContribution = 0;
    let metCount = 0;

    targetRole.requiredSkills.forEach((req) => {
      // Find matching skill in profile
      const matchedSkill = profile.technicalSkills.find(
        (s) => s.name.toLowerCase() === req.skillName.toLowerCase() ||
               (req.skillName.toLowerCase() === 'react' && s.name.toLowerCase().includes('react')) ||
               (req.skillName.toLowerCase() === 'python' && s.name.toLowerCase().includes('python')) ||
               (req.skillName.toLowerCase() === 'sql' && s.name.toLowerCase().includes('sql')) ||
               (req.skillName.toLowerCase() === 'dsa' && (s.name.toLowerCase().includes('dsa') || s.name.toLowerCase().includes('data structures')))
      ) || (req.category === 'soft' ? profile.softSkills.find(s => s.name.toLowerCase().includes(req.skillName.toLowerCase())) : undefined);

      const currentScore = matchedSkill ? (matchedSkill as any).level || (matchedSkill as any).score || 0 : 0;
      const isMet = currentScore >= req.minThreshold;
      const isMissing = currentScore === 0;

      const status: 'MET' | 'WARNING' | 'MISSING' = isMet ? 'MET' : 'WARNING';
      const gapDelta = Math.max(0, req.minThreshold - currentScore);

      // Score contribution: ratio of current score to required threshold, capped at 100%
      const achievementRatio = Math.min(1.0, currentScore / (req.minThreshold || 1));
      totalScoreContribution += achievementRatio;

      if (isMet) {
        metCount += 1;
      }

      skillsBreakdown.push({
        skillName: req.skillName,
        category: req.category,
        currentScore,
        requiredThreshold: req.minThreshold,
        status,
        gapDelta,
        importance: req.importance,
        industryRationale: req.industryRationale
      });

      if (!isMet && req.importance === 'critical') {
        criticalGaps.push({
          rank: criticalGaps.length + 1,
          skillName: req.skillName,
          currentLevel: currentScore,
          requiredLevel: req.minThreshold,
          gapDeficit: gapDelta,
          priority: gapDelta > 30 ? 'High' : 'Medium',
          recommendedAction: currentScore === 0 
            ? `Enroll in fundamental ${req.skillName} accelerated lab and complete core assignments.`
            : `Bridge the ${gapDelta}% deficit through targeted practice problem sets and assessment retake.`,
          recommendedCourseOrLab: `GENOVA Course: CS-${req.skillName.replace(/[^a-zA-Z]/g, '').toUpperCase()}-301`,
          estimatedTimeToClose: gapDelta > 30 ? '3 - 4 Weeks' : '1 - 2 Weeks'
        });
      }
    });

    // Calculate overall readiness
    const overallReadiness = Math.round((totalScoreContribution / targetRole.requiredSkills.length) * 100);

    const readinessStatus: 'Industry Ready' | 'Near Ready - Minor Gaps' | 'Action Required - Critical Gaps' =
      overallReadiness >= 85 ? 'Industry Ready' :
      overallReadiness >= 70 ? 'Near Ready - Minor Gaps' : 'Action Required - Critical Gaps';

    // Remediation Roadmap steps
    const remediationRoadmap = criticalGaps.map((gap, idx) => ({
      step: idx + 1,
      title: `Master ${gap.skillName} & Elevate Score to ${gap.requiredLevel}%`,
      skillTarget: gap.skillName,
      description: gap.recommendedAction,
      actionType: (idx % 2 === 0 ? 'Course Lab' : 'Assessment Practice') as any,
      estimatedHours: `${gap.estimatedTimeToClose} (~18 hrs)`
    }));

    return {
      targetRole,
      overallReadiness,
      readinessStatus,
      skillsBreakdown,
      criticalGaps,
      metSkillsCount: metCount,
      totalRequiredCount: targetRole.requiredSkills.length,
      remediationRoadmap
    };
  }
}

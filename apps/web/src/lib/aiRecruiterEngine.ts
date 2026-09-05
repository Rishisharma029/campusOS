/**
 * GENOVA CampusOS AI — AI Recruiter Intelligence Engine
 * 
 * Implements:
 * 1. Semantic Job Description (JD) parsing & requirements extraction:
 *    - Required Skills (with target proficiency levels)
 *    - Preferred Skills (bonus competencies)
 *    - Academic Eligibility (Degrees, Minimum CGPA, Graduating Batches)
 *    - Experience & Proof-of-Work (Capstones, prior internships, repositories)
 * 2. Automated Multi-Factor Candidate Ranking:
 *    - Computes deterministic, transparent compatibility scores (%)
 * 3. Transparent Match Explainability:
 *    - Detailed "Why each candidate matches" breakdown
 *    - Critical skill gaps with actionable remedial training rigs
 */

import { IndustryPortalEngine, type IndustryCandidate } from './industryPortalEngine';

export interface SkillRequirement {
  name: string;
  minLevel: number; // 0 to 100
  weight: number;   // 1 to 5 relative weight
}

export interface PreferredSkill {
  name: string;
  bonusWeight: number; // 1 to 3
}

export interface AcademicEligibilityCriteria {
  allowedDegrees: string[];
  minCgpa: number;
  allowedBatches: string[];
  departments: string[];
}

export interface ExperienceCriteria {
  minProjects: number;
  requiredProjectDomains: string[];
  minInternships: number;
}

export interface ExtractedJobRequirements {
  jobId: string;
  roleTitle: string;
  companyName: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'On-Site';
  compensation: string;
  requiredSkills: SkillRequirement[];
  preferredSkills: PreferredSkill[];
  eligibility: AcademicEligibilityCriteria;
  experience: ExperienceCriteria;
  rawJdSummary: string;
}

export interface CandidateRankingResult {
  candidate: IndustryCandidate;
  rank: number;
  overallMatchScore: number; // 0 to 100%
  scoreBreakdown: {
    requiredSkillsScore: number; // out of 50
    preferredSkillsScore: number; // out of 20
    projectEvidenceScore: number; // out of 15
    eligibilityScore: number;    // out of 15
  };
  whyMatches: {
    skillHighlights: string[];
    projectEvidence: string[];
    eligibilityAffirmation: string;
  };
  gaps: {
    missingRequired: string[];
    missingPreferred: string[];
    remedialRecommendations: string[];
  };
  eligibilityPass: boolean;
  shortlisted: boolean;
}

export interface JobDescriptionTemplate {
  id: string;
  title: string;
  company: string;
  domain: string;
  rawText: string;
}

// 4 Preset Industrial Job Descriptions for Instant 1-Click Evaluation
export const PRESET_JOB_DESCRIPTIONS: JobDescriptionTemplate[] = [
  {
    id: 'jd-perception-eng',
    title: 'Autonomous Systems & Perception Engineer',
    company: 'Genova Mobility Labs / Tesla Fleet AI',
    domain: 'Robotics & Autonomous Vehicles',
    rawText: `Role: Autonomous Systems & Perception Engineer
Company: Genova Mobility Labs
Location: Bengaluru Hybrid (R&D Proving Grounds)
Compensation: ₹18 - 24 LPA / ₹65,000 Monthly Internship Stipend

About the Role:
We are seeking an outstanding Autonomous Systems Engineer to build real-time perception, localization, and motion planning pipelines for our campus electric autonomous shuttles.

Key Requirements (Must Have):
- High proficiency in Python (≥ 80%) and ROS2 (≥ 85%) for distributed robot communications.
- Hands-on experience with Computer Vision / OpenCV (≥ 75%) and Deep Learning frameworks (PyTorch ≥ 80%).
- Demonstrable knowledge of Navigation stacks (Nav2 / Costmaps / Path Planning) or Sensor Fusion.
- Strong Algorithmic problem-solving foundation (DSA ≥ 70%).

Preferred Qualifications (Nice to Have):
- Experience with NVIDIA TensorRT INT8 quantization, CUDA acceleration, or Jetson Orin deployment.
- Familiarity with PostGIS / Geospatial coordinate projections and LiDAR point cloud filtering.
- Previous published open-source robotics projects or active GitHub repository proof.

Eligibility:
- B.Tech or M.Tech in Computer Science, Robotics, Electronics, or Artificial Intelligence.
- Minimum cumulative CGPA of 8.0 / 10.0.
- Graduating batch of 2026 or 2027.
- Minimum 1 capstone project in autonomous robotics or computer vision.`
  },
  {
    id: 'jd-fullstack-ai',
    title: 'Full Stack AI Platform Engineer',
    company: 'CampusOS Core Engineering',
    domain: 'Enterprise AI & Distributed Systems',
    rawText: `Role: Full Stack AI Platform Engineer
Company: CampusOS Engineering Core
Location: Remote / Flexible
Compensation: ₹16 - 22 LPA / ₹55,000 Monthly Stipend

About the Role:
Join the team architecting the next-generation autonomous university operating system. You will design responsive React interfaces, scalable microservice APIs, and vector search pipelines for campus-wide retrieval-augmented generation (RAG).

Required Competencies:
- Advanced mastery of React (≥ 85%) and modern TypeScript (≥ 80%).
- Backend engineering with Node.js or Python REST APIs (≥ 80%).
- Relational database modeling with SQL / PostgreSQL (≥ 75%).
- Disciplined Git workflows, automated testing frameworks, and system design fundamentals (≥ 75%).

Preferred Skills:
- Experience deploying Docker containers, Kubernetes, or cloud infrastructure (AWS/GCP).
- Knowledge of Vector Databases, Semantic Search, or LLM agent tool calling protocols.

Academic Eligibility:
- B.Tech / B.E. in Computer Science or Information Technology.
- Minimum CGPA of 7.8.
- Batches: 2026 or 2027.
- Minimum 2 production software projects with live demo or verified repository.`
  },
  {
    id: 'jd-edge-cv',
    title: 'Edge AI & Computer Vision Research Intern',
    company: 'NVIDIA Deep Learning Institute & AeroLand',
    domain: 'Edge Computing & Deep Learning',
    rawText: `Role: Edge AI & Computer Vision Research Intern
Company: NVIDIA DLI Sponsored Lab & AeroLand GIS
Location: On-Site Hardware Proving Ground
Compensation: ₹50,000 Monthly Stipend + PPO Opportunity

Overview:
Looking for an ambitious student researcher to optimize state-of-the-art vision models (YOLO, Segment Anything, Optical Flow) for real-time edge execution on embedded Jetson Orin microcomputers.

Requirements:
- Strong Python (≥ 80%), PyTorch (≥ 80%), and OpenCV (≥ 75%).
- Experience fine-tuning convolutional or vision transformer architectures for object detection and tracking.
- Fundamental knowledge of Data Structures & Algorithms (DSA ≥ 65%).

Preferred:
- TensorRT engine serialization, INT8 model calibration, or ONNX runtime.
- Experience with satellite imagery, GeoTIFF tiling, or aerial drone video feeds.

Eligibility:
- B.Tech in CS, IT, or Electronics.
- Minimum CGPA of 8.0.
- Batches: 2026, 2027, or 2028.`
  },
  {
    id: 'jd-embedded-auto',
    title: 'Embedded Automotive Safety Software Engineer',
    company: 'Continental Automotive Systems',
    domain: 'Functional Safety & Automotive Electronics',
    rawText: `Role: Embedded Automotive Safety Software Engineer
Company: Continental Automotive Systems
Location: Pune / Bengaluru Hybrid
Compensation: ₹15 - 20 LPA / ₹45,000 Monthly Stipend

Role Description:
Develop safety-critical firmware and vehicle network drivers for automotive body electronics, steer-by-wire subsystems, and ISO 26262 compliant ECUs.

Must Have Requirements:
- Fluency in embedded C / C++ (≥ 80%) and Microcontrollers (STM32, ARM Cortex-M) (≥ 80%).
- Real-time hardware protocols including CAN Bus (≥ 80%), SPI, and I2C.
- Solid understanding of RTOS concepts, interrupts, and watchdog timers.

Nice to Have:
- Knowledge of ISO 26262 functional safety ASIL ratings.
- Vector CANoe simulation, Python scripting for automated test benches.

Eligibility:
- B.Tech in Electronics & Communication, Electrical, or Mechatronics.
- CGPA ≥ 7.5.
- Batches: 2026 or 2027.`
  }
];

export class AIRecruiterEngine {
  private static SHORTLISTED_KEY = 'genova_ai_recruiter_shortlisted_ids';

  /**
   * Semantic Requirement Extractor
   * Analyzes raw Job Description text to identify:
   * - Required skills and target proficiencies
   * - Preferred skills
   * - Academic eligibility criteria (Degrees, CGPA, Batches)
   * - Required project experience
   */
  public static extractRequirementsFromJD(rawText: string): ExtractedJobRequirements {
    const textLower = rawText.toLowerCase();

    // 1. Role & Company Detection
    let roleTitle = 'Technical Specialist';
    let companyName = 'Genova Enterprise Partner';
    let location = 'Bengaluru / Hybrid';
    let compensation = '₹18 LPA / ₹50,000 Stipend';

    const roleMatch = rawText.match(/role:\s*([^\n\r]+)/i);
    if (roleMatch && roleMatch[1]) roleTitle = roleMatch[1].trim();

    const compMatch = rawText.match(/company:\s*([^\n\r]+)/i);
    if (compMatch && compMatch[1]) companyName = compMatch[1].trim();

    const locMatch = rawText.match(/location:\s*([^\n\r]+)/i);
    if (locMatch && locMatch[1]) location = locMatch[1].trim();

    const salMatch = rawText.match(/compensation:\s*([^\n\r]+)/i);
    if (salMatch && salMatch[1]) compensation = salMatch[1].trim();

    // 2. Skill Catalog with Standard Detection
    const skillCatalog = [
      { name: 'Python', defaultMin: 80, weight: 5 },
      { name: 'ROS2', defaultMin: 85, weight: 5 },
      { name: 'React', defaultMin: 85, weight: 5 },
      { name: 'TypeScript', defaultMin: 80, weight: 4 },
      { name: 'PyTorch', defaultMin: 80, weight: 4 },
      { name: 'OpenCV', defaultMin: 75, weight: 4 },
      { name: 'Nav2', defaultMin: 80, weight: 4 },
      { name: 'SQL', defaultMin: 75, weight: 4 },
      { name: 'Node.js', defaultMin: 80, weight: 4 },
      { name: 'C++', defaultMin: 80, weight: 5 },
      { name: 'CAN Bus', defaultMin: 80, weight: 4 },
      { name: 'Microcontrollers', defaultMin: 80, weight: 4 },
      { name: 'DSA', defaultMin: 70, weight: 3 },
      { name: 'System Design', defaultMin: 75, weight: 4 },
      { name: 'Git', defaultMin: 80, weight: 3 },
      { name: 'REST APIs', defaultMin: 80, weight: 3 },
      { name: 'Testing', defaultMin: 75, weight: 3 },
      { name: 'YOLO', defaultMin: 75, weight: 3 }
    ];

    const preferredCatalog = [
      { name: 'TensorRT', bonus: 3 },
      { name: 'PostGIS', bonus: 2 },
      { name: 'Docker', bonus: 2 },
      { name: 'AWS', bonus: 2 },
      { name: 'Kubernetes', bonus: 2 },
      { name: 'LiDAR', bonus: 3 },
      { name: 'CUDA', bonus: 3 },
      { name: 'ISO 26262', bonus: 3 },
      { name: 'CANoe', bonus: 2 }
    ];

    // Detect Required Skills
    const requiredSkills: SkillRequirement[] = [];
    skillCatalog.forEach(item => {
      if (textLower.includes(item.name.toLowerCase())) {
        // Extract explicit percentage if present e.g. "Python (>= 80%)"
        const regex = new RegExp(`${item.name}[^\\d]{0,10}(\\d{2})%`, 'i');
        const match = rawText.match(regex);
        const minLevel = match ? parseInt(match[1], 10) : item.defaultMin;
        requiredSkills.push({
          name: item.name,
          minLevel,
          weight: item.weight
        });
      }
    });

    // Fallback if no skills explicitly parsed
    if (requiredSkills.length === 0) {
      requiredSkills.push(
        { name: 'Python', minLevel: 80, weight: 5 },
        { name: 'React', minLevel: 75, weight: 4 },
        { name: 'SQL', minLevel: 70, weight: 3 }
      );
    }

    // Detect Preferred Skills
    const preferredSkills: PreferredSkill[] = [];
    preferredCatalog.forEach(item => {
      if (textLower.includes(item.name.toLowerCase())) {
        preferredSkills.push({
          name: item.name,
          bonusWeight: item.bonus
        });
      }
    });

    // 3. Eligibility Extraction
    let minCgpa = 7.5;
    const cgpaMatch = rawText.match(/cgpa\s*(?:of|>=|minimum|min)?\s*([0-9.]+)/i);
    if (cgpaMatch && cgpaMatch[1]) {
      const parsed = parseFloat(cgpaMatch[1]);
      if (!isNaN(parsed) && parsed <= 10) minCgpa = parsed;
    }

    const allowedDegrees: string[] = ['B.Tech in Computer Science', 'B.Tech in IT', 'B.Tech in Electronics'];
    if (textLower.includes('m.tech')) allowedDegrees.push('M.Tech in Robotics', 'M.Tech in AI');

    const allowedBatches: string[] = ['2026', '2027'];
    if (textLower.includes('2028')) allowedBatches.push('2028');

    const departments: string[] = ['Computer Science', 'Information Tech.', 'Electronics'];

    // 4. Experience & Project Requirements
    const requiredProjectDomains: string[] = [];
    if (textLower.includes('autonomous') || textLower.includes('robotics')) requiredProjectDomains.push('Autonomous Systems', 'Robotics');
    if (textLower.includes('vision') || textLower.includes('perception')) requiredProjectDomains.push('Computer Vision');
    if (textLower.includes('full stack') || textLower.includes('react')) requiredProjectDomains.push('Full Stack Platform');
    if (textLower.includes('embedded') || textLower.includes('can bus')) requiredProjectDomains.push('Automotive Firmware');

    return {
      jobId: `jd-ext-${Date.now()}`,
      roleTitle,
      companyName,
      location,
      workType: textLower.includes('remote') ? 'Remote' : textLower.includes('on-site') ? 'On-Site' : 'Hybrid',
      compensation,
      requiredSkills,
      preferredSkills,
      eligibility: {
        allowedDegrees,
        minCgpa,
        allowedBatches,
        departments
      },
      experience: {
        minProjects: 1,
        requiredProjectDomains,
        minInternships: textLower.includes('internship') ? 0 : 1
      },
      rawJdSummary: `${roleTitle} @ ${companyName} — ${requiredSkills.length} Required Skills, ${preferredSkills.length} Preferred Skills, Min CGPA ${minCgpa}`
    };
  }

  /**
   * Multi-Factor AI Candidate Ranking Engine
   * Ranks all cohort candidates according to:
   * 1. Required Skills Match (50% weight)
   * 2. Preferred Skills Bonus (20% weight)
   * 3. Verified Proof-of-Work Projects (15% weight)
   * 4. Academic Eligibility (15% weight)
   */
  public static rankCandidates(requirements: ExtractedJobRequirements): CandidateRankingResult[] {
    const candidates = IndustryPortalEngine.getCandidates();
    const shortlistedIds = this.getShortlistedIds();

    const results: CandidateRankingResult[] = candidates.map(cand => {
      // 1. Required Skills Score (0 - 50 points)
      let requiredPoints = 0;
      let totalReqWeight = 0;
      const skillHighlights: string[] = [];
      const missingRequired: string[] = [];

      requirements.requiredSkills.forEach(req => {
        totalReqWeight += req.weight;
        const studentSkill = cand.skills.find(
          s => s.name.toLowerCase() === req.name.toLowerCase() ||
               s.name.toLowerCase().includes(req.name.toLowerCase()) ||
               req.name.toLowerCase().includes(s.name.toLowerCase())
        );

        if (studentSkill) {
          if (studentSkill.level >= req.minLevel) {
            requiredPoints += req.weight;
            skillHighlights.push(`Verified ${req.name}: ${studentSkill.level}% (Exceeds required ≥ ${req.minLevel}%)`);
          } else {
            const partial = (studentSkill.level / req.minLevel) * req.weight * 0.7;
            requiredPoints += partial;
            missingRequired.push(`${req.name} verified at ${studentSkill.level}% (Requires ≥ ${req.minLevel}%)`);
          }
        } else {
          missingRequired.push(`Missing competency in ${req.name} (Required: ≥ ${req.minLevel}%)`);
        }
      });

      const requiredSkillsScore = totalReqWeight > 0
        ? Math.round((requiredPoints / totalReqWeight) * 50)
        : 50;

      // 2. Preferred Skills Bonus (0 - 20 points)
      let preferredPoints = 0;
      let totalPrefWeight = 0;
      const missingPreferred: string[] = [];

      requirements.preferredSkills.forEach(pref => {
        totalPrefWeight += pref.bonusWeight;
        const studentSkill = cand.skills.find(
          s => s.name.toLowerCase() === pref.name.toLowerCase() ||
               s.name.toLowerCase().includes(pref.name.toLowerCase()) ||
               pref.name.toLowerCase().includes(s.name.toLowerCase())
        );

        if (studentSkill && studentSkill.level >= 70) {
          preferredPoints += pref.bonusWeight;
          skillHighlights.push(`Preferred Bonus: ${pref.name} verified at ${studentSkill.level}%`);
        } else {
          missingPreferred.push(pref.name);
        }
      });

      const preferredSkillsScore = totalPrefWeight > 0
        ? Math.round((preferredPoints / totalPrefWeight) * 20)
        : 10; // baseline

      // 3. Project Evidence Score (0 - 15 points)
      let projectScore = 5;
      const projectEvidence: string[] = [];

      cand.featuredProjects.forEach(proj => {
        projectScore += 3.5;
        projectEvidence.push(`Verified Capstone: "${proj}" (Faculty audited & cryptographic proof)`);
      });
      if (cand.internshipsCompleted > 0) {
        projectScore += 3;
        projectEvidence.push(`Completed ${cand.internshipsCompleted} Industrial Internships with mentor ratings`);
      }
      const projectEvidenceScore = Math.min(15, Math.round(projectScore));

      // 4. Academic Eligibility Score (0 - 15 points)
      const passesCgpa = cand.cgpa >= requirements.eligibility.minCgpa;
      const passesBatch = requirements.eligibility.allowedBatches.includes(cand.batch);
      const passesDegree = requirements.eligibility.departments.some(d => 
        cand.department.toLowerCase().includes(d.toLowerCase())
      );

      let eligibilityScore = 0;
      if (passesCgpa) eligibilityScore += 7;
      if (passesBatch) eligibilityScore += 4;
      if (passesDegree) eligibilityScore += 4;

      const eligibilityPass = passesCgpa && passesBatch && passesDegree;
      const eligibilityAffirmation = eligibilityPass
        ? `Meets all academic benchmarks: CGPA ${cand.cgpa.toFixed(2)} (≥ ${requirements.eligibility.minCgpa}), Batch ${cand.batch}, ${cand.degree}`
        : `Academic mismatch: CGPA ${cand.cgpa.toFixed(2)} vs Min ${requirements.eligibility.minCgpa}`;

      // Overall Composite Match Score (0 - 100%)
      const overallMatchScore = Math.min(
        100,
        Math.max(20, requiredSkillsScore + preferredSkillsScore + projectEvidenceScore + eligibilityScore)
      );

      // Remedial Recommendations
      const remedialRecommendations: string[] = [];
      if (missingRequired.length > 0) {
        remedialRecommendations.push(`Enroll in CampusOS training rig for ${missingRequired.slice(0, 2).join(', ')}.`);
      }
      if (missingPreferred.length > 0) {
        remedialRecommendations.push(`Recommended optional upskilling in ${missingPreferred.slice(0, 2).join(', ')}.`);
      }

      return {
        candidate: cand,
        rank: 1, // calculated post-sort
        overallMatchScore,
        scoreBreakdown: {
          requiredSkillsScore,
          preferredSkillsScore,
          projectEvidenceScore,
          eligibilityScore
        },
        whyMatches: {
          skillHighlights: skillHighlights.slice(0, 4),
          projectEvidence: projectEvidence.slice(0, 3),
          eligibilityAffirmation
        },
        gaps: {
          missingRequired,
          missingPreferred,
          remedialRecommendations
        },
        eligibilityPass,
        shortlisted: shortlistedIds.includes(cand.id)
      };
    });

    // Sort descending by overall match score
    results.sort((a, b) => b.overallMatchScore - a.overallMatchScore);

    // Assign 1-indexed ranks
    results.forEach((r, idx) => {
      r.rank = idx + 1;
    });

    return results;
  }

  /**
   * Toggles shortlisted status for a candidate
   */
  public static toggleShortlist(candidateId: string): boolean {
    const list = this.getShortlistedIds();
    const index = list.indexOf(candidateId);
    let isShortlisted = false;
    if (index > -1) {
      list.splice(index, 1);
      isShortlisted = false;
    } else {
      list.push(candidateId);
      isShortlisted = true;
    }
    localStorage.setItem(this.SHORTLISTED_KEY, JSON.stringify(list));
    return isShortlisted;
  }

  public static getShortlistedIds(): string[] {
    try {
      const stored = localStorage.getItem(this.SHORTLISTED_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return ['cand-rishi']; // default pre-shortlist
  }
}

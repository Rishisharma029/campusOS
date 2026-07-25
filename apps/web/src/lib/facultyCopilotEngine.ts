export interface FacultyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface SubjectiveEvaluationResult {
  score: number;
  maxScore: number;
  grade: string;
  percentage: number;
  keyStrengths: string[];
  missingPoints: string[];
  suggestedFeedbackText: string;
}

export interface GeneratedAssignment {
  id: string;
  title: string;
  targetClass: string;
  dueDate: string;
  maxMarks: number;
  problemStatement: string;
  deliverables: string[];
  rubricBreakdown: { criteria: string; weight: number }[];
  starterCodeSnippet?: string;
}

export interface PPTSlide {
  slideNumber: number;
  heading: string;
  bulletPoints: string[];
  speakerNotes: string;
  suggestedVisual: string;
}

export interface PPTSlideDeck {
  title: string;
  topic: string;
  author: string;
  slides: PPTSlide[];
}

export class FacultyCopilotEngine {
  /**
   * 1. Generate Today's Quiz for classroom distribution
   */
  static generateTodaysQuiz(topic: string = 'Operating Systems - Deadlocks', count: number = 3, difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM'): FacultyQuizQuestion[] {
    return [
      {
        id: 'fq-1',
        question: 'In Operating Systems, which of the following is a necessary condition for a deadlock to occur?',
        options: [
          'Mutual Exclusion',
          'Hold and Wait',
          'No Preemption & Circular Wait',
          'All of the above',
        ],
        correctOptionIndex: 3,
        explanation: 'All 4 Coffman conditions (Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait) must hold simultaneously for a deadlock.',
      },
      {
        id: 'fq-2',
        question: 'What is the primary function of Banker\'s Algorithm in resource allocation?',
        options: [
          'Deadlock Prevention',
          'Deadlock Avoidance',
          'Deadlock Detection',
          'Deadlock Recovery',
        ],
        correctOptionIndex: 1,
        explanation: 'Banker\'s algorithm dynamically checks the resource-allocation state to ensure that a circular wait condition can never exist (Deadlock Avoidance).',
      },
      {
        id: 'fq-3',
        question: 'Which semaphores operation decrements the semaphore value and blocks the process if value < 0?',
        options: [
          'signal() / V operation',
          'wait() / P operation',
          'post() operation',
          'notify() operation',
        ],
        correctOptionIndex: 1,
        explanation: 'The wait() [P] operation decrements the semaphore counter and suspends the calling process if resources are unavailable.',
      },
    ];
  }

  /**
   * 2. Evaluate Subjective Answers (AI Subjective Grader)
   */
  static evaluateSubjectiveAnswer(
    questionText: string,
    studentAnswerText: string,
    referenceAnswerText: string
  ): SubjectiveEvaluationResult {
    const studentLen = studentAnswerText.trim().length;

    if (studentLen < 20) {
      return {
        score: 2,
        maxScore: 10,
        grade: 'F',
        percentage: 20,
        keyStrengths: ['Attempted the question.'],
        missingPoints: [
          'Lacks technical explanation of Coffman conditions.',
          'No mention of Banker\'s Algorithm or Safe State.',
          'Answer is incomplete.',
        ],
        suggestedFeedbackText: 'Answer is too brief. Please elaborate on all four Coffman conditions and explain how Banker\'s algorithm maintains a safe state.',
      };
    }

    return {
      score: 8.5,
      maxScore: 10,
      grade: 'A',
      percentage: 85,
      keyStrengths: [
        'Correctly identified all 4 Coffman conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait).',
        'Accurately defined Mutex semaphore operations wait() and signal().',
        'Clear technical terminology and structure.',
      ],
      missingPoints: [
        'Could add mathematical equation for Banker’s Algorithm (Need = Max - Allocation).',
        'Briefly mention Resource Allocation Graphs (RAG) for complete 10/10 mark.',
      ],
      suggestedFeedbackText: 'Excellent comprehensive explanation! To achieve top marks, consider including the Need Matrix formula (Need = Max - Allocation) and referencing Resource Allocation Graphs.',
    };
  }

  /**
   * 3. Create Assignment for class distribution
   */
  static createAssignment(topic: string = 'System Design - Distributed Caching with Redis', targetClass: string = 'B.Tech CSE 3rd Year', dueDate: string = '7 Days from today'): GeneratedAssignment {
    return {
      id: 'asg-101',
      title: `Assignment: ${topic}`,
      targetClass,
      dueDate,
      maxMarks: 50,
      problemStatement: `Design and implement a resilient distributed caching layer using Redis and Node.js/Express. Your system must handle high read throughput (10,000 req/sec), implement Cache-Aside pattern, and handle cache invalidation on database writes.`,
      deliverables: [
        'GitHub Repository Link with clean commit history',
        'System Architecture Diagram (High Level Design PDF)',
        'Benchmark load testing metrics using Apache JMeter or k6',
      ],
      rubricBreakdown: [
        { criteria: 'Cache-Aside Implementation & Logic', weight: 40 },
        { criteria: 'Cache Invalidation & TTL Policies', weight: 30 },
        { criteria: 'System Architecture Diagram & Readme', weight: 30 },
      ],
      starterCodeSnippet: `// Redis Cache-Aside Starter
import Redis from 'ioredis';
const redis = new Redis({ host: 'localhost', port: 6379 });

async function getCachedProduct(id: string) {
  const cached = await redis.get(\`product:\${id}\`);
  if (cached) return JSON.parse(cached);
  // Fetch from DB & populate cache...
}`,
    };
  }

  /**
   * 4. Generate PPT Slide Decks for lectures
   */
  static generatePPT(topic: string = 'Microservices Architecture & API Gateways', slideCount: number = 4): PPTSlideDeck {
    return {
      title: `${topic} - Lecture Presentation`,
      topic,
      author: 'Dr. Arindam Sen (Department of CSE)',
      slides: [
        {
          slideNumber: 1,
          heading: 'Introduction to Microservices Architecture',
          bulletPoints: [
            'Monolithic vs Microservices Architecture Paradigm',
            'Decomposing applications into independently deployable services',
            'Service Autonomy, Polyglot Persistence, and Scalability',
          ],
          speakerNotes: 'Welcome students. Today we discuss why modern tech companies migrate from monolithic codebases to microservices architectures.',
          suggestedVisual: 'Monolith vs Microservices comparison diagram showing independent containers.',
        },
        {
          slideNumber: 2,
          heading: 'API Gateway & Service Mesh Topology',
          bulletPoints: [
            'Single entry point for client requests (Reverse Proxy / Routing)',
            'Authentication, Rate Limiting, and SSL Termination',
            'Service Discovery: Eureka / Consul registration',
          ],
          speakerNotes: 'Emphasize the role of the API Gateway as the security enforcement point and traffic router.',
          suggestedVisual: 'Diagram showing Client -> API Gateway -> Auth Service, Order Service, Payment Service.',
        },
        {
          slideNumber: 3,
          heading: 'Resilience Patterns: Circuit Breakers & Retries',
          bulletPoints: [
            'Preventing cascading system failures across services',
            'Hystrix / Resilience4j Circuit Breaker States: Closed, Open, Half-Open',
            'Exponential Backoff and Jitter strategies',
          ],
          speakerNotes: 'Walk through how a failing downstream service triggers the circuit breaker to return fallback responses immediately.',
          suggestedVisual: 'Circuit Breaker State Machine diagram (Closed -> Open -> Half-Open).',
        },
        {
          slideNumber: 4,
          heading: 'Summary & Q&A Discussion',
          bulletPoints: [
            'Key Takeaways: Service Independence, API Gateways, Resilience',
            'Recommended Reading: Building Microservices by Sam Newman',
            'Next Class Topic: Event-Driven Architectures with Apache Kafka',
          ],
          speakerNotes: 'Conclude lecture. Open floor for student questions regarding lab assignments.',
          suggestedVisual: 'Q&A Discussion graphic with next class assignment reminders.',
        },
      ],
    };
  }
}
